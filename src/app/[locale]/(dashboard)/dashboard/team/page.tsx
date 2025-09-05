import React from 'react'
import TeamList from './_services/components/TeamList'
import { api } from '@/lib/ApiService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const Team = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      // Not authenticated or missing token
      return (
        <div>
          <p className="text-red-500">You are not authorized to view this page. Please log in.</p>
        </div>
      );
    }

    const accessToken = session.accessToken;
    const res = await fetch("https://api.qowa.ai/employee/employees/", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // API error
      const errorText = await res.text();
      console.error("Failed to fetch team data:", errorText);
      return (
        <div>
          <p className="text-red-500">Failed to load team data. Please try again later.</p>
        </div>
      );
    }

    const data = await res.json();

    console.log("==========>", data);

    return (
      <div>
        <TeamList teamsData={data} />
      </div>
    );
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error && error.message) {
      errorMessage += ` ${error.message}`;
    } else if (typeof error === "string") {
      errorMessage += ` ${error}`;
    }
    return (
      <div>
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }
}

export default Team