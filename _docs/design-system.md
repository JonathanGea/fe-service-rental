# Design System: Public & Admin UI Color Palette

## Icon System

Project ini menggunakan [Font Awesome](https://fontawesome.com/) sebagai sumber ikon utama untuk UI.

Guidelines:
- Gunakan elemen `i` dengan kelas `fa-solid`, `fa-regular`, atau `fa-brands`.
- Sesuaikan ukuran dengan utility font-size (`text-base`, `text-lg`, `text-2xl`) dan warna dengan kelas teks yang ada.
- Hindari inline SVG untuk ikon UI.
- Font Awesome dimuat via CDN di `src/index.html`.

Contoh:
```html
<i class="fa-solid fa-car-side text-base text-primary"></i>
<i class="fa-regular fa-bell text-lg text-strong/70"></i>
```

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
| App background | `#F5F6F8` | Background halaman (abu muda, bersih) |
| Surface | `#FFFFFF` | Card / panel / form |
| Surface subtle | `#F8FAFC` | Input bg, chip bg, hover ringan |
| Border | `#E6E8EC` | Border card, input, divider |
| Strong text | `#111827` | Heading, teks utama (near-black) |
| Muted text | `#6B7280` | Deskripsi, label, placeholder |
| Primary | `#111827` | CTA utama (mis. tombol Search hitam) |
| Primary hover | `#0B1220` | Hover CTA |
| Primary accent | `#2563EB` | Link, state aktif kecil (tab/menu), highlight secukupnya |
| Hero overlay | `#0B1220` (60%) | Overlay di hero image biar teks kebaca |

## Public Tailwind color mapping

| Tailwind class | Hex value |
| --- | --- |
| `bg-public-app` | `#F5F6F8` |
| `bg-public-surface` | `#FFFFFF` |
| `bg-public-surface-subtle` | `#F8FAFC` |
| `border-public` | `#E6E8EC` |
| `text-public-strong` | `#111827` |
| `text-public-muted` | `#6B7280` |
| `bg-public-primary` | `#111827` |
| `bg-public-primary-hover` | `#0B1220` |
| `text-public-primary` | `#2563EB` |
| `ring-public` | `#2563EB` |

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
<button class="bg-public-primary text-white hover:bg-public-primary-hover">Primary</button>
```

Public Text hierarchy
```html
<h1 class="text-public-strong">Heading</h1>
<p class="text-public-muted">Supporting text</p>
<a class="text-public-primary">Link</a>
```

## Do / Don't

Do:
- Use semantic classes for admin: `bg-app`, `bg-surface`, `text-strong`, `text-primary`, `border-default`
- Use semantic classes for public: `bg-public-app`, `bg-public-surface`, `bg-public-surface-subtle`, `text-public-strong`, `text-public-muted`, `text-public-primary`, `border-public`
- Use opacity modifiers (e.g., `text-strong/70`) for subtle emphasis

Don't:
- Introduce arbitrary grays or blues outside the palette
- Hardcode hex values in templates
