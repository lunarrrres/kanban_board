import { useEffect } from "react";
import { getProducts } from "./api";

export function ProductsComponent() {
  useEffect(() => {
    getProducts().then((res) => console.log(res.data));
  }, []);
}
