import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicTableController } from './form.controller';
import { DynamicTableService } from './form.service';
import { FormEntityBase } from './form.entity.base';

@Module({
  imports: [TypeOrmModule.forFeature([FormEntityBase])],
  controllers: [DynamicTableController],
  providers: [DynamicTableService],
})
export class FormModule {}
