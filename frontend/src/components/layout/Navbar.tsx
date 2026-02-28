import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-black text-xl">A</span>
                        </div>
                        <span className={`ml-3 text-2xl font-black tracking-tighter ${isScrolled ? 'text-gray-900' : 'text-gray-900 lg:text-white'
                            }`}>
                            AprendiMoz
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link href="/courses" className={`font-semibold hover:text-primary-600 transition-colors ${isScrolled ? 'text-gray-600' : 'text-gray-700 lg:text-white/90'
                            }`}>
                            Cursos
                        </Link>
                        <Link href="/instructors" className={`font-semibold hover:text-primary-600 transition-colors ${isScrolled ? 'text-gray-600' : 'text-gray-700 lg:text-white/90'
                            }`}>
                            Instrutores
                        </Link>
                        <Link href="/certificates" className={`font-semibold hover:text-primary-600 transition-colors ${isScrolled ? 'text-gray-600' : 'text-gray-700 lg:text-white/90'
                            }`}>
                            Certificados
                        </Link>
                    </div>

                    {/* Search & Actions */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="O que quer aprender?"
                                className={`pl-10 pr-4 py-2 rounded-full border focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none w-64 transition-all ${isScrolled ? 'bg-gray-50 border-gray-200' : 'bg-white/10 border-white/20 text-white placeholder-white/60'
                                    }`}
                            />
                            <MagnifyingGlassIcon className={`absolute left-3 top-2.5 h-5 w-5 ${isScrolled ? 'text-gray-400' : 'text-white/60'
                                }`} />
                        </div>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard" className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isScrolled ? 'text-gray-600' : 'text-white'
                                    }`}>
                                    <UserCircleIcon className="h-7 w-7" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline py-2 border-primary-500 text-primary-600 hover:bg-primary-600 hover:text-white"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/auth/login" className={`font-bold ${isScrolled ? 'text-gray-700' : 'text-white'
                                    }`}>
                                    Entrar
                                </Link>
                                <Link href="/auth/register" className="btn btn-primary py-2 shadow-none">
                                    Registar
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-md ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                        >
                            {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden animate-fade-in bg-white border-b shadow-2xl">
                    <div className="px-4 pt-4 pb-8 space-y-4">
                        <Link href="/courses" className="block text-xl font-bold text-gray-900 border-b pb-2">Cursos</Link>
                        <Link href="/instructors" className="block text-xl font-bold text-gray-900 border-b pb-2">Instrutores</Link>
                        <Link href="/certificates" className="block text-xl font-bold text-gray-900 border-b pb-2">Certificados</Link>
                        <div className="pt-4 flex flex-col space-y-4">
                            <Link href="/auth/login" className="btn btn-outline py-3 text-center">Entrar</Link>
                            <Link href="/auth/register" className="btn btn-primary py-3 text-center">Registar-se Gratuitamente</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
