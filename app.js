const $ = (selector) => document.querySelector(selector);

const messages = {
  en: {
    pageTitle: 'FloodLens · Floodwater Visual Screening', fieldScreening: 'Field screening', method: 'Method', limitations: 'Limitations', engineOnline: 'Vision engine online',
    heroTitle: 'See the risks<br><em>floodwater leaves.</em>', heroCopy: 'A visual screening tool designed for Melbourne floodwater. Capture or upload a water image to identify visible floating litter and other potential pollution cues.',
    response: 'Target response', riskLevels: 'Visual risk levels', fieldSupport: 'Field screening', addImage: 'Add a water image', positionWater: 'Position the water inside the frame', fileHint: 'JPG, PNG or WEBP · Include both the water surface and its surroundings',
    openCamera: 'Open camera', captureImage: 'Capture image', uploadImage: 'Upload image', analyseImage: 'Analyse image', analysing: 'Analysing…', analyseAgain: 'Analyse again', privacy: 'Images are processed by the local model service and are not retained.',
    riskScore: 'RISK SCORE', complete: 'Analysis complete', modelConfidence: 'Model confidence', recommendedAction: 'Recommended action',
    methodTitle: 'From one image to<br>an actionable risk alert', imageCapture: 'Image capture', imageCaptureCopy: 'Take or upload a water image for automated visual quality checks.', visualDetection: 'Visual detection', visualDetectionCopy: 'pLitter YOLOv5 locates visible floating plastic and debris.', riskScoring: 'Risk scoring', riskScoringCopy: 'Detection count, confidence and coverage produce a visual risk score.', actionGuidance: 'Action guidance', actionGuidanceCopy: 'The result is translated into clear sampling and safety recommendations.',
    limitTitle: 'A camera can reveal clues.<br>It cannot test water quality.', limitCopy: 'Clear water may still contain bacteria, heavy metals or dissolved contaminants. This tool provides preliminary visual screening only and must never be used to determine drinking-water safety. Avoid contact with water affected by flooding, sewage or industrial discharge, and arrange professional sampling when contamination is suspected.',
    reset: 'Reset', previewAlt: 'Water image ready for analysis', switchLanguage: 'Switch to Chinese', badType: 'Choose a JPG, PNG or WEBP image', tooLarge: 'The image must be smaller than 12 MB', noCamera: 'Camera access is not supported by this browser', cameraDenied: 'Unable to open the camera. Check your browser permissions.', imageError: 'The image could not be read. Try another image.',
    floatingDebris: 'floating debris', high: 'High', moderate: 'Moderate', low: 'Low', highTitle: 'High visual risk detected', mediumTitle: 'Moderate visual risk detected', lowTitle: 'No obvious visual pollution detected',
    highCopy: 'The image contains visible cues associated with floodwater pollution. Treat this water as potentially contaminated and avoid direct contact.', mediumCopy: 'Some unusual visual cues are present, but a photograph cannot confirm the type or concentration of any contaminant.', lowCopy: 'No strong visual pollution cues were found. This does not mean the water is drinkable or free from microbial or chemical contamination.',
    highRecommendation: 'Do not enter or drink the water, and keep pets away. Record the location and time, then contact the local council, EPA Victoria or a qualified sampling professional.', mediumRecommendation: 'Capture additional images from different angles and lighting. Combine the result with turbidity, pH, temperature and conductivity readings, and arrange laboratory testing if concerned.', lowRecommendation: 'Continue monitoring. If the area was recently flooded or is near sewage or industrial discharge, still treat the water as potentially contaminated and seek professional testing.',
    demoNotice: ' This result was produced by the local demonstration algorithm.', turbidity: 'Turbidity cues', debris: 'Floating debris', detected: 'detected', colour: 'Unusual colour', imageQuality: 'Image quality', usable: 'Usable', bottle: 'bottle', styrofoam: 'styrofoam'
  },
  zh: {
    pageTitle: 'FloodLens · 洪水水质视觉筛查', fieldScreening: '现场筛查', method: '方法说明', limitations: '使用边界', engineOnline: '视觉引擎在线',
    heroTitle: '看见洪水留下的<br><em>污染风险。</em>', heroCopy: '面向墨尔本洪水场景的水体视觉筛查工具。拍摄或上传水面照片，识别可见的漂浮垃圾及其他潜在污染线索。',
    response: '目标响应时间', riskLevels: '视觉风险等级', fieldSupport: '现场辅助筛查', addImage: '添加水体图像', positionWater: '将水面置于取景框内', fileHint: '支持 JPG、PNG、WEBP · 建议包含水面与周围环境',
    openCamera: '开启摄像头', captureImage: '拍摄照片', uploadImage: '上传照片', analyseImage: '开始分析', analysing: '分析中…', analyseAgain: '重新分析', privacy: '图像由本地模型服务处理，不会被保留。',
    riskScore: '风险分', complete: '分析完成', modelConfidence: '模型置信度', recommendedAction: '下一步建议',
    methodTitle: '从一张图像到<br>可执行的风险提示', imageCapture: '图像采集', imageCaptureCopy: '现场拍摄或上传水体照片，并自动检查图像质量。', visualDetection: '视觉识别', visualDetectionCopy: 'pLitter YOLOv5 定位可见的漂浮塑料与垃圾。', riskScoring: '风险评分', riskScoringCopy: '结合检测数量、置信度和覆盖面积生成视觉风险分。', actionGuidance: '解释与行动', actionGuidanceCopy: '将检测结果转化为清晰的采样和安全建议。',
    limitTitle: '相机能发现线索，<br>不能替代水质检测。', limitCopy: '清澈的水仍可能含有细菌、重金属或溶解性污染物。本工具只用于初步视觉筛查，不得用于判断饮用安全。若水体受到洪水、污水或工业排放影响，请避免接触并安排专业采样检测。',
    reset: '重置', previewAlt: '待分析的水体照片', switchLanguage: 'Switch to English', badType: '请选择 JPG、PNG 或 WEBP 图片', tooLarge: '图片不能超过 12 MB', noCamera: '当前浏览器不支持摄像头访问', cameraDenied: '无法打开摄像头，请检查浏览器权限。', imageError: '图片读取失败，请换一张照片重试。',
    floatingDebris: '漂浮垃圾', high: '明显', moderate: '中等', low: '较低', highTitle: '检测到较高视觉风险', mediumTitle: '检测到中等视觉风险', lowTitle: '未见明显视觉污染',
    highCopy: '画面呈现多项与洪水污染相关的可见特征。请将该水体视为潜在污染水，避免直接接触。', mediumCopy: '画面中存在部分异常视觉线索，但仅凭照片无法确认污染物类型或浓度。', lowCopy: '当前照片未显示强烈的可见污染线索，但这不代表水体可饮用或不存在微生物、化学污染。',
    highRecommendation: '避免涉水、饮用或让宠物接触；记录地点与时间，并联系当地 council、EPA Victoria 或专业人员进行采样。', mediumRecommendation: '建议从不同角度和光线下补拍，并结合浊度、pH、温度和电导率等传感器数据；可疑时安排实验室检测。', lowRecommendation: '保持观察；若该区域刚经历洪水或靠近污水、工业排放点，仍应按潜在污染水处理并进行专业检测。',
    demoNotice: ' 当前结果由本地演示算法生成。', turbidity: '浑浊特征', debris: '漂浮垃圾', detected: '处', colour: '异常颜色', imageQuality: '图像质量', usable: '可用', bottle: '塑料瓶', styrofoam: '泡沫塑料'
  }
};

let currentLanguage = localStorage.getItem('floodlens-language') === 'zh' ? 'zh' : 'en';
const t = key => messages[currentLanguage][key];

const ui = {
  fileInput: $('#fileInput'), dropZone: $('#dropZone'), camera: $('#camera'),
  canvas: $('#captureCanvas'), preview: $('#preview'), empty: $('#emptyState'),
  detectionCanvas: $('#detectionCanvas'),
  cameraButton: $('#cameraButton'), analyzeButton: $('#analyzeButton'),
  resetButton: $('#resetButton'), badge: $('#imageBadge'), scanLine: $('#scanLine'),
  resultPanel: $('#resultPanel'), scoreValue: $('#scoreValue'),
  resultTitle: $('#resultTitle'), resultCopy: $('#resultCopy'),
  confidenceBar: $('#confidenceBar'), confidenceText: $('#confidenceText'),
  factorGrid: $('#factorGrid'), recommendationText: $('#recommendationText'),
  riskOrbit: $('#riskOrbit'), toast: $('#toast'), languageToggle: $('#languageToggle')
};

let selectedFile = null;
let stream = null;
let cameraActive = false;
let isAnalyzing = false;
let latestResult = null;

function applyLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('floodlens-language', language);
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en-AU';
  document.title = t('pageTitle');

  const text = (selector, key) => { $(selector).textContent = t(key); };
  const html = (selector, key) => { $(selector).innerHTML = t(key); };
  text('nav a[href="#scanner"]', 'fieldScreening');
  text('nav a[href="#method"]', 'method');
  text('nav a[href="#limits"]', 'limitations');
  $('.status-pill').innerHTML = `<span></span>${t('engineOnline')}`;
  html('.hero h1', 'heroTitle');
  text('.hero-copy > p', 'heroCopy');
  text('.hero-stats div:nth-child(1) span', 'response');
  text('.hero-stats div:nth-child(2) span', 'riskLevels');
  text('.hero-stats div:nth-child(3) span', 'fieldSupport');
  text('.card-header h2', 'addImage');
  text('.capture-empty h3', 'positionWater');
  text('.capture-empty p', 'fileHint');
  $('label[for="fileInput"]').innerHTML = `<span>↑</span> ${t('uploadImage')}`;
  text('.privacy-note', 'privacy');
  text('.risk-orbit small', 'riskScore');
  text('.confidence-row > span', 'modelConfidence');
  text('.recommendation strong', 'recommendedAction');
  html('.section-heading h2', 'methodTitle');
  const processKeys = [
    ['imageCapture', 'imageCaptureCopy'], ['visualDetection', 'visualDetectionCopy'],
    ['riskScoring', 'riskScoringCopy'], ['actionGuidance', 'actionGuidanceCopy']
  ];
  document.querySelectorAll('.process-grid article').forEach((article, index) => {
    article.querySelector('h3').textContent = t(processKeys[index][0]);
    article.querySelector('p').textContent = t(processKeys[index][1]);
  });
  html('.limits-section h2', 'limitTitle');
  text('.limits-section > p', 'limitCopy');

  ui.resetButton.title = t('reset');
  ui.resetButton.setAttribute('aria-label', t('reset'));
  ui.preview.alt = t('previewAlt');
  ui.languageToggle.textContent = language === 'en' ? '中文' : 'EN';
  ui.languageToggle.setAttribute('aria-label', t('switchLanguage'));
  ui.cameraButton.innerHTML = cameraActive ? `<span>◎</span> ${t('captureImage')}` : `<span>◉</span> ${t('openCamera')}`;
  ui.analyzeButton.innerHTML = isAnalyzing ? t('analysing') : `${latestResult ? t('analyseAgain') : t('analyseImage')} <span>→</span>`;
  if (!latestResult) ui.resultTitle.textContent = t('complete');
  if (latestResult) renderResult(latestResult, false);
}

function toast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ui.toast.classList.remove('show'), 2600);
}

function stopCamera() {
  stream?.getTracks().forEach(track => track.stop());
  stream = null;
  cameraActive = false;
  ui.camera.hidden = true;
  ui.cameraButton.innerHTML = `<span>◉</span> ${t('openCamera')}`;
}

function showFile(file) {
  if (!file?.type.startsWith('image/')) return toast(t('badType'));
  if (file.size > 12 * 1024 * 1024) return toast(t('tooLarge'));
  stopCamera();
  selectedFile = file;
  ui.preview.src = URL.createObjectURL(file);
  ui.preview.hidden = false;
  ui.empty.hidden = true;
  ui.badge.hidden = false;
  ui.analyzeButton.disabled = false;
  ui.resultPanel.hidden = true;
  latestResult = null;
  ui.analyzeButton.innerHTML = `${t('analyseImage')} <span>→</span>`;
  clearDetections();
}

ui.fileInput.addEventListener('change', event => showFile(event.target.files[0]));
['dragenter', 'dragover'].forEach(type => ui.dropZone.addEventListener(type, event => {
  event.preventDefault(); ui.dropZone.classList.add('dragging');
}));
['dragleave', 'drop'].forEach(type => ui.dropZone.addEventListener(type, event => {
  event.preventDefault(); ui.dropZone.classList.remove('dragging');
}));
ui.dropZone.addEventListener('drop', event => showFile(event.dataTransfer.files[0]));

ui.cameraButton.addEventListener('click', async () => {
  if (cameraActive) {
    ui.canvas.width = ui.camera.videoWidth;
    ui.canvas.height = ui.camera.videoHeight;
    ui.canvas.getContext('2d').drawImage(ui.camera, 0, 0);
    ui.canvas.toBlob(blob => showFile(new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })), 'image/jpeg', .9);
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) return toast(t('noCamera'));
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
    ui.camera.srcObject = stream;
    ui.camera.hidden = false;
    ui.preview.hidden = true;
    ui.empty.hidden = true;
    ui.badge.hidden = true;
    cameraActive = true;
    ui.cameraButton.innerHTML = `<span>◎</span> ${t('captureImage')}`;
  } catch {
    toast(t('cameraDenied'));
  }
});

ui.resetButton.addEventListener('click', () => {
  stopCamera();
  selectedFile = null;
  ui.fileInput.value = '';
  if (ui.preview.src.startsWith('blob:')) URL.revokeObjectURL(ui.preview.src);
  ui.preview.removeAttribute('src');
  ui.preview.hidden = true;
  ui.empty.hidden = false;
  ui.badge.hidden = true;
  ui.analyzeButton.disabled = true;
  ui.resultPanel.hidden = true;
  latestResult = null;
  ui.analyzeButton.innerHTML = `${t('analyseImage')} <span>→</span>`;
  clearDetections();
});

function clearDetections() {
  const canvas = ui.detectionCanvas;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  canvas.hidden = true;
}

function drawDetections(detections = []) {
  clearDetections();
  if (!detections.length || !ui.preview.naturalWidth) return;
  const canvas = ui.detectionCanvas;
  const rect = ui.dropZone.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.hidden = false;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const imageRatio = ui.preview.naturalWidth / ui.preview.naturalHeight;
  const viewRatio = rect.width / rect.height;
  let shownWidth, shownHeight, offsetX, offsetY;
  if (imageRatio > viewRatio) {
    shownHeight = rect.height; shownWidth = shownHeight * imageRatio;
    offsetX = (rect.width - shownWidth) / 2; offsetY = 0;
  } else {
    shownWidth = rect.width; shownHeight = shownWidth / imageRatio;
    offsetX = 0; offsetY = (rect.height - shownHeight) / 2;
  }

  detections.forEach(box => {
    const x = offsetX + box.x1 * shownWidth;
    const y = offsetY + box.y1 * shownHeight;
    const w = (box.x2 - box.x1) * shownWidth;
    const h = (box.y2 - box.y1) * shownHeight;
    const rawLabel = String(box.label || '').toLowerCase();
    const labelTranslations = { debris: t('floatingDebris'), plastic: t('floatingDebris'), 'plastic litter': t('floatingDebris'), 'floating debris': t('floatingDebris'), bottle: t('bottle'), styrofoam: t('styrofoam') };
    const translatedLabel = currentLanguage === 'zh' ? (labelTranslations[rawLabel] || box.label || t('floatingDebris')) : (box.label || t('floatingDebris'));
    const label = `${translatedLabel} ${Math.round(box.confidence * 100)}%`;
    ctx.strokeStyle = '#d8ff52'; ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 5;
    ctx.strokeRect(x, y, w, h);
    ctx.shadowBlur = 0;
    ctx.font = '600 11px Segoe UI, sans-serif';
    const labelWidth = ctx.measureText(label).width + 13;
    const labelY = Math.max(0, y - 24);
    ctx.fillStyle = '#d8ff52'; ctx.fillRect(x, labelY, labelWidth, 23);
    ctx.fillStyle = '#092229'; ctx.fillText(label, x + 6, labelY + 15);
  });
}

async function extractVisualFeatures(image) {
  const canvas = document.createElement('canvas');
  const size = 160;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  let r = 0, g = 0, b = 0, brightnessSq = 0, edge = 0, count = data.length / 4;
  const gray = new Float32Array(count);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    r += data[i]; g += data[i + 1]; b += data[i + 2];
    const lum = .299 * data[i] + .587 * data[i + 1] + .114 * data[i + 2];
    gray[p] = lum; brightnessSq += lum * lum;
  }
  r /= count; g /= count; b /= count;
  const mean = .299 * r + .587 * g + .114 * b;
  const contrast = Math.sqrt(Math.max(0, brightnessSq / count - mean * mean));
  for (let y = 1; y < size; y++) for (let x = 1; x < size; x++) {
    const p = y * size + x;
    edge += Math.abs(gray[p] - gray[p - 1]) + Math.abs(gray[p] - gray[p - size]);
  }
  edge /= (size - 1) * (size - 1) * 2;
  const brownness = Math.max(0, (r * 1.05 + g * .55 - b * 1.3) / 100);
  const greenness = Math.max(0, (g - (r + b) / 2) / 80);
  return { r, g, b, mean, contrast, edge, brownness, greenness };
}

function demoAssessment(f) {
  // Deterministic visual baseline for UI demonstration only; replace via /api/analyze.
  const darkness = Math.max(0, (135 - f.mean) / 95);
  const turbidity = Math.min(1, .22 + f.brownness * .38 + darkness * .28 + Math.max(0, 18 - f.contrast) / 80);
  const debris = Math.min(1, Math.max(0, (f.edge - 7) / 28));
  const discoloration = Math.min(1, Math.max(f.brownness, f.greenness));
  const score = Math.round(Math.min(94, Math.max(8, 18 + turbidity * 42 + debris * 17 + discoloration * 21)));
  const confidence = Math.round(70 + Math.min(22, Math.abs(score - 50) * .45));
  return { score, confidence, factors: { turbidity, debris, discoloration, quality: Math.min(1, f.contrast / 45) }, source: 'demo' };
}

async function requestModel(file, features) {
  try {
    const body = new FormData();
    body.append('image', file); body.append('context', 'melbourne_flood');
    const response = await fetch('/api/analyze', { method: 'POST', body, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('model unavailable');
    return await response.json();
  } catch {
    return demoAssessment(features);
  }
}

function factorLabel(value) {
  if (value >= .68) return t('high');
  if (value >= .38) return t('moderate');
  return t('low');
}

function renderResult(result, shouldScroll = true) {
  latestResult = result;
  const score = Math.round(result.score);
  const high = score >= 68, medium = score >= 38;
  const title = high ? t('highTitle') : medium ? t('mediumTitle') : t('lowTitle');
  const copy = high
    ? t('highCopy')
    : medium ? t('mediumCopy')
    : t('lowCopy');
  const recommendation = high
    ? t('highRecommendation')
    : medium ? t('mediumRecommendation')
    : t('lowRecommendation');

  ui.scoreValue.textContent = score;
  ui.resultTitle.textContent = title;
  ui.resultCopy.textContent = copy + (result.source === 'demo' ? t('demoNotice') : '');
  ui.confidenceText.textContent = `${Math.round(result.confidence)}%`;
  ui.confidenceBar.style.width = `${result.confidence}%`;
  const color = high ? '#ff796f' : medium ? '#ffd65c' : '#d8ff52';
  ui.riskOrbit.style.borderColor = color;
  ui.riskOrbit.style.boxShadow = `0 0 0 8px ${color}14`;
  const factors = [
    [t('turbidity'), factorLabel(result.factors.turbidity)],
    [t('debris'), Number.isFinite(result.detectionCount) ? (currentLanguage === 'zh' ? `${result.detectionCount} ${t('detected')}` : `${result.detectionCount} ${t('detected')}`) : factorLabel(result.factors.debris)],
    [t('colour'), factorLabel(result.factors.discoloration)],
    [t('imageQuality'), result.factors.quality >= .45 ? t('usable') : t('low')]
  ];
  ui.factorGrid.innerHTML = factors.map(([name, value]) => `<div class="factor"><span>${name}</span><strong>${value}</strong></div>`).join('');
  ui.recommendationText.textContent = recommendation;
  drawDetections(result.detections);
  ui.resultPanel.hidden = false;
  if (shouldScroll) setTimeout(() => ui.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

ui.analyzeButton.addEventListener('click', async () => {
  if (!selectedFile) return;
  isAnalyzing = true;
  ui.analyzeButton.disabled = true;
  ui.analyzeButton.innerHTML = t('analysing');
  ui.scanLine.classList.add('scanning');
  try {
    const image = new Image();
    image.src = ui.preview.src;
    await image.decode();
    const features = await extractVisualFeatures(image);
    const [result] = await Promise.all([
      requestModel(selectedFile, features),
      new Promise(resolve => setTimeout(resolve, 1300))
    ]);
    renderResult(result);
  } catch {
    toast(t('imageError'));
  } finally {
    isAnalyzing = false;
    ui.scanLine.classList.remove('scanning');
    ui.analyzeButton.disabled = false;
    ui.analyzeButton.innerHTML = `${t('analyseAgain')} <span>→</span>`;
  }
});

ui.languageToggle.addEventListener('click', () => applyLanguage(currentLanguage === 'en' ? 'zh' : 'en'));
applyLanguage(currentLanguage);
window.addEventListener('beforeunload', stopCamera);
