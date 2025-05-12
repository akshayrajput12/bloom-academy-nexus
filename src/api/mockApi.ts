
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Student, Course } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
});

// Create mock
const mock = new MockAdapter(api, { delayResponse: 1000 });

// Mock students data
const students: Student[] = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    course: "Computer Science",
    enrollmentDate: "2023-09-01",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    grade: "A",
    attendance: 95,
    bio: "Passionate about AI and machine learning.",
    phone: "555-123-4567",
    address: "123 College Ave, Academic City",
  },
  {
    id: "2",
    name: "Liam Smith",
    email: "liam.smith@example.com",
    course: "Data Science",
    enrollmentDate: "2023-08-15",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    grade: "B+",
    attendance: 88,
    bio: "Working on big data projects and visualization.",
    phone: "555-987-6543",
    address: "456 University Blvd, Knowledge Town",
  },
  {
    id: "3",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    course: "Graphic Design",
    enrollmentDate: "2023-09-05",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    grade: "A-",
    attendance: 92,
    bio: "Creative designer with a focus on UI/UX principles.",
    phone: "555-567-8901",
    address: "789 Art Street, Creative Heights",
  },
  {
    id: "4",
    name: "Noah Wilson",
    email: "noah.wilson@example.com",
    course: "Business Administration",
    enrollmentDate: "2023-08-20",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    grade: "B",
    attendance: 85,
    bio: "Entrepreneur with interests in finance and marketing.",
    phone: "555-345-6789",
    address: "101 Business Row, Commerce City",
  },
  {
    id: "5",
    name: "Sophia Brown",
    email: "sophia.brown@example.com",
    course: "Psychology",
    enrollmentDate: "2023-09-02",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    grade: "A+",
    attendance: 98,
    bio: "Researching cognitive development in adolescents.",
    phone: "555-234-5678",
    address: "202 Mind Avenue, Psychology Park",
  },
  {
    id: "6",
    name: "James Taylor",
    email: "james.taylor@example.com",
    course: "Computer Science",
    enrollmentDate: "2023-08-28",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    grade: "B+",
    attendance: 89,
    bio: "Software developer specializing in web technologies.",
    phone: "555-876-5432",
    address: "303 Code Lane, Tech Town",
  },
  {
    id: "7",
    name: "Isabella Martinez",
    email: "isabella.martinez@example.com",
    course: "Marketing",
    enrollmentDate: "2023-09-10",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    grade: "A-",
    attendance: 93,
    bio: "Digital marketing specialist focusing on social media strategies.",
    phone: "555-765-4321",
    address: "404 Market Street, Brand Village",
  },
  {
    id: "8",
    name: "Benjamin Lee",
    email: "benjamin.lee@example.com",
    course: "Data Science",
    enrollmentDate: "2023-08-25",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
    grade: "B",
    attendance: 87,
    bio: "Analyzing trends in consumer behavior through data mining.",
    phone: "555-654-3210",
    address: "505 Data Drive, Analysis Square",
  }
];

// Mock courses data
const courses: Course[] = [
  {
    id: "1",
    name: "Computer Science",
    students: 42,
    color: "#0EA5E9",
  },
  {
    id: "2",
    name: "Data Science",
    students: 38,
    color: "#10B981",
  },
  {
    id: "3",
    name: "Graphic Design",
    students: 27,
    color: "#F59E0B",
  },
  {
    id: "4",
    name: "Business Administration",
    students: 53,
    color: "#8B5CF6",
  },
  {
    id: "5",
    name: "Psychology",
    students: 31,
    color: "#EC4899",
  },
  {
    id: "6",
    name: "Marketing",
    students: 29,
    color: "#EF4444",
  }
];

// Setup mock endpoints
mock.onGet('/students').reply(200, students);
mock.onGet('/courses').reply(200, courses);

mock.onGet(/\/students\/\d+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const student = students.find(s => s.id === id);
  return student ? [200, student] : [404, { message: 'Student not found' }];
});

// Post new student
mock.onPost('/students').reply((config) => {
  const newStudent = JSON.parse(config.data);
  newStudent.id = (students.length + 1).toString();
  students.push(newStudent);
  return [201, newStudent];
});

export default api;
