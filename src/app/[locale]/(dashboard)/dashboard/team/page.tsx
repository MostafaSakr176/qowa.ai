import React from 'react'
import TeamList from './_services/components/TeamList'
import { api } from '@/lib/ApiService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const Team = async () => {

  const session = await getServerSession(authOptions);

  const accessToken = session?.accessToken;
  const data = await api.get("employee/employees/", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    }
  });

console.log("==========>",data);

  
  return (
    <div>
      <TeamList teamsData={data} />
    </div>
  )
}

export default Team