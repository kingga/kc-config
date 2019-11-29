"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
class JsonConfigLoader {
    load(file) {
        return js_yaml_1.safeLoad(fs_1.readFileSync(file, 'utf8').toString());
    }
}
exports.default = JsonConfigLoader;
