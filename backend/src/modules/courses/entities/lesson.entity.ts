import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LessonType } from '@shared/types';
import { Module } from './module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  moduleId: string;

  @ManyToOne(() => Module, (module) => module.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'text',
    default: LessonType.VIDEO,
  })
  type: LessonType;

  @Column('text', { nullable: true })
  content?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true })
  videoDuration?: number; // in seconds

  @Column({ nullable: true })
  pdfUrl?: string;

  @Column({ nullable: true })
  pdfSize?: number; // in bytes

  @Column({ default: 0 })
  duration: number; // estimated duration in minutes

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isRequired: boolean;

  @Column({ default: false })
  isPreview: boolean;

  @Column({ nullable: true })
  quizQuestions?: string; // JSON string with quiz data

  @Column({ nullable: true })
  assignmentInstructions?: string;

  @Column({ nullable: true })
  resources?: string; // JSON string with additional resources

  @Column({ default: 80 }) // minimum score to pass (for quizzes)
  minPassingScore: number;

  @Column({ default: 1 }) // maximum attempts
  maxAttempts: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isVideo(): boolean {
    return this.type === LessonType.VIDEO;
  }

  get isText(): boolean {
    return this.type === LessonType.TEXT;
  }

  get isPdf(): boolean {
    return this.type === LessonType.PDF;
  }

  get isQuiz(): boolean {
    return this.type === LessonType.QUIZ;
  }

  get isAssignment(): boolean {
    return this.type === LessonType.ASSIGNMENT;
  }

  get hasContent(): boolean {
    return !!(this.content || this.videoUrl || this.pdfUrl);
  }

  get isAccessible(): boolean {
    return this.isPreview || this.hasContent;
  }
}
