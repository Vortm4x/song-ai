const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

async function generateSongLyrics(prompt, rows=10) {
  const completion = await openai.createCompletion({
    model: 'text-ada-001',
    prompt: `Imagine you are a songwriter. Generate song lyrics about ${prompt}. Give all song lyrisc, every row, separated by linebrake.`,
    n: rows,
    temperature: 0.6,
  });

  const choices = completion.data.choices;
  const songLyrics = choices.map(choice => choice.text);

  return songLyrics;
}

module.exports = { generateSongLyrics };