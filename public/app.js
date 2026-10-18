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
  const rangeCustomizerDelay = document.getElementById('rangeCustomizerDelay');
  const labelCustomizerDelay = document.getElementById('labelCustomizerDelay');
  const btnResetCustomizer = document.getElementById('btnResetCustomizer');

  // Minimalist Mode Toggle DOM
  const btnToggleMinimal = document.getElementById('btnToggleMinimal');
  const minimalBtnText = document.getElementById('minimalBtnText');
  const toggleMinimalMode = document.getElementById('toggleMinimalMode');

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
    voice: 'ko-KR-SunHiNeural'
  };

  let visualSettings = { ...defaultVisualSettings };
  let editingQuestionIndex = 0;
  let isAddingNewQuestion = false;

  // Initialize App
  init();

  async function init() {
    originalQuestions = JSON.parse(JSON.stringify(questions));
    loadAndApplyVisualSettings();
    renderPlaylist();
    updateStageDisplay();
    bindEvents();
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
      audioCache.clear();
    });

    selectSpeed.addEventListener('change', (e) => {
      currentSpeed = parseFloat(e.target.value);
      audioCache.clear();
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

    // Customizer Voice & Delay
    if (customizerVoiceSelect) {
      customizerVoiceSelect.addEventListener('change', (e) => {
        visualSettings.voice = e.target.value;
        currentVoice = e.target.value;
        selectVoice.value = e.target.value;
        saveVisualSettings();
        showToast(`Đã đổi giọng sang: ${e.target.options[e.target.selectedIndex].text.split('(')[0].trim()}`, 'info');
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
    if (toggleMinimalMode) {
      toggleMinimalMode.addEventListener('change', (e) => {
        setMinimalMode(e.target.checked);
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
  let cachedNetworkData = null;

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

  // Question Sets API Management
  async function fetchSavedSets() {
    try {
      const resp = await fetch('/api/sets');
      const data = await resp.json();
      if (data.success && Array.isArray(data.sets)) {
        savedSets = data.sets;
        updateSetPickerDropdown();
        renderSavedSetsLibrary();

        // Kiểm tra xem activeSetId có khớp bộ nào không
        const activeSet = savedSets.find(s => s.id === activeSetId);
        if (activeSet && (!questions || questions.length === 0)) {
          questions = [...activeSet.questions];
          renderPlaylist();
          updateStageDisplay();
        }
      }
    } catch (err) {
      console.warn('Không thể tải bộ câu hỏi từ server:', err);
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
    questions = [...targetSet.questions];
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
    btnConfirmSaveSet.textContent = 'Đang lưu...';

    try {
      if (isOverwrite) {
        // Cập nhật bộ câu hiện tại
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
        if (!data.success) throw new Error(data.error);

        // Update local state
        const idx = savedSets.findIndex(s => s.id === activeSetId);
        if (idx !== -1) savedSets[idx] = data.set;
        showToast(`✅ Đã cập nhật: ${data.set.title}`);
      } else {
        // Lưu thành bộ mới
        const resp = await fetch('/api/sets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description: desc,
            questions
          })
        });
        const data = await resp.json();
        if (!data.success) throw new Error(data.error);

        savedSets.unshift(data.set);
        activeSetId = data.set.id;
        localStorage.setItem('korean_active_set_id', activeSetId);
        showToast(`✅ Đã lưu bộ câu mới: ${data.set.title}`);
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
          try {
            const resp = await fetch(`/api/sets/${set.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: newTitle.trim() })
            });
            const d = await resp.json();
            if (d.success) {
              set.title = newTitle.trim();
              updateSetPickerDropdown();
              renderSavedSetsLibrary();
              showToast('Đã đổi tên bộ câu hỏi!');
            }
          } catch (e) {
            alert('Không thể đổi tên: ' + e.message);
          }
        }
      });

      // Delete set button
      card.querySelector('.btn-set-delete').addEventListener('click', async () => {
        if (confirm(`Bạn có chắc muốn xóa bộ câu hỏi "${set.title}" không?`)) {
          try {
            const resp = await fetch(`/api/sets/${set.id}`, { method: 'DELETE' });
            const d = await resp.json();
            if (d.success) {
              savedSets = savedSets.filter(s => s.id !== set.id);
              if (activeSetId === set.id && savedSets.length > 0) {
                activeSetId = savedSets[0].id;
              }
              updateSetPickerDropdown();
              renderSavedSetsLibrary();
              showToast('Đã xóa bộ câu hỏi!');
            }
          } catch (e) {
            alert('Không thể xóa: ' + e.message);
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
            await fetch('/api/sets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: item.title,
                description: item.description || '',
                questions: item.questions
              })
            });
          }
        }

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
    toast.className = `toast-message ${isError ? 'toast-error' : ''}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Update Center Stage Info
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
    displayQuestionKr.textContent = `${item.num ? item.num + ' ' : ''}${item.qKr}`;
    displayQuestionVi.textContent = item.qVi || "—";

    displayAnswerKr.textContent = item.aKr || "Chưa có đáp án";
    displayAnswerVi.textContent = item.aVi || "";

    counterText.textContent = `${currentIndex + 1}/${questions.length}`;

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
  let isDraggingPlaylist = false;
  let playlistStartY = 0;
  let playlistStartScrollTop = 0;
  let hasDraggedPlaylist = false;

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
      const aAudioUrl = await getAudioBlobUrl(item.aKr);
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
      // Bước 1: Đọc Câu hỏi
      setStatus('Đang đọc câu hỏi...', true);
      const qAudioUrl = await getAudioBlobUrl(item.qKr);
      if (!isPlaying || currentSession !== playbackSessionId) return;

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
    audio.pause();
    audio.onended = null;
    audio.currentTime = 0;
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

  // Xử lý áp dụng danh sách câu dán từ Modal
  async function handleApplyBulk() {
    const raw = bulkInputText.value.trim();
    if (!raw) {
      alert('Vui lòng dán nội dung các câu hỏi!');
      return;
    }

    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    btnApplyBulk.textContent = 'Đang nhận diện & dịch...';
    btnApplyBulk.disabled = true;

    const newQuestions = [];
    const shouldTranslate = chkAutoTranslateMissing ? chkAutoTranslateMissing.checked : true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Tách số thứ tự (ví dụ: "79. ", "80. ")
      const numMatch = line.match(/^(\d+[\.\)])\s*(.*)/);
      let num = '';
      let qKr = line;

      if (numMatch) {
        num = numMatch[1];
        qKr = numMatch[2].trim();
      } else {
        num = `${i + 1}.`;
      }

      let qVi = '';
      if (shouldTranslate) {
        try {
          const transResp = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: qKr })
          });
          const transData = await transResp.json();
          qVi = transData.translation || '';
        } catch (e) {
          console.warn('Lỗi dịch câu:', line);
        }
      }

      newQuestions.push({
        num,
        qKr,
        qVi,
        aKr: '',
        aVi: ''
      });
    }

    questions = newQuestions;
    originalQuestions = JSON.parse(JSON.stringify(questions));
    localStorage.setItem('korean_questions', JSON.stringify(questions));
    currentIndex = 0;
    isAnswerRevealed = false;
    resetExamTimer();
    audioCache.clear();
    stopAudio();
    renderPlaylist();
    updateStageDisplay();

    btnApplyBulk.textContent = '🚀 Áp dụng danh sách câu';
    btnApplyBulk.disabled = false;
    managerModal.style.display = 'none';
    showToast(`Đã áp dụng ${questions.length} câu mới. Bấm "Lưu bộ này" để lưu lại!`);
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

    const savedMinimal = localStorage.getItem('korean_minimal_mode');
    if (savedMinimal === '1') {
      setMinimalMode(true, false);
    }
  }

  function setMinimalMode(enabled, notify = true) {
    document.body.classList.toggle('minimal-mode', enabled);
    if (minimalBtnText) {
      minimalBtnText.textContent = enabled ? '✕ Thoát tối giản' : '🎯 Giao diện tối giản';
    }
    if (btnToggleMinimal) {
      btnToggleMinimal.title = enabled ? 'Quay lại Giao diện đầy đủ' : 'Bật Giao diện tối giản (Chỉ hiển thị thời gian, câu hỏi & nút câu tiếp theo)';
    }
    if (toggleMinimalMode) {
      toggleMinimalMode.checked = enabled;
    }
    localStorage.setItem('korean_minimal_mode', enabled ? '1' : '0');
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

    // 5. Delay & Voice sync
    delaySeconds = visualSettings.delay;
    if (delayValueText) delayValueText.textContent = `${delaySeconds} s`;
    if (labelCustomizerDelay) labelCustomizerDelay.textContent = `${delaySeconds} giây`;
    if (visualSettings.voice) {
      currentVoice = visualSettings.voice;
      if (selectVoice) selectVoice.value = currentVoice;
      if (customizerVoiceSelect) customizerVoiceSelect.value = currentVoice;
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

    // Delay & voice
    if (rangeCustomizerDelay) rangeCustomizerDelay.value = visualSettings.delay;
    if (customizerVoiceSelect) customizerVoiceSelect.value = visualSettings.voice;
    if (toggleMinimalMode) toggleMinimalMode.checked = document.body.classList.contains('minimal-mode');
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
      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText.trim() })
      });
      const data = await resp.json();
      if (data.success && data.translation) {
        targetElement.value = data.translation;
        showToast("Đã dịch xong sang Tiếng Việt!");
      } else {
        throw new Error(data.error || 'Lỗi dịch');
      }
    } catch (err) {
      console.error('Translation error:', err);
      showToast("Không thể dịch tự động lúc này", true);
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
      const resp = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice: currentVoice,
          speed: currentSpeed
        })
      });
      const data = await resp.json();
      if (data.success && data.audioUrl) {
        const previewAudio = new Audio(data.audioUrl);
        previewAudio.play();
      } else {
        throw new Error(data.error || 'Lỗi TTS');
      }
    } catch (err) {
      console.error('TTS preview error:', err);
      showToast("Lỗi khi phát thử âm thanh", true);
    }
  }

  function handleSaveQuickEdit() {
    const qKr = editQuestionKr.value.trim();
    if (!qKr) {
      showToast("Vui lòng nhập câu hỏi tiếng Hàn!", true);
      editQuestionKr.focus();
      return;
    }

    const item = {
      num: editQuestionNum.value.trim() || `${editingQuestionIndex + 1}.`,
      qKr: qKr,
      qVi: editQuestionVi.value.trim(),
      aKr: editAnswerKr.value.trim(),
      aVi: editAnswerVi.value.trim()
    };

    if (isAddingNewQuestion) {
      if (editingQuestionIndex >= 0 && editingQuestionIndex < questions.length) {
        questions.splice(editingQuestionIndex + 1, 0, item);
        currentIndex = editingQuestionIndex + 1;
      } else {
        questions.push(item);
        currentIndex = questions.length - 1;
      }
      showToast("Đã thêm câu hỏi mới thành công!");
    } else {
      questions[editingQuestionIndex] = item;
      showToast("Đã lưu cập nhật câu hỏi!");
    }

    originalQuestions = JSON.parse(JSON.stringify(questions));
    saveQuestionsToLocalStorage();
    audioCache.clear();
    renderPlaylist();
    updateStageDisplay();
    quickEditModal.style.display = 'none';

    persistQuestionsToServer();
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
    if (activeSetId && activeSetId.startsWith('set_')) {
      fetch(`/api/sets/${activeSetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions })
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
});
