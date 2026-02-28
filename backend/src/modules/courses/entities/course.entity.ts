import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseStatus, CourseLevel } from '@shared/types';
import { User } from '../../users/entities/user.entity';
import { Module } from './module.entity';
import { Enrollment } from './enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  instructorId: string;

  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ default: 'MZN' })
  currency: string;

  @Column({
    type: 'text',
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column()
  category: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({
    type: 'text',
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({ default: 0 })
  duration: number; // in minutes

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: 0 })
  enrollmentCount: number;

  @Column({ default: false })
  isCertified: boolean;

  @Column({ nullable: true })
  requirements?: string;

  @Column({ nullable: true })
  whatYouWillLearn?: string;

  @Column({ nullable: true })
  targetAudience?: string;

  @Column({ default: true })
  allowIndividualModulePurchase: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  certificatePrice?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Module, (module) => module.course, { cascade: true })
  modules: Module[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  // Virtual properties
  get formattedPrice(): string {
    return `${this.currency} ${this.price.toFixed(2)}`;
  }

  get averageRating(): number {
    return this.rating || 0;
  }

  get isPublished(): boolean {
    return this.status === CourseStatus.PUBLISHED;
  }
}
