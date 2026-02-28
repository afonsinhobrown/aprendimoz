-- Initialize AprendiMoz Database
-- This script creates the database schema and initial data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- These will be created after tables are created by TypeORM

-- Initial data for categories
INSERT INTO categories (name, description, icon, is_active) VALUES
('Tecnologia', 'Cursos de programação, desenvolvimento de software e TI', '💻', true),
('Negócios', 'Gestão, empreendedorismo e habilidades de negócios', '💼', true),
('Marketing', 'Marketing digital, vendas e comunicação', '📈', true),
('Design', 'Design gráfico, UX/UI e design criativo', '🎨', true),
('Idiomas', 'Aprendizagem de línguas estrangeiras', '🌍', true),
('Finanças', 'Educação financeira e investimentos', '💰', true),
('Saúde', 'Saúde e bem-estar', '🏥', true),
('Educação', 'Pedagogia e métodos de ensino', '📚', true);

-- Create sample admin user (password: admin123)
-- This will be handled by the application during first setup

-- Create sample courses (these will be created by instructors through the app)

-- Create sample learning paths
INSERT INTO learning_paths (title, description, category_id, estimated_hours, difficulty_level, is_active) VALUES
('Desenvolvimento Web Full Stack', 'Torne-se um desenvolvedor web completo aprendendo frontend e backend', 1, 200, 'intermediate', true),
('Marketing Digital para PMEs', 'Aprenda a promover seu pequeno negócio online', 3, 40, 'beginner', true),
('Gestão Financeira Pessoal', 'Controle suas finanças e alcance seus objetivos', 6, 30, 'beginner', true);

-- Create sample certificates templates
INSERT INTO certificate_templates (name, description, template_url, is_active) VALUES
('Certificado de Conclusão de Curso', 'Modelo padrão para certificados de cursos', '/templates/course-certificate.html', true),
('Certificado de Módulo', 'Modelo para certificados de módulos individuais', '/templates/module-certificate.html', true),
('Certificado de Trilha', 'Modelo para certificados de trilhas de aprendizagem', '/templates/track-certificate.html', true);

-- Create system settings
INSERT INTO system_settings (key, value, description) VALUES
('platform_name', 'AprendiMoz', 'Nome da plataforma'),
('platform_description', 'Plataforma de Educação Online Moçambicana', 'Descrição da plataforma'),
('default_currency', 'MZN', 'Moeda padrão da plataforma'),
('mpesa_enabled', 'true', 'Habilitar pagamentos M-Pesa'),
('certificate_auto_generate', 'true', 'Gerar certificados automaticamente'),
('ai_features_enabled', 'true', 'Habilitar recursos de IA'),
('max_file_size', '104857600', 'Tamanho máximo de arquivo em bytes (100MB)'),
('supported_video_formats', '["mp4", "avi", "mov"]', 'Formatos de vídeo suportados'),
('supported_document_formats', '["pdf", "doc", "docx", "ppt", "pptx"]', 'Formatos de documento suportados');

-- Create sample notifications
INSERT INTO notification_templates (type, title, message_template, is_active) VALUES
('welcome', 'Bem-vindo ao AprendiMoz!', 'Olá {user_name}, seja bem-vindo à plataforma de educação online de Moçambique!', true),
('course_enrollment', 'Inscrição no Curso', 'Parabéns! Você foi inscrito no curso "{course_title}" com sucesso.', true),
('course_completion', 'Curso Concluído', 'Parabéns {user_name}! Você concluiu o curso "{course_title}". Seu certificado está disponível.', true),
('payment_received', 'Pagamento Recebido', 'Seu pagamento de {amount} {currency} foi recebido com sucesso.', true),
('certificate_issued', 'Certificado Emitido', 'Seu certificado "{certificate_title}" foi emitido e está disponível em seu perfil.', true);

-- Create sample badges/achievements
INSERT INTO achievements (name, description, icon, condition_type, condition_value, points) VALUES
('Primeiro Passo', 'Complete sua primeira aula', '🎯', 'first_lesson', 1, 10),
('Dedicado', 'Estude por 7 dias consecutivos', '🔥', 'streak_days', 7, 50),
('Explorador', 'Complete 5 cursos diferentes', '🧭', 'courses_completed', 5, 100),
('Mestre', 'Complete 20 cursos', '👑', 'courses_completed', 20, 500),
('Notas Perfeitas', 'Obtenha 100% em 10 quizzes', '⭐', 'perfect_scores', 10, 200);

-- Create sample forum categories
INSERT INTO forum_categories (name, description, icon, is_active) VALUES
('Dúvidas Gerais', 'Tire suas dúvidas sobre a plataforma', '❓', true),
('Sugestões', 'Dê sugestões para melhorar a plataforma', '💡', true),
('Anúncios', 'Anúncios oficiais da plataforma', '📢', true),
('Tecnologia', 'Discussões sobre cursos de tecnologia', '💻', true),
('Negócios', 'Discussões sobre cursos de negócios', '💼', true);

-- Create sample FAQ
INSERT INTO faq (question, answer, category, is_active, order_index) VALUES
('Como me inscrever em um curso?', 'Para se inscrever, navegue até a página do curso desejado e clique no botão "Inscrever-se". Você precisará fazer login ou criar uma conta primeiro.', 'geral', true, 1),
('Quais formas de pagamento são aceitas?', 'Aceitamos M-Pesa, cartões de crédito e débito, e carteira interna da plataforma.', 'pagamentos', true, 2),
('Como obtenho meu certificado?', 'Após concluir todas as aulas e avaliações de um curso com nota mínima de 70%, seu certificado será gerado automaticamente e disponível em seu perfil.', 'certificados', true, 3),
('Posso acessar os cursos offline?', 'Sim! Você pode baixar aulas para acesso offline através do nosso aplicativo móvel.', 'acesso', true, 4),
('Como me torno um instrutor?', 'Para se tornar um instrutor, cadastre-se na plataforma, complete seu perfil e solicite aprovação como instrutor através do seu painel.', 'instrutores', true, 5);

-- Create indexes for performance
-- These indexes will be created by TypeORM but we can add additional ones here if needed

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON certificates(verification_code);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING gin(to_tsvector('portuguese', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING gin(to_tsvector('portuguese', first_name || ' ' || last_name || ' ' || bio));

-- Set up database version
INSERT INTO schema_migrations (version) VALUES ('1.0.0') ON CONFLICT DO NOTHING;
