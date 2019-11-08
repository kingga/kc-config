import path from 'path';
import { strictEqual } from 'assert';
import IConfig from '../src/contracts/IConfig';
import List from '../src/types/List';
import NonPersistentConfig from '../src/NonPersistentConfig';
import Container from '@kingga/kc-container/src/Container';

const getSampleConfigFile = (): string => {
    return path.resolve(__dirname, './data/sample-config.json');
};

const getSampleConfig = () => {
    return require(getSampleConfigFile());
};

const createConfig = (configs?: List<any>): IConfig => {
    const container = new Container();

    return new NonPersistentConfig(configs, container);
};

describe('Non Persistent Configuration', () => {
    it('can load the sample configuration file', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        strictEqual(config.get('foo'), sampleConfig.foo);
    });

    it('can get a default value when the key is missing', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        strictEqual(config.get('missing', 123), 123);
    });

    it('can get a value which is nested a few layers deep', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        strictEqual(config.get('faz.baz.woo'), sampleConfig.faz.baz.woo);
    });

    it('can load a file after the creation of the configuration', () => {
        const config = createConfig();
        const sampleConfig = getSampleConfig();
        config.loadFile(getSampleConfigFile());

        strictEqual(config.get('number'), sampleConfig.number);
    });

    it('can load an object after the creation', () => {
        const config = createConfig();
        const sampleConfig = getSampleConfig();
        config.loadConfig('sample', sampleConfig);

        strictEqual(config.get('boolean'), sampleConfig.boolean);
    });

    it('can load boolean types', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        strictEqual(config.get('boolean'), sampleConfig.boolean);
    });

    it('can get a value which is not at the end of it\'s chain', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        strictEqual(config.get('faz.baz'), sampleConfig.faz.baz);
    });

    it('can update a value in the configuration', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        config.set('foo', 'bar-modified');

        strictEqual(config.get('foo'), 'bar-modified');
    });

    it('can update a value which is a few layers deep in the configuration', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        config.set('faz.baz.woo', 'changed');

        strictEqual(config.get('faz.baz.woo'), 'changed');
    });

    it('can update a value which is not at the end of it\'s chain', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });
        const update = { changed: 'me' };

        config.set('faz.baz', update);

        strictEqual(config.get('faz.baz'), update);
    });

    it('can find an existing value', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        strictEqual(config.has('faz.baz'), true);
    });

    it('cannot find a value when it doesn\'t exist', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig([sampleConfig]);

        strictEqual(config.has('missing'), false);
    });

    it('can flatten multiple configs', () => {
        const c1 = { a: 'b', b: false, c: 123 };
        const c2 = { d: { e: { f: true } } };
        const config = createConfig({ c1, c2 });

        strictEqual(config.flatten(), {
            'a': 'b',
            'b': false,
            'c': 123,
            'd.e.f': true,
        });
    });
});
