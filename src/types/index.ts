
export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
  avatar: string;
  grade: string;
  attendance: number;
  bio?: string;
  phone?: string;
  address?: string;
}

export interface Course {
  id: string;
  name: string;
  students: number;
  color: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
}
