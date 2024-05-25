import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { DynamicTableService } from './form.service';

@Controller('')
export class DynamicTableController {
  constructor(private readonly dynamicTableService: DynamicTableService) {}

  @Post('/form')
  async createTable(@Body() body: Record<string, string>) {
    const { title, ...schema } = body;
    return this.dynamicTableService.createTable(title, schema);
  }

  @Post('/fill_data')
  async fillData(
    @Query('form_title') formTitle: string,
    @Body() body: Record<string, string>,
  ) {
    return this.dynamicTableService.insertData(formTitle, body);
  }

  @Get('/fill_data')
  async getData(@Query('form_title') formTitle: string) {
    return this.dynamicTableService.getData(formTitle);
  }
}
