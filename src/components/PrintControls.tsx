interface PrintControlsProps {
  pageRanges: string;
  setPageRanges: (value: string) => void;
  // printInReverseOrder: boolean;
  // setPrintInReverseOrder: (value: boolean) => void;
  // printAnnotations: boolean;
  // setPrintAnnotations: (value: boolean) => void;
  printAsGrayscale: boolean;
  setPrintAsGrayscale: (value: boolean) => void;
}

const PrintControls: React.FC<PrintControlsProps> = ({
  pageRanges,
  setPageRanges,
  // printInReverseOrder,
  // setPrintInReverseOrder,
  // printAnnotations,
  // setPrintAnnotations,
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
      {/* <div>
        <label>
          <input
            id="chkPrintInReverseOrder"
            type="checkbox"
            checked={printInReverseOrder}
            onChange={(e) => setPrintInReverseOrder(e.target.checked)}
          />
          Print In Reverse Order?
        </label>
      </div>
      <div>
        <label>
          <input
            id="chkPrintAnnotations"
            type="checkbox"
            checked={printAnnotations}
            onChange={(e) => setPrintAnnotations(e.target.checked)}
          />
          Print Annotations? <span><em>Windows Only</em></span>
        </label>
      </div> */}
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
