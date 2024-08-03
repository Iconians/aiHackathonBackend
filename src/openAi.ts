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
      { role: "user", content: `Estimate the value of a property with the following features: ${JSON.stringify(query)} and similar properties ${JSON.stringify(similarInDatabase)} without talking about similar properties` },
    ],
    max_tokens: 200,
  });
  // console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}

export async function rankProperties(properties: object[], query: any) {
  const response = await configuration.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      // { role: "user", content: `Estimate the Relevance of similar properties ${properties} with the query data ${query} with a score of 1 to 10 and return an array of objects of the most relevant properties` },
      { role: "user", content: `Estimate the relevance of the following properties: ${JSON.stringify(properties)} to the query: ${JSON.stringify(query)}. Return an array of objects, each containing the property and its relevance score, sorted by relevance score in descending order. The format should be a JSON array of objects.` },
    ],
    max_tokens: 400,
  });

  const rawContent = response.choices[0].message.content;

  try {
    if (!rawContent || rawContent.trim().length === 0) {
      console.error('No content in response:', response);
      return [];
    }
    // const jsonStart = rawContent.indexOf('[');
    // const jsonEnd = rawContent.lastIndexOf(']') + 1;
    // console.log("Json Start Index",jsonStart);
    // console.log("Json end index", jsonEnd);
    const jsonStringMatch = rawContent.match(/\[\s*{[\s\S]*}\s*]/);

    // if (jsonStart === -1 || jsonEnd === 0) {
    //   console.error('No JSON content in response:', rawContent);
    //   return [];
    // }
    if (!jsonStringMatch) {
      console.error('No JSON content in response:', rawContent);
      return [];
    }
    // const jsonString = rawContent.slice(jsonStart, jsonEnd).trim();
    const jsonString = jsonStringMatch[0].trim();
    console.log("Extracted Json String",jsonString);
    const rankedProperties =  JSON.parse(jsonString);

    console.log("parsed response", rankedProperties);
    return rankedProperties;
  } catch (error) {
    console.error('Error parsing response:', error);
    return [];
  }
}