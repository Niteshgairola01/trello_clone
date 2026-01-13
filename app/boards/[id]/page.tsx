"use client";

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
import { Workflow } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

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

const Board = () => {
  const { id } = useParams<{ id: string }>();
  const { board, updateBoard } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <Card className="px-3 flex items-start flex-row  gap-3">
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
      </Card>

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
    </div>
  );
};

export default Board;
