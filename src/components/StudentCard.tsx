
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Student } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
} from '@/components/ui/card';

interface StudentCardProps {
  student: Student;
  index: number;
  onClick: (student: Student) => void;
}

const StudentCard = ({ student, index, onClick }: StudentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate initials from student name
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  
  // Get color based on the first letter of student name
  const getColor = () => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-yellow-400 to-yellow-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-cyan-400 to-cyan-600'
    ];
    
    const index = student.name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  const getGradeColor = (grade: string) => {
    const firstChar = grade.charAt(0);
    switch(firstChar) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card 
        className="overflow-hidden h-full card-shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick(student)}
      >
        <CardHeader className="p-0">
          <div className="relative h-32 sm:h-36 w-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getColor()} flex items-center justify-center text-white text-2xl font-bold`}>
              {getInitials(student.name)}
            </div>
            
            <motion.div 
              className="absolute bottom-3 right-3"
              animate={{ scale: isHovered ? 1.05 : 1 }}
            >
              <Badge className={`${getGradeColor(student.grade)} font-semibold text-xs`}>
                Grade: {student.grade}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-2">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{student.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">{student.email}</p>
          
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-accent text-accent-foreground text-xs font-normal">
              {student.course}
            </Badge>
            <span className="text-xs text-gray-500">
              {student.attendance}% attendance
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-1 pb-3 px-4">
          <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r ${
                student.attendance >= 90 ? 'from-green-400 to-green-500' :
                student.attendance >= 75 ? 'from-blue-400 to-blue-500' :
                student.attendance >= 60 ? 'from-yellow-400 to-yellow-500' : 
                'from-red-400 to-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${student.attendance}%` }}
              transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default StudentCard;
