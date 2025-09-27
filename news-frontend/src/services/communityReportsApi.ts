import { apiClient } from './apiClient';

export interface CommunityReport {
  id: string | number;
  ai_headline: string;
  ai_summary: string;
  published_date?: string; // ISO string
  created_at?: string; // ISO string
  s3_file_url?: string; // Direct S3 URL if provided
  s3_key?: string; // S3 key if URL needs construction
  author?: string; // Author name
}

export interface FetchUserInfoParams {
  limit?: number; // number of records to return
  offset?: number; // for pagination
  order_by?: 'published_date' | 'created_at';
  order_dir?: 'desc' | 'asc';
}

export interface FetchUserInfoResponse {
  results: CommunityReport[];
  total?: number;
}

// Helper to build S3 URL when only key is provided
const buildS3UrlFromKey = (key?: string): string | undefined => {
  if (!key) return undefined;
  const base = import.meta.env.VITE_S3_PUBLIC_BASE_URL || '';
  return base ? `${base.replace(/\/$/, '')}/${key.replace(/^\//, '')}` : undefined;
};

export async function fetchUserInfo(params: FetchUserInfoParams = {}): Promise<FetchUserInfoResponse> {
  const { limit = 10, offset = 0, order_by = 'created_at', order_dir = 'desc' } = params;

  // Primary endpoint name provided by user: fetch_user_info
  // Backend baseURL is set in apiClient.
  const urlCandidates = [
    `/news/fetch_user_info`,
    `/fetch_user_info`,
  ];

  let lastError: any = null;
  for (const path of urlCandidates) {
    try {
      const response = await apiClient.get(path, {
        params: { limit, offset, order_by, order_dir },
      });

      // Normalize data structure defensively
      const data = (response.data || {}) as any;
      const items: any[] = data.results || data.data || data.items || data || [];

      const normalized: CommunityReport[] = items
        .filter(Boolean)
        .map((it: any) => ({
          id: it.id ?? it.article_id ?? it._id ?? it.uuid ?? Math.random().toString(36).slice(2),
          ai_headline: it.ai_headline ?? it.headline ?? it.title ?? '',
          ai_summary: it.ai_summary ?? it.summary ?? it.description ?? '',
          published_date: it.published_date ?? it.updated_at ?? it.created_at,
          created_at: it.created_at,
          s3_file_url: it.s3_file_url ?? buildS3UrlFromKey(it.s3_key ?? it.file_key),
          s3_key: it.s3_key ?? it.file_key,
          author: it.author ?? it.user_name ?? it.username ?? it.created_by ?? 'Anonymous',
        }));

      // Sort by created_at desc on client too as safety, fallback to published_date
      normalized.sort((a, b) => {
        const da = a.created_at ? Date.parse(a.created_at) : (a.published_date ? Date.parse(a.published_date) : 0);
        const db = b.created_at ? Date.parse(b.created_at) : (b.published_date ? Date.parse(b.published_date) : 0);
        return db - da;
      });

      return {
        results: normalized,
        total: data.total ?? data.count ?? normalized.length,
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}


