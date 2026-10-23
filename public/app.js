// Korean Voice Studio Interactive Player

// Bộ dữ liệu 10 câu mẫu đúng chuẩn (Câu 79 - 88)
const DEFAULT_KOREAN_QUESTIONS = [
  {
    num: "79.",
    qKr: "중량물이 무엇인지 알고 있나요?",
    qVi: "Bạn có biết vật nặng là gì không?",
    aKr: "중량물은 사람이 쉽게 들거나 옮기기 어려운 무거운 물건입니다.",
    aVi: "Vật nặng là vật khó nâng hoặc di chuyển bằng sức người."
  },
  {
    num: "80.",
    qKr: "중량물 들기는 왜 허리 펴고 다리 힘을 이용해야 할까요?",
    qVi: "Tại sao khi nâng vật nặng phải thẳng lưng và dùng lực chân?",
    aKr: "허리 부상을 예방하고 척추에 가해지는 부담을 줄이기 위해서입니다.",
    aVi: "Để phòng tránh chấn thương lưng và giảm tải áp lực lên cột sống."
  },
  {
    num: "81.",
    qKr: "무거운 물건은 어떻게 들어야 하나요?",
    qVi: "Phải nâng vật nặng như thế nào?",
    aKr: "물건에 최대한 가까이 붙어서 무릎을 굽히고 다리 힘으로 일어나야 합니다.",
    aVi: "Phải đứng sát vào vật, gập đầu gối và dùng sức của chân để đứng lên."
  },
  {
    num: "82.",
    qKr: "운반이 무엇인가요?",
    qVi: "Vận chuyển là gì?",
    aKr: "물건을 한 곳에서 다른 곳으로 옮기는 작업입니다.",
    aVi: "Là công việc di chuyển đồ vật từ nơi này sang nơi khác."
  },
  {
    num: "83.",
    qKr: "운반 기구가 무엇인가요?",
    qVi: "Dụng cụ vận chuyển là gì?",
    aKr: "손수레, 대차, 지게차 등 물건을 안전하고 쉽게 옮기기 위한 도구입니다.",
    aVi: "Là các công cụ như xe đẩy tay, xe kéo, xe nâng để di chuyển hàng an toàn và dễ dàng."
  },
  {
    num: "84.",
    qKr: "중량물 운반 시 왜 운반기구를 활용해야 할까요?",
    qVi: "Tại sao khi vận chuyển vật nặng nên dùng dụng cụ vận chuyển?",
    aKr: "근골격계 질환을 예방하고 작업의 효율성과 안전을 높이기 위해서입니다.",
    aVi: "Để phòng ngừa các bệnh cơ xương khớp và nâng cao hiệu quả cũng như an toàn lao động."
  },
  {
    num: "85.",
    qKr: "무거운 물건을 옮길 때에는 어떻게 해야 하나요?",
    qVi: "Khi di chuyển vật nặng thì phải làm thế nào?",
    aKr: "혼자 들기 어려우면 동료와 함께 들거나 운반기구를 사용해야 합니다.",
    aVi: "Nếu khó nâng một mình thì phải nhờ đồng nghiệp nâng cùng hoặc dùng dụng cụ vận chuyển."
  },
  {
    num: "86.",
    qKr: "이동이 무엇인가요?",
    qVi: "Di chuyển là gì?",
    aKr: "작업자가 작업장 내에서 통로를 따라 걸어서 자리를 옮기는 것입니다.",
    aVi: "Là việc người lao động đi lại chuyển vị trí theo lối đi trong nơi làm việc."
  },
  {
    num: "87.",
    qKr: "안전통로가 무엇인가요?",
    qVi: "Lối đi an toàn là gì?",
    aKr: "작업장 내에서 근로자가 안전하게 이동할 수 있도록 장애물이 없는 통로입니다.",
    aVi: "Là lối đi thông thoáng, không có chướng ngại vật để công nhân di chuyển an toàn trong xưởng."
  },
  {
    num: "88.",
    qKr: "이동 시 왜 안전통로를 이용해야 할까요?",
    qVi: "Tại sao khi di chuyển phải đi theo lối đi an toàn?",
    aKr: "넘어짐이나 기계, 지게차 등과의 충돌 사고를 예방하기 위해서입니다.",
    aVi: "Để phòng tránh tai nạn trượt ngã hoặc va chạm với máy móc, xe nâng hàng."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  let savedSets = [];
  let activeSetId = localStorage.getItem('korean_active_set_id') || localStorage.getItem('epstopik_active_set_id') || 'set_heavy_79_88';
  let questions = JSON.parse(localStorage.getItem('korean_questions') || localStorage.getItem('epstopik_questions') || 'null') || [...DEFAULT_KOREAN_QUESTIONS];
  let originalQuestions = JSON.parse(JSON.stringify(questions)); // Lưu đúng thứ tự gốc
  let currentIndex = 0;
  let isPlaying = false;
  let repeatMode = 'all'; // '1' (lặp 1 câu), 'all' (lặp toàn bộ), 'off' (dừng khi hết)
  let isShuffle = false;
  let delaySeconds = 3;
  let isAscending = true;
  let currentVoice = 'ko-KR-SunHiNeural';
  let currentSpeed = 1.0;

  // Chế độ luyện thi & đếm giờ
  let examMode = 'manual'; // 'manual' (bấm nút khi trả lời xong) hoặc 'auto' (tự động theo độ trễ)
  let isAnswerRevealed = false;
  let examTimerSeconds = 0;
  let examTimerInterval = null;
  let isExamTimerRunning = false;

  // Audio Playback Engine & Timer Tracking
  const audio = new Audio();
  let countdownInterval = null;
  let audioTimeout = null;
  let playbackSessionId = 0;
  const audioCache = new Map(); // cache URL âm thanh

  function clearAllTimers() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    if (audioTimeout) {
      clearTimeout(audioTimeout);
      audioTimeout = null;
    }
  }

  // DOM Elements - Stage
  const displayQuestionKr = document.getElementById('displayQuestionKr');
  const displayQuestionVi = document.getElementById('displayQuestionVi');
  const answerBoxContainer = document.getElementById('answerBoxContainer');
  const displayAnswerKr = document.getElementById('displayAnswerKr');
  const displayAnswerVi = document.getElementById('displayAnswerVi');
  const statusPill = document.getElementById('statusPill');
  const miniVisualizer = document.getElementById('miniVisualizer');
  
  // DOM Elements - Set Picker & Save
  const selectActiveSet = document.getElementById('selectActiveSet');
  const btnQuickSaveSet = document.getElementById('btnQuickSaveSet');

  // Controls
  const counterText = document.getElementById('counterText');
  const orderArrow = document.getElementById('orderArrow');
  const btnToggleOrder = document.getElementById('btnToggleOrder');
  const btnPrev = document.getElementById('btnPrev');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const btnNext = document.getElementById('btnNext');
  const btnRepeatMode = document.getElementById('btnRepeatMode');
  const repeatSubBadge = document.getElementById('repeatSubBadge');
  const btnShuffle = document.getElementById('btnShuffle');
  const btnDelayMinus = document.getElementById('btnDelayMinus');
  const btnDelayPlus = document.getElementById('btnDelayPlus');
  const delayValueText = document.getElementById('delayValueText');
  const selectVoice = document.getElementById('selectVoice');
  const selectSpeed = document.getElementById('selectSpeed');
  const btnDownloadCurrent = document.getElementById('btnDownloadCurrent');
  const btnDownloadAll = document.getElementById('btnDownloadAll');

  // Playlist Container
  const playlistContainer = document.getElementById('playlistContainer');

  // Modal 1: Quản lý câu hỏi & Thư viện bộ câu
  const btnOpenManager = document.getElementById('btnOpenManager');
  const managerModal = document.getElementById('managerModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCloseModalBottom = document.getElementById('btnCloseModalBottom');
  const tabSavedSets = document.getElementById('tabSavedSets');
  const tabBulk = document.getElementById('tabBulk');
  const tabSettings = document.getElementById('tabSettings');
  const panelSavedSets = document.getElementById('panelSavedSets');
  const panelBulk = document.getElementById('panelBulk');
  const panelSettings = document.getElementById('panelSettings');
  const savedSetsList = document.getElementById('savedSetsList');
  const savedSetsCountBadge = document.getElementById('savedSetsCountBadge');
  const btnOpenSaveModalFromLib = document.getElementById('btnOpenSaveModalFromLib');
  const btnExportJson = document.getElementById('btnExportJson');
  const importJsonInput = document.getElementById('importJsonInput');

  // Modal 2: Popup Lưu bộ câu hỏi
  const saveSetModal = document.getElementById('saveSetModal');
  const btnCloseSaveModal = document.getElementById('btnCloseSaveModal');
  const btnCancelSave = document.getElementById('btnCancelSave');
  const btnConfirmSaveSet = document.getElementById('btnConfirmSaveSet');
  const saveSetTitle = document.getElementById('saveSetTitle');
  const saveSetDesc = document.getElementById('saveSetDesc');
  const saveSetCountLabel = document.getElementById('saveSetCountLabel');
  const updateExistingOptionGroup = document.getElementById('updateExistingOptionGroup');
  const chkOverwriteCurrentSet = document.getElementById('chkOverwriteCurrentSet');
  const currentSetNameLabel = document.getElementById('currentSetNameLabel');

  // Bulk input elements
  const bulkInputText = document.getElementById('bulkInputText');
  const btnApplyBulk = document.getElementById('btnApplyBulk');
  const btnLoadDefaultSample = document.getElementById('btnLoadDefaultSample');

  // Modal 3: Kết nối Điện thoại (QR Code)
  const btnOpenPhoneModal = document.getElementById('btnOpenPhoneModal');
  const phoneModal = document.getElementById('phoneModal');
  const btnClosePhoneModal = document.getElementById('btnClosePhoneModal');
  const btnClosePhoneModalBottom = document.getElementById('btnClosePhoneModalBottom');
  const phoneQrImage = document.getElementById('phoneQrImage');
  const phoneQrLoading = document.getElementById('phoneQrLoading');
  const phoneUrlInput = document.getElementById('phoneUrlInput');
  const btnCopyPhoneUrl = document.getElementById('btnCopyPhoneUrl');
  const interfaceRow = document.getElementById('interfaceRow');
  const selectNetworkInterface = document.getElementById('selectNetworkInterface');

  // Settings elements
  const chkAutoTranslateMissing = document.getElementById('chkAutoTranslateMissing');
  const chkSpeakAnswerToo = document.getElementById('chkSpeakAnswerToo');

  // Exam Timer DOM
  const examTimerBox = document.getElementById('examTimerBox');
  const examTimerText = document.getElementById('examTimerText');
  const btnToggleTimer = document.getElementById('btnToggleTimer');
  const btnResetTimer = document.getElementById('btnResetTimer');

  // Exam Practice Mode DOM
  const btnModeExam = document.getElementById('btnModeExam');
  const btnModeAuto = document.getElementById('btnModeAuto');
  const btnExamShowAnswer = document.getElementById('btnExamShowAnswer');
  const btnExamNext = document.getElementById('btnExamNext');
  const btnRestoreOrder = document.getElementById('btnRestoreOrder');

  // Exam Result Modal DOM
  const examResultModal = document.getElementById('examResultModal');
  const btnCloseResultModal = document.getElementById('btnCloseResultModal');
  const resultHeading = document.getElementById('resultHeading');
  const resultTotalTime = document.getElementById('resultTotalTime');
  const resultTotalQuestions = document.getElementById('resultTotalQuestions');
  const resultAvgSpeed = document.getElementById('resultAvgSpeed');
  const btnRestartExam = document.getElementById('btnRestartExam');
  const btnShuffleAndRestart = document.getElementById('btnShuffleAndRestart');

  // Customizer Drawer DOM
  const btnOpenCustomizer = document.getElementById('btnOpenCustomizer');
  const customizerBackdrop = document.getElementById('customizerBackdrop');
  const customizerDrawer = document.getElementById('customizerDrawer');
  const btnCloseCustomizer = document.getElementById('btnCloseCustomizer');
  const btnCloseCustomizerBottom = document.getElementById('btnCloseCustomizerBottom');
  const accentColorPreviewBadge = document.getElementById('accentColorPreviewBadge');
  const customColorPicker = document.getElementById('customColorPicker');
  const labelFontSizeKr = document.getElementById('labelFontSizeKr');
  const rangeFontSizeKr = document.getElementById('rangeFontSizeKr');
  const labelFontSizeVi = document.getElementById('labelFontSizeVi');
  const rangeFontSizeVi = document.getElementById('rangeFontSizeVi');
  const labelFontSizeAns = document.getElementById('labelFontSizeAns');
  const rangeFontSizeAns = document.getElementById('rangeFontSizeAns');
  const toggleShowVi = document.getElementById('toggleShowVi');
  const toggleShowTimer = document.getElementById('toggleShowTimer');
  const toggleShowVisualizer = document.getElementById('toggleShowVisualizer');
  const toggleGlassGlow = document.getElementById('toggleGlassGlow');
  const customizerVoiceSelect = document.getElementById('customizerVoiceSelect');
  const customizerSpeedSelect = document.getElementById('customizerSpeedSelect');
  const rangeCustomizerDelay = document.getElementById('rangeCustomizerDelay');
  const labelCustomizerDelay = document.getElementById('labelCustomizerDelay');
  const btnResetCustomizer = document.getElementById('btnResetCustomizer');

  // Minimalist Mode Toggle DOM
  const btnToggleMinimal = document.getElementById('btnToggleMinimal');
  const minimalBtnText = document.getElementById('minimalBtnText');
  const toggleMinimalMode = document.getElementById('toggleMinimalMode');
  const btnExitMinimalBottom = document.getElementById('btnExitMinimalBottom');
  const btnEnterMinimalStage = document.getElementById('btnEnterMinimalStage');

  // iPhone 13 Pro Mode Toggle DOM
  const btnToggleIPhone13 = document.getElementById('btnToggleIPhone13');
  const iphone13BtnText = document.getElementById('iphone13BtnText');
  const toggleIPhone13Mode = document.getElementById('toggleIPhone13Mode');

  // Stage Top Quick Actions & In-Place Quick Edit Modal DOM
  const btnQuickEditCurrent = document.getElementById('btnQuickEditCurrent');
  const btnQuickAddStage = document.getElementById('btnQuickAddStage');
  const quickEditModal = document.getElementById('quickEditModal');
  const btnCloseQuickEditModal = document.getElementById('btnCloseQuickEditModal');
  const btnCancelQuickEdit = document.getElementById('btnCancelQuickEdit');
  const quickEditModalTitle = document.getElementById('quickEditModalTitle');
  const editQuestionNum = document.getElementById('editQuestionNum');
  const editQuestionKr = document.getElementById('editQuestionKr');
  const editQuestionVi = document.getElementById('editQuestionVi');
  const editAnswerKr = document.getElementById('editAnswerKr');
  const editAnswerVi = document.getElementById('editAnswerVi');
  const btnPreviewQuestionAudio = document.getElementById('btnPreviewQuestionAudio');
  const btnPreviewAnswerAudio = document.getElementById('btnPreviewAnswerAudio');
  const btnAutoTranslateQuestion = document.getElementById('btnAutoTranslateQuestion');
  const btnAutoTranslateAnswer = document.getElementById('btnAutoTranslateAnswer');
  const btnDeleteCurrentQuestion = document.getElementById('btnDeleteCurrentQuestion');
  const btnAddQuestionAfter = document.getElementById('btnAddQuestionAfter');
  const btnSaveQuickEdit = document.getElementById('btnSaveQuickEdit');

  // Customizer State
  const defaultVisualSettings = {
    theme: 'dark',
    accentColor: '#38bdf8',
    fontSizeKr: 28,
    fontSizeVi: 17,
    fontSizeAns: 16,
    showVi: true,
    showTimer: true,
    showVisualizer: true,
    glassGlow: true,
    delay: 3,
    voice: 'ko-KR-SunHiNeural',
    speed: 1.0
  };

  let visualSettings = { ...defaultVisualSettings };
  let editingQuestionIndex = 0;
  let isAddingNewQuestion = false;
  let cachedNetworkData = null;
  let stageTranslateToken = 0;
  let isDraggingPlaylist = false;
  let playlistStartY = 0;
  let playlistStartScrollTop = 0;
  let hasDraggedPlaylist = false;

  async function init() {
    // 0. Sửa ngay lập tức toàn bộ lỗi dịch sai và lệch bộ câu hỏi trong localStorage của người dùng
    if (window.KoViDict) {
      if (Array.isArray(questions)) {
        questions = window.KoViDict.repairQuestionsList(questions);
        try { localStorage.setItem('korean_questions', JSON.stringify(questions)); } catch (e) {}
      }
      let rawSets = loadSavedSetsFromStorage();
      if (Array.isArray(rawSets) && rawSets.length > 0) {
        rawSets.forEach(s => {
          if (s && Array.isArray(s.questions)) {
            // Khôi phục nếu bộ 46 câu từng bị đè nhầm thành 101 câu
            if (s.id === 'set_1792223473614' && (s.questions.length > 50 || (s.questions[0] && s.questions[0].qKr && s.questions[0].qKr.includes('버니어캘리퍼스')))) {
              s.title = '46 kynangungxu';
            }
            s.questions = window.KoViDict.repairQuestionsList(s.questions);
          }
        });
        savedSets = rawSets;
        saveSetsToStorage(savedSets);
      }
    }

    originalQuestions = JSON.parse(JSON.stringify(questions));
    loadAndApplyVisualSettings();
    bindEvents();
    renderPlaylist();
    try {
      updateStageDisplay();
    } catch (err) {
      console.error('Lỗi hiển thị câu hỏi ban đầu:', err);
    }
    await fetchSavedSets();
  }

  function bindEvents() {
    // Play/Pause button
    btnPlayPause.addEventListener('click', togglePlayPause);

    // Prev / Next
    btnPrev.addEventListener('click', () => navigate(-1));
    btnNext.addEventListener('click', () => navigate(1));

    // Direction / Order toggle
    btnToggleOrder.addEventListener('click', () => {
      isAscending = !isAscending;
      orderArrow.textContent = isAscending ? '↓' : '↑';
    });

    // Repeat mode toggle: 'all' -> '1' -> 'off' -> 'all'
    btnRepeatMode.addEventListener('click', () => {
      if (repeatMode === 'all') {
        repeatMode = '1';
        repeatSubBadge.textContent = '1';
        btnRepeatMode.classList.add('active');
      } else if (repeatMode === '1') {
        repeatMode = 'off';
        repeatSubBadge.textContent = '✕';
        btnRepeatMode.classList.remove('active');
      } else {
        repeatMode = 'all';
        repeatSubBadge.textContent = '∞';
        btnRepeatMode.classList.add('active');
      }
    });

    // Shuffle & Restore Original Order
    btnShuffle.addEventListener('click', shuffleQuestions);
    btnRestoreOrder.addEventListener('click', restoreOriginalOrder);

    // Exam Mode Toggles
    btnModeExam.addEventListener('click', () => setExamMode('manual'));
    btnModeAuto.addEventListener('click', () => setExamMode('auto'));

    // Exam Manual Action Buttons
    btnExamShowAnswer.addEventListener('click', handleExamShowAnswer);
    btnExamNext.addEventListener('click', handleExamNext);

    // Exam Timer Controls
    btnToggleTimer.addEventListener('click', () => {
      if (isExamTimerRunning) pauseExamTimer();
      else startExamTimer();
    });
    btnResetTimer.addEventListener('click', resetExamTimer);

    // Exam Result Modal Controls
    btnCloseResultModal.addEventListener('click', () => {
      examResultModal.style.display = 'none';
    });
    btnRestartExam.addEventListener('click', () => {
      examResultModal.style.display = 'none';
      resetExamTimer();
      restoreOriginalOrder();
      startExamTimer();
    });
    btnShuffleAndRestart.addEventListener('click', () => {
      examResultModal.style.display = 'none';
      resetExamTimer();
      shuffleQuestions();
      startExamTimer();
    });

    // Delay stepper
    btnDelayMinus.addEventListener('click', () => {
      if (delaySeconds > 1) {
        delaySeconds--;
        delayValueText.textContent = `${delaySeconds} s`;
      }
    });

    btnDelayPlus.addEventListener('click', () => {
      if (delaySeconds < 15) {
        delaySeconds++;
        delayValueText.textContent = `${delaySeconds} s`;
      }
    });

    // Voice & Speed
    selectVoice.addEventListener('change', (e) => {
      currentVoice = e.target.value;
      visualSettings.voice = currentVoice;
      if (customizerVoiceSelect) customizerVoiceSelect.value = currentVoice;
      saveVisualSettings();
      audioCache.clear();
      const voiceName = e.target.options[e.target.selectedIndex]?.text || currentVoice;
      showToast(`🎙️ Đã đổi giọng đọc: ${voiceName}`);
      playCurrentQuestion();
    });

    selectSpeed.addEventListener('change', (e) => {
      currentSpeed = parseFloat(e.target.value) || 1.0;
      visualSettings.speed = currentSpeed;
      if (customizerSpeedSelect) customizerSpeedSelect.value = e.target.value;
      saveVisualSettings();
      audioCache.clear();
      const speedLabel = e.target.options[e.target.selectedIndex]?.text || `${currentSpeed}x`;
      showToast(`⚡ Đã đổi tốc độ đọc: ${speedLabel}`);
      playCurrentQuestion();
    });

    // Download handlers
    btnDownloadCurrent.addEventListener('click', downloadCurrentQuestionMp3);
    btnDownloadAll.addEventListener('click', downloadAllPlaylistMp3);

    // Header Set Selector change
    selectActiveSet.addEventListener('change', (e) => {
      const setId = e.target.value;
      loadSetById(setId);
    });

    // Quick Save button on header
    btnQuickSaveSet.addEventListener('click', openSaveSetModal);
    btnOpenSaveModalFromLib.addEventListener('click', openSaveSetModal);

    // Save Set Modal Actions
    btnCloseSaveModal.addEventListener('click', closeSaveSetModal);
    btnCancelSave.addEventListener('click', closeSaveSetModal);
    btnConfirmSaveSet.addEventListener('click', handleSaveSet);

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' || e.key === 'Escape') {
        if (document.body.classList.contains('minimal-mode')) {
          setMinimalMode(false);
          return;
        }
      }
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (examMode === 'manual') {
          // Trong chế độ luyện thi, bấm phím cách (Space) chuyển câu tiếp theo nếu không đang đọc âm thanh
          if (audio.paused) {
            handleExamNext();
          } else {
            togglePlayPause();
          }
        } else {
          togglePlayPause();
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
      }
    });

    // Modal Events
    btnOpenManager.addEventListener('click', () => {
      managerModal.style.display = 'flex';
      renderSavedSetsLibrary();
    });

    const closeModal = () => { managerModal.style.display = 'none'; };
    btnCloseModal.addEventListener('click', closeModal);
    btnCloseModalBottom.addEventListener('click', closeModal);
    managerModal.addEventListener('click', (e) => {
      if (e.target === managerModal) closeModal();
    });

    // Modal Tabs
    tabSavedSets.addEventListener('click', () => switchTab('savedSets'));
    tabBulk.addEventListener('click', () => switchTab('bulk'));
    tabSettings.addEventListener('click', () => switchTab('settings'));

    // Apply Bulk Questions
    btnApplyBulk.addEventListener('click', handleApplyBulk);
    btnLoadDefaultSample.addEventListener('click', () => {
      bulkInputText.value = DEFAULT_KOREAN_QUESTIONS.map(q => `${q.num} ${q.qKr}`).join('\n');
    });

    // Export & Import JSON
    btnExportJson.addEventListener('click', handleExportJson);
    importJsonInput.addEventListener('change', handleImportJson);

    // Bottom floating dictionary
    document.getElementById('btnDict').addEventListener('click', () => {
      const cur = questions[currentIndex]?.qKr || '';
      const cleanWord = cur.replace(/[\d\.\?\!\~]/g, '').trim().split(' ')[0];
      const url = `https://korean.dict.naver.com/koendict/#/search?query=${encodeURIComponent(cleanWord || cur)}`;
      window.open(url, '_blank');
    });

    // Phone Connect Modal Events
    btnOpenPhoneModal.addEventListener('click', () => {
      phoneModal.style.display = 'flex';
      loadNetworkInfo();
    });

    const closePhoneModal = () => { phoneModal.style.display = 'none'; };
    btnClosePhoneModal.addEventListener('click', closePhoneModal);
    btnClosePhoneModalBottom.addEventListener('click', closePhoneModal);
    phoneModal.addEventListener('click', (e) => {
      if (e.target === phoneModal) closePhoneModal();
    });

    btnCopyPhoneUrl.addEventListener('click', handleCopyPhoneUrl);
    selectNetworkInterface.addEventListener('change', handleInterfaceChange);

    // ========================================================
    // Customizer Drawer Events (Bảng Tùy Chỉnh Trực Quan Web)
    // ========================================================
    if (btnOpenCustomizer) {
      btnOpenCustomizer.addEventListener('click', () => {
        customizerDrawer.classList.add('open');
        customizerBackdrop.style.display = 'block';
      });
    }

    const closeCustomizer = () => {
      if (customizerDrawer) customizerDrawer.classList.remove('open');
      if (customizerBackdrop) customizerBackdrop.style.display = 'none';
    };
    if (btnCloseCustomizer) btnCloseCustomizer.addEventListener('click', closeCustomizer);
    if (btnCloseCustomizerBottom) btnCloseCustomizerBottom.addEventListener('click', closeCustomizer);
    if (customizerBackdrop) customizerBackdrop.addEventListener('click', closeCustomizer);

    // Theme Selection Cards
    document.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        visualSettings.theme = card.dataset.theme;
        applyVisualSettings();
        saveVisualSettings();
        syncCustomizerControls();
      });
    });

    // Swatches (Bảng màu có sẵn)
    document.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        visualSettings.accentColor = btn.dataset.color;
        applyVisualSettings();
        saveVisualSettings();
        syncCustomizerControls();
      });
    });

    // Custom Color Picker (Tự chọn màu bất kỳ)
    if (customColorPicker) {
      customColorPicker.addEventListener('input', (e) => {
        visualSettings.accentColor = e.target.value;
        applyVisualSettings();
        saveVisualSettings();
        syncCustomizerControls();
      });
    }

    // Font size sliders (Thay đổi cỡ chữ theo thời gian thực)
    if (rangeFontSizeKr) {
      rangeFontSizeKr.addEventListener('input', (e) => {
        visualSettings.fontSizeKr = parseInt(e.target.value, 10);
        applyVisualSettings();
        saveVisualSettings();
      });
    }
    if (rangeFontSizeVi) {
      rangeFontSizeVi.addEventListener('input', (e) => {
        visualSettings.fontSizeVi = parseInt(e.target.value, 10);
        applyVisualSettings();
        saveVisualSettings();
      });
    }
    if (rangeFontSizeAns) {
      rangeFontSizeAns.addEventListener('input', (e) => {
        visualSettings.fontSizeAns = parseInt(e.target.value, 10);
        applyVisualSettings();
        saveVisualSettings();
      });
    }

    // Toggles (Hiện/Ẩn tiếng Việt, timer, visualizer, glass)
    if (toggleShowVi) {
      toggleShowVi.addEventListener('change', (e) => {
        visualSettings.showVi = e.target.checked;
        applyVisualSettings();
        saveVisualSettings();
      });
    }
    if (toggleShowTimer) {
      toggleShowTimer.addEventListener('change', (e) => {
        visualSettings.showTimer = e.target.checked;
        applyVisualSettings();
        saveVisualSettings();
      });
    }
    if (toggleShowVisualizer) {
      toggleShowVisualizer.addEventListener('change', (e) => {
        visualSettings.showVisualizer = e.target.checked;
        applyVisualSettings();
        saveVisualSettings();
      });
    }
    if (toggleGlassGlow) {
      toggleGlassGlow.addEventListener('change', (e) => {
        visualSettings.glassGlow = e.target.checked;
        applyVisualSettings();
        saveVisualSettings();
      });
    }

    // Customizer Voice, Speed & Delay
    if (customizerVoiceSelect) {
      customizerVoiceSelect.addEventListener('change', (e) => {
        visualSettings.voice = e.target.value;
        currentVoice = e.target.value;
        if (selectVoice) selectVoice.value = e.target.value;
        saveVisualSettings();
        audioCache.clear();
        showToast(`🎙️ Đã đổi giọng sang: ${e.target.options[e.target.selectedIndex].text.split('(')[0].trim()}`);
        playCurrentQuestion();
      });
    }
    if (customizerSpeedSelect) {
      customizerSpeedSelect.addEventListener('change', (e) => {
        currentSpeed = parseFloat(e.target.value) || 1.0;
        visualSettings.speed = currentSpeed;
        if (selectSpeed) selectSpeed.value = e.target.value;
        saveVisualSettings();
        audioCache.clear();
        const speedLabel = e.target.options[e.target.selectedIndex]?.text || `${currentSpeed}x`;
        showToast(`⚡ Đã đổi tốc độ đọc: ${speedLabel}`);
        playCurrentQuestion();
      });
    }
    if (rangeCustomizerDelay) {
      rangeCustomizerDelay.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        visualSettings.delay = val;
        delaySeconds = val;
        delayValueText.textContent = `${val} s`;
        labelCustomizerDelay.textContent = `${val} giây`;
        saveVisualSettings();
      });
    }
    if (btnResetCustomizer) {
      btnResetCustomizer.addEventListener('click', () => {
        visualSettings = { ...defaultVisualSettings };
        applyVisualSettings();
        saveVisualSettings();
        syncCustomizerControls();
        showToast('Đã khôi phục giao diện mặc định!', 'success');
      });
    }

    // Minimalist mode toggle
    if (btnToggleMinimal) {
      btnToggleMinimal.addEventListener('click', () => {
        const isMinimal = document.body.classList.contains('minimal-mode');
        setMinimalMode(!isMinimal);
      });
    }
    if (btnEnterMinimalStage) {
      btnEnterMinimalStage.addEventListener('click', () => {
        setMinimalMode(true);
      });
    }
    if (btnExitMinimalBottom) {
      btnExitMinimalBottom.addEventListener('click', () => {
        setMinimalMode(false);
      });
    }
    if (toggleMinimalMode) {
      toggleMinimalMode.addEventListener('change', (e) => {
        setMinimalMode(e.target.checked);
      });
    }
    if (displayQuestionKr) {
      displayQuestionKr.style.cursor = 'pointer';
      displayQuestionKr.title = 'Bấm vào câu hỏi để nghe lại phát âm';
      displayQuestionKr.addEventListener('click', () => {
        playCurrentQuestion();
      });
    }

    // iPhone 13 Pro mode toggle
    if (btnToggleIPhone13) {
      btnToggleIPhone13.addEventListener('click', () => {
        const isIPhone13 = document.body.classList.contains('iphone13-mode');
        setIPhone13Mode(!isIPhone13);
      });
    }
    if (toggleIPhone13Mode) {
      toggleIPhone13Mode.addEventListener('change', (e) => {
        setIPhone13Mode(e.target.checked);
      });
    }

    // ========================================================
    // Quick Edit In-Place Events (Chỉnh sửa trực tiếp câu hỏi)
    // ========================================================
    if (btnQuickEditCurrent) {
      btnQuickEditCurrent.addEventListener('click', () => {
        openQuickEditModal(currentIndex, false);
      });
    }
    if (btnQuickAddStage) {
      btnQuickAddStage.addEventListener('click', () => {
        openQuickEditModal(currentIndex, true);
      });
    }

    const closeQuickEdit = () => {
      if (quickEditModal) quickEditModal.style.display = 'none';
    };
    if (btnCloseQuickEditModal) btnCloseQuickEditModal.addEventListener('click', closeQuickEdit);
    if (btnCancelQuickEdit) btnCancelQuickEdit.addEventListener('click', closeQuickEdit);

    if (btnAutoTranslateQuestion) {
      btnAutoTranslateQuestion.addEventListener('click', () => {
        handleAutoTranslateField(editQuestionKr.value, editQuestionVi, btnAutoTranslateQuestion);
      });
    }
    if (btnAutoTranslateAnswer) {
      btnAutoTranslateAnswer.addEventListener('click', () => {
        handleAutoTranslateField(editAnswerKr.value, editAnswerVi, btnAutoTranslateAnswer);
      });
    }

    if (btnPreviewQuestionAudio) {
      btnPreviewQuestionAudio.addEventListener('click', () => {
        previewAudioText(editQuestionKr.value);
      });
    }
    if (btnPreviewAnswerAudio) {
      btnPreviewAnswerAudio.addEventListener('click', () => {
        previewAudioText(editAnswerKr.value);
      });
    }

    if (btnSaveQuickEdit) btnSaveQuickEdit.addEventListener('click', handleSaveQuickEdit);
    if (btnDeleteCurrentQuestion) btnDeleteCurrentQuestion.addEventListener('click', handleDeleteCurrentQuestion);
    if (btnAddQuestionAfter) {
      btnAddQuestionAfter.addEventListener('click', () => {
        openQuickEditModal(editingQuestionIndex, true);
      });
    }
  }

  // Network Info & QR Code Loader
  async function loadNetworkInfo() {
    phoneQrLoading.style.display = 'flex';
    phoneQrImage.style.display = 'none';
    phoneUrlInput.value = 'Đang dò IP mạng nội bộ...';

    try {
      const resp = await fetch('/api/network-info');
      const data = await resp.json();
      if (!data.success) throw new Error(data.error);

      cachedNetworkData = data;
      phoneQrImage.src = data.qrDataUrl;
      phoneQrImage.style.display = 'block';
      phoneQrLoading.style.display = 'none';
      phoneUrlInput.value = data.phoneUrl;

      // Populate interface dropdown if more than 1
      if (data.interfaces && data.interfaces.length > 1) {
        interfaceRow.style.display = 'flex';
        selectNetworkInterface.innerHTML = '';
        data.interfaces.forEach(iface => {
          const opt = document.createElement('option');
          opt.value = iface.url;
          opt.textContent = `${iface.name}: ${iface.ip}${iface.isVirtual ? ' (Ảo/VM)' : ''}`;
          if (iface.ip === data.primaryIp) opt.selected = true;
          selectNetworkInterface.appendChild(opt);
        });
      } else {
        interfaceRow.style.display = 'none';
      }
    } catch (err) {
      console.error('Lỗi lấy thông tin mạng:', err);
      phoneQrLoading.innerHTML = `<span style="color:#ef4444;font-size:0.85rem">Lỗi: ${err.message}</span>`;
    }
  }

  function handleInterfaceChange(e) {
    const selectedUrl = e.target.value;
    phoneUrlInput.value = selectedUrl;
    if (cachedNetworkData && cachedNetworkData.interfaces) {
      const match = cachedNetworkData.interfaces.find(i => i.url === selectedUrl);
      if (match && match.qrDataUrl) {
        phoneQrImage.src = match.qrDataUrl;
      }
    }
  }

  async function handleCopyPhoneUrl() {
    const url = phoneUrlInput.value;
    if (!url || url.startsWith('Đang')) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        phoneUrlInput.select();
        document.execCommand('copy');
      }
      btnCopyPhoneUrl.textContent = '✅ Đã chép!';
      showToast('Đã sao chép link điện thoại vào bộ nhớ tạm!');
      setTimeout(() => {
        btnCopyPhoneUrl.textContent = '📋 Sao chép';
      }, 2000);
    } catch (err) {
      phoneUrlInput.select();
      showToast('Vui lòng bôi đen và nhấn Ctrl+C để chép!');
    }
  }

  function switchTab(name) {
    [tabSavedSets, tabBulk, tabSettings].forEach(t => t.classList.remove('active'));
    [panelSavedSets, panelBulk, panelSettings].forEach(p => p.style.display = 'none');
    if (name === 'savedSets') {
      tabSavedSets.classList.add('active');
      panelSavedSets.style.display = 'block';
      renderSavedSetsLibrary();
    } else if (name === 'bulk') {
      tabBulk.classList.add('active');
      panelBulk.style.display = 'block';
    } else {
      tabSettings.classList.add('active');
      panelSettings.style.display = 'block';
    }
  }

  // ========================================================
  // HỆ THỐNG ĐỒNG BỘ 2 CHIỀU (LOCALSTORAGE <-> SERVER) & DỊCH ĐA LUỒNG
  // ========================================================
  function loadSavedSetsFromStorage() {
    try {
      const raw = localStorage.getItem('korean_saved_sets');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveSetsToStorage(sets = savedSets) {
    try {
      localStorage.setItem('korean_saved_sets', JSON.stringify(sets));
    } catch (e) {
      console.warn('Không thể lưu korean_saved_sets vào localStorage:', e);
    }
  }

  function getDeletedSetIds() {
    try {
      const raw = localStorage.getItem('korean_deleted_set_ids');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function markSetDeleted(setId) {
    const list = getDeletedSetIds();
    if (!list.includes(setId)) {
      list.push(setId);
      try {
        localStorage.setItem('korean_deleted_set_ids', JSON.stringify(list));
      } catch (e) {}
    }
  }

  function calculateQuestionsRichness(qList) {
    if (!Array.isArray(qList)) return 0;
    let score = qList.length * 10;
    for (const q of qList) {
      if (q.qKr && q.qKr.trim()) score += 2;
      if (q.qVi && q.qVi.trim()) score += 3;
      if (q.aKr && q.aKr.trim()) score += 10;
      if (q.aVi && q.aVi.trim()) score += 8;
    }
    return score;
  }

  function mergeQuestionArrays(primaryList = [], secondaryList = []) {
    if (!Array.isArray(primaryList) || primaryList.length === 0) {
      return (secondaryList || []).map(q => window.KoViDict ? window.KoViDict.repairQuestionItem({ ...q }) : q);
    }
    if (!Array.isArray(secondaryList) || secondaryList.length === 0) {
      return (primaryList || []).map(q => window.KoViDict ? window.KoViDict.repairQuestionItem({ ...q }) : q);
    }

    return primaryList.map((p, idx) => {
      const cleanPKr = (p.qKr || '').trim();
      // TUYỆT ĐỐI chỉ ghép theo đúng nội dung câu hỏi tiếng Hàn qKr, KHÔNG BAO GIỜ lấy theo index
      const s = secondaryList.find(item => item.qKr && cleanPKr && item.qKr.trim() === cleanPKr);
      if (!s) return window.KoViDict ? window.KoViDict.repairQuestionItem({ ...p }) : p;
      const sameAns = (p.aKr || '').trim() === (s.aKr || '').trim();
      const merged = {
        num: p.num || s.num || `${idx + 1}.`,
        qKr: cleanPKr ? p.qKr : (s.qKr || ''),
        qVi: (p.qVi && p.qVi.trim()) ? p.qVi : (s.qVi || ''),
        aKr: (p.aKr && p.aKr.trim()) ? p.aKr : (s.aKr || ''),
        aVi: (p.aVi && p.aVi.trim()) ? p.aVi : (sameAns ? (s.aVi || '') : '')
      };
      return window.KoViDict ? window.KoViDict.repairQuestionItem(merged) : merged;
    });
  }

  function syncQuestionEditToOriginal(updatedItem, currentIdx) {
    if (!updatedItem || !Array.isArray(originalQuestions)) return;
    const matchIdx = originalQuestions.findIndex(o =>
      (updatedItem.num && o.num === updatedItem.num && o.qKr === updatedItem.qKr) ||
      (o.qKr && updatedItem.qKr && o.qKr.trim() === updatedItem.qKr.trim())
    );
    if (matchIdx !== -1) {
      originalQuestions[matchIdx] = JSON.parse(JSON.stringify(updatedItem));
    } else if (currentIdx >= 0 && currentIdx < originalQuestions.length && !btnShuffle.classList.contains('active')) {
      originalQuestions[currentIdx] = JSON.parse(JSON.stringify(updatedItem));
    }
  }

  // Dịch 1 câu Hàn -> Việt (kết hợp tra từ điển chuẩn 614 câu + Google Dịch hậu xử lý chuyên ngành)
  async function translateTextSmart(rawText) {
    if (!rawText || !String(rawText).trim()) return '';
    const clean = String(rawText).trim();

    // 0. Tra từ điển chuẩn EPS-TOPIK trước (chuẩn xác 100%, phản hồi tức thì 0ms)
    if (window.KoViDict) {
      const exact = window.KoViDict.lookupExactKoVi(clean);
      if (exact) return exact;
    }

    const preprocessed = window.KoViDict ? window.KoViDict.preprocessKoForTranslate(clean) : clean;

    // 1. Thử dịch trực tiếp từ trình duyệt người dùng (nhanh nhất, không bị giới hạn IP máy chủ Render)
    try {
      const directUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=vi&dt=t&q=${encodeURIComponent(preprocessed)}`;
      const resp = await fetch(directUrl);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translated = data[0].map(item => (item && item[0]) ? item[0] : '').join('').trim();
          if (translated) {
            return window.KoViDict ? window.KoViDict.refineKoViTranslation(clean, translated) : translated;
          }
        }
      }
    } catch (e) {
      // Chuyển sang gọi qua Server nếu trình duyệt bị chặn CORS/mạng
    }

    // 2. Dự phòng qua API Server (có sẵn 3 luồng dự phòng trên server)
    try {
      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.translation) {
          const trans = String(data.translation).trim();
          return window.KoViDict ? window.KoViDict.refineKoViTranslation(clean, trans) : trans;
        }
      }
    } catch (err) {
      console.warn('Lỗi dịch dự phòng qua server:', err);
    }

    return '';
  }

  // Dịch hàng loạt tốc độ cao (dịch song song từng câu với concurrency 8, tránh gộp \n gây lệch thứ tự câu)
  async function translateBatchSmart(texts = []) {
    if (!Array.isArray(texts) || texts.length === 0) return [];
    const results = new Array(texts.length).fill('');
    const PARALLEL_LIMIT = 8;

    for (let i = 0; i < texts.length; i += PARALLEL_LIMIT) {
      const slice = texts.slice(i, i + PARALLEL_LIMIT);
      await Promise.all(slice.map(async (text, offset) => {
        const idx = i + offset;
        const clean = String(text || '').trim();
        if (clean) {
          results[idx] = await translateTextSmart(clean);
        }
      }));
    }

    return results;
  }

  // Question Sets API Management (Đồng bộ 2 chiều chống mất bộ câu hỏi mới lưu)
  async function fetchSavedSets() {
    const localSets = loadSavedSetsFromStorage();
    const deletedIds = getDeletedSetIds();

    // Bảo toàn các câu đang làm dở trong korean_questions vào localSets trước khi đồng bộ
    if (Array.isArray(questions) && questions.length > 0 && activeSetId) {
      const idx = localSets.findIndex(s => s.id === activeSetId);
      if (idx !== -1) {
        const localRichness = calculateQuestionsRichness(localSets[idx].questions);
        const activeRichness = calculateQuestionsRichness(questions);
        if (activeRichness >= localRichness && questions.length === localSets[idx].questions.length) {
          localSets[idx].questions = mergeQuestionArrays(questions, localSets[idx].questions);
          localSets[idx].updatedAt = new Date().toISOString();
        }
      }
    }

    if (localSets.length > 0) {
      savedSets = localSets;
      updateSetPickerDropdown();
    }

    try {
      const resp = await fetch('/api/sets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sets: localSets,
          deletedIds
        })
      });
      const data = await resp.json();
      if (data.success && Array.isArray(data.sets)) {
        savedSets = data.sets;
        saveSetsToStorage(savedSets);

        // Nếu người dùng đang học bộ 101 câu công cụ nhưng activeSetId bị lưu nhầm sang ID khác
        if (Array.isArray(questions) && questions.length > 50 && questions[0]?.qKr?.includes('버니어캘리퍼스')) {
          const toolSet = savedSets.find(s => s.id === 'set_1792719791167' || (s.questions && s.questions[0]?.qKr?.includes('버니어캘리퍼스')));
          if (toolSet) {
            activeSetId = toolSet.id;
            localStorage.setItem('korean_active_set_id', activeSetId);
          }
        }

        // Đảm bảo activeSetId luôn trỏ tới một bộ câu hợp lệ
        let activeSet = savedSets.find(s => s.id === activeSetId);
        if (!activeSet && savedSets.length > 0) {
          activeSet = savedSets[0];
          activeSetId = activeSet.id;
          localStorage.setItem('korean_active_set_id', activeSetId);
        }

        if (activeSet) {
          activeSet.questions = window.KoViDict ? window.KoViDict.repairQuestionsList(activeSet.questions) : activeSet.questions;
          // Hợp nhất câu hỏi đang mở với dữ liệu bộ câu để không mất câu trả lời mới lưu
          const isSameSetLength = questions && questions.length === activeSet.questions.length;
          questions = isSameSetLength
            ? mergeQuestionArrays(activeSet.questions, questions)
            : JSON.parse(JSON.stringify(activeSet.questions));
          if (window.KoViDict) {
            questions = window.KoViDict.repairQuestionsList(questions);
          }
          originalQuestions = JSON.parse(JSON.stringify(questions));
          localStorage.setItem('korean_questions', JSON.stringify(questions));
          if (currentIndex >= questions.length) currentIndex = 0;
        }

        updateSetPickerDropdown();
        renderSavedSetsLibrary();
        renderPlaylist();
        updateStageDisplay();
      }
    } catch (err) {
      console.warn('Không thể đồng bộ bộ câu hỏi với server (đang dùng bản lưu trên máy):', err);
      if (localSets.length > 0) {
        savedSets = localSets;
        updateSetPickerDropdown();
        renderSavedSetsLibrary();
      }
    }
  }

  function updateSetPickerDropdown() {
    selectActiveSet.innerHTML = '';
    if (savedSets.length === 0) {
      const opt = document.createElement('option');
      opt.value = "";
      opt.textContent = "Chưa có bộ câu hỏi";
      selectActiveSet.appendChild(opt);
      return;
    }

    savedSets.forEach(set => {
      const opt = document.createElement('option');
      opt.value = set.id;
      opt.textContent = `${set.title} (${set.questions.length} câu)`;
      if (set.id === activeSetId) opt.selected = true;
      selectActiveSet.appendChild(opt);
    });

    savedSetsCountBadge.textContent = savedSets.length;
  }

  function loadSetById(setId) {
    const targetSet = savedSets.find(s => s.id === setId);
    if (!targetSet) return;

    activeSetId = setId;
    localStorage.setItem('korean_active_set_id', setId);
    questions = JSON.parse(JSON.stringify(targetSet.questions));
    originalQuestions = JSON.parse(JSON.stringify(questions));
    localStorage.setItem('korean_questions', JSON.stringify(questions));

    currentIndex = 0;
    isAnswerRevealed = false;
    resetExamTimer();
    audioCache.clear();
    stopAudio();
    renderPlaylist();
    updateStageDisplay();
    updateSetPickerDropdown();

    showToast(`📖 Đã mở: ${targetSet.title}`);
  }

  // Modal Lưu bộ câu hỏi
  function openSaveSetModal() {
    const activeSet = savedSets.find(s => s.id === activeSetId);
    saveSetCountLabel.textContent = `${questions.length} câu`;

    if (activeSet) {
      saveSetTitle.value = activeSet.title;
      saveSetDesc.value = activeSet.description || '';
      updateExistingOptionGroup.style.display = 'block';
      chkOverwriteCurrentSet.checked = true;
      currentSetNameLabel.textContent = activeSet.title;
    } else {
      saveSetTitle.value = `Bộ câu hỏi ${new Date().toLocaleDateString('vi-VN')}`;
      saveSetDesc.value = `${questions.length} câu luyện nghe tiếng Hàn`;
      updateExistingOptionGroup.style.display = 'none';
      chkOverwriteCurrentSet.checked = false;
    }

    saveSetModal.style.display = 'flex';
    saveSetTitle.focus();
  }

  function closeSaveSetModal() {
    saveSetModal.style.display = 'none';
  }

  async function handleSaveSet() {
    const title = saveSetTitle.value.trim();
    const desc = saveSetDesc.value.trim();

    if (!title) {
      alert('Vui lòng nhập tên cho bộ câu hỏi!');
      saveSetTitle.focus();
      return;
    }

    if (questions.length === 0) {
      alert('Danh sách câu hỏi hiện tại đang trống!');
      return;
    }

    const isOverwrite = chkOverwriteCurrentSet.checked && activeSetId && savedSets.some(s => s.id === activeSetId);
    btnConfirmSaveSet.disabled = true;
    btnConfirmSaveSet.textContent = 'Đang dịch & lưu...';

    try {
      // Tự động dịch các câu hỏi hoặc câu trả lời còn thiếu tiếng Việt trước khi lưu bộ câu
      const missingQIndices = [];
      const missingQTexts = [];
      const missingAIndices = [];
      const missingATexts = [];

      questions.forEach((q, idx) => {
        if (q.qKr && q.qKr.trim() && (!q.qVi || !q.qVi.trim())) {
          missingQIndices.push(idx);
          missingQTexts.push(q.qKr.trim());
        }
        if (q.aKr && q.aKr.trim() && (!q.aVi || !q.aVi.trim())) {
          missingAIndices.push(idx);
          missingATexts.push(q.aKr.trim());
        }
      });

      if (missingQTexts.length > 0) {
        const transQ = await translateBatchSmart(missingQTexts);
        missingQIndices.forEach((qIdx, i) => {
          if (transQ[i]) questions[qIdx].qVi = transQ[i];
        });
      }

      if (missingATexts.length > 0) {
        const transA = await translateBatchSmart(missingATexts);
        missingAIndices.forEach((aIdx, i) => {
          if (transA[i]) questions[aIdx].aVi = transA[i];
        });
      }

      originalQuestions = JSON.parse(JSON.stringify(questions));
      saveQuestionsToLocalStorage();
      updateStageDisplay();

      const nowIso = new Date().toISOString();

      if (isOverwrite) {
        // Cập nhật ngay vào bộ nhớ máy trước
        const idx = savedSets.findIndex(s => s.id === activeSetId);
        if (idx !== -1) {
          savedSets[idx] = {
            ...savedSets[idx],
            title,
            description: desc,
            updatedAt: nowIso,
            questions: JSON.parse(JSON.stringify(questions))
          };
        }
        saveSetsToStorage(savedSets);

        // Đồng bộ lên Server
        try {
          const resp = await fetch(`/api/sets/${activeSetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              description: desc,
              questions
            })
          });
          const data = await resp.json();
          if (data && data.success && data.set && idx !== -1) {
            savedSets[idx] = data.set;
            saveSetsToStorage(savedSets);
          }
        } catch (netErr) {
          console.warn('Đã lưu vào bộ nhớ máy, sẽ đồng bộ lên server sau:', netErr);
        }

        showToast(`✅ Đã cập nhật & sao lưu vĩnh viễn: ${title}`);
      } else {
        const newId = 'set_' + Date.now();
        const localNewSet = {
          id: newId,
          title,
          description: desc,
          createdAt: nowIso,
          updatedAt: nowIso,
          questions: JSON.parse(JSON.stringify(questions))
        };

        savedSets.unshift(localNewSet);
        activeSetId = newId;
        localStorage.setItem('korean_active_set_id', activeSetId);
        saveSetsToStorage(savedSets);

        // Đồng bộ lên Server
        try {
          const resp = await fetch('/api/sets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: newId,
              title,
              description: desc,
              questions
            })
          });
          const data = await resp.json();
          if (data && data.success && data.set) {
            savedSets[0] = data.set;
            activeSetId = data.set.id;
            localStorage.setItem('korean_active_set_id', activeSetId);
            saveSetsToStorage(savedSets);
          }
        } catch (netErr) {
          console.warn('Đã lưu bộ mới vào máy, sẽ đồng bộ lên server sau:', netErr);
        }

        showToast(`✅ Đã lưu bộ câu mới vĩnh viễn: ${title}`);
      }

      updateSetPickerDropdown();
      renderSavedSetsLibrary();
      closeSaveSetModal();

    } catch (err) {
      alert('Lỗi lưu bộ câu hỏi: ' + err.message);
    } finally {
      btnConfirmSaveSet.disabled = false;
      btnConfirmSaveSet.textContent = '💾 Xác nhận lưu bộ câu';
    }
  }

  // Render Saved Sets Library in Modal
  function renderSavedSetsLibrary() {
    savedSetsList.innerHTML = '';
    if (savedSets.length === 0) {
      savedSetsList.innerHTML = '<p class="tab-tip">Chưa có bộ câu hỏi nào được lưu. Bạn hãy bấm "Lưu danh sách hiện tại" để tạo bộ câu đầu tiên!</p>';
      return;
    }

    savedSets.forEach(set => {
      const card = document.createElement('div');
      card.className = `saved-set-card ${set.id === activeSetId ? 'active-set' : ''}`;
      const updatedDate = new Date(set.updatedAt || set.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      card.innerHTML = `
        <div class="set-card-header">
          <div class="set-card-title">
            <span>${escapeHtml(set.title)}</span>
            ${set.id === activeSetId ? '<span class="set-active-badge">Đang học</span>' : ''}
          </div>
          <span class="set-count-pill">${set.questions.length} câu</span>
        </div>
        ${set.description ? `<p class="set-card-desc">${escapeHtml(set.description)}</p>` : ''}
        <div class="set-card-footer">
          <span class="set-card-date">🕒 Cập nhật: ${updatedDate}</span>
          <div class="set-card-actions">
            <button type="button" class="btn-set-action btn-load-set" data-set-id="${set.id}">▶ Mở học</button>
            <button type="button" class="btn-set-action btn-set-edit" data-set-id="${set.id}">✏️ Đổi tên</button>
            <button type="button" class="btn-set-action btn-set-delete" data-set-id="${set.id}">🗑️</button>
          </div>
        </div>
      `;

      // Load set button
      card.querySelector('.btn-load-set').addEventListener('click', () => {
        loadSetById(set.id);
        managerModal.style.display = 'none';
      });

      // Edit set title button
      card.querySelector('.btn-set-edit').addEventListener('click', async () => {
        const newTitle = prompt('Nhập tên mới cho bộ câu hỏi:', set.title);
        if (newTitle && newTitle.trim() && newTitle.trim() !== set.title) {
          set.title = newTitle.trim();
          set.updatedAt = new Date().toISOString();
          saveSetsToStorage(savedSets);
          updateSetPickerDropdown();
          renderSavedSetsLibrary();
          showToast('Đã đổi tên bộ câu hỏi!');

          try {
            await fetch(`/api/sets/${set.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: set.title, questions: set.questions })
            });
          } catch (e) {
            console.warn('Đồng bộ đổi tên sau:', e);
          }
        }
      });

      // Delete set button
      card.querySelector('.btn-set-delete').addEventListener('click', async () => {
        if (confirm(`Bạn có chắc muốn xóa bộ câu hỏi "${set.title}" không?`)) {
          markSetDeleted(set.id);
          savedSets = savedSets.filter(s => s.id !== set.id);
          saveSetsToStorage(savedSets);
          if (activeSetId === set.id && savedSets.length > 0) {
            loadSetById(savedSets[0].id);
          }
          updateSetPickerDropdown();
          renderSavedSetsLibrary();
          showToast('Đã xóa bộ câu hỏi!');

          try {
            await fetch(`/api/sets/${set.id}`, { method: 'DELETE' });
          } catch (e) {
            console.warn('Lỗi xóa trên server:', e);
          }
        }
      });

      savedSetsList.appendChild(card);
    });
  }

  // Sao lưu Export JSON
  function handleExportJson() {
    if (savedSets.length === 0) {
      alert('Không có bộ câu hỏi nào để xuất!');
      return;
    }
    const jsonStr = JSON.stringify(savedSets, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `korean_bo_cau_hoi_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('⬇ Đã xuất file JSON sao lưu thành công!');
  }

  // Nhập Import JSON
  function handleImportJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const importedData = JSON.parse(evt.target.result);
        if (!Array.isArray(importedData)) throw new Error('File không hợp lệ');

        for (const item of importedData) {
          if (item.title && Array.isArray(item.questions)) {
            const newId = item.id || ('set_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
            const existingIdx = savedSets.findIndex(s => s.id === newId);
            const setObj = {
              id: newId,
              title: item.title,
              description: item.description || '',
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              questions: item.questions
            };
            if (existingIdx !== -1) savedSets[existingIdx] = setObj;
            else savedSets.unshift(setObj);
          }
        }

        saveSetsToStorage(savedSets);
        await fetchSavedSets();
        showToast('⬆ Đã nhập thành công các bộ câu hỏi từ file JSON!');
      } catch (err) {
        alert('Lỗi đọc file JSON: ' + err.message);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  // Toast Notification
  function showToast(message, isError = false) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-message ${isError === true ? 'toast-error' : ''}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Update Center Stage Info (Tự động dịch ngầm nếu câu hỏi hoặc đáp án chưa có tiếng Việt)
  function updateStageDisplay() {
    if (questions.length === 0) {
      displayQuestionKr.textContent = "Chưa có câu hỏi nào";
      displayQuestionVi.textContent = "Bấm Chức năng để nhập câu hỏi";
      displayAnswerKr.textContent = "";
      displayAnswerVi.textContent = "";
      counterText.textContent = "0/0";
      return;
    }

    const item = questions[currentIndex];
    if (!item) return;

    displayQuestionKr.textContent = `${item.num ? item.num + ' ' : ''}${item.qKr}`;
    displayQuestionVi.textContent = item.qVi || "—";

    displayAnswerKr.textContent = item.aKr || "Chưa có đáp án";
    displayAnswerVi.textContent = item.aVi || "";

    counterText.textContent = `${currentIndex + 1}/${questions.length}`;

    // Tự động dịch bổ sung nếu câu hỏi hoặc câu trả lời có tiếng Hàn nhưng chưa có nghĩa tiếng Việt
    const needTranslateQ = item.qKr && item.qKr.trim() && (!item.qVi || !item.qVi.trim());
    const needTranslateA = item.aKr && item.aKr.trim() && (!item.aVi || !item.aVi.trim());

    if (needTranslateQ || needTranslateA) {
      const currentToken = ++stageTranslateToken;
      const targetIdx = currentIndex;
      const targetKr = item.qKr;
      const targetAKr = item.aKr;
      if (needTranslateQ) displayQuestionVi.textContent = "⏳ Đang tự động dịch sang tiếng Việt...";
      if (needTranslateA) displayAnswerVi.textContent = "⏳ Đang dịch nghĩa câu trả lời...";

      (async () => {
        let updated = false;
        if (needTranslateQ) {
          const viQ = await translateTextSmart(targetKr);
          // TUYỆT ĐỐI chỉ gán nếu câu hỏi tại targetIdx vẫn đúng là targetKr (chống gán nhầm sang câu khác khi đổi câu/trộn câu)
          const matchQ = (questions[targetIdx] && questions[targetIdx].qKr === targetKr)
            ? questions[targetIdx]
            : questions.find(q => q && q.qKr === targetKr);
          if (viQ && matchQ) {
            matchQ.qVi = viQ;
            updated = true;
            if (currentIndex === targetIdx && stageTranslateToken === currentToken) {
              displayQuestionVi.textContent = viQ;
            }
          } else if (currentIndex === targetIdx && stageTranslateToken === currentToken) {
            displayQuestionVi.textContent = "—";
          }
        }
        if (needTranslateA) {
          const viA = await translateTextSmart(targetAKr);
          const matchA = (questions[targetIdx] && questions[targetIdx].aKr === targetAKr)
            ? questions[targetIdx]
            : questions.find(q => q && q.aKr === targetAKr);
          if (viA && matchA) {
            matchA.aVi = viA;
            updated = true;
            if (currentIndex === targetIdx && stageTranslateToken === currentToken) {
              displayAnswerVi.textContent = viA;
            }
          } else if (currentIndex === targetIdx && stageTranslateToken === currentToken) {
            displayAnswerVi.textContent = "";
          }
        }
        if (updated) {
          if (questions[targetIdx]) {
            syncQuestionEditToOriginal(questions[targetIdx], targetIdx);
          }
          saveQuestionsToLocalStorage();
          persistQuestionsToServer();
        }
      })();
    }

    // Xử lý ẩn / hiện đáp án theo chế độ luyện thi
    if (answerBoxContainer) {
      if (examMode === 'manual' && !isAnswerRevealed) {
        answerBoxContainer.classList.add('answer-hidden');
        btnExamShowAnswer.innerHTML = '👁️ Xem & Nghe đáp án';
      } else {
        answerBoxContainer.classList.remove('answer-hidden');
        btnExamShowAnswer.innerHTML = isAnswerRevealed ? '✅ Đã xem đáp án' : '👁️ Xem & Nghe đáp án';
      }
    }

    // Highlight row in playlist
    document.querySelectorAll('.question-row').forEach((row, i) => {
      if (i === currentIndex) {
        row.classList.add('active');
        row.querySelector('.row-icon-col').innerHTML = '<span class="row-icon-speaker">🔊</span>';
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        row.classList.remove('active');
        row.querySelector('.row-icon-col').innerHTML = '<span class="row-icon-question">❓</span>';
      }
    });
  }

  // Hỗ trợ vuốt trượt (drag/swipe) bằng chuột trên máy tính cho khu câu hỏi
  if (playlistContainer) {
    playlistContainer.addEventListener('mousedown', (e) => {
      isDraggingPlaylist = true;
      hasDraggedPlaylist = false;
      playlistStartY = e.pageY - playlistContainer.offsetTop;
      playlistStartScrollTop = playlistContainer.scrollTop;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingPlaylist) return;
      const y = e.pageY - playlistContainer.offsetTop;
      const walk = y - playlistStartY;
      if (Math.abs(walk) > 5) {
        hasDraggedPlaylist = true;
        playlistContainer.style.cursor = 'grabbing';
        playlistContainer.style.userSelect = 'none';
      }
      playlistContainer.scrollTop = playlistStartScrollTop - walk;
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingPlaylist) {
        isDraggingPlaylist = false;
        playlistContainer.style.cursor = '';
        playlistContainer.style.removeProperty('user-select');
        setTimeout(() => {
          hasDraggedPlaylist = false;
        }, 80);
      }
    });
  }

  // Render Playlist Rows (Hiển thị 5 câu, các câu khác vuốt trượt)
  function renderPlaylist() {
    playlistContainer.innerHTML = '';
    questions.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = `question-row ${index === currentIndex ? 'active' : ''}`;
      row.innerHTML = `
        <div class="row-icon-col">
          ${index === currentIndex ? '<span class="row-icon-speaker">🔊</span>' : '<span class="row-icon-question">❓</span>'}
        </div>
        <div class="row-text">
          <span class="row-num">${escapeHtml(item.num || (index + 1) + '.')}</span>
          <span class="row-kr">${escapeHtml(item.qKr)}</span>
        </div>
      `;

      row.addEventListener('click', () => {
        if (hasDraggedPlaylist) return;
        if (currentIndex === index && isPlaying) {
          pauseAudio();
        } else {
          currentIndex = index;
          updateStageDisplay();
          playCurrentQuestion();
        }
      });

      playlistContainer.appendChild(row);
    });
  }

  // Exam Timer Functions
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return `${String(h).padStart(2, '0')}:${String(remM).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function startExamTimer() {
    if (isExamTimerRunning) return;
    isExamTimerRunning = true;
    btnToggleTimer.textContent = '⏸';
    btnToggleTimer.title = 'Tạm dừng tính giờ';
    examTimerBox.classList.add('running');

    if (examTimerInterval) clearInterval(examTimerInterval);
    examTimerInterval = setInterval(() => {
      examTimerSeconds++;
      examTimerText.textContent = formatTime(examTimerSeconds);
    }, 1000);
  }

  function pauseExamTimer() {
    if (!isExamTimerRunning) return;
    isExamTimerRunning = false;
    btnToggleTimer.textContent = '▶';
    btnToggleTimer.title = 'Tiếp tục tính giờ';
    examTimerBox.classList.remove('running');
    if (examTimerInterval) {
      clearInterval(examTimerInterval);
      examTimerInterval = null;
    }
  }

  function resetExamTimer() {
    pauseExamTimer();
    examTimerSeconds = 0;
    examTimerText.textContent = '00:00';
    btnToggleTimer.textContent = '▶';
  }

  // Exam Practice Mode Switcher
  function setExamMode(mode) {
    examMode = mode;
    if (mode === 'manual') {
      btnModeExam.classList.add('active');
      btnModeAuto.classList.remove('active');
      isAnswerRevealed = false;
      if (answerBoxContainer) {
        answerBoxContainer.classList.add('answer-hidden');
      }
      showToast('🎯 Chế độ Luyện thi: Trả lời xong nhấn nút để xem đáp án / sang câu!');
    } else {
      btnModeAuto.classList.add('active');
      btnModeExam.classList.remove('active');
      if (answerBoxContainer) {
        answerBoxContainer.classList.remove('answer-hidden');
      }
      showToast('⚡ Chế độ Tự động: Tự động chạy theo độ trễ cài đặt!');
    }
    updateStageDisplay();
  }

  // Shuffle & Restore Order
  // Shuffle questions while strictly preserving each question's original number label (e.g. 80. or 46.)
  function shuffleQuestions() {
    if (questions.length <= 1) {
      showToast('Cần ít nhất 2 câu để xáo trộn!');
      return;
    }
    stopAudio(true);

    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    questions = shuffled;
    currentIndex = 0;
    isAnswerRevealed = false;
    renderPlaylist();
    updateStageDisplay();
    btnShuffle.classList.add('active');
    btnRestoreOrder.classList.remove('active');
    showToast(`🔀 Đã xáo trộn ngẫu nhiên ${questions.length} câu (vẫn giữ nguyên số thứ tự gốc của câu)!`);
    playCurrentQuestion();
  }

  // Restore questions to the original order (1, 2, 3...)
  function restoreOriginalOrder() {
    if (!originalQuestions || originalQuestions.length === 0) return;
    stopAudio(true);
    questions = JSON.parse(JSON.stringify(originalQuestions));
    currentIndex = 0;
    isAnswerRevealed = false;
    renderPlaylist();
    updateStageDisplay();
    btnShuffle.classList.remove('active');
    btnRestoreOrder.classList.add('active');
    setTimeout(() => btnRestoreOrder.classList.remove('active'), 1000);
    showToast(`🔢 Đã khôi phục đúng thứ tự ban đầu (1, 2, 3...)!`);
    playCurrentQuestion();
  }

  // Exam Manual Actions
  async function handleExamShowAnswer() {
    if (questions.length === 0) return;
    const item = questions[currentIndex];
    if (!item) return;

    isAnswerRevealed = true;
    if (answerBoxContainer) {
      answerBoxContainer.classList.remove('answer-hidden');
    }

    if (!item.aKr) {
      btnExamShowAnswer.innerHTML = '✅ Đã xem đáp án';
      showToast('Câu này chưa có đáp án tiếng Hàn để phát!');
      return;
    }

    try {
      setStatus('Đang đọc đáp án...', true);
      btnExamShowAnswer.innerHTML = '🔊 Đang đọc đáp án...';
      const cacheKey = `${item.aKr}_${currentVoice}_${currentSpeed}`;
      const aAudioUrl = audioCache.get(cacheKey) || getDirectTtsUrl(item.aKr);
      audio.src = aAudioUrl;
      await audio.play();
      audio.onended = () => {
        btnExamShowAnswer.innerHTML = '✅ Đã xem đáp án';
        setStatus('Sẵn sàng', false);
      };
    } catch (err) {
      console.error('Lỗi phát âm thanh đáp án:', err);
      btnExamShowAnswer.innerHTML = '✅ Đã xem đáp án';
      setStatus('Sẵn sàng', false);
    }
  }

  function handleExamNext() {
    if (questions.length === 0) return;
    stopAudio(true);

    if (currentIndex < questions.length - 1) {
      currentIndex++;
      isAnswerRevealed = false;
      updateStageDisplay();
      playCurrentQuestion();
    } else {
      // Đã hoàn thành toàn bộ các câu trong bộ đề
      pauseExamTimer();
      showExamResultModal();
    }
  }

  function showExamResultModal() {
    const totalSec = examTimerSeconds;
    const count = questions.length;
    const avg = count > 0 ? Math.round(totalSec / count) : 0;

    resultTotalTime.textContent = formatTime(totalSec);
    resultTotalQuestions.textContent = `${count} câu`;
    resultAvgSpeed.textContent = `${avg}s / câu`;
    resultHeading.textContent = `Xuất sắc! Bạn đã luyện xong toàn bộ ${count} câu hỏi!`;

    examResultModal.style.display = 'flex';
    setStatus('🏆 Đã hoàn thành bộ đề!', false);
  }

  function getDirectTtsUrl(text) {
    if (!text || !text.trim()) return '';
    return `/api/tts?text=${encodeURIComponent(text.trim())}&voice=${encodeURIComponent(currentVoice)}&speed=${encodeURIComponent(currentSpeed)}`;
  }

  // Audio Playback Engine
  async function getAudioBlobUrl(text) {
    if (!text || !text.trim()) return null;
    const cacheKey = `${text}_${currentVoice}_${currentSpeed}`;
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey);
    }

    const resp = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice: currentVoice,
        speed: currentSpeed
      })
    });

    if (!resp.ok) throw new Error('Không thể tạo audio');
    const blob = await resp.blob();
    if (!blob || blob.size < 100) throw new Error('Dữ liệu âm thanh rỗng');
    const url = URL.createObjectURL(blob);
    audioCache.set(cacheKey, url);
    return url;
  }

  async function playCurrentQuestion() {
    stopAudio(true);
    if (questions.length === 0) return;

    // Tự động khởi động đồng hồ bấm giờ nếu chưa chạy
    if (!isExamTimerRunning) {
      startExamTimer();
    }

    isPlaying = true;
    updatePlayPauseButton();

    const currentSession = ++playbackSessionId;
    const item = questions[currentIndex];

    // Cập nhật trạng thái hiển thị đáp án
    if (examMode === 'manual' && !isAnswerRevealed && answerBoxContainer) {
      answerBoxContainer.classList.add('answer-hidden');
      btnExamShowAnswer.innerHTML = '👁️ Xem & Nghe đáp án';
    }

    try {
      // Bước 1: Đọc Câu hỏi (Gán trực tiếp URL đồng bộ trong sự kiện người dùng để không bao giờ bị chặn trên iPhone/Web)
      setStatus('Đang đọc câu hỏi...', true);
      const cacheKey = `${item.qKr}_${currentVoice}_${currentSpeed}`;
      const qAudioUrl = audioCache.get(cacheKey) || getDirectTtsUrl(item.qKr);
      if (!qAudioUrl || !isPlaying || currentSession !== playbackSessionId) return;

      audio.src = qAudioUrl;
      await audio.play();

      audio.onended = () => {
        if (!isPlaying || currentSession !== playbackSessionId) return;

        // Nếu là Chế độ Luyện Thi (nhấn nút khi trả lời xong):
        if (examMode === 'manual') {
          clearAllTimers();
          setStatus('🎤 Hãy trả lời... (Bấm nút bên dưới khi xong)', false, true);
          isPlaying = false;
          updatePlayPauseButton();
          return;
        }

        // Nếu là Chế độ Tự Động (Auto):
        // Bước 2: Bắt đầu đếm ngược độ trễ mới (Reset về đúng số giây cài đặt)
        let countdown = delaySeconds;
        setStatus(`Chờ trả lời (${countdown}s)...`, false, true);

        clearAllTimers();
        countdownInterval = setInterval(() => {
          if (!isPlaying || currentSession !== playbackSessionId) {
            clearAllTimers();
            return;
          }
          countdown--;
          if (countdown > 0) {
            setStatus(`Chờ trả lời (${countdown}s)...`, false, true);
          } else {
            clearAllTimers();
            proceedToAnswerOrNext(item, currentSession);
          }
        }, 1000);
      };

    } catch (err) {
      if (currentSession !== playbackSessionId) return;
      if (err && err.name === 'NotAllowedError') {
        setStatus('Bấm ▶ để nghe câu hỏi', false);
        isPlaying = false;
        updatePlayPauseButton();
        return;
      }
      console.error(err);
      setStatus('Lỗi phát âm thanh', false);
      isPlaying = false;
      updatePlayPauseButton();
    }
  }

  async function proceedToAnswerOrNext(item, currentSession) {
    if (!isPlaying || currentSession !== playbackSessionId) return;

    const speakAnswer = chkSpeakAnswerToo ? chkSpeakAnswerToo.checked : true;

    // Nếu có đáp án và bật đọc đáp án
    if (item.aKr && speakAnswer) {
      try {
        setStatus('Đang đọc câu trả lời...', true);
        const aAudioUrl = await getAudioBlobUrl(item.aKr);
        if (!isPlaying || currentSession !== playbackSessionId) return;

        audio.src = aAudioUrl;
        await audio.play();

        audio.onended = () => {
          if (!isPlaying || currentSession !== playbackSessionId) return;

          // Bước 3: Nghỉ sau câu trả lời trước khi chuyển sang câu tiếp theo
          let restCountdown = delaySeconds;
          setStatus(`Nghỉ (${restCountdown}s)...`, false, true);

          clearAllTimers();
          countdownInterval = setInterval(() => {
            if (!isPlaying || currentSession !== playbackSessionId) {
              clearAllTimers();
              return;
            }
            restCountdown--;
            if (restCountdown > 0) {
              setStatus(`Nghỉ (${restCountdown}s)...`, false, true);
            } else {
              clearAllTimers();
              advanceNextQuestion();
            }
          }, 1000);
        };
      } catch (err) {
        if (currentSession !== playbackSessionId) return;
        console.error(err);
        advanceNextQuestion();
      }
    } else {
      advanceNextQuestion();
    }
  }

  function advanceNextQuestion() {
    if (!isPlaying) return;

    // Reset hoàn toàn độ trễ và timer trước khi chuyển sang câu mới
    clearAllTimers();

    if (repeatMode === '1') {
      isAnswerRevealed = false;
      playCurrentQuestion();
      return;
    }

    // Tuần tự
    if (isAscending) {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        isAnswerRevealed = false;
        updateStageDisplay();
        playCurrentQuestion();
      } else if (repeatMode === 'all') {
        currentIndex = 0;
        isAnswerRevealed = false;
        updateStageDisplay();
        playCurrentQuestion();
      } else {
        stopAudio();
        pauseExamTimer();
        setStatus('Đã hoàn thành bài nghe!', false);
        showExamResultModal();
      }
    } else {
      if (currentIndex > 0) {
        currentIndex--;
        isAnswerRevealed = false;
        updateStageDisplay();
        playCurrentQuestion();
      } else if (repeatMode === 'all') {
        currentIndex = questions.length - 1;
        isAnswerRevealed = false;
        updateStageDisplay();
        playCurrentQuestion();
      } else {
        stopAudio();
        pauseExamTimer();
        setStatus('Đã hoàn thành bài nghe!', false);
        showExamResultModal();
      }
    }
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playCurrentQuestion();
    }
  }

  function pauseAudio() {
    playbackSessionId++;
    clearAllTimers();
    isPlaying = false;
    audio.pause();
    setStatus('Tạm dừng', false);
    updatePlayPauseButton();
  }

  function stopAudio(keepStatus = false) {
    playbackSessionId++;
    clearAllTimers();
    isPlaying = false;
    try { audio.pause(); } catch (e) {}
    audio.onended = null;
    try {
      if (audio.readyState > 0) {
        audio.currentTime = 0;
      }
    } catch (e) {}
    if (!keepStatus) {
      setStatus('Sẵn sàng', false);
    }
    updatePlayPauseButton();
  }

  function navigate(dir) {
    // Khi bấm Next/Prev chuyển câu:
    // 1. Hủy và reset ngay lập tức toàn bộ độ trễ đang đếm của câu cũ
    // 2. Chuyển sang câu mới
    // 3. Đọc ngay câu mới từ đầu không phải đợi
    stopAudio(true);
    if (questions.length === 0) return;

    currentIndex = (currentIndex + dir + questions.length) % questions.length;
    isAnswerRevealed = false;
    updateStageDisplay();
    playCurrentQuestion();
  }

  function updatePlayPauseButton() {
    if (isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  }

  function setStatus(text, isAudioPlaying = false, isWaiting = false) {
    statusPill.textContent = text;
    statusPill.classList.toggle('playing', isAudioPlaying);
    statusPill.classList.toggle('waiting', isWaiting);
    miniVisualizer.classList.toggle('active', isAudioPlaying);
  }

  // Tải file MP3 của câu hiện tại
  async function downloadCurrentQuestionMp3() {
    if (questions.length === 0) return;
    const item = questions[currentIndex];
    btnDownloadCurrent.textContent = 'Đang xử lý MP3...';

    try {
      const sentences = [item.qKr];
      if (item.aKr) sentences.push(item.aKr);

      const resp = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentences,
          pauseDuration: delaySeconds,
          voice: currentVoice,
          speed: currentSpeed
        })
      });

      if (!resp.ok) throw new Error('Lỗi tạo MP3');
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `korean_cau_${item.num ? item.num.replace(/\D/g, '') : currentIndex + 1}.mp3`;
      a.click();
      showToast('⬇ Đã tải câu MP3 về máy!');
    } catch (err) {
      alert('Không thể tải MP3: ' + err.message);
    } finally {
      btnDownloadCurrent.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Tải MP3 câu này</span>
      `;
    }
  }

  // Tải trọn bộ tất cả các câu (MP3 bài học hoàn chỉnh)
  async function downloadAllPlaylistMp3() {
    if (questions.length === 0) return;
    btnDownloadAll.textContent = 'Đang tổng hợp toàn bộ bài...';
    btnDownloadAll.disabled = true;

    try {
      const items = questions.map(q => ({
        question: `${q.num ? q.num + ' ' : ''}${q.qKr}`,
        answer: q.aKr || ''
      }));

      const resp = await fetch('/api/tts-qa-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          voice: currentVoice,
          speed: currentSpeed,
          pauseDuration: delaySeconds
        })
      });

      if (!resp.ok) throw new Error('Lỗi tổng hợp playlist MP3');
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `korean_tron_bo_${questions.length}_cau_delay_${delaySeconds}s.mp3`;
      a.click();
      showToast('⬇ Đã tải trọn bộ bài nghe MP3 thành công!');
    } catch (err) {
      alert('Không thể tải bài học: ' + err.message);
    } finally {
      btnDownloadAll.textContent = 'Tải toàn bộ (MP3)';
      btnDownloadAll.disabled = false;
    }
  }

  // Xử lý áp dụng danh sách câu dán từ Modal (Tự động nhận diện câu hỏi/đáp án, dịch hàng loạt & tự động lưu vĩnh viễn)
  async function handleApplyBulk() {
    const raw = bulkInputText.value.trim();
    if (!raw) {
      alert('Vui lòng dán nội dung các câu hỏi!');
      return;
    }

    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    btnApplyBulk.textContent = '⏳ Đang nhận diện & dịch tự động...';
    btnApplyBulk.disabled = true;

    try {
      const newQuestions = [];
      const shouldTranslate = chkAutoTranslateMissing ? chkAutoTranslateMissing.checked : true;
      const hasHangul = (str) => /[\uAC00-\uD7A3\u3131-\u318E]/.test(str || '');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Kiểm tra xem dòng này có phải là dòng Đáp án (답:, Đáp:, Trả lời:, A:, ->) của câu ngay phía trên không
        const ansMatch = line.match(/^(?:답|정답|Đáp(?:\s*án)?|Trả\s*lời|A|=>|->|➡)\s*[:\.\-]?\s*(.+)$/i);
        if (ansMatch && newQuestions.length > 0) {
          const lastQ = newQuestions[newQuestions.length - 1];
          const ansContent = ansMatch[1].trim();
          if (hasHangul(ansContent) || !lastQ.aKr) {
            lastQ.aKr = ansContent;
          } else if (!lastQ.aVi) {
            lastQ.aVi = ansContent;
          }
          continue;
        }

        // Nếu dòng không có chữ Hàn nào mà câu trước đó chưa có bản dịch tiếng Việt -> gán làm nghĩa tiếng Việt
        if (!hasHangul(line) && newQuestions.length > 0) {
          const lastQ = newQuestions[newQuestions.length - 1];
          const cleanVi = line.replace(/^[\-\*\•\>]\s*/, '').trim();
          if (lastQ.aKr && !lastQ.aVi) {
            lastQ.aVi = cleanVi;
            continue;
          } else if (!lastQ.qVi) {
            lastQ.qVi = cleanVi;
            continue;
          }
        }

        // Tách số thứ tự đầu câu (ví dụ: "79. ", "Câu 1: ", "1) ")
        const numMatch = line.match(/^(?:Câu\s*)?(\d+[\.\)\:]?)\s*(.*)/i);
        let num = '';
        let rest = line;

        if (numMatch && numMatch[2].trim()) {
          num = numMatch[1].endsWith('.') || numMatch[1].endsWith(')') ? numMatch[1] : `${numMatch[1].replace(/\D/g, '')}.`;
          rest = numMatch[2].trim();
        } else {
          num = `${newQuestions.length + 1}.`;
        }

        // Hỗ trợ cú pháp "Câu hỏi Hàn | Câu trả lời Hàn" trên cùng 1 dòng
        let qKr = rest;
        let aKr = '';
        if (rest.includes('|')) {
          const parts = rest.split('|').map(s => s.trim()).filter(Boolean);
          qKr = parts[0] || rest;
          aKr = parts[1] || '';
        }

        newQuestions.push({
          num,
          qKr,
          qVi: '',
          aKr,
          aVi: ''
        });
      }

      if (shouldTranslate && newQuestions.length > 0) {
        const qIndices = [];
        const qTexts = [];
        const aIndices = [];
        const aTexts = [];

        newQuestions.forEach((item, idx) => {
          if (item.qKr && !item.qVi) {
            qIndices.push(idx);
            qTexts.push(item.qKr);
          }
          if (item.aKr && !item.aVi) {
            aIndices.push(idx);
            aTexts.push(item.aKr);
          }
        });

        if (qTexts.length > 0) {
          const qTranslations = await translateBatchSmart(qTexts);
          qIndices.forEach((qIdx, idx) => {
            if (qTranslations[idx]) newQuestions[qIdx].qVi = qTranslations[idx];
          });
        }

        if (aTexts.length > 0) {
          const aTranslations = await translateBatchSmart(aTexts);
          aIndices.forEach((aIdx, idx) => {
            if (aTranslations[idx]) newQuestions[aIdx].aVi = aTranslations[idx];
          });
        }
      }

      questions = newQuestions;
      originalQuestions = JSON.parse(JSON.stringify(questions));
      saveQuestionsToLocalStorage();

      // Tự động tạo & lưu thành bộ câu hỏi mới trong thư viện để không bao giờ bị mất sau vài hôm
      const nowIso = new Date().toISOString();
      const autoTitle = `Bộ câu mới (${questions.length} câu - ${new Date().toLocaleDateString('vi-VN')})`;
      const newSetId = 'set_' + Date.now();
      const autoSavedSet = {
        id: newSetId,
        title: autoTitle,
        description: 'Tự động lưu khi dán danh sách câu mới',
        createdAt: nowIso,
        updatedAt: nowIso,
        questions: JSON.parse(JSON.stringify(questions))
      };

      savedSets.unshift(autoSavedSet);
      activeSetId = newSetId;
      localStorage.setItem('korean_active_set_id', activeSetId);
      saveSetsToStorage(savedSets);

      // Đồng bộ lên Server
      fetch('/api/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoSavedSet)
      }).catch(e => console.warn('Auto-save bulk set to server deferred:', e));

      currentIndex = 0;
      isAnswerRevealed = false;
      resetExamTimer();
      audioCache.clear();
      stopAudio();
      updateSetPickerDropdown();
      renderSavedSetsLibrary();
      renderPlaylist();
      updateStageDisplay();

      managerModal.style.display = 'none';
      showToast(`✅ Đã dịch & tự động lưu "${autoTitle}" (${questions.length} câu)!`);
    } catch (err) {
      console.error('Lỗi áp dụng danh sách câu:', err);
      alert('Có lỗi khi xử lý danh sách câu: ' + err.message);
    } finally {
      btnApplyBulk.textContent = '🚀 Áp dụng danh sách câu';
      btnApplyBulk.disabled = false;
    }
  }

  // ========================================================
  // VISUAL CUSTOMIZER & IN-PLACE QUICK EDIT LOGIC
  // ========================================================
  function loadAndApplyVisualSettings() {
    try {
      const stored = localStorage.getItem('korean_visual_customizer_settings');
      if (stored) {
        visualSettings = { ...defaultVisualSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load visual settings:', e);
    }
    applyVisualSettings();
    syncCustomizerControls();

    // Xóa cờ cũ bị kẹt để tự động thoát nếu trình duyệt trước đó bị kẹt ở giao diện tối giản / IP13
    if (localStorage.getItem('korean_minimal_mode')) {
      localStorage.removeItem('korean_minimal_mode');
    }
    if (localStorage.getItem('korean_iphone13_mode')) {
      localStorage.removeItem('korean_iphone13_mode');
    }

    const savedMinimal = localStorage.getItem('korean_minimal_mode_v2');
    if (savedMinimal === '1') {
      setMinimalMode(true, false);
    }

    const savedIPhone13 = localStorage.getItem('korean_iphone13_mode_v2');
    if (savedIPhone13 === '1') {
      setIPhone13Mode(true, false);
    }
  }

  function setIPhone13Mode(enabled, notify = true) {
    document.body.classList.toggle('iphone13-mode', enabled);
    if (btnToggleIPhone13) {
      btnToggleIPhone13.classList.toggle('active', enabled);
      btnToggleIPhone13.title = enabled ? 'Quay lại Giao diện tiêu chuẩn' : 'Bật chế độ tối ưu màn hình iPhone 13 Pro';
    }
    if (iphone13BtnText) {
      iphone13BtnText.textContent = enabled ? '✓ IP13' : '📱 IP13';
    }
    if (toggleIPhone13Mode) {
      toggleIPhone13Mode.checked = enabled;
    }
    localStorage.setItem('korean_iphone13_mode_v2', enabled ? '1' : '0');
    if (notify) {
      showToast(enabled ? '📱 Đã bật chế độ chuẩn màn hình iPhone 13 Pro!' : '🔄 Đã quay lại Giao diện tiêu chuẩn!', 'info');
    }
  }

  function setMinimalMode(enabled, notify = true) {
    document.body.classList.toggle('minimal-mode', enabled);
    if (minimalBtnText) {
      minimalBtnText.textContent = enabled ? '✕ Thoát' : '🎯 Tối giản';
    }
    if (btnToggleMinimal) {
      btnToggleMinimal.title = enabled ? 'Quay lại Giao diện đầy đủ' : 'Bật Giao diện tối giản (Chỉ hiển thị thời gian, câu hỏi & nút câu tiếp theo)';
    }
    if (toggleMinimalMode) {
      toggleMinimalMode.checked = enabled;
    }
    if (enabled && customizerDrawer && customizerDrawer.classList.contains('open')) {
      customizerDrawer.classList.remove('open');
      if (customizerBackdrop) customizerBackdrop.style.display = 'none';
    }
    localStorage.setItem('korean_minimal_mode_v2', enabled ? '1' : '0');
    if (notify) {
      showToast(enabled ? '🎯 Đã bật Giao diện tối giản tập trung!' : '🔄 Đã quay lại Giao diện đầy đủ!', 'info');
    }
  }

  function applyVisualSettings() {
    // 1. Theme
    document.body.classList.remove('theme-dark', 'theme-amoled', 'theme-midnight', 'theme-slate', 'theme-light');
    if (visualSettings.theme && visualSettings.theme !== 'dark') {
      document.body.classList.add(`theme-${visualSettings.theme}`);
    }

    // 2. Accent Color
    const root = document.documentElement;
    root.style.setProperty('--accent-cyan', visualSettings.accentColor);
    if (accentColorPreviewBadge) {
      accentColorPreviewBadge.textContent = visualSettings.accentColor;
    }

    // 3. Font Sizes
    root.style.setProperty('--kr-font-size', `${visualSettings.fontSizeKr}px`);
    root.style.setProperty('--vi-font-size', `${visualSettings.fontSizeVi}px`);
    root.style.setProperty('--ans-font-size', `${visualSettings.fontSizeAns}px`);

    if (labelFontSizeKr) labelFontSizeKr.textContent = `${visualSettings.fontSizeKr}px`;
    if (labelFontSizeVi) labelFontSizeVi.textContent = `${visualSettings.fontSizeVi}px`;
    if (labelFontSizeAns) labelFontSizeAns.textContent = `${visualSettings.fontSizeAns}px`;

    // 4. Visibility Toggles
    if (visualSettings.showVi) {
      document.body.classList.remove('hide-vietnamese');
    } else {
      document.body.classList.add('hide-vietnamese');
    }

    if (visualSettings.showTimer) {
      document.body.classList.remove('hide-timer');
    } else {
      document.body.classList.add('hide-timer');
    }

    if (visualSettings.showVisualizer) {
      document.body.classList.remove('hide-visualizer');
    } else {
      document.body.classList.add('hide-visualizer');
    }

    if (visualSettings.glassGlow) {
      document.body.classList.remove('no-glass');
    } else {
      document.body.classList.add('no-glass');
    }

    // 5. Delay, Voice & Speed sync
    delaySeconds = visualSettings.delay;
    if (delayValueText) delayValueText.textContent = `${delaySeconds} s`;
    if (labelCustomizerDelay) labelCustomizerDelay.textContent = `${delaySeconds} giây`;
    if (visualSettings.voice) {
      currentVoice = visualSettings.voice;
      if (selectVoice) selectVoice.value = currentVoice;
      if (customizerVoiceSelect) customizerVoiceSelect.value = currentVoice;
    }
    if (visualSettings.speed) {
      currentSpeed = parseFloat(visualSettings.speed) || 1.0;
      if (selectSpeed) {
        const matchOpt = Array.from(selectSpeed.options).find(o => Math.abs(parseFloat(o.value) - currentSpeed) < 0.01);
        if (matchOpt) selectSpeed.value = matchOpt.value;
      }
      if (customizerSpeedSelect) {
        const matchOpt2 = Array.from(customizerSpeedSelect.options).find(o => Math.abs(parseFloat(o.value) - currentSpeed) < 0.01);
        if (matchOpt2) customizerSpeedSelect.value = matchOpt2.value;
      }
    }
  }

  function saveVisualSettings() {
    try {
      localStorage.setItem('korean_visual_customizer_settings', JSON.stringify(visualSettings));
    } catch (e) {
      console.warn('Could not save visual settings:', e);
    }
  }

  function syncCustomizerControls() {
    // Theme cards
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.toggle('active', card.dataset.theme === visualSettings.theme);
    });

    // Swatches
    document.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color.toLowerCase() === visualSettings.accentColor.toLowerCase());
    });
    if (customColorPicker) customColorPicker.value = visualSettings.accentColor;

    // Sliders
    if (rangeFontSizeKr) rangeFontSizeKr.value = visualSettings.fontSizeKr;
    if (rangeFontSizeVi) rangeFontSizeVi.value = visualSettings.fontSizeVi;
    if (rangeFontSizeAns) rangeFontSizeAns.value = visualSettings.fontSizeAns;

    // Toggles
    if (toggleShowVi) toggleShowVi.checked = visualSettings.showVi;
    if (toggleShowTimer) toggleShowTimer.checked = visualSettings.showTimer;
    if (toggleShowVisualizer) toggleShowVisualizer.checked = visualSettings.showVisualizer;
    if (toggleGlassGlow) toggleGlassGlow.checked = visualSettings.glassGlow;

    // Delay, voice & speed
    if (rangeCustomizerDelay) rangeCustomizerDelay.value = visualSettings.delay;
    if (customizerVoiceSelect) customizerVoiceSelect.value = visualSettings.voice;
    if (customizerSpeedSelect && visualSettings.speed) {
      const matchOpt = Array.from(customizerSpeedSelect.options).find(o => Math.abs(parseFloat(o.value) - parseFloat(visualSettings.speed)) < 0.01);
      if (matchOpt) customizerSpeedSelect.value = matchOpt.value;
    }
    if (toggleMinimalMode) toggleMinimalMode.checked = document.body.classList.contains('minimal-mode');
    if (toggleIPhone13Mode) toggleIPhone13Mode.checked = document.body.classList.contains('iphone13-mode');
  }

  // Tự động dịch khi người dùng nhập xong câu hỏi / câu trả lời tiếng Hàn trong bảng Sửa nhanh
  if (editQuestionKr) {
    editQuestionKr.addEventListener('blur', async () => {
      const kr = editQuestionKr.value.trim();
      if (kr && (!editQuestionVi.value || !editQuestionVi.value.trim())) {
        editQuestionVi.placeholder = '⏳ Đang tự động dịch sang tiếng Việt...';
        const vi = await translateTextSmart(kr);
        if (vi && (!editQuestionVi.value || !editQuestionVi.value.trim())) {
          editQuestionVi.value = vi;
        }
        editQuestionVi.placeholder = 'Nhập bản dịch tiếng Việt...';
      }
    });
  }

  if (editAnswerKr) {
    editAnswerKr.addEventListener('blur', async () => {
      const kr = editAnswerKr.value.trim();
      if (kr && (!editAnswerVi.value || !editAnswerVi.value.trim())) {
        editAnswerVi.placeholder = '⏳ Đang tự động dịch câu trả lời...';
        const vi = await translateTextSmart(kr);
        if (vi && (!editAnswerVi.value || !editAnswerVi.value.trim())) {
          editAnswerVi.value = vi;
        }
        editAnswerVi.placeholder = 'Nhập bản dịch tiếng Việt của câu trả lời...';
      }
    });
  }

  function openQuickEditModal(index = currentIndex, isNew = false) {
    editingQuestionIndex = index;
    isAddingNewQuestion = isNew;

    if (isNew) {
      quickEditModalTitle.textContent = "Thêm câu hỏi mới vào danh sách";
      editQuestionNum.value = `${questions.length + 1}.`;
      editQuestionKr.value = "";
      editQuestionVi.value = "";
      editAnswerKr.value = "";
      editAnswerVi.value = "";
      btnDeleteCurrentQuestion.style.display = 'none';
      btnAddQuestionAfter.style.display = 'none';
    } else {
      quickEditModalTitle.textContent = `Chỉnh sửa câu ${index + 1}`;
      const item = questions[index] || { num: `${index + 1}.`, qKr: '', qVi: '', aKr: '', aVi: '' };
      editQuestionNum.value = item.num || `${index + 1}.`;
      editQuestionKr.value = item.qKr || "";
      editQuestionVi.value = item.qVi || "";
      editAnswerKr.value = item.aKr || "";
      editAnswerVi.value = item.aVi || "";
      btnDeleteCurrentQuestion.style.display = 'inline-block';
      btnAddQuestionAfter.style.display = 'inline-block';
    }

    quickEditModal.style.display = 'flex';
  }

  async function handleAutoTranslateField(sourceText, targetElement, btnElement) {
    if (!sourceText || !sourceText.trim()) {
      showToast("Vui lòng nhập văn bản tiếng Hàn trước khi dịch!", true);
      return;
    }
    const origText = btnElement.textContent;
    btnElement.textContent = "⏳ Đang dịch...";
    btnElement.disabled = true;

    try {
      const translated = await translateTextSmart(sourceText.trim());
      if (translated) {
        targetElement.value = translated;
        showToast("✅ Đã dịch xong sang Tiếng Việt!");
      } else {
        throw new Error('Không thể dịch');
      }
    } catch (err) {
      console.error('Translation error:', err);
      showToast("Không thể dịch tự động lúc này, vui lòng thử lại!", true);
    } finally {
      btnElement.textContent = origText;
      btnElement.disabled = false;
    }
  }

  async function previewAudioText(text) {
    if (!text || !text.trim()) {
      showToast("Chưa có văn bản để phát âm!", true);
      return;
    }
    try {
      const blobUrl = await getAudioBlobUrl(text.trim());
      if (blobUrl) {
        const previewAudio = new Audio(blobUrl);
        await previewAudio.play();
      } else {
        throw new Error('Lỗi tạo âm thanh');
      }
    } catch (err) {
      console.error('TTS preview error:', err);
      showToast("Lỗi khi phát thử âm thanh", true);
    }
  }

  async function handleSaveQuickEdit() {
    const qKr = editQuestionKr.value.trim();
    if (!qKr) {
      showToast("Vui lòng nhập câu hỏi tiếng Hàn!", true);
      editQuestionKr.focus();
      return;
    }

    const oldItem = (!isAddingNewQuestion && questions[editingQuestionIndex])
      ? questions[editingQuestionIndex]
      : { qKr: '', qVi: '', aKr: '', aVi: '' };

    let qVi = editQuestionVi.value.trim();
    const aKr = editAnswerKr.value.trim();
    let aVi = editAnswerVi.value.trim();

    const origBtnText = btnSaveQuickEdit.textContent;
    btnSaveQuickEdit.disabled = true;
    btnSaveQuickEdit.textContent = "⏳ Đang dịch & lưu...";

    try {
      // Tự động dịch câu hỏi nếu chưa có nghĩa tiếng Việt hoặc vừa sửa câu tiếng Hàn mà chưa sửa nghĩa Việt
      if (qKr && (!qVi || (!isAddingNewQuestion && qKr !== oldItem.qKr && qVi === oldItem.qVi))) {
        const transQ = await translateTextSmart(qKr);
        if (transQ) qVi = transQ;
      }

      // Tự động dịch câu trả lời nếu chưa có nghĩa tiếng Việt hoặc vừa sửa câu trả lời tiếng Hàn
      if (aKr && (!aVi || (!isAddingNewQuestion && aKr !== oldItem.aKr && aVi === oldItem.aVi))) {
        const transA = await translateTextSmart(aKr);
        if (transA) aVi = transA;
      }

      const item = {
        num: editQuestionNum.value.trim() || `${editingQuestionIndex + 1}.`,
        qKr,
        qVi,
        aKr,
        aVi,
        customVi: !!qVi,
        customAVi: !!aVi
      };

      if (isAddingNewQuestion) {
        if (editingQuestionIndex >= 0 && editingQuestionIndex < questions.length) {
          questions.splice(editingQuestionIndex + 1, 0, item);
          currentIndex = editingQuestionIndex + 1;
        } else {
          questions.push(item);
          currentIndex = questions.length - 1;
        }
        originalQuestions = JSON.parse(JSON.stringify(questions));
        showToast("✅ Đã dịch & thêm câu hỏi mới thành công!");
      } else {
        questions[editingQuestionIndex] = item;
        syncQuestionEditToOriginal(item, editingQuestionIndex);
        showToast("✅ Đã dịch & lưu cập nhật câu hỏi vĩnh viễn!");
      }

      saveQuestionsToLocalStorage();
      audioCache.clear();
      renderPlaylist();
      updateStageDisplay();
      quickEditModal.style.display = 'none';

      persistQuestionsToServer();
    } finally {
      btnSaveQuickEdit.disabled = false;
      btnSaveQuickEdit.textContent = origBtnText;
    }
  }

  function handleDeleteCurrentQuestion() {
    if (questions.length <= 1) {
      showToast("Cần giữ ít nhất 1 câu hỏi trong danh sách!", true);
      return;
    }
    const currentKr = questions[editingQuestionIndex]?.qKr || '';
    if (!confirm(`Bạn có chắc muốn xóa câu hỏi "${currentKr}" không?`)) {
      return;
    }
    questions.splice(editingQuestionIndex, 1);
    if (currentIndex >= questions.length) {
      currentIndex = questions.length - 1;
    }
    originalQuestions = JSON.parse(JSON.stringify(questions));
    saveQuestionsToLocalStorage();
    audioCache.clear();
    renderPlaylist();
    updateStageDisplay();
    quickEditModal.style.display = 'none';
    showToast("Đã xóa câu hỏi khỏi danh sách!");
    persistQuestionsToServer();
  }

  function saveQuestionsToLocalStorage() {
    try {
      localStorage.setItem('korean_questions', JSON.stringify(questions));
    } catch (e) {
      console.warn('Could not save questions to localStorage:', e);
    }
  }

  function persistQuestionsToServer() {
    const targetQuestions = (originalQuestions && originalQuestions.length === questions.length)
      ? originalQuestions
      : questions;
    const nowIso = new Date().toISOString();

    if (activeSetId) {
      const idx = savedSets.findIndex(s => s.id === activeSetId);
      let setTitle = 'Bộ câu hỏi đã lưu';
      let setDesc = '';

      if (idx !== -1) {
        savedSets[idx].questions = JSON.parse(JSON.stringify(targetQuestions));
        savedSets[idx].updatedAt = nowIso;
        setTitle = savedSets[idx].title;
        setDesc = savedSets[idx].description || '';
      } else {
        const newSet = {
          id: activeSetId,
          title: setTitle,
          description: setDesc,
          createdAt: nowIso,
          updatedAt: nowIso,
          questions: JSON.parse(JSON.stringify(targetQuestions))
        };
        savedSets.unshift(newSet);
      }

      saveSetsToStorage(savedSets);
      updateSetPickerDropdown();

      fetch(`/api/sets/${activeSetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: setTitle,
          description: setDesc,
          questions: targetQuestions
        })
      }).catch(err => console.warn('Could not auto-sync set to server:', err));
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Khởi chạy ứng dụng sau khi toàn bộ biến và hàm đã sẵn sàng
  init();
});
