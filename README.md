# Warehouse Profit Analytics

A modern web application for tracking warehouse profits and expenses with real-time analytics.

## 🚀 Features

- **Real-time Analytics**: Track revenue, expenses, and profit margins across multiple warehouses
- **Transaction Management**: Easy input of income and expense transactions
- **Reference Data Management**: Self-service warehouse and cost type management
- **PWA Support**: Install as a native app on mobile devices
- **Google Sheets Integration**: Uses Google Sheets as the backend database
- **Role-based Access**: Admin, Clerk, and Viewer roles with different permissions

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **PWA**: Vite PWA Plugin
- **Backend**: Google Apps Script + Google Sheets
- **Authentication**: Google OAuth 2.0

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [Google Workspace Account](https://workspace.google.com/) (for Google Sheets API)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Application header
│   ├── Layout.tsx      # Main layout wrapper
│   ├── ProtectedRoute.tsx # Authentication guard
│   └── Sidebar.tsx     # Navigation sidebar
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── ReferenceDataPage.tsx
│   └── TransactionPage.tsx
├── services/           # API services (to be implemented)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_SHEETS_API_URL=your_apps_script_web_app_url
```

### Google Apps Script Setup

1. Create a new Google Apps Script project
2. Set up Google Sheets with the required structure
3. Deploy as a web app
4. Configure CORS and authentication

## 📊 Data Model

### Google Sheets Structure

- **Transactions**: `id | date | warehouse_id | cost_type_id | is_income | amount | currency | amount_tjs`
- **Warehouses**: `id | name | emoji | color`
- **CostTypes**: `id | name | is_direct`

## 🔐 Authentication

The application uses Google OAuth 2.0 with PKCE for secure authentication. Users are assigned roles based on their email domain.

## 📱 PWA Features

- Offline support with service worker
- Install prompt for mobile devices
- Background sync for offline transactions
- Push notifications for important updates

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Code Quality

- TypeScript strict mode enabled
- ESLint with React and TypeScript rules
- Prettier for consistent formatting
- Pre-commit hooks for code quality

## 🚀 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set build source to GitHub Actions
4. Configure custom domain (optional)

### Google Cloud Run

1. Build the application: `npm run build`
2. Deploy to Cloud Run using Google Cloud CLI
3. Configure environment variables
4. Set up custom domain and SSL

## 📈 Performance Targets

- **Dashboard Load**: < 1s on 4G connection
- **Transaction Recording**: < 2s round-trip
- **API Response**: < 200ms for cached data
- **Lighthouse Score**: ≥ 90

## 🔒 Security

- JWT token validation
- Email domain verification
- Protected ranges in Google Sheets
- Input sanitization and validation
- CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the [documentation](docs/)
2. Review [known issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed information

## 🗺 Roadmap

### Phase A ✅ - PWA Skeleton + Authentication
- [x] Project setup with Vite and TypeScript
- [x] Tailwind CSS configuration
- [x] Basic component structure
- [ ] Google OAuth integration
- [ ] Protected routes

### Phase B 🔄 - Metadata Integration
- [ ] Google Apps Script setup
- [ ] API service layer
- [ ] Transaction form with dynamic data

### Phase C ⏳ - Transaction Recording
- [ ] Backend transaction logic
- [ ] Frontend transaction handling
- [ ] Data validation

### Phase D ⏳ - CRUD for Reference Data
- [ ] Warehouse management
- [ ] Cost type management
- [ ] Reference data UI

### Phase E ⏳ - Reporting Backend
- [ ] Report calculation engine
- [ ] Caching system
- [ ] API endpoints

### Phase F ⏳ - Dashboard Implementation
- [ ] Chart components
- [ ] Dashboard layout
- [ ] Data integration

### Phase G ⏳ - Mobile Optimization & QA
- [ ] Mobile responsiveness
- [ ] PWA features
- [ ] Performance optimization
- [ ] Quality assurance

### Phase H ⏳ - Production Deployment & Training
- [ ] Production deployment
- [ ] Documentation
- [ ] User training
- [ ] Go-live checklist 