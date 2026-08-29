// Mock notifications for LibraVerse UI

export const notifications = [
  {
    id: '1',
    type: 'warning',
    title: 'Book due tomorrow',
    message: 'Atomic Habits by James Clear is due tomorrow. Please return it to avoid fines.',
    bookTitle: 'Atomic Habits',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Reserved book available',
    message: 'Clean Code by Robert C. Martin is now available for borrowing.',
    bookTitle: 'Clean Code',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Welcome to LibraVerse!',
    message: 'Start your reading journey by exploring our collection of over 1000+ books.',
    bookTitle: null,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '4',
    type: 'success',
    title: 'Book returned successfully',
    message: 'You have successfully returned "The Pragmatic Programmer".',
    bookTitle: 'The Pragmatic Programmer',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '5',
    type: 'warning',
    title: 'Fine pending',
    message: 'You have a pending fine of ₹25 for late return of "Design Patterns".',
    bookTitle: 'Design Patterns',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '6',
    type: 'info',
    title: 'New books added',
    message: '15 new books have been added to the library this week. Check them out!',
    bookTitle: null,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export const getUnreadCount = () => notifications.filter((n) => !n.read).length;
