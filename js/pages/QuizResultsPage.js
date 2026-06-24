// ============================================================
// QuizForge — Quiz Results Page
// Full animated results screen with score ring, question review,
// XP rewards, and badge unlocks.
// ============================================================

export const QuizResultsPage = {
  name: 'QuizResultsPage',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, computed, onMounted } = Vue;

    // ── Derive results from activeQuiz answers ─────────────────
    const quiz = computed(() => props.data?.activeQuiz || {
      title: 'Advanced JavaScript Concepts',
      totalQuestions: 10,
      passMark: 70,
    });

    // Build a fake results set if real answers aren't stored
    const results = computed(() => {
      if (props.data?.lastQuizResults) return props.data.lastQuizResults;
      const q = quiz.value;
      const total = q.totalQuestions || 10;
      const correct = Math.round(total * 0.75);
      return {
        correct,
        total,
        wrong: total - correct,
        score: Math.round((correct / total) * 100),
        timeTaken: '8m 42s',
        xpEarned: 320,
        badgesUnlocked: ['Speed Demon'],
        questionResults: (q.questions || []).map((qq, i) => ({
          id: qq.id || i + 1,
          text: qq.text || `Question ${i + 1}`,
          yourAnswer: qq.options?.[Math.floor(Math.random() * qq.options.length)]?.text || 'Option B',
          correctAnswer: qq.options?.find(o => o.id === qq.correct)?.text || 'Option B',
          isCorrect: Math.random() > 0.25,
          explanation: qq.explanation || 'This is the correct explanation for this question.',
          difficulty: qq.difficulty || 'medium',
        })),
      };
    });

    const passed = computed(() => results.value.score >= (quiz.value.passMark || 70));

    // Animate the score ring
    const animatedScore = ref(0);
    const expandedQuestion = ref(null);
    const confettiEmojis = ['🎉', '⭐', '🏆', '✨', '🎊', '💎', '🚀', '🌟'];

    onMounted(() => {
      let start = 0;
      const target = results.value.score;
      const duration = 1500;
      const step = duration / target;
      const timer = setInterval(() => {
        start += 1;
        animatedScore.value = start;
        if (start >= target) clearInterval(timer);
      }, step);
    });

    // SVG ring helpers
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = computed(() => {
      const progress = animatedScore.value / 100;
      return circumference * (1 - progress);
    });

    const navigate = (page) => emit('navigate', page);
    const toggleQuestion = (id) => {
      expandedQuestion.value = expandedQuestion.value === id ? null : id;
    };

    return {
      quiz, results, passed, animatedScore, expandedQuestion, confettiEmojis,
      radius, circumference, strokeDashoffset,
      navigate, toggleQuestion,
    };
  },

  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-y-auto relative">
      <!-- Background glow -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden">
        <div v-if="passed" class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500 rounded-full filter blur-[120px] opacity-10 animate-pulse-slow"></div>
        <div v-else class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-500 rounded-full filter blur-[120px] opacity-10 animate-pulse-slow"></div>
        <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full filter blur-[150px] opacity-10"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 py-12">

        <!-- ── Hero Result Card ─────────────────────────────────────── -->
        <div class="glass rounded-3xl border overflow-hidden mb-8"
             :class="passed ? 'border-green-500/30' : 'border-red-500/30'">

          <!-- Pass/Fail Banner -->
          <div class="py-3 px-6 text-center text-sm font-bold uppercase tracking-widest"
               :class="passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
            {{ passed ? '🎉 Congratulations — You Passed!' : '📚 Keep Going — You Can Do It!' }}
          </div>

          <div class="p-8 md:p-12">
            <div class="flex flex-col md:flex-row items-center gap-10">

              <!-- Score Ring -->
              <div class="flex-shrink-0 relative">
                <svg :width="radius*2+20" :height="radius*2+20" class="drop-shadow-lg">
                  <!-- Track -->
                  <circle
                    :cx="radius+10" :cy="radius+10" :r="radius"
                    fill="none" stroke="rgba(255,255,255,0.05)" :stroke-width="12"
                  />
                  <!-- Progress arc -->
                  <circle
                    :cx="radius+10" :cy="radius+10" :r="radius"
                    fill="none"
                    :stroke="passed ? '#4ade80' : '#f87171'"
                    :stroke-width="12"
                    stroke-linecap="round"
                    class="timer-ring"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="strokeDashoffset"
                    style="transition: stroke-dashoffset 0.05s linear;"
                  />
                  <!-- Score text -->
                  <text :x="radius+10" :y="radius+10" text-anchor="middle" dominant-baseline="central">
                    <tspan
                      :fill="passed ? '#4ade80' : '#f87171'"
                      font-size="30" font-weight="800" font-family="Inter, sans-serif">
                      {{ animatedScore }}%
                    </tspan>
                  </text>
                </svg>
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold px-3 py-1 rounded-full"
                     :class="passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
                  {{ passed ? 'PASSED' : 'FAILED' }}
                </div>
              </div>

              <!-- Summary -->
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{{ quiz.title }}</h1>
                <p class="text-slate-500 dark:text-slate-400 mb-8">Pass mark: {{ quiz.passMark || 70 }}% &nbsp;|&nbsp; Time taken: {{ results.timeTaken }}</p>

                <div class="grid grid-cols-3 gap-4 mb-8">
                  <div class="glass-light p-4 rounded-2xl text-center">
                    <p class="text-3xl font-black text-green-400">{{ results.correct }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">CORRECT</p>
                  </div>
                  <div class="glass-light p-4 rounded-2xl text-center">
                    <p class="text-3xl font-black text-red-400">{{ results.wrong }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">WRONG</p>
                  </div>
                  <div class="glass-light p-4 rounded-2xl text-center">
                    <p class="text-3xl font-black text-indigo-400">{{ results.total }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">TOTAL</p>
                  </div>
                </div>

                <!-- XP + Badges -->
                <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold">
                    <span class="text-lg">⚡</span>
                    <span>+{{ results.xpEarned }} XP Earned</span>
                  </div>
                  <div v-for="badge in results.badgesUnlocked" :key="badge"
                       class="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold">
                    <span class="text-lg">🏅</span>
                    <span>{{ badge }} Unlocked!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Action Buttons ──────────────────────────────────────── -->
        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <button @click="navigate('quiz-lobby')"
                  class="flex-1 py-3 rounded-xl font-bold text-slate-900 dark:text-white glass border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Retake Quiz
          </button>
          <button @click="navigate('analytics')"
                  class="flex-1 py-3 rounded-xl font-bold text-slate-900 dark:text-white glass border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            View Analytics
          </button>
          <button @click="navigate(data.currentUser ? 'student' : 'landing')"
                  class="flex-1 btn-primary py-3 rounded-xl font-bold text-slate-900 dark:text-white shadow-glow flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            {{ data.currentUser ? 'Back to Dashboard' : 'Back to Home' }}
          </button>
        </div>

        <!-- ── Question Review ─────────────────────────────────────── -->
        <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Question Review</h2>
            <div class="flex gap-3 text-xs font-semibold">
              <span class="flex items-center gap-1.5 text-green-400"><span class="w-2.5 h-2.5 rounded-full bg-green-400"></span>Correct</span>
              <span class="flex items-center gap-1.5 text-red-400"><span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>Wrong</span>
            </div>
          </div>

          <div class="divide-y divide-slate-700/50">
            <div v-for="(q, idx) in results.questionResults" :key="q.id"
                 class="p-5 hover:bg-slate-100 dark:bg-slate-800/30 transition-colors">

              <button class="w-full text-left" @click="toggleQuestion(q.id)">
                <div class="flex items-start gap-4">
                  <!-- Result icon -->
                  <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold',
                    q.isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30']">
                    {{ q.isCorrect ? '✓' : '✗' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Q{{ idx + 1 }}</span>
                      <div class="flex items-center gap-2">
                        <span :class="['text-xs font-bold uppercase', q.difficulty === 'hard' ? 'text-red-400' : q.difficulty === 'medium' ? 'text-amber-400' : 'text-green-400']">
                          {{ q.difficulty }}
                        </span>
                        <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200"
                             :class="expandedQuestion === q.id ? 'rotate-90' : ''"
                             fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                    <p class="text-slate-900 dark:text-white font-medium leading-snug">{{ q.text }}</p>
                  </div>
                </div>
              </button>

              <!-- Expanded detail -->
              <div v-if="expandedQuestion === q.id" class="mt-4 ml-12 space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p class="text-xs font-bold text-green-400 mb-1 uppercase tracking-wider">Correct Answer</p>
                    <p class="text-slate-900 dark:text-white text-sm">{{ q.correctAnswer }}</p>
                  </div>
                  <div :class="['p-3 rounded-xl border', q.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20']">
                    <p :class="['text-xs font-bold mb-1 uppercase tracking-wider', q.isCorrect ? 'text-green-400' : 'text-red-400']">Your Answer</p>
                    <p class="text-slate-900 dark:text-white text-sm">{{ q.yourAnswer }}</p>
                  </div>
                </div>
                <div class="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p class="text-xs font-bold text-indigo-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Explanation
                  </p>
                  <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{{ q.explanation }}</p>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="!results.questionResults || results.questionResults.length === 0"
                 class="p-12 text-center text-slate-500">
              <p class="text-4xl mb-3">📋</p>
              <p class="font-medium">No question data available for review.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
};
