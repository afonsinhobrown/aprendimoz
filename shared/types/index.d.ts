export declare enum UserRole {
    ALUNO = "aluno",
    INSTRUTOR = "instrutor",
    INSTITUICAO = "instituicao",
    ADMINISTRADOR = "administrador"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending"
}
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    bio?: string;
    institution?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum CourseStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export interface Course {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    instructor: User;
    thumbnail?: string;
    price: number;
    currency: string;
    level: CourseLevel;
    category: string;
    tags: string[];
    status: CourseStatus;
    duration: number;
    rating: number;
    reviewCount: number;
    enrollmentCount: number;
    isCertified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Module {
    id: string;
    courseId: string;
    title: string;
    description: string;
    order: number;
    duration: number;
    isRequired: boolean;
    lessons: Lesson[];
    createdAt: Date;
    updatedAt: Date;
}
export declare enum LessonType {
    VIDEO = "video",
    TEXT = "text",
    PDF = "pdf",
    QUIZ = "quiz",
    ASSIGNMENT = "assignment"
}
export interface Lesson {
    id: string;
    moduleId: string;
    title: string;
    description: string;
    type: LessonType;
    content?: string;
    videoUrl?: string;
    pdfUrl?: string;
    duration: number;
    order: number;
    isRequired: boolean;
    isPreview: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum EnrollmentStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    DROPPED = "dropped",
    PAUSED = "paused"
}
export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    user: User;
    course: Course;
    status: EnrollmentStatus;
    progress: number;
    completedLessons: string[];
    currentLesson?: string;
    enrolledAt: Date;
    completedAt?: Date;
    lastAccessedAt?: Date;
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    MPESA = "mpesa",
    CREDIT_CARD = "credit_card",
    WALLET = "wallet"
}
export interface Payment {
    id: string;
    userId: string;
    courseId?: string;
    moduleId?: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    mpesaTransactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Certificate {
    id: string;
    userId: string;
    courseId?: string;
    moduleId?: string;
    user: User;
    course?: Course;
    type: 'course' | 'module' | 'track';
    title: string;
    description: string;
    qrCode: string;
    certificateUrl: string;
    verifiedAt: Date;
    createdAt: Date;
}
export interface AIRecommendation {
    userId: string;
    type: 'course' | 'module' | 'track';
    itemId: string;
    score: number;
    reason: string;
    createdAt: Date;
}
export interface VirtualTutorMessage {
    id: string;
    userId: string;
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
    question: string;
    answer: string;
    context: string;
    createdAt: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
}
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
export interface UserDashboard {
    user: User;
    stats: {
        enrolledCourses: number;
        completedCourses: number;
        certificates: number;
        totalStudyTime: number;
    };
    recentCourses: Course[];
    recommendations: Course[];
    progress: Enrollment[];
}
export interface InstructorDashboard {
    user: User;
    stats: {
        totalCourses: number;
        totalStudents: number;
        totalRevenue: number;
        averageRating: number;
    };
    recentEnrollments: Enrollment[];
    courses: Course[];
}
