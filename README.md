# personal-site

Minimal personal site. A heading, a sub-heading, and grouped lists of links.

```bash
npm run dev
npm run build
```

## Adding content

Everything on the homepage comes from markdown files. There is no config list to
update — a new `.md` file is a new link, and a new folder is a new group.

```
articles/
  open-source/
    ledgerctl.md      ->  /open-source/ledgerctl
  writing/
    reading-a-flamegraph.md
```

### Frontmatter

```markdown
---
title: Reading a flamegraph        # defaults to the filename, titleized
description: A practical guide     # the dim middle column
date: 2024-11-02                   # the year column; also sorts the group
group: Writing                     # section heading; defaults to the folder name
order: 3                           # position of the section on the page
url: https://example.com/post      # optional — link out instead of rendering a page
---

Body markdown here. GFM, code blocks with syntax highlighting, tables.
```

All fields are optional. With `url` set, the entry links straight out and no
article page is generated; without it, the body is rendered at
`/[group]/[slug]`.

Within a group, entries sort newest first. Groups sort by `order`, then name.

## Editing the header and footer

Name, tagline, and footer links live in `lib/site.ts`.
