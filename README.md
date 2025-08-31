# Product Transparency Website

A comprehensive web platform that uses AI to generate intelligent follow-up questions for product submissions and creates professional transparency reports to help consumers make informed decisions.

## Features

- **AI-Powered Questionnaires**: Dynamic question generation based on product category and previous responses
- **Multi-Step Product Submission**: Intuitive form workflow with real-time validation
- **Transparency Scoring**: AI-generated transparency and health scores
- **Professional PDF Reports**: Automated report generation with insights and recommendations
- **PostgreSQL Database**: Secure data storage with full CRUD operations
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI API (GPT-5)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack React Query

## Running Locally

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Setup

1. **Download the project** from Git (use "Export as ZIP" in your GitHub workspace)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** - Create a `.env` file with:
   ```
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up the database**:
   ```bash
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

### Project Structure

```
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared types and schemas
├── drizzle.config.ts # Database configuration
├── package.json     # Dependencies and scripts
└── vite.config.ts   # Build configuration
```

### API Endpoints

- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `POST /api/products/:id/generate-questions` - Generate AI questions
- `GET /api/products/:id/questions` - Get product questions
- `POST /api/products/:id/generate-report` - Generate transparency report
- `GET /api/sample-report` - Download sample PDF report

## Development

The project uses hot module reloading for fast development. Both frontend and backend automatically restart when you make changes.

To add new features:
1. Update the database schema in `shared/schema.ts`
2. Run `npm run db:push` to sync the database
3. Add backend routes in `server/routes.ts`
4. Add frontend components in `client/src/`

## Deployment

The project is configured to run on platforms like Replit, Vercel, or any Node.js hosting service that supports PostgreSQL.