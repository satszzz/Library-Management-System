import BookCard from './BookCard';

const BookGrid = ({ books, columns = 4 }) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-5`}>
      {books.map((book, index) => (
        <BookCard key={book.id} book={book} index={index} />
      ))}
    </div>
  );
};

export default BookGrid;
