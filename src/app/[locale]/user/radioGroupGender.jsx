import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RadioGroupGender({ selectedValue, onChange }) {
  const handleOnChange = (value) => {
    onChange(value);
  };

  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={handleOnChange}
      className="flex items-center space-x-6 py-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="MALE" id="MALE" />
        <Label htmlFor="MALE">Nam</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="FEMALE" id="FEMALE" />
        <Label htmlFor="FEMALE">Nữ</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="OTHER" id="OTHER" />
        <Label htmlFor="OTHER">Khác</Label>
      </div>
    </RadioGroup>
  );
}
