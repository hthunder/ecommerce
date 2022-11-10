import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { ICartProduct } from "../../types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // console.log(req.body);

    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          { shipping_rate: "shr_1M2JigGJ2lxVEHtlSqVjcDGB" },
          { shipping_rate: "shr_1M2JjRGJ2lxVEHtlcFpZHfEv" },
        ],
        line_items: req.body.cartItems.map((item: ICartProduct) => {
          const img = item.image[0].asset._ref;
          const newImage = img
            .replace(
              "image-",
              "https://cdn.sanity.io/images/v95r2ulx/production/"
            )
            .replace("-webp", ".webp");

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
                images: [newImage],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          };
        }),
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      };

      // Create Checkout Sessions from body params.
      const session: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal Server Error";
      res.status(500).json({ message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
