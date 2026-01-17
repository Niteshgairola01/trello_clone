import { Card, CardContent } from "../ui/card";
import { Calendar, User } from "lucide-react";
import { Task } from "@/lib/supabase/models";

const getPriortyColor = (priority: "low" | "medium" | "high"): string => {
  if (priority === "low") return "bg-green-600";
  if (priority === "medium") return "bg-yellow-600";
  if (priority === "high") return "bg-red-600";

  return "bg-yellow-600";
};

const TaskItem = ({ task }: { task: Task }) => {
  return (
    <div>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-4">
            {/* Task Header */}
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
                {task.title}
              </h4>
            </div>

            {/* Task Description */}
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description || "No Description"}
            </p>

            {/* Task Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                {task.assignee && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span className="truncate">{task.assignee}</span>
                  </div>
                )}
                {task.due_date && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span className="truncate">{task.due_date}</span>
                  </div>
                )}
              </div>
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${getPriortyColor(
                  task.priority
                )}`}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default TaskItem;
