import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Module } from '../modules/courses/entities/module.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { Enrollment } from '../modules/courses/entities/enrollment.entity';
import { Payment } from '../modules/payments/entities/payment.entity';
import { Certificate } from '../modules/certificates/entities/certificate.entity';
import { UserRole, UserStatus, CourseLevel, CourseStatus, LessonType, EnrollmentStatus } from '@shared/types';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import * as fs from 'fs';
import * as path from 'path';

async function seed() {
    // Carregar .env manualmente para garantir que funciona sem dependências extras
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            envContent.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    process.env[key.trim()] = valueParts.join('=').trim();
                }
            });
        }
    } catch (err) {
        console.warn('⚠️ Não foi possível carregar o ficheiro .env manualmente:', err.message);
    }

    const isPostgres = process.env.DB_TYPE === 'postgres';

    const dbConfig: any = {
        type: isPostgres ? 'postgres' : 'sqlite',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: isPostgres ? process.env.DB_DATABASE : 'aprendimoz.sqlite',
        entities: [User, Course, Module, Lesson, Enrollment, Payment, Certificate],
        synchronize: true,
        dropSchema: isPostgres, // Limpar tudo no Supabase para evitar conflitos com o script SQL anterior
        logging: true,
    };

    if (isPostgres) {
        dbConfig.ssl = { rejectUnauthorized: false };
    }

    const AppDataSource = new DataSource(dbConfig);

    await AppDataSource.initialize();
    console.log('🚀 Base de dados conectada para seeding...');

    const userRepository = AppDataSource.getRepository(User);
    const courseRepository = AppDataSource.getRepository(Course);
    const moduleRepository = AppDataSource.getRepository(Module);
    const lessonRepository = AppDataSource.getRepository(Lesson);
    const enrollmentRepository = AppDataSource.getRepository(Enrollment);

    // Limpar tabelas em ordem (filhos primeiro por causa das Foreign Keys)
    await AppDataSource.getRepository(Enrollment).clear();
    await AppDataSource.getRepository(Payment).clear();
    await AppDataSource.getRepository(Certificate).clear();
    await lessonRepository.clear();
    await moduleRepository.clear();
    await courseRepository.clear();
    await userRepository.clear();

    console.log('🧹 Tabelas limpas.');

    // Criar Instrutor
    const hashedPassword = await bcrypt.hash('password123', 10);

    const instructor = userRepository.create({
        id: uuid(),
        email: 'instrutor@aprendimoz.com',
        password: hashedPassword,
        firstName: 'Arnaldo',
        lastName: 'Mondlane',
        role: UserRole.INSTRUTOR,
        status: UserStatus.ACTIVE,
        bio: 'Especialista em Desenvolvimento Web com mais de 10 anos de experiência em Moçambique.',
    });
    await userRepository.save(instructor);
    console.log('👤 Instrutor criado: Arnaldo Mondlane');

    // Criar Estudante
    const student = userRepository.create({
        id: uuid(),
        email: 'estudante@aprendimoz.com',
        password: hashedPassword,
        firstName: 'Estudante',
        lastName: 'Moz',
        role: UserRole.ALUNO,
        status: UserStatus.ACTIVE,
    });
    await userRepository.save(student);
    console.log('👤 Estudante criado: estudante@aprendimoz.com');

    // Criar Cursos
    let numCoursesCreated = 0;
    const courseData = [
        {
            title: 'React Pro: Do Zero ao M-Pesa',
            description: 'Aprenda a construir aplicações modernas com React e integrar pagamentos M-Pesa de forma profissional.',
            category: 'Programação',
            price: 1500,
            level: CourseLevel.INTERMEDIATE,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
            tags: ['React', 'M-Pesa', 'Moçambique'],
        },
        {
            title: 'Gestão Financeira para PMEs',
            description: 'Domine as finanças da sua empresa e cresça no mercado moçambicano.',
            category: 'Negócios',
            price: 2500,
            level: CourseLevel.BEGINNER,
            thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop',
            tags: ['Finanças', 'PMEs', 'Gestão'],
        },
        {
            title: 'Marketing Digital Localizado',
            description: 'Como vender mais usando Redes Sociais no contexto de Moçambique.',
            category: 'Marketing',
            price: 1200,
            level: CourseLevel.BEGINNER,
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop',
            tags: ['Marketing', 'Vendas', 'Redes Sociais'],
        }
    ];

    for (const c of courseData) {
        const course = courseRepository.create({
            ...c,
            id: uuid(),
            instructorId: instructor.id,
            status: CourseStatus.PUBLISHED,
            rating: 4.8,
            reviewCount: Math.floor(Math.random() * 200),
            enrollmentCount: Math.floor(Math.random() * 1000),
            isCertified: true,
            currency: 'MZN',
        });
        const savedCourse = await courseRepository.save(course);

        // Matricular o estudante no primeiro curso para o dashboard não estar vazio
        if (numCoursesCreated === 0) {
            const enrollment = enrollmentRepository.create({
                id: uuid(),
                userId: student.id,
                courseId: savedCourse.id,
                status: EnrollmentStatus.ACTIVE,
                progress: 45,
                enrolledAt: new Date(),
            });
            await enrollmentRepository.save(enrollment);
            console.log(`🎓 Estudante matriculado em: ${savedCourse.title}`);
        }
        numCoursesCreated++;

        // Criar um módulo para cada curso
        const mod = moduleRepository.create({
            id: uuid(),
            courseId: course.id,
            title: 'Introdução e Conceitos',
            description: 'O básico que precisas de saber para começar.',
            order: 1,
            duration: 45,
        });
        await moduleRepository.save(mod);

        // Criar aulas para o módulo
        const lessons = [
            { title: 'Boas-vindas', type: LessonType.VIDEO, duration: 5 },
            { title: 'O que vamos construir', type: LessonType.VIDEO, duration: 10 },
            { title: 'Primeiros Passos', type: LessonType.TEXT, duration: 15 }
        ];

        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessonRepository.create({
                id: uuid(),
                moduleId: mod.id,
                title: lessons[i].title,
                description: 'Descrição detalhada da aula.',
                type: lessons[i].type,
                videoUrl: lessons[i].type === LessonType.VIDEO ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
                duration: lessons[i].duration,
                order: i + 1,
                isPreview: i === 0,
            });
            await lessonRepository.save(lesson);
        }
        console.log(`📚 Curso criado: ${course.title}`);
    }

    console.log('\n✅ Seed finalizado com sucesso!');
    await AppDataSource.destroy();
}

seed().catch(err => {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
});
