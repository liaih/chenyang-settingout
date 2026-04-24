// --- 幻燈片自動淡入淡出功能 (純 JS 控制) ---
const slides = document.querySelectorAll('.carousel-slide');
const carouselWrap = document.querySelector('.carousel-wrap');
let currentSlide = 0;
let slideTimer;

function showNextSlide() {
  if (slides.length === 0) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

function startSlideshow() {
  if (slides.length > 0) {
    slides[currentSlide].classList.add('active');
    // 總監專屬更新：將幻燈片輪播時間改為 3000 毫秒（3 秒），視覺節奏更明快
    slideTimer = setInterval(showNextSlide, 3000);
  }
}

function stopSlideshow() {
  clearInterval(slideTimer); 
}

// 網頁載入時啟動幻燈片
if (carouselWrap && slides.length > 0) {
  startSlideshow();
  
  // 總監專屬 UX 優化：只針對「圖片本身 (.img-slot)」設定滑鼠暫停感測器，
  // 放在下方文字時不會干擾 3 秒輪播的明快節奏！
  const imgSlots = document.querySelectorAll('.img-slot');
  imgSlots.forEach(slot => {
    slot.addEventListener('mouseenter', stopSlideshow);
    slot.addEventListener('mouseleave', startSlideshow);
    slot.addEventListener('touchstart', stopSlideshow);
    slot.addEventListener('touchend', startSlideshow);
  });
}

// Scroll reveal 與 FAQ 展開
const allReveal = document.querySelectorAll('.tl-item, .prep-card, .faq-item');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('vis'), i * 100);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
allReveal.forEach(el => io.observe(el));

document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(fi => {
      fi.classList.remove('open');
      fi.querySelector('.faq-a').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-pills a');
const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-pills a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObs.observe(s));

// 總監專屬 UX 修復：強制攔截導覽列點擊，改用 JS 平滑滾動，徹底根除「點擊後重新刷新網頁」的瀏覽器 Bug
document.querySelectorAll('.nav-pills a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault(); // 核心防呆：絕對阻止瀏覽器預設的跳轉行為
    e.stopPropagation(); // 阻止事件冒泡，避免觸發預覽環境的刷新機制
    
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      // 終極防呆：捨棄容易被 iOS 或預覽器忽略的 scrollIntoView
      // 改用最原始、最絕對的「螢幕座標數學計算」，強迫畫面捲動到指定像素！
      // 總監專屬更新：系統自動判斷！手機版因為導覽列已經滑走不擋畫面了，所以偏移值設為 0；電腦版保留 80 避免擋住標題。
      const headerOffset = window.innerWidth <= 960 ? 0 : 80; 
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// --- 回到頂端按鈕邏輯 ---
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    // 當往下滾動超過 600px 時，顯示按鈕
    if (window.scrollY > 600) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  backToTopBtn.addEventListener('click', () => {
    // 平滑滾動回到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
