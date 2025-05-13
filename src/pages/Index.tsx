
import { useState, useEffect } from 'react';
import { Student, Course } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import CourseFilter from '@/components/CourseFilter';
import StudentsList from '@/components/StudentsList';
import StudentDetail from '@/components/StudentDetail';
import StudentForm from '@/components/StudentForm';
import AuthModal from '@/components/AuthModal';
import DashboardStats from '@/components/DashboardStats';
import SEOHelmet from '@/components/SEOHelmet';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { toast: hookToast } = useToast();
  const { user } = useAuth();

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses from Supabase
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
        
      if (coursesError) {
        throw coursesError;
      }
      
      // Transform courses data to match Course type
      const transformedCourses: Course[] = coursesData.map(course => ({
        id: course.id,
        name: course.name,
        students: 0, // We'll update this count below
        color: course.color,
      }));
      
      // Fetch students from Supabase
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');
        
      if (studentsError) {
        throw studentsError;
      }
      
      // Transform students data to match Student type
      const transformedStudents: Student[] = studentsData.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        course: student.course,
        enrollmentDate: student.enrollment_date,
        avatar: student.avatar || "https://github.com/shadcn.png",
        grade: student.grade,
        attendance: student.attendance,
        bio: student.bio,
        phone: student.phone,
        address: student.address,
      }));
      
      // Count students per course
      const studentCounts: Record<string, number> = {};
      transformedStudents.forEach(student => {
        studentCounts[student.course] = (studentCounts[student.course] || 0) + 1;
      });
      
      // Update course student counts
      transformedCourses.forEach(course => {
        course.students = studentCounts[course.name] || 0;
      });
      
      setCourses(transformedCourses);
      setStudents(transformedStudents);
      setFilteredStudents(transformedStudents);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
    
    // Set up real-time subscription for students
    const channel = supabase
      .channel('students-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'students' 
      }, (payload) => {
        console.log('Realtime update received:', payload);
        
        if (payload.eventType === 'INSERT') {
          const newStudent = payload.new as any;
          
          const transformedStudent: Student = {
            id: newStudent.id,
            name: newStudent.name,
            email: newStudent.email,
            course: newStudent.course,
            enrollmentDate: newStudent.enrollment_date,
            avatar: newStudent.avatar || "https://github.com/shadcn.png",
            grade: newStudent.grade,
            attendance: newStudent.attendance,
            bio: newStudent.bio,
            phone: newStudent.phone,
            address: newStudent.address,
          };
          
          setStudents(prev => [...prev, transformedStudent]);
          toast.success(`New student added: ${newStudent.name}`);
          
          // Update course student counts
          setCourses(prevCourses => {
            return prevCourses.map(course => {
              if (course.name === newStudent.course) {
                return { ...course, students: course.students + 1 };
              }
              return course;
            });
          });
        } else if (payload.eventType === 'UPDATE') {
          // Handle update event
          const updatedStudent = payload.new as any;
          setStudents(prev => prev.map(student => 
            student.id === updatedStudent.id 
              ? {
                  ...student,
                  name: updatedStudent.name,
                  email: updatedStudent.email,
                  course: updatedStudent.course,
                  enrollmentDate: updatedStudent.enrollment_date,
                  avatar: updatedStudent.avatar || "https://github.com/shadcn.png",
                  grade: updatedStudent.grade,
                  attendance: updatedStudent.attendance,
                  bio: updatedStudent.bio,
                  phone: updatedStudent.phone,
                  address: updatedStudent.address
                }
              : student
          ));
          toast.success(`Student updated: ${updatedStudent.name}`);
        } else if (payload.eventType === 'DELETE') {
          // Handle delete event
          const deletedStudent = payload.old as any;
          setStudents(prev => prev.filter(student => student.id !== deletedStudent.id));
          toast.success(`Student removed: ${deletedStudent.name}`);
          
          // Update course student counts
          setCourses(prevCourses => {
            return prevCourses.map(course => {
              if (course.name === deletedStudent.course) {
                return { ...course, students: Math.max(0, course.students - 1) };
              }
              return course;
            });
          });
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Apply filters whenever selectedCourse or searchQuery changes
  useEffect(() => {
    let result = students;
    
    // Filter by course
    if (selectedCourse) {
      result = result.filter(
        student => student.course === courses.find(c => c.id === selectedCourse)?.name
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.course.toLowerCase().includes(query)
      );
    }
    
    setFilteredStudents(result);
  }, [students, selectedCourse, searchQuery, courses]);

  const handleSelectCourse = (courseId: string | null) => {
    setSelectedCourse(courseId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectStudent = (student: Student) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedStudent(student);
    setIsStudentDetailOpen(true);
  };

  const handleAddStudent = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsStudentFormOpen(true);
  };

  const handleStudentAdded = (student: Student) => {
    // We'll fetch the data from Supabase
    toast.success("Student added successfully");
  };

  return (
    <DashboardLayout>
      <SEOHelmet />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <DashboardHeader 
          onSearch={handleSearch} 
          onAddStudent={handleAddStudent}
          onLogin={() => setIsAuthModalOpen(true)}
        />
        
        <DashboardStats 
          studentsCount={students.length}
          courses={courses}
        />
        
        <CourseFilter 
          courses={courses} 
          selectedCourse={selectedCourse} 
          onSelectCourse={handleSelectCourse}
        />
        
        <StudentsList 
          students={filteredStudents} 
          loading={loading}
          onSelectStudent={handleSelectStudent}
        />
        
        <StudentDetail 
          student={selectedStudent}
          isOpen={isStudentDetailOpen}
          onClose={() => setIsStudentDetailOpen(false)}
        />
        
        <StudentForm 
          isOpen={isStudentFormOpen}
          onClose={() => setIsStudentFormOpen(false)}
          onSubmit={handleStudentAdded}
        />
        
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Index;
