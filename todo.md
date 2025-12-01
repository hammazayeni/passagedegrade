# Taekwondo Sbeitla - Development Plan

## Goal
Build a promotion test management app with a Dashboard for managing students and a Projection Mode for public display.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS + Shadcn UI
- LocalStorage for persistence

## Features
1. **Student Management**: Add/Edit/Delete students.
2. **Ordering**: Set test order.
3. **Evaluation**: Approve/Refuse buttons.
4. **Projection Mode**: Full screen, high impact design.
5. **Belts**: Custom belt list.

## File Structure

### Core
- `src/types/index.ts`: Definitions for Student, Belt, TestResult.
- `src/lib/constants.ts`: List of belts, colors.
- `src/hooks/useStudents.ts`: Custom hook for LocalStorage management.

### Components
- `src/components/ui/*`: Shadcn components (already exists).
- `src/components/StudentForm.tsx`: Dialog/Form to add students.
- `src/components/StudentList.tsx`: List view for the dashboard.
- `src/components/BeltBadge.tsx`: Visual representation of belts.

### Pages
- `src/pages/Dashboard.tsx`: Main admin interface.
- `src/pages/Projection.tsx`: The "Show" mode.
- `src/App.tsx`: Routing setup.
- `src/index.css`: Global styles (custom fonts, animations).

## Implementation Steps
1. Define types and constants (Belts).
2. Implement `useStudents` hook for CRUD operations with LocalStorage.
3. Create `BeltBadge` and `StudentForm`.
4. Build `Dashboard` page.
5. Build `Projection` page with "Powerful" design.
6. Update `App.tsx` and `index.css`.