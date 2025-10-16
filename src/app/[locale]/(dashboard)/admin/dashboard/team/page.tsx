import React from 'react'
import TeamList from './_services/components/TeamList'
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';
import RulesList from './_services/components/RulesList';

const Team = () => {

  return (
    <div>
      <Tabs defaultValue="team" className="space-y-2">
        <TabsList>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>
        <TabsContent value="team" className="space-y-6">
          <TeamList />
        </TabsContent>
        <TabsContent value="rules" className="space-y-6">
          <RulesList />
        </TabsContent>
      </Tabs>
    </div>
  );

}

export default Team