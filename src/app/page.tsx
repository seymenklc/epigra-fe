"use client"
import React from 'react'
import { useAuthContext } from "@/context/auth-context";
import RecentSessions from './_components/recent-sessions';
import Timer from './_components/timer';

export default function Home() {
  const { user } = useAuthContext();

  return (
    <main className="flex flex-1 flex-col gap-4 px-4 py-10 md:gap-8 md:py-10">
      <Timer />
      {user && <RecentSessions />}
      {!user && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold mt-5 text-center lg:text-left lg:mt-0">
            Sign in to save your sessions
          </h2>
        </div>
      )}
    </main>
  );
}
