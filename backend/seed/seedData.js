const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Book = require('../models/Book');
const Category = require('../models/Category');
const Issue = require('../models/Issue');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Category.deleteMany({});
    await Issue.deleteMany({});
    await Reservation.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing data.');

    // Create categories
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
    console.log(`Created ${categories.length} categories.`);

    const catMap = {};
    categories.forEach((c) => (catMap[c.name] = c._id));

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      department: 'Administration',
      isActive: true,
    });
    console.log('Created admin user.');

    // Create students
    const studentData = [
      { name: 'Rahul Sharma', email: 'rahul@student.com', password: 'student123', phone: '9876543201', department: 'Computer Science', year: '3rd Year' },
      { name: 'Priya Patel', email: 'priya@student.com', password: 'student123', phone: '9876543202', department: 'Information Technology', year: '2nd Year' },
      { name: 'Amit Kumar', email: 'amit@student.com', password: 'student123', phone: '9876543203', department: 'Electronics', year: '4th Year' },
      { name: 'Sneha Reddy', email: 'sneha@student.com', password: 'student123', phone: '9876543204', department: 'Computer Science', year: '1st Year' },
      { name: 'Vikram Singh', email: 'vikram@student.com', password: 'student123', phone: '9876543205', department: 'Mechanical', year: '3rd Year' },
      { name: 'Ananya Gupta', email: 'ananya@student.com', password: 'student123', phone: '9876543206', department: 'Computer Science', year: '2nd Year' },
      { name: 'Rohan Das', email: 'rohan@student.com', password: 'student123', phone: '9876543207', department: 'Civil', year: '4th Year' },
      { name: 'Kavita Nair', email: 'kavita@student.com', password: 'student123', phone: '9876543208', department: 'Information Technology', year: '3rd Year' },
      { name: 'Arjun Mehta', email: 'arjun@student.com', password: 'student123', phone: '9876543209', department: 'Computer Science', year: '1st Year' },
      { name: 'Divya Joshi', email: 'divya@student.com', password: 'student123', phone: '9876543210', department: 'Electronics', year: '2nd Year' },
    ];

    const students = [];
    for (const s of studentData) {
      const student = await User.create({ ...s, role: 'student', isActive: true });
      students.push(student);
    }
    console.log(`Created ${students.length} students.`);

    // Create books
    const booksData = [
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: catMap['Programming'], publisher: 'Prentice Hall', publicationYear: 2008, description: 'A Handbook of Agile Software Craftsmanship. Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg', totalCopies: 5, availableCopies: 5, borrowCount: 12 },
      { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: catMap['Self Help'], publisher: 'Avery', publicationYear: 2018, description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. No matter your goals, Atomic Habits offers a proven framework for improving every day.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51-uspgqWIL._SX329_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 18 },
      { title: 'Python Crash Course', author: 'Eric Matthes', isbn: '978-1593279288', category: catMap['Programming'], publisher: 'No Starch Press', publicationYear: 2019, description: 'A Hands-On, Project-Based Introduction to Programming. This is the second edition of the best selling Python book in the world.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51cUVaBWZzL._SX376_BO1,204,203,200_.jpg', totalCopies: 6, availableCopies: 6, borrowCount: 15 },
      { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0062315007', category: catMap['Novel'], publisher: 'HarperOne', publicationYear: 1988, description: 'A magical fable about following your dream. Paulo Coelho\'s enchanting novel has inspired a devoted following around the world.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Z0nLAfLmL.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 20 },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: catMap['Programming'], publisher: 'MIT Press', publicationYear: 2009, description: 'The book covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41SNoh5ZhOL._SX440_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 10 },
      { title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', category: catMap['Programming'], publisher: 'Addison-Wesley', publicationYear: 1994, description: 'Elements of Reusable Object-Oriented Software. Capturing a wealth of experience about the design of object-oriented software.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 8 },
      { title: 'Hands-On Machine Learning', author: 'Aurélien Géron', isbn: '978-1492032649', category: catMap['AI/ML'], publisher: "O'Reilly Media", publicationYear: 2019, description: 'Concepts, Tools, and Techniques to Build Intelligent Systems with Scikit-Learn, Keras, and TensorFlow.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51aqYc1QyrL._SX379_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 14 },
      { title: 'Deep Learning', author: 'Ian Goodfellow', isbn: '978-0262035613', category: catMap['AI/ML'], publisher: 'MIT Press', publicationYear: 2016, description: 'An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/61fim5QqaqL._SX382_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 9 },
      { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', category: catMap['Database'], publisher: 'McGraw-Hill', publicationYear: 2019, description: 'Comprehensive coverage of the concepts and design of database systems.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51YgFYSsZWL._SX218_BO1,204,203,200_.jpg', totalCopies: 5, availableCopies: 5, borrowCount: 7 },
      { title: 'MongoDB: The Definitive Guide', author: 'Shannon Bradshaw', isbn: '978-1491954461', category: catMap['Database'], publisher: "O'Reilly Media", publicationYear: 2019, description: 'Powerful and Scalable Data Storage. Learn how to build and maintain MongoDB-based applications.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51eOFAaxDzL._SX379_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 6 },
      { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '978-0596517748', category: catMap['Web Development'], publisher: "O'Reilly Media", publicationYear: 2008, description: 'Unearthing the Excellence in JavaScript. Most programming languages contain good and bad parts, but JavaScript has more than its share.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/5131OWtQRaL._SX381_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 11 },
      { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', isbn: '978-1593279509', category: catMap['Web Development'], publisher: 'No Starch Press', publicationYear: 2018, description: 'A Modern Introduction to Programming. JavaScript lies at the heart of almost every modern web application.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51IKycqTPUL._SX218_BO1,204,203,200_.jpg', totalCopies: 5, availableCopies: 5, borrowCount: 13 },
      { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: catMap['Science'], publisher: 'Bantam', publicationYear: 1998, description: 'From the Big Bang to Black Holes. A landmark volume in science writing by one of the great minds of our time.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51+GySc8ExL._SX333_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 16 },
      { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: catMap['History'], publisher: 'Harper', publicationYear: 2015, description: 'A Brief History of Humankind. 100,000 years ago, at least six different species of humans inhabited Earth.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41yu2qXhXXL._SX324_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 17 },
      { title: 'The Pragmatic Programmer', author: 'David Thomas', isbn: '978-0135957059', category: catMap['Programming'], publisher: 'Addison-Wesley', publicationYear: 2019, description: 'Your Journey to Mastery. Illustrates the best approaches and major pitfalls of many different aspects of software development.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51cUVaBWZzL._SX376_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 11 },
      { title: 'Calculus', author: 'James Stewart', isbn: '978-1285740621', category: catMap['Mathematics'], publisher: 'Cengage Learning', publicationYear: 2015, description: 'Early Transcendentals. Success in your calculus course starts here with James Stewart\'s CALCULUS texts.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41VR5RH1+lL._SX258_BO1,204,203,200_.jpg', totalCopies: 6, availableCopies: 6, borrowCount: 5 },
      { title: 'Linear Algebra Done Right', author: 'Sheldon Axler', isbn: '978-3319110790', category: catMap['Mathematics'], publisher: 'Springer', publicationYear: 2014, description: 'This text for a second course in linear algebra is aimed at math majors and graduate students.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41T90BEjiyL._SX348_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 4 },
      { title: 'React Up & Running', author: 'Stoyan Stefanov', isbn: '978-1492051466', category: catMap['Web Development'], publisher: "O'Reilly Media", publicationYear: 2021, description: 'Building Web Applications with React. Learn React from scratch and build modern, fast web applications.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Tg0byqJbL._SX379_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 8 },
      { title: 'Node.js Design Patterns', author: 'Mario Casciaro', isbn: '978-1839214110', category: catMap['Web Development'], publisher: 'Packt', publicationYear: 2020, description: 'Design and implement production-grade Node.js applications using proven patterns and techniques.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41wfXPEGC+L._SX404_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 7 },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '978-0374533557', category: catMap['Self Help'], publisher: 'Farrar, Straus and Giroux', publicationYear: 2011, description: 'A groundbreaking tour of the mind and explains the two systems that drive the way we think.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41shZGS-G+L._SX332_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 14 },
      { title: 'The Art of War', author: 'Sun Tzu', isbn: '978-1599869773', category: catMap['History'], publisher: 'Filiquarian', publicationYear: 2007, description: 'The world\'s most influential treatise on strategy. Required reading for military leaders around the world.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51S4N5LR11L._SX331_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 9 },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0060935467', category: catMap['Novel'], publisher: 'Harper Perennial', publicationYear: 2002, description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51IXntjJP+L._SX331_BO1,204,203,200_.jpg', totalCopies: 4, availableCopies: 4, borrowCount: 19 },
      { title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: catMap['Novel'], publisher: 'Signet Classic', publicationYear: 1961, description: 'Among the most terrifying novels ever written. A startling and haunting vision of the world as it might become.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41aM4xOZxaL._SX277_BO1,204,203,200_.jpg', totalCopies: 3, availableCopies: 3, borrowCount: 15 },
      { title: 'Cosmos', author: 'Carl Sagan', isbn: '978-0345539434', category: catMap['Science'], publisher: 'Ballantine Books', publicationYear: 2013, description: 'Cosmos retraces the fourteen billion years of cosmic evolution that have transformed matter into consciousness.', coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51FO-MBaGbL._SX323_BO1,204,203,200_.jpg', totalCopies: 2, availableCopies: 2, borrowCount: 10 },
    ];

    const books = await Book.insertMany(booksData);
    console.log(`Created ${books.length} books.`);

    // Create sample issues
    const now = new Date();
    const pastDate = (daysAgo) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      return d;
    };
    const futureDate = (daysAhead) => {
      const d = new Date(now);
      d.setDate(d.getDate() + daysAhead);
      return d;
    };

    // Active issues
    const issue1 = await Issue.create({
      user: students[0]._id, book: books[0]._id,
      issueDate: pastDate(5), dueDate: futureDate(9),
      status: 'issued', finePerDay: 5,
    });
    books[0].availableCopies -= 1;
    await books[0].save();

    const issue2 = await Issue.create({
      user: students[0]._id, book: books[1]._id,
      issueDate: pastDate(12), dueDate: futureDate(2),
      status: 'issued', finePerDay: 5,
    });
    books[1].availableCopies -= 1;
    await books[1].save();

    const issue3 = await Issue.create({
      user: students[1]._id, book: books[2]._id,
      issueDate: pastDate(3), dueDate: futureDate(11),
      status: 'issued', finePerDay: 5,
    });
    books[2].availableCopies -= 1;
    await books[2].save();

    // Returned issues
    await Issue.create({
      user: students[2]._id, book: books[3]._id,
      issueDate: pastDate(30), dueDate: pastDate(16), returnDate: pastDate(14),
      status: 'returned', fine: 0, finePerDay: 5,
    });

    // Overdue with fine
    await Issue.create({
      user: students[3]._id, book: books[4]._id,
      issueDate: pastDate(25), dueDate: pastDate(11), returnDate: pastDate(5),
      status: 'returned', fine: 30, finePerDay: 5, finePaid: false,
    });

    // Currently overdue
    const overdueIssue = await Issue.create({
      user: students[1]._id, book: books[6]._id,
      issueDate: pastDate(20), dueDate: pastDate(6),
      status: 'overdue', finePerDay: 5,
    });
    books[6].availableCopies -= 1;
    await books[6].save();

    console.log('Created sample issues.');

    // Create sample notifications
    await Notification.insertMany([
      { user: students[0]._id, title: 'Book Issued', message: '"Clean Code" has been issued to you. Due date: ' + futureDate(9).toLocaleDateString() + '.', type: 'issue' },
      { user: students[0]._id, title: 'Due Date Approaching', message: '"Atomic Habits" is due in 2 days. Please return it on time.', type: 'due_soon' },
      { user: students[1]._id, title: 'Book Overdue', message: '"Hands-On Machine Learning" is overdue. Please return it immediately.', type: 'overdue' },
    ]);
    console.log('Created sample notifications.');

    console.log('\n========================================');
    console.log('   SEED DATA CREATED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nDemo Credentials:');
    console.log('  Admin: admin@library.com / admin123');
    console.log('  Student: rahul@student.com / student123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error.message);
    process.exit(1);
  }
};

seedData();
