import { FIXED_CLIENT_ID, SCOPE } from './config.js';

export let tok = null;
export let ssId = '';
export let fList = [];
export let selSheets = [];
export let sdMap = {};

export async function doLogin() {
  const raw = document.getElementById('ssid').value.trim();
  if (!raw) return toast('스프레드시트 URL/ID를 입력해주세요');

  const m = raw.match(/\/d\/([a-zA-Z0-9_-]+)/);
  ssId = m ? m[1] : raw.replace(/[^a-zA-Z0-9_-]/g,'');
  if (!ssId) return toast('올바른 시트 URL 또는 ID를 입력해주세요');

  localStorage.setItem('as_ssid', ssId);

  const b = document.getElementById('lbtn');
  b.innerHTML = '<span class="sp"></span> 로그인 중...';
  b.disabled = true;

  google.accounts.oauth2.initTokenClient({
    client_id: FIXED_CLIENT_ID,
    scope: SCOPE,
    callback: async (r) => {
      if (r.error) {
        toast('로그인 실패: ' + r.error);
        b.innerHTML = 'Google로 로그인';
        b.disabled = false;
        return;
      }
      tok = r.access_token;
      await loadSheets();
    }
  }).requestAccessToken();
}

async function loadSheets() {
  try {
    const r = await gf(`https://sheets.googleapis.com/v4/spreadsheets/${ssId}?fields=sheets.properties`);
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);

    const sheetsData = d.sheets.map(s => ({
      title: s.properties.title,
      color: s.properties.tabColor || null
    }));

    window.sheetsData = sheetsData; // ui.js에서 사용
    window.sheets = sheetsData.map(s => s.title);

    window.renderList();
    window.show('s-sheets');
    document.getElementById('hs').textContent = 'STEP 1/3';
    toast(`시트 ${sheetsData.length}개 로드 완료`);
  } catch (e) {
    toast('시트 로딩 실패: ' + e.message);
    const b = document.getElementById('lbtn');
    b.innerHTML = 'Google로 로그인';
    b.disabled = false;
  }
}

export async function goForms() {
  const checked = [...document.querySelectorAll('#sheetList input:checked')];
  if (!checked.length) return toast('시트를 1개 이상 선택해주세요');

  selSheets = checked.map(c => window.sheets[parseInt(c.id.replace('ck',''))]);

  toast('데이터 불러오는 중...');
  try {
    const ranges = selSheets.map(n => `${encodeURIComponent(n)}!A3:J27`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${ssId}/values:batchGet?` +
      ranges.map(r => `ranges=${r}`).join('&') + '&valueRenderOption=FORMATTED_VALUE';

    const res = await gf(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    sdMap = {};
    data.valueRanges.forEach((vr, i) => {
      sdMap[selSheets[i]] = vr.values || [];
    });

    window.buildForms();
    window.fIdx = 0;
    window.renderForm(0);
    window.show('s-forms');
    document.getElementById('hs').textContent = 'STEP 2/3';
  } catch (e) {
    toast('데이터 로딩 실패: ' + e.message);
  }
}

function gf(url) {
  return fetch(url, { headers: { Authorization: `Bearer ${tok}` } });
}