"use client";

import { Editor } from "@tiptap/react";
import { ToolbarOption } from "../../lib/editor.types";
import { useRef, useState } from "react";
import LucideIcon from "@/shared/ui/Icon/LucideIcon";
import useOutsideClick from "@/shared/hooks/useOutsideClick";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

interface ToolbarDropdownProps {
  options: ToolbarOption[];
  editor: Editor;
}

const ToolbarDropdown = ({ options, editor }: ToolbarDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 10,
    left: 0,
  });
  // 현재 활성 상태에 따라 선택된 옵션 업데이트
  const getActiveOption = () => {
    const activeOption = options.find(
      (option) => option.isActive && option.isActive(editor)
    );
    return activeOption || options[0];
  };

  const activeOption = getActiveOption();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const handleToggle = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX - 10,
    });
    setIsOpen((prev) => !prev);
  };

  const dropdownOptions = options.map((option) => ({
    key: option.label,
    element: <LucideIcon name={option.icon} size={20} />,
    isActive: option.isActive ? option.isActive(editor) : false,
    action: () => option.action(editor),
  }));

  return (
    <div className="relative text-gray-700" ref={dropdownRef}>
      <div
        className="flex gap-0.5 text-[16px] h-8 py-2 items-center hover:bg-gray-200 rounded-md px-1 cursor-pointer"
        onClick={handleToggle}
      >
        <LucideIcon name={activeOption.icon} size={20} />
        <ChevronDown size={16} style={{ color: "rgb(14, 14, 17)" }} />
      </div>
      {isOpen &&
        createPortal(
          <div
            className="fixed flex flex-col gap-0.5 w-[80px] py-1 px-1 rounded-lg border border-gray-200 shadow-lg z-50 bg-white"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            {dropdownOptions.map((option) => (
              <div
                className="flex text-sm h-8 py-2 px-1 gap-1 items-center hover:bg-gray-200 rounded-md cursor-pointer"
                key={option.key}
                onClick={() => {
                  console.log("option: ", option);
                  option.action();
                  setIsOpen(false);
                }}
              >
                {option.element} {option.key}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default ToolbarDropdown;
