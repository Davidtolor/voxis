<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Voxis — AI-Powered Multimodal AAC Platform (NVIDIA Nemotron)</title>
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Styles -->
    <link rel="stylesheet" href="assets/css/style.css?v=<?= time() ?>">
    <link rel="manifest" href="manifest.json?v=voxis2">
    <link rel="icon" type="image/svg+xml" href="assets/images/app-logo.svg">
    <!-- PWA & Mobile Meta -->
    <meta name="theme-color" content="#0D9488">
    <meta name="apple-mobile-web-app-title" content="Voxis AAC">
    <link rel="apple-touch-icon" href="assets/images/icon-192.png?v=voxis2">
    <script>
        // 🛑 Global guard: Block ANY male voice (Giorgi/David) and Eka from speaking via SpeechSynthesis
        if ('speechSynthesis' in window) {
            const _origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
            window.speechSynthesis.speak = function(utt) {
                if (utt) {
                    const isGeo = (utt.lang === 'ka' || utt.lang === 'ka-GE' || /[\u10A0-\u10FF]/.test(utt.text || ''));
                    if (isGeo) {
                        console.warn("🛑 Global guard: SpeechSynthesis Georgian completely blocked to prevent male Giorgi/Eka voice.");
                        return;
                    }
                    const vName = (utt.voice && utt.voice.name) ? utt.voice.name.toLowerCase() : '';
                    if (vName.includes('giorgi') || vName.includes('david') || vName.includes('male') || vName.includes('eka')) {
                        console.warn("🛑 Global guard: Voice blocked:", vName);
                        return;
                    }
                }
                return _origSpeak(utt);
            };
        }
        // Default to English for international presentation, preserve user selection
        if (!localStorage.getItem('voxis_lang')) {
            localStorage.setItem('voxis_lang', 'en');
        }
        document.documentElement.lang = localStorage.getItem('voxis_lang') || 'en';
        if (localStorage.getItem('voxis_child_lock') === 'true') {
            document.documentElement.classList.add('child-lock-preactive');
        }
    </script>
    <style>
        /* Instant Mobile Symmetry for Studio, Modals & Clinical Reports */
        .responsive-two-col-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }
        @media (max-width: 768px) {
            .modal-box {
                padding: 20px 14px !important;
                border-radius: 20px !important;
                max-height: 94vh !important;
                width: 95% !important;
            }
            .responsive-two-col-grid {
                grid-template-columns: 1fr !important;
                gap: 12px !important;
            }
            .voice-recorder-box {
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 12px !important;
                padding: 12px !important;
            }
            .voice-recorder-actions {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                width: 100% !important;
                padding-top: 10px !important;
                border-top: 1px dashed #E2E8F0 !important;
            }
            .voice-recorder-actions .rec-btn {
                flex: 1 !important;
                justify-content: center !important;
                height: 44px !important;
                font-size: 14px !important;
            }
            .voice-recorder-actions #rec-timer {
                font-size: 16px !important;
                padding: 0 10px !important;
            }
            #st-btn-save-card {
                height: 48px !important;
                font-size: 15px !important;
                font-weight: 800 !important;
                border-radius: 14px !important;
                width: 100% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin-top: 16px !important;
            }
            /* Clinical Report Cards & Responsive Metrics */
            .voxis-metrics-summary-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 10px !important;
                margin-bottom: 16px !important;
            }
            .v-metric-box {
                padding: 12px 8px !important;
                border-radius: 12px !important;
            }
            .v-metric-box .v-val {
                font-size: 20px !important;
            }
            .v-metric-box .v-lbl {
                font-size: 11px !important;
            }
            .voxis-report-table-wrapper {
                display: none !important;
            }
            .voxis-report-cards-view {
                display: flex !important;
                flex-direction: column !important;
                gap: 12px !important;
                margin: 14px 0 !important;
            }
            .voxis-rep-mobile-card {
                background: #FFFFFF;
                border: 1.5px solid #E2E8F0;
                border-radius: 14px;
                overflow: hidden;
                box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
            }
            .voxis-rep-card-title {
                background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
                color: #FFFFFF;
                font-weight: 800;
                font-size: 13.5px;
                padding: 10px 14px;
                letter-spacing: 0.3px;
            }
            .voxis-rep-card-body {
                padding: 12px 14px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .voxis-rep-card-row {
                display: flex;
                flex-direction: column;
                gap: 3px;
                border-bottom: 1px dashed #F1F5F9;
                padding-bottom: 8px;
            }
            .voxis-rep-card-row:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            .voxis-rep-field-lbl {
                font-size: 11px;
                font-weight: 800;
                color: #0284C7;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .voxis-rep-field-val {
                font-size: 12.5px;
                color: #334155;
                line-height: 1.5;
                word-break: break-word;
            }
        }
    </style>
</head>
<body>

    <!-- 1. Clean, Sensory-Calm Header Bar -->
    <header class="sensory-top-header" id="sensory-top-header">
        <div class="sensory-brand-left" onclick="app.switchMainMode('aac')" title="Voxis AAC Board — Main Board" style="cursor: pointer;">
            <div class="sensory-logo-wrap">
                <img src="assets/images/app-logo.svg" class="app-brand-logo-img" alt="Voxis AAC">
            </div>
            <div class="sensory-titles">
                <div class="sensory-title-row">
                    <h1 class="sensory-title-main" id="app-brand-title">Voxis</h1>
                    <span class="sensory-badge-aac">AI AAC</span>
                </div>
                <span class="sensory-title-sub">Multimodal Assistive Communication Platform</span>
            </div>
        </div>

        <div class="sensory-header-center">
            <div class="sensory-child-badge" id="active-profile-badge" onclick="app.openQuickProfileSwitcherModal()" title="Child Profile (Click to Switch)">
                <span>🧒</span> <span id="header-child-name">Alex</span>
            </div>
            <div class="sensory-phase-badge" id="header-phase-badge" onclick="app.openPhaseSwitcherModal()" title="AAC Communication Phase (Click to Switch)">
                <span class="badge-icon">🎓</span>
                <span id="header-phase-text" class="phase-full-label">Phase IV (Sentence)</span>
                <span id="header-phase-short" class="phase-short-label">Phase IV</span>
            </div>
        </div>

        <div class="sensory-header-right">
            <button class="sensory-head-btn head-btn-judge-tour" id="btn-head-judge-tour" onclick="app.openJudgeTourModal()" title="🏆 Judge Demo Tour (30s Showcase)" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%) !important; border: 1.5px solid #F59E0B !important; border-bottom: 3.5px solid #D97706 !important; color: #92400E !important; font-weight: 900 !important;">
                <span class="head-btn-icon">🏆</span>
                <span class="head-btn-label" id="btn-head-judge-tour-text">Judge Tour</span>
            </button>
            <button class="sensory-head-btn head-btn-home"  id="btn-head-home" onclick="app.switchMainMode('aac')" title="🏠 Main AAC Board">
                <span class="head-btn-icon">🏠</span>
                <span class="head-btn-label" id="btn-head-home-text">Board</span>
            </button>
            <button class="sensory-head-btn head-btn-voice-studio" id="btn-head-voice-studio" onclick="app.openExpressVoiceStudio()" title="🎙️ Custom Voice Recording Studio">
                <span class="head-btn-icon">🎙️</span>
                <span class="head-btn-label">Record</span>
            </button>
            <button class="sensory-head-btn head-btn-sound-test" id="btn-head-sound-test" onclick="app.testHeadSound()" title="🔊 Audio Speech Test">
                <span class="head-btn-icon">🔊</span>
                <span class="head-btn-label">Audio</span>
            </button>
            <button class="sensory-head-btn prompt-level-head-btn head-btn-prompt" id="btn-head-prompt" onclick="app.cyclePromptLevel()" ondblclick="app.openPromptLevelModal()" oncontextmenu="event.preventDefault(); app.openPromptLevelModal()" title="🤝 ABA Prompt Level (Click to cycle, Double-click for settings)">
                <span id="head-prompt-icon" class="head-btn-icon">🟢</span>
                <span id="head-prompt-text" class="head-btn-label">Independent</span>
            </button>
            <button class="sensory-head-btn head-btn-first-then" id="btn-head-first-then" onclick="app.toggleFirstThenMode()" title="🔄 First-Then Routine (First ➔ Then)">
                <span class="head-btn-icon">🔄</span>
                <span class="head-btn-label" id="btn-head-firstthen-text">First-Then</span>
            </button>
            <button class="sensory-head-btn head-btn-emotions" id="btn-head-emotions" onclick="app.openRegulationModal()" title="🧘 Emotional Self-Regulation & Calming (Zones of Regulation)">
                <span class="head-btn-icon">🧘</span>
                <span class="head-btn-label">Emotions</span>
            </button>
            <button class="sensory-head-btn head-btn-ai" id="btn-head-voxis-ai" onclick="app.openAiConfig();" title="✨ Voxis AI (Nebius & NVIDIA Settings)">
                <span class="head-btn-icon">✨</span>
                <span class="head-btn-label">Voxis AI</span>
            </button>
            <button class="sensory-head-btn head-btn-studio" id="btn-head-studio" onclick="app.openParentalGate()" title="⚙️ Therapist & Parental Studio (Analytics, Settings)">
                <span class="head-btn-icon">⚙️</span>
                <span class="head-btn-label">Studio</span>
            </button>
            <button class="sensory-head-btn head-btn-lock" id="btn-head-lock" onclick="app.toggleChildLock()" title="🛡️ Child Screen Lock">
                <span class="head-btn-icon">🔒</span>
            </button>
            <button class="sensory-head-btn head-btn-fullscreen" onclick="app.toggleFullscreen()" title="⛶ Fullscreen">
                <span class="head-btn-icon">⛶</span>
            </button>
            <button class="sensory-head-btn head-btn-more-menu" id="btn-head-more-menu" onclick="app.openMobileMenu()" title="⋯ More Menu">
                <span class="head-btn-icon">⋮</span>
            </button>
        </div>
    </header>

    <!-- 2. Main Chalkboard AAC Grid Canvas -->
    <main class="sensory-binder-workspace schoolboard-workspace" id="sensory-binder-workspace">
        
        <!-- Classic Solid Wood Frame -->
        <div class="real-binder-book schoolboard-frame" id="real-binder-book">
            
            <!-- Classic Green Chalkboard Canvas -->
            <div class="binder-page schoolboard-canvas" id="binder-page">
                


                <!-- ⚡ Persistent Quick Access Core Bar -->
                <div class="chalkboard-core-bar" id="chalkboard-core-bar">
                    <button type="button" class="core-pill-btn pill-dont-want" onclick="app.quickPickDontWant()" title="Don't want">
                        <span class="cp-icon">🛑</span>
                        <span class="cp-text">Don't want</span>
                    </button>
                    <button type="button" class="core-pill-btn pill-help" onclick="app.quickPickHelp()" title="Help me">
                        <span class="cp-icon">✋</span>
                        <span class="cp-text">Help</span>
                    </button>
                    <button type="button" class="core-pill-btn pill-more" onclick="app.quickPickMore()" title="More">
                        <span class="cp-icon">➕</span>
                        <span class="cp-text">More</span>
                    </button>
                    <button type="button" class="core-pill-btn pill-finished" onclick="app.quickPickFinished()" title="Finished">
                        <span class="cp-icon">🙅</span>
                        <span class="cp-text">Finished</span>
                    </button>
                </div>

                <!-- 🔍 Chalkboard Live Search & Add Card Controls -->
                <div class="chalkboard-search-toolbar" id="chalkboard-search-toolbar">
                    <div class="cst-search-box" onclick="const inp=document.getElementById('board-live-search'); if(inp && inp.readOnly){ inp.readOnly=false; inp.focus(); }">
                        <span class="cst-search-icon">🔍</span>
                        <input type="search" id="board-live-search" name="board_search_query" class="cst-search-input" 
                               placeholder="Search cards on board or database..." 
                               oninput="app.handleBoardLiveSearch(this.value)" 
                               autocomplete="off"
                               autocorrect="off"
                               autocapitalize="off"
                               spellcheck="false"
                               data-lpignore="true"
                               data-form-type="other"
                               data-1p-ignore="true"
                               role="searchbox"
                               readonly
                               onpointerdown="this.readOnly=false;"
                               onfocus="this.readOnly=false;"
                               onblur="this.readOnly=true;">
                        <button type="button" id="btn-clear-board-search" class="cst-clear-btn" onclick="app.clearBoardSearch()" style="display:none;" title="Clear">✕</button>
                    </div>
                    <!-- 🎴 Grid Size Switcher -->
                    <div class="grid-size-toggle-group" id="grid-size-toggle-group">
                        <button type="button" class="grid-size-btn" data-size="large" onclick="app.setGridSize('large')" title="Large Cards (High Motor Accessibility)">
                            <span>🔍+</span> Large
                        </button>
                        <button type="button" class="grid-size-btn active" data-size="medium" onclick="app.setGridSize('medium')" title="Medium Cards (Standard)">
                            <span>📱</span> Medium
                        </button>
                        <button type="button" class="grid-size-btn" data-size="compact" onclick="app.setGridSize('compact')" title="Compact Cards (More Cards)">
                            <span>📁</span> Compact
                        </button>
                    </div>
                    <div class="cst-actions-group">
                        <button type="button" class="cst-edit-mode-btn" id="btn-toggle-board-edit" onclick="app.toggleBoardEditMode()" title="Delete or Manage Cards on Board">
                            <span id="btn-edit-mode-icon">✏️</span>
                            <span id="btn-edit-mode-text" class="cst-edit-text">Edit</span>
                        </button>
                        <button type="button" class="cst-open-library-btn" onclick="app.openCardLibraryModal()" title="📚 Card Library & Add Cards">
                            <span class="cst-lib-icon">➕</span>
                            <span class="cst-lib-text">Add Card</span>
                        </button>
                    </div>
                </div>

                <!-- Tiles Work Field -->
                <div class="binder-strips-area montessori-tiles-area" id="binder-strips-area">
                    <!-- Montessori Tactile Tiles Grid -->
                    <div id="cards-grid" class="cards-grid phase-multi-view"></div>
                </div>

                <!-- Montessori Inlay Category Tabs -->
                <nav class="binder-tabs-nav montessori-tabs-nav" id="binder-tabs-nav">
                    <button class="binder-tab-btn montessori-tab-btn tab-basic" data-category="basic" onclick="app.selectCategoryTab('basic')">
                        <span class="m-tab-icon">⚡</span>
                        <span class="m-tab-text">Basic</span>
                    </button>
                    <button class="binder-tab-btn montessori-tab-btn tab-food active" data-category="food" onclick="app.selectCategoryTab('food')">
                        <span class="m-tab-icon">🍏</span>
                        <span class="m-tab-text">Food</span>
                    </button>
                    <button class="binder-tab-btn montessori-tab-btn tab-drinks" data-category="drinks" onclick="app.selectCategoryTab('drinks')">
                        <span class="m-tab-icon">💧</span>
                        <span class="m-tab-text">Drinks</span>
                    </button>
                    <button class="binder-tab-btn montessori-tab-btn tab-toys" data-category="toys" onclick="app.selectCategoryTab('toys')">
                        <span class="m-tab-icon">⚽</span>
                        <span class="m-tab-text">Toys</span>
                    </button>
                    <button class="binder-tab-btn montessori-tab-btn tab-actions" data-category="actions" onclick="app.selectCategoryTab('actions')">
                        <span class="m-tab-icon">🏃</span>
                        <span class="m-tab-text">Actions</span>
                    </button>
                    <button class="binder-tab-btn montessori-tab-btn tab-feelings" data-category="feelings" onclick="app.selectCategoryTab('feelings')">
                        <span class="m-tab-icon">💛</span>
                        <span class="m-tab-text">Emotions</span>
                    </button>
                    <button class="binder-tab-btn montessori-tab-btn tab-all" data-category="all" onclick="app.selectCategoryTab('all')">
                        <span class="m-tab-icon">📁</span>
                        <span class="m-tab-text">All</span>
                    </button>

                    <!-- 📄 AAC Clinical Board Pagination Controls (Integrated in Tabs Row) -->
                    <div class="board-pagination-dock" id="board-pagination-dock" style="display: none;">
                        <button type="button" class="bp-btn bp-btn-prev" id="bp-btn-prev" onclick="app.prevBoardPage()" title="Previous Page">
                            <span class="bp-icon">◀</span>
                            <span class="bp-label" id="bp-prev-text">Prev</span>
                        </button>
                        <div class="bp-indicator" id="bp-indicator">
                            <span id="bp-page-text">1 / 1</span>
                        </div>
                        <button type="button" class="bp-btn bp-btn-next" id="bp-btn-next" onclick="app.nextBoardPage()" title="Next Page">
                            <span class="bp-label" id="bp-next-text">Next</span>
                            <span class="bp-icon">▶</span>
                        </button>
                    </div>

                    <button class="binder-tab-btn montessori-tab-btn tab-library-trigger" onclick="app.openCardLibraryModal()" title="📚 Card Library & Add">
                        <span class="m-tab-icon">➕</span>
                        <span class="m-tab-text">Add</span>
                    </button>
                </nav>
            </div>
        </div>

        <!-- Phase Clinical Context Banner (Phases 4, 5, 6) -->
        <div id="binder-phase-banner" class="binder-phase-banner" style="display: none;"></div>

        <!-- Sentence Strip — Velcro Dock -->
        <div class="binder-sentence-strip-wrap" id="binder-sentence-strip-wrap">
            <!-- Dynamic Starters Dock (Phase 4 & 5: Large "I want"; Phase 6: Handled by Shelf above) -->
            <div id="strip-starters-dock" class="strip-starters-dock">
                <button type="button" class="strip-starter-want-btn starter-chip-btn" onclick="app.quickAddStarter('starter_want')" title="Click to add 'I want' starter">
                    <span class="sw-icon">🤲</span>
                    <span class="sw-text">I want</span>
                </button>
            </div>

            <div id="sentence-strip" class="sentence-strip empty"
                 ondragover="app.handleStripDragOver(event)" 
                 ondrop="app.handleStripDrop(event)"
                 ondragleave="app.handleStripDragLeave(event)"></div>

            <div class="strip-actions">
                <button id="btn-speak" class="btn-speak" onclick="app.speakSentence()" title="Speak / Read Sentence">
                    <span class="btn-strip-icon">🔊</span>
                    <span class="btn-strip-label">Speak</span>
                </button>
                <button id="btn-handover" class="btn-handover" onclick="app.handoverSentenceStrip()" title="Handover Sentence to Partner">
                    <span class="btn-strip-icon">🤝</span>
                    <span class="btn-strip-label">Handover</span>
                </button>
                <button class="btn-clear" onclick="app.clearSentenceStrip()" title="Clear Sentence" aria-label="Clear">
                    <span class="trash-icon">🗑️</span>
                </button>
            </div>
        </div>
    </main>

    <!-- 3. Clinical Modalities Container (Launched from Studio) -->
    <div id="clinical-tools-wrapper" class="clinical-tools-wrapper" style="display: none;">
        <div class="tools-return-bar">
            <button type="button" class="btn-return-board" id="tools-return-board-btn" onclick="app.switchMainMode('aac')">
                <span>⬅️</span> <span id="tools-return-board-text">დაფაზე დაბრუნება</span>
            </button>
            <span id="tools-current-title">🎮 „იპოვე ბარათი“ სასწავლო თამაში</span>
        </div>

    <!-- ========================================================
         View B: 6-Phase Clinical AAC Visual Exchange Trainer
         ======================================================== -->
    <div id="clinical-trainer-view" class="clinical-trainer-view">
        <div class="phase-tabs-nav">
            <button class="phase-tab-btn active" data-phase="1" onclick="app.initTrainerPhase(1)">1. ფიზიკური გაცვლა</button>
            <button class="phase-tab-btn" data-phase="2" onclick="app.initTrainerPhase(2)">2. მანძილი &amp; დაჟინებულობა</button>
            <button class="phase-tab-btn" data-phase="3" onclick="app.initTrainerPhase(3)">3. გარჩევა (A / B)</button>
            <button class="phase-tab-btn" data-phase="4" onclick="app.initTrainerPhase(4)">4. წინადადების ზოლი</button>
            <button class="phase-tab-btn" data-phase="5" onclick="app.initTrainerPhase(5)">5. პასუხი შეკითხვაზე</button>
            <button class="phase-tab-btn" data-phase="6" onclick="app.initTrainerPhase(6)">6. კომენტირება</button>
        </div>

        <div class="phase-header-card">
            <h3 id="phase-title">ეტაპი I</h3>
            <p id="phase-desc">აღწერა...</p>
            <!-- 🎯 Phase 3 Discrimination Quick Control Panel for Therapist -->
            <div id="trainer-discrimination-picker" class="trainer-discrimination-picker" style="display: none;">
                <div class="dp-group">
                    <label>🎯 სამიზნე ბარათი:</label>
                    <select id="dp-target-select" class="dp-select" onchange="app.updateDiscriminationPair()"></select>
                </div>
                <div class="dp-group">
                    <label>🛑 დისტრაქტორი (არასასურველი):</label>
                    <select id="dp-distractor-select" class="dp-select" onchange="app.updateDiscriminationPair()"></select>
                </div>
            </div>
        </div>

        <div class="trainer-stage-area">
            <!-- 🤝 DragTarget: Communicative Partner (Outstretched Hand — Non-verbal Visual Target) -->
            <div id="trainer-partner-bubble" class="trainer-partner-dropzone" 
                 ondragover="app.handleTrainerPartnerDragOver(event)" 
                 ondrop="app.handleTrainerPartnerDrop(event)" 
                 ondragleave="app.handleTrainerPartnerDragLeave(event)"
                 onclick="app.handleTrainerPartnerClick()"
                 title="Hand card to partner">
                <div class="partner-visual-wrap">
                    <span id="trainer-partner-avatar" class="partner-avatar-icon">👩‍🏫</span>
                    <span class="partner-hand-icon">🫱</span>
                </div>
                <div id="trainer-partner-feedback" class="partner-feedback-badge" style="display: none;"></div>
            </div>
            <div id="trainer-cards-row" class="trainer-cards-row"></div>
        </div>
    </div>

    <!-- ========================================================
         View C: FIRST-THEN Interactive Routine Board (Touch/Drag to Reveal)
         ======================================================== -->
    <div id="first-then-view" class="first-then-view">
        <div class="ft-chalkboard-canvas">
            <!-- Top Toolbar with Actions -->
        <div class="ft-board-header">
            <div class="ft-header-left">
                <span class="ft-header-badge" id="ft-header-badge">📋 ჯერ ➔ შემდეგ რუტინა</span>
                <span id="ft-ai-source-badge" class="ft-source-badge">✨ NVIDIA Nemotron</span>
            </div>
            <div class="ft-header-actions">
                <button type="button" class="ft-action-btn ft-btn-listen" onclick="app.speakCurrentFirstThenRoutine()" title="🔊 რუტინის მოსმენა">
                    <span>🔊</span> <span id="ft-btn-listen-text">მოსმენა</span>
                </button>
                <button type="button" class="ft-action-btn ft-btn-change" onclick="app.openFirstThenSetup()" title="🔄 ახალი რუტინის გენერირება">
                    <span>🔄</span> <span id="ft-btn-change-text">ახალი რუტინა</span>
                </button>
                <button type="button" class="ft-action-btn ft-btn-return" onclick="app.switchMainMode('aac')" title="⬅️ დაფაზე დაბრუნება">
                    <span>⬅️</span> <span id="ft-btn-back-text">დაბრუნება</span>
                </button>
            </div>
        </div>

        <!-- Sensory Motivational Banner -->
        <div class="ft-guidance-banner" id="ft-guidance-banner">
            <span class="ft-gb-icon">👉</span>
            <span id="ft-guidance-text">დაასრულეთ პირველი ნაბიჯი და გადაწიეთ სლაიდერი ჯილდოს მისაღებად!</span>
        </div>

        <!-- The Tactile Interactive Slider Board -->
        <div class="ft-canvas-card">
            <!-- Left Side: FIRST (Demand / Effort) -->
            <div class="ft-zone ft-zone-first" id="ft-zone-first">
                <div class="ft-zone-pill pill-first" id="ft-pill-first">1️⃣ ჯერ (მოქმედება)</div>
                
                <div class="ft-card-content" id="ft-first-card">
                    <div class="ft-card-icon" id="ft-first-icon">🍽️</div>
                    <div class="ft-card-text" id="ft-first-text">სადილის ჭამა</div>
                    <div class="ft-card-status" id="ft-first-status">
                        <span class="ft-dot-active"></span> <span id="ft-first-status-label">მიმდინარეობს</span>
                    </div>
                </div>

                <!-- ⏱️ Visual Countdown Timer Widget -->
                <div class="ft-timer-widget" id="ft-timer-widget">
                    <div class="ft-timer-ring-wrap">
                        <svg class="ft-timer-svg" viewBox="0 0 100 100">
                            <circle class="ft-timer-bg" cx="50" cy="50" r="42"></circle>
                            <circle class="ft-timer-progress" id="ft-timer-circle" cx="50" cy="50" r="42"></circle>
                        </svg>
                        <div class="ft-timer-display" id="ft-timer-display">03:00</div>
                    </div>
                    <div class="ft-timer-controls">
                        <button type="button" class="ft-timer-ctrl-btn" id="btn-ft-timer-toggle" onclick="app.toggleFirstThenTimer()" title="დაწყება / პაუზა">
                            <span id="ft-timer-btn-icon">⏸️</span>
                        </button>
                        <button type="button" class="ft-timer-ctrl-btn" onclick="app.addFirstThenTimerMinute(1)" title="+1 წუთი">
                            +1m
                        </button>
                        <button type="button" class="ft-timer-ctrl-btn" onclick="app.resetFirstThenTimer()" title="განულება">
                            🔄
                        </button>
                    </div>
                </div>

                <!-- 🧩 Micro Substeps Checklist -->
                <div class="ft-substeps-container" id="ft-substeps-container">
                    <div class="ft-substeps-title" id="ft-substeps-title">
                        <span id="ft-substeps-title-text">📝 ნაბიჯები:</span>
                        <span id="ft-substeps-counter" class="ft-substeps-badge">0/3</span>
                    </div>
                    <div class="ft-substeps-list" id="ft-substeps-list"></div>
                </div>
            </div>

            <!-- Center Track & Slider Control -->
            <div class="ft-transition-divider">
                <div class="ft-drag-track-wrap">
                    <div class="ft-drag-track" id="ft-drag-track">
                        <div class="ft-track-progress" id="ft-track-progress"></div>
                        <div class="ft-track-arrow">➔➔➔</div>
                        <div class="ft-slider-handle" id="ft-slider-handle" 
                             tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                             aria-label="Drag to unlock reward">
                            <span class="ft-handle-icon" id="ft-handle-icon">👉</span>
                        </div>
                    </div>
                    <div class="ft-track-label" id="ft-track-label">👉 გადაწიეთ მარჯვნივ დასრულებისას</div>
                </div>
            </div>

            <!-- Right Side: THEN (Reinforcer / Reward) -->
            <div class="ft-zone ft-zone-then" id="ft-zone-then">
                <div class="ft-zone-pill pill-then" id="ft-pill-then">2️⃣ შემდეგ (ჯილდო)</div>

                <!-- 🎯 Choice-Making Reinforcer Picker (ABA Standard) -->
                <div class="ft-reward-picker-wrap" id="ft-reward-picker-wrap">
                    <div class="ft-reward-picker-title" id="ft-choice-title">🎁 ჩემი ჯილდო (აირჩიეთ):</div>
                    <div class="ft-reward-choices-row" id="ft-reward-choices-row"></div>
                </div>

                <div class="ft-card-content" id="ft-then-card">
                    <div class="ft-card-icon" id="ft-then-icon">⚽</div>
                    <div class="ft-card-text" id="ft-then-text">ეზოში თამაში</div>
                    <div class="ft-card-status" id="ft-then-status">
                        <span class="ft-dot-locked">🔒</span> <span id="ft-then-status-label">ჩაკეტილი ჯილდო</span>
                    </div>
                </div>
                <!-- Interactive Veil over Reward -->
                <div class="ft-reward-veil" id="ft-reward-veil">
                    <div class="ft-veil-lock" id="ft-veil-lock">🔒</div>
                    <div class="ft-veil-hint" id="ft-veil-hint">შეასრულეთ 1-ლი ნაბიჯი გასახსნელად</div>
                </div>
            </div>
        </div>

        <!-- Success Celebration Strip (shown when completed) -->
        <div class="ft-success-card" id="ft-success-card" style="display:none;">
            <div class="ft-success-badge" id="ft-success-badge">🎉 ყოჩაღ! პირველი ნაბიჯი შესრულდა!</div>
            <div class="ft-success-praise" id="ft-success-praise">ახლა ჯილდოს მიღების დროა!</div>
            <div class="ft-success-actions">
                <button type="button" class="btn-primary-action" id="ft-btn-praise-again" onclick="app.speakCurrentFirstThenPraise()">
                    🔊 კიდევ მოსმენა
                </button>
                <button type="button" class="icon-btn" id="ft-btn-restart" onclick="app.resetFirstThenSlider()">
                    🔄 თავიდან დაწყება
                </button>
                <button type="button" class="btn-return-board" id="ft-btn-return-board" onclick="app.switchMainMode('aac')">
                    ⬅️ დაფაზე დაბრუნება
                </button>
            </div>
        </div>
        </div>
    </div>

    <!-- ========================================================
         View D: 🩺 Body Pain Map — "Where does it hurt?"
         ======================================================== -->
    <div id="pain-map-view" class="pain-map-view">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 22px; font-weight: 900; color: #0F172A;" id="body-map-title">🩺 სხეულის რუკა — „სად მტკივა?“</h2>
            <p style="font-size: 14px; color: #64748B;" id="body-map-sub">მიუთითეთ სხეულის ნაწილი და ტკივილის დონე</p>
        </div>

        <div class="pain-map-layout">
            <!-- Body parts grid -->
            <div class="body-silhouette-wrapper">
                <div class="body-parts-grid">
                    <div class="body-part-btn" data-part="head" onclick="app.selectPainZone('head', '🤕')">
                        <span style="font-size:36px;">🤕</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">თავი</span>
                    </div>
                    <div class="body-part-btn" data-part="eye" onclick="app.selectPainZone('eye', '👁️')">
                        <span style="font-size:36px;">👁️</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">თვალი</span>
                    </div>
                    <div class="body-part-btn" data-part="ear" onclick="app.selectPainZone('ear', '👂')">
                        <span style="font-size:36px;">👂</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">ყური</span>
                    </div>
                    <div class="body-part-btn" data-part="tooth" onclick="app.selectPainZone('tooth', '🦷')">
                        <span style="font-size:36px;">🦷</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">კბილი</span>
                    </div>
                    <div class="body-part-btn" data-part="throat" onclick="app.selectPainZone('throat', '🧣')">
                        <span style="font-size:36px;">🧣</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">ყელი</span>
                    </div>
                    <div class="body-part-btn" data-part="stomach" onclick="app.selectPainZone('stomach', '😣')">
                        <span style="font-size:36px;">😣</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">მუცელი</span>
                    </div>
                    <div class="body-part-btn" data-part="hand" onclick="app.selectPainZone('hand', '✋')">
                        <span style="font-size:36px;">✋</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">ხელი</span>
                    </div>
                    <div class="body-part-btn" data-part="leg" onclick="app.selectPainZone('leg', '🦵')">
                        <span style="font-size:36px;">🦵</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">ფეხი</span>
                    </div>
                    <div class="body-part-btn" data-part="back" onclick="app.selectPainZone('back', '🧍')">
                        <span style="font-size:36px;">🧍</span>
                        <span class="bp-name" style="font-size:13px; font-weight:800;">ზურგი</span>
                    </div>
                </div>
            </div>

            <!-- Pain level selector -->
            <div class="pain-level-box">
                <h4 style="font-size:16px; font-weight:900; margin-bottom:10px;" id="pain-level-label">ტკივილის დონე:</h4>
                <div class="pain-scale-selector">
                    <div class="pain-scale-btn" data-level="1" onclick="app.selectPainLevel(1, 'ოდნავ მტკივა')">
                        <span style="font-size:32px;">😐</span>
                        <span class="ps-name" style="font-size:12px; font-weight:800;">ოდნავ</span>
                    </div>
                    <div class="pain-scale-btn" data-level="2" onclick="app.selectPainLevel(2, 'საშუალოდ მტკივა')">
                        <span style="font-size:32px;">😣</span>
                        <span class="ps-name" style="font-size:12px; font-weight:800;">საშუალოდ</span>
                    </div>
                    <div class="pain-scale-btn" data-level="3" onclick="app.selectPainLevel(3, 'ძალიან მტკივა!')">
                        <span style="font-size:32px;">😭</span>
                        <span class="ps-name" style="font-size:12px; font-weight:800;">ძალიან!</span>
                    </div>
                </div>

                <div style="background:#FFFFFF; border:2px solid #CBD5E1; border-radius:14px; padding:16px; text-align:center; margin:16px 0;">
                    <div style="font-size:12px; color:#64748B; font-weight:700;" id="pain-statement-label">შეტყობინება:</div>
                    <div id="pain-statement-text" style="font-size:20px; font-weight:900; color:#DC2626; margin-top:4px;">
                        აირჩიეთ სხეულის ნაწილი რუკაზე
                    </div>
                </div>

                <button class="btn-primary-action" id="pain-add-strip-btn" style="background:#DC2626;" onclick="app.addPainToSentenceStrip()">
                    ➕ დამატება წინადადების ზოლზე
                </button>
            </div>
        </div>
    </div>

    <!-- ========================================================
         View E: ⭐ ABA Token Board
         ======================================================== -->
    <div id="token-board-view" class="token-board-view">
        <h2 style="font-size: 22px; font-weight: 900; color: #0F172A;" id="token-board-title">⭐ ABA ვარსკვლავების წახალისების დაფა</h2>
        <p style="font-size: 14px; color: #64748B;" id="token-board-sub">შეაგროვეთ ვარსკვლავები სასურველი ჯილდოს მისაღებად</p>

        <div style="max-width:360px; margin:16px auto; display:flex; gap:10px; align-items:center;">
            <label style="font-size:13px; font-weight:800;" id="token-target-label">სამიზნე / ჯილდო:</label>
            <input type="text" id="token-reward-input" class="form-control" value="ბურთით თამაში ⚽" placeholder="მაგ: ბურთი, iPad, მანქანა...">
        </div>

        <div style="display:flex; justify-content:center; gap:8px; margin-bottom:16px;">
            <button class="icon-btn" id="token-btn-3" onclick="app.initTokenBoard(3)">3 ვარსკვლავი</button>
            <button class="icon-btn" id="token-btn-5" onclick="app.initTokenBoard(5)">5 ვარსკვლავი</button>
            <button class="icon-btn" id="token-btn-10" onclick="app.initTokenBoard(10)">10 ვარსკვლავი</button>
        </div>

        <!-- Token Stars Tray -->
        <div id="token-stars-tray" class="token-stars-tray"></div>

        <button class="btn-clear" id="token-btn-reset" style="margin:0 auto;" onclick="app.resetTokenBoard()">
            🔄 დაფის განულება
        </button>
    </div>

    <!-- ========================================================
         View F: 📅 Visual Daily Schedule (Chalkboard Oak Frame)
         ======================================================== -->
    <div id="schedule-view" class="schedule-view aac-mode-view">
        <div class="ft-chalkboard-canvas schedule-chalkboard-canvas">
            <!-- Header Toolbar -->
            <div class="ft-board-header">
                <div class="ft-header-left">
                    <span class="ft-header-badge" id="schedule-title">📅 დღის ვიზუალური განრიგი</span>
                    <span class="ft-source-badge" id="schedule-badge-tag">✨ რუტინა</span>
                </div>
                <div class="ft-header-actions">
                    <div class="schedule-presets-bar">
                        <button type="button" class="preset-pill active" data-preset="morning" onclick="app.setSchedulePreset('morning')">🌅 <span id="sched-preset-morning">დილა</span></button>
                        <button type="button" class="preset-pill" data-preset="school" onclick="app.setSchedulePreset('school')">🎒 <span id="sched-preset-school">სკოლა</span></button>
                        <button type="button" class="preset-pill" data-preset="evening" onclick="app.setSchedulePreset('evening')">🌙 <span id="sched-preset-evening">საღამო</span></button>
                    </div>
                    <button type="button" class="ft-action-btn ft-btn-return" onclick="app.switchMainMode('aac')" title="⬅️ დაფაზე დაბრუნება">
                        <span>⬅️</span> <span id="sched-btn-back-text">დაბრუნება</span>
                    </button>
                </div>
            </div>

            <!-- Sensory Guidance Banner -->
            <div class="ft-guidance-banner">
                <span class="ft-gb-icon">👉</span>
                <span id="schedule-sub">შეასრულეთ ნაბიჯები თანმიმდევრობით, მონიშნეთ და ისიამოვნეთ წარმატებით!</span>
            </div>

            <!-- Progress Card on Chalkboard -->
            <div class="schedule-progress-card">
                <div class="schedule-progress-label">
                    <span id="schedule-progress-text">პროგრესი: 0 / 5 შესრულებულია</span>
                    <span id="schedule-progress-percent" style="font-weight:900; color:#10B981;">0%</span>
                </div>
                <div class="schedule-progress-bar-bg">
                    <div id="schedule-progress-bar-fill" class="schedule-progress-bar-fill" style="width: 0%;"></div>
                </div>
            </div>

            <!-- Schedule Timeline Cards -->
            <div id="schedule-timeline" class="schedule-timeline"></div>

            <!-- Bottom Actions -->
            <div class="schedule-bottom-actions" style="display: flex; justify-content: center; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
                <button type="button" class="btn-primary-action sched-btn-done" style="max-width: 280px;" onclick="app.checkAllScheduleSteps()">
                    🎉 ყველაფერი შესრულდა!
                </button>
                <button type="button" class="ft-action-btn ft-btn-change" style="padding: 10px 20px; font-size: 13px;" onclick="app.resetSchedule()">
                    🔄 განრიგის განულება
                </button>
            </div>
        </div>
    </div>

    <!-- ========================================================
         View G: 🎮 Find the Card — Interactive Learning Game (Chalkboard Oak Frame)
         ======================================================== -->
    <div id="game-view" class="game-view aac-mode-view">
        <div class="ft-chalkboard-canvas game-chalkboard-canvas">
            <!-- Header Toolbar -->
            <div class="ft-board-header">
                <div class="ft-header-left">
                    <span class="ft-header-badge" id="game-title">🎮 Find the Card Game</span>
                    <span class="ft-source-badge" id="game-badge-tag">🎯 Receptive Language</span>
                </div>
                <div class="ft-header-actions">
                    <div class="game-score-badge">
                        <span id="game-score-label">⭐ ქულა:</span>
                        <span id="game-score-val" style="font-size:20px; font-weight:900; color:#FEF08A;">0</span>
                    </div>
                    <button type="button" class="ft-action-btn ft-btn-listen" id="game-btn-repeat" onclick="app.repeatGameAudioPrompt()" title="🔊 გაუმეორე კითხვა">
                        <span>🔊</span> <span id="game-btn-repeat-text">გაუმეორე</span>
                    </button>
                    <button type="button" class="ft-action-btn ft-btn-return" id="game-btn-back" onclick="app.switchMainMode('aac')" title="⬅️ დაფაზე დაბრუნება">
                        <span>⬅️</span> <span id="game-btn-back-text">დაბრუნება</span>
                    </button>
                </div>
            </div>

            <!-- Sensory Guidance / Game Task Banner -->
            <div class="game-task-banner">
                <div class="game-avatar-wrap">🦉</div>
                <div class="game-task-text-wrap">
                    <div class="game-task-instruction" id="game-task-instruction">მოუსმინე და იპოვე სწორი ბარათი:</div>
                    <div class="game-task-target" id="game-task-target">„იპოვე ბარათი 🎯“</div>
                </div>
                <button type="button" class="ft-action-btn ft-btn-listen game-banner-repeat-btn" id="game-banner-repeat-btn" style="padding: 9px 18px; font-size: 13px;" onclick="app.repeatGameAudioPrompt()">
                    <span>🔊</span> <span id="game-banner-repeat-text">გაუმეორე</span>
                </button>
            </div>

            <!-- Game Cards Field -->
            <div class="game-cards-field" id="game-cards-field">
                <!-- Game Choice Cards Area -->
            </div>

            <!-- Bottom Actions -->
            <div class="game-bottom-actions" style="display:flex; justify-content:center; gap:12px; margin-top:20px; flex-wrap: wrap;">
                <button type="button" class="btn-primary-action game-btn-next" id="game-btn-next" style="max-width:240px;" onclick="app.startNewGameRound()">
                    <span>✨</span> <span id="game-btn-next-text">შემდეგი რაუნდი</span>
                </button>
                <button type="button" class="ft-action-btn ft-btn-change game-btn-reset" id="game-btn-reset" style="padding: 10px 20px; font-size: 13px;" onclick="app.resetGame()">
                    <span>🔄</span> <span id="game-btn-reset-text">თავიდან დაწყება</span>
                </button>
            </div>
        </div>
    </div>

    </div><!-- #clinical-tools-wrapper -->

    <!-- 4. Therapist Bottom Bar -->
    <!-- 4. Therapist Bottom Bar -->
    <footer class="therapist-bottom-bar" id="therapist-bottom-bar" style="display: none;">
        <button id="tb-btn-lock" class="tb-btn tb-lock" onclick="app.toggleChildLock()" title="🛡️ ეკრანის დაცვა (Child Lock)">
            <span class="tb-icon">🔒</span>
            <span class="tb-label" id="tb-label-lock">დაცვა</span>
        </button>
        <button id="tb-btn-picker" class="tb-btn tb-picker" onclick="app.openQuickCardPickerModal()" title="🎴 სამიზნე / დისტრაქტორი ბარათის არჩევა">
            <span class="tb-icon">🎴</span>
            <span class="tb-label" id="tb-label-picker">ბარათი</span>
        </button>
        <button id="tb-btn-phase" class="tb-btn tb-phase" onclick="app.openPhaseSwitcherModal()" title="🎓 სასწავლო ეტაპის შეცვლა (1-6)">
            <span class="tb-icon">🎓</span>
            <span id="tb-phase-label" class="tb-label">ეტაპი IV</span>
        </button>
        <button id="tb-btn-prompt" class="tb-btn tb-prompt" onclick="app.openPromptLevelModal()" title="🤝 ABA დახმარების დონე (დამოუკიდებელი, ნაწილობრივი, სრული)">
            <span id="tb-prompt-icon" class="tb-icon">🟢</span>
            <span id="tb-prompt-label" class="tb-label">დამოუკიდებლად</span>
        </button>
        <button id="tb-btn-clear" class="tb-btn tb-clear" onclick="app.clearBoardOrStrip()" title="🗑️ დაფის / ზოლის გასუფთავება">
            <span class="tb-icon">🗑️</span>
            <span class="tb-label" id="tb-label-clear">გასუფთავება</span>
        </button>
        <button id="tb-btn-studio" class="tb-btn tb-studio" onclick="app.openParentalGate()" title="⚙️ მშობლისა და თერაპევტის სტუდია (ანალიტიკა, ბარათები, პარამეტრები)">
            <span class="tb-icon">⚙️</span>
            <span class="tb-label" id="tb-label-studio">სტუდია</span>
        </button>
    </footer>

    <!-- ========================================================
         Handover Interactive Animation Modal
         ======================================================== -->
    <div id="handover-overlay" class="handover-overlay" onclick="if(event.target===this) this.classList.remove('active')">
        <div class="handover-card-box">
            <button class="modal-close-btn" onclick="document.getElementById('handover-overlay').classList.remove('active')" title="დახურვა">✕</button>
            <div class="handover-avatar-wrap">
                <div class="handover-avatar-glow">👩‍🏫</div>
                <div class="handover-sparkle s1">✨</div>
                <div class="handover-sparkle s2">⭐</div>
            </div>
            <h3 class="handover-title">ბარათის გადაცემა პარტნიორს</h3>
            <p class="handover-subtitle">კომუნიკაციური გაცვლა &middot; ეტაპი 4-6</p>
            
            <div class="handover-tray-frame">
                <div id="handover-strip-content" class="handover-strip-visual"></div>
            </div>

            <div id="handover-partner-response" class="handover-partner-bubble">
                <span class="h-response-label">პარტნიორი ისმენს მოთხოვნას...</span>
            </div>
        </div>
    </div>

    <!-- ========================================================
         🎉 Celebration & Clinical Feedback Modal
         ======================================================== -->
    <div id="modal-celebration" class="modal-backdrop celebration-backdrop">
        <div class="celebration-box">
            <!-- Floating Confetti Canvas -->
            <canvas id="celebration-confetti-canvas" class="confetti-canvas"></canvas>

            <div class="celebration-badge-wrap">
                <div class="celebration-avatar-glow" id="celebration-avatar">🎉</div>
            </div>

            <h2 id="celebration-title" class="celebration-title">🎉 ყოჩაღ!</h2>
            <div id="celebration-subtitle" class="celebration-subtitle">აქტივობა წარმატებით შესრულდა!</div>

            <!-- Visual Task & Reward Cards -->
            <div id="celebration-visual-cards" class="celebration-cards-row" style="display:none;"></div>

            <div id="celebration-message" class="celebration-message"></div>

            <button id="celebration-confirm-btn" class="celebration-btn" onclick="app.closeCelebration()">
                ✨ შესანიშნავია!
            </button>
        </div>
    </div>

    <!-- ========================================================
         🏆 Judge & Evaluator Demo Tour (30-Second Showcase)
         ======================================================== -->
    <div id="modal-judge-tour" class="modal-backdrop" onclick="if(event.target===this) app.closeModal('modal-judge-tour')">
        <div class="modal-box" style="max-width: 660px; padding: 22px 24px; border-radius: 20px; border: 2.5px solid #FCD34D; box-shadow: 0 20px 50px rgba(15,23,42,0.25);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:28px;">🏆</span>
                    <div>
                        <h2 class="modal-title" id="tour-modal-title" style="margin:0; font-size:18px; font-weight:900; color:#0F172A;">Judge & Evaluator Tour (30s Showcase)</h2>
                        <span id="tour-modal-sub" style="font-size:12px; color:#64748B;">Nebius x NVIDIA AI Hackathon • 6 Live Clinical & Multimodal Milestones</span>
                    </div>
                </div>
                <button class="modal-close-btn" onclick="app.closeModal('modal-judge-tour')" style="position:static;">✕</button>
            </div>

            <div class="tour-cards-container" style="display:flex; flex-direction:column; gap:10px;">
                <!-- Step 1 -->
                <div class="tour-step-card" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; background:#F8FAFC; border:1.5px solid #E2E8F0; border-left:4.5px solid #3B82F6; border-radius:12px;">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="background:#DBEAFE; color:#1D4ED8; font-weight:900; font-size:10px; padding:2px 6px; border-radius:4px;">STEP 1</span>
                            <strong style="font-size:13px; color:#0F172A;" id="tour-s1-title">🗣️ Real-Time SVO Speech & Handover</strong>
                        </div>
                        <p style="margin:3px 0 0 0; font-size:11.5px; color:#64748B;" id="tour-s1-desc">Tap communication cards to construct SVO carrier sentences with zero-latency speech synthesis.</p>
                    </div>
                    <button type="button" class="btn-primary-action" onclick="app.runJudgeTourStep(1)" style="width:auto; padding:8px 14px; font-size:12px; background:#2563EB; white-space:nowrap;" id="tour-s1-btn">
                        ▶️ Test Speech
                    </button>
                </div>

                <!-- Step 2 -->
                <div class="tour-step-card" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; background:#F0FDF4; border:1.5px solid #BBF7D0; border-left:4.5px solid #10B981; border-radius:12px;">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="background:#DCFCE7; color:#15803D; font-weight:900; font-size:10px; padding:2px 6px; border-radius:4px;">STEP 2</span>
                            <strong style="font-size:13px; color:#0F172A;" id="tour-s2-title">🧠 Nemotron 3 Ultra Clinical Report</strong>
                        </div>
                        <p style="margin:3px 0 0 0; font-size:11.5px; color:#64748B;" id="tour-s2-desc">Transforms longitudinal telemetry into a sign-off ready BCBA progress report with Action Directives at top.</p>
                    </div>
                    <button type="button" class="btn-primary-action" onclick="app.runJudgeTourStep(2)" style="width:auto; padding:8px 14px; font-size:12px; background:#059669; white-space:nowrap;" id="tour-s2-btn">
                        🚀 Launch Report
                    </button>
                </div>

                <!-- Step 3 -->
                <div class="tour-step-card" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; background:#F5F3FF; border:1.5px solid #DDD6FE; border-left:4.5px solid #8B5CF6; border-radius:12px;">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="background:#EDE9FE; color:#6D28D9; font-weight:900; font-size:10px; padding:2px 6px; border-radius:4px;">STEP 3</span>
                            <strong style="font-size:13px; color:#0F172A;" id="tour-s3-title">📸 Physical AI & Vision Room Scanner</strong>
                        </div>
                        <p style="margin:3px 0 0 0; font-size:11.5px; color:#64748B;" id="tour-s3-desc">Real-world camera computer vision recognizes physical objects and converts them into AAC cards instantly.</p>
                    </div>
                    <button type="button" class="btn-primary-action" onclick="app.runJudgeTourStep(3)" style="width:auto; padding:8px 14px; font-size:12px; background:#7C3AED; white-space:nowrap;" id="tour-s3-btn">
                        📷 Test Scanner
                    </button>
                </div>

                <!-- Step 4 -->
                <div class="tour-step-card" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; background:#FFFBEB; border:1.5px solid #FDE68A; border-left:4.5px solid #F59E0B; border-radius:12px;">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="background:#FEF3C7; color:#B45309; font-weight:900; font-size:10px; padding:2px 6px; border-radius:4px;">STEP 4</span>
                            <strong style="font-size:13px; color:#0F172A;" id="tour-s4-title">🔄 Premack First-Then AI (Nemotron Nano)</strong>
                        </div>
                        <p style="margin:3px 0 0 0; font-size:11.5px; color:#64748B;" id="tour-s4-desc">Decomposes natural parental language into visual micro-steps, countdown timers, and reward choices.</p>
                    </div>
                    <button type="button" class="btn-primary-action" onclick="app.runJudgeTourStep(4)" style="width:auto; padding:8px 14px; font-size:12px; background:#D97706; white-space:nowrap;" id="tour-s4-btn">
                        ✨ Try First-Then
                    </button>
                </div>

                <!-- Step 5 -->
                <div class="tour-step-card" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; background:#EFF6FF; border:1.5px solid #BFDBFE; border-left:4.5px solid #2563EB; border-radius:12px;">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="background:#DBEAFE; color:#1D4ED8; font-weight:900; font-size:10px; padding:2px 6px; border-radius:4px;">STEP 5</span>
                            <strong style="font-size:13px; color:#0F172A;" id="tour-s5-title">🏛️ Multi-Agent Clinical Council (SLP + BCBA + OT)</strong>
                        </div>
                        <p style="margin:3px 0 0 0; font-size:11.5px; color:#64748B;" id="tour-s5-desc">Convenes 3 specialized AI clinicians (Speech, Behavior, Occupational) to analyze session telemetry and synthesize a unified 7-day plan.</p>
                    </div>
                    <button type="button" class="btn-primary-action" onclick="app.runJudgeTourStep(5)" style="width:auto; padding:8px 14px; font-size:12px; background:#2563EB; white-space:nowrap;" id="tour-s5-btn">
                        🧠 Convene Council
                    </button>
                </div>
                <!-- Step 6 -->
                <div class="tour-step-card" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; background:#FAF5FF; border:1.5px solid #E9D5FF; border-left:4.5px solid #9333EA; border-radius:12px;">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="background:#F3E8FF; color:#7E22CE; font-weight:900; font-size:10px; padding:2px 6px; border-radius:4px;">STEP 6</span>
                            <strong style="font-size:13px; color:#0F172A;" id="tour-s6-title">📖 AI Social Stories (Carol Gray Method)</strong>
                        </div>
                        <p style="margin:3px 0 0 0; font-size:11.5px; color:#64748B;" id="tour-s6-desc">Generates clinical 4-step visual stories with Nemotron 3 Ultra to prepare children for anxiety-inducing events.</p>
                    </div>
                    <button type="button" class="btn-primary-action" onclick="app.runJudgeTourStep(6)" style="width:auto; padding:8px 14px; font-size:12px; background:#9333EA; white-space:nowrap;" id="tour-s6-btn">
                        ✨ Create Story
                    </button>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:12px; border-top:1px solid #E2E8F0; font-size:12px; color:#64748B;">
                <span>💡 Click any step above to launch live interaction immediately.</span>
                <button type="button" class="icon-btn" onclick="app.closeModal('modal-judge-tour')" style="font-size:12px; font-weight:800;">Close Tour ✕</button>
            </div>
        </div>
    </div>

    <!-- ========================================================
         🧘 Emotional Self-Regulation & Calming Zone (Zones of Regulation)
         ======================================================== -->
    <div id="modal-regulation" class="modal-backdrop" onclick="if(event.target===this) app.closeModal('modal-regulation')">
        <div class="modal-box" style="max-width: 620px;">
            <button class="modal-close-btn" onclick="app.closeModal('modal-regulation')">✕</button>
            <h2 class="modal-title" id="regulation-modal-title">🧘 როგორ ვგრძნობ თავს? (ემოციური თვითრეგულაცია)</h2>
            <p class="modal-subtitle" id="regulation-modal-sub">განსაზღვრეთ ემოციური ზონა და აირჩიეთ დამამშვიდებელი სტრატეგია</p>

            <div class="zones-selector-grid">
                <div class="zone-card zone-green" onclick="app.selectEmotionalZone('green')">
                    <span class="zone-icon">😊</span>
                    <span class="zone-title" id="zone-title-green">მწვანე ზონა</span>
                    <span class="zone-desc" id="zone-desc-green">მშვიდი, ბედნიერი, მზად სასწავლად</span>
                </div>
                <div class="zone-card zone-blue" onclick="app.selectEmotionalZone('blue')">
                    <span class="zone-icon">😔</span>
                    <span class="zone-title" id="zone-title-blue">ლურჯი ზონა</span>
                    <span class="zone-desc" id="zone-desc-blue">დაღლილი, მოწყენილი, დაბალი ენერგია</span>
                </div>
                <div class="zone-card zone-yellow" onclick="app.selectEmotionalZone('yellow')">
                    <span class="zone-icon">😟</span>
                    <span class="zone-title" id="zone-title-yellow">ყვითელი ზონა</span>
                    <span class="zone-desc" id="zone-desc-yellow">შეშფოთებული, გადაღლილი, აღელვებული</span>
                </div>
                <div class="zone-card zone-red" onclick="app.selectEmotionalZone('red')">
                    <span class="zone-icon">😡</span>
                    <span class="zone-title" id="zone-title-red">წითელი ზონა</span>
                    <span class="zone-desc" id="zone-desc-red">გაბრაზებული, აფეთქებული, მჭირდება დახმარება</span>
                </div>
            </div>

            <!-- Calming Deep Breathing Animation -->
            <div class="breathing-exercise-container">
                <div class="breathing-bubble-wrapper">
                    <div id="breathing-circle" class="breathing-circle">
                        <span id="breathing-text">ჩაისუნთქე...</span>
                    </div>
                </div>
                <div style="text-align:center; margin-top:8px;">
                    <button class="icon-btn" style="display:inline-flex; margin:0 auto;" onclick="app.toggleBreathingExercise()">
                        🫁 <span id="breathing-btn-text">სუნთქვის დაწყება</span>
                    </button>
                </div>
            </div>

            <!-- Sensory Calming Action Cards -->
            <div style="margin-top:16px;">
                <div id="regulation-tools-title" style="font-size:13px; font-weight:800; color:#475569; margin-bottom:8px;">💡 სენსორული დამამშვიდებელი საშუალებები:</div>
                <div class="calming-tools-row">
                    <button class="calming-tool-btn" data-tool="water" onclick="app.applyCalmingTool('water')">
                        <span>💧</span> <span class="ct-label" id="ct-label-water">წყალი</span>
                    </button>
                    <button class="calming-tool-btn" data-tool="headphones" onclick="app.applyCalmingTool('headphones')">
                        <span>🎧</span> <span class="ct-label" id="ct-label-headphones">ყურსასმენები</span>
                    </button>
                    <button class="calming-tool-btn" data-tool="hug" onclick="app.applyCalmingTool('hug')">
                        <span>🫂</span> <span class="ct-label" id="ct-label-hug">ჩახუტება</span>
                    </button>
                    <button class="calming-tool-btn" data-tool="fidget" onclick="app.applyCalmingTool('fidget')">
                        <span>🧸</span> <span class="ct-label" id="ct-label-fidget">სათამაშო</span>
                    </button>
                    <button class="calming-tool-btn" data-tool="quiet" onclick="app.applyCalmingTool('quiet')">
                        <span>🛌</span> <span class="ct-label" id="ct-label-quiet">მშვიდი სივრცე</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ========================================================
         💬 Quick Social Chat (Quick Chat)
         ======================================================== -->
    <div id="modal-quickchat" class="modal-backdrop">
        <div class="modal-box" style="max-width: 500px;">
            <button class="modal-close-btn" onclick="app.closeModal('modal-quickchat')">✕</button>
            <h2 class="modal-title" id="quickchat-modal-title">💬 სწრაფი სოციალური ფრაზები</h2>
            <p class="modal-subtitle" id="quickchat-modal-sub">ყოველდღიური მყისიერი ფრაზები ერთი შეხებით</p>

            <div class="quick-phrases-grid">
                <button class="quick-phrase-card type-social" data-quick="hello" onclick="app.speakQuickPhrase(app.isEn() ? 'Hello!' : 'გამარჯობა!')">
                    <span class="qp-icon">👋</span>
                    <span class="qp-text" id="qp-txt-hello">გამარჯობა!</span>
                </button>
                <button class="quick-phrase-card type-social" data-quick="goodbye" onclick="app.speakQuickPhrase(app.isEn() ? 'Goodbye!' : 'ნახვამდის!')">
                    <span class="qp-icon">🙋</span>
                    <span class="qp-text" id="qp-txt-goodbye">ნახვამდის!</span>
                </button>
                <button class="quick-phrase-card type-social" data-quick="howareyou" onclick="app.speakQuickPhrase(app.isEn() ? 'How are you?' : 'როგორ ხარ?')">
                    <span class="qp-icon">😊</span>
                    <span class="qp-text" id="qp-txt-howareyou">როგორ ხარ?</span>
                </button>
                <button class="quick-phrase-card type-social" data-quick="thankyou" onclick="app.speakQuickPhrase(app.isEn() ? 'Thank you!' : 'მადლობა!')">
                    <span class="qp-icon">🙏</span>
                    <span class="qp-text" id="qp-txt-thankyou">მადლობა!</span>
                </button>
                <button class="quick-phrase-card type-social" data-quick="sorry" onclick="app.speakQuickPhrase(app.isEn() ? 'Sorry' : 'ბოდიში')">
                    <span class="qp-icon">🤝</span>
                    <span class="qp-text" id="qp-txt-sorry">ბოდიში</span>
                </button>
                <button class="quick-phrase-card type-verb" data-quick="likeit" onclick="app.speakQuickPhrase(app.isEn() ? 'I like it!' : 'მომწონს!')">
                    <span class="qp-icon">👍</span>
                    <span class="qp-text" id="qp-txt-likeit">მომწონს!</span>
                </button>
                <button class="quick-phrase-card type-basic" data-quick="dontlike" onclick="app.speakQuickPhrase(app.isEn() ? 'I do not like it' : 'არ მომწონს')">
                    <span class="qp-icon">👎</span>
                    <span class="qp-text" id="qp-txt-dontlike">არ მომწონს</span>
                </button>
                <button class="quick-phrase-card type-basic" data-quick="helpme" onclick="app.speakQuickPhrase(app.isEn() ? 'Please help me' : 'დამეხმარე')">
                    <span class="qp-icon">🆘</span>
                    <span class="qp-text" id="qp-txt-helpme">დამეხმარე</span>
                </button>
                <button class="quick-phrase-card type-social" data-quick="love" onclick="app.speakQuickPhrase(app.isEn() ? 'I love you!' : 'მიყვარხარ!')">
                    <span class="qp-icon">💖</span>
                    <span class="qp-text" id="qp-txt-love">მიყვარხარ!</span>
                </button>
                <button class="quick-phrase-card type-basic" data-quick="leaveme" onclick="app.speakQuickPhrase(app.isEn() ? 'Please leave me alone' : 'თავი დამანებე')">
                    <span class="qp-icon">🛑</span>
                    <span class="qp-text" id="qp-txt-leaveme">თავი დამანებე</span>
                </button>
            </div>
        </div>
    </div>

    <!-- ========================================================
         Modal: Visual Countdown Timer
         ======================================================== -->
    <div id="modal-timer" class="modal-backdrop">
        <div class="modal-box" style="max-width: 420px; text-align: center;">
            <button class="modal-close-btn" onclick="app.closeModal('modal-timer')">✕</button>
            <h2 class="modal-title" id="timer-modal-title">⏱️ ვიზუალური ტაიმერი</h2>
            <p class="modal-subtitle" id="timer-modal-sub">დროის პროგნოზირებადი აღქმა აუტისტური სპექტრისთვის</p>

            <div class="timer-circle-wrap">
                <svg class="timer-circle-svg" width="200" height="200">
                    <circle class="timer-bg-path" cx="100" cy="100" r="85"></circle>
                    <circle id="timer-progress-path" class="timer-progress-path" cx="100" cy="100" r="85" stroke-dasharray="534" stroke-dashoffset="0"></circle>
                </svg>
                <div id="timer-time-display" class="timer-time-display">02:00</div>
            </div>

            <div class="timer-presets">
                <button class="icon-btn timer-preset-btn" data-min="1" onclick="app.setTimerPreset(1)">1 წუთი</button>
                <button class="icon-btn timer-preset-btn" data-min="2" onclick="app.setTimerPreset(2)">2 წუთი</button>
                <button class="icon-btn timer-preset-btn" data-min="5" onclick="app.setTimerPreset(5)">5 წუთი</button>
                <button class="icon-btn timer-preset-btn" data-min="10" onclick="app.setTimerPreset(10)">10 წუთი</button>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn-primary-action" id="timer-btn-start" style="flex:1;" onclick="app.startTimer()">▶️ დაწყება</button>
                <button class="icon-btn" id="timer-btn-pause" onclick="app.pauseTimer()">⏸️ პაუზა</button>
                <button class="btn-clear" id="timer-btn-reset" onclick="app.resetTimer()">🔄</button>
            </div>
        </div>
    </div>

    <!-- ========================================================
         Modal: On-Screen Typing Keyboard
         ======================================================== -->
    <div id="modal-keyboard" class="modal-backdrop">
        <div class="modal-box" style="max-width: 680px;">
            <button class="modal-close-btn" onclick="app.closeModal('modal-keyboard')">✕</button>
            <h2 class="modal-title" id="keyboard-modal-title">⌨️ ეკრანის კლავიატურა (აკრეფა)</h2>
            <p class="modal-subtitle" id="keyboard-modal-sub">ასო-ასო აკრეფა და გახმოვანება</p>

            <div class="geo-keyboard-box">
                <div id="keyboard-text-display" class="keyboard-text-display">
                    დააჭირეთ ასოებს ასაკრეფად...
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                    <button class="btn-speak" id="kb-btn-speak" style="min-height:44px; padding:8px 16px;" onclick="app.keyboardSpeak()">🔊 მოსმენა</button>
                    <button class="icon-btn" id="kb-btn-space" onclick="app.keyboardSpace()">␣ გამოტოვება</button>
                    <button class="icon-btn" id="kb-btn-del" onclick="app.keyboardBackspace()">⌫ წაშლა</button>
                    <button class="btn-clear" id="kb-btn-clear" style="min-height:44px; padding:8px 12px;" onclick="app.keyboardClear()">🗑️ გასუფთავება</button>
                    <button class="btn-primary-action" id="kb-btn-strip" style="padding:8px 16px; margin-left:auto; width:auto;" onclick="app.addKeyboardTextToStrip()">➕ ზოლზე დამატება</button>
                </div>

                <div id="geo-keys-grid" class="geo-keys-grid"></div>
            </div>
        </div>
    </div>

    <!-- ========================================================
         Modal: SOS Emergency Beacon
         ======================================================== -->
    <div id="modal-sos" class="modal-backdrop">
        <div class="modal-box" style="max-width: 480px; text-align: center;">
            <button class="modal-close-btn" onclick="app.closeModal('modal-sos')">✕</button>
            <div class="sos-beacon-box">
                <div style="font-size: 52px; margin-bottom: 8px;">🆘</div>
                <h2 style="font-size: 24px; font-weight: 900; color: #DC2626; margin-bottom: 8px;" id="sos-help-heading">
                    გთხოვთ დამეხმაროთ!
                </h2>
                <p style="font-size: 15px; font-weight: 800; color: #1E293B; line-height: 1.4;" id="sos-intro-p">
                    მე მქვია <strong id="sos-child-name">დაჩი</strong>. მე ვსაუბრობ ამ საკომუნიკაციო დაფის დახმარებით.
                </p>

                <div style="font-size: 13px; font-weight: 800; color: #64748B; margin-top: 14px;" id="sos-call-label">
                    გთხოვთ დაურეკოთ ჩემს მშობელს:
                </div>
                <div id="sos-parent-phone" class="sos-phone-display">599 00 00 00</div>

                <button class="btn-primary-action" id="sos-speak-btn" style="background:#DC2626; font-size:16px; padding:14px;" onclick="app.playSosVoice()">
                    🔊 გადაუდებელი შეტყობინების გაჟღერება
                </button>
            </div>
        </div>
    </div>

    <!-- 📱 Mobile Action Drawer / Bottom Sheet (Exclusive for Mobile) -->
    <div id="modal-mobile-menu" class="modal-backdrop modal-mobile-drawer-backdrop" onclick="if(event.target===this) app.closeMobileMenu()">
        <div class="mobile-drawer-box">
            <div class="mobile-drawer-drag-handle"></div>
            <div class="mobile-drawer-header">
                <div class="mobile-drawer-profile" onclick="app.closeMobileMenu(); app.openQuickProfileSwitcherModal();">
                    <span class="mdp-avatar">🧒</span>
                    <div class="mdp-info">
                        <span class="mdp-name" id="drawer-child-name">დაჩი</span>
                        <span class="mdp-hint" id="drawer-profile-hint">პროფილი &amp; პარამეტრები ›</span>
                    </div>
                </div>
                <div class="mobile-drawer-top-actions">
                    <button type="button" class="mobile-drawer-fs-btn" id="drawer-fs-btn" onclick="app.toggleFullscreen()" title="სრული ეკრანი">⛶</button>
                    <button type="button" class="mobile-drawer-close-btn" id="drawer-close-btn" onclick="app.closeMobileMenu()" title="დახურვა">✕</button>
                </div>
            </div>

            <div class="mobile-drawer-grid">
                <button type="button" class="md-tile" id="drawer-tile-board" onclick="app.closeMobileMenu(); app.switchMainMode('aac');">
                    <span class="md-icon">🏠</span>
                    <span class="md-label" id="drawer-board-label">დაფა</span>
                </button>
                <button type="button" class="md-tile" id="drawer-tile-record" onclick="app.closeMobileMenu(); app.openExpressVoiceStudio();">
                    <span class="md-icon">🎙️</span>
                    <span class="md-label" id="drawer-record-label">ჩაწერა</span>
                </button>
                <button type="button" class="md-tile" id="drawer-tile-audio" onclick="app.closeMobileMenu(); app.testHeadSound();">
                    <span class="md-icon">🔊</span>
                    <span class="md-label" id="drawer-audio-label">ხმა</span>
                </button>
                <button type="button" class="md-tile md-tile-sos" id="drawer-tile-sos" onclick="app.closeMobileMenu(); app.openSosModal();" title="🆘 გადაუდებელი დახმარება">
                    <span class="md-icon">🆘</span>
                    <span class="md-label" id="drawer-sos-label">SOS</span>
                </button>
                <button type="button" class="md-tile" id="drawer-tile-schedule" onclick="app.closeMobileMenu(); app.switchMainMode('schedule');">
                    <span class="md-icon">📅</span>
                    <span class="md-label" id="drawer-schedule-label">განრიგი</span>
                </button>
                <button type="button" class="md-tile" id="drawer-tile-timer" onclick="app.closeMobileMenu(); app.openTimerModal();">
                    <span class="md-icon">⏳</span>
                    <span class="md-label" id="drawer-timer-label">ტაიმერი</span>
                </button>
                <button type="button" class="md-tile" id="drawer-tile-ai" onclick="app.closeMobileMenu(); app.openAiConfig();">
                    <span class="md-icon">✨</span>
                    <span class="md-label" id="drawer-ai-label">Voxis AI</span>
                </button>
                <button type="button" class="md-tile" id="drawer-tile-game" onclick="app.closeMobileMenu(); app.switchMainMode('game');">
                    <span class="md-icon">🎮</span>
                    <span class="md-label" id="drawer-game-label">თამაში</span>
                </button>
                <button type="button" class="md-tile" id="drawer-tile-studio" onclick="app.closeMobileMenu(); app.openParentalGate();">
                    <span class="md-icon">⚙️</span>
                    <span class="md-label" id="drawer-studio-label">სტუდია</span>
                </button>
            </div>
        </div>
    </div>

    <!-- ========================================================
         Modal: Parental Security Gate & Child Lock Unlock
         ======================================================== -->
    <div id="modal-gate" class="modal-backdrop" onclick="if(event.target===this) app.closeModal('modal-gate')">
        <div class="modal-box parental-gate-box" style="max-width: 420px; text-align: center; border-radius: 28px; padding: 28px 24px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.4); border: 3px solid #E2E8F0;">
            <button class="modal-close-btn" onclick="app.closeModal('modal-gate')" title="დახურვა">✕</button>
            <div id="gate-icon-badge" class="gate-icon-badge" style="width: 64px; height: 64px; margin: 0 auto 12px; background: linear-gradient(135deg, #CCFBF1, #99F6E4); border: 2.5px solid #14B8A6; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: 0 6px 18px rgba(20, 184, 166, 0.25);">🛡️</div>
            <h2 class="modal-title" id="gate-title" style="font-size: 20px; font-weight: 900; color: #0F172A; margin-bottom: 6px;">მშობლის კარიბჭე</h2>
            <p class="modal-subtitle" id="gate-subtitle" style="font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 16px; line-height: 1.4;">გთხოვთ ამოხსნათ მარტივი ამოცანა სტუდიაში შესასვლელად:</p>
            
            <div class="gate-math-card" style="background: #F8FAFC; border: 2px dashed #99F6E4; border-radius: 18px; padding: 14px 20px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px; font-weight: 900; color: #0F766E; letter-spacing: 2px;" id="gate-question">3 + 4 = ?</span>
            </div>

            <div class="form-group" style="margin-bottom: 14px;">
                <input type="number" id="gate-input" class="form-control" style="text-align: center; font-size: 26px; font-weight: 900; letter-spacing: 2px; height: 52px; border-radius: 16px; border: 2.5px solid #CBD5E1; color: #0F172A; width: 100%; box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);" placeholder="?" onkeydown="if(event.key==='Enter') app.checkParentalGate()" autofocus>
            </div>

            <!-- Touch Numpad for Instant Tablet / Mobile Response -->
            <div class="gate-numpad-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('1')">1</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('2')">2</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('3')">3</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('4')">4</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('5')">5</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('6')">6</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('7')">7</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('8')">8</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('9')">9</button>
                <button type="button" class="gate-num-btn gate-num-clear" onclick="app.clearGateInput()" style="background: #FEE2E2; color: #DC2626; border-color: #FCA5A5;">⌫</button>
                <button type="button" class="gate-num-btn" onclick="app.appendGateInput('0')">0</button>
                <button type="button" class="gate-num-btn gate-num-ok" onclick="app.checkParentalGate()" style="background: #DCFCE7; color: #16A34A; border-color: #86EFAC;">✓</button>
            </div>

            <div style="display: flex; gap: 10px;">
                <button type="button" id="gate-cancel-btn" class="btn-cancel" onclick="app.closeModal('modal-gate')" style="flex: 1; height: 46px; border-radius: 14px; border: 2px solid #E2E8F0; background: #FFFFFF; font-weight: 700; color: #64748B; cursor: pointer; transition: all 0.2s;">გაუქმება</button>
                <button type="button" id="gate-submit-btn" class="btn-primary-action" onclick="app.checkParentalGate()" style="flex: 2; height: 46px; border-radius: 14px; background: linear-gradient(135deg, #0D9488, #0F766E); border: none; color: white; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35); transition: all 0.2s;">შესვლა</button>
            </div>
        </div>
    </div>

    <!-- ========================================================
         Modal: Professional Studio & Settings
         ======================================================== -->
    <div id="modal-studio" class="modal-backdrop">
        <div class="modal-box">
            <button class="modal-close-btn" onclick="app.closeModal('modal-studio')">✕</button>
            <h2 class="modal-title" id="studio-modal-title">🎨 თერაპევტისა და მშობლის სტუდია</h2>
            <p class="modal-subtitle" id="studio-modal-subtitle">პროფესიული კლინიკური ხელსაწყოები, ABA ანალიტიკა და პარამეტრები</p>

            <div class="studio-tabs-wrapper">
                <button type="button" class="studio-tabs-scroll-btn btn-scroll-left" onclick="app.scrollStudioTabs(-1)" title="Scroll Left">‹</button>
                <div class="studio-tabs-nav" id="studio-tabs-nav">
                    <button class="studio-tab-btn active" data-tab="create-card" id="studio-tab-btn-create-card" onclick="app.switchStudioTab('create-card')">
                        ➕ ბარათის შექმნა
                    </button>
                    <button class="studio-tab-btn" data-tab="tools" id="studio-tab-btn-tools" onclick="app.switchStudioTab('tools')">
                        🛠️ ხელსაწყოები
                    </button>
                    <button class="studio-tab-btn" data-tab="voxis-ai" id="studio-tab-btn-voxis-ai" onclick="app.switchStudioTab('voxis-ai')" style="background: #0284C7; color: white;">
                        ✨ Voxis AI (ნემოტრონი)
                    </button>
                    <button class="studio-tab-btn" data-tab="room-scanner" id="studio-tab-btn-room-scanner" onclick="app.switchStudioTab('room-scanner')" style="background: linear-gradient(135deg, #0D9488, #059669); color: white; font-weight: 800;">
                        📸 ოთახის AI სკანერი
                    </button>
                    <button class="studio-tab-btn" data-tab="analytics" id="studio-tab-btn-analytics" onclick="app.switchStudioTab('analytics')">
                        📊 ABA ანალიტიკა
                    </button>
                    <button class="studio-tab-btn" data-tab="goals" id="studio-tab-btn-goals" onclick="app.switchStudioTab('goals')">
                        🎯 IEP მიზნები
                    </button>
                    <button class="studio-tab-btn" data-tab="profiles" id="studio-tab-btn-profiles" onclick="app.switchStudioTab('profiles')">
                        👶 პროფილები
                    </button>
                    <button class="studio-tab-btn" data-tab="print" id="studio-tab-btn-print" onclick="app.switchStudioTab('print')">
                        🖨️ ბეჭდვა (A4)
                    </button>
                    <button class="studio-tab-btn" data-tab="report" id="studio-tab-btn-report" onclick="app.switchStudioTab('report')">
                        📲 დღიური შეჯამება
                    </button>
                    <button class="studio-tab-btn" data-tab="settings" id="studio-tab-btn-settings" onclick="app.switchStudioTab('settings')">
                        ⚙️ პარამეტრები & რეზერვი
                    </button>
                </div>
                <button type="button" class="studio-tabs-scroll-btn btn-scroll-right" onclick="app.scrollStudioTabs(1)" title="Scroll Right">›</button>
            </div>

            <!-- Tab: Voxis AI (Nebius & NVIDIA Nemotron) -->
            <div id="studio-tab-voxis-ai" style="display:none;">
                <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: #F8FAFC; padding: 20px; border-radius: 18px; margin-bottom: 16px; border: 1px solid #38BDF8;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 26px;">✨</span>
                            <div>
                                <h3 style="margin: 0; font-size: 18px; color: #38BDF8; font-weight: 900;" id="voxis-copilot-title">Voxis კლინიკური AI ასისტენტი</h3>
                                <div style="font-size: 12px; color: #94A3B8;" id="voxis-copilot-sub">Powered by Nebius Token Factory &amp; NVIDIA Nemotron Models</div>
                            </div>
                        </div>
                        <button type="button" class="voxis-ai-badge-btn" id="voxis-btn-api-settings" onclick="voxisAI.openConfigModal()">⚙️ API პარამეტრები</button>
                    </div>
                    <p style="font-size: 13px; color: #CBD5E1; margin: 0; line-height: 1.5;" id="voxis-copilot-desc">
                        ქცევითი ტელემეტრიის დამუშავება Nebius Token Factory-ზე. <strong>NVIDIA Nemotron 3 Ultra</strong> აგენერირებს BCBA პროგრესის ანგარიშს, SMART IEP მიზნებს და კეროლ გრეის სოციალურ ისტორიებს, ხოლო <strong>Tavily Search AI</strong> იკვლევს მტკიცებულებით ინტერვენციებს.
                    </p>
                </div>

                <!-- 🛡️ AI Sensory Fatigue & Perseveration Guard -->
                <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 14px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 220px;">
                        <span style="font-size: 24px;">🛡️</span>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="font-size: 13px; font-weight: 900; color: #14532D;" id="voxis-guard-title">AI სენსორული გადაღლისა და პერსევერაციის დეტექტორი</div>
                                <span id="voxis-guard-status-badge" style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 99px; background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC;">აქტიური</span>
                            </div>
                            <div style="font-size: 11.5px; color: #166534;" id="voxis-guard-desc">აკვირდება სწრაფ განმეორებით დაჭერებს (Perseveration) და სთავაზობს სუნთქვით განტვირთვას გადატვირთვამდე.</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button type="button" class="icon-btn" id="btn-toggle-fatigue-guard" style="font-size: 11.5px; font-weight: 800; background: #10B981; color: #FFFFFF; border: none; padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;" onclick="voxisAI.toggleFatigueDetector(!voxisAI.isFatigueDetectorEnabled())">
                            🟢 ჩართულია (გამორთვა)
                        </button>
                        <button type="button" class="icon-btn" id="btn-voxis-test-guard" style="font-size: 11.5px; font-weight: 800; background: #DCFCE7; border-color: #4ADE80; color: #15803D; padding: 6px 12px;" onclick="voxisAI.triggerSensoryFatigueAlert(true)">
                            ⚡ სიმულაცია (ტესტი)
                        </button>
                    </div>
                </div>

                <!-- 📖 AI Social Story Generator (Carol Gray 4-Step Method) -->
                <div style="background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 16px; padding: 16px; margin-bottom: 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
                        <div>
                            <h4 style="margin: 0; font-size: 15px; font-weight: 900; color: #0F172A;" id="voxis-story-title">📖 AI სოციალური ისტორიების გენერატორი (Carol Gray მეთოდი)</h4>
                            <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748B;" id="voxis-story-desc">აგენერირებს 4-ნაბიჯიან ვიზუალურ ისტორიას რთული მოვლენისთვის ბავშვის მოსამზადებლად</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
                        <button type="button" class="icon-btn" id="btn-story-haircut" style="font-size: 12px; font-weight: 800;" onclick="voxisAI.generateSocialStory('თმის შეჭრა / Haircut')">✂️ თმის შეჭრა</button>
                        <button type="button" class="icon-btn" id="btn-story-dentist" style="font-size: 12px; font-weight: 800;" onclick="voxisAI.generateSocialStory('სტომატოლოგთან ვიზიტი / Dentist')">🦷 სტომატოლოგი</button>
                        <button type="button" class="icon-btn" id="btn-story-doctor" style="font-size: 12px; font-weight: 800;" onclick="voxisAI.generateSocialStory('ექიმთან ვიზიტი / Doctor')">🩺 ექიმთან ვიზიტი</button>
                        <div style="display: flex; gap: 6px; flex: 1; min-width: 200px;">
                            <input type="text" id="voxis-custom-story-topic" name="voxis_story_topic_custom" class="form-control" style="height: 36px; font-size: 12px;" placeholder="ან ჩაწერეთ თემა (მაგ: დაბადების დღე, მგზავრობა)..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other">
                            <button type="button" class="btn-primary-action" id="btn-story-generate" style="height: 36px; width: auto; padding: 0 14px; font-size: 12px; background: #7C3AED;" onclick="voxisAI.generateSocialStory()">✨ შექმნა</button>
                        </div>
                    </div>
                    <div id="voxis-social-story-output"></div>
                </div>

                <!-- 🏛️ Multi-Agent Clinical Council (SLP + BCBA + OT Consensus) -->
                <div id="voxis-council-section" style="background: linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%); border: 2px solid #93C5FD; border-radius: 16px; padding: 16px; margin-bottom: 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div style="flex: 1; min-width: 240px;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <h4 style="margin: 0; font-size: 15px; font-weight: 900; color: #1E3A8A;" id="voxis-council-title">🏛️ 3-აგენტიანი კლინიკური კონსილიუმი (SLP + BCBA + OT)</h4>
                                <span style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 99px; background: #DBEAFE; color: #1D4ED8; border: 1px solid #93C5FD;" id="voxis-council-badge">Multi-Agent AI</span>
                            </div>
                            <p style="margin: 3px 0 0 0; font-size: 12px; color: #475569;" id="voxis-council-desc">სამი სპეციალიზებული AI აგენტი (🗣️ ლოგოპედი, 📈 ქცევითი ანალიტიკოსი, 🧘 ოკუპაციური თერაპევტი) აანალიზებს სესიას და ქმნის საერთო 7-დღიან გეგმას</p>
                        </div>
                        <button type="button" class="btn-primary-action" id="btn-convene-council" style="width: auto; padding: 10px 18px; font-size: 13px; background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); white-space: nowrap;" onclick="voxisAI.runMultiAgentCouncil()">
                            🧠 Convene 3-Agent Council
                        </button>
                    </div>
                    <div id="voxis-council-output" style="margin-top: 12px; display: none;"></div>
                </div>

                <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
                    <button type="button" class="btn-primary-action" id="btn-voxis-gen-report" style="flex: 1; min-width: 240px; background: #0284C7; font-size: 14px;" onclick="voxisAI.generateClinicalReport()">
                        🚀 კლინიკური ABA რეპორტის გენერირება (Nemotron 3 Ultra)
                    </button>
                    <button type="button" class="btn-primary-action" id="btn-voxis-research" style="flex: 1; min-width: 240px; background: #0D9488; font-size: 14px;" onclick="voxisAI.researchInterventions()">
                        🔍 მტკიცებულებითი ინტერვენციების კვლევა (Tavily AI)
                    </button>
                </div>

                <div id="voxis-clinical-report-body">
                    <div style="text-align: center; padding: 24px; color: #64748B; background: #F8FAFC; border-radius: 14px; border: 1.5px dashed #CBD5E1;" id="voxis-report-placeholder">
                        დააჭირეთ <strong>„კლინიკური ABA რეპორტის გენერირება“</strong>-ს ანალიზის დასაწყებად.
                    </div>
                </div>

                <div id="voxis-research-results-box" style="margin-top: 20px;"></div>
            </div>

            <!-- Tab: 📸 AI Environment & Room Scanner -->
            <div id="studio-tab-room-scanner" style="display:none;"></div>

            <!-- Tab 1: Create Custom Card -->
            <div id="studio-tab-create">
                <div style="background: #F8FAFC; padding: 16px; border-radius: 18px; border: 2px solid #E2E8F0; margin-bottom: 16px;">
                    <div class="form-group">
                        <label id="st-create-lbl-name">ბარათის სახელი (ქართულად / ინგლისურად):</label>
                        <input type="text" id="new-card-text" name="new_card_title" class="form-control" placeholder="მაგ: საყვარელი დათუნია, წყალი, დედა..." autocomplete="off" data-lpignore="true">
                    </div>

                    <div class="form-group">
                        <label id="st-create-lbl-spoken">გასახმოვანებელი ფრაზა (თუ განსხვავდება):</label>
                        <input type="text" id="new-card-spoken" name="new_card_spoken_text" class="form-control" placeholder="მაგ: მინდა ჩემი სათამაშო, გთხოვ..." autocomplete="off" data-lpignore="true">
                    </div>

                    <!-- 🎙️ Parent Voice Recording with Microphone -->
                    <div class="voice-recorder-box">
                        <div>
                            <div style="font-size:13px; font-weight:800;" id="st-rec-title">🎙️ ჩაწერეთ მშობლის / თერაპევტის ხმა:</div>
                            <div style="font-size:11px; color:#64748B;" id="st-rec-sub">ბავშვი მოისმენს თქვენს მშობლიურ თბილ ხმას სინთეზურის ნაცვლად!</div>
                            <div id="recorded-audio-preview" style="display:none; margin-top:6px;">
                                <span style="color:#10B981; font-weight:800; font-size:12px;" id="st-rec-status">✅ ხმა ჩაწერილია!</span>
                                <button type="button" class="icon-btn" style="padding:2px 8px; font-size:11px; margin-left:6px;" onclick="app.playCurrentRecordingPreview()" id="st-rec-btn-play">▶️ მოსმენა</button>
                            </div>
                        </div>
                        <div class="voice-recorder-actions" style="display:flex; align-items:center; gap:10px;">
                            <span id="rec-timer" style="font-weight:900; font-size:13px; color:#DC2626;">00:00</span>
                            <button type="button" id="btn-record-voice" class="rec-btn" onclick="app.toggleVoiceRecording()">
                                🔴 ჩაწერა
                            </button>
                        </div>
                    </div>

                    <!-- 🔎 ARASAAC Official Pictogram Search -->
                    <div class="arasaac-search-container">
                        <label style="font-size:13px; font-weight:800; display:block; margin-top:12px;" id="st-arasaac-lbl">
                            🔎 აირჩიეთ ARASAAC-ის საერთაშორისო სიმბოლო:
                        </label>
                        <input type="search" id="arasaac-search-input" name="arasaac_search_query" class="form-control" 
                               placeholder="მოძებნეთ (მაგ: წყალი, ვაშლი, მანქანა, ძილი, ძაღლი)..."
                               autocomplete="off"
                               autocorrect="off"
                               autocapitalize="off"
                               spellcheck="false"
                               data-lpignore="true"
                               data-form-type="other"
                               data-1p-ignore="true"
                               role="searchbox"
                               readonly
                               onpointerdown="this.readOnly=false;"
                               onfocus="this.readOnly=false;"
                               onblur="this.readOnly=true;">
                        <div id="arasaac-selected-preview"></div>
                        <div id="arasaac-results" class="arasaac-grid"></div>
                    </div>

                    <div class="responsive-two-col-grid" style="margin-top: 14px;">
                        <div class="form-group">
                            <label id="st-lbl-emoji">ან ემოჯი:</label>
                            <input type="text" id="new-card-icon" class="form-control" placeholder="მაგ: 🧸, 🍎, ⭐">
                        </div>
                        <div class="form-group">
                            <label id="st-lbl-photo">ან პირადი ფოტო (კამერა / ფაილი):</label>
                            <div style="display:flex; gap:6px;">
                                <div style="display:flex; gap:8px; width:100%;">
                                    <button type="button" class="form-control studio-photo-btn" onclick="app.triggerCardCameraCapture()" style="flex:1; cursor:pointer; text-align:center; padding:10px 12px; display:inline-flex; align-items:center; justify-content:center; gap:6px; font-size:13px; font-weight:800; background:#EFF6FF; border:1.5px solid #3B82F6; color:#1D4ED8; margin:0; height:44px; border-radius:12px;">
                                        <span>📸</span> <span id="st-btn-camera-txt">კამერა</span>
                                    </button>
                                    <input type="file" id="new-card-camera" accept="image/*" capture="environment" onchange="app.handleStudioCardFileSelect(event)" style="display:none;">

                                    <label for="new-card-file" class="form-control studio-photo-btn" style="flex:1; cursor:pointer; text-align:center; padding:10px 12px; display:inline-flex; align-items:center; justify-content:center; gap:6px; font-size:13px; font-weight:800; background:#F8FAFC; border:1.5px solid #CBD5E1; color:#334155; margin:0; height:44px; border-radius:12px;">
                                        <span>📁</span> <span id="st-btn-gallery-txt">ფაილი</span>
                                    </label>
                                </div>
                                <input type="file" id="new-card-file" accept="image/*" onchange="app.handleStudioCardFileSelect(event)" style="display:none;">
                            </div>
                            <div id="new-card-photo-preview" style="display:none; margin-top:6px; align-items:center; gap:8px; background:#F1F5F9; padding:4px 8px; border-radius:8px;">
                                <img id="new-card-preview-img" src="" style="width:36px; height:36px; border-radius:8px; object-fit:cover; border:2px solid #10B981;">
                                <span id="new-card-photo-name" style="font-size:11px; font-weight:700; color:#059669; flex:1;">⚡ ოპტიმიზებული</span>
                                <button type="button" onclick="app.clearStudioCardPhoto()" style="border:none; background:transparent; color:#EF4444; font-size:14px; cursor:pointer; font-weight:bold;">✕</button>
                            </div>
                        </div>
                    </div>

                    <div class="responsive-two-col-grid">
                        <div class="form-group">
                            <label id="st-lbl-category">კატეგორია:</label>
                            <select id="new-card-category" class="form-control">
                                <option value="basic">საბაზისო &amp; სოციალური</option>
                                <option value="food">საჭმელი</option>
                                <option value="drinks">სასმელი</option>
                                <option value="toys">სათამაშოები</option>
                                <option value="actions">მოქმედებები</option>
                                <option value="feelings">ემოციები / ტკივილი</option>
                                <option value="people">ადამიანები</option>
                                <option value="hygiene">ჰიგიენა &amp; რუტინა</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label id="st-lbl-type">ფიტცჯერალდის ტიპი (ფერის კოდი):</label>
                            <select id="new-card-type" class="form-control">
                                <option value="noun">არსებითი / ნივთი (ნარინჯისფერი)</option>
                                <option value="people">ადამიანი / ნაცვალსახელი (ყვითელი)</option>
                                <option value="verb">მოქმედება / ზმნა (მწვანე)</option>
                                <option value="adjective">თვისება / ზედსართავი (ლურჯი)</option>
                                <option value="social">სოციალური / ემოცია (ვარდისფერი)</option>
                                <option value="basic">საბაზისო (ნაცრისფერი)</option>
                            </select>
                        </div>
                    </div>

                    <button class="btn-primary-action" id="st-btn-save-card" onclick="app.addNewCustomCard()">
                        💾 ბარათის შენახვა &amp; დაფაზე დამატება
                    </button>
                </div>
            </div>

            <!-- Tab 1.5: Clinical Tools & Modalities -->
            <div id="studio-tab-tools" style="display:none;">
                <div style="margin-bottom:12px;">
                    <h4 style="font-size:15px; font-weight:900; color:#0F172A;" id="st-tools-title">🛠️ სპეციალური კლინიკური მოდულები</h4>
                    <p style="font-size:12px; color:#64748B;" id="st-tools-desc">აირჩიეთ მტკიცებულებითი მეთოდი მიმდინარე სესიისთვის</p>
                </div>
                <div class="studio-tools-grid">
                    <div class="studio-tool-card" id="st-card-firstthen" onclick="app.launchClinicalTool('firstthen')">
                        <span class="st-icon">📋</span>
                        <div class="st-info">
                            <strong class="st-tool-title">პირველი / შემდეგ დაფა</strong>
                            <span class="st-tool-desc">ჯერ (მოთხოვნა) ➔ შემდეგ (ჯილდო)</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-tokenboard" onclick="app.launchClinicalTool('tokenboard')">
                        <span class="st-icon">⭐</span>
                        <div class="st-info">
                            <strong class="st-tool-title">ვარსკვლავების წახალისების დაფა</strong>
                            <span class="st-tool-desc">ABA პოზიტიური განმტკიცების ვარსკვლავები</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-schedule" onclick="app.launchClinicalTool('schedule')">
                        <span class="st-icon">📅</span>
                        <div class="st-info">
                            <strong class="st-tool-title">დღის ვიზუალური განრიგი</strong>
                            <span class="st-tool-desc">დღიური აქტივობების თანმიმდევრობა</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-painmap" onclick="app.launchClinicalTool('painmap')">
                        <span class="st-icon">🩺</span>
                        <div class="st-info">
                            <strong class="st-tool-title">სხეულის შეგრძნებებისა &amp; ტკივილის რუკა</strong>
                            <span class="st-tool-desc">„სად მტკივა?“ — ლოკალიზაცია და შეგრძნებები</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-game" onclick="app.launchClinicalTool('game')">
                        <span class="st-icon">🎮</span>
                        <div class="st-info">
                            <strong class="st-tool-title">„იპოვე ბარათი“ თამაში</strong>
                            <span class="st-tool-desc">რეცეპტული ენის განვითარება და გარჩევა</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-trainer" onclick="app.launchClinicalTool('trainer')">
                        <span class="st-icon">🎓</span>
                        <div class="st-info">
                            <strong class="st-tool-title">6-ეტაპიანი AAC ტრენაჟორი</strong>
                            <span class="st-tool-desc">სტრუქტურირებული ვიზუალური გაცვლის პროტოკოლი</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-regulation" onclick="app.closeModal('modal-studio'); app.openRegulationModal();">
                        <span class="st-icon">🧘</span>
                        <div class="st-info">
                            <strong class="st-tool-title">თვითრეგულაცია &amp; სიმშვიდე</strong>
                            <span class="st-tool-desc">დამამშვიდებელი ზონები &amp; მართვადი სუნთქვა</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-timer" onclick="app.closeModal('modal-studio'); app.openTimerModal();">
                        <span class="st-icon">⏱️</span>
                        <div class="st-info">
                            <strong class="st-tool-title">ვიზუალური ტაიმერი</strong>
                            <span class="st-tool-desc">დროის პროგნოზირებადი აღქმა აუტისტური სპექტრისთვის</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-quickchat" onclick="app.closeModal('modal-studio'); app.openQuickChatModal();">
                        <span class="st-icon">💬</span>
                        <div class="st-info">
                            <strong class="st-tool-title">სწრაფი სოციალური ფრაზები</strong>
                            <span class="st-tool-desc">მყისიერი ყოველდღიური პრაგმატული კომუნიკაცია</span>
                        </div>
                    </div>
                    <div class="studio-tool-card" id="st-card-keyboard" onclick="app.closeModal('modal-studio'); app.openKeyboardModal();">
                        <span class="st-icon">⌨️</span>
                        <div class="st-info">
                            <strong class="st-tool-title">ეკრანის კლავიატურა</strong>
                            <span class="st-tool-desc">აკრეფა, ასოების გარჩევა და გახმოვანება</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 2: ABA Analytics -->
            <div id="studio-tab-analytics" style="display:none;"></div>

            <!-- Tab 2.5: 🎯 ABA Clinical Goals (IEP Goals) -->
            <div id="studio-tab-goals" style="display:none;"></div>

            <!-- Tab 3: Child Profiles -->
            <div id="studio-tab-profiles" style="display:none;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h4 style="font-size:14px; font-weight:800;" id="st-profiles-head-title">თერაპიული პროფილების სია</h4>
                    <button class="icon-btn" id="st-btn-new-profile" onclick="app.handleCreateNewProfile()" style="font-size:12px; background:#D1FAE5; border-color:#10B981; color:#065F46;">
                        ➕ ახალი ბავშვი
                    </button>
                </div>
                <div id="studio-profiles-list"></div>
            </div>

            <!-- Tab 4: 🖨️ Printable A4 Sheet -->
            <div id="studio-tab-print" style="display:none;"></div>

            <!-- Tab 5: 📋 Doctor & Parent WhatsApp / PDF Report -->
            <div id="studio-tab-report" style="display:none;"></div>

            <!-- Tab 6: ⚙️ Settings, Motor Guard & Backup -->
            <div id="studio-tab-settings" style="display:none;">
                <div class="studio-settings-container">
                    <!-- 1. Card & Grid Dimensions -->
                    <div class="settings-section-card" id="settings-card-dimensions">
                        <div class="ssc-header">
                            <span class="ssc-icon">🎴</span>
                            <div>
                                <h4 class="ssc-title" id="dim-card-title">Card and Grid Dimensions</h4>
                                <p class="ssc-desc" id="dim-card-desc">Adjust card scale according to child motor skills and visual acuity</p>
                            </div>
                        </div>
                        <div class="settings-btn-row">
                            <button type="button" class="settings-choice-btn" id="scb-size-large" onclick="app.setGridSize('large')">
                                <span class="scb-emoji">🔍+</span>
                                <span class="scb-name">Large</span>
                                <span class="scb-hint">~185px (Easy physical access)</span>
                            </button>
                            <button type="button" class="settings-choice-btn active" id="scb-size-medium" onclick="app.setGridSize('medium')">
                                <span class="scb-emoji">📱</span>
                                <span class="scb-name">Medium</span>
                                <span class="scb-hint">~130px (Gold standard)</span>
                            </button>
                            <button type="button" class="settings-choice-btn" id="scb-size-compact" onclick="app.setGridSize('compact')">
                                <span class="scb-emoji">📁</span>
                                <span class="scb-name">Compact</span>
                                <span class="scb-hint">~95px (More cards per screen)</span>
                            </button>
                        </div>
                    </div>

                    <!-- 2. Touch Accessibility (Touch Access) -->
                    <div class="settings-section-card" id="settings-card-touch">
                        <div class="ssc-header">
                            <span class="ssc-icon">👆</span>
                            <div>
                                <h4 class="ssc-title" id="touch-card-title">Touch Accessibility &amp; Motor Guard (Anti-Spam &amp; Tremor Shield)</h4>
                                <p class="ssc-desc" id="touch-card-desc">Protects against impulsive rapid repeated clicks and unintentional hand swipes</p>
                            </div>
                        </div>

                        <div class="settings-control-row">
                            <div class="scr-info">
                                <strong id="touch-repeat-title">🛑 Repeat Click Delay Filter:</strong>
                                <span id="touch-repeat-desc">Debounce cooldown period between taps on the same card</span>
                            </div>
                            <div class="scr-options" id="touch-repeat-options">
                                <button type="button" class="scr-opt-btn" data-delay="0" onclick="app.setTouchRepeatDelay(0)">Disabled (0s)</button>
                                <button type="button" class="scr-opt-btn" data-delay="800" onclick="app.setTouchRepeatDelay(800)">0.8s</button>
                                <button type="button" class="scr-opt-btn active" data-delay="1200" onclick="app.setTouchRepeatDelay(1200)">1.2s (Recommended)</button>
                                <button type="button" class="scr-opt-btn" data-delay="2000" onclick="app.setTouchRepeatDelay(2000)">2.0s</button>
                            </div>
                        </div>

                        <div class="settings-control-row">
                            <div class="scr-info">
                                <strong id="touch-dwell-title">⏳ Hold-to-Select (Dwell Activation Time):</strong>
                                <span id="touch-dwell-desc">Card activates only after being held for the specified duration</span>
                            </div>
                            <div class="scr-options" id="touch-dwell-options">
                                <button type="button" class="scr-opt-btn active" data-dwell="0" onclick="app.setTouchDwellTime(0)">Instant (0s)</button>
                                <button type="button" class="scr-opt-btn" data-dwell="300" onclick="app.setTouchDwellTime(300)">0.3s</button>
                                <button type="button" class="scr-opt-btn" data-dwell="500" onclick="app.setTouchDwellTime(500)">0.5s</button>
                                <button type="button" class="scr-opt-btn" data-dwell="800" onclick="app.setTouchDwellTime(800)">0.8s</button>
                            </div>
                        </div>
                    </div>

                    <!-- 3. AI Predictive Assistance & Clinical AAC Fidelity -->
                    <div class="settings-section-card" id="settings-card-ai-predictions">
                        <div class="ssc-header">
                            <span class="ssc-icon">✨</span>
                            <div>
                                <h4 class="ssc-title" id="ai-pred-card-title">AI Predictive Assistance &amp; Clinical Protocol Fidelity</h4>
                                <p class="ssc-desc" id="ai-pred-card-desc">Adherence to Standardized Picture Exchange Communication Protocols</p>
                            </div>
                        </div>

                        <div class="settings-control-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700; color: #0F172A; font-size: 13px;">
                                <input type="checkbox" id="setting-toggle-pred-bar" onchange="voxisAI.togglePredictionBar(this.checked)" style="width: 18px; height: 18px; accent-color: #0284C7;">
                                <span id="ai-pred-toggle-label">Enable Real-time AI Word Predictions on Child Board (High-Tech AAC Mode)</span>
                            </label>
                            <div id="ai-pred-recommendation-box" style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #166534; line-height: 1.45;">
                                🛡️ <strong>ABA Clinical Recommendation (Default: OFF):</strong> Keep disabled during early exchange training (Phases 1-4). This protects spontaneous requesting (manding) and avoids prompt dependency. Enable only for advanced communicators who benefit from predictive suggestions.
                            </div>
                        </div>
                    </div>

                    <!-- 3.5. AI Sensory Fatigue & Perseveration Guard -->
                    <div class="settings-section-card" id="settings-card-fatigue-guard">
                        <div class="ssc-header">
                            <span class="ssc-icon">🛡️</span>
                            <div>
                                <h4 class="ssc-title" id="fatigue-guard-card-title">AI Sensory Fatigue &amp; Perseveration Guard</h4>
                                <p class="ssc-desc" id="fatigue-guard-card-desc">Behavioral meltdown prevention and repetitive click burst filter</p>
                            </div>
                        </div>

                        <div class="settings-control-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700; color: #0F172A; font-size: 13px;">
                                <input type="checkbox" id="setting-toggle-fatigue-guard" onchange="voxisAI.toggleFatigueDetector(this.checked)" checked style="width: 18px; height: 18px; accent-color: #10B981;">
                                <span id="fatigue-guard-toggle-label">Enable Sensory Fatigue &amp; Perseveration Detector</span>
                            </label>
                            <div id="fatigue-guard-hint" style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #166534; line-height: 1.45;">
                                🧘 <strong>Therapist Discretion:</strong> When active, rapid perseverative tapping (5 taps within 3.5s) prompts a soothing breathing break. If the clinician determines calming intervention is not needed for this session, you can switch it OFF here anytime.
                            </div>
                        </div>
                    </div>

                    <!-- 4. ABA Clinical Prompt Logging -->
                    <div class="settings-section-card" id="settings-card-prompt-logging">
                        <div class="ssc-header">
                            <span class="ssc-icon">🤝</span>
                            <div>
                                <h4 class="ssc-title" id="prompt-setting-card-title">ABA Prompt Level Logging (Independence Tracking)</h4>
                                <p class="ssc-desc" id="prompt-setting-card-desc">Automatic tracking of child independence vs. therapist prompts during communication</p>
                            </div>
                        </div>

                        <div class="settings-control-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700; color: #0F172A; font-size: 13px;">
                                <input type="checkbox" id="setting-toggle-prompt-popup" onchange="app.togglePromptPopup(this.checked)" style="width: 18px; height: 18px; accent-color: #10B981;">
                                <span id="setting-prompt-popup-label">Enable Quick Prompt Popup on Card Tap</span>
                            </label>
                            <div id="prompt-setting-hint" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #475569; line-height: 1.45;">
                                💡 <strong>When Enabled:</strong> Tapping a card displays a quick popup (🟢 Independent, 🟡 Partial, 🔴 Full) to log assistance.<br>
                                <strong>When Disabled:</strong> The popup is turned off to avoid interrupting the child, and prompt level is tracked solely via the header button.
                            </div>
                        </div>
                    </div>

                    <!-- 4.5 Voice, Contrast & Emergency SOS -->
                    <div class="settings-section-card" id="settings-card-voice-sos">
                        <div class="ssc-header">
                            <span class="ssc-icon">🔊</span>
                            <div>
                                <h4 class="ssc-title" id="st-sec-voice-title">Voice, Contrast &amp; SOS Emergency Phone</h4>
                                <p class="ssc-desc" id="st-sec-voice-desc">Configure speech speed, high-contrast mode, and parent SOS number</p>
                            </div>
                        </div>
                        <div class="responsive-two-col-grid" style="margin-bottom:10px;">
                            <div class="form-group">
                                <label id="st-lbl-speaker">Speaker Voice:</label>
                                <select class="form-control" id="studio-tts-voice-select" onchange="app.setTtsVoice(this.value)">
                                    <option value="bella" selected>✨ Bella (Bella - Eleven v4 / Warm &amp; Clear)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label id="st-lbl-speed">Voice Speed:</label>
                                <select class="form-control" id="studio-tts-speed-select" onchange="app.setVoiceSpeed(this.value)">
                                    <option value="0.7">Slow (0.7x)</option>
                                    <option value="0.85" selected>Standard (0.85x)</option>
                                    <option value="1.0">Normal (1.0x)</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom:12px;">
                            <button class="icon-btn" id="st-btn-contrast" style="width:100%; justify-content:center; padding:10px;" onclick="app.toggleHighContrast()">
                                🌓 High Contrast
                            </button>
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label id="st-lbl-sos">SOS Emergency Phone (Parent Number):</label>
                            <div style="display:flex; gap:8px;">
                                <input type="text" id="studio-sos-input" name="sos_contact_phone" class="form-control" placeholder="e.g. +1 555 123 4567" autocomplete="off" data-lpignore="true">
                                <button class="icon-btn" id="st-btn-sos-save" onclick="app.saveSosPhone(document.getElementById('studio-sos-input').value)">Save</button>
                            </div>
                        </div>
                    </div>

                    <!-- 5. Data Backup & Restore -->
                    <div class="settings-section-card" id="settings-card-backup">
                        <div class="ssc-header">
                            <span class="ssc-icon">💾</span>
                            <div>
                                <h4 class="ssc-title" id="backup-card-title">Data Backup &amp; Restore</h4>
                                <p class="ssc-desc" id="backup-card-desc">Download all customized cards, recorded voice clips, and child profiles, or restore onto another device</p>
                            </div>
                        </div>

                        <div class="backup-actions-grid">
                            <div class="backup-action-box">
                                <div class="bab-title" id="backup-box1-title">📥 Create Full Backup</div>
                                <p class="bab-desc" id="backup-box1-desc">Downloads a secure JSON archive to your computer or phone.</p>
                                <button type="button" class="btn-backup-export" onclick="app.exportBackupJson()">
                                    <span id="backup-box1-btn">💾 Download Full Backup (.json)</span>
                                </button>
                            </div>

                            <div class="backup-action-box">
                                <div class="bab-title" id="backup-box2-title">📤 Restore from Backup</div>
                                <p class="bab-desc" id="backup-box2-desc">Select a previously downloaded JSON backup file to restore.</p>
                                <label class="btn-backup-import-label">
                                    <span id="backup-box2-btn">📂 Select File &amp; Restore</span>
                                    <input type="file" id="backup-file-input" accept=".json" onchange="app.importBackupJson(event)" style="display:none;">
                                </label>
                            </div>
                        </div>

                        <div class="backup-reset-row">
                            <button type="button" class="btn-backup-reset" onclick="app.resetAllDataToDefaults()">
                                <span id="backup-reset-btn">⚠️ Factory Reset to Defaults</span>
                            </button>
                        </div>
                    </div>

                    <!-- 5. Legal Notice & Trademark Disclaimer -->
                    <div class="settings-section-card" id="settings-card-legal" style="border-left: 4px solid #64748B; background: #F8FAFC;">
                        <div class="ssc-header">
                            <span class="ssc-icon">⚖️</span>
                            <div>
                                <h4 class="ssc-title" id="legal-card-title">Legal Notice &amp; Trademark Attribution</h4>
                                <p class="ssc-desc" id="legal-card-desc">Compliance &amp; Intellectual Property Disclaimers</p>
                            </div>
                        </div>
                        <div style="font-size: 12px; color: #475569; line-height: 1.6; padding: 4px 0;">
                            <p id="legal-trademark-text" style="margin-bottom: 8px;">
                                <strong>Trademarks:</strong> PECS® and Picture Exchange Communication System® are registered trademarks of <strong>Pyramid Educational Consultants, Inc.</strong>
                            </p>
                            <p id="legal-independence-text" style="margin-bottom: 8px;">
                                <strong>Independence:</strong> <em>Voxis</em> is an independent multimodal AAC research and assistive technology platform. Voxis is not affiliated with, maintained, sponsored, or endorsed by Pyramid Educational Consultants, Inc.
                            </p>
                            <p id="legal-pictograms-text" style="margin: 0; color: #64748B; font-size: 11px;">
                                <strong>Pictograms:</strong> ARASAAC symbols are published under Creative Commons (BY-NC-SA) license by the Government of Aragon.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 🛡️ Child Lock Active Badge -->
    <div id="child-lock-banner" class="child-lock-banner" style="display:none;" onclick="app.disableChildLock()">
        <span>🔒 Child Lock Active — Tap to unlock</span>
    </div>

    <!-- 🧒 Quick Child Profile Switcher Modal -->
    <div id="modal-quick-profile-switcher" class="modal-backdrop" onclick="if(event.target===this) app.closeModal('modal-quick-profile-switcher')">
        <div class="modal-box quick-profile-switcher-box">
            <button class="modal-close-btn" onclick="app.closeModal('modal-quick-profile-switcher')" title="Close">✕</button>
            <div class="quick-profile-header">
                <div class="quick-profile-icon-badge">🧒</div>
                <div>
                    <h3 class="quick-profile-title" id="quick-profile-title">ბავშვის პროფილის არჩევა</h3>
                    <p class="quick-profile-subtitle" id="quick-profile-subtitle">მოსწავლის სწრაფი შეცვლა</p>
                </div>
            </div>

            <div class="quick-profile-list" id="quick-profile-list">
                <!-- Dynamically populated profiles list -->
            </div>

            <div class="quick-profile-footer">
                <button type="button" class="quick-prof-add-btn" onclick="app.closeModal('modal-quick-profile-switcher'); app.handleCreateNewProfile();">
                    <span>➕</span> <span id="quick-prof-add-text">ახალი ბავშვი</span>
                </button>
                <button type="button" class="quick-prof-studio-btn" onclick="app.closeModal('modal-quick-profile-switcher'); app.openParentalGate('studio', 'profiles');">
                    <span id="quick-prof-studio-text">🔒 სრული მართვა სტუდიაში</span>
                </button>
            </div>
        </div>
    </div>

    <!-- 🧒 New Child Profile Creation Modal -->
    <div id="modal-create-child-profile" class="modal-backdrop" onclick="if(event.target===this) app.closeModal('modal-create-child-profile')">
        <div class="modal-box create-child-modal-box">
            <button type="button" class="modal-close-btn" onclick="app.closeModal('modal-create-child-profile')" title="Close">✕</button>
            <div class="create-child-header">
                <div class="create-child-icon-badge" id="create-child-preview-avatar">🧒</div>
                <div>
                    <h3 class="create-child-title" id="create-child-title">ახალი ბავშვის დამატება</h3>
                    <p class="create-child-subtitle" id="create-child-subtitle">პერსონალიზებული AAC პროფილი და სასწავლო ეტაპი</p>
                </div>
            </div>

            <form id="form-create-child-profile" onsubmit="event.preventDefault(); app.submitCreateNewProfile();">
                <!-- 1. Avatar Selector -->
                <div class="ccm-form-group">
                    <label class="ccm-label" id="ccm-avatar-label">აირჩიეთ ავატარი</label>
                    <div class="ccm-avatar-grid" id="ccm-avatar-grid">
                        <button type="button" class="ccm-avatar-btn active" data-avatar="🧒" onclick="app.selectNewProfileAvatar('🧒')">🧒</button>
                        <button type="button" class="ccm-avatar-btn" data-avatar="👧" onclick="app.selectNewProfileAvatar('👧')">👧</button>
                        <button type="button" class="ccm-avatar-btn" data-avatar="👦" onclick="app.selectNewProfileAvatar('👦')">👦</button>
                        <button type="button" class="ccm-avatar-btn" data-avatar="👶" onclick="app.selectNewProfileAvatar('👶')">👶</button>
                        <button type="button" class="ccm-avatar-btn" data-avatar="👱‍♀️" onclick="app.selectNewProfileAvatar('👱‍♀️')">👱‍♀️</button>
                        <button type="button" class="ccm-avatar-btn" data-avatar="👱‍♂️" onclick="app.selectNewProfileAvatar('👱‍♂️')">👱‍♂️</button>
                        <button type="button" class="ccm-avatar-btn" data-avatar="🧑" onclick="app.selectNewProfileAvatar('🧑')">🧑</button>
                        <button type="button" class="ccm-avatar-btn" data-avatar="🧒🏽" onclick="app.selectNewProfileAvatar('🧒🏽')">🧒🏽</button>
                    </div>
                </div>

                <!-- 2. Child Name Input -->
                <div class="ccm-form-group">
                    <label class="ccm-label" for="ccm-child-name" id="ccm-name-label">ბავშვის სახელი *</label>
                    <div class="ccm-input-wrap">
                        <span class="ccm-input-icon">✏️</span>
                        <input type="text" id="ccm-child-name" class="ccm-input" 
                               placeholder="მაგ: ნიკო, ანა, ლუკა..." 
                               maxlength="30" required autocomplete="off">
                    </div>
                </div>

                <!-- 3. Age, Gender & Phase Row -->
                <div class="ccm-row-group">
                    <div class="ccm-form-group" style="flex: 0.85;">
                        <label class="ccm-label" for="ccm-child-age" id="ccm-age-label">ასაკი</label>
                        <div class="ccm-input-wrap">
                            <span class="ccm-input-icon">🎂</span>
                            <input type="number" id="ccm-child-age" class="ccm-input" 
                                   value="4" min="1" max="18" step="1">
                        </div>
                    </div>

                    <div class="ccm-form-group" style="flex: 1.1;">
                        <label class="ccm-label" for="ccm-child-gender" id="ccm-gender-label">სქესი</label>
                        <div class="ccm-input-wrap">
                            <span class="ccm-input-icon">👤</span>
                            <select id="ccm-child-gender" class="ccm-select">
                                <option value="male" selected>ბიჭი</option>
                                <option value="female">გოგონა</option>
                            </select>
                        </div>
                    </div>

                    <div class="ccm-form-group" style="flex: 1.45;">
                        <label class="ccm-label" for="ccm-child-phase" id="ccm-phase-label">სასწავლო ეტაპი</label>
                        <div class="ccm-input-wrap">
                            <span class="ccm-input-icon">🎓</span>
                            <select id="ccm-child-phase" class="ccm-select">
                                <option value="1">ეტაპი I (გაცვლა)</option>
                                <option value="2">ეტაპი II (მანძილი)</option>
                                <option value="3">ეტაპი III (გარჩევა)</option>
                                <option value="4" selected>ეტაპი IV (წინადადება)</option>
                                <option value="5">ეტაპი V (რა გინდა?)</option>
                                <option value="6">ეტაპი VI (კომენტირება)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 4. Footer Actions -->
                <div class="ccm-footer">
                    <button type="button" class="ccm-btn-cancel" onclick="app.closeModal('modal-create-child-profile')" id="ccm-btn-cancel">გაუქმება</button>
                    <button type="submit" class="ccm-btn-submit" id="ccm-btn-submit">
                        <span>✨</span> <span id="ccm-btn-submit-text">პროფილის შექმნა</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- 🎓 AAC Communication Phase Switcher Modal -->
    <div id="modal-phase-switcher" class="modal-backdrop">
        <div class="modal-box phase-switcher-box">
            <button class="modal-close-btn" onclick="app.closeModal('modal-phase-switcher')" title="დახურვა">✕</button>
            <div class="phase-switcher-header">
                <div class="phase-header-icon-badge">🎓</div>
                <div>
                    <h3 class="phase-modal-title" id="phase-modal-title">სასწავლო ეტაპის არჩევა</h3>
                    <p class="phase-modal-subtitle" id="phase-modal-sub">6-ეტაპიანი ვიზუალური კომუნიკაციის პროტოკოლი &middot; კლინიკური ადაპტაცია</p>
                </div>
            </div>

            <div class="phase-switcher-cards-grid">
                <div class="phase-pick-card card-phase-1" id="phase-pick-card-1" onclick="app.setActivePhase(1); app.closeModal('modal-phase-switcher');">
                    <div class="phase-badge-num phase-col-1">1</div>
                    <div class="phase-pick-info">
                        <strong>ეტაპი I: ფიზიკური გაცვლა</strong>
                        <span>1 მაღალი კონტრასტის სამიზნე ბარათი &middot; მყისიერი აკუსტიკური განმტკიცება</span>
                    </div>
                    <div class="phase-status-check"></div>
                </div>

                <div class="phase-pick-card card-phase-2" id="phase-pick-card-2" onclick="app.setActivePhase(2); app.closeModal('modal-phase-switcher');">
                    <div class="phase-badge-num phase-col-2">2</div>
                    <div class="phase-pick-info">
                        <strong>ეტაპი II: მანძილი &amp; დაჟინებულობა</strong>
                        <span>1 ბარათი + კომუნიკაციური მანძილი &amp; პარტნიორის გაწვდილი ხელი</span>
                    </div>
                    <div class="phase-status-check"></div>
                </div>

                <div class="phase-pick-card card-phase-3" id="phase-pick-card-3" onclick="app.setActivePhase(3); app.closeModal('modal-phase-switcher');">
                    <div class="phase-badge-num phase-col-3">3</div>
                    <div class="phase-pick-info">
                        <strong>ეტაპი III: ბარათების გარჩევა (A / B)</strong>
                        <span>2 ბარათი ზოლზე (სასურველი vs არასასურველი) &middot; ვიზუალური დისკრიმინაცია</span>
                    </div>
                    <div class="phase-status-check"></div>
                </div>

                <div class="phase-pick-card card-phase-4" id="phase-pick-card-4" onclick="app.setActivePhase(4); app.closeModal('modal-phase-switcher');">
                    <div class="phase-badge-num phase-col-4">4</div>
                    <div class="phase-pick-info">
                        <strong>ეტაპი IV: წინადადების სტრუქტურა</strong>
                        <span>წინადადების ზოლი &middot; [მე მინდა] + [ნივთი] გადატანა &amp; გაცვლა</span>
                    </div>
                    <div class="phase-status-check"></div>
                </div>

                <div class="phase-pick-card card-phase-5" id="phase-pick-card-5" onclick="app.setActivePhase(5); app.closeModal('modal-phase-switcher');">
                    <div class="phase-badge-num phase-col-5">5</div>
                    <div class="phase-pick-info">
                        <strong>ეტაპი V: პასუხი შეკითხვაზე („რა გინდა?“)</strong>
                        <span>პარტნიორის ვერბალური მოთხოვნა და ბავშვის პასუხი წინადადებით</span>
                    </div>
                    <div class="phase-status-check"></div>
                </div>

                <div class="phase-pick-card card-phase-6" id="phase-pick-card-6" onclick="app.setActivePhase(6); app.closeModal('modal-phase-switcher');">
                    <div class="phase-badge-num phase-col-6">6</div>
                    <div class="phase-pick-info">
                        <strong>ეტაპი VI: სპონტანური კომენტირება</strong>
                        <span>[მე ვხედავ] / [მე მესმის] &middot; გარემოს გაზიარება და სოციალური კომენტარი</span>
                    </div>
                    <div class="phase-status-check"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- 🎴 Target & Distractor Card Picker Modal -->
    <div id="modal-quick-card-picker" class="modal-backdrop">
        <div class="modal-box quick-card-picker-box">
            <button class="modal-close-btn" onclick="app.closeModal('modal-quick-card-picker')" title="დახურვა">✕</button>
            <div class="picker-header">
                <div style="font-size:28px;">🎴</div>
                <div>
                    <h3 style="font-size:18px; font-weight:900; color:#0F172A;" id="quick-picker-title">სამიზნე / დისტრაქტორი ბარათის არჩევა</h3>
                    <p style="font-size:12px; color:#64748B;" id="quick-picker-sub">აირჩიეთ რომელი ბარათი გამოჩნდეს საკომუნიკაციო ზოლზე</p>
                </div>
            </div>

            <!-- Role Selection for Phase 3: Target vs Distractor -->
            <div class="picker-role-toggle" id="picker-role-toggle" style="display:flex; gap:8px; margin-bottom:12px;">
                <button class="picker-role-btn active" id="btn-role-target" onclick="app.setPickerRole('target')">
                    🎯 სასურველი (სამიზნე ბარათი)
                </button>
                <button class="picker-role-btn" id="btn-role-distractor" onclick="app.setPickerRole('distractor')">
                    🛑 დისტრაქტორი (არასასურველი)
                </button>
            </div>

            <!-- Category Filter -->
            <div class="picker-categories-tabs" id="picker-categories-tabs"></div>

            <!-- Quick Search -->
            <div class="picker-search-box">
                <span>🔍</span>
                <input type="search" id="picker-search-input" name="picker_search_query" 
                       placeholder="მოძებნეთ ბარათი (მაგ: ბურთი, ვაშლი, წინდა)..." 
                       oninput="app.filterPickerCards(this.value)"
                       autocomplete="off"
                       autocorrect="off"
                       autocapitalize="off"
                       spellcheck="false"
                       data-lpignore="true"
                       data-form-type="other"
                       data-1p-ignore="true"
                       role="searchbox"
                       readonly
                       onpointerdown="this.readOnly=false;"
                       onfocus="this.readOnly=false;"
                       onblur="this.readOnly=true;">
            </div>

            <!-- Cards Grid for Selection -->
            <div class="picker-cards-grid" id="picker-cards-grid"></div>
        </div>
    </div>

    <!-- ========================================================
         Prompt Level Overlay & Modal (ABA Prompt Logging)
         ======================================================== -->
    <!-- Quick Prompt Popup on Tap (if enabled) -->
    <div id="prompt-tagging-overlay" class="prompt-tagging-overlay" style="display:none;">
        <div class="prompt-tag-box">
            <div class="prompt-tag-header-row">
                <div class="prompt-tag-title">
                    <span id="prompt-tag-header-label">🤝 ABA დახმარების დონე:</span>
                </div>
                <button type="button" class="pt-close-btn" onclick="app.closePromptTaggingOverlay()" title="დახურვა">✕</button>
            </div>
            <div class="prompt-tag-buttons">
                <button type="button" class="pt-btn pt-green" id="pt-btn-green" onclick="app.recordPromptTag(0)" title="სრულიად დამოუკიდებელი">
                    🟢 დამოუკიდებლად
                </button>
                <button type="button" class="pt-btn pt-yellow" id="pt-btn-yellow" onclick="app.recordPromptTag(1)" title="ნაწილობრივი დახმარება">
                    🟡 ნაწილობრივ
                </button>
                <button type="button" class="pt-btn pt-red" id="pt-btn-red" onclick="app.recordPromptTag(2)" title="სრული ფიზიკური დახმარება">
                    🔴 სრული
                </button>
            </div>
            <div class="prompt-tag-footer">
                <button type="button" onclick="app.togglePromptPopup(false)" class="btn-disable-prompt-popup" id="btn-disable-prompt-popup">
                    🔕 ფანჯრის გათიშვა (მხოლოდ ჰედერით აღრიცხვა)
                </button>
            </div>
        </div>
    </div>

    <!-- 🤝 ABA Prompt Level Modal -->
    <div id="prompt-level-modal" class="modal-backdrop prompt-level-modal-backdrop" style="display:none;" onclick="if(event.target===this) app.closePromptLevelModal()">
        <div class="modal-box prompt-modal-box">
            <button class="modal-close-btn" onclick="app.closePromptLevelModal()" title="დახურვა">✕</button>
            
            <div class="prompt-modal-header">
                <div class="prompt-header-icon-badge">🤝</div>
                <div>
                    <h3 class="prompt-modal-title" id="pm-title">ABA დახმარების დონის არჩევა</h3>
                    <p class="prompt-modal-subtitle" id="pm-sub">ABA დახმარების იერარქია &middot; მონაცემთა აღრიცხვა</p>
                </div>
            </div>

            <div class="prompt-intro-note" id="pm-intro">
                💡 <strong>ინსტრუქცია:</strong> აირჩიეთ მიმდინარე ცდაში გაწეული დახმარების დონე. ყოველი შეხება ავტომატურად ინიშნება ამ დონით:
            </div>

            <div class="prompt-choices-list">
                <button class="prompt-choice-btn level-0" id="pc-btn-0" onclick="app.setPromptLevel(0)">
                    <div class="pc-badge-orb pc-orb-green">🟢</div>
                    <div class="pc-info">
                        <strong class="pc-title" id="pc-title-0">დამოუკიდებლად <span class="pc-tag-eng">(დონე 0)</span></strong>
                        <span class="pc-desc" id="pc-desc-0">ბავშვი ირჩევს ბარათს ავტონომიურად, ჟესტებისა და ფიზიკური ჩარევის გარეშე</span>
                    </div>
                    <div class="pc-status-indicator"></div>
                </button>

                <button class="prompt-choice-btn level-1" id="pc-btn-1" onclick="app.setPromptLevel(1)">
                    <div class="pc-badge-orb pc-orb-yellow">🟡</div>
                    <div class="pc-info">
                        <strong class="pc-title" id="pc-title-1">ნაწილობრივი დახმარება <span class="pc-tag-eng">(დონე 1)</span></strong>
                        <span class="pc-desc" id="pc-desc-1">ვერბალური მინიშნება, ჟესტით მითითება ან მსუბუქი ფიზიკური მიმართვა</span>
                    </div>
                    <div class="pc-status-indicator"></div>
                </button>

                <button class="prompt-choice-btn level-2" id="pc-btn-2" onclick="app.setPromptLevel(2)">
                    <div class="pc-badge-orb pc-orb-red">🔴</div>
                    <div class="pc-info">
                        <strong class="pc-title" id="pc-title-2">სრული ფიზიკური დახმარება <span class="pc-tag-eng">(დონე 2)</span></strong>
                        <span class="pc-desc" id="pc-desc-2">ხელი-ხელზე გაცვლის სრული ფიზიკური თანხლება</span>
                    </div>
                    <div class="pc-status-indicator"></div>
                </button>
            </div>

            <div class="prompt-switch-footer">
                <div class="prompt-switch-text">
                    <span class="ps-title" id="ps-title-switch">🔔 სწრაფი ფანჯარა შეხებისას:</span>
                    <span class="ps-sub" id="ps-sub-switch">დაადასტურეთ დახმარების დონე ბარათზე ყოველი შეხების დროს</span>
                </div>
                <label class="prompt-toggle-switch">
                    <input type="checkbox" id="chk-prompt-popup" onchange="app.togglePromptPopup(this.checked)">
                    <span class="prompt-toggle-slider"></span>
                </label>
            </div>
        </div>
    </div>

    <!-- 📚 Card Library & Search Engine Modal -->
    <div id="modal-card-library" class="modal-backdrop modal-card-library-backdrop" style="display:none;" onclick="if(event.target===this) app.closeCardLibraryModal()">
        <div class="modal-box card-library-box">
            <button class="modal-close-btn" onclick="app.closeCardLibraryModal()" title="Close">✕</button>

            <!-- Modal Title -->
            <div class="lib-header">
                <div class="lib-header-icon">📚</div>
                <div>
                    <h3 class="lib-title">Card Library &amp; Search Engine</h3>
                    <p class="lib-subtitle">Choose from 160+ presets, search ARASAAC 10,000+ pictograms, or create your own</p>
                </div>
            </div>

            <!-- Live Search Bar -->
            <div class="lib-search-container">
                <span class="lib-search-ico">🔍</span>
                <input type="search" id="lib-search-input" name="library_search_query" class="lib-search-input" 
                       placeholder="Search any card (e.g. pizza, ball, dog, scooter)..." 
                       oninput="app.filterCardLibrary(this.value)" 
                       autocomplete="off"
                       autocorrect="off"
                       autocapitalize="off"
                       spellcheck="false"
                       data-lpignore="true"
                       data-form-type="other"
                       data-1p-ignore="true"
                       role="searchbox"
                       readonly
                       onpointerdown="this.readOnly=false;"
                       onfocus="this.readOnly=false;"
                       onblur="this.readOnly=true;">
                <button type="button" id="lib-search-clear" class="lib-search-clear-btn" onclick="app.clearLibrarySearch()" style="display:none;" title="Clear">✕</button>
            </div>

            <!-- Mode Switcher Tabs -->
            <div class="lib-nav-tabs">
                <button type="button" class="lib-nav-tab active" id="tab-btn-lib-preset" onclick="app.switchLibraryTab('preset')">
                    <span>📦</span> Preset Library (160+)
                </button>
                <button type="button" class="lib-nav-tab" id="tab-btn-lib-arasaac" onclick="app.switchLibraryTab('arasaac')">
                    <span>🌐</span> ARASAAC Online Search (10,000+)
                </button>
                <button type="button" class="lib-nav-tab" id="tab-btn-lib-create" onclick="app.switchLibraryTab('create')">
                    <span>✨</span> Create Custom Card
                </button>
            </div>

            <!-- Tab 1: Preset Library -->
            <div id="lib-view-preset" class="lib-view-panel">
                <!-- Category Filter Buttons -->
                <div class="lib-category-pills" id="lib-category-pills"></div>
                <!-- Card Count Indicator -->
                <div class="lib-results-counter" id="lib-results-counter"></div>
                <!-- Cards Grid -->
                <div class="lib-cards-grid" id="lib-preset-cards-grid"></div>
            </div>

            <!-- Tab 2: ARASAAC Online Search -->
            <div id="lib-view-arasaac" class="lib-view-panel" style="display:none;">
                <div class="arasaac-intro-bar">
                    <p id="arasaac-intro-p">🌐 <strong>ARASAAC-ის ოფიციალური პიქტოგრამები:</strong> ჩაწერეთ ნებისმიერი სიტყვა ქართულად ან ინგლისურად — სისტემა მყისიერად მოძებნის შესაბამის პიქტოგრამას და ერთი დაჭერით დაამატებს დაფაზე.</p>
                </div>
                <div id="lib-arasaac-results" class="arasaac-results-grid"></div>
            </div>

            <!-- Tab 3: Create Custom Card -->
            <div id="lib-view-create" class="lib-view-panel" style="display:none;">
                <div class="custom-card-maker-form">
                    <div class="cc-form-row">
                        <label class="cc-label" id="cc-lbl-name">ბარათის სახელი (ქართულად / ინგლისურად):</label>
                        <input type="text" id="cc-input-text" name="custom_card_title" class="cc-input" autocomplete="off" data-lpignore="true" placeholder="მაგ: სკუტერი, თბილი პლედი, საყვარელი ორცხობილა..." oninput="document.getElementById('cc-input-spoken').value = this.value">
                    </div>
                    <div class="cc-form-row">
                        <label class="cc-label" id="cc-lbl-spoken">გასახმოვანებელი ფრაზა:</label>
                        <input type="text" id="cc-input-spoken" name="custom_card_spoken" class="cc-input" autocomplete="off" data-lpignore="true" placeholder="ავტომატურად გაჟღერდება ბარათის სახელიდან">
                    </div>
                    <div class="cc-form-row cc-split-row">
                        <div style="flex:1;">
                            <label class="cc-label" id="cc-lbl-category">კატეგორია:</label>
                            <select id="cc-input-category" class="cc-select">
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
                            </select>
                        </div>
                        <div style="flex:1;">
                            <label class="cc-label" id="cc-lbl-type">ფიტცჯერალდის ტიპი (ფერი):</label>
                            <select id="cc-input-type" class="cc-select">
                                <option value="noun">არსებითი / ნივთი (ნარინჯისფერი)</option>
                                <option value="verb">მოქმედება / ზმნა (მწვანე)</option>
                                <option value="people">ადამიანი / სოციალური (ყვითელი)</option>
                                <option value="social">ემოცია / სოციალური (ვარდისფერი)</option>
                                <option value="adjective">თვისება / ზედსართავი (ლურჯი)</option>
                                <option value="basic">საბაზისო (ნაცრისფერი)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Image Selection: Emoji or Upload -->
                    <div class="cc-visual-picker-section">
                        <label class="cc-label" id="cc-lbl-visual">აირჩიეთ ვიზუალი (ემოჯი ან ფოტო):</label>
                        
                        <div class="cc-visual-options">
                            <!-- Quick Emoji Picker -->
                            <div class="cc-opt-box">
                                <div class="cc-opt-title" id="cc-opt-title-emoji">😀 ემოჯი აიკონი</div>
                                <div class="cc-emoji-preview-wrap">
                                    <input type="text" id="cc-input-emoji" class="cc-emoji-input" value="⭐" maxlength="4">
                                    <div class="cc-quick-emojis">
                                        <button type="button" onclick="app.setCustomCardEmoji('🍕')">🍕</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🍦')">🍦</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🛴')">🛴</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🍎')">🍎</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🧸')">🧸</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🎨')">🎨</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🚲')">🚲</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🐶')">🐶</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🐱')">🐱</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('🌈')">🌈</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('❤️')">❤️</button>
                                        <button type="button" onclick="app.setCustomCardEmoji('⭐')">⭐</button>
                                    </div>
                                </div>
                            </div>

                            <div class="cc-opt-divider" id="cc-opt-divider">ან</div>

                            <!-- Photo Upload / Camera -->
                            <div class="cc-opt-box">
                                <div class="cc-opt-title" id="cc-opt-title-photo">📷 პირადი ფოტო (კამერა ან ფაილი)</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                    <button type="button" class="cc-file-upload-label" onclick="app.triggerLibraryCardCameraCapture()" style="cursor: pointer; background: linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%); border-color: #3B82F6; margin: 0; padding: 10px 8px; width: 100%; font-family: inherit;">
                                        <span class="cc-upload-icon">📸</span>
                                        <span class="cc-upload-text" id="cc-upload-camera-text" style="color: #1D4ED8; font-weight: 800;">გადაღება კამერით</span>
                                    </button>
                                    <input type="file" id="cc-input-camera" accept="image/*" capture="environment" onchange="app.handleCustomCardFileSelect(event)" style="display:none;">

                                    <label class="cc-file-upload-label" for="cc-input-file" style="cursor: pointer; margin: 0; padding: 10px 8px;">
                                        <span class="cc-upload-icon">📁</span>
                                        <span class="cc-upload-text" id="cc-upload-file-text" style="font-weight: 800;">ფაილის ატვირთვა</span>
                                    </label>
                                    <input type="file" id="cc-input-file" accept="image/*" onchange="app.handleCustomCardFileSelect(event)" style="display:none;">
                                </div>
                                <div id="cc-file-preview-wrap" style="display:none; margin-top:10px; align-items:center; gap:12px; background:#F8FAFC; padding:8px 12px; border-radius:12px; border:1.5px solid #E2E8F0;">
                                    <img id="cc-file-preview-img" src="" style="width:54px; height:54px; border-radius:12px; object-fit:cover; border:2.5px solid #10B981; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                                    <div style="flex: 1; min-width: 0;">
                                        <div id="cc-upload-status-text" style="font-size:12px; font-weight:800; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">ფოტო მზადაა</div>
                                        <div id="cc-upload-size-text" style="font-size:11px; color:#059669; font-weight:700;">⚡ ოპტიმიზებული (30-40 KB)</div>
                                    </div>
                                    <button type="button" onclick="app.clearCustomCardFile()" class="icon-btn" id="cc-upload-remove-btn" style="padding:6px 10px; font-size:11.5px; border-radius:8px; background:#FEE2E2; color:#DC2626; border:none; font-weight:800; cursor:pointer;">✕ წაშლა</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="cc-submit-row">
                        <button type="button" class="btn-create-custom-card" id="btn-create-custom-card" onclick="app.createAndAddCustomCard()">
                            ✨ ბარათის შექმნა &amp; დაფაზე დამატება
                        </button>
                    </div>
                </div>
            </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 🔄 First-Then Setup & AI Generator Modal -->
    <div id="modal-first-then-setup" class="modal-backdrop">
        <div class="modal-box ft-setup-modal-box" style="max-width: 620px;">
            <button class="modal-close-btn" onclick="app.closeModal('modal-first-then-setup')">✕</button>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom: 12px;">
                <div style="width:46px; height:46px; border-radius:14px; background:#EFF6FF; display:flex; align-items:center; justify-content:center; font-size:24px; border:2px solid #BFDBFE;">🔄</div>
                <div>
                    <h2 class="modal-title" style="margin:0; font-size:20px; font-weight:900; color:#0F172A;" id="ft-modal-title">პირველ-შემდეგ რუტინის შემქმნელი</h2>
                    <p class="modal-subtitle" style="margin:2px 0 0 0; font-size:12.5px; color:#64748B;" id="ft-modal-subtitle">პრემაკის პრინციპი: დავალება ➔ წამახალისებელი ჯილდო</p>
                </div>
            </div>

            <!-- Tab Switcher: Quick Presets vs AI Prompt -->
            <div class="ft-setup-tabs">
                <button type="button" class="ft-setup-tab active" id="ft-tab-ai" onclick="app.switchFtSetupTab('ai')">
                    ✨ AI გენერატორი (Nemotron)
                </button>
                <button type="button" class="ft-setup-tab" id="ft-tab-presets" onclick="app.switchFtSetupTab('presets')">
                    ⚡ მზა შაბლონები
                </button>
            </div>

            <!-- TAB 1: AI Prompt with NVIDIA Nemotron -->
            <div id="ft-panel-ai" class="ft-setup-panel active">
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:13px; font-weight:800; color:#334155; margin-bottom:6px;" id="ft-ai-input-label">
                        მშობლის ან თერაპევტის მოთხოვნა:
                    </label>
                    <div style="position:relative;">
                        <textarea id="ft-ai-input" class="ft-textarea" rows="2" placeholder="მაგ. გააკეთე დავალება და მერე გაისეირნე ველოსიპედით..."></textarea>
                    </div>
                </div>

                <!-- Sample Prompt Chips -->
                <div style="margin-bottom: 14px;">
                    <span style="font-size:11.5px; font-weight:800; color:#64748B; display:block; margin-bottom:6px;" id="ft-chips-label">💡 სწრაფი იდეები (დააჭირეთ ჩასასმელად):</span>
                    <div class="ft-prompt-chips" id="ft-prompt-chips">
                        <button type="button" class="ft-chip" onclick="app.setFtAiInput('Eat meal and then play outside')">🍽️ სადილი ➔ 🌳 ეზო</button>
                        <button type="button" class="ft-chip" onclick="app.setFtAiInput('Finish homework and then ride bicycle')">📚 დავალება ➔ 🚲 ველოსიპედი</button>
                        <button type="button" class="ft-chip" onclick="app.setFtAiInput('Wash hands and then have snack')">🧼 ხელების დაბანა ➔ 🍪 სასუსნავი</button>
                        <button type="button" class="ft-chip" onclick="app.setFtAiInput('Clean room and then watch cartoons')">🧹 დალაგება ➔ 📺 მულტფილმები</button>
                        <button type="button" class="ft-chip" onclick="app.setFtAiInput('Brush teeth and then go to sleep')">🪥 კბილების გამოხეხვა ➔ 🛏️ ძილი</button>
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                    <span id="ft-ai-loading-status" style="font-size:12.5px; font-weight:700; color:#64748B;"></span>
                    <button type="button" id="btn-ft-generate" class="btn-primary-action ft-btn-generate" onclick="app.generateFirstThenWithAI()">
                        ✨ შექმნა Nemotron AI-ით
                    </button>
                </div>
            </div>

            <!-- TAB 2: Quick Presets -->
            <div id="ft-panel-presets" class="ft-setup-panel" style="display:none;">
                <div class="ft-presets-grid" id="ft-presets-grid">
                    <div class="ft-preset-card" onclick="app.launchFirstThenPreset('eat_play')">
                        <div class="ft-preset-icons">
                            <span class="p-icon first">🍽️</span>
                            <span class="p-arrow">➔</span>
                            <span class="p-icon then">⚽</span>
                        </div>
                        <div class="ft-preset-title" id="ft-preset-title-1">სადილი ➔ თამაში გარეთ</div>
                        <div class="ft-preset-desc" id="ft-preset-desc-1">ჯანსაღი სადილი ➔ ფეხბურთის თამაში ეზოში</div>
                    </div>
                    <div class="ft-preset-card" onclick="app.launchFirstThenPreset('study_bike')">
                        <div class="ft-preset-icons">
                            <span class="p-icon first">📚</span>
                            <span class="p-arrow">➔</span>
                            <span class="p-icon then">🚲</span>
                        </div>
                        <div class="ft-preset-title" id="ft-preset-title-2">დავალება ➔ ველოსიპედი</div>
                        <div class="ft-preset-desc" id="ft-preset-desc-2">სწავლის დასრულება ➔ გასეირნება ველოსიპედით</div>
                    </div>
                    <div class="ft-preset-card" onclick="app.launchFirstThenPreset('wash_snack')">
                        <div class="ft-preset-icons">
                            <span class="p-icon first">🧼</span>
                            <span class="p-arrow">➔</span>
                            <span class="p-icon then">🍪</span>
                        </div>
                        <div class="ft-preset-title" id="ft-preset-title-3">ხელების დაბანა ➔ სასუსნავი</div>
                        <div class="ft-preset-desc" id="ft-preset-desc-3">ხელების სუფთად დაბანა ➔ გემრიელი სასუსნავი</div>
                    </div>
                    <div class="ft-preset-card" onclick="app.launchFirstThenPreset('clean_cartoon')">
                        <div class="ft-preset-icons">
                            <span class="p-icon first">🧹</span>
                            <span class="p-arrow">➔</span>
                            <span class="p-icon then">📺</span>
                        </div>
                        <div class="ft-preset-title" id="ft-preset-title-4">დალაგება ➔ მულტფილმები</div>
                        <div class="ft-preset-desc" id="ft-preset-desc-4">ოთახის დალაგება ➔ საყვარელი მულტფილმი</div>
                    </div>
                    <div class="ft-preset-card" onclick="app.launchFirstThenPreset('teeth_sleep')">
                        <div class="ft-preset-icons">
                            <span class="p-icon first">🪥</span>
                            <span class="p-arrow">➔</span>
                            <span class="p-icon then">🛏️</span>
                        </div>
                        <div class="ft-preset-title" id="ft-preset-title-5">კბილების გახეხვა ➔ ძილი</div>
                        <div class="ft-preset-desc" id="ft-preset-desc-5">კბილების გამოხეხვა ➔ მშვიდი ძილი</div>
                    </div>
                    <div class="ft-preset-card" onclick="app.launchFirstThenPreset('dress_car')">
                        <div class="ft-preset-icons">
                            <span class="p-icon first">👕</span>
                            <span class="p-arrow">➔</span>
                            <span class="p-icon then">🚗</span>
                        </div>
                        <div class="ft-preset-title" id="ft-preset-title-6">ჩაცმა ➔ მგზავრობა მანქანით</div>
                        <div class="ft-preset-desc" id="ft-preset-desc-6">ტანსაცმლის ჩაცმა ➔ გასეირნება მანქანით</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 🎙️ Express Voice Recording Studio Modal -->
    <div id="modal-voice-studio" class="modal-backdrop">
        <div class="modal-box" style="max-width: 540px; text-align: center; border-radius: 24px; padding: 24px;">
            <button class="modal-close-btn" onclick="app.closeModal('modal-voice-studio')">✕</button>
            <h2 class="modal-title" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 20px;">
                <span>🎙️</span> <span id="voice-studio-title">სწრაფი ხმის ჩაწერის სტუდია</span>
            </h2>
            <p class="modal-subtitle" id="voice-studio-subtitle" style="font-size: 12px; margin-top: 2px;">გაახმოვანეთ ბარათები მშობლის ან თერაპევტის თბილი, მშობლიური ხმით</p>

            <!-- Progress & Quick Select / Search -->
            <div style="display: flex; flex-direction: column; gap: 10px; margin: 12px 0; background: #F8FAFC; padding: 12px 14px; border-radius: 16px; border: 1.5px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <span id="voice-studio-counter" style="font-size: 12px; font-weight: 800; color: #4338CA; background: #EEF2FF; padding: 4px 10px; border-radius: 20px; white-space: nowrap;">ბარათი 1 / 60</span>
                    <input type="search" id="voice-studio-search" name="voice_studio_search_query" 
                           placeholder="🔍 მოძებნეთ გასახმოვანებელი ბარათი..." 
                           oninput="app.filterVoiceStudioSelect(this.value)" 
                           autocomplete="off"
                           autocorrect="off"
                           autocapitalize="off"
                           spellcheck="false"
                           data-lpignore="true"
                           data-form-type="other"
                           data-1p-ignore="true"
                           role="searchbox"
                           readonly
                           onpointerdown="this.readOnly=false;"
                           onfocus="this.readOnly=false;"
                           onblur="this.readOnly=true;"
                           style="flex: 1; max-width: 280px; padding: 7px 12px; border-radius: 10px; border: 1.5px solid #CBD5E1; font-weight: 700; font-size: 13px; outline: none; background: #FFF; box-sizing: border-box;">
                </div>
                <select id="voice-studio-select" onchange="app.selectVoiceStudioCard(this.value)" style="width: 100%; box-sizing: border-box; padding: 9px 12px; border-radius: 10px; border: 1.5px solid #CBD5E1; font-weight: 800; font-size: 14px; outline: none; background: #FFF; cursor: pointer; color: #1E293B;"></select>
            </div>

            <!-- Card Display Showcase -->
            <div id="voice-studio-card-preview" style="background: #FFF; border: 3px solid #E2E8F0; border-radius: 20px; padding: 20px; margin: 12px 0; box-shadow: 0 8px 24px rgba(0,0,0,0.06); transition: all 0.2s ease;">
                <div id="voice-studio-source-badge" style="display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; background: #E0F2FE; color: #0369A1; margin-bottom: 8px;">🤖 სტანდარტული ხმა</div>
                <div id="voice-studio-icon" style="font-size: 64px; line-height: 1; margin-bottom: 10px;">🧃</div>
                <div id="voice-studio-text" style="font-size: 26px; font-weight: 900; color: #1E293B;">წვენი</div>
                <div id="voice-studio-hint" style="font-size: 13px; color: #64748B; margin-top: 4px;">წარმოთქვით გარკვევით და თბილად: <strong id="voice-studio-hint-word">"წვენი"</strong></div>
            </div>

            <!-- Live VU Meter -->
            <div id="voice-studio-vu-container" style="display: none; width: 100%; max-width: 320px; height: 10px; background: #E2E8F0; border-radius: 6px; overflow: hidden; margin: 0 auto 10px auto;">
                <div id="voice-studio-vu-bar" style="width: 0%; height: 100%; background: #10B981; transition: width 0.06s ease; border-radius: 6px;"></div>
            </div>

            <!-- Recording Control Panel -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 10px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; flex-wrap: wrap;">
                    <span id="voice-studio-timer" style="font-family: monospace; font-size: 18px; font-weight: 900; color: #DC2626; display: none;">00:00</span>
                    <button id="btn-voice-studio-rec" class="rec-btn" onclick="app.toggleExpressVoiceRecord()" style="min-width: 180px; height: 50px; font-size: 15px; font-weight: 800; border-radius: 25px; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35); cursor: pointer;">
                        🔴 ჩაწერა
                    </button>
                    <button id="btn-voice-studio-play" onclick="app.playExpressVoicePreview()" style="height: 50px; padding: 0 16px; border-radius: 25px; font-size: 14px; font-weight: 800; background: #0284C7; color: white; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                        <span>▶️</span> <span id="voice-studio-play-label">მოსმენა</span>
                    </button>
                    <button id="btn-voice-studio-reset" onclick="app.resetExpressVoiceCard()" style="display: none; height: 50px; padding: 0 14px; border-radius: 25px; font-size: 13px; font-weight: 700; background: #F1F5F9; color: #64748B; border: 1.5px solid #CBD5E1; cursor: pointer;" title="ჩაწერილი ხმის წაშლა და სტანდარტული TTS-ის დაბრუნება">
                        🗑️ TTS-ზე დაბრუნება
                    </button>
                </div>

                <div id="voice-studio-status" style="font-size: 13px; font-weight: 700; color: #059669; min-height: 20px;"></div>

                <!-- Navigation Buttons -->
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 8px; padding-top: 12px; border-top: 1px solid #E2E8F0;">
                    <button id="btn-voice-studio-prev" onclick="app.prevVoiceStudioCard()" class="icon-btn" style="padding: 8px 18px; font-size: 14px; font-weight: 700; border-radius: 12px;">
                        ⬅️ წინა
                    </button>
                    <button id="btn-voice-studio-next" onclick="app.nextVoiceStudioCard()" class="icon-btn" style="padding: 8px 18px; font-size: 14px; font-weight: 700; border-radius: 12px; background: #3B82F6; color: white; border: none;">
                        შემდეგი ➡️
                    </button>
                </div>
                <button type="button" id="btn-voice-studio-reset-all" onclick="app.resetAllCustomRecordings()" style="background: none; border: none; color: #EF4444; font-size: 11px; font-weight: 700; cursor: pointer; margin-top: 6px; text-decoration: underline; font-family: inherit;">
                    🗑️ ყველა ჩაწერილი ხმის განულება სტანდარტულ ნეირონულ TTS-ზე
                </button>
            </div>
        </div>
    </div>

    <!-- TensorFlow.js & AI Vision Models for Real-Time On-Device Object Detection -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js"></script>
    <!-- Scripts -->
    <script src="assets/js/xlsx.full.min.js"></script>
    <script src="assets/js/audio.js?v=<?= time() ?>"></script>
    <script src="assets/js/voxis_app.js?v=<?= time() ?>"></script>
    <script src="assets/js/voxis_ai.js?v=<?= time() ?>"></script>

    <!-- PWA Service Worker (Network-First: always fresh online, offline fallback) -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js').then(reg => {
                    reg.update();
                }).catch(err => {
                    console.log('SW registration skipped:', err);
                });
            });
        }
    </script>
</body>
</html>
