# 🔐 PDF Tools

A privacy-focused, client-side PDF manipulation tool built with React and TypeScript. Merge multiple PDFs or split them into individual pages - all processing happens in your browser, keeping your documents completely private.

## ✨ Features

### 📄 PDF Merger
- **Merge multiple PDFs** into a single document
- **Drag & drop reordering** to arrange PDFs in your preferred sequence
- **Batch upload** support for up to 50 files
- **Real-time preview** of selected files with remove option
- **Smart file validation** with size warnings

### ✂️ PDF Splitter
- **Extract individual pages** from any PDF
- **Selective page removal** - choose exactly which pages to keep
- **Bulk download** all pages as a convenient ZIP file
- **Page-by-page management** with intuitive interface

### 🔒 Privacy & Security
- **100% client-side processing** - your files never leave your device
- **No server uploads** - everything runs in your browser
- **No data collection** - complete privacy guaranteed
- **Secure file handling** with automatic cleanup

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlexP86/pdf-tools.git
   cd pdf-tools
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or  
   yarn dev
   ```

4. **Open your browser** to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🛠️ Usage

### Merging PDFs
1. Click "Select PDFs to Merge"
2. Choose multiple PDF files from your device
3. Drag and drop to reorder files as needed
4. Click "Merge & Download" to get your combined PDF

### Splitting PDFs
1. Switch to the "Split PDF" tab
2. Click "Select PDF" and choose your file
3. Remove any pages you don't want (optional)
4. Click "Download All Pages as ZIP" to get individual page files

## 🏗️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI)
- **PDF Processing**: pdf-lib
- **File Handling**: JSZip for archive creation
- **Drag & Drop**: @dnd-kit for intuitive reordering
- **Build Tool**: Vite
- **Testing**: Jest/Vitest

## 📁 Project Structure

```
src/
├── components/
│   ├── PDFUploader.tsx    # PDF merging interface
│   └── PDFSplitter.tsx    # PDF splitting interface
├── lib/
│   ├── pdfMerger.ts       # Core merging logic
│   ├── pdfSplitter.ts     # Core splitting logic
│   ├── pdfMerger.test.ts  # Merger tests
│   └── pdfSplitter.test.ts # Splitter tests
├── App.tsx                # Main app component
├── main.tsx              # App entry point
└── theme.ts              # MUI theme configuration
```

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new functionality
- Maintain existing code style
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/AlexP86/pdf-tools/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information

## 🚧 Roadmap

Future enhancements planned:
- [ ] PDF page previews/thumbnails
- [ ] Page rotation functionality
- [ ] Password protection for output files
- [ ] PDF compression options
- [ ] Batch page selection for splitting
- [ ] Custom file naming
- [ ] PWA support for offline usage

## ⭐ Show Your Support

If you found this project helpful, please give it a star on GitHub! It helps others discover the tool.

---

**Built for privacy-conscious PDF manipulation**

*Your documents stay on your device. Always.*