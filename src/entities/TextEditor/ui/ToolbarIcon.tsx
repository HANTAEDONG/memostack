import { cn } from "@/shared/lib/utils";
import LucideIcon, { LucideIconProps } from "@/shared/ui/Icon/LucideIcon";

export interface ToolbarIconProps extends LucideIconProps {
  isActive?: boolean;
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
      className={cn(isActive ? "text-blue-500" : "text-black")}
      {...props}
    />
  );
};

export default ToolbarIcon;
