import { Category } from "./Category";

export type Product = {
  id: number;
  category: Category;
  name: string;
  description: string;
  price: number;
  image: string;
};
