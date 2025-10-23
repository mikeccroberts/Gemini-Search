# Gemini Search

A Perplexity-style search engine powered by Google's Gemini 2.0 Flash model with grounding through Google Search. Get AI-powered answers to your questions with real-time web sources and citations.

Created by [@ammaar](https://x.com/ammaar)

![Kapture 2025-01-04 at 14 35 14](https://github.com/user-attachments/assets/2302898e-03ae-40a6-a16c-301d6b91c5af)


## Features

- 🔍 Real-time web search integration
- 🤖 Powered by Google's latest Gemini 2.0 Flash model
- 📚 Source citations and references for answers
- 💬 Follow-up questions in the same chat session
- 🎨 Clean, modern UI inspired by Perplexity
- ⚡ Fast response times
- 🔐 Secure authentication system
- 🌓 Dark/Light theme toggle
- 📋 One-click answer copying
- 🔢 Search results count display
- 🎯 Optimized UI for all screen resolutions

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript
- AI: Google Gemini 2.0 Flash API
- Search: Google Search API integration

## Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Google API key with access to Gemini API

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ammaarreshi/Gemini-Search.git
   cd Gemini-Search
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   GOOGLE_API_KEYS: your-api-key # your-api-key-1,your-api-key-2

   AUTH_USERNAME: admin
   AUTH_PASSWORD: admin123

   NODE_ENV: development
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Environment Variables

Required environment variables:

- `GOOGLE_API_KEYS`: Comma-separated list of Google API keys with access to Gemini API
  - Get your API key from: https://makersuite.google.com/app/apikey
  - Multiple keys can be provided for load balancing

Authentication variables:
- `AUTH_USERNAME`: Username for authentication (default: admin)
- `AUTH_PASSWORD`: Password for authentication (default: admin123)
  - ⚠️ Make sure to change these in production!

Optional variables:
- `NODE_ENV`: Application environment
  - Set to "development" by default
  - Use "production" for production builds

## Development

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run start`: Run the production server
- `npm run check`: Run TypeScript type checking

## 🐳 Docker Support

### Project Structure
```
.
├── Dockerfile              # Production-optimized multi-stage build
├── docker-compose.yml      # Production Docker Compose configuration
├── docker-compose.dev.yml  # Development Docker Compose configuration
├── .dockerignore          # Files to be ignored by Docker
└── .env                   # Environment variables (not in git)
```

### Environment Variables Setup

1. Copy the example env file and configure:
```bash
cp .env.example .env
```

2. Edit `.env` with your values:
```bash
# Required - set to "production" for production deployment
NODE_ENV=development

# Required - Google API keys
GOOGLE_API_KEYS=your-api-key-1,your-api-key-2

# Required - Authentication (⚠️ Change in production!)
AUTH_USERNAME=admin
AUTH_PASSWORD=your-secure-password
```

### Building and Running

#### Production Mode

1. Build and run with Docker Compose:
```bash
# Build and start the production container
docker compose up -d

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

2. Using Docker directly:
```bash
# Build the image
docker build -t gemini-search .

# Run the container
docker run -p 3000:3000 --env-file .env gemini-search
```

#### Development Mode

For development with hot-reload:
```bash
# Start development environment
docker compose -f docker-compose.dev.yml up

# Or rebuild and start
docker compose -f docker-compose.dev.yml up --build
```

### Docker Configuration Details

**Production (`docker-compose.yml`):**
- Multi-stage build for smaller image size
- Production-only dependencies
- Runs compiled JavaScript from `dist/` directory
- Optimized for security and performance
- Default `NODE_ENV=production`

**Development (`docker-compose.dev.yml`):**
- Hot-reload support with volume mounting
- Development dependencies included
- Runs TypeScript directly with `tsx`
- Default `NODE_ENV=development`

### Important Security Notes

⚠️ **Production Deployment:**
- Always use strong, unique credentials (not default `admin`/`admin123`)
- The app enforces this: default credentials are blocked when `NODE_ENV=production`
- Keep your `.env` file secure and never commit it to version control
- Use secrets management for production deployments (e.g., Docker secrets, Kubernetes secrets)

## Security Notes

- Never commit your `.env` file or expose your API keys
- The `.gitignore` file is configured to exclude sensitive files
- If you fork this repository, make sure to use your own API keys
- Default authentication credentials should be changed in production

## License

MIT License - feel free to use this code for your own projects!

## Acknowledgments

- Inspired by [Perplexity](https://www.perplexity.ai/)
- Built with [Google's Gemini API](https://ai.google.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
