import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { Accept: "application/json" },
});

export async function listExams({ signal } = {}) {
  const response = await api.get("/exams/", { signal });
  return response.data;
}

export async function createExam(title) {
  const response = await api.post("/exams/", { title });
  return response.data;
}

export async function deleteExam(id) {
  await api.delete(`/exams/${id}/`);
}

export function describeError(error) {
  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return "La petición tardó demasiado; inténtalo de nuevo.";
  }
  if (error?.code === "ERR_NETWORK" && !error.response) {
    return "No se pudo conectar con el servidor; comprueba la conexión y CORS.";
  }
  const status = error?.response?.status;
  if (status === 400 && error.response.data && typeof error.response.data === "object") {
    const details = Object.entries(error.response.data)
      .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
      .join("; ");
    return details || "La solicitud contiene datos inválidos.";
  }
  if (status === 404) return "El recurso solicitado ya no existe.";
  if (status >= 500) return `El servidor falló (error ${status}).`;
  return "No se pudo completar la solicitud; inténtalo de nuevo.";
}
