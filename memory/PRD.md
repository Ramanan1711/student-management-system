# Student Management System - PRD

## Original Problem Statement
Build a responsive student management admin portal (interview task from provided PDF + video), with realistic local demo data since backend is not required.

## Architecture
- Frontend: Vite + React 19 + TypeScript + Tailwind CSS 4 (/app/frontend)
- Backend: Minimal FastAPI stub with /api/health (/app/backend) — deployment shell only
- State: React Context DataStore (in-memory) shared across all pages
- Toast provider for user feedback

## Modules (all interactive)
- Login (client-side demo auth)
- Dashboard: KPIs (revenue, students, pending fees, batches) driven from store, revenue chart with 12M/6M/30D filters, recent activity from live walk-ins + tasks, "View All" → /reports
- Header: dynamic route title, global search of students+walk-ins with dropdown results, notifications bell with dismissable items + badge count, security dropdown with sign-out-other-sessions
- Students: search + mode filter, row + button click → profile
- Registration: full form + validation, batch select populated from store, fee pending auto-derived
- Walk-ins: search + status filter, add via modal, status badges, notification pushed on save
- Admissions: student ledger search, Pending Amount auto-calculated read-only, Record Payment toast
- Batches: search, add via modal, trainer select fed from Employees store
- Employees: search + type filter, add via modal
- Attendance: date + batch filter, per-student Present/Absent/Leave pills, Save writes to store and updates aggregate stats
- Tasks: search + priority + status filters, create modal, mark-complete/reopen toggle
- Reports: view (progress/attendance/fee) + batch filter, CSV export download, Print
- Class Reports: batch filter + search + drill-down detail modal
- Performance: metric filter + batch filter + drill-down modal

## What's Been Implemented
- 2026-01: Full frontend student management portal with all modules and mock data
- 2026-01: Deep-blue admin UI, responsive sidebar/mobile menu, form validation, student search/profile flow
- 2026-01: Deployment fix — restructured /app into /app/frontend + /app/backend, added FastAPI stub, start script, vite bind 0.0.0.0:3000, removed .env from .gitignore
- 2026-01: Complete interactive audit fix — shared DataStore Context, toast provider, dynamic header title, working global search + notifications + security dropdowns, working View All, cross-page create persistence, mark-attendance UI, task create/toggle/filter, admissions auto-pending, batches/employees search + create, reports export CSV + print, class-reports + performance drill-down modals

## Verified (testing agent iteration_4)
- All 4 previously-flagged regressions PASS
- Cross-page persistence works via SPA navigation
- Zero console errors across full flow

## Backlog
- P1: Persist DataStore to localStorage so data survives refresh
- P1: Real backend CRUD + auth (currently in-memory demo)
- P2: PDF report export
- P2: Class/video records timeline in student profile
- P2: Role-based workspaces (counsellor/trainer/student)
