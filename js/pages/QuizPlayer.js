import { Icons } from '../icons.js';

export const QuizLobby = {
  name: 'QuizLobby',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    return { Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-mesh-gradient opacity-30"></div>
      
      <div class="glass max-w-2xl w-full p-8 rounded-2xl shadow-card border border-indigo-500/20 relative z-10">
        <button @click="navigate('student')" class="absolute top-6 left-6 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          <span class="w-4 h-4 transform rotate-180" v-html="Icons.chevronRight"></span> Back
        </button>

        <div class="text-center mt-8 mb-8">
          <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4" v-html="Icons.quiz"></div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">{{ data.activeQuiz.title }}</h1>
          <p class="text-slate-500 dark:text-slate-400">Please read the instructions carefully before starting.</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div class="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Questions</p>
            <p class="text-xl font-bold text-slate-900 dark:text-white">{{ data.activeQuiz.totalQuestions }}</p>
          </div>
          <div class="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Time Limit</p>
            <p class="text-xl font-bold text-slate-900 dark:text-white">{{ data.activeQuiz.timeLimit / 60 }} min</p>
          </div>
          <div class="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Attempts</p>
            <p class="text-xl font-bold text-slate-900 dark:text-white">1 allowed</p>
          </div>
          <div class="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Pass Mark</p>
            <p class="text-xl font-bold text-slate-900 dark:text-white">70%</p>
          </div>
        </div>

        <div class="space-y-4 mb-8">
          <div class="flex items-start gap-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <div class="text-violet-400 mt-0.5" v-html="Icons.ai"></div>
            <div>
              <h3 class="text-slate-900 dark:text-white font-medium mb-1">AI Adaptive Assessment</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">This quiz adapts to your skill level. Questions will get harder or easier based on your previous answers.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div class="text-indigo-400 mt-0.5" v-html="Icons.shield"></div>
            <div>
              <h3 class="text-slate-900 dark:text-white font-medium mb-1">Secure Environment</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">Tab switching and copy-pasting are monitored during this assessment.</p>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button @click="navigate('quiz-run')" class="btn-primary px-10 py-4 rounded-xl text-lg font-bold text-slate-900 dark:text-white shadow-glow">Begin Assessment</button>
        </div>
      </div>
    </div>
  `
};

export const QuizPlayer = {
  name: 'QuizPlayer',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, onMounted, onUnmounted, computed } = Vue;
    const currentQIdx = ref(0);
    const answers = ref({}); // Track selected options by question index
    const timeLeft = ref(props.data.activeQuiz.timeLimit);
    const timer = ref(null);
    const showHint = ref(false);
    
    const question = computed(() => props.data.activeQuiz.questions[currentQIdx.value] || props.data.activeQuiz.questions[0]);
    const isLast = computed(() => currentQIdx.value === props.data.activeQuiz.questions.length - 1);
    
    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    };

    onMounted(() => {
      timer.value = setInterval(() => {
        if (timeLeft.value > 0) timeLeft.value--;
        else {
          clearInterval(timer.value);
          submitQuiz(); // Auto submit when time runs out
        }
      }, 1000);
    });

    onUnmounted(() => { clearInterval(timer.value); });

    const selectOption = (optId) => { answers.value[currentQIdx.value] = optId; };
    
    const nextQuestion = () => {
      if (isLast.value) submitQuiz();
      else { currentQIdx.value++; showHint.value = false; }
    };

    const goToQuestion = (idx) => {
      currentQIdx.value = idx;
      showHint.value = false;
    };

    const submitQuiz = () => {
      const qz = props.data.activeQuiz;
      let correctCount = 0;
      
      const questionResults = qz.questions.map((q, i) => {
        const userAnsId = answers.value[i];
        const isCorrect = userAnsId === q.correct;
        if (isCorrect) correctCount++;
        
        const userAnsObj = q.options.find(o => o.id === userAnsId);
        const correctAnsObj = q.options.find(o => o.id === q.correct);
        
        return {
          id: q.id,
          text: q.text,
          yourAnswer: userAnsObj ? userAnsObj.text : 'No Answer',
          correctAnswer: correctAnsObj ? correctAnsObj.text : 'Unknown',
          isCorrect,
          explanation: q.explanation,
          difficulty: q.difficulty
        };
      });

      const total = qz.questions.length;
      const score = Math.round((correctCount / total) * 100);
      const timeTakenSecs = qz.timeLimit - timeLeft.value;
      const timeTakenStr = Math.floor(timeTakenSecs / 60) + 'm ' + (timeTakenSecs % 60) + 's';
      
      const badgesUnlocked = [];
      if (score === 100) badgesUnlocked.push('Perfect Score');
      if (timeTakenSecs < qz.timeLimit / 2 && score >= qz.passMark) badgesUnlocked.push('Speed Demon');

      // Save real results to mockData so QuizResultsPage can display them
      props.data.lastQuizResults = {
        correct: correctCount,
        total,
        wrong: total - correctCount,
        score,
        timeTaken: timeTakenStr,
        xpEarned: (score * 5) + (timeTakenSecs < qz.timeLimit / 2 ? 50 : 0),
        badgesUnlocked,
        questionResults
      };

      emit('navigate', 'results');
    };

    return { 
      Icons, 
      navigate: (page) => emit('navigate', page), 
      currentQIdx, 
      question, 
      answers, 
      selectOption, 
      nextQuestion, 
      goToQuestion,
      isLast, 
      timeLeft, 
      formatTime,
      showHint,
      submitQuiz
    };
  },
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <div class="glass px-6 py-4 flex justify-between items-center border-b border-indigo-500/20 z-20 relative">
        <h1 class="font-bold text-slate-900 dark:text-white text-lg">{{ data.activeQuiz.title }}</h1>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-slate-500 dark:text-slate-400" v-html="Icons.clock"></span>
            <span class="font-mono text-lg font-bold" :class="timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-slate-900 dark:text-white'">{{ formatTime(timeLeft) }}</span>
          </div>
          <button @click="navigate(data.currentUser ? 'student' : 'landing')" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors" v-html="Icons.x"></button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden relative z-10">
        <!-- Left Sidebar Navigator -->
        <div class="w-20 md:w-64 glass border-r border-indigo-500/20 p-4 flex flex-col overflow-y-auto">
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 hidden md:block">Questions</p>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
            <button v-for="(q, i) in data.activeQuiz.questions" :key="q.id" 
              @click="goToQuestion(i)"
              :class="['h-10 rounded-lg font-bold flex items-center justify-center transition-all', 
                       currentQIdx === i ? 'bg-white text-indigo-600 shadow-glow-sm' : 
                       answers[i] ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30' : 
                       'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:bg-slate-700']">
              {{ i + 1 }}
            </button>
          </div>
        </div>

        <!-- Main Question Area -->
        <div class="flex-1 overflow-y-auto p-6 md:p-12">
          <div class="max-w-3xl mx-auto">
            <div class="flex justify-between items-center mb-8">
              <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700">
                Question {{ currentQIdx + 1 }} of {{ data.activeQuiz.questions.length }}
              </span>
              <span :class="['px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider', 
                             question.difficulty === 'hard' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                             question.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                             'bg-green-500/20 text-green-400 border border-green-500/30']">
                {{ question.difficulty }}
              </span>
            </div>

            <h2 class="text-2xl md:text-3xl font-medium text-slate-900 dark:text-white mb-8 leading-relaxed">{{ question.text }}</h2>

            <div v-if="question.type === 'mcq' || question.type === 'truefalse'" class="space-y-4">
              <div v-for="opt in question.options" :key="opt.id"
                @click="selectOption(opt.id)"
                :class="['question-option flex items-center gap-4 text-lg font-medium', answers[currentQIdx] === opt.id ? 'selected' : 'text-slate-600 dark:text-slate-300']">
                <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors', 
                              answers[currentQIdx] === opt.id ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-500']">
                  <div v-if="answers[currentQIdx] === opt.id" class="w-3 h-3 rounded-full bg-indigo-400"></div>
                </div>
                {{ opt.text }}
              </div>
            </div>

            <div class="mt-12 flex justify-end">
              <button @click="nextQuestion" 
                :class="['btn-primary px-8 py-3 rounded-xl font-bold text-slate-900 dark:text-white transition-opacity', (!answers[currentQIdx] && !isLast) ? 'opacity-50 hover:opacity-50' : '']">
                {{ isLast ? 'Submit Quiz' : 'Next Question' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Right Sidebar AI Hint -->
        <div class="hidden xl:block w-80 glass border-l border-indigo-500/20 p-6 flex flex-col">
          <div class="flex items-center gap-2 mb-6">
            <span class="ai-badge"><span v-html="Icons.ai" class="w-3.5 h-3.5"></span> Engine Active</span>
          </div>
          
          <div class="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase font-bold tracking-wider">Difficulty Path</p>
            <div class="flex items-end gap-1 h-12 mb-2">
              <div class="w-full bg-green-500/80 rounded-t h-4"></div>
              <div class="w-full bg-amber-500/80 rounded-t h-8"></div>
              <div class="w-full bg-red-500/80 rounded-t h-12 shadow-glow-sm relative">
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-900 dark:text-white">Current</div>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-t h-10 opacity-30"></div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-t h-12 opacity-30"></div>
            </div>
            <p class="text-[10px] text-slate-500 text-center">Adaptive curve based on IRT</p>
          </div>

          <div class="flex-1">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase font-bold tracking-wider">Stuck?</p>
            <button v-if="!showHint" @click="showHint = true" class="w-full p-4 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center justify-center gap-2 font-medium">
              <span v-html="Icons.hint"></span> Generate AI Hint
            </button>
            <div v-else class="p-4 rounded-xl border border-violet-500/30 bg-violet-500/10">
              <h4 class="text-violet-300 font-bold mb-2 flex items-center gap-2"><span v-html="Icons.hint" class="w-4 h-4"></span> Hint</h4>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ question.hint }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};
