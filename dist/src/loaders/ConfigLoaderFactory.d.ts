import IConfigLoaderFactory from '../contracts/IConfigLoaderFactory';
import IConfigLoader from '../contracts/IConfigLoader';
export default class ConfigLoaderFactory implements IConfigLoaderFactory {
    make(file: string): IConfigLoader;
}
