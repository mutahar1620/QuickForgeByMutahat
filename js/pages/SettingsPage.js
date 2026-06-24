export const SettingsPage = {
  name: 'SettingsPage',
  props: ['data'],
  emits: ['navigate'],
  setup(props, { emit }) {
    const { ref, computed, reactive, watch } = Vue;

    // ─── Navigation ────────────────────────────────────────────────────────────
    const activeSection = ref('general');
    const navSections = [
      { id: 'general',       label: 'General',        icon: '⚙️' },
      { id: 'branding',      label: 'Branding',       icon: '🎨' },
      { id: 'security',      label: 'Security',       icon: '🔒' },
      { id: 'notifications', label: 'Notifications',  icon: '🔔' },
      { id: 'integrations',  label: 'Integrations',   icon: '🔌' },
      { id: 'api',           label: 'API & Webhooks', icon: '🔗' },
      { id: 'billing',       label: 'Billing',        icon: '💳' },
      { id: 'accessibility', label: 'Accessibility',  icon: '♿' },
    ];

    // ─── Toast notification ─────────────────────────────────────────────────────
    const toast = reactive({ show: false, message: '', type: 'success' });
    function showToast(msg, type = 'success') {
      toast.message = msg; toast.type = type; toast.show = true;
      setTimeout(() => { toast.show = false; }, 3000);
    }

    // ─── General Tab ───────────────────────────────────────────────────────────
    const general = reactive({
      institutionName: 'Acme University',
      timezone: 'UTC+0',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeLimitDefault: 30,
      attemptLimitDefault: 3,
      passMarkDefault: 70,
      maintenanceMode: false,
    });
    const timezones = ['UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+5:30', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'];
    const languages = [
      { code: 'en', label: 'English' },
      { code: 'fr', label: 'Français' },
      { code: 'es', label: 'Español' },
      { code: 'de', label: 'Deutsch' },
      { code: 'ar', label: 'العربية' },
      { code: 'zh', label: '中文' },
      { code: 'ja', label: '日本語' },
      { code: 'pt', label: 'Português' },
    ];
    const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY'];
    function saveGeneral() { showToast('General settings saved successfully!'); }

    // ─── Branding Tab ──────────────────────────────────────────────────────────
    const branding = reactive({
      logoPreview: null,
      primaryColor: '#6366f1',
      accentColor: '#8b5cf6',
      customPrimary: '#6366f1',
      customAccent: '#8b5cf6',
      font: 'Inter',
      theme: 'system',
      customCSS: '',
    });
    const presetColors = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#14b8a6'];
    const fonts = ['Inter','Roboto','DM Sans','Poppins','Nunito'];
    const logoDropActive = ref(false);

    function handleLogoDrop(e) {
      logoDropActive.value = false;
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = ev => { branding.logoPreview = ev.target.result; };
        reader.readAsDataURL(file);
      }
    }
    function handleLogoInput(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => { branding.logoPreview = ev.target.result; };
        reader.readAsDataURL(file);
      }
    }
    function setBrandingColor(field, color) {
      branding[field] = color;
      if (field === 'primaryColor') branding.customPrimary = color;
      else branding.customAccent = color;
    }
    function saveBranding() { showToast('Branding settings saved!'); }

    // ─── Security Tab ──────────────────────────────────────────────────────────
    const security = reactive({
      twoFA: false,
      sessionTimeout: 30,
      ipWhitelist: '',
      geoBlocking: [],
      aiWebcam: false,
      tabSwitch: true,
      copyPaste: true,
      screenRecording: false,
    });
    const sessionTimeoutOptions = [15, 30, 60, 120];
    const allCountries = [
      'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia',
      'Australia','Austria','Azerbaijan','Bangladesh','Belarus','Belgium','Bolivia',
      'Bosnia','Brazil','Bulgaria','Cambodia','Canada','Chile','China','Colombia',
      'Croatia','Cuba','Czech Republic','Denmark','Ecuador','Egypt','Ethiopia',
      'Finland','France','Georgia','Germany','Ghana','Greece','Hungary','India',
      'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan',
      'Kazakhstan','Kenya','Kuwait','Latvia','Lebanon','Libya','Lithuania',
      'Malaysia','Mexico','Morocco','Netherlands','New Zealand','Nigeria','Norway',
      'Pakistan','Peru','Philippines','Poland','Portugal','Romania','Russia',
      'Saudi Arabia','Serbia','Singapore','Slovakia','South Africa','South Korea',
      'Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Thailand','Turkey',
      'Ukraine','United Kingdom','United States','Uruguay','Uzbekistan','Venezuela',
      'Vietnam','Yemen','Zimbabwe',
    ];
    const countrySearch = ref('');
    const showCountryDropdown = ref(false);
    const filteredCountries = computed(() =>
      allCountries.filter(c => c.toLowerCase().includes(countrySearch.value.toLowerCase()))
    );
    function toggleCountry(c) {
      const i = security.geoBlocking.indexOf(c);
      if (i === -1) security.geoBlocking.push(c); else security.geoBlocking.splice(i, 1);
    }
    const auditLog = [
      { user: 'admin@acme.edu',  action: 'Login',            ip: '192.168.1.1',   ts: '2026-06-24 08:12' },
      { user: 'john@acme.edu',   action: 'Quiz Created',     ip: '10.0.0.5',      ts: '2026-06-24 09:03' },
      { user: 'admin@acme.edu',  action: '2FA Enabled',      ip: '192.168.1.1',   ts: '2026-06-24 09:15' },
      { user: 'sara@acme.edu',   action: 'Export Data',      ip: '10.0.0.22',     ts: '2026-06-24 10:30' },
      { user: 'mike@acme.edu',   action: 'Password Changed', ip: '172.16.0.3',    ts: '2026-06-24 11:00' },
      { user: 'admin@acme.edu',  action: 'Settings Updated', ip: '192.168.1.1',   ts: '2026-06-24 12:45' },
      { user: 'john@acme.edu',   action: 'Grade Override',   ip: '10.0.0.5',      ts: '2026-06-24 13:10' },
      { user: 'sara@acme.edu',   action: 'Login Failed',     ip: '192.168.2.99',  ts: '2026-06-24 14:05' },
      { user: 'admin@acme.edu',  action: 'User Suspended',   ip: '192.168.1.1',   ts: '2026-06-24 15:22' },
      { user: 'bob@acme.edu',    action: 'API Key Created',  ip: '10.0.1.100',    ts: '2026-06-24 16:55' },
    ];
    function saveSecurity() { showToast('Security settings saved!'); }

    // ─── Notifications Tab ─────────────────────────────────────────────────────
    const notifItems = [
      'Submission Received', 'Grading Complete', 'Deadline Reminder',
      'New Student Enrolled', 'Quiz Published', 'Score Threshold Alert',
      'System Maintenance', 'Report Ready',
    ];
    const emailNotifs  = reactive(Object.fromEntries(notifItems.map(k => [k, true])));
    const smsNotifs    = reactive(Object.fromEntries(notifItems.map(k => [k, false])));
    const inAppNotifs  = reactive(Object.fromEntries(notifItems.map(k => [k, true])));
    const smtp = reactive({
      host: 'smtp.sendgrid.net', port: '587',
      username: 'apikey', password: '', showPassword: false,
    });
    const reminderSchedule = ref('24h');
    const testEmailSending = ref(false);
    function sendTestEmail() {
      testEmailSending.value = true;
      setTimeout(() => { testEmailSending.value = false; showToast('Test email sent!'); }, 1500);
    }
    function saveNotifications() { showToast('Notification settings saved!'); }

    // ─── Integrations Tab ──────────────────────────────────────────────────────
    const integrations = reactive([
      { id: 1, name: 'Google Classroom', icon: '🎓', connected: true,  desc: 'Sync students, assignments and grades.',       lastSync: '2026-06-24 08:00' },
      { id: 2, name: 'Microsoft Teams',  icon: '💼', connected: true,  desc: 'Post quiz links and receive submissions.',      lastSync: '2026-06-24 07:30' },
      { id: 3, name: 'Slack',            icon: '💬', connected: false, desc: 'Send quiz alerts to Slack channels.',           lastSync: null },
      { id: 4, name: 'Zoom',             icon: '📹', connected: false, desc: 'Launch proctored sessions via Zoom.',           lastSync: null },
      { id: 5, name: 'Canvas LMS',       icon: '🖼️', connected: true,  desc: 'Full LTI 1.3 integration with Canvas.',         lastSync: '2026-06-23 22:00' },
      { id: 6, name: 'Moodle',           icon: '🦉', connected: false, desc: 'Import/export course data from Moodle.',        lastSync: null },
      { id: 7, name: 'Stripe',           icon: '💳', connected: true,  desc: 'Process payments for paid courses.',            lastSync: '2026-06-24 06:00' },
      { id: 8, name: 'Zapier',           icon: '⚡', connected: false, desc: 'Automate workflows with 5000+ apps.',           lastSync: null },
    ]);
    const showConnectModal = ref(false);
    const connectingIntegration = ref(null);
    const apiKeyMasked = ref(true);
    const apiKeyValue  = ref('sk-live-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c');
    const apiKeyCopied = ref(false);
    const webhookURL   = ref('');
    const webhookEvents = reactive({ submission: true, grade: false, enrollment: false, system: false });
    const webhooksList = reactive([
      { id: 1, url: 'https://hooks.example.com/quiz', events: 'submission', active: true },
      { id: 2, url: 'https://myapp.io/webhooks/grade', events: 'grade', active: false },
    ]);
    function connectIntegration(integ) { connectingIntegration.value = integ; showConnectModal.value = true; }
    function confirmConnect() {
      if (connectingIntegration.value) {
        connectingIntegration.value.connected = true;
        connectingIntegration.value.lastSync = '2026-06-24 ' + new Date().toTimeString().slice(0,5);
      }
      showConnectModal.value = false; showToast(connectingIntegration.value.name + ' connected!');
    }
    function disconnectIntegration(integ) { integ.connected = false; integ.lastSync = null; showToast(integ.name + ' disconnected.', 'error'); }
    function syncIntegration(integ) { integ.lastSync = '2026-06-24 ' + new Date().toTimeString().slice(0,5); showToast('Sync started for ' + integ.name); }
    function copyApiKey() {
      navigator.clipboard.writeText(apiKeyValue.value).catch(()=>{});
      apiKeyCopied.value = true; setTimeout(() => { apiKeyCopied.value = false; }, 2000);
    }
    function regenerateApiKey() {
      const chars = 'abcdef0123456789'; let k = 'sk-live-';
      for(let i=0;i<32;i++) k += chars[Math.floor(Math.random()*chars.length)];
      apiKeyValue.value = k; showToast('API key regenerated!');
    }
    function addWebhook() {
      if (!webhookURL.value) return;
      webhooksList.push({ id: Date.now(), url: webhookURL.value, events: 'submission', active: true });
      webhookURL.value = ''; showToast('Webhook added!');
    }
    function removeWebhook(id) {
      const i = webhooksList.findIndex(w => w.id === id);
      if (i !== -1) webhooksList.splice(i, 1);
    }

    // ─── API & Webhooks Tab ────────────────────────────────────────────────────
    const apiKeys = reactive([
      { id: 1, name: 'Production Key',  key: 'sk-prod-••••••••••••••••••••••', created: '2026-01-10', lastUsed: '2026-06-24', active: true  },
      { id: 2, name: 'Dev Key',         key: 'sk-dev-•••••••••••••••••••••••', created: '2026-03-15', lastUsed: '2026-06-20', active: true  },
      { id: 3, name: 'CI/CD Pipeline',  key: 'sk-ci-••••••••••••••••••••••••', created: '2026-05-01', lastUsed: '2026-06-23', active: false },
    ]);
    const newApiKeyName = ref('');
    const newApiKeyCreated = ref(null);
    function createApiKey() {
      if (!newApiKeyName.value.trim()) return;
      apiKeys.push({
        id: Date.now(), name: newApiKeyName.value,
        key: 'sk-new-' + Math.random().toString(36).slice(2,18) + '••••••',
        created: new Date().toISOString().slice(0,10),
        lastUsed: '—', active: true,
      });
      newApiKeyName.value = ''; showToast('API key created!');
    }
    function revokeApiKey(id) {
      const k = apiKeys.find(k => k.id === id);
      if (k) { k.active = false; showToast('API key revoked.', 'error'); }
    }
    const webhookLogs = [
      { endpoint: 'https://hooks.example.com/quiz', event: 'quiz.submitted',   status: 200, ts: '2026-06-24 16:01' },
      { endpoint: 'https://hooks.example.com/quiz', event: 'grade.released',   status: 200, ts: '2026-06-24 15:45' },
      { endpoint: 'https://myapp.io/webhooks/grade', event: 'grade.released',  status: 500, ts: '2026-06-24 15:44' },
      { endpoint: 'https://hooks.example.com/quiz', event: 'enrollment.new',   status: 200, ts: '2026-06-24 14:30' },
      { endpoint: 'https://myapp.io/webhooks/grade', event: 'quiz.submitted',  status: 404, ts: '2026-06-24 13:55' },
    ];

    // ─── Billing Tab ───────────────────────────────────────────────────────────
    const currentPlan = ref('pro');
    const billingPlans = [
      {
        id: 'free', label: 'Free', price: '$0/mo',
        features: ['Up to 50 students','5 quizzes/month','Basic analytics','Email support'],
        color: '#6b7280',
      },
      {
        id: 'pro', label: 'Pro', price: '$29/mo',
        features: ['Unlimited students','Unlimited quizzes','Advanced analytics','AI grading','Priority support','API access'],
        color: '#6366f1',
      },
      {
        id: 'enterprise', label: 'Enterprise', price: 'Custom',
        features: ['Everything in Pro','SSO/SAML','Custom branding','SLA','Dedicated manager','On-premise option'],
        color: '#f59e0b',
      },
    ];
    const planFeatureMatrix = [
      { feature: 'Students',          free: '50',   pro: '∞',    enterprise: '∞'      },
      { feature: 'Quizzes/month',     free: '5',    pro: '∞',    enterprise: '∞'      },
      { feature: 'Analytics',         free: 'Basic',pro: 'Advanced',enterprise: 'Full' },
      { feature: 'AI Grading',        free: '✗',   pro: '✓',    enterprise: '✓'      },
      { feature: 'API Access',        free: '✗',   pro: '✓',    enterprise: '✓'      },
      { feature: 'SSO/SAML',          free: '✗',   pro: '✗',    enterprise: '✓'      },
      { feature: 'Custom Branding',   free: '✗',   pro: '✗',    enterprise: '✓'      },
      { feature: 'SLA',               free: '✗',   pro: '✗',    enterprise: '✓'      },
      { feature: 'Support',           free: 'Email',pro: 'Priority',enterprise: 'Dedicated'},
    ];
    const paymentCard = reactive({ number: '•••• •••• •••• 4242', expiry: '09/28', brand: 'Visa' });
    const invoices = [
      { id: 'INV-001', date: '2026-06-01', amount: '$29.00', status: 'Paid' },
      { id: 'INV-002', date: '2026-05-01', amount: '$29.00', status: 'Paid' },
      { id: 'INV-003', date: '2026-04-01', amount: '$29.00', status: 'Paid' },
      { id: 'INV-004', date: '2026-03-01', amount: '$29.00', status: 'Paid' },
      { id: 'INV-005', date: '2026-02-01', amount: '$29.00', status: 'Paid' },
    ];

    // ─── Accessibility Tab ─────────────────────────────────────────────────────
    const accessibility = reactive({
      fontSize: 'medium',
      highContrast: false,
      reduceMotion: false,
      screenReaderMode: false,
      rtlSupport: false,
      rtlLanguage: 'ar',
    });
    const fontSizes = ['small', 'medium', 'large', 'xl'];
    const rtlLanguages = [
      { code: 'ar', label: 'Arabic' },
      { code: 'he', label: 'Hebrew' },
      { code: 'fa', label: 'Persian' },
      { code: 'ur', label: 'Urdu' },
    ];
    function saveAccessibility() { showToast('Accessibility settings saved!'); }

    // ─── Helpers ───────────────────────────────────────────────────────────────
    const maskedApiKey = computed(() =>
      apiKeyMasked.value
        ? apiKeyValue.value.slice(0, 10) + '••••••••••••••••••••••'
        : apiKeyValue.value
    );

    return {
      // nav
      activeSection, navSections,
      // toast
      toast,
      // general
      general, timezones, languages, dateFormats, saveGeneral,
      // branding
      branding, presetColors, fonts, logoDropActive,
      handleLogoDrop, handleLogoInput, setBrandingColor, saveBranding,
      // security
      security, sessionTimeoutOptions, allCountries, countrySearch,
      showCountryDropdown, filteredCountries, toggleCountry, auditLog, saveSecurity,
      // notifications
      notifItems, emailNotifs, smsNotifs, inAppNotifs,
      smtp, reminderSchedule, testEmailSending, sendTestEmail, saveNotifications,
      // integrations
      integrations, showConnectModal, connectingIntegration,
      apiKeyMasked, apiKeyValue, maskedApiKey, apiKeyCopied, webhookURL, webhookEvents, webhooksList,
      connectIntegration, confirmConnect, disconnectIntegration, syncIntegration,
      copyApiKey, regenerateApiKey, addWebhook, removeWebhook,
      // api
      apiKeys, newApiKeyName, newApiKeyCreated, createApiKey, revokeApiKey, webhookLogs,
      // billing
      currentPlan, billingPlans, planFeatureMatrix, paymentCard, invoices,
      // accessibility
      accessibility, fontSizes, rtlLanguages, saveAccessibility,
    };
  },

  template: `
<div class="settings-page flex h-full" style="min-height:100vh;background:var(--bg-primary,#0f172a)">

  <!-- ░░ Toast ░░ -->
  <transition name="slide-fade">
    <div v-if="toast.show"
      :class="toast.type==='success'?'toast-success':'toast-error'"
      style="position:fixed;top:1.5rem;right:1.5rem;z-index:9999;display:flex;align-items:center;gap:0.6rem;padding:0.85rem 1.4rem;border-radius:12px;font-weight:600;font-size:0.9rem;box-shadow:0 8px 32px rgba(0,0,0,0.35);backdrop-filter:blur(12px);">
      <span>{{ toast.type==='success' ? '✅' : '❌' }}</span>
      {{ toast.message }}
    </div>
  </transition>

  <!-- ░░ Connect Modal ░░ -->
  <div v-if="showConnectModal" style="position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;">
    <div class="glass" style="width:420px;padding:2rem;border-radius:20px;">
      <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#fff;">
        Connect {{ connectingIntegration?.name }}
      </h3>
      <p style="color:#94a3b8;font-size:0.9rem;margin-bottom:1.5rem;">
        Enter your {{ connectingIntegration?.name }} credentials to establish a secure connection.
      </p>
      <label class="settings-label">API Token / Secret Key</label>
      <input class="form-input" type="text" placeholder="Paste your token here…" style="width:100%;margin-bottom:1rem;" />
      <label class="settings-label">Workspace / Instance URL (optional)</label>
      <input class="form-input" type="url" placeholder="https://yourworkspace.example.com" style="width:100%;margin-bottom:1.5rem;" />
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
        <button class="btn-ghost" @click="showConnectModal=false">Cancel</button>
        <button class="btn-primary" @click="confirmConnect">Connect</button>
      </div>
    </div>
  </div>

  <!-- ░░ Left Nav ░░ -->
  <aside class="settings-nav glass" style="width:220px;flex-shrink:0;padding:1.5rem 0.75rem;display:flex;flex-direction:column;gap:0.25rem;border-right:1px solid rgba(255,255,255,0.07);">
    <div style="padding:0 0.75rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;">
      <h2 style="font-size:1.15rem;font-weight:700;color:#fff;letter-spacing:-0.02em;">⚙️ Settings</h2>
      <p style="font-size:0.75rem;color:#64748b;margin-top:0.2rem;">System configuration</p>
    </div>
    <button
      v-for="s in navSections" :key="s.id"
      @click="activeSection=s.id"
      :class="['settings-nav-item', activeSection===s.id ? 'active' : '']"
      style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.75rem;border-radius:10px;border:none;cursor:pointer;text-align:left;font-size:0.875rem;font-weight:500;transition:all 0.2s;width:100%;">
      <span style="font-size:1rem;">{{ s.icon }}</span>
      {{ s.label }}
    </button>
  </aside>

  <!-- ░░ Right Content ░░ -->
  <main style="flex:1;overflow-y:auto;padding:2rem 2.5rem;">

    <!-- ══════════════ GENERAL ══════════════ -->
    <section v-if="activeSection==='general'">
      <div class="settings-header">
        <h1 class="gradient-text" style="font-size:1.75rem;font-weight:800;">General Settings</h1>
        <p style="color:#64748b;margin-top:0.25rem;">Configure your institution's core preferences.</p>
      </div>

      <div class="settings-card glass">
        <h3 class="settings-section-title">🏫 Institution Info</h3>
        <div class="settings-grid-2">
          <div class="settings-field">
            <label class="settings-label">Institution Name</label>
            <input class="form-input" v-model="general.institutionName" type="text" placeholder="e.g. Acme University" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Timezone</label>
            <select class="form-input" v-model="general.timezone">
              <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
            </select>
          </div>
          <div class="settings-field">
            <label class="settings-label">Language</label>
            <select class="form-input" v-model="general.language">
              <option v-for="l in languages" :key="l.code" :value="l.code">{{ l.label }}</option>
            </select>
          </div>
          <div class="settings-field">
            <label class="settings-label">Date Format</label>
            <select class="form-input" v-model="general.dateFormat">
              <option v-for="f in dateFormats" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">📋 Default Quiz Settings</h3>
        <div class="settings-grid-3">
          <div class="settings-field">
            <label class="settings-label">Time Limit (min)</label>
            <input class="form-input" v-model.number="general.timeLimitDefault" type="number" min="5" max="300" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Attempt Limit</label>
            <input class="form-input" v-model.number="general.attemptLimitDefault" type="number" min="1" max="10" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Pass Mark (%)</label>
            <input class="form-input" v-model.number="general.passMarkDefault" type="number" min="0" max="100" />
          </div>
        </div>
      </div>

      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">🚧 Maintenance Mode</h3>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <p style="color:#e2e8f0;font-size:0.9rem;font-weight:500;">Enable Maintenance Mode</p>
            <p style="color:#64748b;font-size:0.8rem;margin-top:0.2rem;">Only admins can access the platform. Students see a maintenance notice.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="general.maintenanceMode" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div v-if="general.maintenanceMode" class="alert-warning" style="margin-top:1rem;">
          ⚠️ Maintenance mode is ACTIVE. Students cannot log in.
        </div>
      </div>

      <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
        <button class="btn-primary" @click="saveGeneral">💾 Save General Settings</button>
      </div>
    </section>

    <!-- ══════════════ BRANDING ══════════════ -->
    <section v-if="activeSection==='branding'">
      <div class="settings-header">
        <h1 class="gradient-text" style="font-size:1.75rem;font-weight:800;">Branding</h1>
        <p style="color:#64748b;margin-top:0.25rem;">Customize how your platform looks and feels.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 320px;gap:1.5rem;">
        <div>
          <!-- Logo Upload -->
          <div class="settings-card glass">
            <h3 class="settings-section-title">🖼️ Logo</h3>
            <div
              class="logo-drop-zone"
              :class="{ 'drag-over': logoDropActive }"
              @dragover.prevent="logoDropActive=true"
              @dragleave="logoDropActive=false"
              @drop.prevent="handleLogoDrop"
              @click="$refs.logoInput.click()"
              style="cursor:pointer;">
              <img v-if="branding.logoPreview" :src="branding.logoPreview" style="max-height:80px;max-width:200px;object-fit:contain;border-radius:8px;" />
              <div v-else style="text-align:center;">
                <div style="font-size:2.5rem;margin-bottom:0.5rem;">📁</div>
                <p style="color:#94a3b8;font-size:0.875rem;">Drag & drop your logo here</p>
                <p style="color:#64748b;font-size:0.75rem;margin-top:0.25rem;">PNG, SVG or WebP · max 2 MB</p>
              </div>
              <input ref="logoInput" type="file" accept="image/*" style="display:none;" @change="handleLogoInput" />
            </div>
          </div>

          <!-- Colors -->
          <div class="settings-card glass" style="margin-top:1.25rem;">
            <h3 class="settings-section-title">🎨 Colors</h3>
            <div class="settings-field" style="margin-bottom:1.25rem;">
              <label class="settings-label">Primary Color</label>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem;">
                <button v-for="c in presetColors" :key="c"
                  @click="setBrandingColor('primaryColor', c)"
                  :style="{ background: c, width:'32px', height:'32px', borderRadius:'8px', border: branding.primaryColor===c ? '3px solid #fff' : '2px solid transparent', cursor:'pointer', transition:'transform 0.15s' }"
                  style="flex-shrink:0;" />
              </div>
              <div style="display:flex;align-items:center;gap:0.75rem;">
                <input type="color" v-model="branding.primaryColor" style="width:40px;height:36px;border:none;border-radius:8px;cursor:pointer;background:transparent;" />
                <input class="form-input" v-model="branding.primaryColor" placeholder="#6366f1" style="width:120px;" />
              </div>
            </div>
            <div class="settings-field">
              <label class="settings-label">Accent Color</label>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem;">
                <button v-for="c in presetColors" :key="c"
                  @click="setBrandingColor('accentColor', c)"
                  :style="{ background: c, width:'32px', height:'32px', borderRadius:'8px', border: branding.accentColor===c ? '3px solid #fff' : '2px solid transparent', cursor:'pointer' }"
                  style="flex-shrink:0;" />
              </div>
              <div style="display:flex;align-items:center;gap:0.75rem;">
                <input type="color" v-model="branding.accentColor" style="width:40px;height:36px;border:none;border-radius:8px;cursor:pointer;background:transparent;" />
                <input class="form-input" v-model="branding.accentColor" placeholder="#8b5cf6" style="width:120px;" />
              </div>
            </div>
          </div>

          <!-- Font -->
          <div class="settings-card glass" style="margin-top:1.25rem;">
            <h3 class="settings-section-title">🔤 Typography</h3>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              <label v-for="f in fonts" :key="f" class="font-radio" style="display:flex;align-items:center;gap:1rem;padding:0.75rem 1rem;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:all 0.2s;" :style="{ borderColor: branding.font===f ? branding.primaryColor : 'rgba(255,255,255,0.06)', background: branding.font===f ? branding.primaryColor+'22' : 'rgba(255,255,255,0.02)' }">
                <input type="radio" :value="f" v-model="branding.font" style="accent-color:var(--primary,#6366f1);" />
                <span :style="{ fontFamily: f + ', sans-serif', fontSize: '1rem', color: '#e2e8f0' }">{{ f }} — The quick brown fox</span>
              </label>
            </div>
          </div>

          <!-- Theme -->
          <div class="settings-card glass" style="margin-top:1.25rem;">
            <h3 class="settings-section-title">🌓 Theme</h3>
            <div class="theme-toggle-group">
              <button v-for="t in [{id:'light',label:'☀️ Light'},{id:'dark',label:'🌙 Dark'},{id:'system',label:'💻 System'}]" :key="t.id"
                @click="branding.theme=t.id"
                :class="['theme-btn', branding.theme===t.id ? 'active' : '']">
                {{ t.label }}
              </button>
            </div>
          </div>

          <!-- Custom CSS -->
          <div class="settings-card glass" style="margin-top:1.25rem;">
            <h3 class="settings-section-title">💅 Custom CSS</h3>
            <textarea class="form-input" v-model="branding.customCSS" rows="6" placeholder="/* Add your custom CSS overrides here */\n\n:root { --primary: #6366f1; }" style="font-family:'Courier New',monospace;font-size:0.825rem;resize:vertical;"></textarea>
          </div>
        </div>

        <!-- Preview Panel -->
        <div>
          <div class="settings-card glass" style="position:sticky;top:1.5rem;">
            <h3 class="settings-section-title">👁️ Live Preview</h3>
            <div class="branding-preview" :style="{ fontFamily: branding.font + ', sans-serif', background: branding.theme==='dark' ? '#1e293b' : branding.theme==='light' ? '#f8fafc' : '#1e293b', borderRadius:'14px', padding:'1.25rem', border:'1px solid rgba(255,255,255,0.1)' }">
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
                <div :style="{ background: branding.primaryColor, width:'28px', height:'28px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem' }">Q</div>
                <span :style="{ color: branding.theme==='light' ? '#1e293b' : '#f1f5f9', fontWeight:'700', fontSize:'0.95rem' }">{{ general.institutionName }}</span>
              </div>
              <div :style="{ background: branding.theme==='light' ? '#fff' : 'rgba(255,255,255,0.07)', borderRadius:'10px', padding:'1rem', marginBottom:'0.75rem' }">
                <div :style="{ color: branding.theme==='light' ? '#1e293b' : '#e2e8f0', fontWeight:'700', fontSize:'0.9rem', marginBottom:'0.5rem' }">Sample Quiz</div>
                <div :style="{ color: branding.theme==='light' ? '#475569' : '#94a3b8', fontSize:'0.78rem', marginBottom:'0.75rem' }">What is the capital of France?</div>
                <div v-for="opt in ['Paris','London','Berlin','Madrid']" :key="opt" :style="{ padding:'0.4rem 0.6rem', borderRadius:'6px', marginBottom:'0.3rem', border:'1px solid', borderColor: opt==='Paris' ? branding.primaryColor : 'rgba(148,163,184,0.2)', background: opt==='Paris' ? branding.primaryColor+'22' : 'transparent', color: branding.theme==='light' ? '#334155' : '#cbd5e1', fontSize:'0.78rem', cursor:'pointer' }">{{ opt }}</div>
              </div>
              <button :style="{ background: 'linear-gradient(135deg,'+branding.primaryColor+','+branding.accentColor+')', color:'#fff', border:'none', borderRadius:'8px', padding:'0.5rem 1rem', fontSize:'0.8rem', fontWeight:'600', cursor:'pointer', width:'100%' }">Submit Answer</button>
            </div>
            <div style="margin-top:1.25rem;">
              <button class="btn-primary" style="width:100%;" @click="saveBranding">💾 Save Branding</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ SECURITY ══════════════ -->
    <section v-if="activeSection==='security'">
      <div class="settings-header">
        <h1 class="gradient-text" style="font-size:1.75rem;font-weight:800;">Security</h1>
        <p style="color:#64748b;margin-top:0.25rem;">Protect your platform with advanced security controls.</p>
      </div>

      <!-- 2FA -->
      <div class="settings-card glass">
        <h3 class="settings-section-title">🔐 Two-Factor Authentication</h3>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
          <div>
            <p style="color:#e2e8f0;font-size:0.9rem;font-weight:500;">Require 2FA for all admins</p>
            <p style="color:#64748b;font-size:0.8rem;">Adds an extra layer of security for administrator accounts.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="security.twoFA" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div v-if="security.twoFA" class="qr-placeholder" style="display:flex;align-items:center;gap:1.5rem;padding:1.25rem;background:rgba(99,102,241,0.08);border-radius:12px;border:1px dashed rgba(99,102,241,0.3);">
          <div style="width:96px;height:96px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <rect x="4" y="4" width="28" height="28" rx="2" fill="#1e293b" stroke="none"/>
              <rect x="8" y="8" width="20" height="20" rx="1" fill="white"/>
              <rect x="12" y="12" width="12" height="12" rx="1" fill="#1e293b"/>
              <rect x="40" y="4" width="28" height="28" rx="2" fill="#1e293b"/>
              <rect x="44" y="8" width="20" height="20" rx="1" fill="white"/>
              <rect x="48" y="12" width="12" height="12" rx="1" fill="#1e293b"/>
              <rect x="4" y="40" width="28" height="28" rx="2" fill="#1e293b"/>
              <rect x="8" y="44" width="20" height="20" rx="1" fill="white"/>
              <rect x="12" y="48" width="12" height="12" rx="1" fill="#1e293b"/>
              <rect x="40" y="40" width="8" height="8" rx="1" fill="#1e293b"/>
              <rect x="52" y="40" width="8" height="8" rx="1" fill="#1e293b"/>
              <rect x="40" y="52" width="8" height="8" rx="1" fill="#1e293b"/>
              <rect x="52" y="52" width="8" height="8" rx="1" fill="#1e293b"/>
            </svg>
          </div>
          <div>
            <p style="color:#e2e8f0;font-weight:600;font-size:0.9rem;">Scan with Google Authenticator</p>
            <p style="color:#94a3b8;font-size:0.8rem;margin-top:0.25rem;">Or enter the manual key: <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;font-size:0.75rem;">JBSWY3DPEHPK3PXP</code></p>
          </div>
        </div>
      </div>

      <!-- Session Timeout -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">⏱️ Session Timeout</h3>
        <p style="color:#94a3b8;font-size:0.85rem;margin-bottom:1rem;">Auto-logout idle users after:</p>
        <div style="display:flex;gap:0.75rem;">
          <button v-for="m in sessionTimeoutOptions" :key="m"
            @click="security.sessionTimeout=m"
            :class="['session-btn', security.sessionTimeout===m ? 'active' : '']"
            style="padding:0.5rem 1.25rem;border-radius:8px;border:2px solid;cursor:pointer;font-weight:600;font-size:0.85rem;transition:all 0.2s;"
            :style="{ borderColor: security.sessionTimeout===m ? '#6366f1' : 'rgba(255,255,255,0.12)', background: security.sessionTimeout===m ? 'rgba(99,102,241,0.2)' : 'transparent', color: security.sessionTimeout===m ? '#818cf8' : '#94a3b8' }">
            {{ m }}m
          </button>
        </div>
      </div>

      <!-- IP Whitelist -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">🌐 IP Whitelist</h3>
        <p style="color:#94a3b8;font-size:0.85rem;margin-bottom:0.75rem;">Enter one IP address or CIDR range per line. Leave blank to allow all.</p>
        <textarea class="form-input" v-model="security.ipWhitelist" rows="5" placeholder="192.168.1.0/24&#10;10.0.0.1&#10;172.16.0.0/12" style="font-family:'Courier New',monospace;font-size:0.85rem;resize:vertical;"></textarea>
      </div>

      <!-- Geo-Blocking -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">🗺️ Geo-Blocking</h3>
        <p style="color:#94a3b8;font-size:0.85rem;margin-bottom:0.75rem;">Block access from specific countries.</p>
        <div style="position:relative;">
          <input class="form-input" v-model="countrySearch" @focus="showCountryDropdown=true" @blur="setTimeout(()=>showCountryDropdown=false,200)" placeholder="🔍 Search countries…" style="width:100%;max-width:360px;" />
          <div v-if="showCountryDropdown && filteredCountries.length" style="position:absolute;top:100%;left:0;width:360px;max-height:220px;overflow-y:auto;background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:10px;z-index:100;margin-top:4px;">
            <label v-for="c in filteredCountries" :key="c" style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.75rem;cursor:pointer;color:#e2e8f0;font-size:0.85rem;" :style="{ background: security.geoBlocking.includes(c) ? 'rgba(99,102,241,0.15)' : 'transparent' }">
              <input type="checkbox" :checked="security.geoBlocking.includes(c)" @change="toggleCountry(c)" style="accent-color:#6366f1;" />
              {{ c }}
            </label>
          </div>
        </div>
        <div v-if="security.geoBlocking.length" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem;">
          <span v-for="c in security.geoBlocking" :key="c" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.25rem 0.6rem;background:rgba(239,68,68,0.15);color:#fca5a5;border-radius:6px;font-size:0.8rem;font-weight:500;">
            🚫 {{ c }}
            <button @click="toggleCountry(c)" style="background:none;border:none;color:#fca5a5;cursor:pointer;font-size:0.85rem;padding:0;line-height:1;">×</button>
          </span>
        </div>
      </div>

      <!-- Proctoring -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">🎯 Proctoring Settings</h3>
        <div style="display:flex;flex-direction:column;gap:0.9rem;">
          <div v-for="(label, key) in { aiWebcam:'🎥 AI Webcam Monitoring', tabSwitch:'🔁 Tab-Switch Detection', copyPaste:'📋 Copy-Paste Detection', screenRecording:'🖥️ Screen Recording Monitoring' }" :key="key"
            style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid rgba(255,255,255,0.06);">
            <div>
              <p style="color:#e2e8f0;font-size:0.875rem;font-weight:500;">{{ label }}</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="security[key]" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Audit Log -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">📋 Audit Log <span style="font-size:0.75rem;color:#64748b;font-weight:400;margin-left:0.5rem;">Last 10 events</span></h3>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">User</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Action</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">IP</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in auditLog" :key="log.ts+log.action" style="border-bottom:1px solid rgba(255,255,255,0.04);transition:background 0.15s;" onmouseenter="this.style.background='rgba(255,255,255,0.03)'" onmouseleave="this.style.background='transparent'">
                <td style="padding:0.6rem 0.75rem;color:#94a3b8;">{{ log.user }}</td>
                <td style="padding:0.6rem 0.75rem;">
                  <span style="color:#e2e8f0;font-weight:500;">{{ log.action }}</span>
                </td>
                <td style="padding:0.6rem 0.75rem;font-family:'Courier New',monospace;color:#6366f1;font-size:0.8rem;">{{ log.ip }}</td>
                <td style="padding:0.6rem 0.75rem;color:#64748b;font-size:0.8rem;">{{ log.ts }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
        <button class="btn-primary" @click="saveSecurity">💾 Save Security Settings</button>
      </div>
    </section>

    <!-- ══════════════ NOTIFICATIONS ══════════════ -->
    <section v-if="activeSection==='notifications'">
      <div class="settings-header">
        <h1 class="gradient-text" style="font-size:1.75rem;font-weight:800;">Notifications</h1>
        <p style="color:#64748b;margin-top:0.25rem;">Control how and when alerts are delivered.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem;">
        <!-- Email -->
        <div class="settings-card glass">
          <h3 class="settings-section-title">📧 Email</h3>
          <div style="display:flex;flex-direction:column;gap:0.6rem;">
            <div v-for="item in notifItems" :key="'email-'+item" style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="color:#94a3b8;font-size:0.82rem;">{{ item }}</span>
              <label class="toggle-switch" style="transform:scale(0.85);">
                <input type="checkbox" v-model="emailNotifs[item]" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        <!-- SMS -->
        <div class="settings-card glass">
          <h3 class="settings-section-title">📱 SMS</h3>
          <div style="display:flex;flex-direction:column;gap:0.6rem;">
            <div v-for="item in notifItems" :key="'sms-'+item" style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="color:#94a3b8;font-size:0.82rem;">{{ item }}</span>
              <label class="toggle-switch" style="transform:scale(0.85);">
                <input type="checkbox" v-model="smsNotifs[item]" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        <!-- In-App -->
        <div class="settings-card glass">
          <h3 class="settings-section-title">🔔 In-App</h3>
          <div style="display:flex;flex-direction:column;gap:0.6rem;">
            <div v-for="item in notifItems" :key="'inapp-'+item" style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="color:#94a3b8;font-size:0.82rem;">{{ item }}</span>
              <label class="toggle-switch" style="transform:scale(0.85);">
                <input type="checkbox" v-model="inAppNotifs[item]" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- SMTP -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">⚙️ SMTP Configuration</h3>
        <div class="settings-grid-2">
          <div class="settings-field">
            <label class="settings-label">SMTP Host</label>
            <input class="form-input" v-model="smtp.host" type="text" placeholder="smtp.sendgrid.net" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Port</label>
            <input class="form-input" v-model="smtp.port" type="number" placeholder="587" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Username</label>
            <input class="form-input" v-model="smtp.username" type="text" placeholder="apikey" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Password</label>
            <div style="position:relative;">
              <input class="form-input" v-model="smtp.password" :type="smtp.showPassword ? 'text' : 'password'" placeholder="••••••••••••" style="width:100%;padding-right:2.5rem;" />
              <button @click="smtp.showPassword=!smtp.showPassword" style="position:absolute;right:0.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;font-size:1rem;">
                {{ smtp.showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:1rem;margin-top:1.25rem;">
          <button class="btn-secondary" @click="sendTestEmail" :disabled="testEmailSending" style="display:flex;align-items:center;gap:0.5rem;">
            <span v-if="testEmailSending">⏳ Sending…</span>
            <span v-else>📤 Send Test Email</span>
          </button>
        </div>
      </div>

      <!-- Reminder Schedule -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">⏰ Reminder Schedule</h3>
        <div class="settings-field" style="max-width:300px;">
          <label class="settings-label">Send reminders</label>
          <select class="form-input" v-model="reminderSchedule">
            <option value="24h">24 hours before deadline</option>
            <option value="1h">1 hour before deadline</option>
            <option value="15m">15 minutes before deadline</option>
          </select>
        </div>
      </div>

      <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
        <button class="btn-primary" @click="saveNotifications">💾 Save Notification Settings</button>
      </div>
    </section>

    <!-- ══════════════ INTEGRATIONS ══════════════ -->
    <section v-if="activeSection==='integrations'">
      <div class="settings-header">
        <h1 class="gradient-text" style="font-size:1.75rem;font-weight:800;">Integrations</h1>
        <p style="color:#64748b;margin-top:0.25rem;">Connect your platform with third-party services.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;">
        <div v-for="integ in integrations" :key="integ.id" class="settings-card glass integration-card">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1.5rem;">{{ integ.icon }}</div>
              <div>
                <h4 style="color:#e2e8f0;font-weight:700;font-size:0.9rem;margin:0;">{{ integ.name }}</h4>
                <span :class="integ.connected ? 'badge-success' : 'badge-neutral'" style="font-size:0.7rem;margin-top:2px;display:inline-block;">
                  {{ integ.connected ? '● Connected' : '○ Disconnected' }}
                </span>
              </div>
            </div>
          </div>
          <p style="color:#64748b;font-size:0.8rem;margin-bottom:0.75rem;line-height:1.5;">{{ integ.desc }}</p>
          <p v-if="integ.lastSync" style="color:#475569;font-size:0.75rem;margin-bottom:0.75rem;">🕐 Last sync: {{ integ.lastSync }}</p>
          <div style="display:flex;gap:0.5rem;">
            <template v-if="integ.connected">
              <button class="btn-sm-outline-danger" @click="disconnectIntegration(integ)">Disconnect</button>
              <button class="btn-sm-primary" @click="syncIntegration(integ)">🔄 Sync</button>
            </template>
            <template v-else>
              <button class="btn-sm-primary" @click="connectIntegration(integ)">🔌 Connect</button>
            </template>
          </div>
        </div>
      </div>

      <!-- REST API -->
      <div class="settings-card glass" style="margin-top:2rem;">
        <h3 class="settings-section-title">🔑 REST API Key</h3>
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
          <code style="flex:1;background:rgba(255,255,255,0.05);padding:0.75rem 1rem;border-radius:10px;font-size:0.85rem;color:#a5b4fc;border:1px solid rgba(99,102,241,0.2);font-family:'Courier New',monospace;word-break:break-all;">{{ maskedApiKey }}</code>
          <button class="btn-secondary" @click="apiKeyMasked=!apiKeyMasked">{{ apiKeyMasked ? '👁️ Show' : '🙈 Hide' }}</button>
          <button class="btn-secondary" @click="copyApiKey">{{ apiKeyCopied ? '✅ Copied!' : '📋 Copy' }}</button>
          <button class="btn-ghost" @click="regenerateApiKey">🔄 Regenerate</button>
          <a href="#" style="color:#6366f1;font-size:0.85rem;text-decoration:none;font-weight:500;">📖 Docs →</a>
        </div>
      </div>

      <!-- Webhooks -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">🪝 Webhooks</h3>
        <div style="display:flex;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap;align-items:flex-end;">
          <div class="settings-field" style="flex:1;min-width:240px;margin:0;">
            <label class="settings-label">Endpoint URL</label>
            <input class="form-input" v-model="webhookURL" type="url" placeholder="https://yourapp.com/webhook" />
          </div>
          <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;padding-bottom:2px;">
            <label v-for="(v,k) in webhookEvents" :key="k" style="display:flex;align-items:center;gap:0.35rem;color:#94a3b8;font-size:0.8rem;cursor:pointer;">
              <input type="checkbox" v-model="webhookEvents[k]" style="accent-color:#6366f1;" /> {{ k }}
            </label>
          </div>
          <button class="btn-primary" @click="addWebhook">+ Add</button>
        </div>
        <table v-if="webhooksList.length" style="width:100%;border-collapse:collapse;font-size:0.85rem;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
              <th style="text-align:left;padding:0.5rem 0.75rem;color:#64748b;font-weight:600;">Endpoint</th>
              <th style="text-align:left;padding:0.5rem 0.75rem;color:#64748b;font-weight:600;">Events</th>
              <th style="text-align:left;padding:0.5rem 0.75rem;color:#64748b;font-weight:600;">Status</th>
              <th style="padding:0.5rem 0.75rem;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="wh in webhooksList" :key="wh.id" style="border-bottom:1px solid rgba(255,255,255,0.04);">
              <td style="padding:0.6rem 0.75rem;color:#94a3b8;font-family:'Courier New',monospace;font-size:0.8rem;">{{ wh.url }}</td>
              <td style="padding:0.6rem 0.75rem;"><span class="badge-info">{{ wh.events }}</span></td>
              <td style="padding:0.6rem 0.75rem;"><span :class="wh.active ? 'badge-success' : 'badge-neutral'">{{ wh.active ? 'Active' : 'Paused' }}</span></td>
              <td style="padding:0.6rem 0.75rem;text-align:right;"><button @click="removeWebhook(wh.id)" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.8rem;">🗑️</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ══════════════ API & WEBHOOKS ══════════════ -->
    <section v-if="activeSection==='api'">
      <div class="settings-header">
        <h1 class="gradient-text" style="font-size:1.75rem;font-weight:800;">API & Webhooks</h1>
        <p style="color:#64748b;margin-top:0.25rem;">Manage API keys and monitor webhook delivery.</p>
      </div>

      <!-- API Key Table -->
      <div class="settings-card glass">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
          <h3 class="settings-section-title" style="margin:0;">🔑 API Keys</h3>
          <a href="#" style="display:inline-flex;align-items:center;gap:0.4rem;color:#6366f1;font-size:0.85rem;text-decoration:none;font-weight:500;padding:0.4rem 0.8rem;border:1px solid rgba(99,102,241,0.3);border-radius:8px;">
            📖 Swagger Docs →
          </a>
        </div>
        <div style="overflow-x:auto;margin-bottom:1.5rem;">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Name</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Key</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Created</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Last Used</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Status</th>
                <th style="padding:0.6rem 0.75rem;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="k in apiKeys" :key="k.id" style="border-bottom:1px solid rgba(255,255,255,0.04);">
                <td style="padding:0.6rem 0.75rem;color:#e2e8f0;font-weight:500;">{{ k.name }}</td>
                <td style="padding:0.6rem 0.75rem;font-family:'Courier New',monospace;color:#a5b4fc;font-size:0.8rem;">{{ k.key }}</td>
                <td style="padding:0.6rem 0.75rem;color:#64748b;">{{ k.created }}</td>
                <td style="padding:0.6rem 0.75rem;color:#64748b;">{{ k.lastUsed }}</td>
                <td style="padding:0.6rem 0.75rem;"><span :class="k.active ? 'badge-success' : 'badge-danger'">{{ k.active ? 'Active' : 'Revoked' }}</span></td>
                <td style="padding:0.6rem 0.75rem;text-align:right;">
                  <button v-if="k.active" @click="revokeApiKey(k.id)" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.8rem;font-weight:500;">Revoke</button>
                  <span v-else style="color:#475569;font-size:0.8rem;">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add New Key Form -->
        <div style="padding:1rem;background:rgba(99,102,241,0.06);border-radius:12px;border:1px dashed rgba(99,102,241,0.25);">
          <h4 style="color:#e2e8f0;font-weight:600;font-size:0.875rem;margin-bottom:0.75rem;">➕ Create New API Key</h4>
          <div style="display:flex;gap:0.75rem;align-items:flex-end;">
            <div class="settings-field" style="flex:1;margin:0;">
              <label class="settings-label">Key Name / Description</label>
              <input class="form-input" v-model="newApiKeyName" type="text" placeholder="e.g. Mobile App Key" @keyup.enter="createApiKey" />
            </div>
            <button class="btn-primary" @click="createApiKey">Generate Key</button>
          </div>
        </div>
      </div>

      <!-- Webhook Logs -->
      <div class="settings-card glass" style="margin-top:1.5rem;">
        <h3 class="settings-section-title">📨 Webhook Delivery Logs</h3>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Endpoint</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Event</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Status</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in webhookLogs" :key="log.ts+log.event" style="border-bottom:1px solid rgba(255,255,255,0.04);">
                <td style="padding:0.6rem 0.75rem;color:#94a3b8;font-family:'Courier New',monospace;font-size:0.78rem;">{{ log.endpoint }}</td>
                <td style="padding:0.6rem 0.75rem;"><code style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-size:0.78rem;color:#a5b4fc;">{{ log.event }}</code></td>
                <td style="padding:0.6rem 0.75rem;">
                  <span :class="log.status===200 ? 'badge-success' : 'badge-danger'" style="font-family:'Courier New',monospace;">{{ log.status }}</span>
                </td>
                <td style="padding:0.6rem 0.75rem;color:#64748b;font-size:0.8rem;">{{ log.ts }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ══════════════ BILLING ══════════════ -->
    <section v-if="activeSection==='billing'">
      <div class="settings-header">
        <h1 class="gradient-text" style="font-size:1.75rem;font-weight:800;">Billing</h1>
        <p style="color:#64748b;margin-top:0.25rem;">Manage your subscription, payment method and invoices.</p>
      </div>

      <!-- Current Plan -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;margin-bottom:1.5rem;">
        <div v-for="plan in billingPlans" :key="plan.id"
          @click="currentPlan=plan.id"
          class="plan-card glass"
          :style="{ borderColor: currentPlan===plan.id ? plan.color : 'rgba(255,255,255,0.07)', boxShadow: currentPlan===plan.id ? '0 0 0 2px '+plan.color+', 0 8px 32px rgba(0,0,0,0.2)' : 'none', cursor:'pointer', position:'relative', overflow:'hidden' }">
          <div v-if="currentPlan===plan.id" style="position:absolute;top:0.75rem;right:0.75rem;">
            <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:0.7rem;font-weight:700;padding:0.2rem 0.5rem;border-radius:20px;">CURRENT</span>
          </div>
          <div :style="{ width:'40px', height:'40px', borderRadius:'10px', background: plan.color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', marginBottom:'0.75rem', border:'1px solid '+plan.color+'44' }">
            {{ plan.id==='free' ? '🆓' : plan.id==='pro' ? '⭐' : '🏢' }}
          </div>
          <h3 style="color:#fff;font-weight:800;font-size:1.1rem;">{{ plan.label }}</h3>
          <p :style="{ color: plan.color, fontWeight:'700', fontSize:'1.3rem', margin:'0.25rem 0 0.75rem' }">{{ plan.price }}</p>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.4rem;">
            <li v-for="f in plan.features" :key="f" style="color:#94a3b8;font-size:0.8rem;display:flex;align-items:center;gap:0.4rem;">
              <span :style="{ color: plan.color }">✓</span> {{ f }}
            </li>
          </ul>
          <button v-if="currentPlan!==plan.id" class="btn-secondary" style="width:100%;margin-top:1rem;font-size:0.8rem;">
            {{ plan.id==='enterprise' ? '📞 Contact Sales' : 'Upgrade' }}
          </button>
        </div>
      </div>

      <!-- Feature Matrix -->
      <div class="settings-card glass" style="margin-bottom:1.5rem;">
        <h3 class="settings-section-title">📊 Plan Comparison</h3>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Feature</th>
                <th style="text-align:center;padding:0.6rem 0.75rem;color:#6b7280;font-weight:600;">Free</th>
                <th style="text-align:center;padding:0.6rem 0.75rem;color:#818cf8;font-weight:600;">Pro</th>
                <th style="text-align:center;padding:0.6rem 0.75rem;color:#fbbf24;font-weight:600;">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in planFeatureMatrix" :key="row.feature" style="border-bottom:1px solid rgba(255,255,255,0.04);" :style="{ background: currentPlan==='free'&&row.free==='✗' ? 'transparent' : 'transparent' }">
                <td style="padding:0.6rem 0.75rem;color:#e2e8f0;">{{ row.feature }}</td>
                <td style="padding:0.6rem 0.75rem;text-align:center;" :style="{ color: row.free==='✗' ? '#ef4444' : row.free==='✓' ? '#10b981' : '#94a3b8' }">{{ row.free }}</td>
                <td style="padding:0.6rem 0.75rem;text-align:center;" :style="{ color: row.pro==='✗' ? '#ef4444' : row.pro==='✓' ? '#10b981' : '#818cf8' }">{{ row.pro }}</td>
                <td style="padding:0.6rem 0.75rem;text-align:center;" :style="{ color: row.enterprise==='✗' ? '#ef4444' : row.enterprise==='✓' ? '#10b981' : '#fbbf24' }">{{ row.enterprise }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="settings-card glass" style="margin-bottom:1.5rem;">
        <h3 class="settings-section-title">💳 Payment Method</h3>
        <div style="display:flex;align-items:center;gap:1.25rem;padding:1rem;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);max-width:420px;">
          <div style="width:52px;height:36px;background:linear-gradient(135deg,#1a56db,#1971c2);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:#fff;flex-shrink:0;">VISA</div>
          <div style="flex:1;">
            <p style="color:#e2e8f0;font-weight:600;font-size:0.9rem;margin:0;">{{ paymentCard.number }}</p>
            <p style="color:#64748b;font-size:0.78rem;margin-top:2px;">Expires {{ paymentCard.expiry }}</p>
          </div>
          <button class="btn-ghost" style="font-size:0.8rem;">✏️ Edit</button>
        </div>
      </div>

      <!-- Invoices -->
      <div class="settings-card glass">
        <h3 class="settings-section-title">🧾 Invoice History</h3>
        <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
              <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Invoice</th>
              <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Date</th>
              <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Amount</th>
              <th style="text-align:left;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;">Status</th>
              <th style="padding:0.6rem 0.75rem;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoices" :key="inv.id" style="border-bottom:1px solid rgba(255,255,255,0.04);">
              <td style="padding:0.6rem 0.75rem;color:#a5b4fc;font-weight:500;">{{ inv.id }}</td>
              <td style="padding:0.6rem 0.75rem;color:#94a3b8;">{{ inv.date }}</td>
              <td style="padding:0.6rem 0.75rem;color:#e2e8f0;font-weight:600;">{{ inv.amount }}</td>
              <td style="padding:0.6rem 0.75rem;"><span class="badge-success">{{ inv.status }}</span></td>
              <td style="padding:0.6rem 0.75rem;text-align:right;"><button style="background:none;border:none;color:#6366f1;cursor:pointer;font-size:0.8rem;font-weight:500;">⬇️ PDF</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ══════════════ ACCESSIBILITY ══════════════ -->
    <section v-if="activeSection==='accessibility'">
      <div class="settings-header">
        <h1 class="gradient-text" style="font-size:1.75rem;font-weight:800;">Accessibility</h1>
        <p style="color:#64748b;margin-top:0.25rem;">Make your platform accessible to everyone.</p>
      </div>

      <!-- WCAG Notice -->
      <div style="padding:1rem 1.25rem;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;">
        <span style="font-size:1.5rem;">♿</span>
        <div>
          <p style="color:#6ee7b7;font-weight:700;font-size:0.9rem;margin:0;">WCAG 2.1 AA Compliant</p>
          <p style="color:#64748b;font-size:0.8rem;margin-top:0.2rem;">This platform meets Web Content Accessibility Guidelines 2.1 Level AA standards.</p>
        </div>
        <span style="margin-left:auto;color:#10b981;font-size:1.25rem;">✅</span>
      </div>

      <!-- Font Size -->
      <div class="settings-card glass">
        <h3 class="settings-section-title">🔠 Font Size</h3>
        <div style="display:flex;gap:0.75rem;">
          <button v-for="size in fontSizes" :key="size"
            @click="accessibility.fontSize=size"
            :style="{ padding:'0.5rem 1.25rem', borderRadius:'8px', border:'2px solid', borderColor: accessibility.fontSize===size ? '#6366f1' : 'rgba(255,255,255,0.1)', background: accessibility.fontSize===size ? 'rgba(99,102,241,0.2)' : 'transparent', color: accessibility.fontSize===size ? '#818cf8' : '#94a3b8', cursor:'pointer', fontWeight:'600', fontSize: size==='small'?'0.75rem':size==='medium'?'0.875rem':size==='large'?'1rem':'1.125rem', transition:'all 0.2s' }">
            {{ size.charAt(0).toUpperCase()+size.slice(1) }}
          </button>
        </div>
      </div>

      <!-- Toggles -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">🎛️ Display Options</h3>
        <div style="display:flex;flex-direction:column;gap:0.85rem;">
          <div v-for="(label, key) in { highContrast:'🌑 High Contrast Mode', reduceMotion:'🎞️ Reduce Motion', screenReaderMode:'🔊 Screen Reader Optimized Mode' }" :key="key"
            style="display:flex;align-items:center;justify-content:space-between;padding:0.85rem 1rem;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid rgba(255,255,255,0.06);">
            <div>
              <p style="color:#e2e8f0;font-size:0.875rem;font-weight:500;">{{ label }}</p>
              <p style="color:#475569;font-size:0.78rem;margin-top:2px;">
                {{ key==='highContrast' ? 'Increases contrast between foreground and background for better readability.' : key==='reduceMotion' ? 'Disables animations and transitions for users with motion sensitivity.' : 'Optimizes tab order, ARIA labels and focus indicators for screen readers.' }}
              </p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="accessibility[key]" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- RTL Support -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">↔️ RTL Support</h3>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
          <div>
            <p style="color:#e2e8f0;font-size:0.875rem;font-weight:500;">Enable Right-to-Left Layout</p>
            <p style="color:#475569;font-size:0.78rem;margin-top:2px;">For Arabic, Hebrew, Persian and Urdu language support.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="accessibility.rtlSupport" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div v-if="accessibility.rtlSupport" class="settings-field" style="max-width:260px;">
          <label class="settings-label">RTL Language</label>
          <select class="form-input" v-model="accessibility.rtlLanguage">
            <option v-for="l in rtlLanguages" :key="l.code" :value="l.code">{{ l.label }}</option>
          </select>
        </div>
      </div>

      <!-- Keyboard Navigation Guide -->
      <div class="settings-card glass" style="margin-top:1.25rem;">
        <h3 class="settings-section-title">⌨️ Keyboard Navigation Guide</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;">
          <div v-for="(desc, key) in { 'Tab': 'Move to next interactive element', 'Shift + Tab': 'Move to previous element', 'Enter / Space': 'Activate buttons and links', 'Arrow Keys': 'Navigate within menus and lists', 'Escape': 'Close dialogs and dropdowns', 'Ctrl + /': 'Open keyboard shortcut help', 'Ctrl + K': 'Open global search', 'Alt + 1–8': 'Jump to settings section' }" :key="key"
            style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.65rem 0.85rem;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.05);">
            <kbd style="background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.3);border-radius:5px;padding:0.15rem 0.5rem;font-size:0.75rem;font-family:'Courier New',monospace;white-space:nowrap;flex-shrink:0;">{{ key }}</kbd>
            <span style="color:#94a3b8;font-size:0.8rem;">{{ desc }}</span>
          </div>
        </div>
      </div>

      <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
        <button class="btn-primary" @click="saveAccessibility">💾 Save Accessibility Settings</button>
      </div>
    </section>

  </main>
</div>

<style>
/* ─── Settings-specific styles ─────────────────────────── */
.settings-nav-item { background: transparent; color: #94a3b8; }
.settings-nav-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
.settings-nav-item.active { background: rgba(99,102,241,0.18); color: #818cf8; font-weight: 600; }
.settings-header { margin-bottom: 1.75rem; }
.settings-card { padding: 1.5rem; border-radius: 16px; }
.settings-section-title { font-size: 0.95rem; font-weight: 700; color: #e2e8f0; margin: 0 0 1rem 0; letter-spacing: -0.01em; }
.settings-label { display: block; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
.settings-field { display: flex; flex-direction: column; }
.settings-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.settings-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

/* Toggle */
.toggle-switch { position: relative; display: inline-block; width: 48px; height: 26px; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.12); border-radius: 26px; transition: background 0.25s; }
.toggle-slider:before { content: ''; position: absolute; height: 20px; width: 20px; left: 3px; bottom: 3px; background: #94a3b8; border-radius: 50%; transition: all 0.25s; }
.toggle-switch input:checked + .toggle-slider { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.toggle-switch input:checked + .toggle-slider:before { transform: translateX(22px); background: #fff; }

/* Logo drop zone */
.logo-drop-zone { border: 2px dashed rgba(99,102,241,0.35); border-radius: 14px; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 120px; transition: all 0.2s; background: rgba(99,102,241,0.04); }
.logo-drop-zone:hover, .logo-drop-zone.drag-over { border-color: #6366f1; background: rgba(99,102,241,0.1); }

/* Theme toggle */
.theme-toggle-group { display: flex; gap: 0.5rem; }
.theme-btn { padding: 0.5rem 1.1rem; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); background: transparent; color: #94a3b8; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; }
.theme-btn.active { border-color: #6366f1; background: rgba(99,102,241,0.2); color: #818cf8; font-weight: 600; }
.theme-btn:hover:not(.active) { border-color: rgba(255,255,255,0.2); color: #e2e8f0; }

/* Plan card */
.plan-card { padding: 1.5rem; border-radius: 16px; border: 2px solid rgba(255,255,255,0.07); transition: all 0.25s; }
.plan-card:hover { transform: translateY(-3px); }

/* Badges */
.badge-success { display: inline-block; padding: 0.2rem 0.6rem; background: rgba(16,185,129,0.15); color: #34d399; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge-danger { display: inline-block; padding: 0.2rem 0.6rem; background: rgba(239,68,68,0.15); color: #f87171; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge-neutral { display: inline-block; padding: 0.2rem 0.6rem; background: rgba(100,116,139,0.2); color: #94a3b8; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge-info { display: inline-block; padding: 0.2rem 0.6rem; background: rgba(99,102,241,0.15); color: #a5b4fc; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }

/* Buttons */
.btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 10px; padding: 0.6rem 1.4rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: rgba(255,255,255,0.07); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 0.55rem 1.1rem; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover { background: rgba(255,255,255,0.12); }
.btn-ghost { background: none; border: 1px solid rgba(255,255,255,0.08); color: #64748b; border-radius: 10px; padding: 0.55rem 1rem; font-weight: 500; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.btn-ghost:hover { color: #94a3b8; border-color: rgba(255,255,255,0.15); }
.btn-sm-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 7px; padding: 0.35rem 0.85rem; font-weight: 600; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; }
.btn-sm-outline-danger { background: transparent; color: #f87171; border: 1px solid rgba(239,68,68,0.35); border-radius: 7px; padding: 0.35rem 0.85rem; font-weight: 600; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; }
.btn-sm-outline-danger:hover { background: rgba(239,68,68,0.1); }

/* Alert */
.alert-warning { padding: 0.75rem 1rem; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; color: #fcd34d; font-size: 0.85rem; }

/* Toast */
.toast-success { background: rgba(16,185,129,0.2); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
.toast-error { background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }

/* Integration card */
.integration-card { transition: transform 0.2s, box-shadow 0.2s; }
.integration-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }

/* Transitions */
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(24px); opacity: 0; }

/* Scrollbar */
.settings-page ::-webkit-scrollbar { width: 5px; }
.settings-page ::-webkit-scrollbar-track { background: transparent; }
.settings-page ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 10px; }
</style>
`
};
