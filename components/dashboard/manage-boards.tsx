"use client";

import { Filter, Grid3X3, List, Plus } from "lucide-react";
import { Button } from "../ui/button";

type PropType = {
  viewMode: string;
  setViewMode: Function;
  handleCreateBoard: Function;
};

const ManageBoards = ({
  viewMode,
  setViewMode,
  handleCreateBoard,
}: PropType) => {

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Your Boards
        </h2>
        <p className="text-gray-600">Manage your projects and tasks</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 space-y-2 sm:space-y-0">
        <div className="w-full flex items-center space-x-2 bg-white birder p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List />
          </Button>
        </div>

        <Button variant="outline" size="sm">
          <Filter />
        </Button>

        <Button onClick={() => handleCreateBoard()}>
          <Plus />
          Create Board
        </Button>
      </div>
    </div>
  );
};

export default ManageBoards;
