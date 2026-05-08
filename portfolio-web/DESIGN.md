---
name: PortfolioPro
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464555'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.015em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style
The design system is rooted in high-fidelity minimalism, prioritizing clarity, speed, and precision. It evokes the utilitarian elegance of modern developer tools and high-end productivity software. The aesthetic is "Product-First"—removing unnecessary visual noise to let the user's content and data take center stage.

The personality is professional, neutral, and reliable. It utilizes a restrained visual language where quality is communicated through perfect alignment, intentional whitespace, and refined typography rather than decorative elements. The emotional response should be one of focus and calm efficiency.

## Colors
The palette is monochromatic and functional, using a "Paper and Ink" philosophy. 

- **Primary:** A refined Indigo (#4F46E5) used sparingly for primary actions, focus states, and small brand accents.
- **Surface & Background:** Pure White (#FFFFFF) is the base for main content areas. Soft Gray (#F9FAFB) is used for sidebars, secondary panels, and structural backgrounds to create subtle contrast.
- **Typography:** Slate-900 (#0F172A) provides high-contrast readability for body text and headers. Slate-500/600 is reserved for metadata and secondary labels.
- **Borders:** A consistent, thin 1px stroke (#E5E7EB) defines all boundaries, replacing shadows as the primary method of separation.

## Typography
This design system utilizes **Inter** for its primary sans-serif needs due to its exceptional legibility and systematic feel. For technical details and labels, **Geist** is introduced to provide a subtle "tool-like" precision.

Key typographic rules:
- **Tight Kerning:** Negative letter spacing on headings is essential to achieve the "Linear/Vercel" look.
- **Hierarchical Contrast:** Use font weight and color (Slate-900 vs Slate-500) rather than large jumps in font size to establish hierarchy.
- **Alignment:** All text should snap to the baseline grid. Avoid center alignment for long-form content; stick to flush-left for readability.

## Layout & Spacing
The layout follows a 4px baseline grid. The philosophy is "Generous but Precise," using white space to group elements rather than heavy containers.

- **Grid:** A 12-column fluid grid for main dashboards, with fixed-width sidebars (typically 240px or 280px).
- **Margins:** Global page margins should be large (48px+) on desktop to create a focused, centered content feel.
- **Sectioning:** Vertical spacing between sections should be significant (48px-64px) to allow the eye to rest and emphasize the distinct nature of each content block.

## Elevation & Depth
Elevation is handled through tonal layering and minimal shadows rather than dramatic lighting effects.

- **Layer 0 (Background):** #FFFFFF.
- **Layer 1 (Subtle Inset):** #F9FAFB or #F3F4F6 for sidebars or "well" components.
- **Borders:** Every interactive element or distinct container uses a 1px solid border (#E5E7EB).
- **Shadows:** Use a single, soft "Ambient" shadow for floating elements like dropdowns or modals: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`. 
- **Transitions:** All elevation changes (e.g., hover states) should use a fast, linear-out transition (150ms).

## Shapes
The shape language is disciplined and consistent.
- **Standard Radius:** 8px for buttons, inputs, and small cards.
- **Container Radius:** 12px for larger cards or modal windows.
- **Consistency:** Never use fully rounded (pill) shapes for buttons; stick to the defined 8px radius to maintain a professional, architectural feel.
- **Icons:** Use 20px or 24px bounding boxes with a 1.5px or 2px stroke weight. Avoid filled icons unless indicating an active state.

## Components
- **Buttons:** 
  - Primary: Indigo background, white text, 8px radius. 
  - Secondary: White background, 1px border (#E5E7EB), Slate-900 text.
  - Ghost: No border or background until hover.
- **Inputs:** 1px border (#E5E7EB), 8px radius, Slate-900 text. Use #F9FAFB background for a "filled" variant. Use Indigo-500 for a 1px focus ring.
- **Cards:** White background, 1px border (#E5E7EB), 12px radius. No shadow unless the card is interactive/draggable.
- **Chips/Badges:** Small font size (12px), Geist Mono font, 4px radius, subtle gray background (#F3F4F6) with slate text.
- **Lists:** Clean rows with 1px bottom borders. High horizontal padding (16px) and vertical padding (12px).
- **Navigation:** Vertical sidebar with icons on the left, text on the right. Active state indicated by a subtle gray background (#F3F4F6) or a 2px indigo vertical bar on the left edge.