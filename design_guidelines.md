# Design Guidelines: The Nosh Co. PWA
## Jo Malone London-Inspired E-commerce Experience

## Design Approach

**Reference-Based Luxury E-commerce** - Drawing inspiration from Jo Malone London's sophisticated aesthetic: cream and black color palette, British garden botanicals, minimal uncluttered layouts, and refined typography. Creating an elevated fruit and nuts shopping experience that evokes the same sense of curated luxury and timeless elegance.

---

## Core Design Principles

1. **Mobile-First Elegance** - Sophisticated design that translates beautifully from mobile to desktop
2. **Botanical Sophistication** - Delicate floral motifs and garden-inspired visual elements throughout
3. **Curated Minimalism** - Generous white space, restrained ornamentation, products as luxury goods
4. **Refined Simplicity** - Every element serves a purpose; nothing extraneous

---

## Typography System

**Font Stack:** `font-serif` (Georgia/Playfair Display via Google Fonts for headings), `font-sans` (Inter for body)

**Hierarchy:**
- **H1 (Page Title):** `text-3xl md:text-5xl font-serif font-light tracking-wide` - elegant, refined
- **H2 (Section Headers):** `text-2xl md:text-3xl font-serif font-light tracking-wide`
- **H3 (Product Names):** `text-lg md:text-xl font-serif font-normal tracking-wide`
- **Body Text:** `text-base font-sans leading-relaxed`
- **Small/Meta:** `text-sm font-sans tracking-wide uppercase` - minimal, refined
- **Price Display:** `text-lg font-serif font-normal` with ZAR in same style
- **Buttons:** `text-sm font-sans tracking-widest uppercase`

---

## Layout System

**Tailwind Spacing Primitives:** Units of **4, 8, 12, 16, 24** for elegant breathing room
- Component padding: `p-6` (mobile), `p-12` (desktop)
- Section spacing: `py-12` (mobile), `py-24` (desktop)
- Card gaps: `gap-6` (mobile), `gap-8` (desktop)
- Generous margins: `mb-4`, `mt-8`, `mx-12`

**Container Strategy:**
- Mobile: `px-6` padding for breathing room
- Desktop: `max-w-6xl mx-auto px-8 lg:px-12` - narrower for elegance

**Grid Layouts:**
- Product Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12` - spacious, uncluttered
- Maintain 4:5 portrait aspect ratios for product images (more elegant than square)

---

## Color Palette & Application

**Primary Palette:**
- **Cream:** `#F5F3EE` or `bg-stone-50` - Primary background, card surfaces
- **Black:** `#000000` or `text-gray-900` - Headers, body text, borders
- **Charcoal:** `#2D2D2D` or `text-gray-800` - Secondary text
- **Soft Gray:** `#E5E3DF` or `bg-stone-100` - Subtle borders, dividers
- **Botanical Green (Accent):** `#8B9F8D` or custom sage - Delicate floral accents, special badges
- **Pure White:** `#FFFFFF` - Overlays, buttons on images

**Background Treatment:**
- Primary background: `bg-stone-50` (warm cream throughout)
- Card surfaces: `bg-white border border-stone-200` - crisp, refined
- Header: `bg-white border-b border-stone-200`

**Floral Motif Application:**
- Subtle botanical line art in page headers (decorative SVG borders)
- Delicate flower illustrations as dividers between sections
- Watermark-style botanical sketches in empty states
- Corner flourishes on product cards (optional, elegant restraint)

---

## Component Library

### Product Cards
**Structure:**
- White background with delicate border (`bg-white border border-stone-200`)
- Minimal shadow (`shadow-sm hover:shadow-md transition-shadow`)
- No border radius (sharp corners for sophistication) or very subtle `rounded-sm`
- Portrait aspect ratio image container (`aspect-[4/5]`)
- Generous padding: `p-6`

**Content Hierarchy:**
- Product image (top, full-width portrait)
- Botanical accent (subtle corner flourish, top-right as SVG)
- Product name: `text-lg md:text-xl font-serif font-normal tracking-wide text-gray-900 mb-4`
- **Dual Pricing Layout:**
  - Horizontal flex container with two size options
  - 500g option (left): `text-base font-serif text-gray-900` - "500g R110.00"
  - 1kg option (right): `text-base font-serif text-gray-900` - "1kg R220.00"
  - Divider between: subtle vertical line `border-l border-stone-200 px-4`
  - Both clickable with distinct hover states
- Stock indicator: `text-xs font-sans tracking-wide uppercase text-gray-500 mt-2`

**Interaction:**
- Subtle hover state: `hover:border-gray-900 transition-colors`
- Click target: Each price option independently clickable to add respective size to basket

### Navigation Header
**Layout:**
- Sticky positioned: `sticky top-0 z-40`
- Background: `bg-white border-b border-stone-200`
- Height: `h-20` (mobile), `h-24` (desktop)
- Centered logo: "THE NOSH CO." in `text-xl md:text-2xl font-serif font-light tracking-widest uppercase`
- Basket icon (top-right): Minimal stroke icon with item count badge
- Navigation (desktop): Centered below logo or flanking sides in elegant uppercase sans

### Floating Basket Button (Mobile)
**Specifications:**
- Position: `fixed bottom-8 right-6 z-50`
- Size: `w-16 h-16`
- Background: `bg-black text-white` with backdrop blur if over content
- Icon: Shopping basket in white, centered
- Badge: Item count in `bg-white text-black rounded-full absolute -top-2 -right-2`
- Shadow: `shadow-2xl`
- Border: `border-2 border-white` for definition

### Badges & Labels
**Botanical Badge (Special Products):**
- Background: `bg-stone-100 border border-sage-green` (custom sage: #8B9F8D)
- Text: `text-gray-900 text-xs font-sans uppercase tracking-widest`
- Padding: `px-4 py-1.5`
- Border radius: `rounded-full` or sharp `rounded-none`
- Placement: Below product image, centered or top-left corner with floral icon

---

## Images

### Hero Section
**Requirement:** Full-width hero image showcasing The Nosh Co. brand aesthetic
**Specifications:**
- Height: `h-[60vh] md:h-[70vh]` - substantial but not overwhelming
- Image: Styled product photography - artfully arranged fruits and nuts on cream linen, overhead shot, natural lighting, botanical elements (dried flowers, leaves) as props
- Overlay: Subtle dark gradient `bg-gradient-to-b from-transparent to-black/20` for text legibility
- Content centered: Brand tagline in elegant serif, CTA button with blurred background (`backdrop-blur-md bg-white/90 text-black`)
- Button styling: No custom hover states (button's native hover applies) - `px-8 py-3 text-sm font-sans tracking-widest uppercase`

### Product Images
**Style:** Elegant product photography mimicking Jo Malone's aesthetic:
- Cream or white background, never stark white
- Soft, diffused natural lighting
- Portrait orientation (4:5 ratio) for sophistication
- Styled with subtle botanical props (sprigs, leaves) where appropriate
- Products shown in premium packaging/bags when relevant

**Placement:**
- Each product card features one hero image (portrait)
- Images maintain consistent styling across catalog
- Use `object-cover` with portrait aspect ratio

**Placeholder Strategy:**
- Cream background (`bg-stone-50`) with centered botanical line art illustration
- Delicate floral sketch in sage green as placeholder

### Botanical Decorative Elements
**SVG Line Art:**
- Delicate floral corner flourishes on product cards (top corners)
- Section dividers: Horizontal botanical borders (branch with leaves/flowers)
- Header ornaments: Symmetrical floral motifs flanking "THE NOSH CO."
- Empty state illustrations: Hand-drawn botanical sketches

---

## Responsive Behavior

**Breakpoint Strategy:**
- Mobile: 375px base, single column product grid
- Tablet: `md:` at 768px, 2-column grid with increased spacing
- Desktop: `lg:` at 1024px, 3-column grid, maximum elegance

**Touch Targets:**
- Minimum: 44x44px for all interactive elements
- Each price option (500g/1kg) is independently tappable

**Typography Scaling:**
- Generous scaling for elegance: mobile base → +1 at `md:` → +2 at `lg:`

---

## Accessibility & Polish

**Contrast:** Black text on cream backgrounds exceeds WCAG AA
**Focus States:** Visible focus rings `focus:ring-2 focus:ring-gray-900 focus:ring-offset-4 focus:ring-offset-stone-50`
**Semantic HTML:** Proper heading hierarchy, semantic product lists
**Loading States:** Elegant skeleton screens with cream shimmer effect
**Empty States:** Botanical illustration with refined messaging

---

## Animation & Motion (Minimal)

**Transitions:**
- Card hover: `transition-all duration-300 ease-in-out` - refined, not rushed
- Button states: `transition-colors duration-200`
- Subtle fade-ins for sections on scroll (use sparingly)

**Avoid:** Excessive motion, playful animations - maintain sophisticated restraint

---

## South African Context

**Currency Display:** `R220.00` with thin space after R, decimal precision
**Language:** Refined, editorial tone - "Discover," "Curated," "Artisan"
**Units:** Display as `500g` and `1kg` - both options always visible per product