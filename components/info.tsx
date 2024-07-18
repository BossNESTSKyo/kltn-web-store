"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import Rating from "@/components/ui/rating";
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import CurrencyVN from "@/components/ui/currency-vn";

import { cn } from "@/lib/utils";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";

interface InfoProps {
  data: any;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const t = useTranslations("InfoProduct");
  const locale = useLocale();

  const [sizeSelect, setSizeSelect] = useState("");
  const [sizeIdSelect, setSizeIdSelect] = useState("");
  const [colorSelect, setColorSelect] = useState("");
  const [colorIdSelect, setColorIdSelect] = useState("");
  const [ratingArr, setRatingArr] = useState([0, 0, 0, 0, 0]);

  const cart = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const reviews = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/review/${data.id}`
      );

      if (reviews?.data?.data.length > 0) {
        const newRatingArr = [0, 0, 0, 0, 0];

        reviews.data.data.forEach((item: any) => {
          if (item.rating >= 1 && item.rating <= 5) {
            newRatingArr[5 - item.rating] += 1;
          }
        });

        setRatingArr(newRatingArr);
      }
    };

    fetchData();
  }, [data.id]);

  const totalRatings = ratingArr.reduce((sum, count) => sum + count, 0);
  const totalPoints = ratingArr.reduce(
    (sum, count, index) => sum + count * (5 - index),
    0
  );

  const averageRating = totalRatings === 0 ? 0 : totalPoints / totalRatings;

  const onAddToCart = () => {
    if (
      sizeSelect !== "" &&
      colorSelect !== "" &&
      sizeIdSelect !== "" &&
      colorIdSelect !== ""
    ) {
      const { colors, sizes, ...newData } = data;
      const updatedData = {
        ...newData,
        color: { name: colorSelect, id: colorIdSelect },
        size: { name: sizeSelect, id: sizeIdSelect },
      };
      cart.addItem(updatedData);
    } else {
      toast.error("Vui lòng chọn size và color cho sản phẩm.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
        <Rating rating={averageRating} setRating={null} />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="flex gap-2 text-2xl text-gray-900">
          {data.isDiscounted && (
            <div className="text-red-500">
              {locale === "vi" ? (
                <CurrencyVN value={data?.priceVNDiscount} />
              ) : (
                <Currency value={data?.priceDiscount} />
              )}
            </div>
          )}
          <div
            className={cn(
              "flex items-center",
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
        <div className="text-sm text-gray-400 italic">
          Sell: {data?.sellAmount}
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          {data?.sizes &&
            data.sizes.map((size: any, index: any) => {
              return (
                <Button
                  key={index}
                  className={cn(
                    "rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300",
                    sizeSelect === size?.size?.value && "bg-black text-white"
                  )}
                  onClick={() => {
                    setSizeSelect(size?.size?.value);
                    setSizeIdSelect(size.size.id);
                  }}
                >
                  {size?.size?.value}
                </Button>
              );
            })}
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          {data?.colors &&
            data.colors.map((color: any, index: number) => {
              return (
                <div key={index} className="flex items-center">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full hover:cursor-pointer",
                      colorSelect === color?.color?.name
                        ? "border-red-600  border-2"
                        : "border-black border"
                    )}
                    style={{ backgroundColor: color?.color?.value }}
                    onClick={() => {
                      setColorSelect(color?.color?.name);
                      setColorIdSelect(color.color.id);
                    }}
                  />
                </div>
              );
            })}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          {t("add-to-card")}
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
