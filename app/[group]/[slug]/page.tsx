import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { getArticle, getGroups } from "@/lib/articles";
import { renderMarkdown } from "@/lib/markdown";

type Params = { params: Promise<{ group: string; slug: string }> };

export async function generateStaticParams() {
  const groups = await getGroups();
  return groups.flatMap((group) =>
    group.articles
      .filter((article) => !article.external)
      .map((article) => ({ group: group.slug, slug: article.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { group, slug } = await params;
  const article = await getArticle(group, slug);
  if (!article) return {};
  return { title: article.title, description: article.description };
}

export default async function ArticlePage({ params }: Params) {
  const { group, slug } = await params;
  const article = await getArticle(group, slug);
  if (!article) notFound();

  const html = await renderMarkdown(article.body);

  return (
    <div className="page">
      <div className="shell">
        <header className="header">
          <Link className="back" href="/">
            ← {article.group}
          </Link>
          <ThemeToggle />
        </header>

        <main>
          <div className="articleHeader">
            <h1 className="name">{article.title}</h1>
            {article.description && <p className="tagline">{article.description}</p>}
            {article.year && <div className="articleMeta">{article.year}</div>}
          </div>
          <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
