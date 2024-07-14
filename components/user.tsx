"use client";

import axios from "axios";
import { useEffect } from "react";

import getCurrentUser from "@/actions/get-current-user";

const UserPage = () => {
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      initData();
    }
  }, []);

  const initData = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user`,
      {
        user,
      }
    );
  };

  return null;
};

export default UserPage;
