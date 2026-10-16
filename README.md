# Portfolio

A single-page developer portfolio for **Stoyan Yordanov**, listing every public
repository from `github.com/forklift-operator`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure — header, about, projects, tech stack, contact, footer |
| `style.css` | Dark, minimal theme (custom properties, responsive grid) |
| `projects.js` | Project data — one object per repository |
| `script.js` | Renders cards, language filters, click-to-copy email |

## Running it

No build step, no dependencies. Either:

- double-click `index.html`, or
- serve the folder locally:

```bash
python -m http.server 5173
# then open http://localhost:5173
```

## Editing content

**Add or change a project** — edit the `PROJECTS` array in `projects.js`:

```js
{
  name: "repo-name",              // GitHub repo slug, used for links
  title: "Display Name",
  year: "2026",
  lang: "Java",                   // also drives the language filter
  tags: ["Spring Boot", "MySQL"],
  desc: "One or two sentences.",
  fork: true,                     // optional badge
}
```

The filter bar and per-language counts are generated automatically, and
languages with no projects are dropped from the bar.

**Contact details** — the email is set in `index.html` via the `data-email`
attributes on the two email links (`.about-link.email-link` and
`.contact-link.email-contact`); `script.js` copies that attribute value as-is.
Update both attributes together with the visible text in the contact section.

**Project thumbnails** — cards currently use generated gradient banners with a
language label and initials, so the page needs no image assets. To use real
screenshots, drop files into an `img/` folder and add an `<img>` inside
`.project-banner` in `cardHtml()` (`script.js`).

## Design notes

Inspired by the structure and dark palette of andresilva.tech: narrow centered
column, underlined inline links, a two-column project grid of bordered cards
with tag pills and `Source Code` buttons, plus a `View More` button. Additions
here: a language filter bar, per-project year, consistent typography and
web-font fallbacks, `prefers-reduced-motion` support, and a clipboard fallback
for non-secure contexts.
