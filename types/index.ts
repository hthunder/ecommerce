export interface IProduct {
  image: { [key: string]: any }[];
  name: string;
  details: string;
  price: number;
  _id: string;
}

export interface ICartProduct extends IProduct {
  quantity: number;
}
