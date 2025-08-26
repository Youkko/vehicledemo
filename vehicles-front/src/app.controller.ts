import {
  Controller,
  Get,
  Render,
  Param,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    try {
      const vehicles = await this.appService.findAll();
      return { vehicles };
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return { vehicles: [] };
    }
  }

  @Get('create')
  @Render('create')
  createForm() {
    return {};
  }

  @Get('edit/:id')
  @Render('edit')
  async editForm(@Param('id') id: string) {
    try {
      const vehicle = await this.appService.findOne(Number(id));
      return { vehicle };
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return { vehicle: null };
    }
  }

  @Post('create')
  async create(@Body() body: any, @Res() res: Response) {
    try {
      await this.appService.create(body);
      res.redirect('/');
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.redirect('/create');
    }
  }

  @Post('edit/:id')
  async update(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    try {
      await this.appService.update(Number(id), body);
      res.redirect('/');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      res.redirect(`/edit/${id}`);
    }
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.appService.remove(Number(id));
      res.redirect('/');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.redirect('/');
    }
  }
}