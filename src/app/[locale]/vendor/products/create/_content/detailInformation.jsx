import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import CompleteNotify from "@/components/notifies/complete";
import { CircleAlert } from "lucide-react";

const DetailInformation = ({
  listComponents = [],
  setFormData = null,
  formData = [],
}) => {
  useEffect(() => {
    const listComponentsValue = listComponents.reduce(
      (acc, field) => ({ ...acc, [field.id]: "" }),
      {},
    );
    setFormData(listComponentsValue);
  }, [listComponents]);

  console.log(listComponents);

  return (
    <div className="w-full h-fit flex lg:flex-row flex-col justify-center items-start px-5 gap-5 text-[1em]">
      {listComponents.length === 0 ? (
        <div className="text-red-primary w-full flex flex-row items-center justify-start gap-3">
          <CircleAlert />
          <span>Không có thông tin!!! Vui lòng chọn ngành hàng</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 w-full h-fit shadow-md rounded-md border-[0.5px] px-5 py-10">
          {listComponents.map(({ id, name, required }) => (
            <div key={id}>
              <div className="grid w-full items-center gap-1.5">
                <div className="flex flex-row justify-start items-center">
                  <span>{name}</span>
                  {required && (
                    <span className="px-3 text-error font-[900]">( * )</span>
                  )}{" "}
                </div>
                <Input
                  type="text"
                  id={id}
                  value={formData[id]}
                  onChange={(e) =>
                    setFormData({ ...formData, [id]: e.target.value })
                  }
                  placeholder={name}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {listComponents.length > 0 ? (
        <div className="lg:w-[600px] w-full h-full flex flex-col justify-start items-start gap-3 p-5 shadow-md rounded-md border-[0.5px]">
          {listComponents
            .filter(({ required }) => required)
            .map(({ id, name }, index) => (
              <CompleteNotify
                key={index}
                isComplete={formData[id]?.length > 0}
                content={`Cung cấp thông tin về  ${name}.`}
              />
            ))}
        </div>
      ) : (
        <div className="w-[600px] h-full"></div>
      )}
    </div>
  );
};

export default DetailInformation;
