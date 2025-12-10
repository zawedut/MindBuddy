"use client";

import { useState, useEffect, useRef } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from "recharts";
import {
    User, MessageSquare, LogOut, Search, Activity, Users,
    TrendingUp, Calendar, Clock, ChevronRight, Send, Sparkles
} from "lucide-react";

// Types
interface UserData {
    id: string;
    lineId: string;
    displayName: string;
    pictureUrl: string;
    nickname: string;
    createdAt: string;
    moods: any[];
    chats: any[];
}

// --- Login Component ---
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            if (res.ok) {
                onLogin();
            } else {
                setError("Username หรือ Password ไม่ถูกต้อง");
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-500 rounded-3xl blur-xl opacity-30 animate-pulse" />

                {/* Login Card */}
                <div className="relative bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 w-full max-w-md shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-bold text-2xl text-slate-900 shadow-lg shadow-teal-500/30">
                            M
                        </div>
                        <h1 className="text-2xl font-bold text-white">MindBuddy Admin</h1>
                        <p className="text-slate-400 text-sm mt-1">เข้าสู่ระบบจัดการ</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-slate-300 text-sm font-medium mb-2 block">Username</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all duration-300"
                                placeholder="Enter username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-slate-300 text-sm font-medium mb-2 block">Password</label>
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all duration-300"
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    กำลังตรวจสอบ...
                                </span>
                            ) : "เข้าสู่ระบบ"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Loading Skeleton ---
const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl" />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-white/5 rounded-2xl" />
            <div className="h-80 bg-white/5 rounded-2xl" />
        </div>
    </div>
);

// --- Time Range Selector ---
const TimeRangeSelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
    const options = [
        { value: 'today', label: 'วันนี้' },
        { value: '7d', label: '7 วัน' },
        { value: '30d', label: '30 วัน' },
        { value: 'all', label: 'ทั้งหมด' },
    ];

    return (
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${value === opt.value
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

// --- Stat Card ---
const StatCard = ({ icon: Icon, title, value, change, color, gradient }: any) => (
    <div className="group relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
        <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
                    <Icon size={22} className="text-white" />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <TrendingUp size={14} className={change < 0 ? 'rotate-180' : ''} />
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <p className="text-slate-400 text-sm mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value.toLocaleString()}</h3>
        </div>
    </div>
);

// --- Chat Room Component ---
const ChatRoom = ({ user, onClose }: { user: UserData | null; onClose: () => void }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [user?.chats]);

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900/95 backdrop-blur-2xl w-full max-w-2xl h-[80vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
                    <img
                        src={user.pictureUrl || "https://via.placeholder.com/48"}
                        className="w-12 h-12 rounded-full border-2 border-teal-500 object-cover"
                        alt={user.displayName}
                    />
                    <div className="flex-1">
                        <h3 className="font-bold text-white">{user.displayName}</h3>
                        <p className="text-sm text-slate-400">@{user.nickname || 'Unknown'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {user.chats.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <MessageSquare size={48} className="mb-4 opacity-30" />
                            <p>ยังไม่มีประวัติการสนทนา</p>
                        </div>
                    ) : (
                        user.chats.slice().reverse().map((chat: any) => (
                            <div
                                key={chat.id}
                                className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] ${chat.role === 'user' ? 'order-2' : 'order-1'}`}>
                                    <div className={`px-4 py-3 rounded-2xl text-sm ${chat.role === 'user'
                                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-tr-sm'
                                            : 'bg-white/10 text-slate-200 rounded-tl-sm'
                                        }`}>
                                        {chat.role === 'assistant' && (
                                            <div className="flex items-center gap-1 text-xs text-teal-400 mb-1">
                                                <Sparkles size={12} /> AI
                                            </div>
                                        )}
                                        {chat.message}
                                    </div>
                                    <p className={`text-xs text-slate-500 mt-1 ${chat.role === 'user' ? 'text-right' : ''}`}>
                                        {new Date(chat.createdAt).toLocaleString('th-TH')}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard ---
export default function AdminDashboard() {
    const [isAuth, setIsAuth] = useState(false);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const auth = localStorage.getItem("admin_auth");
        if (auth === "true") {
            setIsAuth(true);
            fetchData();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuth) fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/data?range=${timeRange}`);
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error("Failed to fetch data");
        }
        setLoading(false);
    };

    const handleLoginSuccess = () => {
        localStorage.setItem("admin_auth", "true");
        setIsAuth(true);
        fetchData();
    };

    const openChatRoom = (user: UserData) => {
        setSelectedUser(user);
        setChatOpen(true);
    };

    // Filter users by search
    const filteredUsers = data?.users?.filter((u: UserData) =>
        u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (!isAuth) return <AdminLogin onLogin={handleLoginSuccess} />;
    if (loading || !data) return <LoadingSkeleton />;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-slate-400">ภาพรวมระบบ MindBuddy</p>
                </div>
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    title="ผู้ใช้ทั้งหมด"
                    value={data.stats.totalUsers}
                    change={12}
                    gradient="from-blue-500 to-indigo-500"
                />
                <StatCard
                    icon={Activity}
                    title="บันทึกอารมณ์"
                    value={data.stats.totalMoods}
                    change={8}
                    gradient="from-teal-500 to-cyan-500"
                />
                <StatCard
                    icon={MessageSquare}
                    title="การสนทนา AI"
                    value={data.stats.totalChats}
                    change={-3}
                    gradient="from-purple-500 to-pink-500"
                />
                <StatCard
                    icon={Clock}
                    title="Active Today"
                    value={data.stats.activeToday || Math.floor(data.stats.totalUsers * 0.3)}
                    gradient="from-orange-500 to-amber-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mood Trend Chart */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full" />
                        กราฟอารมณ์รวม
                    </h3>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts.dailyMoods}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => v.slice(5)} />
                                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 5]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '12px' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Area type="monotone" dataKey="avgScore" stroke="#2dd4bf" strokeWidth={3} fill="url(#colorMood)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mood Distribution */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
                        สัดส่วนอารมณ์
                    </h3>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.charts.moodDistribution}
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {data.charts.moodDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                        {data.charts.moodDistribution.map((item: any) => (
                            <div key={item.name} className="flex items-center gap-2 text-xs text-slate-400">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-white font-semibold flex items-center gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full" />
                        รายชื่อผู้ใช้ ({data.users.length})
                    </h3>

                    {/* Search */}
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาผู้ใช้..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* User Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {filteredUsers.map((user: UserData) => (
                        <div
                            key={user.id}
                            onClick={() => openChatRoom(user)}
                            className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 hover:border-teal-500/30 cursor-pointer transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={user.pictureUrl || "https://via.placeholder.com/48"}
                                    className="w-12 h-12 rounded-full border-2 border-white/20 group-hover:border-teal-500/50 object-cover transition-colors"
                                    alt={user.displayName}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-white truncate">{user.displayName}</h4>
                                    <p className="text-sm text-slate-400 truncate">@{user.nickname || 'Unknown'}</p>
                                </div>
                                <ChevronRight size={20} className="text-slate-500 group-hover:text-teal-400 transition-colors" />
                            </div>

                            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Activity size={14} />
                                    {user.moods?.length || 0} moods
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare size={14} />
                                    {user.chats?.length || 0} chats
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Modal */}
            {chatOpen && (
                <ChatRoom user={selectedUser} onClose={() => setChatOpen(false)} />
            )}

            {/* Custom Animations */}
            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
        </div>
    );
}