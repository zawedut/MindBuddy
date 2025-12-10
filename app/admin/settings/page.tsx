"use client";

import { useState } from "react";
import {
    Settings, User, Bell, Shield, Database, Palette,
    Save, Eye, EyeOff, Check, AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);

    // Mock settings state
    const [settings, setSettings] = useState({
        adminName: 'Admin',
        email: 'admin@mindbuddy.com',
        currentPassword: '',
        newPassword: '',
        notifications: true,
        emailAlerts: true,
        darkMode: true,
        language: 'th',
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'security', icon: Shield, label: 'Security' },
        { id: 'appearance', icon: Palette, label: 'Appearance' },
        { id: 'database', icon: Database, label: 'Database' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-slate-400 mt-1">จัดการการตั้งค่าระบบ Admin Dashboard</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs */}
                <div className="w-full lg:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/30'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">Profile Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Admin Name</label>
                                    <input
                                        type="text"
                                        value={settings.adminName}
                                        onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">Notification Settings</h2>

                            <div className="space-y-4">
                                <ToggleOption
                                    label="Push Notifications"
                                    description="รับการแจ้งเตือนเมื่อมีกิจกรรมใหม่"
                                    checked={settings.notifications}
                                    onChange={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                />
                                <ToggleOption
                                    label="Email Alerts"
                                    description="รับอีเมลเมื่อมีเหตุการณ์สำคัญ"
                                    checked={settings.emailAlerts}
                                    onChange={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">Security Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={settings.currentPassword}
                                            onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pr-12 text-white focus:outline-none focus:border-teal-500/50"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={settings.newPassword}
                                        onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500/50"
                                    />
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3">
                                <AlertTriangle className="text-amber-400 shrink-0" size={20} />
                                <p className="text-sm text-amber-200">
                                    การเปลี่ยนรหัสผ่านจะมีผลทันที คุณจะต้อง Login ใหม่หลังจากบันทึก
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">Appearance Settings</h2>

                            <div className="space-y-4">
                                <ToggleOption
                                    label="Dark Mode"
                                    description="ใช้ธีมสีเข้มสำหรับ Dashboard"
                                    checked={settings.darkMode}
                                    onChange={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                                />

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Language</label>
                                    <select
                                        value={settings.language}
                                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500/50"
                                    >
                                        <option value="th" className="bg-slate-900">ไทย</option>
                                        <option value="en" className="bg-slate-900">English</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Database Tab */}
                    {activeTab === 'database' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">Database Info</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard label="Provider" value="PostgreSQL" />
                                <InfoCard label="Status" value="Connected" status="success" />
                                <InfoCard label="Host" value="Supabase" />
                                <InfoCard label="Schema" value="public" />
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-medium text-white mb-3">Tables</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-400">
                                        <span>User</span><span className="text-teal-400">Active</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>MoodLog</span><span className="text-teal-400">Active</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>ChatHistory</span><span className="text-teal-400">Active</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Admin</span><span className="text-teal-400">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${saved
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40'
                                }`}
                        >
                            {saved ? <Check size={20} /> : <Save size={20} />}
                            {saved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Toggle Option Component
const ToggleOption = ({ label, description, checked, onChange }: any) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div>
            <p className="text-white font-medium">{label}</p>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
        <button
            onClick={onChange}
            className={`w-12 h-6 rounded-full transition-all ${checked ? 'bg-teal-500' : 'bg-slate-600'}`}
        >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
    </div>
);

// Info Card Component
const InfoCard = ({ label, value, status }: any) => (
    <div className="bg-white/5 p-4 rounded-xl">
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p className={`font-medium ${status === 'success' ? 'text-green-400' : 'text-white'}`}>{value}</p>
    </div>
);
