# Setup Guide

## Prerequisites

### Required Software
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** (for version control)

### Required Services
- **PostgreSQL Database** (recommended: Neon Cloud)
- **Google Gemini API Key**

## Development Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Reevsay/smart-learning-path.git
cd smart-learning-path
```

### 2. Database Setup (Neon Cloud - Recommended)

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Create a database
4. Copy the connection details

### 3. Google Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create an API key
3. Copy the API key for your environment variables

### 4. Backend Configuration

```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
# Database Configuration
DB_HOST=ep-your-neon-host.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=your-password
DB_SSL=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=5000
NODE_ENV=development

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 5. Frontend Configuration

```bash
cd ../client
npm install
```

### 6. Start Development Servers

#### Terminal 1 - Backend
```bash
cd server
npm start
```

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

### 7. Verify Installation

1. Backend: http://localhost:5000 (should show server status)
2. Frontend: http://localhost:5173 (should show the application)

## Production Setup

### Backend Deployment (Railway/Heroku)

1. **Create account** on Railway or Heroku
2. **Connect repository** to your deployment platform
3. **Set environment variables** in the platform dashboard
4. **Deploy** the server directory

#### Environment Variables for Production:
```env
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=your-production-db-name
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_SSL=true
JWT_SECRET=your-production-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
```

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy the `dist` folder** to Vercel or Netlify

3. **Configure environment variables** if needed

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: ENOTFOUND your-host
```
**Solution**: Check your database credentials and network connection.

#### 2. JWT Secret Error
```
Error: JWT secret not provided
```
**Solution**: Ensure JWT_SECRET is set in your .env file and is at least 32 characters long.

#### 3. Gemini API Error
```
Error: API key not valid
```
**Solution**: Verify your GEMINI_API_KEY is correct and has proper permissions.

#### 4. CORS Error
```
Access to fetch blocked by CORS policy
```
**Solution**: Ensure the frontend URL is included in the backend CORS configuration.

#### 5. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Kill the process using the port or use a different port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Development Tips

1. **Use environment-specific configurations**:
   - `.env.development` for development
   - `.env.production` for production

2. **Database migrations**:
   ```bash
   cd server
   npm run db:migrate
   ```

3. **Seed database with sample data**:
   ```bash
   cd server
   npm run db:seed
   ```

4. **Check logs**:
   ```bash
   # Backend logs
   cd server
   npm run logs

   # Frontend logs
   # Check browser console
   ```

5. **Reset database** (if needed):
   ```bash
   cd server
   npm run db:reset
   ```

## IDE Setup (VS Code Recommended)

### Recommended Extensions:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **Thunder Client** (for API testing)

### VS Code Settings:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## Testing Setup

### Backend Testing
```bash
cd server
npm install --save-dev jest supertest
npm test
```

### Frontend Testing
```bash
cd client
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm test
```

## Performance Optimization

### Backend
- Enable gzip compression
- Use connection pooling for database
- Implement caching (Redis)
- Add request rate limiting

### Frontend
- Optimize bundle size with code splitting
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets

## Security Considerations

1. **Environment Variables**: Never commit .env files
2. **JWT Secrets**: Use strong, unique secrets
3. **Database**: Use SSL connections
4. **API**: Implement rate limiting
5. **CORS**: Configure properly for production
6. **Dependencies**: Keep packages updated

## Monitoring & Logging

### Development
- Use console.log for debugging
- Browser DevTools for frontend
- Postman/Thunder Client for API testing

### Production
- Implement proper logging (Winston)
- Use monitoring services (Sentry)
- Set up health checks
- Monitor database performance
