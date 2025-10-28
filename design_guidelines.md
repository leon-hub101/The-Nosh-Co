# Design Guidelines: The Nosh Co. PWA

## Design Approach

**Reference-Based E-commerce Design** - Drawing inspiration from modern food e-commerce platforms like Farmstead, Thrive Market, and Instacart, focusing on clean product displays, appetizing imagery, and trust-building elements for a fruit and nut specialty shop.

## Core Design Principles

1. **Mobile-First Excellence** - Every design decision prioritizes mobile viewport first, then scales up
2. **Fresh & Natural** - Visual language that evokes freshness, quality, and natural ingredients
3. **Trust & Transparency** - Clear pricing, product information, and honest imagery build customer confidence
4. **Effortless Discovery** - Products are the heroes; navigation and UI fade into the background

---

## Typography System

**Font Stack:** Tailwind's default `font-sans` (Inter/system fonts)

**Hierarchy:**
- **H1 (Hero/Page Title):** `text-3xl md:text-4xl font-bold tracking-tight`
- **H2 (Section Headers):** `text-2xl md:text-3xl font-semibold`
- **H3 (Product Names):** `text-lg font-semibold`
- **Body Text:** `text-base leading-relaxed`
- **Small/Meta:** `text-sm text-gray-600`
- **Price Display:** `text-xl font-bold` with ZAR symbol in `text-base font-normal`
- **Buttons:** `text-sm font-medium uppercase tracking-wide`

---

## Layout System

**Tailwind Spacing Primitives:** Use units of **2, 4, 8, 12, 16** for consistent rhythm
- Component padding: `p-4` (mobile), `p-8` (desktop)
- Section spacing: `py-8` (mobile), `py-16` (desktop)
- Card gaps: `gap-4` (mobile), `gap-6` (desktop)
- Element margins: `mb-2`, `mt-4`, `mx-8`

**Container Strategy:**
- Mobile: Full-width with `px-4` padding
- Desktop: `max-w-7xl mx-auto px-6 lg:px-8`

**Grid Layouts:**
- Product Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6`
- Maintain consistent card aspect ratios across breakpoints

---

## Color Palette & Application

**Brand Colors:**
- **Primary Green (Accent):** `#22c55e` - Use for CTAs, admin button, active states, success messages
- **Black:** `#000000` or `text-gray-900` - Headers, body text, icons
- **White:** `#FFFFFF` - Backgrounds, card surfaces
- **Orange (Special Badge):** `#f97316` or `#ea580c` - SPECIAL product indicators
- **Neutral Grays:** `gray-50` (backgrounds), `gray-100` (borders), `gray-600` (secondary text), `gray-800` (dark text)

**Background Treatment:**
- Primary background: `bg-gray-50` (warm off-white for less eye strain)
- Card surfaces: `bg-white` with `shadow-sm` or `shadow-md`
- Header: `bg-white` with subtle `border-b border-gray-100`

---

## Component Library

### Product Cards
**Structure:**
- White background (`bg-white`)
- Subtle shadow (`shadow-md hover:shadow-lg transition-shadow`)
- Rounded corners (`rounded-lg`)
- Image container: Square aspect ratio (`aspect-square`) with `overflow-hidden rounded-t-lg`
- Padding: `p-4`

**Content Hierarchy:**
- Product image (top, full-width)
- SPECIAL badge (if applicable): `absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase`
- Product name: `text-lg font-semibold text-gray-900 mb-2`
- Price row: Flex layout with price left-aligned, unit right-aligned
- Price: `text-xl font-bold text-gray-900` with `R` symbol in `text-base font-normal text-gray-700`
- Unit: `text-sm text-gray-600`
- Stock indicator: `text-xs text-gray-500` below price

**Interaction:**
- Subtle hover lift: `hover:-translate-y-1 transition-transform`
- Click target: Entire card clickable

### Floating Admin Button
**Specifications:**
- Position: `fixed bottom-6 right-6 z-50`
- Size: `w-14 h-14` (mobile), `w-16 h-16` (desktop)
- Background: `bg-green-500 hover:bg-green-600 active:bg-green-700`
- Shadow: `shadow-lg hover:shadow-xl`
- Icon: Admin/user icon in white, centered
- Border radius: `rounded-full`
- Text: "Admin" label visible on hover (desktop) using `group` pattern

### Navigation Header
**Layout:**
- Sticky positioned: `sticky top-0 z-40`
- Background: `bg-white border-b border-gray-100`
- Height: `h-16` (mobile), `h-20` (desktop)
- Content: Logo (left), menu icon (right on mobile), navigation links (desktop)
- Logo: "The Nosh Co." in `text-xl font-bold text-gray-900`

### Badges & Labels
**SPECIAL Badge:**
- Background: `bg-orange-500`
- Text: `text-white text-xs font-bold uppercase tracking-wider`
- Padding: `px-3 py-1`
- Border radius: `rounded-full`
- Shadow: `shadow-sm`

---

## Images

### Product Images
**Style:** High-quality, clean product photography with white or subtle neutral backgrounds. Images should show fruits and nuts in their natural state - fresh, vibrant, appetizing.

**Placement:**
- Each product card requires a hero product image
- Images fill the card's top section (square aspect ratio)
- Use `object-cover` to maintain consistency
- Implement lazy loading for performance

**Placeholder Strategy:**
- For missing images: Use subtle gradient backgrounds (`bg-gradient-to-br from-green-50 to-green-100`) with centered icon or product initial

**Image Specifications:**
- Minimum: 400x400px
- Format: WebP with JPEG fallback
- Compression: Optimized for web (under 100KB per image)

### No Hero Section Required
This is a product catalog app - immediately show products in a grid layout. No traditional hero section needed for Unit 1.

---

## Responsive Behavior

**Breakpoint Strategy:**
- Mobile-first: Design for 375px viewport, scale up
- Tablet: `sm:` at 640px (2-column grid)
- Desktop: `lg:` at 1024px (3-4 column grid)

**Touch Targets:**
- Minimum: 44x44px for all interactive elements
- Adequate spacing between clickable cards (`gap-4`)

**Typography Scaling:**
- Scale font sizes progressively: base mobile → +1 step at `md:` → +2 steps at `lg:`

---

## Accessibility & Polish

**Contrast:** Ensure WCAG AA compliance - black text on white backgrounds, white text on green/orange
**Focus States:** Visible focus rings on all interactive elements using `focus:ring-2 focus:ring-green-500 focus:ring-offset-2`
**Semantic HTML:** Proper heading hierarchy, semantic product cards
**Loading States:** Skeleton screens for product grid while data loads
**Empty States:** Friendly messaging if no products available

---

## Animation & Motion (Minimal)

**Transitions:**
- Card hover: `transition-all duration-200 ease-in-out`
- Button states: `transition-colors duration-150`
- Admin FAB: Subtle scale on hover `hover:scale-105`

**Avoid:** Page transitions, scroll-triggered animations, unnecessary flourishes

---

## South African Context

**Currency Display:** Always format prices as `R220.00` with space after R symbol, consistent decimal places
**Language:** English, neutral tone
**Units:** Display as `/kg`, `/100g`, `/pack` - common local measurements