document.addEventListener("DOMContentLoaded", () => {
  const animateTyping = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const text = el.dataset.text;
    if (!text) return;

    el.innerHTML = ""; // очистка

    let i = 0;
    const type = () => {
      if (i < text.length) {
        const span = document.createElement("span");
        span.innerHTML = text[i] === " " ? "&nbsp;" : text[i];
        span.style.display = "inline-block"; // важно!
        el.appendChild(span);
        i++;
        setTimeout(type, 100);
      }
    };

    type();
  };

  animateTyping(".typewriter-welcome");
  animateTyping(".typewriter-final");
});



// === Модальное окно галереи ===
const galleryImages = document.querySelectorAll(".images img");
const modal = document.createElement("div");
modal.classList.add("modal");
const modalImg = document.createElement("img");
modal.appendChild(modalImg);
document.body.appendChild(modal);

galleryImages.forEach(img => {
  img.addEventListener("click", () => {
    modalImg.src = img.src;
    modal.style.display = "flex";
  });
});

modal.addEventListener("click", () => {
  modal.style.display = "none";
});

// === Эталонный фейерверк ===
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let fireworks = [];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Firework {
  constructor(x, y, targetY, color) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.speed = 5;
    this.color = color;
    this.exploded = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY && !this.exploded) {
      this.exploded = true;
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(this.x, this.y, this.color));
      }
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 5 + 1;
    this.gravity = 0.05;
    this.friction = 0.98;
    this.color = color;
    this.alpha = 1;
  }

  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((f, i) => {
    f.update();
    f.draw();
    if (f.exploded) fireworks.splice(i, 1);
  });

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}
animate();

setInterval(() => {
  const x = Math.random() * canvas.width;
  const y = canvas.height;
  const targetY = Math.random() * canvas.height / 2;
  const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
  fireworks.push(new Firework(x, y, targetY, color));
}, 300);


// === Анимация появления элементов ===
const fadeInElements = document.querySelectorAll("section, .profile-pic, blockquote, .subtitle");
const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

fadeInElements.forEach(el => fadeInObserver.observe(el));

// === Звёзды на фоне ===
const starsCanvas = document.createElement("canvas");
starsCanvas.id = "stars";
document.body.appendChild(starsCanvas);
const sCtx = starsCanvas.getContext("2d");
starsCanvas.width = window.innerWidth;
starsCanvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height,
    radius: Math.random() * 1.5,
    speed: Math.random() * 0.5 + 0.2
  });
}

function animateStars() {
  sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  sCtx.fillStyle = "white";
  for (let star of stars) {
    sCtx.beginPath();
    sCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    sCtx.fill();
    star.y += star.speed;
    if (star.y > starsCanvas.height) star.y = 0;
  }
  requestAnimationFrame(animateStars);
}
animateStars();

window.addEventListener("resize", () => {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
});
// === Плавное появление элементов при прокрутке ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(el => {
  observer.observe(el);
});

// === Эффект набора текста по буквам с лазерной анимацией ===
function typeWriterEffect(element, speed = 70) {
  const text = element.dataset.text;
  element.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      const span = document.createElement('span');
      span.textContent = text.charAt(i);
      span.style.textShadow = '0 0 8px #ff89e9';
      span.style.display = 'inline-block';
      span.style.animation = 'pulseLetter 0.3s ease';
      element.appendChild(span);
      i++;
      setTimeout(type, speed);
    }
  };
  type();
}

// === Набор текста запускается, когда заголовок входит в зону видимости ===
const typewriterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (!el.dataset.typed) {
        el.dataset.typed = "true";
        typeWriterEffect(el, 60);
      }
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.typewriter').forEach(el => typewriterObserver.observe(el));

// === Стиль для лазерных букв ===
const style = document.createElement('style');
style.textContent = `
@keyframes pulseLetter {
  0% { opacity: 0; transform: scale(0.7); text-shadow: 0 0 0 #000; }
  50% { opacity: 1; transform: scale(1.2); text-shadow: 0 0 10px #ff89e9; }
  100% { transform: scale(1); text-shadow: 0 0 5px #ff89e9; }
}`;
document.head.appendChild(style);

// === Фикс: сразу показывать все секции при загрузке (мобилки) ===
window.addEventListener('load', () => {
  document.querySelectorAll('section').forEach(el => {
    el.classList.add('visible');
  });
});
