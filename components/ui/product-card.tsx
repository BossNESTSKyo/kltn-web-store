"use client";

import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Expand, ShoppingCart, Heart } from "lucide-react";
import { useEffect, useState, MouseEventHandler } from "react";

import { cn } from "@/lib/utils";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import getCurrentUser from "@/actions/get-current-user";
import usePreviewModal from "@/hooks/use-preview-modal";

import Rating from "@/components/ui/rating";
import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import CurrencyVN from "@/components/ui/currency-vn";

interface ProductCard {
  data: any;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("InfoProduct");

  const [clickHeart, setClickHeart] = useState(false);
  const [ratingArr, setRatingArr] = useState([0, 0, 0, 0, 0]);

  const user = getCurrentUser();

  useEffect(() => {
    fetchIsExist();

    fetchData();
  }, [data]);

  const fetchIsExist = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/favorite/${data.id}?customerId=${
          user ? user.id : ""
        }`
      );

      if (response.data.isExist) {
        setClickHeart(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setClickHeart(false);
    }
  };

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

  const totalRatings = ratingArr.reduce((sum, count) => sum + count, 0);
  const totalPoints = ratingArr.reduce(
    (sum, count, index) => sum + count * (5 - index),
    0
  );

  const averageRating = totalRatings === 0 ? 0 : totalPoints / totalRatings;

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    const { colors, sizes, ...newData } = data;
    const updatedData = {
      ...newData,
      color: {
        name: data.colors.map((color: any) => color.color.name)[0],
        id: data.colors.map((color: any) => color.color.id)[0],
      },
      size: {
        name: data.sizes.map((size: any) => size.size.value)[0],
        id: data.sizes.map((size: any) => size.size.id)[0],
      },
    };

    cart.addItem(updatedData);
  };

  const onClickHeart: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();

    if (user && user.id !== "") {
      if (!clickHeart) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/favorite`, {
          customerId: user ? user.id : "",
          productId: data.id,
        });

        toast.success("Item added to favorite.");
        setClickHeart(true);
      } else {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/favorite/${data.id}`
        );

        toast.success("Item removed from favorite.");
        setClickHeart(false);
      }
    }
  };

  return (
    <div className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
      {/* Image & actions */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          onClick={handleClick}
          src={data.images?.[0]?.url}
          alt=""
          fill
          className="aspect-square object-cover rounded-md"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
            <IconButton
              onClick={onAddToCart}
              icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
          </div>
        </div>
        <div className="absolute z-10 left-0 top-0">
          <div
            className={cn(
              "w-16",
              data.isNewed && "bg-yellow-400",
              data.isFeatured || (data.isDiscounted && "bg-red-500")
            )}
          >
            <p className="text-white text-center">
              {data.isNewed
                ? "New"
                : data.isFeatured
                ? "Hot"
                : "-" + data.perDiscount + "%"}
            </p>
          </div>
        </div>
        <div className="absolute z-10 right-0 top-0">
          <IconButton
            onClick={onClickHeart}
            icon={
              <Heart
                size={15}
                fill={cn(clickHeart ? "red" : "black")}
                strokeWidth={0}
              />
            }
          />
        </div>
      </div>
      {/* Description */}
      <div>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg">{data.name}</p>
          <Rating rating={averageRating} setRating={null} />
        </div>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>
      {/* Price & Reiew */}
      <div className="flex justify-between">
        <div className="flex gap-2">
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
          {t("sell")}: {data.sellAmount}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
