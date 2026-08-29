import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-surface-200 dark:border-[#263248] py-10 bg-white dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-surface-800 dark:text-surface-200">
              LibraVerse
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-surface-500 dark:text-surface-400">
            <Link to="/explore" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Explore
            </Link>
            <Link to="/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Dashboard
            </Link>
            <span className="text-surface-300 dark:text-surface-600">|</span>
            <span>Built with MERN Stack</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-surface-400 dark:text-surface-500">
            © {new Date().getFullYear()} LibraVerse
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
