// js/main.js
import { doLogin, goForms } from './data.js';
import { loadTemplateImage, renderJPG, getFileName } from './canvas.js';
import * as UI from './ui.js';   // ui.js의 모든 export를 가져옴

// 모든 전역 함수 등록 (onclick에서 사용 가능하게)
window.doLogin = doLogin;
window.goForms = goForms;
window.show = UI.show;
window.toast = UI.toast;
window.renderForm = UI.renderForm;
window.prevF = UI.prevF;
window.nextF = UI.nextF;
window.dlAll = UI.dlAll;
window.goBack = UI.goBack || function() { UI.show('s-sheets'); document.getElementById('hs').textContent = 'STEP 1/3'; };
window.selAll = UI.selAll || function(){};
window.selNone = UI.selNone || function(){};
window.openPresetModal = UI.openPresetModal || function(){};
window.closePresetModal = UI.closePresetModal || function(){};
window.savePreset = UI.savePreset || function(){};
window.addPsetRow = UI.addPsetRow || function(){};
window.applyPreset = UI.applyPreset || function(){};
window.deletePreset = UI.deletePreset || function(){};
window.clearParts = UI.clearParts || function(){};

// loadTemplateImage도 window에 등록
window.loadTemplateImage = loadTemplateImage;

// 초기화
window.onload = () => {
  const ss = localStorage.getItem('as_ssid') || '';
  if (ss) document.getElementById('ssid').value = ss;
  console.log('✅ AS 접수증 앱 초기화 완료');
};
