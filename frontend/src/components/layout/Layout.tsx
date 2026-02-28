import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    showFooter?: boolean;
}

export default function Layout({
    children,
    title = 'AprendiMoz - Educação Online Moçambicana',
    description = 'Aprenda com os melhores instrutores de Moçambique. Cursos online, certificados reconhecidos e aprendizado flexível.',
    showFooter = true
}: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <main className="flex-grow">
                {children}
            </main>

            {showFooter && <Footer />}
        </div>
    );
}
