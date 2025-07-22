# Environment Management

This project uses multiple environment files to easily switch between development, staging, and production configurations.

## Available Environments

- **Development** (`dev`): Local development with localhost URLs
- **Production** (`prod`): Live production environment
- **Staging** (`staging`): Staging environment for testing

## Environment Files

- `.env.development` - Development configuration
- `.env.production` - Production configuration  
- `.env.staging` - Staging configuration
- `.env.local` - Active environment (auto-generated)

## How to Switch Environments

### Method 1: Using NPM Scripts (Recommended)

```bash
# Switch to development
npm run env:dev

# Switch to production
npm run env:prod

# Switch to staging
npm run env:staging

# Combined: Switch to dev and start development server
npm run dev:local

# Combined: Switch to staging and start development server
npm run dev:staging

# Combined: Switch to prod and build
npm run build:prod
```

### Method 2: Using Node.js Script

```bash
# Switch environments
node switch-env.js dev
node switch-env.js prod
node switch-env.js staging
```

### Method 3: Using PowerShell (Windows)

```powershell
# Switch environments
.\switch-env.ps1 dev
.\switch-env.ps1 prod
.\switch-env.ps1 staging
```

### Method 4: Using Batch File (Windows)

```cmd
# Switch environments
switch-env.bat dev
switch-env.bat prod
switch-env.bat staging
```

## What Happens When You Switch

1. **Backup**: Current `.env.local` is backed up with timestamp
2. **Copy**: Selected environment file is copied to `.env.local`
3. **Confirmation**: Shows current configuration
4. **Ready**: Your app will use the new environment on next start/build

## Environment Variables

### Development
- API URL: `http://localhost:3001`
- WebSocket: `ws://localhost:3001` 
- Stripe: Test keys
- Node: `development`

### Production
- API URL: `https://musl-infl.onrender.com`
- WebSocket: `wss://musl-infl.onrender.com`
- Stripe: Live keys
- Node: `production`

### Staging
- API URL: `https://musl-infl-staging.onrender.com`
- WebSocket: `wss://musl-infl-staging.onrender.com`
- Stripe: Test keys
- Node: `production`

## Tips

- Always switch environment before starting development or building
- The `.env.local` file is automatically generated - don't edit it directly
- Backups are created automatically when switching environments
- Use `npm run dev:local` for quick development setup
- Use `npm run build:prod` for production builds

## Troubleshooting

If you get permission errors on Windows with PowerShell scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Adding New Environments

1. Create a new `.env.{environment-name}` file
2. Add the environment to the switch scripts
3. Update this README
