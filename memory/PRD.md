# Student Management System - PRD

## Original Problem Statement
Build a responsive student management admin portal (interview task from provided PDF + video), with realistic local demo data since backend is not required.

## Architecture
- Frontend: Vite + React 19 + TypeScript + Tailwind CSS 4 (in /app/frontend)
- Backend: Minimal FastAPI stub with /api/health (in /app/backend)
- Database: MongoDB (available; not currently used by the app)
- Data: Local mock data via /app/frontend/src/services/studentService.ts

## Core Requirements
- Login + protected routes
- Dashboard with KPI cards, charts, filters, activity feed
- Modules: Students, Registration, Walk-ins, Admissions, Batches, Employees/Trainers, Attendance, Reports, Tasks
- Responsive layout with mobile sidebar

## What's Been Implemented
- 2026-01: Full frontend student management portal with all modules and mock data
- 2026-01: Deep-blue admin UI, responsive sidebar/mobile menu, form validation, student search/profile flow
- 2026-01: Deployment fix — restructured /app into standard /app/frontend + /app/backend layout, added FastAPI stub, added start script to package.json, configured Vite to bind 0.0.0.0:3000, removed .env from .gitignore

## Deployment
- /app/frontend and /app/backend directories present
- /app/backend/.env and /app/frontend/.env committed
- vite.config.ts binds host 0.0.0.0 port 3000 with allowedHosts: true
- package.json has "start" script for supervisor
- Deployment agent status: PASS

## Backlog
- P1: Real backend persistence (replace mock data with FastAPI + MongoDB CRUD)
- P1: Server-side authentication (JWT or Emergent Google Auth)
- P2: Export reports to PDF/CSV
- P2: Class/video records and timeline in student profiles
- P2: Role-based workspaces (counsellors, trainers, students)
