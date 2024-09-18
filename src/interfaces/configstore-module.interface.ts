import { ModuleMetadata, Type } from '@nestjs/common';
import { ConfigstoreOptions } from 'configstore';

export interface ConfigstoreModuleOptions {
  packageName: string,
  defaults?: any,
  options?: ConfigstoreOptions,
}

export interface ConfigstoreModuleOptionsFactory {
  createConfigstoreOptions(): Promise<ConfigstoreModuleOptions> | ConfigstoreModuleOptions;
}

export interface ConfigstoreModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ConfigstoreModuleOptionsFactory>;
  useClass?: Type<ConfigstoreModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ConfigstoreModuleOptions> | ConfigstoreModuleOptions;
  inject?: any[];
}
