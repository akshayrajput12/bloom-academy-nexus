
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>Student Manager - Efficiently Manage Your Students</title>
        <meta name="description" content="A comprehensive student management system for educational institutions." />
        <meta name="keywords" content="student management, education, academic tracking, courses" />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="Student Manager" />
        <meta property="og:description" content="A comprehensive student management system for educational institutions." />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-6 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-gradient-to-br from-purple-light to-purple-dark flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-base">SM</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Student Manager</h1>
                  <p className="text-xs sm:text-sm text-gray-500">Manage your students effectively</p>
                </div>
              </div>
            </motion.div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:px-6 lg:px-8">
          {children}
        </main>
        
        <footer className="bg-white border-t mt-8 sm:mt-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:px-6 lg:px-8">
            <p className="text-xs sm:text-sm text-center text-gray-500">© {new Date().getFullYear()} Student Manager. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DashboardLayout;
