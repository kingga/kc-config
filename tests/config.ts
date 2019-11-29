import { resolve as resolvePath } from 'path';
import { assert, expect } from 'chai';
import IConfig from '../src/contracts/IConfig';
import List from '../src/types/List';
import NonPersistentConfig from '../src/NonPersistentConfig';
import Container from '@kingga/kc-container';

const getSampleConfigFile = (): string => {
    return resolvePath(__dirname, './data/sample-config.json');
};

const getSampleConfig = () => {
    return require(getSampleConfigFile());
};

const createConfig = (configs?: List<object>): IConfig => {
    const container = new Container();

    return new NonPersistentConfig(configs || {}, container);
};

describe('Non Persistent Configuration', () => {
    it('can load the sample configuration file', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        assert.strictEqual(config.get('sample.foo'), sampleConfig.foo);
    });

    it('can get a default value when the key is missing', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        assert.strictEqual(config.get('sample.missing', 123), 123);
    });

    it('can get a value which is nested a few layers deep', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        assert.strictEqual(config.get('sample.faz.baz.woo'), sampleConfig.faz.baz.woo);
    });

    it('can load a file after the creation of the configuration', () => {
        const config = createConfig();
        const sampleConfig = getSampleConfig();
        config.loadFile(getSampleConfigFile());

        assert.strictEqual(config.get('sample-config.number'), sampleConfig.number);
    });

    it('can load an object after the creation', () => {
        const config = createConfig();
        const sampleConfig = getSampleConfig();
        config.loadConfig('sample', sampleConfig);

        assert.strictEqual(config.get('sample.boolean'), sampleConfig.boolean);
    });

    it('can load boolean types', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        assert.strictEqual(config.get('sample.boolean'), sampleConfig.boolean);
    });

    it('can get a value which is not at the end of it\'s chain', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        assert.strictEqual(config.get('sample.faz.baz'), sampleConfig.faz.baz);
    });

    it('can update a value in the configuration', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        config.set('sample.foo', 'bar-modified');

        assert.strictEqual(config.get('sample.foo'), 'bar-modified');
    });

    it('can update a value which is a few layers deep in the configuration', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        config.set('sample.faz.baz.woo', 'changed');

        assert.strictEqual(config.get('sample.faz.baz.woo'), 'changed');
    });

    it('can update a value which is not at the end of it\'s chain', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });
        const update = { changed: 'me' };

        config.set('sample.faz.baz', update);

        assert.strictEqual(config.get('sample.faz.baz'), update);
    });

    it('can find an existing value', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        assert.strictEqual(config.has('sample.faz.baz'), true);
    });

    it('cannot find a value when it doesn\'t exist', () => {
        const sampleConfig = getSampleConfig();
        const config = createConfig({ sample: sampleConfig });

        assert.strictEqual(config.has('sample.missing'), false);
    });

    it('can flatten multiple configs', () => {
        const c1 = { a: 'b', b: false, c: 123 };
        const c2 = { d: { e: { f: true } } };
        const config = createConfig({ c1, c2 });

        assert.notStrictEqual(config.flatten(), {
            'c1.a': 'b',
            'c1.b': false,
            'c1.c': 123,
            'c2.d.e.f': true,
        });
    });

    it('can set a value which is not yet set', () => {
        const config = createConfig();
        config.set('foo.bar', true);

        expect(config.get('foo.bar')).to.be.true;
    });

    it('can load an env file', () => {
        const config = createConfig();
        config.loadFile(resolvePath(__dirname, './data/sample-config.env'));

        expect(config.get('sample-config.FAZ')).to.equal('5');
        expect(config.get('sample-config.BAR')).to.equal('true');
    });

    it('can load a yaml file', () => {
        const config = createConfig();
        config.loadFile(resolvePath(__dirname, './data/sample-config.yaml'));

        expect(config.get('sample-config.foo')).to.be.true;
        expect(config.get('sample-config.faz.bar')).to.equal(2);
    });

    it('should throw an exception when a file is loaded with an unkown format', () => {
        const config = createConfig();
        expect(() => {
            config.loadFile(resolvePath(__dirname, './some/unkown/file.format'))
        }).to.throw;
    });
});
