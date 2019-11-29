"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigLoaderFactory_1 = require("./loaders/ConfigLoaderFactory");
class NonPersistentConfig {
    constructor(configs, container) {
        this.container = container;
        this.config = {};
        // Create bindings to the container.
        if (!this.container.make('IConfigLoaderFactory')) {
            this.container.bind('IConfigLoaderFactory', () => {
                return new ConfigLoaderFactory_1.default();
            });
        }
        for (const [name, config] of Object.entries(configs)) {
            this.loadConfig(name, config);
        }
    }
    get(key, defaultValue) {
        let v;
        try {
            v = this.scanConfig(this.config, key.split('.'));
        }
        catch (_e) {
            return defaultValue;
        }
        return v;
    }
    set(key, value) {
        const steps = key.split('.');
        let obj = this.config;
        let idx = 0;
        // Loop through each key and if the key doesn't exist create a new object
        // and move into it.
        while (idx < steps.length - 1) {
            if (!obj[steps[idx]]) {
                obj[steps[idx]] = {};
            }
            obj = obj[steps[idx]];
            idx++;
        }
        // Set the value at the end of the array.
        if (!obj[idx]) {
            obj[steps[idx]] = value;
        }
    }
    has(key) {
        try {
            this.scanConfig(this.config, key.split('.'));
        }
        catch (_e) {
            return false;
        }
        return true;
    }
    loadConfig(root, config) {
        this.config[root] = config;
    }
    loadFile(key) {
        const filename = key.split('\\').pop().split('/').pop();
        const loader = this.container.make('IConfigLoaderFactory');
        this.loadConfig(filename.split('.')[0], loader.make(filename).load(key));
    }
    flatten() {
        return this.flattenObject(this.config);
    }
    flattenObject(obj, prefix = '') {
        return Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object') {
                Object.assign(acc, this.flattenObject(obj[k], pre + k));
            }
            else {
                acc[pre + k] = obj[k];
            }
            return acc;
        }, {});
    }
    scanConfig(config, keys) {
        keys.forEach((k) => {
            if (typeof config[k] !== 'undefined') {
                config = config[k];
            }
            else {
                throw new Error('The key doesn\'t exist.');
            }
        });
        return config;
    }
}
exports.default = NonPersistentConfig;
