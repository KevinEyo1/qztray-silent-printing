interface PrintControlsProps {
  pageRanges: string;
  setPageRanges: (value: string) => void;
  printAsGrayscale: boolean;
  setPrintAsGrayscale: (value: boolean) => void;
}

const PrintControls: React.FC<PrintControlsProps> = ({
  pageRanges,
  setPageRanges,
  printAsGrayscale,
  setPrintAsGrayscale,
}) => {
  return (
    <div>
      <div>
        <label htmlFor="txtPagesRange">Pages Range only for PDFs (MUST BE IN RANGE, comma-separated list): [e.g. 1,2,3,10-15]</label>
        <input
          type="text"
          id="txtPagesRange"
          value={pageRanges}
          onChange={(e) => {
            console.log(e.target.value); 
            setPageRanges(e.target.value)}}
        />
      </div>
      <div>
        <label>
          <input
            id="chkPrintAsGrayscale"
            type="checkbox"
            checked={printAsGrayscale}
            onChange={(e) => setPrintAsGrayscale(e.target.checked)}
          />
          Print As Grayscale?
        </label>
      </div>
    </div>
  );
};

export default PrintControls;
