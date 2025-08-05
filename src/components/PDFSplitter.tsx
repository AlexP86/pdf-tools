import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import {
    Button,
    Stack,
    Typography,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemText,
    Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPdfPageIndices, splitPdfByPages } from '../lib/pdfSplitter';

type PageBlob = { pageIndex: number; blob: Blob };

const PDFSplitter: React.FC = () => {
    const MAX_FILE_SIZE_MB = 1;   // Max size for a file (MB)

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pages, setPages] = useState<number[]>([]);
    const [pageBlobs, setPageBlobs] = useState<PageBlob[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [zipUrl, setZipUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPdfFile(file || null);
        setPages([]);
        setPageBlobs([]);
        setError(null);
        setZipUrl(null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        let warningMessage = '';
        if (file) {
            if(file.size > MAX_FILE_SIZE_MB * 1024 * 1024){
                warningMessage= `Processing might take some time. \n File size is large ${file.size}`;
            }

            setWarning(warningMessage);
            try {
                const indices = await getPdfPageIndices(file);
                setPages(indices);
            } catch {
                setError('Failed to read PDF.');
            }
        }
    };

    const removePage = (idx: number) => {
        setPages((prev) => prev.filter((pageIdx) => pageIdx !== idx));
    };

    useEffect(() => {
        const generateBlobs = async () => {
            if (!pdfFile || pages.length === 0) {
                setPageBlobs([]);
                setZipUrl(null);
                return;
            }
            try {
                const blobs = await splitPdfByPages(pdfFile, pages);
                setPageBlobs(blobs);
                setZipUrl(null);
            } catch {
                setError('Failed to split pages.');
            }
        };

        generateBlobs();

        return () => {
            if (zipUrl) URL.revokeObjectURL(zipUrl);
        };

    }, [pdfFile, pages]);

    const clearAll = () => {
        setPdfFile(null);
        setPages([]);
        setPageBlobs([]);
        setError(null);
        setWarning(null);
        setZipUrl(null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    // Download all pages as a zip
    const handleDownloadAll = async () => {
        if (!pageBlobs.length) return;
        const zip = new JSZip();

        pageBlobs.forEach(({ pageIndex, blob }) => {
            zip.file(`Page-${pageIndex + 1}.pdf`, blob);
        });

        const zipContent = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipContent);
        setZipUrl(url);

        // Auto-trigger download
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = url;
            link.download = 'pages.zip';
            link.click();
        }, 0);
    };

    return (
        <Stack spacing={2} alignItems="center">
            <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
            >
                Select PDF
                <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFile}
                    ref={inputRef}
                />
            </Button>

            {pdfFile && (
                <Stack sx={{ width: '100%' }} spacing={1}>
                    <Paper variant="outlined" sx={{ maxHeight: 250, overflow: 'auto', p: 0 }}>
                        {pages.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                                No pages to show.
                            </Typography>
                        ) : (
                            <List dense sx={{ p: 0 }}>
                                {pages.map((idx) => (
                                    <ListItem
                                        key={idx}
                                        divider
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => removePage(idx)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={`Page ${idx + 1}`} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Button variant="outlined" color="secondary" onClick={clearAll}>
                            Clear all
                        </Button>
                    </Stack>
                </Stack>
            )}

            {error && <Alert severity="error">{error}</Alert>}
            {warning && <Alert severity="warning" sx={{ whiteSpace: 'pre-line' }}>{warning}</Alert>}


            {pageBlobs.length > 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadAll}
                >
                    Download All Pages as ZIP
                </Button>
            )}

            <Typography variant="body2" color="text.secondary" align="center">
                Your files stay private and never leave your browser.
            </Typography>
        </Stack>
    );
};

export default PDFSplitter;
