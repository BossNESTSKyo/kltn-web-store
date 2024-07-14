import Link from "next/link";

import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import getProducts from "@/actions/get-products";

const Navbar = async () => {
  const categories = await getCategories();
  const products = await getProducts({});

  return (
    <div className="border-b fixed top-0 left-0 right-0 z-50 bg-white">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">STORE</p>
          </Link>
          <MainNav data={categories} />
          <NavbarActions data={products} />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
