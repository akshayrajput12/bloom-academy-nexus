
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
      <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-64 sm:h-72">
            <Skeleton className="w-full h-5 mb-4" />
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
        className="text-center py-10 px-4"
      >
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">No students found</h3>
          <p className="text-gray-500 mt-2">Try changing your search terms or filters</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
