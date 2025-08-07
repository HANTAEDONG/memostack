import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/widgets/AppSidebar";

interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main
        className={
          "bg-background dark:bg-foreground w-[723px] mx-auto relative"
        }
      >
        <div className="absolute top-2 left-2 z-10">
          <SidebarTrigger className="cursor-pointer" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
