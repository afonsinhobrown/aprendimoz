import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import {
  PlayIcon,
  AcademicCapIcon,
  UsersIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CursorArrowRaysIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  const [email, setEmail] = useState('');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-100 shadow-sm">
                <SparklesIcon className="h-5 w-5 text-primary-600" />
                <span className="text-primary-700 font-black text-xs uppercase tracking-widest">A Revolução Educativa em Moçambique</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Domine o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">futuro</span> com os melhores especialistas.
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl font-medium">
                Aceda a cursos de classe mundial desenhados para o mercado moçambicano. Do zero ao avançado, com certificados reconhecidos e pagamento instantâneo via M-Pesa.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/courses" className="btn btn-primary px-10 py-5 text-lg shadow-2xl shadow-primary-500/30 group">
                  Explorar Cursos
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/auth/register" className="btn btn-outline px-10 py-5 text-lg bg-white/50 backdrop-blur-sm border-gray-200">
                  Criar Conta Grátis
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Student" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    +10k
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} className="h-4 w-4 text-yellow-500" />)}
                  </div>
                  <span className="text-sm font-bold text-gray-500 mt-1">4.9/5 de satisfação dos alunos</span>
                </div>
              </div>
            </div>

            <div className="relative animate-float hidden lg:block">
              {/* Glassmorphism Floating Cards */}
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt="Estudantes"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
              </div>

              {/* Floating Element 1 - Stats */}
              <div className="absolute -top-10 -right-10 z-20 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 animate-pulse-soft">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-900">8.4k+</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Certificados Emitidos</p>
                  </div>
                </div>
              </div>

              {/* Floating Element 2 - M-Pesa Trust */}
              <div className="absolute -bottom-10 -left-10 z-20 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/M-Pesa_logo.png" className="w-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 text-sm">Pagamento Seguro</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">Via M-Pesa Moz</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary-100/50 blur-[150px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-indigo-100/40 blur-[120px] -z-10 rounded-full"></div>
      </section>

      {/* Trust Logos Section */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-12">Empresas que confiam na nossa formação</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 w-36 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 w-28 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-32 bg-gray-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Educação pensada para <span className="text-primary-600 underline decoration-yellow-400 underline-offset-8">Moçambique</span></h2>
            <p className="text-xl text-gray-600 font-medium">Criamos a plataforma que você precisava para impulsionar a sua carreira no mercado local e global.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: AcademicCapIcon,
                title: 'Conteúdo Localizado',
                desc: 'Cursos adaptados à nossa realidade económica e laboral. Aprenda o que realmente importa aqui.',
                color: 'bg-primary-50 text-primary-600'
              },
              {
                icon: UsersIcon,
                title: 'Instrutores Topo',
                desc: 'Aprenda com os maiores peritos do país em tecnologia, gestão, artes e finanças.',
                color: 'bg-indigo-50 text-indigo-600'
              },
              {
                icon: ShieldCheckIcon,
                title: 'Certificação Oficial',
                desc: 'Todos os cursos conferem um certificado digital verificado com QR Code para o seu CV.',
                color: 'bg-green-50 text-green-600'
              },
              {
                icon: CursorArrowRaysIcon,
                title: 'Aprendizado Prático',
                desc: 'Nada de apenas teoria. Focamos em projetos reais que você pode usar no dia a dia.',
                color: 'bg-yellow-50 text-yellow-600'
              },
              {
                icon: DevicePhoneMobileIcon,
                title: 'Focado em Mobile',
                desc: 'Aprenda no seu telemóvel com interface optimizada. Baixe aulas para ver offline brevemente.',
                color: 'bg-purple-50 text-purple-600'
              },
              {
                icon: PlayIcon,
                title: 'Acesso Vitalício',
                desc: 'Pague uma vez e tenha acesso para sempre. Revise as aulas quando e onde quiser.',
                color: 'bg-red-50 text-red-600'
              }
            ].map((feature, idx) => (
              <div key={idx} className="card-premium group hover:-translate-y-2 transition-all p-10 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-3xl ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* M-Pesa Integration Banner (Visual Proof) */}
      <section className="py-24 bg-primary-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-12 md:p-20 border border-white/10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-yellow-400/20 px-4 py-2 rounded-full border border-yellow-400/30">
                <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Seguro & Confiável</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Pagamento instantâneo via <span className="text-yellow-400">M-Pesa</span></h2>
              <p className="text-xl text-primary-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0">Sem necessidade de cartão de crédito. Use o seu número 84 ou 85 para subscrever cursos em milissegundos.</p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-3 text-white">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckBadgeIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <span className="font-bold">Confirmação Imediata</span>
                </div>
                <div className="flex items-center space-x-3 text-white">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckBadgeIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <span className="font-bold">Zero Taxas extras</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[450px] transform hover:rotate-2 transition-transform duration-700">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-8">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/M-Pesa_logo.png" className="h-10" />
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Digital Payment</div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Telemóvel</label>
                    <div className="w-full h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center px-4 font-black text-gray-800 text-lg tracking-widest">+258 84 000 0000</div>
                  </div>
                  <div className="space-y-2 pb-4 border-b border-gray-100">
                    <div className="flex justify-between text-sm font-bold text-gray-900">
                      <span>Curso de React Pro</span>
                      <span>MZN 1,500</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Taxa de Serviço</span>
                      <span>MZN 0</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-[#ED1C24] text-white font-black rounded-xl text-lg shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all">Pagar via M-Pesa</button>
                </div>
                {/* Decorative mesh inside card */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-all"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[150px] animate-pulse delay-700"></div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h2 className="text-5xl font-black text-gray-900 leading-tight">O que dizem os nossos <span className="text-primary-600">alunos</span></h2>
              <div className="space-y-8">
                <div className="card-premium p-10 bg-gray-50/50 border-none shadow-none hover:bg-white hover:shadow-2xl hover:shadow-primary-100 transition-all">
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} className="h-5 w-5 text-yellow-500" />)}
                  </div>
                  <p className="text-xl text-gray-700 font-medium italic leading-relaxed mb-6">"Consegui o meu primeiro emprego como Desenvolvedor Junior na Vodacom Moçambique depois de completar o percurso de Fullstack aqui. O conteúdo é incrivelmente prático!"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-200 overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=12" alt="Avatar" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg leading-none">César Alberto</h4>
                      <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Fullstack Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-6 scale-110 lg:scale-100 origin-center">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`rounded-3xl overflow-hidden aspect-square shadow-xl group ${i % 2 === 0 ? 'mt-12' : ''}`}>
                    <img
                      src={`https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?q=80&w=1000&auto=format&fit=crop`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                      alt="Student Success"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-indigo-800 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-[0_50px_100px_rgba(37,99,235,0.2)]">
            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <h2 className="text-5xl md:text-7xl font-black leading-tight">Pronto para transformar a sua vida?</h2>
              <p className="text-2xl text-primary-100/80 font-medium">Junte-se a +10,000 moçambicanos que já estão a aprender.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth/register" className="btn bg-white text-primary-900 hover:bg-gray-100 py-6 px-12 text-2xl font-black shadow-2xl">Começar Agora — É Grátis!</Link>
              </div>
              <p className="text-primary-300 font-bold uppercase tracking-widest text-sm italic">Cancele a qualquer momento • Milhares de alunos satisfeitos</p>
            </div>
            {/* Decorative background circles */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

