// ============================================================
// QuizForge — Auth Pages
// ============================================================
import { Icons } from '../icons.js';

export const LoginPage = {
  name: 'LoginPage',
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref } = Vue;
    const loading = ref(false);
    
    const handleLogin = (e) => {
      e.preventDefault();
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        emit('navigate', 'dashboard');
      }, 1500);
    };

    return { loading, handleLogin, Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="flex min-h-screen bg-slate-50 dark:bg-black overflow-hidden transition-colors duration-300">
      <!-- Left Panel (Visual) -->
      <div class="hidden lg:flex w-1/2 relative bg-indigo-900 flex-col justify-between p-12 overflow-hidden">
        <div class="absolute inset-0 bg-mesh-gradient opacity-60"></div>
        
        <!-- Animated Elements -->
        <div class="absolute top-1/4 -right-20 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style="animation-delay: 2s"></div>
        
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">Q</div>
          <span class="font-heading font-bold text-2xl text-white">QuizForge</span>
        </div>

        <div class="relative z-10 max-w-md">
          <h1 class="text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-6">
            The intelligent way to assess and learn.
          </h1>
          
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xl border border-white/20">🧠</div>
              <div>
                <h3 class="font-semibold text-white text-lg">AI Adaptive Engine</h3>
                <p class="text-indigo-200 mt-1">Questions adjust to student performance in real-time.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xl border border-white/20">🛡️</div>
              <div>
                <h3 class="font-semibold text-white text-lg">Advanced Proctoring</h3>
                <p class="text-indigo-200 mt-1">Secure assessments with webcam and tab-switch monitoring.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xl border border-white/20">🏆</div>
              <div>
                <h3 class="font-semibold text-white text-lg">Gamified Learning</h3>
                <p class="text-indigo-200 mt-1">Keep students engaged with leaderboards, badges, and streaks.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative z-10 text-indigo-300 text-sm">
          &copy; 2026 QuizForge Inc. All rights reserved.
        </div>
      </div>

      <!-- Right Panel (Form) -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div class="w-full max-w-md">
          
          <!-- Mobile Logo -->
          <div class="flex lg:hidden items-center gap-3 justify-center mb-10">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">Q</div>
            <span class="font-heading font-bold text-2xl gradient-text">QuizForge</span>
          </div>

          <div class="glass p-8 sm:p-10 rounded-2xl border border-indigo-500/20 shadow-2xl relative">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
            <p class="text-slate-500 dark:text-slate-400 mb-8">Enter your credentials to access your account.</p>

            <form @submit="handleLogin" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>
                  </span>
                  <input type="email" required placeholder="name@school.edu" class="form-input pl-10" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </span>
                  <input type="password" required placeholder="••••••••" class="form-input pl-10" />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 w-4 h-4" />
                  <span class="text-sm text-slate-400">Remember me</span>
                </label>
                <a href="#" class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>

              <button type="submit" :disabled="loading" class="btn-primary w-full py-3 rounded-xl font-semibold text-white flex justify-center items-center">
                <span v-if="!loading">Sign In</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Authenticating...
                </span>
              </button>
            </form>

            <div class="mt-8 text-center text-sm text-slate-400">
              <span class="px-2 bg-slate-800/80 relative z-10">Or continue with</span>
              <div class="h-px bg-slate-700/50 absolute left-8 right-8 top-[330px] sm:top-[338px] -z-0"></div>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-6">
              <button class="flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/><path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/></svg>
                Google
              </button>
              <button class="flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                <svg class="w-5 h-5" viewBox="0 0 21 21"><path fill="#f25022" d="M0 0h10v10H0z"/><path fill="#7fba00" d="M11 0h10v10H11z"/><path fill="#00a4ef" d="M0 11h10v10H0z"/><path fill="#ffb900" d="M11 11h10v10H11z"/></svg>
                Microsoft
              </button>
            </div>

            <p class="mt-8 text-center text-sm text-slate-400">
              Don't have an account? 
              <a href="#" @click.prevent="navigate('register')" class="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Register</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
};

export const RegisterPage = {
  name: 'RegisterPage',
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref } = Vue;
    const step = ref(1);
    const loading = ref(false);
    
    const nextStep = () => { if (step.value < 3) step.value++; };
    const prevStep = () => { if (step.value > 1) step.value--; };
    
    const handleRegister = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        emit('navigate', 'dashboard');
      }, 1500);
    };

    return { step, nextStep, prevStep, handleRegister, loading, Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      <div class="absolute inset-0 bg-mesh-gradient opacity-40"></div>
      
      <div class="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div class="flex items-center gap-3 justify-center mb-8">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">Q</div>
          <span class="font-heading font-bold text-2xl text-white">QuizForge</span>
        </div>
        
        <!-- Progress Steps -->
        <div class="mb-8 px-8">
          <div class="flex items-center justify-between relative">
            <div class="absolute left-0 top-1/2 w-full h-1 bg-slate-700 -z-10 -translate-y-1/2 rounded-full"></div>
            <div class="absolute left-0 top-1/2 h-1 bg-indigo-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-300" :style="{ width: ((step-1)/2)*100 + '%' }"></div>
            
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors', step >= 1 ? 'bg-indigo-500 text-white shadow-glow-sm' : 'bg-slate-800 text-slate-400 border border-slate-700']">1</div>
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors', step >= 2 ? 'bg-indigo-500 text-white shadow-glow-sm' : 'bg-slate-800 text-slate-400 border border-slate-700']">2</div>
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors', step >= 3 ? 'bg-indigo-500 text-white shadow-glow-sm' : 'bg-slate-800 text-slate-400 border border-slate-700']">3</div>
          </div>
          <div class="flex justify-between mt-2 text-xs font-medium text-slate-400 px-1">
            <span>Role</span>
            <span>Details</span>
            <span>Profile</span>
          </div>
        </div>

        <div class="glass p-8 rounded-2xl border border-indigo-500/20 shadow-2xl">
          
          <!-- Step 1: Role -->
          <div v-show="step === 1" class="space-y-4">
            <h2 class="text-xl font-bold text-white text-center mb-6">How will you use QuizForge?</h2>
            
            <label class="block cursor-pointer card-hover border-2 border-indigo-500 bg-indigo-500/10 rounded-xl p-4 flex items-center gap-4 transition-all">
              <input type="radio" name="role" value="student" checked class="hidden" />
              <div class="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-2xl">🎓</div>
              <div>
                <h3 class="text-white font-semibold">I'm a Student</h3>
                <p class="text-sm text-slate-400">Take quizzes and track my progress</p>
              </div>
            </label>
            
            <label class="block cursor-pointer card-hover border-2 border-transparent bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 flex items-center gap-4 transition-all">
              <input type="radio" name="role" value="instructor" class="hidden" />
              <div class="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-2xl">👨‍🏫</div>
              <div>
                <h3 class="text-white font-semibold">I'm an Instructor</h3>
                <p class="text-sm text-slate-400">Create quizzes and manage classes</p>
              </div>
            </label>
            
            <label class="block cursor-pointer card-hover border-2 border-transparent bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 flex items-center gap-4 transition-all">
              <input type="radio" name="role" value="admin" class="hidden" />
              <div class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">🏢</div>
              <div>
                <h3 class="text-white font-semibold">I'm an Administrator</h3>
                <p class="text-sm text-slate-400">Manage institution and system settings</p>
              </div>
            </label>
            
            <div class="pt-4 flex justify-end">
              <button @click="nextStep" class="btn-primary px-8 py-2.5 rounded-xl font-medium text-white">Next Step</button>
            </div>
          </div>

          <!-- Step 2: Details -->
          <div v-show="step === 2" class="space-y-4">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white text-center mb-6">Create your account</h2>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input type="text" placeholder="John Doe" class="form-input" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <input type="email" placeholder="name@school.edu" class="form-input" />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <input type="password" placeholder="••••••••" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm</label>
                <input type="password" placeholder="••••••••" class="form-input" />
              </div>
            </div>
            
            <div class="pt-4 flex justify-between">
              <button @click="prevStep" class="px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-white/5 transition-colors">Back</button>
              <button @click="nextStep" class="btn-primary px-8 py-2.5 rounded-xl font-medium text-white">Next Step</button>
            </div>
          </div>

          <!-- Step 3: Profile Setup -->
          <div v-show="step === 3" class="space-y-4">
            <h2 class="text-xl font-bold text-white text-center mb-6">Complete your profile</h2>
            
            <div class="flex justify-center mb-6">
              <div class="relative">
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-4xl text-white font-bold border-4 border-slate-800">
                  JD
                </div>
                <button class="absolute bottom-0 right-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-600 transition-colors border-2 border-slate-800" v-html="Icons.camera"></button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Institution / School (Optional)</label>
              <input type="text" placeholder="e.g. State University" class="form-input" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Subjects of Interest</label>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm cursor-pointer">Computer Science</span>
                <span class="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-sm cursor-pointer hover:bg-slate-700">Mathematics</span>
                <span class="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-sm cursor-pointer hover:bg-slate-700">Physics</span>
                <span class="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-sm cursor-pointer hover:bg-slate-700">Biology</span>
                <span class="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-sm cursor-pointer hover:bg-slate-700">+ Add</span>
              </div>
            </div>
            
            <div class="pt-6 flex justify-between">
              <button @click="prevStep" class="px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-white/5 transition-colors">Back</button>
              <button @click="handleRegister" :disabled="loading" class="btn-primary px-8 py-2.5 rounded-xl font-medium text-white flex items-center justify-center">
                <span v-if="!loading">Create Account</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </span>
              </button>
            </div>
          </div>

        </div>
        
        <p class="mt-6 text-center text-sm text-slate-400">
          Already have an account? 
          <a href="#" @click.prevent="navigate('login')" class="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</a>
        </p>
      </div>
    </div>
  `
};
