# Daily Accomplishments Tracker

A modern web application for tracking your daily accomplishments with tagging, categorization, and analytics. Built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Features

- ✅ **Track Accomplishments**: Record your daily achievements with detailed descriptions
- 🏷️ **Smart Tagging**: Organize accomplishments with custom tags
- 📊 **Categories**: Group accomplishments by different areas of your life
- 📈 **Analytics**: View your progress with insightful statistics
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🗄️ **Self-hosted Database**: SQLite database with Prisma ORM (upgradeable to PostgreSQL)

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript and Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **UI Components**: Lucide React icons
- **Charts**: Recharts for data visualization

## Getting Started

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses three main entities:

- **Accomplishment**: Core entity with title, description, date, category, and tags
- **Category**: High-level groupings (Work, Personal, Health, etc.)
- **Tag**: Flexible labels for fine-grained organization

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma studio` - Open database admin interface

## Self-Hosting

The application is designed to be easily self-hosted:

1. Build the application: `npm run build`
2. Set up your database (SQLite file is portable)
3. Deploy using Docker, Vercel, or any Node.js hosting platform

## Future Enhancements

- Calendar view for accomplishments
- Data export/import functionality
- Weekly/monthly goal tracking
- Advanced analytics and insights
- Team collaboration features

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
