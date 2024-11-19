import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RenderCategories (categories, level = 0, handleCategoryChange, selectedCategory) {
  return (
    <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange}>
      {categories.map((category) => (
        <div key={category.id}>
          <div
            className={`flex items-center space-x-2 ${level > 0 ? "ml-4" : ""}`}
          >
            <RadioGroupItem value={category.id} id={category.id} />
            <Label htmlFor={category.id} className="text-sm text-gray-700">
              {category.name}
            </Label>
          </div>
          {category.children && category.children.length > 0 && (
            <Accordion type="multiple" className="w-full">
              <AccordionItem value={category.id}>
                <AccordionTrigger className="text-sm py-1 px-2">
                  {/* ({category.children.length}) */}
                </AccordionTrigger>
                <AccordionContent>
                  {RenderCategories(category.children, level + 1, handleCategoryChange, selectedCategory)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      ))}
    </RadioGroup>
  );
};