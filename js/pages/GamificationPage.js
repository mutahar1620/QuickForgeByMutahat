export const GamificationPage = {
  name: 'GamificationPage',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, computed, onMounted } = Vue;

    // ── Tab state ──────────────────────────────────────────────────────────
    const activeTab = ref('leaderboard');
    const tabs = [
      { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
      { id: 'badges',      label: 'Badges',       icon: '🎖️' },
      { id: 'streaks',     label: 'Streaks',       icon: '🔥' },
      { id: 'certificates',label: 'Certificates',  icon: '📜' },
      { id: 'challenges',  label: 'Challenge Mode', icon: '⚔️' },
    ];

    // ── Leaderboard ────────────────────────────────────────────────────────
    const selectedClass  = ref('all');
    const timeFilter     = ref('week');
    const classOptions   = [
      { value: 'all', label: 'All Classes' },
      { value: 'a',   label: 'Class A' },
      { value: 'b',   label: 'Class B' },
      { value: 'c',   label: 'Class C' },
      { value: 'd',   label: 'Class D' },
    ];
    const timeOptions = [
      { value: 'today', label: 'Today' },
      { value: 'week',  label: 'This Week' },
      { value: 'month', label: 'This Month' },
      { value: 'all',   label: 'All Time' },
    ];

    // Fallback leaderboard data
    const leaderboardData = computed(() => {
      if (props.data?.leaderboard?.length) return props.data.leaderboard;
      return [
        { id: 1, name: 'Aisha Rahman',   avatar: 'AR', xp: 12840, badges: 24, streak: 21, score: 98, change: +3 },
        { id: 2, name: 'Ben Carter',     avatar: 'BC', xp: 11620, badges: 19, streak: 14, score: 95, change: -1 },
        { id: 3, name: 'Clara Novak',    avatar: 'CN', xp: 10980, badges: 21, streak: 18, score: 93, change: +1 },
        { id: 4, name: 'Diego Reyes',    avatar: 'DR', xp:  9750, badges: 16, streak:  9, score: 90, change: +2 },
        { id: 5, name: 'Elena Petrov',   avatar: 'EP', xp:  9100, badges: 14, streak:  7, score: 88, change: -2 },
        { id: 6, name: 'Felix Kim',      avatar: 'FK', xp:  8430, badges: 12, streak: 12, score: 85, change:  0 },
        { id: 7, name: 'Grace Liu',      avatar: 'GL', xp:  7820, badges: 11, streak:  5, score: 82, change: +4 },
        { id: 8, name: 'Hiro Tanaka',    avatar: 'HT', xp:  7100, badges:  9, streak:  3, score: 79, change: -1 },
        { id: 9, name: 'You (Irene M.)', avatar: 'IM', xp:  6800, badges: 10, streak:  7, score: 76, change: +1, isMe: true },
      ];
    });

    const podium    = computed(() => leaderboardData.value.slice(0, 3));
    const tableRows = computed(() => leaderboardData.value.slice(3, 8));
    const myRow     = computed(() => leaderboardData.value.find(r => r.isMe));

    // ── Badges ─────────────────────────────────────────────────────────────
    const badgeFilter = ref('all');
    const badgeFilters = [
      { value: 'all',       label: 'All' },
      { value: 'earned',    label: 'Earned' },
      { value: 'locked',    label: 'Locked' },
      { value: 'common',    label: 'Common' },
      { value: 'rare',      label: 'Rare' },
      { value: 'epic',      label: 'Epic' },
      { value: 'legendary', label: 'Legendary' },
    ];

    const allBadges = computed(() => {
      if (props.data?.badges?.length) return props.data.badges;
      return [
        { id: 1,  icon: '🌟', name: 'First Steps',      rarity: 'common',    xp: 50,   earned: true,  earnedDate: '2026-01-10', desc: 'Complete your very first quiz.' },
        { id: 2,  icon: '🔥', name: 'On Fire',          rarity: 'common',    xp: 100,  earned: true,  earnedDate: '2026-01-15', desc: 'Maintain a 3-day streak.' },
        { id: 3,  icon: '🎯', name: 'Sharpshooter',     rarity: 'rare',      xp: 200,  earned: true,  earnedDate: '2026-02-03', desc: 'Score 100% on any quiz.' },
        { id: 4,  icon: '📚', name: 'Bookworm',         rarity: 'common',    xp: 75,   earned: true,  earnedDate: '2026-02-20', desc: 'Complete 10 quizzes.' },
        { id: 5,  icon: '⚡', name: 'Speed Demon',      rarity: 'rare',      xp: 250,  earned: true,  earnedDate: '2026-03-05', desc: 'Finish a 20-question quiz in under 5 minutes.' },
        { id: 6,  icon: '🏆', name: 'Champion',         rarity: 'epic',      xp: 500,  earned: true,  earnedDate: '2026-03-22', desc: 'Reach #1 on the weekly leaderboard.' },
        { id: 7,  icon: '🧠', name: 'Big Brain',        rarity: 'epic',      xp: 450,  earned: false, earnedDate: null,         desc: 'Score 90%+ on 10 consecutive quizzes.' },
        { id: 8,  icon: '🌍', name: 'World Scholar',    rarity: 'rare',      xp: 300,  earned: false, earnedDate: null,         desc: 'Complete quizzes across 5 different subjects.' },
        { id: 9,  icon: '💎', name: 'Diamond Mind',     rarity: 'legendary', xp: 1000, earned: false, earnedDate: null,         desc: 'Achieve a 30-day streak with an average score of 95%.' },
        { id: 10, icon: '🚀', name: 'To The Moon',      rarity: 'legendary', xp: 1500, earned: false, earnedDate: null,         desc: 'Accumulate 10,000 XP in a single month.' },
        { id: 11, icon: '🤝', name: 'Team Player',      rarity: 'common',    xp: 80,   earned: false, earnedDate: null,         desc: 'Participate in 5 challenge matches.' },
        { id: 12, icon: '🎭', name: 'Versatile',        rarity: 'rare',      xp: 350,  earned: false, earnedDate: null,         desc: 'Score above 85% in every subject category.' },
      ];
    });

    const filteredBadges = computed(() => {
      const f = badgeFilter.value;
      if (f === 'all') return allBadges.value;
      if (f === 'earned') return allBadges.value.filter(b => b.earned);
      if (f === 'locked') return allBadges.value.filter(b => !b.earned);
      return allBadges.value.filter(b => b.rarity === f);
    });

    const rarityStyle = (rarity) => ({
      common:    'bg-slate-500/30 text-slate-600 dark:text-slate-300 border border-slate-500/50',
      rare:      'bg-blue-500/30 text-blue-300 border border-blue-500/50',
      epic:      'bg-purple-500/30 text-purple-300 border border-purple-500/50',
      legendary: 'bg-amber-500/30 text-amber-300 border border-amber-500/50',
    }[rarity] || '');

    const earnedCount  = computed(() => allBadges.value.filter(b => b.earned).length);
    const nextBadge    = computed(() => allBadges.value.find(b => !b.earned));
    const badgeProgress = computed(() => Math.round((earnedCount.value / allBadges.value.length) * 100));

    // ── Streaks ────────────────────────────────────────────────────────────
    const currentStreak = ref(7);
    const bestStreak    = ref(21);
    const weekDays = ['M','T','W','T','F','S','S'];
    const weekActivity = [true, true, true, true, true, false, false];

    const heatmap = computed(() => {
      if (props.data?.studentProgress?.heatmap) return props.data.studentProgress.heatmap;
      // Generate 52 weeks × 7 days of random activity
      return Array.from({ length: 52 }, () =>
        Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
      );
    });

    const heatClass = (v) => ['heat-0','heat-1','heat-2','heat-3','heat-4'][v] || 'heat-0';

    const streakMilestones = [
      { days: 7,  reward: '200 XP',  icon: '🔥', achieved: true  },
      { days: 14, reward: '500 XP',  icon: '💫', achieved: false },
      { days: 30, reward: '1500 XP', icon: '⚡', achieved: false },
      { days: 60, reward: '5000 XP', icon: '💎', achieved: false },
    ];

    const topStreakers = [
      { name: 'Aisha Rahman', streak: 45, avatar: 'AR' },
      { name: 'Clara Novak',  streak: 38, avatar: 'CN' },
      { name: 'Felix Kim',    streak: 30, avatar: 'FK' },
      { name: 'Ben Carter',   streak: 22, avatar: 'BC' },
    ];

    // ── Certificates ───────────────────────────────────────────────────────
    const certificates = ref([
      { id: 1, quiz: 'Advanced Mathematics', subject: 'Mathematics', score: 95, date: '2026-03-15', grade: 'A+' },
      { id: 2, quiz: 'World History: WWII',  subject: 'History',     score: 88, date: '2026-02-28', grade: 'A'  },
      { id: 3, quiz: 'Physics Fundamentals', subject: 'Physics',     score: 91, date: '2026-01-20', grade: 'A+' },
    ]);
    const selectedCert = ref(certificates.value[0]);
    const studentName  = ref('Irene Martinez');

    // ── Challenge Mode ─────────────────────────────────────────────────────
    const challengeSearch  = ref('');
    const selectedOpponent = ref(null);
    const selectedQuiz     = ref('');
    const xpWager          = ref(100);
    const quizOptions = ['Algebra Basics','World Capitals','Biology 101','English Grammar','Physics Mechanics'];
    const searchResults = computed(() => {
      if (!challengeSearch.value.trim()) return [];
      const q = challengeSearch.value.toLowerCase();
      return leaderboardData.value
        .filter(u => !u.isMe && u.name.toLowerCase().includes(q))
        .slice(0, 5);
    });

    const activeChallenges = ref([
      { id: 1, opponent: 'Ben Carter',   avatar: 'BC', quiz: 'Algebra Basics',  myScore: 88, theirScore: null, status: 'pending', xp: 200 },
      { id: 2, opponent: 'Grace Liu',    avatar: 'GL', quiz: 'World Capitals',  myScore: 92, theirScore: 85,   status: 'won',     xp: 150 },
      { id: 3, opponent: 'Diego Reyes',  avatar: 'DR', quiz: 'Biology 101',     myScore: 74, theirScore: 88,   status: 'lost',    xp: 100 },
    ]);

    const challengeHistory = ref([
      { opponent: 'Elena Petrov', quiz: 'Physics Mechanics', result: 'won',  score: '91 vs 83' },
      { opponent: 'Hiro Tanaka',  quiz: 'English Grammar',   result: 'draw', score: '87 vs 87' },
      { opponent: 'Felix Kim',    quiz: 'Algebra Basics',    result: 'lost', score: '76 vs 90' },
    ]);

    const headToHead = computed(() => ({
      wins:   activeChallenges.value.filter(c => c.status === 'won').length  + challengeHistory.value.filter(c => c.result === 'won').length,
      losses: activeChallenges.value.filter(c => c.status === 'lost').length + challengeHistory.value.filter(c => c.result === 'lost').length,
      draws:  challengeHistory.value.filter(c => c.result === 'draw').length,
    }));

    const selectOpponent = (user) => { selectedOpponent.value = user; challengeSearch.value = user.name; };
    const createChallenge = () => {
      if (!selectedOpponent.value || !selectedQuiz.value) return;
      alert(`Challenge sent to ${selectedOpponent.value.name} for "${selectedQuiz.value}" with ${xpWager.value} XP wagered!`);
      selectedOpponent.value = null; challengeSearch.value = ''; selectedQuiz.value = ''; xpWager.value = 100;
    };

    const statusStyle = (s) => ({
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      active:  'bg-blue-500/20   text-blue-300   border-blue-500/40',
      won:     'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      lost:    'bg-red-500/20    text-red-300    border-red-500/40',
    }[s] || '');

    const resultStyle = (r) => ({
      won:  'text-emerald-400',
      lost: 'text-red-400',
      draw: 'text-yellow-400',
    }[r] || '');

    // ── Confetti ───────────────────────────────────────────────────────────
    const confettiItems = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      dur: 2 + Math.random() * 2,
      emoji: ['🎉','✨','⭐','🏆','🎊','💫'][i % 6],
    }));

    return {
      activeTab, tabs,
      selectedClass, timeFilter, classOptions, timeOptions,
      leaderboardData, podium, tableRows, myRow,
      badgeFilter, badgeFilters, filteredBadges, rarityStyle,
      earnedCount, nextBadge, badgeProgress,
      currentStreak, bestStreak, weekDays, weekActivity,
      heatmap, heatClass, streakMilestones, topStreakers,
      certificates, selectedCert, studentName,
      challengeSearch, selectedOpponent, selectedQuiz, xpWager,
      quizOptions, searchResults, activeChallenges, challengeHistory,
      headToHead, selectOpponent, createChallenge, statusStyle, resultStyle,
      confettiItems,
    };
  },

  template: `
<div class="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 md:p-8">

  <!-- ══ PAGE HEADER ══════════════════════════════════════════════════════ -->
  <div class="relative mb-8 text-center overflow-hidden">
    <!-- Floating confetti -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <span v-for="c in confettiItems" :key="c.id"
            class="absolute text-xl animate-bounce"
            :style="'left:'+c.left+'%; top: '+Math.random()*60+'%; animation-delay:'+c.delay+'s; animation-duration:'+c.dur+'s;'"
      >{{c.emoji}}</span>
    </div>

    <div class="relative z-10">
      <div class="inline-flex items-center gap-3 mb-3">
        <span class="text-4xl">🏆</span>
        <h1 class="text-4xl md:text-5xl font-black gradient-text">Gamification Hub</h1>
        <span class="text-4xl">🎮</span>
      </div>
      <p class="text-slate-500 dark:text-slate-400 text-lg">Compete · Earn · Achieve · Excel</p>
      <!-- Live badge -->
      <div class="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
        <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
        <span class="text-red-400 text-xs font-bold tracking-widest">LIVE</span>
      </div>
    </div>
  </div>

  <!-- ══ TAB NAVIGATION ═══════════════════════════════════════════════════ -->
  <div class="glass rounded-2xl p-1.5 mb-8 flex flex-wrap gap-1 justify-center md:justify-start">
    <button v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            :class="activeTab===tab.id
              ? 'bg-indigo-600 text-slate-900 dark:text-white shadow-lg shadow-indigo-500/30'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-white/5'">
      <span>{{tab.icon}}</span>
      <span>{{tab.label}}</span>
    </button>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       TAB: LEADERBOARD
  ══════════════════════════════════════════════════════════════════════ -->
  <div v-if="activeTab==='leaderboard'">

    <!-- Filters -->
    <div class="glass rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-slate-500 dark:text-slate-400 text-sm font-medium">Class:</span>
        <select v-model="selectedClass"
                class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option v-for="o in classOptions" :key="o.value" :value="o.value">{{o.label}}</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button v-for="o in timeOptions" :key="o.value"
                @click="timeFilter=o.value"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                :class="timeFilter===o.value
                  ? 'bg-indigo-600 text-slate-900 dark:text-white'
                  : 'bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'">
          {{o.label}}
        </button>
      </div>
    </div>

    <!-- Podium -->
    <div class="glass rounded-2xl p-6 mb-6">
      <h2 class="text-slate-900 dark:text-white font-bold text-lg mb-6 flex items-center gap-2">
        <span>🥇</span> Top Champions
      </h2>
      <div class="flex items-end justify-center gap-4 md:gap-8 mb-2">

        <!-- 2nd place -->
        <div v-if="podium[1]" class="flex flex-col items-center podium-2">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-slate-900 dark:text-white font-black text-lg mb-2 ring-4 ring-slate-400/30">
            {{podium[1].avatar}}
          </div>
          <p class="text-slate-900 dark:text-white font-semibold text-sm mb-1 text-center">{{podium[1].name}}</p>
          <p class="text-slate-500 dark:text-slate-400 text-xs mb-2">{{podium[1].xp.toLocaleString()}} XP</p>
          <div class="w-24 md:w-28 h-20 bg-gradient-to-t from-slate-500 to-slate-600 rounded-t-xl flex items-start justify-center pt-2">
            <span class="text-2xl">🥈</span>
          </div>
        </div>

        <!-- 1st place -->
        <div v-if="podium[0]" class="flex flex-col items-center podium-1">
          <div class="relative mb-2">
            <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-xl">👑</span>
            <div class="w-18 h-18 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-900 dark:text-white font-black text-xl ring-4 ring-yellow-400/40">
              {{podium[0].avatar}}
            </div>
          </div>
          <p class="text-slate-900 dark:text-white font-bold text-sm mb-1 text-center">{{podium[0].name}}</p>
          <p class="text-yellow-400 text-xs mb-2 font-semibold">{{podium[0].xp.toLocaleString()}} XP</p>
          <div class="w-24 md:w-28 h-28 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-xl flex items-start justify-center pt-2 shadow-lg shadow-yellow-500/20">
            <span class="text-2xl">🥇</span>
          </div>
        </div>

        <!-- 3rd place -->
        <div v-if="podium[2]" class="flex flex-col items-center podium-3">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center text-slate-900 dark:text-white font-black text-lg mb-2 ring-4 ring-amber-700/30">
            {{podium[2].avatar}}
          </div>
          <p class="text-slate-900 dark:text-white font-semibold text-sm mb-1 text-center">{{podium[2].name}}</p>
          <p class="text-slate-500 dark:text-slate-400 text-xs mb-2">{{podium[2].xp.toLocaleString()}} XP</p>
          <div class="w-24 md:w-28 h-14 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-xl flex items-start justify-center pt-2">
            <span class="text-2xl">🥉</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Rankings table -->
    <div class="glass rounded-2xl overflow-hidden mb-4">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left text-slate-500 font-semibold px-5 py-3">#</th>
            <th class="text-left text-slate-500 font-semibold px-4 py-3">Student</th>
            <th class="text-right text-slate-500 font-semibold px-4 py-3 hidden md:table-cell">XP</th>
            <th class="text-right text-slate-500 font-semibold px-4 py-3 hidden lg:table-cell">Badges</th>
            <th class="text-right text-slate-500 font-semibold px-4 py-3 hidden lg:table-cell">Streak</th>
            <th class="text-right text-slate-500 font-semibold px-4 py-3">Score%</th>
            <th class="text-right text-slate-500 font-semibold px-4 py-3">Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in tableRows" :key="row.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td class="px-5 py-3 text-slate-500 dark:text-slate-400 font-bold">{{idx+4}}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold flex-shrink-0">
                  {{row.avatar}}
                </div>
                <span class="text-slate-900 dark:text-white font-medium">{{row.name}}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right text-indigo-400 font-semibold hidden md:table-cell">{{row.xp.toLocaleString()}}</td>
            <td class="px-4 py-3 text-right text-slate-600 dark:text-slate-300 hidden lg:table-cell">{{row.badges}} 🎖️</td>
            <td class="px-4 py-3 text-right text-orange-400 hidden lg:table-cell">{{row.streak}} 🔥</td>
            <td class="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{{row.score}}%</td>
            <td class="px-4 py-3 text-right">
              <span :class="row.change>0?'text-emerald-400':row.change<0?'text-red-400':'text-slate-500'"
                    class="font-semibold text-xs">
                {{row.change>0?'▲':row.change<0?'▼':'–'}}{{Math.abs(row.change)||''}}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Your Rank -->
    <div v-if="myRow" class="glass rounded-2xl border border-indigo-500/40 p-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-slate-900 dark:text-white font-bold flex-shrink-0">
          {{myRow.avatar}}
        </div>
        <div>
          <p class="text-indigo-300 text-xs font-semibold uppercase tracking-wider">Your Rank</p>
          <p class="text-slate-900 dark:text-white font-bold">{{myRow.name}}</p>
        </div>
      </div>
      <div class="flex items-center gap-6 text-right">
        <div>
          <p class="text-slate-500 text-xs">XP</p>
          <p class="text-indigo-400 font-bold">{{myRow.xp.toLocaleString()}}</p>
        </div>
        <div>
          <p class="text-slate-500 text-xs">Score</p>
          <p class="text-slate-900 dark:text-white font-bold">{{myRow.score}}%</p>
        </div>
        <div class="bg-indigo-500/20 border border-indigo-500/40 rounded-xl px-3 py-1.5">
          <p class="text-indigo-300 font-black text-lg">#9</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       TAB: BADGES
  ══════════════════════════════════════════════════════════════════════ -->
  <div v-else-if="activeTab==='badges'">
    <!-- Progress bar -->
    <div class="glass rounded-2xl p-5 mb-6">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-slate-900 dark:text-white font-bold">Badge Collection</p>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{earnedCount}} / {{allBadges.length}} earned</p>
        </div>
        <span class="text-3xl">🎖️</span>
      </div>
      <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
             :style="'width:'+badgeProgress+'%'"></div>
      </div>
      <div class="flex justify-between mt-1 text-xs text-slate-500">
        <span>0%</span>
        <span class="text-indigo-400 font-semibold">{{badgeProgress}}%</span>
        <span>100%</span>
      </div>
      <!-- Next badge -->
      <div v-if="nextBadge" class="mt-4 flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3">
        <span class="text-3xl grayscale">{{nextBadge.icon}}</span>
        <div>
          <p class="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Next Target</p>
          <p class="text-slate-900 dark:text-white font-semibold">{{nextBadge.name}}</p>
          <p class="text-slate-500 text-xs mt-0.5">{{nextBadge.desc}}</p>
        </div>
        <div class="ml-auto text-right">
          <p class="text-indigo-400 font-bold text-sm">+{{nextBadge.xp}} XP</p>
        </div>
      </div>
    </div>

    <!-- Filter pills -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button v-for="f in badgeFilters" :key="f.value"
              @click="badgeFilter=f.value"
              class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              :class="badgeFilter===f.value
                ? 'bg-indigo-600 border-indigo-500 text-slate-900 dark:text-white'
                : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-500 hover:text-slate-900 dark:text-white'">
        {{f.label}}
      </button>
    </div>

    <!-- Badges grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="badge in filteredBadges" :key="badge.id"
           class="badge glass rounded-2xl p-4 flex flex-col items-center text-center relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
           :class="badge.earned ? 'hover:shadow-indigo-500/20' : 'opacity-60'">

        <!-- Lock overlay for locked badges -->
        <div v-if="!badge.earned" class="absolute inset-0 rounded-2xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-center z-10 group-hover:bg-slate-50 dark:bg-slate-900/40 transition-colors">
          <span class="text-2xl">🔒</span>
        </div>

        <!-- Icon -->
        <div class="text-5xl mb-3 mt-1 transition-transform group-hover:scale-110 duration-300"
             :class="badge.earned ? '' : 'grayscale'">
          {{badge.icon}}
        </div>

        <!-- Name -->
        <p class="text-slate-900 dark:text-white font-bold text-sm mb-1.5">{{badge.name}}</p>

        <!-- Rarity tag -->
        <span class="text-xs px-2 py-0.5 rounded-full font-semibold capitalize mb-2" :class="rarityStyle(badge.rarity)">
          {{badge.rarity}}
        </span>

        <!-- XP -->
        <p class="text-indigo-400 font-semibold text-xs mb-2">+{{badge.xp}} XP</p>

        <!-- Earned date or desc -->
        <p v-if="badge.earned" class="text-emerald-400 text-xs">✓ Earned {{badge.earnedDate}}</p>
        <p v-else class="text-slate-500 text-xs leading-snug">{{badge.desc}}</p>

        <!-- Hover tooltip -->
        <div class="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-100 dark:bg-slate-800 border border-slate-600 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 w-44 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
          <p class="font-bold mb-1">{{badge.name}}</p>
          <p class="text-slate-500 dark:text-slate-400">{{badge.desc}}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       TAB: STREAKS
  ══════════════════════════════════════════════════════════════════════ -->
  <div v-else-if="activeTab==='streaks'" class="space-y-6">

    <!-- Current streak hero -->
    <div class="glass rounded-2xl p-8 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5 pointer-events-none"></div>
      <p class="text-6xl mb-2 animate-bounce">🔥</p>
      <p class="text-7xl font-black text-slate-900 dark:text-white mb-1">{{currentStreak}}</p>
      <p class="text-slate-500 dark:text-slate-400 text-xl font-semibold mb-4">Day Streak</p>
      <div class="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-2">
        <span class="text-yellow-400">⭐</span>
        <span class="text-slate-600 dark:text-slate-300 text-sm">Personal Best: <strong class="text-slate-900 dark:text-white">{{bestStreak}} days</strong></span>
      </div>
    </div>

    <!-- Weekly calendar -->
    <div class="glass rounded-2xl p-5">
      <h3 class="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">📅 This Week</h3>
      <div class="flex gap-2 justify-center">
        <div v-for="(active, i) in weekActivity" :key="i"
             class="flex flex-col items-center gap-2">
          <span class="text-slate-500 text-xs font-semibold">{{weekDays[i]}}</span>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all"
               :class="active
                 ? 'bg-indigo-600 shadow-lg shadow-indigo-500/40 text-slate-900 dark:text-white'
                 : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600'">
            {{active ? '✓' : '–'}}
          </div>
        </div>
      </div>
    </div>

    <!-- Heatmap -->
    <div class="glass rounded-2xl p-5 overflow-x-auto">
      <h3 class="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">📊 Activity Heatmap</h3>
      <div class="flex gap-0.5">
        <div v-for="(week, wi) in heatmap" :key="wi" class="flex flex-col gap-0.5">
          <div v-for="(val, di) in week" :key="di"
               :class="'heat-cell w-2.5 h-2.5 rounded-sm '+heatClass(val)"
               :title="'Activity level '+val"></div>
        </div>
      </div>
      <!-- Legend -->
      <div class="flex items-center gap-2 mt-3 justify-end">
        <span class="text-slate-500 text-xs">Less</span>
        <div class="heat-cell heat-0 w-3 h-3 rounded-sm"></div>
        <div class="heat-cell heat-1 w-3 h-3 rounded-sm"></div>
        <div class="heat-cell heat-2 w-3 h-3 rounded-sm"></div>
        <div class="heat-cell heat-3 w-3 h-3 rounded-sm"></div>
        <div class="heat-cell heat-4 w-3 h-3 rounded-sm"></div>
        <span class="text-slate-500 text-xs">More</span>
      </div>
    </div>

    <!-- Streak milestones -->
    <div class="glass rounded-2xl p-5">
      <h3 class="text-slate-900 dark:text-white font-bold mb-5 flex items-center gap-2">🎁 Streak Rewards</h3>
      <div class="relative">
        <div class="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
        <div class="space-y-4">
          <div v-for="m in streakMilestones" :key="m.days"
               class="flex items-center gap-4 relative pl-12">
            <div class="absolute left-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl z-10 transition-all"
                 :class="m.achieved
                   ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30'
                   : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'">
              {{m.icon}}
            </div>
            <div class="flex-1 flex items-center justify-between glass rounded-xl px-4 py-3"
                 :class="m.achieved ? 'border border-indigo-500/30' : ''">
              <div>
                <p class="text-slate-900 dark:text-white font-semibold">{{m.days}}-Day Streak</p>
                <p class="text-slate-500 text-xs">{{m.achieved?'Achieved! 🎉':'Keep going...'}}</p>
              </div>
              <p :class="m.achieved?'text-indigo-400':'text-slate-500'" class="font-bold">{{m.reward}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top streakers -->
    <div class="glass rounded-2xl p-5">
      <h3 class="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">🔥 Top Streakers</h3>
      <div class="space-y-3">
        <div v-for="(s, i) in topStreakers" :key="i"
             class="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/30 rounded-xl">
          <span class="text-slate-500 dark:text-slate-400 font-bold w-5 text-sm">{{i+1}}</span>
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold flex-shrink-0">
            {{s.avatar}}
          </div>
          <p class="text-slate-900 dark:text-white font-medium flex-1">{{s.name}}</p>
          <p class="text-orange-400 font-bold text-sm">{{s.streak}} 🔥</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       TAB: CERTIFICATES
  ══════════════════════════════════════════════════════════════════════ -->
  <div v-else-if="activeTab==='certificates'" class="space-y-6">
    <p class="text-slate-500 dark:text-slate-400 text-sm">Quizzes with score ≥ 80% qualify for a certificate.</p>

    <!-- Cert selector -->
    <div class="flex flex-wrap gap-3 mb-2">
      <button v-for="cert in certificates" :key="cert.id"
              @click="selectedCert=cert"
              class="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
              :class="selectedCert&&selectedCert.id===cert.id
                ? 'bg-indigo-600 border-indigo-500 text-slate-900 dark:text-white'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'">
        {{cert.quiz}}
      </button>
    </div>

    <!-- Certificate preview -->
    <div v-if="selectedCert" class="flex justify-center">
      <div class="certificate-frame w-full max-w-2xl">
        <div class="text-center mb-6">
          <div class="flex justify-center gap-1 text-yellow-400 text-2xl mb-1">★ ★ ★ ★ ★</div>
          <p class="text-indigo-200 text-xs font-semibold uppercase tracking-[4px]">Certificate of Achievement</p>
        </div>
        <div class="text-center mb-8">
          <p class="text-slate-600 dark:text-slate-300 text-sm mb-3">This is to certify that</p>
          <p class="text-4xl font-black text-slate-900 dark:text-white mb-2">{{studentName}}</p>
          <p class="text-slate-600 dark:text-slate-300 text-sm">has successfully completed</p>
          <p class="text-2xl font-bold text-yellow-300 mt-2">{{selectedCert.quiz}}</p>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Subject: {{selectedCert.subject}}</p>
        </div>
        <div class="flex justify-around items-center">
          <div class="text-center">
            <p class="text-4xl font-black text-emerald-400">{{selectedCert.score}}%</p>
            <p class="text-slate-500 text-xs mt-1">Final Score</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-full border-4 border-yellow-400 flex items-center justify-center text-2xl bg-yellow-400/10 shadow-lg shadow-yellow-400/20">
              🏅
            </div>
            <p class="text-yellow-400 font-bold text-sm mt-1">{{selectedCert.grade}}</p>
          </div>
          <div class="text-center">
            <p class="text-slate-900 dark:text-white font-semibold text-sm">{{selectedCert.date}}</p>
            <p class="text-slate-500 text-xs mt-1">Date Issued</p>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t border-white/10 text-center">
          <p class="text-slate-500 dark:text-slate-400 text-xs">Authorized by <span class="text-slate-900 dark:text-white font-semibold">QuizMaster Academy</span></p>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex justify-center gap-4 mt-2">
      <button class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-slate-900 dark:text-white px-6 py-2.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30 text-sm">
        ⬇️ Download PDF
      </button>
      <button class="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-600 text-slate-900 dark:text-white px-6 py-2.5 rounded-xl font-semibold transition-all text-sm">
        🔗 Share
      </button>
    </div>

    <!-- All certificates gallery -->
    <div class="glass rounded-2xl p-5">
      <h3 class="text-slate-900 dark:text-white font-bold mb-4">🗂️ All Certificates</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="cert in certificates" :key="cert.id"
             @click="selectedCert=cert"
             class="cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-100 dark:bg-slate-800/70 transition-all group">
          <div class="flex items-start justify-between mb-2">
            <p class="text-slate-900 dark:text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors">{{cert.quiz}}</p>
            <span class="text-lg">📜</span>
          </div>
          <p class="text-slate-500 text-xs mb-2">{{cert.subject}}</p>
          <div class="flex items-center justify-between">
            <span class="text-emerald-400 font-bold text-sm">{{cert.score}}%</span>
            <span class="text-yellow-400 font-bold text-sm">{{cert.grade}}</span>
          </div>
          <p class="text-slate-600 text-xs mt-2">{{cert.date}}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       TAB: CHALLENGE MODE
  ══════════════════════════════════════════════════════════════════════ -->
  <div v-else-if="activeTab==='challenges'" class="space-y-6">

    <!-- Head-to-head stats -->
    <div class="glass rounded-2xl p-5">
      <h3 class="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">⚔️ Your Record</h3>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <p class="text-4xl font-black text-emerald-400">{{headToHead.wins}}</p>
          <p class="text-emerald-600 text-xs font-semibold mt-1 uppercase tracking-wider">Wins</p>
        </div>
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p class="text-4xl font-black text-yellow-400">{{headToHead.draws}}</p>
          <p class="text-yellow-600 text-xs font-semibold mt-1 uppercase tracking-wider">Draws</p>
        </div>
        <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p class="text-4xl font-black text-red-400">{{headToHead.losses}}</p>
          <p class="text-red-600 text-xs font-semibold mt-1 uppercase tracking-wider">Losses</p>
        </div>
      </div>
    </div>

    <!-- Create challenge form -->
    <div class="glass rounded-2xl p-6">
      <h3 class="text-slate-900 dark:text-white font-bold mb-5 flex items-center gap-2">🆕 Create a Challenge</h3>
      <div class="space-y-4">

        <!-- Opponent search -->
        <div class="relative">
          <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Search Opponent</label>
          <input v-model="challengeSearch"
                 type="text"
                 placeholder="Type a student's name..."
                 class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"/>
          <!-- Search results dropdown -->
          <div v-if="searchResults.length" class="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xl">
            <div v-for="r in searchResults" :key="r.id"
                 @click="selectOpponent(r)"
                 class="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-200 dark:bg-slate-700 cursor-pointer transition-colors">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold flex-shrink-0">
                {{r.avatar}}
              </div>
              <span class="text-slate-900 dark:text-white text-sm">{{r.name}}</span>
              <span class="ml-auto text-slate-500 text-xs">{{r.xp.toLocaleString()}} XP</span>
            </div>
          </div>
        </div>

        <!-- Quiz select -->
        <div>
          <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Select Quiz</label>
          <select v-model="selectedQuiz"
                  class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="" disabled>Choose a quiz...</option>
            <option v-for="q in quizOptions" :key="q" :value="q">{{q}}</option>
          </select>
        </div>

        <!-- XP wager -->
        <div>
          <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">XP Wager: <span class="text-indigo-400 font-bold">{{xpWager}} XP</span></label>
          <input v-model.number="xpWager" type="range" min="50" max="500" step="50"
                 class="w-full accent-indigo-500"/>
          <div class="flex justify-between text-xs text-slate-600 mt-1">
            <span>50</span><span>500</span>
          </div>
        </div>

        <button @click="createChallenge"
                :disabled="!selectedOpponent||!selectedQuiz"
                class="w-full py-3 rounded-xl font-bold text-slate-900 dark:text-white transition-all text-sm"
                :class="selectedOpponent&&selectedQuiz
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:scale-[1.02]'
                  : 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed opacity-50'">
          ⚔️ Send Challenge
        </button>
      </div>
    </div>

    <!-- Active challenges -->
    <div class="glass rounded-2xl p-5">
      <h3 class="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">⚡ Active Challenges</h3>
      <div class="space-y-3">
        <div v-for="ch in activeChallenges" :key="ch.id"
             class="p-4 bg-slate-100 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/50">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold flex-shrink-0">
                {{ch.avatar}}
              </div>
              <div>
                <p class="text-slate-900 dark:text-white font-semibold text-sm">vs {{ch.opponent}}</p>
                <p class="text-slate-500 text-xs">{{ch.quiz}}</p>
              </div>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full border font-semibold capitalize" :class="statusStyle(ch.status)">
              {{ch.status}}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <div class="text-center">
              <p class="text-slate-500 text-xs">Your Score</p>
              <p class="text-indigo-400 font-bold">{{ch.myScore}}%</p>
            </div>
            <div class="flex-1 flex items-center justify-center gap-2 px-4">
              <div class="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-500 rounded-full" :style="'width:'+ch.myScore+'%'"></div>
              </div>
              <span class="text-slate-600 text-xs font-bold">VS</span>
              <div class="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-purple-500 rounded-full" :style="ch.theirScore?'width:'+ch.theirScore+'%':'width:0%'"></div>
              </div>
            </div>
            <div class="text-center">
              <p class="text-slate-500 text-xs">Their Score</p>
              <p class="text-purple-400 font-bold">{{ch.theirScore!==null?ch.theirScore+'%':'–'}}</p>
            </div>
          </div>
          <p class="text-slate-600 text-xs text-right mt-2">Wager: <span class="text-amber-400 font-semibold">{{ch.xp}} XP</span></p>
        </div>
      </div>
    </div>

    <!-- Challenge history -->
    <div class="glass rounded-2xl p-5">
      <h3 class="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">📋 Challenge History</h3>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left text-slate-500 text-xs font-semibold pb-3">Opponent</th>
            <th class="text-left text-slate-500 text-xs font-semibold pb-3 hidden md:table-cell">Quiz</th>
            <th class="text-center text-slate-500 text-xs font-semibold pb-3">Score</th>
            <th class="text-right text-slate-500 text-xs font-semibold pb-3">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(h, i) in challengeHistory" :key="i" class="border-b border-white/5 last:border-0">
            <td class="py-3 text-slate-900 dark:text-white font-medium">{{h.opponent}}</td>
            <td class="py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{{h.quiz}}</td>
            <td class="py-3 text-slate-600 dark:text-slate-300 text-center text-xs font-mono">{{h.score}}</td>
            <td class="py-3 text-right">
              <span :class="resultStyle(h.result)" class="font-bold text-xs uppercase tracking-wider">
                {{h.result==='won'?'WIN':h.result==='lost'?'LOSS':'DRAW'}}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
  `,
};
