# URL Shortening Service

Full-stack URL shortening service with user authentication, custom shortcodes, configurable link expiration, access tracking, and a management dashboard.

**Live:** [url-app.jircik.dev](https://url-app.jircik.dev) | **API Docs:** [url.jircik.dev/api-docs](https://url.jircik.dev/api-docs)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express 5, MongoDB/Mongoose, JWT, bcrypt |
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI |
| **Security** | Helmet, CORS, express-rate-limit |
| **API Docs** | Swagger/OpenAPI 3.0 |
| **Deployment** | Railway (backend), Cloudflare Workers (frontend) |

## Features

- **URL Shortening** — auto-generated or custom shortcodes with URL validation
- **Link Expiration** — anonymous links expire in 24h; authenticated users choose 1h, 24h, 7d, 30d, or never
- **User Authentication** — register/login with JWT; token-based session management
- **Ownership & Access Control** — only URL creators can edit, enable, or disable their links
- **Access Tracking** — every redirect increments a hit counter
- **Dashboard** — view, edit, sort, and toggle URLs with pagination
- **Rate Limiting** — 200 req/15min global, 20 req/15min on write operations
- **Swagger UI** — interactive API documentation at `/api-docs`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Authenticate |
| GET | `/auth/me` | Get current user (requires token) |

### URLs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shorten` | Create a short URL |
| GET | `/:shortCode` | Redirect to original URL |
| GET | `/details/:shortCode` | Get URL metadata |
| GET | `/urls` | List authenticated user's URLs (paginated) |
| PATCH | `/state/:id` | Toggle active/inactive |
| PUT | `/update/:id` | Update shortcode or destination |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# Clone the repository
git clone https://github.com/jircik/URL-Shortening-Service.git
cd URL-Shortening-Service

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### Environment Variables

Create `.env.development` in the project root:

```env
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://localhost:27017/yourdb
BASE_URL=http://localhost:8080
ALLOWED_ORIGINS=http://localhost:3001
JWT_SECRET=your-secret-key
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Run

```bash
# Start backend (port 8080)
npm run dev

# Start frontend (port 3000) — in a separate terminal
cd client && npm run dev
```

## Project Structure

```
URL-Shortening-Service/
├── src/
│   ├── controllers/       # Auth and URL business logic
│   ├── model/             # Mongoose schemas (User, ShortUrl)
│   ├── middleware/         # JWT auth middleware
│   ├── routes/            # Express route definitions
│   └── config/            # Database and Swagger config
├── client/
│   ├── app/               # Next.js pages (/, /login, /dashboard, /result)
│   ├── components/        # Header, Footer, shadcn/ui components
│   ├── hooks/             # useAuth context hook
│   └── lib/               # API fetch helper
├── server.js              # Express entry point
└── package.json
```

## Deployment

**Backend** is deployed on [Railway](https://railway.app) with a MongoDB Atlas database.

**Frontend** is deployed on [Cloudflare Workers](https://workers.cloudflare.com) using the [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) adapter:

```bash
cd client
npm run deploy
```
