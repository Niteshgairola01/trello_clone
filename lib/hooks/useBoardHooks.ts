"use client";

import { useUser } from "@clerk/nextjs";
import { boardDataService, boardServices } from "../services";
import { useEffect, useState } from "react";
import { Board } from "../supabase/models";
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
