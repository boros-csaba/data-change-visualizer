import { read, utils } from "xlsx"
import { setupWithNewData } from "./data.js"

export function initFileUploadInput(animation){

  addFileUploadEventListeners(animation);

  const fileInput = document.querySelector('input[type="file"]');;
  const dropArea = document.querySelector('.file-drop-area');

  fileInput.addEventListener('dragenter', function() {
    dropArea.classList.add('is-active');
  });

  fileInput.addEventListener('focus', function() {
    dropArea.classList.add('is-active');
  });

  fileInput.addEventListener('click', function() {
    dropArea.classList.add('is-active');
  });
  
  fileInput.addEventListener('dragleave blur drop', function() {
    dropArea.classList.remove('is-active');
  });

  fileInput.addEventListener('blur', function() {
    dropArea.classList.remove('is-active');
  });

  fileInput.addEventListener('drop', function() {
    dropArea.classList.remove('is-active');
  });
  
  fileInput.addEventListener('change', function() {
    /*var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();
  
    if (filesCount === 1) {
      var fileName = $(this).val().split('\\').pop();
      $textContainer.text(fileName);
    } else {
      $textContainer.text(filesCount + ' files selected');
    }*/
  });
}

function addFileUploadEventListeners(animation) {
  const fileInput = document.querySelector('input[type="file"]');
  fileInput.addEventListener('change', () => handleFileUpload(animation));
}

function handleFileUpload(animation) {
    console.log("File uploaded", animation);
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    console.log(file);
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file)
    fileReader.onload = e => onFileLoad(e, animation);
}

function onFileLoad(event, animation) {
    let fileData = event.target.result;
    let workbook = read(
        fileData,
        { type: "binary" },
        { dateNF: "mm/dd/yyyy" }
      );
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
    var rawData = utils.sheet_to_json(sheet, { header: 1 });
    processData(rawData, animation);
}

function processData(rawData, animation) {
  let timeLabels = rawData.map((row) => row[0]).slice(1);
  let items = rawData[0].slice(1).map((name, index) => {
    return {
      name: name,
      data: rawData.slice(1).map((row) => row[index + 1])
    }
  });

  animation.stopAnimation();
  animation.clearScene();
  setupWithNewData(timeLabels, items);
  animation.startAnimation();
}

