type PydanticIssue = { msg?: string; loc?: unknown[]; type?: string };

export function extractErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (!err || typeof err !== "object") return fallback;

  const axiosErr = err as { response?: { data?: { detail?: unknown } }; message?: string };
  const detail = axiosErr?.response?.data?.detail;

  if (typeof detail === "string") return detail;

  // Pydantic v2 returns an array of issue objects
  if (Array.isArray(detail)) {
    const first = detail[0] as PydanticIssue | undefined;
    if (first?.msg) return first.msg;
    return fallback;
  }

  // Network error / no response
  if (axiosErr?.message) return axiosErr.message;

  return fallback;
}
