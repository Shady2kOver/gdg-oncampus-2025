import { useSelector, useDispatch } from 'react-redux';
import { setDocumentContent } from '../store/slices/documentSlice';
import { useRef, useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';

function DocumentReader() {
  const dispatch = useDispatch();
  const { documentContent } = useSelector((state) => state.document);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [boldnessPercentage, setBoldnessPercentage] = useState(60);
  const [fileName, setFileName] = useState('document');

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const handleTextChange = (e) => {
    dispatch(setDocumentContent(e.target.value));
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  };

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    setIsLoading(true);

    try {
      let text;
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        throw new Error('Please upload a PDF or text (.txt) file');
      }

      if (!text || text.trim().length === 0) {
        throw new Error('No text content found in the file');
      }
      
      // Set filename without extension
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
      dispatch(setDocumentContent(text));
    } catch (error) {
      console.error('Error reading file:', error);
      setError(`Failed to read the file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const bionicText = documentContent.split(/\s+/).map((word, index) => {
    if (!word) return null;
    const boldLength = Math.ceil(word.length * (boldnessPercentage / 100));
    const boldPart = word.substring(0, boldLength);
    const regularPart = word.substring(boldLength);
    
    return (
      <span key={index} className="inline-block" style={{ marginRight: '0.25em' }}>
        <span className="font-bold">{boldPart}</span>
        {regularPart}
      </span>
    );
  });

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    const bionicTextContent = documentContent.split(/\s+/).map(word => {
      if (!word) return '';
      const boldLength = Math.ceil(word.length * (boldnessPercentage / 100));
      return word.substring(0, boldLength).toUpperCase() + word.substring(boldLength);
    }).join(' ');
    
    const splitText = doc.splitTextToSize(bionicTextContent, 180);
    doc.text(splitText, 15, 15);
    doc.save(`${fileName}_bionic.pdf`);
  };

  const downloadAsDocx = async () => {
    const bionicTextContent = documentContent.split(/\s+/).map(word => {
      if (!word) return '';
      const boldLength = Math.ceil(word.length * (boldnessPercentage / 100));
      return word.substring(0, boldLength).toUpperCase() + word.substring(boldLength);
    }).join(' ');

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: bionicTextContent
          })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_bionic.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-primary mb-6">Document Reader</h2>
      <div className="space-y-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isLoading ? 'border-primary/30 bg-gray-50' : 'border-primary/30 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf"
          />
          <div className="text-gray-500">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg">Processing document...</p>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg mb-2">Drop your document here</p>
                <p className="text-sm">Supported formats: PDF, TXT</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
            <br />
            <span className="text-xs mt-1 block">
              Please make sure to upload a PDF or text (.txt) file.
            </span>
          </div>
        )}

        {documentContent && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="boldness" className="text-sm font-medium text-gray-700">
                Boldness: {boldnessPercentage}%
              </label>
              <input
                type="range"
                id="boldness"
                min="0"
                max="100"
                value={boldnessPercentage}
                onChange={(e) => setBoldnessPercentage(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex space-x-4 justify-end">
              <button
                onClick={downloadAsPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Download as PDF
              </button>
              <button
                onClick={downloadAsDocx}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download as DOCX
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-lg leading-relaxed shadow-inner">
              {bionicText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentReader; 