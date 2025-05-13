
import { motion } from 'framer-motion';
import { Student } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, BookOpen } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  index: number;
  onClick: (student: Student) => void;
}

const StudentCard = ({ student, index, onClick }: StudentCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };

  const getCourseColor = (course: string) => {
    const colors: Record<string, string> = {
      'Computer Science': 'bg-education-blue',
      'Data Science': 'bg-education-green',
      'Graphic Design': 'bg-education-yellow',
      'Business Administration': 'bg-purple-light',
      'Psychology': '#EC4899',
      'Marketing': 'bg-education-red',
    };
    
    return colors[course] || 'bg-gray-500';
  };

  // Create a dynamic ring class based on the course
  const getRingClass = (course: string) => {
    const colorMap: Record<string, string> = {
      'Computer Science': 'ring-education-blue',
      'Data Science': 'ring-education-green',
      'Graphic Design': 'ring-education-yellow',
      'Business Administration': 'ring-purple-light',
      'Psychology': 'ring-pink-500',
      'Marketing': 'ring-education-red',
    };
    
    return colorMap[course] || 'ring-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(student)}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden h-full card-shadow">
        <div className="h-5" style={{ backgroundColor: getCourseColor(student.course) }} />
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Avatar className={`h-16 w-16 border-2 border-white ring-2 ring-offset-2 ${getRingClass(student.course)}`}>
              <AvatarFallback className="bg-gradient-to-br from-purple-500/90 to-purple-700 text-white text-xl font-semibold">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <Badge variant="outline" className="text-sm font-medium">
              Grade: {student.grade}
            </Badge>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold leading-none mb-1">{student.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{student.email}</p>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{student.course}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                <span>Attendance: {student.attendance}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentCard;
