import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FormEntityBase } from './form.entity.base';
import { validator } from './form.validator';

const typeMapping = {
  number: 'bigint',
  string: 'varchar',
  boolean: 'boolean',
  email: 'varchar',
  uuid: 'uuid',
};

@Injectable()
export class DynamicTableService {
  constructor(
    @InjectRepository(FormEntityBase)
    private readonly repository: Repository<FormEntityBase>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a table(form) in the database using input parameters
   * @param tableName type String  name of the table to create
   * @param keys type Object  keys and their types to be included in the table
   * @returns true if the table has been created successfully
   */

  async createTable(tableName: string, keys: Record<string, string>) {
    const schema = {};
    if (!tableName) {
      throw new BadRequestException(`Please provide title to create a form`);
    }
    if (Object.entries(keys).length === 0) {
      throw new BadRequestException(`Please provide fields to create a form`);
    }
    for (const [key, type] of Object.entries(keys)) {
      schema[key] = typeMapping[type] || type;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const tableExists = await queryRunner.hasTable(tableName);
    if (tableExists) {
      await queryRunner.release();
      throw new BadRequestException(`Form ${tableName} already exists.`);
    }

    try {
      const tableColumns = Object.keys(schema)
        .map((column) => `"${column}" ${schema[column]}`)
        .join(',');

      const createTableQuery = `CREATE TABLE "${tableName}" (_id SERIAL PRIMARY KEY, ${tableColumns})`;
      await queryRunner.query(createTableQuery);

      return {
        status: true,
        message: `Form ${tableName} with keys ${Object.keys(keys).join(', ')} created successfully.`,
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the form.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  //...................................................................

  /**
   * inserts data in the table using the input parameters
   * @param tableName type String  name of the table to be inserted
   * @param keys type Object  keys to be inserted
   * @returns true if the data has been inserted successfully
   */

  async insertData(tableName: string, keys: Record<string, string>) {
    if (!tableName) {
      throw new BadRequestException(
        `Please provide from title to fill the form`,
      );
    }
    if (Object.entries(keys).length === 0) {
      throw new BadRequestException(`Please provide fields to fill the form`);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tableExists = await queryRunner.hasTable(tableName);
    if (!tableExists) {
      await queryRunner.release();
      throw new NotFoundException(
        `Form ${tableName} does not exists. Please create the form first`,
      );
    }

    const validations = validator(keys);
    if (validations.status === false) {
      throw new BadRequestException(validations.message);
    }

    try {
      const columns = Object.keys(keys)
        .map((key) => `"${key}"`)
        .join(', ');
      const values = Object.values(keys)
        .map((value) => `'${value}'`)
        .join(', ');

      await queryRunner.query(`
        INSERT INTO "${tableName}" (${columns})
        VALUES (${values})
      `);
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: `Data inserted successfully into form ${tableName}.`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);

      throw new InternalServerErrorException(
        'An unexpected error occurred while filling the form.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  //...................................................................

  /**
   * retrieves a list of data from the table
   * @param tableName  type String  name of the table to query data from
   * @returns a list(array) of data retrieved from the table
   */

  async getData(tableName: string) {
    if (!tableName) {
      throw new BadRequestException(
        `Please provide from title to retrieve the data`,
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tableExists = await queryRunner.hasTable(tableName);
    if (!tableExists) {
      await queryRunner.release();
      throw new NotFoundException(
        `Unable to retrieve data, form ${tableName} does not exists.`,
      );
    }
    try {
      const data = await queryRunner.query(`
        SELECT * FROM "${tableName}" 
      `);
      return { status: true, data };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'An unexpected error occurred while retreiving the data.',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
