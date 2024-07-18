import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  genderType?: string;
  colorId?: string;
  sizeId?: string;
  minPrice?: string;
  maxPrice?: string;
  isFeatured?: boolean;
  isNewed?: boolean;
  isDiscounted?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      genderType: query.genderType,
      colorId: query.colorId,
      sizeId: query.sizeId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
      isNewed: query.isNewed,
      isDiscounted: query.isDiscounted,
    },
  });

  const res = await fetch(url);

  return res.json();
};

export default getProducts;
