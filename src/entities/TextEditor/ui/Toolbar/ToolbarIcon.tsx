import LucideIcon, { LucideIconProps } from "@/shared/ui/Icon/LucideIcon";
import { ToolbarOption } from "../../model/editor.types";
import { cn } from "@/shared/lib/utils";

export interface ToolbarIconProps extends LucideIconProps {
  isActive?: boolean;
  name: ToolbarOption["icon"];
}

const ToolbarIcon = ({
  name,
  size = 16,
  isActive,
  ...props
}: ToolbarIconProps) => {
  return (
    <LucideIcon
      name={name}
      size={size}
      className={cn(
        isActive ? "text-blue-500" : "text-gray-700 dark:text-[oklch(60%_0_0)]",
        props.className
      )}
      {...props}
    />
  );
};

export default ToolbarIcon;
