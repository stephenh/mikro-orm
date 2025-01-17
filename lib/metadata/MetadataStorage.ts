import { EntityMetadata, AnyEntity, Dictionary } from '../types';
import { Utils, ValidationError } from '../utils';
import { EntityManager } from '../EntityManager';
import { EntityHelper } from '../entity';

export class MetadataStorage {

  private static readonly metadata: Record<string, EntityMetadata> = {};
  private readonly metadata: Record<string, EntityMetadata>;

  constructor(metadata: Record<string, EntityMetadata> = {}) {
    this.metadata = Utils.copy(metadata);
  }

  static getMetadata(): Record<string, EntityMetadata>; // tslint:disable-next-line:lines-between-class-members
  static getMetadata<T extends AnyEntity<T> = any>(entity: string): EntityMetadata<T>; // tslint:disable-next-line:lines-between-class-members
  static getMetadata<T extends AnyEntity<T> = any>(entity?: string): Record<string, EntityMetadata> | EntityMetadata<T> {
    if (entity && !MetadataStorage.metadata[entity]) {
      MetadataStorage.metadata[entity] = { properties: {}, hooks: {} } as EntityMetadata;
    }

    if (entity) {
      return MetadataStorage.metadata[entity];
    }

    return MetadataStorage.metadata;
  }

  static init(): MetadataStorage {
    return new MetadataStorage(MetadataStorage.metadata);
  }

  getAll(): Dictionary<EntityMetadata> {
    return this.metadata;
  }

  get<T extends AnyEntity<T> = any>(entity: string, init = false, validate = true): EntityMetadata<T> {
    if (entity && !this.metadata[entity] && validate && !init) {
      throw ValidationError.missingMetadata(entity);
    }

    if (!this.metadata[entity] && init) {
      this.metadata[entity] = { properties: {} } as EntityMetadata;
    }

    return this.metadata[entity];
  }

  has(entity: string): boolean {
    return entity in this.metadata;
  }

  set(entity: string, meta: EntityMetadata): EntityMetadata {
    return this.metadata[entity] = meta;
  }

  reset(entity: string): void {
    delete this.metadata[entity];
  }

  decorate(em: EntityManager): void {
    Object.values(this.metadata)
      .filter(meta => meta.prototype && !Utils.isEntity(meta.prototype))
      .forEach(meta => EntityHelper.decorate(meta, em));
  }

}
