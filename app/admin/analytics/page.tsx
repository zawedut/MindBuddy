"use client";

import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
    TrendingUp, TrendingDown, Users, Activity, MessageSquare,
    Calendar, ArrowUpRight, ArrowDownRight
} from "lucide-react";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/admin/data?range=${timeRange}`);
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error("Failed to fetch");
        }
        setLoading(false);
    };

    if (loading || !data) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-12 bg-white/5 rounded-xl w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-white/5 rounded-2xl" />
                    <div className="h-80 bg-white/5 rounded-2xl" />
                </div>
            </div>
        );
    }

    const timeOptions = [
        { value: '7d', label: '7 วัน' },
        { value: '30d', label: '30 วัน' },
        { value: 'all', label: 'ทั้งหมด' },
    ];

    // Calculate average mood
    const avgMood = data.charts.dailyMoods.length > 0
        ? (data.charts.dailyMoods.reduce((acc: number, d: any) => acc + d.avgScore, 0) / data.charts.dailyMoods.length).toFixed(2)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics</h1>
                    <p className="text-slate-400 mt-1">วิเคราะห์ข้อมูลการใช้งาน MindBuddy</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl">
                    {timeOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setTimeRange(opt.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === opt.value
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={data.stats.totalUsers}
                    change={12}
                    positive
                    color="from-blue-500 to-indigo-500"
                />
                <StatCard
                    icon={Activity}
                    label="Mood Logs"
                    value={data.stats.totalMoods}
                    change={8}
                    positive
                    color="from-teal-500 to-cyan-500"
                />
                <StatCard
                    icon={MessageSquare}
                    label="AI Chats"
                    value={data.stats.totalChats}
                    change={-5}
                    positive={false}
                    color="from-purple-500 to-pink-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Avg Mood Score"
                    value={avgMood}
                    suffix="/5"
                    color="from-orange-500 to-amber-500"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mood Trend */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full" />
                        Mood Trend Over Time
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts.dailyMoods}>
                                <defs>
                                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => v.slice(5)} />
                                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 5]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Area type="monotone" dataKey="avgScore" stroke="#14b8a6" strokeWidth={2} fill="url(#moodGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mood Distribution */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
                        Mood Distribution
                    </h3>
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.charts.moodDistribution}
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {data.charts.moodDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {data.charts.moodDistribution.map((item: any) => (
                            <div key={item.name} className="flex items-center gap-2 text-xs text-slate-400">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.name} ({item.value})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Activity Bar Chart */}
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full" />
                    Daily Mood Logs
                </h3>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.charts.dailyMoods}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => v.slice(5)} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, positive, suffix, color }: any) => (
    <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            {typeof change === 'number' && (
                <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
                    {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(change)}%
                </div>
            )}
        </div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix && <span className="text-sm text-slate-400 font-normal">{suffix}</span>}
        </p>
    </div>
);
