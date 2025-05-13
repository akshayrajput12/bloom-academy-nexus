
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, User, Plus, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onAddStudent: () => void;
  onLogin: () => void;
}

const DashboardHeader = ({ 
  onSearch, 
  onAddStudent,
  onLogin
}: DashboardHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, profile, signOut, isLoading } = useAuth();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || 'User';
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
          disabled={isLoading || !user} 
          className="w-full md:w-auto"
          variant="outline"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Student
        </Button>
        
        {isLoading ? (
          <Button disabled className="w-full md:w-auto">
            Loading...
          </Button>
        ) : !user ? (
          <Button onClick={onLogin} className="w-full md:w-auto">
            <User className="mr-1 h-4 w-4" />
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="w-full md:w-auto">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={profile?.avatar || undefined} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{getFullName()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{getFullName()}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
