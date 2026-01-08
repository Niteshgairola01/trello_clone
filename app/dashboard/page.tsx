"use client";

import ManageBoards from "@/components/dashboard/manage-boards";
import StatsCard from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/lib/hooks/useBoardHooks";
import { useUser } from "@clerk/nextjs";
import {
  Clock,
  LoaderCircle,
  OctagonAlert,
  Plus,
  Rocket,
  Search,
  Trello,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { user } = useUser();
  const { createBoard, boards, loading, error } = useBoards();

  const handleCreateBoard = async () => {
    await createBoard({ title: "New Board" });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col font-bold text-2xl text-gray-900">
        <LoaderCircle className="spin-out animate-spin" size="40" />
        <p className="mt-3">Loading. . . . </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col font-bold text-2xl">
        <OctagonAlert className="size-20 text-red-400" />
        <p className="mt-3 text-red-500">Error Loading Boards ! </p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Boards",
      key: "totalBoards",
      value: boards.length,
      icon: Trello,
      iconColor: "text-blue-600",
      iconBackground: "bg-blue-100",
    },
    {
      title: "Active Projects",
      key: "activeProjects",
      value: boards.length,
      icon: Rocket,
      iconColor: "text-green-600",
      iconBackground: "bg-green-100",
    },
    {
      title: "Recent Activity",
      key: "recentActivity",
      value: boards.filter((board) => {
        const updatedAt = new Date(board.updated_at);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return updatedAt < oneWeekAgo;
      }).length,
      icon: Clock,
      iconColor: "text-gray-600",
      iconBackground: "bg-gray-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 sm:py-6">
        {/* Header Section */}
        <section className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}!
          </h1>
          <p className="text-gray-600">
            Here's what happening with your board today.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((card) => (
            <StatsCard {...card} key={card.key} />
          ))}
        </section>

        {/* Boards Section */}
        <section className="mb-6 sm:mb-8">
          <ManageBoards
            viewMode={viewMode}
            setViewMode={setViewMode}
            handleCreateBoard={handleCreateBoard}
          />
        </section>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            id="search"
            placeholder="Search boards . . . . "
            className="pl-10"
          />
        </div>

        {/* Boards Grid/List section */}
        <section className="mt-5">
          {boards.length === 0 ? (
            <div className="py-3 flex items-center justify-center font-medium text-sm sm:text-xl text-gray-400 ">
              No boards yet
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {boards.map((board) => (
                <Link href={`/boards/${board.id}`} key={board.id}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className={`w-5 h-5 ${board.color} rounded`}></div>
                        <Badge className="text-xs" variant="secondary">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {board.title}
                      </CardTitle>
                      <CardDescription className="text-sm mb-4">
                        {board.description}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                        <span>
                          Created{" "}
                          {new Date(board.created_at).toLocaleDateString()}
                        </span>

                        <span>
                          Updated{" "}
                          {new Date(board.updated_at)?.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors group">
                <CardContent className="p-4 sm:p-6 flex flex-col justify-center items-center h-full min-h-42.5">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                    Create new board
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div>
              {boards.map((board, index) => (
                <div className={index > 0 ? "mt-4" : ""} key={board.id}>
                  <Link href={`/boards/${board.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div
                            className={`w-5 h-5 ${board.color} rounded`}
                          ></div>
                          <Badge className="text-xs" variant="secondary">
                            New
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {board.title}
                        </CardTitle>
                        <CardDescription className="text-sm mb-4">
                          {board.description}
                        </CardDescription>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                          <span>
                            Created{" "}
                            {new Date(board.created_at).toLocaleDateString()}
                          </span>

                          <span>
                            Updated{" "}
                            {new Date(board.updated_at)?.toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}

              <Card className="border-2 mt-4 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors group">
                <CardContent className="p-4 sm:p-6 flex flex-col justify-center items-center h-full min-h-42.5">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                    Create new board
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
