/**
 * 真偽探測站 - 滾動特效與粒子背景加強版
 */

const initEffects = () => {
    // 1. 粒子背景系統
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 180 };
    let scrollY = window.scrollY;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    const initCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 25) + 1;
            this.color = '#9EB79E';
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        update() {
            // 視差效果：粒子隨滾動輕微移動
            let moveWithScroll = scrollY * 0.1 * (this.density / 20);
            let currentBaseY = this.baseY - moveWithScroll;

            // 鼠標互動
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                this.x -= forceDirectionX * force * this.density;
                this.y -= forceDirectionY * force * this.density;
            } else {
                if (this.x !== this.baseX) {
                    this.x -= (this.x - this.baseX) / 15;
                }
                if (this.y !== currentBaseY) {
                    this.y -= (this.y - currentBaseY) / 15;
                }
            }
        }
    }

    const createParticles = () => {
        particles = [];
        let numberOfParticles = (canvas.width * canvas.height) / 10000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        initCanvas();
        createParticles();
    });

    initCanvas();
    createParticles();
    animate();

    // 2. 高級滾動顯現偵測 (Intersection Observer)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else if (entry.boundingClientRect.top > 0) {
                // 如果往回捲動，可以選擇是否移除類別來重複觸發動畫
                // entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // 3. 導航欄隨滾動變色
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 10, 16, 0.95)';
            header.style.padding = '10px 50px';
        } else {
            header.style.background = 'rgba(5, 10, 16, 0.8)';
            header.style.padding = '15px 50px';
        }
    });
};

document.addEventListener('DOMContentLoaded', initEffects);