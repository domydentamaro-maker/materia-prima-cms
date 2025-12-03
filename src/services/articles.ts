import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];
type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];
type ArticleStatus = Database["public"]["Enums"]["article_status"];

export interface ArticleWithRelations extends Article {
  author?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  article_tags?: {
    tags: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export interface ArticleFilters {
  status?: ArticleStatus;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: "created_at" | "published_at" | "title" | "views_count";
  sortOrder?: "asc" | "desc";
}

// Fetch articles with filters and pagination
export async function fetchArticles(
  filters: ArticleFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: ArticleWithRelations[]; count: number; error: Error | null }> {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "created_at",
    sortOrder = "desc",
  } = pagination;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("articles")
    .select(
      `
      *,
      author:profiles!articles_author_id_fkey(id, full_name, email),
      categories(id, name, slug),
      article_tags(tags(id, name, slug))
    `,
      { count: "exact" }
    )
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(from, to);

  // Apply filters
  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.authorId) {
    query = query.eq("author_id", filters.authorId);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
    );
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    return { data: [], count: 0, error };
  }

  // Filter by tag if specified (requires post-processing)
  let filteredData = data as ArticleWithRelations[];
  if (filters.tagId) {
    filteredData = filteredData.filter((article) =>
      article.article_tags?.some((at) => at.tags.id === filters.tagId)
    );
  }

  return { data: filteredData, count: count || 0, error: null };
}

// Fetch published articles only (for public pages)
export async function fetchPublishedArticles(
  filters: Omit<ArticleFilters, "status"> = {},
  pagination: PaginationOptions = {}
) {
  return fetchArticles({ ...filters, status: "published" }, pagination);
}

// Fetch single article by slug
export async function fetchArticleBySlug(
  slug: string
): Promise<{ data: ArticleWithRelations | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      author:profiles!articles_author_id_fkey(id, full_name, email),
      categories(id, name, slug),
      article_tags(tags(id, name, slug))
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error fetching article:", error);
    return { data: null, error };
  }

  return { data: data as ArticleWithRelations | null, error: null };
}

// Fetch single article by ID (for admin)
export async function fetchArticleById(
  id: string
): Promise<{ data: ArticleWithRelations | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      author:profiles!articles_author_id_fkey(id, full_name, email),
      categories(id, name, slug),
      article_tags(tags(id, name, slug))
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching article:", error);
    return { data: null, error };
  }

  return { data: data as ArticleWithRelations | null, error: null };
}

// Create article
export async function createArticle(
  article: ArticleInsert,
  tagIds: string[] = []
): Promise<{ data: Article | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("articles")
    .insert(article)
    .select()
    .single();

  if (error) {
    console.error("Error creating article:", error);
    return { data: null, error };
  }

  // Add tags
  if (tagIds.length > 0 && data) {
    const tagInserts = tagIds.map((tagId) => ({
      article_id: data.id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase
      .from("article_tags")
      .insert(tagInserts);

    if (tagError) {
      console.error("Error adding tags:", tagError);
    }
  }

  return { data, error: null };
}

// Update article
export async function updateArticle(
  id: string,
  updates: ArticleUpdate,
  tagIds?: string[]
): Promise<{ data: Article | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating article:", error);
    return { data: null, error };
  }

  // Update tags if provided
  if (tagIds !== undefined) {
    // Remove existing tags
    await supabase.from("article_tags").delete().eq("article_id", id);

    // Add new tags
    if (tagIds.length > 0) {
      const tagInserts = tagIds.map((tagId) => ({
        article_id: id,
        tag_id: tagId,
      }));

      const { error: tagError } = await supabase
        .from("article_tags")
        .insert(tagInserts);

      if (tagError) {
        console.error("Error updating tags:", tagError);
      }
    }
  }

  return { data, error: null };
}

// Delete article
export async function deleteArticle(
  id: string
): Promise<{ error: Error | null }> {
  // Tags are deleted automatically via cascade
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting article:", error);
    return { error };
  }

  return { error: null };
}

// Increment view count
export async function incrementViewCount(
  id: string
): Promise<{ error: Error | null }> {
  // Get current count and increment
  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("views_count")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !article) {
    return { error: fetchError };
  }

  const { error } = await supabase
    .from("articles")
    .update({ views_count: article.views_count + 1 })
    .eq("id", id);

  return { error };
}

// Fetch categories
export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return { data: data || [], error };
}

// Fetch tags
export async function fetchTags() {
  const { data, error } = await supabase.from("tags").select("*").order("name");

  return { data: data || [], error };
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
