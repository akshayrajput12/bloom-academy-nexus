
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-gradient-to-br from-purple-light to-purple-dark flex items-center justify-center">
                <span className="text-white font-bold">SM</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Student Manager</h1>
                <p className="text-sm text-gray-500">Manage your students effectively</p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">© {new Date().getFullYear()} Student Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
