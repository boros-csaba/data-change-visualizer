import '../styles/styles.scss'
import { Animation } from './animation.js';
import { initFileUploadInput } from './file-upload.js';
import { download } from './video.js';

const animation = new Animation();
initFileUploadInput(animation);
animation.startAnimation();



window.onload = () => {
    document.getElementsByClassName('download-button')[0].addEventListener('click', () => {
        download();
    });   
 }