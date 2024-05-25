import { FormEntityBase } from './form.entity.base';
import { Column, Entity } from 'typeorm';

const typeMapping = {
  number: 'bigint',
  string: 'varchar',
  boolean: 'boolean',
  email: 'varchar',
  uuid: 'uuid',
};

export function createDynamicEntity(
  tableName: string,
  schema: Record<string, string>,
) {
  @Entity({ name: tableName })
  class DynamicEntity extends FormEntityBase {}

  for (const [key, type] of Object.entries(schema)) {
    const columnType = typeMapping[type] || type;
    Column({ type: columnType })(DynamicEntity.prototype, key);
  }

  return DynamicEntity;
}
