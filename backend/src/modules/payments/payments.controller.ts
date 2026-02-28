import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, PaymentStatus, PaymentMethod } from '@shared/types';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  create(@Body() createPaymentDto: any, @Request() req) {
    return this.paymentsService.createPayment(createPaymentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get user payments' })
  @ApiResponse({ status: 200, description: 'List of user payments' })
  getUserPayments(@Request() req, @Query() query: any) {
    return this.paymentsService.getUserPayments(req.user.id, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user payment statistics' })
  @ApiResponse({ status: 200, description: 'Payment statistics' })
  getPaymentStats(@Request() req) {
    return this.paymentsService.getPaymentStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  getPayment(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.paymentsService.getPayment(id, req.user.id);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund payment' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  refundPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @Request() req,
  ) {
    return this.paymentsService.refundPayment(id, reason, req.user.id);
  }

  @Post('mpesa/process')
  @ApiOperation({ summary: 'Process M-Pesa payment' })
  @ApiResponse({ status: 200, description: 'M-Pesa payment processed' })
  processMpesaPayment(@Body() body: { paymentId: string; transactionId: string }) {
    return this.paymentsService.processMpesaPayment(body.paymentId, body.transactionId);
  }

  @Post('test')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Create test payment (Admin only)' })
  @ApiResponse({ status: 201, description: 'Test payment created' })
  createTestPayment(
    @Body() body: { userId: string; courseId?: string; moduleId?: string },
  ) {
    return this.paymentsService.createTestPayment(body.userId, body.courseId, body.moduleId);
  }
}
