# 🗄️ SnippetVault

Store, organize, and search your code snippets with syntax highlighting — all in a fast, dependency-free vanilla JS app backed by Supabase.

**[Live Demo](#)** · **[Report Bug](../../issues)** · **[Request Feature](../../issues)**

![SnippetVault](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Made with](https://img.shields.io/badge/made%20with-Vanilla%20JS-yellow)

## ✨ Features

- 📝 **Create & delete snippets** with title, language, tags, and code
- 🎨 **Syntax highlighting** for 15+ languages via [highlight.js](https://highlightjs.org/)
- 🔍 **Live search** across titles, code, and tags
- 🏷️ **Tag filtering** with clickable filter pills
- 🧰 **Language filtering** via dropdown
- 📋 **One-click copy** to clipboard
- ☁️ **Cloud-persisted** with Supabase (Postgres) — no local setup, no server to run
- 📱 **Responsive** layout for desktop and mobile

## 🖼️ Screenshots

> Add screenshots or a GIF of the app here once deployed, e.g. `docs/screenshot.png`.

## 🛠️ Tech Stack

| Layer      | Choice                                   |
|------------|-------------------------------------------|
| Frontend   | Vanilla JavaScript, HTML5, CSS3           |
| Backend    | [Supabase](https://supabase.com) (Postgres + auto-generated REST API) |
| Highlighting | [highlight.js](https://highlightjs.org/) |
| Hosting    | Any static host (GitHub Pages, Netlify, Vercel) |

No build step, no frameworks, no bundler — clone it and open `index.html`.

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/snippetvault.git
cd snippetvault
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Open the **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql) to create the `snippets` table and its security policies.
3. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**.

### 3. Configure the app

Open `js/supabaseClient.js` and replace the placeholders:

```js
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

### 4. Run it locally

Since this is a static site, any local server works. For example:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000` (or the port shown) in your browser.

## 📁 Project Structure

```
snippetvault/
├── index.html              # App markup
├── css/
│   └── style.css           # All styling
├── js/
│   ├── supabaseClient.js   # Supabase connection config
│   └── app.js               # App logic (CRUD, search, filters, rendering)
├── supabase/
│   └── schema.sql           # Database schema + RLS policies
├── .github/                 # Issue & PR templates
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md
```

## 🗺️ Roadmap

- [ ] Edit existing snippets
- [ ] User authentication (private snippet vaults per user)
- [ ] Export snippets as `.json` / `.md`
- [ ] Keyboard shortcuts (e.g. `n` for new snippet, `/` to focus search)
- [ ] Dark/light theme toggle

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and check the [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgements

- [Supabase](https://supabase.com) for the instant Postgres backend
- [highlight.js](https://highlightjs.org/) for syntax highlighting
