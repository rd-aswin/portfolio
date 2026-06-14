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
| 2026-06-14 | Bootstrap Next.js App | **Pending** | Awaiting user approval to run bootstrapping. | |

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
