import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      {site.links.map((link) => {
        // mailto: hands off to a mail client — a new tab would just be left blank.
        const external = !link.href.startsWith("mailto:");
        return (
          <a
            key={link.href}
            href={link.href}
            {...(external && { target: "_blank", rel: "noreferrer" })}
          >
            {link.label}
          </a>
        );
      })}
    </footer>
  );
}
