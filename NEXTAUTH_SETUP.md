# NextAuth Environment Setup

To fix the runtime error, you need to set up environment variables for NextAuth.

## Create a `.env.local` file in your project root with:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

## For Production:

```env
NEXTAUTH_SECRET=your-production-secret-key-here
NEXTAUTH_URL=https://your-domain.com
```

## How to generate a secure secret:

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

Or use an online generator and make sure it's at least 32 characters long.

## What this fixes:

1. **Runtime Error**: The "Cannot read properties of undefined (reading 'custom')" error
2. **Session Management**: Proper JWT token handling
3. **Security**: Secure session tokens
4. **Middleware**: Proper authentication checks in middleware

## After adding the environment variables:

1. Stop your development server
2. Run `npm run dev` again
3. The error should be resolved

## Testing:

1. Visit `/auth/login` - should work
2. Login with valid credentials - should redirect to dashboard
3. Visit `/dashboard` without login - should redirect to login
4. Visit `/dashboard` with login - should show dashboard
