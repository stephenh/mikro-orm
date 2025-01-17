import 'reflect-metadata';
import { MetadataProvider } from './MetadataProvider';
import { EntityMetadata, EntityProperty } from '../types';
import { ReferenceType } from '../entity';

export class ReflectMetadataProvider extends MetadataProvider {

  async loadEntityMetadata(meta: EntityMetadata, name: string): Promise<void> {
    await this.initProperties(meta, prop => this.initPropertyType(meta, prop));
  }

  protected initPropertyType(meta: EntityMetadata, prop: EntityProperty) {
    const type = Reflect.getMetadata('design:type', meta.prototype, prop.name);

    if (!type || (type === Object && prop.reference !== ReferenceType.SCALAR)) {
      throw new Error(`Please provide either 'type' or 'entity' attribute in ${meta.className}.${prop.name}`);
    }

    prop.type = type.name;

    if (['string', 'number', 'boolean', 'array', 'object'].includes(prop.type.toLowerCase())) {
      prop.type = prop.type.toLowerCase();
    }
  }

}
