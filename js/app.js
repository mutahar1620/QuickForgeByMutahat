import { mockData } from './mockData.js';
import { AppSidebar, AppTopbar } from './components/Layout.js';
import { Icons } from './icons.js';

// Import Pages
import { LoginPage, RegisterPage } from './pages/AuthPages.js';
import { PricingPage } from './pages/PricingPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { AdminDashboard, InstructorDashboard, StudentDashboard } from './pages/DashboardPages.js';
import { QuizLobby, QuizPlayer } from './pages/QuizPlayer.js';

// ── Full-featured page imports (replaces OtherPages.js & AdminPages.js) ──
import { QuizList, QuizCreator, QuestionBank } from './pages/QuizPages.js';
import { AnalyticsDashboard }                  from './pages/AnalyticsPage.js';
import { GamificationPage }                    from './pages/GamificationPage.js';
import { UserList }                            from './pages/UserManagement.js';
import { SettingsPage }                        from './pages/SettingsPage.js';
import { QuizResultsPage }                     from './pages/QuizResultsPage.js';

const { createApp, ref, computed, onMounted } = Vue;

const App = {
  components: {
    AppSidebar, AppTopbar,
    LoginPage, RegisterPage, PricingPage, CheckoutPage,
    AdminDashboard, InstructorDashboard, StudentDashboard,
    QuizLobby, QuizPlayer, QuizResultsPage,
    QuizList, QuizCreator, QuestionBank,
    AnalyticsDashboard, GamificationPage,
    UserList, SettingsPage,
  },
  setup() {
    const data = ref(mockData);

    // Simple Router State
    const currentPage = ref('landing');
    // pages: landing | login | register | dashboard | instructor | student |
    //        quizzes | quiz-creator | question-bank | users | analytics |
    //        gamification | settings | quiz-lobby | quiz-run | results
    const darkMode = ref(localStorage.getItem('theme') === 'dark');
    const mobileSidebarOpen = ref(false);
    
    // Payment State
    const selectedPlan = ref(null);

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      if (darkMode.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    onMounted(() => {
      if (darkMode.value) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    });

    const navigate = (page, params = null) => {
      currentPage.value = page;
      mobileSidebarOpen.value = false;
      if (params?.plan) {
        selectedPlan.value = params.plan;
      }
      window.location.hash = page;
      window.scrollTo(0, 0);
    };

    // Determine which dashboard to show when 'dashboard' is requested
    const resolvedDashboard = computed(() => {
      if (currentPage.value === 'dashboard') {
        const role = data.value.currentUser.role;
        if (role === 'admin') return 'AdminDashboard';
        if (role === 'instructor') return 'InstructorDashboard';
        return 'StudentDashboard';
      }
      return null;
    });

    const pageTitle = computed(() => {
      const map = {
        'dashboard':      'Dashboard',
        'instructor':     'Dashboard',
        'student':        'My Learning',
        'quizzes':        'Quiz Library',
        'quiz-creator':   'Create Quiz',
        'question-bank':  'Question Bank',
        'users':          'User Management',
        'analytics':      'Analytics & Reports',
        'gamification':   'Gamification Hub',
        'settings':       'System Settings',
        'results':        'Quiz Results',
      };
      return map[currentPage.value] || 'QuizForge';
    });

    const isPublicPage  = computed(() => ['landing', 'login', 'register', 'pricing', 'checkout'].includes(currentPage.value));
    const isPlayerPage  = computed(() => ['quiz-lobby', 'quiz-run', 'results'].includes(currentPage.value));

    return {
      data, currentPage, darkMode, toggleDarkMode, navigate, mobileSidebarOpen,
      resolvedDashboard, pageTitle, isPublicPage, isPlayerPage, Icons, selectedPlan
    };
  },
  template: `
    <div class="min-h-screen transition-colors duration-300 flex flex-col">

      <!-- Public Pages (Landing, Auth, Pricing, Checkout) -->
      <template v-if="isPublicPage">
        <LandingPage   v-if="currentPage === 'landing'"  :data="data" :darkMode="darkMode" @toggle-theme="toggleDarkMode" @navigate="navigate" />
        <LoginPage     v-if="currentPage === 'login'"    :data="data" :darkMode="darkMode" @toggle-theme="toggleDarkMode" @navigate="navigate" />
        <RegisterPage  v-if="currentPage === 'register'" :data="data" :darkMode="darkMode" @toggle-theme="toggleDarkMode" @navigate="navigate" />
        <PricingPage   v-if="currentPage === 'pricing'"  :data="data" :darkMode="darkMode" @toggle-theme="toggleDarkMode" @navigate="navigate" />
        <CheckoutPage  v-if="currentPage === 'checkout'" :data="data" :darkMode="darkMode" :selectedPlan="selectedPlan" @toggle-theme="toggleDarkMode" @navigate="navigate" />
      </template>

      <!-- Quiz Player / Results Mode (Immersive, no sidebar) -->
      <template v-else-if="isPlayerPage">
        <QuizLobby
          v-if="currentPage === 'quiz-lobby'"
          :data="data" :darkMode="darkMode" @toggle-theme="toggleDarkMode" @navigate="navigate" />
        <QuizPlayer
          v-if="currentPage === 'quiz-run'"
          :data="data" :darkMode="darkMode" @toggle-theme="toggleDarkMode" @navigate="navigate" />
        <QuizResultsPage
          v-if="currentPage === 'results'"
          :data="data" :darkMode="darkMode" @toggle-theme="toggleDarkMode" @navigate="navigate" />
      </template>

      <!-- Authenticated App Layout -->
      <div v-else class="flex h-screen overflow-hidden">

        <!-- Mobile Sidebar Overlay -->
        <div v-if="mobileSidebarOpen" class="sidebar-overlay lg:hidden" @click="mobileSidebarOpen = false"></div>

        <!-- Sidebar -->
        <div :class="['fixed lg:static inset-y-0 left-0 z-50 transform lg:transform-none transition-transform duration-300', mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full']">
          <AppSidebar
            :currentPage="currentPage"
            :currentUser="data.currentUser"
            :darkMode="darkMode"
            @navigate="navigate"
            @toggle-dark="toggleDarkMode"
          />
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50 dark:bg-black relative">
          <!-- Background Mesh -->
          <div class="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none"></div>

          <AppTopbar
            :currentUser="data.currentUser"
            :notifications="data.notifications"
            :pageTitle="pageTitle"
            @navigate="navigate"
            @toggle-mobile-sidebar="mobileSidebarOpen = true"
          />

          <main class="flex-1 overflow-y-auto relative z-10 scroll-smooth pb-12">
            <Transition name="page" mode="out-in">
              <div :key="currentPage" class="h-full">

                <!-- Dashboards -->
                <AdminDashboard      v-if="resolvedDashboard === 'AdminDashboard'"      :data="data" @navigate="navigate" />
                <InstructorDashboard v-if="resolvedDashboard === 'InstructorDashboard'" :data="data" @navigate="navigate" />
                <StudentDashboard    v-if="resolvedDashboard === 'StudentDashboard'"    :data="data" @navigate="navigate" />
                <StudentDashboard    v-if="currentPage === 'student'"                   :data="data" @navigate="navigate" />
                <InstructorDashboard v-if="currentPage === 'instructor'"                :data="data" @navigate="navigate" />

                <!-- Quiz Pages -->
                <QuizList      v-if="currentPage === 'quizzes'"       :data="data" @navigate="navigate" />
                <QuizCreator   v-if="currentPage === 'quiz-creator'"  :data="data" @navigate="navigate" />
                <QuestionBank  v-if="currentPage === 'question-bank'" :data="data" @navigate="navigate" />

                <!-- Analytics, Gamification -->
                <AnalyticsDashboard v-if="currentPage === 'analytics'"     :data="data" @navigate="navigate" />
                <GamificationPage   v-if="currentPage === 'gamification'"  :data="data" @navigate="navigate" />

                <!-- Admin -->
                <UserList     v-if="currentPage === 'users'"    :data="data" @navigate="navigate" />
                <SettingsPage v-if="currentPage === 'settings'" :data="data" @navigate="navigate" />

              </div>
            </Transition>
          </main>
        </div>
      </div>

      <!-- Dev Navigation Menu (Fixed Top Navbar) -->
      <div class="fixed top-0 left-0 w-full h-12 z-[10000] bg-slate-900 border-b border-indigo-500/30 px-4 flex items-center justify-between shadow-md">
        <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider hidden md:block whitespace-nowrap">
          Dev Menu
        </div>
        <div class="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto">
          <button @click="navigate('landing')" class="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700 whitespace-nowrap">Landing</button>
          <button @click="navigate('pricing')" class="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700 whitespace-nowrap">Pricing</button>
          <button @click="navigate('login')" class="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700 whitespace-nowrap">Login/Reg</button>
          <button @click="navigate('student')" class="px-2 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs rounded hover:bg-indigo-500/40 whitespace-nowrap">Student Dash</button>
          <button @click="navigate('instructor')" class="px-2 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs rounded hover:bg-violet-500/40 whitespace-nowrap">Educator Dash</button>
          <button @click="navigate('quiz-lobby')" class="px-2 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs rounded hover:bg-pink-500/40 whitespace-nowrap">Quiz Lobby</button>
          <button @click="navigate('quiz-run')" class="px-2 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs rounded hover:bg-pink-500/40 whitespace-nowrap">Quiz Player</button>
          <button @click="navigate('results')" class="px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/30 text-xs rounded hover:bg-green-500/40 whitespace-nowrap">Results</button>
          <button @click="navigate('gamification')" class="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs rounded hover:bg-amber-500/40 whitespace-nowrap">Gamification</button>
        </div>
      </div>

    </div>
  `,
};

// Also import LandingPage and mount the app
import { LandingPage } from './pages/LandingPage.js';
App.components.LandingPage = LandingPage;

// Initialize Vue App
const vueApp = createApp(App);
vueApp.mount('#app');
