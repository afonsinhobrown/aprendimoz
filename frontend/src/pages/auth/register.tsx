import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  AcademicCapIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../../../shared/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: UserRole.ALUNO,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'Nome é obrigatório';
    if (!formData.lastName) newErrors.lastName = 'Apelido é obrigatório';
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone) newErrors.phone = 'Telemóvel é obrigatório';
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(formData);
      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <>
      <Head>
        <title>Criar Conta | AprendiMoz</title>
      </Head>

      <div className="min-h-screen flex bg-white overflow-hidden">
        {/* Left Side: Visual/Content */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="Estudantes"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent z-1"></div>
          
          <div className="relative z-10 w-full flex flex-col justify-center px-16 xl:px-24">
            <div className="flex items-center mb-12">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-primary-600 font-black text-2xl">A</span>
              </div>
              <span className="ml-4 text-3xl font-black text-white tracking-tight">AprendiMoz</span>
            </div>
            
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-8">
              Transforme o seu <span className="text-yellow-400">futuro</span> hoje.
            </h1>
            
            <p className="text-xl text-primary-100 mb-12 max-w-lg">
              Junte-se a maior comunidade de aprendizado online em Moçambique e acelere a sua carreira com certificados reconhecidos.
            </p>
            
            <ul className="space-y-6">
              {[
                { icon: AcademicCapIcon, text: 'Acesse mais de 500 cursos exclusivos' },
                { icon: CheckBadgeIcon, text: 'Certificados verificados com QR Code' },
                { icon: UserIcon, text: 'Aprenda com instrutores moçambicanos de topo' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-white">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center mr-4">
                    <item.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-lg font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="absolute bottom-12 left-16 right-16 z-10">
            <div className="flex items-center space-x-4 text-primary-200">
              <p className="text-sm">Ao registar-se, concorda com os nossos <Link href="#" className="text-white hover:underline">Termos</Link> e <Link href="#" className="text-white hover:underline">Privacidade</Link>.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-8 sm:px-12 lg:px-16 xl:px-24 bg-mesh">
          <div className="max-w-md mx-auto w-full">
            <div className="lg:hidden flex items-center mb-8">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">AprendiMoz</span>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Comece a aprender</h2>
            <p className="text-gray-500 mb-8">Crie sua conta gratuita em poucos segundos.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Nome</label>
                  <div className="relative">
                    <input 
                      name="firstName"
                      type="text"
                      className={`input-premium ${errors.firstName ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="Ex: João"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.firstName && <p className="text-xs text-red-500 font-medium">{errors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Apelido</label>
                  <input 
                    name="lastName"
                    type="text"
                    className={`input-premium ${errors.lastName ? 'border-red-500 bg-red-50' : ''}`}
                    placeholder="Ex: Mateus"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 font-medium">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email Corporativo ou Pessoal</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </span>
                  <input 
                    name="email"
                    type="email"
                    className={`input-premium pl-11 ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                    placeholder="exemplo@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Telemóvel (M-Pesa)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </span>
                  <input 
                    name="phone"
                    type="tel"
                    className={`input-premium pl-11 ${errors.phone ? 'border-red-500 bg-red-50' : ''}`}
                    placeholder="84/85XXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Senha</label>
                <div className="relative">
                  <input 
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`input-premium ${errors.password ? 'border-red-500 bg-red-50' : ''}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Confirmar Senha</label>
                <input 
                  name="confirmPassword"
                  type="password"
                  className={`input-premium ${errors.confirmPassword ? 'border-red-500 bg-red-50' : ''}`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-4 text-lg focus:outline-none"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : 'Criar Conta'}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500 font-medium">Já tem uma conta?</span>
                </div>
              </div>

              <Link 
                href="/auth/login"
                className="btn btn-outline w-full py-4 text-lg"
              >
                Fazer Login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
