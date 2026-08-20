# Student Registration & Report Management System

A responsive React + TypeScript frontend for managing academy operations including student walk-ins, registration, admission fees, batches, trainers, attendance, task tracking, performance, and reporting.

## Features

- Responsive admin dashboard with summary cards and charts
- Student walk-in management with lead status flow
- Student registration and profile management
- Admission and fees tracking
- Batch and trainer allocation management
- Attendance monitoring
- Class report tracking
- Task assignment and student performance analytics
- Report and progress dashboard
- Form-based data capture and search/filter views

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Recharts
- Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the application:
   ```bash
   npm run dev
   ```

3. Open the app in your browser at:
   ```bash
   http://localhost:5173
   ```

## Production Build

```bash
npm run build
```

## Deployment

Pushing to `main` runs linting and builds the frontend before deploying it to GitHub Pages. In the repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**. The deployed app will be available at:

```text
https://ramanan1711.github.io/student-management-system/
```

## Notes

- The frontend uses seeded mock data from `frontend/src/data/mockData.ts` and `frontend/src/data/students.json` to simulate student, batch, report, employee, attendance, task, and walk-in datasets.
- Changes made in the frontend are persisted in browser `localStorage` under `sms.data.*`. They are specific to the current browser and origin; clearing site data or using another browser removes the changes and restores the seed data.
- The application does not currently use a production database or complete CRUD API. The backend in `backend/server.py` is a minimal health-check stub and is not required to run the frontend.

## Demo Authentication & Data Limitations

- Authentication is for demonstration only. Any valid email address and non-empty password are accepted; there is no server-side credential verification, role-based authorization, password hashing, or HTTP-only session cookie.
- The username shown in the sidebar is taken from the part of the login email before `@`. For example, `admin@example.com` displays as `Admin` with the avatar initial `A`.
- Authentication is stored in tab-scoped `sessionStorage`. Closing the browser tab logs the user out. Use the **Logout** button to clear the session immediately.
- Suggested demo credentials:
   - Email: `admin@example.com`
   - Password: `secret`
- Student photos are stored as browser data URLs in the local mock store. They are suitable for the demo only and are not uploaded to a server or object-storage service.
- Video records use seeded sample media URLs and are not connected to a real video-management service.
- Data is reset to the seed dataset when browser storage is cleared. The mock data should not be used for real student, payment, attendance, or authentication records.

## Assignment Completion

This project has been built to cover the required pages and operational workflow for the academy management assignment.

