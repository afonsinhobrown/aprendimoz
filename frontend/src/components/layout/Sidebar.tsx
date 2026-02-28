import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    HomeIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    TrophyIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon,
    ChartBarIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
    const router = useRouter();
    const { logout } = useAuth();

    const menuItems = [
        { icon: HomeIcon, label: 'Início', path: '/dashboard' },
        { icon: AcademicCapIcon, label: 'Meus Cursos', path: '/dashboard/my-courses' },
        { icon: BookmarkIcon, label: 'Guardados', path: '/dashboard/saved' },
        { icon: TrophyIcon, label: 'Certificados', path: '/dashboard/certificates' },
        { icon: ChartBarIcon, label: 'Desempenho', path: '/dashboard/stats' },
        { icon: ChatBubbleLeftRightIcon, label: 'AI Tutor', path: '/dashboard/tutor' },
    ];

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shrink-0">
            <div className="p-8 pb-12 flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20 transition-transform hover:rotate-6">
                    <span className="text-white font-black text-xl">A</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-gray-900">AprendiMoz</span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.path}
                        className={`flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group ${router.pathname === item.path
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20 translate-x-1'
                                : 'text-gray-500 hover:bg-primary-50 hover:text-primary-600'
                            }`}
                    >
                        <item.icon className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-base tracking-tight">{item.label}</span>
                    </Link>
                ))}

                <div className="pt-10 pb-4 px-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Preferências</span>
                </div>

                <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                    <Cog6ToothIcon className="h-6 w-6" />
                    <span className="text-base tracking-tight">Definições</span>
                </Link>

                <Link
                    href="/help"
                    className="flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                    <QuestionMarkCircleIcon className="h-6 w-6" />
                    <span className="text-base tracking-tight">Ajuda</span>
                </Link>
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white mb-4 relative overflow-hidden group shadow-xl">
                    <div className="relative z-10">
                        <h4 className="font-black text-sm mb-1">PRO Membership</h4>
                        <p className="text-[10px] text-indigo-100 font-bold mb-4 uppercase">Ganhe cursos ilimitados</p>
                        <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-transform">UPGRADE</button>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
                >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                    <span className="text-base tracking-tight">Sair da Conta</span>
                </button>
            </div>
        </aside>
    );
}
