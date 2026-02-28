import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@shared/types';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get AI recommendations for user' })
  @ApiResponse({ status: 200, description: 'AI recommendations' })
  getRecommendations(
    @Request() req,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
  ) {
    return this.aiService.getRecommendations(req.user.id, limit);
  }

  @Post('tutor')
  @ApiOperation({ summary: 'Ask virtual tutor a question' })
  @ApiResponse({ status: 200, description: 'Tutor answer' })
  askTutor(
    @Request() req,
    @Body() body: {
      question: string;
      courseId?: string;
      moduleId?: string;
      lessonId?: string;
    },
  ) {
    return this.aiService.askTutor(
      req.user.id,
      body.question,
      body.courseId,
      body.moduleId,
      body.lessonId,
    );
  }

  @Post('quiz/generate')
  @Roles(UserRole.INSTRUTOR, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Generate quiz questions with AI' })
  @ApiResponse({ status: 200, description: 'Generated quiz questions' })
  generateQuizQuestions(
    @Body() body: {
      lessonId: string;
      numberOfQuestions?: number;
      difficulty?: 'easy' | 'medium' | 'hard';
    },
  ) {
    return this.aiService.generateQuizQuestions(
      body.lessonId,
      body.numberOfQuestions,
      body.difficulty,
    );
  }

  @Post('course/description')
  @Roles(UserRole.INSTRUTOR, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Generate course description with AI' })
  @ApiResponse({ status: 200, description: 'Generated course description' })
  generateCourseDescription(
    @Body() body: {
      courseTitle: string;
      courseContent: string;
      targetAudience: string;
    },
  ) {
    return this.aiService.generateCourseDescription(
      body.courseTitle,
      body.courseContent,
      body.targetAudience,
    );
  }

  @Post('module/outline')
  @Roles(UserRole.INSTRUTOR, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Generate module outline with AI' })
  @ApiResponse({ status: 200, description: 'Generated module outline' })
  generateModuleOutline(
    @Body() body: {
      moduleTitle: string;
      courseObjectives: string;
      targetDuration: number;
    },
  ) {
    return this.aiService.generateModuleOutline(
      body.moduleTitle,
      body.courseObjectives,
      body.targetDuration,
    );
  }

  @Post('learning-path')
  @ApiOperation({ summary: 'Generate personalized learning path' })
  @ApiResponse({ status: 200, description: 'Generated learning path' })
  generateLearningPath(
    @Request() req,
    @Body() body: {
      userGoals: string[];
      currentSkillLevel: string;
      timeAvailable: number;
      targetRole: string;
    },
  ) {
    return this.aiService.generateLearningPath(
      req.user.id,
      body.userGoals,
      body.currentSkillLevel,
      body.timeAvailable,
      body.targetRole,
    );
  }

  @Get('risk-analysis/:userId')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Detect risk of abandonment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Risk analysis' })
  detectRiskOfAbandonment(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.aiService.detectRiskOfAbandonment(userId);
  }

  @Get('market-trends')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Analyze market trends (Admin only)' })
  @ApiResponse({ status: 200, description: 'Market trends analysis' })
  analyzeMarketTrends() {
    return this.aiService.analyzeMarketTrends();
  }
}
