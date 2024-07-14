"use client";

import React from "react";
import { useTranslations } from "next-intl";

import Rating from "@/components/ui/rating";

interface ReviewDisplayProps {
  data: any;
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ data }) => {
  const t = useTranslations("InfoProduct");

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center mt-3">
          <Rating rating={data.rating} setRating={null} />
          <div className="text-sm text-gray-500">
            {new Date(data.createdAt).toLocaleString()}
          </div>
        </div>
        <div>{data.content}</div>
        <div className="text-sm text-gray-500">
          {t("post")} {data.userName}
        </div>
      </div>
      <div className="border-b border-black mt-5" />
    </div>
  );
};

export default ReviewDisplay;
