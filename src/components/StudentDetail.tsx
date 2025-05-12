
import { motion } from 'framer-motion';
import { Student } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Mail, Phone, MapPin, BookOpen, User, X } from 'lucide-react';

interface StudentDetailProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetail = ({ student, isOpen, onClose }: StudentDetailProps) => {
  if (!student) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader>
          <DialogTitle className="text-xl">Student Details</DialogTitle>
          <DialogDescription>Complete information about the student</DialogDescription>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <Badge variant="outline" className="mt-2">{student.course}</Badge>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Grade</span>
                  <span className="font-semibold">{student.grade}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Attendance</span>
                  <span className="font-semibold">{student.attendance}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Enrollment Date</span>
                  <span className="font-semibold">{new Date(student.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                )}
                {student.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{student.address}</span>
                  </div>
                )}
              </div>
              
              {student.bio && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-medium text-muted-foreground">About</h4>
                  <p className="text-sm">{student.bio}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetail;
