# Spike Admin Sidebar Component

A modern, responsive sidebar navigation component built with Angular 20+ and Tailwind CSS.

## Features

### ✨ Design & Styling
- **Clean, minimal design** with light gray/off-white background (#f8f9fa)
- **Rounded corners** on the sidebar container (12px border-radius)
- **Subtle shadow** for depth using Tailwind's shadow utilities
- **Fixed width** of 280px (18rem) for desktop
- **Full height layout** that adapts to screen size
- **Inter font family** for modern typography

### 🎨 Header Section
- **Rocket/Spike icon** in blue (#3b82f6) with rounded background
- **"Spike Admin" title** with bold, clean typography
- **Proper spacing** and alignment

### 🧭 Navigation Structure

#### Main Section
- **Tooltips** - Management interface for help content

#### Pages Section
- **Roll Base Access** (PRO) - User role and permission management
- **Treeview** - Hierarchical data visualization
- **Pricing** - Pricing plans and billing
- **Account Setting** - User account configuration
- **FAQ** - Frequently asked questions
- **Landingpage** - Landing page management

#### Widgets Section
- **Expandable/collapsible** widgets menu
- **Charts** - Data visualization widgets
- **Tables** - Table display widgets

#### Extra Section
- **Icons** - Icon library and management
- **Sample Page** - Template and example pages

#### Forms Section
- **Basic Forms** - Standard form components
- **Advanced Forms** (PRO) - Complex form builders

### 🎯 Interactive Features

#### Hover Effects
- **Smooth transitions** (200ms cubic-bezier easing)
- **Color changes** on hover with subtle transform
- **Icon color transitions** for visual feedback

#### Expandable Widgets
- **Toggle functionality** for widgets submenu
- **Animated arrow rotation** (180deg when expanded)
- **Smooth expand/collapse** with proper ARIA attributes

#### Active States
- **Blue accent** with left border highlight
- **Background color change** for active items
- **Font weight adjustment** for active states

### ♿ Accessibility Features

#### ARIA Support
- **Proper ARIA labels** on all interactive elements
- **Role attributes** for semantic markup
- **aria-expanded** for expandable sections
- **aria-controls** linking expandable buttons to content

#### Keyboard Navigation
- **Focus indicators** with ring styling
- **Tab order** properly maintained
- **High contrast mode** support

#### Screen Reader Support
- **Descriptive labels** for all navigation items
- **Section headers** properly marked up
- **Icon descriptions** for visual elements

### 📱 Responsive Design

#### Mobile (≤768px)
- **Full width** sidebar layout
- **Adjusted padding** for smaller screens
- **Optimized touch targets** for mobile interaction
- **Proper stacking order** in mobile layout

#### Desktop
- **Fixed 280px width** for consistent layout
- **Smooth scrolling** with custom scrollbar
- **Hover effects** optimized for mouse interaction

### 🌙 Dark Mode Support
- **Automatic detection** of user preference
- **Dark color scheme** with proper contrast
- **Adjusted colors** for all interactive states
- **Consistent branding** across themes

## Usage

### Basic Implementation
```typescript
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  // ... other config
  imports: [SidebarComponent]
})
export class AppComponent {}
```

### HTML Template
```html
<div class="dashboard-layout">
  <app-sidebar class="sidebar-container"></app-sidebar>
  <main class="main-content">
    <!-- Your content here -->
  </main>
</div>
```

### Required Styles
The component uses Tailwind CSS and requires the following layout styles:

```scss
.dashboard-layout {
  @apply flex flex-1;
  
  .sidebar-container {
    @apply flex-shrink-0;
  }
  
  .main-content {
    @apply flex-1 bg-gray-50 overflow-hidden;
  }
}
```

## Dependencies

- **Angular 20+**
- **Angular Material** (for icons and tooltips)
- **Tailwind CSS 3+**
- **Angular Router** (for navigation)

## Customization

### Colors
The component uses CSS custom properties and Tailwind classes. Key colors can be customized:

- **Primary blue**: `#3b82f6` (bg-blue-500)
- **Background**: `#f8f9fa` (bg-gray-50)
- **Text colors**: Various gray shades
- **PRO badges**: Blue with light background

### Icons
Icons use Material Icons. Replace icon names in the template to customize:

```typescript
// Example: Change rocket to dashboard
<mat-icon class="header-icon">dashboard</mat-icon>
```

### Navigation Items
Add or modify navigation items by updating the template structure:

```html
<a [routerLink]="'/new-page'" routerLinkActive="active" class="nav-item">
  <mat-icon class="nav-icon">new_icon</mat-icon>
  <span class="nav-label">New Page</span>
  <span class="pro-badge">PRO</span> <!-- Optional -->
</a>
```

## Performance

- **Lazy loading** compatible
- **OnPush change detection** ready
- **Minimal bundle impact** with tree-shaking
- **Optimized animations** with CSS transitions

## Browser Support

- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

## Contributing

When modifying the sidebar:

1. **Maintain accessibility** standards
2. **Test responsive behavior** on all screen sizes
3. **Verify keyboard navigation** works properly
4. **Check color contrast** ratios for accessibility
5. **Update documentation** for any new features

## License

Part of the Spike Admin Dashboard project.
