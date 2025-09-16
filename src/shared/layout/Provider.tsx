"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarInset, SidebarProvider } from "@/shared/ui/shadcn/sidebar";
import { AppSidebar } from "@/widgets/AppSidebar";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { SiteHeader } from "@/shared/ui/shadcn/site-header";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      retry: 1,
    },
  },
});

export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2 ">
                  <div className="flex flex-col gap-2 md:gap-6">{children}</div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
