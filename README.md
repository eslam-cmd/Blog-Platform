# Blogs

An Arabic, right-to-left technical blog built with Next.js App Router. The home page lists published posts and categories, while individual post content is fetched from the platform API and rendered from Markdown.

## Features

- Arabic RTL layout with Cairo and Inter fonts.
- Blog home page with featured posts, recent posts, and category links.
- Individual post pages with Markdown and GitHub Flavored Markdown support.
- Syntax-highlighted fenced code blocks with a localized copy button.
- Plain, multi-line code snippets are detected and rendered as copyable code blocks when possible.
- Direct article sharing on LinkedIn and X, native device sharing, and copy-link support.
- Category pages.
- Per-post and per-category metadata, Article JSON-LD, and localized dynamic social share images.
- Server-side API fetching with a 60-second revalidation interval.
- One site-wide language menu for Arabic, English, German, Persian, and Russian.
- Article translations are generated when a post is published, stored in the PostgreSQL `posts.translations` JSONB column, and loaded by language without calling Gemini from the visitor's browser.
- The legacy `/blog` path redirects to `/`.

## Requirements

- Node.js compatible with Next.js 16 (Node.js 20.9 or later recommended).
- npm.
- Access to the posts API. By default, the app uses the deployed Binaa API; local or alternate APIs can be configured with an environment variable.

## Getting started

From this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment configuration

Create a `.env.local` file in the project root if the app should use an API other than the default:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_URL` is the API base URL. The posts helper appends `/posts` to this value. If it is not set, the app uses:

```text
https://binaa-server.vercel.app/api
```

Do not include `/posts` in the environment variable value.

`NEXT_PUBLIC_SITE_URL` is the canonical public URL used for SEO and share metadata. Set it to the deployed blog origin (for example, `https://blog.example.com`) in production. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL` is used if this variable is not set.

Article pages use `rehype-highlight` for Markdown code, with a copy control, and output Schema.org `Article` JSON-LD. Code-like paragraphs are detected as a fallback, but fenced Markdown is recommended for reliable language highlighting:

````markdown
```javascript
const greeting = "Hello";
console.log(greeting);
```
````

Article pages provide direct LinkedIn and X share links, the device's native share sheet where available, and a copy-link button. Their Open Graph and X images are generated on demand from the localized article title, author, and tags.

Set `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in the **platform API server's** environment, not in the public Blogs app. The server uses it to generate the four stored translations during publish/update. Keep the key private and never use a `NEXT_PUBLIC_` variable for it. Gemini must also allow requests from the server's deployment region; a VPN used by a visitor does not change where server-side translation requests originate. Publishing fails with an explicit error if translation fails; drafts can still be saved.

## Routes

| Route | Description |
| --- | --- |
| `/` | Blog home page with featured posts, recent posts, and categories. |
| `/blog/[slug]` | A post page. Unknown slugs show the not-found page. |
| `/blog/category/[category]` | Posts belonging to a category. Empty or unknown categories show the not-found page. |
| `/blog` | Legacy route that redirects to `/`. |

## Posts API

The app requests posts in the selected language from:

```http
GET {NEXT_PUBLIC_API_URL}/posts?lang=ar|en|de|fa|ru
```

The response is expected to contain a `posts` array:

```json
{
  "posts": [
    {
      "slug": "getting-started",
      "title": "Getting Started",
      "excerpt": "A short summary of the post.",
      "content": "# Post content in Markdown",
      "category": "Web Development",
      "tags": ["Next.js", "React"],
      "author": "Author Name",
      "cover_image": "/images/getting-started.jpg",
      "views": 0,
      "created_at": "2026-01-31T12:00:00.000Z",
      "updated_at": "2026-01-31T12:00:00.000Z"
    }
  ]
}
```

The platform API returns the original Arabic fields for `lang=ar`; for other supported languages it selects `title`, `excerpt`, `content`, `category`, `tags`, and `author` from `translations[lang]`. The `slug` remains unchanged so translated pages keep stable URLs. The home page and category pages use the translated metadata, and the post page renders the translated `content` field as Markdown. If an older post has no complete translation, the Arabic article is shown with a notice rather than silently presenting mixed-language content.

Posts are fetched on the server and cached with Next.js revalidation set to 60 seconds. Slugs are URL-decoded and Unicode-normalized before matching, which supports non-ASCII post slugs.

When the API request fails or does not return a `posts` array, the data helper logs an error and returns an empty collection (or `null` when looking up a single post). This means API connectivity is required for posts to appear.

## Language switcher

The floating language menu is rendered by the root layout and is available on all routes. It offers Arabic, English, German, Persian (Farsi), and Russian. Selecting a language changes the `lang` query parameter and fetches the stored translation from the platform API. Interface labels use local dictionaries; article content is never translated at visit time. The progress bar indicates page navigation while translated data loads. Arabic and Persian use right-to-left layout; English, German, and Russian use left-to-right.

The language is preserved in the URL, so refreshing or sharing an article keeps the selected language. New published posts are translated into English, German, Persian, and Russian in one server-side Gemini request before they are saved.

### Existing posts

After setting the Gemini key on the API server and applying the `posts.translations` JSONB column, run this once from `freelance-platform-admin/server` to translate published posts that are missing one or more locales:

```sql
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
```

```bash
npm run translate:posts
```

The command processes posts sequentially and skips posts that already have all four complete translations. It can be rerun safely after a temporary Gemini failure.

## Project structure

```text
blogs/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.jsx
│   │   ├── category/
│   │   │   └── [category]/
│   │   │       └── page.jsx
│   │   └── page.jsx             # Legacy /blog redirect
│   ├── favicon.ico
│   ├── components/
│   │   └── LanguageSwitcher.tsx
│   ├── globals.css
│   ├── layout.tsx               # Arabic RTL root layout and metadata
│   └── page.jsx                 # Blog home page
├── content/
│   └── posts/
│       └── hello-world.md       # Sample content; pages currently use the API
├── lib/
│   ├── i18n.js                  # Static interface labels and date formats
│   └── posts.js                 # Language-aware API access and post helpers
├── public/                      # Static assets
├── next.config.ts
├── package.json
└── tsconfig.json
```

The Markdown file under `content/posts/` is sample content. It is not currently loaded by the pages; publish posts through the API that serves the blog.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build. Run `npm run build` first. |
| `npm run lint` | Run ESLint. |

## Production

Set `NEXT_PUBLIC_API_URL` in the deployment environment if the production site should use a different API. Then run:

```bash
npm run build
npm run start
```

Ensure the deployed API is publicly reachable by the server-side Next.js application and returns the expected posts response.

## Main dependencies

- Next.js 16 and React 19.
- Tailwind CSS 4 for styling.
- `react-markdown` and `remark-gfm` for Markdown rendering.
- `react-icons` for interface icons.
