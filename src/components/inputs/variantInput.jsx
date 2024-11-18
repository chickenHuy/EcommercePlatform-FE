import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const VariantInput = ({
  variant,
  onNameChange,
  onAddOption,
  onRemoveOption,
}) => {
  const [newOption, setNewOption] = useState("");
  const [isHasWhiteSpace, setIsHasWhiteSpace] = useState(false);
  const { toast } = useToast();

  const handleAddNewOption = () => {
    if (newOption.trim()) {
      const newOptionLowerCase = newOption.trim().toLowerCase();
      const optionsLowerCase = variant.options.map((option) =>
        option.toLowerCase()
      );

      if (optionsLowerCase.includes(newOptionLowerCase)) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Tùy chọn đã tồn tại",
        });
        return;
      }

      onAddOption(newOption.trim());
      setNewOption("");
    } else {
      console.error("Option không hợp lệ!");
    }
  };

  const hasWhitespace = (value) => {
    const hasLeadingOrTrailingWhitespace = value.trim() !== value;
    const hasMiddleWhitespace = /\s/.test(value.trim().replace(/\s+/g, ""));

    return hasLeadingOrTrailingWhitespace || hasMiddleWhitespace;
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Tên phân loại"
        value={variant.name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      {!variant.name.trim() && (
        <span className="text-error-dark text-[13px] -translate-y-[5px]">
          Không được để trống
        </span>
      )}

      <div className="w-full flex flex-wrap gap-2 mt-2">
        {variant.options.map((option, index) => (
          <div
            key={index}
            className="relative border rounded px-7 py-1 flex items-center gap-2"
          >
            <span>{option}</span>
            <button
              className="absolute top-[1px] right-[1px]"
              onClick={() => onRemoveOption(index)}
            >
              <X className="w-4 h-4 hover:text-error-dark scale-90 hover:scale-105" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="w-full h-fit flex flex-col gap-[7px]">
          <Input
            type="text"
            placeholder="Thêm nhóm tùy chọn"
            value={newOption}
            onChange={(e) => {
              setIsHasWhiteSpace(hasWhitespace(e.target.value));
              setNewOption(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddNewOption();
              }
            }}
          />
          {isHasWhiteSpace && (
            <span className="text-error-dark text-[13px] -translate-y-[5px]">
              Vui lòng kiểm tra lại. Đầu và cuối của chuỗi kí tự được nhập không
              được chứa khoảng trắng.
            </span>
          )}
        </div>
        <Button
          onClick={() => {
            if (!isHasWhiteSpace) {
              handleAddNewOption();
            }
          }}
        >
          Thêm vào danh sách
        </Button>
      </div>
    </div>
  );
};

export default VariantInput;
