"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import { User, MessageSquare, LogOut, Search, Activity, Users } from "lucide-react";

// --- ส่วนจัดการ Login (จำลอง) ---
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // เรียก API ตรวจสอบรหัส (ในที่นี้เราจะเขียน API แยก หรือตรวจสอบง่ายๆ ตรงนี้เพื่อ Demo)
    // ⚠️ เพื่อความง่าย ผมจะให้ยิงไปเช็คที่ Server Action หรือ API
    // แต่นี่คือวิธีแบบ Client-Side Fetch ไปที่ API Login ที่เราต้องสร้าง
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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">MindBuddy Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm">Username</label>
            <input 
              type="text" 
              className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition"
              value={username} onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button 
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-teal-900/20"
          >
            {loading ? "Checking..." : "Login System"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Dashboard Component หลัก ---
export default function AdminDashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // เช็ค Session (แบบง่าย)
  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
        setIsAuth(true);
        fetchData();
    } else {
        setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/admin/data');
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

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuth(false);
  };

  if (!isAuth) return <AdminLogin onLogin={handleLoginSuccess} />;
  if (loading || !data) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-teal-400 animate-pulse">Loading MindBuddy Analytics...</div>;

  // กรองข้อมูลสำหรับ User ที่เลือก
  const userDetail = selectedUser ? data.users.find((u: any) => u.id === selectedUser) : null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-[#0f172a]">M</div>
                <h1 className="font-bold text-lg tracking-wide text-white">MindBuddy <span className="text-slate-500 font-normal">| Admin</span></h1>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition text-sm">
                <LogOut size={16} /> Logout
            </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* 1. Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={<Users />} title="Total Users" value={data.stats.totalUsers} color="text-blue-400" />
            <StatCard icon={<Activity />} title="Total Mood Logs" value={data.stats.totalMoods} color="text-teal-400" />
            <StatCard icon={<MessageSquare />} title="AI Chats" value={data.stats.totalChats} color="text-purple-400" />
        </div>

        {/* 2. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                    กราฟอารมณ์รวม (รายวัน)
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.charts.dailyMoods}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 5]} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                            <Line type="monotone" dataKey="avgScore" stroke="#2dd4bf" strokeWidth={3} dot={{r: 4, fill:'#2dd4bf'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                    สัดส่วนอารมณ์ (Pie Chart)
                </h3>
                <div className="h-[300px] flex justify-center items-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={data.charts.moodDistribution} 
                                innerRadius={60} 
                                outerRadius={100} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {data.charts.moodDistribution.map((entry:any, index:number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div>แย่มาก</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div>แย่</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500"></div>เฉยๆ</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-teal-500"></div>ดี</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div>ดีมาก</div>
                </div>
            </div>
        </div>

        {/* 3. User List & Chat Drilldown */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    รายชื่อผู้ใช้ ({data.users.length})
                </h3>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left: List */}
                <div className="lg:col-span-1 border-r border-slate-800 max-h-[600px] overflow-y-auto">
                    {data.users.map((u: any) => (
                        <div 
                            key={u.id} 
                            onClick={() => setSelectedUser(u.id)}
                            className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition flex items-center gap-3 ${selectedUser === u.id ? 'bg-slate-800 border-l-4 border-l-blue-500' : ''}`}
                        >
                            <img src={u.pictureUrl || "https://via.placeholder.com/40"} alt="profile" className="w-10 h-10 rounded-full bg-slate-700 object-cover" />
                            <div>
                                <p className="text-white font-medium text-sm">{u.displayName}</p>
                                <p className="text-slate-500 text-xs truncate w-32">@{u.nickname || 'Unknown'}</p>
                            </div>
                            <div className="ml-auto text-xs text-slate-500">
                                {new Date(u.createdAt).toLocaleDateString('th-TH')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Details */}
                <div className="lg:col-span-2 bg-[#0f172a]/50 p-6 max-h-[600px] overflow-y-auto">
                    {userDetail ? (
                        <div className="space-y-6">
                             <div className="flex items-center gap-4 mb-6">
                                <img src={userDetail.pictureUrl} className="w-16 h-16 rounded-full border-2 border-teal-500" />
                                <div>
                                    <h2 className="text-xl font-bold text-white">{userDetail.displayName}</h2>
                                    <p className="text-teal-400 text-sm">ชื่อที่บอทจำ: {userDetail.nickname}</p>
                                    <p className="text-slate-500 text-xs">Line ID: {userDetail.lineId}</p>
                                </div>
                             </div>

                             {/* User Mood Chart */}
                             <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">กราฟอารมณ์ส่วนตัว</p>
                                <div className="h-32 w-full">
                                    <ResponsiveContainer>
                                        <BarChart data={userDetail.moods}>
                                            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                             </div>

                             {/* Recent Chats */}
                             <div>
                                <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider">ประวัติการคุยล่าสุด</p>
                                <div className="space-y-3">
                                    {userDetail.chats.map((chat: any) => (
                                        <div key={chat.id} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                                chat.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                                : 'bg-slate-700 text-slate-200 rounded-tl-none'
                                            }`}>
                                                {chat.message}
                                            </div>
                                        </div>
                                    ))}
                                    {userDetail.chats.length === 0 && <p className="text-slate-600 text-center text-sm py-4">ยังไม่มีประวัติการคุย</p>}
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            <Search size={48} className="mb-4 opacity-50" />
                            <p>เลือกผู้ใช้จากรายการทางซ้ายเพื่อดูรายละเอียด</p>
                        </div>
                    )}
                </div>
             </div>
        </div>

      </main>
    </div>
  );
}

// Helper Component
const StatCard = ({ icon, title, value, color }: any) => (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-slate-700 transition">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
            </div>
            <div className={`p-3 bg-[#0f172a] rounded-lg ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);