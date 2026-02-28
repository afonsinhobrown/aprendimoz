import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Module } from '../modules/courses/entities/module.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { Enrollment } from '../modules/courses/entities/enrollment.entity';
import { Payment } from '../modules/payments/entities/payment.entity';
import { Certificate } from '../modules/certificates/entities/certificate.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const dbType = configService.get<string>('DB_TYPE') || 'sqlite';

  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: configService.get<string>('DB_DATABASE') || 'database.sqlite',
      entities: [User, Course, Module, Lesson, Enrollment, Payment, Certificate],
      synchronize: true, // Auto-create schema for SQLite local dev
      logging: configService.get<string>('NODE_ENV') === 'development',
    };
  }

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 5432,
    username: configService.get<string>('DB_USERNAME') || 'aprendimoz',
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE') || 'aprendimoz',
    entities: [User, Course, Module, Lesson, Enrollment, Payment, Certificate],
    synchronize: configService.get<string>('NODE_ENV') === 'development',
    logging: configService.get<string>('NODE_ENV') === 'development',
    migrations: ['src/database/migrations/*.ts'],
    migrationsRun: true,
  };
};
