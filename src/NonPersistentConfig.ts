import IConfig, { FlatMap } from './contracts/IConfig';
import { IContainer } from '@kingga/kc-container';
import List from './types/List';
import IConfigLoaderFactory from './contracts/IConfigLoaderFactory';
import ConfigLoaderFactory from './loaders/ConfigLoaderFactory';

export default class NonPersistentConfig implements IConfig {
    protected config: object;

    protected container: IContainer;

    public constructor(configs: List<object>, container: IContainer) {
        this.container = container;
        this.config = {};

        // Create bindings to the container.
        if (!this.container.make('IConfigLoaderFactory')) {
            this.container.bind<IConfigLoaderFactory>('IConfigLoaderFactory', () => {
                return new ConfigLoaderFactory();
            });
        }

        for (const [name, config] of Object.entries(configs)) {
            this.loadConfig(name, config);
        }
    }

    public get(key: string, defaultValue?: any): any {
        let v: any;

        try {
            v = this.scanConfig(this.config, key.split('.'));
        } catch (_e) {
            return defaultValue;
        }

        return v;
    }

    public set(key: string, value: any): void {
        const steps = key.split('.');
        let obj = this.config;
        let idx = 0;

        // Loop through each key and if the key doesn't exist create a new object
        // and move into it.
        while (idx < steps.length - 1) {
            if (!obj[steps[idx]]) {
                obj[steps[idx]] = {};
            }

            obj = obj[steps[idx]];
            idx++;
        }

        // Set the value at the end of the array.
        if (!obj[idx]) {
            obj[steps[idx]] = value;
        }
    }

    public has(key: string): boolean {
        try {
            this.scanConfig(this.config, key.split('.'));
        } catch (_e) {
            return false;
        }

        return true;
    }

    public loadConfig(root: string, config: any): void {
        this.config[root] = config;
    }

    public loadFile(key: string): void {
        const filename = key.split('\\').pop().split('/').pop();
        const loader = this.container.make<IConfigLoaderFactory>('IConfigLoaderFactory');

        this.loadConfig(filename.split('.')[0], loader.make(filename).load(key));
    }

    public flatten(): FlatMap {
        return this.flattenObject(this.config);
    }

    protected flattenObject(obj: object, prefix: string = ''): object {
        return Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';

            if (typeof obj[k] === 'object') {
                Object.assign(acc, this.flattenObject(obj[k], pre + k));
            } else {
                acc[pre + k] = obj[k];
            }

            return acc;
        }, {});
    }

    protected scanConfig(config: object, keys: string[]): any {
        keys.forEach((k: string) => {
            if (typeof config[k] !== 'undefined') {
                config = config[k];
            } else {
                throw new Error('The key doesn\'t exist.');
            }
        });

        return config;
    }
}
