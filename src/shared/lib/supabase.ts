import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  status: "draft" | "published";
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  category?: string;
}
