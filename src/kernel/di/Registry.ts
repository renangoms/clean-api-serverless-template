import { Constructor } from '@shared/types/Contructor';

export class Registry {
  private static instance: Registry | undefined;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  private constructor() { }

  private readonly providers = new Map<string, Registry.Provider>();

  register(implementation: Constructor) {
    const token = implementation.name;

    if (this.providers.has(token)) {
      throw new Error(`"${token}" is already registered in the registry.`);
    }

    const dependencies =
      Reflect.getMetadata('design:paramtypes', implementation) ?? [];

    this.providers.set(token, { implementation, dependencies });
  }

  resolve<TImpl extends Constructor>(implementation: TImpl): InstanceType<TImpl> {
    const token = implementation.name;
    const provider = this.providers.get(token);

    if (!provider) {
      throw new Error(`"${token}" is not registered.`);
    }

    const dependencies = provider.dependencies.map(dep => this.resolve(dep));
    const instance = new provider.implementation(...dependencies);

    return instance;
  }
}

export namespace Registry {
  export type Provider = {
    implementation: Constructor;
    dependencies: Constructor[];
  }
}
