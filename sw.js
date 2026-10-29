// Voxis AI AAC — Smart Network-First + Instant Precache PWA Service Worker
// Online: 100% fresh from network (never serves stale cache).
// Offline: 100% functional from cache (ignores ?v= cache-busting query strings when offline).

const CACHE_NAME = 'voxis-aac-pwa-v8';

const CORE_ASSETS = [
  './',
  './index.php',
  './manifest.json?v=voxis2',
  './assets/css/style.css',
  './assets/js/xlsx.full.min.js',
  './assets/js/audio.js',
  './assets/js/voxis_app.js',
  './assets/js/voxis_ai.js',
  './assets/images/app-logo.svg',
  './assets/images/lego.svg',
  './assets/images/chips.png',
  './assets/images/icon-192.png?v=voxis2',
  './assets/images/icon-512.png?v=voxis2',
  './assets/images/flag-gb.svg',
  './assets/images/flag-ka.svg',
  './data/cards.json',
  './data/aac_library.json'
];

const BOARD_MEDIA = [
  "./assets/audio/cards/c_angry.mp3",
  "./assets/audio/cards/c_angry_en.mp3",
  "./assets/audio/cards/c_apple.mp3",
  "./assets/audio/cards/c_apple_en.mp3",
  "./assets/audio/cards/c_ball.mp3",
  "./assets/audio/cards/c_ball_en.mp3",
  "./assets/audio/cards/c_banana.mp3",
  "./assets/audio/cards/c_banana_en.mp3",
  "./assets/audio/cards/c_bear.mp3",
  "./assets/audio/cards/c_bear_en.mp3",
  "./assets/audio/cards/c_belly_hurt.mp3",
  "./assets/audio/cards/c_belly_hurt_en.mp3",
  "./assets/audio/cards/c_book.mp3",
  "./assets/audio/cards/c_book_en.mp3",
  "./assets/audio/cards/c_bread.mp3",
  "./assets/audio/cards/c_bread_en.mp3",
  "./assets/audio/cards/c_brush_teeth.mp3",
  "./assets/audio/cards/c_brush_teeth_en.mp3",
  "./assets/audio/cards/c_bubbles.mp3",
  "./assets/audio/cards/c_bubbles_en.mp3",
  "./assets/audio/cards/c_car.mp3",
  "./assets/audio/cards/c_car_en.mp3",
  "./assets/audio/cards/c_cheese.mp3",
  "./assets/audio/cards/c_cheese_en.mp3",
  "./assets/audio/cards/c_chips.mp3",
  "./assets/audio/cards/c_chips_en.mp3",
  "./assets/audio/cards/c_chocolate.mp3",
  "./assets/audio/cards/c_chocolate_en.mp3",
  "./assets/audio/cards/c_cookie.mp3",
  "./assets/audio/cards/c_cookie_en.mp3",
  "./assets/audio/cards/c_cracker.mp3",
  "./assets/audio/cards/c_cracker_en.mp3",
  "./assets/audio/cards/c_dad.mp3",
  "./assets/audio/cards/c_dad_en.mp3",
  "./assets/audio/cards/c_doctor.mp3",
  "./assets/audio/cards/c_doctor_en.mp3",
  "./assets/audio/cards/c_dont_want.mp3",
  "./assets/audio/cards/c_dont_want_en.mp3",
  "./assets/audio/cards/c_drink.mp3",
  "./assets/audio/cards/c_drink_en.mp3",
  "./assets/audio/cards/c_eat.mp3",
  "./assets/audio/cards/c_eat_en.mp3",
  "./assets/audio/cards/c_finished.mp3",
  "./assets/audio/cards/c_finished_en.mp3",
  "./assets/audio/cards/c_grandma.mp3",
  "./assets/audio/cards/c_grandma_en.mp3",
  "./assets/audio/cards/c_grandpa.mp3",
  "./assets/audio/cards/c_grandpa_en.mp3",
  "./assets/audio/cards/c_gummy.mp3",
  "./assets/audio/cards/c_gummy_en.mp3",
  "./assets/audio/cards/c_happy.mp3",
  "./assets/audio/cards/c_happy_en.mp3",
  "./assets/audio/cards/c_head_hurt.mp3",
  "./assets/audio/cards/c_head_hurt_en.mp3",
  "./assets/audio/cards/c_help.mp3",
  "./assets/audio/cards/c_help_en.mp3",
  "./assets/audio/cards/c_hug.mp3",
  "./assets/audio/cards/c_hug_en.mp3",
  "./assets/audio/cards/c_juice.mp3",
  "./assets/audio/cards/c_juice_en.mp3",
  "./assets/audio/cards/c_lego.mp3",
  "./assets/audio/cards/c_lego_en.mp3",
  "./assets/audio/cards/c_milk.mp3",
  "./assets/audio/cards/c_milk_en.mp3",
  "./assets/audio/cards/c_mom.mp3",
  "./assets/audio/cards/c_mom_en.mp3",
  "./assets/audio/cards/c_more.mp3",
  "./assets/audio/cards/c_more_en.mp3",
  "./assets/audio/cards/c_music.mp3",
  "./assets/audio/cards/c_music_en.mp3",
  "./assets/audio/cards/c_no.mp3",
  "./assets/audio/cards/c_no_en.mp3",
  "./assets/audio/cards/c_pencil.mp3",
  "./assets/audio/cards/c_pencil_en.mp3",
  "./assets/audio/cards/c_play.mp3",
  "./assets/audio/cards/c_play_en.mp3",
  "./assets/audio/cards/c_puzzle.mp3",
  "./assets/audio/cards/c_puzzle_en.mp3",
  "./assets/audio/cards/c_rest.mp3",
  "./assets/audio/cards/c_rest_en.mp3",
  "./assets/audio/cards/c_sad.mp3",
  "./assets/audio/cards/c_sad_en.mp3",
  "./assets/audio/cards/c_scared.mp3",
  "./assets/audio/cards/c_scared_en.mp3",
  "./assets/audio/cards/c_shower.mp3",
  "./assets/audio/cards/c_shower_en.mp3",
  "./assets/audio/cards/c_sleep.mp3",
  "./assets/audio/cards/c_sleep_en.mp3",
  "./assets/audio/cards/c_socks.mp3",
  "./assets/audio/cards/c_socks_en.mp3",
  "./assets/audio/cards/c_soup.mp3",
  "./assets/audio/cards/c_soup_en.mp3",
  "./assets/audio/cards/c_spoon.mp3",
  "./assets/audio/cards/c_spoon_en.mp3",
  "./assets/audio/cards/c_stop.mp3",
  "./assets/audio/cards/c_stop_en.mp3",
  "./assets/audio/cards/c_swing.mp3",
  "./assets/audio/cards/c_swing_en.mp3",
  "./assets/audio/cards/c_tea.mp3",
  "./assets/audio/cards/c_tea_en.mp3",
  "./assets/audio/cards/c_teacher.mp3",
  "./assets/audio/cards/c_teacher_en.mp3",
  "./assets/audio/cards/c_tired.mp3",
  "./assets/audio/cards/c_tired_en.mp3",
  "./assets/audio/cards/c_toilet.mp3",
  "./assets/audio/cards/c_toilet_en.mp3",
  "./assets/audio/cards/c_walk.mp3",
  "./assets/audio/cards/c_walk_en.mp3",
  "./assets/audio/cards/c_wash_hands.mp3",
  "./assets/audio/cards/c_wash_hands_en.mp3",
  "./assets/audio/cards/c_water.mp3",
  "./assets/audio/cards/c_water_en.mp3",
  "./assets/audio/cards/c_yes.mp3",
  "./assets/audio/cards/c_yes_en.mp3",
  "./assets/audio/cards/core_dont_want.mp3",
  "./assets/audio/cards/core_dont_want_en.mp3",
  "./assets/audio/cards/core_help_me.mp3",
  "./assets/audio/cards/core_more_want.mp3",
  "./assets/audio/cards/core_want.mp3",
  "./assets/audio/cards/ft_en_prompt_build_sentence.mp3",
  "./assets/audio/cards/ft_en_prompt_select_card.mp3",
  "./assets/audio/cards/praise_bravo.mp3",
  "./assets/audio/cards/starter_am.mp3",
  "./assets/audio/cards/starter_am_en.mp3",
  "./assets/audio/cards/starter_dont_want.mp3",
  "./assets/audio/cards/starter_dont_want_en.mp3",
  "./assets/audio/cards/starter_hear.mp3",
  "./assets/audio/cards/starter_hear_en.mp3",
  "./assets/audio/cards/starter_hurts.mp3",
  "./assets/audio/cards/starter_hurts_en.mp3",
  "./assets/audio/cards/starter_see.mp3",
  "./assets/audio/cards/starter_see_en.mp3",
  "./assets/audio/cards/starter_want.mp3",
  "./assets/audio/cards/starter_want_en.mp3",
  "./assets/audio/cards/pain_throat.mp3",
  "./assets/audio/cards/pain_throat_hurt.mp3",
  "./assets/audio/cards/pain_throat_1.mp3",
  "./assets/audio/cards/pain_throat_2.mp3",
  "./assets/audio/cards/pain_throat_3.mp3"
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        CORE_ASSETS.map((url) =>
          fetch(url, { cache: 'reload' }).then((res) => {
            if (res && res.ok) return cache.put(url, res);
          })
        )
      );
      // Warm main board audio & pictograms in background batches
      Promise.allSettled(
        BOARD_MEDIA.map((url) =>
          fetch(url).then((res) => {
            if (res && res.ok) return cache.put(url, res);
          })
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && (req.url.startsWith(self.location.origin) || req.url.includes('cdn.jsdelivr.net'))) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return res;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        // 1. Exact URL match
        let cached = await cache.match(req);
        if (cached) return cached;

        // 2. Match ignoring ?v= timestamp query parameters (crucial for offline mode!)
        cached = await cache.match(req, { ignoreSearch: true });
        if (cached) return cached;

        // 3. If navigating to root or index.php while offline, serve cached app shell
        if (req.mode === 'navigate' || req.destination === 'document') {
          cached = (await cache.match('./')) || (await cache.match('./index.php')) || (await cache.match('index.php', { ignoreSearch: true }));
          if (cached) return cached;
        }

        return new Response('Offline', { status: 503, statusText: 'Offline' });
      })
  );
});
