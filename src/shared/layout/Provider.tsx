"use client";

import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/shared/lib/apollo-client";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "@/widgets/AppSidebar";
import { ErrorProvider } from "./ErrorProvider";
import { ErrorBoundary } from "../ui/ErrorBoundary";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ApolloProvider client={apolloClient}>
          <ErrorProvider>
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
          </ErrorProvider>
        </ApolloProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
