# Student Management System - PRD

## 1. Project Overview

Build a responsive Student Management Admin Portal for managing the complete student journey from initial walk-in enquiry through registration, admission, fee collection, batch allocation, attendance, class reports, performance tracking, and final reporting.

The application is designed as an interview/demo project and currently uses realistic local demo data. A production backend is not required for the current implementation.

---

## 2. Original Problem Statement

Build a responsive student management admin portal based on the provided interview task, PDF, and video requirements.

The system should support the complete student lifecycle:

**Walk-in → Registration → Admission → Fee Details → Batch Allocation → Employee/Trainer Allocation → Class → Attendance → Reports → Student Progress → Final Report**

The current application is a frontend-first demo implementation with client-side authentication, shared application state, and browser persistence.

---

## 3. Technology Stack

### Frontend

* Vite
* React 19
* TypeScript
* Tailwind CSS 4
* Lucide React
* Recharts

### Backend

* FastAPI
* Minimal `/api/health` endpoint
* Backend currently serves as a deployment/API shell only

### State Management

* React Context API
* Shared `DataStore`
* Client-side localStorage persistence

### Data

* Realistic mock/demo data
* No production database currently connected

---

## 4. Architecture

### Frontend

The frontend application is located at:

`/app/frontend`

It contains the complete responsive admin portal, including all application pages, layouts, forms, modals, charts, tables, and reusable UI components.

### Backend

The backend is located at:

`/app/backend`

The current backend is a minimal FastAPI deployment stub containing a health-check endpoint.

Production CRUD APIs and authentication are not currently implemented.

### State Management

A shared React Context `DataStore` manages application data across all pages.

The DataStore provides centralized state for:

* Students
* Walk-ins
* Admissions
* Payments
* Batches
* Employees/Trainers
* Attendance
* Tasks
* Reports
* Performance-related data

### Persistence

The DataStore uses **browser localStorage** to persist client-side demo data.

This means:

* Data created in one module is available to other modules.
* Data survives SPA navigation.
* Data survives browser refresh/reload.
* Changes remain available within the same browser until localStorage is cleared.
* No external database is currently required.

This is a client-side demo persistence mechanism and should not be considered production-grade data storage.

### Notifications

A shared Toast provider is used to display feedback for successful actions, updates, payments, attendance saves, task changes, and other user interactions.

---

# 5. Application Modules

## Module 1 - Login

### Features

* Client-side demo authentication
* Login form
* Authentication state
* Sign-out functionality
* Security dropdown
* Sign-out-other-sessions action

Authentication is currently simulated on the client and does not connect to a real authentication server.

---

## Module 2 - Dashboard

The dashboard provides an overview of the institute's current operational data.

### KPIs

* Revenue
* Total Students
* Pending Fees
* Active Batches

All dashboard KPIs are dynamically derived from the shared DataStore.

### Revenue Chart

Supports:

* 12 Months
* 6 Months
* 30 Days

### Recent Activity

Recent activity is generated from live application data including:

* Walk-ins
* Tasks
* Student-related activities

### Navigation

The dashboard provides a **View All** action that navigates to the Reports module.

---

# 6. Header

The application header contains:

### Dynamic Route Title

The displayed title changes according to the currently active page/module.

### Global Search

Searches across:

* Students
* Walk-ins

Search results are displayed through a dropdown interface.

### Notifications

The notification bell provides:

* Notification count badge
* Notification list
* Dismissible notifications

New walk-ins can generate notifications.

### Security Menu

Provides security/account actions including:

* Sign out
* Sign out other sessions

---

# 7. Students

The Students module provides access to registered student information.

### Features

* Student search
* Mode/filter selection
* Student table
* Student row navigation
* Student profile navigation

Selecting a student opens the corresponding Student Profile.

---

# 8. Student Registration

The Registration module provides a complete student registration workflow.

### Features

* Student registration form
* Form validation
* Student details
* Batch selection
* Fee details
* Automatic pending fee calculation

### Batch Selection

Available batches are dynamically populated from the shared Batches store.

### Persistence

Successfully registered students are added to the shared DataStore and persisted through localStorage.

---

# 9. Student Profile

The Student Profile provides detailed information about an individual student.

### Current Features

* Student details
* Registration information
* Batch information
* Fee information
* Progress-related information

### Future Enhancement

* Class/video records timeline
* Detailed student activity history
* Final report history

---

# 10. Walk-ins

The Walk-ins module manages new student enquiries.

### Features

* Search walk-ins
* Filter by status
* Add new walk-in
* Modal-based data entry
* Status badges
* Notification generation after successful creation

New walk-ins are stored in the shared DataStore and persisted through localStorage.

---

# 11. Admissions

The Admissions module manages student admission and fee information.

### Features

* Student ledger
* Student search
* Admission information
* Fee details
* Pending amount calculation
* Record payment action

### Pending Amount

Pending Amount is automatically calculated based on:

**Total Fee - Amount Paid**

The calculated Pending Amount is read-only.

### Payments

Recording a payment updates the corresponding student/admission data and displays a success toast.

---

# 12. Batches

The Batches module manages student batches.

### Features

* Batch search
* Batch listing
* Add batch
* Batch creation modal
* Trainer selection

### Trainer Selection

Trainer options are dynamically populated from the Employees store.

New batches are persisted through the shared DataStore and localStorage.

---

# 13. Employees

The Employees module manages trainers and other employees.

### Features

* Employee search
* Employee type filter
* Employee listing
* Add employee
* Employee creation modal

Employees created here can be used by other modules such as Batches.

---

# 14. Attendance

The Attendance module manages student attendance.

### Features

* Date selection
* Batch filtering
* Student attendance list
* Present status
* Absent status
* Leave status
* Save attendance

Attendance changes are written to the shared DataStore.

Aggregate attendance statistics are updated based on saved attendance records.

Attendance data is also persisted through localStorage.

---

# 15. Tasks

The Tasks module provides basic task management.

### Features

* Task search
* Priority filter
* Status filter
* Create task
* Task creation modal
* Mark task as complete
* Reopen completed task

Task changes are persisted through the shared DataStore.

---

# 16. Reports

The Reports module provides operational reporting.

### Report Types

* Progress
* Attendance
* Fee

### Filters

* Batch filter
* Report view selection

### Export

Reports support:

* CSV export
* Print

CSV files are generated on the client side using the currently available application data.

---

# 17. Class Reports

The Class Reports module provides class-level reporting.

### Features

* Batch filter
* Search
* Class report listing
* Drill-down detail modal

Users can open detailed information for individual class records.

---

# 18. Performance

The Performance module provides student performance information.

### Features

* Performance metric filter
* Batch filter
* Performance listing
* Drill-down detail modal

Performance data is derived from the application's local demo data.

---

# 19. Data Persistence

The application currently uses **localStorage-based persistence**.

### Persisted Data

The following application data is designed to remain available after browser refresh:

* Students
* Walk-ins
* Admissions
* Payments
* Batches
* Employees
* Attendance
* Tasks
* Related application state

### Persistence Behavior

The workflow is:

**User Action → DataStore Update → localStorage Update → UI Refresh**

This allows the application to behave like a persistent demo application without requiring a production database.

### Limitations

localStorage is only suitable for the current demo implementation.

It does not provide:

* Server-side persistence
* Multi-user synchronization
* Database transactions
* Secure storage
* Production authentication
* Role-based access control
* Cross-device synchronization

---

# 20. Cross-Module Data Flow

The application uses a shared DataStore so that changes made in one module can be consumed by another module.

Examples:

### Registration → Students

A newly registered student becomes available in the Students module.

### Registration → Batches

Registration uses available batches from the Batches store.

### Employees → Batches

Employees/Trainers created in Employees become available for trainer selection when creating batches.

### Walk-ins → Dashboard

New walk-ins contribute to dashboard activity and notification information.

### Admissions → Dashboard

Fee/payment changes contribute to revenue and pending-fee calculations.

### Attendance → Reports

Saved attendance contributes to attendance reporting and aggregate statistics.

### Tasks → Dashboard

Task activity can appear in dashboard recent activity.

---

# 21. Responsive Design

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

### Responsive Features

* Responsive sidebar
* Mobile navigation/menu
* Responsive tables
* Responsive forms
* Responsive cards
* Responsive modals
* Adaptive dashboard layout

The UI follows a professional deep-blue admin dashboard design.

---

# 22. UI/UX

### Design Direction

* Professional admin portal
* Deep-blue visual theme
* Clean dashboard cards
* Responsive layout
* Consistent spacing
* Clear form validation
* Status badges
* Toast notifications
* Search and filter controls
* Modal-based creation workflows

The objective is to provide an interface suitable for an academy/institute administration system.

---

# 23. Implementation History

## 2026-01 - Initial Implementation

Implemented the complete frontend student management portal with:

* Dashboard
* Login
* Students
* Registration
* Walk-ins
* Admissions
* Batches
* Employees
* Attendance
* Tasks
* Reports
* Class Reports
* Performance
* Student Profile

---

## 2026-01 - UI and Navigation

Implemented:

* Deep-blue admin UI
* Responsive sidebar
* Mobile navigation
* Dynamic forms
* Form validation
* Student search/profile flow

---

## 2026-01 - Deployment Structure

Restructured the project into:

`/app/frontend`

and

`/app/backend`

Added:

* FastAPI backend stub
* Deployment start script
* Vite configuration
* `0.0.0.0:3000` binding
* Deployment-related configuration fixes

---

## 2026-01 - Interactive Audit Fixes

Completed the interactive audit and implemented:

* Shared DataStore Context
* Toast provider
* Dynamic header title
* Global search
* Notification dropdown
* Security dropdown
* Working View All navigation
* Cross-page create persistence
* Attendance save functionality
* Task creation
* Task filtering
* Task completion/reopen
* Admissions pending calculation
* Batch creation
* Employee creation
* Batch trainer selection
* Reports CSV export
* Reports print functionality
* Class Reports drill-down modal
* Performance drill-down modal

---

## 2026-08 - localStorage Persistence

Added browser localStorage persistence to the shared DataStore.

The application now preserves client-side demo data across browser refreshes.

This completed the previously planned localStorage persistence requirement.

---

# 24. Testing and Verification

The application has undergone interactive testing.

### Verified

* Cross-page persistence works through SPA navigation.
* DataStore changes are shared across modules.
* Data persists after browser refresh through localStorage.
* Registration flow works.
* Walk-in creation works.
* Admission payment flow works.
* Batch creation works.
* Employee creation works.
* Attendance saving works.
* Task creation and status changes work.
* Reports filtering works.
* CSV export works.
* Print functionality works.
* Class Reports drill-down works.
* Performance drill-down works.
* Global search works.
* Notifications work.
* Dynamic header titles work.

### Regression Testing

All four previously flagged regressions were verified as passing.

### Console

Full-flow testing reported:

**Zero console errors.**

---

# 25. Current Project Status

The project currently provides a functional frontend demonstration of a Student Registration & Report Management System.

### Completed

* Responsive admin interface
* Client-side demo authentication
* Shared application state
* localStorage persistence
* Student management
* Registration
* Walk-ins
* Admissions
* Fee tracking
* Batch management
* Employee management
* Attendance
* Tasks
* Reports
* Class Reports
* Performance
* Global search
* Notifications
* Toast feedback
* CSV export
* Print reports
* Drill-down modals
* Responsive navigation

---

# 26. Remaining Backlog

## P1 - Real Backend CRUD and Authentication

Replace the client-side/localStorage demo architecture with:

* Real FastAPI CRUD APIs
* Database integration
* Server-side authentication
* Secure session/token handling
* Persistent server-side data

---

## P2 - PDF Report Export

Add PDF generation for:

* Student reports
* Attendance reports
* Fee reports
* Performance reports
* Final student reports

---

## P2 - Class/Video Records Timeline

Add a student timeline containing:

* Class records
* Video records
* Session history
* Trainer comments
* Student progress history

---

## P2 - Role-Based Workspaces

Introduce separate workspaces for:

* Counsellor
* Trainer
* Student
* Administrator

Each role should have appropriate permissions and navigation.

---

# 27. Future Production Architecture

A future production implementation can follow this architecture:

**React Frontend**

↓

**FastAPI REST API**

↓

**Authentication / Authorization**

↓

**PostgreSQL Database**

↓

**File/Object Storage**

for:

* Student documents
* Class videos
* Reports
* Other uploaded files

The frontend DataStore can then be converted from localStorage-backed state into API-backed state while preserving the existing UI and module structure.

---

# 28. Final Status

**Current Status: Functional Frontend Demo**

The Student Management System is currently suitable for:

* Interview demonstration
* Frontend evaluation
* UI/UX demonstration
* Workflow demonstration
* Local testing
* Mock-data presentation

The application is **not yet production-ready** because backend CRUD, database persistence, secure authentication, authorization, PDF reporting, and role-based workspaces remain to be implemented.
