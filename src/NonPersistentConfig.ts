import IConfig from './contracts/IConfig';
import IContainer from '@kingga/kc-container/src/contracts/IContainer';
import List from './types/List';

export default class NonPersistentConfig implements IConfig {
    protected config: object;

    protected container: IContainer;

    public constructor(configs: List<any>, container: IContainer) {
        this.container = container;
        this.container.bind<IConfig>('IConfig', () => this);
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
        let loc = this.config;
        const steps = key.split('.');

        steps.forEach((step: string) => {
            loc = loc[step];
        });

        loc = value;
    }

    public has(key: string): boolean {
        try {
            this.scanConfig(this.config, key.split('.'));
        } catch (_e) {
            return false;
        }

        return true;
    }

    public loadFile(key: string): void {

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
