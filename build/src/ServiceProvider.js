"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NonPersistentConfig_1 = require("./NonPersistentConfig");
const ConfigLoaderFactory_1 = require("./loaders/ConfigLoaderFactory");
class ServiceProvider {
    constructor(container) {
        this.container = container;
    }
    register() {
        this.container.bind('IConfig', (c) => new NonPersistentConfig_1.default({}, c));
        this.container.bind('IConfigLoaderFactory', () => new ConfigLoaderFactory_1.default());
    }
}
exports.default = ServiceProvider;
