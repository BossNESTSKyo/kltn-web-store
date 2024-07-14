import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import Slider from "@/components/ui/slider";

import getProducts from "@/actions/get-products";
import getCategory from "@/actions/get-category";
import getSizes from "@/actions/get-sizes";
import getColors from "@/actions/get-colors";

import Filter from "./components/filter";
import MobileFilters from "./components/mobile-filters";
import PaginationPage from "./components/pagination";

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    colorId: string;
    sizeId: string;
    minPrice: string;
    maxPrice: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({
  params,
  searchParams,
}) => {
  const products = await getProducts({
    categoryId: params.categoryId,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
  });
  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(params.categoryId);

  return (
    <div className="bg-white">
      <Container>
        <Billboard data={category.billboard} />
        <div className="px-4 pt-8 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters sizes={sizes} colors={colors} />
            <div className="hidden lg:block">
              <Filter valueKey="sizeId" name="Sizes" data={sizes} />
              <Filter valueKey="colorId" name="Colors" data={colors} />

              <div className="mb-8">
                <h3 className="text-lg font-semibold">Prices</h3>
                <hr className="my-4" />
                <Slider min={1} max={200} minStepsBetweenThumbs={1} step={1} />
              </div>
            </div>
            <PaginationPage products={products} category={category} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
