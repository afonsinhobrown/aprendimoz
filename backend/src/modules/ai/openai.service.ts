import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        organization: this.configService.get<string>('OPENAI_ORG_ID'),
      });
    } else {
      this.logger.warn('OPENAI_API_KEY is missing. AI features will be disabled.');
    }
  }

  private checkOpenAI() {
    if (!this.openai) {
      throw new Error('AI features are disabled because OPENAI_API_KEY is not configured.');
    }
  }

  async generateQuizQuestions(
    lessonContent: string,
    numberOfQuestions: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  ): Promise<any[]> {
    this.checkOpenAI();
    try {
      const prompt = `
        Com base no seguinte conteúdo de uma aula, gere ${numberOfQuestions} perguntas de múltipla escolha para um quiz.
        
        Conteúdo da aula:
        ${lessonContent}
        
        Requisitos:
        - Dificuldade: ${difficulty}
        - Cada pergunta deve ter 4 opções (A, B, C, D)
        - Indique a resposta correta
        - Forneça uma explicação para cada resposta
        - As perguntas devem testar compreensão do conteúdo
        - Retorne em formato JSON
        
        Formato esperado:
        {
          "questions": [
            {
              "question": "texto da pergunta",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A",
              "explanation": "explicação do porquê A está correta"
            }
          ]
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em criar conteúdo educacional para plataformas de e-learning. Responda sempre em português.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content || '';

      try {
        const parsed = JSON.parse(content);
        this.logger.log(`Generated ${parsed.questions?.length || 0} quiz questions`);
        return parsed.questions || [];
      } catch (parseError) {
        this.logger.error(`Failed to parse AI response: ${parseError.message}`);
        // Fallback: return empty array
        return [];
      }
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
    this.checkOpenAI();
    try {
      const prompt = `
        Gere uma descrição atraente e profissional para um curso online com base nas seguintes informações:
        
        Título do curso: ${courseTitle}
        Conteúdo principal: ${courseContent}
        Público-alvo: ${targetAudience}
        
        Requisitos:
        - Descrição deve ter entre 100-150 palavras
        - Destaque os principais benefícios e aprendizados
        - Use linguagem persuasiva e profissional
        - Inclua bullet points para facilitar leitura
        - Adapte o tom para o público moçambicano
        - Seja otimizado para SEO
        - Retorne apenas o texto da descrição, sem formatação adicional
        
        Formato da resposta:
        • [Benefício 1]
        • [Benefício 2]
        • [Benefício 3]
        
        [Parágrafo de introdução]
        
        • [Habilidade 1]
        • [Habilidade 2]
        • [Habilidade 3]
        
        [Parágrafo de conclusão com call-to-action]
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em marketing educacional e criação de conteúdo para plataformas de e-learning. Responda sempre em português.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      const description = completion.choices[0]?.message?.content || '';
      this.logger.log(`Generated course description for: ${courseTitle}`);
      return description;
    } catch (error) {
      this.logger.error(`Error generating course description: ${error.message}`, error.stack);
      throw new Error(`Failed to generate course description: ${error.message}`);
    }
  }

  async generateRecommendations(
    userProfile: any,
    completedCourses: any[],
    interests: string[],
  ): Promise<any[]> {
    this.checkOpenAI();
    try {
      const completedCoursesText = completedCourses
        .map(course => `- ${course.title} (${course.category})`)
        .join('\n');

      const interestsText = interests.join(', ');

      const prompt = `
        Com base no perfil do usuário e histórico, gere recomendações personalizadas de cursos.
        
        Perfil do usuário:
        - Nome: ${userProfile.firstName} ${userProfile.lastName}
        - Interesses: ${interestsText}
        - Cursos completados: ${completedCoursesText}
        - Nível de conhecimento: ${userProfile.knowledgeLevel || 'intermediário'}
        
        Requisitos:
        - Recomende 5 cursos
        - Considere os interesses do usuário
        - Sugira cursos que complementem o que ele já fez
        - Inclua cursos de diferentes níveis (iniciante, intermediário, avançado)
        - Priorize cursos relevantes para o mercado moçambicano
        - Para cada recomendação, inclua:
          * Título do curso
          * Breve descrição (2-3 linhas)
          * Categoria
          * Nível
          * Duração estimada
          * Por que é recomendado (1-2 linhas)
        - Retorne em formato JSON
        
        Formato esperado:
        {
          "recommendations": [
            {
              "title": "Título do curso",
              "description": "Breve descrição",
              "category": "Categoria",
              "level": "iniciante|intermediário|avançado",
              "duration": "duração em horas",
              "reason": "Porquê recomendado"
            }
          ]
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em educação e recomendações de cursos para plataformas de e-learning. Responda sempre em português.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content || '';

      try {
        const parsed = JSON.parse(content);
        this.logger.log(`Generated ${parsed.recommendations?.length || 0} course recommendations`);
        return parsed.recommendations || [];
      } catch (parseError) {
        this.logger.error(`Failed to parse AI recommendations: ${parseError.message}`);
        return [];
      }
    } catch (error) {
      this.logger.error(`Error generating recommendations: ${error.message}`, error.stack);
      throw new Error(`Failed to generate recommendations: ${error.message}`);
    }
  }

  async answerTutorQuestion(
    question: string,
    courseContext: string,
    lessonContext?: string,
  ): Promise<string> {
    this.checkOpenAI();
    try {
      const contextText = lessonContext
        ? `Contexto da aula: ${lessonContext}\n\nContexto do curso: ${courseContext}`
        : `Contexto do curso: ${courseContext}`;

      const prompt = `
        Você é um tutor virtual especializado em educação online. Responda à pergunta do aluno com base no contexto fornecido.
        
        Pergunta do aluno: ${question}
        
        ${contextText}
        
        Diretrizes:
        - Responda de forma clara e educativa
        - Seja paciente e encorajador
        - Adapte a linguagem para o nível do aluno
        - Forneça exemplos práticos quando apropriado
        - Se a pergunta estiver fora do contexto, informe educadamente
        - Mantenha as respostas concisas mas completas
        - Use formatação (bullet points, negrito) para facilitar leitura
        - Responda sempre em português
        - Limite a resposta a 200-300 palavras
        
        Lembre-se: Você está ajudando um aluno moçambicano em sua jornada de aprendizado.
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um tutor virtual especializado em educação online para a plataforma AprendiMoz. Responda sempre em português de forma clara e educativa.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 500,
      });

      const answer = completion.choices[0]?.message?.content || '';
      this.logger.log(`Generated tutor answer for question: ${question.substring(0, 50)}...`);
      return answer;
    } catch (error) {
      this.logger.error(`Error generating tutor answer: ${error.message}`, error.stack);
      throw new Error(`Failed to generate tutor answer: ${error.message}`);
    }
  }

  async generateModuleOutline(
    moduleTitle: string,
    courseObjectives: string,
    targetDuration: number,
  ): Promise<any> {
    this.checkOpenAI();
    try {
      const prompt = `
        Crie um esboço detalhado para um módulo de curso com as seguintes informações:
        
        Título do módulo: ${moduleTitle}
        Objetivos do curso: ${courseObjectives}
        Duração desejada: ${targetDuration} minutos
        
        Requisitos:
        - Divida o conteúdo em 3-5 aulas
        - Cada aula deve ter título, descrição, tipo (vídeo/texto/quiz), e duração estimada
        - Inclua atividades práticas ou exercícios
        - Defina objetivos de aprendizagem para cada aula
        - Sugeria recursos adicionais
        - Mantenha coerência com os objetivos do curso
        - Retorne em formato JSON
        
        Formato esperado:
        {
          "title": "Título do módulo",
          "objectives": ["Objetivo 1", "Objetivo 2"],
          "lessons": [
            {
              "title": "Título da aula",
              "description": "Descrição detalhada",
              "type": "video|text|quiz|assignment",
              "duration": 15,
              "objectives": ["Objetivo específico 1", "Objetivo específico 2"],
              "activities": ["Atividade 1", "Atividade 2"],
              "resources": ["Recurso 1", "Recurso 2"]
            }
          ]
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em design curricular e criação de conteúdo educacional. Responda sempre em português.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content || '';

      try {
        const parsed = JSON.parse(content);
        this.logger.log(`Generated module outline for: ${moduleTitle}`);
        return parsed;
      } catch (parseError) {
        this.logger.error(`Failed to parse module outline: ${parseError.message}`);
        throw new Error('Failed to generate module outline');
      }
    } catch (error) {
      this.logger.error(`Error generating module outline: ${error.message}`, error.stack);
      throw new Error(`Failed to generate module outline: ${error.message}`);
    }
  }

  async generateLearningPath(
    userGoals: string[],
    currentSkillLevel: string,
    timeAvailable: number, // hours per week
    targetRole: string,
  ): Promise<any> {
    this.checkOpenAI();
    try {
      const goalsText = userGoals.join(', ');

      const prompt = `
        Crie uma trilha de aprendizagem personalizada com base no perfil do usuário.
        
        Objetivos do usuário: ${goalsText}
        Nível atual de habilidades: ${currentSkillLevel}
        Tempo disponível: ${timeAvailable} horas por semana
        Cargo alvo: ${targetRole}
        
        Requisitos:
        - Sugira 4-6 cursos em ordem lógica
        - Cada curso deve construir sobre o anterior
        - Considere o tempo disponível do usuário
        - Inclua marcos de tempo estimados
        - Sugira projetos práticos para aplicar conhecimentos
        - Inclua certificados ou marcos de conclusão
        - Adapte para o mercado de trabalho moçambicano
        - Retorne em formato JSON
        
        Formato esperado:
        {
          "pathTitle": "Título da trilha",
          "estimatedDuration": "12 semanas",
          "courses": [
            {
              "order": 1,
              "title": "Curso 1",
              "duration": "4 semanas",
              "prerequisites": [],
              "objectives": ["Objetivo 1", "Objetivo 2"],
              "project": "Descrição do projeto prático"
            }
          ],
          "milestones": [
            {
              "title": "Marco 1",
              "course": 1,
              "description": "Descrição do marco"
            }
          ]
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em desenvolvimento de carreira e planejamento educacional. Responda sempre em português.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content || '';

      try {
        const parsed = JSON.parse(content);
        this.logger.log(`Generated learning path with ${parsed.courses?.length || 0} courses`);
        return parsed;
      } catch (parseError) {
        this.logger.error(`Failed to parse learning path: ${parseError.message}`);
        throw new Error('Failed to generate learning path');
      }
    } catch (error) {
      this.logger.error(`Error generating learning path: ${error.message}`, error.stack);
      throw new Error(`Failed to generate learning path: ${error.message}`);
    }
  }
}
