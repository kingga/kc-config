# Kings Collection Configuration Container
[![Build Status](https://travis-ci.com/kingga/kc-config.svg?branch=master)](https://travis-ci.com/kingga/kc-config)

A configuration container which can load configurations from multiple configuration file types. These include:

- JSON
- YAML
- DotEnv

## Installation
### Yarn
`yarn add @kingga/kc-config`

### NPM
`npm i @kingga/kc-config`

## Usage
```yaml
host: localhost
port: 999
user: root
pass: secret
database: db1
```

```ts
import Container from '@kingga/kc-container';
import ConfigServiceProvider, { IConfig } from '@kingga/kc-config';
import { resolve } from 'path';

const container = new Container();
const provider = new ConfigServiceProvider(container);
provider.register();

const config = container.make<IConfig>('IConfig');
config.loadFile(resolve(__dirname, './configs/db.yaml'));

// Some third party library.
db.createConnection({
    host: config.get('db.host', 'localhost'),
    port: config.get('db.port', 3306),
    user: config.get('db.user', 'root'),
    pass: config.get('db.pass', ''),
    database: config.get('db.database'),
});
```
