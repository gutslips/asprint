import { doLogin, goForms } from './data.js';
import { loadTemplateImage, renderJPG, getFileName } from './canvas.js';
import { show, toast, renderForm, prevF, nextF, dlAll, goBack } from './ui.js';

// 전역 함수 등록 (onclick에서 호출되도록)
window.doLogin = doLogin;
window.goForms = goForms;
window.renderForm = renderForm;
window.prevF = prevF;
window.nextF = nextF;
window.dlAll = dlAll;
window.goBack = goBack;
window.loadTemplateImage = loadTemplateImage;
window.renderJPG = renderJPG;
window.getFileName = getFileName;
window.show = show;
window.toast = toast;

// 기타 window. 함수들 (selAll, selNone, openPresetModal 등)도 등록 필요

window.onload = () => {
  const ss = localStorage.getItem('as_ssid') || '';
  if (ss) document.getElementById('ssid').value = ss;
  console.log('AS 접수증 앱 초기화 완료');
};