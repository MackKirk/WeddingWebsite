# Wedding Website - Full Stack Application

A beautiful, elegant wedding website with a public frontend and admin panel for content management.

## Features

- **Public Website**: Elegant wedding pages with premium visual design
- **Admin Panel**: Full CRUD interface for managing all content
- **Image Upload**: Upload and manage images through the admin panel
- **RSVP System**: Guest RSVP form with admin viewer
- **Responsive Design**: Mobile-first, app-like experience

## Tech Stack

### Backend
- FastAPI (Python)
- SQLAlchemy (ORM)
- Alembic (Migrations)
- PostgreSQL (Production) / SQLite (Development)
- JWT Authentication

### Frontend
- React 18
- Vite
- React Router
- TailwindCSS
- Framer Motion
- Axios

## Project Structure

```
Wedding/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── core/        # Configuration, database, security
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── routers/     # API routes
│   │   └── main.py      # FastAPI app
│   ├── alembic/         # Database migrations
│   └── static/uploads/  # Uploaded images
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Public pages
│   │   ├── admin/       # Admin panel
│   │   └── services/    # API services
└── README.md
```

## Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (optional, SQLite used by default)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```env
DATABASE_URL=sqlite:///./wedding.db
JWT_SECRET=your-secret-key-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CORS_ORIGINS=["http://localhost:5173"]
ENVIRONMENT=dev
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Deployment to Render

### 1. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Name your database (e.g., `wedding-db`)
4. Note the **Internal Database URL** and **External Database URL**

### 2. Deploy Backend

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `wedding-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

4. Add Environment Variables:
   ```
   DATABASE_URL=<Internal Database URL from step 1>
   JWT_SECRET=<generate a strong random secret>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<choose a strong password>
   CORS_ORIGINS=["https://your-frontend-url.onrender.com"]
   ENVIRONMENT=prod
   ```

5. Deploy the service

### 3. Deploy Frontend

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: `wedding-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Root Directory**: `frontend`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

5. Deploy the site

### 4. Update CORS Settings

After deploying the frontend, update the backend's `CORS_ORIGINS` environment variable to include your frontend URL.

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password (will be hashed) | `secure-password` |
| `CORS_ORIGINS` | Allowed frontend origins | `["http://localhost:5173"]` |
| `ENVIRONMENT` | Environment (dev/prod) | `dev` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## Default Admin Credentials

After first deployment, the admin user is automatically created with:
- **Username**: Set in `ADMIN_USERNAME` env var (default: `admin`)
- **Password**: Set in `ADMIN_PASSWORD` env var (default: `admin123`)

**Important**: Change these in production!

## API Endpoints

### Public Endpoints
- `GET /api/home` - Get home content
- `GET /api/story/sections` - Get story sections
- `GET /api/story/images` - Get story images
- `GET /api/info` - Get wedding info sections
- `GET /api/timeline` - Get timeline events
- `GET /api/gallery` - Get gallery images
- `GET /api/gifts` - Get gift items
- `POST /api/rsvp` - Submit RSVP

### Admin Endpoints (Require Authentication)
- `POST /auth/login` - Admin login
- `PUT /api/home` - Update home content
- CRUD operations for all content types
- `POST /api/upload` - Upload images
- `GET /api/rsvp` - Get all RSVPs

## Database Migrations

To create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Troubleshooting

### Backend Issues

1. **Database connection errors**: Check `DATABASE_URL` in environment variables
2. **Import errors**: Ensure you're in the backend directory and virtual environment is activated
3. **Port already in use**: Change the port in the uvicorn command

### Frontend Issues

1. **API connection errors**: Check `VITE_API_URL` matches your backend URL
2. **Build errors**: Ensure all dependencies are installed with `npm install`
3. **CORS errors**: Add your frontend URL to backend `CORS_ORIGINS`

### Deployment Issues

1. **Build fails**: Check build logs in Render dashboard
2. **Database migrations**: Ensure `alembic upgrade head` runs during build
3. **Static files not serving**: Check that `static/uploads/` directory exists and is writable

## License

This project is created for personal use.

## Support

For issues or questions, please check the codebase or create an issue in your repository.

