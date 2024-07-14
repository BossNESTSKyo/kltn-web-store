"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import Currency from "@/components/ui/currency";
import CurrencyVN from "@/components/ui/currency-vn";

import { cn } from "@/lib/utils";

interface CartItemProps {
  data: any;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const t = useTranslations("Profile");
  const locale = useLocale();

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-24 sm:w-24">
        <Image
          fill
          src={data.product.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-md font-semibold text-black">
              {data.product.name}
            </p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.color.name}</p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
              {data.size.value}
            </p>
          </div>

          <div className="mt-1">
            <p className="text-md">
              {t("order.quantity")}: {data.quantity}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {data.isDiscounted && (
              <div className="text-red-500 text-md">
                {locale === "vi" ? (
                  <CurrencyVN value={data?.product.priceVNDiscount} />
                ) : (
                  <Currency value={data?.product.priceDiscount} />
                )}
              </div>
            )}
            <div
              className={cn(
                data.isDiscounted && "text-sm line-through text-gray-400"
              )}
            >
              {locale === "vi" ? (
                <CurrencyVN value={data?.product.priceVN} />
              ) : (
                <Currency value={data?.product.price} />
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
