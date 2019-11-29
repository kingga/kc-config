import IConfigLoaderFactory from '../contracts/IConfigLoaderFactory';
import IConfigLoader from '../contracts/IConfigLoader';
import JsonConfigLoader from './JsonConfigLoader';
import YamlConfigLoader from './YamlConfigLoader';
import EnvConfigLoader from './EnvConfigLoader';

export default class ConfigLoaderFactory implements IConfigLoaderFactory {
    public make(file: string): IConfigLoader {
        // Get the extension of the file an pick the appropiate loader.
        const ext = file.split('.').pop().toLowerCase();

        switch (ext) {
            case 'json':
                return new JsonConfigLoader();
            case 'yaml':
                return new YamlConfigLoader();
            case 'env':
                return new EnvConfigLoader();
            default:
                throw new Error(`Unkown configuration file type ${ext}!`);
        }
    }
}
