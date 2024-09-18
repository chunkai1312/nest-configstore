# nest-configstore

[![NPM version][npm-image]][npm-url]

> A Nest module wrapper for [configstore](https://github.com/yeoman/configstore)

## Installation

To begin using it, we first install the required dependency.

```bash
$ npm install --save nest-configstore
```

## Getting started

Once the installation is complete, import the `ConfigstoreModule` into the root `AppModule` and run the `forRoot()` static method as shown below:

```typescript
import { Module } from '@nestjs/common';
import { ConfigstoreModule } from 'nest-configstore';

@Module({
  imports: [
    ConfigstoreModule.forRoot({
      packageName: 'PACKAGE_NAME',
      defaults: { foo: 'bar' },
    }),
  ],
})
export class AppModule {}
```

Next, inject the `Configstore` instance using the `@InjectConfigstore()` decorator.

```typescript
constructor(@InjectConfigstore() private readonly configstore: Configstore) {}
```

## Async configuration

When you need to pass module options asynchronously instead of statically, use the `forRootAsync()` method. As with most dynamic modules, Nest provides several techniques to deal with async configuration.

One technique is to use a factory function:

```typescript
ConfigstoreModule.forRootAsync({
  useFactory: () => ({
    packageName: 'PACKAGE_NAME',
    defaults: { foo: 'bar' },
  }),
});
```

Like other factory providers, our factory function can be [async](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory) and can inject dependencies through `inject`.

```typescript
ConfigstoreModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => 
    configService.get('configstore'),
  inject: [ConfigService],
});
```

Alternatively, you can configure the `ConfigstoreModule` using a class instead of a factory, as shown below.

```typescript
ConfigstoreModule.forRootAsync({
  useClass: ConfigstoreConfigService,
});
```

The construction above instantiates `ConfigstoreConfigService` inside `ConfigstoreModule`, using it to create an options object. Note that in this example, the `ConfigstoreConfigService` has to implement `ConfigstoreModuleOptionsFactory` interface as shown below. The `ConfigstoreModule` will call the `createConfigstoreOptions()` method on the instantiated object of the supplied class.

```typescript
@Injectable()
class ConfigstoreConfigService implements ConfigstoreModuleOptionsFactory {
  createConfigstoreOptions(): ConfigstoreModuleOptions {
    return {
      packageName: 'PACKAGE_NAME',
      defaults: { foo: 'bar' },
    }
  }
}
```

If you want to reuse an existing options provider instead of creating a private copy inside the `ConfigstoreModule`, use the `useExisting` syntax.

```typescript
ConfigstoreModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigstoreConfigService,
});
```

## Reference

[configstore](https://github.com/yeoman/configstore)

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/nest-configstore.svg
[npm-url]: https://npmjs.com/package/nest-configstore
