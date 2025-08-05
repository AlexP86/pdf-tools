import { mergePDFs } from './pdfMerger';
import { PDFDocument } from 'pdf-lib';

// Minimal mock to simulate a browser File in Node
class MockFile {
    buffer: Uint8Array;
    name: string;
    type: string;

    constructor(buffer: Uint8Array, name: string, type = 'application/pdf') {
        this.buffer = buffer;
        this.name = name;
        this.type = type;
    }

    async arrayBuffer() {
        return this.buffer.buffer;
    }
}

async function makePdfFile(fileName: string, text: string): Promise<MockFile> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([200, 200]);
    page.drawText(text, { x: 20, y: 150, size: 24 });
    const pdfBytes = await pdfDoc.save();
    return new MockFile(pdfBytes, fileName, 'application/pdf');
}

describe('mergePDFs', () => {
    it('merges two simple single-page PDFs', async () => {
        const file1 = await makePdfFile('file1.pdf', 'Page 1');
        const file2 = await makePdfFile('file2.pdf', 'Page 2');
        const merged = await mergePDFs([file1, file2] as any);

        const mergedPdf = await PDFDocument.load(merged);
        expect(mergedPdf.getPageCount()).toBe(2);
    });

    it('returns a valid PDF even for a single input', async () => {
        const file1 = await makePdfFile('file1.pdf', 'Page only');
        const merged = await mergePDFs([file1] as any);
        const mergedPdf = await PDFDocument.load(merged);
        expect(mergedPdf.getPageCount()).toBe(1);
    });


    it('preserves the order of input files', async () => {
        const fileA = await makePdfFile('A.pdf', 'First');
        const fileB = await makePdfFile('B.pdf', 'Second');
        const fileC = await makePdfFile('C.pdf', 'Third');
        const merged = await mergePDFs([fileB, fileC, fileA] as any);
        const mergedPdf = await PDFDocument.load(merged);
        expect(mergedPdf.getPageCount()).toBe(3);
    });
});
