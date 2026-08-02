# Portal Hub

The Portal Hub is a centralized dashboard for T.O.O.L.S Inc that provides users with easy access to all portals they have permission to use based on their assigned roles.

## Features

- **Role-Based Access Control**: Shows only the portals users have access to based on their roles
- **Quick Statistics**: Displays key metrics on the dashboard
- **Modern UI**: Built with Next.js 14, Tailwind CSS, and Framer Motion
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Available Portals

1. **Client Portal** - For clients to access courses and track progress
2. **Case Manager Portal** - For staff to manage clients and cases
3. **Admin Portal** - For administrators with full system access
4. **Learning Hub** - Course catalog available to all users
5. **Reports & Analytics** - For case managers and admins

## Local Development

```bash
# Navigate to portal-hub directory
cd apps/portal-hub

# Install dependencies
npm install

# Run development server (defaults to port 3004)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

The portal hub uses the following environment variables (set in root `.env` file):

- `NEXT_PUBLIC_CLIENT_PORTAL_URL` - URL for client portal
- `NEXT_PUBLIC_CASEMGR_PORTAL_URL` - URL for case manager portal
- `NEXT_PUBLIC_ADMIN_PORTAL_URL` - URL for admin portal
- `NEXT_PUBLIC_HUB_URL` - URL for portal hub itself
- `NEXT_PUBLIC_LEARNING_URL` - URL for learning portal

## API Integration

Currently, the portal hub uses mock data for demonstration purposes. To integrate with the actual API:

1. Uncomment the API fetch code in `app/page.tsx`
2. Implement the `/api/v1/users/me` endpoint in your backend
3. Ensure proper authentication headers are sent with requests

## Deployment

The portal hub is configured as a static export and can be deployed to:

- Azure Static Web Apps
- Vercel
- Netlify
- Any static hosting provider

Custom domain: `portal.sdtoolsinc.org`

## Role Configuration

Roles are defined in `lib/portal-config.ts`:

- `client` - Basic user access
- `case_manager` - Staff member access
- `admin` - Full system access
- `auditor` - Read-only analytics access

Update the `PORTAL_DEFINITIONS` object to modify portal access requirements.
