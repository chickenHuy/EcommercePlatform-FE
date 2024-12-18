import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CompleteNotify from "@/components/notifies/complete";

const DetailInformation = ({
  listComponents = [],
  setFormData = null,
  formData = [],
}) => {
  useEffect(() => {
    const listComponentsValue = listComponents.reduce(
      (acc, field) => ({ ...acc, [field.id]: "" }),
      {}
    );
    setFormData(listComponentsValue);
  }, [listComponents]);

  return (
    <div className="text-[15px] w-full h-fit flex flex-row justify-center items-start px-5 gap-5">
      <div className="grid grid-cols-2 gap-x-10 gap-y-3 w-full h-fit shadow-md rounded-md border-[0.5px] border-white-secondary px-5 py-10">
        {listComponents.length === 0 && (
          <span className="text-sm text-error-dark">
            Không có thông tin!!! Vui lòng chọn ngành hàng
          </span>
        )}
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
      <div className="min-w-[400px] h-full lg:flex hidden flex-col justify-start items-start gap-3 p-5 shadow-md rounded-md border-[0.5px] border-white-secondary">
        {listComponents
          .filter(({ required }) => required)
          .map(({ id, name }) => (
            <CompleteNotify
              isComplete={formData[id]?.length > 0}
              content={`Cung cấp thông tin về  ${name}.`}
            />
          ))}
      </div>
    </div>
  );
};

export default DetailInformation;
