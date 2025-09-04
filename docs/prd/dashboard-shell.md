# PRD: Dashboard Shell

## Overview
Create the foundational dashboard structure with navigation, layout, and routing for the sales analytics application.

## Requirements

### Navigation Structure
The dashboard should have a sidebar navigation with the following menu items:

1. **Overview** (`/dashboard`)
   - Default landing page
   - High-level metrics and charts

2. **Customers** (`/dashboard/customers`)
   - Customer management interface

3. **Products** (`/dashboard/products`)
   - Product catalog and management

4. **Sales** (`/dashboard/sales`)
   - Sales transactions and management

5. **Reports** (`/dashboard/reports`)
   - Analytics and reporting views

### Layout Components

#### Sidebar Navigation
- Fixed left sidebar (240px width)
- Company logo/title at top
- Menu items with icons
- Active state highlighting
- Collapsible on mobile

#### Top Header
- Page title (dynamic based on current route)
- User info placeholder (no auth required)
- Breadcrumb navigation
- Mobile menu toggle button

#### Main Content Area
- Full height layout
- Responsive padding
- Scroll container for content

### Technical Requirements

#### File Structure
```
app/dashboard/
├── layout.tsx           # Dashboard layout wrapper
├── page.tsx            # Overview page
├── customers/          # Customer section
├── products/           # Products section
├── sales/              # Sales section
└── reports/            # Reports section

components/dashboard/
├── sidebar.tsx         # Navigation sidebar
├── header.tsx          # Top header
└── nav-item.tsx        # Individual nav items
```

#### Responsive Behavior
- **Desktop (≥1024px)**: Sidebar always visible
- **Tablet (768-1023px)**: Sidebar collapsible
- **Mobile (<768px)**: Sidebar overlay/drawer

#### Styling Requirements
- Use Tailwind CSS utilities
- Dark mode ready (css variables for colors)
- Consistent spacing using Tailwind scale
- Smooth transitions for interactive elements

### Navigation State Management
- Active route highlighting
- URL-based navigation state
- Mobile menu open/close state

### Icons
Use Lucide React icons for:
- Dashboard: `BarChart3`
- Customers: `Users`
- Products: `Package`
- Sales: `ShoppingCart`
- Reports: `FileText`
- Menu toggle: `Menu` / `X`

## Acceptance Criteria

### Functional Requirements
- [ ] Navigation renders correctly on all screen sizes
- [ ] Active page is highlighted in navigation
- [ ] Mobile menu can be opened/closed
- [ ] All navigation links route correctly
- [ ] Page titles update based on current route

### Technical Requirements
- [ ] Uses Next.js App Router layout pattern
- [ ] Follows established component patterns from claude.md
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] TypeScript interfaces for all props
- [ ] Clean component composition (no prop drilling)

### Visual Requirements
- [ ] Consistent spacing and typography
- [ ] Professional appearance suitable for business dashboard
- [ ] Icons align properly with text
- [ ] Smooth hover/active state transitions
- [ ] Mobile-friendly touch targets (44px minimum)

## Implementation Notes

### Component Hierarchy
```
DashboardLayout
├── Sidebar
│   └── NavItem (repeated for each menu item)
├── Header
│   ├── PageTitle
│   └── MobileMenuToggle
└── main (content area)
    └── {children}
```

### State Management
- Use React state for mobile menu toggle
- Use Next.js router for active route detection
- No global state needed at this level

### Accessibility
- Proper ARIA labels for navigation
- Keyboard navigation support
- Screen reader friendly structure
- Focus management for mobile menu
