import { useUser } from "@clerk/nextjs";

const getCurrentUser = () => {
  const { user } = useUser();

  return user ? user : "";
};

export default getCurrentUser;
