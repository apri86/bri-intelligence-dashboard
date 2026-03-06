import { FC } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * ErrorPage Component
 * Custom error page for handling route errors and application errors
 * 
 * Features:
 * - Displays user-friendly error messages
 * - Shows different UI based on error type
 * - Provides actions: Go Home, Go Back, Reload
 * - Styled consistently with app design
 * - Handles both route errors and generic errors
 */
const ErrorPage: FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Determine error details
  let errorTitle = 'Oops! Something went wrong';
  let errorMessage = 'An unexpected error occurred. Please try again.';
  let errorDetails = '';

  if (isRouteErrorResponse(error)) {
    // Route error (404, etc.)
    errorTitle = `Error ${error.status}`;
    errorMessage = error.statusText || 'Page not found';
    if (error.status === 404) {
      errorMessage = 'The page you are looking for does not exist.';
    }
  } else if (error instanceof Error) {
    // JavaScript error
    errorMessage = error.message;
    errorDetails = error.stack || '';
  }

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <AlertTriangle className="w-16 h-16" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-center mb-2">{errorTitle}</h1>
            <p className="text-center text-red-100 text-lg">{errorMessage}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error Details (for development) */}
            {errorDetails && process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Error Details:</h3>
                <pre className="text-xs text-slate-600 overflow-x-auto whitespace-pre-wrap">
                  {errorDetails}
                </pre>
              </div>
            )}

            {/* Helpful Message */}
            <div className="mb-8 text-center">
              <p className="text-slate-600">
                Don't worry, this happens sometimes. Here are some things you can try:
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoHome}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Home className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-bold">Go Home</div>
                  <div className="text-xs text-indigo-200">Return to dashboard</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoBack}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-bold">Go Back</div>
                  <div className="text-xs text-slate-500">Previous page</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReload}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-bold">Reload</div>
                  <div className="text-xs text-slate-500">Refresh the page</div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              If the problem persists, please contact support or try again later.
            </p>
          </div>
        </div>

        {/* BRI Logo */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <img 
            src="/bri-logo.png" 
            alt="BRI Logo" 
            className="w-8 h-8 object-contain"
          />
          <p className="text-sm text-slate-600 font-medium">
            BRI Intelligence Dashboard
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
