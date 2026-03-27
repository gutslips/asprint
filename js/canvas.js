import { W, H, F, PY, PNX, PNMW, PNOX, PNOMW, PSZ } from './config.js';

export async function loadTemplateImage() {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("base.png 로드 실패! base.png 파일이 index.html과 같은 폴더(root)에 있는지 확인하세요."));
        img.src = "base.png";
    });
}

export async function renderJPG(tmpl, d) {
    const cv = document.getElementById('cv');
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext('2d');
    ctx.drawImage(tmpl, 0, 0, W, H);

    function dt(text, cfg) {
        if (!text) return;
        ctx.font = `bold ${cfg.size}px 'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif`;
        ctx.fillStyle = cfg.color || '#000';
        ctx.textAlign = cfg.align || 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, cfg.x, cfg.y, cfg.maxW);
    }

    const mfull = d.model_color ? `${d.model_name} ${d.model_color}` : d.model_name;
    dt(d.customer_name, F.customer_name);
    dt(mfull, F.model_name);
    dt(d.visit_date, F.visit_date);
    dt(d.service_type, F.service_type);
    dt(d.serial_no, F.serial_no);
    dt(d.prod_date, F.prod_date);
    dt(d.cs_number, F.cs_number);
    dt(d.problem, F.problem);
    dt(d.time_required, F.time_required);
    dt(d.worker, F.worker);

    if (d.special_notes) {
        ctx.font = `bold ${F.special_notes.size}px 'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif`;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        d.special_notes.split('\n').forEach((ln, li) => {
            ctx.fillText(ln, F.special_notes.x, F.special_notes.y + li * 34, F.special_notes.maxW);
        });
    }

    for (let i = 0; i < 10; i++) {
        const y = PY[i];
        if (!y) continue;
        ctx.font = `bold ${PSZ}px 'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif`;
        ctx.textBaseline = 'middle';
        if (d.parts[i]?.name) {
            ctx.fillStyle = '#000'; ctx.textAlign = 'center';
            ctx.fillText(d.parts[i].name, PNX, y, PNMW);
        }
        if (d.parts[i]?.note) {
            ctx.fillStyle = '#000'; ctx.textAlign = 'center';
            ctx.fillText(d.parts[i].note, PNOX, y, PNOMW);
        }
    }

    return new Promise(r => cv.toBlob(r, 'image/jpeg', 0.95));
}

export function getFileName(d, idx) {
    const dt = d.visit_date.replace(/-/g, '');
    const seq = String(idx + 1).padStart(2, '0');
    return `${seq}_${dt}_${(d.customer_name || 'unknown').replace(/[/\\?%*:|"<>]/g, '')}_${d.service_type || 'AS'}.jpg`;
}