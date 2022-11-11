import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../../lib/client";
import { ICartProduct, IProduct } from "../../types";

// TODO добавить обработку ошибок
// TODO Добавить сюда создание заказа и отправку номера заказа в юмани
// TODO Подумать над ключом идемпотентности

type Data = {
  confirmation_url?: string;
  message?: string;
};

const calcTotal = async (cart: ICartProduct[]) => {
  const queryIds = cart.map((item) => `"${item._id}"`).join(", ");
  const query = `*[_type == "product" && _id in [${queryIds}]]`;
  const products: IProduct[] = await client.fetch(query);

  return cart.reduce((acc, cartItem) => {
    const foundProduct = products.find(
      (product) => product._id === cartItem._id
    );

    return acc + foundProduct?.price! * cartItem.quantity;
  }, 0);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {
    if (req.method === "POST") {
      const total = await calcTotal(req.body);

      const data = {
        amount: {
          currency: "RUB",
          value: total,
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: `${req.headers.origin}/success`,
        },
      };

      const config = {
        auth: {
          username: "957270",
          password: process.env.UKASSA_SECRET_KEY!,
        },
        headers: {
          "Idempotence-Key": uuidv4(),
        },
      };

      const apiResponse = await axios.post<{
        confirmation: {
          confirmation_url: string;
        };
      }>("https://api.yookassa.ru/v3/payments", data, config);

      res.status(200).json({
        confirmation_url: apiResponse.data.confirmation.confirmation_url,
      });
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
}
