"use client";

import { useTranslations } from "next-intl";

import { Product } from "@/types";

import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  const t = useTranslations("Product");

  const chunkArray = (arr: Product[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  };

  const chunkedItems = chunkArray(items, 4);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title ? t(`${title}`) : ""}</h3>
      {items?.length === 0 ? (
        <NoResults />
      ) : (
        <div>
          {items?.length > 4 ? (
            <Carousel className="w-full max-w-full">
              <CarouselContent>
                {chunkedItems.map((chunk: any, index: any) => (
                  <CarouselItem key={index}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {chunk.map((item: any) => (
                        <ProductCard key={item.id} data={item} />
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
