import { getEmbeddings } from "./embeddings";
import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";

export const getPineconeClient = async () => {
  return new Pinecone({
    environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT!,
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  });
};

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = await getPineconeClient();

  const index = pinecone.Index("chatpdf");

  try {
    const namespace = index.namespace(convertToAscii(fileKey));

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult?.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  try {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings!, fileKey);

    const qualifyingDocs = matches.filter(
      (match) => match.score && match.score > 0.7
    );

    type Metadata = {
      text: string;
      pageNumber: number;
    };
    let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
    // 5 vectors
    return docs.join("\n").substring(0, 3000);
  } catch (error) {
    console.log("error getContext", error);
    throw error;
  }
}
