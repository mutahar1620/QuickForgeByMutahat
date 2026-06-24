import { Icons } from '../icons.js';

export const AdminDashboard = {
  name: 'AdminDashboard',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, onMounted } = Vue;

    onMounted(() => {
      // Mock Activity Chart
      setTimeout(() => {
        const ctx = document.getElementById('activityChart');
        if (ctx && window.Chart) {
          new window.Chart(ctx, {
            type: 'line',
            data: {
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                label: 'Quizzes Taken',
                data: [120, 190, 300, 250, 200, 150, 280],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
          });
        }
      }, 100);
    });

    return { Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Admin Dashboard</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">System overview and key metrics.</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div class="glass p-4 rounded-xl shadow-card border border-indigo-500/10">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg" v-html="Icons.quiz"></div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Quizzes</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ data.stats.totalQuizzes }}</p>
            <span class="text-xs text-green-400 font-medium">↑ 12%</span>
          </div>
        </div>
        <div class="glass p-4 rounded-xl shadow-card border border-indigo-500/10">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-violet-500/20 text-violet-400 rounded-lg" v-html="Icons.users"></div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Students</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ data.stats.activeStudents }}</p>
            <span class="text-xs text-green-400 font-medium">↑ 5%</span>
          </div>
        </div>
        <div class="glass p-4 rounded-xl shadow-card border border-indigo-500/10">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-green-500/20 text-green-400 rounded-lg" v-html="Icons.chart"></div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg Score</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ data.stats.avgScore }}%</p>
            <span class="text-xs text-green-400 font-medium">↑ 2.1%</span>
          </div>
        </div>
        <div class="glass p-4 rounded-xl shadow-card border border-indigo-500/10">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-500/20 text-blue-400 rounded-lg" v-html="Icons.check"></div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Completion Rate</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ data.stats.completionRate }}%</p>
            <span class="text-xs text-green-400 font-medium">↑ 1.5%</span>
          </div>
        </div>
        <div class="glass p-4 rounded-xl shadow-card border border-indigo-500/10">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg" v-html="Icons.clock"></div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Grading</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ data.stats.pendingGrading }}</p>
            <span class="text-xs text-red-400 font-medium">↓ 4</span>
          </div>
        </div>
        <div class="glass p-4 rounded-xl shadow-card border border-indigo-500/10">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-pink-500/20 text-pink-400 rounded-lg" v-html="Icons.bank"></div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Questions</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ data.stats.totalQuestions }}</p>
            <span class="text-xs text-green-400 font-medium">↑ 124</span>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Quizzes Table -->
        <div class="lg:col-span-2 glass rounded-xl shadow-card border border-indigo-500/10 overflow-hidden flex flex-col">
          <div class="p-5 border-b border-indigo-500/10 flex justify-between items-center bg-slate-100 dark:bg-slate-800/30">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Recent Quizzes</h2>
            <button @click="navigate('quizzes')" class="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
          </div>
          <div class="overflow-x-auto flex-1">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th class="p-4 font-medium">Title & Subject</th>
                  <th class="p-4 font-medium">Status</th>
                  <th class="p-4 font-medium">Students</th>
                  <th class="p-4 font-medium">Avg Score</th>
                  <th class="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/50">
                <tr v-for="quiz in data.recentQuizzes.slice(0,5)" :key="quiz.id" class="hover:bg-slate-100 dark:bg-slate-800/30 transition-colors">
                  <td class="p-4">
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ quiz.title }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ quiz.subject }}</p>
                  </td>
                  <td class="p-4">
                    <span :class="['badge', quiz.status === 'active' ? 'badge-success' : quiz.status === 'draft' ? 'badge-warning' : 'badge-info']">
                      {{ quiz.status }}
                    </span>
                  </td>
                  <td class="p-4 text-sm text-slate-600 dark:text-slate-300">{{ quiz.students }}</td>
                  <td class="p-4 text-sm text-slate-600 dark:text-slate-300">
                    <div class="flex items-center gap-2">
                      <div class="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-indigo-500 rounded-full" :style="{ width: (quiz.avgScore || 0) + '%' }"></div>
                      </div>
                      <span>{{ quiz.avgScore ? quiz.avgScore + '%' : '-' }}</span>
                    </div>
                  </td>
                  <td class="p-4">
                    <button class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 transition-colors" v-html="Icons.edit"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="glass p-5 rounded-xl shadow-card border border-indigo-500/10 bg-slate-100 dark:bg-slate-800/30">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div class="grid grid-cols-2 gap-3">
              <button @click="navigate('quiz-creator')" class="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 flex flex-col items-center justify-center gap-2 transition-colors card-hover">
                <div class="text-indigo-400" v-html="Icons.plus"></div>
                <span class="text-xs font-medium text-indigo-300">New Quiz</span>
              </button>
              <button @click="navigate('users')" class="p-3 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 flex flex-col items-center justify-center gap-2 transition-colors card-hover">
                <div class="text-violet-400" v-html="Icons.users"></div>
                <span class="text-xs font-medium text-violet-300">Add User</span>
              </button>
              <button @click="navigate('question-bank')" class="p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 flex flex-col items-center justify-center gap-2 transition-colors card-hover">
                <div class="text-green-400" v-html="Icons.bank"></div>
                <span class="text-xs font-medium text-green-300">Question Bank</span>
              </button>
              <button @click="navigate('settings')" class="p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 flex flex-col items-center justify-center gap-2 transition-colors card-hover">
                <div class="text-orange-400" v-html="Icons.settings"></div>
                <span class="text-xs font-medium text-orange-300">Settings</span>
              </button>
            </div>
          </div>

          <!-- Notifications -->
          <div class="glass p-5 rounded-xl shadow-card border border-indigo-500/10 flex-1 flex flex-col bg-slate-100 dark:bg-slate-800/30">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            </div>
            <div class="space-y-4">
              <div v-for="notif in data.notifications.slice(0,4)" :key="notif.id" class="flex gap-3 items-start">
                <div class="text-xl pt-0.5">{{ notif.icon }}</div>
                <div>
                  <p class="text-sm text-slate-600 dark:text-slate-300">{{ notif.message }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ notif.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
        <!-- Chart -->
        <div class="lg:col-span-2 glass p-5 rounded-xl shadow-card border border-indigo-500/10 flex flex-col">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Activity Overview</h2>
          <div class="flex-1 relative w-full h-full min-h-[200px]">
            <canvas id="activityChart"></canvas>
          </div>
        </div>

        <!-- Top Performers -->
        <div class="glass rounded-xl shadow-card border border-indigo-500/10 overflow-hidden flex flex-col">
          <div class="p-5 border-b border-indigo-500/10 bg-slate-100 dark:bg-slate-800/30">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Top Performers</h2>
          </div>
          <div class="p-5 flex-1 space-y-4 overflow-y-auto">
            <div v-for="(user, i) in data.leaderboard.slice(0,5)" :key="user.name" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div :class="['font-bold text-sm w-5 text-center', i===0?'text-yellow-400':i===1?'text-slate-600 dark:text-slate-300':i===2?'text-orange-400':'text-slate-500']">#{{i+1}}</div>
                <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">{{ user.name.charAt(0) }}</div>
                <div>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">{{ user.name }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ user.xp }} XP</p>
                </div>
              </div>
              <div class="text-sm font-bold text-indigo-400">{{ user.score }}%</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
};

export const InstructorDashboard = {
  name: 'InstructorDashboard',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { onMounted } = Vue;
    onMounted(() => {
      setTimeout(() => {
        const ctx = document.getElementById('scoreChart');
        if(ctx && window.Chart) {
          new window.Chart(ctx, {
            type: 'bar',
            data: { labels: ['0-60', '60-70', '70-80', '80-90', '90-100'], datasets: [{ label: 'Students', data: [5, 12, 25, 40, 18], backgroundColor: '#8b5cf6', borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
          });
        }
      }, 100);
    });
    return { Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="p-6 space-y-6">
      <div class="glass p-6 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900/40 to-violet-900/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back, {{ data.currentUser.name }}! 👋</h1>
          <p class="text-indigo-200">You have <strong class="text-slate-900 dark:text-white">{{ data.stats.pendingGrading }} submissions</strong> waiting for manual grading.</p>
        </div>
        <button @click="navigate('analytics')" class="btn-primary px-6 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white shadow-glow">Start Grading</button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <!-- My Quizzes -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">My Quizzes</h2>
              <button @click="navigate('quiz-creator')" class="text-sm font-medium text-indigo-400 flex items-center gap-1 hover:text-indigo-300"><span v-html="Icons.plus" class="w-4 h-4"></span> Create New</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="quiz in data.recentQuizzes.slice(0,4)" :key="quiz.id" class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700 card-hover flex flex-col">
                <div class="flex justify-between items-start mb-3">
                  <span :class="['badge', quiz.status === 'active' ? 'badge-success' : 'badge-warning']">{{ quiz.status }}</span>
                  <div class="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white cursor-pointer" v-html="Icons.edit"></div>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-1">{{ quiz.title }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">{{ quiz.subject }} • {{ quiz.questions }} Questions</p>
                <div class="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                  <div>
                    <p class="text-xs text-slate-500">Students</p>
                    <p class="font-semibold text-slate-900 dark:text-white">{{ quiz.students }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500">Avg Score</p>
                    <p class="font-semibold text-slate-900 dark:text-white">{{ quiz.avgScore || '-' }}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-6">
          <!-- Analytics Snippet -->
          <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700 h-64 flex flex-col">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Class Performance</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Score distribution across all active quizzes.</p>
            <div class="flex-1 relative w-full h-full">
              <canvas id="scoreChart"></canvas>
            </div>
          </div>
          
          <!-- Recent Submissions -->
          <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Submissions</h2>
            <div class="space-y-3">
              <div v-for="user in data.users.slice(0,4)" :key="user.id" class="flex items-center justify-between p-2 hover:bg-slate-100 dark:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">{{ user.name.charAt(0) }}</div>
                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-white">{{ user.name }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Advanced JS</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-green-400">{{ user.avgScore }}%</p>
                  <p class="text-xs text-slate-500">2h ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

export const StudentDashboard = {
  name: 'StudentDashboard',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    return { Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="p-6 space-y-6">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl p-8 border border-indigo-500/20 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div class="absolute inset-0 bg-mesh-gradient opacity-50"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Hello, {{ data.currentUser.name }}!</h1>
            <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              🔥 {{ data.studentProgress.streak }} Day Streak
            </span>
          </div>
          <p class="text-indigo-200">Ready to learn something new today?</p>
        </div>
        
        <div class="relative z-10 bg-slate-50 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center gap-6 min-w-[300px]">
          <div class="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center text-xl font-bold bg-slate-100 dark:bg-slate-800 shadow-glow-sm text-slate-900 dark:text-white">
            L{{ data.studentProgress.level }}
          </div>
          <div class="flex-1">
            <div class="flex justify-between text-sm mb-1 font-medium">
              <span class="text-slate-900 dark:text-white">{{ data.studentProgress.totalXP }} XP</span>
              <span class="text-slate-500 dark:text-slate-400">{{ data.studentProgress.nextLevelXP }}</span>
            </div>
            <div class="progress-bar bg-slate-200 dark:bg-slate-700 h-2">
              <div class="progress-fill shadow-glow" :style="{ width: (data.studentProgress.totalXP / data.studentProgress.nextLevelXP * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Upcoming Quizzes -->
          <div class="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Up Next</h2>
            <div class="space-y-4">
              <div v-for="quiz in data.studentProgress.upcomingQuizzes" :key="quiz.id" 
                   class="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4 card-hover cursor-default">
                <div class="flex items-center gap-4 w-full sm:w-auto">
                  <div class="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center" v-html="Icons.clock"></div>
                  <div>
                    <h3 class="font-bold text-slate-900 dark:text-white">{{ quiz.title }}</h3>
                    <p class="text-sm text-indigo-300">{{ quiz.date }} @ {{ quiz.time }} • {{ quiz.duration }} mins</p>
                  </div>
                </div>
                <button @click="navigate('quiz-player')" class="btn-primary px-6 py-2 rounded-lg text-sm font-medium text-slate-900 dark:text-white w-full sm:w-auto shadow-glow-sm">Start Now</button>
              </div>
              <div v-if="!data.studentProgress.upcomingQuizzes.length" class="text-center py-6 text-slate-500 dark:text-slate-400">
                No upcoming quizzes. Enjoy your free time!
              </div>
            </div>
          </div>

          <!-- Recommended AI path -->
          <div class="glass p-6 rounded-xl border border-violet-500/20 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10 text-violet-500" style="transform: scale(3) translate(10%, -10%);" v-html="Icons.ai"></div>
            <div class="flex items-center gap-2 mb-4 relative z-10">
              <span class="ai-badge shadow-glow-sm"><span v-html="Icons.ai" class="w-3.5 h-3.5"></span> AI Recommended</span>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Targeted Practice</h2>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 relative z-10">Based on your recent performance, we suggest focusing on these areas to improve.</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div class="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 transition-colors cursor-pointer">
                <h4 class="font-semibold text-slate-900 dark:text-white mb-1">Async JavaScript</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">You missed 3 questions on Promises.</p>
                <button class="text-violet-400 text-sm font-medium hover:text-violet-300">Start Practice →</button>
              </div>
              <div class="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 transition-colors cursor-pointer">
                <h4 class="font-semibold text-slate-900 dark:text-white mb-1">Cellular Respiration</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">Topic review recommended.</p>
                <button class="text-violet-400 text-sm font-medium hover:text-violet-300">Start Practice →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Recent Achievements -->
          <div class="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-bold text-slate-900 dark:text-white">Recent Badges</h2>
              <button @click="navigate('gamification')" class="text-xs text-indigo-400 font-medium">View All</button>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div v-for="badge in data.badges.filter(b=>b.earned).slice(0,3)" :key="badge.id" 
                   class="flex flex-col items-center text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 tooltip-wrapper cursor-pointer">
                <span class="text-3xl mb-1">{{ badge.icon }}</span>
                <span class="text-[10px] font-medium text-slate-600 dark:text-slate-300 leading-tight">{{ badge.name }}</span>
                <div class="tooltip">{{ badge.description }}</div>
              </div>
            </div>
          </div>

          <!-- Recent Results -->
          <div class="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h2 class="font-bold text-slate-900 dark:text-white mb-4">Recent Results</h2>
            <div class="space-y-4">
              <div v-for="result in data.studentProgress.recentScores.slice(0,4)" :key="result.quiz">
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-slate-700 dark:text-slate-200">{{ result.quiz }}</span>
                  <span :class="result.score >= 80 ? 'text-green-400' : 'text-amber-400 font-medium'">{{ result.score }}%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', result.score >= 80 ? 'bg-green-500' : 'bg-amber-500']" :style="{width: result.score + '%'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};
