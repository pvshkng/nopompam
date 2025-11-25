## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js
- npm, pnpm or bun
- Docker (optional, for containerized setup)

## Getting Started

1. Install Dependencies
- ```npm install```

2. Set Up Environment Variables
- Copy the .env.example file to .env.local
- Fill in the required environment variables in .env.local

3. Run the Dev Server
- ```npm run dev```

4. Run with Docker (Optional)
- docker build -t nopompam .
- docker run -p 3000:3000 --env-file .env.local nopompam
