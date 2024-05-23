import { Data } from './data.js'; 

export class FileUploadHandler {

    onDataAvailable = null;
    onRawFileDataAvailable = null;

    constructor(onRawFileDataAvailable, onDataAvailable) {
        this.onDataAvailable = onDataAvailable;
        this.onRawFileDataAvailable = onRawFileDataAvailable;
    }

    initFileUploadInput(animation) {
        this.addFileUploadEventListeners(animation);

        const fileInput = document.querySelector('input[type="file"]');
        const dropArea = document.querySelector('.file-drop-area');

        fileInput.addEventListener('dragenter', function () {
            dropArea.classList.add('is-active');
        });

        fileInput.addEventListener('focus', function () {
            dropArea.classList.add('is-active');
        });

        fileInput.addEventListener('click', function () {
            dropArea.classList.add('is-active');
        });

        fileInput.addEventListener('dragleave blur drop', function () {
            dropArea.classList.remove('is-active');
        });

        fileInput.addEventListener('blur', function () {
            dropArea.classList.remove('is-active');
        });

        fileInput.addEventListener('drop', function () {
            dropArea.classList.remove('is-active');
        });

        fileInput.addEventListener('change', function () {
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

    addFileUploadEventListeners(animation) {
        const fileInput = document.querySelector('input[type="file"]');
        fileInput.addEventListener('change', () =>
            this.handleFileUpload(animation)
        );
    }

    handleFileUpload() {
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => this.onFileLoad(e);
    }

    onFileLoad(event) {
        let fileData = event.target.result;

        var data = new Data(fileData);
        if (this.onDataAvailable) {
            this.onDataAvailable(data);
        }

        if (this.onRawFileDataAvailable) {
            this.onRawFileDataAvailable(fileData);
        }
    }
}
