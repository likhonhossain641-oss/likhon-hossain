import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { 
  User as UserIcon,
  Menu,
  Users, 
  Plus, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  LogOut, 
  Bell, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Phone, 
  MapPin, 
  Filter, 
  Download, 
  Languages,
  BookOpen,
  UserPlus,
  CreditCard,
  History,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  X,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency, formatDate } from './lib/utils';
import { User, Customer, Transaction, DashboardStats } from './types';

// --- Translations ---
const translations = {
  en: {
    appName: "Notebook Store",
    tagline: "Digital Khata for Shopkeepers",
    login: "Login",
    register: "Register",
    phone: "Phone Number",
    password: "Password",
    name: "Full Name",
    shopName: "Shop Name",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    dashboard: "Dashboard",
    customers: "Customers",
    totalDue: "Total Due",
    totalPaid: "Total Paid",
    todayTransactions: "Today's Transactions",
    addCustomer: "Add Customer",
    searchCustomer: "Search customer...",
    all: "All",
    due: "Due",
    paid: "Paid",
    addTransaction: "Add Transaction",
    amount: "Amount",
    note: "Note (Optional)",
    credit: "Credit (Got)",
    debit: "Debit (Gave)",
    history: "History",
    reminders: "Reminders",
    chat: "Chat",
    export: "Export",
    logout: "Logout",
    save: "Save",
    cancel: "Cancel",
    address: "Address",
    lastPayment: "Last Payment",
    balance: "Balance",
    date: "Date",
    saving: "Saving...",
    details: "Details",
    noTransactions: "No transactions yet.",
    noCustomers: "No customers found.",
    reminderSet: "Reminder set for",
    sendMessage: "Send Message",
    totalCustomers: "Total Customers",
    totalReceivable: "Total Receivable",
    totalPayable: "Total Payable",
    got: "Got",
    gave: "Gave",
    adminPanel: "Admin Panel",
    totalUsers: "Total Users",
    activeUsers: "Active Users",
    userManagement: "User Management",
    status: "Status",
    actions: "Actions",
    deactivate: "Deactivate",
    activate: "Activate",
    behavior: "User Behavior",
    bengali: "বাংলা",
    english: "English",
    subscription: "Subscription",
    subscribeNow: "Subscribe Now",
    trialMessage: "You are on a 3-day free trial. Enjoy all features!",
    trialEnded: "Your trial has ended. Please subscribe to continue.",
    subscriptionPrice: "300 Taka / Month",
    payWithBkash: "Pay with bKash",
    payWithNagad: "Pay with Nagad",
    transactionId: "Transaction ID",
    verifyPayment: "Verify Payment",
    subscriptionSuccess: "Subscription activated successfully!",
    daysLeft: "days left in trial",
    menu: "Dashboard Menu",
    customerDetails: "Customer Details",
    profile: "Profile",
    changePhoto: "Change Photo",
    updateProfile: "Update Profile",
    accountDetails: "Account Details",
  },
  bn: {
    appName: "নোটবুক স্টোর",
    tagline: "দোকানদারদের ডিজিটাল খাতা",
    login: "লগইন",
    register: "রেজিস্টার",
    phone: "ফোন নম্বর",
    password: "পাসওয়ার্ড",
    name: "পুরো নাম",
    shopName: "দোকানের নাম",
    noAccount: "অ্যাকাউন্ট নেই?",
    hasAccount: "অ্যাকাউন্ট আছে?",
    dashboard: "ড্যাশবোর্ড",
    customers: "কাস্টমার",
    totalDue: "মোট বাকি",
    totalPaid: "মোট পরিশোধ",
    todayTransactions: "আজকের লেনদেন",
    addCustomer: "কাস্টমার যোগ করুন",
    searchCustomer: "কাস্টমার খুঁজুন...",
    all: "সব",
    due: "বাকি",
    paid: "পরিশোধ",
    addTransaction: "লেনদেন যোগ করুন",
    amount: "টাকার পরিমাণ",
    note: "নোট (ঐচ্ছিক)",
    credit: "জমা (পেলাম)",
    debit: "বাকি (দিলাম)",
    history: "ইতিহাস",
    reminders: "রিমাইন্ডার",
    chat: "চ্যাট",
    export: "এক্সপোর্ট",
    logout: "লগআউট",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    address: "ঠিকানা",
    lastPayment: "শেষ পেমেন্ট",
    balance: "ব্যালেন্স",
    date: "তারিখ",
    saving: "সংরক্ষণ হচ্ছে...",
    details: "বিস্তারিত",
    noTransactions: "কোন লেনদেন নেই।",
    noCustomers: "কোন কাস্টমার পাওয়া যায়নি।",
    reminderSet: "রিমাইন্ডার সেট করা হয়েছে",
    sendMessage: "মেসেজ পাঠান",
    totalCustomers: "মোট কাস্টমার",
    totalReceivable: "মোট পাবো",
    totalPayable: "মোট দেবো",
    got: "পেলাম",
    gave: "দিলাম",
    adminPanel: "অ্যাডমিন প্যানেল",
    totalUsers: "মোট ইউজার",
    activeUsers: "সক্রিয় ইউজার",
    userManagement: "ইউজার ম্যানেজমেন্ট",
    status: "অবস্থা",
    actions: "অ্যাকশন",
    deactivate: "নিষ্ক্রিয় করুন",
    activate: "সক্রিয় করুন",
    behavior: "ইউজার আচরণ",
    bengali: "বাংলা",
    english: "English",
    subscription: "সাবস্ক্রিপশন",
    subscribeNow: "সাবস্ক্রাইব করুন",
    trialMessage: "আপনি ৩ দিনের ফ্রি ট্রায়ালে আছেন। সব ফিচার উপভোগ করুন!",
    trialEnded: "আপনার ট্রায়াল শেষ হয়েছে। চালিয়ে যেতে সাবস্ক্রাইব করুন।",
    subscriptionPrice: "৩০০ টাকা / মাস",
    payWithBkash: "বিকাশ দিয়ে পেমেন্ট করুন",
    payWithNagad: "নগদ দিয়ে পেমেন্ট করুন",
    transactionId: "ট্রানজেকশন আইডি",
    verifyPayment: "পেমেন্ট যাচাই করুন",
    subscriptionSuccess: "সাবস্ক্রিপশন সফলভাবে সক্রিয় হয়েছে!",
    daysLeft: "দিন ট্রায়াল বাকি",
    menu: "ড্যাশবোর্ড মেনু",
    customerDetails: "কাস্টমার ডিটেইলস",
    profile: "প্রোফাইল",
    changePhoto: "ছবি পরিবর্তন করুন",
    updateProfile: "প্রোফাইল আপডেট করুন",
    accountDetails: "অ্যাকাউন্ট বিস্তারিত",
  }
};

type Lang = 'en' | 'bn';

// --- API Service ---
const API = {
  token: localStorage.getItem('token'),
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  },
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  },
  async request(path: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
      ...options.headers,
    };
    const response = await fetch(path, { ...options, headers });
    
    if (response.status === 204) return null;

    let data;
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (contentType && contentType.includes('application/json') && text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON response:', e, 'Raw text:', text);
        data = { error: 'Invalid server response' };
      }
    } else {
      data = text ? { error: text } : { error: `Server error (Status: ${response.status})` };
    }

    if (!response.ok) {
      console.error(`API Request Failed: ${path}`, { status: response.status, data });
      // Handle authentication errors globally
      if (response.status === 401 || (data.error && (data.error.includes('User not found') || data.error.includes('Invalid token')))) {
        this.clearToken();
        window.location.href = '/login';
      }
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    return data;
  }
};

// --- Components ---

const Button = ({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'hover:bg-gray-100 text-gray-600'
  };
  return (
    <button 
      className={cn('px-4 py-2 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50', variants[variant], className)} 
      {...props} 
    />
  );
};

const Input = ({ className, label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className={cn('w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all', className)} 
      {...props} 
    />
  </div>
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden', className)}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <Plus className="w-5 h-5 rotate-45 text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Pages ---

const LoginPage = ({ setLang, lang, t }: { setLang: (l: Lang) => void, lang: Lang, t: any }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await API.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password })
      });
      API.setToken(data.token);
      localStorage.setItem('user_role', data.user.role);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-3xl shadow-2xl mb-4 rotate-3 hover:rotate-0 transition-transform duration-500">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t.appName}</h1>
          <p className="text-lg text-gray-500 font-medium">{t.tagline}</p>
        </div>

        <Card className="p-8 space-y-6 shadow-xl border-t-4 border-t-blue-600">
          <div className="flex justify-end">
            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label={t.phone} 
              type="tel" 
              placeholder="017xxxxxxxx" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              required 
            />
            <Input 
              label={t.password} 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
            <Button className="w-full h-12 text-lg" disabled={loading}>
              {loading ? '...' : t.login}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t.noAccount}{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">{t.register}</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const RegisterPage = ({ t }: { t: any }) => {
  const [form, setForm] = useState({ name: '', phone: '', password: '', shopName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await API.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          name: form.name, 
          phone: form.phone, 
          password: form.password, 
          shopName: form.shopName 
        })
      });
      API.setToken(data.token);
      localStorage.setItem('user_role', data.user.role);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{t.register}</h1>
          <p className="text-gray-500">{t.tagline}</p>
        </div>

        <Card className="p-8 space-y-6 shadow-xl border-t-4 border-t-green-600">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input label={t.name} placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <Input label={t.shopName} placeholder="My Store" value={form.shopName} onChange={e => setForm({...form, shopName: e.target.value})} required />
            <Input label={t.phone} type="tel" placeholder="017xxxxxxxx" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            <Input label={t.password} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
            <Button className="w-full h-12 text-lg" variant="secondary" disabled={loading}>
              {loading ? '...' : t.register}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t.hasAccount}{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">{t.login}</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SubscriptionPage = ({ t, lang, setLang }: { t: any, lang: Lang, setLang: (l: Lang) => void }) => {
  const [method, setMethod] = useState<'bkash' | 'nagad' | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const profileData = await API.request('/api/profile');
      setUserProfile(profileData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!method || !transactionId) return;
    
    setLoading(true);
    setError('');
    try {
      await API.request('/api/subscription/pay', {
        method: 'POST',
        body: JSON.stringify({ amount: 300, method, transactionId })
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-12">
      <header className="bg-blue-600 text-white p-6 rounded-b-[2rem] shadow-lg sticky top-0 z-10 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DropdownMenu t={t} navigate={navigate} lang={lang} setLang={setLang} onProfileClick={() => setIsProfileModalOpen(true)} />
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">{t.subscription}</h1>
          </div>
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden hover:border-white/50 transition-all flex items-center justify-center bg-white/10"
          >
            {userProfile?.photo_url ? (
              <img src={userProfile.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
            <CreditCard className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t.subscription}</h1>
          <p className="text-gray-500">{t.subscriptionPrice}</p>
        </div>

        <Card className="p-8 space-y-6 shadow-xl border-t-4 border-t-blue-600">
          {success ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <p className="font-bold text-green-600">{t.subscriptionSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setMethod('bkash')}
                  className={cn('p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all', method === 'bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-pink-200')}
                >
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">b</div>
                  <span className="text-xs font-bold text-pink-600">bKash</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setMethod('nagad')}
                  className={cn('p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all', method === 'nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200')}
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">n</div>
                  <span className="text-xs font-bold text-orange-600">Nagad</span>
                </button>
              </div>

              {method && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <p className="text-xs text-gray-500 font-medium">
                      {method === 'bkash' ? 'Send 300 Taka to: 01700000000 (Personal)' : 'Send 300 Taka to: 01800000000 (Personal)'}
                    </p>
                    <p className="text-[10px] text-gray-400">Please provide the Transaction ID after payment.</p>
                  </div>
                  <Input 
                    label={t.transactionId} 
                    placeholder="TRX12345678" 
                    value={transactionId} 
                    onChange={e => setTransactionId(e.target.value)} 
                    required 
                  />
                  {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
                  <Button className="w-full h-12 text-lg" disabled={loading}>
                    {loading ? '...' : t.verifyPayment}
                  </Button>
                </div>
              )}
            </form>
          )}
        </Card>
        
        <button onClick={() => navigate('/')} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 font-medium">
          {t.cancel}
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        t={t} 
        user={userProfile} 
        onUpdate={fetchProfile} 
      />
    </div>
  );
};

const ProfileModal = ({ isOpen, onClose, t, user, onUpdate }: { isOpen: boolean, onClose: () => void, t: any, user: User | null, onUpdate: () => void }) => {
  const [form, setForm] = useState({ name: '', shop_name: '', photo_url: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, shop_name: user.shop_name, photo_url: user.photo_url || '' });
    }
  }, [user, isOpen]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.request('/api/profile/update', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      onUpdate();
      onClose();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.profile}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-blue-50 overflow-hidden flex items-center justify-center shadow-inner">
              {form.photo_url ? (
                <img src={form.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
            </label>
          </div>
          <p className="text-xs text-gray-500 font-medium">{t.changePhoto}</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.accountDetails}</p>
            <p className="text-sm font-bold text-gray-700">{user?.phone}</p>
          </div>
          
          <Input label={t.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label={t.shopName} value={form.shop_name} onChange={e => setForm({ ...form, shop_name: e.target.value })} required />
        </div>

        <Button className="w-full h-12 text-lg" disabled={loading}>
          {loading ? '...' : t.updateProfile}
        </Button>
      </form>
    </Modal>
  );
};

const BottomNav = ({ t }: { t: any }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <button 
        onClick={() => navigate('/')}
        className={cn('flex flex-col items-center gap-1', location.pathname === '/' ? 'text-blue-600' : 'text-gray-400')}
      >
        <BookOpen className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase">{t.dashboard}</span>
      </button>
      <button 
        onClick={() => navigate('/history')}
        className={cn('flex flex-col items-center gap-1', location.pathname === '/history' ? 'text-blue-600' : 'text-gray-400')}
      >
        <History className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase">{t.history}</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-400">
        <Bell className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase">{t.reminders}</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-400">
        <MessageSquare className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase">{t.chat}</span>
      </button>
    </nav>
  );
};

const DropdownMenu = ({ t, navigate, lang, setLang, onProfileClick, variant = 'light' }: { t: any, navigate: (path: string) => void, lang: Lang, setLang: (l: Lang) => void, onProfileClick?: () => void, variant?: 'light' | 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isCustomerPage = location.pathname.startsWith('/customer/');

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-xl transition-colors flex items-center justify-center",
          variant === 'light' ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-600"
        )}
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-20" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-30 overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-gray-50 mb-1 flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.menu}</p>
                <button 
                  onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                  className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-100 transition-colors"
                >
                  {lang === 'en' ? 'BN' : 'EN'}
                </button>
              </div>
              
              <button 
                onClick={() => { navigate('/'); setIsOpen(false); }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 text-gray-700 flex items-center gap-3 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold">{t.dashboard}</span>
              </button>

              {onProfileClick && (
                <button 
                  onClick={() => { onProfileClick(); setIsOpen(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 text-gray-700 flex items-center gap-3 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold">{t.profile}</span>
                </button>
              )}

              {isCustomerPage && (
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 text-left bg-blue-50 text-blue-700 flex items-center gap-3 transition-colors"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold">{t.customerDetails}</span>
                </button>
              )}

              <button 
                onClick={() => { navigate('/history'); setIsOpen(false); }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 text-gray-700 flex items-center gap-3 transition-colors"
              >
                <History className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold">{t.history}</span>
              </button>

              <button 
                onClick={() => { navigate('/subscribe'); setIsOpen(false); }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 text-gray-700 flex items-center gap-3 transition-colors"
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold">{t.subscription}</span>
              </button>

              <div className="border-t border-gray-50 mt-1 pt-1">
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_role');
                    window.location.href = '/login';
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-bold">{t.logout}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard = ({ t, lang, setLang }: { t: any, lang: Lang, setLang: (l: Lang) => void }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'due' | 'paid'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const [subStatus, setSubStatus] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const [statsData, customersData, subData, profileData] = await Promise.all([
        API.request('/api/dashboard/stats'),
        API.request('/api/customers'),
        API.request('/api/subscription/status'),
        API.request('/api/profile')
      ]);
      if (statsData && !statsData.error) setStats(statsData);
      if (Array.isArray(customersData)) {
        setCustomers(customersData);
      } else {
        console.error('Customers data is not an array:', customersData);
        setCustomers([]);
      }
      setSubStatus(subData);
      setUserProfile(profileData);
      setError(null);
    } catch (err: any) {
      console.error('Fetch data error:', err);
      setError(err.message || 'Failed to fetch data');
      setCustomers([]);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const trialDaysLeft = useMemo(() => {
    if (!subStatus || subStatus.subscription_status === 'active') return null;
    const now = new Date();
    const trialEnds = new Date(subStatus.trial_ends_at);
    const diff = trialEnds.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [subStatus]);

  const [showTrialNotice, setShowTrialNotice] = useState(false);

  useEffect(() => {
    const hasSeenTrialNotice = localStorage.getItem('hasSeenTrialNotice');
    if (!hasSeenTrialNotice && trialDaysLeft !== null && trialDaysLeft > 0) {
      setShowTrialNotice(true);
      localStorage.setItem('hasSeenTrialNotice', 'true');
    }
  }, [trialDaysLeft]);

  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return [];
    return customers.filter(c => {
      const matchesSearch = (c.name?.toLowerCase() || '').includes(search.toLowerCase()) || (c.phone || '').includes(search);
      const matchesFilter = filter === 'all' || (filter === 'due' ? c.total_due > 0 : c.total_due <= 0);
      return matchesSearch && matchesFilter;
    });
  }, [customers, search, filter]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    setError(null);
    setIsSaving(true);
    console.log('Attempting to add customer:', newCustomer);
    try {
      const response = await API.request('/api/customers', {
        method: 'POST',
        body: JSON.stringify(newCustomer)
      });
      console.log('Customer added successfully:', response);
      setIsAddModalOpen(false);
      setNewCustomer({ name: '', phone: '', address: '' });
      await fetchData();
    } catch (err: any) {
      console.error('Add customer error:', err);
      setError(err.message || 'Failed to add customer');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DropdownMenu t={t} navigate={navigate} lang={lang} setLang={setLang} onProfileClick={() => setIsProfileModalOpen(true)} />
            <div className="flex items-center gap-2 ml-1">
              <BookOpen className="w-5 h-5 opacity-80" />
              <h1 className="text-base font-bold tracking-tight">{t.appName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {localStorage.getItem('user_role') === 'admin' && (
              <button 
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <Shield className="w-4 h-4" />
                {t.adminPanel}
              </button>
            )}
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-600"></span>
            </button>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden hover:border-white/50 transition-all flex items-center justify-center bg-white/10"
            >
              {userProfile?.photo_url ? (
                <img src={userProfile.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 -mt-6 space-y-6">
        {trialDaysLeft !== null && trialDaysLeft > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{t.trialMessage}</p>
                <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">{trialDaysLeft} {t.daysLeft}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/subscribe')}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg active:scale-95 transition-all"
            >
              {t.subscribeNow}
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white border-l-4 border-l-red-500">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.totalReceivable}</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(stats?.total_due || 0)}</p>
            <div className="flex items-center gap-1 text-xs text-red-500 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+12% this month</span>
            </div>
          </Card>
          <Card className="p-4 bg-white border-l-4 border-l-green-500">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.todayTransactions}</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats?.today_transactions || 0)}</p>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-2">
              <TrendingDown className="w-3 h-3" />
              <span>-5% vs yesterday</span>
            </div>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder={t.searchCustomer} 
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setFilter('all')}
              className={cn('px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap', filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200')}
            >
              {t.all}
            </button>
            <button 
              onClick={() => setFilter('due')}
              className={cn('px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap', filter === 'due' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-white text-gray-600 border border-gray-200')}
            >
              {t.due}
            </button>
            <button 
              onClick={() => setFilter('paid')}
              className={cn('px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap', filter === 'paid' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-white text-gray-600 border border-gray-200')}
            >
              {t.paid}
            </button>
          </div>
        </div>

        {/* Customer List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {t.customers} ({filteredCustomers.length})
            </h2>
            <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
              <Filter className="w-4 h-4" />
              {t.export}
            </button>
          </div>

          <div className="space-y-3">
            {filteredCustomers.length > 0 ? filteredCustomers.map(customer => (
              <motion.div 
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/customer/${customer.id}`)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-200 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{customer.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {customer.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('font-bold text-lg', customer.total_due > 0 ? 'text-red-600' : 'text-green-600')}>
                    {formatCurrency(customer.total_due)}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{customer.total_due > 0 ? t.due : t.paid}</p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Users className="w-10 h-10" />
                </div>
                <p className="text-gray-500">{t.noCustomers}</p>
                <Button onClick={() => setIsAddModalOpen(true)} variant="outline">
                  <Plus className="w-4 h-4" /> {t.addCustomer}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-20"
      >
        <UserPlus className="w-6 h-6" />
      </button>

      {/* Bottom Nav */}
      <BottomNav t={t} />

      {/* Trial Notice Modal */}
      <Modal isOpen={showTrialNotice} onClose={() => setShowTrialNotice(false)} title={t.subscription}>
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">{t.trialMessage}</h3>
            <p className="text-sm text-gray-500">
              {trialDaysLeft} {t.daysLeft}
            </p>
          </div>
          <Button className="w-full h-12" onClick={() => setShowTrialNotice(false)}>
            {t.save}
          </Button>
        </div>
      </Modal>

      {/* Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t.addCustomer}>
        <form 
          onSubmit={(e) => {
            console.log('Form submitted');
            handleAddCustomer(e);
          }} 
          className="space-y-4"
        >
          <Input label={t.name} placeholder="Rahim Ahmed" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} required />
          <Input label={t.phone} type="tel" placeholder="017xxxxxxxx" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} required />
          <Input label={t.address} placeholder="Dhaka, Bangladesh" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAddModalOpen(false)} disabled={isSaving}>{t.cancel}</Button>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{t.saving || 'Saving...'}</span>
                </div>
              ) : t.save}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        t={t} 
        user={userProfile} 
        onUpdate={fetchData} 
      />
    </div>
  );
};

const CustomerDetails = ({ t, lang, setLang }: { t: any, lang: Lang, setLang: (l: Lang) => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ amount: '', type: 'credit' as 'credit' | 'debit', note: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const [customerData, txData, profileData] = await Promise.all([
        API.request(`/api/customers/${id}`),
        API.request(`/api/transactions/${id}`),
        API.request('/api/profile')
      ]);
      setCustomer(customerData);
      setUserProfile(profileData);
      if (Array.isArray(txData)) {
        setTransactions(txData);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Fetch customer details error:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await API.request('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          customer_id: id,
          amount: parseFloat(newTx.amount),
          type: newTx.type,
          note: newTx.note,
          date: newTx.date
        })
      });
      setIsTxModalOpen(false);
      setNewTx({ amount: '', type: 'credit', note: '', date: new Date().toISOString().split('T')[0] });
      await fetchData();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!customer) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <DropdownMenu t={t} navigate={navigate} lang={lang} setLang={setLang} onProfileClick={() => setIsProfileModalOpen(true)} variant="dark" />
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-gray-800 leading-none">{customer.name}</h1>
              <p className="text-xs text-gray-500 mt-1">{customer.phone}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-10 h-10 rounded-full border-2 border-gray-100 overflow-hidden hover:border-blue-200 transition-all flex items-center justify-center bg-gray-50"
          >
            {userProfile?.photo_url ? (
              <img src={userProfile.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-6 h-6 text-gray-400" />
            )}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600">
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">{t.balance}</p>
            <h2 className="text-4xl font-black mt-1">{formatCurrency(customer.total_due)}</h2>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-[10px] uppercase font-bold text-blue-200">{t.got}</p>
                <p className="text-lg font-bold">{formatCurrency(customer.total_paid)}</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-[10px] uppercase font-bold text-blue-200">{t.gave}</p>
                <p className="text-lg font-bold">{formatCurrency(customer.total_due + customer.total_paid)}</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
        </Card>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold">{t.lastPayment}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-700">
                  {transactions.find(t => t.type === 'debit')?.date ? formatDate(transactions.find(t => t.type === 'debit')!.date) : 'N/A'}
                </p>
                {transactions.find(t => t.type === 'debit') && (
                  <p className="text-xs font-bold text-green-600">
                    {formatCurrency(transactions.find(t => t.type === 'debit')!.amount)}
                  </p>
                )}
              </div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">{t.address}</p>
              <p className="text-sm font-bold text-gray-700">{customer.address || 'N/A'}</p>
            </div>
          </Card>
        </div>

        {/* Transaction History (Khata Style) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              {t.history}
            </h2>
            <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
              <Download className="w-4 h-4" />
              {t.export}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <div>{t.history}</div>
              <div className="text-center">{t.gave}</div>
              <div className="text-right">{t.got}</div>
            </div>

            <div className="divide-y divide-gray-50">
              {transactions.length > 0 ? transactions.map(tx => (
                <div key={tx.id} className="grid grid-cols-3 px-4 py-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-800">{formatDate(tx.date)}</p>
                    <p className="text-[10px] text-gray-500 italic">{tx.note || '-'}</p>
                  </div>
                  <div className="text-center">
                    {tx.type === 'credit' ? (
                      <span className="text-red-600 font-bold text-sm">{formatCurrency(tx.amount)}</span>
                    ) : '-'}
                  </div>
                  <div className="text-right">
                    {tx.type === 'debit' ? (
                      <span className="text-green-600 font-bold text-sm">{formatCurrency(tx.amount)}</span>
                    ) : '-'}
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-400 text-sm italic">
                  {t.noTransactions}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4 z-20">
        <Button 
          variant="danger" 
          className="flex-1 h-14 rounded-2xl shadow-lg shadow-red-200"
          onClick={() => { setNewTx({ ...newTx, type: 'credit' }); setIsTxModalOpen(true); }}
        >
          <TrendingUp className="w-5 h-5" />
          {t.gave}
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1 h-14 rounded-2xl shadow-lg shadow-green-200"
          onClick={() => { setNewTx({ ...newTx, type: 'debit' }); setIsTxModalOpen(true); }}
        >
          <TrendingDown className="w-5 h-5" />
          {t.got}
        </Button>
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} title={newTx.type === 'credit' ? t.gave : t.got}>
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div className={cn('p-4 rounded-xl border flex items-center justify-between', newTx.type === 'credit' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100')}>
            <span className="text-sm font-medium text-gray-500">{t.amount}</span>
            <div className="flex items-center gap-2">
              <span className={cn('text-2xl font-bold', newTx.type === 'credit' ? 'text-red-400' : 'text-green-400')}>৳</span>
              <input 
                type="number" 
                autoFocus
                className={cn('bg-transparent text-3xl font-black w-32 outline-none text-right', newTx.type === 'credit' ? 'text-red-600' : 'text-green-600')}
                placeholder="0"
                value={newTx.amount}
                onChange={e => setNewTx({...newTx, amount: e.target.value})}
                required
              />
            </div>
          </div>
          <Input label={t.date} type="date" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} required />
          <Input label={t.note} placeholder={t.note} value={newTx.note} onChange={e => setNewTx({...newTx, note: e.target.value})} />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsTxModalOpen(false)} disabled={isSaving}>{t.cancel}</Button>
            <Button type="submit" className={cn('flex-1', newTx.type === 'credit' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700')} disabled={isSaving}>
              {isSaving ? '...' : t.save}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        t={t} 
        user={userProfile} 
        onUpdate={fetchData} 
      />
    </div>
  );
};

const SubscriptionGuard = ({ children, t }: { children: React.ReactNode, t: any }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await API.request('/api/subscription/status');
        setStatus(data);
        
        const now = new Date();
        const trialEnds = new Date(data.trial_ends_at);
        const subEnds = data.subscription_ends_at ? new Date(data.subscription_ends_at) : null;
        
        const isSubscribed = data.subscription_status === 'active' && subEnds && subEnds > now;
        const isTrialActive = trialEnds > now;

        if (!isSubscribed && !isTrialActive) {
          navigate('/subscribe');
        }
      } catch (err: any) {
        console.error('Subscription check failed:', err);
        if (err.message.includes('User not found') || err.message.includes('Invalid token')) {
          API.clearToken();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    if (API.token) checkStatus();
    else {
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return <>{children}</>;
};

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'bn');
  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setLang={setLang} lang={lang} t={t} />} />
        <Route path="/register" element={<RegisterPage t={t} />} />
        <Route path="/subscribe" element={<SubscriptionPage t={t} lang={lang} setLang={setLang} />} />
        <Route path="/" element={
          <SubscriptionGuard t={t}>
            <Dashboard t={t} lang={lang} setLang={setLang} />
          </SubscriptionGuard>
        } />
        <Route path="/customer/:id" element={
          <SubscriptionGuard t={t}>
            <CustomerDetails t={t} lang={lang} setLang={setLang} />
          </SubscriptionGuard>
        } />
        <Route path="/history" element={
          <SubscriptionGuard t={t}>
            <GlobalHistory t={t} lang={lang} setLang={setLang} />
          </SubscriptionGuard>
        } />
        <Route path="/admin" element={
          <SubscriptionGuard t={t}>
            <GlobalAdmin t={t} lang={lang} setLang={setLang} />
          </SubscriptionGuard>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

const GlobalHistory = ({ t, lang, setLang }: { t: any, lang: Lang, setLang: (l: Lang) => void }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const [txData, profileData] = await Promise.all([
        API.request('/api/transactions/all'),
        API.request('/api/profile')
      ]);
      setTransactions(txData);
      setUserProfile(profileData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      <header className="bg-blue-600 text-white p-6 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DropdownMenu t={t} navigate={navigate} lang={lang} setLang={setLang} onProfileClick={() => setIsProfileModalOpen(true)} />
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">{t.history}</h1>
          </div>
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden hover:border-white/50 transition-all flex items-center justify-center bg-white/10"
          >
            {userProfile?.photo_url ? (
              <img src={userProfile.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {transactions.map(tx => (
                <Link key={tx.id} to={`/customer/${tx.customer_id}`} className="block p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold', tx.type === 'credit' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600')}>
                        {tx.customer_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{tx.customer_name}</p>
                        <p className="text-[10px] text-gray-400">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn('font-bold', tx.type === 'credit' ? 'text-red-600' : 'text-green-600')}>
                        {tx.type === 'credit' ? '-' : '+'}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        {tx.type === 'credit' ? t.gave : t.got}
                      </p>
                    </div>
                  </div>
                  {tx.note && <p className="mt-2 text-xs text-gray-500 italic pl-13">{tx.note}</p>}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 italic">
            {t.noTransactions}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav t={t} />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        t={t} 
        user={userProfile} 
        onUpdate={fetchData} 
      />
    </div>
  );
};

const GlobalAdmin = ({ t, lang, setLang }: { t: any, lang: Lang, setLang: (l: Lang) => void }) => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [behavior, setBehavior] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchAdminData = async () => {
    try {
      const [statsData, usersData, behaviorData, profileData] = await Promise.all([
        API.request('/api/admin/stats'),
        API.request('/api/admin/users'),
        API.request('/api/admin/behavior'),
        API.request('/api/profile')
      ]);
      setStats(statsData);
      setUsers(usersData);
      setBehavior(behaviorData);
      setUserProfile(profileData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const toggleUserStatus = async (userId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await API.request(`/api/admin/users/${userId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus })
      });
      fetchAdminData();
    } catch (err) {
      alert(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      <header className="bg-gray-900 text-white p-6 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DropdownMenu t={t} navigate={navigate} lang={lang} setLang={setLang} onProfileClick={() => setIsProfileModalOpen(true)} />
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">{t.adminPanel}</h1>
          </div>
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden hover:border-white/50 transition-all flex items-center justify-center bg-white/10"
          >
            {userProfile?.photo_url ? (
              <img src={userProfile.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-t-4 border-t-blue-600">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{t.totalUsers}</p>
            <p className="text-2xl font-black text-gray-800">{stats?.total_users}</p>
          </Card>
          <Card className="p-4 bg-white border-t-4 border-t-green-600">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{t.totalCustomers}</p>
            <p className="text-2xl font-black text-gray-800">{stats?.total_customers}</p>
          </Card>
          <Card className="p-4 bg-white border-t-4 border-t-red-600">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{t.totalReceivable}</p>
            <p className="text-xl font-black text-gray-800 truncate">{formatCurrency(stats?.total_due)}</p>
          </Card>
          <Card className="p-4 bg-white border-t-4 border-t-purple-600">
            <p className="text-[10px] text-gray-400 uppercase font-bold">New Today</p>
            <p className="text-2xl font-black text-gray-800">{stats?.new_users_today}</p>
          </Card>
        </div>

        {/* User Behavior */}
        <Card className="p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {t.behavior}
          </h2>
          <div className="space-y-3">
            {behavior.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-800">{b.name}</p>
                  <p className="text-xs text-gray-500">{b.shop_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-blue-600">{b.tx_count}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Transactions</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* User Management */}
        <Card className="p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            {t.userManagement}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Shop</th>
                  <th className="pb-3">Customers</th>
                  <th className="pb-3">{t.status}</th>
                  <th className="pb-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="text-sm">
                    <td className="py-4">
                      <p className="font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </td>
                    <td className="py-4 text-gray-600">{user.shop_name}</td>
                    <td className="py-4 font-bold text-blue-600">{user.customer_count}</td>
                    <td className="py-4">
                      <span className={cn('px-2 py-1 rounded-full text-[10px] font-bold uppercase', user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.status)}
                        className={cn('text-xs font-bold px-3 py-1 rounded-lg transition-colors', user.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100')}
                      >
                        {user.status === 'active' ? t.deactivate : t.activate}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Bottom Nav */}
      <BottomNav t={t} />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        t={t} 
        user={userProfile} 
        onUpdate={fetchAdminData} 
      />
    </div>
  );
};
