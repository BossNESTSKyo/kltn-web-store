"use client";

import qs from "qs";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";

function sortObject(obj: any) {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const ResultPage = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const secureHash = searchParams.get("vnp_SecureHash");

    const queryParams: any = {};
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    delete queryParams["orderId"];
    delete queryParams["vnp_SecureHash"];
    delete queryParams["vnp_SecureHashType"];

    const sortedParams = sortObject(queryParams);

    const secretKey = "QUKDKKNOATQJURXAADEBNAZDBMVVOSPF";

    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = CryptoJS.HmacSHA512(signData, secretKey);
    const signed = hmac.toString(CryptoJS.enc.Hex);

    if (secureHash === signed) {
      // Xử lý update amount cho table Product
      updateAmount(orderId);

      redirect(`/cart?success=1`);
    } else {
      redirect(`/cart?canceled=1`);
    }
  }, [searchParams]);

  const updateAmount = async (orderId: any) => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkvnpay`, {
      orderId,
    });
  };

  return null;
};

export default ResultPage;
