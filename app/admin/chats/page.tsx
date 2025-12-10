"use client";

import { useState, useEffect, useRef } from "react";
import {
    Search, MessageSquare, Sparkles, ChevronLeft, User
} from "lucide-react";

interface UserData {
    id: string;
    displayName: string;
    pictureUrl: string;
    nickname: string;
    chats: any[];
}

export default function ChatsPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedUser]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/data');
            const data = await res.json();
            // Filter users who have chats
            setUsers(data.users?.filter((u: UserData) => u.chats?.length > 0) || []);
        } catch (e) {
            console.error("Failed to fetch");
        }
        setLoading(false);
    };

    const filteredUsers = users.filter(u =>
        u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        u.nickname?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-12 bg-white/5 rounded-xl w-1/3" />
                <div className="h-[600px] bg-white/5 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Chat History</h1>
                <p className="text-slate-400 mt-1">ดูประวัติการสนทนาของผู้ใช้กับ AI</p>
            </div>

            {/* Chat Interface */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-[calc(100vh-220px)] flex">
                {/* Contact List */}
                <div className={`w-full md:w-80 border-r border-white/10 flex flex-col ${selectedUser ? 'hidden md:flex' : ''}`}>
                    {/* Search */}
                    <div className="p-4 border-b border-white/10">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาการสนทนา..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 text-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Contact List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-slate-500">
                                <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">ไม่มีประวัติการสนทนา</p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-b border-white/5 hover:bg-white/5 ${selectedUser?.id === user.id ? 'bg-teal-500/10' : ''
                                        }`}
                                >
                                    <img
                                        src={user.pictureUrl || "https://via.placeholder.com/40"}
                                        className="w-10 h-10 rounded-full border border-white/20 object-cover"
                                        alt={user.displayName}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-white text-sm truncate">{user.displayName}</h4>
                                        <p className="text-xs text-slate-500 truncate">
                                            {user.chats?.[0]?.message?.slice(0, 30)}...
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-0.5 rounded-full">
                                            {user.chats?.length}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col ${!selectedUser ? 'hidden md:flex' : ''}`}>
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="md:hidden p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <img
                                    src={selectedUser.pictureUrl || "https://via.placeholder.com/40"}
                                    className="w-10 h-10 rounded-full border-2 border-teal-500 object-cover"
                                    alt={selectedUser.displayName}
                                />
                                <div>
                                    <h3 className="font-medium text-white">{selectedUser.displayName}</h3>
                                    <p className="text-xs text-slate-400">@{selectedUser.nickname || 'Unknown'}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedUser.chats?.slice().reverse().map((chat: any, i: number) => (
                                    <div
                                        key={i}
                                        className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[75%] ${chat.role === 'user' ? '' : ''}`}>
                                            <div className={`px-4 py-3 rounded-2xl text-sm ${chat.role === 'user'
                                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-tr-sm'
                                                    : 'bg-white/10 text-slate-200 rounded-tl-sm'
                                                }`}>
                                                {chat.role === 'assistant' && (
                                                    <div className="flex items-center gap-1 text-xs text-teal-400 mb-1">
                                                        <Sparkles size={12} /> MindBuddy AI
                                                    </div>
                                                )}
                                                {chat.message}
                                            </div>
                                            <p className={`text-xs text-slate-500 mt-1 ${chat.role === 'user' ? 'text-right' : ''}`}>
                                                {new Date(chat.createdAt).toLocaleString('th-TH')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <MessageSquare size={64} className="mb-4 opacity-20" />
                            <p className="text-lg">เลือกการสนทนาเพื่อดูข้อความ</p>
                            <p className="text-sm mt-1">Chat history will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
