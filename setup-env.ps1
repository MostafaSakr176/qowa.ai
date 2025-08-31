# NextAuth Environment Setup Script (PowerShell)

# Run this command to create your .env.local file:

@"
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
"@ | Out-File -FilePath ".env.local" -Encoding UTF8

# Or manually create a .env.local file in your project root with:

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# After creating the file:
# 1. Stop your development server (Ctrl+C)
# 2. Run: npm run dev
# 3. The error should be resolved

# To generate a secure secret, run:
# openssl rand -base64 32
