export type Product = {
  id: string;
  name: string;
  detail: string;
  pesos: number;
  mark: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "barako",
    name: "Barako pour-over",
    detail: "Batangas liberica, served hot",
    pesos: 180,
    mark: "BK",
  },
  {
    id: "ube",
    name: "Ube crinkle box",
    detail: "Six pieces, baked this morning",
    pesos: 240,
    mark: "UB",
  },
  {
    id: "cold",
    name: "Cold brew bottle",
    detail: "House blend, 350 ml",
    pesos: 150,
    mark: "CB",
  },
  {
    id: "tablea",
    name: "Tablea flight",
    detail: "Three cups, stone-ground cacao",
    pesos: 320,
    mark: "TB",
  },
];

export const OPERATOR_STORAGE_KEY = "paylink.operatorKey";
