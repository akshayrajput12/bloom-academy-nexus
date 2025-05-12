
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, User, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onAddStudent: () => void;
  isAuthenticated: boolean;
  onLogin: () => void;
}

const DashboardHeader = ({ 
  onSearch, 
  onAddStudent, 
  isAuthenticated,
  onLogin
}: DashboardHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <motion.div 
      className="w-full p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-lg shadow-sm mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <Button 
          onClick={onAddStudent}
          disabled={!isAuthenticated} 
          className="w-full md:w-auto"
          variant="outline"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Student
        </Button>
        
        {!isAuthenticated ? (
          <Button onClick={onLogin} className="w-full md:w-auto">
            <User className="mr-1 h-4 w-4" />
            Login
          </Button>
        ) : (
          <Button variant="secondary" className="w-full md:w-auto">
            <User className="mr-1 h-4 w-4" />
            Profile
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
