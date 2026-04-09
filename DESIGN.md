# Design Brief

## Direction

**monedaDigital** — Restaurant digital menu platform. Clean, minimal, accessible. Light theme with brand-forward blue-purple primary and green accent. Mobile-first card-based layouts.

## Tone

Refined minimalism without coldness — approachable, trustworthy, professional, welcoming to all ages. Intentional whitespace and clear hierarchy over decoration.

## Differentiation

Logo-forward presentation in every key page (header, login, QR landing). Brand colors used sparingly but decisively — green accent reserves for actionable elements only. Geometric sans-serif typography creates modern character while maintaining restaurant-appropriate professionalism.

## Color Palette

| Token      | OKLCH          | Role                                  |
| ---------- | -------------- | ------------------------------------- |
| background | 0.99 0.005 260 | Off-white, light, neutral             |
| foreground | 0.15 0.01 260  | Dark text, primary content            |
| card       | 1.0 0 0        | Pure white, elevated surfaces         |
| primary    | 0.45 0.18 266  | Blue-purple, headers, primary CTAs    |
| accent     | 0.65 0.12 160  | Green, secondary actions, highlights  |
| destructive| 0.55 0.22 25   | Red, errors, dangerous actions        |
| muted      | 0.95 0.01 260  | Disabled states, low-contrast text    |
| border     | 0.9 0.01 260   | Subtle dividers, card borders         |

## Typography

- Display: Space Grotesk — geometric, modern, distinctive. Used for headings, hero text, logo context, QR landing pages. Creates immediate visual identity.
- Body: DM Sans — clean, highly legible, professional. Used for paragraphs, labels, microcopy, form fields. Accessible at all sizes down to 12px.
- Scale: Hero `text-5xl md:text-7xl font-bold tracking-tight` | Headings `text-3xl md:text-4xl font-semibold tracking-tight` | Labels `text-sm font-semibold tracking-widest uppercase` | Body `text-base md:text-lg`

## Elevation & Depth

Single-axis light shadows (0px 1-2px 4px rgba) on cards and floated elements. No blur layers, no elevated cards on dark backgrounds. Border + background color differentiation creates hierarchy — not shadow alone.

## Structural Zones

| Zone    | Background           | Border                  | Notes                                    |
| ------- | -------------------- | ----------------------- | ---------------------------------------- |
| Header  | bg-primary           | None                    | Full-width, contains logo + nav          |
| Content | bg-background        | None                    | Main scrollable area, light fill         |
| Cards   | bg-card              | border border-border    | Elevated, rounded-lg, shadow-xs          |
| Footer  | bg-secondary / white | border-t border-border  | Low-contrast, reduced visual weight      |

## Spacing & Rhythm

16px base grid. Section gaps 32px (md) / 24px (sm). Card padding 20px. Input/button padding 10–12px vertical, 16px horizontal. Whitespace-driven — every surface has breathing room. Alternating card backgrounds (card → white → card) in list layouts.

## Component Patterns

- **Buttons**: Primary (bg-primary, text-primary-foreground, rounded-lg, font-semibold) with hover opacity-90. Secondary with border and light background.
- **Cards**: bg-card, rounded-lg, border border-border, shadow-xs, padding 20px. Use for restaurants, menu items, profile sections.
- **Badges**: Inline pills with bg-muted, text-foreground, rounded-full, padding 6px 12px. Green accent variant for highlights.
- **Forms**: Input fields with bg-input, border-border, rounded-md, placeholder-muted-foreground. Focus ring uses primary color.

## Motion

- **Entrance**: Fade-in 0.3s ease-out for cards on page load. No bounce.
- **Hover**: Opacity-90, slight scale-down (active), transition-smooth (0.3s cubic-bezier).
- **Decorative**: Minimal. Use only for state changes (loading spinner, success checkmark fade).

## Constraints

- Logo must appear in page header and login screen at 48–64px visible height.
- No gradients, no glow effects, no neon accents. Pure solid colors only.
- Green accent (#86CCA4 / OKLCH 0.65 0.12 160) reserved for actionable elements (CTAs, highlights, badges).
- Dark mode exists for staff panels (managers, kitchen, waiter) but is secondary; light mode is primary for customers.
- All text uses font-family tokens — never fall back to system fonts.
- Mobile-first: 320px base, tablet 640px+, desktop 1024px+.

## Signature Detail

Restaurant logo displayed prominently in header and QR landing page, creating immediate brand recognition and trust without requiring user authentication. Logo becomes the visual anchor for the entire platform.
