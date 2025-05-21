"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RenderCategories(
  categories,
  level = 0,
  handleCategoryChange,
  selectedCategory,
) {
  return (
    <>
      {categories ? (
        <RadioGroup
          value={selectedCategory}
          onValueChange={(value) => {
            handleCategoryChange(value);
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-row justify-start items-start"
            >
              {category.children && category.children.length > 0 ? (
                <Accordion
                  type="multiple"
                  className="w-full text-black-primary border-none"
                >
                  <AccordionItem value={category.id}>
                    <AccordionTrigger className="w-full h-fit py-1 px-2 rounded-md flex flex-row justify-start items-center gap-3 hover:no-underline hover:bg-blue-primary">
                      <RadioGroupItem value={category.id} id={category.id} />
                      <span
                        htmlFor={category.id}
                        className="text-[1em] text-black-primary flex-grow"
                      >
                        {category.name}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {RenderCategories(
                        category.children,
                        level + 1,
                        handleCategoryChange,
                        selectedCategory,
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div
                  className={`w-full h-fit py-[2px] px-2 rounded-md flex flex-row justify-start items-center gap-3 hover:bg-blue-primary ${level > 0 ? "ml-5" : ""}`}
                >
                  <RadioGroupItem value={category.id} id={category.id} />
                  <span
                    htmlFor={category.id}
                    className="text-[1em] text-black-primary"
                  >
                    {category.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </RadioGroup>
      ) : null}
    </>
  );
}
