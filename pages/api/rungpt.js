import { Configuration, OpenAIApi } from 'openai'

//  apiKey: "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",
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt missing" });
  }

  if (prompt.length > 100) {
    return res.status(400).json({ error: "Prompt too long" });
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Create a cringy motivational quote based on the following topic.\n
    Topic: ${prompt}\n
    Cringy motivational quote:`,
    max_tokens: 500,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const quote = completion.data.choices[0].text;

  res.status(200).json({ quote });
};