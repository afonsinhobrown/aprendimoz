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
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @ManyToOne(() => Course, (course) => course.modules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: 0 })
  duration: number; // in minutes

  @Column({ default: true })
  isRequired: boolean;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ default: true })
  isAvailableSeparately: boolean;

  @Column({ nullable: true })
  prerequisites?: string;

  @Column({ nullable: true })
  learningObjectives?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Lesson, (lesson) => lesson.module, { cascade: true })
  lessons: Lesson[];

  // Virtual properties
  get formattedPrice(): string {
    return `MZN ${this.price.toFixed(2)}`;
  }

  get hasLessons(): boolean {
    return this.lessons && this.lessons.length > 0;
  }

  get lessonCount(): number {
    return this.lessons?.length || 0;
  }
}
