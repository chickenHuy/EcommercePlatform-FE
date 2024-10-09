import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RadioGroupGender() {
  return (
    <RadioGroup
      defaultValue="male"
      className="flex items-center space-x-6 py-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="male" id="male" />
        <Label htmlFor="male">Nam</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="feMale" id="feMale" />
        <Label htmlFor="feMale">Nữ</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="other" id="other" />
        <Label htmlFor="other">Khác</Label>
      </div>
    </RadioGroup>
  );
}
