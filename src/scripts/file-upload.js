import { read } from "xlsx"

export function addFileUploadEventListeners() {
  const fileInput = document.querySelector('input[type="file"]');
  fileInput.addEventListener('change', (handleFileUpload));
}

function handleFileUpload() {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file)
    fileReader.onload = onFileLoad;
}

function onFileLoad(event) {
    let fileData = event.target.result;
    let workbook = read(
        fileData,
        { type: "binary" },
        { dateNF: "mm/dd/yyyy" }
      );
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log(sheet);
}

