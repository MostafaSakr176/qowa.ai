
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSummary from "./_services/components/GeneralSummary";
import Payments from "./_services/components/Payments";
import Scanning from "./_services/components/Scanning";
import Findings from "./_services/components/Findings";
import Reports from "./_services/components/Reports";

export default function DashboardOverview() {

  return (
    <>
      <Tabs defaultValue="general_summary" className="space-y-2">
        <TabsList>
          <TabsTrigger value="general_summary">General Summary</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
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
      </Tabs>

    </>
  )
} 