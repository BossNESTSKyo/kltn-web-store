"use client";

import { Select } from "antd";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";

import { Product } from "@/types";

interface PaginationPageProps {
  products: Product[];
  category: any;
}

const PaginationPage: React.FC<PaginationPageProps> = ({
  products,
  category,
}) => {
  const t = useTranslations("Category");
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(listProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setListProducts(products);
  }, [products]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentProducts = listProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (value: string) => {
    let filteredProducts: Product[] = [];

    if (value === "basic") {
      filteredProducts = products;
    } else if (value === "new") {
      filteredProducts = products.filter((item) => item.isNewed === true);
    } else if (value === "hot") {
      filteredProducts = products.filter((item) => item.isFeatured === true);
    } else if (value === "discount") {
      filteredProducts = products.filter((item) => item.isDiscounted === true);
    } else if (value === "priceInc") {
      filteredProducts = [...products].sort(
        (a: any, b: any) => a.price - b.price
      );
    } else if (value === "priceDec") {
      filteredProducts = [...products].sort(
        (a: any, b: any) => b.price - a.price
      );
    }

    setListProducts(filteredProducts);
    setCurrentPage(1);
  };

  return (
    <div className="mt-6 lg:col-span-4 lg:mt-0">
      <div className="flex justify-between mb-4">
        <div className="text-2xl font-bold">
          {t("title")} <span>{category.name.toUpperCase()}</span>
        </div>
        <div className="flex gap-2 items-center">
          <div>{t("sort")}: </div>
          <Select
            defaultValue="basic"
            style={{
              width: 180,
            }}
            onChange={handleChange}
            options={[
              {
                value: "basic",
                label: t("default"),
              },
              {
                value: "priceInc",
                label: t("price-increase"),
              },
              {
                value: "priceDec",
                label: t("price-decrease"),
              },
              {
                value: "new",
                label: t("new"),
              },
              {
                value: "hot",
                label: t("hot"),
              },
              {
                value: "discount",
                label: t("discount"),
              },
            ]}
          />
        </div>
      </div>
      {listProducts.length === 0 ? (
        <NoResults />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentProducts.map((item) => (
              <ProductCard key={item.id} data={item} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(Math.max(currentPage - 1, 1));
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(index + 1);
                      }}
                      isActive={index === currentPage - 1 ? true : false}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(Math.min(currentPage + 1, totalPages));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginationPage;
