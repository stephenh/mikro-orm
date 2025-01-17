import { MetadataStorage } from '../metadata';
import { EntityRepository } from '../entity';
import { Utils } from '../utils';
import { AnyEntity, Constructor } from '../types';

export function Entity(options: EntityOptions<any> = {}): Function {
  return function <T extends { new(...args: any[]): AnyEntity<T> }>(target: T) {
    const meta = MetadataStorage.getMetadata(target.name);
    Utils.merge(meta, options);
    meta.name = target.name;
    meta.constructorParams = Utils.getParamNames(target, 'constructor');
    meta.extends = Object.getPrototypeOf(target).name || undefined;
    Utils.lookupPathFromDecorator(meta);

    return target;
  };
}

export type EntityOptions<T extends AnyEntity<T>> = {
  collection?: string;
  customRepository?: () => Constructor<EntityRepository<T>>;
};
