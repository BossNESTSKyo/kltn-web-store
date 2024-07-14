import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/favorite`;

interface Query {
  customerId?: string;
}

const getFavorite = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      customerId: query.customerId,
    },
  });

  const res = await fetch(url);
  return res.json();
};

export default getFavorite;
