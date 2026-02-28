import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, CourseLevel, CourseStatus } from '@shared/types';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUTOR, UserRole.INSTITUICAO, UserRole.ADMINISTRADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  create(@Body() createCourseDto: any, @Request() req) {
    return this.coursesService.create(createCourseDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'level', required: false, enum: CourseLevel })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'instructorId', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.coursesService.findAll(query);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular courses' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getPopular(@Query('limit') limit?: number) {
    return this.coursesService.getPopularCourses(limit);
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recommended courses for user' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getRecommended(@Request() req, @Query('limit') limit?: number) {
    return this.coursesService.getRecommendedCourses(req.user.id, limit);
  }

  @Get('instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor' })
  getInstructorCourses(@Param('instructorId', ParseUUIDPipe) instructorId: string) {
    return this.coursesService.getInstructorCourses(instructorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUTOR, UserRole.INSTITUICAO, UserRole.ADMINISTRADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: any,
    @Request() req,
  ) {
    return this.coursesService.update(id, updateCourseDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUTOR, UserRole.INSTITUICAO, UserRole.ADMINISTRADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete course' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.coursesService.remove(id, req.user.id, req.user.role);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUTOR, UserRole.INSTITUICAO, UserRole.ADMINISTRADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish course' })
  publish(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.coursesService.publish(id, req.user.id, req.user.role);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in course' })
  enroll(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.coursesService.enroll(id, req.user.id);
  }

  @Get(':id/modules')
  @ApiOperation({ summary: 'Get course modules' })
  getCourseModules(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getCourseModules(id);
  }

  @Post(':id/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUTOR, UserRole.INSTITUICAO, UserRole.ADMINISTRADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create course module' })
  createModule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createModuleDto: any,
    @Request() req,
  ) {
    return this.coursesService.createModule(id, createModuleDto, req.user.id, req.user.role);
  }
}

@Controller('modules')
@ApiTags('modules')
export class ModulesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Get(':moduleId/lessons')
  @ApiOperation({ summary: 'Get module lessons' })
  getModuleLessons(@Param('moduleId', ParseUUIDPipe) moduleId: string) {
    return this.coursesService.getModuleLessons(moduleId);
  }

  @Post(':moduleId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUTOR, UserRole.INSTITUICAO, UserRole.ADMINISTRADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create lesson' })
  createLesson(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Body() createLessonDto: any,
    @Request() req,
  ) {
    return this.coursesService.createLesson(moduleId, createLessonDto, req.user.id, req.user.role);
  }
}

@Controller('lessons')
@ApiTags('lessons')
export class LessonsController {
  constructor(private readonly coursesService: CoursesService) { }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  getLesson(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.coursesService.getLesson(id, req.user?.id);
  }
}

@Controller('enrollments')
@ApiTags('enrollments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EnrollmentsController {
  constructor(private readonly coursesService: CoursesService) { }

  @Get()
  @ApiOperation({ summary: 'Get user enrollments' })
  getEnrollments(@Request() req) {
    return this.coursesService.getEnrollments(req.user.id);
  }

  @Post(':enrollmentId/progress')
  @ApiOperation({ summary: 'Update lesson progress' })
  updateProgress(
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
    @Body() progressData: any,
    @Request() req,
  ) {
    return this.coursesService.updateProgress(
      enrollmentId,
      progressData.lessonId,
      req.user.id,
      progressData,
    );
  }
}
