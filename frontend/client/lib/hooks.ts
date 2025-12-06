// src/lib/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "./api";

import type {
  Player,
  Match,
  CreateMatchPayload,
  AddPaymentPayload,
  SettingsData,
} from "@/types/api";

/* ************************************************************
 *                         PLAYERS
 ************************************************************ */

export function usePlayers() {
  return useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      const { data } = await API.get("/players");
      return data;
    },
  });
}

export function useCreatePlayer() {
  const qc = useQueryClient();

  return useMutation<Player, Error, { name: string; phone: string }>({
    mutationFn: async (payload) => {
      const { data } = await API.post("/players", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["players"] });
    },
  });
}

export function useDeletePlayer() {
  const qc = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await API.delete(`/players/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["players"] });
    },
  });
}

/* ************************************************************
 *                         MATCHES
 ************************************************************ */

export function useMatches() {
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data } = await API.get("/matches");
      return data;
    },
  });
}

export function useMatch(id?: string) {
  return useQuery<Match>({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data } = await API.get(`/matches/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateMatch() {
  const qc = useQueryClient();

  return useMutation<Match, Error, CreateMatchPayload>({
    mutationFn: async (payload) => {
      const { data } = await API.post("/matches", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

/* ************************************************************
 *                         PAYMENTS
 ************************************************************ */

export function useAddPayment() {
  const qc = useQueryClient();

  return useMutation<any, Error, AddPaymentPayload>({
    mutationFn: async ({ matchId, playerId, amount }) => {
      const { data } = await API.post(`/matches/${matchId}/payments`, {
        playerId,
        amount,
      });
      return data;
    },

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["matches"] });
      qc.invalidateQueries({ queryKey: ["match", variables.matchId] });
    },
  });
}



/* ************************************************************
 *                         SETTINGS
 ************************************************************ */

export function useSettings() {
  return useQuery<SettingsData>({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await API.get("/settings");
      return data;
    },
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();

  return useMutation<SettingsData, Error, SettingsData>({
    mutationFn: async (payload) => {
      const { data } = await API.post("/settings", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
