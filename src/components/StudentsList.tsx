
import { motion } from 'framer-motion';
import { Student } from '@/types';
import StudentCard from './StudentCard';
import { Skeleton } from '@/components/ui/skeleton';

interface StudentsListProps {
  students: Student[];
  loading: boolean;
  onSelectStudent: (student: Student) => void;
}

const StudentsList = ({ students, loading, onSelectStudent }: StudentsListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-72">
            <Skeleton className="w-full h-5 mb-6" />
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-10"
      >
        <h3 className="text-xl font-semibold text-gray-700">No students found</h3>
        <p className="text-gray-500 mt-2">Try changing your search terms or filters</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {students.map((student, index) => (
        <StudentCard 
          key={student.id} 
          student={student} 
          index={index}
          onClick={onSelectStudent}
        />
      ))}
    </div>
  );
};

export default StudentsList;
