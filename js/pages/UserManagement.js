// ============================================================
// UserManagement.js – Vue 3 (CDN global) components
// Exports: UserList, UserProfile
// ============================================================

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────
const roleColor = (role) => {
  const map = { admin: '#ef4444', instructor: '#8b5cf6', student: '#6366f1' };
  return map[role] || '#64748b';
};
const roleBg = (role) => {
  const map = { admin: 'badge-red', instructor: 'badge-violet', student: 'badge-blue' };
  return map[role] || 'badge-gray';
};
const statusBg = (s) => (s === 'active' ? 'badge-green' : 'badge-yellow');
const initials = (name) => name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

// ─────────────────────────────────────────────
// COMPONENT 1: UserList
// ─────────────────────────────────────────────
export const UserList = {
  name: 'UserList',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, computed, reactive } = Vue;

    // ── State ──────────────────────────────────
    const searchQuery   = ref('');
    const roleFilter    = ref('');
    const statusFilter  = ref('');
    const sortColumn    = ref('name');
    const sortDir       = ref('asc');
    const currentPage   = ref(1);
    const perPage       = ref(10);
    const selectedUsers = ref([]);
    const showImportModal = ref(false);
    const bulkRole      = ref('');

    // Import modal state
    const importState = reactive({
      dragging: false,
      file: null,
      fileName: '',
      preview: [],
      headers: [],
      mapping: {},
      fieldOptions: ['name', 'email', 'role', 'status', 'password', '(skip)'],
    });

    // ── Sample data (used when props.data is absent) ───────
    const defaultUsers = [
      { id: 1,  name: 'Alice Johnson',   email: 'alice@school.edu',   role: 'admin',      status: 'active',   quizzesTaken: 42, avgScore: 91, lastActive: '2026-06-23' },
      { id: 2,  name: 'Bob Martinez',    email: 'bob@school.edu',     role: 'instructor', status: 'active',   quizzesTaken: 18, avgScore: 78, lastActive: '2026-06-22' },
      { id: 3,  name: 'Carol White',     email: 'carol@school.edu',   role: 'student',    status: 'active',   quizzesTaken: 35, avgScore: 83, lastActive: '2026-06-24' },
      { id: 4,  name: 'David Kim',       email: 'david@school.edu',   role: 'student',    status: 'inactive', quizzesTaken: 7,  avgScore: 55, lastActive: '2026-05-10' },
      { id: 5,  name: 'Eva Nguyen',      email: 'eva@school.edu',     role: 'instructor', status: 'active',   quizzesTaken: 24, avgScore: 88, lastActive: '2026-06-20' },
      { id: 6,  name: 'Frank Lee',       email: 'frank@school.edu',   role: 'student',    status: 'active',   quizzesTaken: 61, avgScore: 74, lastActive: '2026-06-21' },
      { id: 7,  name: 'Grace Patel',     email: 'grace@school.edu',   role: 'student',    status: 'active',   quizzesTaken: 29, avgScore: 95, lastActive: '2026-06-23' },
      { id: 8,  name: 'Hiro Tanaka',     email: 'hiro@school.edu',    role: 'student',    status: 'inactive', quizzesTaken: 3,  avgScore: 40, lastActive: '2026-04-18' },
      { id: 9,  name: 'Isabel Cruz',     email: 'isabel@school.edu',  role: 'admin',      status: 'active',   quizzesTaken: 51, avgScore: 89, lastActive: '2026-06-24' },
      { id: 10, name: 'Jake Thompson',   email: 'jake@school.edu',    role: 'student',    status: 'active',   quizzesTaken: 14, avgScore: 66, lastActive: '2026-06-19' },
      { id: 11, name: 'Karen Brooks',    email: 'karen@school.edu',   role: 'instructor', status: 'active',   quizzesTaken: 33, avgScore: 81, lastActive: '2026-06-22' },
      { id: 12, name: 'Liam O\'Brien',   email: 'liam@school.edu',    role: 'student',    status: 'active',   quizzesTaken: 47, avgScore: 77, lastActive: '2026-06-23' },
    ];

    const users = computed(() => (props.data && props.data.users) || defaultUsers);

    // ── Stats ──────────────────────────────────
    const stats = computed(() => ({
      total:       users.value.length,
      admins:      users.value.filter(u => u.role === 'admin').length,
      instructors: users.value.filter(u => u.role === 'instructor').length,
      students:    users.value.filter(u => u.role === 'student').length,
    }));

    // ── Filtered + Sorted ──────────────────────
    const filtered = computed(() => {
      let list = users.value.filter(u => {
        const q = searchQuery.value.toLowerCase();
        const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        const matchR = !roleFilter.value || u.role === roleFilter.value;
        const matchS = !statusFilter.value || u.status === statusFilter.value;
        return matchQ && matchR && matchS;
      });
      list = [...list].sort((a, b) => {
        let va = a[sortColumn.value], vb = b[sortColumn.value];
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        if (va < vb) return sortDir.value === 'asc' ? -1 : 1;
        if (va > vb) return sortDir.value === 'asc' ? 1  : -1;
        return 0;
      });
      return list;
    });

    const totalPages  = computed(() => Math.ceil(filtered.value.length / perPage.value));
    const paginated   = computed(() => {
      const s = (currentPage.value - 1) * perPage.value;
      return filtered.value.slice(s, s + perPage.value);
    });
    const allSelected = computed(() =>
      paginated.value.length > 0 && paginated.value.every(u => selectedUsers.value.includes(u.id))
    );

    // ── Actions ────────────────────────────────
    const setSort = (col) => {
      if (sortColumn.value === col) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
      else { sortColumn.value = col; sortDir.value = 'asc'; }
    };
    const toggleAll = () => {
      if (allSelected.value) selectedUsers.value = selectedUsers.value.filter(id => !paginated.value.find(u => u.id === id));
      else paginated.value.forEach(u => { if (!selectedUsers.value.includes(u.id)) selectedUsers.value.push(u.id); });
    };
    const toggleUser = (id) => {
      const i = selectedUsers.value.indexOf(id);
      if (i === -1) selectedUsers.value.push(id);
      else selectedUsers.value.splice(i, 1);
    };
    const clearSelection = () => { selectedUsers.value = []; };
    const bulkDelete     = () => { alert(`Delete ${selectedUsers.value.length} users?`); clearSelection(); };
    const bulkChangeRole = () => { if (bulkRole.value) alert(`Change ${selectedUsers.value.length} users to ${bulkRole.value}`); };
    const bulkExport     = () => { alert('Exporting selected users as CSV…'); };
    const sortIcon = (col) => {
      if (sortColumn.value !== col) return '↕';
      return sortDir.value === 'asc' ? '↑' : '↓';
    };

    // ── Import modal ───────────────────────────
    const openImport  = () => { showImportModal.value = true; };
    const closeImport = () => { showImportModal.value = false; importState.file = null; importState.preview = []; importState.headers = []; };
    const onDragOver  = (e) => { e.preventDefault(); importState.dragging = true; };
    const onDragLeave = () => { importState.dragging = false; };
    const onDrop = (e) => {
      e.preventDefault();
      importState.dragging = false;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    };
    const onFileInput = (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    };
    const handleFile = (file) => {
      importState.file = file;
      importState.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n').filter(l => l.trim());
        importState.headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        importState.mapping = Object.fromEntries(importState.headers.map(h => [h, '(skip)']));
        importState.preview = lines.slice(1, 6).map(l =>
          l.split(',').map(v => v.trim().replace(/"/g, ''))
        );
      };
      reader.readAsText(file);
    };
    const runImport = () => { alert('Import started! Mapping: ' + JSON.stringify(importState.mapping)); closeImport(); };

    return {
      searchQuery, roleFilter, statusFilter, sortColumn, sortDir,
      currentPage, perPage, selectedUsers, showImportModal, bulkRole,
      importState, users, stats, filtered, totalPages, paginated, allSelected,
      setSort, toggleAll, toggleUser, clearSelection,
      bulkDelete, bulkChangeRole, bulkExport, sortIcon,
      openImport, closeImport, onDragOver, onDragLeave, onDrop, onFileInput, runImport,
      roleColor, roleBg, statusBg, initials, fmtDate,
      emit,
    };
  },

  template: `
<div class="space-y-6 animate-fade-in">

  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Management</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">Manage learners, instructors and administrators</p>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button @click="openImport" id="btn-bulk-import"
        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-600 text-slate-600 dark:text-slate-300
               hover:border-violet-500 hover:text-violet-300 transition-all duration-200 text-sm font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        Bulk Import
      </button>
      <button @click="emit('navigate','add-user')" id="btn-add-user"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600
               hover:from-indigo-500 hover:to-violet-500 text-slate-900 dark:text-white font-semibold text-sm shadow-lg
               shadow-indigo-500/25 transition-all duration-200 hover:scale-105">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add User
      </button>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="(card, idx) in [
      {label:'Total Users',  value:stats.total,       icon:'👥', color:'from-indigo-600/30 to-indigo-500/10', border:'border-indigo-500/30'},
      {label:'Admins',       value:stats.admins,      icon:'🛡️', color:'from-red-600/30 to-red-500/10',     border:'border-red-500/30'},
      {label:'Instructors',  value:stats.instructors, icon:'🎓', color:'from-violet-600/30 to-violet-500/10',border:'border-violet-500/30'},
      {label:'Students',     value:stats.students,    icon:'📚', color:'from-blue-600/30 to-blue-500/10',   border:'border-blue-500/30'},
    ]" :key="idx"
      :id="'stat-card-' + card.label.toLowerCase().replace(/ /g,'-')"
      :class="['glass rounded-2xl p-5 border card-hover bg-gradient-to-br', card.color, card.border]">
      <div class="flex items-center justify-between mb-3">
        <span class="text-2xl">{{card.icon}}</span>
      </div>
      <div class="text-3xl font-bold text-slate-900 dark:text-white">{{card.value}}</div>
      <div class="text-slate-500 dark:text-slate-400 text-sm mt-1">{{card.label}}</div>
    </div>
  </div>

  <!-- Filters -->
  <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-4 flex flex-wrap gap-3 items-center">
    <div class="relative flex-1 min-w-48">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
      </svg>
      <input id="user-search" v-model="searchQuery" type="text" placeholder="Search name or email…"
        class="form-input w-full pl-10 pr-4 py-2 rounded-xl text-sm" @input="currentPage=1"/>
    </div>
    <select id="filter-role" v-model="roleFilter" class="form-input px-3 py-2 rounded-xl text-sm min-w-36" @change="currentPage=1">
      <option value="">All Roles</option>
      <option value="admin">Admin</option>
      <option value="instructor">Instructor</option>
      <option value="student">Student</option>
    </select>
    <select id="filter-status" v-model="statusFilter" class="form-input px-3 py-2 rounded-xl text-sm min-w-36" @change="currentPage=1">
      <option value="">All Statuses</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    <span class="text-slate-500 text-sm ml-auto">{{filtered.length}} result{{filtered.length!==1?'s':''}}</span>
  </div>

  <!-- Bulk Action Bar -->
  <transition name="slide-down">
    <div v-if="selectedUsers.length > 0"
      class="glass border border-indigo-500/40 rounded-2xl p-3 flex flex-wrap items-center gap-3 bg-indigo-950/40">
      <span class="text-indigo-300 font-semibold text-sm">{{selectedUsers.length}} selected</span>
      <button @click="clearSelection" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-200 dark:bg-slate-700 transition">✕ Clear</button>
      <div class="flex gap-2 ml-auto flex-wrap">
        <select v-model="bulkRole" class="form-input text-xs px-3 py-1.5 rounded-lg">
          <option value="">Change Role…</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
        <button @click="bulkChangeRole" id="btn-bulk-change-role"
          class="text-xs px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-slate-900 dark:text-white font-medium transition">Apply Role</button>
        <button @click="bulkExport" id="btn-bulk-export"
          class="text-xs px-3 py-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-slate-900 dark:text-white font-medium transition">Export CSV</button>
        <button @click="bulkDelete" id="btn-bulk-delete"
          class="text-xs px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-slate-900 dark:text-white font-medium transition">Delete</button>
      </div>
    </div>
  </transition>

  <!-- Table -->
  <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800/40">
            <th class="px-4 py-3 w-10">
              <input type="checkbox" :checked="allSelected" @change="toggleAll"
                class="w-4 h-4 rounded border-slate-600 bg-slate-100 dark:bg-slate-800 accent-indigo-500 cursor-pointer"/>
            </th>
            <th class="px-4 py-3 w-10 text-slate-500 dark:text-slate-400 font-medium">Avatar</th>
            <th class="px-4 py-3 text-left text-slate-500 dark:text-slate-400 font-medium cursor-pointer select-none hover:text-slate-900 dark:text-white transition"
              @click="setSort('name')">
              Name / Email <span class="text-indigo-400 ml-1">{{sortIcon('name')}}</span>
            </th>
            <th class="px-4 py-3 text-left text-slate-500 dark:text-slate-400 font-medium cursor-pointer select-none hover:text-slate-900 dark:text-white transition"
              @click="setSort('role')">
              Role <span class="text-indigo-400 ml-1">{{sortIcon('role')}}</span>
            </th>
            <th class="px-4 py-3 text-left text-slate-500 dark:text-slate-400 font-medium cursor-pointer select-none hover:text-slate-900 dark:text-white transition"
              @click="setSort('status')">
              Status <span class="text-indigo-400 ml-1">{{sortIcon('status')}}</span>
            </th>
            <th class="px-4 py-3 text-right text-slate-500 dark:text-slate-400 font-medium cursor-pointer select-none hover:text-slate-900 dark:text-white transition"
              @click="setSort('quizzesTaken')">
              Quizzes <span class="text-indigo-400 ml-1">{{sortIcon('quizzesTaken')}}</span>
            </th>
            <th class="px-4 py-3 text-right text-slate-500 dark:text-slate-400 font-medium cursor-pointer select-none hover:text-slate-900 dark:text-white transition min-w-36"
              @click="setSort('avgScore')">
              Avg Score <span class="text-indigo-400 ml-1">{{sortIcon('avgScore')}}</span>
            </th>
            <th class="px-4 py-3 text-left text-slate-500 dark:text-slate-400 font-medium cursor-pointer select-none hover:text-slate-900 dark:text-white transition"
              @click="setSort('lastActive')">
              Last Active <span class="text-indigo-400 ml-1">{{sortIcon('lastActive')}}</span>
            </th>
            <th class="px-4 py-3 text-center text-slate-500 dark:text-slate-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/40">
          <tr v-if="paginated.length === 0">
            <td colspan="9" class="text-center py-16 text-slate-500">
              <div class="text-4xl mb-3">🔍</div>
              <div>No users match your filters.</div>
            </td>
          </tr>
          <tr v-for="user in paginated" :key="user.id"
            :class="['transition-colors duration-150 hover:bg-slate-200 dark:bg-slate-700/30',
              selectedUsers.includes(user.id) ? 'bg-indigo-950/30' : '']">
            <!-- Checkbox -->
            <td class="px-4 py-3">
              <input type="checkbox" :checked="selectedUsers.includes(user.id)" @change="toggleUser(user.id)"
                class="w-4 h-4 rounded border-slate-600 bg-slate-100 dark:bg-slate-800 accent-indigo-500 cursor-pointer"/>
            </td>
            <!-- Avatar -->
            <td class="px-4 py-3">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs shadow-md flex-shrink-0"
                :style="{background: 'linear-gradient(135deg,' + roleColor(user.role) + '99,' + roleColor(user.role) + ')'}">
                {{initials(user.name)}}
              </div>
            </td>
            <!-- Name + Email -->
            <td class="px-4 py-3">
              <div class="font-semibold text-slate-900 dark:text-white leading-tight">{{user.name}}</div>
              <div class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{user.email}}</div>
            </td>
            <!-- Role -->
            <td class="px-4 py-3">
              <span :class="['badge capitalize', roleBg(user.role)]">{{user.role}}</span>
            </td>
            <!-- Status -->
            <td class="px-4 py-3">
              <span :class="['badge capitalize', statusBg(user.status)]">{{user.status}}</span>
            </td>
            <!-- Quizzes -->
            <td class="px-4 py-3 text-right text-slate-600 dark:text-slate-300 font-medium tabular-nums">{{user.quizzesTaken}}</td>
            <!-- Avg Score + Progress bar -->
            <td class="px-4 py-3 min-w-36">
              <div class="flex items-center gap-2 justify-end">
                <div class="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-20">
                  <div class="h-full rounded-full transition-all duration-700"
                    :style="{
                      width: user.avgScore + '%',
                      background: user.avgScore >= 80 ? 'linear-gradient(90deg,#6366f1,#8b5cf6)'
                                : user.avgScore >= 60 ? 'linear-gradient(90deg,#f59e0b,#f97316)'
                                : 'linear-gradient(90deg,#ef4444,#f97316)'
                    }"></div>
                </div>
                <span class="text-slate-600 dark:text-slate-300 font-semibold tabular-nums text-xs w-8 text-right">{{user.avgScore}}%</span>
              </div>
            </td>
            <!-- Last Active -->
            <td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{{fmtDate(user.lastActive)}}</td>
            <!-- Actions -->
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1">
                <button @click="emit('navigate','user-profile-'+user.id)" title="View Profile"
                  class="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <button title="Edit" class="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button title="Reset Password" class="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-yellow-300 hover:bg-yellow-500/10 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                </button>
                <button title="Delete" class="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/20">
      <span class="text-slate-500 dark:text-slate-400 text-xs">
        Showing {{ Math.min((currentPage-1)*perPage+1, filtered.length) }}–{{ Math.min(currentPage*perPage, filtered.length) }}
        of {{ filtered.length }}
      </span>
      <div class="flex gap-1">
        <button @click="currentPage=1" :disabled="currentPage===1"
          class="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-500
                 hover:text-slate-900 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition">«</button>
        <button @click="currentPage--" :disabled="currentPage===1"
          class="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-500
                 hover:text-slate-900 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition">‹</button>
        <template v-for="p in totalPages" :key="p">
          <button v-if="Math.abs(p-currentPage)<=2 || p===1 || p===totalPages"
            @click="currentPage=p"
            :class="['px-3 py-1 text-xs rounded-lg border transition',
              p===currentPage
                ? 'bg-indigo-600 border-indigo-500 text-slate-900 dark:text-white font-semibold'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-500 hover:text-slate-900 dark:text-white']">
            {{p}}
          </button>
          <span v-else-if="Math.abs(p-currentPage)===3" class="px-1 text-slate-600 text-xs self-center">…</span>
        </template>
        <button @click="currentPage++" :disabled="currentPage===totalPages||totalPages===0"
          class="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-500
                 hover:text-slate-900 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition">›</button>
        <button @click="currentPage=totalPages" :disabled="currentPage===totalPages||totalPages===0"
          class="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-500
                 hover:text-slate-900 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition">»</button>
      </div>
    </div>
  </div>

  <!-- ─── Import CSV Modal ─── -->
  <transition name="fade">
    <div v-if="showImportModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="closeImport">
      <div class="glass border border-slate-200 dark:border-slate-700/60 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/40">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Bulk Import Users</h2>
            <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Upload a CSV file to import multiple users at once</p>
          </div>
          <button @click="closeImport" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition text-xl leading-none">✕</button>
        </div>
        <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          <!-- Drag & Drop Zone -->
          <div @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop"
            :class="['border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer',
              importState.dragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-600 hover:border-slate-500']"
            @click="$refs.csvInput.click()">
            <input ref="csvInput" type="file" accept=".csv" class="hidden" @change="onFileInput"/>
            <div v-if="!importState.file">
              <div class="text-4xl mb-3">📂</div>
              <p class="text-slate-900 dark:text-white font-semibold">Drag & drop your CSV here</p>
              <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">or click to browse files</p>
              <p class="text-slate-500 text-xs mt-3">Supported: .csv · Max 10 MB</p>
            </div>
            <div v-else class="flex items-center justify-center gap-3">
              <span class="text-3xl">📄</span>
              <div class="text-left">
                <p class="text-slate-900 dark:text-white font-semibold">{{importState.fileName}}</p>
                <p class="text-slate-500 dark:text-slate-400 text-xs">{{importState.preview.length}} data rows detected</p>
              </div>
              <button @click.stop="importState.file=null;importState.preview=[]"
                class="ml-4 text-red-400 hover:text-red-300 text-sm transition">Remove</button>
            </div>
          </div>

          <!-- Column Mapping -->
          <div v-if="importState.headers.length > 0">
            <h3 class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Map CSV Columns → Fields</h3>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="header in importState.headers" :key="header"
                class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl px-3 py-2">
                <span class="text-slate-600 dark:text-slate-300 text-xs font-mono flex-1 truncate">{{header}}</span>
                <svg class="w-3 h-3 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <select v-model="importState.mapping[header]"
                  class="form-input text-xs px-2 py-1 rounded-lg flex-shrink-0 w-28">
                  <option v-for="opt in importState.fieldOptions" :key="opt" :value="opt">{{opt}}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Preview Table -->
          <div v-if="importState.preview.length > 0">
            <h3 class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Preview (first {{importState.preview.length}} rows)</h3>
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
              <table class="w-full text-xs">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/50">
                    <th v-for="h in importState.headers" :key="h"
                      class="px-3 py-2 text-left text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{{h}}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/30">
                  <tr v-for="(row, ri) in importState.preview" :key="ri" class="hover:bg-slate-200 dark:bg-slate-700/20">
                    <td v-for="(cell, ci) in row" :key="ci" class="px-3 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{cell}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/30">
          <button @click="closeImport"
            class="px-4 py-2 text-sm rounded-xl border border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-500 hover:text-slate-900 dark:text-white transition">
            Cancel
          </button>
          <button @click="runImport" :disabled="!importState.file" id="btn-run-import"
            class="px-5 py-2 text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600
                   hover:from-indigo-500 hover:to-violet-500 text-slate-900 dark:text-white font-semibold shadow-lg
                   shadow-indigo-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Import Users
          </button>
        </div>
      </div>
    </div>
  </transition>

</div>
  `,
};


// ─────────────────────────────────────────────
// COMPONENT 2: UserProfile
// ─────────────────────────────────────────────
export const UserProfile = {
  name: 'UserProfile',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, computed, onMounted, watch } = Vue;

    // ── Active tab ──────────────────────────────
    const activeTab = ref('overview');
    const tabs = ['overview', 'quiz-history', 'groups', 'settings'];

    // ── Notification prefs ──────────────────────
    const notifPrefs = ref({
      emailResults:  true,
      emailReminders: true,
      pushResults:   false,
      pushBadges:    true,
      weeklyReport:  true,
    });
    const twoFA = ref(false);

    // ── Date range filter (quiz history) ────────
    const dateFrom = ref('');
    const dateTo   = ref('');

    // ── Sample profile data ─────────────────────
    const defaultProfile = {
      id: 1,
      name:      'Alice Johnson',
      email:     'alice@school.edu',
      role:      'admin',
      status:    'active',
      joinDate:  '2024-09-01',
      avatar:    null,
      stats: {
        totalQuizzes:    42,
        avgScore:        91,
        completionRate:  96,
        streak:          14,
        badges:          8,
        totalXP:         4250,
      },
      trajectory: [72, 75, 78, 74, 82, 85, 88, 91, 89, 93, 91, 94],
      skills:    { Algebra: 85, Geometry: 70, Calculus: 90, Statistics: 78, Logic: 92 },
      recentActivity: [
        { icon: '🏆', text: 'Earned badge "Perfect Score"',       time: '2h ago' },
        { icon: '📝', text: 'Completed "Calculus Final" — 94%',   time: '5h ago' },
        { icon: '🎯', text: 'Joined cohort "Math Advanced 2026"', time: '1d ago' },
        { icon: '🔑', text: 'Reset account password',             time: '3d ago' },
        { icon: '📚', text: 'Started "Statistics Module 3"',      time: '4d ago' },
      ],
      quizHistory: [
        { name: 'Calculus Final',      score: 94, time: '48m', date: '2026-06-23', status: 'passed' },
        { name: 'Algebra Mid-Term',    score: 88, time: '32m', date: '2026-06-15', status: 'passed' },
        { name: 'Geometry Quiz 4',     score: 72, time: '20m', date: '2026-06-10', status: 'passed' },
        { name: 'Statistics Module 2', score: 91, time: '41m', date: '2026-06-04', status: 'passed' },
        { name: 'Logic Puzzle Set',    score: 96, time: '27m', date: '2026-05-28', status: 'passed' },
        { name: 'Calculus Pre-Test',   score: 58, time: '35m', date: '2026-05-20', status: 'failed' },
      ],
      groups: [
        { name: 'Math Advanced 2026', members: 24, color: 'badge-violet' },
        { name: 'AP Calculus',        members: 12, color: 'badge-blue' },
        { name: 'Admin Team',         members: 5,  color: 'badge-red' },
      ],
    };

    const profile = computed(() => (props.data && props.data.profile) || defaultProfile);

    // ── Chart helpers ────────────────────────────
    const drawTrajectory = () => {
      const canvas = document.getElementById('trajectoryChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const data = profile.value.trajectory || [];
      const W = canvas.width, H = canvas.height;
      const pad = { t: 20, b: 30, l: 40, r: 20 };
      const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
      ctx.clearRect(0, 0, W, H);

      if (!data.length) return;
      const min = Math.min(...data) - 5;
      const max = Math.max(...data) + 5;
      const scX = (i) => pad.l + (i / (data.length - 1)) * iW;
      const scY = (v) => pad.t + iH - ((v - min) / (max - min)) * iH;
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      // Grid lines
      ctx.strokeStyle = 'rgba(99,102,241,0.12)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + (iH / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
      }

      // Gradient fill
      const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
      grad.addColorStop(0, 'rgba(99,102,241,0.35)');
      grad.addColorStop(1, 'rgba(99,102,241,0)');
      ctx.beginPath();
      ctx.moveTo(scX(0), scY(data[0]));
      data.forEach((v, i) => { if (i > 0) ctx.lineTo(scX(i), scY(v)); });
      ctx.lineTo(scX(data.length - 1), H - pad.b);
      ctx.lineTo(scX(0), H - pad.b);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(scX(0), scY(data[0]));
      data.forEach((v, i) => { if (i > 0) ctx.lineTo(scX(i), scY(v)); });
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Dots
      data.forEach((v, i) => {
        ctx.beginPath();
        ctx.arc(scX(i), scY(v), 4, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.fill();
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // X labels
      ctx.fillStyle = 'rgba(148,163,184,0.8)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      data.forEach((_, i) => {
        if (i % 2 === 0 || data.length <= 6) {
          ctx.fillText(months[i % 12], scX(i), H - 6);
        }
      });

      // Y labels
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const v = Math.round(min + ((max - min) / 4) * (4 - i));
        ctx.fillText(v + '%', pad.l - 5, pad.t + (iH / 4) * i + 4);
      }
    };

    const drawRadar = () => {
      const canvas = document.getElementById('skillsChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const skills = profile.value.skills || {};
      const labels = Object.keys(skills);
      const values = Object.values(skills).map(v => v / 100);
      const N = labels.length;
      if (!N) return;

      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const R  = Math.min(cx, cy) - 36;
      ctx.clearRect(0, 0, W, H);

      const angle = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
      const pt = (i, r) => ({ x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) });

      // Grid rings
      [0.25, 0.5, 0.75, 1].forEach(frac => {
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const p = pt(i, R * frac);
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(99,102,241,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Spokes
      labels.forEach((_, i) => {
        const p = pt(i, R);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = 'rgba(99,102,241,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Data polygon
      ctx.beginPath();
      values.forEach((v, i) => {
        const p = pt(i, R * v);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      grad.addColorStop(0, 'rgba(139,92,246,0.6)');
      grad.addColorStop(1, 'rgba(99,102,241,0.2)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dots
      values.forEach((v, i) => {
        const p = pt(i, R * v);
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#a78bfa';
        ctx.fill();
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Labels
      ctx.fillStyle = 'rgba(203,213,225,0.9)';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      labels.forEach((label, i) => {
        const p = pt(i, R + 22);
        ctx.fillText(label, p.x, p.y);
      });
    };

    const renderCharts = () => {
      setTimeout(() => { drawTrajectory(); drawRadar(); }, 80);
    };

    onMounted(renderCharts);
    watch(activeTab, (tab) => { if (tab === 'overview') renderCharts(); });

    // ── Filtered quiz history ────────────────────
    const filteredHistory = computed(() => {
      return (profile.value.quizHistory || []).filter(q => {
        if (dateFrom.value && q.date < dateFrom.value) return false;
        if (dateTo.value   && q.date > dateTo.value)   return false;
        return true;
      });
    });

    return {
      activeTab, tabs, notifPrefs, twoFA, dateFrom, dateTo,
      profile, filteredHistory,
      roleColor, roleBg, statusBg, initials, fmtDate,
      emit,
    };
  },

  template: `
<div class="space-y-6 animate-fade-in">

  <!-- Profile Header -->
  <div class="glass rounded-3xl border border-slate-200 dark:border-slate-700/50 p-6 md:p-8">
    <div class="flex flex-col md:flex-row md:items-start gap-6">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div class="w-24 h-24 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white text-3xl font-bold shadow-xl"
          :style="{background: 'linear-gradient(135deg,' + roleColor(profile.role) + 'cc,' + roleColor(profile.role) + ')'}">
          {{initials(profile.name)}}
        </div>
      </div>
      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-3 mb-2">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{profile.name}}</h1>
          <span :class="['badge capitalize', roleBg(profile.role)]">{{profile.role}}</span>
          <span :class="['badge capitalize', statusBg(profile.status)]">{{profile.status}}</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-1">{{profile.email}}</p>
        <p class="text-slate-500 text-xs">Member since {{fmtDate(profile.joinDate)}}</p>
        <!-- Mini stats -->
        <div class="flex flex-wrap gap-4 mt-4">
          <div v-for="s in [
            {label:'Quizzes',  val: profile.stats.totalQuizzes},
            {label:'Avg Score',val: profile.stats.avgScore + '%'},
            {label:'XP',       val: profile.stats.totalXP.toLocaleString()},
            {label:'Streak',   val: profile.stats.streak + ' days'},
          ]" :key="s.label" class="text-center">
            <div class="text-xl font-bold text-slate-900 dark:text-white">{{s.val}}</div>
            <div class="text-slate-500 text-xs">{{s.label}}</div>
          </div>
        </div>
      </div>
      <!-- Action buttons -->
      <div class="flex flex-col gap-2 flex-shrink-0">
        <button class="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600
                       hover:from-indigo-500 hover:to-violet-500 text-slate-900 dark:text-white font-semibold shadow-md transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit Profile
        </button>
        <button class="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-yellow-600/50 text-yellow-400
                       hover:bg-yellow-500/10 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
          </svg>
          Deactivate
        </button>
      </div>
    </div>
  </div>

  <!-- Tab Navigation -->
  <div class="flex gap-1 p-1 glass border border-slate-200 dark:border-slate-700/40 rounded-2xl w-fit">
    <button v-for="tab in ['overview','quiz-history','groups','settings']" :key="tab"
      :id="'tab-' + tab"
      @click="activeTab = tab"
      :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize',
        activeTab === tab
          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-slate-900 dark:text-white shadow-md'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:bg-slate-700/50']">
      {{tab.replace('-', ' ')}}
    </button>
  </div>

  <!-- ═══ OVERVIEW TAB ═══ -->
  <div v-if="activeTab==='overview'" class="space-y-6">
    <!-- 6 Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <div v-for="card in [
        {label:'Quizzes',        val: profile.stats.totalQuizzes,                  icon:'📝', color:'border-indigo-500/30'},
        {label:'Avg Score',      val: profile.stats.avgScore + '%',                icon:'🎯', color:'border-violet-500/30'},
        {label:'Completion',     val: profile.stats.completionRate + '%',          icon:'✅', color:'border-green-500/30'},
        {label:'Streak',         val: profile.stats.streak + 'd',                  icon:'🔥', color:'border-orange-500/30'},
        {label:'Badges',         val: profile.stats.badges,                        icon:'🏆', color:'border-yellow-500/30'},
        {label:'Total XP',       val: profile.stats.totalXP.toLocaleString(),      icon:'⚡', color:'border-blue-500/30'},
      ]" :key="card.label"
        :class="['glass rounded-2xl p-4 border card-hover text-center', card.color]">
        <div class="text-2xl mb-2">{{card.icon}}</div>
        <div class="text-xl font-bold text-slate-900 dark:text-white">{{card.val}}</div>
        <div class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{card.label}}</div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="grid md:grid-cols-2 gap-5">
      <!-- Trajectory -->
      <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5">
        <h3 class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
          <span class="text-indigo-400">📈</span> Learning Trajectory
        </h3>
        <canvas id="trajectoryChart" width="480" height="200" class="w-full h-auto rounded-xl"></canvas>
      </div>
      <!-- Skills Radar -->
      <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5">
        <h3 class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
          <span class="text-violet-400">🕸️</span> Skills Radar
        </h3>
        <canvas id="skillsChart" width="320" height="260" class="w-full h-auto mx-auto block rounded-xl"></canvas>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5">
      <h3 class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
        <span class="text-blue-400">🕐</span> Recent Activity
      </h3>
      <ul class="space-y-3">
        <li v-for="(act, i) in profile.recentActivity" :key="i"
          class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-200 dark:bg-slate-700/30 transition">
          <span class="text-xl flex-shrink-0 mt-0.5">{{act.icon}}</span>
          <div class="flex-1 min-w-0">
            <p class="text-slate-700 dark:text-slate-200 text-sm">{{act.text}}</p>
          </div>
          <span class="text-slate-500 text-xs flex-shrink-0">{{act.time}}</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- ═══ QUIZ HISTORY TAB ═══ -->
  <div v-if="activeTab==='quiz-history'" class="space-y-5">
    <!-- Date range filter -->
    <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-4 flex flex-wrap gap-4 items-end">
      <div>
        <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">From</label>
        <input type="date" v-model="dateFrom" id="history-date-from" class="form-input px-3 py-2 rounded-xl text-sm"/>
      </div>
      <div>
        <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">To</label>
        <input type="date" v-model="dateTo" id="history-date-to" class="form-input px-3 py-2 rounded-xl text-sm"/>
      </div>
      <button @click="dateFrom='';dateTo=''"
        class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white border border-slate-600 hover:border-slate-500 rounded-xl transition">
        Clear
      </button>
      <span class="text-slate-500 text-sm ml-auto self-center">{{filteredHistory.length}} entries</span>
    </div>

    <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40">
            <th class="px-5 py-3 text-left text-slate-500 dark:text-slate-400 font-medium">Quiz</th>
            <th class="px-5 py-3 text-right text-slate-500 dark:text-slate-400 font-medium">Score</th>
            <th class="px-5 py-3 text-right text-slate-500 dark:text-slate-400 font-medium">Time</th>
            <th class="px-5 py-3 text-left text-slate-500 dark:text-slate-400 font-medium">Date</th>
            <th class="px-5 py-3 text-left text-slate-500 dark:text-slate-400 font-medium">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/30">
          <tr v-if="filteredHistory.length===0">
            <td colspan="5" class="text-center py-12 text-slate-500">
              <div class="text-3xl mb-2">📭</div>No quiz history in this range.
            </td>
          </tr>
          <tr v-for="quiz in filteredHistory" :key="quiz.name"
            class="hover:bg-slate-200 dark:bg-slate-700/30 transition">
            <td class="px-5 py-3 text-slate-900 dark:text-white font-medium">{{quiz.name}}</td>
            <td class="px-5 py-3 text-right">
              <span :class="['font-bold tabular-nums',
                quiz.score >= 80 ? 'text-green-400' : quiz.score >= 60 ? 'text-yellow-400' : 'text-red-400']">
                {{quiz.score}}%
              </span>
            </td>
            <td class="px-5 py-3 text-right text-slate-500 dark:text-slate-400 tabular-nums">{{quiz.time}}</td>
            <td class="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs">{{fmtDate(quiz.date)}}</td>
            <td class="px-5 py-3">
              <span :class="['badge capitalize',
                quiz.status==='passed' ? 'badge-green' : 'badge-red']">
                {{quiz.status}}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ═══ GROUPS TAB ═══ -->
  <div v-if="activeTab==='groups'" class="space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Assigned Groups</h2>
      <button id="btn-assign-group"
        class="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600
               hover:from-indigo-500 hover:to-violet-500 text-slate-900 dark:text-white font-semibold shadow-md transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Assign to Group
      </button>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="group in profile.groups" :key="group.name"
        class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 card-hover flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-lg">
          👥
        </div>
        <div class="flex-1">
          <div class="text-slate-900 dark:text-white font-semibold text-sm">{{group.name}}</div>
          <div class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{group.members}} members</div>
        </div>
        <span :class="['badge', group.color]">Active</span>
      </div>
    </div>
    <div v-if="!profile.groups || profile.groups.length === 0"
      class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-12 text-center text-slate-500">
      <div class="text-4xl mb-3">📂</div>
      Not assigned to any groups yet.
    </div>
  </div>

  <!-- ═══ SETTINGS TAB ═══ -->
  <div v-if="activeTab==='settings'" class="space-y-5 max-w-2xl">

    <!-- Notification Preferences -->
    <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
      <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <span class="text-indigo-400">🔔</span> Notification Preferences
      </h3>
      <div class="space-y-4">
        <div v-for="(key, label) in {
          emailResults: 'Email – Quiz results',
          emailReminders: 'Email – Study reminders',
          pushResults: 'Push – Quiz results',
          pushBadges: 'Push – Badge earned',
          weeklyReport: 'Weekly progress digest',
        }" :key="key" class="flex items-center justify-between">
          <span class="text-slate-600 dark:text-slate-300 text-sm">{{label}}</span>
          <label :for="'toggle-'+key" class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" :id="'toggle-'+key" v-model="notifPrefs[key]" class="sr-only peer"/>
            <div class="toggle peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500/50"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Security -->
    <div class="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
      <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <span class="text-violet-400">🔒</span> Security
      </h3>
      <div class="space-y-4">
        <!-- 2FA -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40">
          <div>
            <div class="text-slate-700 dark:text-slate-200 text-sm font-medium">Two-Factor Authentication</div>
            <div class="text-slate-500 text-xs mt-0.5">
              {{twoFA ? 'Enabled — your account is protected' : 'Disabled — enable for extra security'}}
            </div>
          </div>
          <label for="toggle-2fa" class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="toggle-2fa" v-model="twoFA" class="sr-only peer"/>
            <div class="toggle peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500/50"></div>
          </label>
        </div>
        <!-- Password Reset -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40">
          <div>
            <div class="text-slate-700 dark:text-slate-200 text-sm font-medium">Password</div>
            <div class="text-slate-500 text-xs mt-0.5">Send a password reset email</div>
          </div>
          <button id="btn-reset-password"
            class="px-4 py-2 text-xs rounded-xl border border-slate-600 text-slate-600 dark:text-slate-300 hover:border-violet-500 hover:text-violet-300 transition font-medium">
            Send Reset Link
          </button>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="glass rounded-2xl border border-red-500/30 p-6 bg-red-950/10">
      <h3 class="text-base font-semibold text-red-400 mb-4 flex items-center gap-2">
        <span>⚠️</span> Danger Zone
      </h3>
      <div class="flex items-center justify-between p-3 rounded-xl bg-red-950/20 border border-red-500/20">
        <div>
          <div class="text-red-300 text-sm font-medium">Delete Account</div>
          <div class="text-red-400/60 text-xs mt-0.5">Permanently remove this user and all associated data.</div>
        </div>
        <button id="btn-delete-account"
          onclick="confirm('Are you sure? This action is irreversible.')"
          class="px-4 py-2 text-xs rounded-xl bg-red-600/20 border border-red-500/50 text-red-300
                 hover:bg-red-500/30 hover:text-red-200 transition font-semibold">
          Delete Account
        </button>
      </div>
    </div>
  </div>

</div>
  `,
};
