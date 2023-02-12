const config = require('../config/config');
const {Configuration, OpenAIApi} = require('openai');

const configuration = new Configuration({
    organization: config.chatGpt.organizationId,
    apiKey: config.chatGpt.apiKey,
});

const openai = new OpenAIApi(configuration);

module.exports = {
    openai,
}