
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
import api from '@/api/mockApi';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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

  // Fetch students and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsResponse, coursesResponse] = await Promise.all([
          api.get('/students'),
          api.get('/courses'),
        ]);
        
        setStudents(studentsResponse.data);
        setFilteredStudents(studentsResponse.data);
        setCourses(coursesResponse.data);
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

  const handleStudentAdded = (student: Student) => {
    setStudents(prev => [student, ...prev]);
    toast({
      title: "Success",
      description: "Student added successfully",
    });
  };

  const handleLogin = () => {
    setAuth({
      isAuthenticated: true,
      user: {
        name: "Demo User",
        email: "demo@example.com",
        avatar: "https://github.com/shadcn.png",
      },
    });
    
    toast({
      title: "Logged in",
      description: "You are now logged in",
    });
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
