"use client"
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSummary from "./_services/components/GeneralSummary";
import Payments from "./_services/components/Payments";
import Scanning from "./_services/components/Scanning";
import Findings from "./_services/components/Findings";
import Reports from "./_services/components/Reports";
import Organization from "./_services/components/Organization";
import Support from "./_services/components/Support";

export default function DashboardOverview() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 1300);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <div className="text-2xl font-semibold mb-2">Can&apos;t open on mobile</div>
        <div className="text-muted-foreground text-center">
          The dashboard is not available on mobile devices. Please use a desktop or tablet.
        </div>
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="general_summary" className="space-y-2">
        <TabsList>
          <TabsTrigger value="general_summary">General Summary</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        <TabsContent value="general_summary" className="space-y-6" >
          <GeneralSummary />
        </TabsContent>
        <TabsContent value="payments">
          <Payments />
        </TabsContent>
        <TabsContent value="scanning">
          <Scanning />
        </TabsContent>
        <TabsContent value="findings">
          <Findings />
        </TabsContent>
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
        <TabsContent value="organization">
          <Organization />
        </TabsContent>
        <TabsContent value="support">
          <Support />
        </TabsContent>
      </Tabs>
    </>
  );
} 