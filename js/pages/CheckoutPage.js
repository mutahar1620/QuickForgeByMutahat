import { Icons } from '../icons.js';

export const CheckoutPage = {
  name: 'CheckoutPage',
  props: ['data', 'darkMode', 'selectedPlan'],
  emits: ['navigate', 'toggle-theme'],
  setup(props, { emit }) {
    const { ref, computed } = Vue;

    const isSuccess = ref(false);
    
    const form = ref({
      name: '',
      email: '',
      phone: '',
      cardNumber: '',
      expiry: '',
      cvc: ''
    });

    const plan = computed(() => {
      if (!props.selectedPlan) {
        return { name: 'Basic', price: '$0', period: 'forever' };
      }
      return props.selectedPlan;
    });

    const orderId = computed(() => {
      return 'INV-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    });

    const currentDate = computed(() => {
      const today = new Date();
      return today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    });

    const processPayment = () => {
      // Simulate network request
      setTimeout(() => {
        isSuccess.value = true;
      }, 1000);
    };

    const printInvoice = () => {
      window.print();
    };

    return { Icons, isSuccess, form, plan, orderId, currentDate, processPayment, printInvoice, navigate: (page) => emit('navigate', page), toggleTheme: () => emit('toggle-theme') };
  },
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden selection:bg-indigo-500/30 font-sans print-friendly">
      
      <!-- Navbar (Hidden on Print) -->
      <nav class="fixed top-12 w-full z-50 glass card-pill border-t-4 border-white/5 px-6 py-4 flex justify-between items-center hide-on-print">
        <div class="flex items-center gap-3 cursor-pointer" @click="navigate('landing')">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 dark:text-white font-bold text-lg" style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">Q</div>
          <span class="font-heading font-bold text-2xl text-slate-900 dark:text-white">QuizForge</span>
        </div>
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#" @click.prevent="navigate('landing')" class="hover:text-slate-900 dark:text-white transition-colors">Public Library</a>
          <a href="#" class="hover:text-slate-900 dark:text-white transition-colors">For Schools</a>
          <a href="#" @click.prevent="navigate('pricing')" class="hover:text-slate-900 dark:text-white transition-colors">Pricing</a>
        </div>
        <div class="flex gap-4 items-center">
          <button @click="toggleTheme" class="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-200 dark:bg-slate-800" title="Toggle Theme">
            <span class="w-5 h-5 block" v-html="darkMode ? Icons.sun : Icons.moon"></span>
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        
        <!-- Checkout Form State -->
        <div v-if="!isSuccess" class="grid grid-cols-1 lg:grid-cols-3 gap-8 hide-on-print">
          
          <!-- Form Section -->
          <div class="lg:col-span-2 space-y-8">
            <div class="glass card-pill p-8">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Personal Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input v-model="form.name" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="John Doe">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input v-model="form.email" type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="john@example.com">
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input v-model="form.phone" type="tel" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="+1 (555) 000-0000">
                </div>
              </div>
            </div>

            <div class="glass card-pill p-8">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Payment Method</h2>
              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Card Number</label>
                  <input v-model="form.cardNumber" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="0000 0000 0000 0000">
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Expiry Date</label>
                    <input v-model="form.expiry" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="MM/YY">
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700 dark:text-slate-300">CVC</label>
                    <input v-model="form.cvc" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="123">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="lg:col-span-1">
            <div class="glass card-pill p-6 sticky top-32">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>
              
              <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">{{ plan.name }} Plan</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">Billed {{ plan.period }}</div>
                </div>
                <div class="font-bold text-slate-900 dark:text-white">{{ plan.price }}</div>
              </div>

              <div class="flex justify-between items-center font-bold text-lg text-slate-900 dark:text-white mb-8">
                <span>Total</span>
                <span>{{ plan.price }}</span>
              </div>

              <button @click="processPayment" class="w-full py-3 btn-primary rounded-pill font-bold shadow-glow text-white">
                Complete Purchase
              </button>
              <p class="text-xs text-center text-slate-500 dark:text-slate-400 mt-4 flex items-center justify-center gap-1">
                <span class="w-3 h-3 block" v-html="Icons.check"></span> Secure, encrypted checkout.
              </p>
            </div>
          </div>
        </div>

        <!-- Invoice / Success State -->
        <div v-else class="max-w-3xl mx-auto">
          <!-- Print Actions -->
          <div class="flex justify-between items-center mb-6 hide-on-print">
            <button @click="isSuccess = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              &larr; Back to shop
            </button>
            <button @click="printInvoice" class="btn-primary px-4 py-2 rounded-xl text-sm font-bold text-white shadow-glow-sm flex items-center gap-2">
              <span class="w-4 h-4 block" v-html="Icons.download"></span> Print / Save Invoice
            </button>
          </div>

          <!-- Printable Invoice Box -->
          <div class="glass card-pill p-8 md:p-12 invoice-box relative bg-white dark:bg-slate-900">
            <!-- Success Stamp -->
            <div class="absolute top-12 right-12 text-green-500 opacity-20 transform rotate-12 pointer-events-none hide-on-print">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Header -->
            <div class="flex justify-between items-start mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-indigo-600 print-bg-indigo">Q</div>
                  <span class="font-heading font-bold text-xl text-slate-900 dark:text-white">QuizForge Inc.</span>
                </div>
                <p class="text-sm text-slate-500 dark:text-slate-400">123 Learning Lane<br/>Silicon Valley, CA 94025<br/>support@quizforge.io</p>
              </div>
              <div class="text-right">
                <h1 class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">INVOICE</h1>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300"># {{ orderId }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">Date: {{ currentDate }}</p>
              </div>
            </div>

            <!-- Customer Details -->
            <div class="mb-12">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Billed To:</h3>
              <p class="text-slate-700 dark:text-slate-300 font-medium">{{ form.name || 'Valued Customer' }}</p>
              <p class="text-slate-500 dark:text-slate-400 text-sm">{{ form.email || 'N/A' }}</p>
              <p class="text-slate-500 dark:text-slate-400 text-sm">{{ form.phone || 'N/A' }}</p>
            </div>

            <!-- Line Items -->
            <table class="w-full mb-8">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-left text-sm text-slate-500 dark:text-slate-400 uppercase">
                  <th class="pb-3 font-semibold">Description</th>
                  <th class="pb-3 font-semibold text-center">Period</th>
                  <th class="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-slate-100 dark:border-slate-800/50">
                  <td class="py-4 font-medium text-slate-900 dark:text-white">QuizForge {{ plan.name }} Plan</td>
                  <td class="py-4 text-center text-slate-600 dark:text-slate-300 capitalize">{{ plan.period }}</td>
                  <td class="py-4 text-right font-medium text-slate-900 dark:text-white">{{ plan.price }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Totals -->
            <div class="flex justify-end">
              <div class="w-64">
                <div class="flex justify-between py-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{{ plan.price }}</span>
                </div>
                <div class="flex justify-between py-2 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div class="flex justify-between py-4 font-bold text-xl text-slate-900 dark:text-white">
                  <span>Total Paid</span>
                  <span>{{ plan.price }}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>Thank you for choosing QuizForge to accelerate your learning!</p>
              <p class="mt-1">If you have any questions concerning this invoice, contact our support team.</p>
            </div>
          </div>

        </div>
      </main>

    </div>
  `
};
