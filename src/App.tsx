import { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography, Button } from '@mui/material';
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

            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                    Made with ❤️ &nbsp;|&nbsp;
                    <Button
                        href="https://ko-fi.com/aleksandarpaunovic"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ ml: 1 }}
                    >
                        Donate
                    </Button>
                </Typography>
            </Box>
        </Container>
    );
}

export default App;
