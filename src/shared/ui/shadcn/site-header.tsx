"use client";

import { Separator } from "@/shared/ui/shadcn/separator";
import { SidebarTrigger } from "@/shared/ui/shadcn/sidebar";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "홈 페이지";
      case "/write":
        return "메모 작성 페이지";
      case "/dashboard":
        return "모든 메모";
      case "/trash":
        return "휴지통";
      default:
        return "홈 페이지";
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
        {/* <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div> */}
      </div>
    </header>
  );
}
