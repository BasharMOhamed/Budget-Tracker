import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandInput,
} from "./ui/command";
import { Check } from "lucide-react";
import { ChevronsUpDown, SquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import CreateCategoryDialog from "./CreateCategoryDialog";
export default function CategoryPicker({ type, onChange }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categoriesQuery.data?.find(
    (category) => category.name === value
  );

  const successCallback = useCallback(
    (category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setOpen, setValue]
  );

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Category..." />
          <CreateCategoryDialog
            type={type}
            onSuccessCallback={successCallback}
            trigger={
              <Button
                variant="outline"
                className="bg-transparent justify-start text-muted-foreground"
              >
                <SquarePlus />
                Create new
              </Button>
            }
          />
          <CommandList>
            <CommandEmpty>
              Category not found
              <p className="text-muted-foreground text-xs">
                Tip: Create a new category
              </p>
            </CommandEmpty>
            <CommandGroup>
              {categoriesQuery.data &&
                categoriesQuery.data.map((category) => (
                  <CommandItem
                    key={category.name}
                    value={category.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);

                      setOpen(false);
                    }}
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "ml-auto",
                        value === category.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CategoryRow({ category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
