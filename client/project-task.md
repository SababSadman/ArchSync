# Project Portfolio Feature Task List

## Core Infrastructure
- [x] Define Project schema and types
- [x] Setup Supabase client for project operations
- [x] Implement TanStack Query hooks for project management (`useProjects`)

## Components Implementation
- [x] Portfolio Grid (Responsive: 3-col desktop, 2 tablet, 1 mobile)
- [x] ProjectCard Component
    - [x] Cover image / Placeholder gradient
    - [x] Phase badge (color-coded)
    - [x] Status indicator dot
    - [x] Deadline with relative urgency
    - [x] Member avatars (max 4, then +N)
    - [x] Last activity relative time
- [x] Studio-level Stats Bar
    - [x] Total active projects
    - [x] Overdue count
    - [x] Team utilization indicator
- [x] Filter & Search Bar
    - [x] Filter by status
    - [x] Filter by phase
    - [x] Sort by name/deadline/updated_at
    - [x] Search by name
- [x] Create Project Dialog
    - [x] Form with required name
    - [x] Phase selector with descriptions
    - [x] Deadline date picker
    - [x] Project type selector
    - [x] Optimistic update on creation
- [x] Empty State Illustration & CTA

## Refinement & Polish
- [x] Invalidate TanStack Query on mutation success
- [x] Ensure Shadcn UI components are properly integrated
- [x] Responsive design across all breakpoints

## File Management System
- [x] Implementation of `useFileUpload` hook with Supabase Storage
- [x] Multi-file drag & drop zone with progress tracking
- [x] Automated file versioning (v1+)
- [x] File grid with phase-based grouping
- [x] Rich preview modal (Images with zoom, PDF viewer, CAD metadata)
- [x] Support for .dwg, .rvt, .ifc, .pdf, .png, .jpg and more
