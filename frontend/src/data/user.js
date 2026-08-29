// Mock user data for LibraVerse UI

export const mockUser = {
  id: 'u1',
  name: 'Priya Sharma',
  email: 'priya.sharma@university.edu',
  role: 'student',
  phone: '+91 98765 43210',
  department: 'Computer Science',
  year: '3rd Year',
  memberSince: '2024-08-15',
  profileImage: null,
  isActive: true,
};

export const readingStats = {
  booksBorrowed: 12,
  currentlyReading: 2,
  wishlistCount: 5,
  readingStreak: 7,
  totalPagesRead: 3240,
  booksReturnedOnTime: 10,
  averageRating: 4.5,
};

export const borrowedBooks = [
  {
    id: 'b1',
    bookId: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Development',
    borrowDate: '2026-08-15',
    dueDate: '2026-08-29',
    status: 'borrowed',
    progress: 65,
    coverGradient: ['#667eea', '#764ba2'],
  },
  {
    id: 'b2',
    bookId: '3',
    title: 'Deep Learning',
    author: 'Ian Goodfellow',
    category: 'Artificial Intelligence',
    borrowDate: '2026-08-20',
    dueDate: '2026-09-03',
    status: 'borrowed',
    progress: 30,
    coverGradient: ['#4facfe', '#00f2fe'],
  },
];

export const returnedBooks = [
  {
    id: 'r1',
    bookId: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programming',
    borrowDate: '2026-07-20',
    dueDate: '2026-08-03',
    returnDate: '2026-08-01',
    status: 'returned',
    coverGradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 'r2',
    bookId: '8',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'History',
    borrowDate: '2026-07-01',
    dueDate: '2026-07-15',
    returnDate: '2026-07-14',
    status: 'returned',
    coverGradient: ['#89f7fe', '#66a6ff'],
  },
  {
    id: 'r3',
    bookId: '5',
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    category: 'Web Development',
    borrowDate: '2026-06-10',
    dueDate: '2026-06-24',
    returnDate: '2026-06-23',
    status: 'returned',
    coverGradient: ['#fa709a', '#fee140'],
  },
];

export const wishlistBooks = [
  {
    id: 'w1',
    bookId: '4',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    category: 'Programming',
    addedDate: '2026-08-25',
    coverGradient: ['#43e97b', '#38f9d7'],
  },
  {
    id: 'w2',
    bookId: '7',
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Fiction',
    addedDate: '2026-08-20',
    coverGradient: ['#ffecd2', '#fcb69f'],
  },
  {
    id: 'w3',
    bookId: '11',
    title: 'Hands-On Machine Learning',
    author: 'Aurélien Géron',
    category: 'Artificial Intelligence',
    addedDate: '2026-08-18',
    coverGradient: ['#96fbc4', '#f9f586'],
  },
  {
    id: 'w4',
    bookId: '6',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    addedDate: '2026-08-10',
    coverGradient: ['#a18cd1', '#fbc2eb'],
  },
  {
    id: 'w5',
    bookId: '12',
    title: 'The Innovators',
    author: 'Walter Isaacson',
    category: 'Technology',
    addedDate: '2026-08-05',
    coverGradient: ['#cd9cf2', '#f6f3ff'],
  },
];

export const readingActivity = [
  { name: 'Mon', pages: 45 },
  { name: 'Tue', pages: 32 },
  { name: 'Wed', pages: 67 },
  { name: 'Thu', pages: 28 },
  { name: 'Fri', pages: 54 },
  { name: 'Sat', pages: 89 },
  { name: 'Sun', pages: 72 },
];

export const monthlyActivity = [
  { name: 'Jan', books: 1 },
  { name: 'Feb', books: 2 },
  { name: 'Mar', books: 1 },
  { name: 'Apr', books: 3 },
  { name: 'May', books: 2 },
  { name: 'Jun', books: 1 },
  { name: 'Jul', books: 2 },
  { name: 'Aug', books: 2 },
];
