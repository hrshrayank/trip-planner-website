
# Trip Planner Website

## Description

The Trip Planner Website is a web application designed to assist users in planning their trips efficiently. Built with React and Vite, it offers a fast and interactive user experience, enabling users to create, manage, and share travel itineraries seamlessly. The project integrates ESLint for code quality and Tailwind CSS for modern styling. It is deployed on Vercel for reliable access.

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hrshrayank/trip-planner-website.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the root directory and add the following variables:
   ```plaintext
   VITE_GOOGLE_PLACE_API_KEY = '<your-google-place-api-key>'
   VITE_GOOGLE_GEMINI_API_KEY = '<your-google-gemini-api-key>'
   VITE_GOOGLE_AUTH_CLIENT_API_KEY = '<your-google-auth-client-api-key>'
   VITE_FIREBASE_AUTH_API_KEY = '<your-firebase-auth-api-key>'
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Technologies Used

- **React**: JavaScript library for building user interfaces
- **Vite**: Frontend build tool for fast and efficient development
- **Tailwind CSS**: Utility-first CSS framework
- **Vercel**: Platform for frontend developers, providing global deployments
- **Google Places API**: Location-based search
- **Google Gemini**: Trip planning intelligence
- **Google OAuth**: User authentication
- **Firebase**: Database management
