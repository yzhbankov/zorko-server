const util = require('util');
const fs = require('fs');
const rimraf = require('rimraf');
const vl = require('vega-lite');
const _ = require('lodash');

const fsReaddir = util.promisify(fs.readdir);
const fsReadFile = util.promisify(fs.readFile);
const fsRimRaf = util.promisify(rimraf);

const readFileNames = async path => fsReaddir(path);
const readFile = async path => fsReadFile(path);
const removeAllFilesInFolder = async folder => fsRimRaf(`${folder}/*`);

const SEEDS_SPECS_PATH = `${__dirname}/seeds/specs/vega-lite`;
const SEEDS_PREVIEWS_PATH = `${__dirname}/seeds/previews/vega-lite`;

const getSpecFilePath = fileName => `${SEEDS_SPECS_PATH}/${fileName}`;
// const getPreviewFilePath = fileName => `${SEEDS_PREVIEWS_PATH}/${fileName}`;

const readSpecs = async () => {
    let specs = [];
    try {
        const filenames = await readFileNames(SEEDS_SPECS_PATH);
        const fileBuffers = await Promise.all(filenames.map(filename => readFile(getSpecFilePath(filename))));
        specs = fileBuffers.map(buffer => JSON.parse(buffer.toString()));
    } catch (e) {
        console.error(e);
    }
    return specs;
};

const generatePreviews = async () => {
    try {
        let filenames = await readFileNames(SEEDS_PREVIEWS_PATH);
        if (filenames.length > 0) {
            await removeAllFilesInFolder(SEEDS_PREVIEWS_PATH);
        }
        let specs = await readSpecs();
        filenames = await readFileNames(SEEDS_SPECS_PATH);

        specs = specs.reduce((memo, spec, index) => ({
            ...memo,
            [filenames[index]]: spec,
        }), {});

        specs = _.map(specs, (val, key) => {
            let spec;
            try {
                spec = vl.compile(val).spec;
            } catch (e) {
                console.error(e);
            }
            return {
                [key]: spec,
            };
        });
        console.log(specs);
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    generatePreviews,
    readSpecs,
};

