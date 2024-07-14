import Image from "next/image";

import Currency from "@/components/ui/currency";
import { Product } from "@/types";

interface CartItemProps {
  data: Product;
  onClick: () => void;
}

const ListItemSearch: React.FC<CartItemProps> = ({ data, onClick }) => {
  return (
    <li
      className="flex py-1 border-b cursor-pointer hover:bg-gray-600 hover:text-white hover:transition w-full"
      onClick={onClick}
    >
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-20 sm:w-20 sm:ml-1">
        <Image
          fill
          src={data.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col sm:ml-6 sm:text-sm gap-2">
        <div className="flex justify-between">
          <p className="font-semibold">{data.name}</p>
        </div>
        <Currency value={data.priceDiscount} />
      </div>
    </li>
  );
};

export default ListItemSearch;
