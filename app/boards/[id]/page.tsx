"use client";

import React, { useState } from "react";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";
import DroppableColumn from "@/components/tasks/DroppableColumn";
import SortableTask from "@/components/tasks/SortableTask";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoard } from "@/lib/hooks/useBoardHooks";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Filter, Plus, Workflow } from "lucide-react";
import { useParams } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ColumnWithTasks, Task } from "@/lib/supabase/models";

const colorOptions = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-gray-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-emerald-500",
];

const filterCount = 2;

const priorityOptions = ["low", "medium", "high"];

const TaskOverlay = ({ task }: { task: Task }) => {
  return <SortableTask task={task} />;
};

const Board = () => {
  const { id } = useParams<{ id: string }>();
  const { board, columns, setColumns, updateBoard, createTask, moveTask } =
    useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  const [isFilteringTasks, setIsFilteringTasks] = useState(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleShowEditDialogBox = () => {
    setNewTitle(board?.title ?? "");
    setNewColor(board?.color ?? "");
    setIsEditingTitle(!isEditingTitle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!board || !newTitle.trim()) return;

    const payload = { title: newTitle, color: newColor || board.color };
    await updateBoard(board.id, payload);
    setIsEditingTitle(false);
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
  }) => {
    const targetColumn = columns[0];
    if (!targetColumn) {
      throw new Error("No column available to add task");
    }

    createTask(targetColumn.id, taskData);
  };

  const handleSubmitTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
    };

    if (taskData.title.trim()) {
      await handleCreateTask(taskData);
      const trigger = document.querySelector(
        '[data-state="open"]'
      ) as HTMLElement;

      if (trigger) trigger.click();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);

    if (task) {
      setActiveTask(task);
    }
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );

    const targetColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === overId)
    );

    const activeIndex = sourceColumn?.tasks.findIndex(
      (task) => task.id === activeId
    );

    const overIndex = targetColumn?.tasks.findIndex(
      (task) => task.id === overId
    );

    if (activeIndex === undefined || overIndex === undefined) return;

    if (activeIndex !== overIndex) {
      setColumns((prev: ColumnWithTasks[]) => {
        const newColumns = [...prev];
        const column = newColumns.find((col) => col.id === sourceColumn?.id);
        if (column) {
          const tasks = [...column.tasks];
          const [removedTask] = tasks.splice(activeIndex, 1);

          tasks.splice(overIndex, 0, removedTask);
          column.tasks = tasks;
        }

        return newColumns;
      });
    }
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((col) => col.id === overId);

    if (targetColumn) {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId)
      );

      if (sourceColumn && sourceColumn.id !== targetColumn.id) {
        await moveTask(taskId, targetColumn.id, targetColumn.tasks.length);
      } else {
        const sourceColumn = columns.find((col) =>
          col.tasks.some((task) => task.id === taskId)
        );

        const targetColumn = columns.find((col) =>
          col.tasks.some((task) => task.id === overId)
        );

        if (sourceColumn && targetColumn) {
          const oldIndex = sourceColumn.tasks.findIndex(
            (task) => task.id === taskId
          );

          const newIndex = targetColumn.tasks.findIndex(
            (task) => task.id === overId
          );

          if (oldIndex !== newIndex) {
            await moveTask(taskId, targetColumn.id, newIndex);
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <Card className="px-3 flex justify-between items-center flex-row">
        <div className="flex items-start flex-row  gap-3">
          <Workflow className="text-blue-600" />
          <CardTitle className="text-gray-900 text-lg justify-start items-center space-x-1 sm:space-x-2 min-w-9 ">
            {board?.title}
          </CardTitle>
          <span
            className="font-bold cursor-pointer"
            onClick={() => handleShowEditDialogBox()}
          >
            . . .{" "}
          </span>
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            className={`text-xs sm:text-sm ${
              filterCount > 0 ? "bg-blue-100 border-blue-200 " : ""
            }`}
            onClick={() => setIsFilteringTasks(true)}
          >
            <Filter />
            <span className="hidden sm:inline">Filter</span>
            {filterCount > 0 && (
              <Badge
                variant="secondary"
                className="text-xs ml-2 sm:ml-2 bg-blue-200 border-blue-300 text-black"
              >
                2
              </Badge>
            )}
          </Button>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="boardTitle">Board Title</Label>
            <Input
              id="boardTitle"
              className="mt-2"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter board title. . . "
              required
            />
            <Label>Board Color</Label>
            <div className="mt-5 grid grid-cols-5 sm:grid-cols-10">
              {colorOptions.map((color, index) => (
                <button
                  type="button"
                  className={`${color} ${
                    color === (newColor === "" ? board?.color : newColor) &&
                    "ring-2 ring-offset-2 ring-gray-900"
                  } h-10 w-10 mb-2 rounded-full cursor-pointer`}
                  onClick={() => setNewColor(color)}
                  key={index}
                ></button>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsEditingTitle(false)}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filter Tasks Dialog */}
      <Dialog open={isFilteringTasks} onOpenChange={setIsFilteringTasks}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
            <p className="text-sm text-gray-600">
              Filter tasks by priority, assignee or due date
            </p>
          </DialogHeader>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label>Prority</Label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((priority, index) => (
                  <Button
                    className="text-xs md:text-sm cursor-pointer capitalize"
                    variant="outline"
                    size="sm"
                    key={index}
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                size="sm"
                className="text-xs sm:text-sm"
                variant="outline"
              >
                Clear Filters
              </Button>
              <Button size="sm" className="text-xs sm:text-sm">
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Board Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 ">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 ">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total Tasks : </span>
              {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
            </div>
          </div>

          {/* Add task dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <p className="text-sm text-gray-600">
                  Add a task to the board{" "}
                </p>
              </DialogHeader>

              <CreateTaskForm onCreateTask={handleSubmitTask} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Column */}
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4 lg:space-y-0 flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto lg:pb-6 lg:px-2 lg:mx-2 lg:[&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar-track]:bg-gray-100 lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full">
            {columns.map((column) => (
              <DroppableColumn
                column={column}
                onCreateTask={handleSubmitTask}
                onEditColumn={() => {}}
                key={column.id}
              >
                <SortableContext
                  items={column.tasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {column.tasks.map((task) => (
                      <SortableTask task={task} key={task.id} />
                    ))}
                  </div>
                </SortableContext>
              </DroppableColumn>
            ))}

            <DragOverlay>
              {activeTask ? <TaskOverlay task={activeTask} /> : null}
            </DragOverlay>
          </div>
        </DndContext>
      </main>
    </div>
  );
};

export default Board;
