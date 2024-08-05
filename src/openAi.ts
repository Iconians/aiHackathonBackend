import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const configuration = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const getEstimatedValue = async (query: unknown, similarInDatabase: object[]) => {
  const response = await configuration.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: "user", content: `Estimate the value of a property with the following features: ${JSON.stringify(query)} and similar properties ${JSON.stringify(similarInDatabase)} without talking about similar properties. always give a rough number in the estimate` },
    ],
    max_tokens: 200,
  });
  return response.choices[0].message.content;
}

export async function rankProperties(properties: object[], query: any) {
  const response = await configuration.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: "user", content: `Estimate the relevance of the following properties: ${JSON.stringify(properties)} to the query: ${JSON.stringify(query)}. Return an array of objects, each containing the property and its relevance score, sorted by relevance score in descending order. The format should be a JSON array of objects as it will be parsed, no extra characters` },
    ],
    max_tokens: 600,
  });

  const rawContent = response.choices[0].message.content;

  try {
    if (!rawContent || rawContent.trim().length === 0) {
      console.error('No content in response:', response);
      return [];
    }
    const jsonStringMatch = rawContent.match(/\[\s*{[\s\S]*}\s*]/);
    
    if (!jsonStringMatch) {
      console.error('No JSON content in response:', rawContent);
      return [];
    }
    
    const rankedProperties =  JSON.parse(jsonStringMatch[0].trim());

    return rankedProperties;
  } catch (error) {
    console.error('Error parsing response:', error);
    return [];
  }
}