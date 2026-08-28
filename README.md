# 📚 LibraVerse — Library Management System

A full-stack **Library Management System** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Features a Cyberpunk / Modern Dark & Glassmorphic UI, JWT authentication, role-based authorization, book catalog with search/filter, issue/return system with automatic fine calculation, reservation queue, notifications, dark mode, and comprehensive admin dashboard with analytics.

---

## 🎨 Interactive UI Preview

| Landing Page & Hero Showcase | Analytics & Dashboard Showcase |
|---|---|
| ![Hero Banner](frontend/src/assets/hero-banner.jpg) | ![Analytics Art](frontend/src/assets/analytics-art.jpg) |

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
- Cyberpunk & Glassmorphic theme with neon accents
- Dark/Light mode with persistence
- High-resolution 3D digital library hero banner & dashboard artwork
- Responsive design (Desktop, Tablet, Mobile)
- Smooth animations and micro-interactions
- Loading skeletons and empty states
- Toast notifications

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
│   │   ├── assets/ (hero-banner.jpg, analytics-art.jpg)
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
git clone https://github.com/satszzz/Library-Management-System.git
cd Library-Management-System
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

## 👤 Demo Credentials

| Role    | Email              | Password   |
|---------|--------------------|------------|
| Admin   | admin@library.com  | admin123   |
| Student | rahul@student.com  | student123 |

---

## 📄 License

MIT License — Built with ❤️ using the MERN Stack.
