import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
  Res,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@shared/types';

@ApiTags('certificates')
@Controller('certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) { }

  @Get()
  @ApiOperation({ summary: 'Get user certificates' })
  @ApiResponse({ status: 200, description: 'List of user certificates' })
  getUserCertificates(@Request() req) {
    return this.certificatesService.getUserCertificates(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certificate by ID' })
  @ApiResponse({ status: 200, description: 'Certificate details' })
  getCertificate(@Param('id', ParseUUIDPipe) id: string) {
    return this.certificatesService.getCertificate(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download certificate PDF' })
  @ApiResponse({ status: 200, description: 'Certificate PDF' })
  async downloadCertificate(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.certificatesService.downloadCertificate(id, req.user.id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Post('course/:enrollmentId')
  @ApiOperation({ summary: 'Generate course certificate' })
  @ApiResponse({ status: 201, description: 'Certificate generated' })
  generateCourseCertificate(@Param('enrollmentId', ParseUUIDPipe) enrollmentId: string) {
    return this.certificatesService.generateCourseCertificate(enrollmentId);
  }

  @Post('module/:moduleId')
  @ApiOperation({ summary: 'Generate module certificate' })
  @ApiResponse({ status: 201, description: 'Certificate generated' })
  generateModuleCertificate(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Request() req,
  ) {
    return this.certificatesService.generateModuleCertificate(req.user.id, moduleId);
  }

  @Post(':id/revoke')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Revoke certificate (Admin only)' })
  @ApiResponse({ status: 200, description: 'Certificate revoked' })
  revokeCertificate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ) {
    return this.certificatesService.revokeCertificate(id, reason, null);
  }
}

@Controller('verify')
@ApiTags('certificates')
export class CertificatesVerifyController {
  constructor(private readonly certificatesService: CertificatesService) { }

  @Get(':verificationCode')
  @ApiOperation({ summary: 'Verify certificate by code' })
  @ApiResponse({ status: 200, description: 'Certificate verification result' })
  verifyCertificate(@Param('verificationCode') verificationCode: string) {
    return this.certificatesService.verifyCertificate(verificationCode);
  }
}
