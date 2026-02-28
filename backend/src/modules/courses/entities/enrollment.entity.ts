import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EnrollmentStatus } from '@shared/types';
import { User } from '../../users/entities/user.entity';
import { Course } from './course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  courseId: string;

  @ManyToOne(() => Course, (course) => course.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({
    type: 'text',
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @Column({ type: 'float', default: 0 })
  progress: number; // 0-100

  @Column('simple-array', { nullable: true })
  completedLessons: string[];

  @Column({ nullable: true })
  currentLesson?: string;

  @Column({ type: 'float', default: 0 })
  amountPaid: number;

  @Column({ default: 'MZN' })
  currency: string;

  @Column({ nullable: true })
  paymentId?: string;

  @Column({ nullable: true })
  certificateId?: string;

  @Column({ default: 0 })
  timeSpent: number; // in minutes

  @Column({ default: 0 })
  lastPosition: number; // video position in seconds

  @Column({ nullable: true })
  notes?: string; // user notes about the course

  @CreateDateColumn()
  enrolledAt: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ nullable: true })
  lastAccessedAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isActive(): boolean {
    return this.status === EnrollmentStatus.ACTIVE;
  }

  get isCompleted(): boolean {
    return this.status === EnrollmentStatus.COMPLETED;
  }

  get isDropped(): boolean {
    return this.status === EnrollmentStatus.DROPPED;
  }

  get isPaused(): boolean {
    return this.status === EnrollmentStatus.PAUSED;
  }

  get progressPercentage(): number {
    return parseFloat(this.progress.toString());
  }

  get canAccessCertificate(): boolean {
    return this.isCompleted && this.progressPercentage >= 100;
  }

  get formattedAmountPaid(): string {
    return `${this.currency} ${this.amountPaid.toFixed(2)}`;
  }

  get daysSinceEnrollment(): number {
    const now = new Date();
    const enrolled = new Date(this.enrolledAt);
    const diffTime = Math.abs(now.getTime() - enrolled.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
