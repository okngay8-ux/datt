const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const QRCode = require('qrcode');
const { TextToSpeech } = require('@kirillasyamov/text-to-speech');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Thư mục lưu trữ bộ câu hỏi trên server
const DATA_DIR = path.join(__dirname, 'data');
const SETS_FILE = path.join(DATA_DIR, 'question_sets.json');

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

// Cache instance TTS
const ttsClient = new TextToSpeech();

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

// API Quản lý bộ câu hỏi (Question Sets CRUD)
app.get('/api/sets', (req, res) => {
  const sets = loadSets();
  res.json({ success: true, sets });
});

app.post('/api/sets', (req, res) => {
  try {
    const { title, description = '', questions = [] } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập tên bộ câu hỏi' });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, error: 'Bộ câu hỏi phải có ít nhất 1 câu' });
    }

    const sets = loadSets();
    const newSet = {
      id: 'set_' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions
    };

    sets.unshift(newSet);
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

    if (index === -1) {
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
    const initialLen = sets.length;
    sets = sets.filter(s => s.id !== id);

    if (sets.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bộ câu hỏi' });
    }

    saveSets(sets);
    res.json({ success: true, message: 'Đã xóa bộ câu hỏi thành công' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API dịch tự động Hàn -> Việt
app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.json({ success: true, translation: '' });
    }
    const clean = text.trim();
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=vi&dt=t&q=${encodeURIComponent(clean)}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const translation = data[0].map(item => item[0]).join('');
    return res.json({ success: true, translation });
  } catch (err) {
    console.error('Lỗi dịch:', err.message);
    return res.status(500).json({ success: false, error: 'Không thể dịch' });
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
      const audioBuffer = await ttsClient.speak(targetSentences[0], {
        voice,
        speed: clampedSpeed,
        pitch: clampedPitch,
        format: 'audio-24khz-48kbitrate-mono-mp3'
      });

      const buffer = Buffer.from(audioBuffer);
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
      const s = targetSentences[i];
      const audio = await ttsClient.speak(s, {
        voice,
        speed: clampedSpeed,
        pitch: clampedPitch,
        format: 'audio-24khz-48kbitrate-mono-mp3'
      });
      audioBuffers.push(Buffer.from(audio));
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
        const qAudio = await ttsClient.speak(item.question, {
          voice,
          speed: clampedSpeed,
          format: 'audio-24khz-48kbitrate-mono-mp3'
        });
        chunks.push(Buffer.from(qAudio));
        chunks.push(silenceBuffer);
      }
      if (item.answer) {
        const aAudio = await ttsClient.speak(item.answer, {
          voice,
          speed: clampedSpeed,
          format: 'audio-24khz-48kbitrate-mono-mp3'
        });
        chunks.push(Buffer.from(aAudio));
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
