interface ToolbarContainerProps {
  children: React.ReactNode;
}

const ToolbarContainer = ({ children }: ToolbarContainerProps) => {
  return (
    <div className="w-full h-[44px] relative border-b border-gray-200 rounded-t-lg">
      <div
        className="w-full h-full overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex gap-2 dark:text-white min-w-max px-4 whitespace-nowrap h-full items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ToolbarContainer;
