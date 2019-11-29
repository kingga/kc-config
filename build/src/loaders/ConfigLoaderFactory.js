"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonConfigLoader_1 = require("./JsonConfigLoader");
const YamlConfigLoader_1 = require("./YamlConfigLoader");
const EnvConfigLoader_1 = require("./EnvConfigLoader");
class ConfigLoaderFactory {
    make(file) {
        // Get the extension of the file an pick the appropiate loader.
        const ext = file.split('.').pop().toLowerCase();
        switch (ext) {
            case 'json':
                return new JsonConfigLoader_1.default();
            case 'yaml':
                return new YamlConfigLoader_1.default();
            case 'env':
                return new EnvConfigLoader_1.default();
            default:
                throw new Error(`Unkown configuration file type ${ext}!`);
        }
    }
}
exports.default = ConfigLoaderFactory;
