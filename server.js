const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const QRCode = require('qrcode');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const { exec } = require('child_process');

// Thư mục lưu trữ bộ câu hỏi trên server
const DATA_DIR = path.join(__dirname, 'data');
const SETS_FILE = path.join(DATA_DIR, 'question_sets.json');
let gitSyncTimer = null;

function scheduleGitAutoPush() {
  if (gitSyncTimer) clearTimeout(gitSyncTimer);
  gitSyncTimer = setTimeout(() => {
    const gitDir = path.join(__dirname, '.git');
    if (!fs.existsSync(gitDir)) return;

    const minGitPath = process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Programs', 'Git', 'cmd')
      : '';
    const env = {
      ...process.env,
      PATH: minGitPath ? `${minGitPath};${process.env.PATH}` : process.env.PATH
    };

    const cmd = `git add data/question_sets.json && git commit -m "chore: auto-sync saved question sets" && git push origin main`;
    exec(cmd, { cwd: __dirname, env }, (err) => {
      if (!err) {
        console.log('☁️ Đã tự động đồng bộ bộ câu hỏi lên GitHub / Web!');
      }
    });
  }, 2500);
}

function loadSets() {
  try {
    if (!fs.existsSync(SETS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(SETS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi đọc question_sets.json:', err.message);
    return [];
  }
}

function saveSets(sets) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SETS_FILE, JSON.stringify(sets, null, 2), 'utf-8');
    scheduleGitAutoPush();
    return true;
  } catch (err) {
    console.error('Lỗi lưu question_sets.json:', err.message);
    return false;
  }
}

// Danh sách giọng đọc tiếng Hàn chuẩn bản địa
const KOREAN_VOICES = [
  {
    id: 'ko-KR-SunHiNeural',
    name: 'Sun-Hi (선희)',
    gender: 'Nữ (Female)',
    genderCode: 'female',
    style: 'Truyền cảm, tự nhiên, chuẩn phát thanh viên Seoul',
    badge: 'Khuyên dùng'
  },
  {
    id: 'ko-KR-InJoonNeural',
    name: 'In-Joon (인준)',
    gender: 'Nam (Male)',
    genderCode: 'male',
    style: 'Trầm ấm, rõ ràng, phong thái tự nhiên chuẩn bản địa',
    badge: 'Phổ biến'
  },
  {
    id: 'ko-KR-HyunsuMultilingualNeural',
    name: 'Hyunsu (현수)',
    gender: 'Nam (Male)',
    genderCode: 'male',
    style: 'Hiện đại, linh hoạt, ngữ điệu đời sống thường ngày',
    badge: 'Mới'
  }
];

// Helper: tổng hợp giọng nói bằng MsEdgeTTS, trả về Buffer MP3
async function edgeSpeak(text, voice, speed = 1.0, pitch = 0) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    voice,
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
  );

  // Chuyển speed/pitch sang định dạng SSML prosody của Edge TTS
  const ratePercent = Math.round((speed - 1) * 100);
  const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;
  const pitchStr = pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`;

  return new Promise((resolve, reject) => {
    const chunks = [];
    // toStream() trả về { audioStream, metadataStream, requestId }
    const { audioStream } = tts.toStream(text, { rate: rateStr, pitch: pitchStr });
    audioStream.on('data', (chunk) => chunks.push(chunk));
    audioStream.on('end', () => resolve(Buffer.concat(chunks)));
    audioStream.on('error', reject);
  });
}

// Khởi tạo Mp3Encoder cho tạo khoảng lặng (Silence)
let Mp3EncoderClass = null;
async function getMp3Encoder() {
  if (!Mp3EncoderClass) {
    const lame = await import('@breezystack/lamejs');
    Mp3EncoderClass = lame.Mp3Encoder;
  }
  return Mp3EncoderClass;
}

// Tạo buffer MP3 khoảng lặng chính xác
async function createSilenceMp3(durationSec, sampleRate = 24000, kbps = 48) {
  if (!durationSec || durationSec <= 0) return Buffer.alloc(0);
  const Encoder = await getMp3Encoder();
  const enc = new Encoder(1, sampleRate, kbps);
  const totalSamples = Math.round(durationSec * sampleRate);
  const samples = new Int16Array(totalSamples);
  const d1 = enc.encodeBuffer(samples);
  const d2 = enc.flush();
  return Buffer.concat([Buffer.from(d1), Buffer.from(d2)]);
}

// API lấy danh sách giọng
app.get('/api/voices', (req, res) => {
  res.json({
    success: true,
    voices: KOREAN_VOICES
  });
});

// Tính độ đầy đủ dữ liệu của 1 bộ câu hỏi (ưu tiên bộ có nhiều câu trả lời & bản dịch hơn)
function calculateSetRichness(set) {
  if (!set || !Array.isArray(set.questions)) return 0;
  let score = set.questions.length * 10;
  for (const q of set.questions) {
    if (q.qKr && q.qKr.trim()) score += 2;
    if (q.qVi && q.qVi.trim()) score += 3;
    if (q.aKr && q.aKr.trim()) score += 10;
    if (q.aVi && q.aVi.trim()) score += 8;
  }
  return score;
}

// Hợp nhất từng câu hỏi giữa 2 phiên bản của cùng 1 bộ câu hỏi để không bao giờ mất đáp án hoặc bản dịch
function mergeQuestionsList(newerList = [], olderList = []) {
  if (!Array.isArray(newerList) || newerList.length === 0) return olderList || [];
  if (!Array.isArray(olderList) || olderList.length === 0) return newerList;

  return newerList.map((newQ, idx) => {
    const oldQ = olderList.find(o => o.qKr && newQ.qKr && o.qKr.trim() === newQ.qKr.trim()) || olderList[idx];
    if (!oldQ) return newQ;
    return {
      num: newQ.num || oldQ.num || `${idx + 1}.`,
      qKr: (newQ.qKr && newQ.qKr.trim()) ? newQ.qKr : (oldQ.qKr || ''),
      qVi: (newQ.qVi && newQ.qVi.trim()) ? newQ.qVi : (oldQ.qVi || ''),
      aKr: (newQ.aKr && newQ.aKr.trim()) ? newQ.aKr : (oldQ.aKr || ''),
      aVi: (newQ.aVi && newQ.aVi.trim()) ? newQ.aVi : (oldQ.aVi || '')
    };
  });
}

// API Quản lý bộ câu hỏi (Question Sets CRUD)
app.get('/api/sets', (req, res) => {
  const sets = loadSets();
  res.json({ success: true, sets });
});

// API Đồng bộ 2 chiều giữa trình duyệt (localStorage) và Server (chống mất dữ liệu khi Render ngủ/reset)
app.post('/api/sets/sync', (req, res) => {
  try {
    const { sets: clientSets = [], deletedIds = [] } = req.body || {};
    const deletedSet = new Set(Array.isArray(deletedIds) ? deletedIds : []);
    let serverSets = loadSets().filter(s => s && s.id && !deletedSet.has(s.id));

    if (Array.isArray(clientSets) && clientSets.length > 0) {
      let hasChanges = deletedSet.size > 0;

      for (const cSet of clientSets) {
        if (!cSet || !cSet.id || !Array.isArray(cSet.questions) || deletedSet.has(cSet.id)) continue;

        const sIdx = serverSets.findIndex(s => s.id === cSet.id);
        if (sIdx === -1) {
          // Bộ câu hỏi có trên máy người dùng nhưng bị mất trên server (do Render khởi động lại) -> Khôi phục ngay
          serverSets.unshift({
            id: cSet.id,
            title: (cSet.title || 'Bộ câu hỏi đã lưu').trim(),
            description: (cSet.description || '').trim(),
            createdAt: cSet.createdAt || new Date().toISOString(),
            updatedAt: cSet.updatedAt || new Date().toISOString(),
            questions: cSet.questions
          });
          hasChanges = true;
        } else {
          const sSet = serverSets[sIdx];
          const cTime = new Date(cSet.updatedAt || cSet.createdAt || 0).getTime() || 0;
          const sTime = new Date(sSet.updatedAt || sSet.createdAt || 0).getTime() || 0;
          const cRichness = calculateSetRichness(cSet);
          const sRichness = calculateSetRichness(sSet);

          if (cTime > sTime || cRichness > sRichness) {
            const primaryQuestions = (cTime >= sTime || cRichness >= sRichness) ? cSet.questions : sSet.questions;
            const secondaryQuestions = (primaryQuestions === cSet.questions) ? sSet.questions : cSet.questions;
            const mergedQuestions = mergeQuestionsList(primaryQuestions, secondaryQuestions);

            serverSets[sIdx] = {
              ...sSet,
              title: (cTime >= sTime && cSet.title) ? cSet.title.trim() : sSet.title,
              description: (cTime >= sTime && cSet.description !== undefined) ? cSet.description.trim() : (sSet.description || ''),
              updatedAt: new Date(Math.max(cTime, sTime, Date.now())).toISOString(),
              questions: mergedQuestions
            };
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        saveSets(serverSets);
      }
    }

    return res.json({ success: true, sets: serverSets });
  } catch (err) {
    console.error('Lỗi đồng bộ bộ câu hỏi:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sets', (req, res) => {
  try {
    const { id: customId, title, description = '', questions = [] } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập tên bộ câu hỏi' });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, error: 'Bộ câu hỏi phải có ít nhất 1 câu' });
    }

    const sets = loadSets();
    const targetId = customId || ('set_' + Date.now());
    const existingIdx = sets.findIndex(s => s.id === targetId);

    const newSet = {
      id: targetId,
      title: title.trim(),
      description: description.trim(),
      createdAt: existingIdx !== -1 ? sets[existingIdx].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions
    };

    if (existingIdx !== -1) {
      sets[existingIdx] = newSet;
    } else {
      sets.unshift(newSet);
    }
    saveSets(sets);

    res.json({ success: true, set: newSet });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/sets/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;
    const sets = loadSets();
    const index = sets.findIndex(s => s.id === id);

    // Nếu bộ câu hỏi không tìm thấy trên server (do Render ngủ dậy bị reset), tự động tạo lại (Upsert) thay vì báo lỗi 404
    if (index === -1) {
      if (Array.isArray(questions) && questions.length > 0) {
        const recoveredSet = {
          id,
          title: (title && title.trim()) ? title.trim() : 'Bộ câu hỏi đã lưu',
          description: description !== undefined ? String(description).trim() : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          questions
        };
        sets.unshift(recoveredSet);
        saveSets(sets);
        return res.json({ success: true, set: recoveredSet, recovered: true });
      }
      return res.status(404).json({ success: false, error: 'Không tìm thấy bộ câu hỏi' });
    }

    if (title && title.trim()) sets[index].title = title.trim();
    if (description !== undefined) sets[index].description = description.trim();
    if (Array.isArray(questions) && questions.length > 0) sets[index].questions = questions;
    sets[index].updatedAt = new Date().toISOString();

    saveSets(sets);
    res.json({ success: true, set: sets[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/sets/:id', (req, res) => {
  try {
    const { id } = req.params;
    let sets = loadSets();
    sets = sets.filter(s => s.id !== id);
    saveSets(sets);
    res.json({ success: true, message: 'Đã xóa bộ câu hỏi thành công' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper dịch Hàn -> Việt đa luồng (có dự phòng chống chặn IP trên Render)
async function translateKoToViServer(rawText) {
  if (!rawText || !String(rawText).trim()) return '';
  const clean = String(rawText).trim();

  // Luồng 1: Google Translate GTX với User-Agent trình duyệt chuẩn
  try {
    const url1 = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=vi&dt=t&q=${encodeURIComponent(clean)}`;
    const resp1 = await fetch(url1, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json,text/plain,*/*'
      },
      signal: AbortSignal.timeout(7000)
    });
    if (resp1.ok) {
      const data1 = await resp1.json();
      if (Array.isArray(data1) && Array.isArray(data1[0])) {
        const trans1 = data1[0].map(item => (item && item[0]) ? item[0] : '').join('').trim();
        if (trans1) return trans1;
      }
    }
  } catch (e1) {
    console.warn('Translate GTX fallback:', e1.message);
  }

  // Luồng 2: Google Translate dict-chrome-ex endpoint
  try {
    const url2 = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=ko&tl=vi&q=${encodeURIComponent(clean)}`;
    const resp2 = await fetch(url2, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(7000)
    });
    if (resp2.ok) {
      const data2 = await resp2.json();
      if (Array.isArray(data2)) {
        const first = data2[0];
        if (typeof first === 'string' && first.trim()) return first.trim();
        if (Array.isArray(first) && typeof first[0] === 'string') return first[0].trim();
      }
    }
  } catch (e2) {
    console.warn('Translate clients5 fallback:', e2.message);
  }

  // Luồng 3: MyMemory Translation API
  try {
    const url3 = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=ko|vi`;
    const resp3 = await fetch(url3, { signal: AbortSignal.timeout(7000) });
    if (resp3.ok) {
      const data3 = await resp3.json();
      if (data3 && data3.responseData && data3.responseData.translatedText) {
        return String(data3.responseData.translatedText).trim();
      }
    }
  } catch (e3) {
    console.warn('Translate MyMemory fallback:', e3.message);
  }

  return '';
}

// API dịch tự động Hàn -> Việt (1 câu)
app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.json({ success: true, translation: '' });
    }
    const translation = await translateKoToViServer(text);
    if (!translation) {
      return res.status(502).json({ success: false, error: 'Không thể dịch tự động lúc này' });
    }
    return res.json({ success: true, translation });
  } catch (err) {
    console.error('Lỗi dịch:', err.message);
    return res.status(500).json({ success: false, error: 'Không thể dịch' });
  }
});

// API dịch hàng loạt Hàn -> Việt tốc độ cao (Batch Translate)
app.post('/api/translate-batch', async (req, res) => {
  try {
    const { texts = [] } = req.body || {};
    if (!Array.isArray(texts) || texts.length === 0) {
      return res.json({ success: true, translations: [] });
    }

    const results = new Array(texts.length).fill('');
    const CHUNK_SIZE = 20;

    for (let start = 0; start < texts.length; start += CHUNK_SIZE) {
      const slice = texts.slice(start, start + CHUNK_SIZE).map(t => String(t || '').replace(/\r?\n/g, ' ').trim());
      const nonEmptyIndices = [];
      const nonEmptyLines = [];

      slice.forEach((line, idx) => {
        if (line) {
          nonEmptyIndices.push(start + idx);
          nonEmptyLines.push(line);
        }
      });

      if (nonEmptyLines.length === 0) continue;

      // Thử gộp dịch cả cụm bằng dấu xuống dòng
      const joined = nonEmptyLines.join('\n');
      const batchTranslated = await translateKoToViServer(joined);
      const splitLines = batchTranslated ? batchTranslated.split(/\r?\n/).map(s => s.trim()) : [];

      if (splitLines.length === nonEmptyLines.length) {
        nonEmptyIndices.forEach((targetIdx, i) => {
          results[targetIdx] = splitLines[i];
        });
      } else {
        // Nếu số dòng trả về lệch, dịch song song từng câu trong nhóm nhỏ
        await Promise.all(nonEmptyIndices.map(async (targetIdx, i) => {
          results[targetIdx] = await translateKoToViServer(nonEmptyLines[i]);
        }));
      }
    }

    return res.json({ success: true, translations: results });
  } catch (err) {
    console.error('Lỗi dịch hàng loạt:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API tổng hợp giọng nói cho từng câu đơn lẻ hoặc danh sách câu
app.post('/api/tts', async (req, res) => {
  try {
    const { 
      text, 
      sentences: customSentences, 
      voice = 'ko-KR-SunHiNeural', 
      speed = 1.0, 
      pitch = 0,
      pauseDuration = 0,
      repeatCount = 1
    } = req.body;

    let targetSentences = [];
    if (Array.isArray(customSentences) && customSentences.length > 0) {
      targetSentences = customSentences.map(s => String(s).trim()).filter(Boolean);
    } else if (text && typeof text === 'string') {
      targetSentences = [text.trim()];
    }

    if (targetSentences.length === 0) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập văn bản tiếng Hàn' });
    }

    const clampedSpeed = Math.max(0.5, Math.min(2.0, parseFloat(speed) || 1.0));
    const clampedPitch = Math.max(-50, Math.min(50, parseInt(pitch, 10) || 0));
    const clampedPause = Math.max(0, Math.min(10, parseFloat(pauseDuration) || 0));
    const clampedRepeat = Math.max(1, Math.min(3, parseInt(repeatCount, 10) || 1));

    // Đơn câu không lặp: Tổng hợp trực tiếp tốc độ cao
    if (targetSentences.length === 1 && clampedRepeat === 1) {
      const buffer = await edgeSpeak(targetSentences[0], voice, clampedSpeed, clampedPitch);

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
        'Content-Disposition': 'inline; filename="korean_voice.mp3"',
        'Cache-Control': 'no-cache'
      });
      return res.end(buffer);
    }

    // Nhiều câu hoặc có khoảng dừng/lặp lại
    const silenceBuffer = clampedPause > 0 ? await createSilenceMp3(clampedPause) : Buffer.alloc(0);
    const repeatSilenceBuffer = clampedRepeat > 1 ? await createSilenceMp3(Math.min(clampedPause, 1.0) || 0.8) : Buffer.alloc(0);

    const audioBuffers = [];
    for (let i = 0; i < targetSentences.length; i++) {
      const buf = await edgeSpeak(targetSentences[i], voice, clampedSpeed, clampedPitch);
      audioBuffers.push(buf);
    }

    const finalChunks = [];
    for (let i = 0; i < audioBuffers.length; i++) {
      for (let r = 0; r < clampedRepeat; r++) {
        finalChunks.push(audioBuffers[i]);
        if (r < clampedRepeat - 1 && repeatSilenceBuffer.length > 0) {
          finalChunks.push(repeatSilenceBuffer);
        }
      }
      if (i < audioBuffers.length - 1 && silenceBuffer.length > 0) {
        finalChunks.push(silenceBuffer);
      }
    }

    const mergedBuffer = Buffer.concat(finalChunks);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': mergedBuffer.length,
      'Content-Disposition': 'inline; filename="korean_practice.mp3"',
      'Cache-Control': 'no-cache'
    });

    return res.end(mergedBuffer);
  } catch (error) {
    console.error('Lỗi tổng hợp giọng nói:', error);
    return res.status(500).json({
      success: false,
      error: 'Không thể tạo âm thanh: ' + (error.message || 'Lỗi server')
    });
  }
});

// API tổng hợp bài học Hỏi - Đáp hoàn chỉnh (Tải toàn bộ bài nghe EPS-TOPIK)
app.post('/api/tts-qa-playlist', async (req, res) => {
  try {
    const { 
      items = [], 
      voice = 'ko-KR-SunHiNeural', 
      speed = 1.0, 
      pauseDuration = 3.0 
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Danh sách bài học trống' });
    }

    const clampedSpeed = Math.max(0.5, Math.min(2.0, parseFloat(speed) || 1.0));
    const clampedPause = Math.max(0.5, Math.min(10, parseFloat(pauseDuration) || 3.0));
    const silenceBuffer = await createSilenceMp3(clampedPause);

    const chunks = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.question) {
        const qBuf = await edgeSpeak(item.question, voice, clampedSpeed);
        chunks.push(qBuf);
        chunks.push(silenceBuffer);
      }
      if (item.answer) {
        const aBuf = await edgeSpeak(item.answer, voice, clampedSpeed);
        chunks.push(aBuf);
        if (i < items.length - 1) {
          chunks.push(silenceBuffer);
        }
      }
    }

    const fullBuffer = Buffer.concat(chunks);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': fullBuffer.length,
      'Content-Disposition': 'inline; filename="korean_full_lesson.mp3"',
      'Cache-Control': 'no-cache'
    });

    return res.end(fullBuffer);
  } catch (error) {
    console.error('Lỗi tổng hợp playlist:', error);
    return res.status(500).json({
      success: false,
      error: 'Không thể tạo file âm thanh toàn bài: ' + error.message
    });
  }
});

// Helper lấy danh sách IP mạng nội bộ (LAN / Wi-Fi)
function getNetworkAddresses() {
  const nets = os.networkInterfaces();
  const list = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        const isVirtual = /vmware|virtualbox|vethernet|hyper-v|loopback/i.test(name);
        list.push({
          name,
          ip: net.address,
          isVirtual
        });
      }
    }
  }

  // Ưu tiên card mạng thật: Wi-Fi hoặc Ethernet lên đầu, đẩy card ảo (VMware) xuống dưới
  list.sort((a, b) => {
    if (a.isVirtual && !b.isVirtual) return 1;
    if (!a.isVirtual && b.isVirtual) return -1;
    if (/wi-fi|wireless|wlan/i.test(a.name) && !/wi-fi|wireless|wlan/i.test(b.name)) return -1;
    if (!/wi-fi|wireless|wlan/i.test(a.name) && /wi-fi|wireless|wlan/i.test(b.name)) return 1;
    return 0;
  });

  return list;
}

// API lấy thông tin mạng & mã QR để kết nối điện thoại
app.get('/api/network-info', async (req, res) => {
  try {
    const list = getNetworkAddresses();
    if (list.length === 0) {
      list.push({ name: 'Localhost', ip: '127.0.0.1', isVirtual: false });
    }

    const enhancedInterfaces = await Promise.all(list.map(async item => {
      const url = `http://${item.ip}:${PORT}`;
      const qr = await QRCode.toDataURL(url, {
        margin: 1,
        width: 280,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
      return {
        name: item.name,
        ip: item.ip,
        url,
        qrDataUrl: qr,
        isVirtual: item.isVirtual
      };
    }));

    const primary = enhancedInterfaces[0];

    return res.json({
      success: true,
      port: PORT,
      primaryIp: primary.ip,
      primaryInterface: primary.name,
      phoneUrl: primary.url,
      qrDataUrl: primary.qrDataUrl,
      interfaces: enhancedInterfaces
    });
  } catch (err) {
    console.error('Lỗi tạo mã QR mạng:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const list = getNetworkAddresses();
  const primary = list[0] || { name: 'Localhost', ip: '127.0.0.1' };
  const phoneUrl = `http://${primary.ip}:${PORT}`;

  console.log(`=======================================================`);
  console.log(`🚀 Korean Voice Studio & Luyện Tiếng Hàn đã khởi động!`);
  console.log(`💻 Dùng trên máy tính  : http://localhost:${PORT}`);
  console.log(`📱 Dùng trên điện thoại : ${phoneUrl} (Cùng Wi-Fi)`);
  console.log(`=======================================================`);
});
