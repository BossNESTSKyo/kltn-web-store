"use client";

import axios from "axios";
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

import getCurrentUser from "@/actions/get-current-user";

const PaginationPage = () => {
  const t = useTranslations("Profile");
  const user = getCurrentUser();

  const [favoriteList, setFavoriteList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(favoriteList.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/favorite?customerId=${
            user ? user.id : ""
          }`
        );

        setFavoriteList(response.data.data || []);
      } catch (error) {
        console.error("Error fetching favorite data:", error);
        setFavoriteList([]);
      }
    };

    fetchFavorites();
  }, [favoriteList, user]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentProducts = favoriteList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-6 lg:col-span-4 lg:mt-0">
      <div className="text-2xl font-bold mb-2">{t("favorite.title")}</div>
      {favoriteList.length === 0 ? (
        <NoResults />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentProducts.map((item: any) => (
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
