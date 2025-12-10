"use client";

import { useState, useEffect } from "react";
import {
    Search, User, Activity, MessageSquare, Calendar,
    ChevronRight, Filter, Download, MoreVertical
} from "lucide-react";

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

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/data');
            const data = await res.json();
            setUsers(data.users || []);
        } catch (e) {
            console.error("Failed to fetch users");
        }
        setLoading(false);
    };

    const filteredUsers = users.filter(u =>
        u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        u.nickname?.toLowerCase().includes(search.toLowerCase()) ||
        u.lineId?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-12 bg-white/5 rounded-xl w-1/3" />
                <div className="h-96 bg-white/5 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Users</h1>
                    <p className="text-slate-400 mt-1">จัดการรายชื่อผู้ใช้งานทั้งหมด</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all">
                        <Filter size={18} />
                        <span className="hidden md:inline">Filter</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="ค้นหาผู้ใช้ด้วยชื่อ หรือ Line ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 transition-all"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User List */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <span className="text-slate-400 text-sm">ผู้ใช้ทั้งหมด: {filteredUsers.length} คน</span>
                    </div>

                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-white/5 ${selectedUser?.id === user.id ? 'bg-teal-500/10 border-l-4 border-l-teal-500' : ''
                                    }`}
                            >
                                <img
                                    src={user.pictureUrl || "https://via.placeholder.com/48"}
                                    className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                                    alt={user.displayName}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-white truncate">{user.displayName}</h4>
                                    <p className="text-sm text-slate-400 truncate">@{user.nickname || 'Unknown'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">
                                        {new Date(user.createdAt).toLocaleDateString('th-TH')}
                                    </p>
                                    <div className="flex gap-2 mt-1 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Activity size={12} /> {user.moods?.length || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare size={12} /> {user.chats?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Detail Panel */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    {selectedUser ? (
                        <div className="space-y-6">
                            {/* Profile */}
                            <div className="text-center">
                                <img
                                    src={selectedUser.pictureUrl || "https://via.placeholder.com/96"}
                                    className="w-24 h-24 rounded-full border-4 border-teal-500/50 mx-auto mb-4 object-cover"
                                    alt={selectedUser.displayName}
                                />
                                <h2 className="text-xl font-bold text-white">{selectedUser.displayName}</h2>
                                <p className="text-teal-400">@{selectedUser.nickname || 'Unknown'}</p>
                                <p className="text-xs text-slate-500 mt-1">Line ID: {selectedUser.lineId}</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <Activity className="w-6 h-6 mx-auto text-teal-400 mb-2" />
                                    <p className="text-2xl font-bold text-white">{selectedUser.moods?.length || 0}</p>
                                    <p className="text-xs text-slate-400">Moods</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <MessageSquare className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                                    <p className="text-2xl font-bold text-white">{selectedUser.chats?.length || 0}</p>
                                    <p className="text-xs text-slate-400">Chats</p>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Moods</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {selectedUser.moods?.slice(0, 5).map((mood: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                            <span className="text-2xl">
                                                {mood.score === 5 ? '😊' : mood.score === 4 ? '😉' : mood.score === 3 ? '😐' : mood.score === 2 ? '😢' : '😠'}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(mood.createdAt).toLocaleDateString('th-TH')}
                                            </span>
                                        </div>
                                    ))}
                                    {(!selectedUser.moods || selectedUser.moods.length === 0) && (
                                        <p className="text-slate-500 text-sm text-center py-4">ไม่มีข้อมูล</p>
                                    )}
                                </div>
                            </div>

                            {/* Join Date */}
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Calendar size={16} />
                                เข้าร่วม: {new Date(selectedUser.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                            <User size={48} className="mb-4 opacity-30" />
                            <p>เลือกผู้ใช้เพื่อดูรายละเอียด</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
