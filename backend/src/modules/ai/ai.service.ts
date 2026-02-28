import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly openaiService: OpenaiService) {}

  async getRecommendations(userId: string, limit: number = 5): Promise<any[]> {
    try {
      // This would integrate with user data and course history
      // For now, return mock recommendations
      const mockRecommendations = [
        {
          id: '1',
          title: 'Introdução à Programação Web',
          description: 'Aprenda HTML, CSS e JavaScript do zero',
          category: 'Tecnologia',
          level: 'beginner',
          duration: 20,
          rating: 4.8,
          enrollmentCount: 1250,
          price: 1500,
          formattedPrice: 'MZN 1,500.00',
          reason: 'Baseado no seu interesse em desenvolvimento web',
          thumbnail: '/images/courses/web-dev.jpg',
        },
        {
          id: '2',
          title: 'Marketing Digital para PMEs',
          description: 'Estratégias de marketing digital para pequenos negócios moçambicanos',
          category: 'Negócios',
          level: 'intermediate',
          duration: 15,
          rating: 4.6,
          enrollmentCount: 890,
          price: 2000,
          formattedPrice: 'MZN 2,000.00',
          reason: 'Perfeito para empreendedores que buscam crescimento digital',
          thumbnail: '/images/courses/digital-marketing.jpg',
        },
        {
          id: '3',
          title: 'Gestão Financeira Pessoal',
          description: 'Controle suas finanças e alcance seus objetivos financeiros',
          category: 'Finanças',
          level: 'beginner',
          duration: 12,
          rating: 4.7,
          enrollmentCount: 2100,
          price: 1000,
          formattedPrice: 'MZN 1,000.00',
          reason: 'Essencial para independência financeira',
          thumbnail: '/images/courses/finance.jpg',
        },
        {
          id: '4',
          title: 'Design Gráfico com Canva',
          description: 'Crie designs profissionais usando a ferramenta Canva',
          category: 'Design',
          level: 'beginner',
          duration: 8,
          rating: 4.5,
          enrollmentCount: 650,
          price: 800,
          formattedPrice: 'MZN 800.00',
          reason: 'Habilidade prática muito demandada no mercado',
          thumbnail: '/images/courses/design.jpg',
        },
        {
          id: '5',
          title: 'Inglês para Negócios',
          description: 'Aprenda inglês focado em comunicação empresarial',
          category: 'Idiomas',
          level: 'intermediate',
          duration: 25,
          rating: 4.9,
          enrollmentCount: 430,
          price: 2500,
          formattedPrice: 'MZN 2,500.00',
          reason: 'Importante para comunicação internacional',
          thumbnail: '/images/courses/english.jpg',
        },
      ];

      this.logger.log(`Generated ${mockRecommendations.length} recommendations for user ${userId}`);
      return mockRecommendations.slice(0, limit);
    } catch (error) {
      this.logger.error(`Error getting recommendations: ${error.message}`, error.stack);
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  }

  async askTutor(
    userId: string,
    question: string,
    courseId?: string,
    moduleId?: string,
    lessonId?: string,
  ): Promise<string> {
    try {
      // Get course context for better responses
      let courseContext = '';
      if (courseId) {
        // In a real implementation, fetch course data
        courseContext = 'Contexto do curso disponível';
      }

      let lessonContext = '';
      if (lessonId) {
        // In a real implementation, fetch lesson data
        lessonContext = 'Contexto da aula disponível';
      }

      const answer = await this.openaiService.answerTutorQuestion(
        question,
        courseContext,
        lessonContext,
      );

      this.logger.log(`Tutor answered question for user ${userId}: ${question.substring(0, 50)}...`);
      return answer;
    } catch (error) {
      this.logger.error(`Error asking tutor: ${error.message}`, error.stack);
      throw new Error(`Failed to ask tutor: ${error.message}`);
    }
  }

  async generateQuizQuestions(
    lessonId: string,
    numberOfQuestions: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  ): Promise<any[]> {
    try {
      // Get lesson content
      const lessonContent = `
        Título: Introdução ao JavaScript
        Conteúdo: Variáveis, tipos de dados, operadores básicos, estruturas de controle
        Objetivos: Compreender os fundamentos da programação JavaScript
      `;

      const questions = await this.openaiService.generateQuizQuestions(
        lessonContent,
        numberOfQuestions,
        difficulty,
      );

      this.logger.log(`Generated ${questions.length} quiz questions for lesson ${lessonId}`);
      return questions;
    } catch (error) {
      this.logger.error(`Error generating quiz questions: ${error.message}`, error.stack);
      throw new Error(`Failed to generate quiz questions: ${error.message}`);
    }
  }

  async generateCourseDescription(
    courseTitle: string,
    courseContent: string,
    targetAudience: string,
  ): Promise<string> {
    try {
      const description = await this.openaiService.generateCourseDescription(
        courseTitle,
        courseContent,
        targetAudience,
      );

      this.logger.log(`Generated course description for: ${courseTitle}`);
      return description;
    } catch (error) {
      this.logger.error(`Error generating course description: ${error.message}`, error.stack);
      throw new Error(`Failed to generate course description: ${error.message}`);
    }
  }

  async generateModuleOutline(
    moduleTitle: string,
    courseObjectives: string,
    targetDuration: number,
  ): Promise<any> {
    try {
      const outline = await this.openaiService.generateModuleOutline(
        moduleTitle,
        courseObjectives,
        targetDuration,
      );

      this.logger.log(`Generated module outline for: ${moduleTitle}`);
      return outline;
    } catch (error) {
      this.logger.error(`Error generating module outline: ${error.message}`, error.stack);
      throw new Error(`Failed to generate module outline: ${error.message}`);
    }
  }

  async generateLearningPath(
    userId: string,
    userGoals: string[],
    currentSkillLevel: string,
    timeAvailable: number,
    targetRole: string,
  ): Promise<any> {
    try {
      const learningPath = await this.openaiService.generateLearningPath(
        userGoals,
        currentSkillLevel,
        timeAvailable,
        targetRole,
      );

      this.logger.log(`Generated learning path for user ${userId} targeting ${targetRole}`);
      return learningPath;
    } catch (error) {
      this.logger.error(`Error generating learning path: ${error.message}`, error.stack);
      throw new Error(`Failed to generate learning path: ${error.message}`);
    }
  }

  async detectRiskOfAbandonment(userId: string): Promise<any> {
    try {
      // This would analyze user behavior patterns
      // For now, return mock risk assessment
      const riskAssessment = {
        userId,
        riskLevel: 'low', // low, medium, high
        riskFactors: [
          {
            factor: 'login_frequency',
            status: 'normal',
            description: 'Login frequency is within normal range',
          },
          {
            factor: 'course_progress',
            status: 'active',
            description: 'User is actively progressing through courses',
          },
          {
            factor: 'time_spent',
            status: 'increasing',
            description: 'Study time is increasing over time',
          },
        ],
        recommendations: [
          {
            type: 'engagement',
            message: 'Continue com o bom trabalho! Você está progredindo bem.',
          },
          {
            type: 'motivation',
            message: 'Tente estabelecer metas semanais de estudo.',
          },
        ],
        lastActivity: new Date().toISOString(),
        nextCheckDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };

      this.logger.log(`Risk assessment for user ${userId}: ${riskAssessment.riskLevel} risk`);
      return riskAssessment;
    } catch (error) {
      this.logger.error(`Error detecting abandonment risk: ${error.message}`, error.stack);
      throw new Error(`Failed to detect abandonment risk: ${error.message}`);
    }
  }

  async analyzeMarketTrends(): Promise<any> {
    try {
      // This would analyze course enrollment data, search trends, etc.
      // For now, return mock market analysis
      const marketAnalysis = {
        trendingCategories: [
          {
            category: 'Tecnologia',
            growth: '+25%',
            demand: 'alta',
            recommendedCourses: [
              'Desenvolvimento Web Full Stack',
              'Programação Mobile',
              'Data Science com Python',
            ],
          },
          {
            category: 'Negócios',
            growth: '+18%',
            demand: 'alta',
            recommendedCourses: [
              'Marketing Digital Avançado',
              'Gestão de Projetos',
              'Finanças para PMEs',
            ],
          },
          {
            category: 'Design',
            growth: '+15%',
            demand: 'média',
            recommendedCourses: [
              'UI/UX Design Moderno',
              'Design de Produtos',
              'Branding para Negócios',
            ],
          },
        ],
        emergingTopics: [
          'Inteligência Artificial Aplicada',
          'Sustentabilidade e ESG',
          'E-commerce e Vendas Online',
          'Marketing de Influência Digital',
          'Desenvolvimento de Apps Mobile',
        ],
        marketGaps: [
          'Cursos sobre Blockchain e Criptomoedas',
          'Segurança Cibernética para PMEs',
          'Automação de Processos com IA',
          'Marketing para Mercado Africano',
        ],
        recommendations: [
          {
            action: 'create_courses',
            priority: 'alta',
            description: 'Criar cursos sobre IA e automação',
            estimatedDemand: 'muito alta',
          },
          {
            action: 'expand_content',
            priority: 'média',
            description: 'Expandir conteúdo para nível avançado',
            estimatedDemand: 'alta',
          },
        ],
        lastUpdated: new Date().toISOString(),
      };

      this.logger.log('Generated market trends analysis');
      return marketAnalysis;
    } catch (error) {
      this.logger.error(`Error analyzing market trends: ${error.message}`, error.stack);
      throw new Error(`Failed to analyze market trends: ${error.message}`);
    }
  }
}
