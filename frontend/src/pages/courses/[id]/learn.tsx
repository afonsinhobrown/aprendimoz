import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
    ChevronLeftIcon,
    Bars3Icon,
    PlayIcon,
    CheckBadgeIcon,
    ChevronRightIcon,
    ChatBubbleLeftRightIcon,
    FolderArrowDownIcon,
    QuestionMarkCircleIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';
import { api } from '../../../lib/api';

export default function LearnPage() {
    const router = useRouter();
    const { id } = router.query;
    const [course, setCourse] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (id) fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await api.get(`/courses/${id}`);
            setCourse(response.data);
            // Set first lesson as active
            if (response.data.modules?.[0]?.lessons?.[0]) {
                setActiveLesson(response.data.modules[0].lessons[0]);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !course) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600 mb-4"></div>
                    <span className="text-white font-bold tracking-widest uppercase text-xs">Preparando a sala de aula...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col h-screen overflow-hidden">
            <Head>
                <title>{activeLesson?.title || 'Aula'} | AprendiMoz Learn</title>
            </Head>

            {/* Modern Player Header */}
            <header className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-30">
                <div className="flex items-center space-x-6">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Link>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">A</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white font-bold text-sm leading-none">{course.title}</h1>
                            <span className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mt-1">M{activeLesson?.moduleId || 1} • {activeLesson?.title}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Seu Progresso</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-32 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary-500 h-full w-[45%]" />
                            </div>
                            <span className="text-white text-xs font-bold">45%</span>
                        </div>
                    </div>

                    <button className="btn btn-outline border-white/10 text-white hover:bg-white/5 py-2 px-4 text-sm hidden sm:flex items-center">
                        <CheckBadgeIcon className="h-4 w-4 mr-2" />
                        Ver Certificado
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f0f]">
                    {/* Video Container */}
                    <div className="relative aspect-video bg-black flex overflow-hidden group">
                        {/* Mock Player */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src={course.thumbnail}
                                className="w-full h-full object-cover opacity-30 grayscale"
                                alt="Lesson Content"
                            />
                            <div className="z-10 bg-primary-600/90 w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] cursor-pointer hover:scale-110 transition-transform">
                                <PlayIcon className="h-10 w-10 text-white ml-1" />
                            </div>
                        </div>

                        {/* Player Controls Overlay (Simulated) */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                            <div className="w-full space-y-4">
                                <div className="h-1 w-full bg-white/20 rounded-full cursor-pointer relative">
                                    <div className="absolute top-0 left-0 h-full w-[30%] bg-primary-500 rounded-full" />
                                </div>
                                <div className="flex items-center justify-between text-white text-xs font-bold">
                                    <div className="flex items-center space-x-6">
                                        <PlayIcon className="h-5 w-5" />
                                        <span>12:45 / 35:20</span>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <span>1.0x</span>
                                        <span>1080p</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Metadata Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2">{activeLesson?.title}</h2>
                                <p className="text-gray-400 font-medium">Lançado em 14 de Março, 2024 • Duração: 35 min</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-white font-bold transition-all border border-white/5">
                                    <BookmarkIcon className="h-5 w-5" />
                                    <span>Guardar Nota</span>
                                </button>
                                <button className="btn btn-primary px-8 py-3.5 shadow-primary-600/20">
                                    Próxima Aula
                                </button>
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div className="space-y-8">
                            <div className="flex space-x-8 border-b border-white/5">
                                {[
                                    { id: 'overview', label: 'Visão Geral', icon: Bars3Icon },
                                    { id: 'resources', label: 'Recursos', icon: FolderArrowDownIcon },
                                    { id: 'qa', label: 'Perguntas', icon: QuestionMarkCircleIcon },
                                    { id: 'notes', label: 'Minhas Notas', icon: ChatBubbleLeftRightIcon }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`pb-4 px-2 flex items-center space-x-2 font-bold transition-all border-b-2 ${activeTab === tab.id
                                                ? 'border-primary-600 text-primary-500'
                                                : 'border-transparent text-gray-500 hover:text-white'
                                            }`}
                                    >
                                        <tab.icon className="h-5 w-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="max-w-4xl text-gray-300 leading-relaxed space-y-6">
                                {activeTab === 'overview' && (
                                    <div className="animate-fade-in space-y-6">
                                        <p className="text-lg">Nesta aula, vamos mergulhar nos fundamentos do React e como ele revolucionou a forma como criamos interfaces web modernas. Vamos cobrir o ciclo de vida dos componentes e a importância do Virtual DOM.</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <h4 className="text-white font-bold mb-2">Objetivos</h4>
                                                <ul className="text-sm space-y-2 text-gray-400">
                                                    <li>• Compreender Props vs State</li>
                                                    <li>• Configurar o ambiente de desenvolvimento</li>
                                                    <li>• Criar seu primeiro componente funcional</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'resources' && <div className="animate-fade-in text-gray-500">Nenhum recurso anexado a esta aula.</div>}
                                {activeTab === 'qa' && <div className="animate-fade-in text-gray-500">Seja o primeiro a perguntar algo!</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Syllabus Sidebar */}
                <aside className={`${sidebarOpen ? 'w-[400px]' : 'w-0'} bg-gray-900 border-l border-white/5 flex flex-col transition-all duration-300 overflow-hidden hidden xl:flex shrink-0`}>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-black text-white text-lg">Conteúdo do Curso</h3>
                        <span className="text-xs font-bold text-gray-500 uppercase">12/35 Concluído</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-2">
                        {course.modules?.map((module: any, mIdx: number) => (
                            <div key={module.id} className="mb-2">
                                <button className="w-full text-left p-4 hover:bg-white/5 rounded-2xl transition-all group flex items-start justify-between">
                                    <div className="flex-1">
                                        <span className="text-[10px] text-primary-500 font-black uppercase tracking-widest">Módulo {mIdx + 1}</span>
                                        <h4 className="text-white font-bold text-sm leading-tight mt-1">{module.title}</h4>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-600 mt-1" />
                                </button>

                                <div className="mt-1 space-y-1">
                                    {module.lessons?.map((lesson: any, lIdx: number) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`w-full text-left px-6 py-4 rounded-xl transition-all flex items-center space-x-4 ${activeLesson?.id === lesson.id
                                                    ? 'bg-primary-600/20 border border-primary-600/30'
                                                    : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeLesson?.id === lesson.id ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-500'
                                                }`}>
                                                <span className="text-xs font-black">{lIdx + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[13px] font-bold text-white truncate">{lesson.title}</div>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <PlayIcon className="h-3 w-3 text-gray-600" />
                                                    <span className="text-[10px] text-gray-600 font-bold uppercase">{lesson.duration || '15:00'}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
