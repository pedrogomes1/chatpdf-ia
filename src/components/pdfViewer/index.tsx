interface PDFViewProps {
  pdfUrl: string;
}

export default function PdfViewer({ pdfUrl }: PDFViewProps) {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
      className="w-full h-full"
    ></iframe>
  );
}
