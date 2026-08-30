# 📚 LibraVerse — Library Management System

A full-stack **Library Management System** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Features a premium modern UI, JWT authentication, role-based authorization, book catalog with search/filter, issue/return system with automatic fine calculation, reservation queue, notifications, dark mode, and comprehensive admin dashboard with analytics.

---

## ✨ Features

### 👨‍🎓 Student Features
- Register and login with JWT authentication
- Browse and search books with advanced filters
- Issue available books instantly
- Reserve unavailable books (queue system)
- View currently borrowed books with due date tracking
- View borrowing history with fine details
- In-app notification system
- Profile management with password change
- QR code for each book

### 👨‍💼 Admin Features
- Full book CRUD (Add, Edit, Delete, Search)
- User management (View, Activate/Deactivate)
- Issue books to students
- Process returns with automatic fine calculation
- Manage reservations (view queue, cancel)
- Fine management (mark as paid)
- Category management
- Analytics dashboard with Recharts (5 chart types)
- Reports with CSV export
- Activity logs tracking all admin actions

### 🎨 UI/UX
- Premium modern design with Tailwind CSS
- Dark/Light mode with persistence
- Responsive design (Desktop, Tablet, Mobile)
- Smooth animations and micro-interactions
- Loading skeletons and empty states
- Toast notifications
- Glass-morphism cards
- Gradient stat cards

---

## 🛠️ Tech Stack

| Layer      | Technology                                       |
|------------|--------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS 3, React Router 6  |
| Backend    | Node.js, Express.js                              |
| Database   | MongoDB, Mongoose                                |
| Auth       | JWT, bcryptjs                                    |
| Charts     | Recharts                                         |
| Icons      | Lucide React                                     |
| Email      | Nodemailer                                       |
| QR Codes   | qrcode (backend), qrcode.react (frontend)        |
| HTTP       | Axios                                            |
| Toasts     | react-hot-toast                                  |

---

## 📁 Folder Structure

```
├── backend/
│   ├── config/db.js
│   ├── controllers/ (auth, book, issue, reservation, user, category, notification, report)
│   ├── middleware/ (auth, admin, error)
│   ├── models/ (User, Book, Issue, Reservation, Category, Notification, ActivityLog)
│   ├── routes/ (8 route files)
│   ├── utils/ (generateToken, calculateFine, sendEmail)
│   ├── seed/seedData.js
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/common/ (Navbar, Sidebar, Modal, Pagination, etc.)
│   │   ├── components/books/ (BookCard)
│   │   ├── components/dashboard/ (StatCard)
│   │   ├── context/ (AuthContext, ThemeContext)
│   │   ├── layouts/ (Admin, Student, Auth)
│   │   ├── pages/auth/ (Login, Register)
│   │   ├── pages/student/ (Dashboard, Books, MyBooks, etc.)
│   │   ├── pages/admin/ (Dashboard, ManageBooks, Issues, etc.)
│   │   ├── pages/public/ (Home)
│   │   ├── services/ (api.js, services.js)
│   │   └── App.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository
```bash
git clone <repo-url>
cd "Library Management System (IssueReturn, Catalog)"
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env    # Edit .env with your MongoDB URI and JWT secret
npm install
npm run seed            # Seed demo data
npm run dev             # Start backend (port 5000)
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev             # Start frontend (port 5173)
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 🔑 Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CLIENT_URL=http://localhost:5173
FINE_PER_DAY=5
MAX_BORROW_LIMIT=3
LOAN_PERIOD_DAYS=14
RESERVATION_EXPIRY_HOURS=48
```

---

## 👤 Demo Credentials

| Role    | Email              | Password   |
|---------|--------------------|------------|
| Admin   | admin@library.com  | admin123   |
| Student | rahul@student.com  | student123 |

*(More student accounts: priya@student.com, amit@student.com, etc. — all with password `student123`)*

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| POST   | /api/auth/register        | Register user        |
| POST   | /api/auth/login           | Login user           |
| GET    | /api/auth/me              | Get current user     |
| PUT    | /api/auth/profile         | Update profile       |
| PUT    | /api/auth/change-password | Change password      |

### Books
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/books            | Get all books        |
| GET    | /api/books/:id        | Get single book      |
| POST   | /api/books            | Create book (admin)  |
| PUT    | /api/books/:id        | Update book (admin)  |
| DELETE | /api/books/:id        | Delete book (admin)  |
| GET    | /api/books/:id/qrcode | Get QR code          |

### Issues
| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| POST   | /api/issues               | Issue a book           |
| GET    | /api/issues               | Get all issues (admin) |
| GET    | /api/issues/my            | Get my issues          |
| PUT    | /api/issues/:id/return    | Return a book (admin)  |
| PUT    | /api/issues/:id/pay-fine  | Mark fine paid (admin) |

### Reservations, Users, Categories, Notifications, Reports
*See route files for full endpoint documentation.*

---

## 🔮 Future Improvements

- File upload for book covers and profile images
- Email verification on registration
- Password reset flow
- WebSocket real-time notifications
- Book ratings and reviews
- Advanced analytics with date range filters
- PDF report generation
- Barcode scanner integration
- Multi-language support
- PWA support

---


## 📄 License

MIT License — Built with ❤️ using the MERN Stack.
