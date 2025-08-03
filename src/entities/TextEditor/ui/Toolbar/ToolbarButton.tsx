import { cn } from "@/shared/lib/utils";

interface ToolbarButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}

const ToolbarButton = ({
  children,
  className,
  onClick,
  disabled,
}: ToolbarButtonProps) => {
  return (
    <button
      className={cn(
        "w-8 h-8 flex items-center justify-center bg-white dark:bg-[oklch(14.5%_0_0)] hover:bg-gray-200 dark:hover:bg-[oklch(24%_0_0)] rounded-md relative cursor-pointer text-gray-700 dark:text-[oklch(90%_0_0)] hover:text-gray-900 dark:hover:text-[oklch(90%_0_0)]",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
