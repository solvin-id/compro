# Solvin — Design Architecture

Swiss International Typographic Style system with exposed architectural-blueprint
structure and CAD/Figma-style bounding-box interaction on focal elements only.

Stack: TanStack Start/Router, React 19, Vite 7, Tailwind CSS 4, Drizzle/Postgres,
`next-themes`, `i18next`, Lenis.

## Audit (ground truth)

- **Routing:** `src/routes/index.tsx` (home), `portfolio.tsx` (case-study list, no
  detail route), `articles.index.tsx`, `articles.$slug.tsx`, `start.tsx`,
  `unsubscribe.tsx`, `admin/*`. Route tree is generated into `src/routeTree.gen.ts`;
  never hand-edit it.
- **Data:** `getPublishedPortfolioFn()` and `getPublishedArticlesFn()` are server
  functions. `.env` sets `BACKEND_ENABLED=false`, so the public portfolio returns 3
  constant items (`medicore-systems`, `finflow-global`, `luxstay-resorts`). Portfolio
  fields: `id, slug, title, year, sector, description, client, problem, solution,
  outcome, techStack (JSON string), image (object key|null), status, displayOrder`.
  No schema change is needed.
- **Services/team:** `useServicesData()` and `useTeamData()` in
  `src/hooks/useTranslatedData.ts`; service/team copy is in
  `src/locales/{en,id}/common.json`. `src/data.ts` also contains unused static copies.
- **Styling:** Tailwind 4 tokens live in `src/styles.css`. Semantic colors were HSL
  triples mapped through `@theme`; brand colors were hardcoded. There was **no
  `@custom-variant dark`**, so `dark:` utilities followed the OS, not the
  `next-themes` class. `next-themes` is configured with `attribute="class"` and
  `defaultTheme="system"`; its provider injects the pre-paint script.
- **Legacy decoration:** `BackgroundLayer` (home + 404), `InteractiveBackground`
  (articles), `IntelligentCursor`/`HoverTrigger`/`useCursorStore` (unused or
  cursor-only), `TeamSchematic` (canvas-like hotspot layout), `Portfolio` marquee.

## Brand

The company mark ships as `public/brand/solvin-mark.png` (512×512, transparent,
cropped from the supplied artwork) with `public/brand/solvin-favicon.png` (64×64).
It appears in the navbar logo cell, the footer brand cell and the document icon.
The mark uses the brand orange `#EEA720` and the light pink `#FCE5FC`; the UI accent
is derived from the orange, never re-tinted.

## Runtime switch

`BACKEND_ENABLED` in `.env` is the single backend switch, read once in `src/env.ts`
and shipped to the shell through the root route's `beforeLoad`.

| Value | Behavior |
| ----- | -------- |
| `true` | Server functions use Postgres, storage and SMTP. |
| `false` | Server functions return the constant fixtures (`src/functions/*`), the Insights section and its nav cell are hidden, article routes resolve to the empty/not-found state, and the newsletter refuses writes. |

Switching requires restarting the dev server (or redeploying); no rebuild of the
client is needed because the flag travels in the router payload.

## Information architecture

| Route          | Purpose                                                 | Source                          |
| -------------- | ------------------------------------------------------- | ------------------------------- |
| `/`            | Company profile, 7 numbered sections                    | portfolio + articles server fns |
| `/portfolio`   | Flagship catalog: schematic grid + technical index      | `getPublishedPortfolioFn`       |
| `/portfolio/$slug` | Architectural spec sheet for one artifact           | `getPortfolioItemBySlugFn`      |
| `/articles`    | Insight index, restyled                                 | `getPublishedArticlesFn`        |
| `/articles/$slug` | Article detail, restyled prose                       | `getArticleBySlugFn`            |
| `/start`       | Project intake wizard, restyled                         | local state + WhatsApp deep link |
| `/unsubscribe` | Transactional; behavior unchanged                       | newsletter fn                   |
| `/admin/*`     | CRUD; structure unchanged, tokens inherited             | existing fns                    |

Home sections and anchors:

| #  | ID             | Section                                      | Old source         |
| -- | -------------- | -------------------------------------------- | ------------------ |
| 01 | `top`          | Hero + system schematic + status strip       | inline `Hero`      |
| 02 | `profile`      | Company profile, spec table, quote, metrics  | `About`            |
| 03 | `capabilities` | Service matrix with hover-revealed deliverables | `Services` + modal |
| 04 | `method`       | Five-gate delivery pipeline                  | new                |
| 05 | `personnel`    | Five person spec cards                       | `TeamSchematic`    |
| 06 | `work`         | Three selected artifacts                     | `Portfolio` marquee |
| 07 | `insights`     | Featured article + index rows                | `Insights`         |

## Visual grammar rules

1. **Grid:** 12 columns; max width `1600px`; `1px` vertical page hairlines at `md+`;
   sections separated by `1px` horizontal hairlines; spacing scale 8px. Crosshairs
   (`+`) appear only at container corners, never on every cell.
2. **Typography:** Inter for display/body; display weight 600, tracking `-0.03em`
   (hero `-0.045em`, line-height `0.9`); body 400/1.65, max 72ch; JetBrains Mono for
   all technical labels at 10–12px, uppercase, tracking `0.06em`. Preserve authored
   sentence case in headings; do not uppercase display copy.
3. **Color:** Only the token set below. `--accent` is the Solvin brand orange
   (`#EEA720`) and is reserved for fills, bounding boxes, markers and graphics;
   `--accent-strong` is the readable tone used for accent text, links and focus
   rings; signal red is non-text only (errors, tags, status squares); no gradients,
   no colored shadows, no decorative orbs.
4. **Geometry:** Public UI border radius is `0`. No shadows. Structural elements are
   defined by `1px` lines and exposed cells, not cards floating on gradients. Admin
   keeps its existing rounding.
5. **Bounding boxes:** Apply only to (a) hero headline — permanently `active`; (b)
   portfolio/project cards — on hover/focus-within; (c) interactive callouts (quote,
   “unsure” CTA); (d) project-detail hero — permanently active with live dimensions.
   Never wrap body copy, metric cells, or every service card. Handles are 6×6px;
   badges are 10px mono with `aria-hidden`.
6. **Motion:** CSS only for new surfaces; `150ms cubic-bezier(0.2, 0.6, 0.2, 1)`;
   animate opacity/border-color/transform only. No scroll-triggered reveals. Respect
   `prefers-reduced-motion`. Lenis remains for smooth scrolling, disabled for reduced
   motion.
7. **Responsive:** 12 → 6 → 1 column collapse; hairlines and corner crosshairs remain
   at every breakpoint; hover-revealed content is always visible on touch
   (`@media (hover: none)`); the technical index scrolls horizontally inside its own
   container, never the page.
8. **Accessibility:** semantic `<section aria-labelledby>`, native
   `<select>`/`<input>`, `aria-live="polite"` for filter counts, `aria-pressed` for
   view toggles, `scope` on table headers, focus-visible accent outline, `aria-hidden`
   on decorative handles/coordinates, contrast-safe monochrome text.

## Tokens

| Token             | Light “Swiss Drafting Paper” | Dark “CAD Terminal”     | Use                     |
| ----------------- | ---------------------------- | ----------------------- | ----------------------- |
| `--canvas`        | `#F6F6F3`                    | `#090B0E`               | page background         |
| `--surface`       | `#FFFFFF`                    | `#11141A`               | cards, nav, inputs      |
| `--surface-2`     | `#EFEFEA`                    | `#171B23`               | rails, code, placeholders |
| `--ink`           | `#0F1115`                    | `#F1F5F9`               | primary text            |
| `--ink-muted`     | `#525866`                    | `#8A94A6`               | secondary/meta          |
| `--line`          | `rgba(15,17,21,0.10)`        | `rgba(241,245,249,0.09)` | hairlines              |
| `--line-strong`   | `rgba(15,17,21,0.22)`        | `rgba(241,245,249,0.20)` | rulers, handles        |
| `--grid`          | `rgba(15,17,21,0.045)`       | `rgba(241,245,249,0.045)` | minor grid            |
| `--grid-major`    | `rgba(15,17,21,0.075)`       | `rgba(241,245,249,0.075)` | major grid            |
| `--accent`        | `#EEA720`                    | `#EEA720`               | brand fill: buttons, bounding boxes, markers |
| `--accent-strong` | `#9A5800`                    | `#F3B53F`               | accent text, links, focus (contrast-safe) |
| `--accent-ink`    | `#0F1115`                    | `#0F1115`               | text on accent          |
| `--accent-soft`   | `rgba(238,167,32,0.14)`      | `rgba(238,167,32,0.16)` | hover fill              |
| `--signal`        | `#B42318`                    | `#FF7A59`               | errors, non-text markers |
| `--success`       | `#0F7A4F`                    | `#10B981`               | status                  |

Legacy HSL mappings for admin/compat: light `--background: 60 14% 96%`,
`--foreground: 220 14% 7%`, `--card: 0 0% 100%`, `--muted: 60 10% 92%`,
`--muted-foreground: 222 10% 36%`, `--border: 220 10% 88%`,
`--ring: 221 100% 50%`; dark `--background: 216 22% 5%`,
`--foreground: 210 40% 96%`, `--card: 220 21% 8%`, `--muted: 220 15% 13%`,
`--muted-foreground: 218 14% 60%`, `--border: 220 12% 16%`,
`--ring: 199 89% 60%`.

## Component tree

```text
RootDocument
├─ ThemeProvider / I18nextProvider
├─ Navbar
│  ├─ Logo cell
│  ├─ Nav cells (01–05) + active state
│  ├─ CoordinateReadout
│  ├─ ThemeToggle / LanguageToggle
│  └─ CTA cell → /start
├─ <main>
│  ├─ Home (PageShell)
│  │  ├─ Hero (BoundingBoxFrame, HeroSchematic, SpecTable)
│  │  ├─ Profile (SchematicSectionHeader, SpecTable, metrics)
│  │  ├─ Capabilities (SchematicSectionHeader, ServiceCell/BoundingBoxFrame)
│  │  ├─ Method (SchematicSectionHeader, ProcessPipeline)
│  │  ├─ Personnel (SchematicSectionHeader, PersonnelCard)
│  │  ├─ SelectedWork (SchematicSectionHeader, ProjectCard)
│  │  └─ Insights (SchematicSectionHeader, featured + index rows)
│  ├─ PortfolioIndex
│  │  ├─ CatalogMasthead
│  │  ├─ CatalogFilters (search / category / stack / year / reset / view switch)
│  │  ├─ CatalogGrid (ProjectPlate + BoundingBoxFrame)
│  │  └─ CatalogTable (semantic technical index)
│  ├─ PortfolioDetail (CaseSpecSheet: overview, problem, architecture, delivery, specs)
│  ├─ ArticlesIndex / ArticleDetail
│  └─ StartWizard (restyled shell, logic unchanged)
└─ Footer (company / solutions / contact / newsletter / status bar)

ui/blueprint
├─ BlueprintGridContainer → Crosshairs
├─ BoundingBoxFrame → useElementSize
├─ SchematicSectionHeader → Ruler
├─ SpecTable
├─ ThemeToggle
└─ CoordinateReadout
```

## Content mapping

| Existing                       | New                                          | Notes                                          |
| ------------------------------ | -------------------------------------------- | ---------------------------------------------- |
| Inline centered hero + orbs    | `sections/Hero.tsx`                          | asymmetric 7/5 split; permanent bounding box   |
| `About`                        | `sections/Profile.tsx`                       | spec table + quote callout + metrics           |
| `Services` modal grid          | `sections/Capabilities.tsx`                   | asymmetric 12-col bento; inline reveal, modal removed |
| —                              | `sections/Method.tsx`                        | five gates with outputs                        |
| `TeamSchematic`                | `sections/Personnel.tsx`                     | 5-column spec cards, portraits                 |
| `Portfolio` marquee            | `sections/SelectedWork.tsx`                  | 3 framed artifacts + catalog link              |
| `Insights`                     | `sections/Insights.tsx`                      | featured + compact rows                        |
| `/portfolio` case list         | `/portfolio` catalog + `/portfolio/$slug`    | filters, grid/index, spec sheet                |
| `/articles`                    | restyled list/detail                         | prose tokenized                                |
| `/start`                       | restyled wizard                              | classes/icons only, logic unchanged            |
| Admin                          | unchanged                                    | token inheritance + remove `text-gradient` only |

## Scope boundary

`/admin/*` and `/unsubscribe` keep their structures and behavior; they inherit the
token palette only. The public surface is `/`, `/portfolio`, `/portfolio/$slug`,
`/articles`, `/articles/$slug`, `/start`, and the 404 boundary.
