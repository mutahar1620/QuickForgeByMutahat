import { Icons } from '../icons.js';

export const UserList = {
  name: 'UserList',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    return { Icons, navigate: (page) => emit('navigate', page) };
  },
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center mb-2">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">User Management</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Manage students, instructors, and administrators.</p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:bg-slate-700 flex items-center gap-2">
            <span v-html="Icons.upload" class="w-4 h-4"></span> Bulk Import
          </button>
          <button class="btn-primary px-4 py-2 rounded-lg text-sm font-medium text-slate-900 dark:text-white shadow-glow flex items-center gap-2">
            <span v-html="Icons.plus" class="w-4 h-4"></span> Add User
          </button>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div class="glass p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center" v-html="Icons.users"></div>
          <div><p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Total Users</p><p class="text-2xl font-bold text-slate-900 dark:text-white">1,895</p></div>
        </div>
        <div class="glass p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center" v-html="Icons.users"></div>
          <div><p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Students</p><p class="text-2xl font-bold text-slate-900 dark:text-white">1,847</p></div>
        </div>
        <div class="glass p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center" v-html="Icons.users"></div>
          <div><p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Instructors</p><p class="text-2xl font-bold text-slate-900 dark:text-white">42</p></div>
        </div>
        <div class="glass p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center" v-html="Icons.shield"></div>
          <div><p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Admins</p><p class="text-2xl font-bold text-slate-900 dark:text-white">6</p></div>
        </div>
      </div>

      <div class="glass rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-4 bg-slate-100 dark:bg-slate-800/50">
          <div class="relative w-96">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500" v-html="Icons.search"></span>
            <input type="text" placeholder="Search users by name or email..." class="form-input pl-10" />
          </div>
          <select class="form-input w-40"><option>Role: All</option><option>Student</option><option>Instructor</option><option>Admin</option></select>
          <select class="form-input w-40"><option>Status: All</option><option>Active</option><option>Inactive</option></select>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th class="p-4 w-10"><input type="checkbox" class="rounded border-slate-600 bg-slate-100 dark:bg-slate-800 text-indigo-500"></th>
                <th class="p-4 font-medium">User</th>
                <th class="p-4 font-medium">Role</th>
                <th class="p-4 font-medium">Status</th>
                <th class="p-4 font-medium">Performance</th>
                <th class="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr v-for="user in data.users" :key="user.id" class="hover:bg-slate-100 dark:bg-slate-800/50 transition-colors">
                <td class="p-4"><input type="checkbox" class="rounded border-slate-600 bg-slate-100 dark:bg-slate-800 text-indigo-500"></td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div :class="['w-9 h-9 rounded-full flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs', user.role==='admin'?'bg-red-500':user.role==='instructor'?'bg-violet-500':'bg-blue-500']">{{ user.name.charAt(0) }}</div>
                    <div>
                      <p class="font-medium text-slate-900 dark:text-white">{{ user.name }}</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-4"><span :class="['badge capitalize', user.role==='admin'?'badge-danger':user.role==='instructor'?'badge-purple':'badge-info']">{{ user.role }}</span></td>
                <td class="p-4"><span :class="['badge', user.status==='active'?'badge-success':'badge-warning']">{{ user.status }}</span></td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div :class="['h-full rounded-full', user.avgScore>=80?'bg-green-500':user.avgScore>=60?'bg-amber-500':'bg-red-500']" :style="{width: user.avgScore + '%'}"></div>
                    </div>
                    <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ user.avgScore }}%</span>
                  </div>
                </td>
                <td class="p-4 text-right">
                  <button class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors" v-html="Icons.edit"></button>
                  <button class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-400 transition-colors" v-html="Icons.trash"></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <span>Showing 1 to 8 of 1,895 entries</span>
          <div class="flex gap-1">
            <button class="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white">&lt;</button>
            <button class="px-3 py-1 rounded bg-indigo-500 text-slate-900 dark:text-white">1</button>
            <button class="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white">2</button>
            <button class="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white">3</button>
            <button class="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  `
};

export const SettingsPage = {
  name: 'SettingsPage',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref } = Vue;
    const activeTab = ref('general');
    return { Icons, navigate: (page) => emit('navigate', page), activeTab };
  },
  template: `
    <div class="p-6 h-full flex flex-col">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">System Settings</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Configure global application preferences.</p>
      </div>

      <div class="flex-1 flex gap-6 overflow-hidden">
        <div class="w-64 flex flex-col gap-2">
          <button @click="activeTab='general'" :class="['w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3', activeTab==='general'?'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30':'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800']"><span v-html="Icons.settings" class="w-5 h-5"></span> General</button>
          <button @click="activeTab='branding'" :class="['w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3', activeTab==='branding'?'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30':'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800']"><span v-html="Icons.edit" class="w-5 h-5"></span> Branding</button>
          <button @click="activeTab='security'" :class="['w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3', activeTab==='security'?'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30':'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800']"><span v-html="Icons.shield" class="w-5 h-5"></span> Security</button>
          <button @click="activeTab='notifications'" :class="['w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3', activeTab==='notifications'?'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30':'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800']"><span v-html="Icons.bell" class="w-5 h-5"></span> Notifications</button>
          <button @click="activeTab='integrations'" :class="['w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3', activeTab==='integrations'?'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30':'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800']"><span v-html="Icons.link" class="w-5 h-5"></span> Integrations</button>
        </div>

        <div class="flex-1 glass rounded-xl border border-slate-200 dark:border-slate-700 p-8 overflow-y-auto">
          <!-- General Settings -->
          <div v-if="activeTab==='general'" class="max-w-2xl space-y-8">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">General Settings</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Institution Name</label>
                <input type="text" value="State University" class="form-input" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Timezone</label>
                  <select class="form-input"><option>UTC-5 (Eastern Time)</option></select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Default Language</label>
                  <select class="form-input"><option>English (US)</option><option>Arabic (RTL)</option></select>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Quiz Defaults</h3>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Time Limit (min)</label>
                  <input type="number" value="60" class="form-input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Attempts</label>
                  <input type="number" value="1" class="form-input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Pass Mark (%)</label>
                  <input type="number" value="70" class="form-input" />
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <button class="btn-primary px-8 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white shadow-glow">Save Changes</button>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab==='security'" class="max-w-2xl space-y-8">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">Security & Proctoring</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 class="text-slate-900 dark:text-white font-medium">Require Two-Factor Authentication</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Force 2FA for all Admin and Instructor accounts.</p>
                </div>
                <div class="toggle on"></div>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 class="text-slate-900 dark:text-white font-medium flex items-center gap-2">AI Webcam Proctoring <span class="ai-badge text-[9px] py-0.5 px-2"><span v-html="Icons.ai" class="w-3 h-3"></span></span></h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Detect absence, multiple faces, and suspicious eye movement.</p>
                </div>
                <div class="toggle"></div>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 class="text-slate-900 dark:text-white font-medium">Tab-Switch Detection</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Warn and log when students leave the quiz tab.</p>
                </div>
                <div class="toggle on"></div>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 class="text-slate-900 dark:text-white font-medium">Disable Copy/Paste</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Prevent clipboard access during quizzes.</p>
                </div>
                <div class="toggle on"></div>
              </div>
            </div>
            
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <button class="btn-primary px-8 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white shadow-glow">Save Settings</button>
            </div>
          </div>
          
          <!-- Integrations Settings -->
          <div v-if="activeTab==='integrations'" class="space-y-8">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">Integrations</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="int in data.integrations" :key="int.id" class="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 flex flex-col justify-between h-36">
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">{{ int.icon }}</span>
                    <h3 class="font-bold text-slate-900 dark:text-white">{{ int.name }}</h3>
                  </div>
                  <span :class="['badge', int.status==='connected'?'badge-success':'badge-warning']">{{ int.status }}</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 flex-1">{{ int.description }}</p>
                <div class="flex justify-between items-center mt-auto">
                  <span class="text-[10px] text-slate-500">{{ int.lastSync ? 'Last sync: ' + int.lastSync : 'Never synced' }}</span>
                  <button :class="['text-xs font-bold px-3 py-1 rounded', int.status==='connected'?'text-red-400 hover:bg-red-500/10':'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20']">{{ int.status==='connected'?'Disconnect':'Connect' }}</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Other placeholders -->
          <div v-if="activeTab==='branding' || activeTab==='notifications'" class="flex flex-col items-center justify-center h-full text-center">
            <span class="text-slate-500 mb-4 text-4xl">⚙️</span>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Settings Area</h2>
            <p class="text-slate-500 dark:text-slate-400">This configuration panel is implemented similarly to others.</p>
          </div>
        </div>
      </div>
    </div>
  `
};
