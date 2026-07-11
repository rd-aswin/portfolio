# Aswin | Software Engineer
> Specialized in Resilient Systems & High-Performance Interfaces

A premium, interactive personal portfolio website featuring a dark-mode glassmorphic Bento grid, smooth entrance animations, drag-to-dismiss testimonials, and a fully customizable administrative control panel.

🔗 **[Live Link](https://portfolio-ivory-two-r8gpx0k49h.vercel.app/)**

---

## Preview

![Bento Grid Dashboard Preview](https://res.cloudinary.com/cld-sample-5/image/upload/v1/cld-sample-5)
*(Tip: Replace this link or upload your own screenshots to the repository)*

---

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** CSS & Tailwind CSS v4
* **Animations:** GSAP (entrance timelines) & Framer Motion (page transitions, swipe gestures)
* **Database & Submissions:** Supabase (PostgreSQL with Row-Level Security)
* **Mobile Alerts:** Telegram Bot API
* **File Hosting:** Cloudinary (secure server-side CV & image uploads)

---

## Key Features
* 🎛️ **Secure Control Center:** Manage the entire portfolio live at `/admin` (secured behind password session storage).
* 📩 **Instant Push Alerts:** When a client uses the contact form, details are dispatched directly to your phone via a Telegram Bot.
* 📈 **Live GitHub activity Graph:** Scrapes and renders your actual GitHub contributions grid, commits count, and streak count in real-time.
* 💼 **Dynamic Experience Timeline:** Add and delete professional, academic, or award journey cards live from the admin page.
* 🚀 **Interactive Focus (Now) Tab:** Configurable live indicators for what you're currently building, learning, working toward, or jamming to.
* 📄 **Dynamic CV Uploader:** Securely upload your CV PDF to Cloudinary and download it directly from the homepage.

---

## Why I Built It & Design Decisions
* **Performance first:** Built on Next.js for server-side generation (SSG) to achieve near-instantaneous page loads.
* **Premium Aesthetics:** Used dynamic CSS glassmorphism, animated mesh gradient loops, custom typography, and spring-physics micro-interactions to create a sleek, modern, and memorable user experience.
* **Secure by Design:** Kept sensitive keys (Cloudinary API secrets, Telegram Bot tokens) restricted strictly to server-side endpoints, protecting the codebase from client-side token leaks.

---

## Setup Instructions

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/rd-aswin/portfolio.git
cd portfolio
npm install
```

### 2. Configure Environment Keys
Create a `.env.local` file in the project root and add the following keys:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Panel Credentials
ADMIN_PASSWORD=your_secure_admin_password
CRON_SECRET=your_custom_cron_verification_secret

# Cloudinary Secure File Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Setup Database Tables
Run the SQL queries defined in [supabase_setup.sql](supabase_setup.sql) inside the **Supabase SQL Editor** to bootstrap your schema and Row-Level Security (RLS) policies.

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your site, and head to [http://localhost:3000/admin](http://localhost:3000/admin) to log in and configure your details.

---

## Connect & Contact
* **Email:** aswin@example.com
* **GitHub:** [@rd-aswin](https://github.com/rd-aswin)
