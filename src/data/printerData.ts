export type Printer = {
    name: string;
    driver: string;
    density: number;
    default: boolean;
    connection: string;
    sizes: PrinterSize[];
    trays?: string[];
  }

export interface Size {
    width: number;
    height: number;
}

export interface PrinterSize {
    name: string;
    in: Size;
    mm: Size;
}

export interface SavedSetting {
    selectedPrinter: string;
    selectedTray?: string;
    selectedSize: PrinterSize;
    printRotation: number;
    pageRanges: string;
    printAsGrayscale: boolean;
  }

