
import { useState, useEffect } from 'react';
import { Student, Course, AuthState } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import CourseFilter from '@/components/CourseFilter';
import StudentsList from '@/components/StudentsList';
import StudentDetail from '@/components/StudentDetail';
import StudentForm from '@/components/StudentForm';
import AuthModal from '@/components/AuthModal';
import DashboardStats from '@/components/DashboardStats';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

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
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const { toast } = useToast();

  // Check for existing session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuth({
          isAuthenticated: true,
          user: {
            name: session.user.email || 'User',
            email: session.user.email || '',
            avatar: "https://github.com/shadcn.png",
          },
        });
      }
    };
    
    getSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setAuth({
            isAuthenticated: true,
            user: {
              name: session.user.email || 'User',
              email: session.user.email || '',
              avatar: "https://github.com/shadcn.png",
            },
          });
        } else {
          setAuth({
            isAuthenticated: false,
            user: null,
          });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch students and courses
  useEffect(() => {
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
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
    if (!auth.isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedStudent(student);
    setIsStudentDetailOpen(true);
  };

  const handleAddStudent = () => {
    if (!auth.isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsStudentFormOpen(true);
  };

  const handleStudentAdded = async (student: Student) => {
    try {
      // Add student to Supabase
      const { data, error } = await supabase
        .from('students')
        .insert({
          name: student.name,
          email: student.email,
          course: student.course,
          enrollment_date: student.enrollmentDate,
          avatar: student.avatar,
          grade: student.grade,
          attendance: student.attendance,
          bio: student.bio,
          phone: student.phone,
          address: student.address
        })
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        // Transformed added student to match Student type
        const addedStudent: Student = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          course: data[0].course,
          enrollmentDate: data[0].enrollment_date,
          avatar: data[0].avatar || "https://github.com/shadcn.png",
          grade: data[0].grade,
          attendance: data[0].attendance,
          bio: data[0].bio,
          phone: data[0].phone,
          address: data[0].address
        };
        
        setStudents(prev => [addedStudent, ...prev]);
        
        // Update course student count
        setCourses(prev => prev.map(course => 
          course.name === addedStudent.course 
            ? { ...course, students: course.students + 1 }
            : course
        ));
        
        toast({
          title: "Success",
          description: "Student added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
      setAuth({
        isAuthenticated: true,
        user: {
          name: session.user.email || 'User',
          email: session.user.email || '',
          avatar: "https://github.com/shadcn.png",
        },
      });
      
      toast({
        title: "Logged in",
        description: "You are now logged in",
      });
    } else {
      // We'll handle login through the AuthModal component
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader 
          onSearch={handleSearch} 
          onAddStudent={handleAddStudent}
          isAuthenticated={auth.isAuthenticated}
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
          onLogin={handleLogin}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Index;
