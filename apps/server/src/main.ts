import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  // 使用Winston替换NestJS默认日志器
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  
  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
bootstrap();
