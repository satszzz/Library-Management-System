const User = require('../models/User');
const Book = require('../models/Book');
const Category = require('../models/Category');
const Issue = require('../models/Issue');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');

const seedDatabaseIfEmpty = async () => {
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount > 0) return;

    console.log('Database empty. Automatically populating initial seed data...');

    await User.deleteMany({});
    await Book.deleteMany({});
    await Category.deleteMany({});
    await Issue.deleteMany({});
    await Reservation.deleteMany({});
    await Notification.deleteMany({});

    const categories = await Category.insertMany([
      { name: 'Programming', description: 'Software development and coding books' },
      { name: 'AI/ML', description: 'Artificial Intelligence and Machine Learning' },
      { name: 'Database', description: 'Database design and management' },
      { name: 'Web Development', description: 'Frontend and backend web technologies' },
      { name: 'Science', description: 'Physics, chemistry, biology and more' },
      { name: 'History', description: 'World history and civilizations' },
      { name: 'Novel', description: 'Fiction and literature' },
      { name: 'Self Help', description: 'Personal development and motivation' },
      { name: 'Mathematics', description: 'Pure and applied mathematics' },
    ]);

    const catMap = {};
    categories.forEach((c) => (catMap[c.name] = c._id));

    await User.create({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      department: 'Administration',
      isActive: true,
    });

    const studentData = [
      { name: 'Rahul Sharma', email: 'rahul@student.com', password: 'student123', phone: '9876543201', department: 'Computer Science', year: '3rd Year' },
      { name: 'Priya Patel', email: 'priya@student.com', password: 'student123', phone: '9876543202', department: 'Information Technology', year: '2nd Year' },
      { name: 'Amit Kumar', email: 'amit@student.com', password: 'student123', phone: '9876543203', department: 'Electronics', year: '4th Year' },
      { name: 'Sneha Reddy', email: 'sneha@student.com', password: 'student123', phone: '9876543204', department: 'Computer Science', year: '1st Year' },
    ];

    const students = [];
    for (const s of studentData) {
      const student = await User.create({ ...s, role: 'student', isActive: true });
      students.push(student);
    }

    const booksData = [
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: catMap['Programming'], publisher: 'Prentice Hall', publicationYear: 2008, description: 'A Handbook of Agile Software Craftsmanship.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg', totalCopies: 5, availableCopies: 5, borrowCount: 12 },
      { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: catMap['Self Help'], publisher: 'Avery', publicationYear: 2018, description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51-uspgqWIL._SX329_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 18 },
      { title: 'Python Crash Course', author: 'Eric Matthes', isbn: '978-1593279288', category: catMap['Programming'], publisher: 'No Starch Press', publicationYear: 2019, description: 'A Hands-On, Project-Based Introduction to Programming.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51cUVaBWZzL._SX376_BO1,204,203,200_.jpg', totalCopies: 6, availableCopies: 6, borrowCount: 15 },
      { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0062315007', category: catMap['Novel'], publisher: 'HarperOne', publicationYear: 1988, description: 'A magical fable about following your dream.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Z0nLAfLmL.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 20 },
      { title: 'Hands-On Machine Learning', author: 'Aurélien Géron', isbn: '978-1492032649', category: catMap['AI/ML'], publisher: "O'Reilly Media", publicationYear: 2019, description: 'Concepts, Tools, and Techniques to Build Intelligent Systems.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51aqYc1QyrL._SX379_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 14 },
    ];

    const books = await Book.insertMany(booksData);

    const now = new Date();
    const futureDate = (d) => { const x = new Date(now); x.setDate(x.getDate() + d); return x; };
    const pastDate = (d) => { const x = new Date(now); x.setDate(x.getDate() - d); return x; };

    await Issue.create({
      user: students[0]._id, book: books[0]._id,
      issueDate: pastDate(5), dueDate: futureDate(9),
      status: 'issued', finePerDay: 5,
    });
    books[0].availableCopies -= 1;
    await books[0].save();

    await Notification.insertMany([
      { user: students[0]._id, title: 'Book Issued', message: '"Clean Code" has been issued to you.', type: 'issue' },
    ]);

    console.log('Automatic Database Seeding Complete!');
  } catch (err) {
    console.error('Auto-seed error:', err.message);
  }
};

module.exports = { seedDatabaseIfEmpty };
