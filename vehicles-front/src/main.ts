import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  
  const port = parseInt(process.env.PORT ?? '81');
  await app.listen(port);
  console.log(`Frontend running on http://localhost:${port}`);
}
bootstrap().catch((error) => console.error(error));
