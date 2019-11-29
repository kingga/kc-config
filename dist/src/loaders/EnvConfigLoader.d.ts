import IConfigLoader from '../contracts/IConfigLoader';
export default class JsonConfigLoader implements IConfigLoader {
    load(file: string): any;
}
