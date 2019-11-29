import IConfig, { FlatMap } from './contracts/IConfig';
import { IContainer } from '@kingga/kc-container';
import List from './types/List';
export default class NonPersistentConfig implements IConfig {
    protected config: object;
    protected container: IContainer;
    constructor(configs: List<object>, container: IContainer);
    get(key: string, defaultValue?: any): any;
    set(key: string, value: any): void;
    has(key: string): boolean;
    loadConfig(root: string, config: any): void;
    loadFile(key: string): void;
    flatten(): FlatMap;
    protected flattenObject(obj: object, prefix?: string): object;
    protected scanConfig(config: object, keys: string[]): any;
}
