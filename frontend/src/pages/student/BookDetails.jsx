import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService, issueService, reservationService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/EmptyState';
import { BookOpen, ArrowLeft, Calendar, Building2, Hash, BookCopy, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => { fetchBook(); }, [id]);

  const fetchBook = async () => {
    try {
      const { data } = await bookService.getBook(id);
      setBook(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async () => {
    try {
      await issueService.issueBook({ bookId: book._id });
      toast.success(`"${book.title}" issued successfully!`);
      fetchBook();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue');
    }
  };

  const handleReserve = async () => {
    try {
      await reservationService.reserveBook({ bookId: book._id });
      toast.success(`"${book.title}" reserved!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reserve');
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={fetchBook} />;
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card overflow-hidden">
        <div className="md:flex">
          {/* Cover */}
          <div className="md:w-1/3 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 p-8 flex items-center justify-center min-h-[300px]">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="max-h-80 rounded-xl shadow-xl" />
            ) : (
              <BookOpen size={80} className="text-primary-300" />
            )}
          </div>

          {/* Details */}
          <div className="md:w-2/3 p-6 md:p-8 space-y-5">
            <div>
              <span className="badge-info mb-2">{book.category?.name}</span>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900 dark:text-white mt-2">{book.title}</h1>
              <p className="text-lg text-surface-500 dark:text-surface-400 mt-1">by {book.author}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <Hash size={15} /> <span>ISBN: {book.isbn}</span>
              </div>
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <Building2 size={15} /> <span>{book.publisher || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <Calendar size={15} /> <span>{book.publicationYear || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <BookCopy size={15} /> <span>{book.borrowCount} time(s) borrowed</span>
              </div>
            </div>

            {/* Availability */}
            <div className={`p-4 rounded-xl ${isAvailable ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${isAvailable ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                    {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                  </p>
                  <p className="text-sm text-surface-500 mt-0.5">
                    {book.availableCopies} of {book.totalCopies} copies available
                  </p>
                </div>
                <div className="w-16 h-1.5 rounded-full bg-surface-200 dark:bg-surface-600 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isAvailable ? (
                <button onClick={handleIssue} className="btn-primary flex-1">Issue This Book</button>
              ) : (
                <button onClick={handleReserve} className="btn-outline flex-1">Reserve This Book</button>
              )}
              <button onClick={() => setShowQR(true)} className="btn-secondary">
                <QrCode size={18} />
              </button>
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Description</h3>
                <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <Modal isOpen={showQR} onClose={() => setShowQR(false)} title="Book QR Code" size="sm">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-white rounded-xl">
            <QRCodeSVG value={`${window.location.origin}/books/${book._id}`} size={200} />
          </div>
          <p className="text-sm text-surface-500">Scan to view book details</p>
          <p className="font-medium text-surface-900 dark:text-white">{book.title}</p>
        </div>
      </Modal>
    </div>
  );
};

export default BookDetails;
