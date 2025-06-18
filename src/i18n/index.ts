import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
      goalsInProgress_one: "{{count}} goal in progress",
      goalsInProgress_other: "{{count}} goals in progress",
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

      // Language
      language: "Language",
      english: "English",
      thai: "ไทย",

      // New features
      chooseTemplate: "Choose Template",
      createCustom: "Create Custom",
      myTasks: "My Tasks",
      taskTemplates: "Task Templates",
      suggestedTasks: "Suggested Tasks",
      addAllTasks: "Add All Tasks",
      noTemplatesAvailable: "No templates available",
      templatesNotAvailable: "Templates are not available for this goal category yet.",

      // Analytics
      completionTrend: "Completion Trend",
      monthlyProgress: "Monthly Progress",
      goalsByCategory: "Goals by Category",
      categoryPerformance: "Category Performance",
      currentStreak: "Current Streak",
      bestStreak: "Best Streak",
      personalRecord: "Personal record",
      keepItUp: "Keep it up!",

      // Achievements
      achievements: "Achievements",
      totalPoints: "Total Points",
      progressToLevel: "Progress to Level {{level}}",
      maxLevel: "Max Level!",
      achievementUnlocked: "Achievement Unlocked!",
      dayStreak: "Day Streak",
      goalsDone: "Goals Done",
      tasksDone: "Tasks Done",

      // Settings
      notificationSettings: "Notification Settings",
      browserNotifications: "Browser Notifications",
      notificationDescription: "Get notified about upcoming deadlines and overdue goals",
      enableNotifications: "Enable Notifications",
      enableInBrowserSettings: "Enable in browser settings",
      notificationTypes: "Notification Types",
      notificationsEnabled: "Notifications enabled",
      notificationsBlocked: "Notifications blocked",
      permissionNeeded: "Permission needed",

      // Data Management
      exportYourData: "Export Your Data",
      importYourData: "Import Your Data",
      dataStatistics: "Data Statistics",
      exportDescription: "Download all your goals and tasks as a JSON file for backup or transfer.",
      importDescription: "Import goals from a previously exported JSON file or backup code.",
      exportAsJSON: "Export as JSON",
      copyBackupCode: "Copy Backup Code",
      importFromFile: "Import from File",
      backupCodeCopied: "Backup Code Copied",
      backupCodeDescription: "Your backup code has been copied to clipboard.",

      // Motivational quotes
      motivationalQuote: "Motivational Quote",
      newQuote: "New Quote",
      quoteLiked: "Quote Liked!",
      quoteMotivation: "Great choice! Keep that motivation going.",
      quoteCopied: "Quote Copied!",
      quoteDescription: "The quote has been copied to your clipboard.",
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
      goalsInProgress_one: "{{count}} เป้าหมายที่ดำเนินการอยู่",
      goalsInProgress_other: "{{count}} เป้าหมายที่ดำเนินการอยู่",
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

      // Language
      language: "ภาษา",
      english: "English",
      thai: "ไทย",

      // New features
      chooseTemplate: "เลือกเทมเพลต",
      createCustom: "สร้างแบบกำหนดเอง",
      myTasks: "งานของฉัน",
      taskTemplates: "เทมเพลตงาน",
      suggestedTasks: "งานที่แนะนำ",
      addAllTasks: "เพิ่มงานทั้งหมด",
      noTemplatesAvailable: "ไม่มีเทมเพลต",
      templatesNotAvailable: "ยังไม่มีเทมเพลตสำหรับหมวดหมู่เป้าหมายนี้",

      // Analytics
      completionTrend: "แนวโน้มการเสร็จสิ้น",
      monthlyProgress: "ความคืบหน้ารายเดือน",
      goalsByCategory: "เป้าหมายตามหมวดหมู่",
      categoryPerformance: "ประสิทธิภาพตามหมวดหมู่",
      currentStreak: "สตรีคปัจจุบัน",
      bestStreak: "สตรีคที่ดีที่สุด",
      personalRecord: "สถิติส่วนตัว",
      keepItUp: "ทำต่อไป!",

      // Achievements
      achievements: "ความสำเร็จ",
      totalPoints: "คะแนนรวม",
      progressToLevel: "ความคืบหน้าสู่เลเวล {{level}}",
      maxLevel: "เลเวลสูงสุด!",
      achievementUnlocked: "ปลดล็อกความสำเร็จแล้ว!",
      dayStreak: "สตรีควัน",
      goalsDone: "เป้าหมายที่เสร็จ",
      tasksDone: "งานที่เสร็จ",

      // Settings
      notificationSettings: "การตั้งค่าการแจ้งเตือน",
      browserNotifications: "การแจ้งเตือนของเบราว์เซอร์",
      notificationDescription: "รับการแจ้งเตือนเกี่ยวกับกำหนดเวลาที่ใกล้มาถึงและเป้าหมายที่เกินกำหนด",
      enableNotifications: "เปิดใช้การแจ้งเตือน",
      enableInBrowserSettings: "เปิดใช้ในการตั้งค่าเบราว์เซอร์",
      notificationTypes: "ประเภทการแจ้งเตือน",
      notificationsEnabled: "เปิดใช้การแจ้งเตือนแล้ว",
      notificationsBlocked: "การแจ้งเตือนถูกบล็อก",
      permissionNeeded: "ต้องการสิทธิ์",

      // Data Management
      exportYourData: "ส่งออกข้อมูลของคุณ",
      importYourData: "นำเข้าข้อมูลของคุณ",
      dataStatistics: "สถิติข้อมูล",
      exportDescription: "ดาวน์โหลดเป้าหมายและงานทั้งหมดของคุณเป็นไฟล์ JSON สำหรับสำรองข้อมูลหรือถ่ายโอน",
      importDescription: "นำเข้าเป้าหมายจากไฟล์ JSON ที่ส่งออกไว้ก่อนหน้านี้หรือรหัสสำรองข้อมูล",
      exportAsJSON: "ส่งออกเป็น JSON",
      copyBackupCode: "คัดลอกรหัสสำรองข้อมูล",
      importFromFile: "นำเข้าจากไฟล์",
      backupCodeCopied: "คัดลอกรหัสสำรองข้อมูลแล้ว",
      backupCodeDescription: "รหัสสำรองข้อมูลของคุณถูกคัดลอกไปยังคลิปบอร์ดแล้ว",

      // Motivational quotes
      motivationalQuote: "คำคมสร้างแรงบันดาลใจ",
      newQuote: "คำคมใหม่",
      quoteLiked: "ถูกใจคำคม!",
      quoteMotivation: "ตัวเลือกที่ดี! รักษาแรงบันดาลใจนั้นไว้!",
      quoteCopied: "คัดลอกคำคมแล้ว!",
      quoteDescription: "คำคมถูกคัดลอกไปยังคลิปบอร์ดของคุณแล้ว",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
