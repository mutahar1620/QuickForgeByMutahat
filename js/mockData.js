// ============================================================
// QuizForge — Mock Data Store
// ============================================================
export const mockData = {

  currentUser: {
    id: 1,
    name: 'Mahan',
    email: 'mahan@quizforge.io',
    role: 'admin', // admin | instructor | student
    avatar: null,
    xp: 4250,
    level: 12,
    streak: 7,
    badges: 14,
    joined: '2024-01-15',
  },

  stats: {
    totalQuizzes: 248,
    activeStudents: 1847,
    avgScore: 78.4,
    completionRate: 91.2,
    totalQuestions: 5640,
    pendingGrading: 23,
  },

  recentQuizzes: [
    { id: 1, title: 'Advanced JavaScript Concepts', subject: 'Programming', status: 'active', questions: 25, students: 84, avgScore: 72, difficulty: 'hard', createdAt: '2024-06-10', timeLimit: 45 },
    { id: 2, title: 'Human Biology — Cell Structure', subject: 'Biology', status: 'active', questions: 30, students: 120, avgScore: 81, difficulty: 'medium', createdAt: '2024-06-08', timeLimit: 60 },
    { id: 3, title: 'World History: Renaissance Era', subject: 'History', status: 'draft', questions: 20, students: 0, avgScore: null, difficulty: 'easy', createdAt: '2024-06-12', timeLimit: 30 },
    { id: 4, title: 'Calculus: Derivatives & Integrals', subject: 'Mathematics', status: 'active', questions: 35, students: 67, avgScore: 65, difficulty: 'hard', createdAt: '2024-06-05', timeLimit: 90 },
    { id: 5, title: 'Introduction to Python', subject: 'Programming', status: 'completed', questions: 20, students: 200, avgScore: 88, difficulty: 'easy', createdAt: '2024-05-28', timeLimit: 30 },
    { id: 6, title: 'English Literature — Shakespeare', subject: 'Literature', status: 'scheduled', questions: 18, students: 0, avgScore: null, difficulty: 'medium', createdAt: '2024-06-14', timeLimit: 40 },
  ],

  users: [
    { id: 1, name: 'Mahan', email: 'mahan@edu.io', role: 'admin', status: 'active', quizzesTaken: 45, avgScore: 91, lastActive: '2024-06-14', joined: '2024-01-15' },
    { id: 2, name: 'Anik', email: 'anik@edu.io', role: 'instructor', status: 'active', quizzesTaken: 12, avgScore: 88, lastActive: '2024-06-13', joined: '2024-02-01' },
    { id: 3, name: 'Prianto', email: 'prianto@edu.io', role: 'student', status: 'active', quizzesTaken: 78, avgScore: 76, lastActive: '2024-06-14', joined: '2024-03-10' },
    { id: 4, name: 'Tamim', email: 'tamim@edu.io', role: 'student', status: 'active', quizzesTaken: 62, avgScore: 84, lastActive: '2024-06-12', joined: '2024-03-15' },
    { id: 5, name: 'Tanvir', email: 'tanvir@edu.io', role: 'student', status: 'inactive', quizzesTaken: 23, avgScore: 65, lastActive: '2024-05-20', joined: '2024-04-01' },
    { id: 6, name: 'Jehin', email: 'jehin@edu.io', role: 'instructor', status: 'active', quizzesTaken: 8, avgScore: 94, lastActive: '2024-06-11', joined: '2024-02-15' },
    { id: 7, name: 'Nashwan', email: 'nashwan@edu.io', role: 'student', status: 'active', quizzesTaken: 91, avgScore: 79, lastActive: '2024-06-14', joined: '2024-01-28' },
    { id: 8, name: 'Mutahar', email: 'mutahar@edu.io', role: 'student', status: 'active', quizzesTaken: 55, avgScore: 88, lastActive: '2024-06-13', joined: '2024-03-05' },
  ],

  leaderboard: [
    { rank: 1, name: 'Nashwan', avatar: null, xp: 9840, badges: 22, streak: 15, score: 98.4, change: 0 },
    { rank: 2, name: 'Mutahar', avatar: null, xp: 8920, badges: 19, streak: 12, score: 96.2, change: 1 },
    { rank: 3, name: 'Tamim', avatar: null, xp: 8210, badges: 17, streak: 9, score: 94.8, change: -1 },
    { rank: 4, name: 'Prianto', avatar: null, xp: 7650, badges: 15, streak: 7, score: 92.1, change: 2 },
    { rank: 5, name: 'Jehin', avatar: null, xp: 7200, badges: 14, streak: 6, score: 90.5, change: -1 },
    { rank: 6, name: 'Mahan', avatar: null, xp: 4250, badges: 12, streak: 7, score: 87.3, change: 0 },
    { rank: 7, name: 'Tanvir', avatar: null, xp: 3890, badges: 9, streak: 3, score: 82.1, change: 1 },
    { rank: 8, name: 'Anik', avatar: null, xp: 3240, badges: 8, streak: 4, score: 79.6, change: -2 },
  ],

  badges: [
    { id: 1, name: 'First Quiz', icon: '🎯', description: 'Completed your first quiz', earned: true, xp: 50, rarity: 'common' },
    { id: 2, name: 'Speed Demon', icon: '⚡', description: 'Finished a quiz in under 5 minutes', earned: true, xp: 100, rarity: 'rare' },
    { id: 3, name: 'Perfect Score', icon: '💎', description: 'Achieved 100% on any quiz', earned: true, xp: 250, rarity: 'epic' },
    { id: 4, name: 'Week Warrior', icon: '🔥', description: '7-day login streak', earned: true, xp: 150, rarity: 'rare' },
    { id: 5, name: 'Quiz Master', icon: '👑', description: 'Completed 50+ quizzes', earned: false, xp: 500, rarity: 'legendary' },
    { id: 6, name: 'Scholar', icon: '📚', description: 'Studied 5 different subjects', earned: true, xp: 200, rarity: 'epic' },
    { id: 7, name: 'Night Owl', icon: '🦉', description: 'Completed quiz after midnight', earned: false, xp: 75, rarity: 'common' },
    { id: 8, name: 'Champion', icon: '🏆', description: 'Reached #1 on leaderboard', earned: false, xp: 1000, rarity: 'legendary' },
    { id: 9, name: 'Streak Master', icon: '🌟', description: '30-day streak', earned: false, xp: 750, rarity: 'legendary' },
    { id: 10, name: 'Helper', icon: '🤝', description: 'Helped 5 students', earned: true, xp: 120, rarity: 'rare' },
    { id: 11, name: 'Explorer', icon: '🗺️', description: 'Tried all question types', earned: true, xp: 80, rarity: 'common' },
    { id: 12, name: 'Comeback Kid', icon: '💪', description: 'Improved score by 30%', earned: false, xp: 200, rarity: 'epic' },
  ],

  questionBank: [
    { id: 1, text: 'What is the time complexity of binary search?', type: 'mcq', subject: 'Computer Science', difficulty: 'medium', tags: ['algorithms', 'search'], usageCount: 23, passRate: 68 },
    { id: 2, text: 'The mitochondria is the powerhouse of the cell.', type: 'truefalse', subject: 'Biology', difficulty: 'easy', tags: ['cell biology', 'organelles'], usageCount: 45, passRate: 91 },
    { id: 3, text: 'What is the derivative of sin(x)?', type: 'mcq', subject: 'Mathematics', difficulty: 'easy', tags: ['calculus', 'derivatives'], usageCount: 38, passRate: 84 },
    { id: 4, text: 'Explain the concept of recursion in programming.', type: 'essay', subject: 'Computer Science', difficulty: 'hard', tags: ['programming', 'algorithms'], usageCount: 12, passRate: 55 },
    { id: 5, text: 'Match the historical events to their dates.', type: 'matching', subject: 'History', difficulty: 'medium', tags: ['world history', 'dates'], usageCount: 19, passRate: 72 },
    { id: 6, text: 'The speed of light is approximately ___ km/s.', type: 'fillin', subject: 'Physics', difficulty: 'medium', tags: ['constants', 'light'], usageCount: 31, passRate: 79 },
    { id: 7, text: 'Arrange the planets in order from Sun.', type: 'ordering', subject: 'Astronomy', difficulty: 'easy', tags: ['solar system', 'planets'], usageCount: 28, passRate: 88 },
    { id: 8, text: 'What is photosynthesis?', type: 'essay', subject: 'Biology', difficulty: 'medium', tags: ['plants', 'energy'], usageCount: 41, passRate: 76 },
  ],

  notifications: [
    { id: 1, type: 'grading', message: '23 essays need manual grading', time: '5m ago', read: false, icon: '📝' },
    { id: 2, type: 'deadline', message: 'JS Quiz deadline in 2 hours', time: '1h ago', read: false, icon: '⏰' },
    { id: 3, type: 'badge', message: 'Nashwan earned "Champion" badge', time: '2h ago', read: true, icon: '🏆' },
    { id: 4, type: 'submission', message: 'New quiz submission from Tamim', time: '3h ago', read: true, icon: '✅' },
    { id: 5, type: 'system', message: 'System backup completed successfully', time: '1d ago', read: true, icon: '💾' },
  ],

  analyticsChartData: {
    scoreDistribution: [12, 8, 15, 22, 31, 28, 19, 14, 9, 6],
    weeklyActivity: [45, 62, 78, 55, 90, 84, 71],
    subjectPerformance: {
      labels: ['Math', 'Science', 'History', 'English', 'CS', 'Physics'],
      data: [72, 81, 68, 85, 79, 74],
    },
    monthlyTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      passed: [120, 145, 178, 210, 198, 234],
      failed: [30, 25, 22, 18, 24, 16],
    }
  },

  studentProgress: {
    totalXP: 4250,
    level: 12,
    nextLevelXP: 5000,
    quizzesCompleted: 45,
    averageScore: 81,
    streak: 7,
    upcomingQuizzes: [
      { id: 1, title: 'Advanced JavaScript', date: '2024-06-16', time: '14:00', duration: 45 },
      { id: 2, title: 'Calculus Midterm', date: '2024-06-18', time: '09:00', duration: 90 },
    ],
    recentScores: [
      { quiz: 'Python Basics', score: 92, date: '2024-06-10' },
      { quiz: 'Cell Biology', score: 78, date: '2024-06-08' },
      { quiz: 'World History', score: 85, date: '2024-06-05' },
      { quiz: 'Algebra II', score: 71, date: '2024-06-02' },
    ],
    heatmap: Array.from({ length: 52 }, (_, w) =>
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
    )
  },

  activeQuiz: {
    id: 1,
    title: 'Advanced JavaScript Concepts',
    totalQuestions: 10,
    timeLimit: 600, // seconds
    currentQuestion: 0,
    questions: [
      {
        id: 1,
        text: 'What does the `typeof` operator return for `null` in JavaScript?',
        type: 'mcq',
        difficulty: 'medium',
        options: [
          { id: 'a', text: '"null"' },
          { id: 'b', text: '"object"' },
          { id: 'c', text: '"undefined"' },
          { id: 'd', text: '"boolean"' },
        ],
        correct: 'b',
        explanation: 'This is a well-known JavaScript quirk. `typeof null` returns "object" due to a bug in the original JavaScript implementation that was never fixed for backwards compatibility.',
        hint: 'Think about legacy JavaScript quirks from the language\'s early days.',
      },
      {
        id: 2,
        text: 'Which of the following correctly describes a "closure" in JavaScript?',
        type: 'mcq',
        difficulty: 'hard',
        options: [
          { id: 'a', text: 'A function that cannot be called more than once' },
          { id: 'b', text: 'A function that has access to variables from its outer scope even after the outer function has returned' },
          { id: 'c', text: 'A method that closes the browser window' },
          { id: 'd', text: 'An error handling mechanism in async functions' },
        ],
        correct: 'b',
        explanation: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).',
        hint: 'Think about how inner functions can "remember" variables from their parent scope.',
      },
      {
        id: 3,
        text: 'JavaScript is a single-threaded, synchronous programming language.',
        type: 'truefalse',
        difficulty: 'medium',
        options: [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' },
        ],
        correct: 'false',
        explanation: 'JavaScript is single-threaded but uses an event loop that allows asynchronous operations via callbacks, promises, and async/await.',
        hint: 'Consider how setTimeout and fetch work without blocking the main thread.',
      },
    ]
  },

  integrations: [
    { id: 1, name: 'Moodle LMS', icon: '📚', status: 'connected', description: 'Sync quizzes and grades with Moodle', lastSync: '2h ago' },
    { id: 2, name: 'Google Classroom', icon: '🎓', status: 'connected', description: 'Auto-assign quizzes to Google Classroom', lastSync: '1d ago' },
    { id: 3, name: 'Microsoft Teams', icon: '💼', status: 'disconnected', description: 'Share quizzes in Teams channels', lastSync: null },
    { id: 4, name: 'Canvas LMS', icon: '🖼️', status: 'disconnected', description: 'Integrate with Canvas courses', lastSync: null },
    { id: 5, name: 'Stripe Payments', icon: '💳', status: 'connected', description: 'Accept payments for premium quizzes', lastSync: '5h ago' },
    { id: 6, name: 'Webhook API', icon: '🔗', status: 'connected', description: 'Send events to external endpoints', lastSync: '30m ago' },
  ],
};
