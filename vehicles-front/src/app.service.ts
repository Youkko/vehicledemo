import { Injectable } from '@nestjs/common';
import axios from 'axios';

const apiPort = parseInt(process.env.API_PORT ?? '3000');
const apiBaseURL = `${(process.env.API_URL || 'http://localhost')}:${apiPort}`;

@Injectable()
export class AppService {
  private readonly api = axios.create({
    baseURL: `${apiBaseURL}/vehicles`
  });

    async findAll() {
    try {
      const response = await this.api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  async create(data: any) {
    try {
      const formattedData = {
        ...data,
        ano: Number(data.ano)
      };
      const response = await this.api.post('/', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  async update(id: number, data: any) {
    try {
      const formattedData = {
        ...data,
        ano: Number(data.ano)
      };
      const response = await this.api.patch(`/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const response = await this.api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }
}
