import { Icons } from '../icons.js';

export const PricingPage = {
  name: 'PricingPage',
  props: ['data', 'darkMode'],
  emits: ['navigate', 'toggle-theme'],
  setup(props, { emit }) {
    const pricingTiers = [
      {
        name: 'Basic',
        price: 'Free',
        period: 'forever',
        description: 'Perfect for students starting their learning journey.',
        features: ['Access to 1,000+ public quizzes', 'Basic progress tracking', 'Standard support'],
        buttonText: 'Get Started',
        buttonClass: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700',
        isPopular: false
      },
      {
        name: 'Silver',
        price: '$9',
        period: 'per month',
        description: 'Ideal for consistent learners wanting more depth.',
        features: ['Everything in Basic', 'Access to 50+ Premium Courses', 'Detailed analytics dashboard', 'Ad-free experience'],
        buttonText: 'Upgrade to Silver',
        buttonClass: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60',
        isPopular: false
      },
      {
        name: 'Gold',
        price: '$19',
        period: 'per month',
        description: 'Our most popular plan for dedicated learners.',
        features: ['Everything in Silver', 'Unlimited Premium Courses', 'AI-Powered Study Guides', 'Priority 24/7 support', 'Custom quiz generation'],
        buttonText: 'Get Gold',
        buttonClass: 'btn-primary text-white shadow-glow',
        isPopular: true
      },
      {
        name: 'Premium',
        price: '$49',
        period: 'per month',
        description: 'For educators and power users.',
        features: ['Everything in Gold', 'Instructor Dashboard access', 'Bulk user management', 'White-labeling options', 'Dedicated success manager'],
        buttonText: 'Contact Sales',
        buttonClass: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100',
        isPopular: false
      }
    ];

    const premiumCourses = [
      { id: 101, title: 'Mastering Advanced Algorithms', subject: 'Computer Science', tier: 'Gold', icon: '💻' },
      { id: 102, title: 'Quantum Physics Deep Dive', subject: 'Physics', tier: 'Silver', icon: '⚛️' },
      { id: 103, title: 'Complete Spanish Fluency', subject: 'Languages', tier: 'Silver', icon: '🌍' },
      { id: 104, title: 'AI & Machine Learning Bootcamp', subject: 'Data Science', tier: 'Gold', icon: '🤖' }
    ];

    return { Icons, pricingTiers, premiumCourses, navigate: (page, params) => emit('navigate', page, params), toggleTheme: () => emit('toggle-theme') };
  },
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden selection:bg-indigo-500/30">
      
      <!-- Navbar -->
      <nav class="fixed top-12 w-full z-50 glass card-pill border-t-4 border-white/5 px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3 cursor-pointer" @click="navigate('landing')">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 dark:text-white font-bold text-lg" style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">Q</div>
          <span class="font-heading font-bold text-2xl text-slate-900 dark:text-white">QuizForge</span>
        </div>
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#" @click.prevent="navigate('landing')" class="hover:text-slate-900 dark:text-white transition-colors">Public Library</a>
          <a href="#" class="hover:text-slate-900 dark:text-white transition-colors">For Schools</a>
          <a href="#" class="text-slate-900 dark:text-white font-bold">Pricing</a>
        </div>
        <div class="flex gap-4 items-center">
          <button @click="toggleTheme" class="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-200 dark:bg-slate-800" title="Toggle Theme">
            <span class="w-5 h-5 block" v-html="darkMode ? Icons.sun : Icons.moon"></span>
          </button>
          <button @click="navigate('login')" class="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors">Educator Login</button>
          <button @click="navigate('register')" class="btn-primary px-5 py-2 rounded-full text-sm font-semibold text-white shadow-glow-sm">Create Account</button>
        </div>
      </nav>

      <!-- Pricing Hero -->
      <header class="pt-32 pb-32 relative overflow-hidden text-center bg-slate-50 dark:bg-slate-950">
        <div class="absolute inset-0 bg-mesh-gradient opacity-40"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600 rounded-full filter blur-[150px] opacity-20 pointer-events-none"></div>
        
        <div class="relative z-10 container mx-auto px-6">
          <h1 class="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 dark:text-white mb-6">
            Simple, transparent <span class="gradient-text">pricing.</span>
          </h1>
          <p class="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Choose the perfect plan for your learning journey. Unlock premium courses and advanced features to accelerate your growth.
          </p>
        </div>

        <!-- Wavy SVG Divider -->
        <div class="wavy-divider-bottom">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
          </svg>
        </div>
      </header>

      <!-- Pricing Tiers -->
      <section class="py-16 relative z-20 bg-white dark:bg-slate-900">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto -mt-32">
            
            <div v-for="(tier, idx) in pricingTiers" :key="idx" 
                 :class="['relative glass card-pill p-8 flex flex-col transition-transform duration-300 hover:-translate-y-2', 
                          tier.isPopular ? 'border-2 border-indigo-500 transform scale-105 shadow-glow z-10' : 'border border-slate-200 dark:border-slate-800']">
              
              <div v-if="tier.isPopular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>

              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">{{ tier.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 h-10">{{ tier.description }}</p>
              
              <div class="mb-6">
                <span class="text-4xl font-extrabold text-slate-900 dark:text-white">{{ tier.price }}</span>
                <span v-if="tier.price !== 'Free'" class="text-slate-500 dark:text-slate-400">/mo</span>
              </div>

              <button @click="navigate('checkout', { plan: tier })" :class="['w-full py-3 rounded-pill font-bold transition-all btn-pill mb-8', tier.buttonClass]">
                {{ tier.buttonText }}
              </button>

              <ul class="flex flex-col gap-4 flex-1">
                <li v-for="(feature, fIdx) in tier.features" :key="fIdx" class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span class="text-indigo-500 mt-0.5" v-html="Icons.check"></span>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <!-- Premium Courses Preview -->
      <section class="py-20 bg-slate-50 dark:bg-slate-950">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">Unlock Premium Courses</h2>
            <p class="text-slate-500 dark:text-slate-400">Upgrade to Silver or Gold to access expertly crafted premium courses.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div v-for="course in premiumCourses" :key="course.id" class="glass card-pill p-6 border-t-4" style="border-top-color: #8b5cf6;">
              <div class="text-4xl mb-4">{{ course.icon }}</div>
              <div class="badge mb-3" :class="course.tier === 'Gold' ? 'badge-warning' : 'badge-neutral'">{{ course.tier }} Required</div>
              <h4 class="font-bold text-lg text-slate-900 dark:text-white mb-2">{{ course.title }}</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ course.subject }}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  `
};
