import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentStatus, PaymentMethod } from '@shared/types';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Module } from '../../courses/entities/module.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
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

  @Column({ type: 'float' })
  amount: number;

  @Column({ default: 'MZN' })
  currency: string;

  @Column({
    type: 'text',
    default: PaymentMethod.MPESA,
  })
  method: PaymentMethod;

  @Column({
    type: 'text',
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  mpesaTransactionId?: string;

  @Column({ nullable: true })
  mpesaPhoneNumber?: string;

  @Column({ nullable: true })
  externalPaymentId?: string;

  @Column({ nullable: true })
  paymentGateway?: string;

  @Column({ nullable: true })
  failureReason?: string;

  @Column({ nullable: true })
  metadata?: string; // JSON string for additional data

  @Column({ type: 'float', default: 0 })
  fee: number;

  @Column({ type: 'float', default: 0 })
  tax: number;

  @Column({ default: false })
  isRefundable: boolean;

  @Column({ nullable: true })
  refundedAt?: Date;

  @Column({ type: 'float', nullable: true })
  refundedAmount?: number;

  @Column({ nullable: true })
  refundReason?: string;

  @Column({ nullable: true })
  refundTransactionId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  processedAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  get isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  get isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  get isRefunded(): boolean {
    return this.status === PaymentStatus.REFUNDED;
  }

  get totalAmount(): number {
    return parseFloat(this.amount.toString()) + parseFloat(this.fee.toString()) + parseFloat(this.tax.toString());
  }

  get formattedAmount(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }

  get formattedTotalAmount(): string {
    return `${this.currency} ${this.totalAmount.toFixed(2)}`;
  }

  get canBeRefunded(): boolean {
    return this.isCompleted && this.isRefundable && !this.isRefunded;
  }

  get isMpesa(): boolean {
    return this.method === PaymentMethod.MPESA;
  }

  get isCreditCard(): boolean {
    return this.method === PaymentMethod.CREDIT_CARD;
  }

  get isWallet(): boolean {
    return this.method === PaymentMethod.WALLET;
  }
}
