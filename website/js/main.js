/* ========================================
   코딩덕 - Main JavaScript v3
   ======================================== */

// ======================================
//  SCROLL PROGRESS BAR
// ======================================
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
}, { passive: true });

// ======================================
//  HERO TYPING ANIMATION
// ======================================
(function heroTyping() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;
  const full = badge.textContent.trim();
  badge.textContent = '';
  badge.style.minWidth = '0';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.style.cssText = 'border-right:2px solid rgba(255,255,255,0.7);margin-left:2px;animation:blink 1s step-end infinite;display:inline-block;height:1em;vertical-align:middle';
  badge.appendChild(cursor);
  const tid = setInterval(() => {
    badge.insertBefore(document.createTextNode(full[i++]), cursor);
    if (i >= full.length) {
      clearInterval(tid);
      setTimeout(() => cursor.remove(), 1200);
    }
  }, 55);
})();

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ---- Scroll animation ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Staggered delay for grids
document.querySelectorAll(
  '.about-cards [data-aos], .insight-cards [data-aos], .testimonial-cards [data-aos]'
).forEach((el, i) => { el.style.transitionDelay = `${i * 0.1}s`; });

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ======================================
//  INTERACTIVE QUIZ
// ======================================
const QUESTIONS = [
  '무언가가 어떻게 작동하는지, <strong>"왜?" 라는 이유</strong>를 끝까지 파고드는 편이다.',
  '앱이나 웹 서비스를 쓸 때 <strong>"이 데이터가 어디서 오는 걸까?"</strong> 라는 생각을 해본 적 있다.',
  '반복되는 작업이 있으면 <strong>자동화할 방법</strong>을 찾는 편이다.',
  '오류가 생겼을 때 포기하기보다 <strong>원인을 찾아 해결</strong>할 때까지 붙잡는 편이다.',
  '새로운 기술이나 지식을 배우는 것에 <strong>거부감이 없다</strong>.',
];

const RESULTS = [
  {
    min: 4, duck: '🚀', title: '백엔드 개발자 DNA 보유!',
    desc: '논리적 사고와 탐구 정신이 넘칩니다. 코딩덕 프로 과정과 함께라면 4개월 후 백엔드 개발자로 취업할 준비가 충분합니다.',
    scoreLabel: '적성 점수 최상위권 🎯'
  },
  {
    min: 2, duck: '💪', title: '가능성 충분한 예비 개발자!',
    desc: '아직 확신이 없을 수 있지만, 그 자체가 정상입니다. 체계적인 교육을 받으면 자신감이 올라가는 유형입니다. 코딩덕과 함께 시작해보세요.',
    scoreLabel: '적성 가능성 충분 ✅'
  },
  {
    min: 0, duck: '🐣', title: '지금은 탐색 단계, 괜찮아요!',
    desc: 'IT가 아직 낯설게 느껴진다면 오히려 백지 상태에서 시작하기 좋습니다. 코딩덕의 기초부터 차근차근 시작해보세요.',
    scoreLabel: '탐색 중 — 시작이 반입니다 🌱'
  }
];

let answers = [];
let currentQ = 0;

const cards = document.querySelectorAll('.quiz-card');
const quizFill = document.getElementById('quizFill');
const quizProgressText = document.getElementById('quizProgressText');
const quizResult = document.getElementById('quizResult');
const quizStage = document.getElementById('quizStage');

function updateProgress(answered) {
  const pct = (answered / QUESTIONS.length) * 100;
  quizFill.style.width = pct + '%';
  quizProgressText.textContent = `${answered} / ${QUESTIONS.length}`;
}

function showQuestion(idx) {
  cards.forEach(c => c.classList.remove('active'));
  if (cards[idx]) {
    cards[idx].classList.add('active');
  }
}

function showResult() {
  const yesCount = answers.filter(a => a === 'yes').length;
  const result = RESULTS.find(r => yesCount >= r.min);
  quizStage.style.display = 'none';
  quizResult.style.display = 'block';
  document.getElementById('resultDuck').textContent = result.duck;
  document.getElementById('resultTitle').textContent = result.title;
  document.getElementById('resultDesc').textContent = result.desc;
  document.getElementById('resultScore').textContent = result.scoreLabel;
}

document.querySelectorAll('.quiz-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const qIdx = parseInt(btn.dataset.q);
    if (qIdx !== currentQ) return;

    answers[qIdx] = btn.dataset.a;
    // Visual feedback
    const card = cards[qIdx];
    card.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('selected-yes','selected-no'));
    btn.classList.add(btn.dataset.a === 'yes' ? 'selected-yes' : 'selected-no');

    setTimeout(() => {
      currentQ++;
      updateProgress(currentQ);
      if (currentQ < QUESTIONS.length) {
        showQuestion(currentQ);
      } else {
        showResult();
      }
    }, 320);
  });
});

document.getElementById('quizRetry').addEventListener('click', () => {
  answers = [];
  currentQ = 0;
  updateProgress(0);
  quizResult.style.display = 'none';
  quizStage.style.display = 'block';
  cards.forEach(c => {
    c.classList.remove('active');
    c.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('selected-yes','selected-no'));
  });
  showQuestion(0);
});

// ======================================
//  DUCK GAME  v2  — 페이지 전체 탐험 모드
// ======================================
const DUCK_STACKS = [
  { emoji: '☕', name: 'Java',        step: 'STEP 1', color: '#E57309', info: '자료구조·알고리즘을 Java로 직접 구현하며 코딩 테스트를 정복합니다.' },
  { emoji: '🧩', name: '알고리즘',   step: 'STEP 1', color: '#7C3AED', info: '배열·스택·트리·그래프를 손으로 코딩하며 기술 면접을 완벽 대비합니다.' },
  { emoji: '🌱', name: 'Spring Boot', step: 'STEP 2', color: '#6DB33F', info: '국내 백엔드 표준 프레임워크. 계층형 아키텍처와 REST API를 설계합니다.' },
  { emoji: '🗄️', name: 'JPA',         step: 'STEP 2', color: '#2D5282', info: 'N+1 해결, QueryDSL, 연관관계 최적화를 실전 프로젝트로 익힙니다.' },
  { emoji: '🔐', name: 'Security',   step: 'STEP 2', color: '#0F766E', info: 'Spring Security + JWT로 인증·인가 시스템을 직접 구현합니다.' },
  { emoji: '🔑', name: 'Redis',      step: 'STEP 3', color: '#DC382D', info: '캐싱 전략과 세션 관리로 서비스 성능을 극적으로 개선합니다.' },
  { emoji: '🐳', name: 'Docker',     step: 'STEP 4', color: '#2496ED', info: '컨테이너 환경을 구성하고 배포 자동화 파이프라인을 구축합니다.' },
  { emoji: '☁️', name: 'AWS',        step: 'STEP 4', color: '#FF9900', info: 'EC2·RDS·S3로 실제 서비스를 배포하고 운영하는 경험을 쌓습니다.' },
];

class DuckGame {
  constructor() {
    this.canvas  = document.getElementById('duckGameCanvas');
    this.ctx     = this.canvas.getContext('2d');
    this.active  = false;
    this.raf     = null;
    this.keys    = {};
    this.duck    = { x: 160, y: 0, facing: 1, frame: 0 };
    this.items      = [];
    this.particles  = [];
    this.footprints = [];
    this.confetti   = [];
    this.infoCard   = null;   // {item, life, max, x, y}
    this.score = 0;
    this.won   = false;
    this.quackTimer = 0;
    this._audioCtx  = null;
    this._bindKeys();
  }

  /* ---- Setup ---- */
  _bindKeys() {
    window.addEventListener('keydown', e => {
      this.keys[e.key] = true;
      if (!this.active) return;
      if (e.key === ' ') { e.preventDefault(); this._doQuack(); }
      if (e.key === 'Escape') this.deactivate();
    });
    window.addEventListener('keyup', e => { this.keys[e.key] = false; });
  }

  _spawnItems() {
    const W = this.canvas.width, H = this.canvas.height;
    this.items = DUCK_STACKS.map((s, i) => ({
      ...s,
      x: 90 + Math.random() * (W - 180),
      y: 80 + Math.random() * (H - 200),
      bobOff: i * 0.78,
      collected: false,
    }));
  }

  /* ---- Public ---- */
  activate() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.duck.x = 160;
    this.duck.y = window.innerHeight / 2;
    this.duck.facing = 1;
    this.duck.frame  = 0;
    this.score = 0; this.won = false;
    this.particles = []; this.footprints = []; this.confetti = []; this.infoCard = null;
    this.quackTimer = 0;
    this._spawnItems();
    this.canvas.style.display = 'block';
    document.body.style.overflow = 'hidden';
    const hint = document.getElementById('duckHint');
    hint.style.opacity = '1';
    setTimeout(() => { hint.style.opacity = '0'; }, 3500);
    this.active = true;
    document.getElementById('duckDpad').classList.add('active');
    this._loop();
  }

  deactivate() {
    this.active = false;
    cancelAnimationFrame(this.raf);
    this.canvas.style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('duckDpad').classList.remove('active');
  }

  /* ---- Audio ---- */
  _doQuack() {
    this.quackTimer = 55;
    try {
      if (!this._audioCtx) this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx  = this._audioCtx;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (_) {}
  }

  /* ---- Particles ---- */
  _burst(x, y, color) {
    for (let i = 0; i < 28; i++) {
      const a = (Math.PI * 2 * i / 28) + Math.random() * 0.3;
      const s = 2.8 + Math.random() * 5.5;
      this.particles.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 3, color, size: 3+Math.random()*5, life:60, max:60 });
    }
  }

  _spawnConfetti() {
    const palette = ['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#A78BFA','#FCD34D','#34D399','#F472B6'];
    for (let i = 0; i < 180; i++) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -20 - Math.random() * 300,
        vx: (Math.random() - 0.5) * 3.5,
        vy: 3 + Math.random() * 4,
        color: palette[i % palette.length],
        w: 7 + Math.random() * 8, h: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.2,
        life: 220, max: 220,
      });
    }
  }

  /* ---- Update ---- */
  _update() {
    const spd = 6, { keys, duck } = this;
    let moving = false;

    if (keys['ArrowLeft']  || keys['a'] || keys['A']) { duck.x -= spd; duck.facing = -1; moving = true; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { duck.x += spd; duck.facing =  1; moving = true; }
    if (keys['ArrowUp']    || keys['w'] || keys['W']) { duck.y -= spd; moving = true; }
    if (keys['ArrowDown']  || keys['s'] || keys['S']) { duck.y += spd; moving = true; }

    const W = this.canvas.width, H = this.canvas.height;
    duck.x = Math.max(48, Math.min(W - 48, duck.x));
    duck.y = Math.max(62, Math.min(H - 48, duck.y));

    if (moving) {
      duck.frame++;
      if (duck.frame % 18 === 0) {
        this.footprints.push({ x: duck.x, y: duck.y + 32, facing: duck.facing, life: 150, max: 150 });
        if (this.footprints.length > 80) this.footprints.shift();
      }
    }
    if (this.quackTimer > 0) this.quackTimer--;

    // Collect items
    if (!this.won) {
      this.items.forEach(item => {
        if (item.collected) return;
        const dx = duck.x - item.x, dy = duck.y - item.y;
        if (Math.sqrt(dx*dx + dy*dy) < 54) {
          item.collected = true;
          this.score++;
          this._burst(item.x, item.y, item.color);
          this.infoCard = { item, life: 220, max: 220, x: item.x, y: item.y };
          if (this.score === DUCK_STACKS.length) {
            setTimeout(() => { this._spawnConfetti(); this.won = true; }, 500);
          }
        }
      });
    }

    // Physics
    this.particles  = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--; });

    this.footprints.forEach(f => f.life--);
    this.footprints = this.footprints.filter(f => f.life > 0);

    this.confetti = this.confetti.filter(c => c.life > 0);
    this.confetti.forEach(c => { c.x += c.vx; c.y += c.vy; c.vy += 0.12; c.rot += c.rotV; c.life--; });

    if (this.infoCard) { this.infoCard.life--; if (this.infoCard.life <= 0) this.infoCard = null; }
  }

  /* ---- Draw helpers ---- */
  _rr(x, y, w, h, r) {       // roundRect
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  }

  _drawFootprint(x, y, facing, alpha) {
    const ctx = this.ctx;
    ctx.save(); ctx.globalAlpha = alpha * 0.5; ctx.fillStyle = '#FF8C00';
    ctx.translate(x, y); if (facing === -1) ctx.scale(-1,1);
    ctx.beginPath(); ctx.ellipse(-6, 0, 7, 4.5, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( 5,-3, 6, 4,    0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( 0, 7, 4, 3,    0,   0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  _drawDuck(x, y, facing, frame, quacking) {
    const ctx = this.ctx;
    const bob = Math.sin(frame * 0.28) * 4;
    ctx.save(); ctx.translate(x, y + bob);
    if (facing === -1) ctx.scale(-1,1);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.13)';
    ctx.beginPath(); ctx.ellipse(2, 38, 32, 8, 0, 0, Math.PI*2); ctx.fill();

    // Wing
    ctx.fillStyle = '#FFC200';
    ctx.save(); ctx.translate(-4,13); ctx.rotate(Math.sin(frame*0.35)*0.3);
    ctx.beginPath(); ctx.ellipse(0,0,25,12,0,0,Math.PI*2); ctx.fill(); ctx.restore();

    // Body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.ellipse(2,16,31,25,0,0,Math.PI*2); ctx.fill();

    // Head
    ctx.beginPath(); ctx.arc(16,-10,22,0,Math.PI*2); ctx.fill();

    // Blush
    ctx.fillStyle = 'rgba(255,130,90,0.3)';
    ctx.beginPath(); ctx.ellipse(25,-4,9,6,0,0,Math.PI*2); ctx.fill();

    // Beak
    ctx.fillStyle = '#FF8C00';
    if (quacking) {
      ctx.beginPath(); ctx.moveTo(33,-15); ctx.lineTo(50,-22); ctx.lineTo(50,-8); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(33, -8); ctx.lineTo(50, -3); ctx.lineTo(50,  5); ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(33,-13); ctx.lineTo(50,-9); ctx.lineTo(50,-2); ctx.lineTo(33,-5); ctx.closePath(); ctx.fill();
    }

    // Eye
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(20,-17,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(21.5,-18.5,2.2,0,Math.PI*2); ctx.fill();

    // Feet
    ctx.fillStyle = '#FF8C00';
    const fo = Math.sin(frame*0.5)*10;
    ctx.beginPath(); ctx.moveTo(-13+fo,37); ctx.lineTo(-26+fo,49); ctx.lineTo(-2+fo,49); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(  4-fo,37); ctx.lineTo( -9-fo,49); ctx.lineTo(14-fo,49); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  _drawInfoCard(card) {
    const ctx = this.ctx, { item, life, max } = card;
    const alpha  = Math.min(1, life / max * 3) * Math.min(1, (life / max) * 5);
    const W = this.canvas.width;
    const CW = 280, CH = 110;
    let cx = card.x + 70;
    if (cx + CW > W - 12) cx = card.x - CW - 20;
    const cy = Math.max(68, card.y - CH / 2);

    ctx.save(); ctx.globalAlpha = alpha;

    // Card body
    ctx.fillStyle = '#1E3A5F';
    this._rr(cx, cy, CW, CH, 14); ctx.fill();

    // Accent stripe
    ctx.fillStyle = item.color;
    this._rr(cx, cy, 5, CH, 4); ctx.fill();

    // Step badge
    ctx.fillStyle = item.color + '33';
    this._rr(cx + 14, cy + 12, 60, 22, 8); ctx.fill();
    ctx.font = 'bold 11px "Noto Sans KR",sans-serif';
    ctx.fillStyle = item.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(item.step, cx + 44, cy + 23);

    // Emoji + name
    ctx.font = '22px serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(item.emoji, cx + 82, cy + 24);
    ctx.font = 'bold 15px "Noto Sans KR",sans-serif'; ctx.fillStyle = 'white';
    ctx.fillText(item.name, cx + 110, cy + 24);

    // Info text (word-wrap ~36 chars)
    ctx.font = '12px "Noto Sans KR",sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.textBaseline = 'top';
    const words = item.info.split(' '); let line = '', lx = cx + 14, ly = cy + 50;
    words.forEach(w => {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > CW - 28 && line) {
        ctx.fillText(line.trim(), lx, ly); ly += 17; line = w + ' ';
      } else { line = test; }
    });
    ctx.fillText(line.trim(), lx, ly);

    ctx.restore();
  }

  /* ---- Draw ---- */
  _draw() {
    const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
    const t = Date.now() / 1000;

    ctx.clearRect(0, 0, W, H);

    // Light overlay — page stays readable (40%)
    ctx.fillStyle = 'rgba(8, 14, 28, 0.42)';
    ctx.fillRect(0, 0, W, H);

    // HUD bar
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, 52);

    ctx.font = 'bold 13px "Noto Sans KR",sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.72)'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillText('🎮  WASD / 방향키 이동   ·   Space = 꽥!   ·   ESC = 종료', 20, 26);
    ctx.textAlign = 'right'; ctx.fillStyle = '#FFD700'; ctx.font = 'bold 15px "Noto Sans KR",sans-serif';
    ctx.fillText(`기술스택 ${this.score} / ${DUCK_STACKS.length} 수집`, W - 20, 26);

    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(0, 52, W, 4);
    ctx.fillStyle = '#FFD700'; ctx.fillRect(0, 52, W * (this.score / DUCK_STACKS.length), 4);

    // Footprints
    this.footprints.forEach(f => {
      this._drawFootprint(f.x, f.y, f.facing, f.life / f.max);
    });

    // Items
    this.items.forEach(item => {
      if (item.collected) return;
      const bob = Math.sin(t * 1.6 + item.bobOff) * 9;
      const ix = item.x, iy = item.y + bob;

      const grd = ctx.createRadialGradient(ix,iy,0,ix,iy,52);
      grd.addColorStop(0, item.color+'66'); grd.addColorStop(1,'transparent');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(ix,iy,52,0,Math.PI*2); ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.96)';
      ctx.beginPath(); ctx.arc(ix,iy,32,0,Math.PI*2); ctx.fill();

      ctx.font='28px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(item.emoji,ix,iy);

      ctx.font='bold 11px "Noto Sans KR",sans-serif';
      const tw = ctx.measureText(item.name).width;
      ctx.fillStyle='rgba(0,0,0,0.78)';
      this._rr(ix-tw/2-9, iy+38, tw+18, 21, 6); ctx.fill();
      ctx.fillStyle='white'; ctx.textBaseline='middle'; ctx.fillText(item.name,ix,iy+49);
    });

    ctx.textAlign='left'; ctx.textBaseline='alphabetic';

    // Particles
    this.particles.forEach(p => {
      ctx.save(); ctx.globalAlpha = p.life/p.max; ctx.fillStyle=p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore();
    });

    // Confetti
    this.confetti.forEach(c => {
      ctx.save(); ctx.globalAlpha = Math.min(1, c.life/c.max*3);
      ctx.translate(c.x,c.y); ctx.rotate(c.rot);
      ctx.fillStyle=c.color; ctx.fillRect(-c.w/2,-c.h/2,c.w,c.h); ctx.restore();
    });

    // Info card
    if (this.infoCard) this._drawInfoCard(this.infoCard);

    // Duck
    this._drawDuck(this.duck.x, this.duck.y, this.duck.facing, this.duck.frame, this.quackTimer>0);

    // Quack bubble
    if (this.quackTimer > 0) {
      const bx = this.duck.x + (this.duck.facing===1? 72 : -72), by = this.duck.y - 60;
      ctx.save();
      ctx.fillStyle='white'; ctx.beginPath(); ctx.ellipse(bx,by,38,23,0,0,Math.PI*2); ctx.fill();
      // Tail
      ctx.beginPath();
      if(this.duck.facing===1){ ctx.moveTo(bx-20,by+16); ctx.lineTo(bx-38,by+32); ctx.lineTo(bx-4,by+18); }
      else                    { ctx.moveTo(bx+20,by+16); ctx.lineTo(bx+38,by+32); ctx.lineTo(bx+4, by+18); }
      ctx.fill();
      ctx.font='bold 16px "Noto Sans KR",sans-serif'; ctx.fillStyle='#1E3A5F';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('꽥!',bx,by);
      ctx.restore();
    }

    // Win screen
    if (this.won) {
      ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(0,0,W,H);
      ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
      const cy = H/2;
      ctx.font='bold 58px "Noto Sans KR",sans-serif'; ctx.fillStyle='#FFD700';
      ctx.fillText('🎉 취업 준비 완료!', W/2, cy - 72);
      ctx.font='bold 24px "Noto Sans KR",sans-serif'; ctx.fillStyle='white';
      ctx.fillText('모든 기술 스택을 수집했습니다', W/2, cy);
      ctx.font='17px "Noto Sans KR",sans-serif'; ctx.fillStyle='rgba(255,255,255,0.8)';
      ctx.fillText('코딩덕 프로 과정으로 실제 취업도 이렇게 완주할 수 있습니다!', W/2, cy + 46);

      // Restart button
      const bw=220, bh=50, bx=W/2-bw/2, by=cy+92;
      ctx.fillStyle='#FFD700'; this._rr(bx,by,bw,bh,25); ctx.fill();
      ctx.font='bold 16px "Noto Sans KR",sans-serif'; ctx.fillStyle='#1E3A5F';
      ctx.fillText('다시 탐험하기  🦆', W/2, by+bh/2);

      ctx.font='13px "Noto Sans KR",sans-serif'; ctx.fillStyle='rgba(255,255,255,0.4)';
      ctx.fillText('ESC 를 눌러 사이트로 돌아가세요', W/2, cy + 165);
      ctx.restore();

      // Win click — restart
      if (!this._winClickBound) {
        this._winClickBound = true;
        this.canvas.addEventListener('click', e => {
          if (!this.won) return;
          const bx=W/2-110, by=H/2+92, bw=220, bh=50;
          if(e.clientX>=bx&&e.clientX<=bx+bw&&e.clientY>=by&&e.clientY<=by+bh) {
            this._winClickBound=false; this.canvas.removeEventListener('click',arguments.callee);
            this.activate();
          }
        });
      }
    }
  }

  _loop() {
    if (!this.active) return;
    this._update();
    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }
}

// Boot duck game
const duckGame = new DuckGame();

// 히어로 마스코트 클릭
document.getElementById('heroMascot').addEventListener('click', () => duckGame.activate());

// 우측 하단 플로팅 버튼
document.getElementById('duckModeBtn').addEventListener('click', () => duckGame.activate());

// ======================================
//  MOBILE D-PAD
// ======================================
(function setupDpad() {
  const dpad = document.getElementById('duckDpad');

  // Exit button
  document.getElementById('dpadExit').addEventListener('click', () => duckGame.deactivate());

  // Each directional / quack button
  dpad.querySelectorAll('.dpad-btn').forEach(btn => {
    const key = btn.dataset.key;

    const press = (e) => {
      e.preventDefault();
      btn.classList.add('pressed');
      if (key === ' ') {
        duckGame._doQuack();
      } else {
        duckGame.keys[key] = true;
      }
    };
    const release = (e) => {
      e.preventDefault();
      btn.classList.remove('pressed');
      if (key !== ' ') duckGame.keys[key] = false;
    };

    btn.addEventListener('touchstart',  press,   { passive: false });
    btn.addEventListener('touchend',    release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    // Mouse fallback for desktop testing
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup',   release);
    btn.addEventListener('mouseleave',release);
  });
})();

// ======================================
//  WASD / 방향키 → 버튼 없이 게임 자동 시작
// ======================================
const MOVE_KEYS = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','W','A','S','D']);
window.addEventListener('keydown', e => {
  if (duckGame.active) return;
  if (!MOVE_KEYS.has(e.key)) return;
  const tag = document.activeElement ? document.activeElement.tagName : '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  e.preventDefault();
  duckGame.activate();
}, { passive: false });

// ======================================
//  CURRICULUM ACCORDION
// ======================================
document.querySelectorAll('.road-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const extra   = btn.nextElementSibling;
    const opening = extra.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(opening));
    btn.textContent = opening
      ? '이 단계를 마치면 할 수 있어요 ▴'
      : '이 단계를 마치면 할 수 있어요 ▾';
    if (opening) btn.style.cssText = '';   // re-apply hover effect
  });
});

// 4) 페이지 로드 2.5초 후 자동 초대 배너 (최초 1회)
(function autoInvite() {
  if (sessionStorage.getItem('duckInvited')) return;
  sessionStorage.setItem('duckInvited', '1');
  setTimeout(() => {
    const bar = document.createElement('div');
    bar.id = 'duckInviteBar';
    bar.innerHTML = `
      <span>🦆 키보드로 오리를 조종하며 사이트를 탐험해보세요!</span>
      <button onclick="duckGame.activate(); this.closest('#duckInviteBar').remove()">지금 탐험하기 →</button>
      <button class="close-btn" onclick="this.closest('#duckInviteBar').remove()">✕</button>
    `;
    Object.assign(bar.style, {
      position:'fixed', bottom:'0', left:'0', right:'0', zIndex:'300',
      background:'var(--blue-deep)', color:'white',
      padding:'14px 24px', display:'flex', alignItems:'center', gap:'16px',
      fontFamily:"'Noto Sans KR',sans-serif", fontSize:'14px', fontWeight:'600',
      boxShadow:'0 -4px 24px rgba(0,0,0,0.18)',
      animation:'slideUpBar 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    });
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUpBar{from{transform:translateY(100%)}to{transform:translateY(0)}}
      #duckInviteBar button{padding:8px 18px;border-radius:50px;border:none;cursor:pointer;font-weight:700;font-family:'Noto Sans KR',sans-serif;font-size:13px;}
      #duckInviteBar button:first-of-type{background:var(--yellow);color:var(--blue-deep);margin-left:auto;}
      #duckInviteBar .close-btn{background:transparent;color:rgba(255,255,255,0.5);font-size:16px;padding:6px 10px;}
    `;
    document.head.appendChild(style);
    document.body.appendChild(bar);
    setTimeout(() => { if (bar.parentNode) bar.remove(); }, 8000);
  }, 2500);
})();
