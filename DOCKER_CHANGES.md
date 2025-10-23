# Docker Configuration Changes

## Summary

This document outlines the Docker configuration improvements made after the security audit merge.

## Changes Made

### 1. **Dockerfile Optimizations**

**Before:**
- Installed unnecessary `vite` dependency in production stage
- Used `npm run start` command
- Had `NODE_ENV=production` hardcoded in build stage

**After:**
- Removed unnecessary `vite` dependency from production stage
- Changed to direct `node dist/index.js` execution for faster startup
- Removed hardcoded `NODE_ENV` to allow runtime configuration
- Cleaner, smaller production image

### 2. **docker-compose.yml Improvements**

**Before:**
- Missing `NODE_ENV` environment variable
- Used volume mount for `.env` file

**After:**
- Added `NODE_ENV` with default value `production`
- Changed to `env_file` directive for better practice
- Explicitly declares all required environment variables

### 3. **New Development Configuration**

**Added:** `docker-compose.dev.yml`
- Simplified development setup
- Hot-reload support with volume mounting
- Default development credentials
- Direct node image usage (no build required for dev)

### 4. **.dockerignore Enhancements**

**Before:**
- Basic file exclusions
- Excluded all markdown files

**After:**
- Well-organized sections with comments
- Preserves README.md in container
- Keeps `.env.example` for reference
- More comprehensive exclusions

### 5. **Environment Variables**

**Updated `.env.example`:**
- Added `NODE_ENV` variable
- Better documentation and warnings
- Clear production deployment guidelines

### 6. **Documentation**

**Updated README.md:**
- Comprehensive Docker section
- Separate instructions for production and development
- Security best practices emphasized
- Clear examples for both modes

## Usage

### Production Deployment

```bash
# Build and start
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Development Mode

```bash
# Start with hot-reload
docker compose -f docker-compose.dev.yml up

# Rebuild and start
docker compose -f docker-compose.dev.yml up --build
```

## Security Improvements

1. **Environment-based credential validation:**
   - Default credentials (`admin`/`admin123`) are blocked in production
   - Enforced through `server/env.ts` validation

2. **Proper environment variable handling:**
   - No sensitive data in Dockerfile
   - Environment variables passed at runtime
   - Support for Docker secrets (future enhancement)

3. **Minimal attack surface:**
   - Production image contains only necessary dependencies
   - No development tools in production
   - Smaller image size = fewer vulnerabilities

## Migration Guide

If you were using the old Docker configuration:

1. **Update your `.env` file:**
   ```bash
   # Add NODE_ENV if not present
   NODE_ENV=production  # or development
   ```

2. **For production, ensure strong credentials:**
   ```bash
   AUTH_USERNAME=your_secure_username
   AUTH_PASSWORD=your_very_secure_password_here
   ```

3. **Rebuild your containers:**
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```

## Technical Details

### Build Process

**Multi-stage build:**
1. **Builder stage:** Compiles TypeScript and builds frontend with Vite
2. **Production stage:** Copies only compiled code and installs production dependencies

**Benefits:**
- Smaller final image (~200MB vs ~500MB)
- Faster startup time
- Better security (no source code in production)

### Environment Variable Precedence

1. Environment variables in `docker-compose.yml`
2. Variables from `.env` file via `env_file`
3. System environment variables
4. Default values (e.g., `NODE_ENV:-production`)

### Cookie Security

The application automatically sets secure cookies based on `NODE_ENV`:
- `development`: `secure: false` (works with HTTP)
- `production`: `secure: true` (requires HTTPS)

## Troubleshooting

### Issue: "Default credentials not allowed in production"

**Solution:** Update your `.env` file with non-default credentials:
```bash
AUTH_USERNAME=myuser
AUTH_PASSWORD=mySecurePassword123!
```

### Issue: Container can't start - missing environment variables

**Solution:** Ensure your `.env` file exists and contains all required variables:
```bash
NODE_ENV=production
GOOGLE_API_KEYS=your-keys-here
AUTH_USERNAME=your-username
AUTH_PASSWORD=your-password
```

### Issue: Changes not reflected in development mode

**Solution:** 
1. Ensure you're using `docker-compose.dev.yml`
2. Check that volumes are mounted correctly
3. Restart the container: `docker compose -f docker-compose.dev.yml restart`

## Next Steps

Recommended improvements for production deployments:

1. **Use Docker Secrets** for sensitive data
2. **Add health checks** to Dockerfile
3. **Implement multi-replica setup** with load balancing
4. **Add Redis** for session storage (replace in-memory sessions)
5. **Configure reverse proxy** (nginx) for SSL termination
6. **Set up monitoring** and logging aggregation

## Questions?

For issues or questions about the Docker configuration, please open an issue on the repository.
