# PortfolioPro - Portfolio Builder Engine

# Objective

Build a frontend-only visual Portfolio Builder Engine using Next.js, Tailwind CSS, and dnd-kit.

This builder should allow admin users to visually create reusable portfolio templates using drag-and-drop components.

The builder architecture must be schema-driven and component-based.

DO NOT hardcode templates.

DO NOT save raw JSX or source code.

Templates must be saved as JSON schema structures.

Backend APIs and persistence will be implemented later.

---

# Core Requirements

The builder should support:

- Drag/drop sections
- Drag/drop components
- Live visual preview
- Responsive layouts
- Theme customization
- Dynamic component styling
- Reusable templates
- Dynamic data bindings
- Nested components
- Media support
- Visual editing

---

# Tech Stack

| Feature | Technology |
|---|---|
| Framework | Next.js App Router |
| Styling | Tailwind CSS |
| State Management |
| Drag & Drop | dnd-kit |
| Forms | React Hook Form |
| Validation | Zod |
| Icons | Lucide React |

---

# Architecture Rules

# IMPORTANT

The system must separate:

1. Portfolio Data
2. Template Layout
3. Renderer Engine

Correct flow:

```text
Portfolio Data
      +
Template JSON
      ↓
Renderer Engine
      ↓
Portfolio Website