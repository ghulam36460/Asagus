/**
 * research-api.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client for fetching public research projects from the content service.
 * All data is managed through the Admin Panel — nothing is hardcoded here.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export interface ResearchProjectPublic {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "ongoing" | "completed" | "paused" | "planned";
  category: string;
  technologies: string[];
  thumbnailUrl?: string | null;
  objectives?: string | null;
  results?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  featured: boolean;
  orderIndex: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
}

export interface ResearchListResponse {
  success: boolean;
  data: ResearchProjectPublic[];
}

/**
 * Fetch all publicly visible research projects, ordered by orderIndex then
 * creation date (newest first). Results are cached for 60 seconds.
 */
export async function fetchResearchProjects(opts?: {
  featured?: boolean;
  category?: string;
  status?: string;
}): Promise<ResearchProjectPublic[]> {
  try {
    const params = new URLSearchParams();
    if (opts?.featured !== undefined)
      params.set("featured", String(opts.featured));
    if (opts?.category) params.set("category", opts.category);
    if (opts?.status) params.set("status", opts.status);

    const query = params.toString() ? `?${params.toString()}` : "";
    const url = `${API_BASE}/content/research/public${query}`;

    // 5 s timeout — prevents stalling SSR when the API is not yet running
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    let res: Response;
    try {
      res = await fetch(url, {
        next: { revalidate: 60 },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      // Expected when API is temporarily unavailable — warn, don't error
      console.warn(`[research-api] API returned ${res.status}; using fallback cards.`);
      return [];
    }

    const json: ResearchListResponse = await res.json();
    return json.data ?? [];
  } catch (err) {
    // Network error (ECONNREFUSED, AbortError, etc.) — API not running yet.
    // Demoted to warn so Next.js doesn't surface this as a red server error.
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[research-api] Could not reach API (${msg}); rendering with fallback cards.`);
    return [];
  }
}

/**
 * Fetch a single public research project by slug.
 */
export async function fetchResearchProject(
  slug: string
): Promise<ResearchProjectPublic | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    let res: Response;
    try {
      res = await fetch(
        `${API_BASE}/content/research/public/slug/${encodeURIComponent(slug)}`,
        { next: { revalidate: 60 }, signal: controller.signal }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) return null;

    const json: { success: boolean; data: ResearchProjectPublic } =
      await res.json();
    return json.data ?? null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[research-api] Could not fetch research project (${msg}).`);
    return null;
  }
}
