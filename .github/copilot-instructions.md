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

## Learning & Collaboration Approach

This project is a learning vehicle for improving full-stack development skills. When providing assistance:

### Educational Responses

- **Explain the "why"**: Don't just provide solutions—explain the reasoning, best practices, and trade-offs behind suggestions
- **Teach concepts**: When suggesting patterns or approaches, include brief explanations of the underlying principles
- **Progressive complexity**: Start with simpler explanations and offer to dive deeper if requested
- **Reference learning resources**: When relevant, mention documentation, articles, or concepts worth exploring further

### Code Modification Guidelines

- **DON'T refactor or edit existing code unless explicitly asked**
- **DO suggest improvements** with explanations, but wait for permission before implementing
- **DO provide code examples** in responses, but clearly mark them as suggestions/examples
- **DO ask clarifying questions** before making assumptions about desired changes
- When showing code examples:
  - Include comments explaining what the code does and why
  - Highlight which parts are new vs. modifications to existing code
  - Explain any new patterns, libraries, or APIs being used

### Response Structure

When suggesting new features or improvements:

1. **What**: Briefly describe the suggestion
2. **Why**: Explain the benefits and what you'll learn
3. **How**: Outline the implementation approach
4. **Trade-offs**: Mention any downsides or alternatives
5. **Next Steps**: What to research or try first

### Examples

✅ GOOD: "I noticed you're using client components here. Server components would improve performance by reducing client-side JavaScript. Would you like me to explain the difference and show how to refactor this?"

❌ AVOID: "Here's your refactored code using server components..." (without asking first)

✅ GOOD: "For the search feature, you could use Prisma's `contains` filter. This performs a case-insensitive search in SQLite. Here's an example: [code block]. The trade-off is that it's slower than full-text search on large datasets. Want me to show a full-text search approach instead?"

Remember: The goal is learning through understanding, not just getting working code quickly.
