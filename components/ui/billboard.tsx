import { Billboard } from "@/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BillboardProps {
  data: Billboard;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  return (
    <div className="p-8 sm:p-6 lg:p-8 rounded-xl">
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem
              key={index}
              style={{
                backgroundImage: `url(${
                  index === 0
                    ? data?.imageUrl
                    : "/billboard-bg-" + index + ".png"
                })`,
              }}
              className="relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover"
            >
              <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
                <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Billboard;
