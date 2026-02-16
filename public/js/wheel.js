(function () {
    'use strict';

    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    const sidebarPhone = document.getElementById('sidebarPhoneVal');
    const sidebarWinners = document.getElementById('sidebarWinners');
    const sidebarParticipants = document.getElementById('sidebarParticipants');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const resultPrize = document.getElementById('resultPrize');
    const resultPrizeDot = document.getElementById('resultPrizeDot');
    const resultIcon = document.getElementById('resultIcon');
    const resultPhone = document.getElementById('resultPhone');
    const resultTime = document.getElementById('resultTime');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const spinBtn = document.getElementById('spinBtn');
    const spinStatus = document.getElementById('spinStatus');

    // Logo loading Promise
    let logoLoaded = false;
    const logoImg = new Image();
    const logoPromise = new Promise((resolve) => {
        logoImg.onload = () => {
            logoLoaded = true;
            resolve();
        };
        logoImg.onerror = () => {
            console.error("Failed to load wheel logo");
            resolve(); // Resolve anyway to not block the wheel
        };
        logoImg.src = canvas.dataset.logo;
    });

    // CSRF Utility
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    // Check login state
    const phone = localStorage.getItem('wheel_phone') || (sidebarPhone ? sidebarPhone.textContent : '');
    if (!phone || phone === '' || phone === '-') {
        window.location.href = '/';
        return;
    }
    if (sidebarPhone) sidebarPhone.textContent = phone;

    // Check if played before (cached in localStorage)
    const hasSpun = localStorage.getItem('wheel_has_spun_' + phone) === 'true';

    if (hasSpun) {
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>تمت المشاركة';
        if (spinStatus) {
            spinStatus.textContent = 'يمكنك المشاركة مرة واحدة فقط';
            spinStatus.classList.add('text-warning');
        }
    }

    let options = [
        { text: 'جاري التحميل...', color: '#6B1F2A', isWin: true }
    ];

    let currentRotation = 0;
    let isSpinning = false;

    function loadWheelOptions() {
        const apiBase = window.WHEEL_API_BASE || '';
        return fetch(apiBase + '/api/wheel/options', {
            headers: { 'Accept': 'application/json' }
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && Array.isArray(data.options) && data.options.length > 0) {
                    options = data.options.map(o => ({
                        text: o.text || o.label,
                        color: o.color || '#6B1F2A',
                        isWin: !!o.is_win
                    }));
                }
            })
            .catch(() => {});
    }

    function loadStats() {
        const apiBase = window.WHEEL_API_BASE || '';
        return fetch(apiBase + '/api/stats', {
            headers: { 'Accept': 'application/json' }
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) {
                    if (sidebarParticipants) sidebarParticipants.textContent = data.participants_count || 0;
                    if (sidebarWinners) sidebarWinners.textContent = data.winners_count || 0;
                }
            })
            .catch(() => {});
    }

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const wheelContainer = canvas.closest('.wheel-container') || canvas.parentElement;
        const containerSize = wheelContainer ? Math.min(wheelContainer.clientWidth, wheelContainer.clientHeight) : 420;
        const size = Math.min(containerSize, 420);

        if (size <= 0) return; // Prevent 0 size canvas

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        canvas.width = Math.floor(size * dpr);
        canvas.height = Math.floor(size * dpr);
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawWheel();
    }

    function getContrastYIQ(hexcolor) {
        hexcolor = hexcolor.replace("#", "");
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(s => s + s).join('');
        }
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    function drawWheel() {
        const size = canvas.width / (window.devicePixelRatio || 1);
        if (size <= 0) return;

        const cx = size / 2;
        const cy = size / 2;
        const r = (size / 2) - 10;
        const sliceAngle = (2 * Math.PI) / options.length;

        ctx.clearRect(0, 0, size, size);

        options.forEach((opt, i) => {
            const start = -Math.PI / 2 + i * sliceAngle + currentRotation;
            const end = start + sliceAngle;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, end);
            ctx.closePath();
            ctx.fillStyle = opt.color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.save();
            const midAngle = start + sliceAngle / 2;
            ctx.translate(cx + (r * 0.7) * Math.cos(midAngle), cy + (r * 0.7) * Math.sin(midAngle));
            ctx.rotate(midAngle + Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = getContrastYIQ(opt.color);
            ctx.font = 'bold ' + Math.max(12, size / 22) + 'px Arial';
            ctx.fillText(opt.text, 0, 0);
            ctx.restore();
        });

        // Center hub with Logo - Rotating with the wheel
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentRotation);

        ctx.beginPath();
        const hubRadius = size * 0.085; // Responsive hub size
        ctx.arc(0, 0, hubRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#6B1F2A';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (logoLoaded) {
            const logoSize = hubRadius * 1.5;
            ctx.drawImage(logoImg, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
        }
        ctx.restore();
    }

    function spin() {
        if (localStorage.getItem('wheel_has_spun_' + phone) === 'true') {
            return;
        }
        if (isSpinning) return;
        isSpinning = true;

        spinBtn.disabled = true;
        spinBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>جاري الدوران...';
        if (spinStatus) spinStatus.textContent = '';

        const twoPi = 2 * Math.PI;
        const sliceAngle = twoPi / options.length;
        const winningIndex = Math.floor(Math.random() * options.length);

        const rotToWin = -(winningIndex * sliceAngle + sliceAngle / 2);

        const startRotation = currentRotation;
        const extraSpins = (6 + Math.random() * 4) * twoPi;

        const desiredMod = ((rotToWin % twoPi) + twoPi) % twoPi;
        let finalRotation = startRotation + extraSpins;
        const finalMod = ((finalRotation % twoPi) + twoPi) % twoPi;

        let adjustment = desiredMod - finalMod;
        if (adjustment < 0) adjustment += twoPi;
        finalRotation += adjustment;

        const deltaRotation = finalRotation - startRotation;
        const duration = 5000;
        const startTime = performance.now();

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            currentRotation = startRotation + easeOut * deltaRotation;
            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
                return;
            }

            currentRotation = finalRotation;
            drawWheel();

            const result = options[winningIndex];
            isSpinning = false;

            localStorage.setItem('wheel_has_spun_' + phone, 'true');
            spinBtn.disabled = true;
            spinBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>تمت المشاركة';
            if (spinStatus) {
                spinStatus.textContent = 'يمكنك المشاركة مرة واحدة فقط';
                spinStatus.classList.add('text-warning');
            }

            sendResult(result, winningIndex);
            showResult(result, winningIndex);
        }
        requestAnimationFrame(animate);
    }

    async function sendResult(result, index) {
        const apiBase = window.WHEEL_API_BASE || '';
        try {
            await fetch(apiBase + '/api/spin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    result_index: index,
                    result_text: result.text,
                    color: result.color,
                    is_win: result.isWin
                })
            });
            loadStats();
        } catch (e) {
            console.error('Failed to save spin result', e);
        }
    }

    function showResult(result) {
        if (result.isWin) {
            resultTitle.textContent = 'مبروك! 🎉';
            resultText.textContent = 'لقد ربحت جائزة قيمة';
            if (resultIcon) resultIcon.textContent = '🎉';
        } else {
            resultTitle.textContent = 'حظاً أوفر! 😔';
            resultText.textContent = 'نعتذر، لم تنجح في الفوز هذه المرة';
            if (resultIcon) resultIcon.textContent = '😔';
        }

        resultPrize.textContent = result.text;
        if (resultPrizeDot) resultPrizeDot.style.background = result.color;
        resultPhone.textContent = phone;

        const now = new Date();
        resultTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (copyResultBtn) {
            copyResultBtn.onclick = async () => {
                const text = `Nokta Clinic\nPhone: ${phone}\nPrize: ${result.text}`;
                await navigator.clipboard.writeText(text);
                copyResultBtn.innerHTML = '<i class="bi bi-check2"></i> تم النسخ';
                setTimeout(() => copyResultBtn.innerHTML = '<i class="bi bi-clipboard"></i> نسخ النتيجة', 2000);
            };
        }

        resultModal.show();
    }

    spinBtn.addEventListener('click', spin);
    window.addEventListener('resize', resizeCanvas);

    // Initial load: Wait for both options and logo image
    Promise.all([loadWheelOptions(), logoPromise]).then(() => {
        loadStats();
        resizeCanvas();
    });
})();
