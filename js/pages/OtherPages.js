import { Icons } from '../icons.js';

export const QuizList = {
  name: 'QuizList',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, computed } = Vue;
    const searchQuery = ref('');
    const statusFilter = ref('all');

    const filteredQuizzes = computed(() => {
      return props.data.recentQuizzes.filter(q => {
        const matchSearch = q.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || q.subject.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchStatus = statusFilter.value === 'all' || q.status === statusFilter.value;
        return matchSearch && matchStatus;
      });
    });

    return { Icons, navigate: (page) => emit('navigate', page), searchQuery, statusFilter, filteredQuizzes };
  },
  template: `
    <div class="p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Quiz Management</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Create, manage, and publish your quizzes.</p>
        </div>
        <button @click="navigate('quiz-creator')" class="btn-primary px-6 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white shadow-glow flex items-center gap-2">
          <span v-html="Icons.plus" class="w-5 h-5"></span> Create Quiz
        </button>
      </div>

      <div class="glass p-4 rounded-xl border border-indigo-500/10 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500" v-html="Icons.search"></span>
          <input v-model="searchQuery" type="text" placeholder="Search quizzes..." class="form-input pl-10" />
        </div>
        <select v-model="statusFilter" class="form-input sm:w-48">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="quiz in filteredQuizzes" :key="quiz.id" class="glass rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden card-hover flex flex-col">
          <!-- Top color stripe based on subject -->
          <div :class="['h-2 w-full', quiz.subject==='Programming'?'bg-blue-500':quiz.subject==='Biology'?'bg-green-500':quiz.subject==='History'?'bg-amber-500':'bg-indigo-500']"></div>
          
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-3">
              <span :class="['badge', quiz.status === 'active' ? 'badge-success' : quiz.status === 'draft' ? 'badge-warning' : 'badge-info']">{{ quiz.status }}</span>
              <span :class="['text-xs font-bold uppercase', quiz.difficulty === 'hard' ? 'text-red-400' : quiz.difficulty === 'medium' ? 'text-amber-400' : 'text-green-400']">{{ quiz.difficulty }}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">{{ quiz.title }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">{{ quiz.subject }}</p>
            
            <div class="grid grid-cols-2 gap-y-4 mb-4 mt-auto">
              <div>
                <p class="text-xs text-slate-500">Questions</p>
                <p class="font-semibold text-slate-900 dark:text-white">{{ quiz.questions }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Students</p>
                <p class="font-semibold text-slate-900 dark:text-white">{{ quiz.students }}</p>
              </div>
              <div class="col-span-2">
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-500">Avg Score</span>
                  <span class="font-medium text-slate-600 dark:text-slate-300">{{ quiz.avgScore || 0 }}%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-indigo-500 rounded-full" :style="{width: (quiz.avgScore||0) + '%'}"></div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700/50 mt-2">
              <p class="text-xs text-slate-500">{{ quiz.createdAt }}</p>
              <div class="flex gap-2">
                <button class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 transition-colors" title="Edit" v-html="Icons.edit"></button>
                <button @click="navigate('quiz-run')" class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-400 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 transition-colors" title="Preview" v-html="Icons.eye"></button>
                <button @click="navigate('results')" class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-green-400 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 transition-colors" title="Results" v-html="Icons.chart"></button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredQuizzes.length === 0" class="col-span-full py-12 text-center">
          <div class="text-slate-600 mb-4 flex justify-center"><span v-html="Icons.search" class="w-12 h-12"></span></div>
          <h3 class="text-lg font-medium text-slate-900 dark:text-white">No quizzes found</h3>
          <p class="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
        </div>
      </div>
    </div>
  `
};

export const QuizCreator = {
  name: 'QuizCreator',
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref } = Vue;
    const step = ref(1);
    
    return { Icons, navigate: (page) => emit('navigate', page), step };
  },
  template: `
    <div class="p-6 h-full flex flex-col">
      <!-- Header & Steps -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-4">
            <button @click="navigate('quizzes')" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:text-slate-900 dark:text-white transition-colors">
              <span v-html="Icons.chevronRight" class="w-4 h-4 transform rotate-180"></span>
            </button>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Create Quiz</h1>
          </div>
          <div class="flex gap-3">
            <button class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:bg-slate-700 transition-colors">Save Draft</button>
            <button v-if="step < 4" @click="step++" class="btn-primary px-6 py-2 rounded-lg text-sm font-medium text-slate-900 dark:text-white shadow-glow">Next Step</button>
            <button v-if="step === 4" @click="navigate('quizzes')" class="btn-primary px-6 py-2 rounded-lg text-sm font-medium text-slate-900 dark:text-white shadow-glow">Publish Quiz</button>
          </div>
        </div>

        <div class="glass p-4 rounded-xl border border-indigo-500/10 flex justify-between items-center">
          <div v-for="s in [1,2,3,4]" :key="s" class="flex flex-col items-center relative z-10 flex-1">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors', step >= s ? 'bg-indigo-500 text-slate-900 dark:text-white shadow-glow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700']">{{ s }}</div>
            <span :class="['text-xs font-medium', step >= s ? 'text-indigo-300' : 'text-slate-500']">
              {{ s === 1 ? 'Settings' : s === 2 ? 'Questions' : s === 3 ? 'Preview' : 'Publish' }}
            </span>
          </div>
          <div class="absolute left-1/2 -translate-x-1/2 top-1/2 w-4/5 h-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>
        </div>
      </div>

      <!-- Main Content Area based on step -->
      <div class="flex-1 glass rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex">
        
        <!-- Step 1: Settings -->
        <div v-if="step === 1" class="p-8 w-full max-w-4xl mx-auto overflow-y-auto">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">General Settings</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Quiz Title</label>
              <input type="text" placeholder="e.g., Midterm Assessment" class="form-input text-lg font-medium" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Description</label>
              <textarea rows="3" placeholder="Instructions for students..." class="form-input resize-none"></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Time Limit (minutes)</label>
                <input type="number" value="60" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Pass Mark (%)</label>
                <input type="number" value="70" class="form-input" />
              </div>
            </div>

            <div class="border-t border-slate-200 dark:border-slate-700/50 pt-6">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Advanced Options</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 class="text-slate-900 dark:text-white font-medium">Randomize Questions</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Show questions in random order for each student</p>
                  </div>
                  <div class="toggle on"></div>
                </div>
                <div class="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 class="text-slate-900 dark:text-white font-medium flex items-center gap-2">AI Adaptive Engine <span class="ai-badge text-[9px] py-0.5 px-2"><span v-html="Icons.ai" class="w-3 h-3"></span></span></h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Dynamically adjust difficulty based on performance</p>
                  </div>
                  <div class="toggle on"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Questions -->
        <div v-if="step === 2" class="w-full flex h-full">
          <!-- Question Type Sidebar -->
          <div class="w-64 border-r border-slate-200 dark:border-slate-700 p-4 bg-slate-100 dark:bg-slate-800/30 overflow-y-auto">
            <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Add Question</h3>
            <div class="space-y-2 mb-6">
              <button class="w-full text-left px-4 py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-medium">Multiple Choice</button>
              <button class="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors">True / False</button>
              <button class="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors">Fill in Blank</button>
              <button class="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors">Matching</button>
              <button class="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors">Essay</button>
            </div>
            
            <div class="border-t border-slate-200 dark:border-slate-700/50 pt-4 space-y-2">
              <button class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium flex justify-center items-center gap-2 hover:bg-slate-200 dark:bg-slate-700"><span v-html="Icons.bank" class="w-4 h-4"></span> From Bank</button>
              <button class="w-full px-4 py-3 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 font-medium flex justify-center items-center gap-2 hover:bg-violet-500/30"><span v-html="Icons.ai" class="w-4 h-4"></span> AI Generate</button>
            </div>
          </div>
          
          <!-- Editor Area -->
          <div class="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950">
            <div class="max-w-2xl mx-auto space-y-6">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Edit Question</h2>
                <div class="flex gap-2">
                  <span class="badge badge-purple">MCQ</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Question Text</label>
                <textarea rows="3" placeholder="What is..." class="form-input resize-none text-lg"></textarea>
                <div class="flex justify-end mt-2">
                  <button class="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center gap-1"><span v-html="Icons.upload" class="w-3 h-3"></span> Attach Media</button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Options (Select correct answer)</label>
                <div class="space-y-3">
                  <div v-for="i in 4" :key="i" class="flex items-center gap-3">
                    <input type="radio" name="correct" :checked="i===2" class="w-5 h-5 text-indigo-500 bg-slate-100 dark:bg-slate-800 border-slate-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer" />
                    <input type="text" :placeholder="'Option ' + i" :class="['form-input flex-1', i===2 ? 'border-indigo-500/50 bg-indigo-500/5' : '']" />
                    <button class="text-slate-500 hover:text-red-400 p-2"><span v-html="Icons.trash" class="w-4 h-4"></span></button>
                  </div>
                </div>
                <button class="mt-3 text-sm text-indigo-400 font-medium">+ Add Option</button>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 flex justify-between">
                  <span>AI Hint Suggestion (Optional)</span>
                  <span class="text-violet-400 text-xs flex items-center gap-1"><span v-html="Icons.ai" class="w-3 h-3"></span> Auto-generate</span>
                </label>
                <textarea rows="2" placeholder="Shown to students if they struggle..." class="form-input resize-none"></textarea>
              </div>
            </div>
          </div>
          
          <!-- Questions List -->
          <div class="w-72 border-l border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 overflow-y-auto flex flex-col">
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-100 dark:bg-slate-800/80 sticky top-0">
              <h3 class="font-bold text-slate-900 dark:text-white">Quiz Items <span class="text-slate-500 dark:text-slate-400 text-sm font-normal">(4)</span></h3>
            </div>
            <div class="p-4 space-y-3">
              <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-600 cursor-pointer hover:border-indigo-500">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Q1 • MCQ</span>
                  <span class="text-[10px] text-green-400">Easy</span>
                </div>
                <p class="text-sm text-slate-900 dark:text-white truncate">What is the output of...</p>
              </div>
              <div class="p-3 rounded-lg bg-indigo-500/20 border border-indigo-500 shadow-glow-sm cursor-pointer">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[10px] font-bold text-indigo-300 uppercase">Q2 • MCQ</span>
                  <span class="text-[10px] text-amber-400">Medium</span>
                </div>
                <p class="text-sm text-slate-900 dark:text-white truncate">Which concept describes...</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="step > 2" class="p-12 w-full text-center flex flex-col items-center justify-center">
          <div class="text-indigo-400 mb-4" v-html="Icons.check"></div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Step {{step}} Placeholder</h2>
          <p class="text-slate-500 dark:text-slate-400">The rest of the wizard logic continues here.</p>
        </div>

      </div>
    </div>
  `
};

export const QuestionBank = {
  name: 'QuestionBank',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    return { Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="p-6 h-full flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Question Bank</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{ data.stats.totalQuestions }} questions across all subjects</p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:bg-slate-700 flex items-center gap-2">
            <span v-html="Icons.upload" class="w-4 h-4"></span> Import CSV
          </button>
          <button class="btn-primary px-4 py-2 rounded-lg text-sm font-medium text-slate-900 dark:text-white shadow-glow flex items-center gap-2">
            <span v-html="Icons.plus" class="w-4 h-4"></span> Add Question
          </button>
        </div>
      </div>

      <div class="flex-1 flex gap-6 overflow-hidden">
        <!-- Sidebar Filters -->
        <div class="w-64 flex flex-col gap-6 overflow-y-auto hidden md:flex">
          <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4">Subjects</h3>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li class="flex justify-between items-center text-indigo-400 font-medium cursor-pointer"><span>All Subjects</span><span class="bg-indigo-500/20 px-2 py-0.5 rounded text-xs">5k+</span></li>
              <li class="flex justify-between items-center hover:text-slate-900 dark:text-white cursor-pointer"><span>Computer Science</span><span class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-500">1,204</span></li>
              <li class="flex justify-between items-center hover:text-slate-900 dark:text-white cursor-pointer"><span>Mathematics</span><span class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-500">845</span></li>
              <li class="flex justify-between items-center hover:text-slate-900 dark:text-white cursor-pointer"><span>Biology</span><span class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-500">620</span></li>
              <li class="flex justify-between items-center hover:text-slate-900 dark:text-white cursor-pointer"><span>History</span><span class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-500">451</span></li>
            </ul>
          </div>
          
          <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex-1">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4">AI Generator</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Quickly generate bulk questions based on topics.</p>
            <textarea placeholder="Enter keywords (e.g., 'Photosynthesis process, ATP, light cycle')" rows="3" class="form-input resize-none text-sm mb-3"></textarea>
            <button class="w-full py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium text-sm hover:bg-violet-500/30 flex justify-center items-center gap-2">
              <span v-html="Icons.ai" class="w-4 h-4"></span> Generate 10 Questions
            </button>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="flex-1 glass rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-4 bg-slate-100 dark:bg-slate-800/50">
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500" v-html="Icons.search"></span>
              <input type="text" placeholder="Search questions..." class="form-input pl-10" />
            </div>
            <select class="form-input w-32"><option>Type: All</option></select>
            <select class="form-input w-32"><option>Diff: All</option></select>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-for="q in data.questionBank" :key="q.id" class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 hover:bg-slate-100 dark:bg-slate-800/60 transition-colors card-hover cursor-pointer group">
              <div class="flex justify-between items-start mb-2">
                <div class="flex gap-2 items-center">
                  <span class="badge badge-purple">{{ q.type }}</span>
                  <span class="text-xs font-bold text-slate-500">{{ q.subject }}</span>
                </div>
                <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span title="Used in quizzes">🔄 {{ q.usageCount }}x</span>
                  <span title="Average pass rate">✅ {{ q.passRate }}%</span>
                  <span :class="['font-bold uppercase', q.difficulty === 'hard' ? 'text-red-400' : q.difficulty === 'medium' ? 'text-amber-400' : 'text-green-400']">{{ q.difficulty }}</span>
                </div>
              </div>
              <h3 class="text-base font-medium text-slate-900 dark:text-white group-hover:text-indigo-300 transition-colors">{{ q.text }}</h3>
              <div class="mt-3 flex gap-1">
                <span v-for="tag in q.tags" :key="tag" class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">#{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

export const AnalyticsDashboard = {
  name: 'AnalyticsDashboard',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { onMounted } = Vue;
    onMounted(() => {
      setTimeout(() => {
        if(window.Chart) {
          const ctx1 = document.getElementById('histChart');
          if(ctx1) new window.Chart(ctx1, { type: 'bar', data: { labels: ['<50','50-60','60-70','70-80','80-90','90-100'], datasets: [{ data: [12, 18, 30, 45, 60, 25], backgroundColor: '#6366f1', borderRadius: 4 }] }, options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: false } } } });
          
          const ctx2 = document.getElementById('subjectChart');
          if(ctx2) new window.Chart(ctx2, { type: 'radar', data: { labels: props.data.analyticsChartData.subjectPerformance.labels, datasets: [{ label: 'Score', data: props.data.analyticsChartData.subjectPerformance.data, backgroundColor: 'rgba(139,92,246,0.2)', borderColor: '#8b5cf6', pointBackgroundColor: '#8b5cf6' }] }, options: { scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, angleLines: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#94a3b8' }, ticks: { display: false } } }, plugins: { legend: { display: false } } } });
        }
      }, 100);
    });
    return { Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Analytics & Reports</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Deep insights into student performance.</p>
        </div>
        <div class="flex gap-3">
          <select class="form-input w-40 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"><option>Last 30 Days</option></select>
          <button class="btn-primary px-4 py-2 rounded-lg text-sm font-medium text-slate-900 dark:text-white shadow-glow flex items-center gap-2">
            <span v-html="Icons.download" class="w-4 h-4"></span> Export PDF
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Submissions</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">4,281</p>
          <p class="text-xs text-green-400 font-medium mt-2">↑ 18% vs last period</p>
        </div>
        <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pass Rate</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">82.4%</p>
          <p class="text-xs text-green-400 font-medium mt-2">↑ 3.2% vs last period</p>
        </div>
        <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Score</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">78.1%</p>
          <p class="text-xs text-slate-500 font-medium mt-2">No change</p>
        </div>
        <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Time Spent</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">18m 42s</p>
          <p class="text-xs text-red-400 font-medium mt-2">↓ 2m vs last period</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
        <div class="lg:col-span-2 glass p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
          <h2 class="font-bold text-slate-900 dark:text-white mb-4">Score Distribution</h2>
          <div class="flex-1 relative"><canvas id="histChart"></canvas></div>
        </div>
        <div class="glass p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
          <h2 class="font-bold text-slate-900 dark:text-white mb-4">Subject Mastery</h2>
          <div class="flex-1 relative"><canvas id="subjectChart"></canvas></div>
        </div>
      </div>
    </div>
  `
};

export const GamificationPage = {
  name: 'GamificationPage',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    return { Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center mb-2">
        <div>
          <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-1 flex items-center gap-2">
            Gamification Hub 🏆
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Leaderboards, badges, and streaks to keep students engaged.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Leaderboard -->
        <div class="lg:col-span-2 glass p-6 rounded-xl border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)] flex flex-col">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">Global Leaderboard <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-2"></span></h2>
            <select class="form-input w-32 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm py-1"><option>This Week</option></select>
          </div>
          
          <!-- Podium -->
          <div class="flex justify-center items-end h-48 mb-8 gap-2">
            <!-- Silver -->
            <div class="flex flex-col items-center w-1/4">
              <div class="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white text-lg mb-2 relative border-4 border-[#94a3b8]">{{ data.leaderboard[1].name.charAt(0) }}</div>
              <p class="text-xs font-bold text-slate-900 dark:text-white truncate w-full text-center">{{ data.leaderboard[1].name.split(' ')[0] }}</p>
              <div class="w-full h-24 podium-2 rounded-t-lg mt-2 shadow-lg relative overflow-hidden flex justify-center pt-2">
                <span class="font-heading font-black text-slate-900 dark:text-white/50 text-3xl">2</span>
              </div>
            </div>
            <!-- Gold -->
            <div class="flex flex-col items-center w-1/3">
              <div class="text-3xl mb-1 animate-float">👑</div>
              <div class="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xl mb-2 relative border-4 border-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.5)]">{{ data.leaderboard[0].name.charAt(0) }}</div>
              <p class="text-sm font-bold text-slate-900 dark:text-white truncate w-full text-center">{{ data.leaderboard[0].name.split(' ')[0] }}</p>
              <div class="w-full h-32 podium-1 rounded-t-lg mt-2 shadow-lg relative overflow-hidden flex justify-center pt-2">
                <span class="font-heading font-black text-slate-900 dark:text-white/50 text-4xl">1</span>
              </div>
            </div>
            <!-- Bronze -->
            <div class="flex flex-col items-center w-1/4">
              <div class="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white text-lg mb-2 relative border-4 border-[#d97706]">{{ data.leaderboard[2].name.charAt(0) }}</div>
              <p class="text-xs font-bold text-slate-900 dark:text-white truncate w-full text-center">{{ data.leaderboard[2].name.split(' ')[0] }}</p>
              <div class="w-full h-20 podium-3 rounded-t-lg mt-2 shadow-lg relative overflow-hidden flex justify-center pt-2">
                <span class="font-heading font-black text-slate-900 dark:text-white/50 text-3xl">3</span>
              </div>
            </div>
          </div>

          <!-- List -->
          <div class="flex-1 overflow-y-auto pr-2 space-y-2">
            <div v-for="(user, i) in data.leaderboard.slice(3)" :key="user.name" class="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/50">
              <div class="flex items-center gap-4">
                <span class="text-slate-500 font-bold w-4 text-center">{{ i + 4 }}</span>
                <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs">{{ user.name.charAt(0) }}</div>
                <div>
                  <p class="font-semibold text-slate-700 dark:text-slate-200">{{ user.name }}</p>
                  <p class="text-xs text-slate-500 flex gap-2"><span>🔥 {{ user.streak }}</span> <span>🏅 {{ user.badges }}</span></p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-indigo-400">{{ user.xp }} XP</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges & Streaks Side -->
        <div class="space-y-6 flex flex-col">
          <div class="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex-1">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Badge Gallery</h2>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="badge in data.badges.slice(0,6)" :key="badge.id" 
                   :class="['flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer tooltip-wrapper card-hover', badge.earned ? 'bg-slate-100 dark:bg-slate-800 border-slate-600' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-800 opacity-50 grayscale']">
                <span class="text-3xl mb-2 filter drop-shadow-lg">{{ badge.icon }}</span>
                <span class="text-[10px] font-bold text-slate-900 dark:text-white leading-tight mb-1">{{ badge.name }}</span>
                <span :class="['text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded', badge.rarity==='legendary'?'bg-amber-500/20 text-amber-400':badge.rarity==='epic'?'bg-purple-500/20 text-purple-400':'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400']">{{ badge.rarity }}</span>
                <div class="tooltip z-50 whitespace-normal w-32 text-center">{{ badge.description }}</div>
              </div>
            </div>
            <button class="w-full mt-4 py-2 text-sm text-indigo-400 font-medium bg-indigo-500/10 rounded-lg hover:bg-indigo-500/20 transition-colors">View All Badges</button>
          </div>

          <div class="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Activity Streak</h2>
            <div class="flex items-center gap-4 mb-6">
              <div class="text-5xl filter drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">🔥</div>
              <div>
                <p class="text-3xl font-black text-slate-900 dark:text-white">{{ data.studentProgress.streak }} <span class="text-lg text-slate-500 dark:text-slate-400 font-normal">days</span></p>
                <p class="text-sm text-orange-400 font-medium">Keep it up! 3 days to next reward.</p>
              </div>
            </div>
            <div class="grid grid-cols-7 gap-1">
              <div v-for="day in ['M','T','W','T','F','S','S']" class="text-[10px] text-center text-slate-500 font-bold mb-1">{{day}}</div>
              <div v-for="i in 7" :key="i" :class="['h-8 rounded-md flex items-center justify-center text-sm', i <= 5 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600']">
                <span v-if="i <= 5">✔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};
