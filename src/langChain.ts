import { config } from "dotenv";
import { DocumentInterface } from "@langchain/core/documents"
import { OpenAI } from "@langchain/openai";
import { RetrievalQAChain } from '@langchain/chains';
import { StaticRetriever } from 'langchain/retriever';

config();

const openAiKey = process.env.OPEN_AI_KEY

if (!openAiKey) {
  throw new Error('OpenAI API key not found');
}

const configuration = new OpenAI({
  configuration: {
    apiKey: process.env.LANGCHAIN_API_KEY
  }
});

export const processPropertyData = async (data: any) => {
  const summarizeChain = RetrievalQA(data);
  console.log(summarizeChain);
  const result = await summarizeChain.run({
    llm: configuration,
    chainType: "refine"
  });
}
