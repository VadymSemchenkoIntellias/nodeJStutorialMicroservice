import JsonRefs from 'json-refs';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// // Load your main file
// let root = YAML.load(path.resolve(__dirname, './api/users/docs/main.yaml'));

// Load all other files and add them to the main file
const files = [
    '../api/users/controllers/create/docs.yaml',
    '../api/users/docs/schemas.yaml'
    //   './api/users/controllers/login/docs.yaml',
    //   './api/users/controllers/logout/docs.yaml',
];

let root = {};

files.forEach((file) => {
    const data = YAML.load(path.resolve(__dirname, file));
    root = { ...root, ...data };
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
