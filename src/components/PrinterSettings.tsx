import { useEffect, useState } from 'react';
import { Printer, PrinterSize } from '../data/printerData';

interface PrinterSettingsProps {
  clientPrinters: Printer[];
  fileSelected: File | undefined;
  setFileSelected: (file: File) => void;
  selectedPrinter: string;
  setSelectedPrinter: (printer: string) => void;
  selectedTray: string;
  setSelectedTray: (tray: string) => void;
  selectedSize: PrinterSize;
  setSelectedSize: (paper: PrinterSize) => void;
  printRotation: number;
  setPrintRotation: (rotation: number) => void;
}

const PrinterSettings: React.FC<PrinterSettingsProps> = ({
  clientPrinters,
  fileSelected,
  setFileSelected,
  selectedPrinter,
  setSelectedPrinter,
  selectedTray,
  setSelectedTray,
  selectedSize,
  setSelectedSize,
  printRotation,
  setPrintRotation,
}) => {
  const [traysLoading, setTraysLoading] = useState(false)
  const [papersLoading, setPapersLoading] = useState(false)

  const showSelectedPrinterInfo = () => {
    const selectedPrinterObj = clientPrinters.find(printer => printer.name === selectedPrinter);
    if (selectedPrinterObj) {
      // setSelectedPrinterTrays(selectedPrinterObj.trays);
      setSelectedTray(selectedPrinterObj.trays?.length !== undefined ? selectedPrinterObj.trays[0] : "");
      setTraysLoading(false)
      // setSelectedPrinterPapers(selectedPrinterObj.papers);
      setSelectedSize(selectedPrinterObj.sizes.length > 0 ? selectedPrinterObj.sizes[0] : {} as PrinterSize);
      setPapersLoading(false)
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File;
    setFileSelected(file);
  }

  useEffect(() => {
    setTraysLoading(true)
    setPapersLoading(true)
    showSelectedPrinterInfo();
  }, [selectedPrinter]);

  return (
    <div>
      <div>
        <label htmlFor="file">Select File:</label>
        <input
          type="file"
          name="file"
          id="file"
          accept=".pdf,.xls,.xlsx,.html"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <label htmlFor="lstPrinters">Printers:</label>
        <select
          name="lstPrinters"
          id="lstPrinters"
          value={selectedPrinter}
          onChange={(e) => setSelectedPrinter(e.target.value)}
        >
          {clientPrinters.map((printer, index) => (
            <option key={index} value={printer.name}>
              {printer.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lstPrinterTrays">Supported Trays:</label>
        {traysLoading && <span>Loading...</span>}
          {!traysLoading && (

            <select
            name="lstPrinterTrays"
            id="lstPrinterTrays"
            value={selectedTray}
            onChange={(e) => setSelectedTray(e.target.value)}
            >
          {clientPrinters.find(printer => printer.name === selectedPrinter)?.trays?.map((tray, index) => (
            <option key={index} value={tray}>
              {tray}
            </option>
          ))}
        </select>
        )}
      </div>
      <div>
        <label htmlFor="lstPrinterPapers">Supported Papers:</label>
        {papersLoading && <span>Loading...</span>}
        {!papersLoading && (
        <select
          name="lstPrinterPapers"
          id="lstPrinterPapers"
          value={JSON.stringify(selectedSize)}
          onChange={(e) => setSelectedSize(JSON.parse(e.target.value))}
        >
          {clientPrinters.find(printer => printer.name === selectedPrinter)?.sizes.map((size, index) => (
            <option key={index} value={JSON.stringify(size)}>
              {size.name}
            </option>
          ))}
        </select>
        )}
      </div>
      <div>
        <label htmlFor="lstPrintRotation">Print Rotation (Clockwise):</label>
        <select
          name="lstPrintRotation"
          id="lstPrintRotation"
          value={printRotation}
          onChange={(e) => setPrintRotation(Number(e.target.value))}
        >
          <option value={0}>None</option>
          <option value={90}>Rot90</option>
          <option value={180}>Rot180</option>
          <option value={270}>Rot270</option>
        </select>
      </div>
    </div>
  );
};

export default PrinterSettings;
