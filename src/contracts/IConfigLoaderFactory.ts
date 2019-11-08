import IConfigLoader from './IConfigLoader';

export default interface IConfigLoaderFactory {
    make(file: string): IConfigLoader;
}
