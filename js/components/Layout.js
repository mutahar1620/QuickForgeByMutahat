// ============================================================
// QuizForge — Sidebar Navigation Component
// ============================================================
import { Icons } from '../icons.js';

export const AppSidebar = {
  name: 'AppSidebar',
  props: ['currentPage', 'currentUser', 'darkMode'],
  emits: ['navigate', 'toggle-dark'],
  setup(props, { emit }) {
    const { ref, computed } = Vue;

    const collapsed = ref(false);

    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['admin'] },
      { id: 'instructor', label: 'Dashboard', icon: 'dashboard', roles: ['instructor'] },
      { id: 'student', label: 'My Learning', icon: 'dashboard', roles: ['student'] },
      { id: 'quizzes', label: 'Quizzes', icon: 'quiz', roles: ['admin', 'instructor'] },
      { id: 'quiz-creator', label: 'Create Quiz', icon: 'plus', roles: ['admin', 'instructor'] },
      { id: 'question-bank', label: 'Question Bank', icon: 'bank', roles: ['admin', 'instructor'] },
      { id: 'users', label: 'Users', icon: 'users', roles: ['admin'] },
      { id: 'analytics', label: 'Analytics', icon: 'analytics', roles: ['admin', 'instructor'] },
      { id: 'gamification', label: 'Gamification', icon: 'gamification', roles: ['admin', 'instructor', 'student'] },
      { id: 'settings', label: 'Settings', icon: 'settings', roles: ['admin'] },
    ];

    const visibleItems = computed(() =>
      navItems.filter(item => item.roles.includes(props.currentUser?.role || 'student'))
    );

    const navigate = (page) => emit('navigate', page);
    const toggleDark = () => emit('toggle-dark');
    const toggleCollapse = () => { collapsed.value = !collapsed.value; };

    const roleColor = computed(() => {
      const r = props.currentUser?.role;
      if (r === 'admin') return 'from-red-500 to-orange-500';
      if (r === 'instructor') return 'from-violet-500 to-indigo-500';
      return 'from-indigo-500 to-blue-500';
    });

    const roleLabel = computed(() => {
      const r = props.currentUser?.role;
      if (r === 'admin') return 'Administrator';
      if (r === 'instructor') return 'Instructor';
      return 'Student';
    });

    return { navItems, visibleItems, navigate, toggleDark, collapsed, toggleCollapse, roleColor, roleLabel, Icons };
  },
  template: `
    <aside :class="['sidebar-desktop flex flex-col h-[calc(100vh-3rem)] sticky top-12 transition-all duration-300 z-50 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800', collapsed ? 'w-16' : 'w-64']">

      <!-- Logo -->
      <div class="flex items-center justify-between px-4 py-5 border-b" style="border-color: rgba(99,102,241,0.12);">
        <div v-if="!collapsed" class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">Q</div>
          <span class="font-heading font-bold text-lg gradient-text">QuizForge</span>
        </div>
        <div v-else class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm mx-auto"
          style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">Q</div>
        <button @click="toggleCollapse" v-if="!collapsed"
          class="text-slate-500 hover:text-slate-300 transition-colors ml-auto">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
        </button>
        <button @click="toggleCollapse" v-else class="text-slate-500 hover:text-slate-300 transition-colors mx-auto mt-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
        </button>
      </div>

      <!-- User Profile Mini -->
      <div v-if="!collapsed" class="px-4 py-3 mx-3 my-3 rounded-xl" style="background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.12);">
        <div class="flex items-center gap-2.5">
          <div :class="'w-9 h-9 rounded-lg bg-gradient-to-br ' + roleColor + ' flex items-center justify-center text-white font-bold text-sm flex-shrink-0'">
            {{ currentUser?.name?.charAt(0) || 'U' }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-200 truncate">{{ currentUser?.name }}</p>
            <p class="text-xs text-slate-500">{{ roleLabel }}</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" style="box-shadow: 0 0 6px rgba(34,197,94,0.6);"></div>
        </div>
        <!-- XP Bar for students -->
        <div v-if="currentUser?.role === 'student'" class="mt-2">
          <div class="flex justify-between text-xs text-slate-500 mb-1">
            <span>Level {{ currentUser?.level }}</span>
            <span>{{ currentUser?.xp }} / 5000 XP</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="'width: ' + (currentUser?.xp / 5000 * 100) + '%'"></div>
          </div>
        </div>
      </div>
      <div v-else class="flex justify-center py-2">
        <div :class="'w-9 h-9 rounded-lg bg-gradient-to-br ' + roleColor + ' flex items-center justify-center text-white font-bold text-sm'">
          {{ currentUser?.name?.charAt(0) || 'U' }}
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
        <template v-for="item in visibleItems" :key="item.id">
          <button @click="navigate(item.id)"
            :class="['nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 text-left',
              currentPage === item.id ? 'active' : 'text-slate-400']">
            <span class="w-5 h-5 flex-shrink-0" v-html="Icons[item.icon]"></span>
            <span v-if="!collapsed" class="font-medium">{{ item.label }}</span>
          </button>
        </template>
      </nav>

      <!-- Bottom Actions -->
      <div class="px-3 py-4 border-t space-y-1" style="border-color: rgba(99,102,241,0.12);">
        <!-- Dark mode toggle -->
        <button @click="toggleDark"
          class="nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400">
          <span class="w-5 h-5 flex-shrink-0" v-html="darkMode ? Icons.sun : Icons.moon"></span>
          <span v-if="!collapsed" class="font-medium">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
        <!-- Logout -->
        <button @click="navigate('landing')"
          class="nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-red-400">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
          <span v-if="!collapsed" class="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  `
};

// ============================================================
// Top Navigation Bar
// ============================================================
export const AppTopbar = {
  name: 'AppTopbar',
  props: ['currentUser', 'notifications', 'pageTitle'],
  emits: ['navigate', 'toggle-mobile-sidebar'],
  setup(props, { emit }) {
    const { ref, computed } = Vue;
    const showNotifications = ref(false);
    const showProfile = ref(false);
    const searchQuery = ref('');

    const unreadCount = computed(() =>
      (props.notifications || []).filter(n => !n.read).length
    );

    const navigate = (page) => emit('navigate', page);

    // Close dropdowns on outside click
    const closeAll = () => {
      showNotifications.value = false;
      showProfile.value = false;
    };

    return { showNotifications, showProfile, searchQuery, unreadCount, navigate, closeAll, Icons };
  },
  template: `
    <header class="sticky top-12 z-40 flex items-center gap-4 px-4 md:px-6 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">

      <!-- Mobile menu button -->
      <button @click="$emit('toggle-mobile-sidebar')"
        class="mobile-nav-btn text-slate-400 hover:text-white transition-colors p-1">
        <span class="w-5 h-5 block" v-html="Icons.menu"></span>
      </button>

      <!-- Page Title -->
      <div class="flex-1">
        <h1 class="font-heading font-semibold text-slate-100 text-base md:text-lg">{{ pageTitle }}</h1>
      </div>

      <!-- Search (desktop) -->
      <div class="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 text-sm"
        style="background: rgba(30,41,59,0.6); border: 1px solid rgba(99,102,241,0.15); min-width: 220px;">
        <span class="w-4 h-4 flex-shrink-0" v-html="Icons.search"></span>
        <input v-model="searchQuery" type="text" placeholder="Search anything..." class="bg-transparent outline-none w-full text-slate-300 placeholder-slate-500 text-sm" />
        <kbd class="text-xs text-slate-600 font-mono">⌘K</kbd>
      </div>

      <!-- Notifications -->
      <div class="relative">
        <button @click="showNotifications = !showNotifications; showProfile = false"
          class="relative text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
          <span class="w-5 h-5 block" v-html="Icons.bell"></span>
          <span v-if="unreadCount > 0" class="notif-dot"></span>
        </button>

        <!-- Notifications Dropdown -->
        <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-80 glass rounded-2xl shadow-card overflow-hidden"
          style="border: 1px solid rgba(99,102,241,0.2);">
          <div class="flex items-center justify-between px-4 py-3 border-b" style="border-color: rgba(99,102,241,0.12);">
            <h3 class="font-semibold text-sm text-slate-200">Notifications</h3>
            <span class="badge badge-info">{{ unreadCount }} new</span>
          </div>
          <div class="max-h-72 overflow-y-auto divide-y" style="divide-color: rgba(99,102,241,0.08);">
            <div v-for="notif in (notifications || [])" :key="notif.id"
              :class="['flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors', !notif.read ? 'bg-indigo-500/5' : '']">
              <span class="text-lg flex-shrink-0">{{ notif.icon }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-300 leading-snug">{{ notif.message }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ notif.time }}</p>
              </div>
              <div v-if="!notif.read" class="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 mt-1"></div>
            </div>
          </div>
          <div class="px-4 py-3 border-t text-center" style="border-color: rgba(99,102,241,0.12);">
            <button class="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View All Notifications</button>
          </div>
        </div>
      </div>

      <!-- Profile Menu -->
      <div class="relative">
        <button @click="showProfile = !showProfile; showNotifications = false"
          class="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
            {{ currentUser?.name?.charAt(0) || 'U' }}
          </div>
          <div class="hidden md:block text-left">
            <p class="text-sm font-medium text-slate-200 leading-tight">{{ currentUser?.name }}</p>
            <p class="text-xs text-slate-500 capitalize">{{ currentUser?.role }}</p>
          </div>
          <span class="w-4 h-4 text-slate-500" v-html="Icons.chevronDown"></span>
        </button>

        <!-- Profile Dropdown -->
        <div v-if="showProfile" class="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-card overflow-hidden"
          style="border: 1px solid rgba(99,102,241,0.2);">
          <div class="py-1">
            <button @click="navigate('user-profile'); showProfile=false"
              class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">My Profile</button>
            <button class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Account Settings</button>
            <button class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Help & Docs</button>
            <div class="border-t my-1" style="border-color: rgba(99,102,241,0.12);"></div>
            <button @click="navigate('landing'); showProfile=false"
              class="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">Sign Out</button>
          </div>
        </div>
      </div>
    </header>
  `
};
