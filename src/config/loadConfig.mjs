import { getJsonData } from '#helpers/helpers.mjs';
const config = await getJsonData('./src/config/config.json');

export default config;