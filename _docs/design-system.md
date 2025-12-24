# Design System: Public & Admin UI Color Palette

## Icon System

Project ini menggunakan [Heroicons](https://heroicons.com/) sebagai sumber ikon utama untuk UI.

## Admin Palette

| Color name | Hex value | Intended usage |
| --- | --- | --- |
| App background | `#F0F2F5` | Main app background |
| Surface | `#FFFFFF` | Navbar, sidebar, cards, panels |
| Primary accent | `#4CAF50` | Primary actions, links, active states |
| Strong text | `#344767` | Headings, body text, icons |

## Admin Tailwind color mapping

| Tailwind class | Hex value |
| --- | --- |
| `bg-app` | `#F0F2F5` |
| `bg-surface` | `#FFFFFF` |
| `text-primary` | `#4CAF50` |
| `text-strong` | `#344767` |
| `border-default` | `#FFFFFF` |
| `bg-primary` | `#4CAF50` |

Note: In Tailwind v4, these tokens are also declared in `src/styles.css` via `@theme` to ensure the utilities are generated.

## Public Palette

| Color name | Hex value | Intended usage |
| --- | --- | --- |
| App background | `#FFF8F1` | Public landing background |
| Surface | `#FFFFFF` | Cards, panels |
| Primary accent | `#FF7A00` | Primary actions, highlights |
| Strong text | `#2E2A26` | Headings, body text |

## Public Tailwind color mapping

| Tailwind class | Hex value |
| --- | --- |
| `bg-public-app` | `#FFF8F1` |
| `bg-public-surface` | `#FFFFFF` |
| `text-public-primary` | `#FF7A00` |
| `text-public-strong` | `#2E2A26` |
| `border-public` | `#FFFFFF` |
| `bg-public-primary` | `#FF7A00` |

Note: In Tailwind v4, these tokens are also declared in `src/styles.css` via `@theme` to ensure the utilities are generated.

## Usage examples

Admin Navbar
```html
<nav class="bg-surface border-b border-default text-strong">
  <button class="text-strong hover:text-primary">...</button>
</nav>
```

Admin Sidebar
```html
<aside class="bg-surface border-r border-default text-strong">
  <a class="text-strong/70 hover:text-primary">Dashboard</a>
</aside>
```

Admin Buttons
```html
<button class="bg-primary text-white hover:bg-primary/90">Primary</button>
```

Admin Text hierarchy
```html
<h1 class="text-strong">Heading</h1>
<p class="text-strong/70">Supporting text</p>
<a class="text-primary">Link</a>
```

Public Buttons
```html
<button class="bg-public-primary text-white hover:bg-public-primary/90">Primary</button>
```

Public Text hierarchy
```html
<h1 class="text-public-strong">Heading</h1>
<p class="text-public-strong/70">Supporting text</p>
<a class="text-public-primary">Link</a>
```

## Do / Don't

Do:
- Use semantic classes for admin: `bg-app`, `bg-surface`, `text-strong`, `text-primary`, `border-default`
- Use semantic classes for public: `bg-public-app`, `bg-public-surface`, `text-public-strong`, `text-public-primary`, `border-public`
- Use opacity modifiers (e.g., `text-strong/70`) for subtle emphasis

Don't:
- Introduce arbitrary grays or blues outside the palette
- Hardcode hex values in templates
