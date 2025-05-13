
import { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, User, Mail, BookOpen, GraduationCap, Phone, Info, Home } from 'lucide-react';
import { Student } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Student) => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  course: z.string().min(1, { message: "Please select a course" }),
  enrollmentDate: z.date({ required_error: "Please select a date" }),
  avatar: z.string().url({ message: "Please enter a valid URL" }).optional(),
  grade: z.string().min(1, { message: "Please select a grade" }),
  attendance: z.number().min(0).max(100, { message: "Attendance must be between 0-100%" }),
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const courseOptions = [
  "Computer Science",
  "Data Science",
  "Graphic Design",
  "Business Administration",
  "Psychology",
  "Marketing"
];

const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];

const StudentForm = ({ isOpen, onClose, onSubmit }: StudentFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      course: "Computer Science",
      enrollmentDate: new Date(),
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      grade: "C",
      attendance: 80,
      bio: "",
      phone: "",
      address: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      // Add student to Supabase
      const { data: studentData, error } = await supabase
        .from('students')
        .insert({
          name: data.name,
          email: data.email,
          course: data.course,
          enrollment_date: data.enrollmentDate.toISOString(),
          avatar: data.avatar,
          grade: data.grade,
          attendance: data.attendance,
          bio: data.bio || null,
          phone: data.phone || null,
          address: data.address || null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform to match Student type
      const newStudent: Student = {
        id: studentData.id,
        name: studentData.name,
        email: studentData.email,
        course: studentData.course,
        enrollmentDate: studentData.enrollment_date,
        avatar: studentData.avatar || "https://github.com/shadcn.png",
        grade: studentData.grade,
        attendance: studentData.attendance,
        bio: studentData.bio,
        phone: studentData.phone,
        address: studentData.address
      };
      
      onSubmit(newStudent);
      toast.success("Student added successfully!");
      form.reset();
      onClose();
    } catch (error: any) {
      console.error("Error adding student:", error);
      toast.error(`Failed to add student: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "transition-all duration-200 focus:scale-[1.02] shadow-sm";
  const iconClasses = "h-4 w-4 text-muted-foreground absolute left-3 top-3";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the student details. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-medium">Name *</FormLabel>
                      <User className={iconClasses} />
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          className={`pl-9 ${inputClasses} border-l-4 border-l-purple-400`} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-medium">Email *</FormLabel>
                      <Mail className={iconClasses} />
                      <FormControl>
                        <Input 
                          placeholder="john@example.com" 
                          className={`pl-9 ${inputClasses} border-l-4 border-l-blue-400`} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-medium">Course *</FormLabel>
                      <BookOpen className={iconClasses} />
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className={`pl-9 ${inputClasses} border-l-4 border-l-green-400`}>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {courseOptions.map(course => (
                              <SelectItem key={course} value={course}>{course}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enrollmentDate"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-medium">Enrollment Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-9 flex justify-start text-left font-normal ${inputClasses} border-l-4 border-l-orange-400`}
                            >
                              <CalendarIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-[50%] transform -translate-y-[50%]" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto border rounded-md shadow-lg bg-gradient-to-br from-white to-purple-50")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-medium">Grade *</FormLabel>
                      <GraduationCap className={iconClasses} />
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className={`pl-9 ${inputClasses} border-l-4 border-l-yellow-400`}>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {gradeOptions.map(grade => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="attendance"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-medium">Attendance % *</FormLabel>
                      <CalendarCheck className={iconClasses} />
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="85" 
                          className={`pl-9 ${inputClasses} border-l-4 border-l-red-400`}
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-medium">Phone</FormLabel>
                      <Phone className={iconClasses} />
                      <FormControl>
                        <Input 
                          placeholder="+1 (555) 123-4567" 
                          className={`pl-9 ${inputClasses} border-l-4 border-l-pink-400`}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-medium">Address</FormLabel>
                      <Home className={iconClasses} />
                      <FormControl>
                        <Input 
                          placeholder="123 Main St, City, Country" 
                          className={`pl-9 ${inputClasses} border-l-4 border-l-indigo-400`}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="font-medium">Bio</FormLabel>
                    <Info className={iconClasses} />
                    <FormControl>
                      <Input 
                        placeholder="Brief description about the student..." 
                        className={`pl-9 ${inputClasses} border-l-4 border-l-cyan-400`}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6 gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  {loading ? "Adding..." : "Add Student"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
