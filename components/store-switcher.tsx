"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button-shadcn";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product } from "@/types";
import ListItemSearch from "@/components/list-item-search";
import { useTranslations } from "next-intl";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  //items: Record<string, any>[];
  items: any[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const t = useTranslations("Navbar");
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (searchQuery === "") {
      return items;
    } else {
      const filterList = items.filter((item: Product) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      return filterList;
    }
  }, [searchQuery, items]);

  const handleClick = (product: Product) => {
    setOpen(false);
    router.push(`/product/${product.id}`);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Search"
          className={cn("rounded-full border-black", className)}
        >
          <Search size={20} />
          <span className="ml-1 text-sm font-medium">{t("search")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-white">
        <Command>
          <CommandList>
            <CommandInput
              placeholder="Search shoes..."
              value={searchQuery}
              onValueChange={(value: string) => handleInputChange(value)}
            />
            <CommandGroup>
              <ul>
                {searchResults.length === 0 ? (
                  <CommandItem>
                    <li className="py-1 text-center">No products found!</li>
                  </CommandItem>
                ) : (
                  searchResults.map((item) => (
                    <CommandItem key={item.id}>
                      <ListItemSearch
                        data={item}
                        onClick={() => handleClick(item)}
                      />
                    </CommandItem>
                  ))
                )}
              </ul>
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
