import * as Configstore from 'configstore';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigstoreModuleOptions, ConfigstoreModuleAsyncOptions, ConfigstoreModuleOptionsFactory } from './interfaces/configstore-module.interface';
import { CONFIGSTORE_INSTANCE, CONFIGSTORE_OPTIONS } from './configstore.constants';

@Global()
@Module({})
export class ConfigstoreModule {
  static forRoot(options: ConfigstoreModuleOptions): DynamicModule {
    return {
      module: ConfigstoreModule,
      providers: [
        {
          provide: CONFIGSTORE_INSTANCE,
          useValue: new Configstore(options.packageName, options.defaults, options.options),
        },
      ],
      exports: [CONFIGSTORE_INSTANCE],
    };
  }

  static forRootAsync(options: ConfigstoreModuleAsyncOptions): DynamicModule {
    return {
      module: ConfigstoreModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: CONFIGSTORE_INSTANCE,
          useFactory: (options: ConfigstoreModuleOptions) => new Configstore(options.packageName, options.defaults, options.options),
          inject: [CONFIGSTORE_OPTIONS],
        },
      ],
      exports: [CONFIGSTORE_INSTANCE],
    };
  }

  private static createAsyncProviders(options: ConfigstoreModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: ConfigstoreModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: CONFIGSTORE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CONFIGSTORE_OPTIONS,
      useFactory: async (optionsFactory: ConfigstoreModuleOptionsFactory) =>
        optionsFactory.createConfigstoreOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
