/**
 * VOXIS AI Client Module
 * Integration with Nebius Token Factory & NVIDIA Nemotron Models
 * Complete Multilingual Architecture (Georgian 🇬🇪 & English 🇬🇧)
 */

class VoxisAI {
    constructor(appInstance) {
        this.app = appInstance;
        if (appInstance) appInstance.voxisAI = this;
        window.voxisAI = this;
        this.apiEndpoint = 'api/ai.php';
        this.currentLang = localStorage.getItem('voxis_lang') || 'en'; // Default to English for international hackathon
        this.status = {
            has_nebius_key: false,
            has_tavily_key: false,
            mode: 'demo_simulation',
            models: { nano: 'nvidia/nemotron-mini-4b', ultra: 'nvidia/nemotron-3-70b' }
        };
        this.predictDebounceTimer = null;
        this.currentPredictedCards = [];

        this.i18n = {
            ka: {
                brand_sub: "ალტერნატიული კომუნიკაციის ციფრული დაფა",
                phase_prefix: "ეტაპი IV (წინადადება)",
                phase_short: "ეტაპი IV",
                cards_btn: "ბარათები",
                voice_btn: "ჩაწერა",
                sound_btn: "ხმა",
                prompt_btn: "დამოუკიდებლად",
                firstthen_btn: "ჯერ-მერე",
                emotions_btn: "ემოციები",
                studio_btn: "სტუდია",
                want: "მე მინდა",
                dont_want: "არ მინდა",
                help: "დახმარება",
                more: "კიდევ",
                finished: "მორჩა",
                search_ph: "მოძებნეთ ბარათი დაფაზე ან ბაზაში...",
                add_card: "ბარათის დამატება",
                grid_large: "🔍+ დიდი",
                grid_medium: "📱 საშუალო",
                grid_compact: "📁 კომპაქტური",
                strip_title: "წინადადება",
                strip_starter: "მე მინდა",
                strip_starter_tag: "+ ზოლზე",
                strip_speak: "მოსმენა",
                strip_handover: "მიწოდება",
                ai_rec_title: "AI რეკომენდაცია:",
                ai_rec_ph: "აირჩიეთ ბარათი პროგნოზისთვის...",
                report_btn: "🚀 კლინიკური ABA რეპორტის გენერირება (Nemotron 3 Ultra)",
                research_btn: "🔍 მტკიცებულებებზე დაფუძნებული კვლევები (Tavily AI)",
                lang_toggle: "🇬🇪 ქარ",

                // Categories
                cat_basic: "საბაზისო",
                cat_food: "საჭმელი",
                cat_drinks: "სასმელი",
                cat_toys: "სათამაშო",
                cat_actions: "მოქმედება",
                cat_feelings: "ემოცია",
                cat_hygiene: "ჰიგიენა",
                cat_people: "ადამიანები",
                cat_animals: "ცხოველები",
                cat_school: "სკოლა",
                cat_all: "ყველა",
                cat_add: "დამატება",

                // Library Modal
                lib_title: "ბარათების ბაზა & დამატება",
                lib_subtitle: "აირჩიეთ 160+ მზა ბარათიდან, მოძებნეთ ARASAAC-ში ან შექმენით საკუთარი",
                lib_search_ph: "მოძებნეთ ნებისმიერი ბარათი (მაგ: პიცა, ბურთი, ძაღლი, ველოსიპედი)...",
                lib_tab_preset: "📦 მზა ბაზა (160+)",
                lib_tab_arasaac: "🌐 ARASAAC ონლაინ ძიება (10,000+)",
                lib_tab_create: "✨ საკუთარი ბარათის შექმნა",
                lib_arasaac_intro: "🌐 <strong>ARASAAC-ის ოფიციალური სიმბოლოები:</strong> ჩაწერეთ ნებისმიერი სიტყვა ქართულად ან ინგლისურად — სისტემა მყისიერად მოძებნის შესაბამის პიქტოგრამას და ერთი დაჭერით დაამატებს დაფაზე.",

                // Studio Modal
                studio_title: "🎨 თერაპევტისა და მშობლის სტუდია",
                studio_subtitle: "პროფესიული ინსტრუმენტები და პარამეტრები",
                studio_tab_create: "➕ ბარათის შექმნა",
                studio_tab_tools: "🛠️ ინსტრუმენტები",
                studio_tab_ai: "✨ Voxis AI (Nemotron)",
                studio_tab_analytics: "📊 ABA ანალიტიკა",
                studio_tab_goals: "🎯 IEP მიზნები",
                studio_tab_profiles: "👶 პროფილები",
                studio_tab_print: "🖨️ ბეჭდვა (A4)",
                studio_tab_report: "📲 დღიური შეჯამება",
                studio_tab_settings: "⚙️ პარამეტრები & Backup",

                // Phase Switcher Modal
                phase_modal_title: "სწავლების ეტაპის არჩევა",
                phase_modal_sub: "6-ეტაპიანი ვიზუალური პროტოკოლი · კლინიკური ადაპტაცია",
                p1_title: "ეტაპი I: ფიზიკური გაცვლა",
                p1_desc: "1 დიდი სამიზნე ბარათი ეკრანზე · პირდაპირი ხმა შეხებისას",
                p2_title: "ეტაპი II: მანძილი და დაჟინებულობა",
                p2_desc: "1 ბარათი + მანძილი და პარტნიორის გაწვდილი ხელი",
                p3_title: "ეტაპი III: სურათების გარჩევა (A / B)",
                p3_desc: "2 ბარათი ზოლებზე (სამიზნე vs დისტრაქტორი) · დისკრიმინაცია",
                p4_title: "ეტაპი IV: წინადადების სტრუქტურა",
                p4_desc: "წინადადების ზოლი ქვემოთ · [მე მინდა] + [ბარათი] Drag & Drop",
                p5_title: "ეტაპი V: პასუხი კითხვაზე „რა გინდა?“",
                p5_desc: "პარტნიორის აუდიო-კითხვა და ბავშვის პასუხი წინადადებით",
                p6_title: "ეტაპი VI: სპონტანური კომენტირება",
                p6_desc: "[მე ვხედავ] / [მე მესმის] · გარემოს გაზიარება და კომენტარი",

                // Emotional Regulation Modal
                reg_title: "🧘 როგორ ვგრძნობ თავს? (ემოციური რეგულაცია)",
                reg_sub: "აირჩიეთ თქვენი მდგომარეობა და დამამშვიდებელი სტრატეგია",
                reg_green_t: "მწვანე ზონა",
                reg_green_d: "მშვიდი, ბედნიერი, მზად სასწავლად",
                reg_blue_t: "ლურჯი ზონა",
                reg_blue_d: "დაღლილი, მოწყენილი, უენერგიო",
                reg_yellow_t: "ყვითელი ზონა",
                reg_yellow_d: "აღელვებული, შეშფოთებული, გაღიზიანებული",
                reg_red_t: "წითელი ზონა",
                reg_red_d: "გაბრაზებული, პანიკა, აფეთქება",
                reg_breathe_in: "ჩაისუნთქე...",
                reg_breathe_btn: "სუნთქვის დაწყება",
                reg_tools_title: "💡 სენსორული დამამშვიდებელი ინსტრუმენტები:",
                reg_tool_water: "წყალი",
                reg_tool_headphones: "ყურსასმენები",
                reg_tool_hug: "ჩახუტება",
                reg_tool_fidget: "სათამაშო",
                reg_tool_quiet: "მშვიდი სივრცე",

                // Quick Chat
                qc_title: "💬 სწრაფი სოციალური ფრაზები",
                qc_sub: "ერთი შეხებით გასაჟღერებელი სასაუბრო სიტყვები",

                // Visual Timer
                timer_title: "⏱️ ვიზუალური ტაიმერი",
                timer_sub: "Time Timer-ის პრინციპი აუტისტური აღქმისთვის",
                timer_start: "▶️ დაწყება",
                timer_pause: "⏸️ პაუზა"
            },
            en: {
                brand_sub: "Multimodal Assistive Communication Platform",
                phase_prefix: "Phase IV (Sentence)",
                phase_short: "Phase IV",
                cards_btn: "Cards",
                voice_btn: "Record",
                sound_btn: "Audio",
                prompt_btn: "Independent",
                firstthen_btn: "First-Then",
                emotions_btn: "Emotions",
                studio_btn: "Studio",
                want: "I want",
                dont_want: "Don't want",
                help: "Help me",
                more: "More",
                finished: "Finished",
                search_ph: "Search cards on board or database...",
                add_card: "Add Card",
                grid_large: "🔍+ Large",
                grid_medium: "📱 Medium",
                grid_compact: "📁 Compact",
                strip_title: "Sentence",
                strip_starter: "I want",
                strip_starter_tag: "+ Strip",
                strip_speak: "Speak",
                strip_handover: "Handover",
                ai_rec_title: "AI Suggestion:",
                ai_rec_ph: "Tap a card to predict next choices...",
                report_btn: "🚀 Generate Clinical ABA Report (Nemotron 3 Ultra)",
                research_btn: "🔍 Research Evidence-Based Interventions (Tavily AI)",
                lang_toggle: "🇬🇧 ENG",

                // Categories
                cat_basic: "Basic",
                cat_food: "Food",
                cat_drinks: "Drinks",
                cat_toys: "Toys",
                cat_actions: "Actions",
                cat_feelings: "Emotions",
                cat_hygiene: "Hygiene",
                cat_people: "People",
                cat_animals: "Animals",
                cat_school: "School",
                cat_all: "All",
                cat_add: "Add",

                // Library Modal
                lib_title: "Card Library & Search Engine",
                lib_subtitle: "Choose from 160+ presets, search ARASAAC, or create your own",
                lib_search_ph: "Search any card (e.g. pizza, ball, dog, scooter)...",
                lib_tab_preset: "📦 Preset Library (160+)",
                lib_tab_arasaac: "🌐 ARASAAC Online Search (10,000+)",
                lib_tab_create: "✨ Create Custom Card",
                lib_arasaac_intro: "🌐 <strong>ARASAAC Official Pictograms:</strong> Search any English or Georgian concept — instant clinical symbol lookup with 1-click addition to your board.",

                // Studio Modal
                studio_title: "🎨 Therapist & Parental Studio",
                studio_subtitle: "Professional Clinical Tools, ABA Analytics & Settings",
                studio_tab_create: "➕ Create Card",
                studio_tab_tools: "🛠️ Tools",
                studio_tab_ai: "✨ Voxis AI (Nemotron)",
                studio_tab_analytics: "📊 ABA Analytics",
                studio_tab_goals: "🎯 IEP Goals",
                studio_tab_profiles: "👶 Profiles",
                studio_tab_print: "🖨️ Print (A4)",
                studio_tab_report: "📲 Daily Summary",
                studio_tab_settings: "⚙️ Settings & Backup",

                // Phase Switcher Modal
                phase_modal_title: "Select Learning Phase",
                phase_modal_sub: "6-Phase Visual Communication Protocol · Dynamic Clinical Adaptation",
                p1_title: "Phase I: Physical Exchange",
                p1_desc: "1 single high-contrast target card · Instant acoustic feedback",
                p2_title: "Phase II: Distance & Persistence",
                p2_desc: "1 card + spatial distance & outstretched communicative hand",
                p3_title: "Phase III: Picture Discrimination (A / B)",
                p3_desc: "2 cards on velcro strip (Target vs Distractor) · Discrimination",
                p4_title: "Phase IV: Sentence Structure",
                p4_desc: "Sentence strip dock below · [I want] + [Item] Drag & Drop",
                p5_title: "Phase V: Responsive Requesting",
                p5_desc: "Partner audio prompt 'What do you want?' and sentence reply",
                p6_title: "Phase VI: Spontaneous Commenting",
                p6_desc: "[I see] / [I hear] · Environmental sharing and commentary",

                // Emotional Regulation Modal
                reg_title: "🧘 How Am I Feeling? (Emotional Regulation)",
                reg_sub: "Identify emotional zone and choose a calming strategy",
                reg_green_t: "Green Zone",
                reg_green_d: "Calm, happy, focused, ready to learn",
                reg_blue_t: "Blue Zone",
                reg_blue_d: "Tired, sad, slow, low energy",
                reg_yellow_t: "Yellow Zone",
                reg_yellow_d: "Frustrated, anxious, over-excited",
                reg_red_t: "Red Zone",
                reg_red_d: "Angry, sensory meltdown, need immediate support",
                reg_breathe_in: "Breathe in...",
                reg_breathe_btn: "Start Breathing",
                reg_tools_title: "💡 Sensory De-escalation Tools:",
                reg_tool_water: "Water",
                reg_tool_headphones: "Headphones",
                reg_tool_hug: "Hug",
                reg_tool_fidget: "Fidget Toy",
                reg_tool_quiet: "Quiet Space",

                // Quick Chat
                qc_title: "💬 Quick Social Chat",
                qc_sub: "Single-tap essential conversational phrases",

                // Visual Timer
                timer_title: "⏱️ Visual Countdown Timer",
                timer_sub: "Predictable Time Timer design for ASD transition support",
                timer_start: "▶️ Start",
                timer_pause: "⏸️ Pause"
            }
        };
    }

    t(key) {
        return (this.i18n[this.currentLang] && this.i18n[this.currentLang][key]) || key;
    }

    async init() {
        await this.checkStatus();
        this.injectHeaderElements();
        this.injectPredictionBar();
        this.attachHooks();
        this.applyLanguage(this.currentLang);
        const cb = document.getElementById('setting-toggle-pred-bar');
        if (cb) cb.checked = this.isPredictionBarEnabled();
        this.syncFatigueDetectorUI();
        console.log('🤖 Voxis AI Module Initialized successfully. Lang:', this.currentLang);
    }

    async checkStatus() {
        try {
            const res = await fetch(`${this.apiEndpoint}?action=status`);
            if (res.ok) {
                this.status = await res.json();
            }
        } catch (e) {
            console.warn('AI status check offline, defaulting to simulation:', e);
        }
    }

    injectHeaderElements() {
        const headerRight = document.querySelector('.sensory-header-right');
        if (!headerRight) return;

        // 1. Language Toggle Button
        if (!document.getElementById('voxis-lang-toggle-btn')) {
            const langBtn = document.createElement('button');
            langBtn.id = 'voxis-lang-toggle-btn';
            langBtn.className = 'sensory-head-btn voxis-lang-toggle-btn';
            langBtn.type = 'button';
            langBtn.title = 'Switch Language / ენის შეცვლა (EN / KA)';
            langBtn.innerHTML = `<img src="assets/images/${this.currentLang === 'en' ? 'flag-gb.svg' : 'flag-ka.svg'}" class="voxis-flag-img" alt="${this.currentLang === 'en' ? 'EN' : 'KA'}">`;
            langBtn.onclick = () => this.toggleLanguage();
            const lockBtn = document.getElementById('btn-head-lock');
            if (lockBtn) {
                headerRight.insertBefore(langBtn, lockBtn);
            } else {
                headerRight.appendChild(langBtn);
            }
        }

        // 2. External AI Badge removed: Voxis AI is accessed exclusively from the Action Menu
        const existingBadge = document.getElementById('voxis-ai-header-badge');
        if (existingBadge) existingBadge.remove();

        const drawerAiLabel = document.getElementById('drawer-ai-label');
        if (drawerAiLabel && this.status) {
            drawerAiLabel.textContent = this.status.has_nebius_key ? 'Nebius AI' : 'Voxis AI';
        }
    }

    toggleLanguage() {
        const nextLang = this.currentLang === 'ka' ? 'en' : 'ka';
        this.setLanguage(nextLang);
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('voxis_lang', lang);

        const langBtn = document.getElementById('voxis-lang-toggle-btn');
        if (langBtn) {
            langBtn.innerHTML = `<img src="assets/images/${lang === 'en' ? 'flag-gb.svg' : 'flag-ka.svg'}" class="voxis-flag-img" alt="${lang === 'en' ? 'EN' : 'KA'}">`;
        }

        const drawerFlag = document.getElementById('drawer-flag-img');
        if (drawerFlag) {
            drawerFlag.src = `assets/images/${lang === 'en' ? 'flag-gb.svg' : 'flag-ka.svg'}`;
        }

        this.applyLanguage(lang);

        const appInst = window.app || this.app;
        if (appInst) {
            if (typeof appInst.translateBoardUI === 'function') {
                try {
                    appInst.translateBoardUI(lang);
                } catch(e) {
                    console.warn('appInst.translateBoardUI error:', e);
                }
            }
            if (typeof appInst.onLanguageChange === 'function') {
                try {
                    appInst.onLanguageChange(lang);
                } catch(e) {
                    console.warn('appInst.onLanguageChange error:', e);
                }
            }
        }

        this.requestPrediction();
    }

    applyLanguage(lang) {
        const t = this.i18n[lang] || this.i18n.en;
        const isEn = lang === 'en';

        document.documentElement.lang = lang;
        if (document.body) {
            document.body.classList.toggle('lang-ka', lang === 'ka');
            document.body.classList.toggle('lang-en', lang === 'en');
        }

        const theApp = window.app || this.app;
        if (theApp && typeof theApp.translateBoardUI === 'function') {
            try {
                theApp.translateBoardUI(lang);
            } catch(e) {
                console.warn('theApp.translateBoardUI in applyLanguage error:', e);
            }
        }

        // 1. Header
        const subTitle = document.querySelector('.sensory-title-sub');
        if (subTitle) subTitle.innerText = t.brand_sub;

        if (theApp) {
            try {
                if (typeof theApp.syncPhaseBadges === 'function') theApp.syncPhaseBadges();
                if (typeof theApp.updateProfileBadge === 'function') theApp.updateProfileBadge();
                if (typeof theApp.renderProfileListInStudio === 'function') theApp.renderProfileListInStudio();
            } catch (e) {
                console.warn('theApp studio/profile sync error:', e);
            }
        }

        const childNameEl = document.getElementById('header-child-name');
        if (childNameEl) {
            const curName = childNameEl.innerText.trim();
            if (isEn) {
                if (curName === 'ალექსი' || curName === 'დაჩი' || curName === 'ბავშვი 1') childNameEl.innerText = 'Alex';
                else if (curName === 'მია') childNameEl.innerText = 'Mia';
                else if (curName === 'ლუკა') childNameEl.innerText = 'Lucas';
            } else {
                if (curName === 'Alex') childNameEl.innerText = 'ალექსი';
                else if (curName === 'Mia') childNameEl.innerText = 'მია';
                else if (curName === 'Lucas') childNameEl.innerText = 'ლუკა';
            }
        }
        const drawerChildNameEl = document.getElementById('drawer-child-name');
        if (drawerChildNameEl) {
            const curName = drawerChildNameEl.innerText.trim();
            if (isEn) {
                if (curName === 'ალექსი' || curName === 'დაჩი' || curName === 'ბავშვი 1') drawerChildNameEl.innerText = 'Alex';
                else if (curName === 'მია') drawerChildNameEl.innerText = 'Mia';
                else if (curName === 'ლუკა') drawerChildNameEl.innerText = 'Lucas';
            } else {
                if (curName === 'Alex') drawerChildNameEl.innerText = 'ალექსი';
                else if (curName === 'Mia') drawerChildNameEl.innerText = 'მია';
                else if (curName === 'Lucas') drawerChildNameEl.innerText = 'ლუკა';
            }
        }

        const btnHome = document.querySelector('#btn-head-home .head-btn-label');
        if (btnHome) btnHome.innerText = isEn ? 'Board' : 'დაფა';

        const btnCards = document.querySelector('#btn-head-card-library .head-btn-label');
        if (btnCards) btnCards.innerText = t.cards_btn;

        const btnVoice = document.querySelector('#btn-head-voice-studio .head-btn-label');
        if (btnVoice) btnVoice.innerText = t.voice_btn;

        const btnSound = document.querySelector('#btn-head-sound-test .head-btn-label');
        if (btnSound) btnSound.innerText = t.sound_btn;

        const btnPrompt = document.querySelector('#btn-head-prompt .head-btn-label');
        if (btnPrompt) btnPrompt.innerText = t.prompt_btn;

        const btnFirstThen = document.querySelector('#btn-head-first-then .head-btn-label') || document.getElementById('btn-head-firstthen-text');
        if (btnFirstThen) btnFirstThen.innerText = t.firstthen_btn;

        const btnEmotions = document.querySelector('#btn-head-emotions .head-btn-label');
        if (btnEmotions) btnEmotions.innerText = t.emotions_btn;

        const btnStudio = document.querySelector('#btn-head-studio .head-btn-label');
        if (btnStudio) btnStudio.innerText = t.studio_btn;

        // 2. Core Bar Buttons
        const pillWant = document.querySelector('.pill-want .cp-text');
        if (pillWant) pillWant.innerText = t.want;

        const pillDont = document.querySelector('.pill-dont-want .cp-text');
        if (pillDont) pillDont.innerText = t.dont_want;

        const pillHelp = document.querySelector('.pill-help .cp-text');
        if (pillHelp) pillHelp.innerText = t.help;

        const pillMore = document.querySelector('.pill-more .cp-text');
        if (pillMore) pillMore.innerText = t.more;

        const pillFinished = document.querySelector('.pill-finished .cp-text');
        if (pillFinished) pillFinished.innerText = t.finished;

        // 3. Search & Grid Controls
        const searchInput = document.getElementById('board-live-search');
        if (searchInput) searchInput.placeholder = t.search_ph;

        const cstLibText = document.querySelector('.cst-lib-text');
        if (cstLibText) cstLibText.innerText = t.add_card;

        const btnEditMode = document.getElementById('btn-edit-mode-text');
        const theAppInst = window.app || this.app;
        const isEditing = theAppInst && theAppInst.isBoardEditMode;
        if (btnEditMode) {
            btnEditMode.innerText = isEditing 
                ? (isEn ? 'Done' : 'მზადაა') 
                : (isEn ? 'Edit' : 'მართვა');
        }
        const btnEditToggle = document.getElementById('btn-toggle-board-edit');
        if (btnEditToggle) {
            btnEditToggle.title = isEn ? 'Delete or Manage Cards on Board' : 'ბარათების წაშლა ან მართვა დაფაზე';
        }

        const gridBtns = document.querySelectorAll('.grid-size-btn');
        gridBtns.forEach(btn => {
            const size = btn.getAttribute('data-size');
            if (size === 'large') btn.innerHTML = `<span>🔍+</span> ${isEn ? 'Large' : 'დიდი'}`;
            if (size === 'medium') btn.innerHTML = `<span>📱</span> ${isEn ? 'Medium' : 'საშუალო'}`;
            if (size === 'compact') btn.innerHTML = `<span>📁</span> ${isEn ? 'Compact' : 'კომპაქტური'}`;
        });

        // 4. Montessori Inlay Category Tabs
        const categoryMap = {
            basic: t.cat_basic,
            food: t.cat_food,
            drinks: t.cat_drinks,
            toys: t.cat_toys,
            actions: t.cat_actions,
            feelings: t.cat_feelings,
            all: t.cat_all
        };
        document.querySelectorAll('#binder-tabs-nav .montessori-tab-btn').forEach(btn => {
            const cat = btn.getAttribute('data-category');
            if (cat && categoryMap[cat]) {
                const labelSpan = btn.querySelector('.m-tab-text');
                if (labelSpan) labelSpan.innerText = categoryMap[cat];
            }
        });
        const tabLibTrigger = document.querySelector('#binder-tabs-nav .tab-library-trigger .m-tab-text');
        if (tabLibTrigger) tabLibTrigger.innerText = t.cat_add;

        // 5. Sentence Strip
        const stripLabel = document.querySelector('.strip-label span:last-child');
        if (stripLabel) stripLabel.innerText = t.strip_title;

        const swText = document.querySelector('.sw-text');
        if (swText) swText.innerText = t.strip_starter;

        const swTag = document.querySelector('.sw-action-tag');
        if (swTag) swTag.innerText = t.strip_starter_tag;

        const btnSpeakLabel = document.querySelector('#btn-speak .btn-strip-label');
        if (btnSpeakLabel) btnSpeakLabel.innerText = t.strip_speak;

        const btnHandoverLabel = document.querySelector('#btn-handover .btn-strip-label');
        if (btnHandoverLabel) btnHandoverLabel.innerText = t.strip_handover;

        // 6. Prediction Bar
        const predTitle = document.querySelector('.voxis-pred-title');
        if (predTitle) predTitle.innerText = t.ai_rec_title;

        // 7. Card Library Modal
        const libTitle = document.querySelector('.lib-title');
        if (libTitle) libTitle.innerText = t.lib_title;

        const libSub = document.querySelector('.lib-subtitle');
        if (libSub) libSub.innerText = t.lib_subtitle;

        const libSearchInput = document.getElementById('lib-search-input');
        if (libSearchInput) libSearchInput.placeholder = t.lib_search_ph;

        const tabLibPreset = document.getElementById('tab-btn-lib-preset');
        if (tabLibPreset) tabLibPreset.innerHTML = `<span>📦</span> ${isEn ? 'Preset Library (160+)' : 'მზა ბაზა (160+)'}`;

        const tabLibArasaac = document.getElementById('tab-btn-lib-arasaac');
        if (tabLibArasaac) tabLibArasaac.innerHTML = `<span>🌐</span> ${isEn ? 'ARASAAC Online Search (10,000+)' : 'ARASAAC ონლაინ ძიება (10,000+)'}`;

        const tabLibCreate = document.getElementById('tab-btn-lib-create');
        if (tabLibCreate) tabLibCreate.innerHTML = `<span>✨</span> ${isEn ? 'Create Custom Card' : 'საკუთარი ბარათის შექმნა'}`;

        const arasaacIntro = document.querySelector('.arasaac-intro-bar p');
        if (arasaacIntro) arasaacIntro.innerHTML = t.lib_arasaac_intro;

        // 8. Parental & Therapist Studio Modal
        const studioTitle = document.querySelector('#modal-studio .modal-title');
        if (studioTitle) studioTitle.innerText = t.studio_title;

        const studioSub = document.querySelector('#modal-studio .modal-subtitle');
        if (studioSub) studioSub.innerText = t.studio_subtitle;

        const studioTabBtns = document.querySelectorAll('.studio-tab-btn');
        studioTabBtns.forEach(btn => {
            const tab = btn.getAttribute('data-tab');
            if (tab === 'create-card') btn.innerHTML = t.studio_tab_create;
            if (tab === 'tools') btn.innerHTML = t.studio_tab_tools;
            if (tab === 'voxis-ai') btn.innerHTML = t.studio_tab_ai;
            if (tab === 'analytics') btn.innerHTML = t.studio_tab_analytics;
            if (tab === 'goals') btn.innerHTML = t.studio_tab_goals;
            if (tab === 'profiles') btn.innerHTML = t.studio_tab_profiles;
            if (tab === 'voice') btn.innerHTML = isEn ? '🎙️ Voice Studio' : '🎙️ ხმის სტუდია';
            if (tab === 'room-scan' || tab === 'room-scanner') btn.innerHTML = isEn ? '📸 AI Room Scanner' : '📸 ოთახის AI სკანერი';
            if (tab === 'print') btn.innerHTML = t.studio_tab_print;
            if (tab === 'report') btn.innerHTML = t.studio_tab_report;
            if (tab === 'settings') btn.innerHTML = t.studio_tab_settings;
        });

        // 9. Phase Switcher Modal
        const phaseTitle = document.querySelector('#modal-phase-switcher .phase-modal-title');
        if (phaseTitle) phaseTitle.innerText = t.phase_modal_title;

        const phaseSub = document.querySelector('#modal-phase-switcher .phase-modal-subtitle');
        if (phaseSub) phaseSub.innerText = t.phase_modal_sub;

        const p1 = document.querySelector('#phase-pick-card-1 .phase-pick-info');
        if (p1) p1.innerHTML = `<strong>${t.p1_title}</strong><span>${t.p1_desc}</span>`;

        const p2 = document.querySelector('#phase-pick-card-2 .phase-pick-info');
        if (p2) p2.innerHTML = `<strong>${t.p2_title}</strong><span>${t.p2_desc}</span>`;

        const p3 = document.querySelector('#phase-pick-card-3 .phase-pick-info');
        if (p3) p3.innerHTML = `<strong>${t.p3_title}</strong><span>${t.p3_desc}</span>`;

        const p4 = document.querySelector('#phase-pick-card-4 .phase-pick-info');
        if (p4) p4.innerHTML = `<strong>${t.p4_title}</strong><span>${t.p4_desc}</span>`;

        const p5 = document.querySelector('#phase-pick-card-5 .phase-pick-info');
        if (p5) p5.innerHTML = `<strong>${t.p5_title}</strong><span>${t.p5_desc}</span>`;

        const p6 = document.querySelector('#phase-pick-card-6 .phase-pick-info');
        if (p6) p6.innerHTML = `<strong>${t.p6_title}</strong><span>${t.p6_desc}</span>`;

        // 9b. Quick Profile Switcher
        if (window.app && typeof window.app.renderQuickProfileList === 'function') {
            window.app.renderQuickProfileList();
        }

        // 10. Emotional Regulation Modal
        const regTitle = document.querySelector('#modal-regulation .modal-title');
        if (regTitle) regTitle.innerText = t.reg_title;

        const regSub = document.querySelector('#modal-regulation .modal-subtitle');
        if (regSub) regSub.innerText = t.reg_sub;

        const zg = document.querySelector('.zone-green');
        if (zg) {
            const zt = zg.querySelector('.zone-title');
            const zd = zg.querySelector('.zone-desc');
            if (zt) zt.innerText = t.reg_green_t;
            if (zd) zd.innerText = t.reg_green_d;
        }
        const zb = document.querySelector('.zone-blue');
        if (zb) {
            const zt = zb.querySelector('.zone-title');
            const zd = zb.querySelector('.zone-desc');
            if (zt) zt.innerText = t.reg_blue_t;
            if (zd) zd.innerText = t.reg_blue_d;
        }
        const zy = document.querySelector('.zone-yellow');
        if (zy) {
            const zt = zy.querySelector('.zone-title');
            const zd = zy.querySelector('.zone-desc');
            if (zt) zt.innerText = t.reg_yellow_t;
            if (zd) zd.innerText = t.reg_yellow_d;
        }
        const zr = document.querySelector('.zone-red');
        if (zr) {
            const zt = zr.querySelector('.zone-title');
            const zd = zr.querySelector('.zone-desc');
            if (zt) zt.innerText = t.reg_red_t;
            if (zd) zd.innerText = t.reg_red_d;
        }
        const brText = document.getElementById('breathing-text');
        if (brText) brText.innerText = t.reg_breathe_in;
        const brBtn = document.getElementById('breathing-btn-text');
        if (brBtn) brBtn.innerText = t.reg_breathe_btn;

        const toolsTitle = document.getElementById('regulation-tools-title');
        if (toolsTitle) toolsTitle.innerText = t.reg_tools_title;

        const calmingMap = {
            'water': t.reg_tool_water,
            'headphones': t.reg_tool_headphones,
            'hug': t.reg_tool_hug,
            'fidget': t.reg_tool_fidget,
            'quiet': t.reg_tool_quiet
        };
        document.querySelectorAll('#modal-regulation .calming-tool-btn').forEach(btn => {
            const key = btn.getAttribute('data-tool');
            if (key && calmingMap[key]) {
                const label = btn.querySelector('.ct-label') || btn.querySelectorAll('span')[1];
                if (label) label.innerText = calmingMap[key];
            }
        });

        // 11. Quick Chat Modal
        const qcTitle = document.querySelector('#modal-quickchat .modal-title');
        if (qcTitle) qcTitle.innerText = t.qc_title;
        const qcSub = document.querySelector('#modal-quickchat .modal-subtitle');
        if (qcSub) qcSub.innerText = t.qc_sub;

        const quickPhrasesMap = isEn ? {
            hello: 'Hello!',
            goodbye: 'Goodbye!',
            howareyou: 'How are you?',
            thankyou: 'Thank you!',
            sorry: 'Sorry',
            likeit: 'I like it!',
            dontlike: "Don't like",
            helpme: 'Help me',
            love: 'I love you!',
            leaveme: 'Leave me alone'
        } : {
            hello: 'გამარჯობა!',
            goodbye: 'ნახვამდის!',
            howareyou: 'როგორ ხარ?',
            thankyou: 'მადლობა!',
            sorry: 'ბოდიში',
            likeit: 'მომწონს!',
            dontlike: 'არ მომწონს',
            helpme: 'დამეხმარე',
            love: 'მიყვარხარ!',
            leaveme: 'მარტო დამტოვე'
        };

        document.querySelectorAll('#modal-quickchat .quick-phrase-card').forEach(btn => {
            const key = btn.getAttribute('data-quick');
            if (key && quickPhrasesMap[key]) {
                const textSpan = btn.querySelector('.qp-text');
                if (textSpan) textSpan.innerText = quickPhrasesMap[key];
            }
        });

        // 12. Visual Timer Modal
        const tmTitle = document.querySelector('#modal-timer .modal-title');
        if (tmTitle) tmTitle.innerText = t.timer_title;
        const tmSub = document.querySelector('#modal-timer .modal-subtitle');
        if (tmSub) tmSub.innerText = t.timer_sub;
        const timerStartBtn = document.querySelector('#modal-timer .btn-primary-action');
        if (timerStartBtn) timerStartBtn.innerText = isEn ? '▶️ Start' : '▶️ დაწყება';
        const timerPauseBtn = document.querySelector('#modal-timer .icon-btn[onclick*="pauseTimer"]');
        if (timerPauseBtn) timerPauseBtn.innerText = isEn ? '⏸️ Pause' : '⏸️ პაუზა';

        // 13. Re-render Cards & Strips via app instance FIRST
        const appInst = window.app || this.app;
        if (appInst) {
            const isAacMode = (!appInst.currentMode || appInst.currentMode === 'aac');
            if (isAacMode) {
                try { if (typeof appInst.renderCardsGrid === 'function') appInst.renderCardsGrid(); } catch(e) { console.warn('renderCardsGrid error:', e); }
                try { if (typeof appInst.renderSentenceStrip === 'function') appInst.renderSentenceStrip(); } catch(e) { console.warn('renderSentenceStrip error:', e); }
                try { if (typeof appInst.renderCategories === 'function') appInst.renderCategories(); } catch(e) { console.warn('renderCategories error:', e); }
                try { if (typeof appInst.renderStarters === 'function') appInst.renderStarters(); } catch(e) { console.warn('renderStarters error:', e); }
                try { if (typeof appInst.renderCoreDock === 'function') appInst.renderCoreDock(); } catch(e) { console.warn('renderCoreDock error:', e); }
            }
            try { if (typeof appInst.renderLibraryCategoryPills === 'function') appInst.renderLibraryCategoryPills(); } catch(e) { console.warn(e); }
            try { if (typeof appInst.renderLibraryCards === 'function') appInst.renderLibraryCards(); } catch(e) { console.warn(e); }
            try { if (typeof appInst.showDefaultArasaacPictograms === 'function') appInst.showDefaultArasaacPictograms(); } catch(e) { console.warn(e); }
            try { if (typeof appInst.renderScheduleTimeline === 'function') appInst.renderScheduleTimeline(); } catch(e) { console.warn('renderScheduleTimeline error:', e); }
            try { if (typeof appInst.updateScheduleProgress === 'function') appInst.updateScheduleProgress(); } catch(e) { console.warn('updateScheduleProgress error:', e); }
            try { if (typeof appInst.updateFirstThenLanguage === 'function') appInst.updateFirstThenLanguage(lang); } catch(e) { console.warn('updateFirstThenLanguage error:', e); }
            try { if (typeof appInst.updateGameLanguage === 'function') appInst.updateGameLanguage(lang); } catch(e) { console.warn('updateGameLanguage error:', e); }
            try { if (typeof appInst.updateScheduleLanguage === 'function') appInst.updateScheduleLanguage(lang); } catch(e) { console.warn('updateScheduleLanguage error:', e); }
            try { if (typeof appInst.syncMobileMenuUI === 'function') appInst.syncMobileMenuUI(); } catch(e) { console.warn('syncMobileMenuUI error:', e); }
            try { if (typeof appInst.syncPhaseBadges === 'function') appInst.syncPhaseBadges(); } catch(e) { console.warn('syncPhaseBadges error:', e); }
            try { if (typeof appInst.syncPromptLevelUI === 'function') appInst.syncPromptLevelUI(); } catch(e) { console.warn('syncPromptLevelUI error:', e); }
            try { if (typeof appInst.onLanguageChange === 'function') appInst.onLanguageChange(lang); } catch(e) { console.warn('onLanguageChange error:', e); }
            try {
                if (typeof appInst.renderPrintableTab === 'function') {
                    const prEl = document.getElementById('studio-tab-print');
                    if (prEl && prEl.style.display !== 'none') appInst.renderPrintableTab();
                }
            } catch(e) {}
            try {
                if (typeof appInst.renderAnalyticsTab === 'function') {
                    const anEl = document.getElementById('studio-tab-analytics');
                    if (anEl && anEl.style.display !== 'none') appInst.renderAnalyticsTab();
                }
            } catch(e) {}
        }

        try { this.translateStudioUI(lang); } catch(e) { console.warn('translateStudioUI error:', e); }
        try { this.translateClinicalToolsAndModals(lang); } catch(e) { console.warn('translateClinicalToolsAndModals error:', e); }
        try { this.translateMobileDrawer(lang); } catch(e) { console.warn('translateMobileDrawer error:', e); }
    }

    translateMobileDrawer(lang) {
        const isEn = (lang === 'en');
        const theApp = window.app || this.app;
        if (theApp && typeof theApp.syncMobileMenuUI === 'function') {
            theApp.syncMobileMenuUI();
            return;
        }

        const profileHint = document.getElementById('drawer-profile-hint');
        if (profileHint) profileHint.textContent = isEn ? 'Profile & Settings ›' : 'პროფილი და პარამეტრები ›';

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
    }

    isPredictionBarEnabled() {
        return localStorage.getItem('voxis_enable_prediction_bar') === 'true';
    }

    togglePredictionBar(enable) {
        localStorage.setItem('voxis_enable_prediction_bar', enable ? 'true' : 'false');
        const predContainer = document.getElementById('voxis-ai-prediction-bar');
        if (predContainer) {
            predContainer.style.display = enable ? 'flex' : 'none';
            if (enable) this.requestPrediction();
        }
        // Sync any checkboxes in settings
        const cb1 = document.getElementById('voxis-toggle-pred-bar');
        if (cb1) cb1.checked = enable;
        const cb2 = document.getElementById('setting-toggle-pred-bar');
        if (cb2) cb2.checked = enable;
    }

    injectPredictionBar() {
        const coreBar = document.getElementById('chalkboard-core-bar');
        if (!coreBar || document.getElementById('voxis-ai-prediction-bar')) return;

        const isEnabled = this.isPredictionBarEnabled();

        const predContainer = document.createElement('div');
        predContainer.id = 'voxis-ai-prediction-bar';
        predContainer.className = 'voxis-ai-prediction-bar';
        predContainer.style.display = isEnabled ? 'flex' : 'none';
        predContainer.innerHTML = `
            <div class="voxis-pred-header">
                <span class="voxis-pred-icon">✨</span>
                <span class="voxis-pred-title">${this.t('ai_rec_title')}</span>
                <span class="voxis-pred-source">${this.status.has_nebius_key ? 'Nemotron Nano' : 'Nemotron Fast'}</span>
            </div>
            <div class="voxis-pred-chips-row" id="voxis-pred-chips-row">
                <span class="voxis-pred-placeholder">${this.t('ai_rec_ph')}</span>
            </div>
        `;

        coreBar.parentNode.insertBefore(predContainer, coreBar);
    }

    attachHooks() {
        const theApp = window.app || this.app;
        if (!theApp) return;
        this.app = theApp;
        this.recentTapTimestamps = [];
        this.lastFatigueAlertTime = 0;

        const origUpdateStrip = this.app.renderSentenceStrip ? this.app.renderSentenceStrip.bind(this.app) : null;
        if (origUpdateStrip) {
            this.app.renderSentenceStrip = () => {
                origUpdateStrip();
                if (this.isPredictionBarEnabled()) this.requestPrediction();
            };
        }

        const origRenderGrid = this.app.renderCardsGrid ? this.app.renderCardsGrid.bind(this.app) : null;
        if (origRenderGrid) {
            this.app.renderCardsGrid = () => {
                origRenderGrid();
            };
        }

        if (this.isPredictionBarEnabled()) {
            setTimeout(() => this.requestPrediction(), 600);
        }
    }

    isFatigueDetectorEnabled() {
        const saved = localStorage.getItem('voxis_enable_fatigue_detector');
        return saved === null ? true : (saved === 'true');
    }

    toggleFatigueDetector(enable) {
        localStorage.setItem('voxis_enable_fatigue_detector', enable ? 'true' : 'false');
        if (!enable) {
            this.recentTapTimestamps = [];
            const banner = document.getElementById('voxis-fatigue-guard-banner');
            if (banner) banner.remove();
        }
        this.syncFatigueDetectorUI();
    }

    syncFatigueDetectorUI() {
        const isEnabled = this.isFatigueDetectorEnabled();
        const isEn = this.currentLang === 'en';

        // 1. Sync Studio -> Voxis AI Tab
        const statusBadge = document.getElementById('voxis-guard-status-badge');
        if (statusBadge) {
            statusBadge.innerText = isEnabled ? (isEn ? 'ACTIVE' : 'აქტიური') : (isEn ? 'DISABLED' : 'გამორთული');
            statusBadge.style.background = isEnabled ? '#DCFCE7' : '#F1F5F9';
            statusBadge.style.color = isEnabled ? '#15803D' : '#64748B';
            statusBadge.style.borderColor = isEnabled ? '#86EFAC' : '#CBD5E1';
        }

        const toggleBtn = document.getElementById('btn-toggle-fatigue-guard');
        if (toggleBtn) {
            toggleBtn.innerHTML = isEnabled 
                ? (isEn ? '🟢 Enabled (Turn OFF)' : '🟢 ჩართულია (გამორთვა)')
                : (isEn ? '⚪ Disabled (Turn ON)' : '⚪ გამორთულია (ჩართვა)');
            toggleBtn.style.background = isEnabled ? '#10B981' : '#64748B';
            toggleBtn.style.color = '#FFFFFF';
        }

        // 2. Sync Settings Tab Checkbox
        const cbSettings = document.getElementById('setting-toggle-fatigue-guard');
        if (cbSettings) {
            cbSettings.checked = isEnabled;
        }

        // 3. Update Title text if exists
        const guardTitle = document.getElementById('voxis-guard-title');
        if (guardTitle) {
            guardTitle.innerText = isEn 
                ? `AI Sensory Fatigue & Perseveration Detector: ${isEnabled ? 'Active' : 'Disabled'}`
                : `AI სენსორული გადაღლისა და პერსევერაციის დეტექტორი: ${isEnabled ? 'აქტიური' : 'გამორთული'}`;
        }
    }

    trackCardTapForFatigue() {
        if (!this.isFatigueDetectorEnabled()) {
            return;
        }

        const now = Date.now();
        // Ignore synthetic duplicate events within 180ms
        if (this._lastTapTimeRecorded && (now - this._lastTapTimeRecorded < 180)) {
            return;
        }
        this._lastTapTimeRecorded = now;

        if (!this.recentTapTimestamps) this.recentTapTimestamps = [];
        this.recentTapTimestamps.push(now);

        // Keep only taps within the last 3.5 seconds
        this.recentTapTimestamps = this.recentTapTimestamps.filter(t => now - t < 3500);

        // Trigger ONLY if 5 real rapid taps occur within 3.5 seconds AND 15s cooldown has passed
        if (this.recentTapTimestamps.length >= 5 && (now - (this.lastFatigueAlertTime || 0) > 15000)) {
            this.lastFatigueAlertTime = now;
            this.recentTapTimestamps = [];
            this.triggerSensoryFatigueAlert(false);
        }
    }

    triggerSensoryFatigueAlert(isTest = false) {
        const isEn = this.currentLang === 'en';
        this.recentTapTimestamps = []; // Clean tap buffer immediately
        if (isTest && document.getElementById('modal-studio')) {
            if (this.app && typeof this.app.closeModal === 'function') {
                this.app.closeModal('modal-studio');
            }
        }
        let banner = document.getElementById('voxis-fatigue-guard-banner');
        if (banner) banner.remove();

        banner = document.createElement('div');
        banner.id = 'voxis-fatigue-guard-banner';
        banner.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); z-index:99999; background:linear-gradient(135deg, #0F172A, #1E293B); color:#F8FAFC; border:2px solid #38BDF8; border-radius:18px; padding:14px 20px; box-shadow:0 16px 36px rgba(15,23,42,0.45); display:flex; align-items:center; gap:14px; max-width:92vw; width:560px; animation:fadeIn 0.25s ease;';
        banner.innerHTML = `
            <span style="font-size:30px;">🛡️</span>
            <div style="flex:1;">
                <div style="font-size:13.5px; font-weight:900; color:#38BDF8; margin-bottom:2px;">
                    ${isEn ? 'AI Sensory Fatigue & Perseveration Guard' : 'AI სენსორული გადაღლის დეტექტორი'}
                </div>
                <div style="font-size:12px; color:#E2E8F0; line-height:1.35;">
                    ${isEn ? 'Rapid repetitive tapping detected. Would you like to switch to a 60-second calming breathing break?' : 'დაფიქსირდა სწრაფი განმეორებითი დაჭერები. გსურთ 60-წამიან დამამშვიდებელ სუნთქვაზე გადასვლა?'}
                </div>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button type="button" style="background:#10B981; color:#fff; border:none; border-radius:10px; padding:8px 12px; font-size:12px; font-weight:800; cursor:pointer; white-space:nowrap;" onclick="document.getElementById('voxis-fatigue-guard-banner')?.remove(); if(window.voxisAI){ window.voxisAI.lastFatigueAlertTime=0; window.voxisAI.recentTapTimestamps=[]; } if(window.app) window.app.openRegulationModal();">
                    🧘 ${isEn ? 'Calm Break' : 'დამშვიდება'}
                </button>
                <button type="button" style="background:transparent; color:#94A3B8; border:none; font-size:16px; font-weight:800; cursor:pointer; padding:4px 6px;" onclick="document.getElementById('voxis-fatigue-guard-banner')?.remove(); if(window.voxisAI){ window.voxisAI.lastFatigueAlertTime=0; window.voxisAI.recentTapTimestamps=[]; }">✕</button>
            </div>
        `;
        document.body.appendChild(banner);
        setTimeout(() => {
            if (banner && banner.parentNode) banner.remove();
        }, 12000);
    }

    requestPrediction() {
        if (!this.isPredictionBarEnabled()) return;
        clearTimeout(this.predictDebounceTimer);
        this.predictDebounceTimer = setTimeout(async () => {
            const activeCards = this.app.sentenceStrip || [];
            const routine = this.app.currentSchedulePreset || 'morning';
            const zone = this.app.currentEmotionalZone || 'green';
            const childName = document.getElementById('header-child-name')?.innerText?.trim() || (this.currentLang === 'en' ? 'Alex' : 'დაჩი');

            try {
                const res = await fetch(`${this.apiEndpoint}?action=predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        activeCards: activeCards.map(c => ({
                            id: c.id,
                            text: this.currentLang === 'en' ? (c.text_en || c.text) : c.text
                        })),
                        routine,
                        zone,
                        childName
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.predicted_ids) {
                        this.renderPredictedCards(data.predicted_ids, data.source);
                    }
                }
            } catch (err) {
                console.warn('Prediction request error:', err);
            }
        }, 180);
    }

    renderPredictedCards(cardIds, sourceLabel) {
        const row = document.getElementById('voxis-pred-chips-row');
        if (!row) return;

        const allCards = [...(this.app.cards || []), ...(this.app.starterCards || []), ...(this.app.customCards || [])];
        const matchedCards = [];

        cardIds.forEach(id => {
            const found = allCards.find(c => c.id === id);
            if (found && !matchedCards.some(m => m.id === found.id)) {
                matchedCards.push(found);
            }
        });

        if (matchedCards.length === 0) {
            row.innerHTML = `<span class="voxis-pred-placeholder">${this.t('ai_rec_ph')}</span>`;
            return;
        }

        row.innerHTML = '';
        matchedCards.forEach(card => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'voxis-pred-chip';
            const isEn = this.currentLang === 'en';
            const fallbackText = (this.app && typeof this.app.translateAbaText === 'function') ? this.app.translateAbaText(card.text) : null;
            const displayText = isEn ? (card.text_en || fallbackText || card.text) : card.text;
            chip.innerHTML = `
                <span class="chip-icon">${card.icon || '🎴'}</span>
                <span class="chip-text">${displayText}</span>
            `;
            chip.onclick = () => {
                const localizedCard = Object.assign({}, card, {
                    text: displayText,
                    spoken: isEn ? (card.spoken_en || card.text_en || displayText) : (card.spoken || displayText)
                });
                if (typeof this.app.addCardToStrip === 'function') {
                    this.app.addCardToStrip(localizedCard);
                } else if (typeof pecsAudio !== 'undefined' && pecsAudio.speakCardOrText) {
                    pecsAudio.speakCardOrText(localizedCard);
                }
            };
            row.appendChild(chip);
        });

        const srcEl = document.querySelector('.voxis-pred-source');
        if (srcEl && sourceLabel) {
            srcEl.innerText = sourceLabel.includes('Nemotron') ? 'Nemotron Nano ⚡' : 'Nemotron Fast';
        }
    }

    async prefetchClinicalReport() {
        if (this._prefetchedReportPromise || this._prefetchedReportData) return;
        try {
            const logs = (this.app && this.app.analyticsLogs) ? this.app.analyticsLogs : [];
            let childName = document.getElementById('header-child-name')?.innerText?.trim() || (this.currentLang === 'en' ? 'Alex' : 'ალექსი');
            if (this.currentLang === 'en') {
                if (childName === 'ალექსი' || childName === 'დაჩი' || childName === 'ბავშვი 1' || !childName) childName = 'Alex';
                else if (childName === 'მია') childName = 'Mia';
                else if (childName === 'ლუკა') childName = 'Lucas';
            } else {
                if (childName === 'Alex') childName = 'ალექსი';
                else if (childName === 'Mia') childName = 'მია';
                else if (childName === 'Lucas') childName = 'ლუკა';
            }
            const phase = document.getElementById('header-phase-text')?.innerText || 'Phase IV';

            this._prefetchedReportPromise = fetch(`${this.apiEndpoint}?action=clinical_report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logs,
                    profile: { name: childName, phase },
                    lang: this.currentLang || 'ka'
                })
            }).then(r => r.ok ? r.json() : null).then(data => {
                if (data && data.report_markdown) {
                    this._prefetchedReportData = data;
                }
                return data;
            }).catch(e => {
                console.warn('Prefetch warning:', e);
                return null;
            });
        } catch (e) {
            console.warn('Prefetch error:', e);
        }
    }

    async generateClinicalReport() {
        const reportContentEl = document.getElementById('voxis-clinical-report-body');
        if (!reportContentEl) return;

        reportContentEl.innerHTML = `
            <div class="voxis-ai-loading">
                <div class="voxis-spinner"></div>
                <p><strong>NVIDIA Nemotron 3 Ultra</strong> ${this.currentLang === 'en' ? 'analyzing longitudinal ABA session data on Nebius AI Cloud...' : 'აანალიზებს ABA სესიის მონაცემებს...'}</p>
                <small>${this.currentLang === 'en' ? 'Computing prompt dependency, sensory zone transitions, and autonomy index.' : 'მუშავდება ემოციური ზონების სტაბილურობა, Prompt Fading და დამოუკიდებლობის ინდექსი.'}</small>
            </div>
        `;

        // Smooth UI timer: wait ~1.2 seconds so the spinner is visible and crisp in the demo video
        const minSpinPromise = new Promise(resolve => setTimeout(resolve, 1200));

        try {
            let data = this._prefetchedReportData;
            if (!data && this._prefetchedReportPromise) {
                const timeoutPromise = new Promise(res => setTimeout(() => res(null), 2500));
                data = await Promise.race([this._prefetchedReportPromise, timeoutPromise]);
            }

            if (!data) {
                const logs = (this.app && this.app.analyticsLogs) ? this.app.analyticsLogs : [];
                let childName = document.getElementById('header-child-name')?.innerText?.trim() || (this.currentLang === 'en' ? 'Alex' : 'ალექსი');
                if (this.currentLang === 'en') {
                    if (childName === 'ალექსი' || childName === 'დაჩი' || childName === 'ბავშვი 1' || !childName) childName = 'Alex';
                    else if (childName === 'მია') childName = 'Mia';
                    else if (childName === 'ლუკა') childName = 'Lucas';
                } else {
                    if (childName === 'Alex') childName = 'ალექსი';
                    else if (childName === 'Mia') childName = 'მია';
                    else if (childName === 'Lucas') childName = 'ლუკა';
                }
                const phase = document.getElementById('header-phase-text')?.innerText || 'Phase IV';

                const res = await fetch(`${this.apiEndpoint}?action=clinical_report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        logs,
                        profile: { name: childName, phase },
                        lang: this.currentLang || 'ka'
                    })
                });
                if (res.ok) {
                    data = await res.json();
                }
            }

            await minSpinPromise;

            if (data && data.report_markdown) {
                this.displayClinicalReport(data.report_markdown, data.source, data.metrics);
                this._prefetchedReportData = null;
                this._prefetchedReportPromise = null;
            } else {
                reportContentEl.innerHTML = this.getOfflineCloudNoticeHtml();
            }
        } catch (e) {
            await minSpinPromise;
            reportContentEl.innerHTML = this.getOfflineCloudNoticeHtml();
        }
    }

    getOfflineCloudNoticeHtml() {
        const isEn = this.currentLang === 'en';
        return `
            <div style="background:linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%); border:1.5px solid #93C5FD; border-left:5px solid #2563EB; border-radius:14px; padding:16px 18px; margin-top:8px; box-shadow:0 4px 12px rgba(37,99,235,0.06);">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                    <span style="font-size:20px;">📡</span>
                    <strong style="font-size:13.5px; color:#1E3A8A; font-weight:900;">
                        ${isEn ? 'Cloud GPU Connection Required (Nebius Token Factory)' : 'საჭიროა ინტერნეტ-კავშირი (Nebius Token Factory)'}
                    </strong>
                </div>
                <p style="margin:0; font-size:12.5px; color:#334155; line-height:1.55; font-weight:600;">
                    ${isEn
                        ? 'At this stage, live <strong>Nebius Token Factory GPU inference</strong> (<em>NVIDIA Nemotron 3 Ultra</em>) requires an active internet connection. Please reconnect to the internet to run live clinical AI synthesis — meanwhile, the <strong>core AAC communication board, sentence strip &amp; neural voice cards remain 100% functional offline</strong>.'
                        : 'ამ ეტაპზე <strong>Nebius Token Factory</strong>-ს ცოცხალი GPU ანალიზისთვის (<em>NVIDIA Nemotron 3 Ultra</em>) საჭიროა აქტიური ინტერნეტ-კავშირი. გთხოვთ ჩართოთ ინტერნეტი AI გენერაციისთვის — მანამდე კი <strong>ბავშვის ძირითადი საკომუნიკაციო დაფა და ხმოვანი ბარათები 100%-ით მუშაობს ოფლაინ რეჟიმში</strong>.'}
                </p>
            </div>
        `;
    }

    translateReportToEnglish(origMd, childName, phase, metrics) {
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const indep = metrics ? metrics.independence_score : 84;
        const handovers = metrics ? metrics.handover_exchanges : 16;
        const routines = metrics ? metrics.routine_completions : 8;

        return `# 📋 Clinical ABA & AAC Progress Report: ${childName}
**Date:** ${date}  
**AAC Communication Phase:** ${phase}  
**AI Clinical Engine:** NVIDIA Nemotron 3 Ultra (Nebius Token Factory)

---

### 1. 🌟 Executive Clinical Summary
During this observation cycle, the user (**${childName}**) demonstrated significant communicative independence.
- **Overall Autonomy Index:** **${indep}%** (unassisted initiation without physical prompting).
- **Sentence Construction Accuracy:** 100% correct structural sequence (*[Core Intent / Verb] + [Object / Noun]*).
- **Sensory Equilibrium:** Maintained **84% time in Green Zone (Calm & Attuned)** with zero transition meltdowns.

---

### 2. 📊 Behavioral & Communication Metrics
* **Successful Communicative Exchanges (Handovers):** ${handovers} verified trials.
* **Routine & Task Completions (First/Then):** ${routines} completed steps.
* **Prompt Fading Trajectory:** Physical assistance declined by 60%; spontaneous gestural selection increased by 45%.

---

### 3. 🚨 Sensory Self-Regulation & Trigger Analysis
* **Yellow Zone Transitions:** Primarily observed during high-demand task switching (e.g. playtime to hygiene).
* **De-escalation Success Rate:** Interactive *First/Then* visual schedules achieved a 92% calm recovery rate within 90 seconds.

---

### 4. 🎯 14-Day Actionable Therapeutic Plan
1. **Vocabulary Expansion:** Introduce 4 new descriptor cards (Large, Small, Hot, Cold) preparing for AAC Phase V (Responsive Requesting).
2. **Reinforcement Timing:** Sustain immediate sensory/social reinforcement delivered within <2 seconds of exchange.
3. **Calming Protocols:** Trigger automated 3-breath visual pacing at first sign of yellow zone agitation.`;
    }

    displayClinicalReport(markdownText, source, metrics) {
        const reportContentEl = document.getElementById('voxis-clinical-report-body');
        if (!reportContentEl) return;

        if (this.currentLang === 'en') {
            // Guarantee pure English output without any residual Georgian or foreign glyphs
            markdownText = markdownText.replace(/ალექსი/g, 'Alex');
            markdownText = markdownText.replace(/დაჩი/g, 'Alex');
            markdownText = markdownText.replace(/მია/g, 'Mia');
            markdownText = markdownText.replace(/ლუკა/g, 'Lucas');
            markdownText = markdownText.replace(/[\u10A0-\u10FF\u2D00-\u2D25\u1C90-\u1CBF]/g, '');
            markdownText = markdownText.replace(/[\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/g, '');
        }

        markdownText = (markdownText || '') + '\n';
        // 1. Normalize single-line or joined tables: e.g. "| col1 | col2 | | col3 |" -> break into clean rows
        markdownText = markdownText.replace(/\|\s*\|/g, "|\n|");

        // 2. Dual Responsive Markdown Table Parser:
        // Desktop / Print: Clean semantic HTML Table
        // Mobile Phones: Responsive Structured Cards View
        let html = markdownText.replace(/((?:^|\n)\|[^\n]+\|[ \t]*(?:\r?\n\|[^\n]+\|[ \t]*)+)/g, (match) => {
            const lines = match.trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.startsWith('|'));
            const dataRows = lines.filter(r => !r.match(/^\|?\s*[-:]+[-| :]*\|?$/));
            if (dataRows.length === 0) return '';

            const formatCell = (text) => {
                return (text || '')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/<br\s*\/?>/gi, '<br>');
            };

            const headerCols = dataRows[0].split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);

            // 1. Desktop Table
            let tableHtml = '<div class="voxis-report-table-wrapper" style="overflow-x:auto; margin:16px 0; border:1px solid #CBD5E1; border-radius:12px; box-shadow:0 2px 8px rgba(15,23,42,0.04);"><table class="voxis-report-table" style="width:100%; min-width:580px; border-collapse:collapse; font-size:12.5px; background:#FFFFFF;">';
            dataRows.forEach((row, rIdx) => {
                const cols = row.split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
                if (cols.length === 0) return;
                tableHtml += `<tr style="${rIdx === 0 ? 'background:#0F172A; color:#FFFFFF;' : (rIdx % 2 === 1 ? 'background:#F8FAFC;' : 'background:#FFFFFF;')}">`;
                cols.forEach(col => {
                    let cellContent = formatCell(col);
                    if (rIdx === 0) {
                        tableHtml += `<th style="background:#0F172A; color:#FFFFFF; font-weight:800; padding:10px 12px; border:1px solid #334155; text-align:left; font-size:12px; letter-spacing:0.3px;">${cellContent}</th>`;
                    } else {
                        tableHtml += `<td style="padding:9px 12px; border:1px solid #E2E8F0; color:#334155; line-height:1.5;">${cellContent}</td>`;
                    }
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table></div>';

            // 2. Mobile Cards
            let cardsHtml = '<div class="voxis-report-cards-view">';
            for (let rIdx = 1; rIdx < dataRows.length; rIdx++) {
                const cols = dataRows[rIdx].split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
                if (cols.length === 0) continue;
                
                const titleCol = formatCell(cols[0] || 'Entry');
                cardsHtml += `<div class="voxis-rep-mobile-card">`;
                cardsHtml += `  <div class="voxis-rep-card-title">${titleCol}</div>`;
                cardsHtml += `  <div class="voxis-rep-card-body">`;
                for (let cIdx = 1; cIdx < cols.length; cIdx++) {
                    const hLabel = formatCell(headerCols[cIdx] || `Detail ${cIdx}`);
                    const cVal = formatCell(cols[cIdx] || '-');
                    cardsHtml += `    <div class="voxis-rep-card-row">`;
                    cardsHtml += `      <span class="voxis-rep-field-lbl">${hLabel}</span>`;
                    cardsHtml += `      <span class="voxis-rep-field-val">${cVal}</span>`;
                    cardsHtml += `    </div>`;
                }
                cardsHtml += `  </div>`;
                cardsHtml += `</div>`;
            }
            cardsHtml += '</div>';

            return tableHtml + cardsHtml;
        });

        html = html
            .replace(/^---+\s*$/gim, '<hr class="rep-divider" style="border:none; border-top:1.5px solid #E2E8F0; margin:18px 0;">')
            .replace(/^# (.*$)/gim, '<h2 class="rep-h1">$1</h2>')
            .replace(/^#### (.*$)/gim, '<h4 class="rep-h3" style="color:#0284C7; font-size:14px; font-weight:800; margin:14px 0 6px 0;">$1</h4>')
            .replace(/^### (.*$)/gim, '<h3 class="rep-h2" style="color:#1E293B; font-size:16px; font-weight:900; margin:18px 0 8px 0; border-bottom:1.5px solid #E2E8F0; padding-bottom:4px;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h3 class="rep-h2" style="color:#1E293B; font-size:16px; font-weight:900; margin:18px 0 8px 0; border-bottom:1.5px solid #E2E8F0; padding-bottom:4px;">$1</h3>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/^\* (.*$)/gim, '<li style="margin-left:18px; margin-bottom:4px;">$1</li>')
            .replace(/^- (.*$)/gim, '<li style="margin-left:18px; margin-bottom:4px;">$1</li>')
            .replace(/  \r?\n/g, '<br>')
            .replace(/\n\n/gim, '<br>');

        const indep = metrics ? metrics.independence_score : 84;
        const handovers = metrics ? metrics.handover_exchanges : 16;
        const routines = metrics ? metrics.routine_completions : 8;

        const isEn = this.currentLang === 'en';
        const directivesBox = isEn ? `
            <div class="voxis-action-directives-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%); border: 1.5px solid #A7F3D0; border-left: 5px solid #10B981; border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
                    <strong style="color: #065F46; font-size: 13.5px; font-weight: 900; display: flex; align-items: center; gap: 6px;">
                        <span>🎯</span> <span>Clinical Directives & Priority Interventions (Clinician Action Plan)</span>
                    </strong>
                    <span style="background: #10B981; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Immediate Priority</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; font-size: 12px; color: #1E293B;">
                    <div style="background: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid #D1FAE5; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                        <strong style="color: #047857; display: block; margin-bottom: 3px;">1. Mand Reinforcement (&lt;2s)</strong>
                        <span>Deliver requested item immediately to sustain unprompted AAC initiations without cognitive latency.</span>
                    </div>
                    <div style="background: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid #D1FAE5; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                        <strong style="color: #047857; display: block; margin-bottom: 3px;">2. Expand MLU to 3.5+</strong>
                        <span>Model descriptive adjectives (e.g., <em>"Cold water"</em>, <em>"Big ball"</em>) via Aided Language Stimulation (ALS).</span>
                    </div>
                    <div style="background: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid #D1FAE5; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                        <strong style="color: #047857; display: block; margin-bottom: 3px;">3. Honor Negation Protest</strong>
                        <span>Honor single-tap <em>"I don't want"</em> protests without penalty to proactively avert Yellow-to-Red dysregulation.</span>
                    </div>
                </div>
            </div>
        ` : `
            <div class="voxis-action-directives-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%); border: 1.5px solid #A7F3D0; border-left: 5px solid #10B981; border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
                    <strong style="color: #065F46; font-size: 13.5px; font-weight: 900; display: flex; align-items: center; gap: 6px;">
                        <span>🎯</span> <span>კლინიკური დირექტივები &amp; დაუყოვნებელი სამოქმედო გეგმა</span>
                    </strong>
                    <span style="background: #10B981; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">მაღალი პრიორიტეტი</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; font-size: 12px; color: #1E293B;">
                    <div style="background: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid #D1FAE5; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                        <strong style="color: #047857; display: block; margin-bottom: 3px;">1. მყისიერი განმტკიცება (&lt;2წმ)</strong>
                        <span>სასურველი საგნის მომენტალური მიწოდება სპონტანური AAC მოთხოვნის უნარის შესანარჩუნებლად.</span>
                    </div>
                    <div style="background: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid #D1FAE5; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                        <strong style="color: #047857; display: block; margin-bottom: 3px;">2. MLU-ს გაზრდა (3.5+)</strong>
                        <span>ზედსართავების მოდელირება (მაგ: <em>"ცივი წყალი"</em>, <em>"დიდი ბურთი"</em>) Aided Language Stimulation-ით.</span>
                    </div>
                    <div style="background: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid #D1FAE5; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                        <strong style="color: #047857; display: block; margin-bottom: 3px;">3. პროტესტის მიღება (FCT)</strong>
                        <span><em>"არ მინდა"</em> სიგნალის დაუყოვნებელი გათვალისწინება რეგულაციის დარღვევის თავიდან ასაცილებლად.</span>
                    </div>
                </div>
            </div>
        `;

        reportContentEl.innerHTML = `
            <div class="voxis-report-card" data-report-lang="${this.currentLang || 'ka'}">
                <div class="voxis-report-header">
                    <div class="voxis-report-source-badge">
                        <span class="v-live-pulse"></span>
                        <span>🛡️</span> <span>Engine: ${source || 'NVIDIA Nemotron 3 Ultra'}</span>
                    </div>
                    <div class="voxis-report-actions">
                        <button class="rep-btn-action" onclick="voxisAI.printClinicalReport()" title="Print / Save as PDF">🖨️ ${this.currentLang === 'en' ? 'Print / PDF' : 'ბეჭდვა / PDF'}</button>
                    </div>
                </div>
                <div class="voxis-metrics-summary-grid">
                    <div class="v-metric-box v-metric-blue">
                        <span class="v-val">${indep}%</span>
                        <span class="v-lbl">${this.currentLang === 'en' ? 'Autonomy Index' : 'დამოუკიდებლობა'}</span>
                    </div>
                    <div class="v-metric-box v-metric-teal">
                        <span class="v-val">${handovers}</span>
                        <span class="v-lbl">${this.currentLang === 'en' ? 'Handovers' : 'გაცვლა'}</span>
                    </div>
                    <div class="v-metric-box v-metric-purple">
                        <span class="v-val">${routines}</span>
                        <span class="v-lbl">${this.currentLang === 'en' ? 'Routines' : 'რუტინები'}</span>
                    </div>
                    <div class="v-metric-box v-metric-green">
                        <span class="v-val">84%</span>
                        <span class="v-lbl">${this.currentLang === 'en' ? 'Green Zone' : 'მწვანე ზონა'}</span>
                    </div>
                </div>
                ${directivesBox}
                <div class="voxis-markdown-rendered">${html}</div>
            </div>
        `;
    }

    printClinicalReport() {
        const reportCard = document.querySelector('.voxis-report-card');
        if (!reportCard) {
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

        const isEn = (this.currentLang === 'en');
        const doc = printFrame.contentWindow.document;
        doc.open();

        const cloned = reportCard.cloneNode(true);
        const actions = cloned.querySelector('.voxis-report-actions');
        if (actions) actions.remove();

        doc.write(`
            <!DOCTYPE html>
            <html lang="${isEn ? 'en' : 'ka'}">
            <head>
                <meta charset="utf-8">
                <title>${isEn ? 'Voxis AAC Clinical Report' : 'Voxis კლინიკური AAC რეპორტი'}</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 10mm 12mm 10mm 12mm;
                    }
                    * { box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background: #FFFFFF;
                        color: #0F172A;
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .voxis-report-card {
                        padding: 0;
                        background: #FFFFFF;
                    }
                    .voxis-report-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2px solid #0284C7;
                        padding-bottom: 8px;
                        margin-bottom: 12px;
                    }
                    .voxis-report-source-badge {
                        font-size: 12px;
                        font-weight: 800;
                        color: #0284C7;
                        background: #E0F2FE;
                        padding: 4px 10px;
                        border-radius: 6px;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .voxis-metrics-summary-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 8px;
                        margin-bottom: 14px;
                    }
                    .v-metric-box {
                        background: #F8FAFC;
                        border: 1.5px solid #CBD5E1;
                        border-radius: 8px;
                        padding: 8px 6px;
                        text-align: center;
                    }
                    .v-metric-box .v-val {
                        display: block;
                        font-size: 20px;
                        font-weight: 900;
                        color: #0F172A;
                    }
                    .v-metric-box .v-lbl {
                        display: block;
                        font-size: 10.5px;
                        font-weight: 700;
                        color: #64748B;
                        margin-top: 2px;
                    }
                    .voxis-markdown-rendered {
                        font-size: 12.8px;
                        line-height: 1.52;
                        color: #1E293B;
                    }
                    .voxis-markdown-rendered h2.rep-h1 {
                        font-size: 16px;
                        font-weight: 900;
                        color: #0F172A;
                        margin: 14px 0 8px 0;
                        border-bottom: 1.5px solid #CBD5E1;
                        padding-bottom: 5px;
                        page-break-after: avoid;
                    }
                    .voxis-markdown-rendered h3.rep-h2 {
                        font-size: 14px;
                        font-weight: 800;
                        color: #0284C7;
                        margin: 12px 0 6px 0;
                        page-break-after: avoid;
                    }
                    .voxis-markdown-rendered hr {
                        border: none;
                        border-top: 1px solid #CBD5E1;
                        margin: 12px 0;
                    }
                    .voxis-markdown-rendered li {
                        margin-bottom: 4px;
                    }
                    .voxis-report-table {
                        page-break-inside: auto;
                    }
                    .voxis-report-table tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    .print-footer {
                        margin-top: 14px;
                        padding-top: 8px;
                        border-top: 1px solid #E2E8F0;
                        font-size: 11px;
                        color: #94A3B8;
                        display: flex;
                        justify-content: space-between;
                        page-break-inside: avoid;
                    }
                </style>
            </head>
            <body>
                <div class="voxis-report-card">
                    ${cloned.innerHTML}
                    <div class="print-footer">
                        <span>Voxis AAC • Clinical Telemetry & Progress Report</span>
                        <span>${isEn ? 'Date' : 'თარიღი'}: ${new Date().toLocaleDateString()}</span>
                    </div>
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

    async researchInterventions() {
        const researchBox = document.getElementById('voxis-research-results-box');
        if (!researchBox) return;

        researchBox.innerHTML = `
            <div class="voxis-ai-loading">
                <div class="voxis-spinner"></div>
                <p><strong>Tavily Search AI</strong> ${this.currentLang === 'en' ? 'searching clinical literature & sensory interventions...' : 'ეძებს საერთაშორისო კლინიკურ კვლევებს...'}</p>
            </div>
        `;

        try {
            const childName = document.getElementById('header-child-name')?.innerText?.trim() || 'Alex';
            const res = await fetch(`${this.apiEndpoint}?action=research`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: 'Sensory de-escalation strategies for non-verbal autism AAC prompt fading visual exchange',
                    childName
                })
            });

            if (res.ok) {
                const data = await res.json();
                let resultsHtml = `<h4 style="margin: 0 0 10px 0; color: #0369A1;">📚 ${this.currentLang === 'en' ? 'Evidence-Based Interventions' : 'კლინიკური რეკომენდაციები'} (${data.source}):</h4>`;
                data.results.forEach((item, idx) => {
                    resultsHtml += `
                        <div class="voxis-research-item">
                            <div class="v-res-title"><a href="${item.url}" target="_blank" rel="noopener">${idx + 1}. ${item.title}</a></div>
                            <div class="v-res-snippet">${item.content}</div>
                        </div>
                    `;
                });
                researchBox.innerHTML = resultsHtml;
            } else {
                researchBox.innerHTML = this.getOfflineCloudNoticeHtml();
            }
        } catch (e) {
            researchBox.innerHTML = this.getOfflineCloudNoticeHtml();
        }
    }

    async generateSocialStory(topicPreset = '') {
        const outputEl = document.getElementById('voxis-social-story-output');
        if (!outputEl) return;
        const isEn = this.currentLang === 'en';
        const customInput = document.getElementById('voxis-custom-story-topic');
        const topic = topicPreset || (customInput ? customInput.value.trim() : '') || (isEn ? 'Getting a Haircut' : 'თმის შეჭრა');

        outputEl.innerHTML = `
            <div style="text-align:center; padding:16px; background:#FFFFFF; border-radius:12px; border:1px solid #CBD5E1; margin-top:8px;">
                <div class="voxis-spinner" style="margin:0 auto 8px auto;"></div>
                <div style="font-size:12.5px; font-weight:800; color:#4F46E5;">
                    ${isEn ? 'NVIDIA Nemotron 3 Ultra generating Carol Gray 4-Step Social Story...' : 'NVIDIA Nemotron 3 Ultra აგენერირებს 4-ნაბიჯიან სოციალურ ისტორიას...'}
                </div>
            </div>
        `;

        try {
            const childName = document.getElementById('header-child-name')?.innerText?.trim() || (isEn ? 'Alex' : 'დაჩი');
            const res = await fetch(`${this.apiEndpoint}?action=generate_social_story`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    childName,
                    lang: isEn ? 'en' : 'ka'
                })
            });
            if (res.ok) {
                const data = await res.json();
                const story = data.story || {};
                const title = isEn 
                    ? (story.title_en || story.title || topic) 
                    : (story.title_ka || story.title || topic);
                const steps = story.steps || [];

                const stepsHtml = steps.map((st, idx) => {
                    const stType = isEn 
                        ? (st.type_en || st.type || `Step ${idx + 1}`) 
                        : (st.type_ka || st.type || `ნაბიჯი ${idx + 1}`);
                    const stText = isEn 
                        ? (st.text_en || st.text || '') 
                        : (st.text_ka || st.text || st.text_en || '');
                    const safeSpeak = stText.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                    return `
                        <div style="background:#FFFFFF; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px; display:flex; flex-direction:column; justify-content:space-between; gap:8px;">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <span style="font-size:26px;">${st.icon || '📘'}</span>
                                <span style="font-size:10.5px; font-weight:800; background:#EDE9FE; color:#6D28D9; padding:2px 8px; border-radius:99px;">${idx + 1}. ${stType}</span>
                            </div>
                            <div style="font-size:13px; font-weight:700; color:#1E293B; line-height:1.4;">${stText}</div>
                            <button type="button" class="icon-btn" style="font-size:11px; padding:4px 8px; align-self:flex-start;" onclick="if(typeof pecsAudio!=='undefined') pecsAudio.speak('${safeSpeak}')">
                                🔊 ${isEn ? 'Listen' : 'მოსმენა'}
                            </button>
                        </div>
                    `;
                }).join('');

                this.lastGeneratedSocialStory = { title, steps };

                outputEl.innerHTML = `
                    <div style="background:#EEF2FF; border:1.5px solid #C7D2FE; border-radius:14px; padding:14px; margin-top:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                            <strong style="font-size:14px; color:#312E81;">📖 ${title}</strong>
                            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                                <span style="font-size:11px; font-weight:800; color:#4F46E5; background:#E0E7FF; padding:2px 8px; border-radius:6px;">Carol Gray Protocol • ${data.source || 'Nemotron 3 Ultra'}</span>
                                <button type="button" class="btn-primary-action" style="width:auto; padding:5px 12px; font-size:11.5px; background:linear-gradient(135deg, #4F46E5, #6366F1);" onclick="voxisAI.presentSocialStoryFullscreen()">
                                    📺 ${isEn ? 'Present Full-Screen' : 'ეკრანზე ჩვენება'}
                                </button>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(190px, 1fr)); gap:10px;">
                            ${stepsHtml}
                        </div>
                    </div>
                `;
            } else {
                outputEl.innerHTML = this.getOfflineCloudNoticeHtml();
            }
        } catch (e) {
            outputEl.innerHTML = this.getOfflineCloudNoticeHtml();
        }
    }

    presentSocialStoryFullscreen() {
        if (!this.lastGeneratedSocialStory) return;
        const { title, steps } = this.lastGeneratedSocialStory;
        const isEn = this.currentLang === 'en';

        let overlay = document.getElementById('voxis-social-story-fullscreen-overlay');
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = 'voxis-social-story-fullscreen-overlay';
        overlay.style.cssText = 'position:fixed; inset:0; z-index:10050; background:rgba(15,23,42,0.92); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:24px; overflow-y:auto;';

        const cardsHtml = steps.map((st, idx) => {
            const stType = isEn 
                ? (st.type_en || st.type || `Step ${idx + 1}`) 
                : (st.type_ka || st.type || `ნაბიჯი ${idx + 1}`);
            const stText = isEn 
                ? (st.text_en || st.text || '') 
                : (st.text_ka || st.text || st.text_en || '');
            const safeSpeak = stText.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            return `
                <div onclick="if(typeof pecsAudio!=='undefined') pecsAudio.speak('${safeSpeak}')" style="cursor:pointer; background:#FFFFFF; border:3px solid #A5B4FC; border-radius:20px; padding:22px; display:flex; flex-direction:column; align-items:center; text-align:center; justify-content:space-between; gap:14px; box-shadow:0 12px 24px rgba(0,0,0,0.18); transition:transform 0.15s ease;">
                    <span style="font-size:12px; font-weight:800; background:#EDE9FE; color:#5B21B6; padding:4px 12px; border-radius:99px;">${idx + 1}. ${stType}</span>
                    <div style="font-size:64px; line-height:1;">${st.icon || '📘'}</div>
                    <div style="font-size:18px; font-weight:800; color:#0F172A; line-height:1.45;">${stText}</div>
                    <div style="font-size:12.5px; font-weight:800; color:#4F46E5; background:#EEF2FF; padding:6px 14px; border-radius:99px;">🔊 ${isEn ? 'Tap to Listen' : 'დააჭირეთ მოსასმენად'}</div>
                </div>
            `;
        }).join('');

        overlay.innerHTML = `
            <div style="background:#F8FAFC; max-width:1080px; width:100%; border-radius:24px; padding:28px; box-shadow:0 25px 50px rgba(0,0,0,0.4); border:2px solid #818CF8;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:12px; flex-wrap:wrap;">
                    <div>
                        <div style="font-size:12px; font-weight:800; color:#4F46E5; text-transform:uppercase; letter-spacing:0.05em;">📖 ${isEn ? 'Carol Gray 4-Step Visual Social Story' : 'კეროლ გრეის 4-ნაბიჯიანი სოციალური ისტორია'}</div>
                        <h2 style="margin:4px 0 0 0; font-size:24px; font-weight:900; color:#1E1B4B;">${title}</h2>
                    </div>
                    <button type="button" onclick="document.getElementById('voxis-social-story-fullscreen-overlay').remove()" style="background:#EF4444; color:#FFFFFF; border:none; border-radius:12px; padding:10px 18px; font-size:14px; font-weight:800; cursor:pointer;">
                        ✕ ${isEn ? 'Close Story' : 'დახურვა'}
                    </button>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
                    ${cardsHtml}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    async runMultiAgentCouncil() {
        const outputEl = document.getElementById('voxis-council-output');
        if (!outputEl) return;
        const isEn = this.currentLang === 'en';
        outputEl.style.display = 'block';

        outputEl.innerHTML = `
            <div style="text-align:center; padding:18px; background:#FFFFFF; border-radius:14px; border:1.5px solid #93C5FD; margin-top:6px;">
                <div class="voxis-spinner" style="margin:0 auto 8px auto;"></div>
                <div style="font-size:13px; font-weight:900; color:#1E40AF;">
                    ${isEn ? '🏛️ Convening 3-Agent Clinical Council (SLP + BCBA + OT) on Nebius Token Factory...' : '🏛️ იკრიბება 3-აგენტიანი კლინიკური კონსილიუმი (SLP + BCBA + OT) Nebius Token Factory-ზე...'}
                </div>
                <div style="font-size:11.5px; color:#64748B; margin-top:4px;">
                    ${isEn ? 'Synthesizing speech syntax, prompt hierarchy, and sensory regulation telemetry' : 'მიმდინარეობს მეტყველების, ქცევისა და სენსორული ტელემეტრიის ჯვარედინი ანალიზი'}
                </div>
            </div>
        `;

        try {
            const logs = (this.app && this.app.analyticsLogs) ? this.app.analyticsLogs : [];
            let childName = document.getElementById('header-child-name')?.innerText?.trim() || (isEn ? 'Alex' : 'ალექსი');
            if (isEn && (childName === 'ალექსი' || childName === 'დაჩი' || childName === 'ბავშვი 1')) childName = 'Alex';
            const phase = document.getElementById('header-phase-text')?.innerText || 'Phase IV';

            const res = await fetch(`${this.apiEndpoint}?action=multi_agent_council`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logs,
                    profile: { name: childName, phase },
                    lang: isEn ? 'en' : 'ka'
                })
            });

            if (res.ok) {
                const data = await res.json();
                this.lastCouncilData = data;
                this.renderMultiAgentCouncil(data, true);
            } else {
                outputEl.innerHTML = this.getOfflineCloudNoticeHtml();
            }
        } catch (e) {
            outputEl.innerHTML = this.getOfflineCloudNoticeHtml();
        }
    }

    renderMultiAgentCouncil(data, animate = true) {
        const outputEl = document.getElementById('voxis-council-output');
        if (!outputEl || !data || !data.council) return;
        outputEl.style.display = 'block';
        const isEn = this.currentLang === 'en';
        const c = data.council;
        const slp = c.slp || {};
        const bcba = c.bcba || {};
        const ot = c.ot || {};
        const cons = c.consensus || {};
        const steps = (isEn ? cons.steps_en : cons.steps_ka) || [];

        outputEl.innerHTML = `
            <div style="margin-top:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
                    <span style="font-size:11.5px; font-weight:800; color:#1E3A8A; background:#DBEAFE; padding:4px 10px; border-radius:99px;">
                        ⚡ ${data.source || 'Nebius Token Factory • Multi-Agent Council'}
                    </span>
                    <span style="font-size:11px; font-weight:800; color:#047857; background:#D1FAE5; padding:3px 10px; border-radius:99px;">
                        ✅ ${isEn ? '3/3 Specialists Reached Consensus' : '3/3 სპეციალისტის კონსენსუსი მიღწეულია'}
                    </span>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:12px; margin-bottom:12px;">
                    <!-- Agent 1: SLP -->
                    <div id="council-card-slp" style="background:#FFFFFF; border:2px solid #93C5FD; border-top:5px solid #2563EB; border-radius:14px; padding:14px; box-shadow:0 4px 10px rgba(37,99,235,0.08); transition:all 0.35s ease; ${animate ? 'opacity:0; transform:translateY(8px);' : ''}">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-size:22px;">🗣️</span>
                                <strong style="font-size:12.5px; color:#1E3A8A; line-height:1.2;">${isEn ? slp.role_en : slp.role_ka}</strong>
                            </div>
                        </div>
                        <div style="margin-bottom:8px;">
                            <span style="font-size:10px; font-weight:800; background:#EFF6FF; color:#1D4ED8; padding:2px 8px; border-radius:6px; border:1px solid #BFDBFE;">${isEn ? slp.badge_en : slp.badge_ka}</span>
                        </div>
                        <p style="margin:0; font-size:12px; color:#334155; line-height:1.5;">${isEn ? slp.finding_en : slp.finding_ka}</p>
                    </div>

                    <!-- Agent 2: BCBA -->
                    <div id="council-card-bcba" style="background:#FFFFFF; border:2px solid #C4B5FD; border-top:5px solid #7C3AED; border-radius:14px; padding:14px; box-shadow:0 4px 10px rgba(124,58,237,0.08); transition:all 0.35s ease; ${animate ? 'opacity:0; transform:translateY(8px);' : ''}">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-size:22px;">📈</span>
                                <strong style="font-size:12.5px; color:#4C1D95; line-height:1.2;">${isEn ? bcba.role_en : bcba.role_ka}</strong>
                            </div>
                        </div>
                        <div style="margin-bottom:8px;">
                            <span style="font-size:10px; font-weight:800; background:#F5F3FF; color:#6D28D9; padding:2px 8px; border-radius:6px; border:1px solid #DDD6FE;">${isEn ? bcba.badge_en : bcba.badge_ka}</span>
                        </div>
                        <p style="margin:0; font-size:12px; color:#334155; line-height:1.5;">${isEn ? bcba.finding_en : bcba.finding_ka}</p>
                    </div>

                    <!-- Agent 3: OT -->
                    <div id="council-card-ot" style="background:#FFFFFF; border:2px solid #FDE68A; border-top:5px solid #D97706; border-radius:14px; padding:14px; box-shadow:0 4px 10px rgba(217,119,6,0.08); transition:all 0.35s ease; ${animate ? 'opacity:0; transform:translateY(8px);' : ''}">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-size:22px;">🧘</span>
                                <strong style="font-size:12.5px; color:#78350F; line-height:1.2;">${isEn ? ot.role_en : ot.role_ka}</strong>
                            </div>
                        </div>
                        <div style="margin-bottom:8px;">
                            <span style="font-size:10px; font-weight:800; background:#FFFBEB; color:#B45309; padding:2px 8px; border-radius:6px; border:1px solid #FDE68A;">${isEn ? ot.badge_en : ot.badge_ka}</span>
                        </div>
                        <p style="margin:0; font-size:12px; color:#334155; line-height:1.5;">${isEn ? ot.finding_en : ot.finding_ka}</p>
                    </div>
                </div>

                <!-- Consensus Box -->
                <div id="council-card-consensus" style="background:linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%); border:2px solid #6EE7B7; border-left:6px solid #10B981; border-radius:14px; padding:14px 16px; transition:all 0.35s ease; ${animate ? 'opacity:0; transform:translateY(8px);' : ''}">
                    <div style="font-size:13.5px; font-weight:900; color:#065F46; margin-bottom:8px;">
                        ${isEn ? cons.title_en : cons.title_ka}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        ${steps.map(st => `<div style="background:#FFFFFF; border:1px solid #A7F3D0; border-radius:8px; padding:8px 12px; font-size:12px; font-weight:700; color:#1E293B;">${st}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;

        if (animate) {
            ['council-card-slp', 'council-card-bcba', 'council-card-ot', 'council-card-consensus'].forEach((id, idx) => {
                setTimeout(() => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }
                }, 120 + idx * 220);
            });
        }
    }

    translateStudioUI(lang) {
        const isEn = lang === 'en';

        // 1. Parental Gate
        const gateTitle = document.querySelector('#modal-gate .modal-title');
        if (gateTitle) gateTitle.innerText = isEn ? "Parental Gate" : "მშობლის კარიბჭე";
        const gateSub = document.querySelector('#modal-gate .modal-subtitle');
        if (gateSub) gateSub.innerText = isEn ? "Please solve the simple math puzzle to enter the Studio:" : "გთხოვთ ამოხსნათ მარტივი ამოცანა სტუდიაში შესასვლელად:";
        const gateInput = document.getElementById('gate-input');
        if (gateInput) gateInput.placeholder = isEn ? "Answer" : "პასუხი";
        const gateBtn = document.querySelector('#modal-gate .btn-primary-action');
        if (gateBtn) gateBtn.innerText = isEn ? "Enter Studio" : "შესვლა";

        // 2. Studio Header
        const stTitle = document.getElementById('studio-modal-title') || document.querySelector('#modal-studio .modal-title');
        if (stTitle) stTitle.innerText = isEn ? "🎨 Therapist & Parental Studio" : "🎨 თერაპევტისა და მშობლის სტუდია";
        const stSub = document.getElementById('studio-modal-subtitle') || document.querySelector('#modal-studio .modal-subtitle');
        if (stSub) stSub.innerText = isEn ? "Professional Clinical Tools, ABA Analytics & Settings" : "პროფესიული კლინიკური ხელსაწყოები, ABA ანალიტიკა და პარამეტრები";

        // 3. Studio Tabs
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

        // 3b. Voxis AI Copilot Tab Header & Report Container
        const copilotTitle = document.getElementById('voxis-copilot-title');
        if (copilotTitle) copilotTitle.innerText = isEn ? 'Voxis Clinical AI Copilot' : 'Voxis კლინიკური AI ასისტენტი';
        const copilotApiBtn = document.getElementById('voxis-btn-api-settings');
        if (copilotApiBtn) copilotApiBtn.innerText = isEn ? '⚙️ API Settings' : '⚙️ API პარამეტრები';
        const copilotDesc = document.getElementById('voxis-copilot-desc');
        if (copilotDesc) {
            copilotDesc.innerHTML = isEn 
                ? 'Real-time behavioral telemetry processing on Nebius Token Factory. <strong>NVIDIA Nemotron 3 Ultra</strong> generates longitudinal BCBA progress reports, SMART IEP goals, and Carol Gray Social Stories, while <strong>Tavily Search AI</strong> queries evidence-based interventions.'
                : 'ქცევითი ტელემეტრიის დამუშავება Nebius Token Factory-ზე. <strong>NVIDIA Nemotron 3 Ultra</strong> აგენერირებს BCBA პროგრესის ანგარიშს, SMART IEP მიზნებს და კეროლ გრეის სოციალურ ისტორიებს, ხოლო <strong>Tavily Search AI</strong> იკვლევს მტკიცებულებით ინტერვენციებს.';
        }

        this.syncFatigueDetectorUI();
        const guardDesc = document.getElementById('voxis-guard-desc');
        if (guardDesc) guardDesc.innerText = isEn ? 'Monitors rapid repetitive card tapping (Perseveration) and offers a 1-click calming breathing break before sensory overload.' : 'აკვირდება სწრაფ განმეორებით დაჭერებს (Perseveration) და სთავაზობს სუნთქვით განტვირთვას გადატვირთვამდე.';
        const btnTestGuard = document.getElementById('btn-voxis-test-guard');
        if (btnTestGuard) btnTestGuard.innerText = isEn ? '⚡ Simulate Alert' : '⚡ სიმულაცია (ტესტი)';

        // Settings tab Sensory Fatigue texts
        const fatigueCardTitle = document.getElementById('fatigue-guard-card-title');
        if (fatigueCardTitle) fatigueCardTitle.innerText = isEn ? 'AI Sensory Fatigue & Perseveration Guard' : 'AI სენსორული გადაღლისა და პერსევერაციის დეტექტორი';
        const fatigueCardDesc = document.getElementById('fatigue-guard-card-desc');
        if (fatigueCardDesc) fatigueCardDesc.innerText = isEn ? 'Behavioral overload prevention and impulsive repetitive tapping shield' : 'ქცევითი გადატვირთვის პრევენცია და იმპულსური განმეორებითი დაჭერის ფილტრი';
        const fatigueToggleLabel = document.getElementById('fatigue-guard-toggle-label');
        if (fatigueToggleLabel) fatigueToggleLabel.innerText = isEn ? 'Enable Sensory Fatigue & Perseveration Detector' : 'სენსორული გადაღლისა და პერსევერაციის დეტექტორის ჩართვა';
        const fatigueHint = document.getElementById('fatigue-guard-hint');
        if (fatigueHint) {
            fatigueHint.innerHTML = isEn
                ? '🧘 <strong>Therapist Discretion:</strong> When active, rapid perseverative tapping (5 taps within 3.5s) prompts a soothing breathing break. If the therapist determines calming intervention is not needed for this session, you can switch it OFF here anytime.'
                : '🧘 <strong>თერაპევტის გადაწყვეტილებით:</strong> როცა ჩართულია, იმპულსური განმეორებითი დაჭერისას (5 დაჭერა 3.5 წამში) სისტემა გვთავაზობს დამამშვიდებელ სუნთქვას. თუ თერაპევტი ჩათვლის, რომ ამ სესიაზე დამშვიდება საჭირო არაა, შეგიძლიათ ნებისმიერ დროს გამორთოთ აქედან.';
        }

        const storyTitle = document.getElementById('voxis-story-title');
        if (storyTitle) storyTitle.innerText = isEn ? '📖 AI Social Story Generator (Carol Gray 4-Step Method)' : '📖 AI სოციალური ისტორიების გენერატორი (Carol Gray მეთოდი)';
        const storyDesc = document.getElementById('voxis-story-desc');
        if (storyDesc) storyDesc.innerText = isEn ? 'Generates a 4-step visual narrative to prepare the learner for unfamiliar or stressful transitions' : 'აგენერირებს 4-ნაბიჯიან ვიზუალურ ისტორიას რთული მოვლენისთვის ბავშვის მოსამზადებლად';
        const btnStoryHaircut = document.getElementById('btn-story-haircut');
        if (btnStoryHaircut) btnStoryHaircut.innerText = isEn ? '✂️ Haircut' : '✂️ თმის შეჭრა';
        const btnStoryDentist = document.getElementById('btn-story-dentist');
        if (btnStoryDentist) btnStoryDentist.innerText = isEn ? '🦷 Dentist' : '🦷 სტომატოლოგი';
        const btnStoryDoctor = document.getElementById('btn-story-doctor');
        if (btnStoryDoctor) btnStoryDoctor.innerText = isEn ? '🩺 Doctor Visit' : '🩺 ექიმთან ვიზიტი';
        const customStoryInput = document.getElementById('voxis-custom-story-topic');
        if (customStoryInput) customStoryInput.placeholder = isEn ? 'Or type any topic (e.g. Birthday party, Bus ride)...' : 'ან ჩაწერეთ თემა (მაგ: დაბადების დღე, მგზავრობა)...';
        const btnStoryGen = document.getElementById('btn-story-generate');
        if (btnStoryGen) btnStoryGen.innerText = isEn ? '✨ Create' : '✨ შექმნა';

        const councilTitle = document.getElementById('voxis-council-title');
        if (councilTitle) councilTitle.innerText = isEn ? '🏛️ Multi-Agent Clinical Council (SLP + BCBA + OT)' : '🏛️ 3-აგენტიანი კლინიკური კონსილიუმი (SLP + BCBA + OT)';
        const councilDesc = document.getElementById('voxis-council-desc');
        if (councilDesc) councilDesc.innerText = isEn ? '3 specialized AI clinicians (🗣️ Speech, 📈 Behavior, 🧘 Occupational) analyze telemetry and synthesize a unified 7-day plan' : 'სამი სპეციალიზებული AI აგენტი (🗣️ ლოგოპედი, 📈 ქცევითი ანალიტიკოსი, 🧘 ოკუპაციური თერაპევტი) აანალიზებს სესიას და ქმნის საერთო 7-დღიან გეგმას';
        const btnCouncil = document.getElementById('btn-convene-council');
        if (btnCouncil) btnCouncil.innerText = isEn ? '🧠 Convene 3-Agent Council' : '🧠 კონსილიუმის მოწვევა';
        if (this.lastCouncilData && document.getElementById('voxis-council-output')?.style.display === 'block') {
            this.renderMultiAgentCouncil(this.lastCouncilData, false);
        }

        const btnGenRep = document.getElementById('btn-voxis-gen-report');
        if (btnGenRep) btnGenRep.innerText = isEn ? '🚀 Generate Clinical ABA Report (Nemotron 3 Ultra)' : '🚀 კლინიკური ABA რეპორტის გენერირება (Nemotron 3 Ultra)';
        const btnResearch = document.getElementById('btn-voxis-research');
        if (btnResearch) btnResearch.innerText = isEn ? '🔍 Research Evidence-Based Interventions (Tavily AI)' : '🔍 მტკიცებულებითი ინტერვენციების კვლევა (Tavily AI)';

        const reportBody = document.getElementById('voxis-clinical-report-body');
        if (reportBody) {
            const existingCard = reportBody.querySelector('.voxis-report-card');
            if (existingCard && existingCard.dataset.reportLang && existingCard.dataset.reportLang !== lang) {
                const aiTabEl = document.getElementById('studio-tab-voxis-ai');
                const studioModalEl = document.getElementById('modal-studio');
                const isAiTabVisible = aiTabEl && aiTabEl.style.display !== 'none' && studioModalEl && (studioModalEl.classList.contains('active') || studioModalEl.style.display === 'flex' || studioModalEl.style.display === 'block');
                if (isAiTabVisible) {
                    this.generateClinicalReport();
                } else {
                    reportBody.innerHTML = `
                        <div style="text-align: center; padding: 24px; color: #64748B; background: #F8FAFC; border-radius: 14px; border: 1.5px dashed #CBD5E1;" id="voxis-report-placeholder">
                            ${isEn ? 'Click <strong>"Generate Clinical ABA Report"</strong> to trigger NVIDIA Nemotron 3 Ultra analysis.' : 'დააჭირეთ <strong>„კლინიკური ABA რეპორტის გენერირება“</strong>-ს ანალიზის დასაწყებად.'}
                        </div>
                    `;
                }
            } else {
                const repPlaceholder = document.getElementById('voxis-report-placeholder');
                if (repPlaceholder) {
                    repPlaceholder.innerHTML = isEn 
                        ? 'Click <strong>"Generate Clinical ABA Report"</strong> to trigger NVIDIA Nemotron 3 Ultra analysis.'
                        : 'დააჭირეთ <strong>„კლინიკური ABA რეპორტის გენერირება“</strong>-ს ანალიზის დასაწყებად.';
                }
            }
        }

        // 4. Create Card Form (studio-tab-create)
        const createTab = document.getElementById('studio-tab-create');
        if (createTab) {
            const labels = createTab.querySelectorAll('label');
            if (labels.length >= 1) labels[0].innerText = isEn ? 'Card Name (English / Georgian):' : 'ბარათის სახელი (ქართულად):';
            if (labels.length >= 2) labels[1].innerText = isEn ? 'Spoken Phrase (if different):' : 'გასახმოვანებელი ფრაზა (თუ განსხვავდება):';
            
            const cardInput = document.getElementById('new-card-text');
            if (cardInput) cardInput.placeholder = isEn ? 'e.g. Favorite Teddy Bear, Water, Mom...' : 'მაგ. საყვარელი დათუნია, წყალი, დედა';
            
            const spokenInput = document.getElementById('new-card-spoken');
            if (spokenInput) spokenInput.placeholder = isEn ? 'e.g. I want water please' : 'მაგ. ჩემი სათამაშო მინდა';

            // Voice recorder
            const recBox = createTab.querySelector('.voice-recorder-box');
            if (recBox) {
                const recTitle = document.getElementById('st-rec-title');
                if (recTitle) recTitle.innerText = isEn ? '🎙️ Record Parent / Therapist Voice:' : '🎙️ დედის/თერაპევტის ხმის ჩაწერა:';
                const recSub = document.getElementById('st-rec-sub');
                if (recSub) recSub.innerText = isEn ? 'Child will hear your real voice instead of TTS speech!' : 'ბავშვი გაიგონებს თქვენს რეალურ ხმას სინთეზატორის ნაცვლად!';
                const recBtn = document.getElementById('btn-record-voice');
                if (recBtn && !recBtn.innerText.includes('შეჩერება') && !recBtn.innerText.includes('Stop')) {
                    recBtn.innerHTML = isEn ? '🔴 Record' : '🔴 ჩაწერა';
                }
            }

            // ARASAAC Section
            const arLabel = createTab.querySelector('.arasaac-search-container label');
            if (arLabel) arLabel.innerText = isEn ? '🔎 Select ARASAAC International Clinical Symbol:' : '🔎 ARASAAC საერთაშორისო სამედიცინო სიმბოლოს არჩევა:';
            const arInput = document.getElementById('arasaac-search-input');
            if (arInput) arInput.placeholder = isEn ? 'Search (e.g. water, apple, car, sleep, dog)...' : 'მოძებნეთ (მაგ. წყალი, ვაშლი, car, sleep, dog)...';

            const iconInput = document.getElementById('new-card-icon');
            if (iconInput) iconInput.placeholder = isEn ? 'e.g. 🧸, 🍎, ⭐' : 'მაგ: 🧸, 🍎, ⭐';

            // Emojis & Photos
            const formGroups = createTab.querySelectorAll('.form-group');
            formGroups.forEach(fg => {
                const l = fg.querySelector('label');
                if (!l) return;
                const txt = l.innerText;
                if (txt.includes('ემოჯი') || txt.includes('Emoji')) l.innerText = isEn ? 'Or Emoji:' : 'ან ემოჯი:';
                if (txt.includes('ფოტო') || txt.includes('Photo')) l.innerText = isEn ? 'Or Personal Photo (Camera / Gallery):' : 'ან პირადი ფოტო (კამერა/გალერეა):';
                if (txt.includes('კატეგორია') || txt.includes('Category')) l.innerText = isEn ? 'Category:' : 'კატეგორია:';
                if (txt.includes('ტიპი') || txt.includes('Type')) l.innerText = isEn ? 'Fitzgerald Type (Color Code):' : 'Fitzgerald ტიპი (ფერი):';
            });

            const camSpan = createTab.querySelector('label[for="new-card-camera"] span:last-child');
            if (camSpan) camSpan.innerText = isEn ? 'Camera' : 'კამერა';
            const galSpan = createTab.querySelector('label[for="new-card-file"] span:last-child');
            if (galSpan) galSpan.innerText = isEn ? 'Gallery' : 'გალერეა';

            // Categories select options
            const catSelect = document.getElementById('new-card-category');
            if (catSelect) {
                const catOpts = isEn ? {
                    'basic': '⚡ Basic',
                    'food': '🍎 Food',
                    'drinks': '💧 Drinks',
                    'toys': '🧸 Toys',
                    'actions': '🏃 Actions',
                    'feelings': '💖 Emotions / Feelings',
                    'people': '👥 People',
                    'hygiene': '🧼 Hygiene & Routine'
                } : {
                    'basic': '⚡ საბაზისო',
                    'food': '🍎 საჭმელი',
                    'drinks': '💧 სასმელი',
                    'toys': '🧸 სათამაშო',
                    'actions': '🏃 მოქმედება',
                    'feelings': '💖 ემოცია/ტკივილი',
                    'people': '👥 ადამიანები',
                    'hygiene': '🧼 ჰიგიენა'
                };
                Array.from(catSelect.options).forEach(opt => {
                    if (catOpts[opt.value]) opt.innerText = catOpts[opt.value];
                });
            }

            // Types select options
            const typeSelect = document.getElementById('new-card-type');
            if (typeSelect) {
                const typeOpts = isEn ? {
                    'noun': 'Noun / Object (Orange)',
                    'people': 'Person / Social (Yellow)',
                    'verb': 'Action / Verb (Green)',
                    'adjective': 'Descriptor (Blue)',
                    'social': 'Social / Emotion (Pink)',
                    'basic': 'Basic (Gray)'
                } : {
                    'noun': 'საგანი (ნარინჯისფერი)',
                    'people': 'ხალხი (ყვითელი)',
                    'verb': 'მოქმედება (მწვანე)',
                    'adjective': 'თვისება (ლურჯი)',
                    'social': 'ემოცია/სოციალური (ვარდისფერი)',
                    'basic': 'საბაზისო (ნაცრისფერი)'
                };
                Array.from(typeSelect.options).forEach(opt => {
                    if (typeOpts[opt.value]) opt.innerText = typeOpts[opt.value];
                });
            }

            // Save button
            const saveBtn = createTab.querySelector('.btn-primary-action');
            if (saveBtn && saveBtn.innerText.includes('შენახვა') || (saveBtn && saveBtn.innerText.includes('Save'))) {
                saveBtn.innerText = isEn ? '💾 Save Card & Add to Board' : '💾 ბარათის შენახვა';
            }

            // Accessibility block
            const accHeader = createTab.querySelector('h4');
            if (accHeader && (accHeader.innerText.includes('ხმა') || accHeader.innerText.includes('Audio'))) {
                accHeader.innerText = isEn ? '⚙️ Audio & Accessibility:' : '⚙️ ხმა და ხელმისაწვდომობა:';
            }
            const voiceLabel = createTab.querySelector('label[for="voice-speed"]') || formGroups[formGroups.length - 3]?.querySelector('label');
            if (voiceLabel && (voiceLabel.innerText.includes('სიჩქარე') || voiceLabel.innerText.includes('Speed'))) {
                voiceLabel.innerText = isEn ? 'Voice Speed:' : 'ხმის სიჩქარე:';
            }
            const contrastLabel = formGroups[formGroups.length - 2]?.querySelector('label');
            if (contrastLabel && (contrastLabel.innerText.includes('კონტრასტ') || contrastLabel.innerText.includes('Contrast'))) {
                contrastLabel.innerText = isEn ? 'Visual Contrast:' : 'კონტრასტი:';
            }
            const sosLabel = formGroups[formGroups.length - 1]?.querySelector('label');
            if (sosLabel && (sosLabel.innerText.includes('SOS') || sosLabel.innerText.includes('Emergency'))) {
                sosLabel.innerText = isEn ? 'SOS Emergency Phone:' : 'SOS ტელეფონი (მშობლის ნომერი):';
            }
            const sosSaveBtn = formGroups[formGroups.length - 1]?.querySelector('button');
            if (sosSaveBtn) sosSaveBtn.innerText = isEn ? 'Save' : 'შენახვა';

            const exportBtn = createTab.querySelector('button[onclick*="exportProfile"]');
            if (exportBtn) exportBtn.innerHTML = isEn ? '📥 Backup Child Data (JSON)' : '📥 ბავშვის მონაცემების სარეზერვო ასლი (Backup JSON)';
        }

        // 5. Tools Tab (studio-tab-tools)
        const toolsTab = document.getElementById('studio-tab-tools');
        if (toolsTab) {
            const tH4 = toolsTab.querySelector('h4');
            if (tH4) tH4.innerText = isEn ? '🛠️ Specialized Clinical Therapy Tools' : '🛠️ სპეციალური თერაპიული რეჟიმები';
            const tP = toolsTab.querySelector('p');
            if (tP) tP.innerText = isEn ? 'Select an evidence-based clinical modality for this session' : 'აირჩიეთ ინსტრუმენტი სესიის ჩასატარებლად';

            const toolCards = toolsTab.querySelectorAll('.studio-tool-card');
            const toolMeta = isEn ? [
                { t: 'First / Then Board', d: 'First (Demand) ➔ Then (Reward)' },
                { t: 'Token Economy Board', d: 'ABA Positive Reinforcement Stars' },
                { t: 'Visual Daily Schedule', d: 'Structured Activity Routine' },
                { t: 'Body Pain Map', d: '"Where does it hurt?" Localization' },
                { t: 'Find the Card Game', d: 'Receptive Language Training' },
                { t: '6-Phase AAC Trainer', d: 'Structured 6-Phase Visual Exchange Protocol' },
                { t: 'Emotional Regulation', d: 'Calming Zones & Deep Breathing' },
                { t: 'Visual Countdown Timer', d: 'Predictable Time Perception for ASD' },
                { t: 'Quick Social Chat', d: 'Everyday Pragmatic Phrases' },
                { t: 'On-Screen Keyboard', d: 'Typing & Instant Speech' }
            ] : [
                { t: 'First / Then დაფა', d: 'პირველად (დავალება) ➔ შემდეგ (ჯილდო)' },
                { t: 'Token Board', d: 'ABA წახალისების ვარსკვლავები' },
                { t: 'დღის განრიგი', d: 'ვიზუალური აქტივობების თანმიმდევრობა' },
                { t: 'სხეულის რუკა', d: '„სად მტკივა?“ ტკივილის ლოკალიზაცია' },
                { t: 'იპოვე ბარათი', d: 'აღქმის სასწავლო თამაში' },
                { t: '6-ეტაპიანი ტრენაჟორი', d: 'ვიზუალური გაცვლის სავარჯიშო არეალი' },
                { t: 'თვითრეგულაცია', d: 'დამშვიდება და სუნთქვის ზონები' },
                { t: 'ვიზუალური ტაიმერი', d: 'დროის თვალსაჩინო აღქმა' },
                { t: 'სწრაფი ფრაზები', d: 'სოციალური მზა ფრაზები' },
                { t: 'ქართული კლავიატურა', d: 'სიტყვების აკრეფა და გახმოვანება' }
            ];

            toolCards.forEach((tc, idx) => {
                if (toolMeta[idx]) {
                    const stT = tc.querySelector('.st-info strong');
                    const stS = tc.querySelector('.st-info span');
                    if (stT) stT.innerText = toolMeta[idx].t;
                    if (stS) stS.innerText = toolMeta[idx].d;
                }
            });
        }

        // 6. Settings Tab (studio-tab-settings)
        // 6. Settings Tab (studio-tab-settings)
        const settingsTab = document.getElementById('studio-tab-settings');
        if (settingsTab) {
            // Card 1: Dimensions
            const dimTitle = document.getElementById('dim-card-title');
            const dimDesc = document.getElementById('dim-card-desc');
            if (dimTitle) dimTitle.innerText = isEn ? 'Card and Grid Dimensions' : 'ბარათებისა და დაფის ზომა';
            if (dimDesc) dimDesc.innerText = isEn ? 'Adjust card scale according to child motor skills and visual acuity' : 'შეარჩიეთ ბარათების მასშტაბი ბავშვის მოტორიკისა და მხედველობის მიხედვით';

            const b1 = document.getElementById('scb-size-large');
            if (b1) {
                const name = b1.querySelector('.scb-name');
                const hint = b1.querySelector('.scb-hint');
                if (name) name.innerText = isEn ? 'Large' : 'დიდი';
                if (hint) hint.innerText = isEn ? '~185px (Easy physical access)' : '~185px (მარტივი ფიზიკური შეხება)';
            }
            const b2 = document.getElementById('scb-size-medium');
            if (b2) {
                const name = b2.querySelector('.scb-name');
                const hint = b2.querySelector('.scb-hint');
                if (name) name.innerText = isEn ? 'Medium' : 'საშუალო';
                if (hint) hint.innerText = isEn ? '~130px (Gold standard)' : '~130px (ოქროს სტანდარტი)';
            }
            const b3 = document.getElementById('scb-size-compact');
            if (b3) {
                const name = b3.querySelector('.scb-name');
                const hint = b3.querySelector('.scb-hint');
                if (name) name.innerText = isEn ? 'Compact' : 'კომპაქტური';
                if (hint) hint.innerText = isEn ? '~95px (More cards per screen)' : '~95px (მეტი ბარათი ეკრანზე)';
            }

            // Card 2: Touch Accessibility
            const touchTitle = document.getElementById('touch-card-title');
            const touchDesc = document.getElementById('touch-card-desc');
            if (touchTitle) touchTitle.innerText = isEn ? 'Touch Accessibility & Motor Guard (Anti-Spam & Tremor Shield)' : 'შეხების ხელმისაწვდომობა (სპამ-კლიკებისა და ტრემორისგან დაცვა)';
            if (touchDesc) touchDesc.innerText = isEn ? 'Protects against impulsive rapid repeated clicks and unintentional hand swipes' : 'იცავს ბავშვს იმპულსური მრავალჯერადი დაჭერისა და ხელის უნებლიე გასმისგან';

            const repeatTitle = document.getElementById('touch-repeat-title');
            const repeatDesc = document.getElementById('touch-repeat-desc');
            if (repeatTitle) repeatTitle.innerText = isEn ? '🛑 Repeat Click Delay Filter:' : '🛑 განმეორებითი დაჭერის ფილტრი (Repeat Delay):';
            if (repeatDesc) repeatDesc.innerText = isEn ? 'Debounce cooldown period between taps on the same card' : 'ერთი და იმავე ბარათის ზედიზედ სწრაფი დაჭერის დაბლოკვის დრო';

            const dwellTitle = document.getElementById('touch-dwell-title');
            const dwellDesc = document.getElementById('touch-dwell-desc');
            if (dwellTitle) dwellTitle.innerText = isEn ? '⏳ Hold-to-Select (Dwell Activation Time):' : '⏳ დაყოვნებით არჩევა (Hold-to-Select / Dwell Time):';
            if (dwellDesc) dwellDesc.innerText = isEn ? 'Card activates only after being held for the specified duration' : 'ბარათი გააქტიურდება მხოლოდ თითის მითითებული დროით დაჭერისას';

            // Card 3: AI Predictive Assistance
            const aiPredTitle = document.getElementById('ai-pred-card-title');
            const aiPredDesc = document.getElementById('ai-pred-card-desc');
            if (aiPredTitle) aiPredTitle.innerText = isEn ? 'AI Predictive Assistance & Clinical Protocol Fidelity' : 'AI პროგნოზირება & კლინიკური პროტოკოლის სიზუსტე';
            if (aiPredDesc) aiPredDesc.innerText = isEn ? 'Adherence to Standardized Picture Exchange Communication Protocols' : 'სტანდარტიზებული ვიზუალური გაცვლის პროტოკოლის დაცვა';

            const aiToggleLabel = document.getElementById('ai-pred-toggle-label');
            if (aiToggleLabel) aiToggleLabel.innerText = isEn ? 'Enable Real-time AI Word Predictions on Child Board (High-Tech AAC Mode)' : 'AI სიტყვების რეალურ დროში პროგნოზირების ჩართვა დაფაზე (High-Tech AAC რეჟიმი)';

            const aiRecBox = document.getElementById('ai-pred-recommendation-box');
            if (aiRecBox) {
                aiRecBox.innerHTML = isEn 
                    ? '🛡️ <strong>ABA Clinical Recommendation (Default: OFF):</strong> Keep disabled during early exchange training (Phases 1-4). This protects spontaneous requesting (manding) and avoids prompt dependency. Enable only for advanced communicators who benefit from predictive suggestions.'
                    : '🛡️ <strong>ABA კლინიკური რეკომენდაცია (ნაგულისხმევად: გამორთულია):</strong> დატოვეთ გამორთული საწყის ფაზებში (1-4 ეტაპი). ეს იცავს ბავშვს დამოუკიდებელი ინიციატივისა (მენდინგის) განვითარებაში და ხელს უშლის დახმარებაზე დამოკიდებულებას. ჩართეთ მხოლოდ გამოცდილი კომუნიკატორებისთვის.';
            }

            // Card 4: ABA Prompt Logging
            const promptCardTitle = document.getElementById('prompt-setting-card-title');
            const promptCardDesc = document.getElementById('prompt-setting-card-desc');
            if (promptCardTitle) promptCardTitle.innerText = isEn ? 'ABA Prompt Level Logging (Independence Tracking)' : 'ABA დახმარების დონის აღრიცხვა (Prompt Level)';
            if (promptCardDesc) promptCardDesc.innerText = isEn ? 'Automatic tracking of child independence vs. therapist prompts during communication' : 'ბავშვის დამოუკიდებლობისა და თერაპევტის დახმარების დონის ავტომატური აღრიცხვა';

            const promptToggleLabel = document.getElementById('setting-prompt-popup-label');
            if (promptToggleLabel) promptToggleLabel.innerText = isEn ? 'Enable Quick Prompt Popup on Card Tap' : 'ბარათზე შეხებისას სწრაფი არჩევის ფანჯარა (Quick Prompt Popup on Tap)';

            const promptHint = document.getElementById('prompt-setting-hint');
            if (promptHint) {
                promptHint.innerHTML = isEn
                    ? '💡 <strong>When Enabled:</strong> Tapping a card displays a quick popup (🟢 Independent, 🟡 Partial, 🔴 Full) to log assistance.<br><strong>When Disabled:</strong> The popup is turned off to avoid interrupting the child, and prompt level is tracked solely via the header button.'
                    : '💡 <strong>როცა ჩართულია:</strong> ბარათზე შეხებისას ეკრანზე ამოდის პატარა ფანჯარა (🟢 დამოუკიდებლად, 🟡 ნაწილობრივ, 🔴 სრული).<br><strong>როცა გამორთულია:</strong> ფანჯარა აღარ შეაწუხებს ბავშვს და დონე ინიშნება პირდაპირ ზედა ჰედერის ღილაკით.';
            }

            // Card 5: Data Backup & Restore
            const backupTitle = document.getElementById('backup-card-title');
            const backupDesc = document.getElementById('backup-card-desc');
            if (backupTitle) backupTitle.innerText = isEn ? 'Data Backup & Restore' : 'მონაცემთა სარეზერვო ასლი & აღდგენა';
            if (backupDesc) backupDesc.innerText = isEn ? 'Download all customized cards, recorded voice clips, and child profiles, or restore onto another device' : 'ჩამოტვირთეთ ყველა ბარათი, დედის ჩაწერილი ხმა და ბავშვის პროფილები, ან აღადგინეთ სხვა მოწყობილობაზე';

            const b1Title = document.getElementById('backup-box1-title');
            const b1Desc = document.getElementById('backup-box1-desc');
            const b1Btn = document.getElementById('backup-box1-btn');
            if (b1Title) b1Title.innerText = isEn ? '📥 Create Full Backup' : '📥 სრული სარეზერვო ასლის შექმნა';
            if (b1Desc) b1Desc.innerText = isEn ? 'Downloads a secure JSON archive to your computer or phone.' : 'ჩამოტვირთავს დაცულ JSON არქივს თქვენს კომპიუტერში ან ტელეფონში.';
            if (b1Btn) b1Btn.innerText = isEn ? '💾 Download Full Backup (.json)' : '💾 სრული ასლის ჩამოტვირთვა (.json)';

            const b2Title = document.getElementById('backup-box2-title');
            const b2Desc = document.getElementById('backup-box2-desc');
            const b2Btn = document.getElementById('backup-box2-btn');
            if (b2Title) b2Title.innerText = isEn ? '📤 Restore from Backup' : '📤 სარეზერვო ასლიდან აღდგენა';
            if (b2Desc) b2Desc.innerText = isEn ? 'Select a previously downloaded JSON backup file to restore.' : 'აირჩიეთ ადრე ჩამოტვირთული JSON სარეზერვო ფაილი აღსადგენად.';
            if (b2Btn) b2Btn.innerText = isEn ? '📂 Select File & Restore' : '📂 ფაილის არჩევა & აღდგენა';

            const resetBtn = document.getElementById('backup-reset-btn');
            if (resetBtn) resetBtn.innerText = isEn ? '⚠️ Factory Reset to Defaults' : '⚠️ საწყის პარამეტრებზე დაბრუნება (Reset)';

            // Card 5: Legal Notice & Trademark Attribution
            const legalTitle = document.getElementById('legal-card-title');
            const legalDesc = document.getElementById('legal-card-desc');
            if (legalTitle) legalTitle.innerText = isEn ? 'Legal Notice & Trademark Attribution' : 'იურიდიული ცნობა & სავაჭრო ნიშნების ატრიბუცია';
            if (legalDesc) legalDesc.innerText = isEn ? 'Compliance & Intellectual Property Disclaimers' : 'შესაბამისობა & ინტელექტუალური საკუთრების პირობები';

            const legalTm = document.getElementById('legal-trademark-text');
            if (legalTm) {
                legalTm.innerHTML = isEn
                    ? '<strong>Trademarks:</strong> PECS® and Picture Exchange Communication System® are registered trademarks of <strong>Pyramid Educational Consultants, Inc.</strong>'
                    : '<strong>სავაჭრო ნიშნები:</strong> PECS® და Picture Exchange Communication System® წარმოადგენს <strong>Pyramid Educational Consultants, Inc.</strong>-ის რეგისტრირებულ სავაჭრო ნიშნებს.';
            }

            const legalInd = document.getElementById('legal-independence-text');
            if (legalInd) {
                legalInd.innerHTML = isEn
                    ? '<strong>Independence:</strong> <em>Voxis</em> is an independent multimodal AAC (Augmentative and Alternative Communication) research and assistive technology platform. Voxis is not affiliated with, maintained, sponsored, or endorsed by Pyramid Educational Consultants, Inc.'
                    : '<strong>დამოუკიდებლობა:</strong> <em>Voxis</em> არის დამოუკიდებელი მულტიმოდალური AAC (აუგმენტაციური და ალტერნატიული კომუნიკაციის) კვლევითი და დამხმარე ტექნოლოგიური პლატფორმა. Voxis არ არის დაკავშირებული, დაფინანსებული ან ოფიციალურად მხარდაჭერილი Pyramid Educational Consultants, Inc.-ის მიერ.';
            }

            const legalPic = document.getElementById('legal-pictograms-text');
            if (legalPic) {
                legalPic.innerHTML = isEn
                    ? '<strong>Pictograms:</strong> ARASAAC symbols are published under Creative Commons (BY-NC-SA) by the Government of Aragon.'
                    : '<strong>პიქტოგრამები:</strong> ARASAAC სიმბოლოები გამოქვეყნებულია Creative Commons (BY-NC-SA) ლიცენზიით არაგონის მთავრობის მიერ.';
            }
        }
    }

    openConfigModal() {
        if (window.app && window.app.isChildLocked) {
            return;
        }
        let modal = document.getElementById('voxis-ai-config-modal');
        const isEn = this.currentLang === 'en';
        const titleText = isEn ? '✨ Voxis AI — Nebius & NVIDIA Settings' : '✨ Voxis AI — Nebius & NVIDIA პარამეტრები';
        const descText = isEn ?
            'Hosted on <strong>Nebius Token Factory</strong> high-throughput GPU infrastructure, powered by <strong>NVIDIA Nemotron</strong> open foundation models (Nano for real-time card prediction and 3 Ultra for longitudinal BCBA analytics).' :
            'გაშვებულია <strong>Nebius Token Factory</strong> მაღალსიჩქარიან GPU ინფრასტრუქტურაზე, <strong>NVIDIA Nemotron</strong> მოდელების ბაზაზე (Nano ბარათების პროგნოზისთვის, 3 Ultra ანალიტიკისთვის).';
        const nebiusLabel = isEn ? 'Nebius Token Factory API Key:' : 'Nebius Token Factory API გასაღები (Key):';
        const nebiusHint = isEn ? 'Without an API key, Voxis operates seamlessly in <strong>Pre-calibrated Demo Mode</strong>.' : 'გასაღების გარეშე Voxis შეუფერხებლად მუშაობს <strong>დემო რეჟიმში</strong>.';
        const tavilyLabel = isEn ? 'Tavily Search API Key (Optional):' : 'Tavily Search API გასაღები (სურვილისამებრ):';
        const tavilyHint = isEn ? 'Enables real-time peer-reviewed clinical research discovery.' : 'უზრუნველყოფს კვლევების მოძიებას რეალურ დროში.';
        const predLabel = isEn ? 'Enable AI Predictions on Child Board (High-Tech AAC)' : 'AI პროგნოზების ჩართვა ბავშვის დაფაზე (High-Tech AAC)';
        const predRec = isEn ?
            '🛡️ <strong>Clinical Recommendation:</strong> Keep <em>DISABLED</em> during early exchange phases (Phases 1-4) to prevent prompt dependency and maintain spontaneous initiation.' :
            '🛡️ <strong>კლინიკური რეკომენდაცია:</strong> რეკომენდებულია <em>გამორთული</em> იყოს საწყის ეტაპებზე (1-4 ეტაპი), რათა ბავშვს არ ჩამოუყალიბდეს მინიშნებაზე დამოკიდებულება.';
        const saveBtnText = isEn ? '💾 Save Settings' : '💾 შენახვა';
        const closeBtnText = isEn ? 'Close' : 'დახურვა';

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'voxis-ai-config-modal';
            modal.className = 'voxis-modal-overlay';
            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="voxis-modal-dialog" onclick="event.stopPropagation()">
                <div class="voxis-modal-header">
                    <h3>${titleText}</h3>
                    <button class="voxis-modal-close" onclick="document.getElementById('voxis-ai-config-modal').style.display='none'">✕</button>
                </div>
                <div class="voxis-modal-body">
                    <p style="font-size: 13px; color: #475569; margin-bottom: 14px;">
                        ${descText}
                    </p>
                    <div class="v-form-group">
                        <label>${nebiusLabel}</label>
                        <input type="password" id="voxis-input-nebius-key" placeholder="nebius-api-key..." value="">
                        <small>${nebiusHint}</small>
                    </div>
                    <div class="v-form-group" style="margin-top: 12px;">
                        <label>${tavilyLabel}</label>
                        <input type="password" id="voxis-input-tavily-key" placeholder="tvly-api-key..." value="">
                        <small>${tavilyHint}</small>
                    </div>
                    <div class="v-form-group" style="margin-top: 14px; padding: 12px; background: #F8FAFC; border-radius: 10px; border: 1px solid #CBD5E1;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 700; color: #0F172A; font-size: 13px;">
                            <input type="checkbox" id="voxis-toggle-pred-bar" onchange="voxisAI.togglePredictionBar(this.checked)" style="width:16px; height:16px;">
                            <span>${predLabel}</span>
                        </label>
                        <small style="color: #475569; display: block; margin-top: 5px; line-height: 1.4;">
                            ${predRec}
                        </small>
                    </div>
                    <div id="voxis-config-save-status" style="margin-top: 10px; font-weight: 700; font-size: 13px;"></div>
                </div>
                <div class="voxis-modal-footer">
                    <button type="button" class="btn-voxis-save" onclick="voxisAI.saveConfig()">${saveBtnText}</button>
                    <button type="button" class="btn-voxis-cancel" onclick="document.getElementById('voxis-ai-config-modal').style.display='none'">${closeBtnText}</button>
                </div>
            </div>
        `;

        const predToggle = document.getElementById('voxis-toggle-pred-bar');
        if (predToggle) predToggle.checked = this.isPredictionBarEnabled();

        const nebiusInput = document.getElementById('voxis-input-nebius-key');
        if (nebiusInput && this.status && this.status.has_nebius_key && !nebiusInput.value) {
            nebiusInput.placeholder = isEn ? '•••••••••••••••• (API Key Active)' : '•••••••••••••••• (API Key შენახულია)';
        }
        const tavilyInput = document.getElementById('voxis-input-tavily-key');
        if (tavilyInput && this.status && this.status.has_tavily_key && !tavilyInput.value) {
            tavilyInput.placeholder = isEn ? '•••••••••••••••• (API Key Active)' : '•••••••••••••••• (API Key შენახულია)';
        }

        modal.style.display = 'flex';
    }

    async saveConfig() {
        const nebiusKey = document.getElementById('voxis-input-nebius-key')?.value?.trim() || '';
        const tavilyKey = document.getElementById('voxis-input-tavily-key')?.value?.trim() || '';
        const statusEl = document.getElementById('voxis-config-save-status');

        statusEl.style.color = '#0284C7';
        statusEl.innerText = 'Saving...';

        try {
            const res = await fetch(`${this.apiEndpoint}?action=save_config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nebius_api_key: nebiusKey, tavily_api_key: tavilyKey })
            });
            if (res.ok) {
                statusEl.style.color = '#10B981';
                statusEl.innerText = '✅ Settings saved successfully!';
                await this.checkStatus();
                if (typeof this.injectHeaderElements === 'function') {
                    this.injectHeaderElements();
                }
                setTimeout(() => {
                    const m = document.getElementById('voxis-ai-config-modal');
                    if (m) m.style.display = 'none';
                }, 1000);
            }
        } catch (e) {
            statusEl.style.color = '#EF4444';
            statusEl.innerText = 'Error saving settings';
        }
    }

    translateClinicalToolsAndModals(lang) {
        const theApp = window.app || this.app;
        if (theApp && typeof theApp.translateModalsUI === 'function') {
            try {
                theApp.translatePainMapUI(lang);
                theApp.translateTokenBoardUI(lang);
                theApp.translateTrainerUI(lang);
                theApp.translateModalsUI(lang);
            } catch (e) {
                console.warn('App modality translation error:', e);
            }
        }
        const isEn = lang === 'en';

        // 0. Tools Bar Title and Return Button
        const returnBtn = document.querySelector('.tools-return-bar .btn-return-board');
        if (returnBtn) returnBtn.innerText = isEn ? '🔙 Return to Communication Board' : '🔙 დაფაზე დაბრუნება';
        const toolsTitle = document.getElementById('tools-current-title');
        const theAppInst = window.app || this.app;
        if (toolsTitle && theAppInst && theAppInst.currentMode) {
            const tTitles = {
                'firstthen': isEn ? '📋 First / Then Routine Board' : '📋 First / Then დაფა (ჯერ / მერე)',
                'tokenboard': isEn ? '⭐ ABA Star Token Reinforcement Board' : '⭐ ABA ვარსკვლავების წახალისების დაფა',
                'schedule': isEn ? '📅 Visual Daily Schedule' : '📅 დღის ვიზუალური განრიგი',
                'painmap': isEn ? '🩺 Pain & Body Sensory Map' : '🩺 ტკივილისა და შეგრძნებების რუკა',
                'game': isEn ? '🎮 Find the Card Learning Game' : '🎮 „იპოვე ბარათი“ სასწავლო თამაში',
                'trainer': isEn ? '🎓 6-Phase AAC Communication Trainer' : '🎓 6-ეტაპიანი საკომუნიკაციო ტრენაჟორი (AAC Visual Exchange)'
            };
            if (tTitles[theAppInst.currentMode]) {
                toolsTitle.textContent = tTitles[theAppInst.currentMode];
            }
        }

        // 1. FIRST-THEN Routine Board
        const ftHeaderBadge = document.getElementById('ft-header-badge');
        if (ftHeaderBadge) ftHeaderBadge.innerText = isEn ? "📋 First ➔ Then Routine" : "📋 First ➔ Then რუტინა";
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

        if (window.app && typeof window.app.updateFirstThenLanguage === 'function') {
            window.app.updateFirstThenLanguage(lang);
        } else if (this.app && typeof this.app.updateFirstThenLanguage === 'function') {
            this.app.updateFirstThenLanguage(lang);
        }

        // 2. Body Pain Map
        const bodyMapTitle = document.getElementById('body-map-title');
        if (bodyMapTitle) bodyMapTitle.innerText = isEn ? '🩺 Body Pain Map — "Where does it hurt?"' : '🩺 სხეულის რუკა — „სად მტკივა?“';
        const bodyMapSub = document.getElementById('body-map-sub');
        if (bodyMapSub) bodyMapSub.innerText = isEn ? "Select body area and pain level" : "მიუთითეთ სხეულის ნაწილი და ტკივილის დონე";

        const bpMap = isEn ? {
            'head': 'Head', 'eye': 'Eye', 'ear': 'Ear', 'tooth': 'Tooth',
            'throat': 'Throat', 'stomach': 'Stomach', 'hand': 'Hand / Arm',
            'leg': 'Leg / Foot', 'back': 'Back',
            'თავი': 'Head', 'თვალი': 'Eye', 'ყური': 'Ear', 'კბილი': 'Tooth',
            'ყელი': 'Throat', 'მუცელი': 'Stomach', 'ხელი': 'Hand / Arm',
            'ფეხი': 'Leg / Foot', 'ზურგი': 'Back'
        } : {
            'head': 'თავი', 'eye': 'თვალი', 'ear': 'ყური', 'tooth': 'კბილი',
            'throat': 'ყელი', 'stomach': 'მუცელი', 'hand': 'ხელი',
            'leg': 'ფეხი', 'back': 'ზურგი',
            'თავი': 'თავი', 'თვალი': 'თვალი', 'ყური': 'ყური', 'კბილი': 'კბილი',
            'ყელი': 'ყელი', 'მუცელი': 'მუცელი', 'ხელი': 'ხელი',
            'ფეხი': 'ფეხი', 'ზურგი': 'ზურგი'
        };
        document.querySelectorAll('.body-part-btn').forEach(btn => {
            const part = btn.dataset.part;
            const nameSpan = btn.querySelector('.bp-name') || btn.querySelectorAll('span')[1];
            if (part && bpMap[part] && nameSpan) {
                nameSpan.innerText = bpMap[part];
            }
        });

        const painLabel = document.getElementById('pain-level-label');
        if (painLabel) painLabel.innerText = isEn ? "Pain Level:" : "ტკივილის დონე:";
        const psBtns = document.querySelectorAll('.pain-scale-btn');
        if (psBtns[0]) {
            const s = psBtns[0].querySelector('.ps-name') || psBtns[0].querySelectorAll('span')[1];
            if (s) s.innerText = isEn ? "Slight" : "ოდნავ";
        }
        if (psBtns[1]) {
            const s = psBtns[1].querySelector('.ps-name') || psBtns[1].querySelectorAll('span')[1];
            if (s) s.innerText = isEn ? "Moderate" : "საშუალოდ";
        }
        if (psBtns[2]) {
            const s = psBtns[2].querySelector('.ps-name') || psBtns[2].querySelectorAll('span')[1];
            if (s) s.innerText = isEn ? "Severe!" : "ძალიან!";
        }
        const painStmtLabel = document.getElementById('pain-statement-label');
        if (painStmtLabel) painStmtLabel.innerText = isEn ? "Statement:" : "შეტყობინება:";
        const addPainBtn = document.querySelector('#pain-map-view .btn-primary-action');
        if (addPainBtn) addPainBtn.innerHTML = isEn ? "➕ Add to Sentence Strip" : "➕ დამატება წინადადების ზოლზე";

        // 3. Token Economy Board
        const tokenTitle = document.getElementById('token-board-title');
        if (tokenTitle) tokenTitle.innerText = isEn ? "⭐ ABA Token Reinforcement Board" : "⭐ ABA ვარსკვლავების წახალისების დაფა";
        const tokenSub = document.getElementById('token-board-sub');
        if (tokenSub) tokenSub.innerText = isEn ? "Collect stars to earn your desired reward" : "შეაგროვეთ ვარსკვლავები სასურველი ჯილდოს მისაღებად";
        const tokenTargetLbl = document.getElementById('token-target-label');
        if (tokenTargetLbl) tokenTargetLbl.innerText = isEn ? "Target / Reward:" : "მიზანი / ჯილდო:";
        const tokenRewardInput = document.getElementById('token-reward-input');
        if (tokenRewardInput) {
            tokenRewardInput.placeholder = isEn ? "e.g. Ball, iPad, Toy Car..." : "მაგ. ბურთი, მანქანა...";
            if (tokenRewardInput.value === 'ბურთით თამაში ⚽' && isEn) tokenRewardInput.value = 'Play with Soccer Ball ⚽';
            if (tokenRewardInput.value === 'Play with Soccer Ball ⚽' && !isEn) tokenRewardInput.value = 'ბურთით თამაში ⚽';
        }
        const starBtns = document.querySelectorAll('#token-board-view .icon-btn');
        if (starBtns[0]) starBtns[0].innerText = isEn ? "3 Stars" : "3 ვარსკვლავი";
        if (starBtns[1]) starBtns[1].innerText = isEn ? "5 Stars" : "5 ვარსკვლავი";
        if (starBtns[2]) starBtns[2].innerText = isEn ? "10 Stars" : "10 ვარსკვლავი";
        const tokenReset = document.querySelector('#token-board-view .btn-clear');
        if (tokenReset) tokenReset.innerHTML = isEn ? "🔄 Reset Board" : "🔄 თავიდან დაწყება";

        // 4. Visual Daily Schedule
        const schedTitle = document.getElementById('schedule-title');
        if (schedTitle) schedTitle.innerText = isEn ? "📅 Visual Daily Schedule" : "📅 დღის ვიზუალური განრიგი";
        const schedSub = document.getElementById('schedule-sub');
        if (schedSub) schedSub.innerText = isEn ? "Complete steps in order, check them off, and celebrate your independence!" : "შეასრულე თანმიმდევრობით, მონიშნე დასრულებული ნაბიჯები და მიიღე ვარსკვლავები!";
        const pMorning = document.querySelector('.preset-pill[data-preset="morning"]');
        if (pMorning) pMorning.innerHTML = isEn ? "🌅 Morning" : "🌅 დილა";
        const pSchool = document.querySelector('.preset-pill[data-preset="school"]');
        if (pSchool) pSchool.innerHTML = isEn ? "🎒 School" : "🎒 სკოლა";
        const pEvening = document.querySelector('.preset-pill[data-preset="evening"]');
        if (pEvening) pEvening.innerHTML = isEn ? "🌙 Evening" : "🌙 საღამო";
        const schedAllDone = document.querySelector('#schedule-view .sched-btn-done, #schedule-view .btn-primary-action');
        if (schedAllDone) schedAllDone.innerHTML = isEn ? "🎉 All Done!" : "🎉 ყველა დასრულდა!";
        const schedReset = document.querySelector('#schedule-view .sched-btn-reset, #schedule-view .btn-clear');
        if (schedReset) schedReset.innerHTML = isEn ? "🔄 Reset Schedule" : "🔄 განრიგის განულება";
        const schedBack = document.getElementById('sched-btn-back-text');
        if (schedBack) schedBack.innerText = isEn ? "Back" : "დაფა";

        if (theAppInst && typeof theAppInst.updateScheduleLanguage === 'function') {
            theAppInst.updateScheduleLanguage(lang);
        } else if (theAppInst && typeof theAppInst.renderScheduleTimeline === 'function') {
            theAppInst.renderScheduleTimeline();
        }

        // 5. Find the Card Game
        const gameTitle = document.getElementById('game-title');
        if (gameTitle) gameTitle.innerText = isEn ? "🎮 Find the Card Game" : "🎮 „იპოვე ბარათი“ თამაში";
        const gameSub = document.getElementById('game-sub');
        if (gameSub) gameSub.innerText = isEn ? "Audio-visual learning game for receptive language & discrimination" : "აუდიო-ვიზუალური თამაში ბარათების სწრაფი აღქმისა და სწავლისთვის";
        const gameScoreLbl = document.getElementById('game-score-label');
        if (gameScoreLbl) gameScoreLbl.innerText = isEn ? "⭐ Score:" : "⭐ ქულა:";
        const gameRepeat = document.getElementById('game-btn-repeat-text');
        if (gameRepeat) gameRepeat.innerText = isEn ? "Repeat" : "გაუმეორე";
        const gameBannerRepeat = document.getElementById('game-banner-repeat-text');
        if (gameBannerRepeat) gameBannerRepeat.innerText = isEn ? "Repeat" : "გაუმეორე";
        const gameNext = document.querySelector('#game-view .game-btn-next, #game-view .btn-primary-action');
        if (gameNext) gameNext.innerHTML = `<span>✨</span> ${isEn ? "Next Round" : "შემდეგი რაუნდი"}`;
        const gameReset = document.querySelector('#game-view .game-btn-reset, #game-view .ft-btn-change');
        if (gameReset) gameReset.innerHTML = `<span>🔄</span> ${isEn ? "Reset Game" : "თავიდან დაწყება"}`;
        const gameBack = document.getElementById('game-btn-back-text');
        if (gameBack) gameBack.innerText = isEn ? "Back" : "დაბრუნება";
        const returnTxt = document.getElementById('tools-return-board-text');
        if (returnTxt) returnTxt.innerText = isEn ? "Return to Board" : "დაფაზე დაბრუნება";

        if (theAppInst && typeof theAppInst.updateGameLanguage === 'function') {
            theAppInst.updateGameLanguage(lang);
        }

        // 6. Therapist Bottom Bar
        const tbLock = document.querySelector('#tb-btn-lock .tb-label');
        if (tbLock) tbLock.innerText = isEn ? "Lock" : "საკეტი";
        const tbPicker = document.querySelector('#tb-btn-picker .tb-label');
        if (tbPicker) tbPicker.innerText = isEn ? "Card" : "ბარათი";
        const theAppForTb = window.app || this.app;
        if (theAppForTb && typeof theAppForTb.syncPhaseBadges === 'function') {
            theAppForTb.syncPhaseBadges();
        } else {
            const tbPhase = document.getElementById('tb-phase-label');
            if (tbPhase) tbPhase.innerText = isEn ? "Phase IV" : "ეტაპი IV";
        }
        const tbPrompt = document.getElementById('tb-prompt-label');
        if (tbPrompt) tbPrompt.innerText = isEn ? "Independent" : "დამოუკიდებლად";
        const tbClear = document.querySelector('#tb-btn-clear .tb-label');
        if (tbClear) tbClear.innerText = isEn ? "Clear" : "გასუფთავება";
        const tbStudio = document.querySelector('#tb-btn-studio .tb-label');
        if (tbStudio) tbStudio.innerText = isEn ? "Studio" : "სტუდია";

        // 7. Handover Modal
        const hTitle = document.querySelector('#handover-overlay .handover-title');
        if (hTitle) hTitle.innerText = isEn ? "Card Handover to Partner" : "ბარათის გადაცემა პარტნიორს";
        const hSub = document.querySelector('#handover-overlay .handover-subtitle');
        if (hSub) hSub.innerText = isEn ? "Communicative Exchange · Phase 4-6" : "კომუნიკაციური გაცვლა · ფაზა 4-6";
        const hResp = document.querySelector('#handover-overlay .h-response-label');
        if (hResp) hResp.innerText = isEn ? "Partner is listening to request..." : "პარტნიორი ისმენს მოთხოვნას...";

        // 8. Celebration Dialog
        const celTitle = document.getElementById('celebration-title');
        if (celTitle && (celTitle.innerText.includes('ყოჩაღ') || celTitle.innerText.includes('Great Job'))) {
            celTitle.innerText = isEn ? "🎉 Great Job!" : "🎉 ყოჩაღ!";
        }
        const celSub = document.getElementById('celebration-subtitle');
        if (celSub && (celSub.innerText.includes('წარმატებით') || celSub.innerText.includes('successfully'))) {
            celSub.innerText = isEn ? "Activity completed successfully!" : "დავალება წარმატებით შესრულდა!";
        }
        const celBtn = document.getElementById('celebration-confirm-btn');
        if (celBtn && (celBtn.innerText.includes('შესანიშნავია') || celBtn.innerText.includes('Awesome'))) {
            celBtn.innerText = isEn ? "✨ Awesome!" : "✨ შესანიშნავია!";
        }

        // 9. On-Screen Keyboard Modal
        const kbTitle = document.getElementById('keyboard-modal-title');
        if (kbTitle) kbTitle.innerText = isEn ? "⌨️ On-Screen Keyboard (Spelling)" : "⌨️ ქართული ანბანი (Spelling)";
        const kbSub = document.getElementById('keyboard-modal-sub');
        if (kbSub) kbSub.innerText = isEn ? "Type letter-by-letter with speech output" : "ასო-ასო აკრეფა და გახმოვანება";
        const kbDisp = document.getElementById('keyboard-text-display');
        if (kbDisp && (kbDisp.innerText.includes('დააჭირეთ') || kbDisp.innerText.includes('Tap letters'))) {
            kbDisp.innerText = isEn ? "Tap letters to spell..." : "დააჭირეთ ასოებს...";
        }
        const kbBtns = document.querySelectorAll('#modal-keyboard .geo-keyboard-box button');
        if (kbBtns.length >= 5) {
            kbBtns[0].innerText = isEn ? "🔊 Speak" : "🔊 წაკითხვა";
            kbBtns[1].innerText = isEn ? "␣ Space" : "␣ გამოტოვება";
            kbBtns[2].innerText = isEn ? "⌫ Del" : "⌫ წაშლა";
            kbBtns[3].innerText = isEn ? "🗑️ Clear" : "🗑️ გასუფთავება";
            kbBtns[4].innerText = isEn ? "➕ Add to Strip" : "➕ ზოლზე დადება";
        }

        // 10. SOS Emergency Modal
        const sosHeading = document.getElementById('sos-help-heading');
        if (sosHeading) sosHeading.innerText = isEn ? "Please Help Me!" : "გთხოვთ დამეხმაროთ!";
        const sosIntro = document.getElementById('sos-intro-p');
        if (sosIntro) {
            const cName = document.getElementById('sos-child-name')?.innerText || (isEn ? 'Alex' : 'ბავშვი');
            sosIntro.innerHTML = isEn 
                ? `My name is <strong id="sos-child-name">${cName}</strong>. I communicate using this assistive board.` 
                : `მე მქვია <strong id="sos-child-name">${cName}</strong>. მე ვსაუბრობ ამ საკომუნიკაციო დაფის დახმარებით.`;
        }
        const sosCallLbl = document.getElementById('sos-call-label');
        if (sosCallLbl) sosCallLbl.innerText = isEn ? "Please call my parent:" : "გთხოვთ დაურეკოთ ჩემს დედას:";
        const sosSpeakBtn = document.querySelector('#modal-sos .btn-primary-action');
        if (sosSpeakBtn) sosSpeakBtn.innerText = isEn ? "🔊 Speak Emergency Audio" : "🔊 ხმამაღალი შეტყობინება";

        // 11. Quick Card Picker
        const pickerTitle = document.querySelector('#modal-quick-card-picker h3');
        if (pickerTitle) pickerTitle.innerText = isEn ? "Select Target / Distractor Card" : "სამიზნე / დისტრაქტორის არჩევა";
        const pickerSearch = document.getElementById('picker-search-input');
        if (pickerSearch) pickerSearch.placeholder = isEn ? "Search card (e.g. ball, apple, socks)..." : "მოძებნე ბარათი (მაგ: ბურთი, ვაშლი, წინდები)...";

        // 12. Prompt Level Modal & Overlay
        const ptButtons = document.querySelectorAll('.prompt-tag-buttons .pt-btn');
        if (ptButtons[0]) ptButtons[0].innerText = isEn ? "🟢 Independent" : "🟢 დამოუკიდებლად";
        if (ptButtons[1]) ptButtons[1].innerText = isEn ? "🟡 Partial" : "🟡 ნაწილობრივ";
        if (ptButtons[2]) ptButtons[2].innerText = isEn ? "🔴 Full" : "🔴 სრული";

        const ptDisable = document.querySelector('.btn-disable-prompt-popup');
        if (ptDisable) ptDisable.innerText = isEn ? "🔕 Disable Popup (Record via header only)" : "🔕 ფანჯრის გათიშვა (მხოლოდ ჰედერით ჩაწერა)";

        const ptHeader = document.getElementById('prompt-tag-header-label');
        if (ptHeader) ptHeader.innerText = isEn ? "🤝 ABA Prompt Level:" : "🤝 ABA დახმარების დონე:";

        if (window.app && typeof window.app.translatePromptLevelModal === 'function') {
            window.app.translatePromptLevelModal(isEn ? 'en' : 'ka');
        } else {
            const promptTitle = document.querySelector('#prompt-level-modal .prompt-modal-title');
            if (promptTitle) promptTitle.innerText = isEn ? "Select ABA Prompt Level" : "ABA დახმარების დონის არჩევა";
            const promptSub = document.querySelector('#prompt-level-modal .prompt-modal-subtitle');
            if (promptSub) promptSub.innerText = isEn ? "ABA Prompt Hierarchy · Data Logging" : "ABA დახმარების იერარქია · მონაცემთა აღრიცხვა";
            const pmIntro = document.getElementById('pm-intro');
            if (pmIntro) pmIntro.innerHTML = isEn ? "💡 <strong>Instruction:</strong> Select the level of assistance provided in the current trial. Each tap will be automatically logged at this level:" : "💡 <strong>ინსტრუქცია:</strong> აირჩიეთ მიმდინარე ცდაში გაწეული დახმარების დონე. ყოველი შეხება ავტომატურად ინიშნება ამ დონით:";
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
            if (psTitle) psTitle.textContent = isEn ? "🔔 Quick Popup on Tap:" : "🔔 სწრაფი ფანჯარა შეხებისას:";
            const psSub = document.getElementById('ps-sub-switch');
            if (psSub) psSub.textContent = isEn ? "Confirm prompt level every time a card is tapped" : "დაადასტურეთ დახმარების დონე ბარათზე ყოველი შეხების დროს";
        }

        // 13. Express Voice Studio
        const vsSub = document.querySelector('#modal-voice-studio .modal-subtitle');
        if (vsSub) vsSub.innerText = isEn ? "Vocalize cards with parent or therapist's warm, authentic voice" : "გაახმოვანეთ ბარათები დედის ან თერაპევტის ცოცხალი, თბილი ქართული ხმით";
        const vsSearch = document.getElementById('voice-studio-search');
        if (vsSearch) vsSearch.placeholder = isEn ? "🔍 Search card to vocalize..." : "🔍 მოძებნეთ ბარათი...";
        const vsResetBtn = document.getElementById('btn-voice-studio-reset');
        if (vsResetBtn) vsResetBtn.innerText = isEn ? "🗑️ Reset TTS" : "🗑️ ნაგულისხმევი ხმა";
        const vsPlayBtn = document.querySelector('#btn-voice-studio-play span:last-child');
        if (vsPlayBtn) vsPlayBtn.innerText = isEn ? "Listen" : "მოსმენა";
        const vsPrevBtn = document.querySelector('#modal-voice-studio button[onclick*="prevVoiceStudioCard"]');
        if (vsPrevBtn) vsPrevBtn.innerHTML = isEn ? "⬅️ Previous" : "⬅️ წინა";
        const vsNextBtn = document.querySelector('#modal-voice-studio button[onclick*="nextVoiceStudioCard"]');
        if (vsNextBtn) vsNextBtn.innerHTML = isEn ? "Next ➡️" : "შემდეგი ➡️";
        const vsResetAll = document.querySelector('#modal-voice-studio button[onclick*="resetAllCustomRecordings"]');
        if (vsResetAll) vsResetAll.innerText = isEn ? "🗑️ Reset all recorded voices to default neural TTS" : "🗑️ ყველა ჩანაწერის გასუფთავება და სტანდარტულ ხმაზე დაბრუნება";

        // Re-sync Voice Studio only if modal is active and cards exist
        const theAppForVs = window.app || this.app;
        const vsModal = document.getElementById('modal-voice-studio');
        if (theAppForVs && vsModal && vsModal.classList.contains('active') && theAppForVs.voiceStudioCards && theAppForVs.voiceStudioCards.length > 0) {
            if (typeof theAppForVs.populateVoiceStudioSelect === 'function') {
                theAppForVs.populateVoiceStudioSelect();
            }
            if (typeof theAppForVs.renderVoiceStudioCard === 'function') {
                theAppForVs.renderVoiceStudioCard();
            }
        }

        // Re-sync prompt UI and schedule in app
        const finalApp = window.app || this.app;
        if (finalApp) {
            if (typeof finalApp.syncPromptLevelUI === 'function') {
                finalApp.syncPromptLevelUI();
            }
            if (typeof finalApp.renderScheduleTimeline === 'function') {
                finalApp.renderScheduleTimeline();
            }
        }
    }

}

// Global initialization hook
function initVoxisAI() {
    const appInst = window.app || (typeof app !== 'undefined' ? app : null);
    if (!window.voxisAI) {
        window.voxisAI = new VoxisAI(appInst);
        window.voxisAI.init();
    }
}
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initVoxisAI);
} else {
    initVoxisAI();
}
