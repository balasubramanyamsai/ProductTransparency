# Product Transparency Website

## Overview

This is a full-stack web application designed to collect detailed product information through dynamic, intelligent follow-up questions and generate structured Product Transparency Reports. The platform helps companies build trust with consumers by providing comprehensive product insights through AI-powered questionnaires and professional PDF reports.

The application uses a modern tech stack with React/TypeScript frontend, Node.js/Express backend, PostgreSQL database, and integrates with OpenAI for intelligent question generation. It features a multi-step form interface, dynamic AI-driven questions, transparency scoring, and automated PDF report generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript throughout for type consistency across the stack
- **API Design**: RESTful endpoints for products, AI questions, and reports
- **File Structure**: Modular architecture with separate route handlers, storage layer, and service modules
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Database Architecture
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema Design**: 
  - Users table for basic authentication
  - Products table with JSONB fields for flexible data storage
  - AI Questions table for dynamic question management
  - Reports table for generated transparency reports
- **Migrations**: Drizzle Kit for database schema migrations

### AI Integration
- **Provider**: OpenAI API for intelligent question generation
- **Services**: 
  - Dynamic follow-up question generation based on product category and previous responses
  - Transparency score calculation
  - Context-aware questioning that adapts to product type and target audience
- **Question Types**: Support for text, select, range, and checkbox question types

### PDF Generation
- **Service**: Custom PDF generation service for transparency reports
- **Features**: 
  - Professional report formatting with company branding
  - Dynamic content based on product data and AI responses
  - Transparency scoring visualization
  - Recommendations and insights
- **Download**: Direct browser downloads with proper file naming

### Authentication Strategy
- **Current**: Demo user system for development and testing
- **Future**: Designed to support user-based authentication with company-specific access control
- **Session Management**: Ready for session-based authentication implementation

### File Organization
- **Shared Types**: Common schema definitions and types in `/shared` directory
- **Client Code**: React application in `/client` directory with organized components, pages, and utilities
- **Server Code**: Express application in `/server` directory with modular service architecture
- **Configuration**: Centralized configuration files for build tools, database, and development environment

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL for serverless database hosting
- **AI Service**: OpenAI API for intelligent question generation and analysis
- **Hosting**: Designed for deployment on platforms like Replit, Vercel, or similar

### Key Libraries
- **Frontend**: React, TanStack React Query, Tailwind CSS, shadcn/ui, React Hook Form, Zod
- **Backend**: Express.js, Drizzle ORM, OpenAI SDK
- **Database**: @neondatabase/serverless, Drizzle ORM with PostgreSQL dialect
- **Development**: Vite, TypeScript, tsx for Node.js execution

### Development Tools
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Type Checking**: TypeScript with strict configuration across frontend and backend
- **Code Quality**: Consistent imports and module resolution with path aliases
- **Development Server**: Hot module replacement and error overlays for efficient development