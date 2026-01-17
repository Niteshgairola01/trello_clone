"use client";

import { useUser } from "@clerk/nextjs";
import { boardDataService, boardServices, taskServices } from "../services";
import { useEffect, useState } from "react";
import { Board, Column, ColumnWithTasks } from "../supabase/models";
import { useSupabase } from "../supabase/SupabaseProvider";

export const useBoards = () => {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBoards();
  }, [user]);

  const loadBoards = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const data = await boardServices.getBoards(supabase!, user.id);
      setBoards(data);
    } catch (err) {
      setError(err instanceof Error ? err?.message : "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (boardData: {
    title: string;
    description?: string;
    color?: string;
  }) => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);

    if (!supabase) {
      throw new Error("Supabase client is not initialized");
    }

    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase,
        {
          ...boardData,
          userId: user.id,
        }
      );

      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err?.message : "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return { boards, loading, error, createBoard };
};

export const useBoard = (boardId: string) => {
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await boardDataService.getBoardWithColumns(
        supabase!,
        boardId
      );

      setBoard(data.board);
      setColumns(data.columnsWithTasks);
    } catch (error) {
      setError(
        error instanceof Error ? error?.message : "Failed to load board"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    if (!supabase) throw new Error("Supabase client is not initialized");

    try {
      const updatedBoard = await boardServices.updateBoard(
        supabase!,
        boardId,
        updates
      );
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (error) {
      error instanceof Error ? error?.message : "Failed to load board";
    }
  };

  const createTask = async (
    columnId: string,
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      dueDate?: string;
      priority: "low" | "medium" | "high";
    }
  ) => {
    try {
      const newTask = await taskServices.createTask(supabase!, {
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.dueDate || null,
        priority: taskData.priority || "medium",
        column_id: columnId,
        sort_order:
          columns.find((col) => col.id === columnId)?.tasks.length || 0,
      });

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        )
      );

      return newTask;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create the task."
      );
    }
  };

  return { board, columns, loading, error, loadBoard, updateBoard, createTask };
};
