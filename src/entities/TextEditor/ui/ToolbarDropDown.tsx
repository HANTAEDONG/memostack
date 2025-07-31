import useOutsideClick from "@/shared/hooks/useOutsideClick";
import { ChevronDown, Heading } from "lucide-react";
import { useState } from "react";

interface ToolbarDropDownProps {
  options: {
    key: string;
    element: React.ReactNode;
    isActive: boolean;
    action: () => void;
  }[];
  ref?: React.RefObject<HTMLDivElement>;
}

const ToolbarDropDown = ({ options, ref }: ToolbarDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<React.ReactNode>(
    <Heading size={20} />
  );
  useOutsideClick(ref, () => setIsOpen(false));
  return (
    <div className="relative" ref={ref}>
      <div
        className="flex gap-0.5 text-[16px] h-8 py-2 items-center hover:bg-gray-200 rounded-md px-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
        <ChevronDown size={16} style={{ color: "rgb(14, 14, 17)" }} />
      </div>
      {isOpen && (
        <div className="absolute top-10 left-0 flex flex-col gap-0.5 w-[80px] py-1 px-1 bg-white rounded-lg border border-gray-200">
          {options.map((option) => (
            <div
              className="flex text-sm h-8 py-2 px-1 gap-1 items-center hover:bg-gray-200 rounded-md cursor-pointer"
              key={option.key}
              onClick={() => {
                setSelected(option.element);
                option.action();
              }}
            >
              {option.element} {option.key}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolbarDropDown;
