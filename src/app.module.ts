import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envs } from '@config/index';
import { LoggerMiddleware } from '@common/middleware/logger.middleware';
import { BlogsModule } from '@/modules/blogs/blogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ssl: envs.stage === 'prod',
      extra: {
        ssl: envs.stage === 'prod' ? { rejectUnauthorized: false } : false,
      },
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      database: envs.dbName,
      username: envs.dbUser,
      password: envs.dbPassword,
      autoLoadEntities: true,
      synchronize: true,
    }),
    BlogsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
