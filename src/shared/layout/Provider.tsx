"use client";

import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/shared/lib/apollo-client";
import { SidebarInset, SidebarProvider } from "@/shared/ui/shadcn/sidebar";
import { AppSidebar } from "@/widgets/AppSidebar";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { SiteHeader } from "@/shared/ui/shadcn/site-header";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ApolloProvider client={apolloClient}>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {children}
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ApolloProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
