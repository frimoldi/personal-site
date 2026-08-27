import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "articles");

export type Article = {
  group: string;
  groupSlug: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  year: string;
  href: string;
  external: boolean;
  order: number;
  body: string;
};

export type Group = {
  name: string;
  slug: string;
  order: number;
  articles: Article[];
};

// YAML parses an unquoted `date: 2025-04-02` into a Date, a quoted one into a string.
function toISODate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "";
}

function titleize(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function readGroup(groupSlug: string): Promise<Group | null> {
  const dir = path.join(ARTICLES_DIR, groupSlug);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".md"));
  if (files.length === 0) return null;

  const articles = await Promise.all(
    files.map(async (file) => {
      const slug = file.name.replace(/\.md$/, "");
      const raw = await fs.readFile(path.join(dir, file.name), "utf8");
      const { data, content } = matter(raw);
      const url = typeof data.url === "string" ? data.url : "";
      const date = toISODate(data.date);
      return {
        group: typeof data.group === "string" ? data.group : titleize(groupSlug),
        groupSlug,
        slug,
        title: typeof data.title === "string" ? data.title : titleize(slug),
        description: typeof data.description === "string" ? data.description : "",
        date,
        // `showYear: false` orders an entry by date without surfacing the year.
        year: data.showYear === false ? "" : date.slice(0, 4),
        href: url || `/${groupSlug}/${slug}`,
        external: Boolean(url),
        order: typeof data.order === "number" ? data.order : 0,
        body: content,
      } satisfies Article;
    }),
  );

  // Newest first; ties broken by title so ordering stays stable across builds.
  articles.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

  return {
    name: articles[0].group,
    slug: groupSlug,
    order: Math.min(...articles.map((a) => a.order)),
    articles,
  };
}

export async function getGroups(): Promise<Group[]> {
  let entries;
  try {
    entries = await fs.readdir(ARTICLES_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const groups = await Promise.all(
    entries.filter((e) => e.isDirectory()).map((e) => readGroup(e.name)),
  );

  return groups
    .filter((g): g is Group => g !== null)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export async function getArticle(groupSlug: string, slug: string): Promise<Article | null> {
  const group = await getGroups();
  return (
    group
      .find((g) => g.slug === groupSlug)
      ?.articles.find((a) => a.slug === slug && !a.external) ?? null
  );
}
