import { cn } from "@/shared/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-[rgb(243,244,246)] border-gray-200 dark:bg-white rounded-lg border dark:border-gray-200 p-2 w-fit",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
