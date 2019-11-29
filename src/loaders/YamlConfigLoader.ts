import IConfigLoader from '../contracts/IConfigLoader';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';

export default class JsonConfigLoader implements IConfigLoader {
    public load(file: string): any {
        return safeLoad(readFileSync(file, 'utf8').toString());
    }
}
