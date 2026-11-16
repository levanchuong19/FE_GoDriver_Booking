import api from "./api";
import { unwrapData, unwrapList } from "../Utils/apiData";

export type CommunityAdminPost = {
  id: string;
  type?: string;
  title?: string;
  content?: string;
  visibility?: string;
  status?: string;
  isAnonymous?: boolean;
  author?: { id?: string | null; fullName?: string; avatar?: string | null };
  authorEmail?: string | null;
  authorPhone?: string | null;
  reactionCount?: number;
  commentCount?: number;
  createdAt?: string;
  deletedAt?: string | null;
  media?: { url?: string }[];
  topics?: { name?: string; slug?: string }[];
};

export type CommunityAdminReport = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  description?: string;
  status: string;
  reporter?: { id?: string; fullName?: string } | null;
  createdAt?: string;
};

export async function listCommunityAdminPosts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  visibility?: string;
  q?: string;
  includeDeleted?: string;
}) {
  const res = await api.get("/community/admin/posts", { params });
  return unwrapList<CommunityAdminPost>(unwrapData(res.data));
}

export async function getCommunityAdminPost(id: string) {
  const res = await api.get(`/community/admin/posts/${id}`);
  return unwrapData<{
    post: CommunityAdminPost;
    comments: Array<{
      id: string;
      content: string;
      author?: { fullName?: string };
      createdAt?: string;
      deleted?: boolean;
    }>;
  }>(res.data);
}

export async function moderateCommunityAdminPost(
  id: string,
  action: "HIDE" | "REMOVE" | "RESTORE" | "LOCK_COMMENTS" | "UNLOCK_COMMENTS",
) {
  const res = await api.post(`/community/admin/posts/${id}/moderate`, { action });
  return unwrapData(res.data);
}

export async function listCommunityAdminReports(params?: {
  status?: string;
  limit?: number;
}) {
  const res = await api.get("/community/admin/reports", { params });
  const data = unwrapData<{ items: CommunityAdminReport[] }>(res.data);
  return { items: data?.items || [] };
}

export async function moderateCommunityAdminReport(
  id: string,
  body: {
    action:
      | "DISMISS"
      | "HIDE_POST"
      | "REMOVE_POST"
      | "HIDE_COMMENT"
      | "REMOVE_COMMENT";
    note?: string;
  },
) {
  const res = await api.post(`/community/admin/reports/${id}/moderate`, body);
  return unwrapData(res.data);
}
