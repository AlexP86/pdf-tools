import { PDFDocument } from 'pdf-lib';

export type SplitPageBlob = { pageIndex: number; blob: Blob };

export async function splitPdfByPages(
    file: File,
    pageIndices?: number[]
): Promise<SplitPageBlob[]> {
    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);

    const allIndices = pageIndices ?? Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i);
    const result: SplitPageBlob[] = [];

    for (const pageIndex of allIndices) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        result.push({ pageIndex, blob });
    }

    return result;
}

export async function getPdfPageIndices(file: File): Promise<number[]> {
    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    return Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i);
}
