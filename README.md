# Movie Master

Movie Master is a modern web application designed for movie enthusiasts to discover, track, and review their favorite movies and TV shows. Built with Next.js and Tailwind CSS, it offers a sleek, responsive interface with dark mode support.

## Features ✨

- **Browse Content**: Explore popular, top-rated, and trending movies and TV shows
- **Watchlist Management**: Create and manage your personal watchlist
- **Reviews**: Write and read reviews for movies and TV shows
- **User Authentication**: Secure login and registration with NextAuth
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Design**: Optimized for desktop and mobile devices
- **Search Functionality**: Find movies and TV shows quickly

## Tech Stack 🛠️ 

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Database**: Mongoose for MongoDB integration

## Getting Started 🚀

### Prerequisites

- Node.js (version 18 or higher)
- MongoDB database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd movie-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following secrets:
   ```bash
   MONGO_URI_LOCAL = <mongodb_local_url>
   NODE_ENV = 'development'
   NEXTAUTH_SECRET = <your_secret>
   NEXT_PUBLIC_URL = http://localhost:<your_port>
   NEXT_PUBLIC_TMDB_ACCESS_TOKEN = <tmdb_access_token>
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure 📁

- `app/`: Next.js app directory with pages and components
- `components/`: Reusable React components
- `api/`: API routes for backend functionality
- `models/`: MongoDB models
- `utils/`: Utility functions
- `public/`: Static assets

## Pages 

- **Home** (`/`): Browse featured content
- **About** (`/about`): Learn more about Movie Master
- **Movie Details** (`/movie/[id]`): View detailed information about a movie
- **TV Show Details** (`/tv/[id]`): View detailed information about a TV show
- **Watchlist** (`/watchlist`): Manage your watchlist
- **Login/Register**: User authentication


