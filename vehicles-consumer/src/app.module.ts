import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Vehicle } from './entities/vehicle.entity'

const dbUser = process.env.DATABASE_USER || 'postgres';
const dbPass = process.env.DATABASE_PASS || 'postgres';
const dbHost = process.env.DATABASE_HOST || 'localhost';
const dbPort = parseInt(process.env.DATABASE_PORT ?? '5432');
const dbName = process.env.DATABASE_NAME || 'vehicles';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPass,
      database: dbName,
      entities: [Vehicle],
      synchronize: true
    }),
    TypeOrmModule.forFeature([Vehicle]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
