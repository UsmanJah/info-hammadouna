// src/hooks/useApi.js
// Hook générique pour interagir avec le backend FastAPI
// Usage : const { data, loading, error } = useApi("/evenements");

import { useState, useEffect, useCallback } from "react";

// ✅ CRA (webpack) → process.env.REACT_APP_*  au lieu de import.meta.env
const API_BASE = process.env.REACT_APP_API_URL ?? "http://www.api-dawahir.com:8080/api";
const API_KEY  = process.env.REACT_APP_API_KEY  ?? "";

/** Headers communs à toutes les requêtes */
function buildHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
    ...extra,
  };
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
 * Envoie un POST JSON sur `${API_BASE}${endpoint}`.
 * Retourne { post, loading, error, result }.
 *
 * @param {string} endpoint  – ex: "/blog"
 */
export function usePost(endpoint) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [result, setResult]   = useState(null);

  const post = useCallback(async (body) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const detail = await r.json().catch(() => ({}));
        throw new Error(detail?.detail ?? `HTTP ${r.status}`);
      }
      const data = await r.json();
      setResult(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { post, loading, error, result };
}
