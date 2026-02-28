import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-black text-xl">A</span>
                            </div>
                            <span className="ml-3 text-2xl font-black tracking-tighter">AprendiMoz</span>
                        </Link>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Capacitando moçambicanos com educação de qualidade e acessível, onde quer que estejam.
                        </p>
                        <div className="flex space-x-5">
                            {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-all duration-300">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-5 h-5 bg-gray-400 rounded-sm"></div> {/* Placeholder for icons */}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white">Plataforma</h3>
                        <ul className="space-y-4">
                            <li><Link href="/courses" className="text-gray-400 hover:text-primary-500 transition-colors text-lg">Cursos Online</Link></li>
                            <li><Link href="/instructors" className="text-gray-400 hover:text-primary-500 transition-colors text-lg">Nossos Instrutores</Link></li>
                            <li><Link href="/business" className="text-gray-400 hover:text-primary-500 transition-colors text-lg">AprendiMoz para Empresas</Link></li>
                            <li><Link href="/certificates" className="text-gray-400 hover:text-primary-500 transition-colors text-lg">Verificar Certificado</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white">Suporte</h3>
                        <ul className="space-y-4">
                            <li><Link href="/help" className="text-gray-400 hover:text-primary-500 transition-colors text-lg">Centro de Ajuda</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-primary-500 transition-colors text-lg">Perguntas Frequentes</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-primary-500 transition-colors text-lg">Fale Connosco</Link></li>
                            <li><Link href="/payments" className="text-gray-400 hover:text-primary-500 transition-colors text-lg">Guia de Pagamentos</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white">Newsletter</h3>
                        <p className="text-gray-400 mb-6 text-lg">Receba novidades e ofertas exclusivas no seu email.</p>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Seu melhor email"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder:text-gray-500"
                            />
                            <button className="btn btn-primary w-full">Subscrever</button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-base">
                    <p>© 2024 AprendiMoz. Todos os direitos reservados.</p>
                    <div className="flex space-x-8 mt-6 md:mt-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Termos de Uso</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
