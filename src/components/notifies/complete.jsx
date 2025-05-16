import { CircleCheckBig } from "lucide-react";
import { CircleOff } from "lucide-react";

const CompleteNotify = ({ isComplete = false, content = "" }) => {
  return (
    <div className="flex flex-row justify-start items-center gap-3 text-md">
      {isComplete ? <CircleCheckBig className="text-success" /> : <CircleOff className="text-red-primary"/>}
      <span>{content}</span>
    </div>
  );
};

export default CompleteNotify;
