import { ICartProduct } from "../types";

export class PaymentService {
  private rootUrl: string;

  constructor(rootUrl: string) {
    this.rootUrl = rootUrl;
  }

  async create(products: ICartProduct[]) {
    const response = await fetch(this.rootUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
    });

    const responseData = await response.json();
    return responseData.confirmation_url;
  }
}
