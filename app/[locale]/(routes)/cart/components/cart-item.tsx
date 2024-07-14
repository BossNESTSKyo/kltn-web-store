"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { InputNumber } from "antd";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import CurrencyVN from "@/components/ui/currency-vn";

import { cn } from "@/lib/utils";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";

interface CartItemProps {
  data: Product;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();
  const locale = useLocale();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const cartItem = cart.items.find((item) => item.id === data.id);
    if (cartItem) {
      setQuantity(cartItem.quantity ? cartItem.quantity : 1);
    }
  }, [cart.items, data.id]);

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const handleChangeValue = (value: number | null) => {
    if (value === null) {
      value = 1;
    }
    setQuantity(value);
    cart.updateQuantity(data.id, value);
  };

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">{data.name}</p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.color.name}</p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
              {data.size.name}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {data.isDiscounted && (
              <div className="text-red-500 text-lg">
                {locale === "vi" ? (
                  <CurrencyVN value={data?.priceVNDiscount} />
                ) : (
                  <Currency value={data?.priceDiscount} />
                )}
              </div>
            )}
            <div
              className={cn(
                data.isDiscounted && "text-sm line-through text-gray-400"
              )}
            >
              {locale === "vi" ? (
                <CurrencyVN value={data?.priceVN} />
              ) : (
                <Currency value={data?.price} />
              )}
            </div>
          </div>
          <div className="mt-1">
            <InputNumber
              min={1}
              max={data.amount}
              value={quantity}
              onChange={handleChangeValue}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
