"use client";

import { useTranslations } from "next-intl";
import { FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

interface CategorySelectProps {
  categories: CategoryOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

/** Parent categories with their subcategories indented. Must be rendered inside a FormItem. */
export function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
  const t = useTranslations("prompts");

  return (
    <Select onValueChange={(next) => onChange(next === "__none__" ? undefined : next)} value={value || "__none__"}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("selectCategory")} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectItem value="__none__">{t("noCategory")}</SelectItem>
        {categories
          .filter((c) => c.id && !c.parentId)
          .map((parent) => (
            <div key={parent.id}>
              <SelectItem value={parent.id} className="font-medium">
                {parent.name}
              </SelectItem>
              {categories
                .filter((c) => c.parentId === parent.id)
                .map((child) => (
                  <SelectItem key={child.id} value={child.id} className="pl-6 text-muted-foreground">
                    ↳ {child.name}
                  </SelectItem>
                ))}
            </div>
          ))}
      </SelectContent>
    </Select>
  );
}
