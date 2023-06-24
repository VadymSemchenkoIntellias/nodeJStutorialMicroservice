import JsonRefs from 'json-refs';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import set from 'lodash.set';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const controllers = [
    '../api/users/controllers/create/docs.yaml',
    '../api/users/controllers/login/docs.yaml',
];

const schemas = [
    '../api/users/docs/schemas.yaml'
]

let root = {};

controllers.forEach((file) => {
    const data = YAML.load(path.resolve(__dirname, file));
    set(root, 'paths', { ...root.paths, ...data.paths });
});

schemas.forEach((file) => {
    const data = YAML.load(path.resolve(__dirname, file));
    set(root, 'components', { ...root.components, ...data.components });
});

// Resolve references
JsonRefs.resolveRefs(root)
    .then(function (results) {
        // Write result to bundled.yaml file
        const dump = YAML.stringify(results.resolved, 8, 2);
        fs.writeFileSync('./api/docs/bundled.yaml', dump);
    })
    .catch(function (err) {
        console.error(err.stack);
    });
