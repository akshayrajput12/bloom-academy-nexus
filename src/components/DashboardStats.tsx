
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, CalendarCheck, Award } from 'lucide-react';
import { Course } from '@/types';

interface DashboardStatsProps {
  studentsCount: number;
  courses: Course[];
}

const DashboardStats = ({ studentsCount, courses }: DashboardStatsProps) => {
  const totalCourses = courses.length;
  const averageAttendance = 90; // This would normally be calculated from actual data
  const highestPerformingCourse = "Computer Science"; // This would be determined from actual data
  
  const stats = [
    {
      title: "Total Students",
      value: studentsCount,
      icon: Users,
      color: "bg-education-blue",
    },
    {
      title: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "bg-education-green",
    },
    {
      title: "Average Attendance",
      value: `${averageAttendance}%`,
      icon: CalendarCheck,
      color: "bg-education-yellow",
    },
    {
      title: "Top Course",
      value: highestPerformingCourse,
      icon: Award,
      color: "bg-purple-light",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Card className="border-none card-shadow">
            <CardHeader className="pb-2 pt-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-md ${stat.color} text-white`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
