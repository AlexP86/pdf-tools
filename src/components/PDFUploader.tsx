import React, { useState, useRef } from 'react';
import {
    Button,
    Stack,
    Typography,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { mergePDFs } from '../lib/pdfMerger';

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

function SortableListItem(props: {
    file: File;
    idx: number;
    onRemove: (idx: number) => void;
    id: string;
}) {
    const { file, idx, onRemove, id } = props;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    return (
        <ListItem
            ref={setNodeRef}
            divider
            secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onRemove(idx)}>
                    <DeleteIcon />
                </IconButton>
            }
            sx={{
                background: isDragging ? '#f0f0ff' : undefined,
                userSelect: 'none',
                transition,
                transform: CSS.Transform.toString(transform),
            }}
            {...attributes}
        >
            <IconButton
                edge="start"
                aria-label="drag"
                {...listeners}
                sx={{
                    cursor: 'grab',
                    mr: 2,
                }}
            >
                <DragIndicatorIcon />
            </IconButton>
            <ListItemText primary={file.name} />
        </ListItem>
    );
}

const PDFUploader: React.FC = () => {
    const MAX_FILES = 50;            // Max number of files allowed
    const MAX_TOTAL_SIZE_MB = 1024;    // Max total size of all files (MB)

    const [files, setFiles] = useState<File[]>([]);
    const [merging, setMerging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files ? Array.from(event.target.files) : [];
        const allFiles = [...files, ...newFiles];


        let warningMessage = '';
        if (allFiles.length > MAX_FILES) {
            warningMessage = `You selected more than ${MAX_FILES} files.\n`;
        }

        const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);
        if (totalSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
            warningMessage += `Total size of all files is very large ${totalSize} bytes.`
        }

        if(warningMessage){
            warningMessage = `Processing might take some time. \n` + warningMessage;
        }

        setWarning(warningMessage);
        setFiles(allFiles);
        if (inputRef.current) inputRef.current.value = '';
    };


    const handleRemove = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
        setError(null);
        setWarning(null);
    };

    const handleClearAll = () => {
        setFiles([]);
        setError(null);
        setWarning(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleMergeAndDownload = async () => {
        if (files.length < 2) {
            setError('Please select at least 2 PDF files.');
            return;
        }
        setError(null);
        setWarning(null);
        setMerging(true);
        try {
            const mergedBytes = await mergePDFs(files);
            const pdfBlob = new Blob([mergedBytes], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'merged.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
        } catch (err) {
            console.error(err);
            setError('Failed to merge PDFs. Please try again.');
        }
        setMerging(false);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = files.findIndex((_, i) => i.toString() === active.id);
            const newIndex = files.findIndex((_, i) => i.toString() === over.id);
            setFiles((files) => arrayMove(files, oldIndex, newIndex));
        }
    };

    return (
        <Stack spacing={2} alignItems="center">
            <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
                Select PDFs to Merge
                <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    hidden
                    onChange={handleFiles}
                    ref={inputRef}
                />
            </Button>

            <Paper variant="outlined" sx={{ width: '100%', maxHeight: 250, overflow: 'auto', p: 0 }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={files.map((_, i) => i.toString())}
                        strategy={verticalListSortingStrategy}
                    >
                        <List dense sx={{ p: 0 }}>
                            {files.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                                    No files selected.
                                </Typography>
                            ) : (
                                files.map((file, idx) => (
                                    <SortableListItem
                                        key={file.name + idx}
                                        file={file}
                                        idx={idx}
                                        id={idx.toString()}
                                        onRemove={handleRemove}
                                    />
                                ))
                            )}
                        </List>
                    </SortableContext>
                </DndContext>
            </Paper>

            {files.length > 0 && (
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color="secondary" onClick={handleClearAll}>
                        Clear all
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleMergeAndDownload}
                        disabled={merging}
                        startIcon={merging ? <CircularProgress size={20} color="inherit" /> : undefined}
                    >
                        {merging ? 'Merging...' : 'Merge & Download'}
                    </Button>
                </Stack>
            )}

            {error && <Alert severity="error">{error}</Alert>}
            {warning && <Alert severity="warning" sx={{ whiteSpace: 'pre-line' }}>{warning}</Alert>}

            <Typography variant="body2" color="text.secondary" align="center">
                Your files stay private and never leaves your browser.
            </Typography>
        </Stack>
    );
};

export default PDFUploader;
