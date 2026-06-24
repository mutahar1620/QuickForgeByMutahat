import { Icons } from '../icons.js';

export const LandingPage = {
  name: 'LandingPage',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, onMounted, onUnmounted } = Vue;
    
    // Add local logic to observe dark mode from the root HTML element
    const isDark = ref(document.documentElement.classList.contains('dark'));
    
    const toggleTheme = () => {
      isDark.value = !isDark.value;
      if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      // Emit event so app.js can sync if needed
      emit('toggle-dark', isDark.value);
    };
    
    const SUBJECT_COLORS = {
      Programming : 'from-violet-500 to-indigo-500',
      Biology     : 'from-emerald-500 to-teal-500',
      History     : 'from-amber-500 to-orange-500',
      Mathematics : 'from-blue-500 to-cyan-500',
      Chemistry   : 'from-rose-500 to-pink-500',
      Literature  : 'from-fuchsia-500 to-purple-500',
      Physics     : 'from-sky-500 to-blue-500',
      Geography   : 'from-green-500 to-lime-500',
      Trivia      : 'from-pink-500 to-rose-500',
      Languages   : 'from-teal-500 to-emerald-500',
    };

    const DIFFICULTY_BADGE = {
      Easy   : 'badge-success',
      Medium : 'badge-warning',
      Hard   : 'badge-danger',
    };

    const publicQuizzes = ref([
      { id: 1, title: 'JavaScript Fundamentals', subject: 'Programming', difficulty: 'Medium', questions: 10, plays: '12.4k' },
      { id: 2, title: 'Cell Biology Basics', subject: 'Biology', difficulty: 'Easy', questions: 15, plays: '8.1k' },
      { id: 3, title: 'World War II Timeline', subject: 'History', difficulty: 'Hard', questions: 20, plays: '5.2k' },
      { id: 4, title: 'Calculus I: Derivatives', subject: 'Mathematics', difficulty: 'Hard', questions: 12, plays: '4.9k' },
      { id: 5, title: 'Organic Chemistry Intro', subject: 'Chemistry', difficulty: 'Medium', questions: 15, plays: '3.1k' },
      { id: 6, title: 'Python for Beginners', subject: 'Programming', difficulty: 'Easy', questions: 20, plays: '24.5k' },
      { id: 7, title: 'Romanticism in Poetry', subject: 'Literature', difficulty: 'Medium', questions: 10, plays: '2.8k' },
      { id: 8, title: 'Newtonian Mechanics', subject: 'Physics', difficulty: 'Hard', questions: 15, plays: '6.7k' },
      { id: 9, title: 'World Capitals', subject: 'Geography', difficulty: 'Easy', questions: 25, plays: '41.2k' },
      { id: 10, title: 'React Hooks Deep Dive', subject: 'Programming', difficulty: 'Hard', questions: 10, plays: '9.3k' },
      { id: 11, title: 'Basic Anatomy', subject: 'Biology', difficulty: 'Medium', questions: 20, plays: '11.5k' },
      { id: 12, title: 'The Cold War', subject: 'History', difficulty: 'Medium', questions: 15, plays: '7.4k' },
      { id: 13, title: 'Linear Algebra', subject: 'Mathematics', difficulty: 'Hard', questions: 10, plays: '3.8k' },
      { id: 14, title: 'Periodic Table Mastery', subject: 'Chemistry', difficulty: 'Easy', questions: 30, plays: '15.9k' },
      { id: 15, title: 'Shakespeare Plays', subject: 'Literature', difficulty: 'Hard', questions: 15, plays: '4.2k' },
      { id: 16, title: 'Quantum Physics Intro', subject: 'Physics', difficulty: 'Hard', questions: 10, plays: '2.1k' },
      { id: 17, title: 'European Geography', subject: 'Geography', difficulty: 'Medium', questions: 20, plays: '18.7k' },
      { id: 18, title: 'General Pop Culture', subject: 'Trivia', difficulty: 'Easy', questions: 25, plays: '56.3k' },
      { id: 19, title: 'Spanish Vocab: Food', subject: 'Languages', difficulty: 'Easy', questions: 20, plays: '22.1k' },
      { id: 20, title: 'Data Structures in C++', subject: 'Programming', difficulty: 'Hard', questions: 15, plays: '8.8k' },
    ]);

    const playQuiz = (quizInfo) => {
      // Create a full playable quiz based on the clicked card, reusing the activeQuiz template from mockData
      const template = JSON.parse(JSON.stringify(props.data.activeQuiz));
      template.title = quizInfo.title;
      template.subject = quizInfo.subject;
      template.totalQuestions = template.questions.length; // use template's actual question count
      
      // Save it to global state so QuizPlayer can use it
      props.data.activeQuiz = template;
      
      // Also clear any previous results
      props.data.lastQuizResults = null;
      
      // Navigate to the player
      emit('navigate', 'quiz-run');
    };

    return { 
      Icons, 
      navigate: (page) => emit('navigate', page),
      publicQuizzes, SUBJECT_COLORS, DIFFICULTY_BADGE,
      playQuiz, isDark, toggleTheme
    };
  },
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden selection:bg-indigo-500/30">
      <!-- Navbar -->
      <nav class="fixed top-12 w-full z-50 glass card-pill border-t-4b border-white/5 px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 dark:text-white font-bold text-lg" style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">Q</div>
          <span class="font-heading font-bold text-2xl text-slate-900 dark:text-white">QuizForge</span>
        </div>
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#" class="text-slate-900 dark:text-white font-bold">Public Library</a>
          <a href="#" class="hover:text-slate-900 dark:text-white transition-colors">For Schools</a>
          <a href="#" @click.prevent="navigate('pricing')" class="hover:text-slate-900 dark:text-white transition-colors cursor-pointer">Pricing</a>
        </div>
        <div class="flex gap-4 items-center">
          <button @click="toggleTheme" class="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-200 dark:bg-slate-800" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <span class="w-5 h-5 block" v-html="isDark ? Icons.sun : Icons.moon"></span>
          </button>
          <button @click="navigate('login')" class="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors">Educator Login</button>
          <button @click="navigate('register')" class="btn-primary px-5 py-2 rounded-full text-sm font-semibold text-white shadow-glow-sm">Create Account</button>
        </div>
      </nav>

      <!-- Hero Header -->
      <header class="pt-32 pb-32 relative overflow-hidden text-center bg-slate-50 dark:bg-slate-950">
        <div class="absolute inset-0 bg-mesh-gradient opacity-40"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600 rounded-full filter blur-[150px] opacity-20 pointer-events-none"></div>
        
        <div class="relative z-10 container mx-auto px-6">
          <h1 class="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 dark:text-white mb-6">
            Test Your Knowledge. <span class="gradient-text">Instantly.</span>
          </h1>
          <p class="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Choose from our public library of adaptive quizzes. No sign-up required. Just click, play, and get your personalized score.
          </p>
          
          <div class="max-w-xl mx-auto relative group">
            <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
              <span v-html="Icons.search" class="w-5 h-5"></span>
            </div>
            <input type="text" placeholder="Search 10,000+ public quizzes..." 
                   class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-full pl-14 pr-4 py-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-lg text-lg" />
            <button class="absolute inset-y-2 right-2 btn-primary px-8 rounded-full font-bold text-white shadow-glow-sm">Search</button>
          </div>
        </div>

        <!-- Wavy SVG Divider -->
        <div class="wavy-divider-bottom">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
          </svg>
        </div>
      </header>

      <!-- Quiz Grid -->
      <section class="py-16 relative z-20 min-h-screen bg-white dark:bg-slate-900">
        <div class="container mx-auto px-6">
          
          <div class="flex justify-between items-end mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Trending Quizzes</h2>
            <div class="flex gap-2">
              <select class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500">
                <option>All Subjects</option>
                <option>Programming</option>
                <option>Science</option>
                <option>History</option>
              </select>
              <select class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500">
                <option>Any Difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="q in publicQuizzes" :key="q.id"
                 @click="playQuiz(q)"
                 class="glass rounded-2xl overflow-hidden card-hover flex flex-col group cursor-pointer border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40">
              
              <!-- Color Stripe -->
              <div :class="'h-2 w-full bg-gradient-to-r ' + (SUBJECT_COLORS[q.subject] || 'from-slate-500 to-slate-400')"></div>
              
              <div class="p-5 flex flex-col flex-1 relative">
                <!-- Play Overlay (shows on hover) -->
                <div class="absolute inset-0 bg-indigo-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <button class="btn-primary px-6 py-2.5 rounded-xl font-bold text-slate-900 dark:text-white shadow-glow flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
                    Play Now
                  </button>
                </div>

                <div class="flex items-start justify-between mb-3">
                  <span :class="'badge ' + DIFFICULTY_BADGE[q.difficulty]">{{ q.difficulty }}</span>
                  <div class="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    {{ q.plays }}
                  </div>
                </div>
                
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">{{ q.title }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">{{ q.subject }}</p>
                
                <div class="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    {{ q.questions }} Qs
                  </span>
                  <span class="text-indigo-400 font-semibold text-xs uppercase tracking-wider group-hover:underline">Free to Play</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-16 text-center">
            <button class="px-8 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-200 dark:border-slate-700 transition-all shadow-sm">
              Load More Quizzes
            </button>
          </div>

        </div>
      </section>

      <!-- Features Section with Purple Background -->
      <section id="features" class="py-24 relative mt-16 bg-gradient-to-br from-indigo-700 to-violet-800 dark:from-indigo-900 dark:to-black">
        <!-- Top Wave Divider -->
        <div class="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-full rotate-180">
          <svg class="relative block w-full h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path :fill="darkMode ? '#000000' : '#f8fafc'" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.17,192.4,103.53Z" class="transition-colors duration-300"></path>
          </svg>
        </div>

        <div class="container mx-auto px-6 relative z-10">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-white mb-4">Everything you need to run brilliant assessments</h2>
            <p class="text-lg text-indigo-200 font-medium">A complete toolset designed for modern educators and institutions.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white/10 dark:bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-white/20 dark:border-white/10 hover:bg-white/20 transition-colors card-hover">
              <div class="w-14 h-14 rounded-xl bg-white text-indigo-600 flex items-center justify-center text-2xl mb-6 shadow-glow-sm font-bold">🧠</div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Adaptive Engine</h3>
              <p class="text-indigo-100 leading-relaxed font-medium">Questions automatically scale in difficulty based on student responses using Item Response Theory.</p>
            </div>
            <div class="bg-white/10 dark:bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-white/20 dark:border-white/10 hover:bg-white/20 transition-colors card-hover">
              <div class="w-14 h-14 rounded-xl bg-white text-violet-600 flex items-center justify-center text-2xl mb-6 shadow-glow-sm font-bold">📊</div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Deep Analytics</h3>
              <p class="text-indigo-100 leading-relaxed font-medium">Get item analysis, score distributions, and individual learning trajectories to identify weak areas.</p>
            </div>
            <div class="bg-white/10 dark:bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-white/20 dark:border-white/10 hover:bg-white/20 transition-colors card-hover">
              <div class="w-14 h-14 rounded-xl bg-white text-pink-600 flex items-center justify-center text-2xl mb-6 shadow-glow-sm font-bold">🎮</div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Gamification Built-in</h3>
              <p class="text-indigo-100 leading-relaxed font-medium">Keep students coming back with live leaderboards, collectible badges, streaks, and challenge modes.</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Footer -->
      <footer class="bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 py-12 transition-colors duration-300">
        <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center gap-3 mb-4 md:mb-0">
          <div class="text-slate-500 text-sm">
            &copy; 2026 QuizForge Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `
};
