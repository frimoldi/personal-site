import Link from "next/link";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { getGroups } from "@/lib/articles";
import { site } from "@/lib/site";

export default async function Home() {
  const groups = await getGroups();

  return (
    <div className="page">
      <div className="shell">
        <header className="header">
          <div className="identity">
            <h1 className="name">{site.name}</h1>
            <p className="tagline">
              {site.tagline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main className="groups">
          {groups.map((group) => (
            <section key={group.slug} className="group">
              <h2 className="groupTitle">{group.name}</h2>
              <div className="list">
                {group.articles.map((article) => {
                  const content = (
                    <>
                      <span className="itemTitle">{article.title}</span>
                      <span className="itemDescription">{article.description}</span>
                      <span className="itemYear">{article.year}</span>
                    </>
                  );

                  return article.external ? (
                    <a
                      key={article.slug}
                      className="item"
                      href={article.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link key={article.slug} className="item" href={article.href}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </main>

        <Footer />
      </div>
    </div>
  );
}
