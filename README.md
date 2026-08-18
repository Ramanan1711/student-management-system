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

- Mock JSON data is used to simulate student, batch, report, employee, and walk-in datasets.
- The login page routes to the dashboard and the app uses a component-based layout for the admin portal.

## Assignment Completion

This project has been built to cover the required pages and operational workflow for the academy management assignment.

