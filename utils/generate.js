const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

async function generateSongLyrics(prompt, rows) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `
Generate song lyrics about ${prompt}. 
Song size sholud be ${rows} rows. 
Every completion is separate song row. 
Every row should be separated by linebrake. 
Provide the lyrics without any extra information.`,
    temperature: 0.6,
    max_tokens: 1000,
  });

  const choices = completion.data.choices;
  const songLyrics = choices.map(choice => choice.text);

  return songLyrics;
}

module.exports = { generateSongLyrics };