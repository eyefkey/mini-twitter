# Mini Twitter - Social Media Platform

A simplified Twitter-like social media application built with Laravel 12 and React.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **PHP**: >= 8.3
- **Composer**: >= 2.7
- **Node.js**: >= 22.x (managed via nvm)
- **npm**: >= 10.x
- **SQLite**: >= 3.x (or MySQL >= 8.0)

### Optional Tools
- **nvm** (Node Version Manager) - Recommended for managing Node.js versions
  - **Windows**: [nvm-windows](https://github.com/coreybutler/nvm-windows)
  - **Mac/Linux**: [nvm](https://github.com/nvm-sh/nvm)

---

## 🔧 Node.js Version Management

This project uses **Node.js v22** (specified in `.nvmrc`).

### Setup nvm (Node Version Manager)

#### Windows Users

1. **Download and Install nvm-windows**
   ```bash
   # Download from: https://github.com/coreybutler/nvm-windows/releases
   # Install the nvm-setup.exe
   ```

2. **Verify Installation**
   ```bash
   nvm version
   ```

3. **Install Node.js v22**
   ```bash
   # Install Node.js 22 (LTS)
   nvm install 22
   
   # Use Node.js 22
   nvm use 22
   
   # Verify installation
   node -v  # Should show v22.x.x
   npm -v   # Should show 10.x.x or higher
   ```

#### Mac/Linux Users

1. **Install nvm**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Reload shell configuration
   source ~/.bashrc  # or ~/.zshrc for zsh users
   ```

2. **Install Node.js v22**
   ```bash
   # Install Node.js 22 (LTS)
   nvm install 22
   
   # Use Node.js 22
   nvm use 22
   
   # Set as default
   nvm alias default 22
   
   # Verify installation
   node -v  # Should show v22.x.x
   npm -v   # Should show 10.x.x or higher
   ```

### Using .nvmrc File

This project includes a `.nvmrc` file that specifies Node.js v22.

```bash
# Automatically use the correct Node.js version
nvm use

# Or install the version specified in .nvmrc
nvm install
```

---

## 🚀 Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mini-twitter
```

### 2. Use Correct Node.js Version
```bash
# Use Node.js version from .nvmrc
nvm use
```

### 3. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 4. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Configure Database

#### Option A: SQLite (Recommended for Development)

Edit `.env` file:
```env
DB_CONNECTION=sqlite
# DB_DATABASE will use database/database.sqlite by default
```

Create the SQLite database file:
```bash
# Windows (PowerShell)
New-Item -Path database/database.sqlite -ItemType File

# Mac/Linux
touch database/database.sqlite
```

#### Option B: MySQL (Production)

Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mini_twitter
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Create the MySQL database:
```bash
mysql -u root -p
CREATE DATABASE mini_twitter;
EXIT;
```

### 6. Run Migrations
```bash
php artisan migrate
```

---

## 🎮 Running the Application

### Development Mode

Laravel 12 includes a built-in dev server that runs both backend and frontend simultaneously:

```bash
# Ensure correct Node.js version first
nvm use

# Start both Laravel backend and Vite frontend
composer run dev

# This will start:
# - Laravel development server at: http://localhost:8000
# - Vite dev server at: http://localhost:5173
# - Hot Module Replacement (HMR) enabled
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

The application will automatically reload when you make changes to your code.

---

## 🧪 Testing

### Backend Tests (Pest PHP)

```bash
# Run all backend tests
php artisan test

# Run specific test file
php artisan test --filter=AuthTest
php artisan test --filter=PostTest
php artisan test --filter=ReactionTest

# Run with coverage
php artisan test --coverage
```

**Backend Test Coverage:**
- ✅ `tests/Feature/SystemFunc/AuthTest.php` (5 tests)
- ✅ `tests/Feature/SystemFunc/PostTest.php` (4 tests)
- ✅ `tests/Feature/SystemFunc/ReactionTest.php` (4 tests)

### Frontend Tests (Vitest)

```bash
# Run all frontend tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

**Frontend Test Coverage:**
- ✅ `resources/js/pages/__tests__/welcome.test.tsx` (5 tests)
- ✅ `resources/js/pages/__tests__/create-account.test.tsx` (4 tests)
- ✅ `resources/js/pages/__tests__/feed.test.tsx` (5 tests)

---

## 🛠️ Tech Stack

### Backend
- **Laravel 12**: PHP framework
- **SQLite/MySQL**: Database
- **Sanctum**: API authentication
- **Pest PHP**: Testing framework

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Inertia.js**: SPA framework
- **Vite**: Build tool
- **Vitest**: Testing framework
- **Tailwind CSS**: Styling

---

## 🎯 Features

- ✅ **User Registration & Login** with token authentication
- ✅ **Create Posts** (max 280 characters)
- ✅ **View Feed** of all posts
- ✅ **Like/Unlike Posts** with reaction system
- ✅ **Real-time Character Counter**
- ✅ **Responsive Design**
- ✅ **Comprehensive Testing** (27 tests passing)

---

## 📁 Project Structure

```
mini-twitter/
├── .nvmrc                           # Node.js v20
├── app/
│   ├── Http/Controllers/            # API Controllers
│   └── Models/                      # Eloquent Models
├── resources/
│   └── js/
│       └── pages/
│           ├── welcome.tsx          # Login page
│           ├── create-account.tsx   # Registration
│           ├── feed.tsx             # Main feed
│           └── __tests__/           # Frontend tests
├── tests/
│   └── Feature/
│       └── SystemFunc/              # Backend tests
├── database/
│   └── migrations/                  # Database schema
├── routes/
│   ├── web.php
│   └── api.php
├── package.json
└── composer.json
```

---

## 🐛 Troubleshooting

### Node.js Version Issues

```bash
# Check current version
node -v

# Should be v22.x.x
# If not, use .nvmrc:
nvm use

# Or install:
nvm install 22
```

### Database Connection Error

```bash
php artisan config:clear
php artisan cache:clear
php artisan migrate:status
```

### Frontend Build Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

### Port Already in Use

```bash
# Stop the dev server
# Press Ctrl+C in the terminal running "composer run dev"

# Or kill specific ports (Windows)
netstat -ano | findstr :8000
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or kill specific ports (Mac/Linux)
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Development Server Issues

```bash
# If composer run dev fails, try:
composer dump-autoload
npm install
composer run dev
```

---

## 📚 API Endpoints

```http
POST /api/register          # Create account
POST /api/login             # Login
POST /api/logout            # Logout
GET  /api/posts             # Get all posts
POST /api/posts             # Create post
POST /api/posts/{postId}/reaction  # Toggle like
```

---

## 📝 Quick Commands

```bash
# Check Node.js version
node -v                    # Should show v22.x.x
nvm use                    # Use version from .nvmrc

# Start development (Laravel 12 way)
composer run dev           # Starts both Laravel + Vite servers

# Run tests
php artisan test          # Backend (13 tests)
npm test                  # Frontend (14 tests)

# Build production
npm run build

# Clear caches
php artisan optimize:clear
```

---

## 🤝 Contributing

1. Fork the repository
2. Use correct Node.js version (`nvm use`)
3. Create feature branch
4. Write tests
5. Ensure all tests pass
6. Submit pull request

---

## 📄 License

MIT License

---

**Built with Laravel 12, React 18, and Node.js v22** 🚀