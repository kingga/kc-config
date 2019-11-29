import IConfigLoader from '../contracts/IConfigLoader';
import { config } from 'dotenv';

export default class JsonConfigLoader implements IConfigLoader {
    public load(file: string): any {
        return config({ path: file }).parsed;
    }
}
