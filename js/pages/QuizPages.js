/* =============================================================
   QuizPages.js  –  Quiz Management System · Vue 3 (CDN global)
   Four page-level components:
     QuizList | QuizCreator | QuizResults | QuestionBank
   ============================================================= */

const { ref, computed, reactive, watch, onMounted, nextTick } = Vue;

/* ─────────────────────────────────────────────────────────────
   SHARED HELPERS
───────────────────────────────────────────────────────────── */
const SUBJECT_COLORS = {
  Programming : 'from-violet-500 to-indigo-500',
  Biology     : 'from-emerald-500 to-teal-500',
  History     : 'from-amber-500 to-orange-500',
  Mathematics : 'from-blue-500 to-cyan-500',
  Chemistry   : 'from-rose-500 to-pink-500',
  Literature  : 'from-fuchsia-500 to-purple-500',
  Physics     : 'from-sky-500 to-blue-500',
  Geography   : 'from-green-500 to-lime-500',
};

const DIFFICULTY_BADGE = {
  Easy   : 'badge-success',
  Medium : 'badge-warning',
  Hard   : 'badge-danger',
};

const STATUS_BADGE = {
  Published : 'badge-primary',
  Draft     : 'badge-neutral',
  Archived  : 'badge-warning',
  Scheduled : 'badge-info',
};

/* ─────────────────────────────────────────────────────────────
   1.  Q U I Z   L I S T
───────────────────────────────────────────────────────────── */
export const QuizList = {
  name  : 'QuizList',
  props : ['data'],
  emits : ['navigate'],

  setup(props, { emit }) {
    /* ── state ── */
    const search      = ref('');
    const filterType  = ref('All');
    const filterStatus= ref('All');
    const filterDiff  = ref('All');
    const filterSubj  = ref('All');
    const currentPage = ref(1);
    const perPage     = 6;

    /* ── sample data (used when props.data is empty / absent) ── */
    const sampleQuizzes = [
      { id:1, title:'JavaScript Fundamentals', subject:'Programming', type:'Graded',   status:'Published', difficulty:'Medium', questions:30, students:142, avgScore:74, created:'2026-06-01' },
      { id:2, title:'Cell Biology Basics',     subject:'Biology',     type:'Practice', status:'Published', difficulty:'Easy',   questions:20, students:98,  avgScore:82, created:'2026-05-28' },
      { id:3, title:'World War II Timeline',   subject:'History',     type:'Timed',    status:'Draft',     difficulty:'Hard',   questions:40, students:0,   avgScore:0,  created:'2026-06-10' },
      { id:4, title:'Calculus I',              subject:'Mathematics', type:'Graded',   status:'Published', difficulty:'Hard',   questions:25, students:67,  avgScore:61, created:'2026-05-15' },
      { id:5, title:'Organic Chemistry',       subject:'Chemistry',   type:'Survey',   status:'Archived',  difficulty:'Medium', questions:18, students:53,  avgScore:70, created:'2026-04-20' },
      { id:6, title:'Python for Beginners',    subject:'Programming', type:'Practice', status:'Scheduled', difficulty:'Easy',   questions:22, students:0,   avgScore:0,  created:'2026-06-15' },
      { id:7, title:'Romanticism in Poetry',   subject:'Literature',  type:'Graded',   status:'Published', difficulty:'Medium', questions:15, students:33,  avgScore:77, created:'2026-05-22' },
      { id:8, title:'Newtonian Mechanics',     subject:'Physics',     type:'Timed',    status:'Published', difficulty:'Hard',   questions:35, students:89,  avgScore:65, created:'2026-06-05' },
    ];

    const quizzes = computed(() => (props.data && props.data.quizzes) ? props.data.quizzes : sampleQuizzes);

    /* ── filters ── */
    const filtered = computed(() => {
      return quizzes.value.filter(q => {
        const s = search.value.toLowerCase();
        return (
          (filterType.value   === 'All' || q.type       === filterType.value)   &&
          (filterStatus.value === 'All' || q.status     === filterStatus.value) &&
          (filterDiff.value   === 'All' || q.difficulty === filterDiff.value)   &&
          (filterSubj.value   === 'All' || q.subject    === filterSubj.value)   &&
          (!s || q.title.toLowerCase().includes(s) || q.subject.toLowerCase().includes(s))
        );
      });
    });

    const totalPages  = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)));
    const paginated   = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filtered.value.slice(start, start + perPage);
    });

    watch(filtered, () => { currentPage.value = 1; });

    /* ── actions ── */
    const deleteQuiz = id => { alert('Delete quiz ' + id + '?'); };
    const duplicate  = id => { alert('Duplicate quiz ' + id); };

    return {
      search, filterType, filterStatus, filterDiff, filterSubj,
      currentPage, totalPages, paginated, filtered,
      SUBJECT_COLORS, DIFFICULTY_BADGE, STATUS_BADGE,
      deleteQuiz, duplicate, emit,
    };
  },

  template: `
<div class="flex flex-col gap-6 min-h-screen p-6">

  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-3xl font-extrabold gradient-text">Quiz Library</h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage, create and analyse all your quizzes</p>
    </div>
    <button @click="emit('navigate','quiz-creator')"
            class="btn-primary flex items-center gap-2 whitespace-nowrap">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
      </svg>
      Create Quiz
    </button>
  </div>

  <!-- Search + Filters -->
  <div class="glass rounded-2xl p-4 flex flex-col gap-3">
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
      </svg>
      <input id="quiz-search" v-model="search" type="text" placeholder="Search quizzes…"
             class="form-input pl-10 w-full" />
    </div>
    <div class="flex flex-wrap gap-2">
      <select id="filter-type"   v-model="filterType"   class="form-input flex-1 min-w-[130px]">
        <option>All</option><option>Graded</option><option>Practice</option><option>Survey</option><option>Timed</option>
      </select>
      <select id="filter-status" v-model="filterStatus" class="form-input flex-1 min-w-[130px]">
        <option>All</option><option>Published</option><option>Draft</option><option>Archived</option><option>Scheduled</option>
      </select>
      <select id="filter-diff"   v-model="filterDiff"   class="form-input flex-1 min-w-[130px]">
        <option>All</option><option>Easy</option><option>Medium</option><option>Hard</option>
      </select>
      <select id="filter-subj"   v-model="filterSubj"   class="form-input flex-1 min-w-[130px]">
        <option>All</option><option>Programming</option><option>Biology</option><option>History</option>
        <option>Mathematics</option><option>Chemistry</option><option>Literature</option><option>Physics</option>
      </select>
    </div>
  </div>

  <!-- Grid -->
  <div v-if="paginated.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
    <div v-for="q in paginated" :key="q.id"
         class="glass rounded-2xl overflow-hidden card-hover flex flex-col">

      <!-- colour stripe -->
      <div :class="'h-2 bg-gradient-to-r ' + (SUBJECT_COLORS[q.subject] || 'from-indigo-500 to-violet-500')"></div>

      <div class="p-5 flex flex-col gap-3 flex-1">
        <!-- top row -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-wrap gap-1.5">
            <span :class="'badge ' + (DIFFICULTY_BADGE[q.difficulty] || 'badge-neutral')">{{ q.difficulty }}</span>
            <span class="badge badge-info">{{ q.type }}</span>
          </div>
          <span :class="'badge ' + (STATUS_BADGE[q.status] || 'badge-neutral')">{{ q.status }}</span>
        </div>

        <!-- title -->
        <h3 class="font-bold text-slate-900 dark:text-white text-lg leading-tight">{{ q.title }}</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ q.subject }}</p>

        <!-- stats -->
        <div class="flex gap-4 text-sm text-slate-600 dark:text-slate-300">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            {{ q.questions }} Qs
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
            {{ q.students }} Students
          </span>
        </div>

        <!-- avg score bar -->
        <div v-if="q.avgScore > 0" class="space-y-1">
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Avg Score</span><span class="font-semibold text-slate-900 dark:text-white">{{ q.avgScore }}%</span>
          </div>
          <div class="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                 :style="'width:' + q.avgScore + '%'"></div>
          </div>
        </div>
        <div v-else class="text-xs text-slate-500 italic">No submissions yet</div>

        <!-- date -->
        <p class="text-xs text-slate-500">Created {{ q.created }}</p>

        <!-- actions -->
        <div class="flex gap-1.5 mt-auto pt-2 border-t border-white/5">
          <button @click="emit('navigate','quiz-creator')"
                  class="flex-1 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-300 hover:text-slate-900 dark:text-white transition-all">
            Edit
          </button>
          <button @click="duplicate(q.id)"
                  class="flex-1 py-1.5 rounded-lg text-xs font-medium bg-violet-600/20 hover:bg-violet-600/50 text-violet-300 hover:text-slate-900 dark:text-white transition-all">
            Duplicate
          </button>
          <button @click="emit('navigate','quiz-results')"
                  class="flex-1 py-1.5 rounded-lg text-xs font-medium bg-slate-600/20 hover:bg-slate-600/50 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all">
            Preview
          </button>
          <button @click="deleteQuiz(q.id)"
                  class="py-1.5 px-2 rounded-lg text-xs font-medium bg-red-600/20 hover:bg-red-600/50 text-red-400 hover:text-slate-900 dark:text-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6m5 0V4h4v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="flex flex-col items-center justify-center py-24 gap-4 text-center">
    <div class="w-24 h-24 rounded-full bg-indigo-900/40 flex items-center justify-center mb-2">
      <svg class="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
      </svg>
    </div>
    <h3 class="text-xl font-bold text-slate-700 dark:text-slate-200">No Quizzes Found</h3>
    <p class="text-slate-500 dark:text-slate-400 max-w-sm">Try adjusting your filters or create your first quiz.</p>
    <button @click="emit('navigate','quiz-creator')" class="btn-primary mt-2">Create Your First Quiz</button>
  </div>

  <!-- Pagination -->
  <div v-if="filtered.length > 0" class="flex items-center justify-between mt-auto pt-4">
    <p class="text-sm text-slate-500 dark:text-slate-400">
      Showing {{ Math.min((currentPage-1)*6+1, filtered.length) }}–{{ Math.min(currentPage*6, filtered.length) }}
      of {{ filtered.length }} quizzes
    </p>
    <div class="flex gap-1.5">
      <button @click="currentPage = Math.max(1, currentPage-1)"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 rounded-lg text-sm bg-slate-200 dark:bg-slate-700/50 hover:bg-indigo-600/50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 transition-all">
        ‹ Prev
      </button>
      <button v-for="p in totalPages" :key="p"
              @click="currentPage = p"
              :class="['px-3 py-1.5 rounded-lg text-sm transition-all',
                       p === currentPage ? 'bg-indigo-600 text-slate-900 dark:text-white shadow-lg shadow-indigo-900/50' : 'bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-600/50 text-slate-600 dark:text-slate-300']">
        {{ p }}
      </button>
      <button @click="currentPage = Math.min(totalPages, currentPage+1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 rounded-lg text-sm bg-slate-200 dark:bg-slate-700/50 hover:bg-indigo-600/50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 transition-all">
        Next ›
      </button>
    </div>
  </div>

</div>
`};


/* ─────────────────────────────────────────────────────────────
   2.  Q U I Z   C R E A T O R  (multi-step wizard)
───────────────────────────────────────────────────────────── */
export const QuizCreator = {
  name  : 'QuizCreator',
  props : ['data'],
  emits : ['navigate'],

  setup(props, { emit }) {
    /* ── wizard state ── */
    const step = ref(1);
    const STEPS = [
      { n:1, label:'Settings'  },
      { n:2, label:'Questions' },
      { n:3, label:'Preview'   },
      { n:4, label:'Publish'   },
    ];

    /* ── Step 1 – Settings ── */
    const settings = reactive({
      title       : '',
      description : '',
      type        : 'Graded',
      timeLimitOn : false,
      timeLimit   : 30,
      attempts    : 1,
      passPercent : 70,
      startDate   : '',
      endDate     : '',
      randomQ     : false,
      randomA     : false,
      prereqQuiz  : '',
    });
    const quizTypes = ['Graded','Practice','Survey','Timed'];
    const samplePrereqs = ['JavaScript Basics','Algebra 101','Cell Biology Intro'];

    /* ── Step 2 – Questions ── */
    const qType = ref('MCQ');
    const qTypes = ['MCQ','True/False','Fill-in','Matching','Ordering','Essay'];
    const questions = ref([]);
    const aiKeyword = ref('');

    /* MCQ builder state */
    const mcq = reactive({
      text    : '',
      options : ['','','',''],
      correct : 0,
      difficulty: 'Medium',
      explanation:'',
    });
    const tfAnswer = ref('True');

    const addQuestion = () => {
      if (qType.value === 'MCQ' && mcq.text) {
        questions.value.push({
          id: Date.now(),
          type: 'MCQ',
          text: mcq.text,
          options: [...mcq.options],
          correct: mcq.correct,
          difficulty: mcq.difficulty,
        });
        mcq.text = ''; mcq.options = ['','','','']; mcq.correct = 0;
      } else if (qType.value === 'True/False') {
        questions.value.push({ id:Date.now(), type:'True/False', text:'Sample T/F question', answer: tfAnswer.value });
      } else {
        questions.value.push({ id:Date.now(), type: qType.value, text: 'New ' + qType.value + ' question' });
      }
    };

    const removeQ = id => { questions.value = questions.value.filter(q => q.id !== id); };

    const aiGenerate = () => {
      if (!aiKeyword.value) return;
      questions.value.push({
        id      : Date.now(),
        type    : 'MCQ',
        text    : '(AI) What is the importance of ' + aiKeyword.value + '?',
        options : ['Option A','Option B','Option C','Option D'],
        correct : 0,
        difficulty:'Medium',
      });
      aiKeyword.value = '';
    };

    /* ── Step 4 – Publish ── */
    const access         = ref('Class');
    const notifyStudents = ref(true);
    const accessOptions  = [
      { key:'Public',    icon:'🌐', desc:'Anyone with the link' },
      { key:'Class',     icon:'🏫', desc:'Enrolled students only' },
      { key:'Link-only', icon:'🔗', desc:'Share via secret link' },
    ];

    const publish = () => { alert('Quiz published! 🎉'); emit('navigate','quiz-list'); };
    const saveDraft = () => { alert('Draft saved.'); };

    return {
      step, STEPS,
      settings, quizTypes, samplePrereqs,
      qType, qTypes, questions, aiKeyword, mcq, tfAnswer,
      addQuestion, removeQ, aiGenerate,
      access, notifyStudents, accessOptions, publish, saveDraft,
      emit,
    };
  },

  template: `
<div class="flex flex-col min-h-screen p-6 gap-6">

  <!-- Header -->
  <div class="flex items-center gap-3">
    <button @click="emit('navigate','quiz-list')"
            class="p-2 rounded-lg hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
    <div>
      <h1 class="text-2xl font-extrabold gradient-text">Quiz Creator</h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm">Build your quiz step by step</p>
    </div>
  </div>

  <!-- Step Progress Bar -->
  <div class="glass rounded-2xl p-4">
    <div class="flex items-center justify-between relative">
      <!-- connector line -->
      <div class="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 z-0 mx-8"></div>
      <div v-for="s in STEPS" :key="s.n"
           class="flex flex-col items-center gap-2 z-10 flex-1">
        <button @click="step = s.n"
                :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300',
                         s.n < step  ? 'bg-indigo-600 border-indigo-600 text-slate-900 dark:text-white shadow-lg shadow-indigo-900/50'
                         : s.n===step ? 'bg-gradient-to-br from-violet-500 to-indigo-600 border-violet-400 text-slate-900 dark:text-white shadow-lg shadow-violet-900/60 scale-110'
                         : 'bg-slate-100 dark:bg-slate-800 border-slate-600 text-slate-500 dark:text-slate-400']">
          <svg v-if="s.n < step" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          <span v-else>{{ s.n }}</span>
        </button>
        <span :class="['text-xs font-medium transition-colors',
                       s.n === step ? 'text-violet-300' : s.n < step ? 'text-indigo-400' : 'text-slate-500']">
          {{ s.label }}
        </span>
      </div>
    </div>
  </div>

  <!-- ═══ STEP 1 – SETTINGS ═══ -->
  <div v-if="step===1" class="glass rounded-2xl p-6 flex flex-col gap-6">
    <h2 class="text-lg font-bold text-slate-900 dark:text-white">Quiz Settings</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Title + Desc -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <div>
          <label class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Quiz Title *</label>
          <input id="quiz-title" v-model="settings.title" type="text" placeholder="e.g. JavaScript ES6 Fundamentals"
                 class="form-input w-full" />
        </div>
        <div>
          <label class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Description</label>
          <textarea id="quiz-desc" v-model="settings.description" rows="3"
                    placeholder="What will students learn from this quiz?"
                    class="form-input w-full resize-none"></textarea>
        </div>
      </div>

      <!-- Quiz Type -->
      <div class="lg:col-span-2">
        <label class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 block">Quiz Type</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button v-for="t in quizTypes" :key="t"
                  @click="settings.type = t"
                  :class="['p-4 rounded-xl border-2 text-center transition-all duration-200 font-semibold text-sm',
                           settings.type===t
                             ? 'border-indigo-500 bg-indigo-600/30 text-indigo-200 shadow-lg shadow-indigo-900/40'
                             : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-slate-500']">
            <div class="text-2xl mb-1">{{ t==='Graded'?'🎯':t==='Practice'?'📚':t==='Survey'?'📊':'⏱️' }}</div>
            {{ t }}
          </button>
        </div>
      </div>

      <!-- Time Limit -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-slate-600 dark:text-slate-300">Time Limit</label>
          <label class="toggle">
            <input id="time-limit-toggle" type="checkbox" v-model="settings.timeLimitOn" class="sr-only">
            <span class="toggle-track"></span>
          </label>
        </div>
        <div v-if="settings.timeLimitOn" class="flex items-center gap-2">
          <input id="time-limit-val" v-model.number="settings.timeLimit" type="number" min="5" max="180"
                 class="form-input w-24 text-center" />
          <span class="text-slate-500 dark:text-slate-400 text-sm">minutes</span>
        </div>
      </div>

      <!-- Attempts + Pass % -->
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Max Attempts</label>
          <input id="attempts" v-model.number="settings.attempts" type="number" min="1" max="10"
                 class="form-input w-full" />
        </div>
        <div class="flex-1">
          <label class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Pass %</label>
          <input id="pass-pct" v-model.number="settings.passPercent" type="number" min="0" max="100"
                 class="form-input w-full" />
        </div>
      </div>

      <!-- Schedule -->
      <div>
        <label class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Start Date</label>
        <input id="start-date" v-model="settings.startDate" type="datetime-local" class="form-input w-full" />
      </div>
      <div>
        <label class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">End Date</label>
        <input id="end-date" v-model="settings.endDate" type="datetime-local" class="form-input w-full" />
      </div>

      <!-- Toggles -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
          <span class="text-sm text-slate-600 dark:text-slate-300">Randomize Questions</span>
          <label class="toggle">
            <input id="rand-q" type="checkbox" v-model="settings.randomQ" class="sr-only">
            <span class="toggle-track"></span>
          </label>
        </div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
          <span class="text-sm text-slate-600 dark:text-slate-300">Randomize Answers</span>
          <label class="toggle">
            <input id="rand-a" type="checkbox" v-model="settings.randomA" class="sr-only">
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>

      <!-- Prerequisite -->
      <div>
        <label class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Conditional Access (Prerequisite Quiz)</label>
        <select id="prereq" v-model="settings.prereqQuiz" class="form-input w-full">
          <option value="">None</option>
          <option v-for="p in samplePrereqs" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
    </div>
  </div>

  <!-- ═══ STEP 2 – QUESTIONS ═══ -->
  <div v-if="step===2" class="flex gap-5 min-h-[600px]">

    <!-- Left: Type Selector -->
    <div class="glass rounded-2xl p-4 flex flex-col gap-2 w-40 shrink-0">
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Type</p>
      <button v-for="t in qTypes" :key="t"
              @click="qType = t"
              :class="['py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all',
                       qType===t
                         ? 'bg-indigo-600/50 text-indigo-200 border border-indigo-500/50'
                         : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700/50 hover:text-slate-700 dark:text-slate-200']">
        {{ t }}
      </button>
    </div>

    <!-- Center: Builder -->
    <div class="glass rounded-2xl p-5 flex flex-col gap-4 flex-1">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">{{ qType }} Builder</h2>
        <div class="flex gap-2">
          <button @click="emit('navigate','question-bank')"
                  class="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-600/60 text-slate-600 dark:text-slate-300 transition-all">
            + From Bank
          </button>
          <div class="flex gap-1.5 items-center">
            <input id="ai-keyword" v-model="aiKeyword" type="text" placeholder="AI keyword…"
                   class="form-input text-xs py-1.5 w-32" />
            <button @click="aiGenerate"
                    class="px-3 py-1.5 rounded-lg text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-slate-900 dark:text-white font-semibold transition-all flex items-center gap-1">
              ✨ AI
            </button>
          </div>
        </div>
      </div>

      <!-- MCQ Builder -->
      <template v-if="qType==='MCQ'">
        <textarea id="mcq-text" v-model="mcq.text" rows="3" placeholder="Enter your question here…"
                  class="form-input resize-none w-full"></textarea>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div v-for="(opt, i) in mcq.options" :key="i"
               :class="['flex items-center gap-2 p-2 rounded-xl border transition-all',
                        mcq.correct===i ? 'border-emerald-500/60 bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700']">
            <button @click="mcq.correct = i"
                    :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 transition-all',
                             mcq.correct===i ? 'border-emerald-500 bg-emerald-500 text-slate-900 dark:text-white' : 'border-slate-600 text-slate-500']">
              {{ String.fromCharCode(65+i) }}
            </button>
            <input v-model="mcq.options[i]" type="text" :placeholder="'Option ' + String.fromCharCode(65+i)"
                   class="bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-500 flex-1 min-w-0" />
          </div>
        </div>
        <div class="flex gap-3 flex-wrap">
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Difficulty</label>
            <select id="mcq-diff" v-model="mcq.difficulty" class="form-input text-sm py-1.5">
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>
          <div class="flex-1 min-w-[180px]">
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Explanation (shown after)</label>
            <input id="mcq-explain" v-model="mcq.explanation" type="text"
                   placeholder="Why is this the answer?" class="form-input text-sm py-1.5 w-full" />
          </div>
          <div class="flex items-end">
            <button class="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all">
              📎 Media
            </button>
          </div>
        </div>
      </template>

      <!-- True/False Builder -->
      <template v-else-if="qType==='True/False'">
        <textarea rows="3" placeholder="Enter True/False question…" class="form-input resize-none w-full"></textarea>
        <div class="flex gap-3">
          <button v-for="a in ['True','False']" :key="a"
                  @click="tfAnswer = a"
                  :class="['flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all',
                           tfAnswer===a ? 'border-indigo-500 bg-indigo-600/30 text-indigo-200' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-500']">
            {{ a==='True' ? '✅' : '❌' }} {{ a }}
          </button>
        </div>
      </template>

      <!-- Fill-in Builder -->
      <template v-else-if="qType==='Fill-in'">
        <p class="text-xs text-slate-500 dark:text-slate-400">Use <code class="text-indigo-300">___</code> to mark blank positions.</p>
        <textarea rows="3" placeholder="The capital of France is ___." class="form-input resize-none w-full"></textarea>
        <input type="text" placeholder="Correct answer(s), comma-separated" class="form-input w-full" />
      </template>

      <!-- Matching Builder -->
      <template v-else-if="qType==='Matching'">
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Match left items to right items</p>
        <div class="grid grid-cols-2 gap-2" v-for="i in 3" :key="i">
          <input type="text" :placeholder="'Left ' + i" class="form-input text-sm py-1.5" />
          <input type="text" :placeholder="'Right ' + i" class="form-input text-sm py-1.5" />
        </div>
      </template>

      <!-- Ordering Builder -->
      <template v-else-if="qType==='Ordering'">
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Add items in correct order</p>
        <div v-for="i in 4" :key="i" class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-indigo-600/40 text-indigo-300 text-xs font-bold flex items-center justify-center">{{ i }}</span>
          <input type="text" :placeholder="'Step ' + i" class="form-input text-sm py-1.5 flex-1" />
        </div>
      </template>

      <!-- Essay Builder -->
      <template v-else-if="qType==='Essay'">
        <textarea rows="3" placeholder="Enter essay prompt…" class="form-input resize-none w-full"></textarea>
        <div class="flex gap-3">
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 block mb-1">Min Words</label>
            <input type="number" value="50" class="form-input text-sm py-1.5 w-24" />
          </div>
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 block mb-1">Max Words</label>
            <input type="number" value="500" class="form-input text-sm py-1.5 w-24" />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" class="rounded" /> AI auto-grade
            </label>
          </div>
        </div>
      </template>

      <button @click="addQuestion"
              class="btn-primary self-start flex items-center gap-2 mt-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Add Question
      </button>
    </div>

    <!-- Right: Question List -->
    <div class="glass rounded-2xl p-4 flex flex-col gap-3 w-56 shrink-0">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions</p>
        <span class="badge badge-primary text-xs">{{ questions.length }}</span>
      </div>
      <div v-if="questions.length === 0" class="text-xs text-slate-500 text-center py-6">
        No questions yet
      </div>
      <div v-for="(q, i) in questions" :key="q.id"
           class="flex items-start gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
        <span class="text-slate-500 cursor-grab mt-0.5 text-sm">⋮⋮</span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">Q{{ i+1 }}: {{ q.text }}</p>
          <span class="text-xs text-indigo-400">{{ q.type }}</span>
        </div>
        <button @click="removeQ(q.id)" class="text-red-400/60 hover:text-red-400 transition-colors text-sm">✕</button>
      </div>
    </div>
  </div>

  <!-- ═══ STEP 3 – PREVIEW ═══ -->
  <div v-if="step===3" class="glass rounded-2xl p-6 flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">Student Preview</h2>
      <span class="badge badge-info">Preview Mode</span>
    </div>

    <!-- Quiz player mockup -->
    <div class="max-w-2xl mx-auto w-full flex flex-col gap-5">
      <div class="rounded-2xl bg-gradient-to-br from-indigo-900/60 to-violet-900/60 border border-indigo-700/40 p-6">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">{{ settings.title || 'Untitled Quiz' }}</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm">{{ settings.description || 'No description provided.' }}</p>
        <div class="flex gap-3 mt-3 flex-wrap text-xs text-slate-600 dark:text-slate-300">
          <span class="flex items-center gap-1">⏱ {{ settings.timeLimitOn ? settings.timeLimit + ' min' : 'No limit' }}</span>
          <span class="flex items-center gap-1">📋 {{ questions.length || 0 }} questions</span>
          <span class="flex items-center gap-1">🔄 {{ settings.attempts }} attempt(s)</span>
          <span class="flex items-center gap-1">✅ Pass: {{ settings.passPercent }}%</span>
        </div>
      </div>

      <div v-if="questions.length === 0" class="text-center text-slate-500 dark:text-slate-400 py-8">
        Add questions in Step 2 to preview them here.
      </div>

      <template v-for="(q, i) in questions.slice(0,2)" :key="q.id">
        <div class="rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/50 p-5 flex flex-col gap-4">
          <div class="flex items-start gap-3">
            <span class="w-8 h-8 rounded-full bg-indigo-600/40 text-indigo-300 text-sm font-bold flex items-center justify-center shrink-0">
              {{ i+1 }}
            </span>
            <p class="text-slate-900 dark:text-white font-medium leading-relaxed">{{ q.text }}</p>
          </div>
          <div v-if="q.type==='MCQ'" class="flex flex-col gap-2 pl-11">
            <label v-for="(o, j) in q.options" :key="j"
                   class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-900/20 cursor-pointer transition-all">
              <span class="w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                {{ String.fromCharCode(65+j) }}
              </span>
              <span class="text-slate-600 dark:text-slate-300 text-sm">{{ o || 'Option ' + String.fromCharCode(65+j) }}</span>
            </label>
          </div>
          <div v-else-if="q.type==='True/False'" class="flex gap-3 pl-11">
            <button class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 text-slate-600 dark:text-slate-300 text-sm transition-all">✅ True</button>
            <button class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-500/50 text-slate-600 dark:text-slate-300 text-sm transition-all">❌ False</button>
          </div>
          <div v-else class="pl-11">
            <textarea rows="3" placeholder="Your answer…" class="form-input resize-none w-full text-sm" readonly></textarea>
          </div>
        </div>
      </template>

      <div v-if="questions.length > 2" class="text-center text-slate-500 text-sm">
        … and {{ questions.length - 2 }} more question(s)
      </div>
    </div>
  </div>

  <!-- ═══ STEP 4 – PUBLISH ═══ -->
  <div v-if="step===4" class="flex flex-col gap-5">

    <!-- Summary -->
    <div class="glass rounded-2xl p-6 flex flex-col gap-4">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">Quiz Summary</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-slate-100 dark:bg-slate-800/60 rounded-xl p-4 text-center">
          <p class="text-2xl font-extrabold gradient-text">{{ questions.length }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Questions</p>
        </div>
        <div class="bg-slate-100 dark:bg-slate-800/60 rounded-xl p-4 text-center">
          <p class="text-2xl font-extrabold text-violet-300">{{ settings.type }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Type</p>
        </div>
        <div class="bg-slate-100 dark:bg-slate-800/60 rounded-xl p-4 text-center">
          <p class="text-2xl font-extrabold text-emerald-400">{{ settings.passPercent }}%</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Pass Mark</p>
        </div>
        <div class="bg-slate-100 dark:bg-slate-800/60 rounded-xl p-4 text-center">
          <p class="text-2xl font-extrabold text-amber-400">{{ settings.timeLimitOn ? settings.timeLimit + 'm' : '∞' }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Time Limit</p>
        </div>
      </div>
      <div class="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/40 rounded-xl p-3">
        <span class="font-semibold text-slate-900 dark:text-white">Title: </span>{{ settings.title || 'Untitled' }}
      </div>
    </div>

    <!-- Access Settings -->
    <div class="glass rounded-2xl p-6 flex flex-col gap-4">
      <h2 class="text-base font-bold text-slate-900 dark:text-white">Access Settings</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button v-for="a in accessOptions" :key="a.key"
                @click="access = a.key"
                :class="['p-4 rounded-xl border-2 text-left transition-all',
                         access===a.key
                           ? 'border-indigo-500 bg-indigo-600/20 shadow-lg shadow-indigo-900/40'
                           : 'border-slate-200 dark:border-slate-700 hover:border-slate-600']">
          <div class="text-2xl mb-2">{{ a.icon }}</div>
          <p class="font-semibold text-slate-900 dark:text-white text-sm">{{ a.key }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ a.desc }}</p>
        </button>
      </div>

      <div class="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50">
        <div>
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Notify Students</p>
          <p class="text-xs text-slate-500">Send an email/push notification on publish</p>
        </div>
        <label class="toggle">
          <input id="notify-students" type="checkbox" v-model="notifyStudents" class="sr-only">
          <span class="toggle-track"></span>
        </label>
      </div>
    </div>

    <!-- Publish Button -->
    <button @click="publish"
            class="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600
                   hover:from-violet-500 hover:to-blue-500 text-slate-900 dark:text-white font-extrabold text-lg
                   shadow-xl shadow-indigo-900/50 hover:shadow-indigo-900/70 transition-all duration-300
                   hover:scale-[1.01] active:scale-100">
      🚀 Publish Quiz
    </button>
  </div>

  <!-- Navigation Buttons -->
  <div class="flex items-center justify-between pt-2">
    <div class="flex gap-2">
      <button v-if="step > 1" @click="step--"
              class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:bg-slate-700/50 transition-all text-sm font-medium">
        ← Back
      </button>
      <button @click="saveDraft"
              class="px-5 py-2.5 rounded-xl border border-indigo-700/50 text-indigo-300 hover:bg-indigo-900/30 transition-all text-sm font-medium">
        💾 Save Draft
      </button>
    </div>
    <button v-if="step < 4" @click="step++"
            class="btn-primary px-6 flex items-center gap-2">
      Next →
    </button>
  </div>

</div>
`};


/* ─────────────────────────────────────────────────────────────
   3.  Q U I Z   R E S U L T S
───────────────────────────────────────────────────────────── */
export const QuizResults = {
  name  : 'QuizResults',
  props : ['data'],
  emits : ['navigate'],

  setup(props, { emit }) {
    const dateFrom = ref('2026-06-01');
    const dateTo   = ref('2026-06-24');
    const search   = ref('');
    const sortKey  = ref('score');
    const sortAsc  = ref(false);

    const stats = reactive({
      avgScore    : 74,
      highest     : 98,
      lowest      : 42,
      passRate    : 81,
      submissions : 142,
    });

    const students = ref([
      { id:1,  name:'Alice Johnson',   score:92, time:'18:32', status:'Passed',  avatar:'AJ' },
      { id:2,  name:'Bob Martinez',    score:78, time:'24:10', status:'Passed',  avatar:'BM' },
      { id:3,  name:'Carol White',     score:55, time:'29:45', status:'Failed',  avatar:'CW' },
      { id:4,  name:'David Kim',       score:88, time:'20:01', status:'Passed',  avatar:'DK' },
      { id:5,  name:'Eva Rodriguez',   score:42, time:'30:00', status:'Failed',  avatar:'ER' },
      { id:6,  name:'Frank Chen',      score:95, time:'15:22', status:'Passed',  avatar:'FC' },
      { id:7,  name:'Grace Liu',       score:73, time:'22:18', status:'Passed',  avatar:'GL' },
      { id:8,  name:'Henry Brown',     score:66, time:'27:05', status:'Passed',  avatar:'HB' },
    ]);

    const itemAnalysis = ref([
      { q:'What is a closure in JavaScript?',          correct:72, avgTime:'0:42', diff:'Medium' },
      { q:'Which keyword declares a block-scoped var?', correct:91, avgTime:'0:18', diff:'Easy'   },
      { q:'Explain the event loop.',                   correct:48, avgTime:'1:05', diff:'Hard'   },
      { q:'What does Array.map() return?',             correct:87, avgTime:'0:25', diff:'Easy'   },
      { q:'Difference between null and undefined?',    correct:63, avgTime:'0:55', diff:'Medium' },
    ]);

    const filtered = computed(() => {
      let s = search.value.toLowerCase();
      let arr = students.value.filter(st => !s || st.name.toLowerCase().includes(s));
      arr.sort((a,b) => {
        const va = a[sortKey.value];
        const vb = b[sortKey.value];
        return sortAsc.value ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      });
      return arr;
    });

    const setSort = key => {
      if (sortKey.value === key) sortAsc.value = !sortAsc.value;
      else { sortKey.value = key; sortAsc.value = false; }
    };

    /* draw chart after mount */
    onMounted(() => {
      nextTick(() => {
        const canvas = document.getElementById('resultsChart');
        if (!canvas || !window.Chart) return;
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['0–10','11–20','21–30','31–40','41–50','51–60','61–70','71–80','81–90','91–100'],
            datasets: [{
              label: 'Students',
              data: [0, 0, 0, 0, 1, 3, 8, 22, 35, 14],
              backgroundColor: 'rgba(99,102,241,0.7)',
              borderColor: 'rgba(139,92,246,1)',
              borderWidth: 2,
              borderRadius: 6,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { labels: { color:'#94a3b8' } } },
            scales: {
              x: { ticks: { color:'#64748b' }, grid: { color:'rgba(255,255,255,0.05)' } },
              y: { ticks: { color:'#64748b' }, grid: { color:'rgba(255,255,255,0.05)' } },
            },
          },
        });
      });
    });

    const exportData = type => { alert('Exporting as ' + type + '…'); };

    return { dateFrom, dateTo, search, stats, filtered, itemAnalysis, setSort, sortKey, sortAsc, exportData, emit };
  },

  template: `
<div class="flex flex-col gap-6 min-h-screen p-6">

  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <button @click="emit('navigate','quiz-list')"
                class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors text-sm">← Back</button>
        <span class="text-slate-600">/</span>
        <span class="text-indigo-400 text-sm font-medium">JavaScript Fundamentals</span>
      </div>
      <h1 class="text-3xl font-extrabold gradient-text">Quiz Results</h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">{{ stats.submissions }} total submissions</p>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      <input type="date" v-model="dateFrom" class="form-input text-sm py-1.5" />
      <span class="text-slate-500 text-sm">to</span>
      <input type="date" v-model="dateTo"   class="form-input text-sm py-1.5" />
      <button v-for="t in ['CSV','PDF','Excel']" :key="t"
              @click="exportData(t)"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700/60 hover:bg-indigo-600/40 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all border border-slate-200 dark:border-slate-700/40">
        ↓ {{ t }}
      </button>
    </div>
  </div>

  <!-- Summary Stats -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="glass rounded-2xl p-5 flex flex-col gap-1 card-hover">
      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Score</p>
      <p class="text-4xl font-extrabold gradient-text">{{ stats.avgScore }}%</p>
      <p class="text-xs text-emerald-400">↑ 3.2% vs last quiz</p>
    </div>
    <div class="glass rounded-2xl p-5 flex flex-col gap-1 card-hover">
      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Highest</p>
      <p class="text-4xl font-extrabold text-emerald-400">{{ stats.highest }}%</p>
    </div>
    <div class="glass rounded-2xl p-5 flex flex-col gap-1 card-hover">
      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lowest</p>
      <p class="text-4xl font-extrabold text-red-400">{{ stats.lowest }}%</p>
    </div>
    <div class="glass rounded-2xl p-5 flex flex-col gap-1 card-hover">
      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pass Rate</p>
      <p class="text-4xl font-extrabold text-violet-300">{{ stats.passRate }}%</p>
      <div class="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
        <div class="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
             :style="'width:' + stats.passRate + '%'"></div>
      </div>
    </div>
  </div>

  <!-- Score Distribution Chart -->
  <div class="glass rounded-2xl p-6">
    <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">Score Distribution</h2>
    <div class="relative h-56">
      <canvas id="resultsChart"></canvas>
    </div>
  </div>

  <!-- Student Results Table -->
  <div class="glass rounded-2xl overflow-hidden">
    <div class="p-4 flex items-center justify-between border-b border-white/5">
      <h2 class="text-base font-bold text-slate-900 dark:text-white">Student Results</h2>
      <input v-model="search" type="text" placeholder="Search student…" class="form-input text-sm py-1.5 w-48" />
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-white/5">
            <th class="text-left px-4 py-3">Student</th>
            <th class="text-left px-4 py-3 cursor-pointer hover:text-slate-700 dark:text-slate-200 select-none"
                @click="setSort('score')">
              Score <span v-if="sortKey==='score'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
            <th class="text-left px-4 py-3 cursor-pointer hover:text-slate-700 dark:text-slate-200 select-none"
                @click="setSort('time')">
              Time <span v-if="sortKey==='time'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
            <th class="text-left px-4 py-3">Status</th>
            <th class="text-left px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filtered" :key="s.id"
              class="border-b border-white/5 hover:bg-white/3 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white">
                  {{ s.avatar }}
                </div>
                <span class="font-medium text-slate-700 dark:text-slate-200">{{ s.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                       :style="'width:' + s.score + '%'"></div>
                </div>
                <span class="font-semibold text-slate-900 dark:text-white">{{ s.score }}%</span>
              </div>
            </td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{{ s.time }}</td>
            <td class="px-4 py-3">
              <span :class="['badge', s.status==='Passed' ? 'badge-success' : 'badge-danger']">
                {{ s.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-1.5">
                <button class="px-2.5 py-1 rounded-lg text-xs bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-300 hover:text-slate-900 dark:text-white transition-all">View</button>
                <button class="px-2.5 py-1 rounded-lg text-xs bg-slate-200 dark:bg-slate-700/40 hover:bg-slate-600/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all">Msg</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Item Analysis -->
  <div class="glass rounded-2xl overflow-hidden">
    <div class="p-4 border-b border-white/5">
      <h2 class="text-base font-bold text-slate-900 dark:text-white">Item Analysis</h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Per-question performance breakdown</p>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-white/5">
            <th class="text-left px-4 py-3">Question</th>
            <th class="text-left px-4 py-3">Correct %</th>
            <th class="text-left px-4 py-3">Avg Time</th>
            <th class="text-left px-4 py-3">Classification</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in itemAnalysis" :key="i"
              class="border-b border-white/5 hover:bg-white/3 transition-colors">
            <td class="px-4 py-3 max-w-xs text-slate-600 dark:text-slate-300">
              <span class="font-medium text-indigo-400 mr-2">Q{{ i+1 }}.</span>{{ item.q }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div class="h-full rounded-full"
                       :class="item.correct >= 80 ? 'bg-emerald-500' : item.correct >= 60 ? 'bg-amber-500' : 'bg-red-500'"
                       :style="'width:' + item.correct + '%'"></div>
                </div>
                <span :class="['font-semibold', item.correct >= 80 ? 'text-emerald-400' : item.correct >= 60 ? 'text-amber-400' : 'text-red-400']">
                  {{ item.correct }}%
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{{ item.avgTime }}</td>
            <td class="px-4 py-3">
              <span :class="['badge', DIFFICULTY_BADGE[item.diff] || 'badge-neutral']">{{ item.diff }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
`,

  data() { return { DIFFICULTY_BADGE }; },
};


/* ─────────────────────────────────────────────────────────────
   4.  Q U E S T I O N   B A N K
───────────────────────────────────────────────────────────── */
export const QuestionBank = {
  name  : 'QuestionBank',
  props : ['data'],
  emits : ['navigate'],

  setup(props, { emit }) {
    const search      = ref('');
    const filterType  = ref('All');
    const filterDiff  = ref('All');
    const filterSubj  = ref('All');
    const filterTag   = ref('');
    const selectedCat = ref('All');
    const viewMode    = ref('grid');  // 'grid' | 'list'
    const currentPage = ref(1);
    const perPage     = 8;

    const categories = [
      { name:'All',           icon:'📦', count:94 },
      { name:'Programming',   icon:'💻', count:32 },
      { name:'Biology',       icon:'🧬', count:18 },
      { name:'History',       icon:'📜', count:14 },
      { name:'Mathematics',   icon:'📐', count:20 },
      { name:'Chemistry',     icon:'⚗️', count:10 },
    ];

    const tags = ['JavaScript','ES6','Arrays','Functions','DOM','Promises','Closures','OOP','React','Node.js'];

    const allQuestions = ref([
      { id:1,  type:'MCQ',       difficulty:'Medium', subject:'Programming', text:'What is a closure in JavaScript?',                      usage:14, passRate:72, tags:['JavaScript','Closures'] },
      { id:2,  type:'True/False',difficulty:'Easy',   subject:'Programming', text:'JavaScript is single-threaded.',                        usage:8,  passRate:91, tags:['JavaScript'] },
      { id:3,  type:'MCQ',       difficulty:'Hard',   subject:'Mathematics', text:'Solve: ∫ x² dx from 0 to 3',                            usage:5,  passRate:48, tags:['Calculus'] },
      { id:4,  type:'Essay',     difficulty:'Hard',   subject:'Biology',     text:'Explain the process of mitosis.',                       usage:3,  passRate:55, tags:['Cell Biology'] },
      { id:5,  type:'MCQ',       difficulty:'Easy',   subject:'Programming', text:'Which keyword is used to declare a constant in JS?',    usage:22, passRate:95, tags:['JavaScript','ES6'] },
      { id:6,  type:'Fill-in',   difficulty:'Medium', subject:'Chemistry',   text:'The atomic number of Carbon is ___.',                   usage:7,  passRate:78, tags:['Atoms'] },
      { id:7,  type:'Matching',  difficulty:'Medium', subject:'History',     text:'Match the event to the correct year.',                  usage:4,  passRate:62, tags:['WWII'] },
      { id:8,  type:'MCQ',       difficulty:'Easy',   subject:'Biology',     text:'What is the powerhouse of the cell?',                   usage:19, passRate:97, tags:['Cell Biology'] },
      { id:9,  type:'Ordering',  difficulty:'Hard',   subject:'Programming', text:'Order the steps of a HTTP request-response cycle.',     usage:6,  passRate:44, tags:['Node.js','Networking'] },
      { id:10, type:'MCQ',       difficulty:'Medium', subject:'Mathematics', text:'What is the derivative of sin(x)?',                    usage:11, passRate:81, tags:['Calculus'] },
    ]);

    const filtered = computed(() => {
      const s = search.value.toLowerCase();
      return allQuestions.value.filter(q => {
        return (
          (selectedCat.value === 'All' || q.subject === selectedCat.value) &&
          (filterType.value  === 'All' || q.type    === filterType.value)  &&
          (filterDiff.value  === 'All' || q.difficulty === filterDiff.value) &&
          (filterSubj.value  === 'All' || q.subject    === filterSubj.value) &&
          (!filterTag.value || q.tags.includes(filterTag.value)) &&
          (!s || q.text.toLowerCase().includes(s) || q.subject.toLowerCase().includes(s))
        );
      });
    });

    const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)));
    const paginated  = computed(() => {
      const start = (currentPage.value-1) * perPage;
      return filtered.value.slice(start, start+perPage);
    });
    watch(filtered, () => { currentPage.value = 1; });

    const useQuestion = q => { alert('Added "' + q.text.slice(0,40) + '…" to quiz.'); };
    const deleteQ     = id => { allQuestions.value = allQuestions.value.filter(q => q.id !== id); };
    const importCSV   = () => { alert('CSV import dialog…'); };
    const aiGenerate  = () => { alert('AI question generator…'); };

    return {
      search, filterType, filterDiff, filterSubj, filterTag,
      selectedCat, viewMode,
      categories, tags,
      paginated, filtered, currentPage, totalPages,
      DIFFICULTY_BADGE, STATUS_BADGE,
      useQuestion, deleteQ, importCSV, aiGenerate, emit,
    };
  },

  template: `
<div class="flex gap-5 min-h-screen p-6">

  <!-- Left Sidebar -->
  <div class="flex flex-col gap-4 w-56 shrink-0">

    <!-- Category Tree -->
    <div class="glass rounded-2xl p-4 flex flex-col gap-1">
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Categories</p>
      <button v-for="cat in categories" :key="cat.name"
              @click="selectedCat = cat.name"
              :class="['flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all',
                       selectedCat===cat.name
                         ? 'bg-indigo-600/40 text-indigo-200 font-semibold border border-indigo-500/40'
                         : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700/50 hover:text-slate-700 dark:text-slate-200']">
        <span class="flex items-center gap-2">
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
        </span>
        <span :class="['text-xs px-1.5 py-0.5 rounded-full',
                       selectedCat===cat.name ? 'bg-indigo-600 text-slate-900 dark:text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400']">
          {{ cat.count }}
        </span>
      </button>
    </div>

    <!-- Tag Cloud -->
    <div class="glass rounded-2xl p-4">
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Tags</p>
      <div class="flex flex-wrap gap-1.5">
        <button v-for="tag in tags" :key="tag"
                @click="filterTag = filterTag===tag ? '' : tag"
                :class="['px-2 py-1 rounded-lg text-xs transition-all',
                         filterTag===tag
                           ? 'bg-indigo-600 text-slate-900 dark:text-white font-semibold'
                           : 'bg-slate-200 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 hover:bg-slate-600/60 hover:text-slate-700 dark:text-slate-200']">
          #{{ tag }}
        </button>
      </div>
    </div>

  </div>

  <!-- Main Area -->
  <div class="flex flex-col gap-4 flex-1 min-w-0">

    <!-- Top Actions + Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold gradient-text">Question Bank</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">{{ filtered.length }} questions found</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button @click="importCSV"
                class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-200 dark:bg-slate-700/60 hover:bg-slate-600/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/40 transition-all flex items-center gap-1.5">
          📥 Import CSV
        </button>
        <button @click="aiGenerate"
                class="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600/80 to-indigo-600/80 hover:opacity-90 text-slate-900 dark:text-white border border-violet-500/40 transition-all flex items-center gap-1.5">
          ✨ AI Generate
        </button>
        <div class="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <button @click="viewMode='grid'"
                  :class="['px-3 py-2 text-sm transition-all', viewMode==='grid' ? 'bg-indigo-600 text-slate-900 dark:text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700']">⊞</button>
          <button @click="viewMode='list'"
                  :class="['px-3 py-2 text-sm transition-all', viewMode==='list' ? 'bg-indigo-600 text-slate-900 dark:text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700']">☰</button>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="glass rounded-2xl p-3 flex flex-wrap gap-2">
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search questions…" class="form-input pl-9 w-full text-sm py-1.5" />
      </div>
      <select v-model="filterType" class="form-input text-sm py-1.5 flex-1 min-w-[110px]">
        <option>All</option><option>MCQ</option><option>True/False</option>
        <option>Fill-in</option><option>Matching</option><option>Ordering</option><option>Essay</option>
      </select>
      <select v-model="filterDiff" class="form-input text-sm py-1.5 flex-1 min-w-[110px]">
        <option>All</option><option>Easy</option><option>Medium</option><option>Hard</option>
      </select>
      <select v-model="filterSubj" class="form-input text-sm py-1.5 flex-1 min-w-[120px]">
        <option>All</option><option>Programming</option><option>Biology</option><option>History</option>
        <option>Mathematics</option><option>Chemistry</option>
      </select>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode==='grid'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="q in paginated" :key="q.id"
           class="glass rounded-2xl p-4 flex flex-col gap-3 card-hover">
        <!-- badges -->
        <div class="flex flex-wrap gap-1.5">
          <span class="badge badge-primary text-xs">{{ q.type }}</span>
          <span :class="'badge ' + (DIFFICULTY_BADGE[q.difficulty] || 'badge-neutral') + ' text-xs'">{{ q.difficulty }}</span>
          <span class="badge badge-info text-xs">{{ q.subject }}</span>
        </div>
        <!-- text -->
        <p class="text-slate-700 dark:text-slate-200 font-medium text-sm leading-relaxed line-clamp-2">{{ q.text }}</p>
        <!-- tags -->
        <div class="flex flex-wrap gap-1">
          <span v-for="t in q.tags" :key="t"
                class="px-1.5 py-0.5 rounded text-xs bg-indigo-900/40 text-indigo-300">#{{ t }}</span>
        </div>
        <!-- stats -->
        <div class="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Used {{ q.usage }}×</span>
          <span :class="q.passRate >= 80 ? 'text-emerald-400' : q.passRate >= 60 ? 'text-amber-400' : 'text-red-400'">
            {{ q.passRate }}% pass
          </span>
        </div>
        <!-- actions -->
        <div class="flex gap-1.5 pt-2 border-t border-white/5">
          <button @click="useQuestion(q)"
                  class="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/40 hover:bg-indigo-600/70 text-indigo-200 hover:text-slate-900 dark:text-white transition-all">
            + Use
          </button>
          <button class="py-1.5 px-2.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700/40 hover:bg-slate-600/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all">
            Edit
          </button>
          <button class="py-1.5 px-2.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700/40 hover:bg-slate-600/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all">
            Hist
          </button>
          <button @click="deleteQ(q.id)"
                  class="py-1.5 px-2.5 rounded-lg text-xs bg-red-600/20 hover:bg-red-600/50 text-red-400 hover:text-slate-900 dark:text-white transition-all">
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="glass rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-white/5">
            <th class="text-left px-4 py-3">Question</th>
            <th class="text-left px-4 py-3 hidden sm:table-cell">Type</th>
            <th class="text-left px-4 py-3 hidden md:table-cell">Difficulty</th>
            <th class="text-left px-4 py-3 hidden lg:table-cell">Pass Rate</th>
            <th class="text-left px-4 py-3 hidden lg:table-cell">Used</th>
            <th class="text-left px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="q in paginated" :key="q.id"
              class="border-b border-white/5 hover:bg-white/3 transition-colors">
            <td class="px-4 py-3 max-w-xs">
              <p class="text-slate-700 dark:text-slate-200 font-medium truncate">{{ q.text }}</p>
              <p class="text-xs text-indigo-400 mt-0.5">{{ q.subject }}</p>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="badge badge-primary text-xs">{{ q.type }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span :class="'badge ' + (DIFFICULTY_BADGE[q.difficulty] || 'badge-neutral') + ' text-xs'">{{ q.difficulty }}</span>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell">
              <span :class="q.passRate >= 80 ? 'text-emerald-400' : q.passRate >= 60 ? 'text-amber-400' : 'text-red-400'" class="font-semibold">
                {{ q.passRate }}%
              </span>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell text-slate-500 dark:text-slate-400 text-xs">{{ q.usage }}×</td>
            <td class="px-4 py-3">
              <div class="flex gap-1">
                <button @click="useQuestion(q)"
                        class="px-2 py-1 rounded-lg text-xs bg-indigo-600/40 hover:bg-indigo-600/70 text-indigo-200 transition-all">Use</button>
                <button class="px-2 py-1 rounded-lg text-xs bg-slate-200 dark:bg-slate-700/40 hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all">Edit</button>
                <button @click="deleteQ(q.id)"
                        class="px-2 py-1 rounded-lg text-xs bg-red-600/20 hover:bg-red-600/50 text-red-400 transition-all">✕</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="paginated.length === 0" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div class="w-16 h-16 rounded-full bg-indigo-900/40 flex items-center justify-center">
        <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
        </svg>
      </div>
      <p class="text-slate-600 dark:text-slate-300 font-semibold">No questions match your filters</p>
      <p class="text-slate-500 text-sm">Try adjusting the search or category</p>
    </div>

    <!-- Pagination -->
    <div v-if="filtered.length > 0" class="flex items-center justify-between mt-auto">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        {{ Math.min((currentPage-1)*8+1, filtered.length) }}–{{ Math.min(currentPage*8, filtered.length) }}
        of {{ filtered.length }}
      </p>
      <div class="flex gap-1.5">
        <button @click="currentPage = Math.max(1, currentPage-1)"
                :disabled="currentPage===1"
                class="px-3 py-1.5 rounded-lg text-sm bg-slate-200 dark:bg-slate-700/50 hover:bg-indigo-600/50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 transition-all">
          ‹
        </button>
        <button v-for="p in totalPages" :key="p"
                @click="currentPage = p"
                :class="['px-3 py-1.5 rounded-lg text-sm transition-all',
                         p===currentPage ? 'bg-indigo-600 text-slate-900 dark:text-white' : 'bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-600 text-slate-600 dark:text-slate-300']">
          {{ p }}
        </button>
        <button @click="currentPage = Math.min(totalPages, currentPage+1)"
                :disabled="currentPage===totalPages"
                class="px-3 py-1.5 rounded-lg text-sm bg-slate-200 dark:bg-slate-700/50 hover:bg-indigo-600/50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 transition-all">
          ›
        </button>
      </div>
    </div>

  </div>
</div>
`};
