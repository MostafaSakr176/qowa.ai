
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSummary from "./_services/components/GeneralSummary";
import Payments from "./_services/components/Payments";

export default function DashboardOverview() {



  return (
    <>
      <Tabs defaultValue="general_summary" className="space-y-2">
        <TabsList>
          <TabsTrigger value="general_summary">General Summary</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="general_summary" className="space-y-6" >
          <GeneralSummary />
        </TabsContent>
        <TabsContent value="payments">
          <Payments />
        </TabsContent>
      </Tabs>

    </>
  )
} 