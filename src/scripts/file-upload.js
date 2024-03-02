import { read, utils } from "xlsx"
import { setupWithNewData } from "./data.js"
import { startAnimation, stopAnimation, clearScene } from "./animation.js";

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
    var rawData = utils.sheet_to_json(sheet, { header: 1 });
    processData(rawData);
}

function processData(rawData) {
  let timeLabels = rawData.map((row) => row[0]).slice(1);
  let items = rawData[0].slice(1).map((name, index) => {
    return {
      name: name,
      data: rawData.slice(1).map((row) => row[index + 1])
    }
  });

  stopAnimation();
  clearScene();
  setupWithNewData(timeLabels, items);
  startAnimation();
}

