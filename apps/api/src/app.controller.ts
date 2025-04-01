import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@monitoring/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiResponse<string> {
    return {
      data: this.appService.getHello(),
      success: true,
      timestamp: new Date(),
    };
  }
} 