/**
 * PECSAAC Audio & Speech Synthesis Engine
 * Provides sensory-friendly tactile audio feedback, Georgian Speech Synthesis,
 * and Live Microphone Voice Recording (დედის/თერაპევტის ხმის ჩაწერა)
 */

class PecsAudio {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        // 🌸 თბილი, მშვიდი, დედის/მასწავლებლის ქართული ხმის პარამეტრები:
        // ოდნავ ნელი (0.82) - სიტყვების მკაფიოდ გასარჩევად, თბილი მელოდიური ტემბრი (1.12)
        this.speechRate = 0.82;
        this.speechPitch = 1.12;
        this.georgianVoice = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        if (localStorage.getItem('pecs_voice_v') !== 'bella_final') {
            localStorage.setItem('pecs_tts_voice', 'bella');
            localStorage.setItem('pecs_voice_v', 'bella_final');
        }
        this.currentVoice = 'bella';

        // 🎙️ ქართული ფრაზები 100% Bella (ElevenLabs AI) ხმით გენერირდება და ქეშირდება ადგილობრივად
        this.phraseAudioMap = {
            // Core & Prompts
            'გთხოვთ აირჩიოთ ბარათი': 'assets/audio/cards/prompt_select_card.mp3',
            'ჯერ ააწყვეთ წინადადება გადასაცემად': 'assets/audio/cards/prompt_build_sentence.mp3',
            'მინდა': 'assets/audio/cards/core_want.mp3',
            'მე მინდა': 'assets/audio/cards/starter_want.mp3',
            'არ მინდა': 'assets/audio/cards/core_dont_want.mp3',
            'დამეხმარე': 'assets/audio/cards/core_help_me.mp3',
            'კიდევ მინდა': 'assets/audio/cards/core_more_want.mp3',
            'მორჩა': 'assets/audio/cards/c_finished.mp3',
            'ყოჩაღ! შესანიშნავია!': 'assets/audio/cards/praise_bravo.mp3',
            'ძალიან კარგია!': 'assets/audio/cards/praise_good_job.mp3',
            'ყოჩაღ, შენ ეს შეძელი!': 'assets/audio/cards/praise_super.mp3',
            'გამარჯობა! მე მზად ვარ სასაუბროდ.': 'assets/audio/cards/head_sound_test.mp3',
            'გამარჯობა! მე ვარ ბელა, მზად ვარ სასაუბროდ.': 'assets/audio/cards/prompt_welcome_bella.mp3',
            'გამარჯობა! მე ვარ ბელა, მზად ვარ სასაუბროდ': 'assets/audio/cards/prompt_welcome_bella.mp3',
            'დრო ამოიწურა, ყოჩაღ!': 'assets/audio/cards/prompt_timer_up.mp3',
            'დრო ამოიწურა, ყოჩაღ': 'assets/audio/cards/prompt_timer_up.mp3',
            'ხმის სიჩქარე შეცვლილია': 'assets/audio/cards/prompt_voice_speed.mp3',
            'ხმის სიჩქარე შეცვლილია.': 'assets/audio/cards/prompt_voice_speed.mp3',
            'ხმის ტონი შეცვლილია': 'assets/audio/cards/prompt_voice_pitch.mp3',
            'ხმის ტონი შეცვლილია.': 'assets/audio/cards/prompt_voice_pitch.mp3',
            'ჯერ პირველი დავალება': 'assets/audio/cards/prompt_choose_task_first.mp3',
            'ჯერ პირველი დავალება.': 'assets/audio/cards/prompt_choose_task_first.mp3',
            'ჯერ ეს დავალება': 'assets/audio/cards/prompt_choose_task_this.mp3',
            'ჯერ ეს დავალება.': 'assets/audio/cards/prompt_choose_task_this.mp3',
            'შესანიშნავია! ორივე დავალება შესრულებულია.': 'assets/audio/cards/prompt_routine_complete.mp3',
            'შესანიშნავია! ორივე დავალება შესრულებულია': 'assets/audio/cards/prompt_routine_complete.mp3',

            // First-Then (პირველად-შემდეგ)
            'პირველად: სადილის ჭამა. შემდეგ: ბურთით თამაში.': 'assets/audio/cards/ft_routine_eat_play.mp3',
            'ყოჩაღ! პირველი ნაბიჯი მზადაა, ახლა შეგიძლია ბურთით ითამაშო!': 'assets/audio/cards/ft_praise_ball.mp3',
            'ყოჩაღ! სადილი მიირთვი, ახლა დროა ბურთით ვითამაშოთ!': 'assets/audio/cards/ft_praise_eat_play.mp3',
            'პირველად: საშინაო დავალება. შემდეგ: ველოსიპედით სეირნობა.': 'assets/audio/cards/ft_routine_study_bike.mp3',
            'ყოჩაღ! პირველი ნაბიჯი მზადაა, ახლა შეგიძლია ველოსიპედით ისეირნო!': 'assets/audio/cards/ft_praise_bike.mp3',
            'ყოჩაღ! დავალება მზადაა, ახლა დროა ველოსიპედით ვისეირნოთ!': 'assets/audio/cards/ft_praise_study_bike.mp3',
            'პირველად: ხელების დაბანა. შემდეგ: წახემსება / ორცხობილა.': 'assets/audio/cards/ft_routine_wash_snack.mp3',
            'ყოჩაღ! პირველი ნაბიჯი მზადაა, ახლა შეგიძლია გემრიელად წაიხემსო!': 'assets/audio/cards/ft_praise_snack.mp3',
            'ყოჩაღ! ხელები სუფთაა, ახლა დროა გემრიელად წავიხემსოთ!': 'assets/audio/cards/ft_praise_wash_snack.mp3',
            'პირველად: ოთახის დალაგება. შემდეგ: მულტფილმის ყურება.': 'assets/audio/cards/ft_routine_clean_cartoon.mp3',
            'ყოჩაღ! პირველი ნაბიჯი მზადაა, ახლა შეგიძლია მულტფილმს უყურო!': 'assets/audio/cards/ft_praise_cartoon.mp3',
            'ყოჩაღ! ოთახი დალაგებულია, ახლა დროა მულტფილმს ვუყუროთ!': 'assets/audio/cards/ft_praise_clean_cartoon.mp3',
            'პირველად: კბილების გახეხვა. შემდეგ: დასვენება და ძილი.': 'assets/audio/cards/ft_routine_teeth_sleep.mp3',
            'ყოჩაღ! პირველი ნაბიჯი მზადაა, ახლა შეგიძლია დაისვენო!': 'assets/audio/cards/ft_praise_sleep.mp3',
            'ყოჩაღ! კბილები გახეხილია, ახლა დროა დავისვენოთ და დავიძინოთ!': 'assets/audio/cards/ft_praise_teeth_sleep.mp3',
            'დრო ამოიწურა! პირველი ნაბიჯი მზადაა, გადაწიე სლაიდერი!': 'assets/audio/cards/ft_timer_timeout.mp3',
            'ყოჩაღ! ყველა ნაბიჯი შესრულდა!': 'assets/audio/cards/ft_substeps_all_done.mp3',
            'პირველად: ტანსაცმლის ჩაცმა. შემდეგ: მანქანით გასეირნება.': 'assets/audio/cards/ft_routine_dress_car.mp3',
            'ყოჩაღ! ჩაცმული ხარ, ახლა დროა მანქანით გავისეირნოთ!': 'assets/audio/cards/ft_praise_dress_car.mp3',
            'მე მინდა: ბურთით თამაში': 'assets/audio/cards/ft_ka_want_ball.mp3',
            'მე მინდა: ველოსიპედით სეირნობა': 'assets/audio/cards/ft_ka_want_bike.mp3',
            'მე მინდა: მულტფილმის ყურება': 'assets/audio/cards/ft_ka_want_cartoon.mp3',

            // ემოციები (Variant A)
            'მიხარია': 'assets/audio/cards/c_happy.mp3',
            'მწყინს': 'assets/audio/cards/c_sad.mp3',
            'გავბრაზდი': 'assets/audio/cards/c_angry.mp3',
            'დავიღალე': 'assets/audio/cards/c_tired.mp3',
            'მეშინია': 'assets/audio/cards/c_scared.mp3',
            'მუცელი მტკივა': 'assets/audio/cards/c_belly_hurt.mp3',
            'თავი მტკივა': 'assets/audio/cards/c_head_hurt.mp3',
            'ყელი': 'assets/audio/cards/pain_throat.mp3',
            'ყელი მტკივა': 'assets/audio/cards/pain_throat_hurt.mp3',
            'ყელი (მტკივა)': 'assets/audio/cards/pain_throat_hurt.mp3',
            'ყელი ოდნავ მტკივა': 'assets/audio/cards/pain_throat_1.mp3',
            'ყელი (ოდნავ მტკივა)': 'assets/audio/cards/pain_throat_1.mp3',
            'ყელი საშუალოდ მტკივა': 'assets/audio/cards/pain_throat_2.mp3',
            'ყელი (საშუალოდ მტკივა)': 'assets/audio/cards/pain_throat_2.mp3',
            'ყელი ძალიან მტკივა': 'assets/audio/cards/pain_throat_3.mp3',
            'ყელი (ძალიან მტკივა)': 'assets/audio/cards/pain_throat_3.mp3',

            // 📅 დღის ვიზუალური განრიგი (Visual Schedule - Bella)
            'სათამაშოების ალაგება': 'assets/audio/cards/vs_satamashoebis_alageba.mp3',
            'ვახშმის ჭამა': 'assets/audio/cards/vs_vakhshmis_chama.mp3',
            'თბილი შხაპი / აბაზანა': 'assets/audio/cards/vs_tbili_shkhapi_abazana.mp3',
            'თბილი შხაპი ან აბაზანა': 'assets/audio/cards/vs_tbili_shkhapi_abazana.mp3',
            'თბილი შხაპი და აბაზანა': 'assets/audio/cards/vs_tbili_shkhapi_abazana.mp3',
            'პიჟამის ჩაცმა': 'assets/audio/cards/vs_pizhamis_chatsma.mp3',
            'ზღაპრის მოსმენა & ძილი': 'assets/audio/cards/vs_zgapris_mosmena_dzili.mp3',
            'ზღაპრის მოსმენა და ძილი': 'assets/audio/cards/vs_zgapris_mosmena_dzili.mp3',
            'საწოლიდან ადგომა': 'assets/audio/cards/vs_sawolidan_adgoma.mp3',
            'ტუალეტში შესვლა': 'assets/audio/cards/vs_tualetshi_shesvla.mp3',
            'კბილების გახეხვა & დაბანა': 'assets/audio/cards/vs_kbilebis_gakhekhva.mp3',
            'კბილების გახეხვა და დაბანა': 'assets/audio/cards/vs_kbilebis_gakhekhva.mp3',
            'ტანსაცმლის ჩაცმა': 'assets/audio/cards/vs_tansacmlis_chatsma.mp3',
            'გემრიელი საუზმე': 'assets/audio/cards/vs_gemrieli_sauzme.mp3',
            'ჩანთის ჩალაგება': 'assets/audio/cards/vs_chantis_chalageba.mp3',
            'სკოლაში / ბაღში მისვლა': 'assets/audio/cards/vs_skolashi_misvla.mp3',
            'სკოლაში და ბაღში მისვლა': 'assets/audio/cards/vs_skolashi_misvla.mp3',
            'სკოლაში ან ბაღში მისვლა': 'assets/audio/cards/vs_skolashi_misvla.mp3',
            'მეცადინეობა & ხატვა': 'assets/audio/cards/vs_mecadineoba_khatva.mp3',
            'მეცადინეობა და ხატვა': 'assets/audio/cards/vs_mecadineoba_khatva.mp3',
            'ეზოში თამაში & ლანჩი': 'assets/audio/cards/vs_ezoshi_tamashi.mp3',
            'ეზოში თამაში და ლანჩი': 'assets/audio/cards/vs_ezoshi_tamashi.mp3',
            'სახლში დაბრუნება': 'assets/audio/cards/vs_sakhlshi_dabruneba.mp3',

            // განრიგის შექებები (Praises)
            'ყოჩაღ! სათამაშოების ალაგება შესრულდა!': 'assets/audio/cards/vs_praise_satamashoebi.mp3',
            'ყოჩაღ! ვახშმის ჭამა შესრულდა!': 'assets/audio/cards/vs_praise_vakhshami.mp3',
            'ყოჩაღ! თბილი შხაპი / აბაზანა შესრულდა!': 'assets/audio/cards/vs_praise_shkhapi.mp3',
            'ყოჩაღ! თბილი შხაპი და აბაზანა შესრულდა!': 'assets/audio/cards/vs_praise_shkhapi.mp3',
            'ყოჩაღ! პიჟამის ჩაცმა შესრულდა!': 'assets/audio/cards/vs_praise_pizhama.mp3',
            'ყოჩაღ! ზღაპრის მოსმენა & ძილი შესრულდა!': 'assets/audio/cards/vs_praise_zgapari.mp3',
            'ყოჩაღ! ზღაპრის მოსმენა და ძილი შესრულდა!': 'assets/audio/cards/vs_praise_zgapari.mp3',
            'ყოჩაღ! საწოლიდან ადგომა შესრულდა!': 'assets/audio/cards/vs_praise_sawoli.mp3',
            'ყოჩაღ! ტუალეტში შესვლა შესრულდა!': 'assets/audio/cards/vs_praise_tualeti.mp3',
            'ყოჩაღ! კბილების გახეხვა & დაბანა შესრულდა!': 'assets/audio/cards/vs_praise_kbilebi.mp3',
            'ყოჩაღ! კბილების გახეხვა და დაბანა შესრულდა!': 'assets/audio/cards/vs_praise_kbilebi.mp3',
            'ყოჩაღ! ტანსაცმლის ჩაცმა შესრულდა!': 'assets/audio/cards/vs_praise_tansatsmeli.mp3',
            'ყოჩაღ! გემრიელი საუზმე შესრულდა!': 'assets/audio/cards/vs_praise_sauzme.mp3',
            'ყოჩაღ! ჩანთის ჩალაგება შესრულდა!': 'assets/audio/cards/vs_praise_chanta.mp3',
            'ყოჩაღ! სკოლაში / ბაღში მისვლა შესრულდა!': 'assets/audio/cards/vs_praise_skola.mp3',
            'ყოჩაღ! სკოლაში და ბაღში მისვლა შესრულდა!': 'assets/audio/cards/vs_praise_skola.mp3',
            'ყოჩაღ! მეცადინეობა & ხატვა შესრულდა!': 'assets/audio/cards/vs_praise_mecadineoba.mp3',
            'ყოჩაღ! მეცადინეობა და ხატვა შესრულდა!': 'assets/audio/cards/vs_praise_mecadineoba.mp3',
            'ყოჩაღ! ეზოში თამაში & ლანჩი შესრულდა!': 'assets/audio/cards/vs_praise_ezo.mp3',
            'ყოჩაღ! ეზოში თამაში და ლანჩი შესრულდა!': 'assets/audio/cards/vs_praise_ezo.mp3',
            'ყოჩაღ! სახლში დაბრუნება შესრულდა!': 'assets/audio/cards/vs_praise_sakhli.mp3',
            'ყოჩაღ! მთელი განრიგი წარმატებით შესრულდა! შენ ნამდვილი ჩემპიონი ხარ!': 'assets/audio/cards/vs_schedule_complete.mp3',

            // 🎮 „იპოვე ბარათი“ (Receptive Language Game - Bella)
            'სად არის?': 'assets/audio/cards/game_where_is.mp3',
            'სად არის': 'assets/audio/cards/game_where_is.mp3',
            'იპოვე ბარათი!': 'assets/audio/cards/game_find_card.mp3',
            'იპოვე ბარათი': 'assets/audio/cards/game_find_card.mp3',
            'მაჩვენე!': 'assets/audio/cards/game_show_me.mp3',
            'მაჩვენე': 'assets/audio/cards/game_show_me.mp3',
            'ყოჩაღ, სწორია!': 'assets/audio/cards/game_correct_praise.mp3',
            'ყოჩაღ, სწორია': 'assets/audio/cards/game_correct_praise.mp3',
            'არა უშავს, კიდევ სცადე.': 'assets/audio/cards/game_try_again.mp3',
            'არა უშავს, კიდევ სცადე': 'assets/audio/cards/game_try_again.mp3',
            'არა უშავს, სცადე კიდევ.': 'assets/audio/cards/game_try_again.mp3',
            'არა უშავს, სცადე კიდევ': 'assets/audio/cards/game_try_again.mp3'
        };


        this.phraseAudioMapEn = {
            'Happy': 'assets/audio/cards/c_happy_en.mp3',
            'Sad': 'assets/audio/cards/c_sad_en.mp3',
            'Angry': 'assets/audio/cards/c_angry_en.mp3',
            'Tired': 'assets/audio/cards/c_tired_en.mp3',
            'Scared': 'assets/audio/cards/c_scared_en.mp3',
            'Stomach hurts': 'assets/audio/cards/c_belly_hurt_en.mp3',
            'Head hurts': 'assets/audio/cards/c_head_hurt_en.mp3',
            'Stomach hurt': 'assets/audio/cards/c_belly_hurt_en.mp3',
            'Stomach ache': 'assets/audio/cards/c_belly_hurt_en.mp3',
            'Headache': 'assets/audio/cards/c_head_hurt_en.mp3',

            // 🎮 Find the Card Game (Receptive Language - Bella)
            'Where is': 'assets/audio/cards/game_where_is_en.mp3',
            'Where is?': 'assets/audio/cards/game_where_is_en.mp3',
            'Find the card!': 'assets/audio/cards/game_find_card_en.mp3',
            'Find the card': 'assets/audio/cards/game_find_card_en.mp3',
            'Show me!': 'assets/audio/cards/game_show_me_en.mp3',
            'Show me': 'assets/audio/cards/game_show_me_en.mp3',
            'Great job, that is right!': 'assets/audio/cards/game_correct_praise_en.mp3',
            'Great job, that is right': 'assets/audio/cards/game_correct_praise_en.mp3',
            'Great job, that\'s right!': 'assets/audio/cards/game_correct_praise_en.mp3',
            'Great job, that\'s right': 'assets/audio/cards/game_correct_praise_en.mp3',
            'Try again!': 'assets/audio/cards/game_try_again_en.mp3',
            'Try again': 'assets/audio/cards/game_try_again_en.mp3',

            // First -> Then Routines & Praises (English - Bella)
            'First: Eat Meal. Then: Play Outside.': 'assets/audio/cards/ft_en_routine_eat_play.mp3',
            'First: Eat Meal. Then: Play Outside': 'assets/audio/cards/ft_en_routine_eat_play.mp3',
            "Great job eating your meal! Now let's play outside!": 'assets/audio/cards/ft_en_praise_eat_play.mp3',
            "Great job eating your meal! Now let's play outside": 'assets/audio/cards/ft_en_praise_eat_play.mp3',
            'First: Homework. Then: Bicycle Ride.': 'assets/audio/cards/ft_en_routine_study_bike.mp3',
            'First: Homework. Then: Bicycle Ride': 'assets/audio/cards/ft_en_routine_study_bike.mp3',
            'Awesome! Homework is done, time to ride your bicycle!': 'assets/audio/cards/ft_en_praise_study_bike.mp3',
            'Awesome! Homework is done, time to ride your bicycle': 'assets/audio/cards/ft_en_praise_study_bike.mp3',
            'First: Wash Hands. Then: Snack / Cookie.': 'assets/audio/cards/ft_en_routine_wash_snack.mp3',
            'First: Wash Hands. Then: Snack / Cookie': 'assets/audio/cards/ft_en_routine_wash_snack.mp3',
            'Super clean hands! Now time for a delicious snack!': 'assets/audio/cards/ft_en_praise_wash_snack.mp3',
            'Super clean hands! Now time for a delicious snack': 'assets/audio/cards/ft_en_praise_wash_snack.mp3',
            'First: Tidy Room. Then: Watch Cartoons.': 'assets/audio/cards/ft_en_routine_clean_cartoon.mp3',
            'First: Tidy Room. Then: Watch Cartoons': 'assets/audio/cards/ft_en_routine_clean_cartoon.mp3',
            "Room is tidy and clean! Now it's cartoon time!": 'assets/audio/cards/ft_en_praise_clean_cartoon.mp3',
            "Room is tidy and clean! Now it's cartoon time": 'assets/audio/cards/ft_en_praise_clean_cartoon.mp3',
            'First: Brush Teeth. Then: Bedtime & Sleep.': 'assets/audio/cards/ft_en_routine_teeth_sleep.mp3',
            'First: Brush Teeth. Then: Bedtime & Sleep': 'assets/audio/cards/ft_en_routine_teeth_sleep.mp3',
            'Shiny clean teeth! Time for sweet dreams and rest!': 'assets/audio/cards/ft_en_praise_teeth_sleep.mp3',
            'Shiny clean teeth! Time for sweet dreams and rest': 'assets/audio/cards/ft_en_praise_teeth_sleep.mp3',
            'First: Get Dressed. Then: Car Trip.': 'assets/audio/cards/ft_en_routine_dress_car.mp3',
            'First: Get Dressed. Then: Car Trip': 'assets/audio/cards/ft_en_routine_dress_car.mp3',
            "Great job getting dressed! Let's go for a fun drive!": 'assets/audio/cards/ft_en_praise_dress_car.mp3',
            "Great job getting dressed! Let's go for a fun drive": 'assets/audio/cards/ft_en_praise_dress_car.mp3',
            "Awesome! Step one is complete, now it's time to play!": 'assets/audio/cards/ft_en_praise_generic.mp3',
            "Awesome! Step one is complete, now it's time to play": 'assets/audio/cards/ft_en_praise_generic.mp3',
            'Super! All micro-steps completed!': 'assets/audio/cards/ft_en_substeps_all_done.mp3',
            'Super! All micro-steps completed': 'assets/audio/cards/ft_en_substeps_all_done.mp3',
            'Time is up! First step is done, drag the slider!': 'assets/audio/cards/ft_en_timer_timeout.mp3',
            'Time is up! First step is done, drag the slider': 'assets/audio/cards/ft_en_timer_timeout.mp3',
            'Time is up! Step one is ready, drag the slider!': 'assets/audio/cards/ft_en_timer_timeout_ready.mp3',
            'Time is up! Step one is ready, drag the slider': 'assets/audio/cards/ft_en_timer_timeout_ready.mp3',
            'First: Wash Hands. Then: Snack or Cookie.': 'assets/audio/cards/ft_en_routine_wash_snack.mp3',
            'First: Wash Hands. Then: Snack or Cookie': 'assets/audio/cards/ft_en_routine_wash_snack.mp3',
            'First: Brush Teeth. Then: Bedtime and Sleep.': 'assets/audio/cards/ft_en_routine_teeth_sleep.mp3',
            'First: Brush Teeth. Then: Bedtime and Sleep': 'assets/audio/cards/ft_en_routine_teeth_sleep.mp3',
            'Please select a card': 'assets/audio/cards/ft_en_prompt_select_card.mp3',
            'Build a sentence first to hand over': 'assets/audio/cards/ft_en_prompt_build_sentence.mp3',
            'Hello! I am ready to communicate.': 'assets/audio/cards/ft_en_head_sound.mp3',
            'Hello! I am ready to communicate': 'assets/audio/cards/ft_en_head_sound.mp3',
            'Great job! The entire schedule is completed! You are a true champion!': 'assets/audio/cards/ft_en_sched_complete.mp3',
            'Great job! The entire schedule is completed! You are a true champion': 'assets/audio/cards/ft_en_sched_complete.mp3',
            'Time is up, great job!': 'assets/audio/cards/ft_en_timer_done.mp3',
            'Time is up, great job': 'assets/audio/cards/ft_en_timer_done.mp3',

            // Visual Daily Schedule Steps (Morning)
            'Wake up & get out of bed': 'assets/audio/cards/vs_en_wake_up.mp3',
            'Wake up and get out of bed': 'assets/audio/cards/vs_en_wake_up.mp3',
            'Bathroom & toilet': 'assets/audio/cards/vs_en_bathroom.mp3',
            'Bathroom and toilet': 'assets/audio/cards/vs_en_bathroom.mp3',
            'Brush teeth & wash face': 'assets/audio/cards/vs_en_brush_teeth.mp3',
            'Brush teeth and wash face': 'assets/audio/cards/vs_en_brush_teeth.mp3',
            'Get dressed': 'assets/audio/cards/vs_en_get_dressed.mp3',
            'Eat healthy breakfast': 'assets/audio/cards/vs_en_eat_breakfast.mp3',
            'Great job! Wake up & get out of bed is done!': 'assets/audio/cards/vs_en_praise_wake_up.mp3',
            'Great job! Wake up and get out of bed is done!': 'assets/audio/cards/vs_en_praise_wake_up.mp3',
            'Great job! Bathroom & toilet is done!': 'assets/audio/cards/vs_en_praise_bathroom.mp3',
            'Great job! Bathroom and toilet is done!': 'assets/audio/cards/vs_en_praise_bathroom.mp3',
            'Great job! Brush teeth & wash face is done!': 'assets/audio/cards/vs_en_praise_brush_teeth.mp3',
            'Great job! Brush teeth and wash face is done!': 'assets/audio/cards/vs_en_praise_brush_teeth.mp3',
            'Great job! Get dressed is done!': 'assets/audio/cards/vs_en_praise_get_dressed.mp3',
            'Great job! Eat healthy breakfast is done!': 'assets/audio/cards/vs_en_praise_eat_breakfast.mp3',

            // Visual Daily Schedule Steps (School)
            'Pack backpack': 'assets/audio/cards/vs_en_pack_backpack.mp3',
            'Go to school / daycare': 'assets/audio/cards/vs_en_go_to_school.mp3',
            'Go to school or daycare': 'assets/audio/cards/vs_en_go_to_school.mp3',
            'Classroom activities & drawing': 'assets/audio/cards/vs_en_classroom_drawing.mp3',
            'Classroom activities and drawing': 'assets/audio/cards/vs_en_classroom_drawing.mp3',
            'Outdoor playground & lunch': 'assets/audio/cards/vs_en_playground_lunch.mp3',
            'Outdoor playground and lunch': 'assets/audio/cards/vs_en_playground_lunch.mp3',
            'Return back home': 'assets/audio/cards/vs_en_return_home.mp3',
            'Great job! Pack backpack is done!': 'assets/audio/cards/vs_en_praise_pack_backpack.mp3',
            'Great job! Go to school / daycare is done!': 'assets/audio/cards/vs_en_praise_go_to_school.mp3',
            'Great job! Go to school or daycare is done!': 'assets/audio/cards/vs_en_praise_go_to_school.mp3',
            'Great job! Classroom activities & drawing is done!': 'assets/audio/cards/vs_en_praise_classroom_drawing.mp3',
            'Great job! Classroom activities and drawing is done!': 'assets/audio/cards/vs_en_praise_classroom_drawing.mp3',
            'Great job! Outdoor playground & lunch is done!': 'assets/audio/cards/vs_en_praise_playground_lunch.mp3',
            'Great job! Outdoor playground and lunch is done!': 'assets/audio/cards/vs_en_praise_playground_lunch.mp3',
            'Great job! Return back home is done!': 'assets/audio/cards/vs_en_praise_return_home.mp3',

            // Visual Daily Schedule Steps (Evening)
            'Tidy up toys': 'assets/audio/cards/vs_en_tidy_toys.mp3',
            'Family dinner': 'assets/audio/cards/vs_en_family_dinner.mp3',
            'Warm bath / shower': 'assets/audio/cards/vs_en_warm_bath.mp3',
            'Warm bath or shower': 'assets/audio/cards/vs_en_warm_bath.mp3',
            'Put on pajamas': 'assets/audio/cards/vs_en_put_pajamas.mp3',
            'Bedtime story & sleep': 'assets/audio/cards/vs_en_bedtime_story.mp3',
            'Bedtime story and sleep': 'assets/audio/cards/vs_en_bedtime_story.mp3',
            'Great job! Tidy up toys is done!': 'assets/audio/cards/vs_en_praise_tidy_toys.mp3',
            'Great job! Family dinner is done!': 'assets/audio/cards/vs_en_praise_family_dinner.mp3',
            'Great job! Warm bath / shower is done!': 'assets/audio/cards/vs_en_praise_warm_bath.mp3',
            'Great job! Warm bath or shower is done!': 'assets/audio/cards/vs_en_praise_warm_bath.mp3',
            'Great job! Put on pajamas is done!': 'assets/audio/cards/vs_en_praise_put_pajamas.mp3',
            'Great job! Bedtime story & sleep is done!': 'assets/audio/cards/vs_en_praise_bedtime_story.mp3',
            'Great job! Bedtime story and sleep is done!': 'assets/audio/cards/vs_en_praise_bedtime_story.mp3',

            // Visual Daily Schedule Full Routines
            'Daily schedule: 1. Wake up & get out of bed, 2. Bathroom & toilet, 3. Brush teeth & wash face, 4. Get dressed, 5. Eat healthy breakfast': 'assets/audio/cards/vs_en_routine_morning.mp3',
            'Daily schedule: 1. Wake up and get out of bed, 2. Bathroom and toilet, 3. Brush teeth and wash face, 4. Get dressed, 5. Eat healthy breakfast': 'assets/audio/cards/vs_en_routine_morning.mp3',
            'Daily schedule: 1. Pack backpack, 2. Go to school / daycare, 3. Classroom activities & drawing, 4. Outdoor playground & lunch, 5. Return back home': 'assets/audio/cards/vs_en_routine_school.mp3',
            'Daily schedule: 1. Pack backpack, 2. Go to school or daycare, 3. Classroom activities and drawing, 4. Outdoor playground and lunch, 5. Return back home': 'assets/audio/cards/vs_en_routine_school.mp3',
            'Daily schedule: 1. Tidy up toys, 2. Family dinner, 3. Warm bath / shower, 4. Put on pajamas, 5. Bedtime story & sleep': 'assets/audio/cards/vs_en_routine_evening.mp3',
            'Daily schedule: 1. Tidy up toys, 2. Family dinner, 3. Warm bath or shower, 4. Put on pajamas, 5. Bedtime story and sleep': 'assets/audio/cards/vs_en_routine_evening.mp3',

            // Choices
            'I want: Play Outside': 'assets/audio/cards/ft_en_want_play_outside.mp3',
            'I want: Bicycle Ride': 'assets/audio/cards/ft_en_want_bicycle_ride.mp3',
            'I want: Watch Cartoons': 'assets/audio/cards/ft_en_want_watch_cartoons.mp3',
            'I want: Lego Building': 'assets/audio/cards/ft_en_want_lego_building.mp3',
            'I want: Tablet Time': 'assets/audio/cards/ft_en_want_tablet_time.mp3',
            'I want: Snack / Cookie': 'assets/audio/cards/ft_en_want_snack_cookie.mp3',
            'I want: Drink Juice': 'assets/audio/cards/ft_en_want_drink_juice.mp3',
            'I want: Ice Cream': 'assets/audio/cards/ft_en_want_ice_cream.mp3'
        };

        this.initVoices();
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initVoices() {
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                // ვეძებთ ქართულ ხმას (ka, geo, ka-GE) — უპირატესობა ენიჭება ქალის ხმას (female/woman)
                const geoVoices = voices.filter(v => v.lang.startsWith('ka') || v.lang.includes('GE') || v.name.toLowerCase().includes('georgian'));
                this.georgianVoice = geoVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || v.name.toLowerCase().includes('ana') || v.name.toLowerCase().includes('nino')) || geoVoices[0] || null;
            };
            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }

    setMute(mute) {
        this.isMuted = mute;
    }

    // PECS წებოვანის (Velcro / ჩიკის) რბილი ხმა ბარათის მიკვრისას
    playVelcro() {
        if (this.isMuted) return;
        this.init();
        try {
            const bufferSize = this.ctx.sampleRate * 0.055; // 55ms
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1900;
            filter.Q.value = 3.2;

            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.055);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch(e) {
            console.warn('Audio error:', e);
        }
    }

    // ბარათზე შეხების რბილი, სასიამოვნო ხმა (Soft Tap)
    playTap() {
        if (this.isMuted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.06);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
        } catch(e) {}
    }

    // 🪵 მონტესორის ხის / მაგნიტური ფილის ტაქტილური დაწკაპუნება (Warm Tactile Wood Tap)
    playWoodTap() {
        if (this.isMuted) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            
            // დაბალი ხის რეზონანსი (Low wooden knock)
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(340, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.055);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.055);

            // ხის/მაგნიტის ტაქტილური ჩქამი (High transient click)
            const clickOsc = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();
            clickOsc.type = 'sine';
            clickOsc.frequency.setValueAtTime(860, now);
            clickOsc.frequency.exponentialRampToValueAtTime(420, now + 0.025);

            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

            clickOsc.connect(clickGain);
            clickGain.connect(this.ctx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.025);
        } catch(e) {}
    }

    // 🧲 მაგნიტური ფილის მიკვრა (Magnet Snap)
    playMagnetClick() {
        this.playWoodTap();
    }

    // ზოლის გასუფთავების რბილი შრიალი (Clear Swoosh)
    playClear() {
        if (this.isMuted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        } catch(e) {}
    }

    // 📖 წიგნის გვერდის გადაფურცვლის რბილი შრიალი (Page Flip)
    playPageFlip() {
        if (this.isMuted) return;
        this.init();
        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.14);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.14);

            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(now);
        } catch(e) {}
    }

    // 🫧 საპნის ბუშტის გასკდომის საყვარელი ხმა (Bubble Pop)
    playBubblePop() {
        if (this.isMuted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);

            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch(e) {}
    }

    // წარმატების / გაცვლის სასიხარულო აკორდი
    playSuccess() {
        if (this.isMuted) return;
        this.init();
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            const now = this.ctx.currentTime;

            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0, now + idx * 0.08);
                gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.32);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.32);
            });
        } catch(e) {}
    }

    // 🎺 საზეიმო ფანფარი ჯილდოსა და დავალების წარმატებით დასრულებისას
    playFanfare() {
        if (this.isMuted) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const fanfareSeq = [
                { note: 523.25, time: 0.0, dur: 0.14 },
                { note: 523.25, time: 0.15, dur: 0.14 },
                { note: 523.25, time: 0.30, dur: 0.14 },
                { note: 659.25, time: 0.45, dur: 0.28 },
                { note: 783.99, time: 0.76, dur: 0.25 },
                { note: 1046.50, time: 1.03, dur: 0.70 }
            ];

            fanfareSeq.forEach(item => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(item.note, now + item.time);

                gain.gain.setValueAtTime(0, now + item.time);
                gain.gain.linearRampToValueAtTime(0.28, now + item.time + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + item.time);
                osc.stop(now + item.time + item.dur);
            });
        } catch(e) {
            console.warn('Fanfare error:', e);
        }
    }

    // აუდიო ფაილის (MP3 / WAV) დაკვრა (სტაბილური ხმის დონით)
    playAudioFile(filePath, onStart = null, onEnd = null, onError = null, token = null) {
        if (this.isMuted) {
            if (onEnd) onEnd();
            return;
        }
        if (token && token !== this.playbackId) return;
        this.init();

        try {
            if (this.currentAudioPlayer) {
                try {
                    const p = this.currentAudioPlayer;
                    this.currentAudioPlayer = null;
                    p.onended = null;
                    p.onerror = null;
                    p.onplay = null;
                    p.pause();
                    p.src = '';
                } catch(e) {}
            }

            const url = filePath;
            const audio = new Audio(url);
            audio.volume = 1.0;
            this.currentAudioPlayer = audio;

            if (onStart) {
                audio.onplay = () => {
                    if (token && token !== this.playbackId) return;
                    onStart();
                };
            }
            audio.onended = () => {
                if (this.currentAudioPlayer === audio) this.currentAudioPlayer = null;
                if (token && token !== this.playbackId) return;
                if (onEnd) onEnd();
            };
            audio.onerror = (err) => {
                if (this.currentAudioPlayer === audio) this.currentAudioPlayer = null;
                if (token && token !== this.playbackId) return;
                if (onError) onError(err);
                else if (onEnd) onEnd();
            };

            const promise = audio.play();
            if (promise !== undefined) {
                promise.catch(err => {
                    if (this.currentAudioPlayer === audio) this.currentAudioPlayer = null;
                    if (token && token !== this.playbackId) return;
                    if (onError) onError(err);
                    else if (onEnd) onEnd();
                });
            }
        } catch (e) {
            if (this.currentAudioPlayer) this.currentAudioPlayer = null;
            if (token && token !== this.playbackId) return;
            if (onError) onError(e);
            else if (onEnd) onEnd();
        }
    }

    // ჩაწერილი აუდიო ფაილის (Blob / Data-URL) დაკვრა
    playAudioData(dataUrl, onEnd = null, onError = null, token = null) {
        if (this.isMuted || !dataUrl) {
            if (onError) onError();
            else if (onEnd) onEnd();
            return;
        }
        if (token && token !== this.playbackId) return;
        try {
            if (this.customAudioPlayer) {
                try {
                    const c = this.customAudioPlayer;
                    this.customAudioPlayer = null;
                    c.onended = null;
                    c.onerror = null;
                    c.pause();
                    c.src = '';
                } catch(e) {}
            }
            const audio = new Audio(dataUrl);
            audio.volume = 1.0;
            this.customAudioPlayer = audio;
            audio.onended = () => {
                if (this.customAudioPlayer === audio) this.customAudioPlayer = null;
                if (token && token !== this.playbackId) return;
                if (onEnd) onEnd();
            };
            audio.onerror = (err) => {
                if (this.customAudioPlayer === audio) this.customAudioPlayer = null;
                if (token && token !== this.playbackId) return;
                if (onError) onError(err);
                else if (onEnd) onEnd();
            };
            const p = audio.play();
            if (p !== undefined) {
                p.catch(e => {
                    if (this.customAudioPlayer === audio) this.customAudioPlayer = null;
                    if (token && token !== this.playbackId) return;
                    if (onError) onError(e);
                    else if (onEnd) onEnd();
                });
            }
        } catch(e) {
            if (token && token !== this.playbackId) return;
            if (onError) onError(e);
            else if (onEnd) onEnd();
        }
    }

    // მიმდინარე გახმოვანების (აუდიო ფაილის ან სინთეზის) მყისიერი გაჩერება
    stopPlayback() {
        this.playbackId = (this.playbackId || 0) + 1;
        try {
            if (this.currentAudioPlayer) {
                const player = this.currentAudioPlayer;
                this.currentAudioPlayer = null;
                player.onended = null;
                player.onerror = null;
                player.onplay = null;
                player.pause();
                player.src = '';
                try { player.load(); } catch(e) {}
            }
            if (this.customAudioPlayer) {
                const custom = this.customAudioPlayer;
                this.customAudioPlayer = null;
                custom.onended = null;
                custom.onerror = null;
                custom.onplay = null;
                custom.pause();
                custom.src = '';
                try { custom.load(); } catch(e) {}
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        } catch(e) {}
    }

    // წინადადების მიმდინარე თანმიმდევრობის (Sequence) სრული გაჩერება
    stopSequence() {
        this.seqId = (this.seqId || 0) + 1;
        this.stopPlayback();
    }

    isPlaying() {
        if (this.currentAudioPlayer && !this.currentAudioPlayer.paused && !this.currentAudioPlayer.ended) {
            return true;
        }
        if (this.customAudioPlayer && !this.customAudioPlayer.paused && !this.customAudioPlayer.ended) {
            return true;
        }
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
            return true;
        }
        return false;
    }

    // ტექსტის ან ბარათის გახმოვანება (ჭკვიანი დეტექცია: მიკროფონით ჩაწერილი -> სტუდიური MP3 -> AI TTS -> სინთეზატორი)
    speakCardOrText(cardOrText, onStart = null, onEnd = null, token = null) {
        if (this.isMuted || !cardOrText) {
            if (onEnd) onEnd();
            return;
        }

        // 🛑 სწრაფი ზედიზედ დაჭერის დროს (Anti-spasm double-tap debounce იგივე ბარათზე 220ms-ში)
        const now = Date.now();
        const cardKey = (typeof cardOrText === 'object') ? (cardOrText.id || cardOrText.text) : ('' + cardOrText);
        if (!token && this.lastSpokenKey === cardKey && (now - (this.lastSpokenTime || 0)) < 220 && this.isPlaying()) {
            return;
        }
        this.lastSpokenKey = cardKey;
        this.lastSpokenTime = now;

        // თუ გარედან ტოკენი არ მოგვეცა, ვაჩერებთ ნებისმიერ წინა ხმას და ვიღებთ ახალ ტოკენს!
        if (!token) {
            this.stopPlayback();
            token = this.playbackId;
        }

        const isEn = (window.voxisAI && window.voxisAI.currentLang === 'en') || (localStorage.getItem('voxis_lang') === 'en');
        let textToSpeak = '';

        if (typeof cardOrText === 'object') {
            if (isEn) {
                textToSpeak = cardOrText.spoken_en || cardOrText.text_en || (window.app && window.app.translateAbaText ? window.app.translateAbaText(cardOrText.text) : '') || cardOrText.text || '';
            } else {
                let kaText = cardOrText.spoken || cardOrText.text || '';
                if (kaText === 'დაღლილი' || kaText === 'დაღლილი.') {
                    kaText = 'დავიღალე';
                }
                // თუ ბარათი ინგლისურადაა ჩაწერილი ქართულ რეჟიმში, გადავთარგმნოთ ქართულად
                if (/^[a-zA-Z\s]+$/.test(kaText) && window.app && window.app.translateToGeorgian) {
                    const translated = window.app.translateToGeorgian(kaText);
                    if (translated) kaText = translated;
                }
                if (kaText.includes('/')) kaText = kaText.replace(/\s*\/\s*/g, ' ან ');
                if (kaText.includes('\\')) kaText = kaText.replace(/\s*\\\s*/g, ' ან ');
                if (kaText.includes('&')) kaText = kaText.replace(/\s*&\s*/g, ' და ');
                textToSpeak = kaText;
            }
        } else {
            textToSpeak = '' + cardOrText;
            if (textToSpeak === 'დაღლილი' || textToSpeak === 'დაღლილი.') {
                textToSpeak = 'დავიღალე';
            }
            if (!isEn && /^[a-zA-Z\s]+$/.test(textToSpeak) && window.app && window.app.translateToGeorgian) {
                const tr = window.app.translateToGeorgian(textToSpeak);
                if (tr) textToSpeak = tr;
            }
            if (textToSpeak.includes('/')) textToSpeak = textToSpeak.replace(/\s*\/\s*/g, isEn ? ' or ' : ' ან ');
            if (textToSpeak.includes('\\')) textToSpeak = textToSpeak.replace(/\s*\\\s*/g, isEn ? ' or ' : ' ან ');
            if (textToSpeak.includes('&')) textToSpeak = textToSpeak.replace(/\s*&\s*/g, isEn ? ' and ' : ' და ');
        }

        // 1. თუ ბარათს აქვს მშობლის/თერაპევტის მიკროფონით ჩაწერილი ხმა
        let customAudio = (typeof cardOrText === 'object') ? cardOrText.audioRecord : null;
        if (!customAudio) {
            try {
                const savedRecs = JSON.parse(localStorage.getItem('pecs_custom_recordings') || '{}');
                if (typeof cardOrText === 'object') {
                    if (cardOrText.id && savedRecs[cardOrText.id]) customAudio = savedRecs[cardOrText.id];
                    else if (cardOrText.text && savedRecs[cardOrText.text]) customAudio = savedRecs[cardOrText.text];
                } else if (typeof cardOrText === 'string' && savedRecs[cardOrText]) {
                    customAudio = savedRecs[cardOrText];
                }
            } catch(e) {}
        }

        if (customAudio) {
            if (onStart) onStart();
            this.playAudioData(customAudio, onEnd, () => {
                if (token !== this.playbackId) return;
                this.speak(textToSpeak, onStart, onEnd, token);
            }, token);
            return;
        }

        const vBust = '?v=bella_pure_v150';

        // 1.5. ზუსტი ფრაზის შემოწმება phraseAudioMap-ში (ქართულ ენაზე)
        if (!isEn && this.phraseAudioMap && this.phraseAudioMap[textToSpeak]) {
            this.playAudioFile(this.phraseAudioMap[textToSpeak] + vBust, onStart, onEnd, () => {
                if (token !== this.playbackId) return;
                this.speak(textToSpeak, onStart, onEnd, token);
            }, token);
            return;
        }

        // 1.6. ზუსტი ფრაზის შემოწმება phraseAudioMapEn-ში (ინგლისურ ენაზე)
        if (isEn && this.phraseAudioMapEn && this.phraseAudioMapEn[textToSpeak]) {
            this.playAudioFile(this.phraseAudioMapEn[textToSpeak] + vBust, onStart, onEnd, () => {
                if (token !== this.playbackId) return;
                this.speak(textToSpeak, onStart, onEnd, token);
            }, token);
            return;
        }

        // 2. წინასწარ გენერირებული სტუდიური ფაილები (ქართული და ინგლისური)
        const cardId = (typeof cardOrText === 'object') ? (cardOrText.id || '') : '';
        if (cardId) {
            const baseId = cardId.replace(/^(board_|board_lib_|lib_|c_)/, '');
            const candidates = [];
            const suffix = isEn ? '_en.mp3' : '.mp3';

            candidates.push(`assets/audio/cards/${cardId}${suffix}${vBust}`);
            if (baseId !== cardId) {
                candidates.push(`assets/audio/cards/lib_${baseId}${suffix}${vBust}`);
                candidates.push(`assets/audio/cards/c_${baseId}${suffix}${vBust}`);
                candidates.push(`assets/audio/cards/${baseId}${suffix}${vBust}`);
            }

            // ARASAAC ID fallback (მაგ. arasaac_2527_... -> arasaac_2527.mp3)
            const arMatch = cardId.match(/arasaac_(\d+)/);
            if (arMatch) {
                candidates.push(`assets/audio/cards/arasaac_${arMatch[1]}${suffix}${vBust}`);
            }

            let candIdx = 0;
            const tryCandidate = () => {
                if (token !== this.playbackId) return;
                if (candIdx >= candidates.length) {
                    this.speak(textToSpeak, onStart, onEnd, token);
                    return;
                }
                const audioPath = candidates[candIdx++];
                this.playAudioFile(audioPath, onStart, onEnd, () => {
                    if (token !== this.playbackId) return;
                    tryCandidate();
                }, token);
            };

            tryCandidate();
            return;
        }

        this.speak(textToSpeak, onStart, onEnd, token);
    }

    // ტექსტის გახმოვანება (Bella / ნეირონული ხმით, fallback: ბრაუზერი)
    speak(text, onStart = null, onEnd = null, token = null) {
        if (this.isMuted || !text) {
            if (onEnd) onEnd();
            return;
        }
        this.init();

        if (token && token !== this.playbackId) return;
        if (!token) {
            this.stopPlayback();
            token = this.playbackId;
        }

        const isEn = (window.voxisAI && window.voxisAI.currentLang === 'en') || (localStorage.getItem('voxis_lang') === 'en');
        let cleanText = ('' + text).trim();
        if (cleanText === 'დაღლილი' || cleanText === 'დაღლილი.') {
            cleanText = 'დავიღალე';
        }
        // სლეშის (/ ან \) ნორმალიზება — TTS-ში სლეში იწვევს გამეორებას/ხარვეზს
        if (cleanText.includes('/')) {
            cleanText = cleanText.replace(/\s*\/\s*/g, isEn ? ' or ' : ' ან ');
        }
        if (cleanText.includes('\\')) {
            cleanText = cleanText.replace(/\s*\\\s*/g, isEn ? ' or ' : ' ან ');
        }
        if (cleanText.includes('&')) {
            cleanText = cleanText.replace(/\s*&\s*/g, isEn ? ' and ' : ' და ');
        }

        // 1. წინასწარ გამზადებული სტუდიური ფრაზები
        if (isEn && this.phraseAudioMapEn && this.phraseAudioMapEn[cleanText]) {
            this.playAudioFile(this.phraseAudioMapEn[cleanText] + '?v=bella_pure_v150', onStart, onEnd, () => {
                if (token !== this.playbackId) return;
                this.speakViaTtsApi(cleanText, onStart, onEnd, token);
            }, token);
            return;
        }
        if (!isEn && this.phraseAudioMap && this.phraseAudioMap[cleanText]) {
            this.playAudioFile(this.phraseAudioMap[cleanText] + '?v=bella_pure_v150', onStart, onEnd, () => {
                if (token !== this.playbackId) return;
                this.speakViaTtsApi(cleanText, onStart, onEnd, token);
            }, token);
            return;
        }

        // 2. Bella (Eleven v4) AI ნეირონული ხმით გახმოვანება სერვერიდან
        this.speakViaTtsApi(cleanText, onStart, onEnd, token);
    }

    setVoice(voice) {
        this.currentVoice = 'bella';
        localStorage.setItem('pecs_tts_voice', 'bella');
    }

    getVoice() {
        return this.currentVoice || 'bella';
    }

    // AI ნეირონული TTS სერვისი (Bella)
    speakViaTtsApi(text, onStart = null, onEnd = null, token = null) {
        if (token && token !== this.playbackId) return;
        if (text === 'დაღლილი' || text === 'დაღლილი.') {
            text = 'დავიღალე';
        }
        const voice = 'bella';
        const url = `api/tts.php?text=${encodeURIComponent(text)}&voice=bella&_ts=${Date.now()}`;
        this.playAudioFile(url, onStart, onEnd, () => {
            if (token && token !== this.playbackId) return;
            if (onEnd) onEnd();
        }, token);
    }

    // ბრაუზერის ლოკალური SpeechSynthesis (მხოლოდ ქალის ხმა, კაცის ხმა მკაცრად აკრძალულია!)
    speakBrowserSynthesis(text, onStart = null, onEnd = null, token = null) {
        if (token && token !== this.playbackId) return;
        if (!('speechSynthesis' in window)) {
            if (onEnd) onEnd();
            return;
        }

        try {
            window.speechSynthesis.cancel();
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            const isEn = /[a-zA-Z]/.test(text);
            const voices = window.speechSynthesis.getVoices() || [];

            if (isEn) {
                utterance.lang = 'en-US';
                // 🛑 კაცის ხმა (David და ა.შ.) მკაცრად აკრძალულია! ვეძებთ ექსკლუზიურად ქალის ხმას:
                const femaleEnVoice = voices.find(v => (v.lang.startsWith('en') || v.lang.includes('US')) && 
                    (v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('jenny') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('aria')));
                if (femaleEnVoice) {
                    utterance.voice = femaleEnVoice;
                } else {
                    // თუ კომპიუტერზე მხოლოდ კაცის ხმაა (David), არავითარ შემთხვევაში არ დავუკრათ!
                    console.warn("Male browser voice (David/etc.) blocked - only female voice allowed.");
                    if (onEnd) onEnd();
                    return;
                }
            } else {
                // 🛑 კაცის ხმა (Giorgi/David და ა.შ.) მკაცრად აკრძალულია! Windows-ს არ აქვს ქართული ქალის ხმა!
                console.warn("SpeechSynthesis for Georgian strictly blocked to prevent male Giorgi voice.");
                if (onEnd) onEnd();
                return;
            }
            utterance.rate = this.speechRate;
            utterance.pitch = this.speechPitch;

            if (onStart) utterance.onstart = () => {
                if (token && token !== this.playbackId) {
                    window.speechSynthesis.cancel();
                    return;
                }
                onStart();
            };
            if (onEnd) {
                utterance.onend = () => {
                    if (token && token !== this.playbackId) return;
                    onEnd();
                };
                utterance.onerror = () => {
                    if (token && token !== this.playbackId) return;
                    onEnd();
                };
            }

            window.speechSynthesis.speak(utterance);
        } catch(e) {
            console.warn("Browser speech synthesis error:", e);
            if (onEnd) onEnd();
        }
    }

    // წინადადების თანმიმდევრული გახმოვანება ბარათ-ბარათ ვიზუალური განათებით
    speakSequence(cards, highlightCallback = null, onComplete = null) {
        if (!cards || cards.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const seqToken = ++this.seqId;
        let index = 0;
        const playNext = () => {
            if (this.seqId !== seqToken) return;
            if (index >= cards.length) {
                if (highlightCallback) highlightCallback(-1);
                if (onComplete) onComplete();
                return;
            }

            const currentCard = cards[index];
            if (highlightCallback) highlightCallback(index);

            let hasAdvanced = false;
            let safetyTimeout = null;

            const advance = () => {
                if (this.seqId !== seqToken) return;
                if (hasAdvanced) return;
                hasAdvanced = true;
                if (safetyTimeout) clearTimeout(safetyTimeout);
                index++;
                setTimeout(() => {
                    if (this.seqId === seqToken) playNext();
                }, 240);
            };

            // Safety timeout: თუ ბარათის აუდიო გაიყინა, 3 წამში მაინც გადავიდეს შემდეგზე
            safetyTimeout = setTimeout(() => {
                if (this.seqId !== seqToken) return;
                console.warn("Card playback timeout, advancing sequence:", currentCard);
                advance();
            }, 3000);

            this.speakCardOrText(currentCard, null, advance);
        };

        playNext();
    }

    // ========================================================
    // მიკროფონით საკუთარი ხმის ჩაწერა (Live Recording)
    // ========================================================
    async startRecording(onVolumeLevel = null) {
        const isEn = (localStorage.getItem('voxis_lang') === 'en') || (window.app && typeof window.app.isEn === 'function' && window.app.isEn());
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(isEn 
                ? "Microphone is unavailable on insecure IP. Please open Voxis at http://localhost/voxis/ to record." 
                : "მიკროფონი მიუწვდომელია ქსელურ IP-ზე. გთხოვთ გახსნათ http://localhost/voxis/ ხმის ჩასაწერად.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.recordedChunks = [];
        this.recordStream = stream;
        
        let mimeType = '';
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
        }

        const options = mimeType ? { mimeType } : {};
        this.mediaRecorder = new MediaRecorder(stream, options);

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                this.recordedChunks.push(e.data);
            }
        };

        // მიკროფონის ხმის დონის რეალურ დროში ინდიკატორი (Realtime Mic Volume Meter)
        if (onVolumeLevel) {
            try {
                this.init();
                const source = this.ctx.createMediaStreamSource(stream);
                const analyser = this.ctx.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                this.volumeInterval = setInterval(() => {
                    if (!this.isRecording) {
                        clearInterval(this.volumeInterval);
                        return;
                    }
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i];
                    }
                    const avg = Math.min(100, Math.round((sum / dataArray.length) * 2));
                    onVolumeLevel(avg);
                }, 60);
            } catch(e) {
                console.warn("Volume analyzer error:", e);
            }
        }

        // start(100) აგროვებს აუდიო ფრაგმენტებს უწყვეტად ყოველ 100ms-ში
        this.mediaRecorder.start(100);
        this.isRecording = true;
    }

    stopRecording() {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error("ჩაწერა არ არის დაწყებული"));
                return;
            }

            if (this.volumeInterval) {
                clearInterval(this.volumeInterval);
            }

            this.mediaRecorder.onstop = () => {
                this.isRecording = false;
                const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
                const blob = new Blob(this.recordedChunks, { type: mimeType });
                
                // ტრეკების გათიშვა
                if (this.mediaRecorder.stream) {
                    this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
                }

                // Base64 Data URL-ად გარდაქმნა შესანახად
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            };

            try {
                if (this.mediaRecorder.state === 'recording') {
                    this.mediaRecorder.requestData();
                }
            } catch(e) {}
            this.mediaRecorder.stop();
        });
    }
}

const pecsAudio = new PecsAudio();
