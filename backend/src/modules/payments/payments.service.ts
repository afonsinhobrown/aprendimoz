import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Course } from '../courses/entities/course.entity';
import { Module } from '../courses/entities/module.entity';
import { User } from '../users/entities/user.entity';
import { PaymentStatus, PaymentMethod } from '@shared/types';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) { }

  async createPayment(createPaymentDto: any, userId: string): Promise<Payment> {
    const { courseId, moduleId, amount, method, phoneNumber } = createPaymentDto;

    // Validate payment amount
    let expectedAmount = 0;
    let currency = 'MZN';

    if (courseId) {
      const course = await this.courseRepository.findOne({ where: { id: courseId } });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      expectedAmount = course.price;
      currency = course.currency;
    } else if (moduleId) {
      const module = await this.moduleRepository.findOne({
        where: { id: moduleId },
        relations: ['course'],
      });
      if (!module) {
        throw new NotFoundException('Module not found');
      }
      expectedAmount = module.price;
      currency = module.course.currency;
    }

    if (amount !== expectedAmount) {
      throw new BadRequestException('Invalid payment amount');
    }

    const payment = this.paymentRepository.create({
      userId,
      courseId,
      moduleId,
      amount,
      currency,
      method,
      status: PaymentStatus.PENDING,
      transactionId: this.generateTransactionId(),
      mpesaPhoneNumber: method === PaymentMethod.MPESA ? phoneNumber : null,
      fee: this.calculateFee(amount, method),
      tax: this.calculateTax(amount),
    });

    return await this.paymentRepository.save(payment) as unknown as Payment;
  }

  async processMpesaPayment(paymentId: string, mpesaTransactionId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['user', 'course', 'module'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    // Simulate M-Pesa verification (in real implementation, call M-Pesa API)
    const isValid = await this.verifyMpesaTransaction(mpesaTransactionId, payment.mpesaPhoneNumber);

    if (isValid) {
      payment.status = PaymentStatus.COMPLETED;
      payment.mpesaTransactionId = mpesaTransactionId;
      payment.processedAt = new Date();

      // Here you would trigger enrollment creation
      // await this.enrollmentService.createEnrollmentFromPayment(payment);
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'M-Pesa transaction verification failed';
    }

    return await this.paymentRepository.save(payment) as unknown as Payment;
  }

  async getPayment(id: string, userId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id, userId },
      relations: ['user', 'course', 'module'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getUserPayments(userId: string, params: { page?: number; limit?: number; status?: PaymentStatus }) {
    const { page = 1, limit = 10, status } = params;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [payments, total] = await this.paymentRepository.findAndCount({
      where,
      relations: ['course', 'module'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items: payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async refundPayment(paymentId: string, reason: string, userId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId, userId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    if (!payment.isRefundable) {
      throw new BadRequestException('Payment is not refundable');
    }

    // Process refund (in real implementation, call payment gateway)
    const refundSuccessful = await this.processRefund(payment);

    if (refundSuccessful) {
      payment.status = PaymentStatus.REFUNDED;
      payment.refundedAt = new Date();
      payment.refundedAmount = payment.totalAmount;
      payment.refundReason = reason;
      payment.refundTransactionId = this.generateTransactionId('REFUND');
    }

    return await this.paymentRepository.save(payment) as unknown as Payment;
  }

  async getPaymentStats(userId: string) {
    const payments = await this.paymentRepository.find({
      where: { userId },
    });

    const stats = {
      totalSpent: 0,
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      refundedPayments: 0,
    };

    payments.forEach(payment => {
      if (payment.status === PaymentStatus.COMPLETED) {
        stats.totalSpent += payment.totalAmount;
        stats.completedPayments++;
      } else if (payment.status === PaymentStatus.PENDING) {
        stats.pendingPayments++;
      } else if (payment.status === PaymentStatus.FAILED) {
        stats.failedPayments++;
      } else if (payment.status === PaymentStatus.REFUNDED) {
        stats.refundedPayments++;
      }
    });

    return stats;
  }

  private generateTransactionId(prefix: string = 'PAY'): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  private calculateFee(amount: number, method: PaymentMethod): number {
    // Different fees for different payment methods
    switch (method) {
      case PaymentMethod.MPESA:
        return amount * 0.02; // 2% fee
      case PaymentMethod.CREDIT_CARD:
        return amount * 0.029 + 0.30; // 2.9% + $0.30
      case PaymentMethod.WALLET:
        return 0; // No fee for internal wallet
      default:
        return 0;
    }
  }

  private calculateTax(amount: number): number {
    // Mozambique VAT (IVA) is 16%
    return amount * 0.16;
  }

  private async verifyMpesaTransaction(transactionId: string, phoneNumber: string): Promise<boolean> {
    // Simulate M-Pesa API verification
    // In real implementation, call M-Pesa API
    console.log(`Verifying M-Pesa transaction ${transactionId} for phone ${phoneNumber}`);

    // Simulate success for demo
    return true;
  }

  private async processRefund(payment: Payment): Promise<boolean> {
    // Simulate refund processing
    // In real implementation, call payment gateway API
    console.log(`Processing refund for payment ${payment.id}`);

    // Simulate success for demo
    return true;
  }

  // For development and testing
  async createTestPayment(userId: string, courseId?: string, moduleId?: string): Promise<Payment> {
    let amount = 0;
    let currency = 'MZN';

    if (courseId) {
      const course = await this.courseRepository.findOne({ where: { id: courseId } });
      amount = course?.price || 0;
      currency = course?.currency || 'MZN';
    } else if (moduleId) {
      const module = await this.moduleRepository.findOne({
        where: { id: moduleId },
        relations: ['course'],
      });
      amount = module?.price || 0;
      currency = module?.course?.currency || 'MZN';
    }

    const payment = this.paymentRepository.create({
      userId,
      courseId,
      moduleId,
      amount,
      currency,
      method: PaymentMethod.MPESA,
      status: PaymentStatus.COMPLETED,
      transactionId: this.generateTransactionId('TEST'),
      mpesaTransactionId: `TEST_${Date.now()}`,
      processedAt: new Date(),
      fee: this.calculateFee(amount, PaymentMethod.MPESA),
      tax: this.calculateTax(amount),
    });

    return await this.paymentRepository.save(payment);
  }
}
