import IConfigLoader from '../contracts/IConfigLoader';

export default class JsonConfigLoader implements IConfigLoader {
    public load(file: string): any {
        return require(file);
    }
}
