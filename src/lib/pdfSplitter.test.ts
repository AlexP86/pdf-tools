import { splitPdfByPages } from './pdfSplitter.ts';
import { PDFDocument } from 'pdf-lib';

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

describe('splitPDFs', () => {
    it('splits a two-page PDF into separate blobs', async () => {
        // Make a two-page PDF
        const pdfDoc = await PDFDocument.create();
        pdfDoc.addPage([200, 200]);
        pdfDoc.addPage([200, 200]);
        const pdfBytes = await pdfDoc.save();
        const file = new MockFile(pdfBytes, 'test.pdf');

        const result = await splitPdfByPages(file as any);

        expect(result.length).toBe(2);
    });

});
