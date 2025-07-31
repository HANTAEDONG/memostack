import { cn } from "@/shared/lib/utils";

type ToolbarButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
};

const ToolbarButton = ({
  children,
  className,
  onClick,
  disabled,
}: ToolbarButtonProps) => {
  return (
    <button
      className={cn(
        "w-8 h-8 flex items-center justify-center dark:bg-[rgb(14, 14, 17)] dark:text-white dark:hover:bg-[rgb(24, 24, 27)] bg-white hover:bg-gray-200 rounded-md",
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
