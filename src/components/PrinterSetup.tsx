import { useState } from 'react';
import PrinterSettings from './PrinterSettings';
import PrintControls from './PrintControls';
import './PrinterSetup.css';
import { SavedSetting, PrinterSize } from '../data/printerData';
import qz from 'qz-tray';
import { getDataFromFileSelected } from '../utils/printerUtils';
// import path from 'path';


const PrinterSetup = (props: any) => { 
  const { clientPrinters, selectedPrinter, setSelectedPrinter, printersLoading, savedSettings, setSavedSettings } = props;
  // const [fileUrl, setFileUrl] = useState<string>("https://neodynamic.com/temp/LoremIpsum.pdf");
  const [fileSelected, setFileSelected] = useState<File | undefined>(undefined);
  const [selectedTray, setSelectedTray] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<PrinterSize>({} as PrinterSize);
  const [printRotation, setPrintRotation] = useState<number>(0);
  const [pageRanges, setPageRanges] = useState<string>("");
  const [printAsGrayscale, setPrintAsGrayscale] = useState(false);

  // prints with selected settings or saved setting from local storage
  const handlePrint = async (settings: undefined | SavedSetting) => {
    const saved = settings !== undefined
    console.log(pageRanges)
    const checkGrayscale = saved ? settings.printAsGrayscale : printAsGrayscale;
    const checkTray = saved ? settings.selectedTray : selectedTray;
    var config = qz.configs.create(saved? settings.selectedPrinter : selectedPrinter, {
        printerTray: checkTray !== "" ? checkTray : null,
        size: saved ? settings.selectedSize.in : selectedSize.in,
        rotation: saved ? settings.printRotation : printRotation,
        colorType: checkGrayscale ? 'grayscale' : 'color',
    })

    if (fileSelected === undefined) {
        console.error('No file selected');
        return
    }
    
    const data = await getDataFromFileSelected(fileSelected, saved ? settings.pageRanges : pageRanges);
    console.log(data);

    qz.print(config, data).catch(function(e: Error) { console.error(e.message); });

    alert('Print job sent to printer with settings chosen above!')
  }

  const handleSaveSettings = () => {
    const newSetting: SavedSetting = {
      selectedPrinter,
      selectedTray,
      selectedSize,
      printRotation,
      pageRanges,
      printAsGrayscale
    };
    const updatedSettings = [...savedSettings, newSetting];
    setSavedSettings(updatedSettings);
    localStorage.setItem('printerSettings', JSON.stringify(updatedSettings));
  };

  const handleUseSavedSetting = (setting: SavedSetting) => {
    handlePrint(setting);
  };

  const handleDeleteSavedSetting = (setting: SavedSetting) => {
    const updatedSettings = savedSettings.filter((s: any) => s !== setting);
    setSavedSettings(updatedSettings);
    localStorage.setItem('printerSettings', JSON.stringify(updatedSettings));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Advanced PDF Printing from Javascript</h1>
      <hr />
      {printersLoading && <p>Loading installed printers...</p>}
      {!printersLoading && clientPrinters.length === 0 && <p>No printers found!</p>}
      {!printersLoading && clientPrinters.length !== 0 && (
        <>
          <PrinterSettings
            clientPrinters={clientPrinters}
            // fileUrl={fileUrl}
            // setFileUrl={setFileUrl}
            fileSelected={fileSelected}
            setFileSelected={setFileSelected}
            selectedPrinter={selectedPrinter}
            setSelectedPrinter={setSelectedPrinter}
            selectedTray={selectedTray}
            setSelectedTray={setSelectedTray}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            printRotation={printRotation}
            setPrintRotation={setPrintRotation}
          />
          <PrintControls
            pageRanges={pageRanges}
            setPageRanges={setPageRanges}
            printAsGrayscale={printAsGrayscale}
            setPrintAsGrayscale={setPrintAsGrayscale}
          />
          <hr />
          <button type="button" onClick={() => handlePrint(undefined)}>Print Now</button>
          <button type="button" onClick={handleSaveSettings}>Save Settings</button>
          <h2>Saved Settings</h2>
          {savedSettings.length === 0 && <p>No saved settings</p>}
          <div className="grid-container">
            {savedSettings.map((setting: any, index: any) => (
              <div key={index} className="grid-item">
                <h3>{`Setting ${index + 1}`}</h3>
                <p><strong>Printer:</strong> {setting.selectedPrinter}</p>
                <p><strong>Tray:</strong> {setting.selectedTray === "" ? "No tray selected" : setting.selectedTray}</p>
                <p><strong>Paper:</strong> {setting.selectedSize.name}</p>
                <p><strong>Width:</strong> {setting.selectedSize.in.width} in</p>
                <p><strong>Height:</strong> {setting.selectedSize.in.height} in</p>
                <p><strong>Print Rotation:</strong> {setting.printRotation}</p>
                <p><strong>Pages Range:</strong> {setting.pageRanges}</p>
                <p><strong>Print As Grayscale:</strong> {setting.printAsGrayscale ? 'Yes' : 'No'}</p>
                <button type="button" onClick={() => handleUseSavedSetting(setting)}>Silent Print</button>
                <button type="button" onClick={() => handleDeleteSavedSetting(setting)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PrinterSetup;
