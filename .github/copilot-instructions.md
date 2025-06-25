# Copilot Instructions for Daily Accomplishments Tracker

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js TypeScript application for tracking daily accomplishments with the following features:

- Track daily accomplishments with tagging and categorization
- View accomplishments at different time scales (daily, weekly, monthly, yearly)
- Sort and filter accomplishments by various criteria
- Self-hosted database integration using Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Database**: SQLite with Prisma ORM (can be upgraded to PostgreSQL)
- **UI**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and server components

## Code Style Guidelines

- Use TypeScript for all files
- Prefer server components over client components when possible
- Use Prisma for all database operations
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement proper error handling and loading states
- Use descriptive variable and function names
- Add proper TypeScript types for all data structures

## Database Schema

The main entities are:

- **Accomplishment**: The core entity with title, description, date, tags, category
- **Tag**: Reusable labels for accomplishments
- **Category**: High-level groupings for accomplishments

## File Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions, database client, and shared logic
- `/prisma` - Database schema and migrations
- `/public` - Static assets
