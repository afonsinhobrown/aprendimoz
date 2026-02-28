import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import CourseCard from '../../components/CourseCard';
import { api } from '../../lib/api';
import { Course } from '@shared/types';
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const CATEGORIES = [
    'Todos',
    'Tecnologia',
    'Negócios',
    'Marketing',
    'Design',
    'Finanças',
    'Idiomas',
    'Saúde'
];

const LEVELS = [
    { id: 'all', label: 'Todos os Níveis' },
    { id: 'beginner', label: 'Iniciante' },
    { id: 'intermediate', label: 'Intermédio' },
    { id: 'advanced', label: 'Avançado' }
];

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedLevel, setSelectedLevel] = useState('all');

    useEffect(() => {
        fetchCourses();
    }, [selectedCategory, selectedLevel]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (selectedCategory !== 'Todos') params.category = selectedCategory;
            if (selectedLevel !== 'all') params.level = selectedLevel;
            if (search) params.search = search;

            const response = await api.get('/courses', params);

            // Lógica resiliente para diferentes formatos de resposta
            const result = response.data;
            const coursesData = result.data?.items || result.items || (Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []));

            setCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCourses();
    };

    return (
        <Layout title="Explorar Cursos | AprendiMoz">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-primary-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/80 to-transparent z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-30"
                        alt="Fundo Cursos"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            O que quer <span className="text-yellow-400">aprender</span> hoje?
                        </h1>
                        <p className="text-xl text-primary-100 mb-10 leading-relaxed">
                            Descubra cursos criados por especialistas moçambicanos para transformar a sua carreira e o seu futuro.
                        </p>

                        <form onSubmit={handleSearch} className="relative group max-w-2xl">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Pesquise por tecnologia, gestão, marketing..."
                                className="w-full pl-14 pr-32 py-5 rounded-2xl bg-white shadow-2xl text-lg focus:ring-4 focus:ring-yellow-400/30 outline-none border-none text-gray-900"
                            />
                            <MagnifyingGlassIcon className="h-7 w-7 text-gray-400 absolute left-5 top-5 group-focus-within:text-primary-600 transition-colors" />
                            <button className="absolute right-3 top-3 bottom-3 bg-primary-600 text-white px-8 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg active:scale-95">
                                Procurar
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-72 flex-shrink-0 space-y-10">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                                    <FunnelIcon className="h-6 w-6 mr-2 text-primary-600" />
                                    Filtros
                                </h3>

                                <div className="space-y-8">
                                    {/* Category Filter */}
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Categoria</h4>
                                        <div className="space-y-3">
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${selectedCategory === cat
                                                        ? 'bg-primary-600 text-white font-bold shadow-lg shadow-primary-600/20'
                                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Level Filter */}
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Nível</h4>
                                        <div className="space-y-3">
                                            {LEVELS.map((level) => (
                                                <button
                                                    key={level.id}
                                                    onClick={() => setSelectedLevel(level.id)}
                                                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${selectedLevel === level.id
                                                        ? 'bg-secondary-600 text-white font-bold shadow-lg shadow-secondary-600/20'
                                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                                                        }`}
                                                >
                                                    {level.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Banner in Sidebar */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="text-2xl font-black mb-4 leading-tight">Ganhe 20% de desconto!</h4>
                                    <p className="text-indigo-100 mb-6 font-medium">No seu primeiro curso pago via M-Pesa este mês.</p>
                                    <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl">
                                        Saber mais
                                    </button>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            </div>
                        </aside>

                        {/* Courses Grid */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-gray-900">
                                    {loading ? 'A carregar cursos...' : `${courses.length} Cursos encontrados`}
                                </h2>

                                <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-gray-200">
                                    <span className="text-sm font-bold text-gray-500">Ordenar por:</span>
                                    <select className="bg-transparent border-none focus:ring-0 font-bold text-gray-900 cursor-pointer">
                                        <option>Mais Populares</option>
                                        <option>Mais Recentes</option>
                                        <option>Preço: Menor para Maior</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="course-grid">
                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                        <div key={n} className="bg-gray-200 animate-pulse rounded-2xl h-[500px]"></div>
                                    ))}
                                </div>
                            ) : courses.length > 0 ? (
                                <div className="course-grid">
                                    {courses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-20 text-center shadow-xl border border-dashed border-gray-300">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <MagnifyingGlassIcon className="h-12 w-12 text-gray-300" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-4">Nenhum curso encontrado</h3>
                                    <p className="text-gray-500 text-lg max-w-sm mx-auto">Tente ajustar os seus filtros ou procurar por algo diferente.</p>
                                    <button
                                        onClick={() => { setSelectedCategory('Todos'); setSelectedLevel('all'); setSearch(''); }}
                                        className="mt-8 btn btn-primary px-10"
                                    >
                                        Ver todos os cursos
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    );
}
