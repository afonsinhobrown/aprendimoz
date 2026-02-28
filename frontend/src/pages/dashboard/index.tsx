import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/layout/Sidebar';
import CourseCard from '../../components/CourseCard';
import {
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  BellIcon,
  FireIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/users/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600 mb-4"></div>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">A carregar as tuas conquistas...</span>
        </div>
      </div>
    );
  }

  const { stats, recentCourses, recommendations, progress } = dashboardData || {
    stats: { enrolledCourses: 0, completedCourses: 0, certificates: 0, totalStudyTime: 0 },
    recentCourses: [],
    recommendations: [],
    progress: []
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Head>
        <title>Dashboard | AprendiMoz</title>
      </Head>

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar for Dashboard */}
        <header className="h-24 bg-white/40 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100 flex items-center justify-between px-10">
          <div className="relative group w-96">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar por cursos, aulas ou instrutores..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:scale-110 transition-transform">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center space-x-4 pl-2 cursor-pointer group" onClick={() => router.push('/profile')}>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors">{user?.fullName || (user ? `${user.firstName} ${user.lastName}` : 'Estudante Moz')}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mt-0.5">Nível 5 • Gold</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:rotate-6 transition-transform overflow-hidden font-black text-white text-xl">
                {user?.firstName?.[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-12">
          {/* Hero Welcome Section */}
          <div className="relative bg-primary-900 rounded-[3rem] p-12 overflow-hidden shadow-2xl shadow-primary-900/40">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                  <FireIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-black text-xs uppercase tracking-widest">Streak de 5 dias — Fantástico!</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  Continua de onde <span className="text-yellow-400">paraste</span>, {user?.firstName}!
                </h1>
                <p className="text-primary-100/70 text-lg font-medium max-w-md">
                  Faltam apenas 3 aulas para concluíres "React Avançado para M-Pesa". Tu consegues!
                </p>
                <button
                  onClick={() => recentCourses?.[0] && router.push(`/courses/${recentCourses[0].id}/learn`)}
                  className="btn bg-white text-primary-900 px-10 py-4 text-lg font-black hover:bg-gray-100 shadow-xl shadow-white/5 active:scale-95 transition-all group"
                >
                  Retomar Aula 12
                  <ArrowRightIcon className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="hidden lg:flex justify-end">
                <div className="relative w-80 h-80">
                  {/* Visual Progress Ring Mock */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-white/5" />
                    <circle cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray="880" strokeDashoffset="264" className="text-yellow-400 shadow-xl" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-6xl font-black">70%</span>
                    <span className="text-sm font-bold uppercase tracking-widest opacity-60">Meta Semanal</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative mesh */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-100/10 rounded-full blur-[100px]"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[120px]"></div>
          </div>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Cursos Ativos', val: stats.enrolledCourses, icon: AcademicCapIcon, color: 'text-primary-600', bg: 'bg-primary-50' },
              { label: 'Concluídos', val: stats.completedCourses, icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Certificados', val: stats.certificates, icon: TrophyIcon, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Minutos Lidos', val: stats.totalStudyTime, icon: ClockIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' }
            ].map((stat, idx) => (
              <div key={idx} className="card-premium p-8 flex items-center space-x-6 hover:-translate-y-1 transition-all">
                <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 shadow-inner`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h4 className="text-3xl font-black text-gray-900 leading-none">{stat.val}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Left: Recent Activity & Continue */}
            <div className="xl:col-span-2 space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cursos <span className="text-primary-600">Recentes</span></h2>
                <button onClick={() => router.push('/courses')} className="text-sm font-bold text-primary-600 hover:underline flex items-center">
                  Ver todos <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="course-grid !grid-cols-1 md:!grid-cols-2 gap-8">
                {recentCourses?.length > 0 ? (
                  recentCourses.slice(0, 4).map((course: any) => (
                    <CourseCard key={course.id} course={course} showProgress={true} progress={course.progress || 45} />
                  ))
                ) : (
                  <div className="col-span-2 p-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center flex flex-col items-center">
                    <AcademicCapIcon className="h-16 w-16 text-gray-200 mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ainda não tens cursos inscritos</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">Explora o nosso catálogo e começa a aprender hoje mesmo!</p>
                    <button onClick={() => router.push('/courses')} className="btn btn-primary px-8 py-3">Ir para o Mercado</button>
                  </div>
                )}
              </div>

              {/* AI Discovery Banner */}
              <div className="bg-gradient-to-br from-indigo-500 to-primary-800 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group">
                <div className="relative z-10 flex-1 space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                    <SparklesIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Recomendação AI</span>
                  </div>
                  <h3 className="text-3xl font-black leading-tight">Com base no seu perfil de <span className="text-yellow-400">Web Design</span>, este curso é o seu próximo passo ideal.</h3>
                  <button className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-black text-sm shadow-xl hover:scale-105 transition-transform active:scale-95">Ver Recomendação</button>
                </div>
                <div className="w-full md:w-64 h-48 bg-white/10 rounded-3xl backdrop-blur-md relative overflow-hidden flex items-center justify-center p-4 border border-white/10">
                  <div className="text-center opacity-60">
                    <AcademicCapIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-xs font-bold leading-tight">UI/UX Masterclass for Mozambican Creators</p>
                  </div>
                  <div className="absolute top-0 right-0 p-3">
                    <StarIconSolid className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              </div>
            </div>

            {/* Right: Sidebar Widgets */}
            <aside className="space-y-10">
              <div className="card-premium p-8 bg-white shadow-xl shadow-gray-200/50">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                  <ChartBarIcon className="h-6 w-6 mr-2 text-primary-600" />
                  Atividade Semanal
                </h3>
                {/* Mock Weekly Progress Chart */}
                <div className="flex items-end justify-between h-32 space-x-2 mb-6">
                  {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
                    <div key={i} className="group relative flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 cursor-pointer ${i === 3 ? 'bg-primary-600 shadow-lg shadow-primary-600/30' : 'bg-primary-100 hover:bg-primary-300'}`}
                        style={{ height: `${h}%` }}
                      ></div>
                      <span className="text-[10px] font-bold text-gray-400 mt-2">{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</span>
                      {/* Tooltip */}
                      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded shadow-xl">
                        {h}m
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-primary-50 rounded-2xl flex items-center space-x-4 border border-primary-100">
                  <FireIcon className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm font-black text-gray-900">Estás imparável!</p>
                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Superaste o teu recorde em 20%</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-8">
                <h3 className="text-xl font-black text-gray-900 mb-6">Certificados Brevemente</h3>
                <div className="space-y-6">
                  {[1].map(i => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 relative group overflow-hidden">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                        <TrophyIcon className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 truncate tracking-tight leading-tight">Frontend Moz-Dev Expert</p>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-yellow-500 h-full w-[85%]"></div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                        <span className="text-[10px] font-black text-primary-900 uppercase">Termina este curso para desbloquear!</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
