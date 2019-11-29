"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
class JsonConfigLoader {
    load(file) {
        return dotenv_1.config({ path: file }).parsed;
    }
}
exports.default = JsonConfigLoader;
