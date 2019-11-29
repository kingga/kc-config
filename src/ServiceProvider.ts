import IContainer from '@kingga/kc-container/src/contracts/IContainer';
import NonPersistentConfig from './NonPersistentConfig';
import IConfig from './contracts/IConfig';
import IConfigLoaderFactory from './contracts/IConfigLoaderFactory';
import ConfigLoaderFactory from './loaders/ConfigLoaderFactory';

export default class ServiceProvider {
    protected container: IContainer;

    public constructor(container: IContainer) {
        this.container = container;
    }

    register(): void {
        this.container.bind<IConfig>('IConfig', (c: IContainer) => new NonPersistentConfig([], c));
        this.container.bind<IConfigLoaderFactory>('IConfigLoaderFactory', () => new ConfigLoaderFactory());
    }
}
