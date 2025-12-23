document.addEventListener('DOMContentLoaded', () => {
    const stacks = document.querySelectorAll('.stack-wrapper');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');

    stacks.forEach(stack => {
        const cards = stack.querySelectorAll('.stack-card');
        const dotsContainer = stack.querySelector('.stack-dots');
        let currentIndex = 0;
        let autoPlayTimer = null;
        let isUserInteracting = false;

        // 初始化點點
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function updateStack() {
            cards.forEach((card, i) => {
                card.classList.remove('active', 'next', 'back', 'hidden');
                
                // 計算相對位置
                const diff = (i - currentIndex + cards.length) % cards.length;

                if (diff === 0) {
                    card.classList.add('active');
                } else if (diff === 1) {
                    card.classList.add('next');
                } else if (diff === 2) {
                    card.classList.add('back');
                } else {
                    card.classList.add('hidden');
                }
            });

            // 更新點點
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateStack();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateStack();
        }

        // 自動輪播邏輯 (0.5秒換頁太快會像閃動，通常建議 2-3 秒，這裡設定為 1.5秒 以兼顧動感)
        function startAutoPlay() {
            stopAutoPlay(); // 確保不重疊
            autoPlayTimer = setInterval(() => {
                if (!isUserInteracting) {
                    nextSlide();
                }
            }, 1500); // 這裡設定 1.5 秒換一頁，若要更快可改為 500 (0.5秒)
        }

        function stopAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        function resetAutoPlay() {
            isUserInteracting = true;
            stopAutoPlay();
            // 使用者停止操作 3 秒後重新啟動自動輪播
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 3000);
        }

        // 點擊卡片切換或放大
        cards.forEach((card, i) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('active')) {
                    // 如果點擊的是最前面的，開啟燈箱
                    openLightbox(card.querySelector('img').src);
                } else {
                    // 如果點擊的是後面的，切換到該張
                    goToSlide(i);
                    resetAutoPlay();
                }
            });
        });

        // 滑鼠移入容器停止播放，移出恢復
        stack.addEventListener('mouseenter', stopAutoPlay);
        stack.addEventListener('mouseleave', () => {
            if (!isUserInteracting) startAutoPlay();
        });

        // 啟動
        updateStack();
        startAutoPlay();
    });

    // 燈箱功能
    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // 禁止捲動
    }

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = ''; 
    });
});