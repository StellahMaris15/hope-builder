# Hope Builder

You are a full-stack system architect. Your task is to generate a comprehensive, production-ready system recreate the system shown in image.png being attached as a fully functional web application with Supabase backend integration.

The system consists of two parts:

**Public-Facing Website (HOPE Alliance):**

- Hero section with headline "Building Hope. Transforming Lives."

- Impact metrics display (1,500+ people, 500+ students, 200+ youth, 30+ projects)

- Six Programs section (Education, Mentorship, Youth Conference, Charity, Ministry, Skills)

- Blog section

- Upcoming Events listing

- Contact form and Newsletter signup

**Admin Dashboard** (protected/authenticated):

- Sidebar navigation with modules: Programs, Events, Blog Posts, Donations, Event Registrations, Volunteers, Mentors, Prayer Requests, Messages, Newsletter, Media, Users, Settings

- Key metrics cards: Total Donations (UGX 8.5M, +22% 30-day), Total Volunteers (43, -12%), Event Registrations (127, +25%), Active Programs (6), Published Blog Posts (25), Unread Messages (12)

- Charts: Monthly Donations Overview (line chart) and Donations by Purpose (pie chart with Education 40%, Youth 25%, Charity 20%, Community 10%, General Fund 5%)

- Recent lists for donations, events, applications (with status tracking), and messages (Unread/Read status)

**Supabase Backend Requirements:**

Create database tables for: Programs, Events, Blog Posts, Donations, Event Registrations, Volunteers, Mentors, Prayer Requests, Messages, Newsletter Subscribers, Media, Users, and Settings. Set up Row Level Security (RLS) policies to restrict admin dashboard access to authenticated users, and ensure the public website queries only published/approved content.

Generate a detailed, step-by-step prompt that includes UI/UX specifications, database schema setup, authentication flow, and all necessary API connections. The application that matches the system architecture shown in the image.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
