export const AnalyticsDashboard = {
  name: 'AnalyticsDashboard',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, onMounted, onUnmounted, watch, computed } = Vue;

    // ── State ───────────────────────────────────────────────────────────────
    const activeTab    = ref('overview');
    const dateRange    = ref('30');
    const exportOpen   = ref(false);
    const quizFilter   = ref('all');
    const studentQuery = ref('');
    const selectedStudent = ref(null);

    const tabs = [
      { id: 'overview',     label: 'Overview' },
      { id: 'item',         label: 'Item Analysis' },
      { id: 'trajectory',   label: 'Learning Trajectories' },
      { id: 'exportcenter', label: 'Export Center' },
    ];

    const dateRangeOptions = [
      { value: '7',   label: 'Last 7 Days' },
      { value: '30',  label: 'Last 30 Days' },
      { value: '90',  label: 'Last 90 Days' },
      { value: 'custom', label: 'Custom' },
    ];

    // ── Mock data ────────────────────────────────────────────────────────────
    const kpis = ref([
      { label: 'Total Submissions', value: '4,821', change: '+12%', icon: '📋', positive: true },
      { label: 'Pass Rate',         value: '73.4%', change: '+3.1%',icon: '✅', positive: true },
      { label: 'Avg Score',         value: '68.2',  change: '-1.4%', icon: '📊', positive: false },
      { label: 'Avg Time Spent',    value: '14m 32s',change: '+0.8%',icon: '⏱️', positive: true },
    ]);

    const topQuizzes = ref([
      { name: 'Algebra Fundamentals',   submissions: 312, avgScore: 81.4, passRate: '88%' },
      { name: 'World History: WW2',     submissions: 278, avgScore: 74.9, passRate: '79%' },
      { name: 'Python Basics',          submissions: 254, avgScore: 77.2, passRate: '83%' },
      { name: 'Cell Biology',           submissions: 231, avgScore: 65.1, passRate: '67%' },
      { name: 'Grammar & Composition',  submissions: 198, avgScore: 70.3, passRate: '75%' },
    ]);

    const quizList = ref([
      { id: 'all', label: 'All Quizzes' },
      { id: 'q1',  label: 'Algebra Fundamentals' },
      { id: 'q2',  label: 'World History: WW2' },
      { id: 'q3',  label: 'Python Basics' },
      { id: 'q4',  label: 'Cell Biology' },
    ]);

    const itemRows = ref([
      { no: 1,  text: 'What is the derivative of x²?',                           correct: 91, time: '0:48', disc: 0.42, cls: 'Easy'   },
      { no: 2,  text: 'Solve for x: 3x + 7 = 22',                                correct: 78, time: '1:12', disc: 0.38, cls: 'Easy'   },
      { no: 3,  text: 'Which theorem relates sides of a right triangle?',         correct: 62, time: '1:05', disc: 0.51, cls: 'Medium' },
      { no: 4,  text: 'Factor the polynomial: x² - 5x + 6',                      correct: 54, time: '2:10', disc: 0.44, cls: 'Medium' },
      { no: 5,  text: 'Find the integral of sin(x) dx',                           correct: 41, time: '2:45', disc: 0.35, cls: 'Hard'   },
      { no: 6,  text: 'Evaluate the limit as x → ∞ of (1 + 1/x)^x',             correct: 23, time: '3:30', disc: 0.19, cls: 'Hard'   },
      { no: 7,  text: 'Prove that √2 is irrational',                              correct: 11, time: '4:15', disc: 0.08, cls: 'Outlier'},
      { no: 8,  text: 'Simplify: (a+b)² − (a−b)²',                              correct: 85, time: '0:55', disc: 0.40, cls: 'Easy'   },
      { no: 9,  text: 'What is the determinant of the identity matrix?',          correct: 70, time: '1:00', disc: 0.36, cls: 'Medium' },
      { no: 10, text: 'Compute eigenvalues of [[2,1],[1,2]]',                     correct: 33, time: '3:00', disc: 0.28, cls: 'Hard'   },
    ]);

    const students = ref([
      { id: 1, name: 'Alice Johnson',  avatar: 'AJ' },
      { id: 2, name: 'Bob Martinez',   avatar: 'BM' },
      { id: 3, name: 'Carol Smith',    avatar: 'CS' },
      { id: 4, name: 'David Lee',      avatar: 'DL' },
    ]);

    const weakTopics = ref([
      { topic: 'Calculus – Integration',    score: 41, quiz: 'Calculus Deep Dive' },
      { topic: 'Limits & Continuity',       score: 48, quiz: 'Pre-Calculus Mastery' },
      { topic: 'Polynomial Factoring',      score: 54, quiz: 'Algebra Fundamentals' },
      { topic: 'Matrix Operations',         score: 56, quiz: 'Linear Algebra 101' },
    ]);

    const exportCards = ref([
      { id: 'results',    title: 'Results Summary',  desc: 'High-level summary of all quiz results within the chosen date range.',          icon: '📄', fmt: 'PDF'   },
      { id: 'detailed',   title: 'Detailed Report',  desc: 'Per-student, per-question breakdown with statistics and trend analysis.',        icon: '📊', fmt: 'Excel' },
      { id: 'raw',        title: 'Raw Data',         desc: 'Flat export of every submission record for custom processing.',                  icon: '🗃️', fmt: 'CSV'   },
      { id: 'progress',   title: 'Student Progress', desc: 'Longitudinal score trajectories and improvement metrics per learner.',           icon: '📈', fmt: 'PDF'   },
      { id: 'itemcsv',    title: 'Item Analysis',    desc: 'Difficulty, discrimination index, and timing stats for every question.',         icon: '🔍', fmt: 'CSV'   },
      { id: 'cert',       title: 'Certificate Batch',desc: 'Auto-generated certificates for all students who achieved a passing score.',     icon: '🏆', fmt: 'PDF'   },
    ]);

    const recentExports = ref([
      { name: 'Results Summary – May 2026',  fmt: 'PDF',   date: '2026-06-20', size: '1.2 MB' },
      { name: 'Raw Data – Q2 2026',          fmt: 'CSV',   date: '2026-06-18', size: '4.8 MB' },
      { name: 'Student Progress – June',     fmt: 'PDF',   date: '2026-06-15', size: '2.1 MB' },
    ]);

    // per-card date range state
    const cardRanges = ref({});
    exportCards.value.forEach(c => { cardRanges.value[c.id] = '30'; });

    const filteredStudents = computed(() =>
      studentQuery.value.trim() === ''
        ? students.value
        : students.value.filter(s =>
            s.name.toLowerCase().includes(studentQuery.value.toLowerCase())
          )
    );

    // ── Chart instances ──────────────────────────────────────────────────────
    let histChart        = null;
    let weeklyChart      = null;
    let subjectChart     = null;
    let trendChart       = null;
    let trajectoryChart  = null;
    let improvChart      = null;

    const PALETTE = {
      blue:   '#6366f1',
      green:  '#10b981',
      red:    '#ef4444',
      orange: '#f59e0b',
      purple: '#8b5cf6',
      cyan:   '#06b6d4',
      pink:   '#ec4899',
      gray:   '#64748b',
    };

    function destroyAll() {
      [histChart, weeklyChart, subjectChart, trendChart, trajectoryChart, improvChart].forEach(c => { if (c) c.destroy(); });
      histChart = weeklyChart = subjectChart = trendChart = trajectoryChart = improvChart = null;
    }

    function buildOverviewCharts() {
      if (!window.Chart) return;

      // --- Score Distribution Histogram ---
      const hEl = document.getElementById('histChart');
      if (hEl) {
        if (histChart) histChart.destroy();
        histChart = new window.Chart(hEl, {
          type: 'bar',
          data: {
            labels: ['0–10','10–20','20–30','30–40','40–50','50–60','60–70','70–80','80–90','90–100'],
            datasets: [{
              label: 'Students',
              data: [12, 18, 35, 67, 112, 195, 287, 342, 228, 95],
              backgroundColor: [
                '#ef4444','#ef4444','#f97316','#f97316','#f59e0b',
                '#f59e0b','#10b981','#10b981','#6366f1','#6366f1',
              ],
              borderRadius: 4,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} students` } },
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
              y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
            },
          },
        });
      }

      // --- Weekly Activity Line Chart ---
      const wEl = document.getElementById('weeklyChart');
      if (wEl) {
        if (weeklyChart) weeklyChart.destroy();
        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        weeklyChart = new window.Chart(wEl, {
          type: 'line',
          data: {
            labels: days,
            datasets: [{
              label: 'Submissions',
              data: [84, 127, 156, 98, 213, 67, 41],
              borderColor: PALETTE.blue,
              backgroundColor: 'rgba(99,102,241,0.15)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: PALETTE.blue,
              pointRadius: 5,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } },
              y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } },
            },
          },
        });
      }

      // --- Subject Performance Radar ---
      const sEl = document.getElementById('subjectChart');
      if (sEl) {
        if (subjectChart) subjectChart.destroy();
        subjectChart = new window.Chart(sEl, {
          type: 'radar',
          data: {
            labels: ['Math','Science','History','English','CS','Physics'],
            datasets: [{
              label: 'Avg Score',
              data: [72, 68, 74, 81, 77, 63],
              borderColor: PALETTE.purple,
              backgroundColor: 'rgba(139,92,246,0.2)',
              pointBackgroundColor: PALETTE.purple,
              pointRadius: 5,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
              r: {
                min: 0, max: 100,
                ticks: { color: '#94a3b8', backdropColor: 'transparent', stepSize: 20 },
                grid:  { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: '#cbd5e1', font: { size: 12, weight: '600' } },
              },
            },
          },
        });
      }

      // --- Monthly Trend Stacked Area ---
      const tEl = document.getElementById('trendChart');
      if (tEl) {
        if (trendChart) trendChart.destroy();
        const months = ['Jan','Feb','Mar','Apr','May','Jun'];
        trendChart = new window.Chart(tEl, {
          type: 'line',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Passed',
                data: [310, 402, 374, 481, 523, 591],
                borderColor: PALETTE.green,
                backgroundColor: 'rgba(16,185,129,0.25)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: PALETTE.green,
              },
              {
                label: 'Failed',
                data: [120, 115, 138, 102, 97, 88],
                borderColor: PALETTE.red,
                backgroundColor: 'rgba(239,68,68,0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: PALETTE.red,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
              x: { stacked: true, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } },
              y: { stacked: true, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } },
            },
          },
        });
      }
    }

    function buildTrajectoryCharts() {
      if (!window.Chart) return;

      const trEl = document.getElementById('trajectoryChart2');
      if (trEl) {
        if (trajectoryChart) trajectoryChart.destroy();
        trajectoryChart = new window.Chart(trEl, {
          type: 'line',
          data: {
            labels: ['Attempt 1','Attempt 2','Attempt 3','Attempt 4','Attempt 5','Attempt 6'],
            datasets: [{
              label: 'Score (%)',
              data: [42, 51, 58, 63, 71, 79],
              borderColor: PALETTE.cyan,
              backgroundColor: 'rgba(6,182,212,0.15)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: PALETTE.cyan,
              pointRadius: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } },
              y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', callback: v => v + '%' } },
            },
          },
        });
      }

      const imEl = document.getElementById('improvChart');
      if (imEl) {
        if (improvChart) improvChart.destroy();
        improvChart = new window.Chart(imEl, {
          type: 'bar',
          data: {
            labels: ['Algebra','Calculus','Geometry','Statistics','Number Theory'],
            datasets: [{
              label: 'Improvement (+%)',
              data: [18, 12, 22, 8, 15],
              backgroundColor: [
                'rgba(99,102,241,0.8)',
                'rgba(16,185,129,0.8)',
                'rgba(245,158,11,0.8)',
                'rgba(6,182,212,0.8)',
                'rgba(236,72,153,0.8)',
              ],
              borderRadius: 6,
            }],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', callback: v => '+' + v + '%' } },
              y: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            },
          },
        });
      }
    }

    // ── Lifecycle ────────────────────────────────────────────────────────────
    onMounted(() => {
      buildOverviewCharts();
    });

    onUnmounted(() => {
      destroyAll();
    });

    watch(activeTab, (tab) => {
      if (tab === 'overview') {
        setTimeout(buildOverviewCharts, 50);
      } else if (tab === 'trajectory') {
        setTimeout(buildTrajectoryCharts, 50);
      }
    });

    // ── Helpers ──────────────────────────────────────────────────────────────
    function clsColor(cls) {
      return {
        Easy:    'ana-badge-easy',
        Medium:  'ana-badge-medium',
        Hard:    'ana-badge-hard',
        Outlier: 'ana-badge-outlier',
      }[cls] || '';
    }

    function rowHighlight(cls) {
      if (cls === 'Easy')    return 'ana-row-easy';
      if (cls === 'Hard' || cls === 'Outlier') return 'ana-row-hard';
      return '';
    }

    function fmtColor(fmt) {
      return { PDF: '#ef4444', Excel: '#10b981', CSV: '#6366f1' }[fmt] || '#6366f1';
    }

    function generateExport(card) {
      alert(`Generating ${card.title} (${card.fmt}) for last ${cardRanges.value[card.id]} days…`);
    }

    function selectStudent(s) { selectedStudent.value = s; studentQuery.value = s.name; }

    function doExport(type) {
      exportOpen.value = false;
      alert(`Exporting as ${type}…`);
    }

    return {
      activeTab, dateRange, exportOpen, quizFilter, studentQuery, selectedStudent,
      tabs, dateRangeOptions, kpis, topQuizzes, quizList, itemRows, students,
      filteredStudents, weakTopics, exportCards, recentExports, cardRanges,
      clsColor, rowHighlight, fmtColor, generateExport, selectStudent, doExport,
    };
  },

  template: `
<div class="ana-root">

  <!-- ══════════════════════ PAGE HEADER ══════════════════════════════════ -->
  <div class="ana-header">
    <div class="ana-header-left">
      <h1 class="ana-title">Analytics &amp; Reports</h1>
      <p class="ana-subtitle">Insights across all quizzes and learners</p>
    </div>
    <div class="ana-header-actions">
      <!-- Date Range Picker -->
      <div class="ana-select-wrap">
        <span class="ana-select-icon">📅</span>
        <select v-model="dateRange" class="ana-select">
          <option v-for="o in dateRangeOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
      <!-- Export Dropdown -->
      <div class="ana-dropdown-wrap" @click.outside="exportOpen=false">
        <button class="ana-btn-export" @click="exportOpen=!exportOpen">
          <span>⬇ Export</span>
          <span class="ana-caret">{{ exportOpen ? '▲' : '▼' }}</span>
        </button>
        <div v-if="exportOpen" class="ana-dropdown-menu">
          <button class="ana-dropdown-item" @click="doExport('CSV')">📄 CSV</button>
          <button class="ana-dropdown-item" @click="doExport('PDF')">📕 PDF</button>
          <button class="ana-dropdown-item" @click="doExport('Excel')">📗 Excel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════ TAB NAV ═════════════════════════════════════ -->
  <div class="ana-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['ana-tab', activeTab === tab.id ? 'ana-tab--active' : '']"
      @click="activeTab = tab.id"
    >{{ tab.label }}</button>
  </div>

  <!-- ══════════════════════ OVERVIEW TAB ════════════════════════════════ -->
  <div v-show="activeTab === 'overview'" class="ana-tab-content">

    <!-- KPI Cards -->
    <div class="ana-kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.label" class="ana-kpi-card">
        <div class="ana-kpi-top">
          <span class="ana-kpi-icon">{{ kpi.icon }}</span>
          <span :class="['ana-kpi-change', kpi.positive ? 'pos' : 'neg']">{{ kpi.change }}</span>
        </div>
        <div class="ana-kpi-value">{{ kpi.value }}</div>
        <div class="ana-kpi-label">{{ kpi.label }}</div>
      </div>
    </div>

    <!-- Charts Row: Histogram + Weekly -->
    <div class="ana-chart-row">
      <div class="ana-chart-card">
        <div class="ana-chart-header">
          <span class="ana-chart-title">Score Distribution</span>
          <span class="ana-chart-sub">All submissions</span>
        </div>
        <div class="ana-chart-body">
          <canvas id="histChart"></canvas>
        </div>
      </div>
      <div class="ana-chart-card">
        <div class="ana-chart-header">
          <span class="ana-chart-title">Weekly Activity</span>
          <span class="ana-chart-sub">Submissions per day</span>
        </div>
        <div class="ana-chart-body">
          <canvas id="weeklyChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Radar + Trend Row -->
    <div class="ana-chart-row">
      <div class="ana-chart-card">
        <div class="ana-chart-header">
          <span class="ana-chart-title">Subject Performance</span>
          <span class="ana-chart-sub">Average score by subject</span>
        </div>
        <div class="ana-chart-body ana-chart-body--radar">
          <canvas id="subjectChart"></canvas>
        </div>
      </div>
      <div class="ana-chart-card">
        <div class="ana-chart-header">
          <span class="ana-chart-title">Monthly Trend</span>
          <span class="ana-chart-sub">Passed vs Failed — last 6 months</span>
        </div>
        <div class="ana-chart-body">
          <canvas id="trendChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Top Performing Quizzes Table -->
    <div class="ana-table-card">
      <div class="ana-table-header">
        <span class="ana-chart-title">🏆 Top Performing Quizzes</span>
      </div>
      <div class="ana-table-scroll">
        <table class="ana-table">
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Submissions</th>
              <th>Avg Score</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="q in topQuizzes" :key="q.name" class="ana-table-row">
              <td class="ana-td-name">{{ q.name }}</td>
              <td>{{ q.submissions }}</td>
              <td>
                <div class="ana-score-wrap">
                  <div class="ana-score-bar-bg">
                    <div class="ana-score-bar-fill" :style="{ width: q.avgScore + '%' }"></div>
                  </div>
                  <span class="ana-score-val">{{ q.avgScore }}%</span>
                </div>
              </td>
              <td><span class="ana-pass-badge">{{ q.passRate }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ══════════════════════ ITEM ANALYSIS TAB ═══════════════════════════ -->
  <div v-show="activeTab === 'item'" class="ana-tab-content">

    <!-- Explanation banner -->
    <div class="ana-info-banner">
      <span class="ana-info-icon">🔬</span>
      <div>
        <strong>What is Item Analysis?</strong>
        <p>Item analysis evaluates each question's effectiveness by measuring how well it discriminates between high and low performers, its difficulty level, and average completion time. Use these metrics to refine your question bank.</p>
      </div>
    </div>

    <!-- Controls -->
    <div class="ana-item-controls">
      <div class="ana-select-wrap">
        <span class="ana-select-icon">🗂️</span>
        <select v-model="quizFilter" class="ana-select">
          <option v-for="q in quizList" :key="q.id" :value="q.id">{{ q.label }}</option>
        </select>
      </div>
      <button class="ana-btn-outline">⬇ Export Item Analysis (CSV)</button>
    </div>

    <!-- Legend -->
    <div class="ana-item-legend">
      <span class="ana-legend-dot" style="background:#10b981"></span> Easy (&gt;75%)
      <span class="ana-legend-dot" style="background:#f59e0b;margin-left:16px"></span> Medium (40–75%)
      <span class="ana-legend-dot" style="background:#ef4444;margin-left:16px"></span> Hard / Outlier (&lt;40%)
    </div>

    <!-- Item Table -->
    <div class="ana-table-card">
      <div class="ana-table-scroll">
        <table class="ana-table">
          <thead>
            <tr>
              <th style="width:48px">#</th>
              <th>Question Text</th>
              <th>Correct %</th>
              <th>Avg Time</th>
              <th>Discrimination</th>
              <th>Classification</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itemRows" :key="item.no" :class="['ana-table-row', rowHighlight(item.cls)]">
              <td>{{ item.no }}</td>
              <td class="ana-td-truncate" :title="item.text">{{ item.text }}</td>
              <td>
                <div class="ana-score-wrap">
                  <div class="ana-score-bar-bg">
                    <div class="ana-score-bar-fill" :style="{ width: item.correct + '%', background: item.correct >= 75 ? '#10b981' : item.correct >= 40 ? '#f59e0b' : '#ef4444' }"></div>
                  </div>
                  <span class="ana-score-val">{{ item.correct }}%</span>
                </div>
              </td>
              <td>{{ item.time }}</td>
              <td>{{ item.disc }}</td>
              <td><span :class="['ana-badge', clsColor(item.cls)]">{{ item.cls }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ══════════════════════ LEARNING TRAJECTORIES TAB ══════════════════ -->
  <div v-show="activeTab === 'trajectory'" class="ana-tab-content">

    <!-- Student Search -->
    <div class="ana-trajectory-header">
      <div class="ana-search-wrap">
        <span class="ana-search-icon">🔍</span>
        <input
          v-model="studentQuery"
          class="ana-search-input"
          placeholder="Search student…"
          @focus="selectedStudent = null"
        />
        <!-- dropdown -->
        <div v-if="studentQuery && !selectedStudent" class="ana-search-dropdown">
          <div
            v-for="s in filteredStudents"
            :key="s.id"
            class="ana-search-item"
            @click="selectStudent(s)"
          >
            <span class="ana-avatar">{{ s.avatar }}</span>
            {{ s.name }}
          </div>
          <div v-if="filteredStudents.length === 0" class="ana-search-empty">No students found</div>
        </div>
      </div>
      <div v-if="selectedStudent" class="ana-student-chip">
        <span class="ana-avatar">{{ selectedStudent.avatar }}</span>
        {{ selectedStudent.name }}
        <button class="ana-chip-remove" @click="selectedStudent=null; studentQuery=''">✕</button>
      </div>
    </div>

    <!-- Prompt if no student -->
    <div v-if="!selectedStudent" class="ana-no-student">
      <div class="ana-no-student-icon">👤</div>
      <p>Select a student above to view their learning trajectory.</p>
    </div>

    <template v-if="selectedStudent">
      <!-- Score Over Time -->
      <div class="ana-chart-card" style="margin-bottom:24px">
        <div class="ana-chart-header">
          <span class="ana-chart-title">📈 Score Over Time — {{ selectedStudent.name }}</span>
          <span class="ana-chart-sub">All quiz attempts</span>
        </div>
        <div class="ana-chart-body">
          <canvas id="trajectoryChart2"></canvas>
        </div>
      </div>

      <!-- Improvement Areas -->
      <div class="ana-chart-row">
        <div class="ana-chart-card">
          <div class="ana-chart-header">
            <span class="ana-chart-title">💪 Improvement Areas</span>
          </div>
          <div class="ana-chart-body">
            <canvas id="improvChart"></canvas>
          </div>
        </div>

        <!-- Weak Topics -->
        <div class="ana-chart-card">
          <div class="ana-chart-header">
            <span class="ana-chart-title">⚠️ Weak Topics &amp; Recommendations</span>
          </div>
          <div class="ana-weak-list">
            <div v-for="w in weakTopics" :key="w.topic" class="ana-weak-item">
              <div class="ana-weak-top">
                <span class="ana-weak-topic">{{ w.topic }}</span>
                <span class="ana-weak-score" :style="{color: w.score < 50 ? '#ef4444' : '#f59e0b'}">{{ w.score }}%</span>
              </div>
              <div class="ana-weak-bar-bg">
                <div class="ana-weak-bar-fill" :style="{width: w.score+'%', background: w.score < 50 ? '#ef4444' : '#f59e0b'}"></div>
              </div>
              <div class="ana-weak-rec">
                📚 Recommended: <span class="ana-weak-quiz">{{ w.quiz }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- ══════════════════════ EXPORT CENTER TAB ═══════════════════════════ -->
  <div v-show="activeTab === 'exportcenter'" class="ana-tab-content">

    <h2 class="ana-section-title">Generate &amp; Download Reports</h2>
    <p class="ana-section-sub">Choose a report type, select your date range, and download instantly.</p>

    <!-- Export Cards Grid -->
    <div class="ana-export-grid">
      <div v-for="card in exportCards" :key="card.id" class="ana-export-card">
        <div class="ana-export-icon" :style="{background: fmtColor(card.fmt) + '22', borderColor: fmtColor(card.fmt) + '55'}">{{ card.icon }}</div>
        <div class="ana-export-body">
          <div class="ana-export-top">
            <span class="ana-export-title">{{ card.title }}</span>
            <span class="ana-export-fmt" :style="{background: fmtColor(card.fmt) + '22', color: fmtColor(card.fmt)}">{{ card.fmt }}</span>
          </div>
          <p class="ana-export-desc">{{ card.desc }}</p>
          <div class="ana-export-controls">
            <div class="ana-select-wrap" style="flex:1">
              <span class="ana-select-icon">📅</span>
              <select v-model="cardRanges[card.id]" class="ana-select ana-select--sm">
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <button class="ana-btn-generate" :style="{'border-color': fmtColor(card.fmt)+'88', '--hover-color': fmtColor(card.fmt)}" @click="generateExport(card)">
              ⬇ Generate &amp; Download
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Exports -->
    <div class="ana-table-card" style="margin-top:32px">
      <div class="ana-table-header">
        <span class="ana-chart-title">🕑 Recent Exports</span>
      </div>
      <div class="ana-table-scroll">
        <table class="ana-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Format</th>
              <th>Generated On</th>
              <th>Size</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exp in recentExports" :key="exp.name" class="ana-table-row">
              <td class="ana-td-name">{{ exp.name }}</td>
              <td><span class="ana-export-fmt" :style="{background: fmtColor(exp.fmt)+'22', color: fmtColor(exp.fmt)}">{{ exp.fmt }}</span></td>
              <td>{{ exp.date }}</td>
              <td>{{ exp.size }}</td>
              <td><button class="ana-btn-dl">⬇ Download</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</div>

<!-- ══════════════════════════════════════════════════════════════════════
     SCOPED STYLES  (injected into <head> once via a style tag trick)
════════════════════════════════════════════════════════════════════════ -->
<style>
/* ---------- Root / Layout ---------- */
.ana-root {
  padding: 24px;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  min-height: 100vh;
  background: transparent;
}

/* ---------- Header ---------- */
.ana-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.ana-title {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, #818cf8, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 4px;
}
.ana-subtitle { color: #64748b; font-size: 14px; margin: 0; }
.ana-header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

/* ---------- Select ---------- */
.ana-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 0 12px;
  height: 40px;
}
.ana-select-icon { font-size: 14px; margin-right: 6px; }
.ana-select {
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  padding-right: 4px;
}
.ana-select--sm { font-size: 13px; }

/* ---------- Export Dropdown ---------- */
.ana-dropdown-wrap { position: relative; }
.ana-btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 18px;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
}
.ana-btn-export:hover { background: #4f46e5; }
.ana-caret { font-size: 10px; }
.ana-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  overflow: hidden;
  z-index: 99;
  min-width: 150px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
}
.ana-dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: #e2e8f0;
  padding: 11px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background .15s;
}
.ana-dropdown-item:hover { background: #334155; }

/* ---------- Tabs ---------- */
.ana-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #1e293b;
  margin-bottom: 28px;
}
.ana-tab {
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color .2s, border-color .2s;
  border-radius: 6px 6px 0 0;
}
.ana-tab:hover { color: #94a3b8; }
.ana-tab--active {
  color: #818cf8;
  border-bottom-color: #6366f1;
  background: rgba(99,102,241,0.06);
}

/* ---------- Tab Content ---------- */
.ana-tab-content { animation: anaFadeIn .25s ease; }
@keyframes anaFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

/* ---------- KPI Cards ---------- */
.ana-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
@media(max-width:900px) { .ana-kpi-grid { grid-template-columns: repeat(2,1fr); } }
@media(max-width:560px) { .ana-kpi-grid { grid-template-columns: 1fr; } }
.ana-kpi-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 20px;
  transition: transform .2s, box-shadow .2s;
}
.ana-kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.ana-kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.ana-kpi-icon { font-size: 22px; }
.ana-kpi-change { font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.ana-kpi-change.pos { background: rgba(16,185,129,0.15); color: #10b981; }
.ana-kpi-change.neg { background: rgba(239,68,68,0.15); color: #ef4444; }
.ana-kpi-value { font-size: 28px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
.ana-kpi-label { font-size: 13px; color: #64748b; }

/* ---------- Chart Cards ---------- */
.ana-chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
@media(max-width:800px) { .ana-chart-row { grid-template-columns: 1fr; } }
.ana-chart-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 20px;
}
.ana-chart-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; }
.ana-chart-title  { font-size: 15px; font-weight: 600; color: #e2e8f0; }
.ana-chart-sub    { font-size: 12px; color: #64748b; }
.ana-chart-body   { height: 220px; position: relative; }
.ana-chart-body--radar { height: 260px; }

/* ---------- Table ---------- */
.ana-table-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 24px;
}
.ana-table-header { padding: 16px 20px; border-bottom: 1px solid #334155; }
.ana-table-scroll { overflow-x: auto; }
.ana-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ana-table thead tr { background: #0f172a; }
.ana-table th {
  text-align: left;
  padding: 12px 16px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .5px;
  white-space: nowrap;
}
.ana-table-row { border-bottom: 1px solid #1a2744; transition: background .15s; }
.ana-table-row:hover { background: rgba(99,102,241,0.06); }
.ana-table-row:last-child { border-bottom: none; }
.ana-table td { padding: 13px 16px; color: #cbd5e1; }
.ana-td-name { font-weight: 500; color: #e2e8f0; }
.ana-td-truncate { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Row highlights */
.ana-row-easy { background: rgba(16,185,129,0.05); }
.ana-row-hard { background: rgba(239,68,68,0.06); }

/* ---------- Score bar ---------- */
.ana-score-wrap { display: flex; align-items: center; gap: 8px; }
.ana-score-bar-bg { flex: 1; height: 6px; background: #334155; border-radius: 99px; overflow: hidden; min-width: 60px; }
.ana-score-bar-fill { height: 100%; background: #6366f1; border-radius: 99px; transition: width .4s; }
.ana-score-val { font-size: 13px; color: #94a3b8; white-space: nowrap; }

/* ---------- Badges ---------- */
.ana-pass-badge { background: rgba(16,185,129,0.15); color: #10b981; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.ana-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.ana-badge-easy    { background: rgba(16,185,129,0.15); color: #10b981; }
.ana-badge-medium  { background: rgba(245,158,11,0.15); color: #f59e0b; }
.ana-badge-hard    { background: rgba(239,68,68,0.15);  color: #ef4444; }
.ana-badge-outlier { background: rgba(139,92,246,0.15); color: #8b5cf6; }

/* ---------- Info Banner ---------- */
.ana-info-banner {
  display: flex;
  gap: 16px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}
.ana-info-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
.ana-info-banner strong { color: #e2e8f0; display: block; margin-bottom: 4px; }

/* ---------- Item Controls ---------- */
.ana-item-controls { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.ana-btn-outline {
  background: none;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 10px;
  padding: 0 16px;
  height: 40px;
  font-size: 13px;
  cursor: pointer;
  transition: border-color .2s, color .2s;
}
.ana-btn-outline:hover { border-color: #6366f1; color: #818cf8; }

/* ---------- Legend ---------- */
.ana-item-legend { font-size: 12px; color: #64748b; margin-bottom: 16px; display: flex; align-items: center; flex-wrap: wrap; }
.ana-legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }

/* ---------- Search / Student ---------- */
.ana-trajectory-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.ana-search-wrap { position: relative; display: flex; align-items: center; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 0 12px; height: 42px; min-width: 260px; }
.ana-search-icon { font-size: 16px; margin-right: 8px; color: #64748b; }
.ana-search-input { background: none; border: none; color: #e2e8f0; font-size: 14px; outline: none; flex: 1; }
.ana-search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  z-index: 50;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  overflow: hidden;
}
.ana-search-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; font-size: 14px; transition: background .15s; }
.ana-search-item:hover { background: #334155; }
.ana-search-empty { padding: 12px 14px; font-size: 13px; color: #64748b; }
.ana-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
.ana-student-chip {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.4);
  border-radius: 999px; padding: 6px 14px 6px 6px;
  font-size: 14px; color: #818cf8;
}
.ana-chip-remove { background: none; border: none; color: #64748b; cursor: pointer; font-size: 14px; line-height: 1; padding: 0 0 0 4px; }
.ana-chip-remove:hover { color: #ef4444; }

.ana-no-student { text-align: center; padding: 60px 20px; color: #64748b; }
.ana-no-student-icon { font-size: 48px; margin-bottom: 12px; }

/* ---------- Weak Topics ---------- */
.ana-weak-list { padding: 8px 4px; }
.ana-weak-item { padding: 12px 0; border-bottom: 1px solid #1e293b; }
.ana-weak-item:last-child { border-bottom: none; }
.ana-weak-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
.ana-weak-topic { font-size: 14px; font-weight: 500; color: #e2e8f0; }
.ana-weak-score { font-size: 14px; font-weight: 700; }
.ana-weak-bar-bg { height: 5px; background: #334155; border-radius: 99px; overflow: hidden; margin-bottom: 6px; }
.ana-weak-bar-fill { height: 100%; border-radius: 99px; transition: width .4s; }
.ana-weak-rec { font-size: 12px; color: #64748b; }
.ana-weak-quiz { color: #818cf8; font-weight: 500; }

/* ---------- Export Center ---------- */
.ana-section-title { font-size: 18px; font-weight: 700; color: #e2e8f0; margin: 0 0 6px; }
.ana-section-sub { font-size: 14px; color: #64748b; margin: 0 0 24px; }
.ana-export-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 8px;
}
@media(max-width:1000px) { .ana-export-grid { grid-template-columns: repeat(2,1fr); } }
@media(max-width:640px)  { .ana-export-grid { grid-template-columns: 1fr; } }
.ana-export-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: transform .2s, box-shadow .2s;
}
.ana-export-card:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.ana-export-icon {
  width: 52px; height: 52px;
  border-radius: 12px;
  border: 1px solid;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.ana-export-body { flex: 1; min-width: 0; }
.ana-export-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.ana-export-title { font-size: 15px; font-weight: 600; color: #e2e8f0; }
.ana-export-fmt { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.ana-export-desc { font-size: 13px; color: #64748b; margin: 0 0 14px; line-height: 1.5; }
.ana-export-controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.ana-btn-generate {
  flex-shrink: 0;
  background: none;
  border: 1px solid;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 0 14px;
  height: 36px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background .2s, color .2s;
  white-space: nowrap;
}
.ana-btn-generate:hover { background: rgba(99,102,241,0.15); color: #818cf8; }
.ana-btn-dl {
  background: none;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: border-color .2s, color .2s;
}
.ana-btn-dl:hover { border-color: #6366f1; color: #818cf8; }
</style>
  `,
};
