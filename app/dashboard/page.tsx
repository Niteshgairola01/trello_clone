"use client";

import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}!
          </h1>
          <p className="text-gray-600">
            Here's what happening with your borad today.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
