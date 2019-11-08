export interface FlatMap {
    [key: string]: any;
}

export default interface IConfig {
    get(key: string, defaultValue?: any): any;
    set(key: string, defaultValue?: any): void;
    has(key: string): boolean;
    loadFile(file: string): void;
    loadConfig(root: string, config: any): void;
    flatten(): FlatMap;
}
