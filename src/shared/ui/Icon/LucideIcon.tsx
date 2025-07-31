import { icons } from "lucide-react";
import { HTMLAttributes } from "react";

export interface LucideIconProps extends HTMLAttributes<HTMLOrSVGElement> {
  name: keyof typeof icons;
  size?: number;
}

const LucideIcon = ({ name, size = 16, ...props }: LucideIconProps) => {
  const SelectedLucideIcon = icons[name];
  return <SelectedLucideIcon size={size} {...props} />;
};

export default LucideIcon;
