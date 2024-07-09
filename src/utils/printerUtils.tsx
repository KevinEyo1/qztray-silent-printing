// import * as JSPM from 'jsprintmanager';
// import * as XLSX from 'xlsx';

// checks if JSPM Client App is downloaded and properly setup on client side
// export const jspmWSStatus = () => {
//   if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) {
//     return true;
//   } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Closed) {
//     alert("JSPrintManager (JSPM) WebSocket is not open!\nIf you have installed JSPM, please restart it.");
//     return false;
//   } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Blocked) {
//     alert("JSPrintManager (JSPM) has blocked this website!");
//     return false;
//   }
// };

// export const checkFileType = (fileUrl: string) => {
//   const fileExt = fileUrl.split('.').pop()?.toLowerCase();
//   switch (fileExt) {
//     case 'pdf':
//       return 'pdf';
//     case 'xls':
//     case 'xlsx':
//       return 'XLS';
//     default:
//       return 'unknown';
//   }
// }

// export const createFile = (file: string | Blob, fileType: string) => {
//   if (file instanceof Blob) {
    // switch(fileType) {
    //   case 'application/pdf':
    //     return new JSPM.PrintFilePDF(file, JSPM.FileSourceType.BLOB, 'apple.pdf', 1);
    //   case 'application/vnd.ms-excel':
    //   case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    //     return new JSPM.PrintFileXLS(file, JSPM.FileSourceType.BLOB, 'apple.xls', 1);
//     }
//   } else if (typeof file === 'string') {
//     switch(fileType) {
//       case 'PDF':
//         return new JSPM.PrintFilePDF(file, JSPM.FileSourceType.URL, 'apple.pdf', 1);
//       case 'XLS':
//         return new JSPM.PrintFileXLS(file, JSPM.FileSourceType.URL, 'apple.xls', 1);
//       default: // fileType unknown
//         // remove 
//         return new JSPM.PrintFilePDF(file, JSPM.FileSourceType.URL, 'apple.pdf', 1);
//     }
//   }
// }

const pdfToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    }
    reader.onerror = reject;
});

const htmlToPlain = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        resolve(reader.result as string);
    }
    reader.onerror = reject;
});
    

export const getDataFromFileSelected = async (fileSelected: File, pageRanges: string) => {
    const format = fileSelected.type
    console.log("format of file chosen", format)
    let inputData = ""
    switch(format) {
        case 'application/pdf':
            inputData = await pdfToBase64(fileSelected)
            var data = [{
                type: 'pixel',
                format: 'pdf',
                flavor: 'base64',
                data: inputData,
                options: { pageRanges: pageRanges },
            }];
            return data;
        case 'text/html':
            inputData = await htmlToPlain(fileSelected)
            var data = [{
                type: 'pixel',
                format: 'html',
                flavor: 'plain',
                data: inputData,
                options: { pageRanges: pageRanges },
            }];
            return data;
        default:
            console.error('Invalid file format');
            return;
    }
    // const absDataPath = "C:/Users/playe/Desktop/apps/synapxe/POC/test-qztray/src/assets/drug_report.pdf"
    // const absPath = path.resolve(__dirname, dataPath)
}