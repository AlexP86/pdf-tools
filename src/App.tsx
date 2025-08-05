import { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PDFUploader from './components/PDFUploader';
import PDFSplitter from './components/PDFSplitter';

function App() {
    const [tab, setTab] = useState(0);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    🔐 PDF Tools
                </Typography>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
                    <Tab label="Merge PDFs" />
                    <Tab label="Split PDF" />
                </Tabs>
                <Box sx={{ mt: 3 }}>
                    {tab === 0 && <PDFUploader />}
                    {tab === 1 && <PDFSplitter />}
                </Box>
            </Paper>
        </Container>
    );
}

export default App;
