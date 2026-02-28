import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { api } from '../../lib/api';
import {
    CheckCircleIcon,
    PlayIcon,
    ClockIcon,
    StarIcon,
    AcademicCapIcon,
    GlobeAltIcon,
    DocumentArrowDownIcon,
    ShieldCheckIcon,
    ChevronDownIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function CourseDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [expandedModules, setExpandedModules] = useState<string[]>([]);

    useEffect(() => {
        if (id) fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await api.get(`/courses/${id}`);
            setCourse(response.data);
            if (response.data?.modules?.[0]) {
                setExpandedModules([response.data.modules[0].id]);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(m => m !== moduleId)
                : [...prev, moduleId]
        );
    };

    if (loading || !course) {
        return (
            <Layout showFooter={false}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                </div>
            </Layout>
        );
    }

    const TABS = [
        { id: 'about', label: 'Sobre o Curso' },
        { id: 'syllabus', label: 'Conteúdo Programático' },
        { id: 'instructor', label: 'Instrutor' },
        { id: 'reviews', label: 'Avaliações' }
    ];

    return (
        <Layout title={`${course.title} | AprendiMoz`}>
            {/* Hero Header */}
            <section className="bg-gray-900 pt-32 pb-48 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <nav className="flex mb-6 space-x-2 text-sm text-primary-300 font-bold tracking-widest uppercase">
                            <Link href="/courses">Cursos</Link>
                            <span>/</span>
                            <span className="text-white">{course.category}</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                            {course.title}
                        </h1>

                        <p className="text-xl text-gray-400 mb-8 leading-relaxed line-clamp-3">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mb-10">
                            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                                <StarIconSolid className="h-5 w-5 text-yellow-500" />
                                <span className="font-bold text-lg">{course.rating.toFixed(1)}</span>
                                <span className="text-gray-400">({course.reviewCount || 0} Ratings)</span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-300">
                                <AcademicCapIcon className="h-6 w-6" />
                                <span className="font-semibold">{course.enrollmentCount} Alunos Inscritos</span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-300">
                                <GlobeAltIcon className="h-6 w-6" />
                                <span className="font-semibold">Português (MZ)</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center font-black text-xl shadow-xl">
                                {course.instructor?.firstName?.[0]}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400 uppercase tracking-tighter font-bold">Criado por</span>
                                <span className="text-lg font-bold hover:text-primary-400 cursor-pointer">
                                    {course.instructor?.firstName} {course.instructor?.lastName}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="bg-gray-50 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 -mt-32">

                        {/* Left Content (Details) */}
                        <div className="flex-1 space-y-12">
                            {/* Modern Tabs */}
                            <div className="bg-white rounded-3xl p-4 shadow-xl shadow-gray-200/50 flex space-x-2">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all ${activeTab === tab.id
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Panels */}
                            <div className="bg-white rounded-[2rem] p-10 shadow-xl shadow-gray-200/30 border border-gray-100">
                                {activeTab === 'about' && (
                                    <div className="animate-fade-in space-y-10">
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 mb-6">O que vais aprender</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {course.outcomes?.map((outcome: string, idx: number) => (
                                                    <div key={idx} className="flex items-start space-x-3 group">
                                                        <CheckCircleIcon className="h-6 w-6 text-primary-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                        <span className="text-gray-700 text-lg leading-snug">{outcome}</span>
                                                    </div>
                                                )) || (
                                                        <>
                                                            <div className="flex items-start space-x-3">
                                                                <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                                                                <span className="text-gray-700 text-lg">Fundamentos sólidos e práticos do tema.</span>
                                                            </div>
                                                            <div className="flex items-start space-x-3">
                                                                <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                                                                <span className="text-gray-700 text-lg">Projetos reais aplicáveis ao mercado local.</span>
                                                            </div>
                                                        </>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="prose prose-lg max-w-none text-gray-700">
                                            <h2 className="text-2xl font-black text-gray-900">Descrição Detalhada</h2>
                                            <p>{course.longDescription || course.description}</p>
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 mb-6">Requisitos</h2>
                                            <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg ml-2">
                                                <li>Fome de aprender e evoluir.</li>
                                                <li>Acesso básico à internet para vídeos.</li>
                                                <li>Nenhum conhecimento prévio obrigatório (excepto se especificado).</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'syllabus' && (
                                    <div className="animate-fade-in">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-3xl font-black text-gray-900">Currículo do Curso</h2>
                                            <div className="text-gray-500 font-bold">
                                                {course.modules?.length} Módulos • {course.totalLessons || 0} Aulas
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {course.modules?.map((module: any) => (
                                                <div key={module.id} className="border-2 border-gray-100 rounded-[1.5rem] overflow-hidden transition-all">
                                                    <button
                                                        onClick={() => toggleModule(module.id)}
                                                        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <ChevronDownIcon className={`h-5 w-5 text-primary-600 transition-transform duration-300 ${expandedModules.includes(module.id) ? 'rotate-180' : ''}`} />
                                                            <h3 className="text-xl font-bold text-gray-800">{module.title}</h3>
                                                        </div>
                                                        <div className="text-sm font-bold text-gray-400">
                                                            {module.lessons?.length || 0} aulas
                                                        </div>
                                                    </button>

                                                    {expandedModules.includes(module.id) && (
                                                        <div className="p-4 bg-gray-50/50 space-y-2">
                                                            {module.lessons?.map((lesson: any) => (
                                                                <div key={lesson.id} className="flex items-center justify-between px-6 py-4 bg-white rounded-xl border border-gray-100 group hover:border-primary-200 transition-all">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                                                            <PlayIcon className="h-4 w-4 text-primary-600 group-hover:text-white" />
                                                                        </div>
                                                                        <span className="font-semibold text-gray-700">{lesson.title}</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-3">
                                                                        {lesson.isPreview && <span className="text-xs font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-widest">Grátis</span>}
                                                                        <span className="text-sm font-medium text-gray-400">{lesson.duration || '5:00'}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'instructor' && (
                                    <div className="animate-fade-in flex flex-col md:flex-row gap-10 items-start">
                                        <div className="w-full md:w-1/3 flex flex-col items-center">
                                            <div className="w-48 h-48 rounded-[2rem] bg-gradient-to-br from-primary-600 to-indigo-800 shadow-2xl overflow-hidden p-1 mb-6">
                                                <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={course.instructor?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"}
                                                        className="w-full h-full object-cover"
                                                        alt="Instrutor"
                                                    />
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900">{course.instructor?.firstName} {course.instructor?.lastName}</h3>
                                            <p className="text-primary-600 font-bold mb-4 uppercase tracking-widest text-sm">Instructor Master</p>

                                            <div className="flex space-x-4">
                                                <div className="text-center">
                                                    <p className="text-2xl font-black text-gray-900">4.8</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Rating</p>
                                                </div>
                                                <div className="w-px h-10 bg-gray-200 self-center"></div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-black text-gray-900">12k</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Alunos</p>
                                                </div>
                                                <div className="w-px h-10 bg-gray-200 self-center"></div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-black text-gray-900">15</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Cursos</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6">
                                            <h3 className="text-2xl font-black text-gray-900">Biografia</h3>
                                            <div className="prose prose-lg text-gray-700">
                                                <p>{course.instructor?.bio || "Instrutor experiente focado em capacitar a próxima geração de talentos em Moçambique com as habilidades mais procuradas no mercado mundial."}</p>
                                            </div>
                                            <button className="btn btn-outline border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white">Ver perfil completo</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar (Pricing/Purchase Sticky Card) */}
                        <aside className="w-full lg:w-[420px] lg:flex-shrink-0">
                            <div className="sticky top-28 space-y-6">
                                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary-900/10 border border-white overflow-hidden p-4">
                                    {/* Video Preview Aspect */}
                                    <div className="relative group aspect-video rounded-3xl overflow-hidden bg-gray-900 mb-8 border border-white/10">
                                        <img
                                            src={course.thumbnail}
                                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                                            alt="Preview"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-2xl animate-float group-hover:scale-125 transition-transform duration-300">
                                                <PlayIcon className="h-10 w-10 text-white ml-2" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-white text-sm drop-shadow-lg">Assistir Intro do Curso</div>
                                    </div>

                                    <div className="px-6 pb-8 space-y-8">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-5xl font-black text-gray-900">{course.formattedPrice || `MZN ${course.price.toLocaleString()}`}</span>
                                                {course.oldPrice && <span className="text-xl text-gray-400 line-through">MZN {course.oldPrice.toLocaleString()}</span>}
                                            </div>
                                            <p className="text-green-600 font-black flex items-center animate-pulse-soft">
                                                <ClockIcon className="h-5 w-5 mr-1" />
                                                85% de desconto termina em 5 horas!
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <button className="btn btn-primary w-full py-5 text-xl shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                                                Começar agora
                                            </button>
                                            <button className="btn btn-outline w-full py-5 text-xl">
                                                Adicionar ao Carrinho
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-900 text-lg">Este curso inclui:</h4>
                                            <ul className="space-y-3">
                                                <li className="flex items-center text-gray-600 font-medium">
                                                    <PlayIcon className="h-5 w-5 text-primary-600 mr-3" />
                                                    {course.totalHours || '15'} horas de vídeo a pedido
                                                </li>
                                                <li className="flex items-center text-gray-600 font-medium">
                                                    <DocumentArrowDownIcon className="h-5 w-5 text-primary-600 mr-3" />
                                                    24 recursos descarregáveis
                                                </li>
                                                <li className="flex items-center text-gray-600 font-medium">
                                                    <AcademicCapIcon className="h-5 w-5 text-primary-600 mr-3" />
                                                    Certificado de conclusão reconhecido
                                                </li>
                                                <li className="flex items-center text-gray-600 font-medium">
                                                    <ShieldCheckIcon className="h-5 w-5 text-primary-600 mr-3" />
                                                    Acesso vitalício ilimitado
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Payment Support */}
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pago Com</span>
                                            </div>
                                            <div className="flex items-center space-x-4 grayscale opacity-70">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/M-Pesa_logo.png" className="h-6" alt="M-Pesa" />
                                                <span className="w-px h-4 bg-gray-300"></span>
                                                <div className="flex items-center font-bold text-gray-400">Cartão Bancário</div>
                                            </div>
                                            <div className="mt-4 flex items-center text-xs text-gray-400 font-medium italic">
                                                <ShieldCheckIcon className="h-4 w-4 mr-1 text-green-500" />
                                                Transação encriptada e segura via M-Pesa.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary motivation card */}
                                <div className="bg-gradient-to-br from-primary-600 to-indigo-800 rounded-[2rem] p-8 text-white shadow-xl">
                                    <h4 className="text-xl font-black mb-4 leading-tight">Para Empresas</h4>
                                    <p className="text-primary-100 mb-6 font-medium">Treine a sua equipa com este curso. Planos corporativos disponíveis.</p>
                                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 border-dotted">
                                        Contactar Vendas
                                    </button>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-4xl font-black text-gray-900">Alunos também <span className="text-primary-600">viram</span></h2>
                        <Link href="/courses" className="text-primary-600 font-bold hover:underline">Ver todos</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Mock related courses */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-gray-100 rounded-[2rem] h-96"></div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}

import Link from 'next/link';
