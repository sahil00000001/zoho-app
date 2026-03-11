# PeopleOS — HR for Modern Teams

A lightweight, high-adoption HR platform built for 50–200 person organizations. Built with Next.js 15, Tailwind CSS 4, and framer-motion.

---

## Modules

| Module | Route | Description |
|---|---|---|
| Landing Page | `/` | Marketing page with hero, features, testimonials |
| Login | `/login` | Email-based authentication |
| Signup | `/signup` | 2-step onboarding with company setup |
| Dashboard | `/dashboard` | Overview: KPIs, activity feed, leave calendar |
| Attendance & Leave | `/dashboard/attendance` | Check-in, leave requests, team attendance table |
| Employee Directory | `/dashboard/directory` | Grid/list/org-chart view, profile drawer |
| Approval Workflows | `/dashboard/approvals` | Multi-step approvals for leave, expenses, hiring |
| Organization Documents | `/dashboard/documents` | Upload, categorize, version-control company docs |

---

## Design System

- **Primary gradient:** `linear-gradient(90deg, rgb(220, 38, 38), rgb(249, 115, 22))`
- **Background:** White (`#ffffff`)
- **Gradient text:** `.gradient-text` CSS class
- **Glass cards:** `.glass-card` CSS class
- **Fonts:** Geist Sans + Geist Mono

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Animations:** CSS keyframes (blob, shimmer, fadeInUp)
- **Icons:** Emoji (zero-dependency)

---

## Running Locally

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Steps

**1. Navigate to the project folder:**

```bash
cd path/to/zoho-app
```

**2. Install dependencies:**

```bash
npm install
```

**3. Start the development server:**

```bash
npm run dev
```

**4. Open your browser:**

```
http://localhost:3000
```

The app hot-reloads on every file save.

---

## Other Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── login/page.tsx            # Login
│   ├── signup/page.tsx           # Signup
│   └── dashboard/
│       ├── layout.tsx            # Dashboard shell (sidebar + topbar)
│       ├── page.tsx              # Dashboard home
│       ├── attendance/page.tsx   # Attendance & Leave
│       ├── directory/page.tsx    # Employee Directory
│       ├── approvals/page.tsx    # Approval Workflows
│       └── documents/page.tsx    # Org Documents
├── components/
│   ├── Sidebar.tsx               # Collapsible sidebar nav
│   └── TopBar.tsx                # Top header with search + notifications
└── app/globals.css               # Global styles + CSS utilities
```

---

## Notes

- All data is currently **mock/in-memory** — no backend required to run
- Forms and actions (check-in, approve leave, etc.) simulate real interactions with `setTimeout`
- Ready to wire up to a real API by replacing mock data in each page
