import {
  Pinecone,
  Vector,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import md5 from "md5";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

export const getPineconeClient = async () => {
  return new Pinecone({
    environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT!,
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  });
};

export async function loadS3IntoPinecone(fileKey: string) {
  //get pdf -> download and read from pdf

  try {
    const file_name = (await downloadFromS3(fileKey)) as string;

    if (!file_name) {
      throw new Error("Could not download from S3");
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));

    //  vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    //  upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index("chatpdf");

    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    await namespace.upsert(vectors as PineconeRecord<RecordMetadata>[]);

    return documents[0];
  } catch (error) {
    console.log("error pinecone", error);
    return error;
  }
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as Vector;
  } catch (error) {
    console.error("error embedding document", error);
  }
}

export const truncateStringByBytes = (string: string, bytes: number) => {
  const encode = new TextEncoder();

  return new TextDecoder("utf-8").decode(encode.encode(string).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/\n/g, "");

  const splitter = new RecursiveCharacterTextSplitter();

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
