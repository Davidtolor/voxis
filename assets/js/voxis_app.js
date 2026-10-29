/**
 * PECSAAC — Clinical & Professional Application Controller
 * Features:
 * - Fitzgerald Key AAC Grid
 * - Fixed Core Vocabulary Dock
 * - Smart Georgian Grammar Inflection (აკუზატივი/ბრუნვა)
 * - 🤝 Detachable Sentence Strip Handover with Partner Reaction
 * - 📋 First-Then (პირველად ➔ შემდეგ) Routine Board with Confetti
 * - PECS 6 Clinical Stages Trainer
 * - Live Microphone Voice Recording (Mother/Therapist Voice)
 * - ARASAAC Official Pictogram Search API
 * - Multi-Child Profile Management
 * - ABA Session Analytics & Data Tracking
 * - 🖨️ Printable PECS Cards Studio (Printable Cut-Sheets)
 */

class PecsApp {
    constructor() {
        this.categories = [];
        this.cards = [];
        this.starterCards = [];
        this.customCards = [];
        this.sentenceStrip = [];
        const _urlP = new URLSearchParams(window.location.search);
        this.activeCategory = _urlP.get('cat') || localStorage.getItem('voxis_pecs_cat') || 'food';
        this.currentMode = 'aac'; // 'aac', 'trainer', 'first-then'
        this.currentPhase = parseInt(_urlP.get('phase')) || 1;
        this.gridSize = _urlP.get('size') || localStorage.getItem('pecs_grid_size') || 'medium';
        this.boardCurrentPage = 1;
        this.touchRepeatDelay = localStorage.getItem('pecs_touch_repeat_delay') !== null ? parseInt(localStorage.getItem('pecs_touch_repeat_delay')) : 1200;
        this.touchDwellTime = parseInt(localStorage.getItem('pecs_touch_dwell_time')) || 0;
        this.lastCardClickTime = 0;
        this.lastCardClickedId = null;
        this.dwellTimer = null;
        this.dwellingCardEl = null;
        this.activeStudioTab = 'create-card';

        // First-Then (პირველად ➔ შემდეგ)
        this.firstCard = null;
        this.thenCard = null;

        // პროფილები
        this.profiles = [];
        this.activeProfileId = 'default';

        // ABA ანალიტიკა
        this.analyticsLogs = [];

        // ხმის ჩაწერა
        this.currentRecordedAudio = null;
        this.recTimer = null;
        this.recSeconds = 0;

        // ARASAAC
        this.selectedArasaacUrl = null;

        // Custom Celebration & Confetti
        this.confettiAnimId = null;
        this.celebrationOnConfirm = null;

        // AI Room Scanner Live Camera
        this.roomCameraStream = null;
        this.roomCameraFacing = 'environment';

        // დღის განრიგი (Visual Daily Schedule)
        this.currentSchedulePreset = 'morning';
        this.schedulePresets = {
            morning: [
                { id: "s1", text: "საწოლიდან ადგომა", text_en: "Wake up & get out of bed", icon: "🛏️", completed: false },
                { id: "s2", text: "ტუალეტში შესვლა", text_en: "Bathroom & toilet", icon: "🚽", completed: false },
                { id: "s3", text: "კბილების გახეხვა & დაბანა", text_en: "Brush teeth & wash face", icon: "🪥", completed: false },
                { id: "s4", text: "ტანსაცმლის ჩაცმა", text_en: "Get dressed", icon: "👕", completed: false },
                { id: "s5", text: "გემრიელი საუზმე", text_en: "Eat healthy breakfast", icon: "🍳", completed: false }
            ],
            school: [
                { id: "sc1", text: "ჩანთის ჩალაგება", text_en: "Pack backpack", icon: "🎒", completed: false },
                { id: "sc2", text: "სკოლაში / ბაღში მისვლა", text_en: "Go to school / daycare", icon: "🏫", completed: false },
                { id: "sc3", text: "მეცადინეობა & ხატვა", text_en: "Classroom activities & drawing", icon: "🎨", completed: false },
                { id: "sc4", text: "ეზოში თამაში & ლანჩი", text_en: "Outdoor playground & lunch", icon: "🥪", completed: false },
                { id: "sc5", text: "სახლში დაბრუნება", text_en: "Return back home", icon: "🏠", completed: false }
            ],
            evening: [
                { id: "e1", text: "სათამაშოების ალაგება", text_en: "Tidy up toys", icon: "🧸", completed: false },
                { id: "e2", text: "ვახშმის ჭამა", text_en: "Family dinner", icon: "🍽️", completed: false },
                { id: "e3", text: "თბილი შხაპი / აბაზანა", text_en: "Warm bath / shower", icon: "🛁", completed: false },
                { id: "e4", text: "პიჟამის ჩაცმა", text_en: "Put on pajamas", icon: "✨", completed: false },
                { id: "e5", text: "ზღაპრის მოსმენა & ძილი", text_en: "Bedtime story & sleep", icon: "😴", completed: false }
            ]
        };
        this.scheduleSteps = JSON.parse(JSON.stringify(this.schedulePresets.morning));

        // ემოციური რეგულაცია & სუნთქვა
        this.isBreathingActive = false;
        this.breathingInterval = null;

        // ბარათების ცოცხალი ძიება
        this.searchQuery = '';

        // 📚 ბარათების ბაზა & ძიება (Card Library)
        this.aacLibrary = [];
        this.activeLibraryTab = 'preset'; // 'preset', 'arasaac', 'create'
        this.activeLibraryCategory = 'all';
        this.librarySearchQuery = '';
        this.customCardImageData = null;
        this.arasaacSearchTimeout = null;

        // 🎮 „იპოვე ბარათი“ თამაშის მდგომარეობა
        this.gameScore = 0;
        this.currentGameTarget = null;
        this.currentGameChoices = [];

        // 🎯 კლინიკური ABA მიზნები (IEP Goals)
        this.clinicalGoals = [];

        // 🛡️ ბავშვის საკეტი (Child Lock)
        this.isChildLocked = false;

        // ☀️ ეკრანის მუდმივი ჩართულობა (Screen Wake Lock API)
        this.wakeLock = null;
        this.isWakeLockActive = false;

        // 🎓 PECS ფაზა (Phase 1-6 UI/UX) — ნაგულისხმევი: ეტაპი 1 (საწყისი გაცვლა)
        this.activePhase = 1;

        // 🎴 თერაპევტის მიერ არჩეული აქტიური სამიზნე და ცრუ (დისტრაქტორი) ბარათები
        this.phaseTargetCardId = 'c_ball'; // ნაგულისხმევი: ბურთი ⚽
        this.phaseDistractorCardId = 'c_socks'; // ნაგულისხმევი: წინდები 🧦 (როგორც ოფიციალურ PECS ვიდეოში!)
        this.phaseTargetCardId2 = 'c_apple'; // ფაზა 2-სთვის მეორე ბარათი (ვაშლი 🍎)

        // 🎴 სწრაფი ბარათის ამრჩევის როლი: 'target' ან 'distractor'
        this.pickerRole = 'target';
        this.pickerCategory = 'all';
        this.pickerSearchQuery = '';

        // 🤝 ABA დახმარების დონე (Prompt Level): 0: დამოუკიდებლად, 1: ნაწილობრივ, 2: სრული დახმარება
        this.currentPromptLevel = parseInt(localStorage.getItem('pecs_prompt_level')) || 0;
        this.enablePromptPopup = (localStorage.getItem('pecs_enable_prompt_popup') === 'true'); // Default: false
        this.stimulusStartTime = Date.now();
        this.promptTagTimeout = null;
        this.currentPendingEvent = null;

        this.init();
    }

    get voxisAI() {
        return window.voxisAI;
    }
    set voxisAI(val) {
        window.voxisAI = val;
    }

    isEn() {
        const lang = (window.voxisAI && window.voxisAI.currentLang) || localStorage.getItem('voxis_lang') || 'en';
        return lang === 'en';
    }

    isKa() {
        return !this.isEn();
    }

    async init() {
        // Replace browser alert with custom modal
        window.alert = (msg) => this.showAlert(msg);
        document.body.classList.remove('high-contrast');

        const currentLang = localStorage.getItem('voxis_lang') || 'en';
        document.documentElement.lang = currentLang;
        document.body.classList.toggle('lang-ka', currentLang === 'ka');
        document.body.classList.toggle('lang-en', currentLang === 'en');

        this.loadProfiles();
        // Active profile phase sync
        const currentProfile = this.getActiveProfile();
        this.activePhase = (currentProfile && currentProfile.phase) ? currentProfile.phase : 4;
        if (currentProfile) {
            if (currentProfile.phaseTargetCardId) this.phaseTargetCardId = currentProfile.phaseTargetCardId;
            if (currentProfile.phaseDistractorCardId) this.phaseDistractorCardId = currentProfile.phaseDistractorCardId;
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('phase')) {
            this.activePhase = parseInt(urlParams.get('phase')) || 1;
        }
        if (urlParams.has('size')) {
            this.gridSize = urlParams.get('size');
        }
        if (urlParams.has('cat')) {
            this.activeCategory = urlParams.get('cat');
        }

        this.updateProfileBadge();

        this.syncPhaseBadges();
        this.syncPromptLevelUI();
        this.syncGridSizeUI();
        this.syncTouchSettingsUI();
        this.loadAnalytics();
        this.loadClinicalGoals();
        this.loadCustomCards();
        await this.loadData();
        await this.loadAacLibrary();
        this.renderCoreDock();
        this.renderCategories();
        this.renderStarters();
        this.renderCardsGrid();
        this.updateProfileBadge();
        this.updateSmartPredictions();
        this.setupEventListeners();
        this.initTrainerPhase(1);
        this.initFirstThenBoard();
        this.updateFirstThenLanguage(currentLang);
        this.initDailySchedule();
        this.translateBoardUI(currentLang);
        const btnEditText = document.getElementById('btn-edit-mode-text');
        if (btnEditText) {
            btnEditText.innerText = (currentLang === 'en') ? 'Edit' : 'მართვა';
        }

        // 🔒 Restore persistent Child Lock across reloads
        if (localStorage.getItem('voxis_child_lock') === 'true') {
            await this.enableChildLock(false);
        }

        // 🔄 Stay in active mode/exercise across language switches or reloads
        const savedMode = localStorage.getItem('voxis_current_mode');
        if (savedMode && savedMode !== 'aac' && !urlParams.has('phase')) {
            this.switchMainMode(savedMode);
        }

        // 📄 Initialize Board Pagination Swipe, Resize & Keyboard handlers
        this.initBoardTouchSwipe();
        window.addEventListener('resize', () => {
            if (this.activePhase >= 4) {
                this.renderCardsGrid();
            }
        });
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                this.nextBoardPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                this.prevBoardPage();
            }
        });
    }

    // ========================================================
    // 🎉 საზეიმო & კლინიკური შეტყობინების სისტემა (Custom Celebration)
    // ========================================================
    celebrate(options = {}) {
        const modal = document.getElementById('modal-celebration');
        if (!modal) return;

        const avatarEl = document.getElementById('celebration-avatar');
        const titleEl = document.getElementById('celebration-title');
        const subtitleEl = document.getElementById('celebration-subtitle');
        const cardsEl = document.getElementById('celebration-visual-cards');
        const messageEl = document.getElementById('celebration-message');
        const btnEl = document.getElementById('celebration-confirm-btn');

        if (avatarEl) avatarEl.innerText = options.avatar || '🎉';
        if (titleEl) titleEl.innerText = options.title || (this.isEn() ? '🎉 Great Job!' : '🎉 ყოჩაღ!');
        if (subtitleEl) {
            subtitleEl.innerText = options.subtitle || '';
            subtitleEl.style.display = options.subtitle ? 'block' : 'none';
        }
        
        if (cardsEl) {
            if (options.firstCard && options.thenCard) {
                const isEn = this.isEn();
                const taskText = (isEn && options.firstCard.text_en) ? options.firstCard.text_en : options.firstCard.text;
                const rewardText = (isEn && options.thenCard.text_en) ? options.thenCard.text_en : options.thenCard.text;
                cardsEl.style.display = 'flex';
                cardsEl.innerHTML = `
                    <div class="celebration-card-item task-done">
                        <span style="font-size:36px;">${options.firstCard.icon || '🧼'}</span>
                        <span style="font-size:13px; font-weight:900; margin-top:4px;">${taskText}</span>
                        <span style="font-size:11px; color:#059669; font-weight:800; margin-top:2px;">${isEn ? '✅ Done' : '✅ მორჩა'}</span>
                    </div>
                    <div class="celebration-arrow">➔</div>
                    <div class="celebration-card-item reward-ready">
                        <span style="font-size:36px;">${options.thenCard.icon || '🎁'}</span>
                        <span style="font-size:13px; font-weight:900; margin-top:4px;">${rewardText}</span>
                        <span style="font-size:11px; color:#D97706; font-weight:800; margin-top:2px;">${isEn ? '⭐ Reward' : '⭐ ჯილდო'}</span>
                    </div>
                `;
            } else {
                cardsEl.style.display = 'none';
                cardsEl.innerHTML = '';
            }
        }

        if (messageEl) messageEl.innerHTML = options.message || '';
        if (btnEl) btnEl.innerHTML = options.buttonText || (this.isEn() ? '✨ Awesome!' : '✨ შესანიშნავია!');

        this.celebrationOnConfirm = options.onConfirm || null;

        modal.classList.add('active');
        this.launchConfetti();
    }

    closeCelebration() {
        pecsAudio.playTap();
        const modal = document.getElementById('modal-celebration');
        if (modal) modal.classList.remove('active');

        if (this.confettiAnimId) {
            cancelAnimationFrame(this.confettiAnimId);
            this.confettiAnimId = null;
            const canvas = document.getElementById('celebration-confetti-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        if (typeof this.celebrationOnConfirm === 'function') {
            const cb = this.celebrationOnConfirm;
            this.celebrationOnConfirm = null;
            cb();
        }
    }

    launchConfetti() {
        const canvas = document.getElementById('celebration-confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const box = canvas.parentElement;
        canvas.width = box.clientWidth || 440;
        canvas.height = box.clientHeight || 480;

        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444', '#14B8A6'];
        const particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height * 0.5,
                w: Math.random() * 8 + 6,
                h: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 3 + 2.5,
                angle: Math.random() * 360,
                va: (Math.random() - 0.5) * 6,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }

        if (this.confettiAnimId) cancelAnimationFrame(this.confettiAnimId);

        let startTime = Date.now();
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.angle += p.va;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.angle * Math.PI) / 180);
                ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });

            if (Date.now() - startTime < 3500) {
                this.confettiAnimId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        render();
    }

    showAlert(message, title = null, avatar = '💡') {
        pecsAudio.playTap();
        const isEn = this.isEn();
        let finalMessage = message || '';
        let finalTitle = title || (isEn ? 'Notice' : 'შეტყობინება');

        if (isEn && typeof finalMessage === 'string') {
            const alertTranslations = {
                'გთხოვთ ჯერ აირჩიოთ დავალება და ჯილდო': 'Please select both a demand task and a reward first',
                'სარეზერვო ასლის შექმნა ვერ მოხერხდა': 'Failed to create backup',
                'აღდგენა ვერ მოხერხდა': 'Failed to restore data',
                'გთხოვთ ჩაწეროთ ბარათის სახელი ქართულად': 'Please enter a card name',
                'გთხოვთ ჩაწეროთ ბარათის სახელი': 'Please enter a card name',
                'ახალი ბარათი წარმატებით შეინახა და დაემატა თქვენს დაფაზე!': 'New card created successfully and added to your board!',
                'SOS ტელეფონის ნომერი წარმატებით შეინახა!': 'SOS emergency phone number saved successfully!',
                'საკეტი წარმატებით მოიხსნა. ყველა სამართავი ღილაკი დაბრუნდა!': 'Screen unlocked successfully. All controls are restored!',
                'გთხოვთ ჩაწეროთ მიზნის აღწერა': 'Please enter an IEP goal description',
                'ბარათები ჯერ არ არის ჩატვირთული. გთხოვთ დაელოდოთ 1 წამი.': 'Cards are still loading. Please wait a moment.',
                'მიკროფონთან წვდომა ვერ მოხერხდა': 'Could not access microphone',
                'ფოტოს დამუშავება ვერ მოხერხდა': 'Failed to process photo',
                'ბრაუზერის მეხსიერება გადაივსო. გთხოვთ შეამოწმოთ ბარათები ან გააკეთოთ JSON Backup.': 'Browser storage limit exceeded. Please back up your cards.',
                'ანგარიშის ტექსტი წარმატებით დაკოპირდა ბუფერში!': 'Clinical report copied to clipboard!',
                'ტექსტი მზად არის ზემოთ, შეგიძლიათ მონიშნოთ და დააკოპიროთ.': 'Report text is ready above for manual copying.',
                'გადაერთო პროფილზე': 'Switched to profile'
            };
            for (const [ka, en] of Object.entries(alertTranslations)) {
                if (finalMessage.includes(ka)) {
                    finalMessage = finalMessage.replace(new RegExp(ka, 'g'), en);
                }
            }
            if (finalTitle) {
                const titleTranslations = {
                    'ინფორმაცია': 'Information',
                    'ყურადღება': 'Attention',
                    'ბარათი დაემატა': 'Card Added',
                    'SOS კონტაქტი': 'SOS Contact',
                    'კოპირებულია': 'Copied',
                    'რეპორტი': 'Report',
                    'განბლოკილია': 'Unlocked',
                    'მიკროფონი': 'Microphone',
                    'შეცდომა': 'Error',
                    'სტუდია': 'Studio',
                    'პროფილის შეცვლა': 'Profile Switched'
                };
                if (titleTranslations[finalTitle]) {
                    finalTitle = titleTranslations[finalTitle];
                }
            }
        }

        this.celebrate({
            title: finalTitle,
            subtitle: '',
            message: finalMessage,
            avatar: avatar,
            buttonText: isEn ? 'OK 👍' : 'გასაგებია 👍'
        });
    }

    // ========================================================
    // 1. ჭკვიანი ქართული გრამატიკა (Smart Georgian Inflection)
    // ========================================================
    inflectAccusative(nounText) {
        if (!nounText || typeof nounText !== 'string') return nounText;
        const trimmed = nounText.trim();
        // თუ ბოლოვდება ი-ზე: ბურთი -> ბურთს, წყალი -> წყალს, ვაშლი -> ვაშლს
        if (trimmed.endsWith('ი')) {
            return trimmed.slice(0, -1) + 'ს';
        }
        // თუ ბოლოვდება ხმოვანზე (ა, ე, ო, უ): მანქანა -> მანქანას, სათამაშო -> სათამაშოს
        if (/[აეოუ]$/.test(trimmed)) {
            return trimmed + 'ს';
        }
        return trimmed + 'ს';
    }

    // წინადადების ჭკვიანი გრამატიკული აგება
    buildGrammarPhrase(cards) {
        if (!cards || cards.length === 0) return "";
        cards.forEach(c => {
            if (c && (c.id === 'c_tired' || c.id === 'lib_tired' || c.text === 'დავიღალე' || c.spoken === 'დაღლილი')) {
                c.text = 'დავიღალე';
                c.spoken = 'დავიღალე';
            }
        });
        const isEn = (this.isEn());
        if (isEn) {
            return cards.map(c => c.spoken_en || c.text_en || c.spoken || c.text).join(' ');
        }
        if (cards.length === 1) return cards[0].spoken || cards[0].text;

        const firstCard = cards[0];
        const isPerceptionVerb = firstCard.id === 'starter_see' || firstCard.id === 'starter_hear';

        return cards.map((c, index) => {
            if (index > 0 && isPerceptionVerb && (c.type === 'noun' || !c.type)) {
                // ბრუნვის შეცვლა
                return this.inflectAccusative(c.spoken || c.text);
            }
            return c.spoken || c.text;
        }).join(' ');
    }

    // ========================================================
    // 2. პროფილების მართვა (Multi-Child Profiles)
    // ========================================================
    loadProfiles() {
        const defaultPresets = [
            { id: 'prof_alex', name: 'ალექსი', name_en: 'Alex', name_ka: 'ალექსი', age: 4, gender: 'male', phase: 4, avatar: '🧒' },
            { id: 'prof_mia', name: 'მია', name_en: 'Mia', name_ka: 'მია', age: 3, gender: 'female', phase: 1, avatar: '👧' },
            { id: 'prof_lucas', name: 'ლუკა', name_en: 'Lucas', name_ka: 'ლუკა', age: 6, gender: 'male', phase: 6, avatar: '👦' }
        ];

        try {
            const saved = localStorage.getItem('pecs_profiles');
            if (saved) {
                let parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    if (parsed.length === 1 && (parsed[0].id === 'default' || parsed[0].name === 'ბავშვი 1' || parsed[0].name === 'დაჩი')) {
                        parsed = defaultPresets;
                    } else {
                        defaultPresets.forEach(preset => {
                            const exists = parsed.some(p => p.id === preset.id || p.name === preset.name || (p.name_en && p.name_en === preset.name_en));
                            if (!exists) {
                                parsed.push(preset);
                            }
                        });
                        parsed.forEach(p => {
                            delete p.diagnosis;
                            if (p.id === 'prof_alex' || p.name === 'ალექსი' || p.name === 'დაჩი' || p.name === 'ბავშვი 1' || p.name === 'Alex' || p.name_en === 'ალექსი') {
                                p.name_en = 'Alex';
                                p.name_ka = 'ალექსი';
                                if (!p.gender) p.gender = 'male';
                            } else if (p.id === 'prof_mia' || p.name === 'მია' || p.name === 'Mia' || p.name_en === 'მია') {
                                p.name_en = 'Mia';
                                p.name_ka = 'მია';
                                if (!p.gender) p.gender = 'female';
                            } else if (p.id === 'prof_lucas' || p.name === 'ლუკა' || p.name === 'Lucas' || p.name_en === 'ლუკა') {
                                p.name_en = 'Lucas';
                                p.name_ka = 'ლუკა';
                                if (!p.gender) p.gender = 'male';
                            } else {
                                if (!p.name_en) p.name_en = p.name;
                                if (!p.name_ka) p.name_ka = p.name;
                                if (!p.gender) p.gender = (p.avatar === '👧' || p.avatar === '👱‍♀️') ? 'female' : 'male';
                            }
                        });
                    }
                    this.profiles = parsed;
                } else {
                    this.profiles = defaultPresets;
                }
            } else {
                this.profiles = defaultPresets;
            }
            this.activeProfileId = localStorage.getItem('pecs_active_profile_id') || this.profiles[0].id;
            if (!this.profiles.some(p => p.id === this.activeProfileId)) {
                this.activeProfileId = this.profiles[0].id;
            }
            this.saveProfiles();
        } catch(e) {
            this.profiles = defaultPresets;
            this.activeProfileId = 'prof_alex';
            this.saveProfiles();
        }
    }

    saveProfiles() {
        localStorage.setItem('pecs_profiles', JSON.stringify(this.profiles));
        localStorage.setItem('pecs_active_profile_id', this.activeProfileId);
    }

    getActiveProfile() {
        return (this.profiles && this.profiles.find(p => p.id === this.activeProfileId)) || (this.profiles && this.profiles[0]) || { id: 'prof_alex', name: 'ალექსი', name_en: 'Alex', name_ka: 'ალექსი', age: 4, phase: 4, avatar: '🧒' };
    }

    getProfileDisplayName(p, lang = null) {
        if (!p) return '';
        const isEn = (lang === 'en') || (lang === null && this.isEn());
        if (isEn) {
            if (p.name_en) return p.name_en;
            if (p.id === 'prof_alex' || p.name === 'ალექსი' || p.name === 'ალექს' || p.name === 'დაჩი' || p.name === 'ბავშვი 1' || p.name === 'Alex' || p.name === 'მოსწავლე 1') return 'Alex';
            if (p.id === 'prof_mia' || p.name === 'მია' || p.name === 'Mia') return 'Mia';
            if (p.id === 'prof_lucas' || p.name === 'ლუკა' || p.name === 'Lucas') return 'Lucas';
            return p.name;
        } else {
            if (p.name_ka) return p.name_ka;
            if (p.id === 'prof_alex' || p.name === 'Alex' || p.name === 'ალექსი' || p.name === 'ალექს' || p.name === 'დაჩი' || p.name === 'ბავშვი 1' || p.name === 'მოსწავლე 1') return 'ალექსი';
            if (p.id === 'prof_mia' || p.name === 'Mia' || p.name === 'მია') return 'მია';
            if (p.id === 'prof_lucas' || p.name === 'Lucas' || p.name === 'ლუკა') return 'ლუკა';
            return p.name;
        }
    }

    updateProfileBadge() {
        const p = this.getActiveProfile();
        const badge = document.getElementById('active-profile-badge');
        if (badge && p) {
            const displayName = this.getProfileDisplayName(p);
            badge.innerHTML = `<span>${p.avatar || '🧒'}</span> <span id="header-child-name">${displayName}</span>`;
            const drawerName = document.getElementById('drawer-child-name');
            if (drawerName) drawerName.textContent = displayName;
        }
    }

    switchProfile(profileId) {
        const target = this.profiles.find(p => p.id === profileId);
        if (!target) return;

        this.activeProfileId = profileId;
        if (target.phase) {
            this.activePhase = parseInt(target.phase) || 1;
        }
        this.saveProfiles();
        this.updateProfileBadge();
        this.syncPhaseBadges();
        this.loadCustomCards();
        const hiddenCardsKey = `pecs_hidden_cards_${this.activeProfileId}`;
        const hiddenIds = JSON.parse(localStorage.getItem(hiddenCardsKey) || '[]');
        const norm = (s) => (s || '').toString().trim().toLowerCase();
        const cleanId = (id) => (id || '').replace(/^(c_|lib_|board_|board_lib_)/, '');

        this.cards = [...(this.defaultPresetCards || []), ...this.customCards].filter(c => {
            if (!c) return false;
            const baseId = cleanId(c.id);
            const cText = norm(c.text);
            const cTextEn = norm(c.text_en);
            if (hiddenIds.includes(c.id) || hiddenIds.includes(baseId)) return false;
            if (cText && hiddenIds.some(h => norm(h) === cText)) return false;
            if (cTextEn && hiddenIds.some(h => norm(h) === cTextEn)) return false;
            return true;
        });

        this.renderCardsGrid();
        if (typeof this.updateSmartPredictions === 'function') {
            this.updateSmartPredictions();
        }
        if (typeof this.renderProfileListInStudio === 'function') {
            this.renderProfileListInStudio();
        }
        if (typeof this.renderQuickProfileList === 'function') {
            this.renderQuickProfileList();
        }
        if (typeof pecsAudio !== 'undefined' && pecsAudio.playSuccess) {
            pecsAudio.playSuccess();
        }
        const isEn = this.isEn();
        const pName = isEn ? (target.name_en || (target.name === 'ბავშვი 1' || target.name === 'დაჩი' || target.name === 'ალექსი' ? 'Alex' : (target.name === 'მია' ? 'Mia' : (target.name === 'ლუკა' ? 'Lucas' : target.name)))) : (target.name_ka || target.name);
        this.showToast(isEn ? `✨ Switched profile to: ${pName}` : `✨ გადაერთო პროფილზე: ${pName}`);
    }

    createProfile(name, age, avatar = '🧒', phase = 4, gender = 'male') {
        const id = 'prof_' + Date.now();
        this.profiles.push({ 
            id, 
            name, 
            name_en: name, 
            name_ka: name, 
            age: parseInt(age) || 4, 
            gender: gender || 'male',
            phase: parseInt(phase) || 4, 
            avatar: avatar || '🧒' 
        });
        this.saveProfiles();
        this.switchProfile(id);
    }

    // ========================================================
    // 3. მონაცემების ჩატვირთვა
    // ========================================================
    loadCustomCards() {
        try {
            const key = `pecs_custom_cards_${this.activeProfileId}`;
            const saved = localStorage.getItem(key);
            this.customCards = saved ? JSON.parse(saved) : [];
            let changed = false;
            const fixMap = {
                '2349': { match: 'წყალი', newId: 2248 },
                '2439': { match: 'ვაშლი', newId: 2462 },
                '2315': { match: 'ბურთი', newId: 2269 },
                '2476': { match: 'მანქანა', newId: 2339 },
                '3266': { match: 'ტუალეტი', newId: 2430 },
                '2541': { match: 'დახმარება', newId: 4570 },
                '2843': { match: 'ძილი', newId: 2369 },
                '2445': { match: 'ჭამა', newId: 2349 },
                '2448': { match: 'სასმელი', newId: 2276 },
                '2712': { match: 'მიხარია', newId: 3245 },
                '2714': { match: 'მოწყენილი', newId: 2606 },
                '2441': { match: 'წიგნი', newId: 2450 },
                '2486': { match: 'ველოსიპედი', newId: 2277 },
                '2319': { match: 'დათუნია', newId: 4945 },
                '2390': { match: 'ძაღლი', newId: 2517 },
                '2383': { match: 'კატა', newId: 2406 }
            };
            this.customCards.forEach(c => {
                if (!c) return;
                if (c.id === 'c_tired' || c.id === 'lib_tired' || c.text === 'დავიღალე' || c.spoken === 'დაღლილი') {
                    c.text = 'დავიღალე';
                    c.spoken = 'დავიღალე';
                    changed = true;
                }
                if (c.id === 'c_chips' || c.id === 'lib_chips' || c.text === 'ჩიფსი') {
                    if (c.image && c.image.includes('2505')) {
                        c.image = 'https://static.arasaac.org/pictograms/5400/5400_300.png';
                        changed = true;
                    }
                    if (c.arasaacUrl && c.arasaacUrl.includes('2505')) {
                        c.arasaacUrl = 'https://static.arasaac.org/pictograms/5400/5400_300.png';
                        changed = true;
                    }
                }
                for (const [oldId, info] of Object.entries(fixMap)) {
                    if (c.text === info.match) {
                        const newUrl = `https://static.arasaac.org/pictograms/${info.newId}/${info.newId}_300.png`;
                        if (c.image && c.image.includes(`/${oldId}/`)) {
                            c.image = newUrl;
                            changed = true;
                        }
                        if (c.arasaacUrl && c.arasaacUrl.includes(`/${oldId}/`)) {
                            c.arasaacUrl = newUrl;
                            changed = true;
                        }
                    }
                }
                if (!c.text_en && c.text) {
                    const en = this.translateAbaText(c.text);
                    if (en && en !== c.text) {
                        c.text_en = en;
                        changed = true;
                    }
                }
                if (!c.spoken_en && (c.spoken || c.text)) {
                    const en = this.translateAbaText(c.spoken || c.text);
                    if (en && en !== (c.spoken || c.text)) {
                        c.spoken_en = en;
                        changed = true;
                    }
                }
                // თუ ბარათის text მხოლოდ ინგლისურია (მაგ. pizza), ვუთარგმნოთ ქართული ტექსტი
                if (c.text && /^[a-zA-Z\s]+$/.test(c.text)) {
                    const ka = this.translateToGeorgian(c.text);
                    if (ka && ka !== c.text) {
                        if (!c.text_en) c.text_en = c.text;
                        if (!c.spoken_en) c.spoken_en = c.spoken || c.text;
                        c.text = ka;
                        c.spoken = ka;
                        changed = true;
                    }
                }
            });
            if (changed) {
                this.saveCustomCards();
            }
        } catch(e) {
            this.customCards = [];
        }
    }

    saveCustomCards() {
        try {
            const key = `pecs_custom_cards_${this.activeProfileId}`;
            localStorage.setItem(key, JSON.stringify(this.customCards));
        } catch (e) {
            console.error('localStorage quota exceeded:', e);
            this.showAlert(this.isEn() ? 'Browser memory full. Please check custom cards or export JSON Backup.' : 'ბრაუზერის მეხსიერება გადაივსო. გთხოვთ შეამოწმოთ ბარათები ან გააკეთოთ JSON Backup.', this.isEn() ? 'Memory Quota' : 'მეხსიერების ლიმიტი', '⚠️');
        }
    }

    async loadData() {
        try {
            const res = await fetch('data/cards.json?v=' + Date.now());
            const data = await res.json();
            this.categories = data.categories || [];
            this.starterCards = data.starter_cards || [];
            this.defaultPresetCards = data.cards || [];

            const hiddenCardsKey = `pecs_hidden_cards_${this.activeProfileId}`;
            const hiddenIds = JSON.parse(localStorage.getItem(hiddenCardsKey) || '[]');
            const norm = (s) => (s || '').toString().trim().toLowerCase();
            const cleanId = (id) => (id || '').replace(/^(c_|lib_|board_|board_lib_)/, '');

            this.cards = [...this.defaultPresetCards, ...this.customCards].filter(c => {
                if (!c) return false;
                const baseId = cleanId(c.id);
                const cText = norm(c.text);
                const cTextEn = norm(c.text_en);
                if (hiddenIds.includes(c.id) || hiddenIds.includes(baseId)) return false;
                if (cText && hiddenIds.some(h => norm(h) === cText)) return false;
                if (cTextEn && hiddenIds.some(h => norm(h) === cTextEn)) return false;
                return true;
            });

            // მომხმარებლის მოთხოვნით: ყველა საკუთარი ჩაწერილი ხმის გასუფთავება და მხოლოდ სუფთა Google/AI ნეირონული ხმის გამოყენება
            try {
                localStorage.removeItem('pecs_custom_recordings');
                [...this.starterCards, ...this.cards].forEach(c => {
                    delete c.audioRecord;
                    if (c && (c.id === 'c_tired' || c.id === 'lib_tired' || c.text === 'დავიღალე' || c.spoken === 'დაღლილი')) {
                        c.text = 'დავიღალე';
                        c.spoken = 'დავიღალე';
                    }
                });
            } catch(e) {}
        } catch(e) {
            console.warn('Could not load cards.json', e);
        }
    }

    // ========================================================
    // 4. მარცხენა ფიქსირებული CORE WORDS DOCK
    // ========================================================
    renderCoreDock() {
        const dock = document.getElementById('core-words-dock');
        if (!dock) return;

        const isEn = this.isEn();
        const coreItems = isEn ? [
            { text: "Want", icon: "🤲", type: "verb", spoken: "I want", spoken_en: "I want" },
            { text: "Don't want", icon: "🛑", type: "verb", spoken: "I don't want", spoken_en: "I don't want", extraClass: "core-item-no" },
            { text: "Help", icon: "✋", type: "basic", spoken: "Help me", spoken_en: "Help me" },
            { text: "More", icon: "➕", type: "adjective", spoken: "I want more", spoken_en: "I want more" },
            { text: "Finished", icon: "🙅", type: "basic", spoken: "Finished", spoken_en: "Finished" },
            { text: "Yes", icon: "✅", type: "basic", spoken: "Yes", spoken_en: "Yes", extraClass: "core-item-yes" },
            { text: "No", icon: "❌", type: "basic", spoken: "No", spoken_en: "No", extraClass: "core-item-no" }
        ] : [
            { text: "მინდა", icon: "🤲", type: "verb", spoken: "მინდა" },
            { text: "არ მინდა", icon: "🛑", type: "verb", spoken: "არ მინდა", extraClass: "core-item-no" },
            { text: "დახმარება", icon: "✋", type: "basic", spoken: "დამეხმარე" },
            { text: "კიდევ / მეტი", icon: "➕", type: "adjective", spoken: "კიდევ მინდა" },
            { text: "მორჩა", icon: "🙅", type: "basic", spoken: "მორჩა" },
            { text: "დიახ", icon: "✅", type: "basic", spoken: "დიახ", extraClass: "core-item-yes" },
            { text: "არა", icon: "❌", type: "basic", spoken: "არა", extraClass: "core-item-no" }
        ];

        dock.innerHTML = `
            <div class="core-dock-title">⚡ ${isEn ? 'Core Words' : 'ბირთვი'}</div>
            ${coreItems.map(item => `
                <div class="core-card-item type-${item.type} ${item.extraClass || ''}" 
                     onclick="app.handleCardClick(${JSON.stringify(item).replace(/"/g, '&quot;')})"
                     title="${item.spoken}">
                    <div class="core-icon">${item.icon}</div>
                    <div class="core-text">${item.text}</div>
                </div>
            `).join('')}
        `;

        // Also sync chalkboard persistent quick access core bar (#chalkboard-core-bar)
        const pDont = document.querySelector('.pill-dont-want .cp-text');
        if (pDont) pDont.textContent = isEn ? "Don't want" : "არ მინდა";
        const btnDont = document.querySelector('.pill-dont-want');
        if (btnDont) btnDont.title = isEn ? "Don't want" : "არ მინდა";

        const pHelp = document.querySelector('.pill-help .cp-text');
        if (pHelp) pHelp.textContent = isEn ? "Help" : "დახმარება";
        const btnHelp = document.querySelector('.pill-help');
        if (btnHelp) btnHelp.title = isEn ? "Help me" : "დამეხმარე";

        const pMore = document.querySelector('.pill-more .cp-text');
        if (pMore) pMore.textContent = isEn ? "More" : "კიდევ";
        const btnMore = document.querySelector('.pill-more');
        if (btnMore) btnMore.title = isEn ? "More" : "კიდევ";

        const pFin = document.querySelector('.pill-finished .cp-text');
        if (pFin) pFin.textContent = isEn ? "Finished" : "მორჩა";
        const btnFin = document.querySelector('.pill-finished');
        if (btnFin) btnFin.title = isEn ? "Finished" : "მორჩა";
    }

    renderCategories() {
        const isEn = this.isEn();
        const container = document.getElementById('categories-tabs');
        if (container) {
            container.innerHTML = this.categories.map(cat => `
                <button class="category-tab ${this.activeCategory === cat.id ? 'active' : ''}" 
                        onclick="app.selectCategory('${cat.id}')">
                    <span>${cat.icon}</span>
                    <span>${isEn ? (cat.title_en || cat.title_ka) : cat.title_ka}</span>
                </button>
            `).join('');
        }

        // Also sync Montessori Inlay Category Tabs (#binder-tabs-nav)
        const catMap = {
            basic: isEn ? 'Basic' : 'საბაზისო',
            food: isEn ? 'Food' : 'საჭმელი',
            drinks: isEn ? 'Drinks' : 'სასმელი',
            toys: isEn ? 'Toys' : 'სათამაშო',
            actions: isEn ? 'Actions' : 'მოქმედება',
            feelings: isEn ? 'Emotions' : 'ემოცია',
            all: isEn ? 'All' : 'ყველა'
        };
        document.querySelectorAll('#binder-tabs-nav .montessori-tab-btn').forEach(btn => {
            const cat = btn.getAttribute('data-category');
            if (cat && catMap[cat]) {
                const labelSpan = btn.querySelector('.m-tab-text');
                if (labelSpan) labelSpan.textContent = catMap[cat];
            }
        });
        const tabLibTrigger = document.querySelector('#binder-tabs-nav .tab-library-trigger .m-tab-text');
        if (tabLibTrigger) {
            tabLibTrigger.textContent = isEn ? 'Add' : 'დამატება';
        }
    }

    renderPhaseBanner() {
        const banner = document.getElementById('binder-phase-banner');
        if (!banner) return;

        // Hide for phases 1-3 or when not in AAC mode
        if (this.activePhase < 4 || this.currentMode !== 'aac') {
            banner.style.display = 'none';
            banner.innerHTML = '';
            return;
        }

        const isEn = this.isEn();
        banner.style.display = 'flex';
        banner.className = `binder-phase-banner phase-${this.activePhase}-banner`;

        if (this.activePhase === 4) {
            banner.innerHTML = `
                <div class="bpb-content bpb-content-p4">
                    <div class="bpb-badge bpb-badge-p4">
                        <span class="bpb-badge-icon">🧩</span>
                        <span>${isEn ? 'Phase IV · Sentence Structure' : 'ეტაპი IV · წინადადების სტრუქტურა'}</span>
                    </div>
                    <div class="bpb-text">
                        ${isEn ? 'Build <strong>[I want]</strong> + <strong>[Item]</strong> on the sentence strip, then tap Handover 🤝 to exchange with partner' : 'ააწყვე <strong>[მე მინდა]</strong> + <strong>[სასურველი ნივთი]</strong> ზოლზე, შემდეგ დააჭირე მიწოდებას 🤝 პარტნიორისთვის გადასაცემად'}
                    </div>
                </div>
            `;
        } else if (this.activePhase === 5) {
            banner.innerHTML = `
                <div class="bpb-content bpb-content-p5">
                    <div class="bpb-badge bpb-badge-p5">
                        <span class="bpb-badge-icon">👩‍🏫</span>
                        <span>${isEn ? 'Phase V · Responsive Requesting' : 'ეტაპი V · პასუხი შეკითხვაზე'}</span>
                    </div>
                    <div class="bpb-question-wrap">
                        <span class="bpb-q-label">${isEn ? 'Partner asks:' : 'პარტნიორი გეკითხება:'}</span>
                        <strong class="bpb-q-text">„${isEn ? 'What do you want?' : 'რა გინდა?'}“</strong>
                        <button type="button" class="bpb-listen-btn" onclick="app.speakPartnerQuestion()" title="${isEn ? 'Listen to partner question' : 'მოუსმინე პარტნიორის კითხვას'}">
                            <span class="bpb-listen-icon">🔊</span>
                            <span>${isEn ? 'Listen' : 'მოუსმინე'}</span>
                        </button>
                    </div>
                    <div class="bpb-hint-tag">
                        👉 ${isEn ? 'Respond by tapping [I want] below & choosing your item!' : 'უპასუხე: დააჭირე [მე მინდა] ქვემოთ და აირჩიე ნივთი!'}
                    </div>
                </div>
            `;
        } else if (this.activePhase === 6) {
            banner.innerHTML = `
                <div class="bpb-content bpb-content-p6-shelf">
                    <div class="bpb-starters-shelf">
                        <button type="button" class="bpb-starter-card chip-want" onclick="app.quickAddStarter('starter_want')" title="${isEn ? 'I want' : 'მე მინდა'}">
                            <span class="bsc-icon">🤲</span>
                            <span class="bsc-text">${isEn ? 'I want' : 'მე მინდა'}</span>
                        </button>
                        <button type="button" class="bpb-starter-card chip-see" onclick="app.quickAddStarter('starter_see')" title="${isEn ? 'I see' : 'მე ვხედავ'}">
                            <span class="bsc-icon">👀</span>
                            <span class="bsc-text">${isEn ? 'I see' : 'მე ვხედავ'}</span>
                        </button>
                        <button type="button" class="bpb-starter-card chip-hear" onclick="app.quickAddStarter('starter_hear')" title="${isEn ? 'I hear' : 'მე მესმის'}">
                            <span class="bsc-icon">👂</span>
                            <span class="bsc-text">${isEn ? 'I hear' : 'მე მესმის'}</span>
                        </button>
                        <button type="button" class="bpb-starter-card chip-hurts" onclick="app.quickAddStarter('starter_hurts')" title="${isEn ? 'It hurts' : 'მტკივა'}">
                            <span class="bsc-icon">🩹</span>
                            <span class="bsc-text">${isEn ? 'It hurts' : 'მტკივა'}</span>
                        </button>
                    </div>
                    <div class="bpb-badge bpb-badge-p6">
                        <span class="bpb-badge-icon">👀</span>
                        <span>${isEn ? 'Phase VI · Commenting' : 'ეტაპი VI · კომენტირება'}</span>
                    </div>
                </div>
            `;
        }
    }

    speakPartnerQuestion() {
        const isEn = this.isEn();
        const phrase = isEn ? "What do you want?" : "რა გინდა?";
        if (window.pecsAudio) {
            if (typeof pecsAudio.playTap === 'function') pecsAudio.playTap();
            if (typeof pecsAudio.speakText === 'function') {
                pecsAudio.speakText(phrase);
            } else if (typeof pecsAudio.speak === 'function') {
                pecsAudio.speak(phrase);
            } else if (typeof pecsAudio.speakCardOrText === 'function') {
                pecsAudio.speakCardOrText({ text: phrase, text_en: phrase, spoken: phrase, spoken_en: phrase });
            }
        }
    }

    renderStarters() {
        const isEn = this.isEn();
        const container = document.getElementById('starters-bar');
        if (container) {
            container.innerHTML = this.starterCards.map(s => {
                const label = isEn ? (s.text_en || s.text) : s.text;
                return `
                <button class="starter-btn" onclick="app.quickAddStarter('${s.id}')">
                    <span>${s.icon}</span>
                    <span>${label}</span>
                </button>
                `;
            }).join('');
        }

        // Render dynamic Starters Dock on the sentence strip (#strip-starters-dock)
        const dock = document.getElementById('strip-starters-dock');
        if (dock) {
            if (this.activePhase === 6) {
                // In Phase 6, starters are in the prominent shelf above the strip!
                // So the sentence strip below has maximum space for cards.
                dock.style.display = 'none';
            } else {
                // Phase 4 & 5: Single large tactile "I want" card
                dock.style.display = 'flex';
                dock.className = 'strip-starters-dock dock-phase-standard';
                const wantLabel = isEn ? 'I want' : 'მე მინდა';
                const titleText = (this.activePhase === 5) 
                    ? (isEn ? "Answer 'What do you want?' with 'I want'" : "უპასუხეთ „რა გინდა?“-ს „მე მინდა“-ს დაჭერით")
                    : (isEn ? "Click to add 'I want' starter" : "დააჭირეთ „მე მინდა“ ბარათის დასამატებლად");
                dock.innerHTML = `
                    <button type="button" class="strip-starter-want-btn" onclick="app.quickAddStarter('starter_want')" title="${titleText}">
                        <span class="sw-icon">🤲</span>
                        <span class="sw-text">${wantLabel}</span>
                    </button>
                `;
            }
        }
    }

    selectCategory(catId) {
        this.activeCategory = catId;
        this.boardCurrentPage = 1;
        pecsAudio.playTap();
        this.renderCategories();
        this.renderCardsGrid();
    }

    syncPhaseBadges() {
        const isEn = this.isEn();
        const phaseNamesKa = {
            1: 'ეტაპი I (გაცვლა)',
            2: 'ეტაპი II (მანძილი)',
            3: 'ეტაპი III (გარჩევა)',
            4: 'ეტაპი IV (წინადადება)',
            5: 'ეტაპი V (რა გინდა?)',
            6: 'ეტაპი VI (კომენტირება)'
        };
        const phaseShortKa = {
            1: 'ეტაპი I',
            2: 'ეტაპი II',
            3: 'ეტაპი III',
            4: 'ეტაპი IV',
            5: 'ეტაპი V',
            6: 'ეტაპი VI'
        };
        const phaseNamesEn = {
            1: 'Phase I (Physical)',
            2: 'Phase II (Distance)',
            3: 'Phase III (Discrim.)',
            4: 'Phase IV (Sentence)',
            5: 'Phase V (Responsive)',
            6: 'Phase VI (Comment)'
        };
        const phaseShortEn = {
            1: 'Phase I',
            2: 'Phase II',
            3: 'Phase III',
            4: 'Phase IV',
            5: 'Phase V',
            6: 'Phase VI'
        };

        const phaseNames = isEn ? phaseNamesEn : phaseNamesKa;
        const phaseShort = isEn ? phaseShortEn : phaseShortKa;

        const text = phaseNames[this.activePhase] || (isEn ? `Phase ${this.activePhase}` : `ეტაპი ${this.activePhase}`);
        const shortText = phaseShort[this.activePhase] || (isEn ? `Phase ${this.activePhase}` : `ეტაპი ${this.activePhase}`);

        const headPhaseText = document.getElementById('header-phase-text');
        if (headPhaseText) headPhaseText.textContent = text;
        const headPhaseShort = document.getElementById('header-phase-short');
        if (headPhaseShort) headPhaseShort.textContent = shortText;

        const tbPhaseLabel = document.getElementById('tb-phase-label');
        if (tbPhaseLabel) tbPhaseLabel.textContent = shortText;

        const sel = document.getElementById('active-phase-select');
        if (sel) sel.value = this.activePhase;
    }

    openPhaseSwitcherModal() {
        pecsAudio.playTap();
        const modal = document.getElementById('modal-phase-switcher');
        if (!modal) return;
        modal.classList.add('active');

        document.querySelectorAll('.phase-pick-card').forEach(card => card.classList.remove('active'));
        const activeCard = document.getElementById(`phase-pick-card-${this.activePhase}`);
        if (activeCard) activeCard.classList.add('active');
    }

    openQuickProfileSwitcherModal() {
        if (window.pecsAudio && pecsAudio.playTap) pecsAudio.playTap();
        const modal = document.getElementById('modal-quick-profile-switcher');
        if (!modal) return;
        this.renderQuickProfileList();
        modal.classList.add('active');
    }

    renderQuickProfileList() {
        const list = document.getElementById('quick-profile-list');
        if (!list) return;
        const isEn = this.isEn();
        const profiles = this.profiles || [];

        const phaseNames = {
            1: isEn ? 'Phase I: Single Card' : 'ფაზა I: 1 ბარათი',
            2: isEn ? 'Phase II: Persistence' : 'ფაზა II: გამძლეობა',
            3: isEn ? 'Phase III: Discrimination' : 'ფაზა III: გარჩევა',
            4: isEn ? 'Phase IV: Sentence' : 'ფაზა IV: წინადადება',
            5: isEn ? 'Phase V: Direct Response' : 'ფაზა V: პასუხი',
            6: isEn ? 'Phase VI: Commenting' : 'ფაზა VI: კომენტარი'
        };

        list.innerHTML = profiles.map(p => {
            const isActive = p.id === this.activeProfileId;
            const pName = this.getProfileDisplayName(p, isEn ? 'en' : 'ka');
            const phaseStr = phaseNames[p.phase || 1] || `Phase ${p.phase || 1}`;
            const genderStr = (p.gender === 'female') ? (isEn ? 'Girl' : 'გოგონა') : (isEn ? 'Boy' : 'ბიჭი');

            return `
                <div class="quick-profile-card ${isActive ? 'active' : ''}" onclick="app.switchProfile('${p.id}'); app.closeModal('modal-quick-profile-switcher');">
                    <div class="quick-profile-card-avatar">${p.avatar || '🧒'}</div>
                    <div class="quick-profile-card-info">
                        <div class="quick-profile-card-name">
                            <span>${pName}</span>
                            ${isActive ? `<span class="quick-profile-active-tag">${isEn ? 'ACTIVE' : 'აქტიური'}</span>` : ''}
                        </div>
                        <div class="quick-profile-card-meta">
                            <span>${isEn ? 'Age:' : 'ასაკი:'} <b>${p.age || '-'}</b> ${isEn ? 'yrs' : 'წ.'}</span>
                            <span class="meta-dot">&middot;</span>
                            <span>${genderStr}</span>
                            <span class="meta-dot">&middot;</span>
                            <span class="meta-phase">${phaseStr}</span>
                        </div>
                    </div>
                    <div class="quick-profile-card-status">
                        ${isActive ? '<span class="status-active-check">✓</span>' : `<span class="status-switch-btn">${isEn ? 'Switch' : 'არჩევა'}</span>`}
                    </div>
                </div>
            `;
        }).join('');

        const title = document.getElementById('quick-profile-title');
        if (title) title.textContent = isEn ? 'Select Child Profile' : 'ბავშვის პროფილის არჩევა';
        const subtitle = document.getElementById('quick-profile-subtitle');
        if (subtitle) subtitle.textContent = isEn ? 'Quick switch between learner profiles' : 'მოსწავლის სწრაფი შეცვლა';
        const addTxt = document.getElementById('quick-prof-add-text');
        if (addTxt) addTxt.textContent = isEn ? 'New Child' : 'ახალი ბავშვი';
        const studioTxt = document.getElementById('quick-prof-studio-text');
        if (studioTxt) studioTxt.textContent = isEn ? '🔒 Full Studio Management' : '🔒 სრული მართვა სტუდიაში';
    }

    syncCategoryTabsUI() {
        const cat = this.activeCategory || 'food';
        document.querySelectorAll('.binder-tab-btn').forEach(btn => {
            if (btn.dataset && btn.dataset.category) {
                if (btn.dataset.category === cat) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }

    selectCategoryTab(category) {
        this.activeCategory = category || 'food';
        this.boardCurrentPage = 1;
        pecsAudio.playWoodTap();
        
        // თუ მომხმარებელი კატეგორიას ირჩევს, სრული საკომუნიკაციო ალბომი უნდა ჩანდეს
        if (this.activePhase < 4) {
            this.activePhase = 4;
            const profile = this.getActiveProfile();
            if (profile) {
                profile.phase = 4;
                this.saveProfiles();
            }
            this.syncPhaseBadges();
        }

        const page = document.getElementById('binder-page');
        if (page) {
            page.classList.remove('page-flip-anim');
            void page.offsetWidth; // trigger reflow
            page.classList.add('page-flip-anim');
            setTimeout(() => page.classList.remove('page-flip-anim'), 400);
        }

        this.syncCategoryTabsUI();
        this.renderCardsGrid();
    }

    setActivePhase(phaseNum) {
        this.activePhase = parseInt(phaseNum) || 1;
        this.boardCurrentPage = 1;
        const profile = this.getActiveProfile();
        if (profile) {
            profile.phase = this.activePhase;
            this.saveProfiles();
        }

        this.syncPhaseBadges();
        this.syncCategoryTabsUI();

        pecsAudio.playTap();
        this.renderCardsGrid();
        this.renderPhaseBanner();
        this.renderStarters();
        this.updateSmartPredictions();

        const isEn = this.isEn();
        const phaseMsg = isEn ? `AAC Phase Switched: Phase ${this.activePhase}` : `AAC ეტაპი შეიცვალა: ეტაპი ${this.activePhase}`;
        this.logAbaEvent(phaseMsg, 'phase_switched');

        // Phase 5: Voice the partner question immediately
        if (this.activePhase === 5) {
            setTimeout(() => {
                this.speakPartnerQuestion();
            }, 350);
        }
    }

    renderCardsGrid() {
        const grid = document.getElementById('cards-grid');
        if (!grid) return;

        // სტიმულის დაწყების დროის ინიციალიზაცია (Latency tracking)
        this.stimulusStartTime = Date.now();

        const binderStripWrap = document.getElementById('binder-sentence-strip-wrap');
        const binderTabsNav = document.getElementById('binder-tabs-nav');
        const stripContainer = document.querySelector('.sentence-strip-container');
        const predictionSection = document.getElementById('smart-prediction-container');
        const bottomDock = document.getElementById('aac-bottom-dock');
        const startersBar = document.getElementById('starters-bar');
        const categoriesTabs = document.getElementById('categories-tabs');
        const gridControls = document.querySelector('.grid-controls-bar');
        const dock = document.getElementById('core-words-dock');

        if (stripContainer) stripContainer.style.display = 'none';
        if (predictionSection) predictionSection.style.display = 'none';
        if (bottomDock) bottomDock.style.display = 'none';
        if (dock) dock.style.display = 'none';
        if (startersBar) startersBar.style.display = 'none';
        if (categoriesTabs) categoriesTabs.style.display = 'none';
        if (gridControls) gridControls.style.display = 'none';

        // ========================================================
        // 3. PECS ფაზების ლოგიკა (UI/UX ეკრანზე)
        // ========================================================
        let filtered = [];

        // 🔍 ცარცის დაფის საძიებო ზოლი — მუშაობს ნებისმიერ ეტაპზე და ეძებს დაფაზეც და 160+ ბაზაშიც!
        if (this.searchQuery && this.searchQuery.trim().length > 0) {
            const q = this.searchQuery.toLowerCase().trim();
            const boardMatches = (this.cards || []).filter(c => 
                (c.text && c.text.toLowerCase().includes(q)) || 
                (c.spoken && c.spoken.toLowerCase().includes(q))
            );

            // ასევე მოვძებნოთ ბაზაში (aacLibrary), თუ უკვე დაფაზე არ დევს
            const libMatches = (this.aacLibrary || []).filter(c => 
                ((c.text && c.text.toLowerCase().includes(q)) || 
                (c.spoken && c.spoken.toLowerCase().includes(q))) &&
                !boardMatches.some(bm => (bm.id === c.id || bm.id === 'board_' + c.id || (bm.text && bm.text.toLowerCase() === c.text.toLowerCase())))
            ).map(c => {
                const copy = JSON.parse(JSON.stringify(c));
                copy._fromLibrary = true;
                return copy;
            });

            filtered = [...boardMatches, ...libMatches];
            grid.className = `cards-grid phase-multi-view size-${this.gridSize}`;
        } else if (this.activePhase <= 2) {
            // ფაზა 1-2: მხოლოდ 1 აქტიური სამიზნე ბარათი (დიდი ზომის)
            const targetCard = this.cards.find(c => c.id === this.phaseTargetCardId) || this.cards[0];
            filtered = [targetCard];
            if (binderStripWrap) binderStripWrap.style.display = 'none';
            if (binderTabsNav) binderTabsNav.style.display = 'none';
            grid.className = 'cards-grid phase-1-2-view';
        } else if (this.activePhase === 3) {
            // ფაზა 3: დისკრიმინაცია (სწორედ 2 ბარათი ველკროს ზოლებზე: სამიზნე vs დისტრაქტორი)
            const targetCard = this.cards.find(c => c.id === this.phaseTargetCardId) || this.cards.find(c => c.id === 'c_ball') || this.cards[0];
            const distractorCard = this.cards.find(c => c.id === this.phaseDistractorCardId) || this.cards.find(c => c.id === 'c_socks') || this.cards[1];
            filtered = [targetCard, distractorCard];
            if (binderStripWrap) binderStripWrap.style.display = 'none';
            if (binderTabsNav) binderTabsNav.style.display = 'none';
            grid.className = 'cards-grid phase-3-view';
        } else {
            // ფაზა 4-6: სრული საკომუნიკაციო ალბომი, წინადადების ზოლი, ფერადი ჩანართები
            if (!this.activeCategory) this.activeCategory = 'food';
            filtered = this.cards;
            if (this.activeCategory !== 'all') {
                filtered = this.cards.filter(c => c.category === this.activeCategory);
            }

            if (binderStripWrap && this.currentMode === 'aac') binderStripWrap.style.display = 'flex';
            if (binderTabsNav && this.currentMode === 'aac') binderTabsNav.style.display = 'flex';
            this.syncCategoryTabsUI();
            grid.className = `cards-grid phase-multi-view size-${this.gridSize}`;
        }

        const isDraggablePhase = this.activePhase >= 4;

        if (this.searchQuery && this.searchQuery.trim().length > 0 && filtered.length === 0) {
            const cleanQ = this.searchQuery.trim();
            const safeQ = cleanQ.replace(/"/g, '&quot;').replace(/'/g, "\\'");
            const isKa = this.isKa();
            const isEn = !isKa || (/[a-zA-Z]/.test(cleanQ) && !/[\u10A0-\u10FF]/.test(cleanQ));

            const titleText = isEn 
                ? `Card "${cleanQ}" was not found on board` 
                : `ბარათი „${cleanQ}“ დაფაზე არ მოიძებნა`;
            const descText = isEn
                ? `Would you like to search ARASAAC's 10,000+ online database and add it to the board with one click?`
                : `გსურთ მოძებნოთ ARASAAC-ის 10,000+ ონლაინ ბაზაში და დაამატოთ დაფაზე ერთი დაჭერით?`;
            const btnText = isEn
                ? `🌐 Search "${cleanQ}" in ARASAAC`
                : `🌐 „${cleanQ}“-ს მოძებნა ARASAAC-ში`;

            grid.innerHTML = `
                <div class="board-search-empty-state">
                    <div class="bse-icon">🔍</div>
                    <div class="bse-title">${titleText}</div>
                    <p class="bse-desc">${descText}</p>
                    <button type="button" class="bse-btn-action" onclick="app.openCardLibraryModal('${safeQ}')">
                        ${btnText}
                    </button>
                </div>
            `;
            return;
        }

        let pageCards = filtered;
        const paginationDock = document.getElementById('board-pagination-dock');

        const dims = this.getGridDimensions();
        grid.style.setProperty('--board-cols', dims.cols);
        grid.style.setProperty('--board-rows', dims.rows);
        grid.style.setProperty('--board-gap', dims.gap + 'px');

        if (this.activePhase >= 4 && (!this.searchQuery || this.searchQuery.trim().length === 0)) {
            const perPage = dims.perPage;
            const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

            if (this.boardCurrentPage > totalPages) this.boardCurrentPage = totalPages;
            if (this.boardCurrentPage < 1) this.boardCurrentPage = 1;

            const startIndex = (this.boardCurrentPage - 1) * perPage;
            pageCards = filtered.slice(startIndex, startIndex + perPage);

            this.renderBoardPagination(totalPages);
        } else {
            if (paginationDock) paginationDock.style.display = 'none';
        }

        const cardsHtml = pageCards.map((card, idx) => {
            if (!card) return '';
            const typeClass = `type-${card.type || 'basic'}`;
            const voiceIndicator = card.audioRecord ? `<span class="custom-voice-badge" title="ჩაწერილია დედის ხმა">🎙️</span>` : '';
            
            let iconHtml = `<div class="card-icon">${card.icon || '📌'}</div>`;
            if (card.image) {
                iconHtml = `<img src="${card.image}" class="card-img" alt="${card.text}">`;
            } else if (card.arasaacUrl) {
                iconHtml = `<img src="${card.arasaacUrl}" class="card-img" alt="${card.text}">`;
            }

            const cardJson = JSON.stringify(card).replace(/"/g, '&quot;');
            const dragAttrs = isDraggablePhase ? `draggable="true" ondragstart="app.handleCardDragStart(event, ${cardJson})"` : '';
            const draggableClass = isDraggablePhase ? 'draggable-card' : '';

            const cardTitle = this.isEn() ? (card.text_en || this.translateAbaText(card.text) || card.text) : card.text;
            const isSingleWord = !cardTitle.includes(' ');
            const textClass = isSingleWord ? 'card-text single-word' : 'card-text multi-word';

            const touchAttrs = `onpointerdown="app.handleCardPointerDown(event, ${cardJson})" onpointerup="app.handleCardPointerUp(event)" onpointerleave="app.handleCardPointerCancel(event)" onpointercancel="app.handleCardPointerCancel(event)"`;

            const editBadge = this.isBoardEditMode ? `
                <button type="button" class="card-delete-badge" 
                        onpointerdown="event.stopPropagation()"
                        onmousedown="event.stopPropagation()"
                        onclick="event.stopPropagation(); event.preventDefault(); app.removeCardFromBoard('${card.id}')" 
                        title="${this.isEn() ? 'Delete card' : 'ბარათის წაშლა'}">✕</button>
            ` : '';
            const editClass = this.isBoardEditMode ? 'in-edit-mode' : '';

            return `
                <div class="pecs-card ${typeClass} ${draggableClass} ${editClass}" 
                     id="pecs-card-${card.id || idx}"
                     ${dragAttrs}
                     ${touchAttrs}
                     onclick="app.handleCardClick(${cardJson})">
                    ${editBadge}
                    ${iconHtml}
                    <div class="${textClass}">${cardTitle}</div>
                    ${voiceIndicator}
                </div>
            `;
        }).join('');

        grid.innerHTML = cardsHtml;
        this.renderPhaseBanner();
        this.renderStarters();
    }

    getGridDimensions() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = window.innerWidth <= 640;
        const isTabletPortrait = isPortrait && window.innerWidth <= 1150;

        if (isMobile) {
            // Mobile Phone: 3 columns x 3 rows = 9 cards per page
            return {
                cols: 3,
                rows: 3,
                perPage: 9,
                gap: 8,
                availableW: window.innerWidth,
                availableH: window.innerHeight
            };
        }

        if (isTabletPortrait) {
            // Tablet / iPad Portrait: Adapt grid to vertical orientation
            if (this.gridSize === 'large') {
                return {
                    cols: 4,
                    rows: 4,
                    perPage: 16,
                    gap: 12,
                    availableW: window.innerWidth,
                    availableH: window.innerHeight
                };
            } else if (this.gridSize === 'compact') {
                return {
                    cols: 6,
                    rows: 6,
                    perPage: 36,
                    gap: 8,
                    availableW: window.innerWidth,
                    availableH: window.innerHeight
                };
            } else {
                // საშუალო (Medium - Default)
                return {
                    cols: 5,
                    rows: 5,
                    perPage: 25,
                    gap: 10,
                    availableW: window.innerWidth,
                    availableH: window.innerHeight
                };
            }
        }

        if (this.gridSize === 'large') {
            return {
                cols: 8,
                rows: 3,
                perPage: 24,
                gap: 9,
                availableW: 1200,
                availableH: 340
            };
        } else if (this.gridSize === 'compact') {
            return {
                cols: 13,
                rows: 3,
                perPage: 39,
                gap: 5,
                availableW: 1200,
                availableH: 340
            };
        } else {
            // საშუალო (Medium)
            return {
                cols: 10,
                rows: 3,
                perPage: 30,
                gap: 7,
                availableW: 1200,
                availableH: 340
            };
        }
    }

    getCardsPerPage() {
        return this.getGridDimensions().perPage;
    }

    renderBoardPagination(totalPages) {
        const dock = document.getElementById('board-pagination-dock');
        if (!dock) return;
        
        if (totalPages <= 1) {
            dock.style.display = 'none';
            return;
        }
        
        dock.style.display = 'flex';
        const isEn = this.isEn();
        
        const prevBtn = document.getElementById('bp-btn-prev');
        const nextBtn = document.getElementById('bp-btn-next');
        const pageText = document.getElementById('bp-page-text');
        const prevText = document.getElementById('bp-prev-text');
        const nextText = document.getElementById('bp-next-text');
        
        if (prevBtn) prevBtn.disabled = (this.boardCurrentPage <= 1);
        if (nextBtn) nextBtn.disabled = (this.boardCurrentPage >= totalPages);
        
        if (pageText) {
            pageText.textContent = isEn 
                ? `Page ${this.boardCurrentPage} of ${totalPages}` 
                : `გვერდი ${this.boardCurrentPage} / ${totalPages}`;
        }
        if (prevText) prevText.textContent = isEn ? 'Previous' : 'წინა';
        if (nextText) nextText.textContent = isEn ? 'Next' : 'შემდეგი';
    }

    prevBoardPage() {
        if (this.boardCurrentPage > 1) {
            this.boardCurrentPage--;
            if (window.pecsAudio) pecsAudio.playWoodTap();
            this.animatePageFlip();
            this.renderCardsGrid();
        }
    }

    nextBoardPage() {
        const perPage = this.getCardsPerPage();
        let filtered = this.cards || [];
        if (this.activeCategory && this.activeCategory !== 'all') {
            filtered = filtered.filter(c => c && c.category === this.activeCategory);
        }
        const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
        if (this.boardCurrentPage < totalPages) {
            this.boardCurrentPage++;
            if (window.pecsAudio) pecsAudio.playWoodTap();
            this.animatePageFlip();
            this.renderCardsGrid();
        }
    }

    animatePageFlip() {
        const page = document.getElementById('binder-page');
        if (page) {
            page.classList.remove('page-flip-anim');
            void page.offsetWidth;
            page.classList.add('page-flip-anim');
            setTimeout(() => page.classList.remove('page-flip-anim'), 350);
        }
    }

    initBoardTouchSwipe() {
        const area = document.getElementById('binder-strips-area');
        if (!area || area._swipeInitialized) return;
        area._swipeInitialized = true;
        
        let startX = 0;
        let startY = 0;
        let isTouching = false;
        
        area.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isTouching = true;
            }
        }, { passive: true });
        
        area.addEventListener('touchend', (e) => {
            if (!isTouching) return;
            isTouching = false;
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = endX - startX;
            const diffY = endY - startY;
            
            // If horizontal swipe is distinct and greater than 45px and more horizontal than vertical:
            if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
                if (diffX < 0) {
                    this.nextBoardPage();
                } else {
                    this.prevBoardPage();
                }
            }
        }, { passive: true });
    }

    toggleBoardEditMode() {
        this.isBoardEditMode = !this.isBoardEditMode;
        pecsAudio.playTap();
        const btn = document.getElementById('btn-toggle-board-edit');
        const icon = document.getElementById('btn-edit-mode-icon');
        const text = document.getElementById('btn-edit-mode-text');
        const isEn = this.isEn();
        if (btn) {
            btn.classList.toggle('active', this.isBoardEditMode);
            if (icon) icon.textContent = this.isBoardEditMode ? '✓' : '✏️';
            if (text) text.textContent = this.isBoardEditMode ? (isEn ? 'Done' : 'მზადაა') : (isEn ? 'Edit' : 'მართვა');
        }
        this.renderCardsGrid();
        if (this.isBoardEditMode) {
            this.showToast(isEn ? '✏️ Edit Mode ON: Tap ✕ or tap any card to delete it from the board' : '✏️ რედაქტირება ჩართულია: დააჭირეთ ✕-ს ან თვითონ ბარათს დაფიდან წასაშლელად');
        }
    }

    handleCardPointerDown(e, card) {
        if (this.isBoardEditMode) return;
        if (this.touchDwellTime <= 0) return;
        this.cancelDwell();

        const cardEl = e.currentTarget;
        this.dwellingCardEl = cardEl;
        cardEl.style.setProperty('--dwell-duration', `${this.touchDwellTime}ms`);
        cardEl.classList.add('dwelling');

        this.dwellTimer = setTimeout(() => {
            if (this.dwellingCardEl === cardEl) {
                cardEl.classList.remove('dwelling');
                this.cancelDwell();
                card._dwellApproved = true;
                this.handleCardClick(card);
                setTimeout(() => { delete card._dwellApproved; }, 250);
            }
        }, this.touchDwellTime);
    }

    handleCardPointerUp(e) {
        if (this.touchDwellTime <= 0) return;
        this.cancelDwell();
    }

    handleCardPointerCancel(e) {
        if (this.touchDwellTime <= 0) return;
        this.cancelDwell();
    }

    cancelDwell() {
        if (this.dwellTimer) {
            clearTimeout(this.dwellTimer);
            this.dwellTimer = null;
        }
        if (this.dwellingCardEl) {
            this.dwellingCardEl.classList.remove('dwelling');
            this.dwellingCardEl = null;
        }
    }

    handleCardClick(card) {
        if (window.voxisAI && typeof window.voxisAI.trackCardTapForFatigue === 'function') {
            window.voxisAI.trackCardTapForFatigue();
        }

        if (card && (card.id === 'c_tired' || card.id === 'lib_tired' || card.text === 'დავიღალე' || card.spoken === 'დაღლილი')) {
            card.text = 'დავიღალე';
            card.spoken = 'დავიღალე';
        }
        if (this.isBoardEditMode && card) {
            this.removeCardFromBoard(card.id);
            return;
        }

        // ⏳ თუ შეხების დაყოვნება (Hold-to-Select) გააქტიურებულია, მარტივი კლიკი იგნორირდება
        if (this.touchDwellTime > 0 && !card._dwellApproved) {
            return;
        }

        // 🛑 სპამ-კლიკის / განმეორებითი სწრაფი დაჭერის იგნორირება (Repeat Delay)
        const now = Date.now();
        if (this.touchRepeatDelay > 0 && card && card.id) {
            if (this.lastCardClickedId === card.id && (now - this.lastCardClickTime) < this.touchRepeatDelay) {
                const cardEl = document.getElementById(`pecs-card-${card.id}`);
                if (cardEl) {
                    cardEl.style.transition = 'transform 0.08s ease';
                    cardEl.style.transform = 'scale(0.96)';
                    setTimeout(() => { if (cardEl) cardEl.style.transform = ''; }, 100);
                }
                return;
            }
        }
        this.lastCardClickTime = now;
        this.lastCardClickedId = card ? card.id : null;

        // თუ ბარათი ბიბლიოთეკიდანაა ნაპოვნი და დაფაზე ჯერ არ დევს — დავამატოთ დაფაზე!
        if (card && card._fromLibrary) {
            const cardCopy = JSON.parse(JSON.stringify(card));
            delete cardCopy._fromLibrary;
            cardCopy.id = 'board_' + card.id;
            this.customCards.push(cardCopy);
            this.cards.push(cardCopy);
            this.saveCustomCards();
            card = cardCopy;
        }

        // თუ მომხმარებელი ძიების რეჟიმში იყო ეტაპი 1-2-ში:
        if (this.searchQuery) {
            if (this.activePhase <= 2) {
                this.phaseTargetCardId = card.id;
                const profile = this.getActiveProfile();
                if (profile) {
                    profile.phaseTargetCardId = card.id;
                    this.saveProfiles();
                }
                this.clearBoardSearch();
                this.showToast(this.isEn() ? `✨ Target card updated: "${(card.text_en || card.text)}"` : `✨ სამიზნე ბარათი შეიცვალა: „${card.text}“`);
                pecsAudio.speakCardOrText(card);
                pecsAudio.playWoodTap();
                return;
            }
        }

        // ბარათზე დაჭერისას ყოველთვის დაუყოვნებლივ ისმის მკაფიო ქართული ხმა!
        pecsAudio.stopSequence();
        pecsAudio.speakCardOrText(card);
        pecsAudio.playWoodTap();

        const cardEl = document.getElementById(`pecs-card-${card.id}`);
        if (cardEl) {
            cardEl.classList.remove('pecs-card-tap-pop');
            void cardEl.offsetWidth;
            cardEl.classList.add('pecs-card-tap-pop');
            setTimeout(() => cardEl.classList.remove('pecs-card-tap-pop'), 800);
        }

        if (this.activePhase === 3) {
            const isTarget = (card.id === this.phaseTargetCardId);
            if (isTarget) {
                if (cardEl) {
                    cardEl.classList.remove('pecs-distractor-selected');
                    cardEl.classList.add('pecs-target-selected');
                    setTimeout(() => cardEl.classList.remove('pecs-target-selected'), 1200);
                }
                const logEvent = this.logAbaEvent(card.spoken || card.text, 'phase_3_target_success', 0, this.currentPromptLevel);
                if (this.enablePromptPopup) this.showPromptTaggingOverlay(logEvent);
            } else {
                if (cardEl) {
                    cardEl.classList.remove('pecs-target-selected');
                    cardEl.classList.add('pecs-distractor-selected');
                    setTimeout(() => cardEl.classList.remove('pecs-distractor-selected'), 1200);
                }
                const logEvent = this.logAbaEvent(card.spoken || card.text, 'phase_3_distractor_selected', 0, this.currentPromptLevel);
                if (this.enablePromptPopup) this.showPromptTaggingOverlay(logEvent);
            }
            return;
        }

        if (this.activePhase <= 2) {
            const logEvent = this.logAbaEvent(card.spoken || card.text, `phase_${this.activePhase}`, 0, this.currentPromptLevel);
            if (this.enablePromptPopup) this.showPromptTaggingOverlay(logEvent);
            return;
        }

        // Phase 4-6: ბარათი ასევე ემატება წინადადების ზოლზე
        this.addCardToStrip(card);
        const logEvent = this.logAbaEvent(card.text, `sentence_building`, 0, this.currentPromptLevel);
        if (this.enablePromptPopup) this.showPromptTaggingOverlay(logEvent);
    }

    // ========================================================
    // HTML5 Drag & Drop: ბარათები ➔ წინადადების ზოლი (DragTarget)
    // ========================================================
    handleCardDragStart(event, card) {
        event.dataTransfer.setData('text/plain', JSON.stringify(card));
        event.dataTransfer.effectAllowed = 'copy';
        pecsAudio.playWoodTap();
    }

    handleStripDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        const strip = document.getElementById('sentence-strip');
        if (strip) strip.classList.add('drag-over');
    }

    handleStripDragLeave(event) {
        const strip = document.getElementById('sentence-strip');
        if (strip) strip.classList.remove('drag-over');
    }

    handleStripDrop(event) {
        event.preventDefault();
        const strip = document.getElementById('sentence-strip');
        if (strip) strip.classList.remove('drag-over');

        try {
            const cardData = event.dataTransfer.getData('text/plain');
            if (cardData) {
                const card = JSON.parse(cardData);
                this.addCardToStrip(card);
                pecsAudio.playVelcro();

                const touchTime = Date.now();
                const latencyMs = Math.max(0, touchTime - (this.stimulusStartTime || touchTime));
                const latencySec = (latencyMs / 1000).toFixed(1);
                this.stimulusStartTime = Date.now();

                const logEvent = this.logAbaEvent(card.text, 'drag_drop_strip', latencyMs, 0);
                this.showPromptTaggingOverlay(logEvent, latencySec);
            }
        } catch(e) {
            console.warn('Drop parse error', e);
        }
    }

    addCardToStrip(card) {
        if (!card) return;
        if (card.id === 'c_tired' || card.id === 'lib_tired' || card.text === 'დავიღალე' || card.spoken === 'დაღლილი') {
            card.text = 'დავიღალე';
            card.spoken = 'დავიღალე';
        }
        // Ensure card has English text and spoken when available
        if (!card.text_en || !card.spoken_en) {
            const allPreset = [...(this.cards || []), ...(this.starterCards || [])];
            const found = allPreset.find(c => c.id === card.id || c.text === card.text);
            if (found) {
                if (!card.text_en && found.text_en) card.text_en = found.text_en;
                if (!card.spoken_en && found.spoken_en) card.spoken_en = found.spoken_en;
            } else {
                const fallbackMap = {
                    'მე მინდა': { text_en: 'I want', spoken_en: 'I want' },
                    'არ მინდა': { text_en: "I don't want", spoken_en: "I do not want" },
                    'დახმარება': { text_en: 'Help', spoken_en: 'Help me' },
                    'კიდევ': { text_en: 'More', spoken_en: 'More' },
                    'კიდევ / მეტი': { text_en: 'More', spoken_en: 'More please' },
                    'მორჩა': { text_en: 'Finished', spoken_en: 'All done' },
                    'მე ვხედავ': { text_en: 'I see', spoken_en: 'I see' },
                    'მე მესმის': { text_en: 'I hear', spoken_en: 'I hear' }
                };
                if (fallbackMap[card.text]) {
                    card.text_en = fallbackMap[card.text].text_en;
                    card.spoken_en = fallbackMap[card.text].spoken_en;
                }
            }
        }
        pecsAudio.stopSequence();
        pecsAudio.playVelcro();
        this.sentenceStrip.push(card);
        this.renderSentenceStrip();
    }

    removeCardFromStrip(index) {
        pecsAudio.stopPlayback();
        pecsAudio.playTap();
        this.sentenceStrip.splice(index, 1);
        this.renderSentenceStrip();
    }

    clearSentenceStrip() {
        if (this.sentenceStrip.length === 0) return;
        pecsAudio.stopPlayback();
        pecsAudio.playClear();
        this.sentenceStrip = [];
        this.renderSentenceStrip();
    }

    renderSentenceStrip() {
        const strip = document.getElementById('sentence-strip');
        if (!strip) return;

        if (this.sentenceStrip.length === 0) {
            strip.className = 'sentence-strip empty';
            strip.innerHTML = '';
            return;
        }

        const isEn = this.isEn();
        const fallbackMap = {
            'მე მინდა': 'I want',
            'მინდა': 'I want',
            'არ მინდა': "I don't want",
            'დახმარება': 'Help',
            'კიდევ': 'More',
            'კიდევ / მეტი': 'More',
            'მორჩა': 'Finished',
            'მე ვხედავ': 'I see',
            'მე მესმის': 'I hear'
        };

        strip.className = 'sentence-strip';
        strip.innerHTML = this.sentenceStrip.map((card, idx) => {
            let iconHtml = `<span class="strip-card-icon">${card.icon || '📌'}</span>`;
            if (card.image || card.arasaacUrl) {
                const src = card.image || card.arasaacUrl;
                iconHtml = `<img src="${src}" style="width:42px;height:42px;border-radius:8px;object-fit:contain;" alt="">`;
            }

            let displayText = card.text;
            if (isEn) {
                displayText = card.text_en || this.translateAbaText(card.text) || fallbackMap[card.text] || card.text;
            }

            return `
                <div class="strip-card type-${card.type || 'basic'}" id="strip-card-${idx}" 
                     onclick="app.removeCardFromStrip(${idx})">
                    <span class="remove-badge">✕</span>
                    ${iconHtml}
                    <span class="strip-card-text">${displayText}</span>
                </div>
            `;
        }).join('');

        strip.scrollLeft = strip.scrollWidth;
        this.updateSmartPredictions();
    }

    // ========================================================
    // 🤲 მუდმივი სწრაფი სიტყვები (Core Words) და წინადადების სტარტერი
    // ========================================================
    quickAddStarterWant() {
        this.quickAddStarter('starter_want');
    }

    quickAddStarter(starterId) {
        let found = (this.starterCards || []).find(c => c.id === starterId);
        if (!found) {
            const defaults = {
                starter_want: { id: "starter_want", text: "მე მინდა", text_en: "I want", icon: "🤲", type: "verb", category: "basic", spoken: "მე მინდა", spoken_en: "I want" },
                starter_see: { id: "starter_see", text: "მე ვხედავ", text_en: "I see", icon: "👀", type: "verb", category: "actions", spoken: "მე ვხედავ", spoken_en: "I see" },
                starter_hear: { id: "starter_hear", text: "მე მესმის", text_en: "I hear", icon: "👂", type: "verb", category: "actions", spoken: "მე მესმის", spoken_en: "I hear" },
                starter_hurts: { id: "starter_hurts", text: "მტკივა", text_en: "It hurts", icon: "🩹", type: "social", category: "feelings", spoken: "მტკივა", spoken_en: "It hurts" },
                starter_dont_want: { id: "starter_dont_want", text: "არ მინდა", text_en: "I don't want", icon: "🛑", type: "verb", category: "basic", spoken: "არ მინდა", spoken_en: "I don't want" }
            };
            found = defaults[starterId] || defaults['starter_want'];
        }

        const isStarter = (c) => c && (
            (c.id && c.id.startsWith('starter_')) ||
            c.id === 'c_want' || c.id === 'c_dont_want' ||
            c.text === 'მე მინდა' || c.text === 'მინდა' || c.text === 'არ მინდა' ||
            c.text === 'მე ვხედავ' || c.text === 'მე მესმის' || c.text === 'მტკივა'
        );

        if (this.sentenceStrip.length > 0 && isStarter(this.sentenceStrip[0])) {
            if (this.sentenceStrip[0].id === found.id || this.sentenceStrip[0].text === found.text) {
                pecsAudio.stopSequence();
                pecsAudio.playVelcro();
                pecsAudio.speakCardOrText(found);
                return;
            }
            this.sentenceStrip[0] = found;
        } else {
            this.sentenceStrip.unshift(found);
        }

        pecsAudio.stopSequence();
        pecsAudio.playVelcro();
        pecsAudio.speakCardOrText(found);
        this.renderSentenceStrip();
    }

    quickPickWant() {
        let found = this.cards.find(c => c.id === 'c_want' || c.text === 'მე მინდა') || 
                    this.starterCards.find(c => c.id === 'starter_want' || c.text === 'მე მინდა') || 
                    { id: "c_want", text: "მე მინდა", text_en: "I want", icon: "🤲", type: "verb", category: "basic", spoken: "მე მინდა", spoken_en: "I want" };
        if (!found.text_en) found.text_en = "I want";
        if (!found.spoken_en) found.spoken_en = "I want";
        pecsAudio.speakCardOrText(found);
        pecsAudio.playVelcro();

        if (this.sentenceStrip.length > 0 && (
            this.sentenceStrip[0].id === 'c_dont_want' || 
            this.sentenceStrip[0].id === 'starter_dont_want' || 
            this.sentenceStrip[0].text === 'არ მინდა' || 
            this.sentenceStrip[0].text_en === "I don't want" ||
            this.sentenceStrip[0].text_en === "Don't want"
        )) {
            this.sentenceStrip[0] = found;
            this.renderSentenceStrip();
            return;
        }

        if (this.sentenceStrip.length === 0 || (
            this.sentenceStrip[0].text !== 'მე მინდა' && 
            this.sentenceStrip[0].text !== 'მინდა' && 
            this.sentenceStrip[0].text_en !== 'I want'
        )) {
            this.sentenceStrip.unshift(found);
            this.renderSentenceStrip();
        }
    }

    quickPickDontWant() {
        let found = this.cards.find(c => c.id === 'c_dont_want' || c.text === 'არ მინდა') || 
                    this.starterCards.find(c => c.id === 'starter_dont_want' || c.text === 'არ მინდა') || 
                    { id: "c_dont_want", text: "არ მინდა", text_en: "I don't want", icon: "🛑", type: "verb", category: "basic", spoken: "არ მინდა", spoken_en: "I don't want" };
        if (!found.text_en) found.text_en = "I don't want";
        if (!found.spoken_en) found.spoken_en = "I don't want";
        pecsAudio.speakCardOrText(found);
        pecsAudio.playVelcro();

        if (this.sentenceStrip.length > 0 && (
            this.sentenceStrip[0].id === 'c_want' || 
            this.sentenceStrip[0].id === 'starter_want' || 
            this.sentenceStrip[0].text === 'მე მინდა' || 
            this.sentenceStrip[0].text === 'მინდა' || 
            this.sentenceStrip[0].text_en === 'I want'
        )) {
            this.sentenceStrip[0] = found;
            this.renderSentenceStrip();
            return;
        }

        if (this.sentenceStrip.length === 0 || (
            this.sentenceStrip[0].text !== 'არ მინდა' && 
            this.sentenceStrip[0].text_en !== "I don't want" &&
            this.sentenceStrip[0].text_en !== "Don't want"
        )) {
            this.sentenceStrip.unshift(found);
            this.renderSentenceStrip();
        }
    }

    quickPickHelp() {
        let found = this.cards.find(c => c.id === 'c_help' || c.text === 'დახმარება') || 
                    { id: "c_help", text: "დახმარება", text_en: "Help", icon: "✋", type: "basic", category: "basic", spoken: "დამეხმარე", spoken_en: "Help me" };
        if (!found.text_en) found.text_en = "Help";
        if (!found.spoken_en) found.spoken_en = "Help me";
        pecsAudio.speakCardOrText(found);
        this.addCardToStrip(found);
    }

    quickPickMore() {
        let found = this.cards.find(c => c.id === 'c_more' || c.text.includes('კიდევ')) || 
                    { id: "c_more", text: "კიდევ / მეტი", text_en: "More", icon: "➕", type: "adjective", category: "basic", spoken: "კიდევ მინდა", spoken_en: "More please" };
        if (!found.text_en) found.text_en = "More";
        if (!found.spoken_en) found.spoken_en = "More please";
        pecsAudio.speakCardOrText(found);
        this.addCardToStrip(found);
    }

    quickPickFinished() {
        let found = this.cards.find(c => c.id === 'c_finished' || c.text === 'მორჩა') || 
                    { id: "c_finished", text: "მორჩა", text_en: "Finished", icon: "🙅", type: "basic", category: "basic", spoken: "მორჩა", spoken_en: "All done" };
        if (!found.text_en) found.text_en = "Finished";
        if (!found.spoken_en) found.spoken_en = "All done";
        pecsAudio.speakCardOrText(found);
        this.addCardToStrip(found);
    }

    // ზედა აუდიო ტესტის ღილაკი (100% Bella-ს სუფთა ხმით)
    testHeadSound() {
        const isEn = this.isEn();
        pecsAudio.speak(isEn ? "Hello! I am ready to communicate." : "გამარჯობა! მე მზად ვარ სასაუბროდ.");
    }

    // წინადადების გახმოვანება (ჭკვიანი გრამატიკით / ბარათ-ბარათ 100% Bella)
    speakSentence() {
        const isEn = this.isEn();
        if (this.sentenceStrip.length === 0) {
            pecsAudio.speak(isEn ? "Please select a card" : "გთხოვთ აირჩიოთ ბარათი");
            return;
        }

        const grammarPhrase = this.buildGrammarPhrase(this.sentenceStrip);
        this.logAbaEvent(grammarPhrase, 'sentence_strip');

        const speakBtn = document.getElementById('btn-speak');
        if (speakBtn) speakBtn.style.transform = 'scale(0.95)';

        // ბარათ-ბარათ თანმიმდევრული განათება და გახმოვანება (სუფთა Bella MP3 ფაილებით)
        pecsAudio.speakSequence(this.sentenceStrip, (highlightIdx) => {
            this.sentenceStrip.forEach((_, idx) => {
                const el = document.getElementById(`strip-card-${idx}`);
                if (el) el.classList.toggle('speaking-now', idx === highlightIdx);
            });
        }, () => {
            this.sentenceStrip.forEach((_, idx) => {
                const el = document.getElementById(`strip-card-${idx}`);
                if (el) el.classList.remove('speaking-now');
            });
            if (speakBtn) speakBtn.style.transform = 'none';
            setTimeout(() => pecsAudio.playSuccess(), 200);
        });
    }

    // ========================================================
    // 5a. 🤝 ფაზა 1-2 ერთეული ბარათის გადაცემის ანიმაცია (Single Card Handover)
    // ========================================================
    handoverSingleCard(card) {
        const isEn = this.isEn();
        if (!card) card = this.cards.find(c => c.id === this.phaseTargetCardId) || this.cards[0];
        if (!card) return;

        pecsAudio.playVelcro();
        const cardText = isEn ? (card.text_en || card.text) : card.text;
        this.logAbaEvent(cardText, `phase_${this.activePhase}_handover`);

        const overlay = document.getElementById('handover-overlay');
        const visual = document.getElementById('handover-strip-content');
        const textPrompt = document.getElementById('handover-partner-response');

        if (!overlay || !visual || !textPrompt) return;

        let imgOrIcon = `<span class="h-card-icon">${card.icon || '📌'}</span>`;
        if (card.image) {
            imgOrIcon = `<img src="${card.image}" class="h-card-img" alt="${card.text}">`;
        } else if (card.arasaacUrl) {
            imgOrIcon = `<img src="${card.arasaacUrl}" class="h-card-img" alt="${card.text}">`;
        }

        visual.innerHTML = `
            <div class="handover-strip-card" style="transform: scale(1.15); box-shadow: 0 10px 25px rgba(0,0,0,0.18); border-color: #0D9488;">
                ${imgOrIcon}
                <span class="h-card-text" style="font-size: 18px; font-weight: 900;">${cardText}</span>
            </div>
        `;

        textPrompt.innerHTML = isEn ? 
            `<span class="h-prompt-intro">Phase ${this.activePhase} Single-Card Exchange: Child hands over card</span> <strong class="h-phrase-glow">"${cardText}"</strong>` : 
            `<span class="h-prompt-intro">ეტაპი ${this.activePhase} ფიზიკური გაცვლა: ბავშვი გაწვდის ბარათს</span> <strong class="h-phrase-glow">„${cardText}“</strong>`;
        overlay.classList.add('active');

        setTimeout(() => {
            pecsAudio.speakCardOrText(card);
            setTimeout(() => {
                pecsAudio.playSuccess();
                textPrompt.innerHTML = isEn ? 
                    `🎉 <strong>Communication Partner received card!</strong><br><span style="font-size:14px; font-weight:700;">"Thank you! Here you go: <span style="color:#065F46; text-decoration:underline;">${cardText}</span>! Great job!"</span>` :
                    `🎉 <strong>პარტნიორმა მიიღო ბარათი!</strong><br><span style="font-size:14px; font-weight:700;">„მადლობა! აი ინებე: <span style="color:#065F46; text-decoration:underline;">${cardText}</span>! ყოჩაღ!“</span>`;
                setTimeout(() => {
                    overlay.classList.remove('active');
                }, 2600);
            }, 600);
        }, 400);
    }

    // ========================================================
    // 5. 🤝 წინადადების ზოლის გადაცემის ანიმაცია (Handover)
    // ========================================================
    handoverSentenceStrip() {
        const isEn = this.isEn();
        if (this.sentenceStrip.length === 0) {
            pecsAudio.speak(isEn ? "Build a sentence first to hand over" : "ჯერ ააწყვეთ წინადადება გადასაცემად");
            return;
        }

        pecsAudio.playVelcro();
        const phrase = this.buildGrammarPhrase(this.sentenceStrip);
        this.logAbaEvent(phrase, 'handover_exchange');

        const overlay = document.getElementById('handover-overlay');
        const visual = document.getElementById('handover-strip-content');
        const textPrompt = document.getElementById('handover-partner-response');

        const fallbackMap = {
            'მე მინდა': 'I want',
            'არ მინდა': "I don't want",
            'დახმარება': 'Help',
            'კიდევ': 'More',
            'კიდევ / მეტი': 'More',
            'მორჩა': 'Finished',
            'მე ვხედავ': 'I see',
            'მე მესმის': 'I hear'
        };

        visual.innerHTML = this.sentenceStrip.map(card => {
            let imgOrIcon = `<span class="h-card-icon">${card.icon || '📌'}</span>`;
            if (card.image) {
                imgOrIcon = `<img src="${card.image}" class="h-card-img" alt="${card.text}">`;
            } else if (card.arasaacUrl) {
                imgOrIcon = `<img src="${card.arasaacUrl}" class="h-card-img" alt="${card.text}">`;
            }
            const label = isEn ? (card.text_en || fallbackMap[card.text] || card.text) : card.text;
            return `
                <div class="handover-strip-card">
                    ${imgOrIcon}
                    <span class="h-card-text">${label}</span>
                </div>
            `;
        }).join('');

        textPrompt.innerHTML = isEn ? 
            `<span class="h-prompt-intro">Child hands over strip:</span> <strong class="h-phrase-glow">"${phrase}"</strong>` : 
            `<span class="h-prompt-intro">ბავშვი გაწვდის ზოლს:</span> <strong class="h-phrase-glow">„${phrase}“</strong>`;
        overlay.classList.add('active');

        // წაკითხვა (ბარათ-ბარათ სუფთა Bella ხმით)
        setTimeout(() => {
            pecsAudio.speakSequence(this.sentenceStrip, null, () => {
                setTimeout(() => {
                    pecsAudio.playSuccess();
                    const lastCard = this.sentenceStrip[this.sentenceStrip.length - 1];
                    const lastCardText = isEn ? (lastCard.text_en || fallbackMap[lastCard.text] || lastCard.text) : lastCard.text;
                    textPrompt.innerHTML = isEn ? 
                        `🎉 <strong>Communication Partner received strip!</strong><br><span style="font-size:14px; font-weight:700;">"Thank you! Here you go: <span style="color:#065F46; text-decoration:underline;">${lastCardText}</span>! Great job!"</span>` :
                        `🎉 <strong>პარტნიორმა მიიღო ბარათი!</strong><br><span style="font-size:14px; font-weight:700;">„მადლობა! აი ინებე: <span style="color:#065F46; text-decoration:underline;">${lastCardText}</span>! ყოჩაღ!“</span>`;
                    setTimeout(() => {
                        overlay.classList.remove('active');
                        this.clearSentenceStrip();
                    }, 2800);
                }, 400);
            });
        }, 500);
    }

    // ========================================================
    // 6. FIRST-THEN (პირველად ➔ შემდეგ) რუტინის დაფა & AI გენერატორი
    // ========================================================
    openFirstThenSetup() {
        pecsAudio.playTap();
        const modal = document.getElementById('modal-first-then-setup');
        if (!modal) return;

        const isKa = this.isKa();
        
        // Update labels for language
        const modalTitle = document.getElementById('ft-modal-title');
        const modalSub = document.getElementById('ft-modal-subtitle');
        const tabAi = document.getElementById('ft-tab-ai');
        const tabPresets = document.getElementById('ft-tab-presets');
        const inputLabel = document.getElementById('ft-ai-input-label');
        const inputArea = document.getElementById('ft-ai-input');
        const chipsLabel = document.getElementById('ft-chips-label');
        const btnGen = document.getElementById('btn-ft-generate');

        if (modalTitle) modalTitle.innerText = isKa ? "First-Then რუტინის შექმნა" : "First-Then Routine Creator";
        if (modalSub) modalSub.innerText = isKa ? "პრემაკის პრინციპი: დავალება ➔ წამახალისებელი ჯილდო" : "Premack Principle: Demand Task ➔ Positive Reinforcer";
        if (tabAi) tabAi.innerText = isKa ? "✨ AI გენერატორი (Nemotron)" : "✨ AI Generator (Nemotron)";
        if (tabPresets) tabPresets.innerText = isKa ? "⚡ სწრაფი შაბლონები" : "⚡ Quick Presets";
        if (inputLabel) inputLabel.innerText = isKa ? "მშობლის ან თერაპევტის მოთხოვნა თავისუფალი ტექსტით:" : "Parent or Therapist Routine Request:";
        if (inputArea) inputArea.placeholder = isKa ? "მაგ. საშინაო დავალება და მერე ველოსიპედით სეირნობა..." : "e.g. Finish homework and then ride bicycle...";
        if (chipsLabel) chipsLabel.innerText = isKa ? "💡 სწრაფი წინადადებები (დააჭირეთ ჩასასმელად):" : "💡 Quick suggestions (Click to insert):";
        if (btnGen) btnGen.innerText = isKa ? "✨ AI დაგენერირება (Nemotron)" : "✨ Generate with Nemotron AI";

        // Render localized chips and presets list
        this.renderFirstThenSetupContent(isKa);

        const statusEl = document.getElementById('ft-ai-loading-status');
        if (statusEl) statusEl.innerText = '';

        modal.classList.add('active');
        if (inputArea) inputArea.focus();
    }

    renderFirstThenSetupContent(isKa) {
        const chipsContainer = document.getElementById('ft-prompt-chips');
        if (chipsContainer) {
            const chips = [
                {
                    text: isKa ? "🍽️ სადილი ➔ 🌳 ეზო" : "🍽️ Lunch ➔ 🌳 Playground",
                    prompt: isKa ? "სადილი ჭამოს და მერე ეზოში გავიდეს" : "Eat lunch and then go to playground"
                },
                {
                    text: isKa ? "📚 დავალება ➔ 🚲 ველოსიპედი" : "📚 Homework ➔ 🚲 Bicycle",
                    prompt: isKa ? "საშინაო დავალება და მერე ველოსიპედით სეირნობა" : "Finish homework and then ride bicycle"
                },
                {
                    text: isKa ? "🧼 დაბანა ➔ 🧃 წვენი" : "🧼 Wash ➔ 🧃 Juice",
                    prompt: isKa ? "ხელების დაბანა და მერე წვენის დალევა" : "Wash hands and then drink juice"
                },
                {
                    text: isKa ? "🧹 დალაგება ➔ 📺 მულტფილმი" : "🧹 Tidy ➔ 📺 Cartoons",
                    prompt: isKa ? "ოთახის დალაგება და მერე მულტფილმის ყურება" : "Tidy room and then watch cartoons"
                },
                {
                    text: isKa ? "🪥 კბილები ➔ 🛌 ძილი" : "🪥 Teeth ➔ 🛌 Bedtime",
                    prompt: isKa ? "კბილების გახეხვა და მერე ძილი" : "Brush teeth and then go to sleep"
                }
            ];
            chipsContainer.innerHTML = chips.map(c => 
                `<button type="button" class="ft-chip" onclick="app.setFtAiInput('${c.prompt.replace(/'/g, "\\'")}')">${c.text}</button>`
            ).join('');
        }

        const presetsContainer = document.getElementById('ft-presets-grid');
        if (presetsContainer) {
            const presetsList = [
                {
                    key: 'eat_play',
                    i1: '🍽️', i2: '⚽',
                    title: isKa ? 'სადილი ➔ ბურთით თამაში' : 'Eat Meal ➔ Play Outside',
                    desc: isKa ? 'სადილის ჭამა და ეზოში თამაში' : 'Finish meal and play with ball'
                },
                {
                    key: 'study_bike',
                    i1: '📚', i2: '🚲',
                    title: isKa ? 'დავალება ➔ ველოსიპედი' : 'Homework ➔ Bicycle Ride',
                    desc: isKa ? 'საშინაო დავალება და ველოსიპედი' : 'Do homework and ride bicycle'
                },
                {
                    key: 'wash_snack',
                    i1: '🧼', i2: '🍪',
                    title: isKa ? 'ხელების დაბანა ➔ წახემსება' : 'Wash Hands ➔ Snack Time',
                    desc: isKa ? 'ხელების დაბანა და ორცხობილა' : 'Wash hands clean and enjoy snack'
                },
                {
                    key: 'clean_cartoon',
                    i1: '🧹', i2: '📺',
                    title: isKa ? 'დალაგება ➔ მულტფილმი' : 'Tidy Room ➔ Cartoons',
                    desc: isKa ? 'ოთახის დალაგება და მულტფილმი' : 'Clean room and watch cartoons'
                },
                {
                    key: 'teeth_sleep',
                    i1: '🪥', i2: '🛏️',
                    title: isKa ? 'კბილები ➔ ძილი' : 'Brush Teeth ➔ Bedtime',
                    desc: isKa ? 'კბილების გახეხვა და ძილი' : 'Brush teeth and get ready for sleep'
                },
                {
                    key: 'dress_car',
                    i1: '👕', i2: '🚗',
                    title: isKa ? 'ჩაცმა ➔ მანქანით გასეირნება' : 'Get Dressed ➔ Car Trip',
                    desc: isKa ? 'ტანსაცმლის ჩაცმა და გასეირნება' : 'Put on clothes and go for a drive'
                }
            ];
            presetsContainer.innerHTML = presetsList.map(p => `
                <div class="ft-preset-card" onclick="app.launchFirstThenPreset('${p.key}')">
                    <div class="ft-preset-icons">
                        <span class="p-icon first">${p.i1}</span>
                        <span class="p-arrow">➔</span>
                        <span class="p-icon then">${p.i2}</span>
                    </div>
                    <div class="ft-preset-title">${p.title}</div>
                    <div class="ft-preset-desc">${p.desc}</div>
                </div>
            `).join('');
        }
    }

    closeFirstThenSetup() {
        this.closeModal('modal-first-then-setup');
    }

    switchFtSetupTab(tabName) {
        pecsAudio.playTap();
        const tabAi = document.getElementById('ft-tab-ai');
        const tabPresets = document.getElementById('ft-tab-presets');
        const panelAi = document.getElementById('ft-panel-ai');
        const panelPresets = document.getElementById('ft-panel-presets');

        if (tabName === 'ai') {
            if (tabAi) tabAi.classList.add('active');
            if (tabPresets) tabPresets.classList.remove('active');
            if (panelAi) { panelAi.style.display = 'block'; panelAi.classList.add('active'); }
            if (panelPresets) { panelPresets.style.display = 'none'; panelPresets.classList.remove('active'); }
        } else {
            if (tabPresets) tabPresets.classList.add('active');
            if (tabAi) tabAi.classList.remove('active');
            if (panelPresets) { panelPresets.style.display = 'block'; panelPresets.classList.add('active'); }
            if (panelAi) { panelAi.style.display = 'none'; panelAi.classList.remove('active'); }
        }
    }

    setFtAiInput(text) {
        pecsAudio.playTap();
        const inputArea = document.getElementById('ft-ai-input');
        if (inputArea) {
            inputArea.value = text;
            inputArea.focus();
        }
    }

    async generateFirstThenWithAI() {
        const inputArea = document.getElementById('ft-ai-input');
        const text = inputArea ? inputArea.value.trim() : '';
        const statusEl = document.getElementById('ft-ai-loading-status');
        const btnGen = document.getElementById('btn-ft-generate');

        if (!text) {
            this.showAlert(this.isEn() ? "Please enter a routine text" : "გთხოვთ ჩაწეროთ რუტინის ტექსტი", "ინფორმაცია", "ℹ️");
            if (inputArea) inputArea.focus();
            return;
        }

        const isKa = !this.isEn();
        if (statusEl) {
            statusEl.innerText = isKa ? "✨ NVIDIA Nemotron აანალიზებს რუტინას..." : "✨ NVIDIA Nemotron analyzing routine...";
            statusEl.style.color = "#2563EB";
        }
        if (btnGen) btnGen.disabled = true;

        try {
            const resp = await fetch('api/ai.php?action=generate_first_then', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    childName: this.currentProfile?.name || 'Alex',
                    lang: isKa ? 'ka' : 'en'
                })
            });

            const data = await resp.json();
            if (data && data.success && data.routine) {
                this.closeFirstThenSetup();
                this.launchFirstThenRoutine(data.routine, data.source || 'NVIDIA Nemotron Nano');
            } else {
                throw new Error(data.message || 'Error decomposing routine');
            }
        } catch (err) {
            console.error('First-Then AI error:', err);
            // Fallback locally if network error
            const fallbackRoutine = {
                first: { text: text.split(/[➔\->,]|და\s+მერე|მერე|\bthen\b/i)[0]?.trim() || (isKa ? "სადილის ჭამა" : "Eat Meal"), icon: "🍽️", color: "#3B82F6", type: "demand" },
                then: { text: text.split(/[➔\->,]|და\s+მერე|მერე|\bthen\b/i)[1]?.trim() || (isKa ? "ველოსიპედით სეირნობა" : "Ride Bicycle"), icon: "🚲", color: "#10B981", type: "reward" },
                praise: isKa ? "ყოჩაღ! პირველი ნაბიჯი მზადაა, ახლა დროა ვითამაშოთ!" : "Awesome! Step one complete, now time to play!"
            };
            this.closeFirstThenSetup();
            this.launchFirstThenRoutine(fallbackRoutine, 'Voxis Engine (Local)');
        } finally {
            if (btnGen) btnGen.disabled = false;
            if (statusEl) statusEl.innerText = '';
        }
    }

    getFirstThenPresetData(presetKey, isKa) {
        const presets = {
            'eat_play': {
                _presetKey: 'eat_play',
                first: { 
                    text: isKa ? "სადილის ჭამა" : "Eat Meal", 
                    icon: "🍽️",
                    timerMinutes: 5,
                    substeps: [
                        { text: isKa ? "მაგიდასთან დაჯდომა" : "Sit at table", icon: "🪑" },
                        { text: isKa ? "საჭმლის ჭამა" : "Eat meal", icon: "🍽️" },
                        { text: isKa ? "თეფშის ალაგება" : "Clear plate", icon: "✨" }
                    ]
                },
                then: { 
                    text: isKa ? "ბურთით თამაში" : "Play Outside", 
                    icon: "⚽",
                    rewardOptions: [
                        { text: isKa ? "ბურთით თამაში" : "Play Outside", icon: "⚽" },
                        { text: isKa ? "ველოსიპედით სეირნობა" : "Bicycle Ride", icon: "🚲" },
                        { text: isKa ? "მულტფილმის ყურება" : "Watch Cartoons", icon: "📺" }
                    ]
                },
                praise: isKa ? "ყოჩაღ! სადილი მიირთვი, ახლა დროა ბურთით ვითამაშოთ!" : "Great job eating your meal! Now let's play outside!"
            },
            'study_bike': {
                _presetKey: 'study_bike',
                first: { 
                    text: isKa ? "საშინაო დავალება" : "Homework", 
                    icon: "📚",
                    timerMinutes: 5,
                    substeps: [
                        { text: isKa ? "რვეულის გადაშლა" : "Open notebook", icon: "📖" },
                        { text: isKa ? "დავალების დაწერა" : "Solve homework", icon: "✏️" },
                        { text: isKa ? "ჩანთაში ჩადება" : "Pack bag", icon: "🎒" }
                    ]
                },
                then: { 
                    text: isKa ? "ველოსიპედით სეირნობა" : "Bicycle Ride", 
                    icon: "🚲",
                    rewardOptions: [
                        { text: isKa ? "ველოსიპედით სეირნობა" : "Bicycle Ride", icon: "🚲" },
                        { text: isKa ? "ლეგოთი აწყობა" : "Lego Building", icon: "🧱" },
                        { text: isKa ? "პლანშეტით თამაში" : "Tablet Time", icon: "📱" }
                    ]
                },
                praise: isKa ? "ყოჩაღ! დავალება მზადაა, ახლა დროა ველოსიპედით ვისეირნოთ!" : "Awesome! Homework is done, time to ride your bicycle!"
            },
            'wash_snack': {
                _presetKey: 'wash_snack',
                first: { 
                    text: isKa ? "ხელების დაბანა" : "Wash Hands", 
                    icon: "🧼",
                    timerMinutes: 2,
                    substeps: [
                        { text: isKa ? "წყლის მოშვება" : "Turn on water", icon: "🚰" },
                        { text: isKa ? "საპნით დაბანა" : "Soap hands", icon: "🧼" },
                        { text: isKa ? "პირსახოცით გამშრალება" : "Dry hands", icon: "🧖" }
                    ]
                },
                then: { 
                    text: isKa ? "წახემსება / ორცხობილა" : "Snack / Cookie", 
                    icon: "🍪",
                    rewardOptions: [
                        { text: isKa ? "წახემსება / ორცხობილა" : "Snack / Cookie", icon: "🍪" },
                        { text: isKa ? "წვენის დალევა" : "Drink Juice", icon: "🧃" },
                        { text: isKa ? "ნაყინის მირთმევა" : "Ice Cream", icon: "🍦" }
                    ]
                },
                praise: isKa ? "ყოჩაღ! ხელები სუფთაა, ახლა დროა გემრიელად წავიხემსოთ!" : "Super clean hands! Now time for a delicious snack!"
            },
            'clean_cartoon': {
                _presetKey: 'clean_cartoon',
                first: { 
                    text: isKa ? "ოთახის დალაგება" : "Tidy Room", 
                    icon: "🧹",
                    timerMinutes: 5,
                    substeps: [
                        { text: isKa ? "სათამაშოების აკრეფა" : "Put toys away", icon: "🧸" },
                        { text: isKa ? "წიგნების დალაგება" : "Stack books", icon: "📚" },
                        { text: isKa ? "ოთახი მზადაა" : "All clean!", icon: "✨" }
                    ]
                },
                then: { 
                    text: isKa ? "მულტფილმის ყურება" : "Watch Cartoons", 
                    icon: "📺",
                    rewardOptions: [
                        { text: isKa ? "მულტფილმის ყურება" : "Watch Cartoons", icon: "📺" },
                        { text: isKa ? "ბურთით თამაში" : "Play Outside", icon: "⚽" },
                        { text: isKa ? "მანქანებით თამაში" : "Toy Cars", icon: "🚗" }
                    ]
                },
                praise: isKa ? "ყოჩაღ! ოთახი დალაგებულია, ახლა დროა მულტფილმს ვუყუროთ!" : "Room is tidy and clean! Now it's cartoon time!"
            },
            'teeth_sleep': {
                _presetKey: 'teeth_sleep',
                first: { 
                    text: isKa ? "კბილების გახეხვა" : "Brush Teeth", 
                    icon: "🪥",
                    timerMinutes: 2,
                    substeps: [
                        { text: isKa ? "პასტის წასმა" : "Toothpaste on brush", icon: "🪥" },
                        { text: isKa ? "კბილების გახეხვა" : "Brush clean", icon: "✨" },
                        { text: isKa ? "პირის გამორეცხვა" : "Rinse mouth", icon: "💧" }
                    ]
                },
                then: { 
                    text: isKa ? "დასვენება და ძილი" : "Bedtime & Sleep", 
                    icon: "🛏️",
                    rewardOptions: [
                        { text: isKa ? "დასვენება და ძილი" : "Bedtime & Sleep", icon: "🛏️" },
                        { text: isKa ? "ზღაპრის მოსმენა" : "Listen to Bedtime Story", icon: "📖" },
                        { text: isKa ? "ჩახუტება" : "Warm Hug", icon: "🫂" }
                    ]
                },
                praise: isKa ? "ყოჩაღ! კბილები გახეხილია, ახლა დროა დავისვენოთ და დავიძინოთ!" : "Shiny clean teeth! Time for sweet dreams and rest!"
            },
            'dress_car': {
                _presetKey: 'dress_car',
                first: { 
                    text: isKa ? "ტანსაცმლის ჩაცმა" : "Get Dressed", 
                    icon: "👕",
                    timerMinutes: 3,
                    substeps: [
                        { text: isKa ? "მაისურის ჩაცმა" : "Put on shirt", icon: "👕" },
                        { text: isKa ? "შარვლის ჩაცმა" : "Put on pants", icon: "👖" },
                        { text: isKa ? "ფეხსაცმელი" : "Put on shoes", icon: "👟" }
                    ]
                },
                then: { 
                    text: isKa ? "მანქანით გასეირნება" : "Car Trip", 
                    icon: "🚗",
                    rewardOptions: [
                        { text: isKa ? "მანქანით გასეირნება" : "Car Trip", icon: "🚗" },
                        { text: isKa ? "პარკში გასეირნება" : "Walk in park", icon: "🌲" },
                        { text: isKa ? "სათამაშო" : "Favorite toy", icon: "🧸" }
                    ]
                },
                praise: isKa ? "ყოჩაღ! ჩაცმული ხარ, ახლა დროა მანქანით გავისეირნოთ!" : "Great job getting dressed! Let's go for a fun drive!"
            }
        };

        const template = presets[presetKey] || presets['eat_play'];
        return JSON.parse(JSON.stringify(template));
    }

    launchFirstThenPreset(presetKey) {
        const isKa = this.isKa();
        const routine = this.getFirstThenPresetData(presetKey, isKa);
        routine._presetKey = presetKey;
        this.closeFirstThenSetup();
        this.launchFirstThenRoutine(routine, isKa ? 'შაბლონური რუტინა' : 'Preset Routine');
    }

    translateFtText(str, isEn) {
        if (!str || typeof str !== 'string') return str;
        const trimmed = str.trim();
        const kaToEn = {
            'სადილის ჭამა': 'Eat Meal',
            'სადილი': 'Eat Meal',
            'ბურთით თამაში': 'Play Outside',
            'საშინაო დავალება': 'Homework',
            'დავალება': 'Homework',
            'ველოსიპედით სეირნობა': 'Bicycle Ride',
            'ხელების დაბანა': 'Wash Hands',
            'დაბანა': 'Wash Hands',
            'წახემსება / ორცხობილა': 'Snack / Cookie',
            'წახემსება': 'Snack Time',
            'ორცხობილა': 'Cookie',
            'ოთახის დალაგება': 'Tidy Room',
            'დალაგება': 'Tidy Room',
            'მულტფილმის ყურება': 'Watch Cartoons',
            'მულტფილმი': 'Cartoons',
            'კბილების გახეხვა': 'Brush Teeth',
            'კბილები': 'Brush Teeth',
            'დასვენება და ძილი': 'Bedtime & Sleep',
            'ძილი': 'Sleep',
            'ტანსაცმლის ჩაცმა': 'Get Dressed',
            'ჩაცმა': 'Get Dressed',
            'მანქანით გასეირნება': 'Car Trip',
            'ეზოში თამაში': 'Play Outside',
            'ეზო': 'Playground',
            'ლეგოთი აწყობა': 'Lego Building',
            'პლანშეტით თამაში': 'Tablet Time',
            'წვენის დალევა': 'Drink Juice',
            'წვენი': 'Juice',
            'ნაყინის მირთმევა': 'Ice Cream',
            'მანქანებით თამაში': 'Toy Cars',
            'ზღაპრის მოსმენა': 'Listen to Story',
            'ჩახუტება': 'Warm Hug',
            'პარკში გასეირნება': 'Walk in Park',
            'სათამაშო': 'Favorite Toy',
            'მაგიდასთან დაჯდომა': 'Sit at table',
            'საჭმლის ჭამა': 'Eat meal',
            'თეფშის ალაგება': 'Clear plate',
            'რვეულის გადაშლა': 'Open notebook',
            'დავალების დაწერა': 'Solve homework',
            'ჩანთაში ჩადება': 'Pack bag',
            'წყლის მოშვება': 'Turn on water',
            'საპნით დაბანა': 'Soap hands',
            'პირსახოცით გამშრალება': 'Dry hands',
            'სათამაშოების აკრეფა': 'Put toys away',
            'წიგნების დალაგება': 'Stack books',
            'ოთახი მზადაა': 'All clean!',
            'პასტის წასმა': 'Toothpaste on brush',
            'პირის გამორეცხვა': 'Rinse mouth',
            'მაისურის ჩაცმა': 'Put on shirt',
            'შარვლის ჩაცმა': 'Put on pants',
            'ფეხსაცმელი': 'Put on shoes',
            'პირველი ნაბიჯი': 'First Step',
            'მეორე ნაბიჯი': 'Second Step'
        };

        const enToKa = {
            'Eat Meal': 'სადილის ჭამა',
            'Meal': 'სადილი',
            'Play Outside': 'ბურთით თამაში',
            'Homework': 'საშინაო დავალება',
            'Bicycle Ride': 'ველოსიპედით სეირნობა',
            'Bicycle': 'ველოსიპედი',
            'Wash Hands': 'ხელების დაბანა',
            'Snack / Cookie': 'წახემსება / ორცხობილა',
            'Snack Time': 'წახემსება',
            'Snack': 'წახემსება',
            'Cookie': 'ორცხობილა',
            'Tidy Room': 'ოთახის დალაგება',
            'Cartoons': 'მულტფილმი',
            'Watch Cartoons': 'მულტფილმის ყურება',
            'Brush Teeth': 'კბილების გახეხვა',
            'Bedtime & Sleep': 'დასვენება და ძილი',
            'Sleep': 'ძილი',
            'Get Dressed': 'ტანსაცმლის ჩაცმა',
            'Car Trip': 'მანქანით გასეირნება',
            'Play in Yard': 'ეზოში თამაში',
            'Playground': 'ეზო',
            'Lego Building': 'ლეგოთი აწყობა',
            'Tablet Time': 'პლანშეტით თამაში',
            'Drink Juice': 'წვენის დალევა',
            'Juice': 'წვენი',
            'Ice Cream': 'ნაყინის მირთმევა',
            'Toy Cars': 'მანქანებით თამაში',
            'Listen to Story': 'ზღაპრის მოსმენა',
            'Warm Hug': 'ჩახუტება',
            'Walk in Park': 'პარკში გასეირნება',
            'Favorite Toy': 'სათამაშო',
            'Sit at table': 'მაგიდასთან დაჯდომა',
            'Eat meal': 'საჭმლის ჭამა',
            'Clear plate': 'თეფშის ალაგება',
            'Open notebook': 'რვეულის გადაშლა',
            'Solve homework': 'დავალების დაწერა',
            'Pack bag': 'ჩანთაში ჩადება',
            'Turn on water': 'წყლის მოშვება',
            'Soap hands': 'საპნით დაბანა',
            'Dry hands': 'პირსახოცით გამშრალება',
            'Put toys away': 'სათამაშოების აკრეფა',
            'Stack books': 'წიგნების დალაგება',
            'All clean!': 'ოთახი მზადაა',
            'Toothpaste on brush': 'პასტის წასმა',
            'Rinse mouth': 'პირის გამორეცხვა',
            'Put on shirt': 'მაისურის ჩაცმა',
            'Put on pants': 'შარვლის ჩაცმა',
            'Put on shoes': 'ფეხსაცმელი',
            'First Step': 'პირველი ნაბიჯი',
            'Second Step': 'მეორე ნაბიჯი'
        };

        if (isEn) {
            return kaToEn[trimmed] || trimmed;
        } else {
            return enToKa[trimmed] || trimmed;
        }
    }

    updateFirstThenLanguage(lang) {
        const isKa = lang === 'ka';
        const isEn = lang === 'en';

        // 1. Header and Badges
        const ftHeaderBadge = document.getElementById('ft-header-badge');
        if (ftHeaderBadge) ftHeaderBadge.innerText = isEn ? "📋 First ➔ Then Routine" : "📋 First ➔ Then რუტინა";
        const ftAiSourceBadge = document.getElementById('ft-ai-source-badge');
        if (ftAiSourceBadge) {
            const cur = ftAiSourceBadge.innerText;
            if (isEn) {
                if (cur.includes('რუტინა') || cur.includes('შაბლონური') || cur.trim() === 'რუტინა') {
                    ftAiSourceBadge.innerText = cur.includes('შაბლონური') ? '✨ Preset Routine' : 'Routine';
                }
            } else {
                if (cur.includes('Routine') || cur.includes('Preset') || cur.trim() === 'Routine') {
                    ftAiSourceBadge.innerText = cur.includes('Preset') ? '✨ შაბლონური რუტინა' : 'რუტინა';
                }
            }
        }
        const schedBadge = document.getElementById('schedule-badge-tag');
        if (schedBadge) {
            schedBadge.innerText = isEn ? "✨ Routine" : "✨ რუტინა";
        }
        const ftPillFirst = document.getElementById('ft-pill-first');
        if (ftPillFirst) ftPillFirst.innerText = isEn ? "1️⃣ First (Demand)" : "1️⃣ პირველად (დავალება)";
        const ftPillThen = document.getElementById('ft-pill-then');
        if (ftPillThen) ftPillThen.innerText = isEn ? "2️⃣ Then (Reward)" : "2️⃣ შემდეგ (ჯილდო)";
        const ftGuidance = document.getElementById('ft-guidance-text');
        if (ftGuidance) ftGuidance.innerText = isEn ? "Finish the first step, then drag the slider to unlock your reward!" : "დაასრულე პირველი ნაბიჯი, შემდეგ გადაწიე სლაიდერი ჯილდოს გასახსნელად!";
        const ftBtnListen = document.getElementById('ft-btn-listen-text');
        if (ftBtnListen) ftBtnListen.innerText = isEn ? "Listen" : "მოსმენა";
        const ftBtnChange = document.getElementById('ft-btn-change-text');
        if (ftBtnChange) ftBtnChange.innerText = isEn ? "New Routine" : "ახალი რუტინა";
        const ftBtnBack = document.getElementById('ft-btn-back-text');
        if (ftBtnBack) ftBtnBack.innerText = isEn ? "Back" : "უკან";
        const ftTrackLabel = document.getElementById('ft-track-label');
        if (ftTrackLabel) ftTrackLabel.innerText = isEn ? "👉 Drag right when done" : "👉 გადაწიე მარჯვნივ როცა მორჩები";
        const ftVeilHint = document.getElementById('ft-veil-hint');
        if (ftVeilHint) ftVeilHint.innerText = isEn ? "Complete 1st step to unlock" : "დაასრულე 1-ლი ნაბიჯი გასახსნელად";
        const btnHeadFt = document.getElementById('btn-head-firstthen-text');
        if (btnHeadFt) btnHeadFt.innerText = isEn ? "First-Then" : "ჯერ-მერე";

        // Status labels
        const firstStatusLabel = document.getElementById('ft-first-status-label');
        if (firstStatusLabel) {
            firstStatusLabel.innerText = this.firstThenCompleted ? (isEn ? "DONE" : "შესრულდა") : (isEn ? "In Progress" : "მიმდინარეობს");
        }
        const thenStatusLabel = document.getElementById('ft-then-status-label');
        if (thenStatusLabel) {
            thenStatusLabel.innerText = this.firstThenCompleted ? (isEn ? "UNLOCKED!" : "გახსნილია!") : (isEn ? "Locked Reward" : "ჩაკეტილი ჯილდო");
        }

        // Substeps & Choices Headings
        const ftSubstepsTitle = document.getElementById('ft-substeps-title-text');
        if (ftSubstepsTitle) ftSubstepsTitle.innerText = isEn ? "📝 Micro-Steps:" : "📝 მიკრო-ნაბიჯები:";
        const ftChoiceTitle = document.getElementById('ft-choice-title');
        if (ftChoiceTitle) ftChoiceTitle.innerText = isEn ? "🎁 I am working for (Choose):" : "🎁 ჩემი სასურველი ჯილდო (აირჩიე):";

        // Success Card
        const ftSuccessBadge = document.getElementById('ft-success-badge');
        if (ftSuccessBadge) ftSuccessBadge.innerText = isEn ? "🎉 Awesome! Step one is complete!" : "🎉 ყოჩაღ! პირველი ნაბიჯი მზადაა!";
        const ftBtnPraiseAgain = document.getElementById('ft-btn-praise-again');
        if (ftBtnPraiseAgain) ftBtnPraiseAgain.innerText = isEn ? "🔊 Listen Again" : "🔊 ხელახლა მოსმენა";
        const ftBtnRestart = document.getElementById('ft-btn-restart');
        if (ftBtnRestart) ftBtnRestart.innerText = isEn ? "🔄 Start Over" : "🔄 თავიდან დაწყება";
        const ftBtnReturn = document.getElementById('ft-btn-return-board');
        if (ftBtnReturn) ftBtnReturn.innerText = isEn ? "⬅️ Back to Board" : "⬅️ დაფაზე დაბრუნება";

        // 2. Active Routine translation
        if (this.currentFirstThen) {
            if (this.currentFirstThen._presetKey) {
                const fresh = this.getFirstThenPresetData(this.currentFirstThen._presetKey, isKa);
                const selectedIdx = this.currentFirstThen._selectedRewardIdx || 0;
                this.currentFirstThen.first.text = fresh.first.text;
                this.currentFirstThen.first.substeps = fresh.first.substeps;
                this.currentFirstThen.then.rewardOptions = fresh.then.rewardOptions;
                if (fresh.then.rewardOptions && fresh.then.rewardOptions[selectedIdx]) {
                    this.currentFirstThen.then.text = fresh.then.rewardOptions[selectedIdx].text;
                    this.currentFirstThen.then.icon = fresh.then.rewardOptions[selectedIdx].icon;
                } else {
                    this.currentFirstThen.then.text = fresh.then.text;
                    this.currentFirstThen.then.icon = fresh.then.icon;
                }
                this.currentFirstThen.praise = fresh.praise;
            } else {
                this.currentFirstThen.first.text = this.translateFtText(this.currentFirstThen.first.text, isEn);
                this.currentFirstThen.then.text = this.translateFtText(this.currentFirstThen.then.text, isEn);
                if (Array.isArray(this.currentFirstThen.first.substeps)) {
                    this.currentFirstThen.first.substeps.forEach(s => {
                        s.text = this.translateFtText(s.text, isEn);
                    });
                }
                if (Array.isArray(this.currentFirstThen.then.rewardOptions)) {
                    this.currentFirstThen.then.rewardOptions.forEach(r => {
                        r.text = this.translateFtText(r.text, isEn);
                    });
                }
            }

            const firstText = document.getElementById('ft-first-text');
            if (firstText) firstText.innerText = this.currentFirstThen.first.text;
            const thenText = document.getElementById('ft-then-text');
            if (thenText) thenText.innerText = this.currentFirstThen.then.text;

            this.renderFirstThenSubsteps(this.currentFirstThen.first.substeps);
            this.renderFirstThenRewardChoices(this.currentFirstThen.then.rewardOptions, this.currentFirstThen.then.text);

            const successPraise = document.getElementById('ft-success-praise');
            if (successPraise && this.currentFirstThen.praise) {
                successPraise.innerText = this.currentFirstThen.praise;
            }
        }

        // 3. Modal content
        const modalTitle = document.getElementById('ft-modal-title');
        const modalSub = document.getElementById('ft-modal-subtitle');
        const tabAi = document.getElementById('ft-tab-ai');
        const tabPresets = document.getElementById('ft-tab-presets');
        const inputLabel = document.getElementById('ft-ai-input-label');
        const inputArea = document.getElementById('ft-ai-input');
        const chipsLabel = document.getElementById('ft-chips-label');
        const btnGen = document.getElementById('btn-ft-generate');

        if (modalTitle) modalTitle.innerText = isKa ? "First-Then რუტინის შექმნა" : "First-Then Routine Creator";
        if (modalSub) modalSub.innerText = isKa ? "პრემაკის პრინციპი: დავალება ➔ წამახალისებელი ჯილდო" : "Premack Principle: Demand Task ➔ Positive Reinforcer";
        if (tabAi) tabAi.innerText = isKa ? "✨ AI გენერატორი (Nemotron)" : "✨ AI Generator (Nemotron)";
        if (tabPresets) tabPresets.innerText = isKa ? "⚡ სწრაფი შაბლონები" : "⚡ Quick Presets";
        if (inputLabel) inputLabel.innerText = isKa ? "მშობლის ან თერაპევტის მოთხოვნა თავისუფალი ტექსტით:" : "Parent or Therapist Routine Request:";
        if (inputArea) inputArea.placeholder = isKa ? "მაგ. საშინაო დავალება და მერე ველოსიპედით სეირნობა..." : "e.g. Finish homework and then ride bicycle...";
        if (chipsLabel) chipsLabel.innerText = isKa ? "💡 სწრაფი წინადადებები (დააჭირეთ ჩასასმელად):" : "💡 Quick suggestions (Click to insert):";
        if (btnGen) btnGen.innerText = isKa ? "✨ AI დაგენერირება (Nemotron)" : "✨ Generate with Nemotron AI";

        this.renderFirstThenSetupContent(isKa);
    }

    launchFirstThenRoutine(routine, sourceLabel = '✨ NVIDIA Nemotron', switchMode = true) {
        this.currentFirstThen = routine;
        this.firstThenCompleted = false;
        this.firstThenSliderProgress = 0;
        this.ftLastMilestone = 0;

        if (switchMode) {
            this.switchMainMode('firstthen');
        }

        // Populate DOM elements
        const firstIcon = document.getElementById('ft-first-icon');
        const firstText = document.getElementById('ft-first-text');
        const thenIcon = document.getElementById('ft-then-icon');
        const thenText = document.getElementById('ft-then-text');
        const sourceBadge = document.getElementById('ft-ai-source-badge');
        const successCard = document.getElementById('ft-success-card');

        if (firstIcon) firstIcon.innerText = routine.first.icon || "🍽️";
        if (firstText) firstText.innerText = routine.first.text || (this.isEn() ? "First Step" : "პირველი ნაბიჯი");
        if (thenIcon) thenIcon.innerText = routine.then.icon || "⚽";
        if (thenText) thenText.innerText = routine.then.text || (this.isEn() ? "Reward" : "ჯილდო");
        if (sourceBadge) sourceBadge.innerText = sourceLabel || "✨ NVIDIA Nemotron";
        if (successCard) successCard.style.display = 'none';

        // Reset veil
        const veil = document.getElementById('ft-reward-veil');
        const lock = document.getElementById('ft-veil-lock');
        if (veil) {
            veil.style.opacity = '1';
            veil.style.backdropFilter = 'blur(10px)';
            veil.style.webkitBackdropFilter = 'blur(10px)';
        }
        if (lock) lock.innerText = '🔒';

        // ⏱️ Initialize Visual Timer
        const timerMinutes = routine.first.timerMinutes || 3;
        this.initFirstThenTimer(timerMinutes);

        // 🧩 Initialize Micro Substeps Checklist
        this.renderFirstThenSubsteps(routine.first.substeps || []);

        // 🎯 Initialize Choice-Making Reinforcers
        this.renderFirstThenRewardChoices(routine.then.rewardOptions || []);

        this.initFirstThenSlider();
        this.setFirstThenSliderProgress(0);

        // Vocal prompt only if explicitly switching mode and still in firstthen mode
        if (switchMode) {
            const isKa = this.isKa();
            const announceText = isKa
                ? `პირველად: ${routine.first.text}. შემდეგ: ${routine.then.text}.`
                : `First: ${routine.first.text}. Then: ${routine.then.text}.`;
            setTimeout(() => { 
                if (this.currentMode === 'firstthen') pecsAudio.speak(announceText); 
            }, 300);
        }
    }

    // ========================================================
    // ⏱️ VISUAL TIMER ENGINE
    // ========================================================
    initFirstThenTimer(minutes) {
        if (this.ftTimerInterval) {
            clearInterval(this.ftTimerInterval);
            this.ftTimerInterval = null;
        }

        this.ftTimerTotal = Math.max(10, (minutes || 3) * 60);
        this.ftTimerRemaining = this.ftTimerTotal;
        this.ftTimerRunning = true;

        this.updateFirstThenTimerUI();

        this.ftTimerInterval = setInterval(() => {
            if (this.currentMode !== 'firstthen') {
                clearInterval(this.ftTimerInterval);
                this.ftTimerInterval = null;
                this.ftTimerRunning = false;
                return;
            }
            if (!this.ftTimerRunning || this.firstThenCompleted) return;

            this.ftTimerRemaining--;
            if (this.ftTimerRemaining <= 0) {
                this.ftTimerRemaining = 0;
                clearInterval(this.ftTimerInterval);
                this.ftTimerInterval = null;
                this.ftTimerRunning = false;
                this.onFirstThenTimerComplete();
            }
            this.updateFirstThenTimerUI();
        }, 1000);
    }

    toggleFirstThenTimer() {
        pecsAudio.playTap();
        this.ftTimerRunning = !this.ftTimerRunning;
        const btnIcon = document.getElementById('ft-timer-btn-icon');
        if (btnIcon) {
            btnIcon.innerText = this.ftTimerRunning ? '⏸️' : '▶️';
        }
    }

    addFirstThenTimerMinute(deltaMinutes = 1) {
        pecsAudio.playTap();
        this.ftTimerRemaining += (deltaMinutes * 60);
        this.ftTimerTotal = Math.max(this.ftTimerTotal, this.ftTimerRemaining);
        this.updateFirstThenTimerUI();
    }

    resetFirstThenTimer() {
        pecsAudio.playTap();
        this.ftTimerRemaining = this.ftTimerTotal;
        this.ftTimerRunning = true;
        this.updateFirstThenTimerUI();
    }

    updateFirstThenTimerUI() {
        const display = document.getElementById('ft-timer-display');
        const circle = document.getElementById('ft-timer-circle');
        const btnIcon = document.getElementById('ft-timer-btn-icon');

        const mins = Math.floor(this.ftTimerRemaining / 60);
        const secs = this.ftTimerRemaining % 60;
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (display) display.innerText = timeStr;
        if (btnIcon) btnIcon.innerText = this.ftTimerRunning ? '⏸️' : '▶️';

        if (circle) {
            const circumference = 2 * Math.PI * 42; // r=42 -> ~263.89
            const ratio = this.ftTimerTotal > 0 ? (this.ftTimerRemaining / this.ftTimerTotal) : 0;
            const offset = circumference * (1 - ratio);
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${offset}`;

            // Sensory color shifts as timer elapses
            if (ratio < 0.2) {
                circle.style.stroke = '#EF4444'; // Red urgency
            } else if (ratio < 0.5) {
                circle.style.stroke = '#F59E0B'; // Amber middle
            } else {
                circle.style.stroke = '#3B82F6'; // Calm blue
            }
        }
    }

    onFirstThenTimerComplete() {
        if (this.currentMode !== 'firstthen') return;
        pecsAudio.playFanfare();
        const isKa = this.isKa();
        const promptMsg = isKa ? "დრო ამოიწურა! პირველი ნაბიჯი მზადაა, გადაწიე სლაიდერი!" : "Time is up! Step one is ready, drag the slider!";
        pecsAudio.speak(promptMsg);

        // Highlight handle
        const handle = document.getElementById('ft-slider-handle');
        if (handle) {
            handle.classList.add('ready-pulse');
        }
    }

    // ========================================================
    // 🧩 MICRO SUBSTEPS CHECKLIST
    // ========================================================
    renderFirstThenSubsteps(substeps) {
        this.ftSubsteps = (substeps || []).map(s => ({
            text: s.text || s,
            icon: s.icon || '📌',
            done: false
        }));

        const container = document.getElementById('ft-substeps-container');
        const list = document.getElementById('ft-substeps-list');
        const counter = document.getElementById('ft-substeps-counter');
        const titleEl = document.getElementById('ft-substeps-title');

        if (!container || !list) return;

        if (this.ftSubsteps.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        const isKa = this.isKa();
        if (titleEl) {
            titleEl.innerHTML = `<span>${isKa ? '📝 მიკრო-ნაბიჯები:' : '📝 Micro-Steps:'}</span> <span id="ft-substeps-counter" class="ft-substeps-badge">0/${this.ftSubsteps.length}</span>`;
        }

        list.innerHTML = this.ftSubsteps.map((step, idx) => `
            <div class="ft-substep-item" id="ft-substep-${idx}" onclick="app.toggleFirstThenSubstep(${idx})">
                <span class="ft-substep-check">${step.done ? '✓' : ''}</span>
                <span style="font-size:16px;">${step.icon}</span>
                <span>${step.text}</span>
            </div>
        `).join('');

        if (counter) counter.innerText = `0/${this.ftSubsteps.length}`;
    }

    toggleFirstThenSubstep(idx) {
        if (!this.ftSubsteps || !this.ftSubsteps[idx]) return;

        this.ftSubsteps[idx].done = !this.ftSubsteps[idx].done;
        const itemEl = document.getElementById(`ft-substep-${idx}`);
        if (itemEl) {
            itemEl.classList.toggle('checked', this.ftSubsteps[idx].done);
            const checkEl = itemEl.querySelector('.ft-substep-check');
            if (checkEl) checkEl.innerText = this.ftSubsteps[idx].done ? '✓' : '';
        }

        pecsAudio.playWoodTap();
        if ('vibrate' in navigator) navigator.vibrate(15);

        // Update counter
        const doneCount = this.ftSubsteps.filter(s => s.done).length;
        const counter = document.getElementById('ft-substeps-counter');
        if (counter) counter.innerText = `${doneCount}/${this.ftSubsteps.length}`;

        // Check if all completed
        if (doneCount === this.ftSubsteps.length && this.ftSubsteps.length > 0) {
            pecsAudio.playVelcro();
            const isKa = this.isKa();
            const msg = isKa ? "ყოჩაღ! ყველა ნაბიჯი შესრულდა!" : "Super! All micro-steps completed!";
            pecsAudio.speak(msg);
        }
    }

    // ========================================================
    // 🎯 CHOICE-MAKING REINFORCER PICKER (ABA Standard)
    // ========================================================
    renderFirstThenRewardChoices(options) {
        this.ftRewardOptions = options || [];
        const wrap = document.getElementById('ft-reward-picker-wrap');
        const row = document.getElementById('ft-reward-choices-row');
        const titleEl = document.getElementById('ft-choice-title');

        if (!wrap || !row) return;

        if (this.ftRewardOptions.length <= 1) {
            wrap.style.display = 'none';
            return;
        }
        wrap.style.display = 'block';

        const isKa = this.isKa();
        if (titleEl) {
            titleEl.innerText = isKa ? "🎁 ჩემი სასურველი ჯილდო (აირჩიე):" : "🎁 I am working for (Choose):";
        }

        row.innerHTML = this.ftRewardOptions.map((opt, idx) => `
            <button type="button" class="ft-reward-choice-btn ${idx === 0 ? 'active' : ''}" 
                    id="ft-rew-choice-${idx}" 
                    onclick="app.selectFirstThenRewardChoice(${idx})">
                <span>${opt.icon}</span>
                <span>${opt.text}</span>
            </button>
        `).join('');
    }

    selectFirstThenRewardChoice(idx) {
        if (!this.ftRewardOptions || !this.ftRewardOptions[idx]) return;
        const chosen = this.ftRewardOptions[idx];

        // Update active class
        this.ftRewardOptions.forEach((_, i) => {
            const btn = document.getElementById(`ft-rew-choice-${i}`);
            if (btn) btn.classList.toggle('active', i === idx);
        });

        // Update Then card preview
        if (this.currentFirstThen && this.currentFirstThen.then) {
            this.currentFirstThen.then.text = chosen.text;
            this.currentFirstThen.then.icon = chosen.icon;
            const isKa = this.isKa();
            if (isKa) {
                this.currentFirstThen.praise = this.formatFirstThenPraiseKa(chosen.text);
            }
        }

        const thenIcon = document.getElementById('ft-then-icon');
        const thenText = document.getElementById('ft-then-text');
        if (thenIcon) thenIcon.innerText = chosen.icon;
        if (thenText) thenText.innerText = chosen.text;

        pecsAudio.playVelcro();
        if ('vibrate' in navigator) navigator.vibrate(20);

        const isKa = this.isKa();
        const chooseVocal = isKa ? `მე მინდა: ${chosen.text}` : `I want: ${chosen.text}`;
        pecsAudio.speak(chooseVocal);
    }

    initFirstThenBoard() {
        const isKa = this.isKa();
        if (!this.currentFirstThen) {
            this.currentFirstThen = (typeof this.getFirstThenPresetData === 'function') 
                ? this.getFirstThenPresetData('eat_play', isKa)
                : {
                    _presetKey: 'eat_play',
                    first: { 
                        text: isKa ? "სადილის ჭამა" : "Eat Meal", 
                        icon: "🍽️",
                        timerMinutes: 5,
                        substeps: [
                            { text: isKa ? "მაგიდასთან დაჯდომა" : "Sit at table", icon: "🪑" },
                            { text: isKa ? "საჭმლის ჭამა" : "Eat meal", icon: "🍽️" },
                            { text: isKa ? "თეფშის ალაგება" : "Clear plate", icon: "✨" }
                        ]
                    },
                    then: { 
                        text: isKa ? "ბურთით თამაში" : "Play Outside", 
                        icon: "⚽",
                        rewardOptions: [
                            { text: isKa ? "ბურთით თამაში" : "Play Outside", icon: "⚽" },
                            { text: isKa ? "ველოსიპედით სეირნობა" : "Bicycle Ride", icon: "🚲" },
                            { text: isKa ? "მულტფილმის ყურება" : "Watch Cartoons", icon: "📺" }
                        ]
                    },
                    praise: isKa ? "ყოჩაღ! სადილი მიირთვი, ახლა დროა ბურთით ვითამაშოთ!" : "Great job eating your meal! Now let's play outside!"
                };
        }
        // Populate board DOM without switching mode away from AAC
        this.launchFirstThenRoutine(this.currentFirstThen, this.isEn() ? 'Routine' : 'რუტინა', false);
    }

    initFirstThenSlider() {
        const handle = document.getElementById('ft-slider-handle');
        const track = document.getElementById('ft-drag-track');
        if (!handle || !track) return;

        // Cleanup existing listeners if any
        if (this._ftSliderCleanups) {
            this._ftSliderCleanups.forEach(fn => fn());
        }
        this._ftSliderCleanups = [];

        let isDragging = false;
        let startX = 0;
        let startLeft = 0;

        const getTrackMax = () => {
            const trackWidth = track.clientWidth || 220;
            const handleWidth = handle.clientWidth || 58;
            return Math.max(1, trackWidth - handleWidth);
        };

        const onStart = (clientX) => {
            if (this.firstThenCompleted) return;
            isDragging = true;
            startX = clientX;
            startLeft = (this.firstThenSliderProgress / 100) * getTrackMax();
            handle.classList.add('dragging');
            pecsAudio.playTap();
            if ('vibrate' in navigator) navigator.vibrate(10);
        };

        const onMove = (clientX) => {
            if (!isDragging || this.firstThenCompleted) return;
            const deltaX = clientX - startX;
            const maxDist = getTrackMax();
            const newLeft = Math.max(0, Math.min(maxDist, startLeft + deltaX));
            const percent = (newLeft / maxDist) * 100;
            this.setFirstThenSliderProgress(percent);
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            handle.classList.remove('dragging');

            if (this.firstThenSliderProgress >= 85) {
                this.setFirstThenSliderProgress(100);
                this.triggerFirstThenCompletion();
            } else {
                // Smooth snap back
                let current = this.firstThenSliderProgress;
                const snapInterval = setInterval(() => {
                    current -= 12;
                    if (current <= 0) {
                        current = 0;
                        clearInterval(snapInterval);
                    }
                    this.setFirstThenSliderProgress(current);
                }, 16);
            }
        };

        // Pointer / Touch / Mouse bindings
        const handleMouseDown = (e) => { e.preventDefault(); onStart(e.clientX); };
        const windowMouseMove = (e) => { if (isDragging) { e.preventDefault(); onMove(e.clientX); } };
        const windowMouseUp = () => { if (isDragging) onEnd(); };

        const handleTouchStart = (e) => {
            if (e.touches && e.touches[0]) {
                onStart(e.touches[0].clientX);
            }
        };
        const windowTouchMove = (e) => {
            if (isDragging && e.touches && e.touches[0]) {
                onMove(e.touches[0].clientX);
            }
        };
        const windowTouchEnd = () => { if (isDragging) onEnd(); };

        // Accessibility click/double-tap to step/complete
        const handleDblClick = () => {
            if (this.firstThenCompleted) return;
            this.setFirstThenSliderProgress(100);
            this.triggerFirstThenCompletion();
        };

        const trackClick = (e) => {
            if (this.firstThenCompleted || e.target === handle || handle.contains(e.target)) return;
            const rect = track.getBoundingClientRect();
            const clickX = e.clientX - rect.left - (handle.clientWidth / 2);
            const maxDist = getTrackMax();
            const percent = Math.max(0, Math.min(100, (clickX / maxDist) * 100));
            if (percent >= 70) {
                this.setFirstThenSliderProgress(100);
                this.triggerFirstThenCompletion();
            } else {
                this.setFirstThenSliderProgress(percent);
            }
        };

        handle.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', windowMouseMove);
        window.addEventListener('mouseup', windowMouseUp);

        handle.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', windowTouchMove, { passive: false });
        window.addEventListener('touchend', windowTouchEnd);
        window.addEventListener('touchcancel', windowTouchEnd);

        handle.addEventListener('dblclick', handleDblClick);
        track.addEventListener('click', trackClick);

        this._ftSliderCleanups.push(() => {
            handle.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', windowMouseMove);
            window.removeEventListener('mouseup', windowMouseUp);
            handle.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', windowTouchMove);
            window.removeEventListener('touchend', windowTouchEnd);
            window.removeEventListener('touchcancel', windowTouchEnd);
            handle.removeEventListener('dblclick', handleDblClick);
            track.removeEventListener('click', trackClick);
        });
    }

    setFirstThenSliderProgress(percent) {
        this.firstThenSliderProgress = Math.max(0, Math.min(100, percent));
        const handle = document.getElementById('ft-slider-handle');
        const progressTrack = document.getElementById('ft-track-progress');
        const track = document.getElementById('ft-drag-track');
        const veil = document.getElementById('ft-reward-veil');
        const lock = document.getElementById('ft-veil-lock');
        const handleIcon = document.getElementById('ft-handle-icon');

        if (!handle || !track) return;
        const trackWidth = track.clientWidth || 220;
        const handleWidth = handle.clientWidth || 58;
        const maxDist = Math.max(1, trackWidth - handleWidth);

        const leftPx = (this.firstThenSliderProgress / 100) * maxDist;
        handle.style.left = `${leftPx}px`;

        if (progressTrack) {
            progressTrack.style.width = `${this.firstThenSliderProgress}%`;
        }

        // 📳 Haptic and Velcro feedback every 20% milestone!
        const currentMilestone = Math.floor(this.firstThenSliderProgress / 20) * 20;
        if (currentMilestone > this.ftLastMilestone && currentMilestone > 0) {
            this.ftLastMilestone = currentMilestone;
            pecsAudio.playVelcro();
            if ('vibrate' in navigator) navigator.vibrate(12);
        } else if (this.firstThenSliderProgress === 0) {
            this.ftLastMilestone = 0;
        }

        // Handle icon adaptation
        if (handleIcon) {
            if (this.firstThenSliderProgress >= 85) {
                handleIcon.innerText = '🌟';
            } else if (this.firstThenSliderProgress >= 50) {
                handleIcon.innerText = '👉';
            } else {
                handleIcon.innerText = '👉';
            }
        }

        // Veil revealing effect
        if (veil) {
            const remainingRatio = 1 - (this.firstThenSliderProgress / 100);
            veil.style.opacity = `${remainingRatio}`;
            const blurPx = Math.round(10 * remainingRatio);
            veil.style.backdropFilter = `blur(${blurPx}px)`;
            veil.style.webkitBackdropFilter = `blur(${blurPx}px)`;
        }

        if (lock) {
            if (this.firstThenSliderProgress >= 85) {
                lock.innerText = '🔓';
                lock.style.transform = 'scale(1.2)';
            } else {
                lock.innerText = '🔒';
                lock.style.transform = 'scale(1)';
            }
        }
    }

    formatFirstThenPraiseKa(rewardText) {
        const rewardMap = {
            'წვენის დალევა': 'წვენი დალიო',
            'წყლის დალევა': 'წყალი დალიო',
            'ბურთით თამაში': 'ბურთით ითამაშო',
            'თამაში': 'ითამაშო',
            'სასურველი თამაში': 'ითამაშო',
            'ველოსიპედით სეირნობა': 'ველოსიპედით ისეირნო',
            'სეირნობა': 'ისეირნო',
            'მულტფილმის ყურება': 'მულტფილმს უყურო',
            'წახემსება / ორცხობილა': 'გემრიელად წაიხემსო',
            'ორცხობილა': 'ორცხობილა მიირთვა',
            'ნაყინის მირთმევა': 'ნაყინი მიირთვა',
            'სადილის ჭამა': 'სადილი მიირთვა',
            'დასვენება': 'დაისვენო'
        };
        const t = (rewardText || '').trim();
        let verb = rewardMap[t];
        if (!verb) {
            if (t.includes('დალევა')) verb = t.replace('ის', 'ი').replace('დალევა', '').trim() + ' დალიო';
            else if (t.includes('თამაში')) verb = t.replace('თამაში', 'ითამაშო').trim();
            else if (t.includes('სეირნობა')) verb = t.replace('სეირნობა', 'ისეირნო').trim();
            else if (t.includes('ყურება')) verb = t.replace('ყურება', 'უყურო').trim();
            else verb = 'მიიღო ჯილდო: ' + t;
        }
        return `ყოჩაღ! პირველი ნაბიჯი მზადაა, ახლა შეგიძლია ${verb}!`;
    }

    triggerFirstThenCompletion() {
        if (this.firstThenCompleted) return;
        this.firstThenCompleted = true;

        if (this.ftTimerInterval) {
            clearInterval(this.ftTimerInterval);
            this.ftTimerRunning = false;
        }

        pecsAudio.playFanfare();
        if ('vibrate' in navigator) navigator.vibrate([30, 20, 40]);

        // Confetti effect
        this.launchConfetti();

        // Success card
        const successCard = document.getElementById('ft-success-card');
        const successPraise = document.getElementById('ft-success-praise');
        const thenStatus = document.getElementById('ft-then-status');
        const firstStatus = document.getElementById('ft-first-status');

        if (successCard) successCard.style.display = 'block';

        const isKa = this.isKa();
        let praise = this.currentFirstThen?.praise;
        if (isKa) {
            const rewText = this.currentFirstThen?.then?.text || '';
            praise = this.formatFirstThenPraiseKa(rewText);
            if (this.currentFirstThen) this.currentFirstThen.praise = praise;
        } else if (!praise) {
            praise = "Great job! First task is done, time to enjoy your reward!";
        }

        if (successPraise) successPraise.innerText = praise;
        if (thenStatus) {
            thenStatus.innerHTML = `<span style="color:#10B981; font-weight:900;">⭐ UNLOCKED!</span>`;
        }
        if (firstStatus) {
            firstStatus.innerHTML = `<span style="color:#10B981; font-weight:900;">✅ DONE</span>`;
        }

        // TTS vocal praise (snappy instant feedback)
        setTimeout(() => { pecsAudio.speak(praise); }, 80);

        // ABA Trial Event for Clinical Nemotron 3 Ultra Analytics
        const isEn = this.isEn();
        const firstText = isEn 
            ? (this.currentFirstThen?.first?.text_en || (this.translateFtText ? this.translateFtText(this.currentFirstThen?.first?.text, true) : null) || this.currentFirstThen?.first?.text || 'Task')
            : (this.currentFirstThen?.first?.text || 'Task');
        const thenText = isEn
            ? (this.currentFirstThen?.then?.text_en || (this.translateFtText ? this.translateFtText(this.currentFirstThen?.then?.text, true) : null) || this.currentFirstThen?.then?.text || 'Reward')
            : (this.currentFirstThen?.then?.text || 'Reward');
        const trialEvent = `FirstThen: ${firstText} -> ${thenText}`;
        this.logAbaEvent(trialEvent, 'first_then_completed');
    }

    resetFirstThenSlider() {
        pecsAudio.playTap();
        this.firstThenCompleted = false;
        this.setFirstThenSliderProgress(0);
        this.ftLastMilestone = 0;

        const successCard = document.getElementById('ft-success-card');
        if (successCard) successCard.style.display = 'none';

        const firstStatus = document.getElementById('ft-first-status');
        const thenStatus = document.getElementById('ft-then-status');
        const isKa = this.isKa();

        if (firstStatus) firstStatus.innerHTML = `<span class="ft-dot-active"></span> <span>${isKa ? 'მიმდინარე' : 'In Progress'}</span>`;
        if (thenStatus) thenStatus.innerHTML = `<span class="ft-dot-locked">🔒</span> <span>${isKa ? 'ჩაკეტილი ჯილდო' : 'Locked Reward'}</span>`;

        const veil = document.getElementById('ft-reward-veil');
        const lock = document.getElementById('ft-veil-lock');
        if (veil) {
            veil.style.opacity = '1';
            veil.style.backdropFilter = 'blur(10px)';
            veil.style.webkitBackdropFilter = 'blur(10px)';
        }
        if (lock) lock.innerText = '🔒';

        this.resetFirstThenTimer();
    }

    speakCurrentFirstThenRoutine() {
        if (!this.currentFirstThen) return;
        const isKa = this.isKa();
        const text = isKa
            ? `პირველად: ${this.currentFirstThen.first.text}. შემდეგ: ${this.currentFirstThen.then.text}.`
            : `First: ${this.currentFirstThen.first.text}. Then: ${this.currentFirstThen.then.text}.`;
        pecsAudio.speak(text);
    }

    speakCurrentFirstThenPraise() {
        if (!this.currentFirstThen) return;
        const isKa = this.isKa();
        let praise = this.currentFirstThen.praise;
        if (isKa) {
            const rewText = this.currentFirstThen?.then?.text || '';
            praise = this.formatFirstThenPraiseKa(rewText);
        } else if (!praise) {
            praise = "Awesome! Step one is complete, now it's time to play!";
        }
        pecsAudio.speak(praise);
    }

    // ========================================================
    // 7. რეჟიმების გადამრთველი (AAC / Trainer / First-Then)
    // ========================================================
    setGridSize(size) {
        if (!['large', 'medium', 'compact'].includes(size)) size = 'medium';
        this.gridSize = size;
        this.boardCurrentPage = 1;
        localStorage.setItem('pecs_grid_size', size);
        pecsAudio.playTap();
        this.syncGridSizeUI();
        this.renderCardsGrid();
    }

    syncGridSizeUI() {
        document.querySelectorAll('.grid-size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === this.gridSize);
        });
        document.querySelectorAll('.settings-choice-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === `scb-size-${this.gridSize}`);
        });
    }

    setTouchRepeatDelay(ms) {
        this.touchRepeatDelay = parseInt(ms) || 0;
        localStorage.setItem('pecs_touch_repeat_delay', this.touchRepeatDelay);
        pecsAudio.playTap();
        this.syncTouchSettingsUI();
        const isEn = this.isEn();
        this.showToast(isEn ? `🛑 Repeat Delay Filter: ${this.touchRepeatDelay > 0 ? (this.touchRepeatDelay / 1000) + 's' : 'Disabled'}` : `🛑 განმეორების ბლოკი: ${this.touchRepeatDelay > 0 ? (this.touchRepeatDelay / 1000) + ' წმ' : 'გამორთულია'}`);
    }

    setTouchDwellTime(ms) {
        this.touchDwellTime = parseInt(ms) || 0;
        localStorage.setItem('pecs_touch_dwell_time', this.touchDwellTime);
        pecsAudio.playTap();
        this.syncTouchSettingsUI();
        const isEn = this.isEn();
        this.showToast(isEn ? `⏳ Dwell Time: ${this.touchDwellTime > 0 ? (this.touchDwellTime / 1000) + 's' : 'Instant (0s)'}` : `⏳ შეხების დაყოვნება: ${this.touchDwellTime > 0 ? (this.touchDwellTime / 1000) + ' წმ' : 'მყისიერი (0 წმ)'}`);
    }

    syncTouchSettingsUI() {
        const isEn = this.isEn();
        document.querySelectorAll('#touch-repeat-options .scr-opt-btn').forEach(btn => {
            const delay = parseInt(btn.dataset.delay) || 0;
            btn.classList.toggle('active', delay === this.touchRepeatDelay);
            if (delay === 0) btn.textContent = isEn ? 'Disabled (0s)' : 'გამორთული (0წმ)';
            else if (delay === 800) btn.textContent = isEn ? '0.8s' : '0.8 წმ';
            else if (delay === 1200) btn.textContent = isEn ? '1.2s (Recommended)' : '1.2 წმ (რეკომენდებული)';
            else if (delay === 2000) btn.textContent = isEn ? '2.0s' : '2.0 წმ';
        });
        document.querySelectorAll('#touch-dwell-options .scr-opt-btn').forEach(btn => {
            const dwell = parseInt(btn.dataset.dwell) || 0;
            btn.classList.toggle('active', dwell === this.touchDwellTime);
            if (dwell === 0) btn.textContent = isEn ? 'Instant (0s)' : 'მყისიერი (0წმ)';
            else if (dwell === 300) btn.textContent = isEn ? '0.3s' : '0.3 წმ';
            else if (dwell === 500) btn.textContent = isEn ? '0.5s' : '0.5 წმ';
            else if (dwell === 800) btn.textContent = isEn ? '0.8s' : '0.8 წმ';
        });
    }

    exportBackupJson() {
        try {
            pecsAudio.playSuccess();
            const exportData = {
                appName: "PECSAAC",
                version: 1,
                exportedAt: new Date().toISOString(),
                data: {
                    profiles: this.profiles,
                    activeProfileId: this.activeProfileId,
                    customRecordings: JSON.parse(localStorage.getItem('pecs_custom_recordings') || '{}'),
                    analyticsLogs: this.analyticsLogs,
                    clinicalGoals: this.clinicalGoals,
                    settings: {
                        gridSize: this.gridSize,
                        promptLevel: this.currentPromptLevel,
                        touchRepeatDelay: this.touchRepeatDelay,
                        touchDwellTime: this.touchDwellTime
                    },
                    profileCards: {}
                }
            };

            // Collect custom cards for all profiles
            if (this.profiles && this.profiles.length > 0) {
                this.profiles.forEach(p => {
                    const key = `pecs_custom_cards_${p.id}`;
                    const cards = JSON.parse(localStorage.getItem(key) || 'null');
                    if (cards) exportData.data.profileCards[p.id] = cards;
                });
            }
            const defaultCards = JSON.parse(localStorage.getItem('pecs_custom_cards') || 'null');
            if (defaultCards) exportData.data.profileCards['default'] = defaultCards;

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const nowStr = new Date().toISOString().slice(0, 10);
            a.href = url;
            a.download = `VoxisAAC_Backup_${nowStr}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            const isEn = this.isEn();
            this.showAlert(
                isEn ? "Full system backup exported successfully!" : "სისტემის სრული სარეზერვო ასლი წარმატებით შეინახა!",
                isEn ? "Backup Success" : "სარეზერვო ასლი",
                "📦"
            );
        } catch (e) {
            console.error('Backup error:', e);
            const isEn = this.isEn();
            this.showAlert(
                isEn ? "Failed to export backup." : "სარეზერვო ასლის შექმნა ვერ მოხერხდა.",
                isEn ? "Error" : "შეცდომა",
                "⚠️"
            );
        }
    }

    importBackupJson(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const isEn = this.isEn();
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (!parsed.data || (parsed.appName !== 'VoxisAAC' && parsed.appName !== 'PECSAAC')) {
                    throw new Error(isEn ? 'Invalid file format. Please select a Voxis AAC backup file.' : 'არასწორი ფაილის ფორმატი. გთხოვთ აირჩიოთ Voxis AAC-ის სარეზერვო ფაილი.');
                }

                const confirmRestore = confirm('ნამდვილად გსურთ მონაცემების აღდგენა? მიმდინარე მონაცემები ჩანაცვლდება სარეზერვო ასლით.');
                if (!confirmRestore) {
                    event.target.value = '';
                    return;
                }

                const d = parsed.data;
                if (d.profiles) {
                    this.profiles = d.profiles;
                    localStorage.setItem('pecs_profiles', JSON.stringify(d.profiles));
                }
                if (d.activeProfileId) {
                    this.activeProfileId = d.activeProfileId;
                    localStorage.setItem('pecs_active_profile_id', d.activeProfileId);
                }
                if (d.customRecordings) {
                    localStorage.setItem('pecs_custom_recordings', JSON.stringify(d.customRecordings));
                }
                if (d.analyticsLogs) {
                    this.analyticsLogs = d.analyticsLogs;
                    localStorage.setItem('pecs_analytics_log', JSON.stringify(d.analyticsLogs));
                }
                if (d.clinicalGoals) {
                    this.clinicalGoals = d.clinicalGoals;
                    localStorage.setItem(`pecs_clinical_goals_${this.activeProfileId}`, JSON.stringify(d.clinicalGoals));
                }
                if (d.profileCards) {
                    Object.keys(d.profileCards).forEach(pid => {
                        localStorage.setItem(`pecs_custom_cards_${pid}`, JSON.stringify(d.profileCards[pid]));
                    });
                }
                if (d.settings) {
                    if (d.settings.gridSize) {
                        this.gridSize = d.settings.gridSize;
                        localStorage.setItem('pecs_grid_size', this.gridSize);
                    }
                    if (d.settings.touchRepeatDelay !== undefined) {
                        this.touchRepeatDelay = d.settings.touchRepeatDelay;
                        localStorage.setItem('pecs_touch_repeat_delay', this.touchRepeatDelay);
                    }
                    if (d.settings.touchDwellTime !== undefined) {
                        this.touchDwellTime = d.settings.touchDwellTime;
                        localStorage.setItem('pecs_touch_dwell_time', this.touchDwellTime);
                    }
                }

                pecsAudio.playSuccess();
                this.showToast(this.isEn() ? '🎉 Data restored successfully!' : '🎉 მონაცემები წარმატებით აღდგა!');
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } catch(err) {
                console.error('Restore failed:', err);
                this.showAlert((this.isEn() ? 'Restore failed: ' : 'აღდგენა ვერ მოხერხდა: ') + err.message);
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    }

    resetAllDataToDefaults() {
        const ok = confirm(this.isEn()
            ? '⚠️ Warning! Are you sure you want to delete all custom cards, recorded voices, and settings, and reset to factory defaults?'
            : '⚠️ ყურადღება! ნამდვილად გსურთ ყველა შექმნილი ბარათის, ჩაწერილი ხმისა და პარამეტრის წაშლა და საწყის მდგომარეობაში დაბრუნება?');
        if (!ok) return;

        localStorage.clear();
        localStorage.setItem('pecs_tts_voice', 'bella');
        localStorage.setItem('pecs_voice_v', 'bella_final');
        this.showToast(this.isEn() ? '🔄 System reset to factory defaults' : '🔄 სისტემა დაბრუნდა საწყის პარამეტრებზე');
        setTimeout(() => {
            window.location.reload();
        }, 600);
    }

    filterCardsBySearch(val) {
        this.searchQuery = val;
        this.boardCurrentPage = 1;
        this.renderCardsGrid();
    }

    clearCardSearch() {
        this.searchQuery = '';
        this.boardCurrentPage = 1;
        const input = document.getElementById('card-search-input');
        if (input) input.value = '';
        this.renderCardsGrid();
    }

    launchClinicalTool(mode) {
        this.closeModal('modal-studio');
        if (mode === 'firstthen') {
            this.openFirstThenSetup();
        } else {
            this.switchMainMode(mode);
        }
    }

    switchMainMode(mode) {
        this.currentMode = mode;
        try { localStorage.setItem('voxis_current_mode', mode); } catch(e) {}
        pecsAudio.playTap();
        
        // 🛑 If leaving firstthen mode, completely stop background timer and any routine speech
        if (mode !== 'firstthen') {
            if (this.ftTimerInterval) {
                clearInterval(this.ftTimerInterval);
                this.ftTimerInterval = null;
            }
            this.ftTimerRunning = false;
            if (window.pecsAudio && typeof window.pecsAudio.stopPlayback === 'function') {
                window.pecsAudio.stopPlayback();
            }
        }
        
        const binderWorkspace = document.getElementById('sensory-binder-workspace');
        const clinicalWrapper = document.getElementById('clinical-tools-wrapper');
        const therapistBar = document.getElementById('therapist-bottom-bar');
        const toolsTitle = document.getElementById('tools-current-title');

        // Manage body classes for rock-solid CSS isolation across devices
        document.body.classList.remove('clinical-mode-active', 'mode-aac', 'mode-firstthen', 'mode-tokenboard', 'mode-schedule', 'mode-painmap', 'mode-game', 'mode-trainer');
        document.body.classList.add('mode-' + mode);

        const isEn = this.isEn();
        const toolTitles = {
            'firstthen': isEn ? '📋 First / Then Routine Board' : '📋 First / Then დაფა (ჯერ / მერე)',
            'tokenboard': isEn ? '⭐ ABA Star Token Reinforcement Board' : '⭐ ABA ვარსკვლავების წახალისების დაფა',
            'schedule': isEn ? '📅 Visual Daily Schedule' : '📅 დღის ვიზუალური განრიგი',
            'painmap': isEn ? '🩺 Pain & Body Sensory Map' : '🩺 ტკივილისა და შეგრძნებების რუკა',
            'game': isEn ? '🎮 Find the Card Learning Game' : '🎮 „იპოვე ბარათი“ სასწავლო თამაში',
            'trainer': isEn ? '🎓 6-Phase AAC Communication Trainer' : '🎓 6-ეტაპიანი საკომუნიკაციო ტრენაჟორი (AAC Visual Exchange)'
        };

        const trainerContainer = document.getElementById('clinical-trainer-view');
        const firstThenContainer = document.getElementById('first-then-view');
        const painMapContainer = document.getElementById('pain-map-view');
        const tokenBoardContainer = document.getElementById('token-board-view');
        const scheduleContainer = document.getElementById('schedule-view');
        const gameContainer = document.getElementById('game-view');

        // Always update container active classes
        if (trainerContainer) trainerContainer.classList.toggle('active', mode === 'trainer');
        if (firstThenContainer) firstThenContainer.classList.toggle('active', mode === 'firstthen');
        if (painMapContainer) painMapContainer.classList.toggle('active', mode === 'painmap');
        if (tokenBoardContainer) tokenBoardContainer.classList.toggle('active', mode === 'tokenboard');
        if (scheduleContainer) scheduleContainer.classList.toggle('active', mode === 'schedule');
        if (gameContainer) gameContainer.classList.toggle('active', mode === 'game');

        const btnHeadFt = document.getElementById('btn-head-first-then');
        if (btnHeadFt) {
            btnHeadFt.classList.toggle('active-mode', mode === 'firstthen');
        }

        if (mode === 'aac') {
            document.body.classList.remove('clinical-mode-active');
            if (binderWorkspace) {
                binderWorkspace.style.display = 'flex';
                binderWorkspace.classList.remove('mode-hidden');
            }
            if (clinicalWrapper) {
                clinicalWrapper.style.display = 'none';
                clinicalWrapper.classList.add('mode-hidden');
                clinicalWrapper.classList.remove('schoolboard-theme-active');
            }
            if (therapistBar) therapistBar.style.display = 'flex';

            // Fully restore the main AAC board state
            this.renderCardsGrid();
            this.renderSentenceStrip();
            this.renderCategories();
            this.renderStarters();
            this.renderCoreDock();
            if (typeof this.updateSmartPredictions === 'function') {
                this.updateSmartPredictions();
            }
        } else {
            document.body.classList.add('clinical-mode-active');
            if (binderWorkspace) {
                binderWorkspace.style.display = 'none';
                binderWorkspace.classList.add('mode-hidden');
            }
            if (clinicalWrapper) {
                clinicalWrapper.style.display = 'block';
                clinicalWrapper.classList.remove('mode-hidden');
                clinicalWrapper.classList.toggle('schoolboard-theme-active', mode === 'firstthen' || mode === 'schedule' || mode === 'game');
            }
            if (therapistBar) therapistBar.style.display = 'none';
            if (toolsTitle) toolsTitle.textContent = toolTitles[mode] || (isEn ? 'Therapeutic Clinical Modality' : 'თერაპიული ინსტრუმენტი');

            const returnBar = document.querySelector('.tools-return-bar');
            if (returnBar) {
                returnBar.style.display = (mode === 'firstthen') ? 'none' : 'flex';
                const returnTxt = document.getElementById('tools-return-board-text');
                if (returnTxt) returnTxt.textContent = isEn ? 'Return to Board' : 'დაფაზე დაბრუნება';
                else {
                    const rBtn = returnBar.querySelector('.btn-return-board');
                    if (rBtn) rBtn.innerHTML = `<span>⬅️</span> ${isEn ? 'Return to Board' : 'დაფაზე დაბრუნება'}`;
                }
            }

            if (mode === 'tokenboard') {
                this.initTokenBoard(5);
                this.translateTokenBoardUI(isEn ? 'en' : 'ka');
            } else if (mode === 'painmap') {
                this.translatePainMapUI(isEn ? 'en' : 'ka');
            } else if (mode === 'trainer') {
                this.translateTrainerUI(isEn ? 'en' : 'ka');
            } else if (mode === 'schedule') {
                this.updateScheduleLanguage(isEn ? 'en' : 'ka');
            } else if (mode === 'game') {
                this.initReceptiveGame();
                this.updateGameLanguage(isEn ? 'en' : 'ka');
            } else if (mode === 'firstthen') {
                const curLang = (this.voxisAI && this.voxisAI.currentLang) || (localStorage.getItem('voxis_lang') || 'en');
                if (!this.currentFirstThen) {
                    this.initFirstThenBoard();
                } else {
                    this.initFirstThenSlider();
                }
                this.updateFirstThenLanguage(curLang);
            }
        }
    }

    translateBoardUI(lang) {
        const isEn = (lang === 'en');
        this.translateJudgeTourUI();

        // 1. Chalkboard persistent quick access core bar (#chalkboard-core-bar)
        const pDont = document.querySelector('.pill-dont-want .cp-text');
        if (pDont) pDont.textContent = isEn ? "Don't want" : "არ მინდა";
        const btnDont = document.querySelector('.pill-dont-want');
        if (btnDont) btnDont.title = isEn ? "Don't want" : "არ მინდა";

        const pHelp = document.querySelector('.pill-help .cp-text');
        if (pHelp) pHelp.textContent = isEn ? "Help" : "დახმარება";
        const btnHelp = document.querySelector('.pill-help');
        if (btnHelp) btnHelp.title = isEn ? "Help me" : "დამეხმარე";

        const pMore = document.querySelector('.pill-more .cp-text');
        if (pMore) pMore.textContent = isEn ? "More" : "კიდევ";
        const btnMore = document.querySelector('.pill-more');
        if (btnMore) btnMore.title = isEn ? "More" : "კიდევ";

        const pFin = document.querySelector('.pill-finished .cp-text');
        if (pFin) pFin.textContent = isEn ? "Finished" : "მორჩა";
        const btnFin = document.querySelector('.pill-finished');
        if (btnFin) btnFin.title = isEn ? "Finished" : "მორჩა";

        // 2. Chalkboard Live Search & Grid toolbar (#chalkboard-search-toolbar)
        const searchInput = document.getElementById('board-live-search');
        if (searchInput) {
            searchInput.placeholder = isEn ? "Search cards on board or database..." : "მოძებნეთ ბარათი დაფაზე ან ბაზაში...";
        }
        const clearSearchBtn = document.getElementById('btn-clear-board-search');
        if (clearSearchBtn) {
            clearSearchBtn.title = isEn ? "Clear" : "გასუფთავება";
        }

        const gridBtns = document.querySelectorAll('.grid-size-btn');
        gridBtns.forEach(btn => {
            const size = btn.getAttribute('data-size');
            if (size === 'large') {
                btn.innerHTML = `<span>🔍+</span> ${isEn ? 'Large' : 'დიდი'}`;
                btn.title = isEn ? 'Large Cards (High Motor Accessibility)' : 'დიდი ბარათები (მარტივი შეხება)';
            } else if (size === 'medium') {
                btn.innerHTML = `<span>📱</span> ${isEn ? 'Medium' : 'საშუალო'}`;
                btn.title = isEn ? 'Medium Cards (Standard)' : 'საშუალო ბარათები (სტანდარტული)';
            } else if (size === 'compact') {
                btn.innerHTML = `<span>📁</span> ${isEn ? 'Compact' : 'კომპაქტური'}`;
                btn.title = isEn ? 'Compact Cards (More Cards)' : 'კომპაქტური ბარათები (მეტი ბარათი)';
            }
        });

        // 3. Edit & Add Card buttons
        const btnEditText = document.getElementById('btn-edit-mode-text');
        if (btnEditText) {
            btnEditText.textContent = this.isBoardEditMode 
                ? (isEn ? 'Done' : 'მზადაა') 
                : (isEn ? 'Edit' : 'მართვა');
        }
        const btnEditToggle = document.getElementById('btn-toggle-board-edit');
        if (btnEditToggle) {
            btnEditToggle.title = isEn ? 'Delete or Manage Cards on Board' : 'ბარათების წაშლა ან მართვა დაფაზე';
        }
        const cstLibText = document.querySelector('.cst-lib-text');
        if (cstLibText) {
            cstLibText.textContent = isEn ? 'Add Card' : 'ბარათის დამატება';
        }
        const cstLibBtn = document.querySelector('.cst-open-library-btn');
        if (cstLibBtn) {
            cstLibBtn.title = isEn ? '📚 Card Library & Add Cards' : '📚 ბარათების ბაზა & დამატება';
        }

        // 4. Montessori Inlay Category Tabs (#binder-tabs-nav)
        const catMap = {
            basic: isEn ? 'Basic' : 'საბაზისო',
            food: isEn ? 'Food' : 'საჭმელი',
            drinks: isEn ? 'Drinks' : 'სასმელი',
            toys: isEn ? 'Toys' : 'სათამაშო',
            actions: isEn ? 'Actions' : 'მოქმედება',
            feelings: isEn ? 'Emotions' : 'ემოცია',
            all: isEn ? 'All' : 'ყველა'
        };
        document.querySelectorAll('#binder-tabs-nav .montessori-tab-btn').forEach(btn => {
            const cat = btn.getAttribute('data-category');
            if (cat && catMap[cat]) {
                const labelSpan = btn.querySelector('.m-tab-text');
                if (labelSpan) labelSpan.textContent = catMap[cat];
            }
        });
        const tabLibTrigger = document.querySelector('#binder-tabs-nav .tab-library-trigger .m-tab-text');
        if (tabLibTrigger) {
            tabLibTrigger.textContent = isEn ? 'Add' : 'დამატება';
        }
        const tabLibTriggerBtn = document.querySelector('#binder-tabs-nav .tab-library-trigger');
        if (tabLibTriggerBtn) {
            tabLibTriggerBtn.title = isEn ? '📚 Card Library & Add' : '📚 ბარათების ბაზა & დამატება';
        }

        // 5. Sentence Strip Dock (#binder-sentence-strip-wrap)
        const stripLabel = document.querySelector('#binder-sentence-strip-wrap .strip-label span:last-child');
        if (stripLabel) {
            stripLabel.textContent = isEn ? 'Sentence' : 'წინადადება';
        }
        const swText = document.querySelector('.strip-starter-want-btn .sw-text');
        if (swText) {
            swText.textContent = isEn ? 'I want' : 'მე მინდა';
        }
        const swTag = document.querySelector('.strip-starter-want-btn .sw-action-tag');
        if (swTag) {
            swTag.textContent = isEn ? '+ Strip' : '+ ზოლზე';
        }
        const starterWantBtn = document.querySelector('.strip-starter-want-btn');
        if (starterWantBtn) {
            starterWantBtn.title = isEn ? "Click to add 'I want' starter" : "დააჭირეთ „მე მინდა“ ბარათის დასამატებლად";
        }
        const btnSpeakLabel = document.querySelector('#btn-speak .btn-strip-label');
        if (btnSpeakLabel) {
            btnSpeakLabel.textContent = isEn ? 'Speak' : 'მოსმენა';
        }
        const btnSpeak = document.getElementById('btn-speak');
        if (btnSpeak) {
            btnSpeak.title = isEn ? 'Speak / Read Sentence' : 'მოსმენა / წაკითხვა';
        }
        const btnHandoverLabel = document.querySelector('#btn-handover .btn-strip-label');
        if (btnHandoverLabel) {
            btnHandoverLabel.textContent = isEn ? 'Handover' : 'მიწოდება';
        }
        const btnHandover = document.getElementById('btn-handover');
        if (btnHandover) {
            btnHandover.title = isEn ? 'Handover Sentence to Partner' : 'კომუნიკაციის პარტნიორისთვის გადაცემა';
        }
        const btnClear = document.querySelector('#binder-sentence-strip-wrap .btn-clear');
        if (btnClear) {
            btnClear.title = isEn ? 'Clear Sentence' : 'წინადადების გასუფთავება';
        }

        // 6. Header Buttons
        const subTitle = document.querySelector('.sensory-title-sub');
        if (subTitle) {
            subTitle.textContent = isEn ? 'Digital AAC Montessori Chalkboard' : 'ალტერნატიული კომუნიკაციის ციფრული დაფა';
        }
        const btnHome = document.querySelector('#btn-head-home .head-btn-label') || document.getElementById('btn-head-home-text');
        if (btnHome) btnHome.textContent = isEn ? 'Board' : 'დაფა';
        const btnVoice = document.querySelector('#btn-head-voice-studio .head-btn-label');
        if (btnVoice) btnVoice.textContent = isEn ? 'Record' : 'ჩაწერა';
        const btnSound = document.querySelector('#btn-head-sound-test .head-btn-label');
        if (btnSound) btnSound.textContent = isEn ? 'Audio' : 'ხმა';
        const btnPrompt = document.querySelector('#btn-head-prompt .head-btn-label') || document.getElementById('head-prompt-text');
        if (btnPrompt) {
            const promptLevelMap = {
                'independent': isEn ? 'Independent' : 'დამოუკიდებლად',
                'gestural': isEn ? 'Gestural' : 'ჟესტით',
                'visual': isEn ? 'Visual Model' : 'მოდელირებით',
                'partial_physical': isEn ? 'Partial Physical' : 'ნაწილობრივი',
                'full_physical': isEn ? 'Full Physical' : 'სრული ფიზიკური'
            };
            btnPrompt.textContent = promptLevelMap[this.currentPromptLevel] || (isEn ? 'Independent' : 'დამოუკიდებლად');
        }
        const btnFirstThen = document.querySelector('#btn-head-first-then .head-btn-label') || document.getElementById('btn-head-firstthen-text');
        if (btnFirstThen) btnFirstThen.textContent = isEn ? 'First-Then' : 'ჯერ-მერე';
        const btnEmotions = document.querySelector('#btn-head-emotions .head-btn-label');
        if (btnEmotions) btnEmotions.textContent = isEn ? 'Emotions' : 'ემოციები';
        const btnStudio = document.querySelector('#btn-head-studio .head-btn-label');
        if (btnStudio) btnStudio.textContent = isEn ? 'Studio' : 'სტუდია';
        const btnLock = document.getElementById('btn-head-lock');
        if (btnLock) btnLock.title = isEn ? 'Child Screen Lock' : '🛡️ ეკრანის დაცვა (Child Lock)';

        // 7. Flags
        const headerFlag = document.getElementById('voxis-lang-toggle-btn');
        if (headerFlag) {
            headerFlag.innerHTML = `<img src="assets/images/${isEn ? 'flag-gb.svg' : 'flag-ka.svg'}" class="voxis-flag-img" alt="${isEn ? 'EN' : 'KA'}">`;
        }
        const drawerFlag = document.getElementById('drawer-flag-img');
        if (drawerFlag) {
            drawerFlag.src = `assets/images/${isEn ? 'flag-gb.svg' : 'flag-ka.svg'}`;
        }

        // 8. Card Library Modal
        const libTitle = document.querySelector('.lib-title');
        if (libTitle) libTitle.textContent = isEn ? 'Card Library & Search Engine' : 'ბარათების ბაზა & საძიებო სისტემა';
        const libSub = document.querySelector('.lib-subtitle');
        if (libSub) libSub.textContent = isEn ? 'Choose from 160+ presets, search ARASAAC 10,000+ pictograms, or create your own' : 'აირჩიეთ 160+ მზა ბარათიდან, მოძებნეთ ARASAAC-ში ან შექმენით საკუთარი';
        const libSearchInput = document.getElementById('lib-search-input');
        if (libSearchInput) libSearchInput.placeholder = isEn ? 'Search any card (e.g. pizza, ball, dog, scooter)...' : 'მოძებნეთ ნებისმიერი ბარათი (მაგ: პიცა, ბურთი, ძაღლი, ველოსიპედი)...';
        const tabLibPreset = document.getElementById('tab-btn-lib-preset');
        if (tabLibPreset) tabLibPreset.innerHTML = `<span>📦</span> ${isEn ? 'Preset Library (160+)' : 'მზა ბაზა (160+)'}`;
        const tabLibArasaac = document.getElementById('tab-btn-lib-arasaac');
        if (tabLibArasaac) tabLibArasaac.innerHTML = `<span>🌐</span> ${isEn ? 'ARASAAC Online Search (10,000+)' : 'ARASAAC ონლაინ ძიება (10,000+)'}`;
        const tabLibCreate = document.getElementById('tab-btn-lib-create');
        if (tabLibCreate) tabLibCreate.innerHTML = `<span>✨</span> ${isEn ? 'Create Custom Card' : 'საკუთარი ბარათის შექმნა'}`;

        // Custom Card Maker Form & ARASAAC Bar
        this.translateCustomCardMakerUI(lang);

        // 9. Create Child Profile Modal
        this.translateCreateProfileModalUI(lang);

        // 10. Studio Modal Title & Tabs
        this.translateStudioModalUI(lang);

        // 11. Specialized Clinical Views
        this.translatePainMapUI(lang);
        this.translateTokenBoardUI(lang);
        this.translateTrainerUI(lang);

        // 12. Modals, Bottom Bar & Overlays
        this.translateModalsUI(lang);
    }

    onLanguageChange(lang) {
        const isEn = lang === 'en';
        this.keyboardLang = isEn ? 'en' : 'ka';

        this.translateBoardUI(lang);

        // 1. If in AAC mode or default, re-render board grid, strip, starters, categories, core dock
        if (!this.currentMode || this.currentMode === 'aac') {
            this.renderCardsGrid();
            this.renderSentenceStrip();
            this.renderCategories();
            this.renderStarters();
            this.renderCoreDock();
            if (typeof this.updateSmartPredictions === 'function') {
                this.updateSmartPredictions();
            }
        }

        // 2. Visual Daily Schedule update
        this.updateScheduleLanguage(lang);

        // 3. Find the Card Learning Game update
        this.updateGameLanguage(lang);

        // 4. First-Then Routine update
        this.updateFirstThenLanguage(lang);

        // 5. Specialized Clinical Modalities & Modals
        this.translatePainMapUI(lang);
        this.translateTokenBoardUI(lang);
        this.translateTrainerUI(lang);
        this.translateModalsUI(lang);

        // 6. Header / Return Bar titles
        const toolsTitle = document.getElementById('tools-current-title');
        const toolTitles = {
            'firstthen': isEn ? '📋 First / Then Routine Board' : '📋 First / Then დაფა (ჯერ / მერე)',
            'tokenboard': isEn ? '⭐ ABA Star Token Reinforcement Board' : '⭐ ABA ვარსკვლავების წახალისების დაფა',
            'schedule': isEn ? '📅 Visual Daily Schedule' : '📅 დღის ვიზუალური განრიგი',
            'painmap': isEn ? '🩺 Pain & Body Sensory Map' : '🩺 ტკივილისა და შეგრძნებების რუკა',
            'game': isEn ? '🎮 Find the Card Learning Game' : '🎮 „იპოვე ბარათი“ სასწავლო თამაში',
            'trainer': isEn ? '🎓 6-Phase AAC Communication Trainer' : '🎓 6-ეტაპიანი საკომუნიკაციო ტრენაჟორი (AAC Visual Exchange)'
        };
        if (toolsTitle && this.currentMode && toolTitles[this.currentMode]) {
            toolsTitle.textContent = toolTitles[this.currentMode];
        }
        const returnTxt = document.getElementById('tools-return-board-text');
        if (returnTxt) {
            returnTxt.textContent = isEn ? 'Return to Board' : 'დაფაზე დაბრუნება';
        } else {
            const returnBtn = document.querySelector('.tools-return-bar .btn-return-board');
            if (returnBtn) returnBtn.innerHTML = `<span>⬅️</span> ${isEn ? 'Return to Board' : 'დაფაზე დაბრუნება'}`;
        }

        // 7. Mobile drawer, phases and prompt UI sync
        this.syncMobileMenuUI();
        this.syncPhaseBadges();
        this.syncPromptLevelUI();
        this.updateProfileBadge();
        if (typeof this.renderQuickProfileList === 'function') {
            this.renderQuickProfileList();
        }

        // 8. If Clinical Studio modal is open, immediately re-render active studio tab
        const studioModal = document.getElementById('modal-studio');
        if (studioModal && (studioModal.classList.contains('active') || studioModal.style.display === 'flex' || studioModal.style.display === 'block')) {
            if (typeof this.translateStudioModalUI === 'function') {
                this.translateStudioModalUI(lang);
            }
            if (window.voxisAI && typeof window.voxisAI.translateStudioUI === 'function') {
                window.voxisAI.translateStudioUI(lang);
            }
            if (this.activeStudioTab) {
                if (this.activeStudioTab === 'analytics') this.renderAnalyticsTab();
                else if (this.activeStudioTab === 'goals') this.renderGoalsTab();
                else if (this.activeStudioTab === 'profiles') this.renderProfileListInStudio();
                else if (this.activeStudioTab === 'print') this.renderPrintableTab();
                else if (this.activeStudioTab === 'report') this.renderClinicalReportTab();
                else if ((this.activeStudioTab === 'room-scanner' || this.activeStudioTab === 'room-scan') && typeof this.renderRoomScannerTab === 'function') this.renderRoomScannerTab();
            }
        }
    }

    translatePainMapUI(lang) {
        const isEn = (lang === 'en');
        const titleEl = document.getElementById('body-map-title');
        if (titleEl) titleEl.textContent = isEn ? '🩺 Body Pain Map — "Where does it hurt?"' : '🩺 სხეულის რუკა — „სად მტკივა?“';
        const subEl = document.getElementById('body-map-sub');
        if (subEl) subEl.textContent = isEn ? 'Select body area and pain level' : 'მიუთითეთ სხეულის ნაწილი და ტკივილის დონე';

        const bpTranslations = isEn ? {
            'head': 'Head', 'eye': 'Eye', 'ear': 'Ear', 'teeth': 'Teeth',
            'throat': 'Throat', 'tummy': 'Tummy', 'hand': 'Hand', 'leg': 'Leg', 'back': 'Back',
            'tooth': 'Teeth', 'stomach': 'Tummy',
            'თავი': 'Head', 'თვალი': 'Eye', 'ყური': 'Ear', 'კბილი': 'Teeth',
            'ყელი': 'Throat', 'მუცელი': 'Tummy', 'ხელი': 'Hand', 'ფეხი': 'Leg', 'ზურგი': 'Back'
        } : {
            'head': 'თავი', 'eye': 'თვალი', 'ear': 'ყური', 'teeth': 'კბილი',
            'throat': 'ყელი', 'tummy': 'მუცელი', 'hand': 'ხელი', 'leg': 'ფეხი', 'back': 'ზურგი',
            'tooth': 'კბილი', 'stomach': 'მუცელი',
            'თავი': 'თავი', 'თვალი': 'თვალი', 'ყური': 'ყური', 'კბილი': 'კბილი',
            'ყელი': 'ყელი', 'მუცელი': 'მუცელი', 'ხელი': 'ხელი', 'ფეხი': 'ფეხი', 'ზურგი': 'ზურგი'
        };

        document.querySelectorAll('#body-map-grid .body-part-btn').forEach(btn => {
            const part = btn.dataset.part;
            const nameEl = btn.querySelector('.bp-name');
            if (part && bpTranslations[part] && nameEl) {
                nameEl.textContent = bpTranslations[part];
            }
        });

        const painLbl = document.getElementById('pain-level-label');
        if (painLbl) painLbl.textContent = isEn ? 'Pain Intensity:' : 'ტკივილის ინტენსივობა:';

        const scaleBtns = document.querySelectorAll('#pain-map-view .pain-scale-btn');
        if (scaleBtns[0]) {
            const n = scaleBtns[0].querySelector('.ps-name');
            if (n) n.textContent = isEn ? 'Mild' : 'ოდნავ';
        }
        if (scaleBtns[1]) {
            const n = scaleBtns[1].querySelector('.ps-name');
            if (n) n.textContent = isEn ? 'Moderate' : 'საშუალოდ';
        }
        if (scaleBtns[2]) {
            const n = scaleBtns[2].querySelector('.ps-name');
            if (n) n.textContent = isEn ? 'Severe!' : 'ძალიან!';
        }

        const stmtLbl = document.getElementById('pain-statement-label');
        if (stmtLbl) stmtLbl.textContent = isEn ? 'Message:' : 'შეტყობინება:';

        const stmtText = document.getElementById('pain-statement-text');
        if (stmtText) {
            if (!this.selectedBodyPart || stmtText.textContent.includes('აირჩიეთ') || stmtText.textContent.includes('Select')) {
                stmtText.textContent = isEn ? 'Select a body part on the map' : 'აირჩიეთ სხეულის ნაწილი რუკაზე';
            } else if (this.selectedBodyPart) {
                const partName = bpTranslations[this.selectedBodyPart] || this.selectedBodyPart;
                const scaleNames = isEn ? { mild: 'mild', medium: 'hurts', severe: 'hurts very badly' } : { mild: 'ოდნავ მტკივა', medium: 'მტკივა', severe: 'ძალიან მტკივა' };
                const scaleDesc = scaleNames[this.selectedPainScale || 'medium'] || (isEn ? 'hurts' : 'მტკივა');
                stmtText.textContent = isEn ? `My ${partName.toLowerCase()} ${scaleDesc}` : `მე ${partName} ${scaleDesc}`;
            }
        }

        const addBtn = document.getElementById('pain-add-strip-btn') || document.querySelector('#pain-map-view .btn-primary-action');
        if (addBtn) addBtn.textContent = isEn ? '➕ Add to Sentence Strip' : '➕ დამატება წინადადების ზოლზე';
    }

    translateTokenBoardUI(lang) {
        const isEn = (lang === 'en');
        const tTitle = document.getElementById('token-board-title');
        if (tTitle) tTitle.textContent = isEn ? '⭐ ABA Star Token Board' : '⭐ ABA ვარსკვლავების წახალისების დაფა';
        const tSub = document.getElementById('token-board-sub');
        if (tSub) tSub.textContent = isEn ? 'Positive Reinforcement: Earn stars to get reward' : 'პოზიტიური განმტკიცება: შეაგროვე ვარსკვლავები ჯილდოს მისაღებად';
        const tLbl = document.getElementById('token-target-label');
        if (tLbl) tLbl.textContent = isEn ? 'I am working for:' : 'მე ვმუშაობ ამისთვის:';

        const tInp = document.getElementById('token-reward-input');
        if (tInp) {
            tInp.placeholder = isEn ? 'e.g. iPad, Bubble, Playground...' : 'მაგ: აიპადი, ბუშტები, ეზოში გასეირნება...';
            if (isEn && (tInp.value === 'ბურთით თამაში ⚽' || tInp.value === '')) {
                tInp.value = 'Soccer Ball ⚽';
            } else if (!isEn && (tInp.value === 'Soccer Ball ⚽' || tInp.value === '')) {
                tInp.value = 'ბურთით თამაში ⚽';
            }
        }

        const btn3 = document.getElementById('token-btn-3');
        if (btn3) btn3.textContent = isEn ? '3 Stars' : '3 ვარსკვლავი';
        const btn5 = document.getElementById('token-btn-5');
        if (btn5) btn5.textContent = isEn ? '5 Stars' : '5 ვარსკვლავი';
        const btn10 = document.getElementById('token-btn-10');
        if (btn10) btn10.textContent = isEn ? '10 Stars' : '10 ვარსკვლავი';

        const btnReset = document.getElementById('token-btn-reset') || document.querySelector('#token-board-view .btn-clear');
        if (btnReset) btnReset.textContent = isEn ? '🔄 Reset Board' : '🔄 დაფის განულება';
    }

    translateTrainerUI(lang) {
        const isEn = (lang === 'en');
        const phaseNames = isEn ? {
            1: 'Phase I: Physical',
            2: 'Phase II: Distance',
            3: 'Phase III: Discrimination',
            4: 'Phase IV: Sentence',
            5: 'Phase V: Responding',
            6: 'Phase VI: Comment'
        } : {
            1: 'ეტაპი I: ფიზიკური',
            2: 'ეტაპი II: მანძილი',
            3: 'ეტაპი III: გარჩევა',
            4: 'ეტაპი IV: წინადადება',
            5: 'ეტაპი V: პასუხი',
            6: 'ეტაპი VI: კომენტარი'
        };

        document.querySelectorAll('.phase-tab-btn').forEach(btn => {
            const ph = parseInt(btn.dataset.phase);
            if (ph && phaseNames[ph]) {
                btn.textContent = phaseNames[ph];
            }
        });

        const lblTarget = document.getElementById('lbl-disc-target');
        if (lblTarget) lblTarget.textContent = isEn ? 'Preferred Target:' : 'სასურველი სამიზნე:';
        const lblDistractor = document.getElementById('lbl-disc-distractor');
        if (lblDistractor) lblDistractor.textContent = isEn ? 'Distractor:' : 'დისტრაქტორი (არასასურველი):';

        const handText = document.getElementById('trainer-hand-text');
        if (handText) handText.textContent = isEn ? '🤲 Hand Over Card / Sentence Strip Here' : '🤲 გადმოეცით ბარათი / წინადადება აქ';
        const handSub = document.getElementById('trainer-hand-sub');
        if (handSub) handSub.textContent = isEn ? '(Drag card or click to initiate exchange)' : '(გადმოიტანეთ ბარათი ან დააჭირეთ გასაცვლელად)';

        if (this.currentMode === 'trainer') {
            this.initTrainerPhase(this.currentPhase || 1);
        }
    }

    translateModalsUI(lang) {
        const isEn = (lang === 'en');

        // 1. Therapist Bottom Bar
        const tbLock = document.getElementById('tb-label-lock');
        if (tbLock) tbLock.textContent = isEn ? 'Lock' : 'დაცვა';
        const tbPicker = document.getElementById('tb-label-picker');
        if (tbPicker) tbPicker.textContent = isEn ? 'Card' : 'ბარათი';
        const tbPhase = document.getElementById('tb-label-phase');
        if (tbPhase) tbPhase.textContent = isEn ? `Phase ${this.activePhase || 4}` : `ეტაპი ${this.activePhase || 4}`;
        const tbPrompt = document.getElementById('tb-label-prompt');
        if (tbPrompt) {
            const promptMap = {
                'independent': isEn ? 'Independent' : 'დამოუკიდებლად',
                'partial_physical': isEn ? 'Partial' : 'ნაწილობრივ',
                'full_physical': isEn ? 'Full' : 'სრული'
            };
            tbPrompt.textContent = promptMap[this.currentPromptLevel] || (isEn ? 'Independent' : 'დამოუკიდებლად');
        }
        const tbClear = document.getElementById('tb-label-clear');
        if (tbClear) tbClear.textContent = isEn ? 'Clear' : 'გასუფთავება';
        const tbStudio = document.getElementById('tb-label-studio');
        if (tbStudio) tbStudio.textContent = isEn ? 'Studio' : 'სტუდია';

        // 2. Handover Modal
        const hoTitle = document.querySelector('#modal-handover .modal-title');
        if (hoTitle) hoTitle.textContent = isEn ? 'Handover to Communication Partner' : 'კომუნიკაციის პარტნიორისთვის გადაცემა';
        const hoSub = document.querySelector('#modal-handover .modal-subtitle');
        if (hoSub) hoSub.textContent = isEn ? 'Turn the screen to your communication partner' : 'მოაბრუნეთ ეკრანი კომუნიკაციის პარტნიორისკენ';
        const hoResp = document.getElementById('handover-response-text');
        if (hoResp) hoResp.textContent = isEn ? '“I heard you! Here you go!” 🌟' : '„გავიგე, აი ინებე!“ 🌟';

        // 3. Celebration Modal
        const celTitle = document.getElementById('celebration-title');
        if (celTitle) celTitle.textContent = isEn ? 'Great Job! You Communicated!' : 'ყოჩაღ! შენ გამოხატე შენი სურვილი!';
        const celSub = document.getElementById('celebration-subtitle');
        if (celSub) celSub.textContent = isEn ? 'You exchanged the card independently! Keep it up!' : 'შენ წარმატებით გადაეცი ბარათი! გააგრძელე ასე!';
        const celBtn = document.getElementById('celebration-confirm-btn');
        if (celBtn) celBtn.textContent = isEn ? '🌟 Continue Playing' : '🌟 თამაშის გაგრძელება';

        // 4. Regulation Modal
        const regTitle = document.querySelector('#modal-regulation .modal-title');
        if (regTitle) regTitle.textContent = isEn ? '🌿 Self-Regulation & Calm Space' : '🌿 თვითრეგულაცია და სიმშვიდის სივრცე';
        const regSub = document.querySelector('#modal-regulation .modal-subtitle');
        if (regSub) regSub.textContent = isEn ? 'How are you feeling right now? Choose your zone and take a breath' : 'როგორ გრძნობ თავს ახლა? აირჩიე შენი ზონა და ღრმად ჩაისუნთქე';

        const zGreen = document.getElementById('reg-zone-green');
        if (zGreen) {
            const h = zGreen.querySelector('.reg-zone-name');
            const p = zGreen.querySelector('.reg-zone-desc');
            if (h) h.textContent = isEn ? 'Green Zone' : 'მწვანე ზონა';
            if (p) p.textContent = isEn ? 'Calm, happy, focused, ready to learn' : 'მშვიდი, ბედნიერი, კონცენტრირებული, მზად სწავლისთვის';
        }
        const zBlue = document.getElementById('reg-zone-blue');
        if (zBlue) {
            const h = zBlue.querySelector('.reg-zone-name');
            const p = zBlue.querySelector('.reg-zone-desc');
            if (h) h.textContent = isEn ? 'Blue Zone' : 'ლურჯი ზონა';
            if (p) p.textContent = isEn ? 'Sad, tired, sick, slow energy' : 'მოწყენილი, დაღლილი, ავად, დაბალი ენერგია';
        }
        const zYellow = document.getElementById('reg-zone-yellow');
        if (zYellow) {
            const h = zYellow.querySelector('.reg-zone-name');
            const p = zYellow.querySelector('.reg-zone-desc');
            if (h) h.textContent = isEn ? 'Yellow Zone' : 'ყვითელი ზონა';
            if (p) p.textContent = isEn ? 'Excited, anxious, silly, losing control' : 'აღგზნებული, დაძაბული, ცელქი, კონტროლის დაკარგვა';
        }
        const zRed = document.getElementById('reg-zone-red');
        if (zRed) {
            const h = zRed.querySelector('.reg-zone-name');
            const p = zRed.querySelector('.reg-zone-desc');
            if (h) h.textContent = isEn ? 'Red Zone' : 'წითელი ზონა';
            if (p) p.textContent = isEn ? 'Angry, upset, overwhelmed, need help now' : 'გაბრაზებული, აფეთქებული, გადატვირთული, დახმარება მჭირდება';
        }

        const breathBubble = document.getElementById('breathing-bubble');
        if (breathBubble && (!this.breathingActive || breathBubble.textContent.includes('ჩაისუნთქე') || breathBubble.textContent.includes('Breathe'))) {
            breathBubble.textContent = isEn ? 'Breathe In...' : 'ჩაისუნთქე...';
        }
        const btnBreath = document.getElementById('btn-breathing-toggle');
        if (btnBreath && !this.breathingActive) {
            btnBreath.textContent = isEn ? '▶️ Start Guided Breathing' : '▶️ მართვადი სუნთქვის დაწყება';
        }

        const toolWater = document.getElementById('reg-tool-water');
        if (toolWater) toolWater.textContent = isEn ? '💧 Drink Water' : '💧 წყალი';
        const toolPhones = document.getElementById('reg-tool-headphones');
        if (toolPhones) toolPhones.textContent = isEn ? '🎧 Headphones' : '🎧 ყურსასმენები';
        const toolHug = document.getElementById('reg-tool-hug');
        if (toolHug) toolHug.textContent = isEn ? '🤗 Deep Hug' : '🤗 ჩახუტება';
        const toolFidget = document.getElementById('reg-tool-fidget');
        if (toolFidget) toolFidget.textContent = isEn ? '🧸 Fidget Toy' : '🧸 სათამაშო';
        const toolQuiet = document.getElementById('reg-tool-quiet');
        if (toolQuiet) toolQuiet.textContent = isEn ? '🛋️ Quiet Corner' : '🛋️ მშვიდი სივრცე';

        // 5. Quick Chat Modal
        const qcTitle = document.querySelector('#modal-quickchat .modal-title');
        if (qcTitle) qcTitle.textContent = isEn ? '💬 Quick Social Pragmatic Phrases' : '💬 სწრაფი სოციალური ფრაზები';
        const qcSub = document.querySelector('#modal-quickchat .modal-subtitle');
        if (qcSub) qcSub.textContent = isEn ? 'Instant pragmatic communication with single tap' : 'მყისიერი ყოველდღიური კომუნიკაცია ერთი შეხებით';

        const qcPhrases = isEn ? [
            'Hello! 👋', 'Goodbye! 👋', 'Thank you! 🙏', 'Please! 🤲',
            'Yes! 👍', 'No! 🛑', 'I need help! 🆘', 'I want to rest 🛋️',
            'I need bathroom 🚽', 'I love you ❤️'
        ] : [
            'გამარჯობა! 👋', 'ნახვამდის! 👋', 'მადლობა! 🙏', 'გთხოვ! 🤲',
            'დიახ! 👍', 'არა! 🛑', 'დამეხმარე! 🆘', 'დასვენება მინდა 🛋️',
            'ტუალეტში მინდა 🚽', 'მიყვარხარ ❤️'
        ];
        document.querySelectorAll('#modal-quickchat .qc-card').forEach((card, idx) => {
            if (qcPhrases[idx]) {
                const span = card.querySelector('span:last-child') || card;
                span.textContent = qcPhrases[idx];
            }
        });

        // 6. Timer Modal
        const tmTitle = document.querySelector('#modal-timer .modal-title');
        if (tmTitle) tmTitle.textContent = isEn ? '⏳ Visual Countdown Timer' : '⏳ ვიზუალური ტაიმერი';
        const tmSub = document.querySelector('#modal-timer .modal-subtitle');
        if (tmSub) tmSub.textContent = isEn ? 'Helps with transitions and predictable time perception' : 'ეხმარება აქტივობების ცვლილებასა და დროის აღქმაში';
        const t1 = document.getElementById('timer-btn-1');
        if (t1) t1.textContent = isEn ? '1 Min' : '1 წუთი';
        const t2 = document.getElementById('timer-btn-2');
        if (t2) t2.textContent = isEn ? '2 Min' : '2 წუთი';
        const t5 = document.getElementById('timer-btn-5');
        if (t5) t5.textContent = isEn ? '5 Min' : '5 წუთი';
        const t10 = document.getElementById('timer-btn-10');
        if (t10) t10.textContent = isEn ? '10 Min' : '10 წუთი';
        const btnTStart = document.getElementById('timer-btn-start');
        if (btnTStart) btnTStart.textContent = isEn ? '▶️ Start' : '▶️ დაწყება';
        const btnTPause = document.getElementById('timer-btn-pause');
        if (btnTPause) btnTPause.textContent = isEn ? '⏸️ Pause' : '⏸️ პაუზა';

        // 7. Keyboard Modal
        const kbdTitle = document.querySelector('#modal-keyboard .modal-title');
        if (kbdTitle) kbdTitle.textContent = isEn ? '⌨️ On-Screen Typing & Speech Keyboard' : '⌨️ ეკრანის კლავიატურა და გახმოვანება';
        const kbdSub = document.querySelector('#modal-keyboard .modal-subtitle');
        if (kbdSub) kbdSub.textContent = isEn ? 'Spelling and emergent literacy tool with instant speech output' : 'აკრეფისა და წერა-კითხვის სასწავლო ინსტრუმენტი ხმოვანი გახმოვანებით';
        const kbdDisp = document.getElementById('keyboard-display');
        if (kbdDisp && (!kbdDisp.textContent || kbdDisp.textContent.includes('აკრიფეთ') || kbdDisp.textContent.includes('Type'))) {
            kbdDisp.textContent = isEn ? 'Type letters here...' : 'აკრიფეთ ასოები აქ...';
        }
        const kbdSpeak = document.getElementById('kbd-btn-speak');
        if (kbdSpeak) kbdSpeak.textContent = isEn ? '🔊 Speak' : '🔊 მოსმენა';
        const kbdSpace = document.getElementById('kbd-btn-space');
        if (kbdSpace) kbdSpace.textContent = isEn ? '␣ Space' : '␣ გამოტოვება';
        const kbdDel = document.getElementById('kbd-btn-backspace');
        if (kbdDel) kbdDel.textContent = isEn ? '⌫ Delete' : '⌫ წაშლა';
        const kbdClr = document.getElementById('kbd-btn-clear');
        if (kbdClr) kbdClr.textContent = isEn ? '🗑️ Clear' : '🗑️ გასუფთავება';
        const kbdAdd = document.getElementById('kbd-btn-addstrip');
        if (kbdAdd) kbdAdd.textContent = isEn ? '➕ Add to Strip' : '➕ ზოლზე დამატება';

        // 8. SOS Modal
        const sosH = document.querySelector('#modal-sos h2');
        if (sosH) sosH.textContent = isEn ? '🚨 Emergency SOS Assistance' : '🚨 გადაუდებელი დახმარება (SOS)';
        const sosP = document.getElementById('sos-intro-text');
        if (sosP) {
            const activeChild = this.getProfileDisplayName(this.getActiveProfile(), lang);
            sosP.innerHTML = isEn 
                ? `My name is <strong id="sos-child-name">${activeChild}</strong>. I need immediate help!`
                : `მე მქვია <strong id="sos-child-name">${activeChild}</strong>. მჭირდება მშობლის ან თერაპევტის დახმარება!`;
        }
        const sosCallLbl = document.getElementById('sos-call-label');
        if (sosCallLbl) sosCallLbl.textContent = isEn ? 'Emergency Phone:' : 'გადაუდებელი ტელეფონი:';
        const sosSpeak = document.getElementById('sos-btn-speak');
        if (sosSpeak) sosSpeak.textContent = isEn ? '🔊 Call Out Loud (Voice Alarm)' : '🔊 ხმამაღლა დაძახება (ხმოვანი სიგნალი)';

        // 9. Mobile Menu Drawer
        const drHint = document.getElementById('drawer-profile-hint');
        if (drHint) drHint.textContent = isEn ? 'Active Child Profile' : 'აქტიური ბავშვის პროფილი';
        const drTiles = isEn ? {
            'drawer-tile-tools': 'Tools', 'drawer-tile-timer': 'Timer', 'drawer-tile-regulation': 'Zones',
            'drawer-tile-quickchat': 'Chat', 'drawer-tile-keyboard': 'Keyboard', 'drawer-tile-game': 'Game',
            'drawer-tile-copilot': 'Copilot', 'drawer-tile-studio': 'Studio', 'drawer-tile-sos': 'SOS'
        } : {
            'drawer-tile-tools': 'ხელსაწყოები', 'drawer-tile-timer': 'ტაიმერი', 'drawer-tile-regulation': 'ზონები',
            'drawer-tile-quickchat': 'ფრაზები', 'drawer-tile-keyboard': 'კლავიატურა', 'drawer-tile-game': 'თამაში',
            'drawer-tile-copilot': 'ასისტენტი', 'drawer-tile-studio': 'სტუდია', 'drawer-tile-sos': 'SOS'
        };
        for (const [id, label] of Object.entries(drTiles)) {
            const el = document.getElementById(id);
            if (el) {
                const s = el.querySelector('span:last-child') || el;
                s.textContent = label;
            }
        }

        // 10. Parental Gate Modal
        const gateTitle = document.querySelector('#modal-gate .modal-title');
        if (gateTitle) gateTitle.textContent = isEn ? '🛡️ Parental Gate' : '🛡️ მშობლის დაცვა (კარიბჭე)';
        const gateSub = document.querySelector('#modal-gate .modal-subtitle');
        if (gateSub) gateSub.textContent = isEn ? 'Please solve the math puzzle to enter the Studio:' : 'სტუდიაში შესასვლელად გთხოვთ ამოხსნათ მარტივი ამოცანა:';
        const gateInp = document.getElementById('gate-input');
        if (gateInp) gateInp.placeholder = isEn ? 'Answer' : 'პასუხი';
        const gateBtnCancel = document.getElementById('gate-btn-cancel');
        if (gateBtnCancel) gateBtnCancel.textContent = isEn ? 'Cancel' : 'გაუქმება';
        const gateBtnSubmit = document.getElementById('gate-btn-submit') || document.querySelector('#modal-gate .btn-primary-action');
        if (gateBtnSubmit) gateBtnSubmit.textContent = isEn ? 'Enter' : 'შესვლა';

        // 11. Phase Switcher Modal
        const psTitle = document.querySelector('#modal-phase-switcher .modal-title');
        if (psTitle) psTitle.textContent = isEn ? '🎓 PECS Phase Protocol Selection' : '🎓 PECS 6-ეტაპიანი პროტოკოლი';
        const psSub = document.querySelector('#modal-phase-switcher .modal-subtitle');
        if (psSub) psSub.textContent = isEn ? "Choose clinical phase according to child's communication level:" : 'აირჩიეთ კლინიკური ეტაპი ბავშვის საკომუნიკაციო დონის მიხედვით:';

        const phaseCardsData = isEn ? [
            { t: 'Phase I: Physical Exchange', d: 'Child exchanges single picture for desired item' },
            { t: 'Phase II: Distance & Persistence', d: 'Child travels to communication binder and partner' },
            { t: 'Phase III: Picture Discrimination', d: 'Child discriminates between 2 or more pictures' },
            { t: 'Phase IV: Sentence Structure', d: 'Child builds sentence: [I want] + [Item]' },
            { t: 'Phase V: Responding to "What do you want?"', d: 'Child answers verbal questions using sentence strip' },
            { t: 'Phase VI: Spontaneous Commenting', d: 'Child comments: [I see], [I hear], [It is]' }
        ] : [
            { t: 'ეტაპი I: ფიზიკური გაცვლა', d: 'ბავშვი აწვდის 1 ბარათს სასურველი ნივთის მისაღებად' },
            { t: 'ეტაპი II: მანძილი და დაჟინებულობა', d: 'ბავშვი გადალახავს მანძილს წიგნსა და პარტნიორს შორის' },
            { t: 'ეტაპი III: ბარათების გარჩევა (A/B)', d: 'ბავშვი არჩევს 2 ან მეტ ბარათს შორის სასურველს' },
            { t: 'ეტაპი IV: წინადადების სტრუქტურა', d: 'ბავშვი აწყობს წინადადებას: [მე მინდა] + [ნივთი]' },
            { t: 'ეტაპი V: პასუხი კითხვაზე „რა გინდა?“', d: 'ბავშვი პასუხობს დასმულ შეკითხვას წინადადებით' },
            { t: 'ეტაპი VI: სპონტანური კომენტირება', d: 'ბავშვი კომენტარს აკეთებს: [მე ვხედავ], [მე მესმის]' }
        ];
        document.querySelectorAll('#modal-phase-switcher .phase-pick-card, #modal-phase-switcher .phase-option-card').forEach((card, idx) => {
            if (phaseCardsData[idx]) {
                const tEl = card.querySelector('.phase-option-title') || card.querySelector('strong');
                const dEl = card.querySelector('.phase-option-desc') || card.querySelector('span');
                if (tEl) tEl.textContent = phaseCardsData[idx].t;
                if (dEl) dEl.textContent = phaseCardsData[idx].d;
            }
        });

        // 12. Quick Card Picker Modal
        const qpTitle = document.querySelector('#modal-card-picker .modal-title');
        if (qpTitle) qpTitle.textContent = isEn ? '🗂️ Rapid Card Picker' : '🗂️ ბარათის სწრაფი არჩევა';
        const qpSub = document.querySelector('#modal-card-picker .modal-subtitle');
        if (qpSub) qpSub.textContent = isEn ? 'Quickly select card to place on trainer or test board' : 'სწრაფად აირჩიეთ ბარათი ტრენაჟორზე ან დაფაზე გამოსატანად';
        const btnFilterTgt = document.getElementById('btn-picker-filter-target');
        if (btnFilterTgt) btnFilterTgt.textContent = isEn ? 'Target' : 'სამიზნე';
        const btnFilterDist = document.getElementById('btn-picker-filter-distractor');
        if (btnFilterDist) btnFilterDist.textContent = isEn ? 'Distractor' : 'დისტრაქტორი';
        const qpInp = document.getElementById('picker-search-input');
        if (qpInp) qpInp.placeholder = isEn ? '🔍 Search cards...' : '🔍 მოძებნეთ ბარათი...';

        // 13. Prompt Modal & Overlay
        const ptHeader = document.getElementById('prompt-tag-header-label');
        if (ptHeader) ptHeader.textContent = isEn ? '🤝 ABA Prompt Level:' : '🤝 ABA დახმარების დონე:';
        const ptBtnG = document.getElementById('pt-btn-green');
        if (ptBtnG) {
            ptBtnG.textContent = isEn ? '🟢 Independent' : '🟢 დამოუკიდებლად';
            ptBtnG.title = isEn ? 'Fully independent' : 'სრულიად დამოუკიდებლად';
        }
        const ptBtnY = document.getElementById('pt-btn-yellow');
        if (ptBtnY) {
            ptBtnY.textContent = isEn ? '🟡 Partial' : '🟡 ნაწილობრივ';
            ptBtnY.title = isEn ? 'Partial prompt' : 'ნაწილობრივი დახმარება';
        }
        const ptBtnR = document.getElementById('pt-btn-red');
        if (ptBtnR) {
            ptBtnR.textContent = isEn ? '🔴 Full' : '🔴 სრული';
            ptBtnR.title = isEn ? 'Full physical prompt' : 'სრული ფიზიკური დახმარება';
        }
        const ptBtnDis = document.getElementById('btn-disable-prompt-popup');
        if (ptBtnDis) ptBtnDis.textContent = isEn ? '🔕 Disable Popup (Record via header only)' : '🔕 ფანჯრის გათიშვა (მხოლოდ ჰედერით ჩაწერა)';
        const ptClose = document.querySelector('#prompt-tagging-overlay .pt-close-btn');
        if (ptClose) ptClose.title = isEn ? 'Close' : 'დახურვა';

        // 13.1 ABA Prompt Hierarchy Modal (#prompt-level-modal)
        this.translatePromptLevelModal(lang);

        const pmTitle = document.querySelector('#modal-prompt .modal-title');
        if (pmTitle) pmTitle.textContent = isEn ? '📊 ABA Prompt Level Recording' : '📊 ABA დახმარების დონის აღრიცხვა';
        const pmNote = document.getElementById('prompt-modal-note');
        if (pmNote) pmNote.textContent = isEn ? 'How did the child perform during this exchange?' : 'როგორ შეასრულა ბავშვმა ეს გაცვლა?';

        const pIndepT = document.getElementById('prompt-btn-indep-title');
        if (pIndepT) pIndepT.textContent = isEn ? 'Independent (Level 0)' : 'დამოუკიდებლად (დონე 0)';
        const pIndepD = document.getElementById('prompt-btn-indep-desc');
        if (pIndepD) pIndepD.textContent = isEn ? 'No physical or verbal prompt was needed' : 'არ დასჭირდა არანაირი ფიზიკური ან სიტყვიერი დახმარება';
        const pPartT = document.getElementById('prompt-btn-partial-title');
        if (pPartT) pPartT.textContent = isEn ? 'Partial Prompt (Level 1)' : 'ნაწილობრივი დახმარება (დონე 1)';
        const pPartD = document.getElementById('prompt-btn-partial-desc');
        if (pPartD) pPartD.textContent = isEn ? 'Gestural prompt, pointing, or elbow guidance' : 'ჟესტი, მითითება ან იდაყვზე მსუბუქი შეხება';
        const pFullT = document.getElementById('prompt-btn-full-title');
        if (pFullT) pFullT.textContent = isEn ? 'Full Physical Prompt (Level 2)' : 'სრული ფიზიკური დახმარება (დონე 2)';
        const pFullD = document.getElementById('prompt-btn-full-desc');
        if (pFullD) pFullD.textContent = isEn ? 'Hand-over-hand physical assistance' : 'ხელი-ხელზე სრული ფიზიკური გაძღოლა';

        const pmToggleLbl = document.getElementById('prompt-footer-toggle-label');
        if (pmToggleLbl) pmToggleLbl.textContent = isEn ? 'Show this popup after every card tap (Can be disabled in Settings)' : 'ამ ფანჯრის ჩვენება ყოველი ბარათის დაჭერისას (შეიძლება გამორთვა პარამეტრებიდან)';

        // 14. First-Then Setup Modal
        const ftmTitle = document.getElementById('ft-modal-title');
        if (ftmTitle) ftmTitle.textContent = isEn ? 'First-Then Routine Creator' : 'პირველ-შემდეგ რუტინის შემქმნელი';
        const ftmSub = document.getElementById('ft-modal-subtitle');
        if (ftmSub) ftmSub.textContent = isEn ? 'Premack Principle: Demand Task ➔ Positive Reinforcer' : 'პრემაკის პრინციპი: დავალება ➔ წამახალისებელი ჯილდო';
        const ftTabAi = document.getElementById('ft-tab-ai');
        if (ftTabAi) ftTabAi.textContent = isEn ? '✨ AI Generator (Nemotron)' : '✨ AI გენერატორი (Nemotron)';
        const ftTabPre = document.getElementById('ft-tab-presets');
        if (ftTabPre) ftTabPre.textContent = isEn ? '⚡ Quick Presets' : '⚡ მზა შაბლონები';
        const ftInpLbl = document.getElementById('ft-ai-input-label');
        if (ftInpLbl) ftInpLbl.textContent = isEn ? 'Parent or Therapist Routine Request:' : 'მშობლის ან თერაპევტის მოთხოვნა:';
        const ftAiInp = document.getElementById('ft-ai-input');
        if (ftAiInp) ftAiInp.placeholder = isEn ? 'e.g. Finish homework and then ride bicycle...' : 'მაგ. გააკეთე დავალება და მერე გაისეირნე ველოსიპედით...';
        const ftChipsLbl = document.getElementById('ft-chips-label');
        if (ftChipsLbl) ftChipsLbl.textContent = isEn ? '💡 Quick suggestions (Click to insert):' : '💡 სწრაფი იდეები (დააჭირეთ ჩასასმელად):';
        const ftBtnGen = document.getElementById('btn-ft-generate');
        if (ftBtnGen) ftBtnGen.textContent = isEn ? '✨ Generate with Nemotron AI' : '✨ შექმნა Nemotron AI-ით';

        const ftPresetsData = isEn ? [
            { t: 'Eat Meal ➔ Play Outside', d: 'Eat Healthy Meal ➔ Play Soccer Outside' },
            { t: 'Homework ➔ Bicycle Ride', d: 'Finish Study ➔ Bicycle Ride' },
            { t: 'Wash Hands ➔ Snack Time', d: 'Wash Hands Clean ➔ Enjoy Snack' },
            { t: 'Tidy Up ➔ Watch Cartoons', d: 'Tidy Room ➔ Favorite Cartoons' },
            { t: 'Brush Teeth ➔ Bedtime', d: 'Brush Teeth ➔ Sleep Calmly' },
            { t: 'Get Dressed ➔ Car Trip', d: 'Get Dressed ➔ Fun Ride in Car' }
        ] : [
            { t: 'სადილი ➔ თამაში გარეთ', d: 'ჯანსაღი სადილი ➔ ფეხბურთის თამაში ეზოში' },
            { t: 'დავალება ➔ ველოსიპედი', d: 'სწავლის დასრულება ➔ გასეირნება ველოსიპედით' },
            { t: 'ხელების დაბანა ➔ სასუსნავი', d: 'ხელების სუფთად დაბანა ➔ გემრიელი სასუსნავი' },
            { t: 'დალაგება ➔ მულტფილმები', d: 'ოთახის დალაგება ➔ საყვარელი მულტფილმი' },
            { t: 'კბილების გახეხვა ➔ ძილი', d: 'კბილების გამოხეხვა ➔ მშვიდი ძილი' },
            { t: 'ჩაცმა ➔ მგზავრობა მანქანით', d: 'ტანსაცმლის ჩაცმა ➔ გასეირნება მანქანით' }
        ];
        ftPresetsData.forEach((item, idx) => {
            const tEl = document.getElementById(`ft-preset-title-${idx + 1}`);
            const dEl = document.getElementById(`ft-preset-desc-${idx + 1}`);
            if (tEl) tEl.textContent = item.t;
            if (dEl) dEl.textContent = item.d;
        });

        // 15. Voice Studio Modal
        const vsTitle = document.getElementById('voice-studio-title');
        if (vsTitle) vsTitle.textContent = isEn ? 'Express Voice Recording Studio' : 'სწრაფი ხმის ჩაწერის სტუდია';
        const vsSub = document.getElementById('voice-studio-subtitle');
        if (vsSub) vsSub.textContent = isEn ? "Vocalize cards with parent or therapist's warm, authentic voice" : 'გაახმოვანეთ ბარათები მშობლის ან თერაპევტის თბილი, მშობლიური ხმით';
        const vsSearch = document.getElementById('voice-studio-search');
        if (vsSearch) vsSearch.placeholder = isEn ? '🔍 Search card to vocalize...' : '🔍 მოძებნეთ გასახმოვანებელი ბარათი...';
        const vsPlayLbl = document.getElementById('voice-studio-play-label');
        if (vsPlayLbl) vsPlayLbl.textContent = isEn ? 'Listen' : 'მოსმენა';
        const vsBtnRec = document.getElementById('btn-voice-studio-rec');
        if (vsBtnRec && !vsBtnRec.classList.contains('recording')) {
            vsBtnRec.textContent = isEn ? '🔴 Record' : '🔴 ჩაწერა';
        }
        const vsBtnReset = document.getElementById('btn-voice-studio-reset');
        if (vsBtnReset) vsBtnReset.textContent = isEn ? '🗑️ Reset TTS' : '🗑️ TTS-ზე დაბრუნება';
        const vsPrev = document.getElementById('btn-voice-studio-prev');
        if (vsPrev) vsPrev.textContent = isEn ? '⬅️ Previous' : '⬅️ წინა';
        const vsNext = document.getElementById('btn-voice-studio-next');
        if (vsNext) vsNext.textContent = isEn ? 'Next ➡️' : 'შემდეგი ➡️';
        const vsResetAll = document.getElementById('btn-voice-studio-reset-all');
        if (vsResetAll) vsResetAll.textContent = isEn ? '🗑️ Reset all recorded voices to default neural TTS' : '🗑️ ყველა ჩაწერილი ხმის განულება სტანდარტულ ნეირონულ TTS-ზე';
    }

    updateGameLanguage(lang) {
        const isEn = lang === 'en';

        const gameTitle = document.getElementById('game-title');
        if (gameTitle) gameTitle.innerText = isEn ? "🎮 Find the Card Game" : "🎮 „იპოვე ბარათი“ თამაში";
        const gameBadge = document.getElementById('game-badge-tag');
        if (gameBadge) gameBadge.innerText = isEn ? "🎯 Receptive Language" : "🎯 აღქმითი მეტყველება";
        const scoreLabel = document.getElementById('game-score-label');
        if (scoreLabel) scoreLabel.innerText = isEn ? "⭐ Score:" : "⭐ ქულა:";
        const repeatBtnText = document.getElementById('game-btn-repeat-text');
        if (repeatBtnText) repeatBtnText.innerText = isEn ? "Repeat" : "გაუმეორე";
        const backBtnText = document.getElementById('game-btn-back-text');
        if (backBtnText) backBtnText.innerText = isEn ? "Back" : "დაბრუნება";
        
        // Banner repeat button
        const bannerRepeatText = document.getElementById('game-banner-repeat-text');
        if (bannerRepeatText) bannerRepeatText.innerText = isEn ? "Repeat" : "გაუმეორე";
        const bannerBtns = document.querySelectorAll('.game-task-banner .ft-btn-listen');
        bannerBtns.forEach(btn => {
            const t = btn.querySelector('#game-banner-repeat-text');
            if (t) t.innerText = isEn ? "Repeat" : "გაუმეორე";
            else btn.innerHTML = `<span>🔊</span> ${isEn ? "Repeat" : "გაუმეორე"}`;
        });

        // Next round button
        const nextBtn = document.querySelector('.game-btn-next');
        const nextBtnText = document.getElementById('game-btn-next-text');
        if (nextBtnText) nextBtnText.innerText = isEn ? "Next Round" : "შემდეგი რაუნდი";
        else if (nextBtn) nextBtn.innerHTML = `<span>✨</span> ${isEn ? "Next Round" : "შემდეგი რაუნდი"}`;

        // Reset game button
        const resetBtnText = document.getElementById('game-btn-reset-text');
        if (resetBtnText) resetBtnText.innerText = isEn ? "Reset Game" : "თავიდან დაწყება";
        const resetBtns = document.querySelectorAll('#game-view .game-btn-reset, #game-view .ft-btn-change');
        resetBtns.forEach(b => {
            const txt = b.querySelector('#game-btn-reset-text');
            if (txt) txt.innerText = isEn ? "Reset Game" : "თავიდან დაწყება";
            else b.innerHTML = `<span>🔄</span> ${isEn ? "Reset Game" : "თავიდან დაწყება"}`;
        });

        const instructionDisplay = document.getElementById('game-task-instruction');
        if (instructionDisplay) instructionDisplay.innerText = isEn ? "Listen and find the matching card:" : "მოუსმინე და იპოვე სწორი ბარათი:";

        if (this.currentGameTarget) {
            const targetName = isEn ? (this.currentGameTarget.text_en || this.currentGameTarget.text) : (this.currentGameTarget.text || this.currentGameTarget.text_en);
            const targetDisplay = document.getElementById('game-task-target');
            if (targetDisplay) targetDisplay.innerText = isEn ? `“Find the card: ${targetName} 🎯”` : `„იპოვე ბარათი: ${targetName} 🎯“`;
        }

        const field = document.getElementById('game-cards-field');
        if (field && this.currentGameChoices && this.currentGameChoices.length > 0) {
            field.innerHTML = this.currentGameChoices.map(card => {
                const cardLabel = (isEn && card.text_en) ? card.text_en : card.text;
                let visualHtml = `<div class="game-choice-icon">${card.icon || '📌'}</div>`;
                if (card.image || card.arasaacUrl) {
                    const src = card.image || card.arasaacUrl;
                    visualHtml = `<img src="${src}" class="game-choice-img" alt="${cardLabel}">`;
                }
                return `
                    <div class="game-choice-card type-${card.type || 'basic'}" id="game-card-${card.id}" onclick="app.checkGameChoice('${card.id}')">
                        ${visualHtml}
                        <div class="game-choice-text">${cardLabel}</div>
                    </div>
                `;
            }).join('');
        }
    }

    updateScheduleLanguage(lang) {
        const isEn = lang === 'en';

        const schedTitle = document.getElementById('schedule-title');
        if (schedTitle) schedTitle.innerText = isEn ? "📅 Visual Daily Schedule" : "📅 დღის ვიზუალური განრიგი";
        const schedBadge = document.getElementById('schedule-badge-tag');
        if (schedBadge) schedBadge.innerText = isEn ? "✨ Routine" : "✨ რუტინა";
        const mPill = document.getElementById('sched-preset-morning');
        if (mPill) mPill.innerText = isEn ? "Morning" : "დილა";
        const sPill = document.getElementById('sched-preset-school');
        if (sPill) sPill.innerText = isEn ? "School" : "სკოლა";
        const ePill = document.getElementById('sched-preset-evening');
        if (ePill) ePill.innerText = isEn ? "Evening" : "საღამო";
        const backBtnText = document.getElementById('sched-btn-back-text');
        if (backBtnText) backBtnText.innerText = isEn ? "Back" : "დაბრუნება";
        const schedSub = document.getElementById('schedule-sub');
        if (schedSub) schedSub.innerText = isEn ? "Complete steps in order, check them off, and celebrate your independence!" : "მიყევი ნაბიჯ-ნაბიჯ, მონიშნე დასრულებულები და ისიამოვნე წარმატებით!";
        const doneBtn = document.querySelector('.sched-btn-done');
        if (doneBtn) doneBtn.innerText = isEn ? "🎉 All Done!" : "🎉 ყველაფერი შესრულდა!";
        const resetBtn = document.querySelector('#schedule-view .ft-btn-change');
        if (resetBtn) resetBtn.innerText = isEn ? "🔄 Reset Schedule" : "🔄 თავიდან დაწყება";

        this.renderScheduleTimeline();
        this.updateScheduleProgress();
    }

    toggleFirstThenMode() {
        if (this.currentMode === 'firstthen') {
            this.switchMainMode('aac');
        } else {
            this.switchMainMode('firstthen');
        }
    }

    // ========================================================
    // 8. PECS ოფიციალური 6 ეტაპის ტრენაჟორი
    // ========================================================
    initTrainerPhase(phaseNum) {
        this.currentPhase = phaseNum;
        pecsAudio.playTap();

        document.querySelectorAll('.phase-tab-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.phase) === phaseNum);
        });

        // სტიმულის დაწყების დროის ინიციალიზაცია (Latency tracking)
        this.stimulusStartTime = Date.now();

        // Phase 3 დისკრიმინაციის ამომრჩევის მართვა
        const discPicker = document.getElementById('trainer-discrimination-picker');
        if (discPicker) {
            if (phaseNum === 3) {
                discPicker.style.display = 'flex';
                this.populateDiscriminationSelects();
            } else {
                discPicker.style.display = 'none';
            }
        }

        const isEn = this.isEn();
        const phasesData = {
            1: {
                title: isEn ? "Phase I: Physical Exchange" : "ეტაპი I: ფიზიკური გაცვლა (Physical Exchange)",
                desc: isEn 
                    ? "Clinical Exchange Protocol: Only 1 target card is on the board. The child picks up the card and reaches towards the communicative partner's open hand (Drag & Drop or Tap). Partner immediately reinforces with spoken word and tangible item."
                    : "კლინიკური გაცვლის პროტოკოლი: დაფაზე დევს მხოლოდ 1 სასურველი ბარათი. ბავშვი იღებს ბარათს და აწვდის პარტნიორის გაშლილ ხელში (Drag&Drop ან Tap). პარტნიორი მყისიერად ახმოვანებს და აძლევს ნივთს.",
                partnerAvatar: "👩‍🏫",
                partnerPrompt: isEn 
                    ? "“(Partner waits silently with open hand — nonverbal exchange)”" 
                    : "„(პარტნიორი ჩუმად ელოდება გაშლილი ხელით — უსიტყვო გაცვლა)“",
                cards: [
                    { id: "ball", text: isEn ? "Ball" : "ბურთი", text_en: "Ball", icon: "⚽", type: "noun", spoken: isEn ? "Ball" : "ბურთი", spoken_en: "Ball" }
                ]
            },
            2: {
                title: isEn ? "Phase II: Distance & Persistence" : "ეტაპი II: მანძილი და დაჟინებულობა (Distance & Persistence)",
                desc: isEn
                    ? "Clinical Exchange Protocol: 1 target card on the board. Child travels distance between the binder and the communication partner, initiating and completing the exchange."
                    : "კლინიკური გაცვლის პროტოკოლი: დაფაზე კვლავ 1 ბარათია. ბავშვი გადალახავს მანძილს წიგნსა და პარტნიორს შორის, მიდის და აწვდის ბარათს.",
                partnerAvatar: "👨‍🍳",
                partnerPrompt: isEn 
                    ? "“(Partner stands at a distance — child approaches and hands over card)”"
                    : "„(პარტნიორი მოშორებით დგას — ბავშვი მოდის და გადასცემს ბარათს)“",
                cards: [
                    { id: "water", text: isEn ? "Water" : "წყალი", text_en: "Water", icon: "💧", type: "noun", spoken: isEn ? "Water" : "წყალი", spoken_en: "Water" }
                ]
            },
            3: {
                title: isEn ? "Phase III: Picture Discrimination (A/B)" : "ეტაპი III: ბარათების გარჩევა (Picture Discrimination)",
                desc: isEn
                    ? "Clinical Exchange Protocol: 2 cards on the board (preferred vs non-preferred distractor). Child discriminates and selects the desired card without prompting. 4-step error correction applies upon error."
                    : "კლინიკური გაცვლის პროტოკოლი: დაფაზე დევს 2 ბარათი (სასურველი vs არასასურველი). ბავშვი არჩევს სწორ ბარათს ყოველგვარი მინიშნების გარეშე. შეცდომისას მოქმედებს 4-ნაბიჯიანი გასწორება.",
                partnerAvatar: "👩‍🔬",
                partnerPrompt: isEn ? "“Choose what you want!”" : "„აირჩიე, რა გსურს!“",
                cards: this.getDiscriminationCards()
            },
            4: {
                title: isEn ? "Phase IV: Sentence Structure" : "ეტაპი IV: წინადადების სტრუქტურა (Sentence Structure)",
                desc: isEn
                    ? "Clinical Exchange Protocol: Sentence Strip is introduced. Child attaches [I want] + [Desired item] and hands the entire sentence strip to the communication partner."
                    : "კლინიკური გაცვლის პროტოკოლი: გამოიყენება წინადადების ზოლი (Sentence Strip). ბავშვი ამაგრებს: [მე მინდა] + [სასურველი ნივთი] და გადასცემს პარტნიორს მთლიან წინადადებას.",
                partnerAvatar: "🧑‍🏫",
                partnerPrompt: isEn ? "“(Hand over the sentence strip: 'I want' + item)”" : "„(გადასცეს წინადადება: 'მე მინდა' + ნივთი)“",
                cards: [
                    { id: "w_starter", text: isEn ? "I want" : "მე მინდა", text_en: "I want", icon: "🤲", type: "verb", spoken: isEn ? "I want" : "მე მინდა", spoken_en: "I want" },
                    { id: "w_lego", text: isEn ? "Lego" : "ლეგო", text_en: "Lego", icon: "🧱", image: "assets/images/lego.svg", type: "noun", spoken: isEn ? "Lego" : "ლეგო", spoken_en: "Lego" },
                    { id: "w_bear", text: isEn ? "Teddy Bear" : "დათუნია", text_en: "Teddy Bear", icon: "🧸", type: "noun", spoken: isEn ? "Teddy Bear" : "დათუნია", spoken_en: "Teddy Bear" }
                ]
            },
            5: {
                title: isEn ? "Phase V: Responding to 'What do you want?'" : "ეტაპი V: პასუხი შეკითხვაზე „რა გინდა?“ (Responding to 'What do you want?')",
                desc: isEn
                    ? "Clinical Exchange Protocol: Partner poses the verbal question: 'What do you want?'. Child responds by building and handing the sentence strip."
                    : "კლინიკური გაცვლის პროტოკოლი: პარტნიორი სვამს შეკითხვას: „რა გინდა?“, რაზეც ბავშვი პასუხობს წინადადების აწყობითა და მიწოდებით.",
                partnerAvatar: "👩‍⚕️",
                partnerPrompt: isEn ? "“Question: What do you want?”" : "„შეკითხვა: რა გინდა?“",
                cards: [
                    { id: "p5_want", text: isEn ? "I want" : "მე მინდა", text_en: "I want", icon: "🤲", type: "verb", spoken: isEn ? "I want" : "მე მინდა", spoken_en: "I want" },
                    { id: "p5_cookies", text: isEn ? "Cookies" : "ორცხობილა", text_en: "Cookies", icon: "🍪", type: "noun", spoken: isEn ? "Cookies" : "ორცხობილა", spoken_en: "Cookies" }
                ]
            },
            6: {
                title: isEn ? "Phase VI: Spontaneous Commenting" : "ეტაპი VI: სპონტანური კომენტირება (Commenting)",
                desc: isEn
                    ? "Clinical Exchange Protocol: Social sharing and commenting in response to: 'What do you see?', 'What do you hear?'. Child communicates: [I see] + [Airplane]."
                    : "კლინიკური გაცვლის პროტოკოლი: სოციალური გაზიარება შეკითხვებზე: „რას ხედავ?“, „რა გესმის?“. ბავშვი პასუხობს: [მე ვხედავ] + [თვითმფრინავი].",
                partnerAvatar: "🌟",
                partnerPrompt: isEn ? "“Question: What do you see?”" : "„შეკითხვა: რას ხედავ?“",
                cards: [
                    { id: "p6_see", text: isEn ? "I see" : "მე ვხედავ", text_en: "I see", icon: "👀", type: "verb", spoken: isEn ? "I see" : "მე ვხედავ", spoken_en: "I see" },
                    { id: "p6_hear", text: isEn ? "I hear" : "მე მესმის", text_en: "I hear", icon: "👂", type: "verb", spoken: isEn ? "I hear" : "მე მესმის", spoken_en: "I hear" },
                    { id: "p6_bird", text: isEn ? "Bird" : "ჩიტი", text_en: "Bird", icon: "🐦", type: "noun", spoken: isEn ? "Bird" : "ჩიტი", spoken_en: "Bird" },
                    { id: "p6_plane", text: isEn ? "Airplane" : "თვითმფრინავი", text_en: "Airplane", icon: "✈️", type: "noun", spoken: isEn ? "Airplane" : "თვითმფრინავი", spoken_en: "Airplane" }
                ]
            }
        };

        const currentData = phasesData[phaseNum];
        if (!currentData) return;

        document.getElementById('phase-title').innerText = currentData.title;
        document.getElementById('phase-desc').innerText = currentData.desc;
        document.getElementById('trainer-partner-avatar').innerText = currentData.partnerAvatar;
        const feedbackBadge = document.getElementById('trainer-partner-feedback');
        if (feedbackBadge) feedbackBadge.style.display = 'none';

        const cardsContainer = document.getElementById('trainer-cards-row');
        cardsContainer.innerHTML = currentData.cards.map((card, idx) => {
            const cardJson = JSON.stringify(card).replace(/"/g, '&quot;');
            return `
                <div class="pecs-card type-${card.type} draggable-card" style="width: 140px; height: 140px; cursor: grab;"
                     draggable="true" 
                     ondragstart="app.handleTrainerCardDragStart(event, ${cardJson})"
                     onclick="app.handleTrainerCardExchange(${cardJson})">
                    <div class="card-icon" style="font-size: 52px;">${card.icon}</div>
                    <div class="card-text">${card.text}</div>
                </div>
            `;
        }).join('');
    }

    // Phase 3: დისკრიმინაციის ბარათების მიღება
    getDiscriminationCards() {
        const isEn = this.isEn();
        const targetCard = this.cards.find(c => c.id === this.discriminationTargetId) || 
                           { id: "juice", text: isEn ? "Juice" : "წვენი", text_en: "Juice", icon: "🧃", type: "noun", spoken: isEn ? "I want juice" : "მე მინდა წვენი", spoken_en: "I want juice" };
        const distractorCard = this.cards.find(c => c.id === this.discriminationDistractorId) || 
                              { id: "sock", text: isEn ? "Sock" : "წინდა", text_en: "Sock", icon: "🧦", type: "noun", spoken: isEn ? "Sock" : "წინდა", spoken_en: "Sock" };

        const targetLabel = (isEn && targetCard.text_en) ? targetCard.text_en : targetCard.text;
        const distractorLabel = (isEn && distractorCard.text_en) ? distractorCard.text_en : distractorCard.text;

        return [
            { ...targetCard, text: targetLabel, isTarget: true },
            { ...distractorCard, text: distractorLabel, isTarget: false }
        ];
    }

    // Phase 3: დისკრიმინაციის ამომრჩევების შევსება
    populateDiscriminationSelects() {
        const targetSel = document.getElementById('dp-target-select');
        const distSel = document.getElementById('dp-distractor-select');
        if (!targetSel || !distSel) return;

        const isEn = this.isEn();
        const eligibleCards = this.cards.filter(c => c.text && c.icon);
        const optionsHtml = eligibleCards.map(c => {
            const label = (isEn && c.text_en) ? c.text_en : c.text;
            return `<option value="${c.id}">${c.icon} ${label}</option>`;
        }).join('');

        targetSel.innerHTML = optionsHtml;
        distSel.innerHTML = optionsHtml;

        if (this.cards.some(c => c.id === this.discriminationTargetId)) {
            targetSel.value = this.discriminationTargetId;
        } else if (eligibleCards.length > 0) {
            targetSel.value = eligibleCards[0].id;
            this.discriminationTargetId = targetSel.value;
        }

        if (this.cards.some(c => c.id === this.discriminationDistractorId)) {
            distSel.value = this.discriminationDistractorId;
        } else if (eligibleCards.length > 1) {
            distSel.value = eligibleCards[1].id;
            this.discriminationDistractorId = distSel.value;
        }
    }

    updateDiscriminationPair() {
        const targetSel = document.getElementById('dp-target-select');
        const distSel = document.getElementById('dp-distractor-select');
        if (targetSel) this.discriminationTargetId = targetSel.value;
        if (distSel) this.discriminationDistractorId = distSel.value;

        pecsAudio.playTap();
        this.initTrainerPhase(3);
    }

    // 🤝 Drag & Drop ტრენაჟორში: ბარათის გადაცემა პარტნიორისთვის
    handleTrainerCardDragStart(event, card) {
        event.dataTransfer.setData('text/plain', JSON.stringify(card));
        event.dataTransfer.effectAllowed = 'copy';
        pecsAudio.playTap();
    }

    handleTrainerPartnerDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        const bubble = document.getElementById('trainer-partner-bubble');
        if (bubble) bubble.classList.add('drag-over');
    }

    handleTrainerPartnerDragLeave(event) {
        const bubble = document.getElementById('trainer-partner-bubble');
        if (bubble) bubble.classList.remove('drag-over');
    }

    handleTrainerPartnerDrop(event) {
        event.preventDefault();
        const bubble = document.getElementById('trainer-partner-bubble');
        if (bubble) bubble.classList.remove('drag-over');

        try {
            const cardData = event.dataTransfer.getData('text/plain');
            if (cardData) {
                const card = JSON.parse(cardData);
                this.handleTrainerCardExchange(card);
            }
        } catch(e) {
            console.warn('Trainer drop error', e);
        }
    }

    handleTrainerPartnerClick() {
        pecsAudio.playTap();
        const dropzone = document.getElementById('trainer-partner-bubble');
        if (dropzone) {
            dropzone.classList.add('drag-over');
            setTimeout(() => dropzone.classList.remove('drag-over'), 300);
        }
    }

    handleTrainerCardExchange(card) {
        // Latency გამოთვლა: touchTime - stimulusStartTime
        const touchTime = Date.now();
        const latencyMs = Math.max(0, touchTime - (this.stimulusStartTime || touchTime));
        const latencySec = (latencyMs / 1000).toFixed(1);
        this.stimulusStartTime = Date.now(); // ნულდება შემდეგი სტიმულისთვის

        const isEn = this.isEn();
        const cardText = (isEn && card.text_en) ? card.text_en : card.text;
        const spokenText = (isEn && (card.spoken_en || card.text_en)) ? (card.spoken_en || card.text_en) : (card.spoken || card.text);

        pecsAudio.playVelcro();
        pecsAudio.speak(spokenText);

        const logEvent = this.logAbaEvent(isEn ? `Phase ${this.currentPhase}: ${cardText}` : `ეტაპი ${this.currentPhase}: ${cardText}`, `trainer_stage_${this.currentPhase}`, latencyMs, 0);
        this.showPromptTaggingOverlay(logEvent, latencySec);

        const feedbackBadge = document.getElementById('trainer-partner-feedback');

        // Phase 3: ორიგინალი PECS 4-ნაბიჯიანი შეცდომის გასწორება (4-Step Error Correction Procedure)
        if (card.isTarget === false && this.currentPhase === 3) {
            // 1. Correspondence Check: პარტნიორი აწვდის არასასურველ ნივთს (ვიზუალური უკუკავშირით)
            if (feedbackBadge) {
                feedbackBadge.style.display = 'block';
                feedbackBadge.style.background = '#FEF2F2';
                feedbackBadge.style.borderColor = '#EF4444';
                feedbackBadge.style.color = '#991B1B';
                feedbackBadge.innerHTML = `${card.icon} ${card.text}`;
            }

            setTimeout(() => {
                // Step 1: Model (ჩვენება - მანიშნებელი სწორ ბარათზე)
                const cardsContainer = document.getElementById('trainer-cards-row');
                const allCards = cardsContainer?.querySelectorAll('.pecs-card');
                allCards?.forEach(c => {
                    if (c.innerText.includes(this.cards.find(cd => cd.id === this.discriminationTargetId)?.text || '')) {
                        c.classList.add('pecs-model-glow');
                    }
                });

                setTimeout(() => {
                    // Step 2 & 3: Practice & Switch (გადართვა)
                    allCards?.forEach(c => c.classList.remove('pecs-model-glow'));
                    if (feedbackBadge) feedbackBadge.style.display = 'none';

                    setTimeout(() => {
                        // Step 4: Repeat (ახალი დამოუკიდებელი ცდა)
                        this.stimulusStartTime = Date.now();
                    }, 800);
                }, 1500);
            }, 1200);
            return;
        }

        setTimeout(() => {
            pecsAudio.playSuccess();
            if (feedbackBadge) {
                feedbackBadge.style.display = 'block';
                feedbackBadge.style.background = '#D1FAE5';
                feedbackBadge.style.borderColor = '#10B981';
                feedbackBadge.style.color = '#065F46';
                feedbackBadge.innerHTML = `✅ ${card.icon} ${card.text}`;
                setTimeout(() => {
                    feedbackBadge.style.display = 'none';
                }, 3000);
            }
        }, 500);
    }

    // ========================================================
    // 9. ABA ანალიტიკა და ლოგირება
    // ========================================================
    translateAbaText(text) {
        if (!text || typeof text !== 'string') return text;
        const allCards = [...(this.cards || []), ...(this.starterCards || [])];
        const trimmed = text.trim();
        const found = allCards.find(c => c.text === trimmed || c.spoken === trimmed);
        if (found && found.text_en) return found.text_en;

        // 1. Receptive game success pattern: "თამაში: სწორად ამოიცნო "Teddy bear" (+10 ქულა)" or "Play: სწორად ამოიცნო..."
        const gameMatch = trimmed.match(/^(?:Play|თამაში|Game|Receptive\s*Game):\s*(?:სწორად\s*ამოიცნო|ამოიცნო|Correctly identified)\s*"?([^"\(]+)"?\s*\(?\+?(\d+)\s*(?:ქულა|pts)?\)?/i);
        if (gameMatch) {
            const rawTarget = gameMatch[1].trim();
            const pts = gameMatch[2] || '10';
            const translatedTarget = this.translateAbaText(rawTarget) || rawTarget;
            const cleanTarget = translatedTarget.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').trim() || rawTarget;
            return `Receptive Game: Correctly identified "${cleanTarget}" (+${pts} pts)`;
        }

        // 2. First/Then pattern parser: "FirstThen: სადილის ჭამა -> ბურთით თამაში" or corrupted "FirstThen: სადილის Eat -> Ballთ Play"
        if (/^FirstThen:\s*/i.test(trimmed)) {
            const parts = trimmed.replace(/^FirstThen:\s*/i, '').split('->');
            if (parts.length === 2) {
                const parseFtSide = (side) => {
                    let s = side.trim();
                    if (/სადილის\s*(?:ჭამა|Eat)|საჭმლის\s*ჭამა/i.test(s)) return 'Eat meal';
                    if (/(?:ბურთით|Ballთ)\s*(?:თამაში|Play)/i.test(s)) return 'Play with ball';
                    if (/მანქან(?:ით|ებით)\s*(?:თამაში|Play)/i.test(s)) return 'Play with toy cars';
                    if (/დათუნი(?:ათი)?\s*(?:თამაში|Play)/i.test(s)) return 'Play with teddy bear';
                    if (/ლეგო(?:თი)?\s*(?:თამაში|Play|აწყობა)/i.test(s)) return 'Play with Lego';
                    if (/ველოსიპედ(?:ით)?\s*(?:სეირნობა|Play)/i.test(s)) return 'Bicycle ride';
                    if (/მულტფილმ(?:ის)?\s*(?:ყურება|Watch)/i.test(s)) return 'Watch cartoons';
                    if (/საშინაო\s*დავალება|დავალება/i.test(s)) return 'Homework';
                    if (/ხელების\s*დაბანა/i.test(s)) return 'Wash hands';
                    if (/კბილების\s*გახეხვა/i.test(s)) return 'Brush teeth';
                    if (/ოთახის\s*დალაგება/i.test(s)) return 'Tidy room';
                    if (/წვენის\s*დალევა/i.test(s)) return 'Drink juice';
                    if (/ნაყინის\s*მირთმევა/i.test(s)) return 'Eat ice cream';

                    if (typeof this.translateFtText === 'function') {
                        const ftRes = this.translateFtText(s, true);
                        if (ftRes && ftRes !== s) return ftRes;
                    }
                    let trans = this.translateAbaText(s);
                    trans = trans.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').trim();
                    return trans || s;
                };
                return `FirstThen: ${parseFtSide(parts[0])} -> ${parseFtSide(parts[1])}`;
            }
        }
        
        const dictionary = {
            // Idioms and compound forms first
            'სადილის ჭამა': 'Eat meal',
            'საუზმის ჭამა': 'Eat breakfast',
            'ვახშმის ჭამა': 'Eat dinner',
            'საჭმლის ჭამა': 'Eat meal',
            'ბურთით თამაში': 'Play with ball',
            'მანქანით თამაში': 'Play with car',
            'დათუნიათი თამაში': 'Play with teddy bear',
            'ლეგოთი თამაში': 'Play with Lego',
            'ლეგოთი აწყობა': 'Lego building',
            'ველოსიპედით სეირნობა': 'Bicycle ride',
            'მულტფილმის ყურება': 'Watch cartoons',
            'ხელების დაბანა': 'Wash hands',
            'კბილების გახეხვა': 'Brush teeth',
            'ოთახის დალაგება': 'Tidy room',
            'წვენის დალევა': 'Drink juice',
            'ნაყინის მირთმევა': 'Eat ice cream',
            'პიჟამის ჩაცმა': 'Put on pajamas',
            'ტანსაცმლის ჩაცმა': 'Get dressed',
            'საშინაო დავალება': 'Homework',
            'დასვენება და ძილი': 'Bedtime & sleep',
            'სწორად ამოიცნო': 'Correctly identified',
            'ამოიცნო': 'Identified',
            'ქულა': 'pts',
            'ქულები': 'pts',
            'სადილის': 'Meal',
            'საჭმლის': 'Meal',
            'ბურთით': 'Ball',
            'მანქანით': 'Car',
            'მანქანებით': 'Cars',
            'დათუნიათი': 'Teddy bear',
            'ლეგოთი': 'Lego',
            'ველოსიპედით': 'Bicycle',
            'მულტფილმით': 'Cartoons',
            'პიჟამა': 'Pajamas',
            'პიჟამის': 'Pajamas',
            'შესრულდა': 'Completed',
            'განრიგი': 'Schedule',
            'ბურთი': 'Ball',
            'გაჩერდი': 'Stop',
            'დალევა': 'Drink',
            'თამაში': 'Play',
            'ჭამა': 'Eat',
            'წყალი': 'Water',
            'ვაშლი': 'Apple',
            'მე მინდა': 'I want',
            'მინდა': 'I want',
            'არ მინდა': "Don't want",
            'დახმარება': 'Help',
            'დამეხმარე': 'Help me',
            'კიდევ': 'More',
            'კიდევ / მეტი': 'More',
            'მორჩა': 'Finished',
            'დიახ': 'Yes',
            'არა': 'No',
            'რძე': 'Milk',
            'ჩაი': 'Tea',
            'ყველი': 'Cheese',
            'წვნიანი': 'Soup',
            'კრეკერი': 'Cracker',
            'ჟელიბონი': 'Gummy',
            'შოკოლადი': 'Chocolate',
            'სენდვიჩი': 'Sandwich',
            'პიცა': 'Pizza',
            'კვერცხი': 'Egg',
            'კარაქი': 'Butter',
            'იოგურტი': 'Yogurt',
            'სალათი': 'Salad',
            'მაკარონი': 'Pasta',
            'კარტოფილი': 'Potato',
            'სტაფილო': 'Carrot',
            'კიტრი': 'Cucumber',
            'პომიდორი': 'Tomato',
            'მარწყვი': 'Strawberry',
            'ფორთოხალი': 'Orange',
            'ყურძენი': 'Grapes',
            'საზამთრო': 'Watermelon',
            'ნესვი': 'Melon',
            'ატამი': 'Peach',
            'ალუბალი': 'Cherry',
            'ლიმონათი': 'Lemonade',
            'კომპოტი': 'Compote',
            'კაკაო': 'Cocoa',
            'ბურბუშელა': 'Cornflakes',
            'ტორტი': 'Cake',
            'ნამცხვარი': 'Pastry',
            'ლოლიპოპი': 'Lollipop',
            'მე ვხედავ': 'I see',
            'მე მესმის': 'I hear',
            'მე ვარ': 'I am',
            'მტკივა': 'It hurts',
            'მე მტკივა': 'It hurts',
            'გასეირნება': 'Walk',
            'მანქანა': 'Car',
            'ტუალეტი': 'Toilet',
            'ძილი': 'Sleep',
            'დასვენება': 'Rest',
            'ხატვა': 'Draw',
            'მუსიკა': 'Music',
            'წიგნი': 'Book',
            'ჩახუტება': 'Hug',
            'კოცნა': 'Kiss',
            'მადლობა': 'Thank you',
            'გთხოვ': 'Please',
            'სასეირნოდ': 'Walk',
            'პური': 'Bread',
            'წვენი': 'Juice',
            'ჩიფსი': 'Chips',
            'ორცხობილა': 'Cookie',
            'ბანანი': 'Banana',
            'ტკბილეული': 'Sweets',
            'ნაყინი': 'Ice cream',
            'სათამაშო': 'Toy',
            'დათუნია': 'Teddy bear',
            'ლეგო': 'Lego',
            'ბუშტები': 'Bubbles',
            'თვითმფრინავი': 'Airplane',
            'ველოსიპედი': 'Bicycle',
            'საქანელა': 'Swing',
            'სასრიალო': 'Slide',
            'პლასტილინი': 'Play-Doh',
            'ფაზლი': 'Puzzle',
            'დედა': 'Mom',
            'მამა': 'Dad',
            'ბებია': 'Grandma',
            'ბაბუა': 'Grandpa',
            'მასწავლებელი': 'Teacher',
            'ექიმი': 'Doctor',
            'ძაღლი': 'Dog',
            'კატა': 'Cat',
            'ბანაობა': 'Shower',
            'ჩაცმა': 'Get dressed',
            'წინდები': 'Socks',
            'ფეხსაცმელი': 'Shoes',
            'ქუდი': 'Hat',
            'ქურთუკი': 'Jacket',
            'საწოლი': 'Bed',
            'მაგიდა': 'Table',
            'სკამი': 'Chair',
            'თეფში': 'Plate',
            'კოვზი': 'Spoon',
            'ჭიქა': 'Cup',
            'ფანქარი': 'Pencil',
            'ქაღალდი': 'Paper',
            'მაკრატელი': 'Scissors',
            'ტელეფონი': 'Phone',
            'ტაბლეტი': 'Tablet',
            'ტელევიზორი': 'TV',
            'ჩანთა': 'Backpack',
            'მიხარია': 'Happy',
            'მწყინს': 'Sad',
            'მოწყენილი': 'Sad',
            'გავბრაზდი': 'Angry',
            'გაბრაზებული': 'Angry',
            'დავიღალე': 'Tired',
            'მეშინია': 'Scared',
            'მუცელი მტკივა': 'Stomach hurts',
            'თავი მტკივა': 'Head hurts',
            'ალექსი': 'Alex',
            'დაჩი': 'Alex',
            'მია': 'Mia',
            'ლუკა': 'Lucas'
        };

        if (dictionary[trimmed]) return dictionary[trimmed];

        let result = trimmed;
        result = result.replace(/PECS\s*ფაზა\s*შეცვლილია:\s*ეტაპი\s*(\d+)/gi, 'AAC Phase Switched: Phase $1');
        result = result.replace(/ფაზა\s*შეცვლილია:\s*ეტაპი\s*(\d+)/gi, 'Phase Switched: Phase $1');
        result = result.replace(/ეტაპი\s*(\d+)/gi, 'Phase $1');
        result = result.replace(/ფაზა\s*(\d+)/gi, 'Phase $1');
        result = result.replace(/ბავშვი\s*1/gi, 'Alex');
        result = result.replace(/ბავშვი\s*(\d+)/gi, 'Child $1');
        result = result.replace(/ბავშვი/gi, 'Child');
        result = result.replace(/ალექსი/gi, 'Alex');
        result = result.replace(/დაჩი/gi, 'Alex');
        result = result.replace(/მია/gi, 'Mia');
        result = result.replace(/ლუკა/gi, 'Lucas');

        const prefixes = [
            ['განრიგის ნაბიჯი შესრულდა: ', 'Schedule step completed: '],
            ['განრიგის ნაბიჯი: ', 'Schedule step: '],
            ['დღის განრიგის ნაბიჯი: ', 'Schedule step: '],
            ['ნაბიჯი შესრულდა: ', 'Step completed: '],
            ['ახალი მიზანი: ', 'New Goal: '],
            ['მიზანი მიღწეულია 100%: ', 'Goal Achieved 100%: '],
            ['რუტინა დასრულდა: ', 'Routine Completed: '],
            ['ტკივილის შეტყობინება: ', 'Pain Report: '],
            ['სწორი პასუხი თამაშში: ', 'Correct Game Answer: '],
            ['PECS ფაზა შეცვლილია: ეტაპი ', 'AAC Phase Switched: Phase '],
            ['ფაზა შეცვლილია: ეტაპი ', 'Phase Switched: Phase ']
        ];
        prefixes.forEach(([geo, eng]) => {
            if (result.startsWith(geo)) {
                result = eng + result.slice(geo.length);
            }
        });

        // Sort keys by length descending so longer compound phrases match before single words
        const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
        sortedKeys.forEach(geo => {
            if (result.includes(geo)) {
                result = result.split(geo).join(dictionary[geo]);
            }
        });

        if (this.isEn()) {
            result = result.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').replace(/\s{2,}/g, ' ').trim();
        }

        return result;
    }

    // ინგლისურიდან ქართულად თარგმნა (ბარათების ქართულად გახმოვანებისთვის)
    translateToGeorgian(text) {
        if (!text || typeof text !== 'string') return text;
        const trimmed = text.trim();
        const lower = trimmed.toLowerCase();

        // 1. პირდაპირი ბაზა
        const enToKa = {
            'pizza': 'პიცა',
            'watermelon': 'საზამთრო',
            'khachapuri': 'ხაჭაპური',
            'water': 'წყალი',
            'apple': 'ვაშლი',
            'ball': 'ბურთი',
            'car': 'მანქანა',
            'toilet': 'ტუალეტი',
            'help': 'დახმარება',
            'sleep': 'ძილი',
            'eat': 'ჭამა',
            'drink': 'სასმელი',
            'happy': 'მიხარია',
            'sad': 'მწყინს',
            'angry': 'გავბრაზდი',
            'tired': 'დავიღალე',
            'scared': 'მეშინია',
            'book': 'წიგნი',
            'bicycle': 'ველოსიპედი',
            'dog': 'ძაღლი',
            'cat': 'ფისო',
            'bread': 'პური',
            'milk': 'რძე',
            'juice': 'წვენი',
            'chips': 'ჩიფსი',
            'crisps': 'ჩიფსი',
            'cookie': 'ორცხობილა',
            'cookies': 'ორცხობილა',
            'cheese': 'ყველი',
            'chocolate': 'შოკოლადი',
            'banana': 'ბანანი',
            'gummy': 'ჟელიბონი',
            'gummies': 'ჟელიბონი',
            'lego': 'ლეგო',
            'bubbles': 'ბუშტები',
            'swing': 'საქანელა',
            'slide': 'სასრიალო',
            'walk': 'გასეირნება',
            'hug': 'ჩახუტება',
            'shower': 'ბანაობა',
            'mom': 'დედა',
            'dad': 'მამა',
            'more': 'კიდევ',
            'stop': 'გაჩერდი',
            'finished': 'მორჩა',
            'yes': 'დიახ',
            'no': 'არა',
            'i want': 'მე მინდა',
            'want': 'მინდა',
            "don't want": 'არ მინდა',
            "i don't want": 'არ მინდა',
            'pen': 'კალამი',
            'pencil': 'ფანქარი',
            'phone': 'ტელეფონი',
            'smartphone': 'ტელეფონი',
            'cup': 'ჭიქა',
            'mug': 'ჭიქა',
            'bottle': 'ბოთლი',
            'desk': 'მაგიდა',
            'chair': 'სკამი',
            'lamp': 'სანათი',
            'laptop': 'ლეპტოპი',
            'computer': 'კომპიუტერი',
            'toy': 'სათამაშო',
            'toys': 'სათამაშოები',
            'backpack': 'ჩანთა',
            'glasses': 'სათვალე',
            'clock': 'საათი',
            'watch': 'საათი',
            'spoon': 'კოვზი',
            'fork': 'ჩანგალი',
            'plate': 'თეფში'
        };

        if (enToKa[lower]) return enToKa[lower];

        // 2. getExtendedGeoMap-ის რევერსული ძიება
        const geoMap = this.getExtendedGeoMap ? this.getExtendedGeoMap() : {};
        for (const [geo, eng] of Object.entries(geoMap)) {
            if (eng.toLowerCase() === lower) {
                return geo;
            }
        }

        // 3. Preset ბარათების ბაზიდან ძიება
        const allPreset = [...(this.cards || []), ...(this.starterCards || [])];
        const found = allPreset.find(c => (c.text_en && c.text_en.toLowerCase() === lower) || (c.spoken_en && c.spoken_en.toLowerCase() === lower));
        if (found) return found.spoken || found.text;

        return trimmed;
    }

    loadAnalytics() {
        try {
            const saved = localStorage.getItem('pecs_analytics_log');
            this.analyticsLogs = saved ? JSON.parse(saved) : [];
        } catch(e) {
            this.analyticsLogs = [];
        }

        // Proactively sanitize and upgrade existing logs for clean English mode
        if (this.analyticsLogs && this.analyticsLogs.length > 0) {
            let changed = false;
            this.analyticsLogs.forEach(l => {
                if (l && (l.text || l.text_en)) {
                    const candidate = l.text_en || l.text;
                    const repaired = this.translateAbaText(candidate);
                    const cleanRepaired = (repaired || candidate).replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').replace(/\s{2,}/g, ' ').trim();
                    if (cleanRepaired && cleanRepaired !== l.text_en) {
                        l.text_en = cleanRepaired;
                        changed = true;
                    }
                }
            });
            if (changed) {
                this.saveAnalytics();
            }
        }

        // Background server restore if localStorage is empty
        if (!this.analyticsLogs || this.analyticsLogs.length === 0) {
            fetch('api/ai.php?action=sync_analytics')
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (data && data.logs && data.logs.length > 0) {
                        this.analyticsLogs = data.logs;
                        localStorage.setItem('pecs_analytics_log', JSON.stringify(this.analyticsLogs));
                    }
                })
                .catch(() => {});
        }
    }

    saveAnalytics() {
        localStorage.setItem('pecs_analytics_log', JSON.stringify(this.analyticsLogs));

        // Debounced background sync to server
        clearTimeout(this._analyticsSyncTimer);
        this._analyticsSyncTimer = setTimeout(() => {
            if (!this.analyticsLogs || this.analyticsLogs.length === 0) return;
            fetch('api/ai.php?action=sync_analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logs: this.analyticsLogs.slice(0, 100) })
            }).catch(() => {});
        }, 1000);
    }

    logAbaEvent(text, context = 'spontaneous', latencyMs = 0, promptLevel = null) {
        const pLevel = (promptLevel !== null && promptLevel !== undefined) ? parseInt(promptLevel) : this.currentPromptLevel;
        const promptNames = ['დამოუკიდებლად', 'ნაწილობრივ', 'სრული დახმარება'];
        const isEn = this.isEn();
        let enText = isEn ? text : (this.translateAbaText ? this.translateAbaText(text) : text);
        if (enText && typeof enText === 'string') {
            enText = this.translateAbaText(enText);
            enText = enText.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').replace(/\s{2,}/g, ' ').trim();
        }
        const event = {
            id: 'evt_' + Date.now(),
            profileId: this.activeProfileId,
            time: new Date().toLocaleTimeString(isEn ? 'en-US' : 'ka-GE'),
            date: new Date().toLocaleDateString(isEn ? 'en-US' : 'ka-GE'),
            text: text,
            text_en: enText,
            context: context,
            latencyMs: latencyMs,
            promptLevel: pLevel, // 0: დამოუკიდებლად, 1: ნაწილობრივ, 2: სრული დახმარება
            promptName: isEn ? (['Independent', 'Partial Prompt', 'Full Physical'][pLevel] || 'Independent') : (promptNames[pLevel] || 'დამოუკიდებლად')
        };
        this.analyticsLogs.unshift(event);
        if (this.analyticsLogs.length > 500) this.analyticsLogs.pop();
        this.saveAnalytics();
        return event;
    }

    // ========================================================
    // 4. 🤝 ABA დახმარების დონის მართვა (Prompt Hierarchy)
    //    0: დამოუკიდებლად (🟢)
    //    1: ნაწილობრივ (🟡)
    //    2: სრული დახმარება (🔴)
    // ========================================================
    getPromptLevelInfo(level = this.currentPromptLevel) {
        const isEn = this.isEn();
        const levels = isEn ? [
            { level: 0, icon: '🟢', name: 'Independent', short: 'Independent', class: 'level-0' },
            { level: 1, icon: '🟡', name: 'Partial Prompt', short: 'Partial', class: 'level-1' },
            { level: 2, icon: '🔴', name: 'Full Physical', short: 'Full', class: 'level-2' }
        ] : [
            { level: 0, icon: '🟢', name: 'დამოუკიდებლად', short: 'დამოუკიდ.', class: 'level-0' },
            { level: 1, icon: '🟡', name: 'ნაწილობრივ', short: 'ნაწილობრ.', class: 'level-1' },
            { level: 2, icon: '🔴', name: 'სრული დახმარება', short: 'სრული', class: 'level-2' }
        ];
        return levels[level] || levels[0];
    }

    cyclePromptLevel() {
        this.currentPromptLevel = (this.currentPromptLevel + 1) % 3;
        localStorage.setItem('pecs_prompt_level', this.currentPromptLevel);
        pecsAudio.playWoodTap();
        this.syncPromptLevelUI();

        const info = this.getPromptLevelInfo();
        this.showToast(this.isEn() ? `🤝 Prompt Level: ${info.icon} ${info.name}` : `🤝 დახმარების დონე: ${info.icon} ${info.name}`);
    }

    setPromptLevel(level, name) {
        this.currentPromptLevel = parseInt(level) || 0;
        localStorage.setItem('pecs_prompt_level', this.currentPromptLevel);
        pecsAudio.playWoodTap();
        this.syncPromptLevelUI();
        this.closePromptLevelModal();

        const info = this.getPromptLevelInfo();
        this.showToast(this.isEn() ? `🤝 Prompt Level: ${info.icon} ${info.name}` : `🤝 დახმარების დონე: ${info.icon} ${info.name}`);
    }

    translatePromptLevelModal(lang) {
        const isEn = (lang ? lang === 'en' : this.isEn());
        const pmhTitle = document.getElementById('pm-title');
        if (pmhTitle) pmhTitle.textContent = isEn ? 'Select ABA Prompt Level' : 'ABA დახმარების დონის არჩევა';
        const pmhSub = document.getElementById('pm-sub');
        if (pmhSub) pmhSub.textContent = isEn ? 'ABA Prompt Hierarchy · Data Logging' : 'ABA დახმარების იერარქია · მონაცემთა აღრიცხვა';
        const pmhIntro = document.getElementById('pm-intro');
        if (pmhIntro) {
            pmhIntro.innerHTML = isEn
                ? '💡 <strong>Instruction:</strong> Select the level of assistance provided in the current trial. Each tap will be automatically logged at this level:'
                : '💡 <strong>ინსტრუქცია:</strong> აირჩიეთ მიმდინარე ცდაში გაწეული დახმარების დონე. ყოველი შეხება ავტომატურად ინიშნება ამ დონით:';
        }

        const pcT0 = document.getElementById('pc-title-0');
        if (pcT0) pcT0.innerHTML = isEn ? 'Independent <span class="pc-tag-eng">(Level 0)</span>' : 'დამოუკიდებლად <span class="pc-tag-eng">(დონე 0)</span>';
        const pcD0 = document.getElementById('pc-desc-0');
        if (pcD0) pcD0.textContent = isEn ? 'Child selects card autonomously, without gestures or physical prompting' : 'ბავშვი ირჩევს ბარათს ავტონომიურად, ჟესტებისა და ფიზიკური ჩარევის გარეშე';

        const pcT1 = document.getElementById('pc-title-1');
        if (pcT1) pcT1.innerHTML = isEn ? 'Partial Prompt <span class="pc-tag-eng">(Level 1)</span>' : 'ნაწილობრივი დახმარება <span class="pc-tag-eng">(დონე 1)</span>';
        const pcD1 = document.getElementById('pc-desc-1');
        if (pcD1) pcD1.textContent = isEn ? 'Verbal cue, gestural pointing, or light physical guidance' : 'ვერბალური მინიშნება, ჟესტით მითითება ან მსუბუქი ფიზიკური მიმართვა';

        const pcT2 = document.getElementById('pc-title-2');
        if (pcT2) pcT2.innerHTML = isEn ? 'Full Physical Prompt <span class="pc-tag-eng">(Level 2)</span>' : 'სრული ფიზიკური დახმარება <span class="pc-tag-eng">(დონე 2)</span>';
        const pcD2 = document.getElementById('pc-desc-2');
        if (pcD2) pcD2.textContent = isEn ? 'Hand-over-hand full physical assistance and transfer' : 'ხელი-ხელზე გაცვლის სრული ფიზიკური თანხლება';

        const psTitle = document.getElementById('ps-title-switch');
        if (psTitle) psTitle.textContent = isEn ? '🔔 Quick Popup on Tap:' : '🔔 სწრაფი ფანჯარა შეხებისას:';
        const psSub = document.getElementById('ps-sub-switch');
        if (psSub) psSub.textContent = isEn ? 'Confirm prompt level every time a card is tapped' : 'დაადასტურეთ დახმარების დონე ბარათზე ყოველი შეხების დროს';

        const modalClose = document.querySelector('#prompt-level-modal .modal-close-btn');
        if (modalClose) modalClose.title = isEn ? 'Close' : 'დახურვა';
    }

    openPromptLevelModal() {
        pecsAudio.playWoodTap();
        this.translatePromptLevelModal();
        const modal = document.getElementById('prompt-level-modal');
        if (modal) {
            modal.style.display = 'flex';
            [0, 1, 2].forEach(lvl => {
                const btn = document.getElementById(`pc-btn-${lvl}`);
                if (btn) btn.classList.toggle('active', lvl === this.currentPromptLevel);
            });
            const chk = document.getElementById('chk-prompt-popup');
            if (chk) chk.checked = this.enablePromptPopup;
            const studioChk = document.getElementById('setting-toggle-prompt-popup');
            if (studioChk) studioChk.checked = this.enablePromptPopup;
        }
    }

    closePromptLevelModal() {
        const modal = document.getElementById('prompt-level-modal');
        if (modal) modal.style.display = 'none';
    }

    togglePromptPopup(enabled) {
        this.enablePromptPopup = !!enabled;
        localStorage.setItem('pecs_enable_prompt_popup', this.enablePromptPopup ? 'true' : 'false');
        pecsAudio.playWoodTap();
        const chk = document.getElementById('chk-prompt-popup');
        if (chk) chk.checked = this.enablePromptPopup;
        const studioChk = document.getElementById('setting-toggle-prompt-popup');
        if (studioChk) studioChk.checked = this.enablePromptPopup;

        if (this.enablePromptPopup) {
            this.showToast(this.isEn() ? "🔔 Quick prompt popup enabled on card tap" : "🔔 შეხებაზე დონის სწრაფი არჩევა ჩართულია");
        } else {
            this.closePromptTaggingOverlay();
            this.showToast(this.isEn() ? "🔕 Quick prompt popup disabled" : "🔕 შეხებაზე ფანჯარა გათიშულია");
        }
    }

    syncPromptLevelUI() {
        const info = this.getPromptLevelInfo();

        // 1. ჰედერის ღილაკი
        const headBtn = document.getElementById('btn-head-prompt');
        const headIcon = document.getElementById('head-prompt-icon');
        const headText = document.getElementById('head-prompt-text');
        const isEn = this.isEn();
        if (headBtn) {
            headBtn.className = `sensory-head-btn prompt-level-head-btn ${info.class}`;
            headBtn.title = isEn ? `🤝 Prompt Level: ${info.name} (click to change)` : `🤝 დახმარების დონე: ${info.name} (დააჭირეთ შესაცვლელად)`;
        }
        if (headIcon) headIcon.textContent = info.icon;
        if (headText) headText.textContent = info.name;

        // 2. ქვედა თერაპევტის ზოლის ღილაკი
        const tbIcon = document.getElementById('tb-prompt-icon');
        const tbLabel = document.getElementById('tb-prompt-label');
        if (tbIcon) tbIcon.textContent = info.icon;
        if (tbLabel) tbLabel.textContent = info.name;

        // 3. მობილურის მენიუს ღილაკი
        const drawerPromptIcon = document.getElementById('drawer-prompt-icon');
        const drawerPromptLabel = document.getElementById('drawer-prompt-label');
        if (drawerPromptIcon) drawerPromptIcon.textContent = info.icon;
        if (drawerPromptLabel) drawerPromptLabel.textContent = info.name;
    }

    showToast(text, duration = 1800) {
        if (!text) return;
        let finalText = text;
        if (this.isEn() && typeof finalText === 'string') {
            const toastMap = {
                'დახმარების დონე': 'Prompt Level',
                'დამოუკიდებლად': 'Independent',
                'ნაწილობრივ': 'Partial Prompt',
                'სრული დახმარება': 'Full Physical',
                'სამიზნე ბარათი': 'Target Card',
                'არასასურველი ბარათი': 'Distractor Card',
                'წარმატებით დაემატა დაფაზე': 'added to board',
                'წაიშალა დაფიდან': 'removed from board',
                'უკვე არის დაფაზე': 'already on board',
                'დაფა გასუფთავდა': 'Board cleared',
                'წინადადების ზოლი გასუფთავდა': 'Sentence strip cleared',
                'შეხებაზე დონის სწრაფი არჩევა ჩართულია': 'Quick prompt popup on tap enabled',
                'შეხებაზე ფანჯარა გათიშულია': 'Quick prompt popup disabled',
                'ბავშვის საკეტი ჩართულია': 'Child lock active',
                'საკეტი მოხსნილია': 'Child lock unlocked'
            };
            for (const [ka, en] of Object.entries(toastMap)) {
                if (finalText.includes(ka)) {
                    finalText = finalText.replace(new RegExp(ka, 'g'), en);
                }
            }
        }

        let toast = document.getElementById('pecs-global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pecs-global-toast';
            toast.style.cssText = `
                position: fixed;
                top: 62px;
                left: 50%;
                transform: translateX(-50%);
                background: #0F172A;
                color: #F8FAFC;
                padding: 8px 18px;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 800;
                box-shadow: 0 8px 24px rgba(0,0,0,0.28);
                z-index: 99999;
                pointer-events: none;
                transition: opacity 0.2s, transform 0.2s;
                opacity: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            document.body.appendChild(toast);
        }
        toast.innerHTML = finalText;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        if (this._toastTimer) clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
        }, duration);
    }

    closePromptTaggingOverlay() {
        const overlay = document.getElementById('prompt-tagging-overlay');
        if (overlay) overlay.style.display = 'none';
        if (this.promptTagTimeout) clearTimeout(this.promptTagTimeout);
        this.currentPendingEvent = null;
    }

    showPromptTaggingOverlay(eventObj) {
        if (!this.enablePromptPopup) return;

        this.currentPendingEvent = eventObj;
        const overlay = document.getElementById('prompt-tagging-overlay');
        if (!overlay) return;

        overlay.style.display = 'block';
        if (this.promptTagTimeout) clearTimeout(this.promptTagTimeout);

        // მშვიდი 4-წამიანი ავტო-დახურვა აჩქარებისა და წამზომის გარეშე
        this.promptTagTimeout = setTimeout(() => {
            overlay.style.display = 'none';
            this.currentPendingEvent = null;
        }, 4000);
    }

    recordPromptTag(level, levelName) {
        if (this.currentPendingEvent) {
            this.currentPendingEvent.promptLevel = level;
            this.currentPendingEvent.promptName = levelName;
            this.saveAnalytics();

            // აქტიური დონის სინქრონიზაცია
            this.currentPromptLevel = level;
            localStorage.setItem('pecs_prompt_level', level);
            this.syncPromptLevelUI();

            pecsAudio.playWoodTap();
            this.closePromptTaggingOverlay();
        }
    }

    // თავსებადობა
    togglePromptTimer() {
        this.cyclePromptLevel();
    }
    syncPromptTimerButton() {
        this.syncPromptLevelUI();
    }

    renderAnalyticsTab(filterContext = 'all') {
        const container = document.getElementById('studio-tab-analytics');
        if (!container) return;

        const profile = this.getActiveProfile();
        const todayStr = new Date().toLocaleDateString('ka-GE');
        const todayLogs = this.analyticsLogs.filter(l => l.date === todayStr);

        // 1. KPI მეტრიკები
        const totalLogs = this.analyticsLogs.length;
        const spontaneousCount = this.analyticsLogs.filter(l => l.context === 'spontaneous' || l.context === 'sentence_strip').length;
        const routineCount = this.analyticsLogs.filter(l => l.context === 'first_then_completed' || l.context === 'schedule_step').length;
        const gameCount = this.analyticsLogs.filter(l => l.context === 'game_receptive_success').length;
        const painCount = this.analyticsLogs.filter(l => l.context === 'pain_report').length;
        const trainerCount = this.analyticsLogs.filter(l => l.context === 'trainer_exchange').length;

        // 2. საათობრივი აქტივობა (09:00 - 20:00)
        const hourlyBuckets = { "09-11": 0, "11-13": 0, "13-15": 0, "15-17": 0, "17-19": 0, "19-21": 0 };
        this.analyticsLogs.forEach(l => {
            if (l.time) {
                const hour = parseInt(l.time.split(':')[0]);
                if (hour >= 9 && hour < 11) hourlyBuckets["09-11"]++;
                else if (hour >= 11 && hour < 13) hourlyBuckets["11-13"]++;
                else if (hour >= 13 && hour < 15) hourlyBuckets["13-15"]++;
                else if (hour >= 15 && hour < 17) hourlyBuckets["15-17"]++;
                else if (hour >= 17 && hour < 19) hourlyBuckets["17-19"]++;
                else if (hour >= 19 && hour < 21) hourlyBuckets["19-21"]++;
            }
        });
        const maxHourly = Math.max(...Object.values(hourlyBuckets), 1);

        const isEn = (this.isEn());
        const getChildDisplayName = (p) => {
            const prof = p || profile;
            if (!prof) return isEn ? 'Alex' : 'ალექსი';
            if (isEn) {
                return prof.name_en || (prof.name === 'ალექსი' || prof.name === 'დაჩი' || prof.name === 'ბავშვი 1' ? 'Alex' : (prof.name === 'მია' ? 'Mia' : (prof.name === 'ლუკა' ? 'Lucas' : prof.name)));
            }
            return prof.name_ka || (prof.name === 'Alex' ? 'ალექსი' : (prof.name === 'Mia' ? 'მია' : (prof.name === 'Lucas' ? 'ლუკა' : prof.name)));
        };
        const childDisplayName = getChildDisplayName(profile);

        // 3. ტოპ 5 მოთხოვნილი ბარათი (Mand Vocabulary only - excludes system phase switches and routine schedules)
        const wordFreq = {};
        const nonMandContexts = ['phase_switched', 'schedule_step', 'first_then_completed', 'iep_goal'];
        this.analyticsLogs.forEach(l => {
            if (l.text && !nonMandContexts.includes(l.context) && !l.text.includes('ფაზა შეცვლილია') && !l.text.includes('Phase Switched') && !l.text.includes('მიზანი') && !l.text.includes('Goal') && !l.text.includes('განრიგის ნაბიჯი') && !l.text.includes('Schedule step')) {
                let label = isEn ? (l.text_en || this.translateAbaText(l.text) || l.text) : l.text;
                if (isEn) {
                    label = label.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').trim();
                }
                if (label) {
                    wordFreq[label] = (wordFreq[label] || 0) + 1;
                }
            }
        });
        const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const maxWordCount = topWords[0] ? topWords[0][1] : 1;

        // 4. გაფილტრული ჩანაწერები
        let displayLogs = this.analyticsLogs;
        if (filterContext !== 'all') {
            displayLogs = displayLogs.filter(l => l.context === filterContext);
        }

        const contextNameMap = isEn ? {
            'spontaneous': { name: 'Mand / Request', class: 'tag-spontaneous' },
            'sentence_strip': { name: 'Sentence Strip', class: 'tag-spontaneous' },
            'first_then_completed': { name: 'First/Then', class: 'tag-routine' },
            'schedule_step': { name: 'Schedule Routine', class: 'tag-routine' },
            'game_receptive_success': { name: 'Receptive Game', class: 'tag-game' },
            'pain_report': { name: 'Pain Report 🩺', class: 'tag-pain' },
            'trainer_exchange': { name: 'AAC Practice', class: 'tag-trainer' },
            'phase_switched': { name: 'Phase Switched', class: 'tag-trainer' },
            'sentence_building': { name: 'Sentence Building', class: 'tag-spontaneous' },
            'handover_exchange': { name: 'Handover 🤝', class: 'tag-spontaneous' }
        } : {
            'spontaneous': { name: 'მოთხოვნა (AAC)', class: 'tag-spontaneous' },
            'sentence_strip': { name: 'წინადადება', class: 'tag-spontaneous' },
            'first_then_completed': { name: 'First/Then', class: 'tag-routine' },
            'schedule_step': { name: 'განრიგი', class: 'tag-routine' },
            'game_receptive_success': { name: 'თამაში', class: 'tag-game' },
            'pain_report': { name: 'ტკივილი 🩺', class: 'tag-pain' },
            'trainer_exchange': { name: 'ეტაპის პრაქტიკა', class: 'tag-trainer' },
            'phase_switched': { name: 'ეტაპის შეცვლა', class: 'tag-trainer' },
            'sentence_building': { name: 'წინადადება', class: 'tag-spontaneous' },
            'handover_exchange': { name: 'გადაცემა 🤝', class: 'tag-spontaneous' }
        };

        container.innerHTML = `
            <div class="analytics-dashboard-wrap">
                <!-- ზედა სტატუსი -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:16px; font-weight:900; color:#0F172A; margin-bottom:2px;">
                            ${isEn ? '📊 ABA & Speech Clinical Dashboard' : '📊 ABA & მეტყველების კლინიკური პანელი'}
                        </h3>
                        <p style="font-size:12px; color:#64748B;">
                            ${isEn ? 'Patient:' : 'პაციენტი:'} <strong>${childDisplayName}</strong> (${isEn ? 'Age:' : 'ასაკი:'} ${profile.age || '-'} ${isEn ? 'years' : 'წელი'}) | ${isEn ? 'AAC Phase:' : 'ვიზუალური გაცვლა:'} <strong>${isEn ? 'Phase ' + (profile.phase || 1) : 'ეტაპი ' + (profile.phase || 1)}</strong>
                        </p>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                        <button class="btn-primary-action" style="font-size:12px; padding:6px 14px; width:auto; height:34px; min-height:34px; background:#10B981; border-color:#059669; display:inline-flex; align-items:center; gap:4px;" onclick="app.exportAnalyticsExcel()">
                            <span>📊</span> <span>Excel (.xlsx)</span>
                        </button>
                        <button class="icon-btn" style="font-size:12px; padding:6px 12px; height:34px; min-height:34px; display:inline-flex; align-items:center; gap:4px;" onclick="app.exportAnalyticsCsv()">
                            <span>📥</span> <span>CSV (BOM)</span>
                        </button>
                        <button class="btn-clear" style="font-size:12px; padding:6px 14px; width:auto; min-width:auto; height:34px; min-height:34px; border-radius:12px; display:inline-flex; align-items:center; gap:6px; box-sizing:border-box;" onclick="app.clearAnalyticsData()">
                            <span>🗑️</span> <span>${isEn ? 'Clear' : 'გასუფთავება'}</span>
                        </button>
                    </div>
                </div>

                <!-- 5 მთავარი კლინიკური KPI -->
                <div class="clinical-kpi-grid">
                    <div class="kpi-card kpi-primary">
                        <div class="kpi-val">${todayLogs.length}</div>
                        <div class="kpi-label">${isEn ? 'Today (Exchanges)' : 'დღეს (კომუნიკაცია)'}</div>
                    </div>
                    <div class="kpi-card kpi-success">
                        <div class="kpi-val">${spontaneousCount}</div>
                        <div class="kpi-label">${isEn ? 'Spontaneous Mand' : 'სპონტანური Mand'}</div>
                    </div>
                    <div class="kpi-card kpi-amber">
                        <div class="kpi-val">${routineCount}</div>
                        <div class="kpi-label">${isEn ? 'Routines (First/Then)' : 'რუტინები (First/Then)'}</div>
                    </div>
                    <div class="kpi-card kpi-blue">
                        <div class="kpi-val">${gameCount}</div>
                        <div class="kpi-label">${isEn ? 'Receptive Game' : 'რეცეპტული აღქმა'}</div>
                    </div>
                    <div class="kpi-card kpi-purple">
                        <div class="kpi-val">${painCount}</div>
                        <div class="kpi-label">${isEn ? 'Pain Reports' : 'ტკივილის ჩანაწერი'}</div>
                    </div>
                </div>

                <!-- ვიზუალური გრაფიკები (Charts) -->
                <div class="clinical-charts-row">
                    <!-- გრაფიკი 1: საათობრივი განაწილება -->
                    <div class="chart-card">
                        <div class="chart-card-title">
                            <span>${isEn ? '🕒 Hourly Communication Distribution' : '🕒 კომუნიკაციის საათობრივი დინამიკა'}</span>
                            <span style="font-size:11px; color:#64748B; font-weight:700;">${isEn ? 'Peak Hours' : 'პიკური საათები'}</span>
                        </div>
                        <div class="hourly-timeline-bars">
                            ${Object.entries(hourlyBuckets).map(([hourRange, count]) => {
                                const pct = Math.round((count / maxHourly) * 100);
                                return `
                                    <div class="timeline-bar-col">
                                        <div style="font-size:10px; font-weight:800; color:#0369A1;">${count > 0 ? count : ''}</div>
                                        <div class="timeline-bar-fill" style="height: ${Math.max(pct, 6)}%;"></div>
                                        <div class="timeline-bar-label">${hourRange}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- გრაფიკი 2: ტოპ მოთხოვნები (Mand Vocabulary) -->
                    <div class="chart-card">
                        <div class="chart-card-title">
                            <span>${isEn ? '⭐ Top Requested Words (Mand)' : '⭐ ყველაზე ხშირი მოთხოვნები (Top Mand)'}</span>
                            <span style="font-size:11px; color:#64748B; font-weight:700;">${isEn ? 'Frequency' : 'სიხშირე'}</span>
                        </div>
                        <div>
                            ${topWords.length > 0 ? topWords.map(([w, c]) => {
                                const pct = Math.round((c / maxWordCount) * 100);
                                return `
                                    <div class="progress-category-item">
                                        <div class="prog-item-header">
                                            <span>${w}</span>
                                            <span>${c} ${isEn ? 'times' : '-ჯერ'}</span>
                                        </div>
                                        <div class="prog-bar-track">
                                            <div class="prog-bar-fill" style="width:${pct}%; background:#10B981;"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('') : `<div style="color:#94A3B8; font-size:12px; text-align:center; padding:20px;">${isEn ? 'No data recorded yet' : 'მონაცემები ჯერ არ არის'}</div>`}
                        </div>
                    </div>
                </div>

                <!-- ფილტრები & ჟურნალი -->
                <div style="margin-top:6px;">
                    <div class="filter-pills-row">
                        <button class="filter-pill-btn ${filterContext === 'all' ? 'active' : ''}" onclick="app.renderAnalyticsTab('all')">${isEn ? 'All' : 'ყველა'} (${totalLogs})</button>
                        <button class="filter-pill-btn ${filterContext === 'sentence_strip' ? 'active' : ''}" onclick="app.renderAnalyticsTab('sentence_strip')">${isEn ? 'Sentences' : 'წინადადებები'} (${spontaneousCount})</button>
                        <button class="filter-pill-btn ${filterContext === 'first_then_completed' ? 'active' : ''}" onclick="app.renderAnalyticsTab('first_then_completed')">First/Then (${routineCount})</button>
                        <button class="filter-pill-btn ${filterContext === 'game_receptive_success' ? 'active' : ''}" onclick="app.renderAnalyticsTab('game_receptive_success')">${isEn ? 'Game' : 'თამაში'} (${gameCount})</button>
                        <button class="filter-pill-btn ${filterContext === 'pain_report' ? 'active' : ''}" onclick="app.renderAnalyticsTab('pain_report')">${isEn ? 'Pain' : 'ტკივილი'} (${painCount})</button>
                    </div>

                    <div style="max-height:240px; overflow-y:auto; border:2px solid #E2E8F0; border-radius:14px; background:#fff;">
                        <table class="analytics-table">
                            <thead>
                                <tr>
                                    <th>${isEn ? 'Date / Time' : 'თარიღი/დრო'}</th>
                                    <th>${isEn ? 'Communication Content' : 'კომუნიკაციის შინაარსი'}</th>
                                    <th>${isEn ? 'Category' : 'კატეგორია'}</th>
                                    <th>${isEn ? 'Latency' : 'რეაქცია (Latency)'}</th>
                                    <th>${isEn ? 'Prompt Level' : 'ჩარევა (Prompt)'}</th>
                                    <th>${isEn ? 'Child' : 'ბავშვი'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${displayLogs.slice(0, 35).map(log => {
                                    const meta = contextNameMap[log.context] || { name: log.context, class: 'tag-spontaneous' };
                                    const latSec = log.latencyMs ? (log.latencyMs / 1000).toFixed(1) + (isEn ? ' s' : ' წმ') : '-';
                                    const promptBadge = log.promptLevel === 1 
                                        ? `<span class="quick-tag-badge tag-routine">${isEn ? '🟡 Partial (1)' : '🟡 ნაწილობრივი (1)'}</span>` 
                                        : (log.promptLevel === 2 
                                            ? `<span class="quick-tag-badge tag-pain">${isEn ? '🔴 Full (2)' : '🔴 სრული (2)'}</span>` 
                                            : `<span class="quick-tag-badge tag-spontaneous">${isEn ? '🟢 Independent (0)' : '🟢 დამოუკიდებელი (0)'}</span>`);
                                    let logContent = isEn ? (this.translateAbaText(log.text_en || log.text) || log.text) : log.text;
                                    if (isEn && logContent) {
                                        logContent = logContent.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').replace(/\s{2,}/g, ' ').trim();
                                    }
                                    const logProfile = (this.profiles && this.profiles.find(pr => pr.id === log.profileId)) || profile;
                                    const rowChildName = getChildDisplayName(logProfile);

                                    return `
                                        <tr>
                                            <td style="color:#64748B; font-weight:700; white-space:nowrap;">${log.date} ${log.time}</td>
                                            <td><strong style="color:#0F172A;">${logContent}</strong></td>
                                            <td><span class="quick-tag-badge ${meta.class}">${meta.name}</span></td>
                                            <td style="font-weight:800; color:#0369A1;">${latSec}</td>
                                            <td>${promptBadge}</td>
                                            <td><span style="font-weight:700; color:#475569;">${rowChildName}</span></td>
                                        </tr>
                                    `;
                                }).join('') || `<tr><td colspan="6" style="text-align:center; padding:30px; color:#94A3B8;">${isEn ? 'No records found' : 'მონაცემები არ მოიძებნა'}</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    clearAnalyticsData() {
        const isEn = this.isEn();
        if (confirm(isEn ? "Are you sure you want to clear analytics history?" : "ნამდვილად გსურთ ანალიტიკის ისტორიის გასუფთავება?")) {
            this.analyticsLogs = [];
            this.saveAnalytics();
            this.renderAnalyticsTab();
            pecsAudio.playClear();
            this.showToast(isEn ? "🗑️ Analytics history cleared" : "🗑️ ანალიტიკის ისტორია გასუფთავდა");
        }
    }

    exportAnalyticsCsv() {
        const profile = this.getActiveProfile();
        const isEn = this.isEn();
        const childDisplayName = isEn 
            ? (profile.name_en || (profile.name === 'ალექსი' || profile.name === 'დაჩი' || profile.name === 'ბავშვი 1' || !profile.name ? 'Alex' : (profile.name === 'მია' ? 'Mia' : (profile.name === 'ლუკა' ? 'Lucas' : profile.name))))
            : (profile.name_ka || profile.name);
        // UTF-8 BOM (Byte Order Mark: \uFEFF)
        let csv = isEn 
            ? "\uFEFFDate,Time,Child,Communication Content,Category,Latency (sec),Prompt Level,Context\n"
            : "\uFEFFთარიღი,დრო,ბავშვი,კომუნიკაციის ტექსტი,კატეგორია,რეაქციის დრო (Latency წმ),თერაპევტის ჩარევა (Prompt),კონტექსტი\n";
        
        const contextNames = isEn ? {
            'spontaneous': 'Spontaneous Request (Mand)',
            'sentence_strip': 'Sentence Strip',
            'first_then_completed': 'First/Then Routine',
            'schedule_step': 'Daily Schedule',
            'game_receptive_success': 'Receptive Game',
            'pain_report': 'Pain Report',
            'trainer_exchange': 'AAC Practice',
            'phase_switched': 'Phase Switched',
            'sentence_building': 'Sentence Building',
            'handover_exchange': 'Partner Handover',
            'phase_1': 'AAC Phase 1',
            'phase_2': 'AAC Phase 2',
            'phase_3': 'AAC Phase 3'
        } : {
            'spontaneous': 'სპონტანური მოთხოვნა',
            'sentence_strip': 'წინადადების ზოლი',
            'first_then_completed': 'First/Then რუტინა',
            'schedule_step': 'დღის განრიგი',
            'game_receptive_success': 'შემეცნებითი თამაში',
            'pain_report': 'ტკივილის შეტყობინება',
            'trainer_exchange': 'AAC ეტაპის გავარჯიშება',
            'phase_switched': 'ეტაპის შეცვლა',
            'sentence_building': 'წინადადების აწყობა',
            'handover_exchange': 'ბარათის გადაცემა პარტნიორზე',
            'phase_1': 'AAC ფაზა 1',
            'phase_2': 'AAC ფაზა 2',
            'phase_3': 'AAC ფაზა 3'
        };

        this.analyticsLogs.forEach(l => {
            const ctxText = contextNames[l.context] || l.context;
            const latSec = l.latencyMs ? (l.latencyMs / 1000).toFixed(1) : '0';
            const promptName = l.promptName || (isEn ? 'Independent (0)' : 'დამოუკიდებელი (0)');
            let textContent = isEn ? (this.translateAbaText(l.text_en || l.text) || l.text) : l.text;
            if (isEn && textContent) {
                textContent = textContent.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').replace(/\s{2,}/g, ' ').trim();
            }
            csv += `"${l.date}","${l.time}","${childDisplayName}","${(textContent || '').replace(/"/g, '""')}","${ctxText}","${latSec}","${promptName}","${l.context}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = isEn ? `VoxisAAC_${childDisplayName}_ABA_Analytics.csv` : `VoxisAAC_${profile.name}_ABA_ანალიტიკა.csv`;
        a.click();
        pecsAudio.playSuccess();
    }

    exportAnalyticsExcel() {
        const profile = this.getActiveProfile();
        const isEn = this.isEn();
        const childDisplayName = isEn 
            ? (profile.name_en || (profile.name === 'ალექსი' || profile.name === 'დაჩი' || profile.name === 'ბავშვი 1' || !profile.name ? 'Alex' : (profile.name === 'მია' ? 'Mia' : (profile.name === 'ლუკა' ? 'Lucas' : profile.name))))
            : (profile.name_ka || profile.name);
        const todayStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'ka-GE');

        const contextNames = isEn ? {
            'spontaneous': 'Spontaneous Mand',
            'sentence_strip': 'Sentence Building',
            'first_then_completed': 'First/Then Routine',
            'schedule_step': 'Daily Schedule',
            'game_receptive_success': 'Receptive Game',
            'pain_report': 'Pain Report',
            'trainer_exchange': 'AAC Training',
            'phase_switched': 'Phase Switched',
            'sentence_building': 'Sentence Building',
            'handover_exchange': 'Partner Handover',
            'phase_1': 'AAC Phase 1',
            'phase_2': 'AAC Phase 2',
            'phase_3': 'AAC Phase 3'
        } : {
            'spontaneous': 'სპონტანური მოთხოვნა',
            'sentence_strip': 'წინადადების ზოლი',
            'first_then_completed': 'First/Then რუტინა',
            'schedule_step': 'დღის განრიგი',
            'game_receptive_success': 'შემეცნებითი თამაში',
            'pain_report': 'ტკივილის შეტყობინება',
            'trainer_exchange': 'AAC ეტაპის გავარჯიშება',
            'phase_switched': 'ეტაპის შეცვლა',
            'sentence_building': 'წინადადების აწყობა',
            'handover_exchange': 'ბარათის გადაცემა პარტნიორზე',
            'phase_1': 'AAC ფაზა 1',
            'phase_2': 'AAC ფაზა 2',
            'phase_3': 'AAC ფაზა 3'
        };

        // If SheetJS (XLSX) is available, generate a true modern .xlsx file
        if (typeof XLSX !== 'undefined') {
            try {
                const wb = XLSX.utils.book_new();

                // Sheet 1: Detailed Clinical Logs
                const headers = isEn ? [
                    'Date', 'Time', 'Patient', 'Communication / Word', 
                    'Context / Category', 'Latency (sec)', 'Prompt Level', 'Internal Context'
                ] : [
                    'თარიღი', 'დრო', 'პაციენტი', 'კომუნიკაციის შინაარსი', 
                    'კატეგორია / ტიპი', 'რეაქციის დრო (წმ)', 'ჩარევის დონე (Prompt)', 'შიდა კონტექსტი'
                ];

                const rows = [headers];
                let totalLatency = 0;
                let latencyCount = 0;
                let spontaneousCount = 0;
                let routineCount = 0;
                let gameCount = 0;

                this.analyticsLogs.forEach(l => {
                    const ctxText = contextNames[l.context] || l.context;
                    const latSec = l.latencyMs ? parseFloat((l.latencyMs / 1000).toFixed(1)) : 0;
                    if (latSec > 0) {
                        totalLatency += latSec;
                        latencyCount++;
                    }
                    if (l.context === 'spontaneous') spontaneousCount++;
                    if (l.context === 'first_then_completed' || l.context === 'schedule_step') routineCount++;
                    if (l.context === 'game_receptive_success') gameCount++;

                    const promptName = l.promptName || (isEn ? 'Independent (0)' : 'დამოუკიდებელი (0)');
                    let textContent = isEn ? (this.translateAbaText(l.text_en || l.text) || l.text) : l.text;
                    if (isEn && textContent) {
                        textContent = textContent.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').replace(/\s{2,}/g, ' ').trim();
                    }

                    rows.push([
                        l.date || todayStr,
                        l.time || '-',
                        childDisplayName,
                        textContent || '-',
                        ctxText,
                        latSec || 0,
                        promptName,
                        l.context || '-'
                    ]);
                });

                const wsLogs = XLSX.utils.aoa_to_sheet(rows);
                wsLogs['!cols'] = [
                    { wch: 13 }, // Date
                    { wch: 10 }, // Time
                    { wch: 16 }, // Patient
                    { wch: 32 }, // Word
                    { wch: 28 }, // Context
                    { wch: 20 }, // Latency
                    { wch: 26 }, // Prompt
                    { wch: 20 }  // Raw
                ];
                XLSX.utils.book_append_sheet(wb, wsLogs, isEn ? 'Clinical Logs' : 'კლინიკური ჟურნალი');

                // Sheet 2: Summary & KPIs
                const avgLatency = latencyCount > 0 ? (totalLatency / latencyCount).toFixed(1) + (isEn ? ' s' : ' წმ') : '-';
                const summaryRows = [
                    [isEn ? 'Voxis AAC — Clinical ABA Analytics Summary' : 'Voxis AAC — კლინიკური ABA ანალიტიკის შეჯამება'],
                    [],
                    [isEn ? 'Clinical Indicator' : 'კლინიკური პარამეტრი', isEn ? 'Value / Statistic' : 'მნიშვნელობა / სტატისტიკა'],
                    [isEn ? 'Patient' : 'პაციენტი', childDisplayName],
                    [isEn ? 'Age' : 'ასაკი', (profile.age || '-') + (isEn ? ' years' : ' წელი')],
                    [isEn ? 'Current Phase' : 'მიმდინარე AAC ეტაპი', isEn ? ('Phase ' + (profile.phase || 1)) : ('ეტაპი ' + (profile.phase || 1))],
                    [isEn ? 'Total Communication Exchanges' : 'სულ კომუნიკაციური გაცვლა', this.analyticsLogs.length],
                    [isEn ? 'Spontaneous Requests (Mand)' : 'სპონტანური მოთხოვნები (Mand)', spontaneousCount],
                    [isEn ? 'Completed Routines' : 'დასრულებული რუტინები', routineCount],
                    [isEn ? 'Cognitive Games Played' : 'შემეცნებითი თამაშები', gameCount],
                    [isEn ? 'Average Response Latency' : 'საშუალო რეაქციის დრო', avgLatency],
                    [isEn ? 'Report Generated' : 'გენერირების დრო', todayStr]
                ];
                const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
                wsSummary['!cols'] = [{ wch: 34 }, { wch: 30 }];
                XLSX.utils.book_append_sheet(wb, wsSummary, isEn ? 'Clinical Summary' : 'კლინიკური შეჯამება');

                // Generate modern .xlsx binary output
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = isEn ? `VoxisAAC_${childDisplayName}_ABA_Report.xlsx` : `VoxisAAC_${profile.name}_ABA_რეპორტი.xlsx`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                pecsAudio.playSuccess();
                this.showAlert(
                    isEn 
                        ? "Modern Excel (.xlsx) file downloaded successfully with dual sheets, auto-formatted columns, and clinical summaries!" 
                        : "თანამედროვე Excel (.xlsx) ფაილი წარმატებით გადმოიწერა! შეიცავს ორ ჩანართს (ჟურნალი + შეჯამება) და ქართულ უნიკოდს სრული ფორმატირებით.",
                    isEn ? "Excel (.xlsx) Exported" : "Excel (.xlsx) გადმოწერილია",
                    "📊"
                );
                return;
            } catch (err) {
                console.error("XLSX export error, falling back to CSV:", err);
            }
        }

        // Fallback: UTF-8 BOM CSV
        this.exportAnalyticsCsv();
    }

    // ========================================================
    // 10. 🖨️ დასაბეჭდი ბარათების სტუდია (Print Studio)
    // ========================================================
    getPrintableCardsPool() {
        const source = this.printSource || 'board';
        let pool = [];

        if (source === 'board') {
            pool = [...(this.cards || [])];
        } else if (source === 'custom') {
            pool = [...(this.customCards || [])];
        } else if (source === 'all') {
            const seen = new Set();
            const combined = [...(this.customCards || []), ...(this.cards || []), ...(this.aacLibrary || [])];
            combined.forEach(c => {
                const key = (c.id || c.text || '').toLowerCase().trim();
                if (key && !seen.has(key)) {
                    seen.add(key);
                    pool.push(c);
                }
            });
        } else {
            // Category filter: 'food', 'drinks', 'toys', 'actions', 'hygiene', 'feelings', 'people', 'animals', 'school', 'basic'
            const seen = new Set();
            const combined = [...(this.customCards || []), ...(this.cards || []), ...(this.aacLibrary || [])];
            combined.forEach(c => {
                if (c.category === source) {
                    const key = (c.id || c.text || '').toLowerCase().trim();
                    if (key && !seen.has(key)) {
                        seen.add(key);
                        pool.push(c);
                    }
                }
            });
        }

        // Apply search query if active
        if (this.printSearch && this.printSearch.trim()) {
            const q = this.printSearch.toLowerCase().trim();
            pool = pool.filter(c => 
                (c.text && c.text.toLowerCase().includes(q)) ||
                (c.text_en && c.text_en.toLowerCase().includes(q)) ||
                (c.spoken && c.spoken.toLowerCase().includes(q))
            );
        }

        return pool;
    }

    setPrintSource(src) {
        this.printSource = src;
        this.printPage = 0;
        this.updatePrintableCardsGrid();
    }

    setPrintSearch(query) {
        this.printSearch = query || '';
        this.printPage = 0;
        this.updatePrintableCardsGrid();
    }

    changePrintPage(delta) {
        const pool = this.getPrintableCardsPool();
        const totalPages = Math.max(1, Math.ceil(pool.length / 16));
        this.printPage = Math.max(0, Math.min(totalPages - 1, (this.printPage || 0) + delta));
        this.updatePrintableCardsGrid();
    }

    renderPrintableTab() {
        const container = document.getElementById('studio-tab-print');
        if (!container) return;

        const isEn = this.isEn();
        this.printSource = this.printSource || 'board';
        this.printPage = this.printPage || 0;
        this.printSearch = this.printSearch || '';

        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
                <div>
                    <h4 style="font-size:15px; font-weight:900; margin:0;">${isEn ? '🖨️ Print AAC Cards (A4 Sheet)' : '🖨️ AAC ბარათების ამობეჭდვა (A4 ფურცელი)'}</h4>
                    <p style="font-size:12px; color:#64748B; margin:3px 0 0 0;">${isEn ? 'Standard 5×5 cm cards with cut lines for laminating (16 cards per sheet)' : 'სტანდარტული 5×5 სმ ზომის ბარათები საჭრელი ხაზებით ლამინირებისთვის (16 ბარათი ფურცელზე)'}</p>
                </div>
                <div style="display:flex; gap:8px;">
                    <button type="button" class="icon-btn" style="padding:8px 12px; font-size:12px; font-weight:800; border-radius:10px;" onclick="app.openCardLibraryModal()">
                        ➕ ${isEn ? 'Card Library' : 'ბარათების ბაზა'}
                    </button>
                    <button class="btn-primary-action" style="width:auto; padding:8px 16px; font-size:13px; font-weight:800; border-radius:10px;" onclick="app.printCardsSheet()">
                        🖨️ ${isEn ? 'Print Sheet' : 'ფურცლის ბეჭდვა'}
                    </button>
                </div>
            </div>

            <!-- Filters Bar -->
            <div style="display:flex; gap:10px; align-items:center; margin-bottom:12px; flex-wrap:wrap; background:#F8FAFC; padding:10px 12px; border-radius:12px; border:1px solid #E2E8F0;">
                <div style="flex:1; min-width:200px;">
                    <select id="print-source-select" onchange="app.setPrintSource(this.value)" style="width:100%; box-sizing:border-box; padding:8px 12px; border-radius:8px; border:1.5px solid #CBD5E1; font-weight:700; font-size:13px; outline:none; background:#FFF; color:#1E293B; cursor:pointer;">
                        <option value="board" ${this.printSource === 'board' ? 'selected' : ''}>📌 ${isEn ? 'Current Board Cards' : 'მიმდინარე დაფის ბარათები'}</option>
                        <option value="all" ${this.printSource === 'all' ? 'selected' : ''}>📦 ${isEn ? 'All Cards Library (160+)' : 'სრული ბაზა (160+ ბარათი)'}</option>
                        <option value="custom" ${this.printSource === 'custom' ? 'selected' : ''}>✨ ${isEn ? 'My Custom Cards' : 'ჩემი შექმნილი ბარათები'}</option>
                        <option value="food" ${this.printSource === 'food' ? 'selected' : ''}>🍎 ${isEn ? 'Food' : 'საჭმელი'}</option>
                        <option value="drinks" ${this.printSource === 'drinks' ? 'selected' : ''}>💧 ${isEn ? 'Drinks' : 'სასმელი'}</option>
                        <option value="toys" ${this.printSource === 'toys' ? 'selected' : ''}>🧸 ${isEn ? 'Toys' : 'სათამაშოები'}</option>
                        <option value="actions" ${this.printSource === 'actions' ? 'selected' : ''}>🏃 ${isEn ? 'Actions' : 'მოქმედებები'}</option>
                        <option value="hygiene" ${this.printSource === 'hygiene' ? 'selected' : ''}>🧼 ${isEn ? 'Hygiene & Routine' : 'ჰიგიენა & რუტინა'}</option>
                        <option value="feelings" ${this.printSource === 'feelings' ? 'selected' : ''}>💖 ${isEn ? 'Emotions & Feelings' : 'ემოციები & შეგრძნებები'}</option>
                        <option value="people" ${this.printSource === 'people' ? 'selected' : ''}>👥 ${isEn ? 'People' : 'ადამიანები'}</option>
                        <option value="animals" ${this.printSource === 'animals' ? 'selected' : ''}>🐾 ${isEn ? 'Animals' : 'ცხოველები'}</option>
                        <option value="school" ${this.printSource === 'school' ? 'selected' : ''}>🏫 ${isEn ? 'School & Items' : 'სკოლა & ნივთები'}</option>
                        <option value="basic" ${this.printSource === 'basic' ? 'selected' : ''}>⚡ ${isEn ? 'Basic & Social' : 'საბაზისო & სოციალური'}</option>
                    </select>
                </div>
                <div style="flex:1; min-width:200px;">
                    <input type="text" id="print-search-input" value="${this.printSearch || ''}" placeholder="${isEn ? '🔍 Search cards to print...' : '🔍 მოძებნეთ დასაბეჭდი ბარათი...'}" oninput="app.setPrintSearch(this.value)" style="width:100%; box-sizing:border-box; padding:8px 12px; border-radius:8px; border:1.5px solid #CBD5E1; font-weight:700; font-size:13px; outline:none; background:#FFF;">
                </div>
            </div>

            <!-- Pagination Bar -->
            <div id="print-pagination-bar" style="margin-bottom:12px;"></div>

            <!-- 4x4 Grid Sheet Container -->
            <div id="printable-cards-container" class="printable-sheet-preview"></div>
        `;

        this.updatePrintableCardsGrid();
    }

    updatePrintableCardsGrid() {
        const isEn = this.isEn();
        const container = document.getElementById('printable-cards-container');
        const paginationBar = document.getElementById('print-pagination-bar');
        if (!container) return;

        const pool = this.getPrintableCardsPool();
        const cardsPerPage = 16;
        const totalPages = Math.max(1, Math.ceil(pool.length / cardsPerPage));
        
        if (this.printPage >= totalPages) this.printPage = 0;
        if (this.printPage < 0) this.printPage = 0;

        const startIdx = this.printPage * cardsPerPage;
        const pageCards = pool.slice(startIdx, startIdx + cardsPerPage);

        // Update Pagination Bar
        if (paginationBar) {
            paginationBar.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:10px; padding:6px 12px; font-size:12px; font-weight:800; color:#1E40AF;">
                    <button type="button" class="icon-btn" onclick="app.changePrintPage(-1)" ${this.printPage === 0 ? 'disabled style="padding:4px 10px; font-size:11px; opacity:0.4; cursor:not-allowed;"' : 'style="padding:4px 10px; font-size:11px; cursor:pointer;"'}>
                        ⬅️ ${isEn ? 'Prev Page' : 'წინა ფურცელი'}
                    </button>
                    <span>
                        📄 ${isEn ? 'Sheet' : 'ფურცელი'} ${this.printPage + 1} / ${totalPages} (${pool.length} ${isEn ? 'cards' : 'ბარათი'})
                    </span>
                    <button type="button" class="icon-btn" onclick="app.changePrintPage(1)" ${this.printPage >= totalPages - 1 ? 'disabled style="padding:4px 10px; font-size:11px; opacity:0.4; cursor:not-allowed;"' : 'style="padding:4px 10px; font-size:11px; cursor:pointer;"'}>
                        ${isEn ? 'Next Page' : 'შემდეგი ფურცელი'} ➡️
                    </button>
                </div>
            `;
        }

        // Render Cards Grid
        if (pageCards.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding:36px 12px; color:#64748B;">
                    <div style="font-size:32px; margin-bottom:8px;">🔍</div>
                    <div style="font-weight:800; font-size:14px; color:#334155;">${isEn ? 'No cards match this filter' : 'ბარათები ვერ მოიძებნა'}</div>
                    <div style="font-size:12px; margin-top:4px;">${isEn ? 'Try another category, clear search, or add a custom card.' : 'სცადეთ სხვა კატეგორია, გაასუფთავეთ ძიება ან დაამატეთ ახალი ბარათი.'}</div>
                </div>
            `;
            return;
        }

        container.innerHTML = pageCards.map(c => {
            const cardTitle = isEn ? (c.text_en || this.translateAbaText(c.text) || c.text) : c.text;
            const visual = c.image 
                ? `<img src="${c.image}" style="width:48px; height:48px; object-fit:cover; border-radius:8px; margin-bottom:4px;" alt="${cardTitle}">`
                : `<span style="font-size:42px; line-height:1;">${c.icon || '📌'}</span>`;
            return `
            <div class="printable-card-preview type-${c.type || 'basic'}">
                ${visual}
                <span style="font-size:12px; font-weight:800; margin-top:4px;">${cardTitle}</span>
            </div>
            `;
        }).join('');
    }

    printCardsSheet() {
        const isEn = this.isEn();
        const container = document.getElementById('printable-cards-container');
        if (!container) {
            window.print();
            return;
        }

        let printFrame = document.getElementById('voxis-print-iframe');
        if (printFrame) printFrame.remove();
        printFrame = document.createElement('iframe');
        printFrame.id = 'voxis-print-iframe';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        printFrame.style.visibility = 'hidden';
        document.body.appendChild(printFrame);

        const doc = printFrame.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="${isEn ? 'en' : 'ka'}">
            <head>
                <meta charset="utf-8">
                <title>${isEn ? 'Print AAC Cards (A4)' : 'AAC ბარათების ამობეჭდვა'}</title>
                <style>
                    @page { size: A4 portrait; margin: 10mm; }
                    * { box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #FFF;
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 12px;
                    }
                    .printable-card-preview {
                        border: 2px dashed #94A3B8;
                        border-radius: 12px;
                        padding: 14px 8px;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 110px;
                        page-break-inside: avoid;
                        background: #FAFAFA;
                    }
                    .printable-card-preview img {
                        width: 48px;
                        height: 48px;
                        object-fit: cover;
                        border-radius: 8px;
                        margin-bottom: 4px;
                        display: block;
                    }
                    .printable-card-preview span:first-child {
                        font-size: 42px;
                        display: block;
                    }
                    .printable-card-preview span:last-child {
                        font-size: 13px;
                        font-weight: 800;
                        margin-top: 6px;
                        display: block;
                        color: #0F172A;
                    }
                </style>
            </head>
            <body>
                <div class="grid">
                    ${container.innerHTML}
                </div>
            </body>
            </html>
        `);
        doc.close();

        setTimeout(() => {
            try {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
            } catch (e) {
                window.print();
            }
        }, 250);
    }

    // ========================================================
    // 11. ARASAAC API-ს სიმბოლოების ძიება (ქართული & ინგლისური)
    // ========================================================
    async searchArasaac(term) {
        const resultsBox = document.getElementById('arasaac-results');
        if (!term || term.trim().length < 1) {
            this.showDefaultArasaacPictograms();
            return;
        }

        const cleanTerm = term.trim().toLowerCase();
        
        // ქართული სიტყვების ავტომატური თარგმანი ARASAAC-ისთვის
        const geoMap = {
            "წყალი": "water", "წყალ": "water",
            "ვაშლი": "apple", "ვაშლ": "apple",
            "ბურთი": "ball", "ბურთ": "ball",
            "მანქანა": "car", "მანქან": "car",
            "პური": "bread", "პურ": "bread",
            "რძე": "milk",
            "წვენი": "juice", "წვენ": "juice",
            "სათამაშო": "toy", "სათამაშ": "toy",
            "დათვი": "bear", "დათუნია": "teddy bear",
            "ლეგო": "lego", "კუბიკი": "blocks", "კუბიკები": "blocks",
            "ბუშტები": "bubbles", "ბუშტი": "bubble",
            "ტუალეტი": "toilet",
            "ძაღლი": "dog", "ლეკვი": "puppy",
            "კატა": "cat", "ფისო": "cat",
            "ჩიტი": "bird",
            "დედა": "mother", "დე": "mother",
            "მამა": "father", "მა": "father",
            "ბებია": "grandmother", "ბაბუა": "grandfather",
            "ექიმი": "doctor", "მასწავლებელი": "teacher",
            "წიგნი": "book", "მუსიკა": "music",
            "ჭამა": "eat", "საჭმელი": "food",
            "დალევა": "drink",
            "თამაში": "play", "ძილი": "sleep",
            "ხელები": "hands", "დაბანა": "wash",
            "კბილები": "teeth", "გახეხვა": "brush",
            "შხაპი": "shower", "აბაზანა": "bath",
            "ტკივილი": "pain", "მტკივა": "hurt",
            "მუცელი": "stomach", "თავი": "head",
            "ბედნიერი": "happy", "მიხარია": "happy",
            "მწყინს": "sad", "მოწყენილი": "sad", "გავბრაზდი": "angry", "გაბრაზებული": "angry", "დაღლილი": "tired", "დავიღალე": "tired"
        };

        const queryTerm = geoMap[cleanTerm] || cleanTerm;

        const isEn = this.isEn();
        resultsBox.innerHTML = `<div style="color:#0D9488; font-size:13px; text-align:center; padding:10px;">${isEn ? `🔎 Searching: "<strong>${term}</strong>"...` : `🔎 იძებნება: "<strong>${term}</strong>" (${queryTerm})...`}</div>`;

        try {
            const res = await fetch(`https://api.arasaac.org/api/pictograms/en/bestsearch/${encodeURIComponent(queryTerm)}`);
            const items = await res.json();

            if (!items || items.length === 0) {
                resultsBox.innerHTML = `<div style="color:#EF4444; font-size:12px; text-align:center; padding:10px;">${isEn ? 'Symbol not found. Try searching in English or another word.' : 'სიმბოლო ვერ მოიძებნა. სცადეთ ინგლისურად ან სხვა სიტყვით.'}</div>`;
                return;
            }

            resultsBox.innerHTML = items.slice(0, 20).map(item => {
                const imgUrl = `https://static.arasaac.org/pictograms/${item._id}/${item._id}_300.png`;
                return `
                    <div class="arasaac-item" onclick="app.selectArasaacPictogram('${imgUrl}')">
                        <img src="${imgUrl}" alt="${item.keywords?.[0]?.keyword || ''}">
                        <span>${item.keywords?.[0]?.keyword || ''}</span>
                    </div>
                `;
            }).join('');
        } catch(e) {
            resultsBox.innerHTML = `<div style="color:#64748B; font-size:12px; text-align:center; padding:10px;">${isEn ? 'Offline mode: ARASAAC online search is unavailable. You can upload a personal photo.' : 'ინტერნეტის გარეშე ARASAAC ონლაინ ძებნა შეზღუდულია. შეგიძლიათ ატვირთოთ პირადი ფოტო.'}</div>`;
        }
    }

    showDefaultArasaacPictograms() {
        const resultsBox = document.getElementById('arasaac-results');
        if (!resultsBox) return;

        const defaults = [
            { id: 2248, name_ka: "წყალი", name_en: "Water" },
            { id: 2462, name_ka: "ვაშლი", name_en: "Apple" },
            { id: 2269, name_ka: "ბურთი", name_en: "Ball" },
            { id: 2339, name_ka: "მანქანა", name_en: "Car" },
            { id: 2430, name_ka: "ტუალეტი", name_en: "Toilet" },
            { id: 4570, name_ka: "დახმარება", name_en: "Help" },
            { id: 2369, name_ka: "ძილი", name_en: "Sleep" },
            { id: 2349, name_ka: "ჭამა", name_en: "Eat" },
            { id: 2276, name_ka: "სასმელი", name_en: "Drink" },
            { id: 3245, name_ka: "მიხარია", name_en: "Happy" },
            { id: 2606, name_ka: "მოწყენილი", name_en: "Sad" },
            { id: 2450, name_ka: "წიგნი", name_en: "Book" },
            { id: 2277, name_ka: "ველოსიპედი", name_en: "Bicycle" },
            { id: 4945, name_ka: "დათუნია", name_en: "Teddy bear" },
            { id: 2517, name_ka: "ძაღლი", name_en: "Dog" },
            { id: 2406, name_ka: "კატა", name_en: "Cat" }
        ];

        const isEn = this.isEn();
        resultsBox.innerHTML = defaults.map(item => {
            const imgUrl = `https://static.arasaac.org/pictograms/${item.id}/${item.id}_300.png`;
            const label = isEn ? item.name_en : `${item.name_ka} (${item.name_en.toLowerCase()})`;
            return `
                <div class="arasaac-item" onclick="app.selectArasaacPictogram('${imgUrl}')">
                    <img src="${imgUrl}" alt="${label}" onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><text y=\\'.9em\\' font-size=\\'90\\'>📌</text></svg>';">
                    <span>${label}</span>
                </div>
            `;
        }).join('');
    }

    selectArasaacPictogram(url) {
        this.selectedArasaacUrl = url;
        const isEn = this.isEn();
        const preview = document.getElementById('arasaac-selected-preview');
        if (preview) {
            preview.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; background:#EFF6FF; padding:8px 12px; border-radius:12px; margin-top:8px;">
                    <img src="${url}" style="width:36px; height:36px; object-fit:contain;">
                    <span style="font-size:12px; font-weight:800; color:#1D4ED8;">${isEn ? '✓ ARASAAC symbol selected!' : 'ARASAAC სიმბოლო არჩეულია!'}</span>
                </div>
            `;
        }
        pecsAudio.playTap();
    }

    // ========================================================
    // 12. მიკროფონით ხმის ჩაწერა
    // ========================================================
    async toggleVoiceRecording() {
        const btn = document.getElementById('btn-record-voice');
        const timerEl = document.getElementById('rec-timer');

        if (!pecsAudio.isRecording) {
            try {
                await pecsAudio.startRecording();
                btn.classList.add('recording');
                btn.innerHTML = this.isEn() ? '⏹️ Stop Recording' : '⏹️ ჩაწერის შეჩერება';
                this.recSeconds = 0;
                timerEl.innerText = '00:00';
                this.recTimer = setInterval(() => {
                    this.recSeconds++;
                    const s = this.recSeconds < 10 ? '0' + this.recSeconds : this.recSeconds;
                    timerEl.innerText = `00:${s}`;
                }, 1000);
            } catch(e) {
                this.showAlert((this.isEn() ? 'Microphone access failed: ' : 'მიკროფონთან წვდომა ვერ მოხერხდა: ') + e.message, 'მიკროფონი', '🎙️');
            }
        } else {
            clearInterval(this.recTimer);
            btn.classList.remove('recording');
            btn.innerHTML = this.isEn() ? '🔴 Record Again' : '🔴 ხმის ხელახლა ჩაწერა';
            try {
                this.currentRecordedAudio = await pecsAudio.stopRecording();
                document.getElementById('recorded-audio-preview').style.display = 'block';
                pecsAudio.playSuccess();
            } catch(e) {
                console.warn(e);
            }
        }
    }

    playCurrentRecordingPreview() {
        if (this.currentRecordedAudio) {
            pecsAudio.playAudioData(this.currentRecordedAudio);
        }
    }

    // ========================================================
    // 13. სტუდიის მოდალი & ტაბების გადართვა
    // ========================================================
    openParentalGate(mode = 'studio', targetTab = null) {
        this.gateMode = mode;
        this.gateTargetTab = targetTab;
        const isEn = this.isEn();
        
        let n1, n2, questionText;
        if (mode === 'unlock') {
            n1 = Math.floor(Math.random() * 5) + 2;
            n2 = Math.floor(Math.random() * 5) + 2;
            this.parentalAnswer = n1 + n2;
            questionText = `${n1} + ${n2} = ?`;
        } else {
            n1 = Math.floor(Math.random() * 5) + 3;
            n2 = Math.floor(Math.random() * 5) + 2;
            this.parentalAnswer = n1 * n2;
            questionText = `${n1} × ${n2} = ?`;
        }

        const iconEl = document.getElementById('gate-icon-badge');
        if (iconEl) iconEl.innerText = (mode === 'unlock') ? '🔓' : '🛡️';

        const qEl = document.getElementById('gate-question');
        if (qEl) qEl.innerText = questionText;

        const gateTitle = document.getElementById('gate-title');
        if (gateTitle) {
            if (mode === 'unlock') {
                gateTitle.innerText = isEn ? "Unlock Child Screen" : "ეკრანის განბლოკვა";
            } else {
                gateTitle.innerText = isEn ? "Parental Security Gate" : "მშობლის კარიბჭე";
            }
        }

        const gateSub = document.getElementById('gate-subtitle');
        if (gateSub) {
            if (mode === 'unlock') {
                gateSub.innerText = isEn ? "Solve the math puzzle to restore all controls:" : "საკეტის მოსახსნელად ამოხსენით ამოცანა:";
            } else {
                gateSub.innerText = isEn ? "Please solve the math puzzle to enter the Studio:" : "გთხოვთ ამოხსნათ მარტივი ამოცანა სტუდიაში შესასვლელად:";
            }
        }

        const gateInput = document.getElementById('gate-input');
        if (gateInput) {
            gateInput.value = '';
            gateInput.placeholder = "?";
            setTimeout(() => { try { gateInput.focus(); } catch(e){} }, 150);
        }

        const gateBtn = document.getElementById('gate-submit-btn');
        if (gateBtn) {
            if (mode === 'unlock') {
                gateBtn.innerText = isEn ? "Unlock Board" : "განბლოკვა";
            } else {
                gateBtn.innerText = isEn ? "Enter Studio" : "შესვლა";
            }
        }

        const cancelBtn = document.getElementById('gate-cancel-btn');
        if (cancelBtn) {
            cancelBtn.innerText = isEn ? "Cancel" : "გაუქმება";
        }

        const box = document.querySelector('#modal-gate .modal-box');
        if (box) box.classList.remove('shake-anim');

        document.getElementById('modal-gate').classList.add('active');
        if (window.voxisAI && typeof window.voxisAI.prefetchClinicalReport === 'function') {
            window.voxisAI.prefetchClinicalReport();
        }
    }

    appendGateInput(char) {
        const input = document.getElementById('gate-input');
        if (!input) return;
        if (window.pecsAudio) pecsAudio.playWoodTap();
        input.value = (input.value || '') + char;
    }

    clearGateInput() {
        const input = document.getElementById('gate-input');
        if (!input) return;
        if (window.pecsAudio) pecsAudio.playTap();
        input.value = (input.value || '').slice(0, -1);
    }

    checkParentalGate() {
        const isEn = this.isEn();
        const input = document.getElementById('gate-input');
        const val = parseInt(input ? input.value : NaN);
        
        if (val === this.parentalAnswer) {
            document.getElementById('modal-gate').classList.remove('active');
            
            if (this.gateMode === 'unlock') {
                this.isChildLocked = false;
                localStorage.removeItem('voxis_child_lock');
                document.body.classList.remove('child-lock-active');
                document.documentElement.classList.remove('child-lock-preactive');
                
                const banner = document.getElementById('child-lock-banner');
                if (banner) banner.style.display = 'none';

                const headLock = document.getElementById('btn-head-lock');
                if (headLock) {
                    headLock.classList.remove('locked');
                    headLock.title = isEn ? '🛡️ Child Screen Lock' : '🛡️ ეკრანის დაბლოკვა';
                }
                const tbLock = document.getElementById('tb-btn-lock');
                if (tbLock) tbLock.classList.remove('active');

                this.releaseWakeLock();
                if (window.pecsAudio) pecsAudio.playSuccess();
                this.showAlert(
                    isEn ? "Child lock removed! All therapist tools and controls are restored." : "საკეტი წარმატებით მოიხსნა. ყველა სამართავი ღილაკი დაბრუნდა!",
                    isEn ? "Screen Unlocked" : "განბლოკილია",
                    "🔓"
                );
            } else {
                if (this.gateTargetTab) {
                    this.activeStudioTab = this.gateTargetTab;
                    this.gateTargetTab = null;
                }
                this.openStudioModal();
            }
        } else {
            if (window.pecsAudio) pecsAudio.playTap();
            const box = document.querySelector('#modal-gate .modal-box');
            if (box) {
                box.classList.remove('shake-anim');
                void box.offsetWidth;
                box.classList.add('shake-anim');
            }
            if (input) {
                input.value = '';
                input.focus();
            }
            // Generate fresh math question
            this.openParentalGate(this.gateMode || 'studio', this.gateTargetTab);
        }
    }

    openMobileMenu() {
        if (this.isChildLocked) return;
        if (window.pecsAudio) pecsAudio.playTap();
        const modal = document.getElementById('modal-mobile-menu');
        if (modal) {
            modal.classList.add('active');
            this.syncMobileMenuUI();
        }
    }

    closeMobileMenu() {
        const modal = document.getElementById('modal-mobile-menu');
        if (modal) modal.classList.remove('active');
    }

    syncMobileMenuUI() {
        const isEn = this.isEn();
        const profile = this.getActiveProfile();
        const drawerName = document.getElementById('drawer-child-name');
        if (drawerName && profile) {
            let displayName = profile.name;
            if (isEn) {
                displayName = profile.name_en || (profile.name === 'ბავშვი 1' || profile.name === 'დაჩი' || profile.name === 'ალექსი' ? 'Alex' : (profile.name === 'მია' ? 'Mia' : (profile.name === 'ლუკა' ? 'Lucas' : profile.name)));
            } else {
                displayName = profile.name_ka || (profile.name === 'Alex' ? 'ალექსი' : (profile.name === 'Mia' ? 'მია' : (profile.name === 'Lucas' ? 'ლუკა' : profile.name)));
            }
            drawerName.textContent = displayName;
        }

        const profileHint = document.getElementById('drawer-profile-hint');
        if (profileHint) {
            profileHint.textContent = isEn ? 'Profile & Settings ›' : 'პროფილი და პარამეტრები ›';
        }

        const boardLabel = document.getElementById('drawer-board-label');
        if (boardLabel) boardLabel.textContent = isEn ? 'Board' : 'დაფა';

        const recordLabel = document.getElementById('drawer-record-label');
        if (recordLabel) recordLabel.textContent = isEn ? 'Record' : 'ჩაწერა';

        const audioLabel = document.getElementById('drawer-audio-label');
        if (audioLabel) audioLabel.textContent = isEn ? 'Audio' : 'ხმა';

        const sosLabel = document.getElementById('drawer-sos-label');
        if (sosLabel) sosLabel.textContent = isEn ? 'SOS' : 'SOS';

        const scheduleLabel = document.getElementById('drawer-schedule-label');
        if (scheduleLabel) scheduleLabel.textContent = isEn ? 'Schedule' : 'განრიგი';

        const timerLabel = document.getElementById('drawer-timer-label');
        if (timerLabel) timerLabel.textContent = isEn ? 'Timer' : 'ტაიმერი';

        const aiLabel = document.getElementById('drawer-ai-label');
        if (aiLabel) aiLabel.textContent = isEn ? 'Voxis AI' : 'Voxis AI';

        const gameLabel = document.getElementById('drawer-game-label');
        if (gameLabel) gameLabel.textContent = isEn ? 'Game' : 'თამაში';

        const studioLabel = document.getElementById('drawer-studio-label');
        if (studioLabel) studioLabel.textContent = isEn ? 'Studio' : 'სტუდია';

        const drawerFlag = document.getElementById('drawer-flag-img');
        if (drawerFlag) {
            drawerFlag.src = `assets/images/${isEn ? 'flag-gb.svg' : 'flag-ka.svg'}`;
        }
    }

    toggleLanguage() {
        const nextLang = (this.isKa()) ? 'en' : 'ka';
        localStorage.setItem('voxis_lang', nextLang);
        document.documentElement.lang = nextLang;
        if (document.body) {
            document.body.classList.toggle('lang-ka', nextLang === 'ka');
            document.body.classList.toggle('lang-en', nextLang === 'en');
        }

        this.translateBoardUI(nextLang);
        this.onLanguageChange(nextLang);

        if (window.voxisAI && typeof window.voxisAI.setLanguage === 'function') {
            try {
                window.voxisAI.setLanguage(nextLang);
            } catch (e) {
                console.warn('voxisAI.setLanguage error:', e);
            }
        }
        this.syncMobileMenuUI();
    }

    openAiConfig() {
        if (this.isChildLocked) return;
        this.openParentalGate('studio', 'voxis-ai');
    }

    openStudioModal() {
        const lang = this.isEn() ? 'en' : 'ka';
        this.translateStudioModalUI(lang);
        document.getElementById('modal-studio').classList.add('active');
        if (window.voxisAI && typeof window.voxisAI.prefetchClinicalReport === 'function') {
            window.voxisAI.prefetchClinicalReport();
        }
        this.initStudioTabsScroll();
        this.switchStudioTab(this.activeStudioTab || 'create-card');
        this.renderProfileListInStudio();
        this.showDefaultArasaacPictograms();
        const studioChk = document.getElementById('setting-toggle-prompt-popup');
        if (studioChk) studioChk.checked = this.enablePromptPopup;
        const voiceSelect = document.getElementById('studio-tts-voice-select');
        if (voiceSelect && window.pecsAudio) {
            voiceSelect.value = pecsAudio.getVoice();
        }
        if (window.voxisAI && typeof window.voxisAI.translateStudioUI === 'function') {
            window.voxisAI.translateStudioUI(lang);
        }
    }

    scrollStudioTabs(direction) {
        const nav = document.getElementById('studio-tabs-nav');
        if (nav) {
            nav.scrollBy({ left: direction * 220, behavior: 'smooth' });
            pecsAudio.playTap();
        }
    }

    initStudioTabsScroll() {
        const nav = document.getElementById('studio-tabs-nav');
        if (!nav || nav.dataset.scrollInited) return;
        nav.dataset.scrollInited = 'true';

        // 1. Mouse wheel horizontal scrolling
        nav.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                nav.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        // 2. Mouse click & drag to scroll
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        nav.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - nav.offsetLeft;
            scrollLeft = nav.scrollLeft;
        });

        window.addEventListener('mouseup', () => { isDown = false; });

        nav.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - nav.offsetLeft;
            const walk = (x - startX) * 1.5;
            nav.scrollLeft = scrollLeft - walk;
        });
    }

    openModal(modalId) {
        this.translateModalsUI(this.isEn() ? 'en' : 'ka');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = '';
            modal.classList.remove('active');
        }

        // 🛑 Cleanup modal-specific active tasks & audio
        if (modalId === 'modal-regulation') {
            if (this.isBreathingActive || this.breathingInterval) {
                this.isBreathingActive = false;
                clearInterval(this.breathingInterval);
                this.breathingInterval = null;
                const circle = document.getElementById('breathing-circle');
                if (circle) circle.classList.remove('animating');
                const textEl = document.getElementById('breathing-text');
                if (textEl) textEl.innerText = this.isEn() ? "Breathe in..." : "ჩაისუნთქე...";
                const btnText = document.getElementById('breathing-btn-text');
                if (btnText) btnText.innerText = this.isEn() ? "Start Breathing" : "სუნთქვის დაწყება";
            }
            if (window.pecsAudio) {
                pecsAudio.stopPlayback();
            }
        } else if (modalId === 'modal-voice-studio') {
            if (window.pecsAudio) {
                pecsAudio.stopPlayback();
            }
        }
    }

    switchStudioTab(tabId) {
        this.activeStudioTab = tabId;
        pecsAudio.playTap();

        document.querySelectorAll('.studio-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // Smoothly auto-scroll active button into view
        const activeBtn = document.querySelector(`.studio-tab-btn[data-tab="${tabId}"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        const tabMap = {
            'create-card': 'studio-tab-create',
            'tools': 'studio-tab-tools',
            'voxis-ai': 'studio-tab-voxis-ai',
            'room-scanner': 'studio-tab-room-scanner',
            'analytics': 'studio-tab-analytics',
            'goals': 'studio-tab-goals',
            'profiles': 'studio-tab-profiles',
            'print': 'studio-tab-print',
            'report': 'studio-tab-report',
            'settings': 'studio-tab-settings'
        };

        Object.entries(tabMap).forEach(([tId, elId]) => {
            const el = document.getElementById(elId);
            if (el) {
                el.style.display = (tabId === tId) ? 'block' : 'none';
            }
        });

        if (tabId === 'settings') {
            this.syncGridSizeUI();
            this.syncTouchSettingsUI();
        }

        if (tabId === 'profiles') this.renderProfileListInStudio();
        if (tabId === 'room-scanner') this.renderRoomScannerTab();
        if (tabId === 'analytics') this.renderAnalyticsTab();
        if (tabId === 'goals') this.renderGoalsTab();
        if (tabId === 'print') this.renderPrintableTab();
        if (tabId === 'report') this.renderClinicalReportTab();

        const currentLang = this.isEn() ? 'en' : 'ka';
        this.translateStudioModalUI(currentLang);
        if (window.voxisAI && typeof window.voxisAI.translateStudioUI === 'function') {
            window.voxisAI.translateStudioUI(currentLang);
        }
    }

    renderProfileListInStudio() {
        const container = document.getElementById('studio-profiles-list');
        if (!container) return;
        const isEn = (this.isEn());

        const titleEl = document.querySelector('#studio-tab-profiles h4');
        if (titleEl) titleEl.innerText = isEn ? 'Clinical Profiles List' : 'თერაპიული პროფილების სია';

        const addBtn = document.querySelector('#studio-tab-profiles .icon-btn');
        if (addBtn) addBtn.innerText = isEn ? '➕ New Child' : '➕ ახალი ბავშვი';

        const phaseLabel = (phaseNum) => {
            if (isEn) {
                const map = { 1: 'Phase I (Physical)', 2: 'Phase II (Distance)', 3: 'Phase III (Discrim.)', 4: 'Phase IV (Sentence)', 5: 'Phase V (Responsive)', 6: 'Phase VI (Comment)' };
                return map[phaseNum] || `Phase ${phaseNum}`;
            } else {
                const map = { 1: 'ეტაპი I (გაცვლა)', 2: 'ეტაპი II (მანძილი)', 3: 'ეტაპი III (გარჩევა)', 4: 'ეტაპი IV (წინადადება)', 5: 'ეტაპი V (რა გინდა?)', 6: 'ეტაპი VI (კომენტირება)' };
                return map[phaseNum] || `ეტაპი ${phaseNum}`;
            }
        };

        container.innerHTML = this.profiles.map(p => {
            const pName = this.getProfileDisplayName(p, isEn ? 'en' : 'ka');
            const isActive = p.id === this.activeProfileId;
            const genderStr = (p.gender === 'female') ? (isEn ? 'Girl' : 'გოგონა') : (isEn ? 'Boy' : 'ბიჭი');
            return `
            <div onclick="if('${p.id}' !== '${this.activeProfileId}') app.switchProfile('${p.id}')" style="display:flex; justify-content:space-between; align-items:center; background:${isActive ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' : '#F8FAFC'}; padding:12px 16px; border-radius:14px; border:2px solid ${isActive ? '#10B981' : '#CBD5E1'}; margin-bottom:10px; cursor:${isActive ? 'default' : 'pointer'}; transition:all 0.2s ease;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-size:28px; background:#FFFFFF; width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.06);">${p.avatar || '🧒'}</span>
                    <div>
                        <div style="font-weight:900; font-size:15px; color:#1E293B;">${pName} ${isActive ? `<span style="display:inline-block; margin-left:6px; font-size:11px; font-weight:800; background:#10B981; color:#fff; padding:2px 8px; border-radius:20px;">${isEn ? 'ACTIVE' : 'აქტიური'}</span>` : ''}</div>
                        <div style="font-size:12px; color:#64748B; margin-top:2px;">
                            <span>${isEn ? 'Age:' : 'ასაკი:'} <b>${p.age || '-'}</b> ${isEn ? 'yrs' : 'წ.'}</span>
                            <span style="margin:0 6px;">•</span>
                            <span>${isEn ? 'Gender:' : 'სქესი:'} <b>${genderStr}</b></span>
                            <span style="margin:0 6px;">•</span>
                            <span style="color:#0284C7; font-weight:700;">${phaseLabel(p.phase || 1)}</span>
                        </div>
                    </div>
                </div>
                <div>
                    ${!isActive ? `
                        <button class="icon-btn" onclick="event.stopPropagation(); app.switchProfile('${p.id}')" style="background:#2563EB; color:white; border:none; padding:8px 16px; border-radius:10px; font-weight:800; font-size:13px; cursor:pointer; box-shadow:0 2px 8px rgba(37,99,235,0.25);">${isEn ? 'Select' : 'არჩევა'}</button>
                    ` : `<span style="font-size:13px; font-weight:900; color:#10B981; display:flex; align-items:center; gap:4px;">✓ ${isEn ? 'Selected' : 'არჩეულია'}</span>`}
                </div>
            </div>
        `;
        }).join('');
    }

    handleCreateNewProfile() {
        const modal = document.getElementById('modal-create-child-profile');
        if (!modal) return;

        // Reset fields
        const nameInput = document.getElementById('ccm-child-name');
        if (nameInput) {
            nameInput.value = '';
            nameInput.style.borderColor = '';
        }
        const ageInput = document.getElementById('ccm-child-age');
        if (ageInput) ageInput.value = '4';
        const genderSelect = document.getElementById('ccm-child-gender');
        if (genderSelect) genderSelect.value = 'male';
        const phaseSelect = document.getElementById('ccm-child-phase');
        if (phaseSelect) phaseSelect.value = '4';

        this.selectedNewProfileAvatar = '🧒';
        this.updateNewProfileAvatarUI();
        this.translateCreateProfileModalUI(this.isEn() ? 'en' : 'ka');

        modal.classList.add('active');
        if (nameInput) {
            setTimeout(() => nameInput.focus(), 150);
        }
    }

    selectNewProfileAvatar(avatar) {
        this.selectedNewProfileAvatar = avatar || '🧒';
        const genderSelect = document.getElementById('ccm-child-gender');
        if (genderSelect) {
            if (avatar === '👧' || avatar === '👱‍♀️') genderSelect.value = 'female';
            else if (avatar === '👦' || avatar === '👱‍♂️') genderSelect.value = 'male';
        }
        this.updateNewProfileAvatarUI();
        pecsAudio.playTap();
    }

    updateNewProfileAvatarUI() {
        const preview = document.getElementById('create-child-preview-avatar');
        if (preview) preview.textContent = this.selectedNewProfileAvatar || '🧒';
        document.querySelectorAll('.ccm-avatar-btn').forEach(btn => {
            const a = btn.getAttribute('data-avatar');
            btn.classList.toggle('active', a === (this.selectedNewProfileAvatar || '🧒'));
        });
    }

    submitCreateNewProfile() {
        const nameInput = document.getElementById('ccm-child-name');
        const name = nameInput ? nameInput.value.trim() : '';
        const isEn = this.isEn();

        if (!name) {
            if (nameInput) {
                nameInput.focus();
                nameInput.style.borderColor = '#EF4444';
                setTimeout(() => { nameInput.style.borderColor = ''; }, 1800);
            }
            this.showToast(isEn ? 'Please enter child\'s name' : 'გთხოვთ შეიყვანოთ ბავშვის სახელი', 'warning');
            return;
        }

        const ageInput = document.getElementById('ccm-child-age');
        const age = parseInt(ageInput ? ageInput.value : 4) || 4;
        const genderSelect = document.getElementById('ccm-child-gender');
        const gender = genderSelect ? genderSelect.value : 'male';
        const phaseSelect = document.getElementById('ccm-child-phase');
        const phase = parseInt(phaseSelect ? phaseSelect.value : 4) || 4;
        const avatar = this.selectedNewProfileAvatar || '🧒';

        this.createProfile(name, age, avatar, phase, gender);
        this.closeModal('modal-create-child-profile');

        if (typeof this.renderQuickProfileList === 'function') {
            this.renderQuickProfileList();
        }
        if (typeof this.renderProfileListInStudio === 'function') {
            this.renderProfileListInStudio();
        }

        pecsAudio.playSuccess();
        this.showToast(isEn ? `🎉 New child "${name}" created and selected!` : `🎉 ახალი მოსწავლე „${name}“ დაემატა და გააქტიურდა!`, 'success');
    }

    translateCreateProfileModalUI(lang) {
        const isEn = (lang === 'en');
        const title = document.getElementById('create-child-title');
        if (title) title.textContent = isEn ? 'Add New Child' : 'ახალი ბავშვის დამატება';
        const sub = document.getElementById('create-child-subtitle');
        if (sub) sub.textContent = isEn ? 'Personalized AAC Profile & Learning Phase' : 'პერსონალიზებული AAC პროფილი და სასწავლო ეტაპი';
        const avLbl = document.getElementById('ccm-avatar-label');
        if (avLbl) avLbl.textContent = isEn ? 'Choose Avatar' : 'აირჩიეთ ავატარი';
        const nmLbl = document.getElementById('ccm-name-label');
        if (nmLbl) nmLbl.textContent = isEn ? "Child's Name *" : "ბავშვის სახელი *";
        const nmInp = document.getElementById('ccm-child-name');
        if (nmInp) nmInp.placeholder = isEn ? "e.g. Nico, Anna, Lucas..." : "მაგ: ნიკო, ანა, ლუკა...";
        const ageLbl = document.getElementById('ccm-age-label');
        if (ageLbl) ageLbl.textContent = isEn ? 'Age' : 'ასაკი';
        const genLbl = document.getElementById('ccm-gender-label');
        if (genLbl) genLbl.textContent = isEn ? 'Gender' : 'სქესი';
        const phLbl = document.getElementById('ccm-phase-label');
        if (phLbl) phLbl.textContent = isEn ? 'Learning Phase' : 'სასწავლო ეტაპი';
        const btnCancel = document.getElementById('ccm-btn-cancel');
        if (btnCancel) btnCancel.textContent = isEn ? 'Cancel' : 'გაუქმება';
        const btnSubmitTxt = document.getElementById('ccm-btn-submit-text');
        if (btnSubmitTxt) btnSubmitTxt.textContent = isEn ? 'Create Profile' : 'პროფილის შექმნა';

        const genderSelect = document.getElementById('ccm-child-gender');
        if (genderSelect) {
            const curGen = genderSelect.value;
            genderSelect.innerHTML = isEn ? `
                <option value="male">Boy</option>
                <option value="female">Girl</option>
            ` : `
                <option value="male">ბიჭი</option>
                <option value="female">გოგონა</option>
            `;
            genderSelect.value = curGen || 'male';
        }

        const phaseSelect = document.getElementById('ccm-child-phase');
        if (phaseSelect) {
            const curVal = phaseSelect.value;
            phaseSelect.innerHTML = isEn ? `
                <option value="1">Phase I (Physical)</option>
                <option value="2">Phase II (Distance)</option>
                <option value="3">Phase III (Discrim.)</option>
                <option value="4">Phase IV (Sentence)</option>
                <option value="5">Phase V (Responsive)</option>
                <option value="6">Phase VI (Comment)</option>
            ` : `
                <option value="1">ეტაპი I (გაცვლა)</option>
                <option value="2">ეტაპი II (მანძილი)</option>
                <option value="3">ეტაპი III (გარჩევა)</option>
                <option value="4">ეტაპი IV (წინადადება)</option>
                <option value="5">ეტაპი V (რა გინდა?)</option>
                <option value="6">ეტაპი VI (კომენტირება)</option>
            `;
            phaseSelect.value = curVal || '4';
        }
    }

    translateCustomCardMakerUI(lang) {
        const isEn = (lang === 'en');
        const arasaacP = document.getElementById('arasaac-intro-p') || document.querySelector('.arasaac-intro-bar p');
        if (arasaacP) {
            arasaacP.innerHTML = isEn
                ? '🌐 <strong>ARASAAC Official Pictograms:</strong> Search any concept in English or Georgian — instant clinical symbol lookup with 1-click addition to your board.'
                : '🌐 <strong>ARASAAC-ის ოფიციალური პიქტოგრამები:</strong> ჩაწერეთ ნებისმიერი სიტყვა ქართულად ან ინგლისურად — სისტემა მყისიერად მოძებნის შესაბამის პიქტოგრამას და ერთი დაჭერით დაამატებს დაფაზე.';
        }
        const lblName = document.getElementById('cc-lbl-name');
        if (lblName) lblName.textContent = isEn ? 'Card Name (English / Georgian):' : 'ბარათის სახელი (ქართულად / ინგლისურად):';
        const inpText = document.getElementById('cc-input-text');
        if (inpText) inpText.placeholder = isEn ? 'e.g. Scooter, Cozy Blanket, Favorite Cookie...' : 'მაგ: სკუტერი, თბილი პლედი, საყვარელი ორცხობილა...';
        const lblSpoken = document.getElementById('cc-lbl-spoken');
        if (lblSpoken) lblSpoken.textContent = isEn ? 'Spoken Voice Phrase:' : 'გასახმოვანებელი ფრაზა:';
        const inpSpoken = document.getElementById('cc-input-spoken');
        if (inpSpoken) inpSpoken.placeholder = isEn ? 'Automatically vocalized from card name' : 'ავტომატურად გაჟღერდება ბარათის სახელიდან';
        const lblCategory = document.getElementById('cc-lbl-category');
        if (lblCategory) lblCategory.textContent = isEn ? 'Category:' : 'კატეგორია:';
        const catSelect = document.getElementById('cc-input-category');
        if (catSelect) {
            const curVal = catSelect.value;
            catSelect.innerHTML = isEn ? `
                <option value="food">🍎 Food</option>
                <option value="drinks">💧 Drinks</option>
                <option value="toys">🧸 Toys</option>
                <option value="actions">🏃 Actions</option>
                <option value="hygiene">🧼 Hygiene &amp; Routine</option>
                <option value="people">👥 People</option>
                <option value="feelings">💖 Emotions &amp; Feelings</option>
                <option value="animals">🐾 Animals</option>
                <option value="school">🏫 School &amp; Items</option>
                <option value="basic">⚡ Basic &amp; Social</option>
            ` : `
                <option value="food">🍎 საჭმელი</option>
                <option value="drinks">💧 სასმელი</option>
                <option value="toys">🧸 სათამაშო</option>
                <option value="actions">🏃 მოქმედება</option>
                <option value="hygiene">🧼 ჰიგიენა &amp; რუტინა</option>
                <option value="people">👥 ადამიანები</option>
                <option value="feelings">💖 ემოციები &amp; შეგრძნებები</option>
                <option value="animals">🐾 ცხოველები</option>
                <option value="school">🏫 სკოლა &amp; ნივთები</option>
                <option value="basic">⚡ საბაზისო &amp; სოციალური</option>
            `;
            catSelect.value = curVal || 'food';
        }
        const lblType = document.getElementById('cc-lbl-type');
        if (lblType) lblType.textContent = isEn ? 'Fitzgerald Type (Color):' : 'ფიტცჯერალდის ტიპი (ფერი):';
        const typeSelect = document.getElementById('cc-input-type');
        if (typeSelect) {
            const curVal = typeSelect.value;
            typeSelect.innerHTML = isEn ? `
                <option value="noun">Noun / Object (Orange)</option>
                <option value="verb">Action / Verb (Green)</option>
                <option value="people">Person / Social (Yellow)</option>
                <option value="social">Emotion / Social (Pink)</option>
                <option value="adjective">Descriptor (Blue)</option>
                <option value="basic">Basic (Gray)</option>
            ` : `
                <option value="noun">არსებითი / ნივთი (ნარინჯისფერი)</option>
                <option value="verb">მოქმედება / ზმნა (მწვანე)</option>
                <option value="people">ადამიანი / სოციალური (ყვითელი)</option>
                <option value="social">ემოცია / სოციალური (ვარდისფერი)</option>
                <option value="adjective">თვისება / ზედსართავი (ლურჯი)</option>
                <option value="basic">საბაზისო (ნაცრისფერი)</option>
            `;
            typeSelect.value = curVal || 'noun';
        }
        const lblVisual = document.getElementById('cc-lbl-visual');
        if (lblVisual) lblVisual.textContent = isEn ? 'Choose Imagery (Emoji or Photo):' : 'აირჩიეთ ვიზუალი (ემოჯი ან ფოტო):';
        const titleEmoji = document.getElementById('cc-opt-title-emoji');
        if (titleEmoji) titleEmoji.textContent = isEn ? '😀 Emoji Icon' : '😀 ემოჯი აიკონი';
        const optDivider = document.getElementById('cc-opt-divider');
        if (optDivider) optDivider.textContent = isEn ? 'OR' : 'ან';
        const titlePhoto = document.getElementById('cc-opt-title-photo');
        if (titlePhoto) titlePhoto.textContent = isEn ? '📷 Personal Photo (Camera or Upload)' : '📷 პირადი ფოტო (კამერა ან ფაილი)';
        const cameraText = document.getElementById('cc-upload-camera-text');
        if (cameraText) cameraText.textContent = isEn ? 'Take with Camera' : 'გადაღება კამერით';
        const fileText = document.getElementById('cc-upload-file-text');
        if (fileText) fileText.textContent = isEn ? 'Upload from Files' : 'ფაილის ატვირთვა';
        const removeBtn = document.getElementById('cc-upload-remove-btn');
        if (removeBtn) removeBtn.textContent = isEn ? '✕ Remove' : '✕ წაშლა';
        const statusTxt = document.getElementById('cc-upload-status-text');
        if (statusTxt && (statusTxt.textContent === 'Photo ready' || statusTxt.textContent === 'ფოტო მზადაა')) {
            statusTxt.textContent = isEn ? 'Photo ready' : 'ფოტო მზადაა';
        }
        const sizeTxt = document.getElementById('cc-upload-size-text');
        if (sizeTxt) sizeTxt.textContent = isEn ? '⚡ Optimized (30-40 KB)' : '⚡ ოპტიმიზებული (30-40 KB)';
        const createBtn = document.getElementById('btn-create-custom-card');
        if (createBtn) createBtn.innerHTML = `✨ ${isEn ? 'Create Card & Add to Board' : 'ბარათის შექმნა & დაფაზე დამატება'}`;
    }

    translateStudioModalUI(lang) {
        const isEn = (lang === 'en');

        // 1. Studio Header
        const stTitle = document.getElementById('studio-modal-title') || document.querySelector('#modal-studio .modal-title');
        if (stTitle) {
            stTitle.textContent = isEn ? '🎨 Therapist & Parental Studio' : '🎨 თერაპევტისა და მშობლის სტუდია';
        }
        const stSub = document.getElementById('studio-modal-subtitle') || document.querySelector('#modal-studio .modal-subtitle');
        if (stSub) {
            stSub.textContent = isEn 
                ? 'Professional Clinical Tools, ABA Analytics & Settings' 
                : 'პროფესიული კლინიკური ხელსაწყოები, ABA ანალიტიკა და პარამეტრები';
        }

        // 2. Studio Tabs Bar
        const tabNames = isEn ? {
            'create-card': '➕ Create Card',
            'tools': '🛠️ Tools',
            'voxis-ai': '✨ Voxis AI (Nemotron)',
            'room-scanner': '📸 AI Room Scanner',
            'analytics': '📊 ABA Analytics',
            'goals': '🎯 IEP Goals',
            'profiles': '👶 Profiles',
            'print': '🖨️ Print (A4)',
            'report': '📲 Daily Summary',
            'settings': '⚙️ Settings & Backup'
        } : {
            'create-card': '➕ ბარათის შექმნა',
            'tools': '🛠️ ხელსაწყოები',
            'voxis-ai': '✨ Voxis AI (ნემოტრონი)',
            'room-scanner': '📸 ოთახის AI სკანერი',
            'analytics': '📊 ABA ანალიტიკა',
            'goals': '🎯 IEP მიზნები',
            'profiles': '👶 პროფილები',
            'print': '🖨️ ბეჭდვა (A4)',
            'report': '📲 დღიური შეჯამება',
            'settings': '⚙️ პარამეტრები & რეზერვი'
        };

        document.querySelectorAll('#modal-studio .studio-tab-btn').forEach(btn => {
            const tab = btn.dataset.tab;
            if (tab && tabNames[tab]) {
                btn.innerHTML = tabNames[tab];
            }
        });

        // 3. Tools Tab (Clinical Modalities)
        const toolsTabHeader = document.getElementById('st-tools-title') || document.querySelector('#studio-tab-tools h4');
        if (toolsTabHeader) {
            toolsTabHeader.textContent = isEn ? '🛠️ Specialized Clinical Modalities' : '🛠️ სპეციალური კლინიკური მოდულები';
        }
        const toolsTabSub = document.getElementById('st-tools-desc') || document.querySelector('#studio-tab-tools p');
        if (toolsTabSub) {
            toolsTabSub.textContent = isEn ? 'Select an evidence-based clinical modality for this session' : 'აირჩიეთ მტკიცებულებითი მეთოდი მიმდინარე სესიისთვის';
        }

        const toolCardsData = [
            { id: 'st-card-firstthen', titleEn: 'First / Then Board', descEn: 'First (Demand) ➔ Then (Reward)', titleKa: 'პირველი / შემდეგ დაფა', descKa: 'ჯერ (მოთხოვნა) ➔ შემდეგ (ჯილდო)' },
            { id: 'st-card-tokenboard', titleEn: 'Token Economy Board', descEn: 'ABA Positive Reinforcement Stars', titleKa: 'ვარსკვლავების წახალისების დაფა', descKa: 'ABA პოზიტიური განმტკიცების ვარსკვლავები' },
            { id: 'st-card-schedule', titleEn: 'Daily Schedule', descEn: 'Visual Sequence of Daily Activities', titleKa: 'დღის ვიზუალური განრიგი', descKa: 'დღიური აქტივობების თანმიმდევრობა' },
            { id: 'st-card-painmap', titleEn: 'Body Pain Map', descEn: '"Where does it hurt?" Localization', titleKa: 'სხეულის შეგრძნებებისა & ტკივილის რუკა', descKa: '„სად მტკივა?“ — ლოკალიზაცია და შეგრძნებები' },
            { id: 'st-card-game', titleEn: 'Find the Card', descEn: 'Receptive Language Learning Game', titleKa: '„იპოვე ბარათი“ თამაში', descKa: 'რეცეპტული ენის განვითარება და გარჩევა' },
            { id: 'st-card-trainer', titleEn: '6-Phase AAC Trainer', descEn: 'Structured Visual Exchange Protocol', titleKa: '6-ეტაპიანი AAC ტრენაჟორი', descKa: 'სტრუქტურირებული ვიზუალური გაცვლის პროტოკოლი' },
            { id: 'st-card-regulation', titleEn: 'Self-Regulation', descEn: 'Calming Zones & Guided Breathing', titleKa: 'თვითრეგულაცია & სიმშვიდე', descKa: 'დამამშვიდებელი ზონები & მართვადი სუნთქვა' },
            { id: 'st-card-timer', titleEn: 'Visual Timer', descEn: 'Predictable Time Perception for ASD', titleKa: 'ვიზუალური ტაიმერი', descKa: 'დროის პროგნოზირებადი აღქმა აუტისტური სპექტრისთვის' },
            { id: 'st-card-quickchat', titleEn: 'Quick Social Chat', descEn: 'Instant Pragmatic Everyday Phrases', titleKa: 'სწრაფი სოციალური ფრაზები', descKa: 'მყისიერი ყოველდღიური პრაგმატული კომუნიკაცია' },
            { id: 'st-card-keyboard', titleEn: 'On-Screen Keyboard', descEn: 'Spelling, Typing & Speech Output', titleKa: 'ეკრანის კლავიატურა', descKa: 'აკრეფა, ასოების გარჩევა და გახმოვანება' }
        ];

        toolCardsData.forEach(item => {
            const card = document.getElementById(item.id);
            if (card) {
                const tEl = card.querySelector('.st-tool-title') || card.querySelector('strong');
                const dEl = card.querySelector('.st-tool-desc') || card.querySelector('span');
                if (tEl) tEl.textContent = isEn ? item.titleEn : item.titleKa;
                if (dEl) dEl.textContent = isEn ? item.descEn : item.descKa;
            }
        });

        // 4. Create Card Form Tab (studio-tab-create)
        const stCreateLblName = document.getElementById('st-create-lbl-name');
        if (stCreateLblName) stCreateLblName.textContent = isEn ? 'Card Name (English / Georgian):' : 'ბარათის სახელი (ქართულად / ინგლისურად):';
        const newCardText = document.getElementById('new-card-text');
        if (newCardText) newCardText.placeholder = isEn ? 'e.g. Favorite Teddy Bear, Water, Mom...' : 'მაგ: საყვარელი დათუნია, წყალი, დედა...';
        
        const stCreateLblSpoken = document.getElementById('st-create-lbl-spoken');
        if (stCreateLblSpoken) stCreateLblSpoken.textContent = isEn ? 'Spoken Phrase (if different):' : 'გასახმოვანებელი ფრაზა (თუ განსხვავდება):';
        const newCardSpoken = document.getElementById('new-card-spoken');
        if (newCardSpoken) newCardSpoken.placeholder = isEn ? 'e.g. I want my toy please' : 'მაგ: მინდა ჩემი სათამაშო, გთხოვ';

        const stRecTitle = document.getElementById('st-rec-title');
        if (stRecTitle) stRecTitle.textContent = isEn ? '🎙️ Record Parent / Therapist Voice:' : '🎙️ ჩაწერეთ მშობლის / თერაპევტის ხმა:';
        const stRecSub = document.getElementById('st-rec-sub');
        if (stRecSub) stRecSub.textContent = isEn ? 'Child will hear your authentic voice instead of synthesized TTS!' : 'ბავშვი მოისმენს თქვენს მშობლიურ თბილ ხმას სინთეზურის ნაცვლად!';
        const stRecStatus = document.getElementById('st-rec-status');
        if (stRecStatus) stRecStatus.textContent = isEn ? '✅ Voice Recorded!' : '✅ ხმა ჩაწერილია!';
        const stRecBtnPlay = document.getElementById('st-rec-btn-play');
        if (stRecBtnPlay) stRecBtnPlay.textContent = isEn ? '▶️ Play' : '▶️ მოსმენა';
        const btnRecVoice = document.getElementById('btn-record-voice');
        if (btnRecVoice && (btnRecVoice.textContent.includes('Record') || btnRecVoice.textContent.includes('ჩაწერა'))) {
            btnRecVoice.textContent = isEn ? '🔴 Record' : '🔴 ჩაწერა';
        }

        const stArasaacLbl = document.getElementById('st-arasaac-lbl');
        if (stArasaacLbl) stArasaacLbl.textContent = isEn ? '🔎 Select ARASAAC International Clinical Symbol:' : '🔎 აირჩიეთ ARASAAC-ის საერთაშორისო სიმბოლო:';
        const arasaacInp = document.getElementById('arasaac-search-input');
        if (arasaacInp) arasaacInp.placeholder = isEn ? 'Search (e.g. water, apple, car, sleep, dog)...' : 'მოძებნეთ (მაგ: წყალი, ვაშლი, მანქანა, ძილი, ძაღლი)...';

        const stLblEmoji = document.getElementById('st-lbl-emoji');
        if (stLblEmoji) stLblEmoji.textContent = isEn ? 'Or Emoji:' : 'ან ემოჯი:';
        const newCardIcon = document.getElementById('new-card-icon');
        if (newCardIcon) newCardIcon.placeholder = isEn ? 'e.g. 🧸, 🍎, ⭐' : 'მაგ: 🧸, 🍎, ⭐';
        const stLblPhoto = document.getElementById('st-lbl-photo');
        if (stLblPhoto) stLblPhoto.textContent = isEn ? 'Or Personal Photo (Camera / Gallery):' : 'ან პირადი ფოტო (კამერა / ფაილი):';
        const stBtnCam = document.getElementById('st-btn-camera-txt');
        if (stBtnCam) stBtnCam.textContent = isEn ? 'Camera' : 'კამერა';
        const stBtnGal = document.getElementById('st-btn-gallery-txt');
        if (stBtnGal) stBtnGal.textContent = isEn ? 'Gallery' : 'ფაილი';
        const stPhotoName = document.getElementById('new-card-photo-name');
        if (stPhotoName && (stPhotoName.textContent.includes('Optimized') || stPhotoName.textContent.includes('ოპტიმიზებული'))) {
            stPhotoName.textContent = isEn ? '⚡ Optimized' : '⚡ ოპტიმიზებული';
        }

        const stLblCat = document.getElementById('st-lbl-category');
        if (stLblCat) stLblCat.textContent = isEn ? 'Category:' : 'კატეგორია:';
        const newCardCat = document.getElementById('new-card-category');
        if (newCardCat) {
            const curVal = newCardCat.value;
            newCardCat.innerHTML = isEn ? `
                <option value="basic">Basic &amp; Social</option>
                <option value="food">Food</option>
                <option value="drinks">Drinks</option>
                <option value="toys">Toys</option>
                <option value="actions">Actions</option>
                <option value="feelings">Emotions / Pain</option>
                <option value="people">People</option>
                <option value="hygiene">Hygiene &amp; Routine</option>
            ` : `
                <option value="basic">საბაზისო &amp; სოციალური</option>
                <option value="food">საჭმელი</option>
                <option value="drinks">სასმელი</option>
                <option value="toys">სათამაშოები</option>
                <option value="actions">მოქმედებები</option>
                <option value="feelings">ემოციები / ტკივილი</option>
                <option value="people">ადამიანები</option>
                <option value="hygiene">ჰიგიენა &amp; რუტინა</option>
            `;
            newCardCat.value = curVal || 'basic';
        }

        const stLblType = document.getElementById('st-lbl-type');
        if (stLblType) stLblType.textContent = isEn ? 'Fitzgerald Type (Color Code):' : 'ფიტცჯერალდის ტიპი (ფერის კოდი):';
        const newCardType = document.getElementById('new-card-type');
        if (newCardType) {
            const curVal = newCardType.value;
            newCardType.innerHTML = isEn ? `
                <option value="noun">Noun / Object (Orange)</option>
                <option value="people">People / Pronoun (Yellow)</option>
                <option value="verb">Action / Verb (Green)</option>
                <option value="adjective">Descriptor (Blue)</option>
                <option value="social">Social / Emotion (Pink)</option>
                <option value="basic">Basic (Gray)</option>
            ` : `
                <option value="noun">არსებითი / ნივთი (ნარინჯისფერი)</option>
                <option value="people">ადამიანი / ნაცვალსახელი (ყვითელი)</option>
                <option value="verb">მოქმედება / ზმნა (მწვანე)</option>
                <option value="adjective">თვისება / ზედსართავი (ლურჯი)</option>
                <option value="social">სოციალური / ემოცია (ვარდისფერი)</option>
                <option value="basic">საბაზისო (ნაცრისფერი)</option>
            `;
            newCardType.value = curVal || 'noun';
        }

        const stBtnSaveCard = document.getElementById('st-btn-save-card');
        if (stBtnSaveCard) stBtnSaveCard.textContent = isEn ? '💾 Save Card & Add to Board' : '💾 ბარათის შენახვა & დაფაზე დამატება';

        const stVoiceTitle = document.getElementById('st-sec-voice-title');
        if (stVoiceTitle) stVoiceTitle.textContent = isEn ? 'Voice, Contrast & SOS Emergency Phone' : 'ხმა, კონტრასტი & SOS ნომერი';
        const stVoiceDesc = document.getElementById('st-sec-voice-desc');
        if (stVoiceDesc) stVoiceDesc.textContent = isEn ? 'Configure speech speed, high-contrast mode, and parent SOS number' : 'ხმის სისწრაფის, ვიზუალური კონტრასტისა და გადაუდებელი საკონტაქტო ნომრის მართვა';
        const stLblSpeaker = document.getElementById('st-lbl-speaker');
        if (stLblSpeaker) stLblSpeaker.textContent = isEn ? 'Speaker Voice:' : 'დიქტორის ხმა (Speaker Voice):';
        const voiceSel = document.getElementById('studio-tts-voice-select');
        if (voiceSel) {
            voiceSel.innerHTML = isEn 
                ? '<option value="bella" selected>✨ Bella (Bella - Eleven v4 / Warm & Clear)</option>'
                : '<option value="bella" selected>✨ ბელა (Bella - Eleven v4 / თბილი & სუფთა)</option>';
        }
        const stLblSpeed = document.getElementById('st-lbl-speed');
        if (stLblSpeed) stLblSpeed.textContent = isEn ? 'Voice Speed:' : 'ხმის სიჩქარე:';
        const speedSel = document.getElementById('studio-tts-speed-select');
        if (speedSel) {
            const curVal = speedSel.value;
            speedSel.innerHTML = isEn ? `
                <option value="0.7">Slow (0.7x)</option>
                <option value="0.85">Standard (0.85x)</option>
                <option value="1.0">Normal (1.0x)</option>
            ` : `
                <option value="0.7">ნელი (0.7x)</option>
                <option value="0.85">სტანდარტული (0.85x)</option>
                <option value="1.0">ჩვეულებრივი (1.0x)</option>
            `;
            speedSel.value = curVal || '0.85';
        }
        const stBtnContrast = document.getElementById('st-btn-contrast');
        if (stBtnContrast) stBtnContrast.textContent = isEn ? '🌓 High Contrast' : '🌓 მაღალი კონტრასტი';
        const stLblSos = document.getElementById('st-lbl-sos');
        if (stLblSos) stLblSos.textContent = isEn ? 'SOS Emergency Phone (Parent Number):' : 'SOS გადაუდებელი ტელეფონი (მშობლის ნომერი):';
        const stSosInp = document.getElementById('studio-sos-input');
        if (stSosInp) stSosInp.placeholder = isEn ? 'e.g. +1 555 123 4567' : 'მაგ: +995 555 12 34 56';
        const stBtnSos = document.getElementById('st-btn-sos-save');
        if (stBtnSos) stBtnSos.textContent = isEn ? 'Save' : 'შენახვა';
        const stBtnBackup = document.getElementById('st-btn-backup-json');
        if (stBtnBackup) stBtnBackup.textContent = isEn ? '📥 Backup Child Data (JSON File)' : '📥 ბავშვის მონაცემების შენახვა (JSON ფაილი)';

        // 5. Voxis AI Tab
        const copilotTitle = document.getElementById('voxis-copilot-title');
        if (copilotTitle) copilotTitle.textContent = isEn ? 'Voxis Clinical AI Copilot' : 'Voxis კლინიკური AI ასისტენტი';
        const copilotSub = document.getElementById('voxis-copilot-sub');
        if (copilotSub) copilotSub.textContent = isEn ? 'Powered by Nebius Token Factory & NVIDIA Nemotron Models' : 'Powered by Nebius Token Factory & NVIDIA Nemotron Models';
        const copilotApiBtn = document.getElementById('voxis-btn-api-settings');
        if (copilotApiBtn) copilotApiBtn.textContent = isEn ? '⚙️ API Settings' : '⚙️ API პარამეტრები';
        const copilotDesc = document.getElementById('voxis-copilot-desc');
        if (copilotDesc) {
            copilotDesc.innerHTML = isEn 
                ? 'Real-time behavioral telemetry processing on Nebius Token Factory. <strong>NVIDIA Nemotron 3 Ultra</strong> generates longitudinal BCBA progress reports, SMART IEP goals, and Carol Gray Social Stories, while <strong>Tavily Search AI</strong> queries evidence-based interventions.'
                : 'ქცევითი ტელემეტრიის დამუშავება Nebius Token Factory-ზე. <strong>NVIDIA Nemotron 3 Ultra</strong> აგენერირებს BCBA პროგრესის ანგარიშს, SMART IEP მიზნებს და კეროლ გრეის სოციალურ ისტორიებს, ხოლო <strong>Tavily Search AI</strong> იკვლევს მტკიცებულებით ინტერვენციებს.';
        }
        const btnGenRep = document.getElementById('btn-voxis-gen-report');
        if (btnGenRep) btnGenRep.textContent = isEn ? '🚀 Generate Clinical ABA Report (Nemotron 3 Ultra)' : '🚀 კლინიკური ABA რეპორტის გენერირება (Nemotron 3 Ultra)';
        const btnResearch = document.getElementById('btn-voxis-research');
        if (btnResearch) btnResearch.textContent = isEn ? '🔍 Research Evidence-Based Interventions (Tavily AI)' : '🔍 მტკიცებულებითი ინტერვენციების კვლევა (Tavily AI)';
        const repPlaceholder = document.getElementById('voxis-report-placeholder');
        if (repPlaceholder) {
            repPlaceholder.innerHTML = isEn 
                ? 'Click <strong>"Generate Clinical ABA Report"</strong> to trigger NVIDIA Nemotron 3 Ultra analysis.'
                : 'დააჭირეთ <strong>„კლინიკური ABA რეპორტის გენერირება“</strong>-ს ანალიზის დასაწყებად.';
        }

        // 6. Profiles Tab Header
        const stProfHeadTitle = document.getElementById('st-profiles-head-title');
        if (stProfHeadTitle) stProfHeadTitle.textContent = isEn ? 'Therapy Child Profiles' : 'თერაპიული პროფილების სია';
        const stBtnNewProf = document.getElementById('st-btn-new-profile');
        if (stBtnNewProf) stBtnNewProf.textContent = isEn ? '➕ New Child Profile' : '➕ ახალი ბავშვი';

        // 7. Settings Tab (Dimensions, Motor Guard, AI fidelity, Backup, Legal)
        const dimTitle = document.getElementById('dim-card-title');
        if (dimTitle) dimTitle.textContent = isEn ? 'Card and Grid Dimensions' : 'ბარათისა და ბადის ზომები';
        const dimDesc = document.getElementById('dim-card-desc');
        if (dimDesc) dimDesc.textContent = isEn ? 'Adjust card scale according to child motor skills and visual acuity' : 'დაარეგულირეთ ბარათის მასშტაბი ბავშვის მოტორიკისა და მხედველობის მიხედვით';

        const scbLarge = document.getElementById('scb-size-large');
        if (scbLarge) {
            const name = scbLarge.querySelector('.scb-name');
            const hint = scbLarge.querySelector('.scb-hint');
            if (name) name.textContent = isEn ? 'Large' : 'დიდი';
            if (hint) hint.textContent = isEn ? '~185px (Easy physical access)' : '~185px (მარტივი შეხება)';
        }
        const scbMedium = document.getElementById('scb-size-medium');
        if (scbMedium) {
            const name = scbMedium.querySelector('.scb-name');
            const hint = scbMedium.querySelector('.scb-hint');
            if (name) name.textContent = isEn ? 'Medium' : 'საშუალო';
            if (hint) hint.textContent = isEn ? '~130px (Gold standard)' : '~130px (ოქროს სტანდარტი)';
        }
        const scbCompact = document.getElementById('scb-size-compact');
        if (scbCompact) {
            const name = scbCompact.querySelector('.scb-name');
            const hint = scbCompact.querySelector('.scb-hint');
            if (name) name.textContent = isEn ? 'Compact' : 'კომპაქტური';
            if (hint) hint.textContent = isEn ? '~95px (More cards per screen)' : '~95px (მეტი ბარათი ეკრანზე)';
        }

        const touchTitle = document.getElementById('touch-card-title');
        if (touchTitle) touchTitle.textContent = isEn ? 'Touch Accessibility & Motor Guard (Anti-Spam & Tremor Shield)' : 'შეხების ხელმისაწვდომობა & მოტორული დაცვა (სპამ-კლიკებისა და ტრემორისგან)';
        const touchDesc = document.getElementById('touch-card-desc');
        if (touchDesc) touchDesc.textContent = isEn ? 'Protects against impulsive rapid repeated clicks and unintentional hand swipes' : 'იცავს იმპულსური მრავალჯერადი დაჭერისა და ხელის უნებლიე გასმისგან';

        const repeatTitle = document.getElementById('touch-repeat-title');
        if (repeatTitle) repeatTitle.textContent = isEn ? '🛑 Repeat Click Delay Filter:' : '🛑 განმეორებითი დაჭერის ფილტრი (Repeat Delay):';
        const repeatDesc = document.getElementById('touch-repeat-desc');
        if (repeatDesc) repeatDesc.textContent = isEn ? 'Debounce cooldown period between taps on the same card' : 'ერთი და იმავე ბარათის ზედიზედ სწრაფი დაჭერის დაბლოკვის დრო';

        const dwellTitle = document.getElementById('touch-dwell-title');
        if (dwellTitle) dwellTitle.textContent = isEn ? '⏳ Hold-to-Select (Dwell Activation Time):' : '⏳ დაყოვნებით არჩევა (Hold-to-Select / Dwell Time):';
        const dwellDesc = document.getElementById('touch-dwell-desc');
        if (dwellDesc) dwellDesc.textContent = isEn ? 'Card activates only after being held for the specified duration' : 'ბარათი გააქტიურდება მხოლოდ თითის მითითებული დროით დაჭერისას';

        // Translate Repeat Click Delay filter buttons
        document.querySelectorAll('#touch-repeat-options .scr-opt-btn').forEach(btn => {
            const delay = parseInt(btn.dataset.delay) || 0;
            if (delay === 0) {
                btn.textContent = isEn ? 'Disabled (0s)' : 'გამორთული (0წმ)';
            } else if (delay === 800) {
                btn.textContent = isEn ? '0.8s' : '0.8 წმ';
            } else if (delay === 1200) {
                btn.textContent = isEn ? '1.2s (Recommended)' : '1.2 წმ (რეკომენდებული)';
            } else if (delay === 2000) {
                btn.textContent = isEn ? '2.0s' : '2.0 წმ';
            }
        });

        // Translate Hold-to-Select (Dwell Time) buttons
        document.querySelectorAll('#touch-dwell-options .scr-opt-btn').forEach(btn => {
            const dwell = parseInt(btn.dataset.dwell) || 0;
            if (dwell === 0) {
                btn.textContent = isEn ? 'Instant (0s)' : 'მყისიერი (0წმ)';
            } else if (dwell === 300) {
                btn.textContent = isEn ? '0.3s' : '0.3 წმ';
            } else if (dwell === 500) {
                btn.textContent = isEn ? '0.5s' : '0.5 წმ';
            } else if (dwell === 800) {
                btn.textContent = isEn ? '0.8s' : '0.8 წმ';
            }
        });

        const aiPredTitle = document.getElementById('ai-pred-card-title');
        if (aiPredTitle) aiPredTitle.textContent = isEn ? 'AI Predictive Assistance & Clinical Protocol Fidelity' : 'AI პროგნოზირება & კლინიკური პროტოკოლის სიზუსტე';
        const aiPredDesc = document.getElementById('ai-pred-card-desc');
        if (aiPredDesc) aiPredDesc.textContent = isEn ? 'Adherence to Standardized Picture Exchange Communication Protocols' : 'სტანდარტიზებული ვიზუალური გაცვლის პროტოკოლის დაცვა';
        const aiToggleLabel = document.getElementById('ai-pred-toggle-label');
        if (aiToggleLabel) aiToggleLabel.textContent = isEn ? 'Enable Real-time AI Word Predictions on Child Board (High-Tech AAC Mode)' : 'AI სიტყვების რეალურ დროში პროგნოზირების ჩართვა დაფაზე (High-Tech AAC რეჟიმი)';
        const aiRecBox = document.getElementById('ai-pred-recommendation-box');
        if (aiRecBox) {
            aiRecBox.innerHTML = isEn
                ? '🛡️ <strong>ABA Clinical Recommendation (Default: OFF):</strong> Keep disabled during early exchange training (Phases 1-4). This protects spontaneous requesting (manding) and avoids prompt dependency. Enable only for advanced communicators who benefit from predictive suggestions.'
                : '🛡️ <strong>ABA კლინიკური რეკომენდაცია (ნაგულისხმევად: გამორთულია):</strong> დატოვეთ გამორთული საწყის ფაზებში (1-4 ეტაპი). ეს იცავს ბავშვს დამოუკიდებელი ინიციატივისა (მენდინგის) განვითარებაში და ხელს უშლის დახმარებაზე დამოკიდებულებას. ჩართეთ მხოლოდ გამოცდილი კომუნიკატორებისთვის.';
        }

        const fatigueCardTitle = document.getElementById('fatigue-guard-card-title');
        if (fatigueCardTitle) fatigueCardTitle.textContent = isEn ? 'AI Sensory Fatigue & Perseveration Guard' : 'AI სენსორული გადაღლისა და პერსევერაციის დეტექტორი';
        const fatigueCardDesc = document.getElementById('fatigue-guard-card-desc');
        if (fatigueCardDesc) fatigueCardDesc.textContent = isEn ? 'Behavioral meltdown prevention and repetitive click burst filter' : 'ქცევითი გადატვირთვის პრევენცია და იმპულსური განმეორებითი დაჭერის ფილტრი';
        const fatigueToggleLabel = document.getElementById('fatigue-guard-toggle-label');
        if (fatigueToggleLabel) fatigueToggleLabel.textContent = isEn ? 'Enable Sensory Fatigue & Perseveration Detector' : 'სენსორული გადაღლისა და პერსევერაციის დეტექტორის ჩართვა';
        const fatigueHint = document.getElementById('fatigue-guard-hint');
        if (fatigueHint) {
            fatigueHint.innerHTML = isEn
                ? '🧘 <strong>Therapist Discretion:</strong> When active, rapid perseverative tapping (5 taps within 3.5s) prompts a soothing breathing break. If the clinician determines calming intervention is not needed for this session, you can switch it OFF here anytime.'
                : '🧘 <strong>თერაპევტის გადაწყვეტილებით:</strong> როცა ჩართულია, იმპულსური განმეორებითი დაჭერისას (5 დაჭერა 3.5 წამში) სისტემა გვთავაზობს დამამშვიდებელ სუნთქვას. თუ თერაპევტი ჩათვლის, რომ ამ სესიაზე დამშვიდება საჭირო არაა, შეგიძლიათ ნებისმიერ დროს გამორთოთ აქედან.';
        }

        const promptCardTitle = document.getElementById('prompt-setting-card-title');
        if (promptCardTitle) promptCardTitle.textContent = isEn ? 'ABA Prompt Level Logging (Independence Tracking)' : 'ABA დახმარების დონის აღრიცხვა (Prompt Level)';
        const promptCardDesc = document.getElementById('prompt-setting-card-desc');
        if (promptCardDesc) promptCardDesc.textContent = isEn ? 'Automatic tracking of child independence vs. therapist prompts during communication' : 'ბავშვის დამოუკიდებლობისა და თერაპევტის დახმარების დონის ავტომატური აღრიცხვა';
        const promptToggleLabel = document.getElementById('setting-prompt-popup-label');
        if (promptToggleLabel) promptToggleLabel.textContent = isEn ? 'Enable Quick Prompt Popup on Card Tap' : 'ბარათზე შეხებისას სწრაფი არჩევის ფანჯარა (Quick Prompt Popup on Tap)';
        const promptHint = document.getElementById('prompt-setting-hint');
        if (promptHint) {
            promptHint.innerHTML = isEn
                ? '💡 <strong>When Enabled:</strong> Tapping a card displays a quick popup (🟢 Independent, 🟡 Partial, 🔴 Full) to log assistance.<br><strong>When Disabled:</strong> The popup is turned off to avoid interrupting the child, and prompt level is tracked solely via the header button.'
                : '💡 <strong>როცა ჩართულია:</strong> ბარათზე შეხებისას ეკრანზე ამოდის პატარა ფანჯარა (🟢 დამოუკიდებლად, 🟡 ნაწილობრივ, 🔴 სრული).<br><strong>როცა გამორთულია:</strong> ფანჯარა აღარ შეაწუხებს ბავშვს და დონე ინიშნება პირდაპირ ზედა ჰედერის ღილაკით.';
        }

        const backupTitle = document.getElementById('backup-card-title');
        if (backupTitle) backupTitle.textContent = isEn ? 'Data Backup & Restore' : 'მონაცემთა სარეზერვო ასლი & აღდგენა';
        const backupDesc = document.getElementById('backup-card-desc');
        if (backupDesc) backupDesc.textContent = isEn ? 'Download all customized cards, recorded voice clips, and child profiles, or restore onto another device' : 'ჩამოტვირთეთ ყველა ბარათი, დედის ჩაწერილი ხმა და ბავშვის პროფილები, ან აღადგინეთ სხვა მოწყობილობაზე';
        const b1Title = document.getElementById('backup-box1-title');
        if (b1Title) b1Title.textContent = isEn ? '📥 Create Full Backup' : '📥 სრული რეზერვის შექმნა';
        const b1Desc = document.getElementById('backup-box1-desc');
        if (b1Desc) b1Desc.textContent = isEn ? 'Downloads a secure JSON archive to your computer or phone.' : 'ჩამოტვირთავს უსაფრთხო JSON არქივს თქვენს მოწყობილობაში.';
        const b1Btn = document.getElementById('backup-box1-btn');
        if (b1Btn) b1Btn.textContent = isEn ? '💾 Download Full Backup (.json)' : '💾 სრული არქივის ჩამოტვირთვა (.json)';
        const b2Title = document.getElementById('backup-box2-title');
        if (b2Title) b2Title.textContent = isEn ? '📤 Restore from Backup' : '📤 არქივიდან აღდგენა';
        const b2Desc = document.getElementById('backup-box2-desc');
        if (b2Desc) b2Desc.textContent = isEn ? 'Select a previously downloaded JSON backup file to restore.' : 'აირჩიეთ ადრე შენახული JSON სარეზერვო ფაილი მონაცემების აღსადგენად.';
        const b2Btn = document.getElementById('backup-box2-btn');
        if (b2Btn) b2Btn.textContent = isEn ? '📂 Select File & Restore' : '📂 ფაილის არჩევა & აღდგენა';
        const bResetBtn = document.getElementById('backup-reset-btn');
        if (bResetBtn) bResetBtn.textContent = isEn ? '⚠️ Factory Reset to Defaults' : '⚠️ მონაცემების პირვანდელ მდგომარეობაში დაბრუნება (Reset)';

        // 7.5. Legal Notice & Trademark Disclaimer
        const legalTitle = document.getElementById('legal-card-title');
        if (legalTitle) legalTitle.textContent = isEn ? 'Legal Notice & Trademark Attribution' : 'სამართლებრივი შეტყობინება & სავაჭრო ნიშნები';
        const legalDesc = document.getElementById('legal-card-desc');
        if (legalDesc) legalDesc.textContent = isEn ? 'Compliance & Intellectual Property Disclaimers' : 'შესაბამისობა & ინტელექტუალური საკუთრების დეკლარაცია';
        const legalTm = document.getElementById('legal-trademark-text');
        if (legalTm) {
            legalTm.innerHTML = isEn
                ? '<strong>Trademarks:</strong> PECS® and Picture Exchange Communication System® are registered trademarks of <strong>Pyramid Educational Consultants, Inc.</strong>'
                : '<strong>სავაჭრო ნიშნები:</strong> PECS® და Picture Exchange Communication System® არის <strong>Pyramid Educational Consultants, Inc.</strong>-ის რეგისტრირებული სავაჭრო ნიშნები.';
        }
        const legalInd = document.getElementById('legal-independence-text');
        if (legalInd) {
            legalInd.innerHTML = isEn
                ? '<strong>Independence:</strong> <em>Voxis</em> is an independent multimodal AAC research and assistive technology platform. Voxis is not affiliated with, maintained, sponsored, or endorsed by Pyramid Educational Consultants, Inc.'
                : '<strong>დამოუკიდებლობა:</strong> <em>Voxis</em> არის დამოუკიდებელი მულტიმოდალური AAC დამხმარე ტექნოლოგიური პლატფორმა. Voxis არ არის აფილირებული, მხარდაჭერილი ან დაფინანსებული Pyramid Educational Consultants, Inc.-ის მიერ.';
        }
        const legalPic = document.getElementById('legal-pictograms-text');
        if (legalPic) {
            legalPic.innerHTML = isEn
                ? '<strong>Pictograms:</strong> ARASAAC symbols are published under Creative Commons (BY-NC-SA) license by the Government of Aragon.'
                : '<strong>პიქტოგრამები:</strong> ARASAAC-ის სიმბოლოები გამოქვეყნებულია Creative Commons (BY-NC-SA) ლიცენზიით არაგონის მთავრობის მიერ.';
        }

        // 8. Parental Gate
        const gateTitle = document.querySelector('#modal-gate .modal-title');
        if (gateTitle) gateTitle.textContent = isEn ? "Parental Gate" : "მშობლის დაცვა (კარიბჭე)";
        const gateSub = document.querySelector('#modal-gate .modal-subtitle');
        if (gateSub) gateSub.textContent = isEn ? "Please solve the simple math puzzle to enter the Studio:" : "სტუდიაში შესასვლელად გთხოვთ ამოხსნათ მარტივი ამოცანა:";
        const gateInput = document.getElementById('gate-input');
        if (gateInput) gateInput.placeholder = isEn ? "Answer" : "პასუხი";
        const gateBtn = document.querySelector('#modal-gate .btn-primary-action');
        if (gateBtn) gateBtn.textContent = isEn ? "Enter Studio" : "შესვლა";
    }

    addNewCustomCard() {
        const text = document.getElementById('new-card-text').value.trim();
        const spoken = document.getElementById('new-card-spoken').value.trim() || text;
        const icon = document.getElementById('new-card-icon').value.trim() || '⭐';
        const type = document.getElementById('new-card-type').value;
        const category = document.getElementById('new-card-category').value;

        if (!text) {
            this.showAlert('გთხოვთ ჩაწეროთ ბარათის სახელი', 'ყურადღება', '✏️');
            return;
        }

        if (this.isCardOnBoard(text)) {
            pecsAudio.playTap();
            this.showAlert(
                this.isEn() 
                    ? `Card "${text}" already exists on the board! Duplicate prevention is active.` 
                    : `ბარათი სახელით "${text}" უკვე არსებობს დაფაზე! დუბლიკატის შექმნა შეზღუდულია.`,
                this.isEn() ? 'Duplicate Card' : 'დუბლიკატია',
                '🛡️'
            );
            return;
        }

        const newCard = {
            id: 'custom_' + Date.now(),
            text: text,
            spoken: spoken,
            icon: icon,
            type: type,
            category: category,
            image: this.studioCardImageData || null,
            arasaacUrl: this.selectedArasaacUrl,
            audioRecord: this.currentRecordedAudio
        };

        this.customCards.push(newCard);
        this.cards.push(newCard);
        this.saveCustomCards();
        this.renderCardsGrid();
        this.closeModal('modal-studio');
        pecsAudio.playSuccess();
        this.showAlert('ახალი ბარათი წარმატებით შეინახა და დაემატა თქვენს დაფაზე!', 'ბარათი დაემატა', '✅');

        document.getElementById('new-card-text').value = '';
        document.getElementById('new-card-spoken').value = '';
        this.clearStudioCardPhoto();
        this.selectedArasaacUrl = null;
        this.currentRecordedAudio = null;
        const recPrev = document.getElementById('recorded-audio-preview');
        if (recPrev) recPrev.style.display = 'none';
    }

    exportProfile() {
        const backupData = {
            profile: this.getActiveProfile(),
            customCards: this.customCards,
            analytics: this.analyticsLogs
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `Voxis_${this.getActiveProfile().name}_Backup.json`);
        dlAnchor.click();
    }

    // ========================================================
    // 14. 🩺 სხეულის რუკა — „სად მტკივა?“ (Body Pain Map)
    // ========================================================
    selectPainZone(partName, icon) {
        this.selectedPainZone = { name: partName, icon: icon };
        pecsAudio.playTap();

        document.querySelectorAll('.body-part-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.part === partName);
        });

        this.updatePainStatement();
    }

    selectPainLevel(level, text) {
        this.selectedPainLevel = { level: level, text: text };
        pecsAudio.playTap();

        document.querySelectorAll('.pain-scale-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.level) === level);
        });

        this.updatePainStatement();
    }

    updatePainStatement() {
        if (!this.selectedPainZone) return;
        const isEn = this.isEn();
        const painNameMap = {
            'head': { en: 'Head', ka: 'თავი' },
            'eye': { en: 'Eye', ka: 'თვალი' },
            'ear': { en: 'Ear', ka: 'ყური' },
            'tooth': { en: 'Tooth', ka: 'კბილი' },
            'throat': { en: 'Throat', ka: 'ყელი' },
            'stomach': { en: 'Stomach', ka: 'მუცელი' },
            'hand': { en: 'Hand / Arm', ka: 'ხელი' },
            'leg': { en: 'Leg / Foot', ka: 'ფეხი' },
            'back': { en: 'Back', ka: 'ზურგი' },
            'თავი': { en: 'Head', ka: 'თავი' },
            'თვალი': { en: 'Eye', ka: 'თვალი' },
            'ყური': { en: 'Ear', ka: 'ყური' },
            'კბილი': { en: 'Tooth', ka: 'კბილი' },
            'ყელი': { en: 'Throat', ka: 'ყელი' },
            'მუცელი': { en: 'Stomach', ka: 'მუცელი' },
            'ხელი': { en: 'Hand / Arm', ka: 'ხელი' },
            'ფეხი': { en: 'Leg / Foot', ka: 'ფეხი' },
            'ზურგი': { en: 'Back', ka: 'ზურგი' }
        };
        const painLevelMap = {
            1: { en: 'hurts slightly', ka: 'ოდნავ მტკივა' },
            2: { en: 'hurts moderately', ka: 'საშუალოდ მტკივა' },
            3: { en: 'hurts severely!', ka: 'ძალიან მტკივა' }
        };

        const pInfo = painNameMap[this.selectedPainZone.name] || { en: this.selectedPainZone.name, ka: this.selectedPainZone.name };
        const partLabel = isEn ? pInfo.en : pInfo.ka;
        const lInfo = this.selectedPainLevel ? painLevelMap[this.selectedPainLevel.level] : null;
        const levelLabel = lInfo ? (isEn ? lInfo.en : lInfo.ka) : (isEn ? "hurts" : "მტკივა");
        const phrase = isEn ? `My ${partLabel} ${levelLabel}` : `${partLabel} ${levelLabel}`;
        
        const stmtEl = document.getElementById('pain-statement-text');
        if (stmtEl) stmtEl.innerText = phrase;
        pecsAudio.speak(phrase);
        this.logAbaEvent(phrase, 'pain_report');
    }

    addPainToSentenceStrip() {
        const isEn = this.isEn();
        if (!this.selectedPainZone) {
            this.showAlert(isEn ? 'Please select a body part on the map first' : 'გთხოვთ ჯერ აირჩიოთ სხეულის ნაწილი რუკაზე', isEn ? 'Body Pain Map' : 'სხეულის რუკა', '🩺');
            return;
        }
        const painNameMap = {
            'head': { en: 'Head', ka: 'თავი' },
            'eye': { en: 'Eye', ka: 'თვალი' },
            'ear': { en: 'Ear', ka: 'ყური' },
            'tooth': { en: 'Tooth', ka: 'კბილი' },
            'throat': { en: 'Throat', ka: 'ყელი' },
            'stomach': { en: 'Stomach', ka: 'მუცელი' },
            'hand': { en: 'Hand / Arm', ka: 'ხელი' },
            'leg': { en: 'Leg / Foot', ka: 'ფეხი' },
            'back': { en: 'Back', ka: 'ზურგი' },
            'თავი': { en: 'Head', ka: 'თავი' },
            'თვალი': { en: 'Eye', ka: 'თვალი' },
            'ყური': { en: 'Ear', ka: 'ყური' },
            'კბილი': { en: 'Tooth', ka: 'კბილი' },
            'ყელი': { en: 'Throat', ka: 'ყელი' },
            'მუცელი': { en: 'Stomach', ka: 'მუცელი' },
            'ხელი': { en: 'Hand / Arm', ka: 'ხელი' },
            'ფეხი': { en: 'Leg / Foot', ka: 'ფეხი' },
            'ზურგი': { en: 'Back', ka: 'ზურგი' }
        };
        const painLevelMap = {
            1: { en: 'hurts slightly', ka: 'ოდნავ მტკივა' },
            2: { en: 'hurts moderately', ka: 'საშუალოდ მტკივა' },
            3: { en: 'hurts severely!', ka: 'ძალიან მტკივა' }
        };

        const pInfo = painNameMap[this.selectedPainZone.name] || { en: this.selectedPainZone.name, ka: this.selectedPainZone.name };
        const partLabel = isEn ? pInfo.en : pInfo.ka;
        const lInfo = this.selectedPainLevel ? painLevelMap[this.selectedPainLevel.level] : null;
        const levelLabel = lInfo ? (isEn ? lInfo.en : lInfo.ka) : (isEn ? "hurts" : "მტკივა");
        const phrase = isEn ? `My ${partLabel} ${levelLabel}` : `${partLabel} ${levelLabel}`;

        const painCard = {
            id: 'pain_' + Date.now(),
            text: isEn ? `${pInfo.en} (${lInfo ? lInfo.en : 'hurts'})` : `${partLabel} (${levelLabel})`,
            text_en: `${pInfo.en} (${lInfo ? lInfo.en : 'hurts'})`,
            icon: this.selectedPainZone.icon || '🩹',
            type: 'social',
            spoken: phrase,
            spoken_en: `My ${pInfo.en} ${lInfo ? lInfo.en : 'hurts'}`
        };
        this.addCardToStrip(painCard);
        this.switchMainMode('aac');
    }

    // ========================================================
    // 15. ⭐ ABA წახალისების დაფა (Token Board)
    // ========================================================
    initTokenBoard(targetStars = 5) {
        this.tokenTarget = targetStars;
        this.earnedTokens = 0;
        this.renderTokenStars();
    }

    renderTokenStars() {
        const tray = document.getElementById('token-stars-tray');
        if (!tray) return;

        let html = '';
        for (let i = 0; i < this.tokenTarget; i++) {
            const isFilled = i < this.earnedTokens;
            html += `
                <div class="token-star-slot ${isFilled ? 'filled' : ''}" onclick="app.toggleTokenStar(${i})">
                    ${isFilled ? '⭐' : '☆'}
                </div>
            `;
        }
        tray.innerHTML = html;
    }

    toggleTokenStar(index) {
        if (index === this.earnedTokens) {
            this.earnedTokens++;
            pecsAudio.playSuccess();
            this.renderTokenStars();

            if (this.earnedTokens === this.tokenTarget) {
                setTimeout(() => {
                    pecsAudio.playFanfare();
                    const isEn = this.isEn();
                    const rewardText = document.getElementById('token-reward-input')?.value || (isEn ? 'Reward' : 'ჯილდო');
                    const winMsg = isEn ? `Great job! You collected all stars and earned: ${rewardText}!` : `ყოჩაღ! შენ შეაგროვე ყველა ვარსკვლავი და დაიმსახურე: ${rewardText}!`;
                    pecsAudio.speak(winMsg);
                    this.logAbaEvent(`Token Board: ${rewardText}`, 'token_board_win');
                    this.celebrate({
                        title: isEn ? "⭐ All Stars Collected!" : "⭐ ყველა ვარსკვლავი შეგროვდა!",
                        subtitle: isEn ? "You are a real champion!" : "შენ ნამდვილი ჩემპიონი ხარ!",
                        message: isEn ? `Earned your reward:<br><span class="reward-name" style="font-size:20px; margin-top:8px;">🎁 ${rewardText}</span>` : `დაიმსახურე შენი ჯილდო:<br><span class="reward-name" style="font-size:20px; margin-top:8px;">🎁 ${rewardText}</span>`,
                        avatar: "🌟",
                        buttonText: isEn ? "🎉 Claim Reward!" : "🎉 მივიღოთ ჯილდო!"
                    });
                }, 300);
            }
        } else if (index === this.earnedTokens - 1) {
            this.earnedTokens--;
            pecsAudio.playTap();
            this.renderTokenStars();
        }
    }

    resetTokenBoard() {
        this.earnedTokens = 0;
        pecsAudio.playClear();
        this.renderTokenStars();
    }

    // ========================================================
    // 16. ⏱️ ვიზუალური ტაიმერი (Visual Countdown Timer)
    // ========================================================
    openTimerModal() {
        this.translateModalsUI(this.isEn() ? 'en' : 'ka');
        document.getElementById('modal-timer').classList.add('active');
        if (!this.timerTotalSecs) {
            this.setTimerPreset(2); // დეფოლტად 2 წუთი
        }
    }

    setTimerPreset(minutes) {
        this.pauseTimer();
        this.timerTotalSecs = minutes * 60;
        this.timerLeftSecs = this.timerTotalSecs;
        this.updateTimerDisplay();
    }

    startTimer() {
        if (this.timerInterval) return;
        this.timerInterval = setInterval(() => {
            if (this.timerLeftSecs > 0) {
                this.timerLeftSecs--;
                this.updateTimerDisplay();
            } else {
                this.pauseTimer();
                pecsAudio.playFanfare();
                const isEn = this.isEn();
                pecsAudio.speak(isEn ? "Time is up, great job!" : "დრო დასრულდა, ყოჩაღ!");
                this.celebrate({
                    title: isEn ? "⏱️ Time is Up!" : "⏱️ დრო დასრულდა!",
                    subtitle: isEn ? "Timer countdown has finished" : "დროის მონაკვეთი ამოიწურა",
                    message: isEn ? "Great job, you managed your time wonderfully!" : "ყოჩაღ, დრო მშვენივრად გამოიყენე!",
                    avatar: "⏰",
                    buttonText: isEn ? "Continue 👍" : "გაგრძელება 👍"
                });
            }
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    resetTimer() {
        this.pauseTimer();
        this.timerLeftSecs = this.timerTotalSecs;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const m = Math.floor(this.timerLeftSecs / 60);
        const s = this.timerLeftSecs % 60;
        const displayStr = `${m}:${s < 10 ? '0' + s : s}`;
        const displayEl = document.getElementById('timer-time-display');
        if (displayEl) displayEl.innerText = displayStr;

        const path = document.getElementById('timer-progress-path');
        if (path && this.timerTotalSecs > 0) {
            const circumference = 2 * Math.PI * 85; // r=85
            const fraction = this.timerLeftSecs / this.timerTotalSecs;
            const offset = circumference * (1 - fraction);
            path.style.strokeDashoffset = offset;
        }
    }

    // ========================================================
    // 17. 🆘 გადაუდებელი დახმარება (SOS Emergency Beacon)
    // ========================================================
    openSosModal() {
        this.translateModalsUI(this.isEn() ? 'en' : 'ka');
        const p = this.getActiveProfile();
        const sosName = document.getElementById('sos-child-name');
        const sosPhone = document.getElementById('sos-parent-phone');
        const childName = this.getProfileDisplayName(p);
        
        if (sosName) sosName.innerText = childName;
        if (sosPhone) sosPhone.innerText = p.sosPhone || "599 00 00 00";

        document.getElementById('modal-sos').classList.add('active');
        this.playSosVoice();
    }

    playSosVoice() {
        const isEn = this.isEn();
        const p = this.getActiveProfile();
        const phone = p.sosPhone || (isEn ? "the emergency number" : "მითითებულ ნომერზე");
        const childName = this.getProfileDisplayName(p);
        const message = isEn
            ? `Attention please! My name is ${childName}. I communicate using this assistive board. Please help me and call my parent at: ${phone}`
            : `ყურადღება! მე მქვია ${childName}, მე ვსაუბრობ ამ საკომუნიკაციო დაფის დახმარებით. დამეხმარეთ, გთხოვთ დაურეკეთ მშობელს ტელეფონზე: ${phone}`;
        pecsAudio.speak(message);
    }

    saveSosPhone(newPhone) {
        const p = this.getActiveProfile();
        p.sosPhone = newPhone;
        this.saveProfiles();
        this.showAlert('SOS ტელეფონის ნომერი წარმატებით შეინახა!', 'SOS კონტაქტი', '🆘');
    }

    // ========================================================
    // 18. ⌨️ ქართული ანბანური კლავიატურა (Spelling Mode)
    // ========================================================
    openKeyboardModal() {
        this.translateModalsUI(this.isEn() ? 'en' : 'ka');
        this.keyboardText = "";
        this.keyboardLang = this.isEn() ? 'en' : 'ka';
        this.updateKeyboardDisplay();
        this.renderActiveKeyboard();
        document.getElementById('modal-keyboard').classList.add('active');
    }

    toggleKeyboardLanguage() {
        this.keyboardLang = this.keyboardLang === 'en' ? 'ka' : 'en';
        this.renderActiveKeyboard();
    }

    renderActiveKeyboard() {
        const container = document.getElementById('geo-keys-grid');
        if (!container) return;

        const isEnglish = this.keyboardLang === 'en';
        const kaAlphabet = [
            "ა","ბ","გ","დ","ე","ვ","ზ","თ","ი","კ","ლ",
            "მ","ნ","ო","პ","ჟ","რ","ს","ტ","უ","ფ","ქ",
            "ღ","ყ","შ","ჩ","ც","ძ","წ","ჭ","ხ","ჯ","ჰ"
        ];
        const enAlphabet = [
            "A","B","C","D","E","F","G","H","I","J","K",
            "L","M","N","O","P","Q","R","S","T","U","V",
            "W","X","Y","Z"
        ];

        const alphabet = isEnglish ? enAlphabet : kaAlphabet;
        const toggleBtn = `<button class="geo-key-btn" style="background:#0284C7; color:white; font-weight:800; font-size:12px; grid-column: span 2;" onclick="app.toggleKeyboardLanguage()">${isEnglish ? '🇬🇪 KA' : '🇬🇧 EN'}</button>`;

        container.innerHTML = alphabet.map(letter => `
            <button class="geo-key-btn" onclick="app.typeGeoLetter('${letter}')">${letter}</button>
        `).join('') + toggleBtn;
    }

    renderGeorgianKeyboard() {
        this.renderActiveKeyboard();
    }

    typeGeoLetter(letter) {
        pecsAudio.speak(letter);
        this.keyboardText += letter;
        this.updateKeyboardDisplay();
    }

    keyboardSpace() {
        this.keyboardText += " ";
        this.updateKeyboardDisplay();
    }

    keyboardBackspace() {
        this.keyboardText = this.keyboardText.slice(0, -1);
        this.updateKeyboardDisplay();
    }

    keyboardClear() {
        this.keyboardText = "";
        this.updateKeyboardDisplay();
    }

    keyboardSpeak() {
        if (!this.keyboardText) return;
        pecsAudio.speak(this.keyboardText);
        this.logAbaEvent(this.keyboardText, 'spelling_keyboard');
    }

    updateKeyboardDisplay() {
        const el = document.getElementById('keyboard-text-display');
        if (el) el.innerText = this.keyboardText || (this.isEn() ? "Tap letters to spell..." : "დააჭირეთ ასოებს...");
    }

    addKeyboardTextToStrip() {
        if (!this.keyboardText.trim()) return;
        const textCard = {
            id: 'typed_' + Date.now(),
            text: this.keyboardText.trim(),
            icon: '⌨️',
            type: 'basic',
            spoken: this.keyboardText.trim()
        };
        this.addCardToStrip(textCard);
        this.closeModal('modal-keyboard');
        this.switchMainMode('aac');
    }

    // ========================================================
    // 20. 📅 დღის ვიზუალური განრიგი (Visual Daily Schedule)
    // ========================================================
    initDailySchedule() {
        this.renderScheduleTimeline();
    }

    setSchedulePreset(presetKey) {
        if (!this.schedulePresets[presetKey]) return;
        this.currentSchedulePreset = presetKey;
        this.scheduleSteps = JSON.parse(JSON.stringify(this.schedulePresets[presetKey]));
        pecsAudio.playTap();

        document.querySelectorAll('.preset-pill').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.preset === presetKey);
        });

        this.renderScheduleTimeline();
    }

    renderScheduleTimeline() {
        const container = document.getElementById('schedule-timeline');
        if (!container) return;
        const isEn = this.isEn();

        const schedEnMap = {
            'საწოლიდან ადგომა': 'Wake up & get out of bed',
            'ტუალეტში შესვლა': 'Bathroom & toilet',
            'კბილების გახეხვა & დაბანა': 'Brush teeth & wash face',
            'კბილების გახეხვა და დაბანა': 'Brush teeth & wash face',
            'ტანსაცმლის ჩაცმა': 'Get dressed',
            'გემრიელი საუზმე': 'Eat healthy breakfast',
            'ჩანთის ჩალაგება': 'Pack backpack',
            'სკოლაში / ბაღში მისვლა': 'Go to school / daycare',
            'სკოლაში ან ბაღში მისვლა': 'Go to school / daycare',
            'მეცადინეობა & ხატვა': 'Classroom activities & drawing',
            'მეცადინეობა და ხატვა': 'Classroom activities & drawing',
            'ეზოში გასვლა & თამაში': 'Outdoor playground / recess',
            'ეზოში თამაში & ლანჩი': 'Outdoor playground & lunch',
            'სახლში დაბრუნება': 'Return back home',
            'სათამაშოების ალაგება': 'Tidy up toys',
            'ვახშმის ჭამა': 'Family dinner',
            'თბილი შხაპი / აბაზანა': 'Warm bath / shower',
            'თბილი შხაპი ან აბაზანა': 'Warm bath / shower',
            'პიჟამის ჩაცმა': 'Put on pajamas',
            'ზღაპრის მოსმენა & ძილი': 'Bedtime story & sleep',
            'ზღაპრის მოსმენა და ძილი': 'Bedtime story & sleep'
        };
        const schedKaMap = {
            'Wake up & get out of bed': 'საწოლიდან ადგომა',
            'Wake up & make bed': 'საწოლიდან ადგომა',
            'Bathroom & toilet': 'ტუალეტში შესვლა',
            'Use the toilet': 'ტუალეტში შესვლა',
            'Brush teeth & wash face': 'კბილების გახეხვა & დაბანა',
            'Get dressed': 'ტანსაცმლის ჩაცმა',
            'Eat healthy breakfast': 'გემრიელი საუზმე',
            'Healthy breakfast': 'გემრიელი საუზმე',
            'Pack backpack': 'ჩანთის ჩალაგება',
            'Go to school / daycare': 'სკოლაში / ბაღში მისვლა',
            'Arrive at school / daycare': 'სკოლაში / ბაღში მისვლა',
            'Classroom activities & drawing': 'მეცადინეობა & ხატვა',
            'Learning & art time': 'მეცადინეობა & ხატვა',
            'Outdoor playground & lunch': 'ეზოში თამაში & ლანჩი',
            'Outdoor playground / recess': 'ეზოში გასვლა & თამაში',
            'Return back home': 'სახლში დაბრუნება',
            'Return home': 'სახლში დაბრუნება',
            'Tidy up toys': 'სათამაშოების ალაგება',
            'Family dinner': 'ვახშმის ჭამა',
            'Warm bath / shower': 'თბილი შხაპი / აბაზანა',
            'Put on pajamas': 'პიჟამის ჩაცმა',
            'Bedtime story & sleep': 'ზღაპრის მოსმენა & ძილი'
        };

        container.innerHTML = this.scheduleSteps.map((step, idx) => {
            const fallbackEn = schedEnMap[step.text] || schedEnMap[step.text?.replace(/\s*\/\s*/g, ' / ')] || '';
            const fallbackKa = schedKaMap[step.text_en] || '';
            const stepText = isEn 
                ? (step.text_en || fallbackEn || step.text) 
                : (step.text || fallbackKa || step.text_en);
            const statusLabel = step.completed 
                ? (isEn ? '✅ Completed' : '✅ შესრულებულია') 
                : (isEn ? '⏳ Pending' : '⏳ შესასრულებელი');
            const btnLabel = step.completed 
                ? (isEn ? '✅ Done' : '✅ მორჩა') 
                : (isEn ? '⚪ Complete' : '⚪ შესრულება');

            return `
                <div class="schedule-step-item ${step.completed ? 'completed' : ''}" onclick="app.speakScheduleStep(${idx})" style="cursor: pointer;">
                    <div class="step-info-wrap">
                        <div class="step-icon-box">${step.icon}</div>
                        <div>
                            <div class="step-text-title">${idx + 1}. ${stepText}</div>
                            <div style="font-size:12px; color:#64748B; font-weight:700;">
                                ${statusLabel}
                            </div>
                        </div>
                    </div>
                    <button type="button" class="step-status-btn" onclick="event.stopPropagation(); app.toggleScheduleStep(${idx})">
                        ${btnLabel}
                    </button>
                </div>
            `;
        }).join('');

        this.updateScheduleProgress();
    }

    speakAllScheduleRoutine() {
        if (!this.scheduleSteps || this.scheduleSteps.length === 0) return;
        const isEn = this.isEn();
        const pendingSteps = this.scheduleSteps.filter(s => !s.completed);
        const stepsToRead = pendingSteps.length > 0 ? pendingSteps : this.scheduleSteps;
        const fullText = (isEn ? "Daily schedule: " : "დღის განრიგი: ") + 
            stepsToRead.map((s, idx) => `${idx + 1}. ${(isEn && s.text_en) ? s.text_en : s.text}`).join(', ');
        pecsAudio.playTap();
        pecsAudio.speak(fullText);
    }

    speakScheduleStep(index) {
        if (!this.scheduleSteps[index]) return;
        if (this._isSpeakingScheduleStep) return;
        this._isSpeakingScheduleStep = true;
        setTimeout(() => { this._isSpeakingScheduleStep = false; }, 350);

        const step = this.scheduleSteps[index];
        const isEn = this.isEn();
        const stepText = (isEn && step.text_en) ? step.text_en : step.text;
        pecsAudio.playWoodTap();
        pecsAudio.speak(stepText);
    }

    toggleScheduleStep(index) {
        if (!this.scheduleSteps[index]) return;
        if (this._isTogglingScheduleStep) return;
        this._isTogglingScheduleStep = true;
        setTimeout(() => { this._isTogglingScheduleStep = false; }, 280);

        const step = this.scheduleSteps[index];
        step.completed = !step.completed;

        const isEn = this.isEn();
        const stepText = (isEn && step.text_en) ? step.text_en : step.text;

        if (step.completed) {
            pecsAudio.playSuccess();
            const praiseText = isEn ? `Great job! ${stepText} is done!` : `ყოჩაღ! ${step.text} შესრულდა!`;
            pecsAudio.speak(praiseText);
            const logMsg = isEn ? `Schedule step completed: ${stepText}` : `განრიგის ნაბიჯი შესრულდა: ${step.text}`;
            this.logAbaEvent(logMsg, 'schedule_step');
        } else {
            pecsAudio.playTap();
            pecsAudio.speak(stepText);
        }

        this.renderScheduleTimeline();

        const allDone = this.scheduleSteps.every(s => s.completed);
        if (allDone) {
            setTimeout(() => {
                pecsAudio.playFanfare();
                pecsAudio.speak(isEn 
                    ? "Great job! The entire schedule is completed! You are a true champion!" 
                    : "ყოჩაღ! მთელი განრიგი წარმატებით შესრულდა! შენ ნამდვილი ჩემპიონი ხარ!");
                this.celebrate({
                    title: isEn ? "🎉 Entire Schedule Completed!" : "🎉 მთელი განრიგი შესრულებულია!",
                    subtitle: isEn ? "Great job! All activities completed!" : "ყოჩაღ! ყველა დავალება წარმატებით გაიარე!",
                    message: isEn ? "You are a real champion! Time to rest and relax! 🌟" : "შენ ნამდვილი ჩემპიონი ხარ! დროა დაისვენო და გაერთო! 🌟",
                    avatar: "🏆",
                    buttonText: isEn ? "✨ Awesome!" : "✨ შესანიშნავია!"
                });
                this.logAbaEvent(isEn ? `Entire schedule completed: ${this.currentSchedulePreset}` : `სრული განრიგი დასრულდა: ${this.currentSchedulePreset}`, 'schedule_complete');
            }, 1200);
        }
    }

    checkAllScheduleSteps() {
        this.scheduleSteps.forEach(s => s.completed = true);
        this.renderScheduleTimeline();
        pecsAudio.playFanfare();
        const isEn = this.isEn();
        pecsAudio.speak(isEn 
            ? "Great job! The entire schedule is completed! You are a true champion!" 
            : "ყოჩაღ! მთელი განრიგი წარმატებით შესრულდა! შენ ნამდვილი ჩემპიონი ხარ!");
        this.celebrate({
            title: isEn ? "🎉 Entire Schedule Completed!" : "🎉 მთელი განრიგი შესრულებულია!",
            subtitle: isEn ? "Great job! All activities completed!" : "ყოჩაღ! ყველა დავალება წარმატებით გაიარე!",
            message: isEn ? "You are a real champion! Time to rest and relax! 🌟" : "შენ ნამდვილი ჩემპიონი ხარ! დროა დაისვენო და გაერთო! 🌟",
            avatar: "🏆",
            buttonText: isEn ? "✨ Awesome!" : "✨ შესანიშნავია!"
        });
    }

    resetSchedule() {
        this.scheduleSteps.forEach(s => s.completed = false);
        pecsAudio.playClear();
        this.renderScheduleTimeline();
    }

    updateScheduleProgress() {
        const total = this.scheduleSteps.length;
        const done = this.scheduleSteps.filter(s => s.completed).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        const textEl = document.getElementById('schedule-progress-text');
        const pctEl = document.getElementById('schedule-progress-percent');
        const fillEl = document.getElementById('schedule-progress-bar-fill');

        if (textEl) textEl.innerText = this.isEn() ? `Progress: ${done} / ${total} Completed` : `პროგრესი: ${done} / ${total} შესრულებულია`;
        if (pctEl) pctEl.innerText = `${pct}%`;
        if (fillEl) fillEl.style.width = `${pct}%`;
    }

    // ========================================================
    // 21. 🧘 ემოციური რეგულაცია & დამშვიდების ზონა
    // ========================================================
    // ========================================================
    // 🏆 Judge & Evaluator Demo Tour (30-Second Live Showcase)
    // ========================================================
    openJudgeTourModal() {
        pecsAudio.playTap();
        this.translateJudgeTourUI();
        this.openModal('modal-judge-tour');
    }

    translateJudgeTourUI() {
        const isEn = this.isEn();
        const tTitle = document.getElementById('tour-modal-title');
        if (tTitle) tTitle.innerText = isEn ? '🏆 Judge & Evaluator Tour (30s Showcase)' : '🏆 ჟიურის & დემო ტური (30-წამიანი გზამკვლევი)';
        const tSub = document.getElementById('tour-modal-sub');
        if (tSub) tSub.innerText = isEn ? 'Nebius x NVIDIA AI Hackathon • 6 Live Clinical & Multimodal Milestones' : 'Nebius x NVIDIA AI ჰაკათონი • 6 ცოცხალი კლინიკური და მულტიმოდალური მიღწევა';
        const tBtn = document.getElementById('btn-head-judge-tour-text');
        if (tBtn) tBtn.innerText = isEn ? 'Judge Tour' : 'ჟიურის ტური';

        const s1Title = document.getElementById('tour-s1-title');
        if (s1Title) s1Title.innerText = isEn ? '🗣️ Real-Time SVO Speech & Handover' : '🗣️ ბავშვის მეტყველება და გაცვლა';
        const s1Desc = document.getElementById('tour-s1-desc');
        if (s1Desc) s1Desc.innerText = isEn ? 'Tap communication cards to construct SVO carrier sentences with zero-latency speech synthesis.' : 'ბარათების დადება წინადადების ზოლზე და მყისიერი გახმოვანება კომუნიკაციური გაცვლით.';
        const s1Btn = document.getElementById('tour-s1-btn');
        if (s1Btn) s1Btn.innerText = isEn ? '▶️ Test Speech' : '▶️ ხმის ტესტი';

        const s2Title = document.getElementById('tour-s2-title');
        if (s2Title) s2Title.innerText = isEn ? '🧠 Nemotron 3 Ultra Clinical Report' : '🧠 Nemotron 3 Ultra კლინიკური რეპორტი';
        const s2Desc = document.getElementById('tour-s2-desc');
        if (s2Desc) s2Desc.innerText = isEn ? 'Transforms longitudinal telemetry into a sign-off ready BCBA progress report with Action Directives at top.' : 'ტელემეტრიის დამუშავება ოფიციალურ BCBA სამედიცინო რეპორტად პირველადი დირექტივებით.';
        const s2Btn = document.getElementById('tour-s2-btn');
        if (s2Btn) s2Btn.innerText = isEn ? '🚀 Launch Report' : '🚀 რეპორტის გაშვება';

        const s3Title = document.getElementById('tour-s3-title');
        if (s3Title) s3Title.innerText = isEn ? '📸 Physical AI & Vision Room Scanner' : '📸 Physical AI და ოთახის სკანერი';
        const s3Desc = document.getElementById('tour-s3-desc');
        if (s3Desc) s3Desc.innerText = isEn ? 'Real-world camera computer vision recognizes physical objects and converts them into AAC cards instantly.' : 'კამერის კომპიუტერული ხედვა ამოიცნობს რეალურ საგნებს და წამში აქცევს AAC ბარათად.';
        const s3Btn = document.getElementById('tour-s3-btn');
        if (s3Btn) s3Btn.innerText = isEn ? '📷 Test Scanner' : '📷 სკანერის ტესტი';

        const s4Title = document.getElementById('tour-s4-title');
        if (s4Title) s4Title.innerText = isEn ? '🔄 Premack First-Then AI (Nemotron Nano)' : '🔄 First-Then AI რუტინა (Nemotron Nano)';
        const s4Desc = document.getElementById('tour-s4-desc');
        if (s4Desc) s4Desc.innerText = isEn ? 'Decomposes natural parental language into visual micro-steps, countdown timers, and reward choices.' : 'მშობლის ფრაზის დაშლა ვიზუალურ ნაბიჯებად, ტაიმერად და არჩევანის ჯილდოებად.';
        const s4Btn = document.getElementById('tour-s4-btn');
        if (s4Btn) s4Btn.innerText = isEn ? '✨ Try First-Then' : '✨ რუტინის ტესტი';

        const s5Title = document.getElementById('tour-s5-title');
        if (s5Title) s5Title.innerText = isEn ? '🏛️ Multi-Agent Clinical Council (SLP + BCBA + OT)' : '🏛️ 3-აგენტიანი კლინიკური კონსილიუმი (SLP + BCBA + OT)';
        const s5Desc = document.getElementById('tour-s5-desc');
        if (s5Desc) s5Desc.innerText = isEn ? 'Convenes 3 specialized AI clinicians (Speech, Behavior, Occupational) to analyze session telemetry and synthesize a unified 7-day plan.' : 'სამი სპეციალიზებული AI აგენტის (ლოგოპედი, ქცევითი და ოკუპაციური თერაპევტი) კონსილიუმი და საერთო 7-დღიანი გეგმა.';
        const s5Btn = document.getElementById('tour-s5-btn');
        if (s5Btn) s5Btn.innerText = isEn ? '🧠 Convene Council' : '🧠 კონსილიუმი';

        const s6Title = document.getElementById('tour-s6-title');
        if (s6Title) s6Title.innerText = isEn ? '📖 AI Social Stories (Carol Gray Method)' : '📖 AI სოციალური ისტორიები (Carol Gray მეთოდი)';
        const s6Desc = document.getElementById('tour-s6-desc');
        if (s6Desc) s6Desc.innerText = isEn ? 'Generates clinical 4-step visual stories with Nemotron 3 Ultra to prepare children for anxiety-inducing events.' : '4-ნაბიჯიანი ვიზუალური ისტორიის გენერირება Nemotron 3 Ultra-თი რთული მოვლენებისთვის მოსამზადებლად.';
        const s6Btn = document.getElementById('tour-s6-btn');
        if (s6Btn) s6Btn.innerText = isEn ? '✨ Create Story' : '✨ შექმნა (ტესტი)';

    }

    runJudgeTourStep(step) {
        this.closeModal('modal-judge-tour');
        pecsAudio.playSuccess();
        const isEn = this.isEn();

        if (step === 1) {
            // Step 1: Real-time SVO Sentence & Handover (ensure Phase IV is active)
            this.switchMainMode('aac');
            this.setActivePhase(4);
            this.clearSentenceStrip();
            const starterCard = { id: 'starter_want', text: isEn ? 'I want' : 'მე მინდა', text_en: 'I want', icon: '🤲', type: 'starter' };
            this.addCardToStrip(starterCard);
            setTimeout(() => {
                const waterCard = { id: 'card_water', text: isEn ? 'Water' : 'წყალი', text_en: 'Water', icon: '💧', type: 'core' };
                this.addCardToStrip(waterCard);
                setTimeout(() => {
                    this.speakSentenceStrip();
                }, 350);
            }, 250);
        } else if (step === 2) {
            // Step 2: Nemotron 3 Ultra Clinical Report
            this.switchMainMode('aac');
            this.openStudioModal();
            setTimeout(() => {
                this.switchStudioTab('voxis-ai');
                if (window.voxisAI && typeof window.voxisAI.generateClinicalReport === 'function') {
                    window.voxisAI.generateClinicalReport();
                }
            }, 350);
        } else if (step === 3) {
            // Step 3: Physical AI Vision Scanner
            this.switchMainMode('aac');
            this.openStudioModal();
            this.switchStudioTab('room-scanner');
            setTimeout(() => {
                this.openLiveCameraScanner('room');
            }, 300);
        } else if (step === 4) {
            // Step 4: First-Then Routine
            this.switchMainMode('firstthen');
            setTimeout(() => {
                this.openFirstThenSetup();
            }, 300);
        } else if (step === 5) {
            // Step 5: Multi-Agent Clinical Council (SLP + BCBA + OT)
            this.switchMainMode('aac');
            this.openStudioModal();
            setTimeout(() => {
                this.switchStudioTab('voxis-ai');
                const councilBlock = document.getElementById('voxis-council-section');
                if (councilBlock) {
                    councilBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                if (window.voxisAI && typeof window.voxisAI.runMultiAgentCouncil === 'function') {
                    window.voxisAI.runMultiAgentCouncil();
                }
            }, 350);
        } else if (step === 6) {
            // Step 6: AI Social Story Generator (Carol Gray 4-Step Method)
            this.switchMainMode('aac');
            this.openStudioModal();
            setTimeout(() => {
                this.switchStudioTab('voxis-ai');
                const storyBlock = document.getElementById('voxis-story-title');
                if (storyBlock) {
                    storyBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                if (window.voxisAI && typeof window.voxisAI.generateSocialStory === 'function') {
                    window.voxisAI.generateSocialStory(isEn ? 'Getting a Haircut' : 'თმის შეჭრა');
                }
            }, 350);
        }
    }

    openRegulationModal() {
        const isEn = this.isEn();
        this.translateModalsUI(isEn ? 'en' : 'ka');
        const modal = document.getElementById('modal-regulation');
        if (modal) modal.classList.add('active');
        pecsAudio.playTap();

        const textEl = document.getElementById('breathing-text');
        if (textEl && !this.isBreathingActive) {
            textEl.innerText = isEn ? "Breathe in..." : "ჩაისუნთქე...";
        }
        const btnText = document.getElementById('breathing-btn-text');
        if (btnText && !this.isBreathingActive) {
            btnText.innerText = isEn ? "Start Breathing" : "სუნთქვის დაწყება";
        }
        if (window.voxisAI && typeof window.voxisAI.applyLanguage === 'function') {
            window.voxisAI.applyLanguage(window.voxisAI.currentLang || (isEn ? 'en' : 'ka'));
        }
    }

    selectEmotionalZone(zone) {
        pecsAudio.playTap();
        const isEn = this.isEn();
        const zonesMap = isEn ? {
            green: { text: "I am in the Green Zone. I feel calm and happy, ready to learn!", name: "Green Zone (Calm)", icon: "🟢" },
            blue: { text: "I am in the Blue Zone. I feel tired or sad, I need a rest.", name: "Blue Zone (Tired)", icon: "🔵" },
            yellow: { text: "I am in the Yellow Zone. I feel anxious or frustrated, I need a break.", name: "Yellow Zone (Anxious)", icon: "🟡" },
            red: { text: "I am in the Red Zone. I feel very angry, please help me calm down!", name: "Red Zone (Meltdown)", icon: "🔴" }
        } : {
            green: { text: "მე ვარ მწვანე ზონაში. თავს ვგრძნობ მშვიდად და ბედნიერად, მზად ვარ სასწავლად!", name: "მწვანე ზონა (მშვიდი)", icon: "🟢" },
            blue: { text: "მე ვარ ლურჯ ზონაში. დავიღალე ან მოვიწყინე, დასვენება მჭირდება.", name: "ლურჯი ზონა (დაღლილი)", icon: "🔵" },
            yellow: { text: "მე ვარ ყვითელ ზონაში. ვარ აღელვებული ან შეშფოთებული, შესვენება მინდა.", name: "ყვითელი ზონა (აღელვებული)", icon: "🟡" },
            red: { text: "მე ვარ წითელ ზონაში. ძალიან გაბრაზებული ვარ, გთხოვთ დამეხმაროთ დამშვიდებაში!", name: "წითელი ზონა (აფეთქება)", icon: "🔴" }
        };

        const z = zonesMap[zone] || zonesMap.green;
        pecsAudio.speak(z.text);
        this.logAbaEvent(`Emotional Zone: ${z.name}`, 'emotional_zone');
        this.showToast(`${z.icon} ${z.name}`);
        
        // Highlight clicked zone card
        document.querySelectorAll('.zone-card').forEach(c => c.style.outline = '');
        const cardEl = document.querySelector(`.zone-${zone}`);
        if (cardEl) {
            cardEl.style.outline = '4px solid #38BDF8';
            cardEl.style.transform = 'scale(1.04)';
            setTimeout(() => {
                if (cardEl) cardEl.style.transform = '';
            }, 1000);
        }
    }

    toggleBreathingExercise() {
        const circle = document.getElementById('breathing-circle');
        const textEl = document.getElementById('breathing-text');
        const btnText = document.getElementById('breathing-btn-text');
        const isEn = this.isEn();

        if (this.isBreathingActive) {
            this.isBreathingActive = false;
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
            if (circle) circle.classList.remove('animating');
            if (textEl) textEl.innerText = isEn ? "Breathe in..." : "ჩაისუნთქე...";
            if (btnText) btnText.innerText = isEn ? "Start Breathing" : "სუნთქვის დაწყება";
        } else {
            this.isBreathingActive = true;
            if (circle) circle.classList.add('animating');
            if (btnText) btnText.innerText = isEn ? "Stop Breathing" : "სუნთქვის შეჩერება";

            let phase = 0; // 0: inhale, 1: hold, 2: exhale
            const phases = isEn ? [
                { text: "Breathe in 🌬️", voice: "Breathe in slowly" },
                { text: "Hold 🛑", voice: "Hold your breath" },
                { text: "Breathe out 💨", voice: "Breathe out slowly" }
            ] : [
                { text: "ჩაისუნთქე 🌬️", voice: "ნელა ჩაისუნთქე" },
                { text: "შეიკავე 🛑", voice: "შეიკავე სუნთქვა" },
                { text: "ამოისუნთქე 💨", voice: "ნელა ამოისუნთქე" }
            ];

            const stepBreathing = () => {
                const cur = phases[phase % 3];
                if (textEl) textEl.innerText = cur.text;
                pecsAudio.speak(cur.voice);
                phase++;
            };

            stepBreathing();
            this.breathingInterval = setInterval(stepBreathing, 3500);
        }
    }

    applyCalmingTool(toolName, spoken = null) {
        const isEn = this.isEn();
        const toolsMap = {
            'water': {
                name: isEn ? 'Drink Water 💧' : 'წყლის დალევა 💧',
                voice: isEn ? 'I want cold water please' : 'ცივი წყალი მინდა'
            },
            'headphones': {
                name: isEn ? 'Headphones 🎧' : 'ყურსასმენები 🎧',
                voice: isEn ? 'I want noise-canceling headphones' : 'ყურსასმენები მინდა'
            },
            'hug': {
                name: isEn ? 'Hug 🫂' : 'ჩახუტება 🫂',
                voice: isEn ? 'I want a hug' : 'ჩახუტება მინდა'
            },
            'fidget': {
                name: isEn ? 'Fidget Toy 🧸' : 'სათამაშო 🧸',
                voice: isEn ? 'I want a sensory fidget toy' : 'სათამაშო მინდა'
            },
            'quiet': {
                name: isEn ? 'Quiet Space 🛌' : 'მშვიდი სივრცე 🛌',
                voice: isEn ? 'I want to be in a quiet room' : 'მშვიდ ოთახში ყოფნა მინდა'
            }
        };

        const item = toolsMap[toolName] || { name: toolName, voice: spoken || toolName };
        pecsAudio.playSuccess();
        pecsAudio.speak(item.voice);
        this.logAbaEvent(isEn ? `Calming Strategy: ${item.name}` : `დამამშვიდებელი სტრატეგია: ${item.name}`, 'calming_strategy');
        this.showToast(`🧘 ${item.name}`);
    }

    // ========================================================
    // 22. 💬 სწრაფი სოციალური ფრაზები (Quick Chat)
    // ========================================================
    openQuickChatModal() {
        this.translateModalsUI(this.isEn() ? 'en' : 'ka');
        document.getElementById('modal-quickchat').classList.add('active');
        pecsAudio.playTap();
    }

    speakQuickPhrase(phrase) {
        pecsAudio.playTap();
        const isEn = this.isEn();
        const pLogged = isEn ? (this.translateAbaText(phrase) || phrase) : phrase;
        this.logAbaEvent(isEn ? `Quick phrase: ${pLogged}` : `სწრაფი ფრაზა: ${phrase}`, 'quick_phrase');

        // ბარათის სახით დამატება ზოლზე
        const quickCard = {
            id: 'qp_' + Date.now(),
            text: phrase,
            icon: '💬',
            type: 'social',
            spoken: phrase
        };
        this.addCardToStrip(quickCard);
        this.closeModal('modal-quickchat');
    }

    // ========================================================
    // 19. ხელმისაწვდომობის პარამეტრები (Accessibility)
    // ========================================================
    toggleHighContrast() {
        const isHc = document.body.classList.toggle('high-contrast');
        pecsAudio.playTap();
        const isEn = this.isEn();
        this.showToast(isHc
            ? (isEn ? "🌓 High Contrast Mode Enabled" : "🌓 მაღალი კონტრასტი ჩართულია")
            : (isEn ? "☀️ Standard Mode Enabled" : "☀️ სტანდარტული რეჟიმი ჩართულია"));
    }

    setVoiceSpeed(rate) {
        pecsAudio.speechRate = parseFloat(rate);
        pecsAudio.speak(this.isEn() ? "Voice speed updated" : "ხმის სიჩქარე შეცვლილია");
    }

    setVoicePitch(pitch) {
        pecsAudio.speechPitch = parseFloat(pitch);
        pecsAudio.speak(this.isEn() ? "Voice pitch updated" : "ხმის ტონი შეცვლილია");
    }

    setTtsVoice(voice = 'bella') {
        if (!window.pecsAudio) return;
        pecsAudio.setVoice('bella');
        const isEn = this.isEn();
        pecsAudio.speak(isEn ? `Hello! I am Bella, ready to speak.` : `გამარჯობა! მე ვარ ბელა, მზად ვარ სასაუბროდ.`);
        this.showToast(isEn ? `🎙️ Voice: Bella` : `🎙️ დიქტორი: ბელა`);
    }

    // ========================================================
    // 25. 💡 ჭკვიანი ოფლაინ პროგნოზირება (Smart Offline Predictor)
    // ========================================================
    updateSmartPredictions() {
        const chipsContainer = document.getElementById('prediction-chips');
        const hintEl = document.getElementById('prediction-hint');
        if (!chipsContainer) return;

        const isEn = this.isEn();
        let suggestions = [];
        const lastCard = this.sentenceStrip[this.sentenceStrip.length - 1];

        if (!lastCard) {
            // ზოლი ცარიელია — ყველაზე ხშირი საწყისები და საბაზისო სიტყვები
            if (hintEl) hintEl.innerText = isEn ? "Start a phrase or choose a quick request:" : "დაიწყეთ ფრაზა ან აირჩიეთ სწრაფი მოთხოვნა:";
            suggestions = [
                { text: isEn ? "I want" : "მე მინდა", text_en: "I want", icon: "🤲", type: "verb", spoken: isEn ? "I want" : "მე მინდა", spoken_en: "I want" },
                { text: isEn ? "Water" : "წყალი", text_en: "Water", icon: "💧", type: "noun", spoken: isEn ? "Water" : "წყალი", spoken_en: "Water" },
                { text: isEn ? "Help" : "დახმარება", text_en: "Help", icon: "✋", type: "basic", spoken: isEn ? "Help me" : "დამეხმარე", spoken_en: "Help me" },
                { text: isEn ? "I see" : "მე ვხედავ", text_en: "I see", icon: "👀", type: "verb", spoken: isEn ? "I see" : "მე ვხედავ", spoken_en: "I see" },
                { text: isEn ? "Hurts" : "მტკივა", text_en: "Hurts", icon: "🩹", type: "social", spoken: isEn ? "It hurts" : "მე მტკივა", spoken_en: "It hurts" },
                { text: isEn ? "Bathroom" : "ტუალეტი", text_en: "Bathroom", icon: "🚽", type: "basic", spoken: isEn ? "I need the bathroom" : "ტუალეტში მინდა", spoken_en: "I need the bathroom" }
            ];
        } else {
            const lastText = (lastCard.text_en || lastCard.text || '').toLowerCase();
            const lastSpoken = (lastCard.spoken_en || lastCard.spoken || '').toLowerCase();

            if (lastText.includes('მინდა') || lastSpoken.includes('მინდა') || lastText.includes('want') || lastSpoken.includes('want')) {
                if (hintEl) hintEl.innerText = isEn ? "What do you want? (Drink / Food / Toy):" : "რა გსურს? (სასმელი / საჭმელი / სათამაშო):";
                suggestions = [
                    { text: isEn ? "Water" : "წყალი", text_en: "Water", icon: "💧", type: "noun", spoken: isEn ? "Water" : "წყალი", spoken_en: "Water" },
                    { text: isEn ? "Juice" : "წვენი", text_en: "Juice", icon: "🧃", type: "noun", spoken: isEn ? "Juice" : "წვენი", spoken_en: "Juice" },
                    { text: isEn ? "Apple" : "ვაშლი", text_en: "Apple", icon: "🍎", type: "noun", spoken: isEn ? "Apple" : "ვაშლი", spoken_en: "Apple" },
                    { text: isEn ? "Ball" : "ბურთი", text_en: "Ball", icon: "⚽", type: "noun", spoken: isEn ? "Ball" : "ბურთი", spoken_en: "Ball" },
                    { text: isEn ? "Lego" : "ლეგო", text_en: "Lego", icon: "🧱", image: "assets/images/lego.svg", type: "noun", spoken: isEn ? "Lego" : "ლეგო", spoken_en: "Lego" },
                    { text: isEn ? "Hug" : "ჩახუტება", text_en: "Hug", icon: "🤗", type: "social", spoken: isEn ? "Hug" : "ჩახუტება", spoken_en: "Hug" },
                    { text: isEn ? "Cartoons" : "მულტფილმი", text_en: "Cartoons", icon: "📺", type: "noun", spoken: isEn ? "Cartoons" : "მულტფილმი", spoken_en: "Cartoons" }
                ];
            } else if (lastText.includes('ვხედავ') || lastSpoken.includes('ვხედავ') || lastText.includes('see') || lastSpoken.includes('see')) {
                if (hintEl) hintEl.innerText = isEn ? "What do you see around you?:" : "რას ხედავ გარშემო?:";
                suggestions = [
                    { text: isEn ? "Car" : "მანქანა", text_en: "Car", icon: "🚗", type: "noun", spoken: isEn ? "Car" : "მანქანა", spoken_en: "Car" },
                    { text: isEn ? "Mom" : "დედა", text_en: "Mom", icon: "👩", type: "people", spoken: isEn ? "Mom" : "დედა", spoken_en: "Mom" },
                    { text: isEn ? "Sun" : "მზე", text_en: "Sun", icon: "☀️", type: "noun", spoken: isEn ? "Sun" : "მზე", spoken_en: "Sun" },
                    { text: isEn ? "Dog" : "ძაღლი", text_en: "Dog", icon: "🐕", type: "noun", spoken: isEn ? "Dog" : "ძაღლი", spoken_en: "Dog" },
                    { text: isEn ? "Book" : "წიგნი", text_en: "Book", icon: "📖", type: "noun", spoken: isEn ? "Book" : "წიგნი", spoken_en: "Book" },
                    { text: isEn ? "Bird" : "ჩიტი", text_en: "Bird", icon: "🐦", type: "noun", spoken: isEn ? "Bird" : "ჩიტი", spoken_en: "Bird" }
                ];
            } else if (lastText.includes('მტკივა') || lastSpoken.includes('მტკივა') || lastText.includes('hurt') || lastSpoken.includes('hurt')) {
                if (hintEl) hintEl.innerText = isEn ? "Where does it hurt?:" : "სად გაქვს ტკივილი?:";
                suggestions = [
                    { text: isEn ? "Stomach" : "მუცელი", text_en: "Stomach", icon: "🤰", type: "social", spoken: isEn ? "Stomach" : "მუცელი", spoken_en: "Stomach" },
                    { text: isEn ? "Head" : "თავი", text_en: "Head", icon: "🤕", type: "social", spoken: isEn ? "Head" : "თავი", spoken_en: "Head" },
                    { text: isEn ? "Tooth" : "კბილი", text_en: "Tooth", icon: "🦷", type: "social", spoken: isEn ? "Tooth" : "კბილი", spoken_en: "Tooth" },
                    { text: isEn ? "Throat" : "ყელი", text_en: "Throat", icon: "🧣", type: "social", spoken: isEn ? "Throat" : "ყელი", spoken_en: "Throat" },
                    { text: isEn ? "Leg" : "ფეხი", text_en: "Leg", icon: "🦶", type: "social", spoken: isEn ? "Leg" : "ფეხი", spoken_en: "Leg" }
                ];
            } else if (lastCard.type === 'noun') {
                // საგნის შემდეგ ბუნებრივია თვისება ან მოქმედება
                if (hintEl) hintEl.innerText = isEn ? "How is it or what next?:" : "როგორია ან რას ვაკეთებთ?:";
                suggestions = [
                    { text: isEn ? "Big" : "დიდი", text_en: "Big", icon: "🐘", type: "adjective", spoken: isEn ? "Big" : "დიდი", spoken_en: "Big" },
                    { text: isEn ? "Small" : "პატარა", text_en: "Small", icon: "🐣", type: "adjective", spoken: isEn ? "Small" : "პატარა", spoken_en: "Small" },
                    { text: isEn ? "Red" : "წითელი", text_en: "Red", icon: "🔴", type: "adjective", spoken: isEn ? "Red" : "წითელი", spoken_en: "Red" },
                    { text: isEn ? "More" : "კიდევ / მეტი", text_en: "More", icon: "➕", type: "adjective", spoken: isEn ? "I want more" : "კიდევ მინდა", spoken_en: "I want more" },
                    { text: isEn ? "All done" : "მორჩა", text_en: "All done", icon: "🙅", type: "basic", spoken: isEn ? "All done" : "მორჩა", spoken_en: "All done" }
                ];
            } else {
                if (hintEl) hintEl.innerText = isEn ? "Next suggested words:" : "შემდეგი შესაძლო სიტყვები:";
                suggestions = [
                    { text: isEn ? "Please" : "გთხოვ", text_en: "Please", icon: "🙏", type: "social", spoken: isEn ? "Please" : "გთხოვ", spoken_en: "Please" },
                    { text: isEn ? "Thank you" : "მადლობა", text_en: "Thank you", icon: "✨", type: "social", spoken: isEn ? "Thank you" : "მადლობა", spoken_en: "Thank you" },
                    { text: isEn ? "Yes" : "დიახ", text_en: "Yes", icon: "✅", type: "basic", spoken: isEn ? "Yes" : "დიახ", spoken_en: "Yes" },
                    { text: isEn ? "No" : "არა", text_en: "No", icon: "❌", type: "basic", spoken: isEn ? "No" : "არა", spoken_en: "No" }
                ];
            }
        }

        chipsContainer.innerHTML = suggestions.map(card => `
            <button type="button" class="prediction-chip-btn" onclick="app.handleCardClick(${JSON.stringify(card).replace(/"/g, '&quot;')})">
                <span class="chip-icon">${card.image ? `<img src="${card.image}" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;" alt="${card.text}">` : (card.icon || '📌')}</span>
                <span>${card.text}</span>
            </button>
        `).join('');
    }

    // ========================================================
    // 26. 🎮 „იპოვე ბარათი“ — Receptive Language Game
    // ========================================================
    initReceptiveGame() {
        this.startNewGameRound();
    }

    startNewGameRound() {
        const pool = this.cards.filter(c => c.text && c.icon && c.category !== 'basic');
        if (pool.length < 3) return;

        // სამიზნე ბარათი შემთხვევით
        const target = pool[Math.floor(Math.random() * pool.length)];
        this.currentGameTarget = target;

        // 2-3 დისტრაქტორი (სხვა ბარათი)
        const distractors = [];
        const copyPool = pool.filter(c => c.id !== target.id);
        while (distractors.length < 2 && copyPool.length > 0) {
            const idx = Math.floor(Math.random() * copyPool.length);
            distractors.push(copyPool.splice(idx, 1)[0]);
        }

        // არევა
        this.currentGameChoices = [target, ...distractors].sort(() => Math.random() - 0.5);

        const isEn = this.isEn();
        const targetName = (isEn && target.text_en) ? target.text_en : target.text;
        const targetDisplay = document.getElementById('game-task-target');
        const instructionDisplay = document.getElementById('game-task-instruction');
        const scoreDisplay = document.getElementById('game-score-val');

        if (instructionDisplay) instructionDisplay.innerText = isEn ? "Listen and find the matching card:" : "მოუსმინე და იპოვე სწორი ბარათი:";
        if (targetDisplay) targetDisplay.innerText = isEn ? `“Find the card: ${targetName} 🎯”` : `„იპოვე ბარათი: ${target.text} 🎯“`;
        if (scoreDisplay) scoreDisplay.innerText = this.gameScore;

        const field = document.getElementById('game-cards-field');
        if (field) {
            field.innerHTML = this.currentGameChoices.map(card => {
                const cardLabel = (isEn && card.text_en) ? card.text_en : card.text;
                let visualHtml = `<div class="game-choice-icon">${card.icon || '📌'}</div>`;
                if (card.image || card.arasaacUrl) {
                    const src = card.image || card.arasaacUrl;
                    visualHtml = `<img src="${src}" class="game-choice-img" alt="${cardLabel}">`;
                }

                return `
                    <div class="game-choice-card type-${card.type || 'basic'}" id="game-card-${card.id}" onclick="app.checkGameChoice('${card.id}')">
                        ${visualHtml}
                        <div class="game-choice-text">${cardLabel}</div>
                    </div>
                `;
            }).join('');
        }

        // გახმოვანება
        setTimeout(() => {
            this.playGamePrompt();
        }, 320);
    }

    playGamePrompt() {
        if (!this.currentGameTarget) return;
        const isEn = this.isEn();
        const target = this.currentGameTarget;
        const introAudio = isEn ? 'assets/audio/cards/game_find_card_en.mp3' : 'assets/audio/cards/game_find_card.mp3';
        const vBust = '?v=bella_pure_v151';

        pecsAudio.stopPlayback();
        const token = pecsAudio.playbackId;

        // 1. ჯერ ვუკრავთ ბელას თბილ დავალებას: "იპოვე ბარათი!" (ვარიანტი 3, Bella 0.95)
        pecsAudio.playAudioFile(introAudio + vBust, null, () => {
            if (token !== pecsAudio.playbackId) return;
            // 2. მოკლე 120ms პაუზის შემდეგ ბელას ხმით ვასახელებთ უშუალოდ სამიზნე ბარათს (100% სტუდიური ბელა!)
            setTimeout(() => {
                if (token !== pecsAudio.playbackId) return;
                pecsAudio.speakCardOrText(target, null, null, token);
            }, 120);
        }, () => {
            // შეცდომის დროსაც მხოლოდ სტუდიური ბარათის ხმა უკრავს (არანაირი სინთეზი!)
            if (token !== pecsAudio.playbackId) return;
            pecsAudio.speakCardOrText(target, null, null, token);
        }, token);
    }

    repeatGameAudioPrompt() {
        if (!this.currentGameTarget) return;
        pecsAudio.playTap();
        this.playGamePrompt();
    }

    checkGameChoice(chosenId) {
        if (!this.currentGameTarget) return;

        const cardEl = document.getElementById(`game-card-${chosenId}`);

        if (chosenId === this.currentGameTarget.id) {
            // სწორი პასუხი!
            if (cardEl) cardEl.classList.add('correct');
            pecsAudio.playFanfare();
            this.gameScore += 10;
            const scoreDisplay = document.getElementById('game-score-val');
            if (scoreDisplay) scoreDisplay.innerText = this.gameScore;

            const isEn = this.isEn();
            const target = this.currentGameTarget;
            const targetName = (isEn && target.text_en) ? target.text_en : (isEn ? (this.translateAbaText(target.text) || target.text) : target.text);
            const gameLog = isEn 
                ? `Receptive Game: Correctly identified "${targetName}" (+10 pts)`
                : `თამაში: სწორად ამოიცნო "${target.text}" (+10 ქულა)`;
            this.logAbaEvent(gameLog, 'game_receptive_success');

            const praiseAudio = isEn ? 'assets/audio/cards/game_correct_praise_en.mp3' : 'assets/audio/cards/game_correct_praise.mp3';
            const vBust = '?v=bella_pure_v151';

            setTimeout(() => {
                const token = pecsAudio.playbackId;
                // ბელას შექება: "ყოჩაღ, სწორია!" -> და შემდეგ ბარათის სახელის შეხსენება ბელას ხმით!
                pecsAudio.playAudioFile(praiseAudio + vBust, null, () => {
                    if (token !== pecsAudio.playbackId) return;
                    setTimeout(() => {
                        if (token !== pecsAudio.playbackId) return;
                        pecsAudio.speakCardOrText(target, null, null, token);
                    }, 140);
                }, () => {
                    if (token !== pecsAudio.playbackId) return;
                    pecsAudio.speakCardOrText(target, null, null, token);
                }, token);
            }, 380);

            this.celebrate({
                title: isEn ? "🌟 Great Job! Correct!" : "🌟 ყოჩაღ! სწორია!",
                subtitle: isEn ? "You found the matching card!" : "შენ სწორად იპოვე ბარათი!",
                message: isEn 
                    ? `Great job! You found the card!<br><span class="reward-name" style="font-size:22px;">${target.icon} ${targetName}</span><br>+10 points! ⭐` 
                    : `ყოჩაღ, სწორად იპოვე ბარათი!<br><span class="reward-name" style="font-size:22px;">${target.icon} ${targetName}</span><br>+10 ქულა! ⭐`,
                avatar: "🏆",
                buttonText: isEn ? "✨ Next Card!" : "✨ შემდეგი ბარათი!",
                onConfirm: () => {
                    this.startNewGameRound();
                }
            });
        } else {
            const isEn = this.isEn();
            if (cardEl) {
                cardEl.classList.add('wrong');
                setTimeout(() => cardEl.classList.remove('wrong'), 600);
            }
            pecsAudio.playTap();

            const tryAgainAudio = isEn ? 'assets/audio/cards/game_try_again_en.mp3' : 'assets/audio/cards/game_try_again.mp3';
            const vBust = '?v=bella_pure_v151';
            const token = pecsAudio.playbackId;

            pecsAudio.playAudioFile(tryAgainAudio + vBust, null, () => {
                if (token !== pecsAudio.playbackId) return;
                setTimeout(() => {
                    if (token !== pecsAudio.playbackId) return;
                    this.playGamePrompt();
                }, 180);
            }, () => {
                if (token !== pecsAudio.playbackId) return;
                this.playGamePrompt();
            }, token);
        }
    }

    resetGame() {
        this.gameScore = 0;
        const scoreDisplay = document.getElementById('game-score-val');
        if (scoreDisplay) scoreDisplay.innerText = 0;
        pecsAudio.playClear();
        this.startNewGameRound();
    }

    // ========================================================
    // 27. 📋 1-Click WhatsApp / PDF რეპორტი ექიმისა და მშობლისთვის
    // ========================================================
    generateClinicalReportText() {
        const profile = this.getActiveProfile();
        const isEn = this.isEn();
        const childDisplayName = (isEn && (profile.name === 'ალექსი' || profile.name === 'დაჩი' || profile.name === 'ბავშვი 1' || !profile.name)) ? 'Alex' : (isEn && profile.name === 'მია' ? 'Mia' : (isEn && profile.name === 'ლუკა' ? 'Lucas' : profile.name));
        const todayGeo = new Date().toLocaleDateString('ka-GE');
        const todayEn = new Date().toLocaleDateString('en-US');
        const todayLocal = new Date().toLocaleDateString();
        const todayLogs = this.analyticsLogs.filter(l => l.date === todayGeo || l.date === todayEn || l.date === todayLocal);
        const todayStr = isEn ? todayEn : todayGeo;

        // კატეგორიების მიხედვით დაჯგუფება
        const requestCount = todayLogs.filter(l => l.context === 'spontaneous' || l.context === 'sentence_strip').length;
        const routineCount = todayLogs.filter(l => l.context === 'first_then_completed' || l.context === 'schedule_step').length;
        const painCount = todayLogs.filter(l => l.context === 'pain_report').length;
        const gameCount = todayLogs.filter(l => l.context === 'game_receptive_success').length;

        // ყველაზე ხშირი სიტყვები (ფილტრავს სისტემურ მოვლენებს და რუტინულ ნაბიჯებს)
        const wordFreq = {};
        const nonMandContexts = ['phase_switched', 'schedule_step', 'first_then_completed', 'iep_goal'];
        todayLogs.forEach(l => {
            if (l.text && !nonMandContexts.includes(l.context) && !l.text.includes('ფაზა შეცვლილია') && !l.text.includes('Phase Switched') && !l.text.includes('მიზანი') && !l.text.includes('Goal') && !l.text.includes('განრიგის ნაბიჯი') && !l.text.includes('Schedule step')) {
                let txt = isEn ? (l.text_en || this.translateAbaText(l.text) || l.text) : l.text;
                if (isEn) {
                    txt = txt.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '').trim();
                }
                if (txt) {
                    wordFreq[txt] = (wordFreq[txt] || 0) + 1;
                }
            }
        });
        const topWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([w, c]) => `• ${w} (${c}${isEn ? 'x' : '-ჯერ'})`)
            .join('\n');

        const genderEn = profile.gender === 'girl' ? 'Girl' : 'Boy';
        const genderKa = profile.gender === 'girl' ? 'გოგონა' : 'ბიჭი';

        if (isEn) {
            return `📲 VOXIS AAC — Daily Parent & Team Summary
──────────────────────
🧒 Learner: ${childDisplayName} (Age: ${profile.age || '-'} years • ${genderEn})
📅 Date: ${todayStr}
📊 Total Activity: ${todayLogs.length} interactions

📌 Key Clinical Indicators:
• Independent Mand Requests: ${requestCount}
• Completed Routines: ${routineCount}
• Receptive Game Score: ${gameCount} correct
• Pain/Discomfort Reports: ${painCount}

⭐ Top Requested Words Today:
${topWords || '• No requests recorded yet today'}

💡 Clinical / Caregiver Note:
Learner actively communicates using the VOXIS AAC multimodal communication platform.
──────────────────────
Generated via VOXIS AAC 🚀`;
        }

        const report = `📲 Voxis AAC — დღის შემაჯამებელი ანგარიში
──────────────────────
🧒 მოსწავლე (ბავშვი): ${profile.name} (ასაკი: ${profile.age || '-'} წელი • ${genderKa})
📅 თარიღი: ${todayStr}
📊 სულ აქტივობა: ${todayLogs.length} მოქმედება

📌 ძირითადი მაჩვენებლები:
• დამოუკიდებელი მოთხოვნები (AAC): ${requestCount}
• შესრულებული რუტინები: ${routineCount}
• შემეცნებითი თამაშის შედეგი: ${gameCount} წარმატება
• ტკივილის/დისკომფორტის ჩანაწერი: ${painCount}

⭐ ყველაზე ხშირი სიტყვები დღეს:
${topWords || '• მონაცემები ჯერ არ არის შეგროვებული'}

💡 სპეციალისტის/მშობლის შენიშვნა:
ბავშვი აქტიურად იყენებს Voxis AAC ალტერნატიულ საკომუნიკაციო პლატფორმას.
──────────────────────
გაგზავნილია Voxis AAC სისტემიდან 🇬🇪`;

        return report;
    }

    renderClinicalReportTab() {
        const container = document.getElementById('studio-tab-report');
        if (!container) return;

        const isEn = (this.isEn());
        const reportText = this.generateClinicalReportText();

        container.innerHTML = `
            <div class="report-container">
                <div class="report-summary-box">
                    <h4 style="font-size:16px; font-weight:900; color:#0F172A; margin-bottom:4px;">
                        ${isEn ? '📋 Daily Clinical Summary (For Parents & Therapists)' : '📋 დღიური თერაპიული ანგარიში (მშობელსა და ექიმს)'}
                    </h4>
                    <p style="font-size:12px; color:#64748B;">
                        ${isEn ? 'Automatically summarizes daily communicative exchanges, completed routines, and engagement.' : 'ავტომატურად აჯამებს ბავშვის დღევანდელ მოთხოვნებს, რუტინებსა და კომუნიკაციას.'}
                    </p>
                </div>

                <div class="report-preview-paper" id="report-paper-content">${reportText}</div>

                <div class="report-actions-row">
                    <button class="btn-whatsapp" onclick="app.sendWhatsAppReport()">
                        <span>📲 ${isEn ? 'Send via WhatsApp' : 'WhatsApp-ით გაგზავნა'}</span>
                    </button>
                    <button class="btn-primary-action" style="width:auto; padding:10px 18px;" onclick="app.copyClinicalReport()">
                        📋 ${isEn ? 'Copy Text' : 'ტექსტის კოპირება'}
                    </button>
                    <button class="icon-btn" onclick="app.printDoctorReport()">
                        🖨️ ${isEn ? 'PDF / Print' : 'PDF / ბეჭდვა'}
                    </button>
                </div>
            </div>
        `;
    }

    printDoctorReport() {
        const isEn = this.isEn();
        const text = this.generateClinicalReportText();

        let printFrame = document.getElementById('voxis-print-iframe');
        if (printFrame) printFrame.remove();
        printFrame = document.createElement('iframe');
        printFrame.id = 'voxis-print-iframe';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        printFrame.style.visibility = 'hidden';
        document.body.appendChild(printFrame);

        const doc = printFrame.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="${isEn ? 'en' : 'ka'}">
            <head>
                <meta charset="utf-8">
                <title>${isEn ? 'Voxis AAC Clinical Summary' : 'Voxis კლინიკური შეჯამება'}</title>
                <style>
                    @page { size: A4 portrait; margin: 15mm; }
                    * { box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        color: #0F172A;
                        background: #FFF;
                        padding: 0;
                        margin: 0;
                    }
                    .header {
                        border-bottom: 2px solid #0284C7;
                        padding-bottom: 10px;
                        margin-bottom: 16px;
                    }
                    .header h2 { margin: 0; font-size: 18px; color: #0284C7; }
                    .header p { margin: 4px 0 0 0; font-size: 12px; color: #64748B; }
                    .content {
                        white-space: pre-wrap;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: 13.5px;
                        line-height: 1.7;
                        background: #F8FAFC;
                        border: 1px solid #E2E8F0;
                        border-radius: 8px;
                        padding: 16px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 11px;
                        color: #94A3B8;
                        border-top: 1px solid #E2E8F0;
                        padding-top: 8px;
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>📋 Voxis AAC — ${isEn ? 'Daily Communication & Behavior Summary' : 'დღიური კომუნიკაციისა და ქცევის შეჯამება'}</h2>
                    <p>${isEn ? 'Clinical handover document for therapists and parents' : 'კლინიკური დოკუმენტი თერაპევტებისა და მშობლებისთვის'}</p>
                </div>
                <div class="content">${text}</div>
                <div class="footer">
                    <span>Voxis AAC Platform</span>
                    <span>${new Date().toLocaleDateString()}</span>
                </div>
            </body>
            </html>
        `);
        doc.close();

        setTimeout(() => {
            try {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
            } catch (e) {
                window.print();
            }
        }, 250);
    }

    copyClinicalReport() {
        const isEn = this.isEn();
        const text = this.generateClinicalReportText();
        navigator.clipboard.writeText(text).then(() => {
            pecsAudio.playSuccess();
            this.showAlert(isEn ? "Clinical report successfully copied to clipboard!" : "ანგარიშის ტექსტი წარმატებით დაკოპირდა ბუფერში!", isEn ? "Copied" : "კოპირებულია", "📋");
        }).catch(() => {
            this.showAlert(isEn ? "Text is ready above, you can select and copy it." : "ტექსტი მზად არის ზემოთ, შეგიძლიათ მონიშნოთ და დააკოპიროთ.", isEn ? "Report" : "რეპორტი", "📋");
        });
    }

    sendWhatsAppReport() {
        const text = this.generateClinicalReportText();
        const encoded = encodeURIComponent(text);
        const url = `https://api.whatsapp.com/send?text=${encoded}`;
        window.open(url, '_blank');
        this.logAbaEvent(this.isEn() ? "WhatsApp report exported" : "WhatsApp რეპორტი გაიგზავნა", "report_exported");
    }

    // ========================================================
    // 31. 🛡️ ბავშვის საკეტი (Child Lock / Guided Access)
    // + ☀️ ეკრანის მუდმივი ჩართულობა (Screen Wake Lock API)
    // ========================================================
    async requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                this.wakeLock = await navigator.wakeLock.request('screen');
                this.isWakeLockActive = true;
                this.wakeLock.addEventListener('release', () => {
                    this.isWakeLockActive = false;
                });
                console.log('Screen Wake Lock acquired: ეკრანი არ გაითიშება');
            } catch (err) {
                console.warn('Wake Lock request error:', err);
            }
        }
    }

    releaseWakeLock() {
        if (this.wakeLock !== null) {
            try {
                this.wakeLock.release();
            } catch(e) {}
            this.wakeLock = null;
            this.isWakeLockActive = false;
            console.log('Screen Wake Lock released');
        }
    }

    toggleChildLock() {
        if (this.isChildLocked) {
            this.disableChildLock();
        } else {
            this.enableChildLock();
        }
    }

    toggleFullscreen() {
        pecsAudio.playWoodTap();
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.warn(`Fullscreen error: ${err.message}`);
                });
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    clearBoardOrStrip() {
        if (this.activePhase >= 4) {
            this.clearSentenceStrip();
        } else {
            pecsAudio.playClear();
            document.querySelectorAll('.pecs-card').forEach(c => {
                c.classList.remove('pecs-target-selected', 'pecs-distractor-selected');
            });
        }
    }

    async enableChildLock(showAlert = true) {
        if (showAlert && window.pecsAudio) pecsAudio.playTap();
        this.isChildLocked = true;
        localStorage.setItem('voxis_child_lock', 'true');
        document.body.classList.add('child-lock-active');
        document.documentElement.classList.add('child-lock-preactive');
        
        const banner = document.getElementById('child-lock-banner');
        if (banner) banner.style.display = 'none';

        const headLock = document.getElementById('btn-head-lock');
        if (headLock) {
            headLock.classList.add('locked');
            headLock.title = this.isEn() ? '🛡️ Child Lock Active (Click to unlock)' : '🛡️ საკეტი ჩართულია (დააჭირეთ გასათიშად)';
        }
        const tbLock = document.getElementById('tb-btn-lock');
        if (tbLock) tbLock.classList.add('active');

        // ☀️ ეკრანის მუდმივი ჩართულობის გააქტიურება (რომ ეკრანი არ ჩაქრეს/გაითიშოს)
        await this.requestWakeLock();

        if (showAlert) {
            const isKa = (localStorage.getItem('voxis_lang') === 'ka');
            this.showAlert(
                isKa 
                    ? "🔒 <strong>ბავშვის საკეტი გააქტიურდა!</strong><br><br>• ზედა სამართავი ღილაკები დაიმალა.<br>• <strong>ეკრანი არ გაითიშება (მუდმივად ჩართული დარჩება).</strong><br><br>განსაბლოკად დააჭირეთ ზედა მარჯვენა <strong>Unlock</strong> ღილაკს."
                    : "🔒 <strong>Child Lock Activated!</strong><br><br>• Upper administrative controls hidden.<br>• <strong>Screen keep-awake mode enabled.</strong><br><br>To unlock, click the top-right <strong>Unlock</strong> button.",
                isKa ? "🛡️ ბავშვის საკეტი აქტიურია" : "🛡️ Child Lock Active",
                "🔒"
            );
        }
    }

    disableChildLock() {
        if (window.pecsAudio) pecsAudio.playTap();
        this.openParentalGate('unlock');
    }

    // ========================================================
    // 32. 🎯 კლინიკური ABA მიზნების სისტემა (IEP Goals Tracker)
    // ========================================================
    loadClinicalGoals() {
        try {
            const key = `pecs_clinical_goals_${this.activeProfileId}`;
            const saved = localStorage.getItem(key);
            if (saved) {
                this.clinicalGoals = JSON.parse(saved);
            } else {
                // საწყისი საბაზისო კლინიკური მიზნები
                this.clinicalGoals = [
                    {
                        id: 'goal_1',
                        title: 'წყლის დამოუკიდებელი მოთხოვნა (Mand)',
                        title_en: 'Independent Request for Water (Mand)',
                        targetCount: 10,
                        currentCount: 6,
                        category: 'მოთხოვნა',
                        category_en: 'Mand'
                    },
                    {
                        id: 'goal_2',
                        title: 'First/Then რუტინის დასრულება (კბილების გახეხვა ➔ თამაში)',
                        title_en: 'Complete First/Then Routine (Brush Teeth ➔ Play)',
                        targetCount: 5,
                        currentCount: 3,
                        category: 'რუტინა',
                        category_en: 'Routine'
                    },
                    {
                        id: 'goal_3',
                        title: 'სხეულის რუკაზე ტკივილის მითითება („მუცელი მტკივა“)',
                        title_en: 'Indicate Pain on Body Map ("Stomach hurts")',
                        targetCount: 3,
                        currentCount: 2,
                        category: 'თვითრეგულაცია',
                        category_en: 'Self-Regulation'
                    }
                ];
                this.saveClinicalGoals();
            }
        } catch(e) {
            this.clinicalGoals = [];
        }
    }

    saveClinicalGoals() {
        const key = `pecs_clinical_goals_${this.activeProfileId}`;
        localStorage.setItem(key, JSON.stringify(this.clinicalGoals));
    }

    renderGoalsTab() {
        const container = document.getElementById('studio-tab-goals');
        if (!container) return;

        const isEn = (this.isEn());
        const profile = this.getActiveProfile();
        const childDisplayName = this.getProfileDisplayName(profile);

        const goalTranslations = {
            'წყლის დამოუკიდებელი მოთხოვნა (Mand)': 'Independent Request for Water (Mand)',
            'First/Then რუტინის დასრულება (კბილების გახეხვა ➔ თამაში)': 'Complete First/Then Routine (Brush Teeth ➔ Play)',
            'სხეულის რუკაზე ტკივილის მითითება („მუცელი მტკივა“)': 'Indicate Pain on Body Map ("Stomach hurts")'
        };

        const categoryTranslations = {
            'მოთხოვნა': 'Mand',
            'რუტინა': 'Routine',
            'გარჩევა': 'Tacting',
            'თვითრეგულაცია': 'Self-Regulation'
        };

        container.innerHTML = `
            <div class="goals-manager-wrap">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
                    <div>
                        <h4 style="font-size:16px; font-weight:900; color:#0F172A; margin-bottom:2px;">
                            ${isEn ? '🎯 Individualized Education Program (IEP Goals)' : '🎯 ინდივიდუალური განვითარების მიზნები (IEP Goals)'}
                        </h4>
                        <p style="font-size:12px; color:#64748B;">
                            ${isEn ? 'Learner:' : 'მოსწავლე:'} <strong>${childDisplayName}</strong> | ${isEn ? 'Behavioral & Communication Milestones' : 'ქცევითი & საკომუნიკაციო სამიზნეები'}
                        </p>
                    </div>
                    <button type="button" id="btn-ai-generate-iep" class="btn-primary-action" style="width:auto; padding:8px 14px; font-size:12.5px; background:linear-gradient(135deg, #0284C7, #4F46E5); border-radius:12px;" onclick="app.generateAiIepGoals()">
                        ✨ ${isEn ? 'Auto-Generate Smart IEP Goals (Nemotron Ultra)' : 'AI-ით მიზნების გენერირება (Nemotron Ultra)'}
                    </button>
                </div>

                <!-- ახალი მიზნის შექმნის ფორმა -->
                <div class="new-goal-form">
                    <div style="font-size:13px; font-weight:900; margin-bottom:8px; color:#0F766E;">
                        ${isEn ? '➕ Add New Therapeutic Goal:' : '➕ ახალი თერაპიული მიზნის დამატება:'}
                    </div>
                    <div style="display:grid; grid-template-columns: 2fr 1fr 1fr auto; gap:8px; align-items:flex-end;">
                        <div>
                            <label style="font-size:11px; font-weight:700; color:#64748B;">${isEn ? 'Goal Description:' : 'მიზნის აღწერა (ქართულად):'}</label>
                            <input type="text" id="new-goal-title" class="form-control" placeholder="${isEn ? 'e.g. Spontaneous sentence request with card' : 'მაგ. ბურთის დამოუკიდებელი მოთხოვნა'}">
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; color:#64748B;">${isEn ? 'Category:' : 'კატეგორია:'}</label>
                            <select id="new-goal-cat" class="form-control">
                                <option value="მოთხოვნა">${isEn ? 'Mand / Request' : 'მოთხოვნა (Mand)'}</option>
                                <option value="რუტინა">${isEn ? 'Routine' : 'რუტინა (Routine)'}</option>
                                <option value="გარჩევა">${isEn ? 'Tacting / Discrimination' : 'გარჩევა (Tacting)'}</option>
                                <option value="თვითრეგულაცია">${isEn ? 'Self-Regulation' : 'თვითრეგულაცია'}</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; color:#64748B;">${isEn ? 'Target Count:' : 'სამიზნე რაოდენობა:'}</label>
                            <input type="number" id="new-goal-target" class="form-control" value="10" min="1" max="100">
                        </div>
                        <button class="btn-primary-action" style="height:42px; width:auto; padding:8px 16px;" onclick="app.addNewClinicalGoal()">
                            ${isEn ? 'Add Goal' : 'დამატება'}
                        </button>
                    </div>
                </div>

                <!-- მიზნების სია -->
                <div class="goals-list-grid">
                    ${this.clinicalGoals.map((g, idx) => {
                        const pct = Math.min(Math.round((g.currentCount / g.targetCount) * 100), 100);
                        const isDone = pct >= 100;
                        const gTitle = isEn ? (g.title_en || goalTranslations[g.title] || this.translateAbaText(g.title) || g.title) : g.title;
                        const gCat = isEn ? (g.category_en || categoryTranslations[g.category] || g.category) : (g.category || 'ABA');
                        const gRationale = isEn ? (g.rationale_en || g.rationale || '') : (g.rationale || '');

                        return `
                            <div class="goal-card ${isDone ? 'achieved' : ''}">
                                <div class="goal-header">
                                    <div>
                                        <div class="goal-title-text">${isDone ? '🏆 ' : '🎯 '}${gTitle}</div>
                                        ${gRationale ? `<div style="font-size:11.5px; color:#0284C7; font-weight:700; margin-top:3px;">✨ ${gRationale}</div>` : ''}
                                        <div style="font-size:12px; color:#64748B; margin-top:2px;">
                                            ${isEn ? 'Completed:' : 'შესრულდა:'} <strong>${g.currentCount}</strong> / ${g.targetCount} ${isEn ? 'successful trials' : 'წარმატებული ცდა'}
                                        </div>
                                    </div>
                                    <span class="goal-target-tag">${gCat}</span>
                                </div>

                                <div class="goal-progress-wrap">
                                    <div class="goal-bar-bg">
                                        <div class="goal-bar-fill" style="width:${pct}%; ${isDone ? 'background:#10B981;' : ''}"></div>
                                    </div>
                                    <span class="goal-pct-text">${pct}%</span>
                                </div>

                                <div class="goal-actions-row">
                                    <div style="display:flex; gap:6px;">
                                        <button class="btn-trial-add" onclick="app.incrementGoalTrial(${idx})">
                                            ➕ ${isEn ? '+1 Success' : '+1 წარმატებული ცდა'}
                                        </button>
                                        <button class="icon-btn" style="padding:4px 8px; font-size:11px;" onclick="app.decrementGoalTrial(${idx})">
                                            ➖ -1
                                        </button>
                                    </div>
                                    <button class="icon-btn" style="color:#DC2626; padding:4px 8px; font-size:11px;" onclick="app.deleteClinicalGoal(${idx})">
                                        🗑️ ${isEn ? 'Delete' : 'წაშლა'}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('') || `<div style="text-align:center; padding:20px; color:#94A3B8;">${isEn ? 'No IEP goals added yet' : 'მიზნები ჯერ არ არის დამატებული'}</div>`}
                </div>
            </div>
        `;
    }

    async generateAiIepGoals() {
        const isEn = this.isEn();
        const btn = document.getElementById('btn-ai-generate-iep');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = isEn ? '⏳ Nemotron 3 Ultra generating SMART goals...' : '⏳ Nemotron 3 Ultra აგენერირებს მიზნებს...';
        }
        try {
            const curProf = this.profiles && this.profiles[this.activeProfileIndex] ? this.profiles[this.activeProfileIndex] : {};
            const res = await fetch('api/ai.php?action=generate_iep_goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: {
                        name: curProf.name || (isEn ? 'Alex' : 'დაჩი'),
                        age: curProf.age || 5,
                        gender: curProf.gender || 'boy',
                        phase: curProf.phase || (isEn ? 'Phase IV' : 'ეტაპი IV')
                    },
                    logs: this.analyticsLogs || [],
                    lang: isEn ? 'en' : 'ka'
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.goals && Array.isArray(data.goals)) {
                    data.goals.forEach((g, i) => {
                        this.clinicalGoals.unshift({
                            id: 'ai_goal_' + Date.now() + '_' + i,
                            title: g.title || g.title_en,
                            title_en: g.title_en || g.title,
                            category: g.category || 'მოთხოვნა',
                            category_en: g.category_en || 'Mand',
                            targetCount: parseInt(g.targetCount) || 10,
                            currentCount: 0,
                            rationale: g.rationale || '',
                            rationale_en: g.rationale_en || g.rationale || ''
                        });
                    });
                    this.saveClinicalGoals();
                    this.renderGoalsTab();
                    if (typeof pecsAudio !== 'undefined') pecsAudio.playSuccess();
                    this.logAbaEvent(isEn ? 'Generated 3 AI SMART IEP Goals' : 'AI-ით დაგენერირდა 3 SMART IEP მიზანი', 'ai_iep_generated');
                }
            }
        } catch (e) {
            console.warn('AI IEP Goal offline:', e);
            this.showAlert(
                isEn
                    ? 'At this stage, live Nebius Token Factory GPU inference (NVIDIA Nemotron 3 Ultra) requires an active internet connection. Core AAC communication board & voice cards remain 100% functional offline.'
                    : 'ამ ეტაპზე Nebius Token Factory-ს ცოცხალი GPU ანალიზისთვის (NVIDIA Nemotron 3 Ultra) საჭიროა აქტიური ინტერნეტ-კავშირი. ბავშვის ძირითადი საკომუნიკაციო დაფა და ხმოვანი ბარათები 100%-ით მუშაობს ოფლაინ რეჟიმში.',
                isEn ? 'Cloud GPU Connection Required' : 'საჭიროა ინტერნეტ-კავშირი',
                '📡'
            );
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `✨ ${isEn ? 'Auto-Generate Smart IEP Goals (Nemotron Ultra)' : 'AI-ით მიზნების გენერირება (Nemotron Ultra)'}`;
            }
        }
    }

    addNewClinicalGoal() {
        const isEn = this.isEn();
        const title = document.getElementById('new-goal-title')?.value.trim();
        const cat = document.getElementById('new-goal-cat')?.value || 'მოთხოვნა';
        const target = parseInt(document.getElementById('new-goal-target')?.value) || 10;

        if (!title) {
            this.showAlert(isEn ? "Please enter a goal description" : "გთხოვთ ჩაწეროთ მიზნის აღწერა", isEn ? "Attention" : "ყურადღება", "🎯");
            return;
        }

        const catMapEn = {
            'მოთხოვნა': 'Mand',
            'რუტინა': 'Routine',
            'გარჩევა': 'Tacting',
            'თვითრეგულაცია': 'Self-Regulation'
        };

        this.clinicalGoals.push({
            id: 'goal_' + Date.now(),
            title: title,
            title_en: isEn ? title : '',
            category: cat,
            category_en: catMapEn[cat] || cat,
            targetCount: target,
            currentCount: 0
        });

        this.saveClinicalGoals();
        this.renderGoalsTab();
        pecsAudio.playSuccess();
        this.logAbaEvent(isEn ? `New goal: ${title}` : `ახალი მიზანი: ${title}`, 'goal_created');
    }

    incrementGoalTrial(index) {
        if (!this.clinicalGoals[index]) return;
        const g = this.clinicalGoals[index];
        g.currentCount++;
        this.saveClinicalGoals();
        this.renderGoalsTab();

        const isEn = this.isEn();
        const goalTranslations = {
            'წყლის დამოუკიდებელი მოთხოვნა (Mand)': 'Independent Request for Water (Mand)',
            'First/Then რუტინის დასრულება (კბილების გახეხვა ➔ თამაში)': 'Complete First/Then Routine (Brush Teeth ➔ Play)',
            'სხეულის რუკაზე ტკივილის მითითება („მუცელი მტკივა“)': 'Indicate Pain on Body Map ("Stomach hurts")'
        };
        const goalTitle = isEn ? (g.title_en || goalTranslations[g.title] || this.translateAbaText(g.title) || g.title) : g.title;

        if (g.currentCount >= g.targetCount) {
            pecsAudio.playFanfare();
            this.celebrate({
                title: isEn ? "🏆 Goal Achieved!" : "🏆 მიზანი მიღწეულია!",
                subtitle: isEn ? "Outstanding Clinical Progress!" : "შესანიშნავი კლინიკური პროგრესი!",
                message: isEn ? `Goal:<br><strong>"${goalTitle}"</strong><br>Successfully completed 100%! Fantastic job! 🎉` : `მიზანი:<br><strong>„${g.title}“</strong><br>წარმატებით დასრულდა 100%-ით! ყოჩაღ! 🎉`,
                avatar: "🌟",
                buttonText: isEn ? "✨ Continue!" : "✨ გაგრძელება!"
            });
            this.logAbaEvent(isEn ? `Goal achieved 100%: ${goalTitle}` : `მიზანი მიღწეულია 100%: ${g.title}`, 'goal_achieved');
        } else {
            pecsAudio.playTap();
        }
    }

    decrementGoalTrial(index) {
        if (!this.clinicalGoals[index] || this.clinicalGoals[index].currentCount <= 0) return;
        this.clinicalGoals[index].currentCount--;
        this.saveClinicalGoals();
        this.renderGoalsTab();
        pecsAudio.playTap();
    }

    deleteClinicalGoal(index) {
        const isEn = this.isEn();
        if (confirm(isEn ? "Are you sure you want to delete this goal?" : "ნამდვილად გსურთ ამ მიზნის წაშლა?")) {
            this.clinicalGoals.splice(index, 1);
            this.saveClinicalGoals();
            this.renderGoalsTab();
            pecsAudio.playClear();
        }
    }

    // ========================================================
    // 35. 🎴 თერაპევტის სწრაფი ბარათის ამრჩევი (Phase 1-3 Target Card Picker)
    // ========================================================
    openQuickCardPickerModal(role = 'target') {
        pecsAudio.playTap();
        const modal = document.getElementById('modal-quick-card-picker');
        if (!modal) return;
        
        modal.classList.add('active');
        this.pickerRole = role;

        const btnTarget = document.getElementById('btn-role-target');
        const btnDistractor = document.getElementById('btn-role-distractor');
        if (btnTarget && btnDistractor) {
            btnTarget.classList.toggle('active', this.pickerRole === 'target');
            btnDistractor.classList.toggle('active', this.pickerRole === 'distractor');
        }

        this.pickerSearchQuery = '';
        const searchInput = document.getElementById('picker-search-input');
        if (searchInput) searchInput.value = '';

        this.renderPickerCategories();
        this.renderPickerCardsGrid();
    }

    setPickerRole(role) {
        this.pickerRole = role || 'target';
        pecsAudio.playTap();
        const btnTarget = document.getElementById('btn-role-target');
        const btnDistractor = document.getElementById('btn-role-distractor');
        if (btnTarget && btnDistractor) {
            btnTarget.classList.toggle('active', this.pickerRole === 'target');
            btnDistractor.classList.toggle('active', this.pickerRole === 'distractor');
        }
        this.renderPickerCardsGrid();
    }

    renderPickerCategories() {
        const container = document.getElementById('picker-categories-tabs');
        if (!container) return;

        const isEn = this.isEn();
        container.innerHTML = this.categories.map(cat => {
            const catTitle = isEn ? (cat.title_en || cat.title_ka) : (cat.title_ka || cat.title_en);
            return `
                <button class="picker-cat-btn ${this.pickerCategory === cat.id ? 'active' : ''}" 
                        onclick="app.selectPickerCategory('${cat.id}')">
                    <span>${cat.icon}</span>
                    <span>${catTitle}</span>
                </button>
            `;
        }).join('');
    }

    selectPickerCategory(catId) {
        this.pickerCategory = catId;
        pecsAudio.playTap();
        this.renderPickerCategories();
        this.renderPickerCardsGrid();
    }

    filterPickerCards(query) {
        this.pickerSearchQuery = (query || '').trim().toLowerCase();
        this.renderPickerCardsGrid();
    }

    renderPickerCardsGrid() {
        const grid = document.getElementById('picker-cards-grid');
        if (!grid) return;

        let pool = this.cards;
        if (this.pickerCategory !== 'all') {
            pool = pool.filter(c => c.category === this.pickerCategory);
        }

        const isEn = this.isEn();
        if (this.pickerSearchQuery) {
            const q = this.pickerSearchQuery;
            pool = pool.filter(c => 
                (c.text && c.text.toLowerCase().includes(q)) || 
                (c.text_en && c.text_en.toLowerCase().includes(q)) ||
                (c.spoken && c.spoken.toLowerCase().includes(q)) ||
                (c.spoken_en && c.spoken_en.toLowerCase().includes(q))
            );
        }

        if (pool.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:30px; color:#94A3B8; font-weight:700;">${isEn ? 'No cards found' : 'ბარათი ვერ მოიძებნა'}</div>`;
            return;
        }

        grid.innerHTML = pool.map(card => {
            const isCurrent = (this.pickerRole === 'distractor') 
                ? (card.id === this.phaseDistractorCardId) 
                : (card.id === this.phaseTargetCardId);

            const cardLabel = (isEn && card.text_en) ? card.text_en : card.text;
            let visual = `<div class="picker-card-icon">${card.icon || '📌'}</div>`;
            if (card.image || card.arasaacUrl) {
                const src = card.image || card.arasaacUrl;
                visual = `<img src="${src}" class="picker-card-img" alt="${cardLabel}">`;
            }

            return `
                <div class="picker-card-item ${isCurrent ? 'is-current-target' : ''}" 
                     onclick="app.selectPhaseTargetCard('${card.id}')">
                    ${visual}
                    <div class="picker-card-text">${cardLabel}</div>
                </div>
            `;
        }).join('');
    }

    selectPhaseTargetCard(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;

        const profile = this.getActiveProfile();

        if (this.pickerRole === 'distractor') {
            this.phaseDistractorCardId = cardId;
            if (profile) {
                profile.phaseDistractorCardId = cardId;
                this.saveProfiles();
            }
            const isEn = this.isEn();
            const cardLabel = (isEn && card.text_en) ? card.text_en : card.text;
            pecsAudio.playSuccess();
            this.closeModal('modal-quick-card-picker');
            this.renderCardsGrid();
            this.logAbaEvent(`Distractor card: ${cardLabel}`, 'distractor_card_selected');
            this.showToast(isEn ? `Distractor card: "${cardLabel}"` : `არასასურველი ბარათი: „${card.text}“`);
        } else {
            this.phaseTargetCardId = cardId;
            if (profile) {
                profile.phaseTargetCardId = cardId;
                this.saveProfiles();
            }
            const isEn = this.isEn();
            const cardLabel = (isEn && card.text_en) ? card.text_en : card.text;
            pecsAudio.playSuccess();
            this.closeModal('modal-quick-card-picker');
            this.renderCardsGrid();
            this.logAbaEvent(`Target card: ${cardLabel}`, 'target_card_selected');
            this.showToast(isEn ? `Target card: "${cardLabel}"` : `სამიზნე ბარათი: „${card.text}“`);
        }
    }

    setupEventListeners() {
        document.getElementById('gate-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.checkParentalGate();
        });

        let searchTimeout;
        const arasaacInput = document.getElementById('arasaac-search-input');
        if (arasaacInput) {
            arasaacInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchArasaac(e.target.value);
                }, 400);
            });
        }

        // ტაბის ხელახლა გახსნისას Wake Lock-ის აღდგენა თუ საკეტი ჩართულია
        document.addEventListener('visibilitychange', async () => {
            if (this.wakeLock !== null && document.visibilityState === 'visible' && this.isChildLocked) {
                await this.requestWakeLock();
            }
        });
    }

    // ========================================================
    // 🎙️ ექსპრეს ხმის ჩაწერის სტუდია (Express Voice Studio)
    // ========================================================
    openExpressVoiceStudio(targetCardText = null) {
        const rawList = [
            ...(this.starterCards || []),
            ...(this.cards || []),
            ...(this.customCards || []),
            ...(this.defaultPresetCards || [])
        ];
        const seen = new Set();
        this.voiceStudioCards = [];

        // პრიორიტეტული საბაზისო სიტყვები სიის თავში
        const priorityIds = ['starter_want', 'c_want', 'starter_dont_want', 'c_dont_want', 'c_help', 'c_yes', 'c_no', 'c_more', 'c_finished', 'c_stop'];
        
        // 1. ჯერ პრიორიტეტული ბარათები
        priorityIds.forEach(pid => {
            const match = rawList.find(c => c && c.id === pid);
            if (match && match.text && !seen.has(match.text)) {
                seen.add(match.text);
                this.voiceStudioCards.push(match);
            }
        });

        // 2. შემდეგ ყველა დანარჩენი ბარათი
        rawList.forEach(c => {
            if (c && c.text && !seen.has(c.text)) {
                seen.add(c.text);
                this.voiceStudioCards.push(c);
            }
        });

        if (this.voiceStudioCards.length === 0) {
            this.showAlert(this.isEn() ? 'Cards are not loaded yet. Please wait a second.' : 'ბარათები ჯერ არ არის ჩატვირთული. გთხოვთ დაელოდოთ 1 წამი.', this.isEn() ? 'Voice Studio' : 'სტუდია', '🎙️');
            return;
        }

        // თუ გადმოეცა კონკრეტული ბარათის ტექსტი (მაგ: "არ მინდა" ან "Water")
        let initIdx = 0;
        if (targetCardText) {
            const targetNorm = targetCardText.toLowerCase().trim();
            const foundIdx = this.voiceStudioCards.findIndex(c => {
                const en = (c.text_en || this.translateAbaText(c.text) || '').toLowerCase();
                const ka = (c.text || '').toLowerCase();
                return en.includes(targetNorm) || ka.includes(targetNorm);
            });
            if (foundIdx >= 0) initIdx = foundIdx;
        }

        this.voiceStudioIndex = initIdx;

        const isEn = this.isEn();
        this.translateModalsUI(isEn ? 'en' : 'ka');
        const searchInput = document.getElementById('voice-studio-search');
        if (searchInput) {
            searchInput.value = '';
            searchInput.placeholder = isEn ? '🔍 Search card to vocalize...' : '🔍 მოძებნეთ გასახმოვანებელი ბარათი...';
        }

        this.populateVoiceStudioSelect();
        this.renderVoiceStudioCard();
        
        const modal = document.getElementById('modal-voice-studio');
        if (modal) {
            modal.classList.add('active');
        }
        pecsAudio.playTap();
    }

    populateVoiceStudioSelect(filteredList = null) {
        const sel = document.getElementById('voice-studio-select');
        if (!sel) return;
        const list = filteredList || this.voiceStudioCards;
        if (!list || !Array.isArray(list)) return;
        const isEn = this.isEn();
        sel.innerHTML = list.map(c => {
            const originalIdx = (this.voiceStudioCards && this.voiceStudioCards.indexOf(c) >= 0) ? this.voiceStudioCards.indexOf(c) : 0;
            const recordedIcon = c.audioRecord ? '🎙️ ' : '';
            const label = isEn ? (c.text_en || this.translateAbaText(c.text) || c.text) : c.text;
            return `<option value="${originalIdx}">${recordedIcon}${c.icon || '🎴'} ${label}</option>`;
        }).join('');
        sel.value = this.voiceStudioIndex;
    }

    filterVoiceStudioSelect(query) {
        const q = (query || '').toLowerCase().trim();
        if (!q) {
            this.populateVoiceStudioSelect();
            return;
        }
        const isEn = this.isEn();
        const filtered = this.voiceStudioCards.filter(c => {
            if (!c) return false;
            const labelEn = (c.text_en || this.translateAbaText(c.text) || '').toLowerCase();
            const labelKa = (c.text || '').toLowerCase();
            const spokenEn = (c.spoken_en || '').toLowerCase();
            const spokenKa = (c.spoken || '').toLowerCase();
            return labelEn.includes(q) || labelKa.includes(q) || spokenEn.includes(q) || spokenKa.includes(q);
        });

        const sel = document.getElementById('voice-studio-select');
        if (filtered.length === 0) {
            if (sel) {
                sel.innerHTML = `<option value="" disabled selected>${isEn ? '❌ No cards match "' + query + '"' : '❌ ბარათი ვერ მოიძებნა'}</option>`;
            }
            return;
        }

        this.populateVoiceStudioSelect(filtered);
        const firstIdx = this.voiceStudioCards.indexOf(filtered[0]);
        if (firstIdx >= 0) {
            this.selectVoiceStudioCard(firstIdx);
        }
    }

    selectVoiceStudioCard(idx) {
        this.voiceStudioIndex = parseInt(idx, 10);
        this.renderVoiceStudioCard();
    }

    renderVoiceStudioCard() {
        const card = this.voiceStudioCards[this.voiceStudioIndex];
        if (!card) return;

        const counterEl = document.getElementById('voice-studio-counter');
        const iconEl = document.getElementById('voice-studio-icon');
        const textEl = document.getElementById('voice-studio-text');
        const hintEl = document.getElementById('voice-studio-hint');
        const selEl = document.getElementById('voice-studio-select');
        const statusEl = document.getElementById('voice-studio-status');
        const btnRec = document.getElementById('btn-voice-studio-rec');
        const badgeEl = document.getElementById('voice-studio-source-badge');
        const btnReset = document.getElementById('btn-voice-studio-reset');

        const isEn = this.isEn();
        const targetName = isEn ? (card.text_en || this.translateAbaText(card.text) || card.text) : card.text;
        const targetSpoken = isEn ? (card.spoken_en || card.text_en || this.translateAbaText(card.spoken || card.text) || targetName) : (card.spoken || targetName);
        if (counterEl) counterEl.innerText = isEn ? `Card ${this.voiceStudioIndex + 1} / ${this.voiceStudioCards.length}` : `ბარათი ${this.voiceStudioIndex + 1} / ${this.voiceStudioCards.length}`;
        if (iconEl) iconEl.innerText = card.icon || '🎴';
        if (textEl) textEl.innerText = targetName;
        if (hintEl) hintEl.innerHTML = isEn ? `Speak clearly and warmly: <strong>"${targetSpoken}"</strong>` : `თქვით მკაფიოდ და თბილად: <strong>„${targetSpoken}“</strong>`;
        if (selEl) selEl.value = this.voiceStudioIndex;
        if (statusEl) statusEl.innerText = '';
        if (btnRec) {
            btnRec.classList.remove('recording');
            btnRec.innerHTML = isEn ? '🔴 Record' : '🔴 ჩაწერა';
        }

        if (card.audioRecord) {
            if (badgeEl) {
                badgeEl.innerText = isEn ? '🎙️ Recorded Custom Voice' : '🎙️ დედის/თერაპევტის ხმა';
                badgeEl.style.background = '#ECFDF5';
                badgeEl.style.color = '#059669';
            }
            if (btnReset) btnReset.style.display = 'inline-block';
        } else {
            if (badgeEl) {
                badgeEl.innerText = isEn ? '🤖 Default System Voice' : '🤖 ნაგულისხმევი ქართული ხმა';
                badgeEl.style.background = '#E0F2FE';
                badgeEl.style.color = '#0369A1';
            }
            if (btnReset) btnReset.style.display = 'none';
        }
    }

    async toggleExpressVoiceRecord() {
        const btn = document.getElementById('btn-voice-studio-rec');
        const timerEl = document.getElementById('voice-studio-timer');
        const statusEl = document.getElementById('voice-studio-status');
        const vuContainer = document.getElementById('voice-studio-vu-container');
        const vuBar = document.getElementById('voice-studio-vu-bar');
        const card = this.voiceStudioCards[this.voiceStudioIndex];
        const isEn = this.isEn();

        if (!pecsAudio.isRecording) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (!isLocal) {
                    const locUrl = window.location.href.replace(window.location.hostname, 'localhost');
                    const confirmMsg = isEn 
                        ? "🎙️ In Chrome, microphone recording is disabled on network IP (192.168.x.x) for security.\n\nWould you like to switch to http://localhost/voxis/ where microphone is fully enabled?"
                        : "🎙️ Chrome-ის უსაფრთხოების წესით, ქსელურ IP-ზე (192.168.x.x) მიკროფონი იბლოკება.\n\nგსურთ გადახვიდეთ http://localhost/voxis/-ზე, სადაც მიკროფონი სრულად ჩართულია?";
                    if (confirm(confirmMsg)) {
                        window.location.href = locUrl;
                        return;
                    }
                }
                this.showAlert(isEn ? "Microphone access requires http://localhost/voxis/ or HTTPS." : "მიკროფონისთვის საჭიროა http://localhost/voxis/ ან HTTPS.", isEn ? 'Microphone' : 'მიკროფონი', '🎙️');
                return;
            }

            try {
                if (vuContainer) vuContainer.style.display = 'block';
                if (vuBar) vuBar.style.width = '0%';

                await pecsAudio.startRecording((level) => {
                    if (vuBar) {
                        vuBar.style.width = Math.min(100, Math.max(6, level)) + '%';
                        if (level > 40) vuBar.style.background = '#F59E0B';
                        else if (level > 75) vuBar.style.background = '#EF4444';
                        else vuBar.style.background = '#10B981';
                    }
                });

                btn.classList.add('recording');
                btn.innerHTML = isEn ? '⏹️ Stop' : '⏹️ შეჩერება';
                if (timerEl) {
                    timerEl.style.display = 'inline-block';
                    timerEl.innerText = '00:00';
                }
                this.voiceStudioSeconds = 0;
                this.voiceStudioTimer = setInterval(() => {
                    this.voiceStudioSeconds++;
                    const s = this.voiceStudioSeconds < 10 ? '0' + this.voiceStudioSeconds : this.voiceStudioSeconds;
                    if (timerEl) timerEl.innerText = `00:${s}`;
                }, 1000);
                if (statusEl) statusEl.innerText = isEn ? '🎙️ Recording in progress... Speak clearly' : '🎙️ ჩაწერა მიმდინარეობს... ისაუბრეთ';
            } catch(e) {
                if (vuContainer) vuContainer.style.display = 'none';
                let rawMsg = e.message || '';
                let msg = rawMsg;
                if (isEn) {
                    if (rawMsg.includes('მხარდაჭერილი') || rawMsg.includes('IP') || rawMsg.includes('insecure')) {
                        msg = 'Microphone access requires http://localhost/voxis/ or HTTPS.';
                    } else if (rawMsg.includes('Permission') || rawMsg.includes('denied') || rawMsg.includes('ნებართვა')) {
                        msg = 'Microphone permission was denied. Please allow microphone access in your browser address bar.';
                    }
                    this.showAlert('Microphone access error: ' + msg, 'Microphone', '🎙️');
                } else {
                    this.showAlert('მიკროფონთან წვდომა ვერ მოხერხდა: ' + msg, 'მიკროფონი', '🎙️');
                }
            }
        } else {
            clearInterval(this.voiceStudioTimer);
            if (timerEl) timerEl.style.display = 'none';
            if (vuContainer) vuContainer.style.display = 'none';
            btn.classList.remove('recording');
            btn.innerHTML = isEn ? '⏳ Saving...' : '⏳ ინახება...';

            try {
                const recordedAudio = await pecsAudio.stopRecording(); // Base64 data URL
                
                // Convert Data URL to Blob
                const res = await fetch(recordedAudio);
                const blob = await res.blob();

                if (blob.size < 350) {
                    if (statusEl) statusEl.innerHTML = isEn ? '⚠️ <strong>Recording was too short.</strong> Please click record, speak clearly, then click stop.' : '⚠️ <strong>ჩაწერა ძალიან მოკლე იყო.</strong> გთხოვთ დააჭიროთ ჩაწერას, მშვიდად თქვათ სიტყვა და შემდეგ დააჭიროთ შეჩერებას.';
                    btn.innerHTML = isEn ? '🔴 Record' : '🔴 ჩაწერა';
                    return;
                }

                const formData = new FormData();
                formData.append('card_id', card.id);
                formData.append('audio', blob, `${card.id}.mp3`);

                const uploadRes = await fetch('api/save_audio.php', {
                    method: 'POST',
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (uploadData.success) {
                    card.audioRecord = recordedAudio;
                    try {
                        const savedRecs = JSON.parse(localStorage.getItem('pecs_custom_recordings') || '{}');
                        savedRecs[card.id] = recordedAudio;
                        if (card.text === 'არ მინდა' || card.id === 'c_dont_want' || card.id === 'starter_dont_want') {
                            savedRecs['c_dont_want'] = recordedAudio;
                            savedRecs['starter_dont_want'] = recordedAudio;
                            savedRecs['core_dont_want'] = recordedAudio;
                        } else if (card.text === 'მე მინდა' || card.id === 'c_want' || card.id === 'starter_want') {
                            savedRecs['c_want'] = recordedAudio;
                            savedRecs['starter_want'] = recordedAudio;
                            savedRecs['core_want'] = recordedAudio;
                        }
                        localStorage.setItem('pecs_custom_recordings', JSON.stringify(savedRecs));
                    } catch(e) {}

                    this.renderVoiceStudioCard();
                    if (statusEl) statusEl.innerHTML = isEn ? '✅ <strong>Your voice was recorded successfully! (Playing now)</strong>' : '✅ <strong>თქვენი ხმა წარმატებით ჩაიწერა! (დაუკრავს მაშინვე)</strong>';
                    btn.innerHTML = isEn ? '🔴 Record Again' : '🔴 ხელახლა ჩაწერა';
                    
                    pecsAudio.playAudioData(recordedAudio);
                } else {
                    throw new Error(uploadData.error || (isEn ? 'Failed to save audio' : 'შენახვა ვერ მოხერხდა'));
                }
            } catch(err) {
                console.error('Express record error:', err);
                if (statusEl) statusEl.innerText = (isEn ? '⚠️ Error: ' : '⚠️ შეცდომა: ') + err.message;
                btn.innerHTML = isEn ? '🔴 Record' : '🔴 ჩაწერა';
            }
        }
    }

    resetExpressVoiceCard() {
        const card = this.voiceStudioCards[this.voiceStudioIndex];
        if (!card) return;
        const isEn = this.isEn();

        delete card.audioRecord;
        try {
            const savedRecs = JSON.parse(localStorage.getItem('pecs_custom_recordings') || '{}');
            delete savedRecs[card.id];
            localStorage.setItem('pecs_custom_recordings', JSON.stringify(savedRecs));
        } catch(e) {}

        this.renderVoiceStudioCard();
        const statusEl = document.getElementById('voice-studio-status');
        if (statusEl) statusEl.innerHTML = isEn ? '🔄 <strong>Default voice restored</strong>' : '🔄 <strong>აღდგენილია ნაგულისხმევი ქართული ხმა</strong>';
        pecsAudio.playClear();
        pecsAudio.speakCardOrText(card);
    }

    resetAllCustomRecordings() {
        const isEn = this.isEn();
        if (!confirm(isEn ? "Are you sure you want to clear all custom recordings and revert to system voice (Bella)?" : "დარწმუნებული ხართ, რომ გსურთ ყველა ჩაწერილი ხმის გასუფთავება და სუფთა AI ხმის (ბელა) დაბრუნება?")) return;
        localStorage.removeItem('pecs_custom_recordings');
        localStorage.setItem('pecs_tts_voice', 'bella');
        localStorage.setItem('pecs_voice_v', 'bella_final');
        if (window.pecsAudio) pecsAudio.setVoice('bella');
        location.reload();
    }

    playExpressVoicePreview() {
        const card = this.voiceStudioCards[this.voiceStudioIndex];
        if (!card) return;
        const isEn = this.isEn();

        const btn = document.getElementById('btn-voice-studio-play');
        const statusEl = document.getElementById('voice-studio-status');
        if (btn) {
            btn.innerHTML = isEn ? '<span>🔊</span> <span>Playing...</span>' : '<span>🔊</span> <span>იკვრება...</span>';
            btn.style.opacity = '0.7';
        }

        const onDone = () => {
            if (btn) {
                btn.innerHTML = isEn ? '<span>▶️</span> <span>Listen</span>' : '<span>▶️</span> <span>მოსმენა</span>';
                btn.style.opacity = '1';
            }
        };

        if (card.audioRecord) {
            if (statusEl) statusEl.innerHTML = isEn ? '🎙️ <strong>Your Recorded Voice</strong>' : '🎙️ <strong>თქვენი ჩაწერილი ხმა</strong>';
            pecsAudio.playAudioData(card.audioRecord, onDone);
        } else {
            if (statusEl) statusEl.innerHTML = isEn ? '🤖 <strong>Default System Voice</strong>' : '🤖 <strong>ნაგულისხმევი ქართული ხმა</strong>';
            pecsAudio.speakCardOrText(card, null, onDone);
        }
    }

    nextVoiceStudioCard() {
        if (this.voiceStudioIndex < this.voiceStudioCards.length - 1) {
            this.voiceStudioIndex++;
            this.renderVoiceStudioCard();
            pecsAudio.playTap();
        }
    }

    prevVoiceStudioCard() {
        if (this.voiceStudioIndex > 0) {
            this.voiceStudioIndex--;
            this.renderVoiceStudioCard();
            pecsAudio.playTap();
        }
    }

    // ========================================================
    // 📚 ბარათების ბაზა & ძიება (Card Library & Search Engine)
    // ========================================================
    async loadAacLibrary() {
        try {
            const res = await fetch('data/aac_library.json?v=' + Date.now());
            const data = await res.json();
            this.aacLibrary = data.cards || [];
        } catch(e) {
            console.warn('Could not load data/aac_library.json', e);
            this.aacLibrary = [];
        }
    }

    handleBoardLiveSearch(val) {
        this.searchQuery = (val || '').trim();
        this.boardCurrentPage = 1;
        const clearBtn = document.getElementById('btn-clear-board-search');
        if (clearBtn) {
            clearBtn.style.display = this.searchQuery ? 'inline-block' : 'none';
        }
        this.renderCardsGrid();
    }

    clearBoardSearch() {
        const input = document.getElementById('board-live-search');
        if (input) input.value = '';
        this.handleBoardLiveSearch('');
        pecsAudio.playTap();
    }

    openCardLibraryModal(prefillQuery = '') {
        pecsAudio.playWoodTap();
        const modal = document.getElementById('modal-card-library');
        if (!modal) return;
        modal.style.display = 'flex';

        this.translateCustomCardMakerUI(this.isEn() ? 'en' : 'ka');

        const searchInput = document.getElementById('lib-search-input');
        const clearBtn = document.getElementById('lib-search-clear');

        if (prefillQuery && prefillQuery.trim()) {
            this.librarySearchQuery = prefillQuery.trim();
            if (searchInput) searchInput.value = this.librarySearchQuery;
            if (clearBtn) clearBtn.style.display = 'inline-block';
        } else {
            this.librarySearchQuery = (searchInput && searchInput.value) ? searchInput.value.trim() : '';
            if (clearBtn) clearBtn.style.display = this.librarySearchQuery ? 'inline-block' : 'none';
        }

        this.renderLibraryCategoryPills();
        this.renderLibraryCards();

        // თუ წინასწარ გადმოცემული სიტყვა მზა ბაზაში არ მოიძებნა, გადავიდეთ ARASAAC ტაბზე
        if (this.librarySearchQuery) {
            const queryLower = this.librarySearchQuery.toLowerCase();
            const foundInPreset = (this.aacLibrary || []).some(c => 
                (c.text && c.text.toLowerCase().includes(queryLower)) ||
                (c.spoken && c.spoken.toLowerCase().includes(queryLower))
            );
            if (!foundInPreset) {
                this.switchLibraryTab('arasaac');
                return;
            }
        }

        this.switchLibraryTab(this.activeLibraryTab || 'preset');
    }

    closeCardLibraryModal() {
        pecsAudio.playTap();
        const modal = document.getElementById('modal-card-library');
        if (modal) modal.style.display = 'none';
    }

    switchLibraryTab(tabId) {
        this.activeLibraryTab = tabId || 'preset';
        pecsAudio.playTap();

        ['preset', 'arasaac', 'create'].forEach(t => {
            const btn = document.getElementById(`tab-btn-lib-${t}`);
            const panel = document.getElementById(`lib-view-${t}`);
            if (btn) btn.classList.toggle('active', t === this.activeLibraryTab);
            if (panel) panel.style.display = (t === this.activeLibraryTab) ? 'block' : 'none';
        });

        if (this.activeLibraryTab === 'preset') {
            this.renderLibraryCards();
        } else if (this.activeLibraryTab === 'arasaac') {
            this.searchLibraryArasaac(this.librarySearchQuery || '');
        }
    }

    filterCardLibrary(query) {
        this.librarySearchQuery = (query || '').trim();
        const clearBtn = document.getElementById('lib-search-clear');
        if (clearBtn) {
            clearBtn.style.display = this.librarySearchQuery ? 'inline-block' : 'none';
        }

        if (this.activeLibraryTab === 'preset') {
            this.renderLibraryCards();
        } else if (this.activeLibraryTab === 'arasaac') {
            if (this.arasaacSearchTimeout) clearTimeout(this.arasaacSearchTimeout);
            this.arasaacSearchTimeout = setTimeout(() => {
                this.searchLibraryArasaac(this.librarySearchQuery);
            }, 350);
        }
    }

    clearLibrarySearch() {
        const searchInput = document.getElementById('lib-search-input');
        if (searchInput) searchInput.value = '';
        this.filterCardLibrary('');
        pecsAudio.playTap();
    }

    renderLibraryCategoryPills() {
        const container = document.getElementById('lib-category-pills');
        if (!container) return;

        const isEn = (this.isEn());
        const categories = [
            { id: 'all', name: isEn ? 'All' : 'ყველა', icon: '🌟' },
            { id: 'food', name: isEn ? 'Food' : 'საჭმელი', icon: '🍎' },
            { id: 'drinks', name: isEn ? 'Drinks' : 'სასმელი', icon: '💧' },
            { id: 'toys', name: isEn ? 'Toys' : 'სათამაშო', icon: '🧸' },
            { id: 'actions', name: isEn ? 'Actions' : 'მოქმედება', icon: '🏃' },
            { id: 'hygiene', name: isEn ? 'Hygiene & Routine' : 'ჰიგიენა & რუტინა', icon: '🧼' },
            { id: 'people', name: isEn ? 'People' : 'ადამიანები', icon: '👥' },
            { id: 'feelings', name: isEn ? 'Emotions' : 'ემოციები', icon: '💖' },
            { id: 'animals', name: isEn ? 'Animals' : 'ცხოველები', icon: '🐾' },
            { id: 'school', name: isEn ? 'School & Items' : 'სკოლა & ნივთები', icon: '🏫' },
            { id: 'basic', name: isEn ? 'Basic & Social' : 'საბაზისო', icon: '⚡' }
        ];

        container.innerHTML = categories.map(cat => `
            <button type="button" class="lib-cat-pill ${this.activeLibraryCategory === cat.id ? 'active' : ''}" 
                    onclick="app.selectLibraryCategory('${cat.id}')">
                <span>${cat.icon}</span> <span>${cat.name}</span>
            </button>
        `).join('');
    }

    selectLibraryCategory(catId) {
        this.activeLibraryCategory = catId || 'all';
        pecsAudio.playWoodTap();
        this.renderLibraryCategoryPills();
        this.renderLibraryCards();
    }

    isCardOnBoard(cardOrText, optTextEn = '') {
        if (!cardOrText) return false;
        if (!this.cards || !this.cards.length) return false;

        const norm = (s) => (s || '').toString().trim().toLowerCase();
        const cleanId = (id) => (id || '').replace(/^(c_|lib_|board_|board_lib_)/, '');
        const getParts = (str) => norm(str).split(/[\/,;\(\)]/).map(p => p.trim()).filter(p => p.length > 1);

        let cardId = '';
        let cardText = '';
        let cardTextEn = '';

        if (typeof cardOrText === 'object' && cardOrText !== null) {
            cardId = cardOrText.id || '';
            cardText = norm(cardOrText.text || cardOrText.spoken);
            cardTextEn = norm(cardOrText.text_en || cardOrText.spoken_en);
        } else {
            cardText = norm(cardOrText);
            cardTextEn = norm(optTextEn);
        }

        const targetBaseId = cleanId(cardId);
        const tKaParts = getParts(cardText);
        const tEnParts = getParts(cardTextEn);

        return this.cards.some(c => {
            if (!c) return false;
            const cBaseId = cleanId(c.id);
            const cKa = norm(c.text || c.spoken);
            const cEn = norm(c.text_en || c.spoken_en);

            // 1. Match by exact ID or clean base ID (e.g. c_tea vs lib_tea vs board_lib_tea)
            if (cardId && (c.id === cardId || c.id === 'board_' + cardId || c.id === 'lib_' + cardId)) return true;
            if (targetBaseId && cBaseId && targetBaseId === cBaseId) return true;

            // 2. Exact text match
            if (cardText && cKa && cardText === cKa) return true;
            if (cardTextEn && cEn && cardTextEn === cEn) return true;

            // 3. Cross language match
            if (cardText && cEn && cardText === cEn) return true;
            if (cardTextEn && cKa && cardTextEn === cKa) return true;

            // 4. Cross-part match (e.g. "დონატი / ტკბილეული" matches "დონატი")
            if (tKaParts.length > 0 && cKa) {
                const cParts = getParts(cKa);
                if (tKaParts.some(p => cParts.includes(p))) return true;
            }
            if (tEnParts.length > 0 && cEn) {
                const cParts = getParts(cEn);
                if (tEnParts.some(p => cParts.includes(p))) return true;
            }

            return false;
        });
    }

    renderLibraryCards() {
        const grid = document.getElementById('lib-preset-cards-grid');
        const counter = document.getElementById('lib-results-counter');
        if (!grid) return;

        const isEn = (this.isEn());
        let list = this.aacLibrary || [];

        // კატეგორიის ფილტრი
        if (this.activeLibraryCategory && this.activeLibraryCategory !== 'all') {
            list = list.filter(c => c.category === this.activeLibraryCategory);
        }

        // ტექსტის ძიების ფილტრი
        if (this.librarySearchQuery) {
            const q = this.librarySearchQuery.toLowerCase();
            list = list.filter(c => 
                (c.text && c.text.toLowerCase().includes(q)) || 
                (c.spoken && c.spoken.toLowerCase().includes(q)) ||
                (c.text_en && c.text_en.toLowerCase().includes(q)) ||
                (c.spoken_en && c.spoken_en.toLowerCase().includes(q))
            );
        }

        if (counter) {
            counter.innerHTML = isEn 
                ? `Total found: <strong>${list.length}</strong> cards`
                : `სულ მოიძებნა: <strong>${list.length}</strong> ბარათი`;
        }

        if (list.length === 0) {
            const q = this.librarySearchQuery;
            grid.innerHTML = isEn ? `
                <div class="lib-empty-state">
                    <div style="font-size:36px; margin-bottom:8px;">🔎</div>
                    <div style="font-weight:900; font-size:16px; color:#1E293B;">Card "${q}" not found in presets</div>
                    <p style="font-size:12px; color:#64748B; margin:6px 0 14px 0;">Search in ARASAAC 10,000+ online symbols or create your own:</p>
                    <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                        <button type="button" class="btn-primary-action" style="width:auto; padding:8px 16px; font-size:13px;" onclick="app.switchLibraryTab('arasaac')">
                            🌐 Search in ARASAAC
                        </button>
                        <button type="button" class="icon-btn" style="padding:8px 16px; font-size:13px;" onclick="app.switchLibraryTab('create')">
                            ✨ Create Custom Card
                        </button>
                    </div>
                </div>
            ` : `
                <div class="lib-empty-state">
                    <div style="font-size:36px; margin-bottom:8px;">🔎</div>
                    <div style="font-weight:900; font-size:16px; color:#1E293B;">ბაზაში ბარათი „${q}“ ვერ მოიძებნა</div>
                    <p style="font-size:12px; color:#64748B; margin:6px 0 14px 0;">მოძებნეთ ARASAAC-ის 10,000+ სიმბოლოში ან თავად შექმენით:</p>
                    <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                        <button type="button" class="btn-primary-action" style="width:auto; padding:8px 16px; font-size:13px;" onclick="app.switchLibraryTab('arasaac')">
                            🌐 ARASAAC-ში ძებნა
                        </button>
                        <button type="button" class="icon-btn" style="padding:8px 16px; font-size:13px;" onclick="app.switchLibraryTab('create')">
                            ✨ ახალი ბარათის შექმნა
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const categoryNames = isEn ? {
            'food': 'Food',
            'drinks': 'Drinks',
            'toys': 'Toys',
            'actions': 'Actions',
            'hygiene': 'Hygiene',
            'people': 'People',
            'feelings': 'Emotions',
            'animals': 'Animals',
            'school': 'School',
            'basic': 'Basic'
        } : {
            'food': 'საჭმელი',
            'drinks': 'სასმელი',
            'toys': 'სათამაშო',
            'actions': 'მოქმედება',
            'hygiene': 'ჰიგიენა',
            'people': 'ადამიანები',
            'feelings': 'ემოცია',
            'animals': 'ცხოველები',
            'school': 'სკოლა',
            'basic': 'საბაზისო'
        };

        grid.innerHTML = list.map(card => {
            const onBoard = this.isCardOnBoard(card);
            const catLabel = categoryNames[card.category] || card.category || '';
            const typeClass = `type-${card.type || 'noun'}`;
            const displayTitle = isEn ? (card.text_en || this.translateAbaText(card.text) || card.text) : card.text;
            const voiceText = isEn ? (card.spoken_en || card.text_en || this.translateAbaText(card.spoken || card.text) || displayTitle) : (card.spoken || card.text);

            let iconHtml = `<span class="lib-tile-icon">${card.icon || '📌'}</span>`;
            if (card.image) {
                iconHtml = `<img src="${card.image}" class="lib-tile-img" alt="${displayTitle}">`;
            }

            let actionBtn = '';
            if (this.activePhase <= 2) {
                const currentTargetCard = this.cards.find(c => c.id === this.phaseTargetCardId) || this.cards[0];
                const isCurrentTarget = currentTargetCard && (
                    currentTargetCard.id === card.id || 
                    currentTargetCard.id === 'board_' + card.id || 
                    (card.id && currentTargetCard.id.replace(/^(c_|lib_|board_|board_lib_)/, '') === card.id.replace(/^(c_|lib_|board_|board_lib_)/, '')) ||
                    (currentTargetCard.text && card.text && currentTargetCard.text.trim().toLowerCase() === card.text.trim().toLowerCase())
                );
                actionBtn = isCurrentTarget
                    ? `<button type="button" class="btn-lib-card-action added" style="background:#059669; color:#fff;" title="${isEn ? 'This card is currently active on board' : 'ეს ბარათი აქტიურია დაფაზე'}">
                           <span class="lca-icon">🎯</span>
                           <span class="lca-text">${isEn ? 'Active' : 'აქტიურია'}</span>
                       </button>`
                    : `<button type="button" class="btn-lib-card-action add" style="background:#0284C7; color:#fff; border-color:#38BDF8;" onclick="app.addCardFromLibrary('${card.id}')" title="${isEn ? 'Click to select for board' : 'დააჭირეთ დაფაზე გამოსატანად'}">
                           <span class="lca-icon">🎯</span>
                           <span class="lca-text">${isEn ? 'Select' : 'არჩევა'}</span>
                       </button>`;
            } else {
                actionBtn = onBoard
                    ? `<button type="button" class="btn-lib-card-action added btn-remove-board-card" onclick="app.removeCardFromBoard('${card.id}')" title="${isEn ? 'Remove from board' : 'დაფიდან წაშლა'}">
                           <span class="lca-icon">🗑️</span>
                           <span class="lca-text">${isEn ? 'Remove' : 'წაშლა'}</span>
                       </button>`
                    : `<button type="button" class="btn-lib-card-action add" onclick="app.addCardFromLibrary('${card.id}')" title="${isEn ? 'Add to board' : 'დაფაზე დამატება'}">
                           <span class="lca-icon">➕</span>
                           <span class="lca-text">${isEn ? 'Add' : 'დამატება'}</span>
                       </button>`;
            }

            return `
                <div class="lib-card-tile ${typeClass} ${onBoard ? 'is-on-board' : ''}">
                    <div class="lib-tile-visual" onclick="pecsAudio.speak('${voiceText.replace(/'/g, "\\'")}'); pecsAudio.playWoodTap();" title="${isEn ? 'Listen' : 'მოსმენა'}">
                        ${iconHtml}
                        <span class="lib-tile-sound-badge">🔊</span>
                    </div>
                    <div class="lib-tile-text">${displayTitle}</div>
                    <div class="lib-tile-cat">${catLabel}</div>
                    <div class="lib-tile-action-wrap">
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');
    }

    addCardFromLibrary(cardId) {
        const card = (this.aacLibrary || []).find(c => c.id === cardId);
        if (!card) return;

        const cleanId = (id) => (id || '').replace(/^(c_|lib_|board_|board_lib_)/, '');
        const baseId = cleanId(cardId);
        const norm = (s) => (s || '').toString().trim().toLowerCase();

        // Unhide if previously marked as hidden/deleted
        const hiddenCardsKey = `pecs_hidden_cards_${this.activeProfileId}`;
        let hiddenIds = JSON.parse(localStorage.getItem(hiddenCardsKey) || '[]');
        hiddenIds = hiddenIds.filter(val => {
            const n = norm(val);
            return n !== norm(cardId) && n !== norm(baseId) && n !== norm(card.text) && n !== norm(card.text_en);
        });
        localStorage.setItem(hiddenCardsKey, JSON.stringify(hiddenIds));

        if (this.isCardOnBoard(card)) {
            if (this.activePhase <= 2) {
                const existingCard = this.cards.find(c => c.id === card.id || c.id === 'board_' + card.id || (c.text && card.text && norm(c.text) === norm(card.text)));
                this.phaseTargetCardId = existingCard ? existingCard.id : card.id;
                const profile = this.getActiveProfile();
                if (profile) {
                    profile.phaseTargetCardId = this.phaseTargetCardId;
                    this.saveProfiles();
                }
                this.renderCardsGrid();
                pecsAudio.playSuccess();
                this.closeCardLibraryModal();
                this.showToast(this.isEn() ? `✨ Target card updated: "${(card.text_en || card.text)}"` : `✨ სამიზნე ბარათი შეიცვალა: „${card.text}“`);
                return;
            }
            this.showToast(this.isEn() ? `Card "${(card.text_en || card.text)}" is already on the board!` : `ბარათი „${card.text}“ უკვე არის დაფაზე!`);
            return;
        }

        const cardCopy = JSON.parse(JSON.stringify(card));
        cardCopy.id = 'board_' + card.id;

        this.customCards.push(cardCopy);
        this.cards.push(cardCopy);
        this.saveCustomCards();

        if (this.activePhase <= 2) {
            this.phaseTargetCardId = cardCopy.id;
            const profile = this.getActiveProfile();
            if (profile) {
                profile.phaseTargetCardId = cardCopy.id;
                this.saveProfiles();
            }
            this.closeCardLibraryModal();
        }

        this.renderCardsGrid();
        this.renderLibraryCards();

        pecsAudio.playSuccess();
        const cardLabel = (this.isEn() && card.text_en) ? card.text_en : card.text;
        this.showToast(this.isEn() ? `✨ "${cardLabel}" added to board!` : `✨ „${card.text}“ წარმატებით დაემატა დაფაზე!`);
    }

    removeCardFromBoard(cardId) {
        const cleanId = (id) => (id || '').replace(/^(c_|lib_|board_|board_lib_)/, '');
        const baseId = cleanId(cardId);
        const norm = (s) => (s || '').toString().trim().toLowerCase();

        const targetCard = (this.cards || []).find(c => 
            c.id === cardId || 
            cleanId(c.id) === baseId ||
            (c.text && norm(c.text) === norm(cardId)) ||
            (c.text_en && norm(c.text_en) === norm(cardId))
        );

        const cardTitle = targetCard ? targetCard.text : cardId;
        const cardTitleEn = targetCard ? targetCard.text_en : '';
        const cardLabel = targetCard ? ((this.isEn() && targetCard.text_en) ? targetCard.text_en : targetCard.text) : (this.isEn() ? 'Card' : 'ბარათი');

        // Save to hidden list in localStorage so it stays deleted even across browser reloads
        const hiddenCardsKey = `pecs_hidden_cards_${this.activeProfileId}`;
        const hiddenIds = JSON.parse(localStorage.getItem(hiddenCardsKey) || '[]');
        [cardId, baseId, targetCard?.id, cardTitle, cardTitleEn].forEach(val => {
            if (val && !hiddenIds.includes(norm(val))) hiddenIds.push(norm(val));
            if (val && !hiddenIds.includes(val)) hiddenIds.push(val);
        });
        localStorage.setItem(hiddenCardsKey, JSON.stringify(hiddenIds));

        // Remove from customCards and memory
        this.customCards = (this.customCards || []).filter(c => {
            if (!c) return false;
            const cBase = cleanId(c.id);
            if (c.id === cardId || cBase === baseId) return false;
            if (cardTitle && norm(c.text) === norm(cardTitle)) return false;
            if (cardTitleEn && norm(c.text_en) === norm(cardTitleEn)) return false;
            return true;
        });

        this.cards = (this.cards || []).filter(c => {
            if (!c) return false;
            const cBase = cleanId(c.id);
            if (c.id === cardId || cBase === baseId) return false;
            if (cardTitle && norm(c.text) === norm(cardTitle)) return false;
            if (cardTitleEn && norm(c.text_en) === norm(cardTitleEn)) return false;
            return true;
        });

        this.saveCustomCards();
        this.renderCardsGrid();
        this.renderLibraryCards();

        pecsAudio.playClear();
        this.showToast(this.isEn() ? `🗑️ "${cardLabel}" removed from board` : `🗑️ „${cardLabel}“ წაიშალა დაფიდან`);
    }

    getExtendedGeoMap() {
        return {
            "წყალი": "water", "წყალ": "water", "წყარო": "spring water",
            "ვაშლი": "apple", "ვაშლ": "apple",
            "ბურთი": "ball", "ბურთ": "ball",
            "მანქანა": "car", "მანქან": "car", "ავტომობილი": "car",
            "პური": "bread", "პურ": "bread",
            "რძე": "milk",
            "წვენი": "juice", "წვენ": "juice",
            "სათამაშო": "toy", "სათამაშ": "toy",
            "დათვი": "bear", "დათუნია": "teddy bear",
            "ლეგო": "lego", "კუბიკი": "blocks", "კუბიკები": "blocks",
            "ბუშტები": "bubbles", "ბუშტი": "bubble",
            "ტუალეტი": "toilet", "უნიტაზი": "toilet", "ქოთანი": "potty",
            "ძაღლი": "dog", "ლეკვი": "puppy",
            "კატა": "cat", "ფისო": "cat", "კნუტი": "kitten",
            "ჩიტი": "bird", "ფრინველი": "bird",
            "დედა": "mother", "დე": "mother", "დედიკო": "mother",
            "მამა": "father", "მა": "father", "მამიკო": "father",
            "ბებია": "grandmother", "ბებო": "grandmother",
            "ბაბუა": "grandfather", "ბაბუ": "grandfather",
            "დაიკო": "sister", "და": "sister",
            "ძამიკო": "brother", "ძმა": "brother",
            "ექიმი": "doctor", "მასწავლებელი": "teacher", "ძიძა": "babysitter",
            "წიგნი": "book", "მუსიკა": "music", "სიმღერა": "song",
            "ჭამა": "eat", "საჭმელი": "food", "სადილი": "lunch", "საუზმე": "breakfast", "ვახშამი": "dinner",
            "დალევა": "drink",
            "თამაში": "play", "ძილი": "sleep", "გასეირნება": "walk",
            "ხელები": "hands", "დაბანა": "wash",
            "კბილები": "teeth", "გახეხვა": "brush teeth",
            "შხაპი": "shower", "აბაზანა": "bath",
            "ტკივილი": "pain", "მტკივა": "hurt",
            "მუცელი": "stomach", "თავი": "head", "ყელი": "throat", "ფეხი": "leg", "ხელი": "hand",
            "ბედნიერი": "happy", "მიხარია": "happy",
            "მწყინს": "sad", "მოწყენილი": "sad", "გავბრაზდი": "angry", "გაბრაზებული": "angry", "დაღლილი": "tired", "დავიღალე": "tired",
            "მეშინია": "scared", "შიში": "fear",
            "პიცა": "pizza", "მაკარონი": "pasta", "ბურგერი": "hamburger", "ჰამბურგერი": "hamburger",
            "სოსისი": "sausage", "ხორცი": "meat", "თევზი": "fish", "კვერცხი": "egg", "ბლინი": "pancake",
            "კარტოფილი": "potato", "ფრი": "french fries", "კიტრი": "cucumber", "პომიდორი": "tomato",
            "სტაფილო": "carrot", "სიმინდი": "corn", "ხახვი": "onion", "ნიორი": "garlic",
            "შოკოლადი": "chocolate", "ნაყინი": "ice cream", "ტორტი": "cake", "კანფეტი": "candy", "ორცხობილა": "cookie",
            "ჩიფსი": "crisps", "ჩიფსები": "chips", "კრეკერი": "cracker", "კრეკერები": "crackers", "ჟელიბონი": "gummies", "ჟელიბონები": "jelly beans", "მარმელადი": "jelly",
            "პოპკორნი": "popcorn", "ხაჭაპური": "cheese pie", "ყველი": "cheese", "კარაქი": "butter",
            "მსხალი": "pear", "მარწყვი": "strawberry", "საზამთრო": "watermelon", "ფორთოხალი": "orange",
            "ატამი": "peach", "ყურძენი": "grapes", "ალუბალი": "cherry", "ლიმონი": "lemon", "ბანანი": "banana",
            "ჩაი": "tea", "კაკაო": "cocoa", "კომპოტი": "fruit drink", "ლიმონათი": "lemonade",
            "საქანელა": "swing", "სასრიალო": "slide", "ველოსიპედი": "bicycle", "სკუტერი": "scooter",
            "თვითმფრინავი": "airplane", "მატარებელი": "train", "გემი": "ship", "ავტობუსი": "bus",
            "ტრაქტორი": "tractor", "ვერტმფრენი": "helicopter", "დინოზავრი": "dinosaur",
            "ბატუტი": "trampoline", "პლასტილინი": "play dough", "ფაზლი": "puzzle", "თოჯინა": "doll",
            "ტელეფონი": "telephone", "პლანშეტი": "tablet", "ტელევიზორი": "television", "საათი": "clock",
            "მაგიდა": "table", "სკამი": "chair", "საწოლი": "bed", "დივანი": "sofa", "კარი": "door", "ფანჯარა": "window",
            "სახლი": "house", "სკოლა": "school", "ბაღი": "kindergarten", "პარკი": "park", "ეზო": "yard",
            "კოვზი": "spoon", "ჩანგალი": "fork", "დანა": "knife", "თეფში": "plate", "ჭიქა": "cup",
            "მაისური": "t-shirt", "პერანგი": "shirt", "შარვალი": "pants", "ქურთუკი": "jacket",
            "ფეხსაცმელი": "shoes", "წინდები": "socks", "ქუდი": "hat", "შორტი": "shorts", "კაბა": "dress",
            "ძროხა": "cow", "ცხენი": "horse", "ცხვარი": "sheep", "ღორი": "pig", "კურდღელი": "rabbit", "ბაჭია": "rabbit",
            "ლომი": "lion", "სპილო": "elephant", "მაიმუნი": "monkey", "იხვი": "duck", "მამალი": "rooster", "ქათამი": "chicken",
            "პეპელა": "butterfly", "ფუტკარი": "bee", "გომბეშო": "frog", "ბაყაყი": "frog", "მგელი": "wolf",
            "ფანქარი": "pencil", "კალამი": "pen", "მაკრატელი": "scissors", "წებო": "glue", "რვეული": "notebook", "ჩანთა": "backpack",
            "ხატვა": "draw", "კითხვა": "read", "ცურვა": "swim", "სირბილი": "run", "ხტუნვა": "jump", "ცეკვა": "dance",
            "ჩახუტება": "hug", "კოცნა": "kiss", "გაჩერდი": "stop", "დახმარება": "help", "მადლობა": "thank you", "გთხოვ": "please"
        };
    }

    async searchLibraryArasaac(term) {
        const box = document.getElementById('lib-arasaac-results');
        if (!box) return;

        const cleanTerm = (term || '').trim().toLowerCase();
        if (!cleanTerm) {
            this.showDefaultLibraryArasaac();
            return;
        }

        const geoMap = this.getExtendedGeoMap();
        const queryTerm = geoMap[cleanTerm] || cleanTerm;

        const isEn = this.isEn();
        box.innerHTML = `<div class="arasaac-loading-box">${isEn ? `🔎 Searching ARASAAC for: "<strong>${cleanTerm}</strong>"...` : `🔎 იძებნება ARASAAC-ში: „<strong>${cleanTerm}</strong>“ (${queryTerm})...`}</div>`;

        try {
            const res = await fetch(`https://api.arasaac.org/api/pictograms/en/bestsearch/${encodeURIComponent(queryTerm)}`);
            const items = await res.json();

            if (!items || items.length === 0) {
                box.innerHTML = `
                    <div class="arasaac-empty-box">
                        <div style="font-size:32px;">🌐</div>
                        <div style="font-weight:800; font-size:15px; margin-top:6px;">${isEn ? `No pictograms found in ARASAAC for "${cleanTerm}"` : `ARASAAC-ში „${cleanTerm}“ ვერ მოიძებნა`}</div>
                        <p style="font-size:12px; color:#64748B; margin:6px 0 12px 0;">${isEn ? 'Try another keyword (e.g. water, apple, car) or create a custom card:' : `სცადეთ ინგლისური სიტყვა (მაგ. ${queryTerm}) ან შექმენით საკუთარი ბარათი:`}</p>
                        <button type="button" class="btn-primary-action" style="width:auto; padding:8px 18px; font-size:13px;" onclick="app.switchLibraryTab('create')">
                            ${isEn ? '✨ Create Custom Card' : '✨ საკუთარი ბარათის შექმნა'}
                        </button>
                    </div>
                `;
                return;
            }

            box.innerHTML = items.slice(0, 24).map(item => {
                const imgUrl = `https://static.arasaac.org/pictograms/${item._id}/${item._id}_300.png`;
                const engKeyword = item.keywords?.[0]?.keyword || (isEn ? 'symbol' : 'სიმბოლო');
                let geoLabel = engKeyword;
                if (isEn) {
                    geoLabel = engKeyword;
                } else {
                    // ქართულ რეჟიმში ვეძებთ ქართულ თარგმანს
                    geoLabel = this.translateToGeorgian(cleanTerm) || this.translateToGeorgian(engKeyword) || engKeyword;
                }

                return `
                    <div class="arasaac-result-card">
                        <img src="${imgUrl}" alt="${engKeyword}">
                        <div class="arc-keyword">${geoLabel}</div>
                        <div class="arc-eng-sub">${engKeyword}</div>
                        <button type="button" class="btn-add-arasaac" 
                                onclick="app.addArasaacCardToBoard('${item._id}', '${geoLabel.replace(/'/g, "\\'")}', '${imgUrl}', this, '${engKeyword.replace(/'/g, "\\'")}')">
                            ${isEn ? '➕ Add to Board' : '➕ დაფაზე დამატება'}
                        </button>
                    </div>
                `;
            }).join('');
        } catch(e) {
            box.innerHTML = `
                <div class="arasaac-empty-box">
                    <p style="color:#DC2626; font-weight:800;">${isEn ? 'Network issue. ARASAAC server is temporarily unreachable.' : 'ონლაინ კავშირის შეფერხება. ARASAAC სერვერი დროებით მიუწვდომელია.'}</p>
                    <p style="font-size:12px; color:#64748B;">${isEn ? 'You can choose from the offline preset library (160+ cards) or create your own.' : 'შეგიძლიათ აირჩიოთ მზა ბაზიდან (160+ ოფლაინ ბარათი) ან შექმნათ საკუთარი ფოტოთი.'}</p>
                </div>
            `;
        }
    }

    showDefaultLibraryArasaac() {
        const box = document.getElementById('lib-arasaac-results');
        if (!box) return;
        const isEn = this.isEn();

        const popular = [
            { id: 2248, name_ka: "წყალი", name_en: "water" },
            { id: 2462, name_ka: "ვაშლი", name_en: "apple" },
            { id: 2269, name_ka: "ბურთი", name_en: "ball" },
            { id: 2339, name_ka: "მანქანა", name_en: "car" },
            { id: 2430, name_ka: "ტუალეტი", name_en: "toilet" },
            { id: 4570, name_ka: "დახმარება", name_en: "help" },
            { id: 2369, name_ka: "ძილი", name_en: "sleep" },
            { id: 2349, name_ka: "ჭამა", name_en: "eat" },
            { id: 2276, name_ka: "სასმელი", name_en: "drink" },
            { id: 3245, name_ka: "მიხარია", name_en: "happy" },
            { id: 2606, name_ka: "მოწყენილი", name_en: "sad" },
            { id: 2450, name_ka: "წიგნი", name_en: "book" },
            { id: 2277, name_ka: "ველოსიპედი", name_en: "bicycle" },
            { id: 4945, name_ka: "დათუნია", name_en: "teddy bear" },
            { id: 2517, name_ka: "ძაღლი", name_en: "dog" },
            { id: 2406, name_ka: "კატა", name_en: "cat" }
        ];

        box.innerHTML = popular.map(item => {
            const imgUrl = `https://static.arasaac.org/pictograms/${item.id}/${item.id}_300.png`;
            const label = isEn ? item.name_en : item.name_ka;
            return `
                <div class="arasaac-result-card">
                    <img src="${imgUrl}" alt="${item.name_en}">
                    <div class="arc-keyword">${label}</div>
                    <div class="arc-eng-sub">${item.name_en}</div>
                    <button type="button" class="btn-add-arasaac" 
                            onclick="app.addArasaacCardToBoard('${item.id}', '${label.replace(/'/g, "\\'")}', '${imgUrl}', this)">
                        ${isEn ? '➕ Add to Board' : '➕ დაფაზე დამატება'}
                    </button>
                </div>
            `;
        }).join('');
    }

    addArasaacCardToBoard(arasaacId, geoTitle, imgUrl, btnEl = null, engTitle = '') {
        const isEn = this.isEn();
        let title = (geoTitle || (isEn ? 'Card' : 'ბარათი')).trim();
        let englishTitle = (engTitle || '').trim();

        if (!englishTitle) {
            englishTitle = this.translateAbaText(title) || title;
        }

        // თუ ქართულ რეჟიმშია მაგრამ title ინგლისურია, გადავთარგმნოთ ქართულად
        if (!isEn && /^[a-zA-Z\s]+$/.test(title)) {
            const ka = this.translateToGeorgian(title);
            if (ka && ka !== title) {
                if (!englishTitle) englishTitle = title;
                title = ka;
            }
        }

        if (btnEl) {
            btnEl.style.background = '#10B981';
            btnEl.style.borderColor = '#059669';
            btnEl.style.color = '#fff';
            btnEl.innerText = isEn ? '✓ Added!' : '✓ დაემატა!';
        }

        const newCard = {
            id: 'arasaac_' + arasaacId + '_' + Date.now(),
            text: title,
            text_en: englishTitle || title,
            spoken: title,
            spoken_en: englishTitle || title,
            type: 'noun',
            category: 'all',
            arasaacUrl: imgUrl
        };

        this.customCards.push(newCard);
        this.cards.push(newCard);
        this.saveCustomCards();

        if (this.activePhase <= 2) {
            this.phaseTargetCardId = newCard.id;
            const profile = this.getActiveProfile();
            if (profile) {
                profile.phaseTargetCardId = newCard.id;
                this.saveProfiles();
            }
        }

        this.renderCardsGrid();
        this.renderLibraryCards();

        pecsAudio.playSuccess();
        this.showToast(isEn ? `✨ ARASAAC Card "${title}" added to board!` : `✨ ARASAAC ბარათი „${title}“ დაემატა დაფაზე!`);

        // ავტომატურად დავხუროთ მოდალი და დაფაზე გამოვკვეთოთ ახალი ბარათი
        setTimeout(() => {
            this.closeCardLibraryModal();
            const cardEl = document.getElementById(`pecs-card-${newCard.id}`);
            if (cardEl) {
                cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                cardEl.style.transition = 'all 0.3s ease';
                cardEl.style.boxShadow = '0 0 0 5px #10B981, 0 12px 24px rgba(16, 185, 129, 0.4)';
                cardEl.style.transform = 'scale(1.08)';
                setTimeout(() => {
                    cardEl.style.boxShadow = '';
                    cardEl.style.transform = '';
                }, 2500);
            }
        }, 400);
    }

    setCustomCardEmoji(emoji) {
        const el = document.getElementById('cc-input-emoji');
        if (el) el.value = emoji;
        pecsAudio.playTap();
    }

    /**
     * 📸 ფოტოს ავტომატური კვადრატული შეკუმშვა (Canvas Resize & Center Crop)
     * 10-15MB კამერის ფოტოებს ამცირებს 30-45KB-მდე, რათა localStorage არასდროს გადაივსოს
     */
    compressAndCropImage(file, maxSize = 360, quality = 0.85) {
        return new Promise((resolve, reject) => {
            if (!file) return resolve(null);
            if (!file.type.startsWith('image/')) {
                return reject(new Error('არჩეული ფაილი არ არის ფოტოსურათი'));
            }

            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                const canvas = document.createElement('canvas');
                canvas.width = maxSize;
                canvas.height = maxSize;
                const ctx = canvas.getContext('2d');

                // ცენტრალური კვადრატული ამოჭრა (Square Center Crop)
                const minSide = Math.min(img.width, img.height);
                const sx = (img.width - minSide) / 2;
                const sy = (img.height - minSide) / 2;

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxSize, maxSize);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };

            img.onerror = (err) => {
                URL.revokeObjectURL(objectUrl);
                reject(err);
            };

            img.src = objectUrl;
        });
    }

    async handleCustomCardFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const statusText = document.getElementById('cc-upload-status-text');
        const sizeText = document.getElementById('cc-upload-size-text');
        const previewWrap = document.getElementById('cc-file-preview-wrap');
        const previewImg = document.getElementById('cc-file-preview-img');

        const isEn = this.isEn();
        if (statusText) statusText.textContent = isEn ? '⏳ Processing...' : '⏳ მუშავდება...';

        try {
            const compressedData = await this.compressAndCropImage(file, 360, 0.85);
            this.customCardImageData = compressedData;

            const approxKb = Math.round((compressedData.length * 3 / 4) / 1024);

            if (previewImg) previewImg.src = compressedData;
            if (previewWrap) previewWrap.style.display = 'flex';
            if (statusText) statusText.textContent = isEn ? `Photo: ${file.name ? file.name.slice(0, 16) : 'camera'}...` : `ფოტო: ${file.name ? file.name.slice(0, 16) : 'კამერა'}...`;
            if (sizeText) sizeText.textContent = isEn ? `⚡ Optimized (${approxKb} KB)` : `⚡ ოპტიმიზებულია (${approxKb} KB)`;
            pecsAudio.playTap();
        } catch (err) {
            console.error('Photo compression error:', err);
            this.showAlert(isEn ? 'Could not process photo' : 'ფოტოს დამუშავება ვერ მოხერხდა', isEn ? 'Error' : 'შეცდომა', '⚠️');
        }
    }

    clearCustomCardFile() {
        this.customCardImageData = null;
        const fileInput = document.getElementById('cc-input-file');
        const camInput = document.getElementById('cc-input-camera');
        if (fileInput) fileInput.value = '';
        if (camInput) camInput.value = '';
        const previewWrap = document.getElementById('cc-file-preview-wrap');
        if (previewWrap) previewWrap.style.display = 'none';
    }

    async handleStudioCardFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const previewWrap = document.getElementById('new-card-photo-preview');
        const previewImg = document.getElementById('new-card-preview-img');
        const nameText = document.getElementById('new-card-photo-name');
        const isEn = this.isEn();

        try {
            const compressedData = await this.compressAndCropImage(file, 360, 0.85);
            this.studioCardImageData = compressedData;

            const approxKb = Math.round((compressedData.length * 3 / 4) / 1024);

            if (previewImg) previewImg.src = compressedData;
            if (previewWrap) previewWrap.style.display = 'flex';
            if (nameText) nameText.textContent = isEn ? `⚡ Optimized (${approxKb} KB)` : `⚡ ოპტიმიზებულია (${approxKb} KB)`;
            pecsAudio.playTap();
        } catch (err) {
            console.error('Studio photo compression error:', err);
            this.showAlert(isEn ? 'Could not process photo' : 'ფოტოს დამუშავება ვერ მოხერხდა', isEn ? 'Error' : 'შეცდომა', '⚠️');
        }
    }

    clearStudioCardPhoto() {
        this.studioCardImageData = null;
        const fileInput = document.getElementById('new-card-file');
        const camInput = document.getElementById('new-card-camera');
        if (fileInput) fileInput.value = '';
        if (camInput) camInput.value = '';
        const previewWrap = document.getElementById('new-card-photo-preview');
        if (previewWrap) previewWrap.style.display = 'none';
    }

    triggerCardCameraCapture() {
        // Always open the live camera viewfinder (never silently open file explorer)
        this.openLiveCameraScanner('card');
    }

    triggerLibraryCardCameraCapture() {
        // Always open the live camera viewfinder from Card Library -> Create Custom Card
        this.openLiveCameraScanner('library-card');
    }

    createAndAddCustomCard() {
        const textInput = document.getElementById('cc-input-text');
        const spokenInput = document.getElementById('cc-input-spoken');
        const catSelect = document.getElementById('cc-input-category');
        const typeSelect = document.getElementById('cc-input-type');
        const emojiInput = document.getElementById('cc-input-emoji');
        const isEn = this.isEn();

        const text = textInput ? textInput.value.trim() : '';
        if (!text) {
            this.showAlert(isEn ? 'Please enter a card name' : 'გთხოვთ ჩაწეროთ ბარათის სახელი', isEn ? 'Notice' : 'ყურადღება', '✏️');
            return;
        }

        if (this.isCardOnBoard(text)) {
            pecsAudio.playTap();
            this.showAlert(
                isEn ? `Card "${text}" already exists on the board!` : `ბარათი "${text}" უკვე არსებობს დაფაზე!`,
                isEn ? 'Duplicate Card' : 'დუბლიკატია',
                '🛡️'
            );
            return;
        }

        const spoken = (spokenInput && spokenInput.value.trim()) ? spokenInput.value.trim() : text;
        const category = catSelect ? catSelect.value : 'food';
        const type = typeSelect ? typeSelect.value : 'noun';
        const emoji = (emojiInput && emojiInput.value.trim()) ? emojiInput.value.trim() : '⭐';

        const newCard = {
            id: 'custom_' + Date.now(),
            text: text,
            text_en: isEn ? text : undefined,
            spoken: spoken,
            spoken_en: isEn ? spoken : undefined,
            icon: emoji,
            type: type,
            category: category,
            image: this.customCardImageData || null
        };

        this.customCards.push(newCard);
        this.cards.push(newCard);
        this.saveCustomCards();

        if (this.activePhase <= 2) {
            this.phaseTargetCardId = newCard.id;
            const profile = this.getActiveProfile();
            if (profile) {
                profile.phaseTargetCardId = newCard.id;
                this.saveProfiles();
            }
        }

        this.renderCardsGrid();
        this.closeCardLibraryModal();

        // Clear inputs
        if (textInput) textInput.value = '';
        if (spokenInput) spokenInput.value = '';
        this.clearCustomCardFile();

        pecsAudio.playSuccess();
        this.showToast(isEn ? `✨ New card "${text}" created and added to board!` : `✨ ახალი ბარათი „${text}“ შეიქმნა და დაემატა დაფაზე!`);
    }

    // ========================================================
    // 📸 36. AI Environment & Room Scanner (Vision Auto-Board)
    // ========================================================
    renderRoomScannerTab() {
        const container = document.getElementById('studio-tab-room-scanner');
        if (!container) return;

        const isEn = this.isEn();
        container.innerHTML = `
            <div class="room-scanner-wrap">
                <div class="room-scanner-hero">
                    <h3>📸 ${isEn ? 'AI Environment & Room Scanner' : 'გარემოს & ოთახის AI სკანერი'}</h3>
                    <p>${isEn ? 'Point camera or select a room scenario. Multimodal Vision AI detects objects and generates standard Fitzgerald Key color-coded AAC cards.' : 'გადაუღეთ ფოტო ოთახს ან მაგიდას. Vision AI ამოიცნობს ნივთებს და დაამზადებს AAC ბარათებს ფიტცჯერალდის კლინიკური სტანდარტით.'}</p>
                </div>

                <div class="room-scanner-controls-card">
                    <div class="room-scanner-input-row">
                        <button type="button" class="btn-scanner-camera" onclick="app.openLiveCameraScanner()">
                            <span>📷 ${isEn ? 'Snap with Live Camera' : 'კამერით გადაღება'}</span>
                        </button>
                        <label class="btn-scanner-upload">
                            <span>📁 ${isEn ? 'Upload Room Photo' : 'ფოტოს ატვირთვა'}</span>
                            <input type="file" id="room-scanner-file-fallback" accept="image/*" style="display:none;" onchange="app.handleRoomPhotoUpload(event)">
                        </label>
                    </div>

                    <div>
                        <div class="room-presets-label">${isEn ? '⚡ Instant Room Scenarios (Quick Demo):' : '⚡ მზა სცენარები (სწრაფი დემო):'}</div>
                        <div class="room-presets-grid">
                            <button type="button" class="preset-pill-btn active" id="pill-preset-playroom" onclick="app.triggerRoomScan('playroom')">
                                🧸 ${isEn ? 'Playroom & Toys' : 'სათამაშო ოთახი'}
                            </button>
                            <button type="button" class="preset-pill-btn" id="pill-preset-kitchen_snack" onclick="app.triggerRoomScan('kitchen_snack')">
                                🍎 ${isEn ? 'Snack Table & Food' : 'სამზარეულო / წახემსება'}
                            </button>
                            <button type="button" class="preset-pill-btn" id="pill-preset-classroom" onclick="app.triggerRoomScan('classroom')">
                                ✏️ ${isEn ? 'Classroom & Desk' : 'სამუშაო მაგიდა / სკოლა'}
                            </button>
                            <button type="button" class="preset-pill-btn" id="pill-preset-bedroom" onclick="app.triggerRoomScan('bedroom')">
                                🛏️ ${isEn ? 'Sensory Bedroom' : 'საძინებელი / სიმშვიდე'}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 📋 Live Cards Rack Directly Under Camera Controls -->
                <div id="room-scanner-cards-rack"></div>

                <div id="room-scan-stage-container"></div>
                <div id="room-scan-results-container"></div>
            </div>
        `;

        this.warmUpVisionModels();
        this.triggerRoomScan('playroom');
        this.renderRoomScannerCustomCardsRack();
    }

    renderRoomScannerCustomCardsRack() {
        const rack = document.getElementById('room-scanner-cards-rack');
        if (!rack) return;
        const isEn = this.isEn();
        const count = this.customCards.length;

        if (count === 0) {
            rack.innerHTML = `
                <div style="background:#F8FAFC; border:1.5px dashed #CBD5E1; border-radius:14px; padding:10px 14px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:12px; color:#64748B; font-weight:700;">
                        📋 ${isEn ? 'No cards added to board yet. Use camera or scenarios below.' : 'დაფაზე ჯერ არ არის დამატებული ბარათები. გადაიღეთ კამერით ან აირჩიეთ სცენარი.'}
                    </span>
                </div>
            `;
            return;
        }

        const pills = this.customCards.slice(-10).map(c => `
            <span style="display:inline-flex; align-items:center; gap:4px; background:#FFFFFF; border:1.5px solid #10B981; padding:4px 10px; border-radius:16px; font-size:12px; font-weight:800; color:#065F46; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
                <span style="font-size:14px;">${c.icon || '📌'}</span>
                <span>${isEn ? (c.text_en || c.text) : c.text}</span>
            </span>
        `).join('');

        rack.innerHTML = `
            <div style="background:#F0FDF4; border:1.5px solid #10B981; border-radius:14px; padding:12px 14px; margin-bottom:14px;">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                    <span style="font-size:13px; color:#065F46; font-weight:900; display:flex; align-items:center; gap:6px;">
                        <span>✅</span> <span>${isEn ? `Active Cards on Board (${count}):` : `დაფაზე დამატებული ბარათები (${count}):`}</span>
                    </span>
                    <button type="button" style="background:#059669; color:white; border:none; padding:4px 12px; border-radius:10px; font-size:11px; font-weight:800; cursor:pointer;" onclick="app.closeModal('modal-studio')">
                        👁️ ${isEn ? 'View on Board' : 'დაფაზე ნახვა'}
                    </button>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    ${pills}
                </div>
            </div>
        `;
    }


    async handleRoomPhotoUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        pecsAudio.playTap();
        const isEn = this.isEn();

        try {
            const compressed = await this.compressAndCropImage(file, 800, 0.85);
            this.triggerRoomScan('custom', compressed);
        } catch (e) {
            console.error('Error processing room image:', e);
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.triggerRoomScan('custom', ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    }



    // ========================================================
    // 🧠 REAL-TIME ON-DEVICE VISION AI (MobileNet + COCO-SSD)
    // ========================================================
    warmUpVisionModels() {
        if (this._warmingUpVision) return;
        this._warmingUpVision = true;
        setTimeout(async () => {
            try {
                if (window.mobilenet && !this.mobilenetModel) {
                    this.mobilenetModel = await mobilenet.load();
                }
                if (window.cocoSsd && !this.cocoModel) {
                    this.cocoModel = await cocoSsd.load();
                }
            } catch (e) {
                console.warn('Vision warmup note:', e);
            }
        }, 150);
    }

    async detectObjectsWithVisionAI(imgElement) {
        const rawItems = [];

        // Wait for image dimensions if not yet decoded
        if (imgElement && imgElement.tagName === 'IMG' && !imgElement.complete) {
            await new Promise(res => {
                imgElement.onload = res;
                imgElement.onerror = res;
                setTimeout(res, 600);
            });
        }

        const natW = imgElement.naturalWidth || imgElement.videoWidth || imgElement.width || 640;
        const natH = imgElement.naturalHeight || imgElement.videoHeight || imgElement.height || 480;

        // 1A. Full-frame 224x224 canvas
        let fullCanvas = imgElement;
        // 1B. Center-reticle crop (65% central region where user holds the object!)
        let centerCanvas = imgElement;
        try {
            const fc = document.createElement('canvas');
            fc.width = 224;
            fc.height = 224;
            fc.getContext('2d').drawImage(imgElement, 0, 0, 224, 224);
            fullCanvas = fc;

            const cc = document.createElement('canvas');
            cc.width = 224;
            cc.height = 224;
            const cropSize = Math.round(Math.min(natW, natH) * 0.68);
            const sx = Math.max(0, Math.round((natW - cropSize) / 2));
            const sy = Math.max(0, Math.round((natH - cropSize) / 2));
            cc.getContext('2d').drawImage(imgElement, sx, sy, cropSize, cropSize, 0, 0, 224, 224);
            centerCanvas = cc;
        } catch (e) {}

        // 1. MobileNet on both Center Reticle Crop & Full Frame
        if (window.mobilenet) {
            try {
                if (!this.mobilenetModel) {
                    this.mobilenetModel = await mobilenet.load();
                }
                const [centerPreds, fullPreds] = await Promise.all([
                    this.mobilenetModel.classify(centerCanvas, 6),
                    this.mobilenetModel.classify(fullCanvas, 6)
                ]);
                if (centerPreds && centerPreds.length > 0) {
                    centerPreds.forEach(c => {
                        if ((c.probability || 0) >= 0.10) {
                            rawItems.push({
                                class: c.className,
                                score: Math.min(0.99, (c.probability || 0) + 0.08) // Boost center reticle object
                            });
                        }
                    });
                }
                if (fullPreds && fullPreds.length > 0) {
                    fullPreds.forEach(c => {
                        if ((c.probability || 0) >= 0.12) {
                            rawItems.push({
                                class: c.className,
                                score: c.probability
                            });
                        }
                    });
                }
            } catch (err) {
                console.warn('MobileNet classification error:', err);
            }
        }

        // 2. COCO-SSD: 80 common object classes with bounding box detection
        if (window.cocoSsd) {
            try {
                if (!this.cocoModel) {
                    this.cocoModel = await cocoSsd.load();
                }
                const predictions = await this.cocoModel.detect(imgElement);
                if (predictions && predictions.length > 0) {
                    predictions.forEach(p => {
                        if ((p.score || 0) >= 0.30) {
                            rawItems.push({
                                class: p.class,
                                score: p.score
                            });
                        }
                    });
                }
            } catch (err) {
                console.warn('COCO-SSD error:', err);
            }
        }

        if (rawItems.length === 0) {
            return [];
        }

        // Sort descending by score so highest-confidence objects are matched first
        rawItems.sort((a, b) => (b.score || 0) - (a.score || 0));

        return this.mapPredictionsToAAC(rawItems);
    }

    mapPredictionsToAAC(rawItems) {
        const rules = [
            // Pens / Pencils / Markers / Stylus (High priority so handheld pens aren't confused with phones)
            { keywords: ['ballpoint', 'fountain pen', 'quill', 'pencil', 'crayon', 'marker', 'highlighter', 'paintbrush', 'pen', 'ruler', 'rubber eraser', 'pencil sharpener'], card: { text: 'კალამი / ფანქარი', text_en: 'Pen / Pencil', icon: '✏️', category: 'school', category_en: 'School', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Phone / Smartphone
            { keywords: ['cell phone', 'cellular', 'mobile phone', 'telephone', 'smartphone', 'phone', 'ipod', 'hand-held computer', 'pay-phone'], card: { text: 'ტელეფონი', text_en: 'Phone', icon: '📱', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Cup / Mug / Tumbler / Glass
            { keywords: ['cup', 'mug', 'coffee mug', 'tumbler', 'thermos', 'teacup', 'espresso', 'goblet', 'chalice', 'beaker', 'measuring cup', 'wine glass', 'beer glass'], card: { text: 'ჭიქა / თერმოსი', text_en: 'Cup / Tumbler', icon: '🥤', category: 'drinks', category_en: 'Drinks', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            // Bottle / Water
            { keywords: ['water bottle', 'pop bottle', 'bottle', 'flask', 'water jug', 'pitcher', 'carafe', 'pill bottle', 'lotion'], card: { text: 'წყლის ბოთლი', text_en: 'Water bottle', icon: '🍾', category: 'drinks', category_en: 'Drinks', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            // Headphones / Earbuds / Microphone
            { keywords: ['headphone', 'earphone', 'earbud', 'headset', 'earpiece', 'microphone', 'loudspeaker', 'speaker'], card: { text: 'ყურსასმენები', text_en: 'Headphones', icon: '🎧', category: 'sensory', category_en: 'Sensory', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Glasses / Sunglasses
            { keywords: ['sunglass', 'sunglasses', 'spectacles', 'eyeglasses', 'glasses', 'loupe', 'goggles'], card: { text: 'სათვალე', text_en: 'Glasses', icon: '👓', category: 'clothes', category_en: 'Personal', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Books & Notebooks
            { keywords: ['notebook', 'notepad', 'spiral notebook', 'book', 'comic book', 'binder', 'novel', 'pencil box', 'pencil case', 'book jacket', 'menu', 'envelope', 'crossword'], card: { text: 'წიგნი / რვეული', text_en: 'Book / Notebook', icon: '📚', category: 'school', category_en: 'School', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Laptop / Computer
            { keywords: ['laptop', 'laptop computer', 'notebook computer', 'macbook', 'desktop computer'], card: { text: 'ლეპტოპი / კომპიუტერი', text_en: 'Laptop', icon: '💻', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // TV / Monitor / Screen
            { keywords: ['television', 'tv', 'monitor', 'screen', 'display'], card: { text: 'ტელევიზორი / ეკრანი', text_en: 'Monitor / TV', icon: '📺', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Keyboard & Mouse & Remote & Gamepad
            { keywords: ['computer keyboard', 'keyboard', 'typewriter', 'space bar'], card: { text: 'კლავიატურა', text_en: 'Keyboard', icon: '⌨️', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['mouse', 'computer mouse'], card: { text: 'მაუსი', text_en: 'Mouse', icon: '🖱️', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['remote control', 'remote', 'joystick', 'gamepad'], card: { text: 'პულტი', text_en: 'Remote', icon: '📱', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Lamp / Lighting
            { keywords: ['table lamp', 'desk lamp', 'lamp', 'lampshade', 'lantern', 'candle', 'torch', 'Flashlight', 'spotlight'], card: { text: 'სანათი / ლამპა', text_en: 'Desk Lamp', icon: '💡', category: 'room', category_en: 'Room', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Keys / Lock
            { keywords: ['key', 'padlock', 'combination lock'], card: { text: 'გასაღები', text_en: 'Keys', icon: '🔑', category: 'room', category_en: 'Object', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Watch / Clock
            { keywords: ['watch', 'wristwatch', 'digital watch', 'stopwatch', 'clock', 'wall clock', 'alarm clock', 'analog clock'], card: { text: 'საათი', text_en: 'Watch / Clock', icon: '⌚', category: 'room', category_en: 'Personal', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Plug / Charger / Wire
            { keywords: ['plug', 'charger', 'adapter', 'extension cord', 'power cord', 'electric wire', 'switch'], card: { text: 'დამტენი / კაბელი', text_en: 'Charger / Plug', icon: '🔌', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Desk / Table
            { keywords: ['desk', 'dining table', 'coffee table'], card: { text: 'მაგიდა', text_en: 'Desk', icon: '🪵', category: 'furniture', category_en: 'Furniture', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Plate / Bowl / Utensils
            { keywords: ['plate', 'platter', 'dish'], card: { text: 'თეფში', text_en: 'Plate', icon: '🍽️', category: 'utensils', category_en: 'Utensils', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['bowl', 'mixing bowl', 'soup bowl'], card: { text: 'თასი / ჯამი', text_en: 'Bowl', icon: '🥣', category: 'utensils', category_en: 'Utensils', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['fork'], card: { text: 'ჩანგალი', text_en: 'Fork', icon: '🍴', category: 'utensils', category_en: 'Utensils', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['spoon', 'ladle', 'wooden spoon'], card: { text: 'კოვზი', text_en: 'Spoon', icon: '🥄', category: 'utensils', category_en: 'Utensils', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['teapot', 'kettle', 'coffeepot'], card: { text: 'ჩაიდანი', text_en: 'Teapot', icon: '🫖', category: 'kitchen', category_en: 'Kitchen', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['scissors'], card: { text: 'მაკრატელი', text_en: 'Scissors', icon: '✂️', category: 'school', category_en: 'School', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['backpack', 'bookbag', 'school bag'], card: { text: 'ზურგჩანთა', text_en: 'Backpack', icon: '🎒', category: 'school', category_en: 'School', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['handbag', 'purse', 'wallet', 'suitcase', 'plastic bag'], card: { text: 'ჩანთა / საფულე', text_en: 'Bag / Wallet', icon: '👜', category: 'clothes', category_en: 'Personal', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Furniture & Room
            { keywords: ['chair', 'armchair', 'folding chair', 'stool', 'rocking chair', 'barber chair'], card: { text: 'სკამი', text_en: 'Chair', icon: '🪑', category: 'furniture', category_en: 'Furniture', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['couch', 'sofa', 'studio couch'], card: { text: 'დივანი', text_en: 'Couch', icon: '🛋️', category: 'furniture', category_en: 'Furniture', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['bed', 'four-poster'], card: { text: 'საწოლი', text_en: 'Bed', icon: '🛏️', category: 'furniture', category_en: 'Furniture', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['pillow', 'cushion'], card: { text: 'ბალიში', text_en: 'Pillow', icon: '🛏️', category: 'room', category_en: 'Room', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['blanket', 'quilt', 'comforter'], card: { text: 'საბანი', text_en: 'Blanket', icon: '🛌', category: 'room', category_en: 'Room', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['plant', 'flowerpot', 'pot', 'vase'], card: { text: 'ყვავილი', text_en: 'Plant', icon: '🪴', category: 'room', category_en: 'Room', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Toys
            { keywords: ['teddy', 'stuffed animal', 'plush', 'toyshop'], card: { text: 'დათუნია', text_en: 'Teddy bear', icon: '🧸', category: 'toys', category_en: 'Toys', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['sports ball', 'ball', 'balloon', 'basketball', 'soccer ball', 'tennis ball', 'ping-pong ball', 'rugby ball'], card: { text: 'ბურთი', text_en: 'Ball', icon: '⚽', category: 'toys', category_en: 'Toys', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Personal & Clothes & Hygiene
            { keywords: ['sneaker', 'running shoe', 'sandal', 'boot', 'shoe', 'loafer', 'clog'], card: { text: 'ფეხსაცმელი', text_en: 'Shoes', icon: '👟', category: 'clothes', category_en: 'Clothes', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['t-shirt', 'jersey', 'sweater', 'sweatshirt', 'cardigan', 'shirt', 'coat', 'jacket'], card: { text: 'მაისური / ტანსაცმელი', text_en: 'Shirt', icon: '👕', category: 'clothes', category_en: 'Clothes', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['toothbrush'], card: { text: 'კბილის ჯაგრისი', text_en: 'Toothbrush', icon: '🪥', category: 'hygiene', category_en: 'Hygiene', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['soap', 'dispenser'], card: { text: 'საპონი', text_en: 'Soap', icon: '🧼', category: 'hygiene', category_en: 'Hygiene', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['towel', 'paper towel', 'tissue', 'handkerchief'], card: { text: 'პირსახოცი / ხელსახოცი', text_en: 'Towel / Tissue', icon: '🧻', category: 'hygiene', category_en: 'Hygiene', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            // Food
            { keywords: ['apple', 'granny smith', 'pomegranate'], card: { text: 'ვაშლი', text_en: 'Apple', icon: '🍎', category: 'food', category_en: 'Food', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            { keywords: ['banana'], card: { text: 'ბანანი', text_en: 'Banana', icon: '🍌', category: 'food', category_en: 'Food', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            { keywords: ['orange', 'lemon', 'citrus'], card: { text: 'ფორთოხალი', text_en: 'Orange', icon: '🍊', category: 'food', category_en: 'Food', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            { keywords: ['strawberry'], card: { text: 'მარწყვი', text_en: 'Strawberry', icon: '🍓', category: 'food', category_en: 'Food', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            { keywords: ['bread', 'bagel', 'loaf', 'pretzel', 'croissant'], card: { text: 'პური', text_en: 'Bread', icon: '🍞', category: 'food', category_en: 'Food', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            { keywords: ['pizza'], card: { text: 'პიცა', text_en: 'Pizza', icon: '🍕', category: 'food', category_en: 'Food', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            { keywords: ['sandwich', 'burger', 'cheeseburger', 'hotdog'], card: { text: 'სენდვიჩი', text_en: 'Sandwich', icon: '🥪', category: 'food', category_en: 'Food', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            { keywords: ['cake', 'donut', 'cookie', 'muffin', 'pastry', 'chocolate', 'ice cream'], card: { text: 'ტკბილეული', text_en: 'Snack / Cake', icon: '🍪', category: 'food', category_en: 'Food', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' } },
            // Animals
            { keywords: ['cat', 'kitten', 'tabby', 'feline'], card: { text: 'ფისო', text_en: 'Cat', icon: '🐱', category: 'animals', category_en: 'Animals', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' } },
            { keywords: ['dog', 'puppy', 'retriever', 'terrier', 'hound', 'pug'], card: { text: 'ძაღლი', text_en: 'Dog', icon: '🐶', type: 'noun', category: 'animals', category_en: 'Animals', bg_color: '#FEF3C7', border_color: '#F59E0B' } }
        ];

        const matchedCards = [];
        const seenCardTexts = new Set();

        rawItems.forEach(item => {
            const label = (item.class || '').toLowerCase();
            // Skip background 'person' label from COCO-SSD so held objects are prioritized
            if (label === 'person') return;
            const score = Math.min(99, Math.max(78, Math.round((item.score || 0.88) * 100)));

            for (const r of rules) {
                const isMatch = r.keywords.some(kw => label.includes(kw.toLowerCase()));
                if (isMatch) {
                    const cardText = r.card.text_en;
                    if (!seenCardTexts.has(cardText)) {
                        seenCardTexts.add(cardText);
                        const isDup = this.isCardOnBoard(r.card.text, r.card.text_en);
                        matchedCards.push({
                            id: 'vision_' + r.card.category + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                            text: r.card.text,
                            text_en: r.card.text_en,
                            icon: r.card.icon,
                            category: r.card.category,
                            category_en: r.card.category_en || r.card.category,
                            type: r.card.type,
                            fitzgerald: r.card.type,
                            bg_color: r.card.bg_color,
                            border_color: r.card.border_color,
                            text_color: '#92400E',
                            confidence: score,
                            alreadyOnBoard: isDup
                        });
                    }
                    break;
                }
            }
        });

        return matchedCards;
    }

    async triggerRoomScan(preset = 'playroom', imageBase64 = null) {
        pecsAudio.playTap();
        let stage = document.getElementById('room-scan-stage-container');
        let resultsBox = document.getElementById('room-scan-results-container');
        if (!stage || !resultsBox) {
            this.openStudioModal();
            this.switchStudioTab('room-scanner');
            stage = document.getElementById('room-scan-stage-container');
            resultsBox = document.getElementById('room-scan-results-container');
        }
        if (!stage || !resultsBox) return;

        const isEn = this.isEn();
        document.querySelectorAll('.preset-pill-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`pill-preset-${preset}`);
        if (activeBtn) activeBtn.classList.add('active');

        const presetImages = {
            'playroom': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80',
            'kitchen_snack': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80',
            'classroom': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
            'bedroom': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80'
        };

        const imgSrc = imageBase64 || presetImages[preset] || presetImages['playroom'];

        stage.style.display = 'block';
        stage.innerHTML = `
            <div class="room-scan-stage">
                <img src="${imgSrc}" alt="Room Space" />
                <div class="room-scan-laser"></div>
                <div class="room-scan-hud-badge">
                    <span>📡</span>
                    <span>${isEn ? 'Vision AI: Analyzing Physical Objects...' : 'Vision AI: რეალური ობიექტების ამოცნობა...'}</span>
                </div>
            </div>
        `;

        resultsBox.innerHTML = `
            <div style="text-align:center; padding:24px; color:#64748B;">
                <div class="voxis-spinner"></div>
                <div style="font-weight:700; font-size:14px;">${isEn ? 'Analyzing photo with Nebius Multimodal Vision AI (MiniCPM-V-4_5)...' : 'მიმდინარეობს ფოტოს ანალიზი Nebius Vision AI-ით...'}</div>
            </div>
        `;

        try {
            let data = null;
            const imgEl = stage.querySelector('img');

            // 🚀 Parallel Dual-Engine Vision Pipeline:
            // Engine A: Nebius Multimodal Vision AI (openbmb/MiniCPM-V-4_5) on server
            const serverPromise = (async () => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 11500);
                    const resp = await fetch('api/ai.php?action=scan_room', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ preset, image: imageBase64 || '', lang: isEn ? 'en' : 'ka' }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    const serverData = await resp.json();
                    if (serverData && serverData.success && serverData.items && serverData.items.length > 0) {
                        return serverData;
                    }
                } catch (netErr) {
                    console.warn('Nebius Vision API note:', netErr);
                }
                return null;
            })();

            // Engine B: On-Device Vision AI (Center-Reticle MobileNet + COCO-SSD) running in parallel for custom photos
            const localPromise = (preset === 'custom' && imgEl)
                ? Promise.race([
                    this.detectObjectsWithVisionAI(imgEl),
                    new Promise(res => setTimeout(() => res([]), 6500))
                ]).catch(() => [])
                : Promise.resolve([]);

            const [serverResult, localItems] = await Promise.all([serverPromise, localPromise]);

            if (serverResult && serverResult.items && serverResult.items.length > 0) {
                data = serverResult;
                // If local on-device Vision AI also detected a high-confidence object not in serverResult, merge it
                if (localItems && localItems.length > 0) {
                    const existingEn = new Set(data.items.map(i => (i.text_en || '').toLowerCase()));
                    localItems.forEach(loc => {
                        const locEn = (loc.text_en || '').toLowerCase();
                        if (locEn && !existingEn.has(locEn) && (loc.confidence || 0) >= 85 && data.items.length < 4) {
                            existingEn.add(locEn);
                            data.items.push(loc);
                        }
                    });
                }
            } else if (localItems && localItems.length > 0) {
                data = {
                    success: true,
                    source: isEn ? '🧠 On-Device Vision AI + Nebius Hybrid Engine' : '🧠 On-Device Vision AI (ფოტოდან ამოცნობილი ნივთები)',
                    room_name_en: 'Custom Scanned Space',
                    room_name_ka: 'თქვენი გადაღებული გარემო',
                    items: localItems
                };
            }

            if (!data) {
                data = {
                    success: true,
                    source: isEn ? '✨ Smart Scene Quick-Pick' : '✨ სწრაფი 1-კლიკით არჩევა',
                    room_name_en: 'Scanned Space',
                    room_name_ka: 'სკანირებული სივრცე',
                    items: []
                };
            }

            if (data && data.success) {
                data.items = data.items || [];
                // Deduplicate within the scanned results list itself
                const seenScanned = new Set();
                data.items = data.items.filter(item => {
                    const key = (item.text_en || item.text || '').toLowerCase().trim();
                    if (!key || seenScanned.has(key)) return false;
                    seenScanned.add(key);
                    return true;
                });

                // Check duplicate presence on the board
                data.items.forEach(item => {
                    item.alreadyOnBoard = this.isCardOnBoard(item.text, item.text_en);
                });

                this.lastScannedItems = data.items;
                this.renderScannedObjectsOutput(data);
                pecsAudio.playSuccess();

                // Clinical auditory feedback: automatically pronounce the first recognized AAC card
                if (data.items.length > 0) {
                    const firstIt = data.items[0];
                    const speakText = isEn ? (firstIt.text_en || firstIt.text) : (firstIt.text || firstIt.text_en);
                    if (speakText && window.pecsAudio) {
                        setTimeout(() => pecsAudio.speak(speakText), 450);
                    }
                }

                // Stop the moving laser animation
                const laser = stage.querySelector('.room-scan-laser');
                if (laser) laser.style.display = 'none';

                // Update HUD badge to show completion
                const badge = stage.querySelector('.room-scan-hud-badge');
                if (badge) {
                    if (data.items.length > 0) {
                        badge.innerHTML = `<span>✅</span><span>${isEn ? `Vision AI: ${data.items.length} Cards Ready! (Scroll down 👇)` : `Vision AI: ${data.items.length} ბარათი მზადაა! (ჩამოსქროლეთ ქვემოთ 👇)`}</span>`;
                        badge.style.borderColor = '#10B981';
                        badge.style.background = 'rgba(6, 78, 59, 0.95)';
                        badge.style.color = '#A7F3D0';
                    } else {
                        badge.innerHTML = `<span>🔍</span><span>${isEn ? 'Vision AI: Photo Analyzed (Pick Items Below 👇)' : 'Vision AI: ფოტო გაანალიზებულია (აირჩიეთ ნივთები ქვემოთ 👇)'}</span>`;
                        badge.style.borderColor = '#F59E0B';
                        badge.style.background = 'rgba(120, 53, 15, 0.95)';
                        badge.style.color = '#FEF3C7';
                    }
                }

                // Automatically scroll into view
                setTimeout(() => {
                    resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 250);
            }
        } catch (err) {
            console.error('Room scan error:', err);
            const laser = stage.querySelector('.room-scan-laser');
            if (laser) laser.style.display = 'none';
            resultsBox.innerHTML = `<div style="color:#DC2626; padding:15px; text-align:center;">${isEn ? 'Vision scan error. Please try again.' : 'სკანირების შეცდომა. გთხოვთ სცადოთ თავიდან.'}</div>`;
        }
    }

    getQuickScenePickHtml() {
        const isEn = this.isEn();
        return `
            <div class="quick-scene-picks">
                <div style="font-size:12px; font-weight:800; color:#475569; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                    <span>⚡</span>
                    <span>${isEn ? 'Quick 1-Tap Object Selection (Instant Add):' : 'სწრაფი 1-კლიკით არჩევა (მყისიერი დამატება):'}</span>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('pen')">✏️ ${isEn ? 'Pen / Pencil' : 'კალამი / ფანქარი'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('cup')">🥤 ${isEn ? 'Cup / Tumbler' : 'ჭიქა / თერმოსი'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('bottle')">🍾 ${isEn ? 'Water Bottle' : 'წყლის ბოთლი'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('phone')">📱 ${isEn ? 'Phone' : 'ტელეფონი'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('book')">📚 ${isEn ? 'Book / Notebook' : 'წიგნი / რვეული'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('glasses')">👓 ${isEn ? 'Glasses' : 'სათვალე'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('headphones')">🎧 ${isEn ? 'Headphones' : 'ყურსასმენები'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('laptop')">💻 ${isEn ? 'Laptop' : 'ლეპტოპი'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('lamp')">💡 ${isEn ? 'Desk Lamp' : 'სანათი / ლამპა'}</button>
                    <button type="button" class="btn-quick-pick" onclick="app.quickAddScannedCard('chair')">🪑 ${isEn ? 'Chair' : 'სკამი'}</button>
                </div>
            </div>
        `;
    }

    quickAddScannedCard(presetKey) {
        const isEn = this.isEn();
        const suggestions = {
            'pen': { text: 'კალამი / ფანქარი', text_en: 'Pen / Pencil', icon: '✏️', category: 'school', category_en: 'School', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'cup': { text: 'ჭიქა / თერმოსი', text_en: 'Cup / Tumbler', icon: '🥤', category: 'drinks', category_en: 'Drinks', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' },
            'bottle': { text: 'წყლის ბოთლი', text_en: 'Water Bottle', icon: '🍾', category: 'drinks', category_en: 'Drinks', type: 'noun', bg_color: '#FFEDD5', border_color: '#F97316' },
            'phone': { text: 'ტელეფონი', text_en: 'Phone', icon: '📱', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'book': { text: 'წიგნი / რვეული', text_en: 'Book / Notebook', icon: '📚', category: 'school', category_en: 'School', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'glasses': { text: 'სათვალე', text_en: 'Glasses', icon: '👓', category: 'clothes', category_en: 'Personal', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'headphones': { text: 'ყურსასმენები', text_en: 'Headphones', icon: '🎧', category: 'sensory', category_en: 'Sensory', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'laptop': { text: 'ლეპტოპი', text_en: 'Laptop', icon: '💻', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'lamp': { text: 'სანათი / ლამპა', text_en: 'Desk Lamp', icon: '💡', category: 'room', category_en: 'Room', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'charger': { text: 'დამტენი / კაბელი', text_en: 'Charger / Plug', icon: '🔌', category: 'device', category_en: 'Device', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'desk': { text: 'მაგიდა', text_en: 'Desk', icon: '🪵', category: 'furniture', category_en: 'Furniture', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' },
            'chair': { text: 'სკამი', text_en: 'Chair', icon: '🪑', category: 'furniture', category_en: 'Furniture', type: 'noun', bg_color: '#FEF3C7', border_color: '#F59E0B' }
        };
        const c = suggestions[presetKey];
        if (!c) return;

        if (!this.lastScannedItems) this.lastScannedItems = [];
        const exists = this.lastScannedItems.some(i => i.text_en === c.text_en);
        if (!exists) {
            const isDup = this.isCardOnBoard(c.text, c.text_en);
            this.lastScannedItems.unshift({
                id: 'quick_' + presetKey + '_' + Date.now(),
                text: c.text,
                text_en: c.text_en,
                icon: c.icon,
                category: c.category,
                category_en: c.category_en || c.category,
                type: c.type,
                bg_color: c.bg_color,
                border_color: c.border_color,
                text_color: '#92400E',
                confidence: 99,
                alreadyOnBoard: isDup
            });
        }
        pecsAudio.playTap();
        this.renderScannedObjectsOutput({
            success: true,
            source: isEn ? '✨ Smart Scene Quick-Pick + Vision AI' : '✨ სწრაფი 1-კლიკით არჩევა + Vision AI',
            room_name_en: 'Scanned Space',
            room_name_ka: 'სკანირებული სივრცე',
            items: this.lastScannedItems
        });
    }

    renderScannedObjectsOutput(data) {
        const resultsBox = document.getElementById('room-scan-results-container');
        if (!resultsBox) return;

        const isEn = this.isEn();
        const items = data.items || [];
        const roomTitle = isEn ? data.room_name_en : data.room_name_ka;

        if (items.length === 0) {
            resultsBox.innerHTML = `
                <div style="text-align:center; padding:28px 20px; background:#FFFBEB; border:2px dashed #F59E0B; border-radius:16px; margin:16px 0;">
                    <div style="font-size:40px; margin-bottom:8px;">🔍</div>
                    <div style="font-weight:900; font-size:16px; color:#92400E; margin-bottom:6px;">
                        ${isEn ? 'No high-confidence objects recognized in this photo' : 'ფოტოზე მაღალი სიზუსტით ობიექტი ვერ ამოიცნო'}
                    </div>
                    <div style="font-size:13px; color:#78350F; margin-bottom:16px; max-width:440px; margin-left:auto; margin-right:auto; line-height:1.5;">
                        ${isEn ? 'Voxis filters out false-positive noise (no fake items). Pick your item below in 1 tap, or retake the photo:' : 'Voxis ფილტრავს შემთხვევით ცდომილებებს (არ იგონებს ყალბ ნივთებს). აირჩიეთ თქვენი ნივთი ქვემოთ 1 კლიკით, ან გადაიღეთ თავიდან:'}
                    </div>
                    ${this.getQuickScenePickHtml()}
                    <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:12px;">
                        <button type="button" class="btn-primary-action" style="width:auto; padding:8px 18px; font-size:13px;" onclick="app.openLiveCameraScanner()">
                            📸 ${isEn ? 'Retake Photo' : 'თავიდან გადაღება'}
                        </button>
                        <button type="button" class="btn-primary-action" style="width:auto; padding:8px 18px; font-size:13px; background:#475569;" onclick="app.switchStudioTab('cards')">
                            ✏️ ${isEn ? 'Create Custom Card' : 'ბარათის ხელით შექმნა'}
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const dupCount = items.filter(i => i.alreadyOnBoard).length;
        const newCount = items.length - dupCount;

        resultsBox.innerHTML = `
            <div class="room-detected-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div>
                    <div class="room-detected-title">
                        <span>✨ ${isEn ? 'Detected Objects in' : 'ამოცნობილი ნივთები:'} <strong>${roomTitle}</strong></span>
                        <span style="font-size:12px; color:#059669; background:#ECFDF5; padding:3px 8px; border-radius:6px; font-weight:800;">
                            ${newCount} ${isEn ? 'New Cards' : 'ახალი ბარათი'}
                            ${dupCount > 0 ? `<span style="color:#64748B; font-weight:700; margin-left:4px;">(${dupCount} ${isEn ? 'already on board' : 'უკვე დაფაზეა'})</span>` : ''}
                        </span>
                    </div>
                    <div style="font-size:11px; color:#64748B; font-weight:700;">
                        ${data.source}
                    </div>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <button type="button" class="btn-scanner-camera" style="padding:8px 14px; font-size:12px; background:#475569;" onclick="app.openLiveCameraScanner()">
                        <span>📸 ${isEn ? 'Retake' : 'ხელახლა გადაღება'}</span>
                    </button>
                    <button type="button" class="btn-scanner-add-board" style="padding:8px 16px; font-size:13px;" onclick="app.addSelectedScannedCardsToBoard()">
                        <span>➕ ${isEn ? 'Add to Board' : 'დაფაზე დამატება'}</span>
                    </button>
                </div>
            </div>

            ${this.getQuickScenePickHtml()}

            ${dupCount > 0 ? `
                <div style="background:#FEF3C7; border:1px solid #F59E0B; border-radius:10px; padding:8px 14px; font-size:12px; color:#92400E; font-weight:700; margin:10px 0 14px 0; display:flex; align-items:center; gap:8px;">
                    <span style="font-size:16px;">🛡️</span>
                    <span>${isEn ? 'Duplicate Protection Active: Cards already in child board are unselected to prevent clutter.' : 'დუბლებისგან დაცვა აქტიურია: ბარათები, რომლებიც უკვე დაფაზეა, მონიშნული აღარ არის (გამოირიცხება დუბლიკატები).'}</span>
                </div>
            ` : ''}

            <div class="scanned-cards-grid">
                ${items.map((item, idx) => {
                    const kaText = (item.text && !/^[a-zA-Z\s]+$/.test(item.text)) ? item.text : (this.translateToGeorgian(item.text_en || item.text) || item.text);
                    const enText = item.text_en || this.translateAbaText(item.text) || item.text;
                    const title = isEn ? enText : kaText;
                    const subTitle = isEn ? '' : (enText.toLowerCase() !== kaText.toLowerCase() ? enText : '');
                    const catTitle = isEn ? (item.category_en || item.category) : (item.category || item.category_en);
                    const isDup = !!item.alreadyOnBoard;
                    const isChecked = !isDup;

                    return `
                        <div class="scanned-card-item ${isChecked ? 'selected' : 'duplicate-item'}" id="scan-item-${idx}" onclick="app.toggleScannedCardSelection(${idx})" style="border: 2.5px solid ${item.border_color}; background-color: ${item.bg_color};">
                            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:2px;">
                                <input type="checkbox" class="scanned-card-cb" id="scan-cb-${idx}" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); app.syncScannedCardSelection(${idx});" style="position:static;">
                                ${isDup ? `<span class="scan-dup-badge">📌 ${isEn ? 'On Board' : 'უკვე დაფაზეა'}</span>` : `<span style="font-size:11px; color:#10B981; font-weight:800;">✨ ${isEn ? 'New' : 'ახალი'}</span>`}
                            </div>
                            <span class="scanned-card-icon">${item.icon}</span>
                            <div class="scanned-card-title" style="color: ${item.text_color};">${title}</div>
                            ${subTitle ? `<div class="scanned-card-sub">${subTitle}</div>` : ''}
                            <span class="scanned-card-fitzgerald-tag" style="background: ${item.border_color}; color: white;">
                                ${catTitle} · ${item.confidence}%
                            </span>
                            <button type="button" class="scanned-card-listen-btn" onclick="event.stopPropagation(); pecsAudio.speak('${title}');">
                                🔊 ${isEn ? 'Hear' : 'მოსმენა'}
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="scanner-actions-bar">
                <button type="button" class="btn-scanner-add-board" onclick="app.addSelectedScannedCardsToBoard()">
                    <span>➕ ${isEn ? 'Add Selected to Child Board' : 'მონიშნულების დაფაზე დამატება'}</span>
                </button>
                <button type="button" class="btn-scanner-print" onclick="app.sendScannedCardsToPrint()">
                    <span>🖨️ ${isEn ? 'Send to Print Studio (A4)' : 'დასაბეჭდ სტუდიაში გატანა'}</span>
                </button>
            </div>
        `;
    }

    toggleScannedCardSelection(idx) {
        const cb = document.getElementById(`scan-cb-${idx}`);
        const card = document.getElementById(`scan-item-${idx}`);
        if (cb && card) {
            cb.checked = !cb.checked;
            card.classList.toggle('selected', cb.checked);
            pecsAudio.playTap();
        }
    }

    syncScannedCardSelection(idx) {
        const cb = document.getElementById(`scan-cb-${idx}`);
        const card = document.getElementById(`scan-item-${idx}`);
        if (cb && card) {
            card.classList.toggle('selected', cb.checked);
            pecsAudio.playTap();
        }
    }

    addSelectedScannedCardsToBoard() {
        if (!this.lastScannedItems || !this.lastScannedItems.length) return;

        const isEn = this.isEn();
        let addedCount = 0;
        let skippedDuplicates = 0;
        const newlyAddedCards = [];

        this.lastScannedItems.forEach((item, idx) => {
            const cb = document.getElementById(`scan-cb-${idx}`);
            if (cb && cb.checked) {
                // Strict duplicate check before inserting
                if (this.isCardOnBoard(item.text, item.text_en)) {
                    skippedDuplicates++;
                    return;
                }

                const newCard = {
                    id: 'scan_' + item.id + '_' + Date.now() + '_' + idx,
                    text: item.text,
                    text_en: item.text_en,
                    spoken: item.text,
                    spoken_en: item.text_en,
                    type: item.type || 'noun',
                    category: item.category || 'all',
                    icon: item.icon
                };

                this.customCards.push(newCard);
                this.cards.push(newCard);
                newlyAddedCards.push(newCard);
                addedCount++;

                // Visual mark on scanned grid item
                const cardEl = document.getElementById(`scan-item-${idx}`);
                if (cardEl) {
                    let badge = cardEl.querySelector('.scan-added-tag');
                    if (!badge) {
                        badge = document.createElement('div');
                        badge.className = 'scan-added-tag';
                        badge.style.cssText = 'background:#10B981; color:white; font-size:11px; font-weight:800; padding:2px 6px; border-radius:6px; margin-top:4px; text-align:center;';
                        badge.innerText = isEn ? '✅ Added to Board' : '✅ დამატებულია დაფაზე';
                        cardEl.appendChild(badge);
                    }
                }
            }
        });

        if (addedCount > 0) {
            this.saveCustomCards();
            this.activeCategory = 'all';
            this.renderRoomScannerCustomCardsRack();
            if (this.activePhase <= 2) {
                const lastAdded = this.cards[this.cards.length - 1];
                if (lastAdded) this.phaseTargetCardId = lastAdded.id;
            }
            this.renderCardsGrid();
            this.logAbaEvent(isEn ? (`Added ${addedCount} room-scanned cards to board`) : (`AI სკანერით დაემატა ${addedCount} ბარათი დაფაზე`), 'ai_room_scan');
            pecsAudio.playSuccess();

            // Render prominent success banner right in the Room Scanner tab
            let banner = document.getElementById('room-scanner-added-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'room-scanner-added-banner';
                const actionsBar = document.querySelector('.scanner-actions-bar');
                if (actionsBar && actionsBar.parentNode) {
                    actionsBar.parentNode.insertBefore(banner, actionsBar.nextSibling);
                }
            }

            if (banner) {
                const pillsHtml = newlyAddedCards.map(c => `
                    <span style="display:inline-flex; align-items:center; gap:5px; background:#FFFFFF; border:1.5px solid #10B981; color:#065F46; padding:5px 12px; border-radius:20px; font-size:13px; font-weight:800; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
                        <span style="font-size:16px;">${c.icon}</span> <span>${isEn ? c.text_en : c.text}</span>
                    </span>
                `).join('');

                banner.style.cssText = 'margin-top:16px; background:#ECFDF5; border:2px solid #10B981; border-radius:16px; padding:16px; box-shadow:0 4px 14px rgba(16, 185, 129, 0.18);';
                banner.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
                        <div style="font-weight:900; font-size:15px; color:#065F46; display:flex; align-items:center; gap:8px;">
                            <span style="font-size:20px;">🎉</span>
                            <span>${isEn ? `Added ${addedCount} Scanned Cards to Board!` : `დაემატა ${addedCount} ახალი ბარათი!`}</span>
                            ${skippedDuplicates > 0 ? `<span style="font-size:12px; color:#047857; font-weight:700;">(${skippedDuplicates} ${isEn ? 'duplicates protected' : 'დუბლიკატი გამოირიცხა'})</span>` : ''}
                        </div>
                        <button type="button" class="btn-primary-action" style="width:auto; padding:8px 18px; font-size:13px; background:#059669; font-weight:800;" onclick="app.closeModal('modal-studio')">
                            👁️ ${isEn ? 'View on Child Board (Close Studio)' : 'ბავშვის დაფაზე ნახვა (სტუდიოს დახურვა)'}
                        </button>
                    </div>
                    <div style="font-size:12px; color:#047857; margin-bottom:10px; font-weight:600;">
                        ${isEn ? 'These cards are now active in the AAC board and ready for communicative exchange:' : 'ეს ბარათები უკვე ჩაემატა დაფის ალბომში და მზად არის საკომუნიკაციო გაცვლისთვის:'}
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        ${pillsHtml}
                    </div>
                `;
                banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            const alertMsg = skippedDuplicates > 0
                ? (isEn ? `✨ Added ${addedCount} new cards (${skippedDuplicates} duplicates protected & skipped).` : `✨ დაემატა ${addedCount} ახალი ბარათი (${skippedDuplicates} დუბლიკატი ავტომატურად გამოირიცხა).`)
                : (isEn ? `✨ Successfully added ${addedCount} scanned cards to the child's AAC board!` : `✨ წარმატებით დაემატა ${addedCount} ამოცნობილი ბარათი ბავშვის დაფაზე!`);

            this.showAlert(alertMsg, isEn ? "Board Updated" : "ბარათები დამატებულია", "📸");
        } else if (skippedDuplicates > 0) {
            pecsAudio.playTap();
            this.showAlert(
                isEn 
                    ? `All selected cards (${skippedDuplicates}) already exist on your board! Duplicate protection prevented re-adding duplicates.` 
                    : `მონიშნული ყველა ბარათი (${skippedDuplicates}) უკვე არის თქვენს დაფაზე! დუბლებისგან დაცვამ თავიდან აგარიდათ მათი ხელმეორედ დამატება.`,
                isEn ? "Duplicates Protected" : "დუბლებისგან დაცვა",
                "🛡️"
            );
        } else {
            this.showAlert(
                isEn ? "Please select at least one card." : "გთხოვთ მონიშნოთ მინიმუმ 1 ბარათი.",
                isEn ? "Notice" : "ყურადღება",
                "⚠️"
            );
        }
    }

    sendScannedCardsToPrint() {
        pecsAudio.playTap();
        this.switchStudioTab('print');
    }

    // ==========================================
    // 📸 VOXIS AI LIVE CAMERA VIEWFINDER (WebRTC)
    // ==========================================
    async openLiveCameraScanner(purpose = 'room') {
        this.cameraScannerPurpose = purpose; // 'room', 'card', or 'library-card'
        this.warmUpVisionModels();
        pecsAudio.playTap();
        const isEn = this.isEn();

        let modal = document.getElementById('voxis-camera-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'voxis-camera-modal';
            modal.className = 'room-camera-modal-backdrop';
            document.body.appendChild(modal);
        }
        modal.style.zIndex = '200000';

        this.cameraRotation = 0;
        this.cameraMirrored = false;
        this.currentCameraIndex = 0;

        modal.innerHTML = `
            <div class="room-camera-modal-box">
                <div class="room-camera-header">
                    <div class="room-camera-title">
                        <span class="camera-pulse-dot"></span>
                        <strong id="room-camera-active-title">${isEn ? '📸 AI Live Camera' : '📸 ცოცხალი კამერა'}</strong>
                    </div>
                    <button type="button" class="btn-room-camera-close" onclick="app.closeLiveCameraScanner()" title="${isEn ? 'Close' : 'დახურვა'}">✕</button>
                </div>

                <div class="room-camera-viewport-container" id="camera-viewport-container">
                    <video id="room-scanner-video-feed" autoplay playsinline muted></video>
                    
                    <div class="room-camera-hud-overlay" id="room-camera-hud">
                        <div class="camera-viewfinder-frame">
                            <div class="reticle-corner top-left"></div>
                            <div class="reticle-corner top-right"></div>
                            <div class="reticle-corner bottom-left"></div>
                            <div class="reticle-corner bottom-right"></div>
                            <div class="scanner-laser-beam"></div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                            <div class="camera-instruction-pill" id="room-camera-shutter-hint" style="background:rgba(234, 88, 12, 0.85); display:none; color:white;">
                                ⚠️ ${isEn ? 'If screen is grey/crossed: Open laptop camera physical slider or press F8' : 'თუ გადახაზულია: გახსენით ლეპტოპის კამერის ჩამკეტი (სლაიდერი ეკრანის თავზე) ან დააჭირეთ F8'}
                            </div>
                            <div class="camera-instruction-pill">
                                ${isEn ? 'Point camera at toys or room & press capture' : 'მიმართეთ კამერა სათამაშოებს/საგნებს და გადაიღეთ'}
                            </div>
                        </div>
                    </div>

                    <div id="room-camera-error-msg" class="room-camera-error" style="display:none;"></div>
                </div>

                <div class="room-camera-actions">
                    <button type="button" class="btn-camera-switch-lens" onclick="app.rotateCameraView()" title="${isEn ? 'Rotate View 90°' : 'მობრუნება 90°'}">
                        <span>🔄</span>
                        <span class="lens-label">${isEn ? 'Rotate 90°' : 'მობრუნება'}</span>
                    </button>

                    <button type="button" class="btn-camera-switch-lens" onclick="app.mirrorCameraView()" title="${isEn ? 'Mirror View' : 'სარკე'}">
                        <span>🪞</span>
                        <span class="lens-label">${isEn ? 'Mirror' : 'სარკე'}</span>
                    </button>

                    <button type="button" class="btn-camera-shutter" id="btn-camera-shutter-action" onclick="app.captureLiveCameraPhoto()">
                        <div class="shutter-outer-ring">
                            <div class="shutter-inner-circle"></div>
                        </div>
                        <span class="shutter-text">${(purpose === 'card' || purpose === 'library-card') ? (isEn ? 'Snap Photo' : 'ფოტოს გადაღება') : (isEn ? 'Snap & Scan' : 'გადაღება & სკანირება')}</span>
                    </button>

                    <button type="button" class="btn-camera-switch-lens" onclick="app.toggleCameraLens()" title="${isEn ? 'Switch Camera Device' : 'კამერის შეცვლა'}">
                        <span>📷</span>
                        <span class="lens-label" id="camera-switch-label">${isEn ? 'Camera' : 'კამერა'}</span>
                    </button>

                    <label class="btn-camera-fallback-file" title="${isEn ? 'Upload Photo' : 'ფოტოს ატვირთვა'}">
                        <span>📁</span>
                        <span class="lens-label">${isEn ? 'File' : 'ფაილი'}</span>
                        <input type="file" accept="image/*" style="display:none;" onchange="app.handleLiveCameraFileFallback(event)">
                    </label>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        await this.startRoomCameraStream();
    }

    rotateCameraView() {
        pecsAudio.playTap();
        this.cameraRotation = ((this.cameraRotation || 0) + 90) % 360;
        this.applyCameraTransform();
    }

    mirrorCameraView() {
        pecsAudio.playTap();
        this.cameraMirrored = !this.cameraMirrored;
        this.applyCameraTransform();
    }

    applyCameraTransform() {
        const video = document.getElementById('room-scanner-video-feed');
        if (!video) return;
        const rot = this.cameraRotation || 0;
        const mirror = this.cameraMirrored ? 'scaleX(-1)' : 'scaleX(1)';
        video.style.transform = `rotate(${rot}deg) ${mirror}`;
        video.style.transition = 'transform 0.25s ease';
    }

    async startRoomCameraStream(explicitDeviceId = null) {
        const video = document.getElementById('room-scanner-video-feed');
        const errBox = document.getElementById('room-camera-error-msg');
        const hud = document.getElementById('room-camera-hud');
        const shutterHint = document.getElementById('room-camera-shutter-hint');
        const titleEl = document.getElementById('room-camera-active-title');
        const switchLabel = document.getElementById('camera-switch-label');
        const shutterBtn = document.getElementById('btn-camera-shutter-action');
        
        if (errBox) errBox.style.display = 'none';
        if (hud) hud.style.display = 'flex';
        if (shutterHint) shutterHint.style.display = 'block';
        if (shutterBtn) shutterBtn.disabled = false;

        this.stopRoomCameraStream();

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.handleCameraError(new Error('InsecureContextOrUnsupported'));
            return;
        }

        const isEn = this.isEn();
        let chosenDeviceId = explicitDeviceId;
        let chosenLabel = '';

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            this.availableVideoDevices = videoDevices;

            if (videoDevices.length > 0) {
                if (!chosenDeviceId) {
                    const integrated = videoDevices.find(d => (d.label || '').toLowerCase().includes('integrated'));
                    if (integrated) {
                        chosenDeviceId = integrated.deviceId;
                        chosenLabel = integrated.label;
                    } else {
                        const idx = (this.currentCameraIndex || 0) % videoDevices.length;
                        chosenDeviceId = videoDevices[idx].deviceId;
                        chosenLabel = videoDevices[idx].label;
                    }
                } else {
                    const dev = videoDevices.find(d => d.deviceId === chosenDeviceId);
                    if (dev) chosenLabel = dev.label;
                }

                if (switchLabel) {
                    switchLabel.innerText = videoDevices.length > 1 
                        ? `${isEn ? 'Cam' : 'კამერა'} (${videoDevices.length})` 
                        : (isEn ? 'Camera' : 'კამერა');
                }
            }
        } catch (e) {
            console.warn('Enumerate devices warning:', e);
        }

        if (titleEl && chosenLabel) {
            titleEl.innerText = `📸 ${chosenLabel.substring(0, 24)}`;
        }

        const attempts = [];
        if (chosenDeviceId) {
            attempts.push({ video: { deviceId: { exact: chosenDeviceId } }, audio: false });
        }
        attempts.push({ video: { facingMode: { ideal: this.roomCameraFacing || 'environment' } }, audio: false });
        attempts.push({ video: true, audio: false });

        let stream = null;
        let lastErr = null;

        for (const constraint of attempts) {
            try {
                stream = await navigator.mediaDevices.getUserMedia(constraint);
                if (stream) break;
            } catch (err) {
                lastErr = err;
            }
        }

        if (!stream) {
            this.handleCameraError(lastErr || new Error('CameraCouldNotStart'));
            return;
        }

        this.roomCameraStream = stream;

        try {
            const track = stream.getVideoTracks()[0];
            if (track && track.label && titleEl) {
                titleEl.innerText = `📸 ${track.label.substring(0, 26)}`;
            }
        } catch (e) {}

        if (video) {
            video.muted = true;
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.srcObject = stream;

            this.applyCameraTransform();

            video.onloadedmetadata = () => {
                video.play().catch(pe => console.log('Video play error:', pe));
            };

            try {
                await video.play();
            } catch (pe) {
                console.log('Immediate play deferred:', pe);
            }
        }
    }

    async toggleCameraLens() {
        pecsAudio.playTap();
        const isEn = this.isEn();
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            if (videoDevices.length > 1) {
                this.currentCameraIndex = ((this.currentCameraIndex || 0) + 1) % videoDevices.length;
                const nextDev = videoDevices[this.currentCameraIndex];
                console.log('Switching to camera:', nextDev.label || nextDev.deviceId);
                await this.startRoomCameraStream(nextDev.deviceId);
                return;
            } else {
                this.showAlert(
                    isEn ? 'This device has only 1 connected camera.' : 'ამ კომპიუტერს მხოლოდ 1 კამერა აქვს მიერთებული. გამოსახულების მოსაბრუნებლად გამოიყენეთ ღილაკი "🔄 მობრუნება 90°".',
                    isEn ? 'Camera Info' : 'კამერა',
                    '📷'
                );
            }
        } catch (e) {
            console.warn('Error cycling camera device:', e);
        }

        this.roomCameraFacing = (this.roomCameraFacing === 'user') ? 'environment' : 'user';
        await this.startRoomCameraStream();
    }

    handleCameraError(err) {
        const errBox = document.getElementById('room-camera-error-msg');
        const hud = document.getElementById('room-camera-hud');
        const shutterBtn = document.getElementById('btn-camera-shutter-action');
        
        if (hud) hud.style.display = 'none';
        if (shutterBtn) shutterBtn.disabled = true;

        const isEn = this.isEn();
        const errName = err ? (err.name || err.message || '') : '';

        let title = isEn ? 'Camera Unavailable' : 'კამერა არ ირთვება';
        let explanation = '';

        if (errName.includes('NotAllowedError') || errName.includes('PermissionDeniedError')) {
            explanation = isEn 
                ? '<strong>Camera Permission Blocked:</strong><br>Click the camera/lock icon 🔒 in the browser URL bar above, set Camera to <strong>"Allow"</strong>, and refresh the page.' 
                : '<strong>ბრაუზერმა დაბლოკა კამერის ნებართვა:</strong><br>ზემოთ, მისამართების ზოლში დააჭირეთ ბოქლომის ან კამერის ხატულას 🔒, მონიშნეთ <strong>„Allow / ნების დართვა“</strong> და განაახლეთ გვერდი.';
        } else if (errName.includes('InsecureContext')) {
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const locUrl = window.location.href.replace(window.location.hostname, 'localhost');
            explanation = isEn
                ? `<strong>Live Webcam blocked by Chrome on IP address:</strong><br>Chrome disables camera access on network IP (<code>${window.location.hostname}</code>).<br>Please switch to <strong>localhost</strong> where camera is fully supported:`
                : `<strong>Chrome ბლოკავს კამერას ქსელურ IP-ზე:</strong><br>ბრაუზერი უსაფრთხოების გამო ქსელურ IP-ზე (<code>${window.location.hostname}</code>) ვებკამერას არ რთავს.<br>გთხოვთ გადახვიდეთ <strong>localhost</strong>-ზე:`;
        } else {
            explanation = isEn
                ? '<strong>Could not connect to camera device:</strong><br>Webcam may be in use by another app (Zoom/Teams), or camera driver is unavailable.'
                : '<strong>კამერასთან დაკავშირება ვერ მოხერხდა:</strong><br>შესაძლოა კამერა სხვა პროგრამას (Zoom, Teams) აქვს დაკავებული ან Windows-ის პარამეტრებშია შეზღუდული.';
        }

        const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const locSwitchUrl = window.location.href.replace(window.location.hostname, 'localhost');

        if (errBox) {
            errBox.innerHTML = `
                <div style="font-size:32px; margin-bottom:8px;">📷⚠️</div>
                <div style="font-size:16px; font-weight:800; margin-bottom:6px; color:#EF4444;">${title}</div>
                <div style="font-size:13px; font-weight:500; max-width:440px; margin:0 auto 16px; line-height:1.6; color:#CBD5E1;">${explanation}</div>
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    ${!isLocalHost ? `
                        <button type="button" class="btn-scanner-camera" style="background:#10B981; font-weight:700;" onclick="window.location.href='${locSwitchUrl}'">
                            <span>🚀 ${isEn ? 'Switch to http://localhost' : 'გადასვლა http://localhost-ზე'}</span>
                        </button>
                    ` : ''}
                    <label class="btn-scanner-upload" style="margin:0; cursor:pointer; display:inline-flex; background:#0284C7;">
                        <span>📁 ${isEn ? 'Choose Existing Photo' : 'ფოტოს არჩევა კომპიუტერიდან'}</span>
                        <input type="file" accept="image/*" style="display:none;" onchange="app.handleLiveCameraFileFallback(event)">
                    </label>
                    <button type="button" class="btn-scanner-camera" style="background:#475569;" onclick="app.closeLiveCameraScanner()">
                        <span>✕ ${isEn ? 'Close' : 'დახურვა'}</span>
                    </button>
                </div>
            `;
            errBox.style.display = 'flex';
        }
    }

    async captureLiveCameraPhoto() {
        const video = document.getElementById('room-scanner-video-feed');
        if (!video || !this.roomCameraStream) return;

        pecsAudio.playSuccess();

        const viewport = document.getElementById('camera-viewport-container');
        if (viewport) {
            viewport.classList.add('camera-shutter-flash');
            setTimeout(() => viewport.classList.remove('camera-shutter-flash'), 300);
        }

        const vW = video.videoWidth || 1280;
        const vH = video.videoHeight || 720;
        const rot = this.cameraRotation || 0;
        const isSwapped = (rot === 90 || rot === 270);

        // Downscale to max 640px for ultra-fast, zero-lag Vision AI
        const maxDim = 640;
        let origW = isSwapped ? vH : vW;
        let origH = isSwapped ? vW : vH;
        let targetW = origW;
        let targetH = origH;
        if (targetW > maxDim || targetH > maxDim) {
            if (targetW >= targetH) {
                targetH = Math.round((targetH * maxDim) / targetW);
                targetW = maxDim;
            } else {
                targetW = Math.round((targetW * maxDim) / targetH);
                targetH = maxDim;
            }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rot * Math.PI) / 180);
        if (this.cameraMirrored) {
            ctx.scale(-1, 1);
        }
        const drawW = isSwapped ? targetH : targetW;
        const drawH = isSwapped ? targetW : targetH;
        ctx.drawImage(video, -drawW / 2, -drawH / 2, drawW, drawH);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

        this.closeLiveCameraScanner();

        if (this.cameraScannerPurpose === 'library-card') {
            this.setLibraryCardPhotoFromDataUrl(dataUrl);
        } else if (this.cameraScannerPurpose === 'card') {
            this.openStudioModal();
            this.switchStudioTab('create-card');
            this.setStudioCardPhotoFromDataUrl(dataUrl);
        } else {
            this.openStudioModal();
            this.switchStudioTab('room-scanner');
            setTimeout(() => {
                this.triggerRoomScan('custom', dataUrl);
            }, 50);
        }
    }

    setLibraryCardPhotoFromDataUrl(dataUrl) {
        this.customCardImageData = dataUrl;
        const statusText = document.getElementById('cc-upload-status-text');
        const sizeText = document.getElementById('cc-upload-size-text');
        const previewWrap = document.getElementById('cc-file-preview-wrap');
        const previewImg = document.getElementById('cc-file-preview-img');
        const isEn = this.isEn();
        const approxKb = Math.round((dataUrl.length * 3 / 4) / 1024);

        if (previewImg) previewImg.src = dataUrl;
        if (previewWrap) previewWrap.style.display = 'flex';
        if (statusText) statusText.textContent = isEn ? '📸 Live Camera Photo' : '📸 კამერით გადაღებული ფოტო';
        if (sizeText) sizeText.textContent = isEn ? `⚡ Optimized (${approxKb} KB)` : `⚡ ოპტიმიზებულია (${approxKb} KB)`;
        if (window.pecsAudio) pecsAudio.playSuccess();
    }

    setStudioCardPhotoFromDataUrl(dataUrl) {
        this.studioCardImageData = dataUrl;
        const previewWrap = document.getElementById('new-card-photo-preview');
        const previewImg = document.getElementById('new-card-preview-img');
        const nameText = document.getElementById('new-card-photo-name');
        const isEn = this.isEn();
        const approxKb = Math.round((dataUrl.length * 3 / 4) / 1024);

        if (previewImg) previewImg.src = dataUrl;
        if (previewWrap) previewWrap.style.display = 'flex';
        if (nameText) nameText.textContent = isEn ? `📸 Camera Photo (${approxKb} KB)` : `📸 კამერის ფოტო (${approxKb} KB)`;
        if (window.pecsAudio) pecsAudio.playSuccess();
    }

    handleLiveCameraFileFallback(event) {
        this.closeLiveCameraScanner();
        if (this.cameraScannerPurpose === 'library-card') {
            this.handleCustomCardFileSelect(event);
        } else if (this.cameraScannerPurpose === 'card') {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => this.setStudioCardPhotoFromDataUrl(e.target.result);
                reader.readAsDataURL(file);
            }
        } else {
            this.openStudioModal();
            this.switchStudioTab('room-scanner');
            this.handleRoomPhotoUpload(event);
        }
    }

    closeLiveCameraScanner() {
        pecsAudio.playTap();
        this.stopRoomCameraStream();
        const modal = document.getElementById('voxis-camera-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    stopRoomCameraStream() {
        if (this.roomCameraStream) {
            try {
                this.roomCameraStream.getTracks().forEach(track => track.stop());
            } catch (e) {
                console.warn('Error stopping tracks:', e);
            }
            this.roomCameraStream = null;
        }
        const video = document.getElementById('room-scanner-video-feed');
        if (video) {
            video.srcObject = null;
        }
    }

}

var app = null;
window.app = null;
function initPecsApp() {
    if (!window.app) {
        window.app = new PecsApp();
        app = window.app;
    }
}
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initPecsApp);
} else {
    initPecsApp();
}
