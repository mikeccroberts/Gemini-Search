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
├── Dockerfile          # Main Dockerfile for production build
├── docker-compose.yml  # Docker compose configuration
├── .dockerignore      # Files to be ignored by Docker
└── .env               # Environment variables (not in git)
```

### Environment Variables Setup

1. Local Development:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values
GOOGLE_API_KEYS=your-api-key
AUTH_USERNAME=admin
AUTH_PASSWORD=your-secure-password
```

2. Docker Environment:

Option 1 - Using env file with Docker run:
```bash
# Run container with env file
docker run --env-file .env ai-chat-app
```

Option 2 - Using env file with Docker Compose:
```yaml
services:
  app:
    env_file:
      - .env
```

Option 3 - Direct environment variables in Docker Compose:
```yaml
services:
  app:
    environment:
      - GOOGLE_API_KEYS=${GOOGLE_API_KEYS}
      - AUTH_USERNAME=${AUTH_USERNAME}
      - AUTH_PASSWORD=${AUTH_PASSWORD}
```

### Building and Running

1. Build the Docker image:
```bash
# Build using Dockerfile
docker build -t ai-chat-app .

# Or build using Docker Compose
docker compose build
```

2. Run the application:
```bash
# Using Docker
docker run -p 3000:3000 --env-file .env ai-chat-app

# Using Docker Compose
docker compose up
```

3. Development mode with hot-reload:
```bash
docker compose up --build
```

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
