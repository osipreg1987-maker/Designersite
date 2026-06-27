# Cyber-Conversion Portfolio — Design System

## Visual Vibe: "Deep Glassmorphism"

Aesthetic: **premium, futuristic, dark** — deep space backdrop, floating frosted-glass surfaces, glowing ambient gradients, crisp typographic contrast.

## Color Tokens

| Token | Value | Usage |
|:---|:---|:---|
| **Canvas Background** | `#0C1220` | Deepest background layer |
| **Frosted Glass** | `rgba(15, 23, 42, 0.45)` + `blur(24px)` | Floating cards, tariff panels |
| **Glow Teal** | `#14B8A6` | Primary actions, accents, links |
| **Glow Lime** | `#CCFF00` | HIT badge, highlights |
| **Glow Coral** | `#f87171` | Premium variant, warnings |

## Typography

- **Display:** Unbounded (loaded but Plus Jakarta Sans used as primary)
- **Body:** Plus Jakarta Sans 300–800

## Component Architecture

1. **Glass Card:** `bg rgba(15,23,42,0.45)` + `backdrop-filter: blur(24px)` + `border 1px rgba(255,255,255,0.06)` + `border-radius: 28px`
2. **Glow Hover:** Radial gradient follows mouse via CSS custom properties `--mouse-x`, `--mouse-y`
3. **Tilt Hover:** `perspective(800px) rotateX(2deg) rotateY(-2deg)` on hover
4. **Reveal Animations:** IntersectionObserver-based `.reveal` class with stagger delays
5. **Bento Reveal:** 3D rotateX + blur + scale entrance

## Animation Standards

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out)
- Reveal duration: 0.8s standard, 1.2s bento
- Hover transitions: 0.3–0.4s
- Counter animation: 1.5s ease-out-cubic

## Responsive Breakpoints

- 1024px: 2-column tariffs, testimonials
- 768px: Mobile nav, single column, stacked stats
- 480px: Compact containers, smaller buttons
