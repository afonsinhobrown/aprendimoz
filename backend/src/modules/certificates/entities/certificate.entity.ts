import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Module } from '../../courses/entities/module.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.certificates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  courseId?: string;

  @ManyToOne(() => Course, (course) => course.id, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course?: Course;

  @Column({ nullable: true })
  moduleId?: string;

  @ManyToOne(() => Module, (module) => module.id, { nullable: true })
  @JoinColumn({ name: 'moduleId' })
  module?: Module;

  @Column({ type: 'text' })
  type: 'course' | 'module' | 'track';

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  qrCode: string;

  @Column()
  certificateUrl: string;

  @Column()
  verificationCode: string;

  @Column({ nullable: true })
  issuerName?: string;

  @Column({ nullable: true })
  issuerSignature?: string;

  @Column({ nullable: true })
  completionDate?: Date;

  @Column({ nullable: true })
  grade?: string;

  @Column({ type: 'float', nullable: true })
  score?: number;

  @Column({ nullable: true })
  duration?: string; // e.g., "40 hours"

  @Column({ nullable: true })
  skills?: string; // JSON array of skills

  @Column({ nullable: true })
  metadata?: string; // JSON string for additional data

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ nullable: true })
  revokedAt?: Date;

  @Column({ nullable: true })
  revokeReason?: string;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @Column({ nullable: true })
  verifiedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Virtual properties
  get isCourseCertificate(): boolean {
    return this.type === 'course';
  }

  get isModuleCertificate(): boolean {
    return this.type === 'module';
  }

  get isTrackCertificate(): boolean {
    return this.type === 'track';
  }

  get isValid(): boolean {
    return !this.isRevoked;
  }

  get verificationUrl(): string {
    return `https://aprendimoz.co.mz/verify/${this.verificationCode}`;
  }

  get formattedScore(): string {
    return this.score ? `${this.score}%` : '';
  }

  get hasGrade(): boolean {
    return !!this.grade;
  }

  get hasScore(): boolean {
    return this.score !== null && this.score !== undefined;
  }

  get skillsList(): string[] {
    if (!this.skills) return [];
    try {
      return JSON.parse(this.skills);
    } catch {
      return [];
    }
  }

  get metadataObject(): any {
    if (!this.metadata) return {};
    try {
      return JSON.parse(this.metadata);
    } catch {
      return {};
    }
  }
}
