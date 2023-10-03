import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY!,
});

const openai = new OpenAIApi(config);

// Convert text in a vector
export async function getEmbeddings(text: String) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });

    const result = await response.json();
    return result.data[0].embedding as number[];
  } catch (error) {
    console.error("error calling openai embeddings api", error);
    throw error;
  }
}
