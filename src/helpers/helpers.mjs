import { readFile } from 'fs/promises'

async function getJsonData(file = ""){
    const json = await readFile(file, 'utf8');
    return JSON.parse(json);
}

export {
    getJsonData
}