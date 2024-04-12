import '../styles/styles.scss'
import { startAnimation } from './animation.js';
import { initFileUploadInput } from './file-upload.js';

initFileUploadInput();
startAnimation();

document.getElementById('tab1').addEventListener('click', (_) => setActiveTab(1));
document.getElementById('tab2').addEventListener('click', (_) => setActiveTab(2));
document.getElementById('tab3').addEventListener('click', (_) => setActiveTab(3));

function setActiveTab(tab) {
    document.getElementById('tab1').classList.remove('active');
    document.getElementById('tab2').classList.remove('active');
    document.getElementById('tab3').classList.remove('active');
    document.getElementById(`tab${tab}`).classList.add('active');
}