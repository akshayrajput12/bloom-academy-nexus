
import { motion } from 'framer-motion';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';

interface CourseFilterProps {
  courses: Course[];
  selectedCourse: string | null;
  onSelectCourse: (courseId: string | null) => void;
}

const CourseFilter = ({ courses, selectedCourse, onSelectCourse }: CourseFilterProps) => {
  return (
    <motion.div 
      className="flex flex-col space-y-4 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold">Courses</h2>
      <div className="flex flex-wrap gap-2">
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant={selectedCourse === null ? "default" : "outline"}
            onClick={() => onSelectCourse(null)}
            className="rounded-full"
          >
            All Courses
          </Button>
        </motion.div>
        
        {courses.map((course) => (
          <motion.div 
            key={course.id} 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              variant={selectedCourse === course.id ? "default" : "outline"}
              onClick={() => onSelectCourse(course.id)}
              className="rounded-full flex items-center gap-2"
              style={{
                backgroundColor: selectedCourse === course.id ? course.color : "transparent",
                color: selectedCourse === course.id ? "white" : "inherit",
                borderColor: course.color
              }}
            >
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></span>
              {course.name}
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{course.students}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CourseFilter;
