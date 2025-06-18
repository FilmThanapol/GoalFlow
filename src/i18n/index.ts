import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      goalflow: "GoalFlow",
      welcome: "Welcome back!",
      trackProgress: "Track your progress and achieve your goals",
      settings: "Settings",
      signOut: "Sign out",
      
      // Dashboard
      totalGoals: "Total Goals",
      completed: "Completed",
      inProgress: "In Progress",
      favorites: "Favorites",
      allGoals: "All your goals",
      activeGoals: "Active goals",
      starredGoals: "Starred goals",
      yourGoals: "Your Goals",
      goalsInProgress: "{{count}} goal in progress",
      goalsInProgress_plural: "{{count}} goals in progress",
      startYourJourney: "Start your journey",
      
      // Goal creation
      createGoal: "Create Goal",
      createYourFirstGoal: "Create Your First Goal",
      readyToAchieve: "Ready to achieve something great?",
      firstGoalDescription: "Start your journey by creating your first goal. Break it down into manageable tasks and track your progress along the way!",
      
      // Goal form
      goalTitle: "Goal Title",
      goalDescription: "Description",
      category: "Category",
      targetDate: "Target Date",
      general: "General",
      health: "Health",
      career: "Career",
      education: "Education",
      personal: "Personal",
      finance: "Finance",
      
      // Tasks
      tasks: "Tasks",
      addTask: "Add Task",
      taskTitle: "Task Title",
      noTasks: "No tasks yet",
      addFirstTask: "Add your first task to get started!",
      completedTasks: "{{completed}} of {{total}} tasks completed",
      
      // Actions
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      markComplete: "Mark Complete",
      markIncomplete: "Mark Incomplete",
      
      // Tabs
      dashboard: "Dashboard",
      analytics: "Analytics",
      achievements: "Achievements",
      
      // Status
      complete: "Complete",
      noDeadline: "No deadline",
      overdue: "Overdue",
      dueToday: "Due today",
      dueSoon: "Due soon",
      onTrack: "On track",
      
      // Analytics
      progressOverview: "Progress Overview",
      goalCategories: "Goal Categories",
      completionRate: "Completion Rate",
      
      // Notifications
      success: "Success",
      error: "Error",
      goalCreated: "Goal created successfully!",
      goalUpdated: "Goal updated successfully!",
      goalDeleted: "Goal deleted successfully!",
      taskCreated: "Task created successfully!",
      taskUpdated: "Task updated successfully!",
      taskDeleted: "Task deleted successfully!",
    }
  },
  th: {
    translation: {
      // Header
      goalflow: "GoalFlow",
      welcome: "ยินดีต้อนรับกลับมา!",
      trackProgress: "ติดตามความคืบหน้าและบรรลุเป้าหมายของคุณ",
      settings: "การตั้งค่า",
      signOut: "ออกจากระบบ",
      
      // Dashboard
      totalGoals: "เป้าหมายทั้งหมด",
      completed: "เสร็จสิ้น",
      inProgress: "ดำเนินการอยู่",
      favorites: "รายการโปรด",
      allGoals: "เป้าหมายทั้งหมดของคุณ",
      activeGoals: "เป้าหมายที่ดำเนินการอยู่",
      starredGoals: "เป้าหมายที่ติดดาว",
      yourGoals: "เป้าหมายของคุณ",
      goalsInProgress: "{{count}} เป้าหมายที่ดำเนินการอยู่",
      goalsInProgress_plural: "{{count}} เป้าหมายที่ดำเนินการอยู่",
      startYourJourney: "เริ่มต้นการเดินทางของคุณ",
      
      // Goal creation
      createGoal: "สร้างเป้าหมาย",
      createYourFirstGoal: "สร้างเป้าหมายแรกของคุณ",
      readyToAchieve: "พร้อมที่จะประสบความสำเร็จแล้วหรือยัง?",
      firstGoalDescription: "เริ่มต้นการเดินทางของคุณด้วยการสร้างเป้าหมายแรก แบ่งออกเป็นงานย่อยที่จัดการได้และติดตามความคืบหน้าตลอดเส้นทาง!",
      
      // Goal form
      goalTitle: "ชื่อเป้าหมาย",
      goalDescription: "คำอธิบาย",
      category: "หมวดหมู่",
      targetDate: "วันที่เป้าหมาย",
      general: "ทั่วไป",
      health: "สุขภาพ",
      career: "อาชีพ",
      education: "การศึกษา",
      personal: "ส่วนตัว",
      finance: "การเงิน",
      
      // Tasks
      tasks: "งาน",
      addTask: "เพิ่มงาน",
      taskTitle: "ชื่องาน",
      noTasks: "ยังไม่มีงาน",
      addFirstTask: "เพิ่มงานแรกของคุณเพื่อเริ่มต้น!",
      completedTasks: "เสร็จสิ้น {{completed}} จาก {{total}} งาน",
      
      // Actions
      edit: "แก้ไข",
      delete: "ลบ",
      save: "บันทึก",
      cancel: "ยกเลิก",
      close: "ปิด",
      markComplete: "ทำเครื่องหมายเป็นเสร็จสิ้น",
      markIncomplete: "ทำเครื่องหมายเป็นยังไม่เสร็จ",
      
      // Tabs
      dashboard: "แดชบอร์ด",
      analytics: "การวิเคราะห์",
      achievements: "ความสำเร็จ",
      
      // Status
      complete: "เสร็จสิ้น",
      noDeadline: "ไม่มีกำหนดเวลา",
      overdue: "เกินกำหนด",
      dueToday: "ครบกำหนดวันนี้",
      dueSoon: "ครบกำหนดเร็วๆ นี้",
      onTrack: "เป็นไปตามแผน",
      
      // Analytics
      progressOverview: "ภาพรวมความคืบหน้า",
      goalCategories: "หมวดหมู่เป้าหมาย",
      completionRate: "อัตราการเสร็จสิ้น",
      
      // Notifications
      success: "สำเร็จ",
      error: "ข้อผิดพลาด",
      goalCreated: "สร้างเป้าหมายเรียบร้อยแล้ว!",
      goalUpdated: "อัปเดตเป้าหมายเรียบร้อยแล้ว!",
      goalDeleted: "ลบเป้าหมายเรียบร้อยแล้ว!",
      taskCreated: "สร้างงานเรียบร้อยแล้ว!",
      taskUpdated: "อัปเดตงานเรียบร้อยแล้ว!",
      taskDeleted: "ลบงานเรียบร้อยแล้ว!",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
