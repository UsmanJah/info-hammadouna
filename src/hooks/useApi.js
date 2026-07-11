// src/hooks/useApi.js
// Hooks génériques pour interagir avec le backend FastAPI
// Usage lecture : const { data, loading, error } = useApi("/evenements");
// Usage écriture : const { create, update, remove, loading, error } = useMutation("/evenements");

import { useState, useEffect, useCallback } from "react";

// ✅ CRA (webpack) → process.env.REACT_APP_*  au lieu de import.meta.env
export const API_BASE = process.env.REACT_APP_API_URL ?? "https://www.api-dawahir.com/api";
export const API_KEY  = process.env.REACT_APP_API_KEY  ?? "";

/** Headers communs à TOUTES les requêtes (GET, POST, PUT, DELETE). */
export function buildHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
    ...extra,
  };
}

/**
 * Requête générique avec gestion d'erreur cohérente.
 * Lève une Error avec le message du backend si dispo, sinon `HTTP <status>`.
 */
export async function apiRequest(endpoint, { method = "GET", body } = {}) {
  const r = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!r.ok) {
    const detail = await r.json().catch(() => ({}));
    throw new Error(detail?.detail ?? detail?.message ?? `HTTP ${r.status}`);
  }
  if (r.status === 204) return null; // No Content (souvent le cas pour DELETE)
  return r.json().catch(() => null);
}

/**
 * Exécute un GET sur `${API_BASE}${endpoint}` (+ query params optionnels).
 *
 * @param {string} endpoint   – ex: "/evenements"
 * @param {object} [params]   – query params, ex: { annee: 2024, category: "Gamou" }
 */
export function useApi(endpoint, params = {}) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const buildUrl = useCallback(() => {
    const url = new URL(`${API_BASE}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
    return url.toString();
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(buildUrl(), { headers: buildHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [buildUrl]);

  return { data, loading, error };
}

/**
 * Hook de mutation générique pour une ressource (create / update / remove).
 * Toutes les requêtes passent par apiRequest() donc portent les mêmes
 * headers (auth incluse) que les GET, et lèvent une vraie erreur en cas
 * d'échec — aucun fallback silencieux "local only".
 *
 * @param {string} endpoint – ex: "/evenements"
 */
export function useMutation(endpoint) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const run = useCallback(async (method, path, body) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(path, { method, body });
    } catch (e) {
      setError(e.message);
      throw e; // on laisse l'appelant décider quoi faire (toast, etc.)
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    create: (body)     => run("POST",   endpoint, body),
    update: (id, body) => run("PATCH",  `${endpoint}/${id}`, body),
    remove: (id)        => run("DELETE", `${endpoint}/${id}`),
    loading,
    error,
  };
}

/** Conservé pour compatibilité ascendante si utilisé ailleurs. */
export function usePost(endpoint) {
  const { create, loading, error } = useMutation(endpoint);
  return { post: create, loading, error };
}