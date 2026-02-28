import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { Course } from '../courses/entities/course.entity';
import { Module } from '../courses/entities/module.entity';
import { User } from '../users/entities/user.entity';
import { Enrollment } from '../courses/entities/enrollment.entity';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async generateCourseCertificate(enrollmentId: string): Promise<Certificate> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
      relations: ['user', 'course', 'course.instructor'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.progress < 100) {
      throw new BadRequestException('Course must be completed to generate certificate');
    }

    // Check if certificate already exists
    const existingCertificate = await this.certificateRepository.findOne({
      where: { userId: enrollment.user.id, courseId: enrollment.course.id },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    const verificationCode = this.generateVerificationCode();
    const qrCodeData = `https://aprendimoz.co.mz/verify/${verificationCode}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    const certificate = this.certificateRepository.create({
      userId: enrollment.user.id,
      courseId: enrollment.course.id,
      type: 'course',
      title: `Certificado de Conclusão - ${enrollment.course.title}`,
      description: `Este certificado confirma que ${enrollment.user.fullName} concluiu com sucesso o curso "${enrollment.course.title}"`,
      qrCode: qrCodeImage,
      verificationCode,
      certificateUrl: `/certificates/${verificationCode}.pdf`,
      issuerName: 'AprendiMoz',
      completionDate: new Date(),
      duration: `${enrollment.course.duration} minutos`,
      skills: JSON.stringify(this.extractSkills(enrollment.course)),
      verifiedAt: new Date(),
    });

    const savedCertificate = await this.certificateRepository.save(certificate) as unknown as Certificate;

    // Generate PDF certificate
    await this.generateCertificatePDF(savedCertificate);

    return savedCertificate;
  }

  async generateModuleCertificate(userId: string, moduleId: string): Promise<Certificate> {
    const module = await this.moduleRepository.findOne({
      where: { id: moduleId },
      relations: ['course', 'course.instructor'],
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has completed all lessons in the module
    // This would require tracking lesson completion per user
    const isCompleted = await this.checkModuleCompletion(userId, moduleId);

    if (!isCompleted) {
      throw new BadRequestException('Module must be completed to generate certificate');
    }

    // Check if certificate already exists
    const existingCertificate = await this.certificateRepository.findOne({
      where: { userId, moduleId },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    const verificationCode = this.generateVerificationCode();
    const qrCodeData = `https://aprendimoz.co.mz/verify/${verificationCode}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    const certificate = this.certificateRepository.create({
      userId,
      moduleId,
      type: 'module',
      title: `Certificado de Conclusão - ${module.title}`,
      description: `Este certificado confirma que ${user.fullName} concluiu com sucesso o módulo "${module.title}"`,
      qrCode: qrCodeImage,
      verificationCode,
      certificateUrl: `/certificates/${verificationCode}.pdf`,
      issuerName: 'AprendiMoz',
      completionDate: new Date(),
      duration: `${module.duration} minutos`,
      skills: JSON.stringify(this.extractModuleSkills(module)),
      verifiedAt: new Date(),
    });

    const savedCertificate = await this.certificateRepository.save(certificate);

    // Generate PDF certificate
    await this.generateCertificatePDF(savedCertificate);

    return savedCertificate;
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { userId, isRevoked: false },
      relations: ['course', 'module'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCertificate(id: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['user', 'course', 'module'],
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  async verifyCertificate(verificationCode: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { verificationCode },
      relations: ['user', 'course', 'module'],
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.isRevoked) {
      throw new BadRequestException('Certificate has been revoked');
    }

    return certificate;
  }

  async downloadCertificate(id: string, userId: string): Promise<Buffer> {
    const certificate = await this.certificateRepository.findOne({
      where: { id, userId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    // Generate PDF on the fly or return cached version
    return await this.generateCertificatePDF(certificate);
  }

  async revokeCertificate(id: string, reason: string, userId: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    certificate.isRevoked = true;
    certificate.revokedAt = new Date();
    certificate.revokeReason = reason;

    return await this.certificateRepository.save(certificate) as unknown as Certificate;
  }

  private generateVerificationCode(): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `CERT${timestamp}${random}`;
  }

  private extractSkills(course: Course): string[] {
    // Extract skills from course tags and description
    const skills = [...course.tags];

    // Add skills based on category
    if (course.category.toLowerCase().includes('tecnologia')) {
      skills.push('Programação', 'Desenvolvimento Web', 'Resolução de Problemas');
    } else if (course.category.toLowerCase().includes('negócios')) {
      skills.push('Gestão', 'Empreendedorismo', 'Liderança');
    } else if (course.category.toLowerCase().includes('marketing')) {
      skills.push('Marketing Digital', 'Comunicação', 'Análise de Dados');
    }

    return [...new Set(skills)]; // Remove duplicates
  }

  private extractModuleSkills(module: Module): string[] {
    const skills = [];

    if (module.title.toLowerCase().includes('javascript')) {
      skills.push('JavaScript', 'Programação Web');
    } else if (module.title.toLowerCase().includes('design')) {
      skills.push('Design Gráfico', 'UI/UX');
    } else if (module.title.toLowerCase().includes('marketing')) {
      skills.push('Marketing Digital', 'SEO');
    }

    return skills;
  }

  private async checkModuleCompletion(userId: string, moduleId: string): Promise<boolean> {
    // This would check if user has completed all lessons in the module
    // For now, return true as a placeholder
    return true;
  }

  private async generateCertificatePDF(certificate: Certificate): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50,
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Certificate design
      doc.fontSize(20).text('CERTIFICADO DE CONCLUSÃO', { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text('Este certificado confirma que', { align: 'center' });
      doc.moveDown();

      doc.fontSize(18).font('Helvetica-Bold').text(certificate.user?.fullName || 'Nome do Aluno', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).font('Helvetica').text(certificate.description, { align: 'center' });
      doc.moveDown();

      doc.fontSize(10).text(`Data de Conclusão: ${certificate.completionDate?.toLocaleDateString('pt-BR')}`, { align: 'center' });
      doc.text(`Duração: ${certificate.duration}`, { align: 'center' });
      doc.text(`Código de Verificação: ${certificate.verificationCode}`, { align: 'center' });

      doc.end();
    });
  }
}
