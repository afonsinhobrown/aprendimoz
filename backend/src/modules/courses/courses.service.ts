import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In, MoreThanOrEqual, LessThanOrEqual, DeepPartial } from 'typeorm';
import { Course } from './entities/course.entity';
import { Module } from './entities/module.entity';
import { Lesson } from './entities/lesson.entity';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { CourseStatus, CourseLevel, PaginatedResponse, EnrollmentStatus } from '@shared/types';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) { }

  async create(createCourseDto: any, instructorId: string): Promise<Course> {
    const course = this.courseRepository.create({
      ...createCourseDto,
      instructorId,
      status: CourseStatus.DRAFT,
    });

    return await this.courseRepository.save(course) as unknown as Course;
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    category?: string;
    level?: CourseLevel;
    search?: string;
    instructorId?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: CourseStatus;
  }): Promise<PaginatedResponse<Course>> {
    const {
      page = 1,
      limit = 10,
      category,
      level,
      search,
      instructorId,
      minPrice,
      maxPrice,
      status = CourseStatus.PUBLISHED,
    } = params;

    const skip = (page - 1) * limit;

    const where: any = { status };

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    if (search) {
      where.title = Like(`%${search}%`);
    }

    const [items, total] = await this.courseRepository.findAndCount({
      where,
      relations: ['instructor', 'modules'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: [
        'instructor',
        'modules',
        'modules.lessons',
        'enrollments',
        'enrollments.user',
      ],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: any, userId: string, userRole: string): Promise<Course> {
    const course = await this.findOne(id);

    // Check permissions
    if (course.instructorId !== userId && userRole !== 'administrador') {
      throw new ForbiddenException('You can only update your own courses');
    }

    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course) as unknown as Course;
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const course = await this.findOne(id);

    // Check permissions
    if (course.instructorId !== userId && userRole !== 'administrador') {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.courseRepository.remove(course);
  }

  async publish(id: string, userId: string, userRole: string): Promise<Course> {
    const course = await this.findOne(id);

    // Check permissions
    if (course.instructorId !== userId && userRole !== 'administrador') {
      throw new ForbiddenException('You can only publish your own courses');
    }

    // Validate course has at least one module with lessons
    if (!course.modules || course.modules.length === 0) {
      throw new BadRequestException('Course must have at least one module to publish');
    }

    const hasLessons = course.modules.some(module => module.lessons && module.lessons.length > 0);
    if (!hasLessons) {
      throw new BadRequestException('Course must have at least one lesson to publish');
    }

    course.status = CourseStatus.PUBLISHED;
    return await this.courseRepository.save(course) as unknown as Course;
  }

  async enroll(courseId: string, userId: string): Promise<Enrollment> {
    const course = await this.findOne(courseId);

    // Check if already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { userId, courseId },
    });

    if (existingEnrollment) {
      throw new BadRequestException('You are already enrolled in this course');
    }

    // Check if course is published
    if (course.status !== CourseStatus.PUBLISHED) {
      throw new BadRequestException('Course is not available for enrollment');
    }

    const enrollment = this.enrollmentRepository.create({
      userId,
      courseId,
      status: EnrollmentStatus.ACTIVE,
      progress: 0,
      completedLessons: [],
      amountPaid: course.price,
      currency: course.currency,
    } as DeepPartial<Enrollment>);

    return await this.enrollmentRepository.save(enrollment) as unknown as Enrollment;
  }

  async getEnrollments(userId: string): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { userId },
      relations: ['course', 'course.instructor'],
      order: { enrolledAt: 'DESC' },
    });
  }

  async updateProgress(
    enrollmentId: string,
    lessonId: string,
    userId: string,
    progressData: any,
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId, userId },
      relations: ['course', 'course.modules', 'course.modules.lessons'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Add lesson to completed lessons if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Update current lesson and position
    if (progressData.currentLesson) {
      enrollment.currentLesson = progressData.currentLesson;
    }

    if (progressData.timeSpent) {
      enrollment.timeSpent += progressData.timeSpent;
    }

    if (progressData.position !== undefined) {
      enrollment.lastPosition = progressData.position;
    }

    // Calculate progress percentage
    const totalLessons = enrollment.course.modules.reduce(
      (total, module) => total + (module.lessons?.length || 0),
      0,
    );

    if (totalLessons > 0) {
      enrollment.progress = (enrollment.completedLessons.length / totalLessons) * 100;
    }

    // Check if course is completed
    if (enrollment.progress >= 100) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();
    }

    enrollment.lastAccessedAt = new Date();

    return await this.enrollmentRepository.save(enrollment) as unknown as Enrollment;
  }

  async getInstructorCourses(instructorId: string): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { instructorId },
      relations: ['modules', 'enrollments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPopularCourses(limit: number = 10): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { status: CourseStatus.PUBLISHED },
      relations: ['instructor'],
      order: { enrollmentCount: 'DESC', rating: 'DESC' },
      take: limit,
    });
  }

  async getRecommendedCourses(userId: string, limit: number = 5): Promise<Course[]> {
    // Simple recommendation based on enrolled courses categories
    const enrollments = await this.getEnrollments(userId);
    const enrolledCategories = enrollments.map(e => e.course.category);

    if (enrolledCategories.length === 0) {
      // If no enrollments, return popular courses
      return this.getPopularCourses(limit);
    }

    return await this.courseRepository.find({
      where: {
        status: CourseStatus.PUBLISHED,
        category: In(enrolledCategories),
      },
      relations: ['instructor'],
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  // Module management
  async createModule(courseId: string, createModuleDto: any, userId: string, userRole: string): Promise<Module> {
    const course = await this.findOne(courseId);

    // Check permissions
    if (course.instructorId !== userId && userRole !== 'administrador') {
      throw new ForbiddenException('You can only create modules for your own courses');
    }

    const module = this.moduleRepository.create({
      ...createModuleDto,
      courseId,
    } as DeepPartial<Module>);

    return await this.moduleRepository.save(module) as unknown as Module;
  }

  async getCourseModules(courseId: string): Promise<Module[]> {
    return await this.moduleRepository.find({
      where: { courseId },
      relations: ['lessons'],
      order: { order: 'ASC' },
    });
  }

  // Lesson management
  async createLesson(moduleId: string, createLessonDto: any, userId: string, userRole: string): Promise<Lesson> {
    const module = await this.moduleRepository.findOne({
      where: { id: moduleId },
      relations: ['course'],
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Check permissions
    if (module.course.instructorId !== userId && userRole !== 'administrador') {
      throw new ForbiddenException('You can only create lessons for your own courses');
    }

    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      moduleId,
    } as DeepPartial<Lesson>);

    return await this.lessonRepository.save(lesson) as unknown as Lesson;
  }

  async getModuleLessons(moduleId: string): Promise<Lesson[]> {
    return await this.lessonRepository.find({
      where: { moduleId },
      order: { order: 'ASC' },
    });
  }

  async getLesson(id: string, userId?: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['module', 'module.course'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    // Check if user has access to this lesson
    if (userId) {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { userId, courseId: lesson.module.course.id },
      });

      if (!enrollment && !lesson.isPreview) {
        throw new ForbiddenException('You need to enroll in this course to access this lesson');
      }
    } else if (!lesson.isPreview) {
      throw new ForbiddenException('This lesson is not available for preview');
    }

    return lesson;
  }
}
