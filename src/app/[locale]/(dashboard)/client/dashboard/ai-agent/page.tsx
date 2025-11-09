
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FindingList from "./_services/components/FindingList";
import ScanningList from "./_services/components/ScanningList";

export default async function DashboardOverview() {

    return (
        <>
            <Tabs defaultValue="scanning" className="space-y-2">
                <TabsList className="w-fit">
                    <TabsTrigger value="scanning">Scanning</TabsTrigger>
                    <TabsTrigger value="finding">Finding</TabsTrigger>
                </TabsList>
                <TabsContent value="scanning">
                    <div className='rounded-xl bg-[#F8F9FA] p-2'>
                        <ScanningList />
                    </div>
                </TabsContent>
                <TabsContent value="finding">
                    <div className='rounded-xl bg-[#F8F9FA] p-2'>
                        <FindingList />
                    </div>
                </TabsContent>
            </Tabs>

        </>
    )
} 