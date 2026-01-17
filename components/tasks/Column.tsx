import { ColumnWithTasks } from "@/lib/supabase/models";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const Column = ({
  column,
  children,
  onCreateTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: any) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
}) => {
  return (
    <div className="w-full lg:shrink-0 lg:w-80">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Column Header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {column?.title}
              </h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                {column.tasks.length}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="shrink-0">
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        {/* Column Content */}
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};
export default Column;
