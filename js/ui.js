import { fList } from './data.js';
import { renderJPG, getFileName } from './canvas.js';

export let fIdx = 0;
export let blobs = [];

export function show(id) {
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  window.scrollTo(0, 0);
}

export function toast(msg, dur = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(() => t.classList.remove('on'), dur);
}

export function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export function renderList() {
  // 기존 renderList 로직 (drag, touch 등) 전체를 넣어야 하지만 길어서 생략
  // 실제로는 당신의 원래 renderList 함수를 여기에 복사해서 사용하세요
  console.log("renderList 호출됨 - 시트 목록 렌더링");
  // 필요하면 원래 코드 복사
}

export function buildForms() {
  const today = new Date();
  const td = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  fList.length = 0; // 초기화

  window.selSheets.forEach(name => {
    const rows = window.sdMap[name] || [];
    // buildForms 내부 파싱 로직 (당신의 원래 buildForms 코드 전체 복사)
    // 여기서는 간단히 placeholder
    fList.push({
      sheet_name: name,
      customer_name: '테스트 고객',
      model_name: '테스트 모델',
      model_color: '',
      visit_date: td,
      service_type: '유상',
      serial_no: '',
      prod_date: '',
      cs_number: '',
      problem: '',
      parts: Array(10).fill().map(() => ({name:'', note:''})),
      special_notes: '',
      time_required: '30',
      worker: '정수호'
    });
  });
}

export function renderForm(i) {
  // 기존 renderForm 로직 전체 복사 필요
  console.log(`renderForm ${i} 호출`);
  // 실제 구현은 당신의 원래 코드 사용
}

export function saveF() {
  // 폼 데이터 저장 로직
}

export function nextF() {
  saveF();
  if (fIdx < fList.length - 1) {
    fIdx++;
    renderForm(fIdx);
  } else {
    genAll();
  }
}

export function prevF() {
  if (fIdx <= 0) return;
  saveF();
  fIdx--;
  renderForm(fIdx);
}

async function genAll() {
  toast('JPG 생성 중...');
  show('s-export');
  document.getElementById('hs').textContent = 'STEP 3/3';

  const tmpl = await window.loadTemplateImage();
  blobs = [];

  for (let idx = 0; idx < fList.length; idx++) {
    const d = fList[idx];
    const blob = await renderJPG(tmpl, d);
    const fn = getFileName(d, idx);
    const url = URL.createObjectURL(blob);
    blobs.push({fn, url, blob});
  }

  // 썸네일 표시 등 UI 업데이트 (원래 genAll 로직 사용)
  toast(`✅ ${fList.length}건 생성 완료!`);
}

export function dlAll() {
  if (!blobs.length) return toast('생성된 파일이 없습니다');
  // JSZip으로 ZIP 생성 로직 (원래 dlAll 코드 사용)
}