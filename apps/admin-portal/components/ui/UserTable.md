# UserTable Component

A production-ready, feature-rich table component for managing users in the T.O.O.L.S Inc Admin Portal.

## Features

✅ **Powered by @tanstack/react-table** - Industry-standard table management
✅ **Sortable columns** - Click any column header to sort ascending/descending
✅ **Row selection** - Checkbox selection with "select all" support
✅ **Global search** - Real-time filtering across all columns
✅ **Pagination** - Navigate through large datasets with controls
✅ **Action buttons** - Edit, View Details, Activate/Deactivate per row
✅ **Framer Motion animations** - Smooth row entrance and exit animations
✅ **Loading state** - Animated skeleton UI during data fetch
✅ **Empty state** - User-friendly message when no data exists
✅ **Glassmorphism design** - Follows admin portal theme (red/orange accents)
✅ **Fully typed** - Complete TypeScript support
✅ **Responsive** - Works on all screen sizes

## Installation

The component is already configured with all dependencies:
- `@tanstack/react-table` - Table functionality
- `framer-motion` - Animations
- `lucide-react` - Icons
- `date-fns` - Date formatting

## Usage

```tsx
"use client";

import { useState } from "react";
import { UserTable, type User } from "@/components/ui/UserTable";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "active",
      lastLogin: "2024-01-15T10:30:00Z",
      createdAt: "2023-01-01T00:00:00Z",
    },
    // ... more users
  ]);
  const [loading, setLoading] = useState(false);

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
    // Open edit modal or navigate to edit page
  };

  const handleToggleStatus = (user: User) => {
    // Update user status via API
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  const handleViewDetails = (user: User) => {
    console.log("View details:", user);
    // Navigate to user detail page
  };

  return (
    <UserTable
      users={users}
      loading={loading}
      onEdit={handleEdit}
      onToggleStatus={handleToggleStatus}
      onViewDetails={handleViewDetails}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `users` | `User[]` | ✅ Yes | Array of user objects to display |
| `loading` | `boolean` | ❌ No | Shows skeleton UI when `true` (default: `false`) |
| `onEdit` | `(user: User) => void` | ✅ Yes | Callback when edit button is clicked |
| `onToggleStatus` | `(user: User) => void` | ✅ Yes | Callback when activate/deactivate button is clicked |
| `onViewDetails` | `(user: User) => void` | ✅ Yes | Callback when view details button is clicked |
| `className` | `string` | ❌ No | Additional CSS classes for the table container |

## User Type

```typescript
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string | null; // ISO 8601 timestamp or null
  avatar?: string; // Optional avatar URL
  createdAt?: string; // ISO 8601 timestamp
};
```

## Columns

1. **Select** - Checkbox for row selection
2. **Avatar** - User avatar or initials in gradient circle
3. **Name** - User's full name (sortable)
4. **Email** - User's email address (sortable)
5. **Role** - User role with badge styling (sortable)
6. **Status** - Active/Inactive with color-coded badge (sortable)
7. **Last Login** - Formatted date or "Never" (sortable)
8. **Actions** - Action buttons (View, Edit, Activate/Deactivate)

## Features in Detail

### Sorting
- Click any column header to toggle sort order
- Visual indicators: ↑ (ascending), ↓ (descending), ⇅ (unsorted)
- Multi-column sorting not enabled by default

### Search/Filter
- Global search across all columns
- Real-time filtering as you type
- Shows "No results found" message when no matches

### Pagination
- Default page size: 10 rows
- Navigation buttons: First, Previous, Next, Last
- Shows current page and total pages
- Shows result count (e.g., "Showing 1 to 10 of 50 results")
- Disabled buttons when at boundaries

### Row Selection
- Click checkbox to select individual rows
- Click header checkbox to select all visible rows
- Selected count badge appears when rows are selected
- Selected rows highlighted with brand color overlay

### Loading State
- Animated skeleton UI with 5 placeholder rows
- Uses glassmorphism styling
- Pulse animation for loading effect

### Empty State
- Centered message with icon
- Shown when no users exist (not when filtered to zero)
- Friendly call-to-action message

### Animations
- Rows fade in with staggered delay (0.02s per row)
- Smooth transitions on hover
- Action buttons scale on hover/tap
- AnimatePresence for smooth entry/exit

## Styling

The component uses the admin portal theme:
- **Background**: Glassmorphism (`glass` utility class)
- **Colors**: Red (#ef4444), Orange (#f97316), Purple (#8b5cf6)
- **Spacing**: Consistent padding and gaps
- **Typography**: System font stack with proper hierarchy
- **Borders**: Subtle borders with `border-border` color

### Customization

You can override styles using the `className` prop:

```tsx
<UserTable
  className="shadow-2xl"
  users={users}
  // ... other props
/>
```

## Performance Considerations

- Uses `useMemo` for column definitions to prevent re-renders
- @tanstack/react-table handles virtualization and optimization
- AnimatePresence in `popLayout` mode for efficient animations
- Only renders visible rows (pagination handles large datasets)

## Accessibility

- ✅ Proper ARIA labels on buttons and checkboxes
- ✅ Keyboard navigation support (via @tanstack/react-table)
- ✅ Focus states on interactive elements
- ✅ Semantic HTML structure (proper `<table>`, `<thead>`, `<tbody>`)
- ✅ Screen reader friendly

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Table not rendering
- Ensure `users` prop is an array (can be empty)
- Check browser console for errors
- Verify all required props are provided

### Sorting not working
- Ensure data has proper values (not undefined/null)
- Check column `accessorKey` matches data keys

### Animations choppy
- Reduce number of rows per page
- Check for other heavy animations on the page
- Disable animations if performance is critical

### TypeScript errors
- Ensure User type matches your data structure
- Check all callback handlers have correct signatures

## Future Enhancements

Potential features to add:
- [ ] Multi-column sorting
- [ ] Column visibility toggle
- [ ] Export to CSV/Excel
- [ ] Bulk actions (delete, activate, etc.)
- [ ] Advanced filters (role, status, date range)
- [ ] Column resizing
- [ ] Row drag-and-drop reordering
- [ ] Inline editing
- [ ] Custom cell renderers
- [ ] Server-side pagination/sorting

## Examples

### With API Integration

```tsx
"use client";

import { useState, useEffect } from "react";
import { UserTable, type User } from "@/components/ui/UserTable";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleEdit = async (user: User) => {
    // Navigate or open modal
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await fetch(`/api/users/${user.id}/toggle-status`, {
        method: "PATCH",
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u
        )
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleViewDetails = (user: User) => {
    window.location.href = `/users/${user.id}`;
  };

  return (
    <UserTable
      users={users}
      loading={loading}
      onEdit={handleEdit}
      onToggleStatus={handleToggleStatus}
      onViewDetails={handleViewDetails}
    />
  );
}
```

### With Custom Styling

```tsx
<UserTable
  className="shadow-2xl border-2 border-brand/20"
  users={users}
  loading={loading}
  onEdit={handleEdit}
  onToggleStatus={handleToggleStatus}
  onViewDetails={handleViewDetails}
/>
```

## License

Part of T.O.O.L.S Inc Admin Portal
