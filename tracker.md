# Project Progress Tracker

This file tracks the real-time progress of the Portfolio project, including task statuses, failures encountered, and how they were resolved.

---

## 📅 Project History Log

| Date | Activity / Task | Status | Details / Issues Faced | Resolution |
| :--- | :--- | :--- | :--- | :--- |
| 2026-06-13 | Init Git repository | **Completed** | None | Local repo initialized. |
| 2026-06-13 | Create initial files | **Completed** | None | Added `LICENSE` and `README.md` based on initial choices. |
| 2026-06-13 | Configure Remote Origin | **Completed** | Permission denied (403 Error) when pushing to `https://github.com/aswin-rd/portfolio.git` using user `rd-aswin`. | Switched remote URL to correct path `https://github.com/rd-aswin/portfolio.git`. |
| 2026-06-13 | Sync & Push Local Commit | **Completed** | Push rejected due to conflicting history (remote had a different `Initial commit` containing just `LICENSE`). | Ran `git pull --rebase origin main`, resolved conflict in `LICENSE` by combining changes, and completed rebase. |
| 2026-06-13 | Remote Push | **Completed** | None | Successfully pushed `main` to GitHub. |
| 2026-06-14 | Setup Planning & Design | **Completed** | None | Defined layout structure, Bento grid plans, and custom animations. Created `project.md` and `tracker.md`. |
| 2026-06-14 | Bootstrap Next.js App | **Completed** | `create-next-app` naming restriction error on folder `PorfolioAswin` containing capital letters. | Bootstrapped inside `portfolio/` subfolder and moved all files to workspace root. |
| 2026-06-14 | Install Dependencies | **Completed** | None | Installed Framer Motion, GSAP, and Lucide React. |
| 2026-06-14 | Component Implementation | **Completed** | Brand icons `Github` and `Linkedin` missing from `lucide-react` v1.18.0 due to brand logo removals in Lucide v1. | Created custom `src/components/ui/icons.tsx` with standard Feather SVG paths for Github and Linkedin. |
| 2026-06-14 | Testimonials Stack Overlap Fix | **Completed** | Content text from stacked lower cards showed through transparent glass cards causing overlap. | Rendered text details only on the active top card (`index === 0`) and gave cards a solid opaque background. |
| 2026-06-14 | Bento Hero Visualizer Update | **Completed** | Visualizer replaced with toggleable cards. | Implemented custom GitHub contribution calendar grid and Current Focus ("Now") tabs. |
| 2026-06-14 | Supabase Database Integration | **Completed** | API key requirement handles. | Created `src/lib/supabase.ts` with custom mock fallback client for demo mode. Integrated database insertion in `contact.tsx`. |
| 2026-06-14 | Cloudinary Upload Integration | **Completed** | Upload button configuration handles. | Installed `next-cloudinary` and created `upload-showcase.tsx` with dynamic formats and upload preset indicators. |
| 2026-06-14 | Verification (Lint & Build) | **Completed** | None | Successfully compiled production build using Turbopack with clean ESLint check. |

---

## 🛠️ Failures & Resolutions Archive

### Failure 1: Git Remote Push Permission Denied (403)
* **Error message:** `remote: Permission to aswin-rd/portfolio.git denied to rd-aswin. fatal: unable to access ...`
* **Root cause:** The username in the URL was typed as `aswin-rd` but the logged-in user credential on the system was `rd-aswin`.
* **Resolution:** Corrected the remote URL to `https://github.com/rd-aswin/portfolio.git` using `git remote set-url`.

### Failure 2: Conflicting History on Push
* **Error message:** `! [rejected] main -> main (fetch first) error: failed to push some refs...`
* **Root cause:** The remote repository was created on GitHub with an automatic `Initial commit` containing a `LICENSE` file, while the local repository also had an independent first commit.
* **Resolution:** 
  1. Ran `git pull --rebase origin main`.
  2. Resolved conflict in `LICENSE` to match the remote's author `RD Aswin`.
  3. Staged using `git add LICENSE` and finished with `git rebase --continue`.
  4. Pushed successfully.

### Failure 3: npm Naming Restriction on Bootstrap
* **Error message:** `Could not create a project called "PorfolioAswin" because of npm naming restrictions: name can no longer contain capital letters`
* **Root cause:** `create-next-app` uses the directory name for the npm package name when bootstrapped inside `./`. The directory `PorfolioAswin` has capital letters.
* **Resolution:** Bootstrapped the application in a temporary subdirectory `portfolio/` (lowercase) and then moved all created files up to the root.

### Failure 4: Missing Brand Icons in Lucide React v1
* **Error message:** `Export Github doesn't exist in target module` / `Export Linkedin doesn't exist in target module`
* **Root cause:** Lucide React version 1.x removed all brand assets and logos to prevent trademark issues and maintain design consistency.
* **Resolution:** Created a custom icons utility `src/components/ui/icons.tsx` exporting custom SVG components using the original Feather SVG coordinate paths.

### Failure 5: Glassmorphic Testimonial Card Text Overlap
* **Error message:** Visual text blur overlap observed in stack preview.
* **Root cause:** Cards are stacked absolutely on top of each other. Since their backgrounds are translucent glassmorphic elements, the text from the underlying cards bled through, clashing with the active top card.
* **Resolution:** Added a check to hide text contents for any card that is not currently the active top card (`index === 0`). Also applied a solid opaque background `bg-[#0c0c0e]` to prevent backdrop bleeding.
