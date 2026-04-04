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
    const resultIcon = document.getElementById('resultIcon');
    const giftCardWrap = document.getElementById('giftCardWrap');
    const giftCardResult = document.getElementById('giftCardResult');
    const giftCardPrizeName = document.getElementById('giftCardPrizeName');
    const giftCardPhone = document.getElementById('giftCardPhone');
    const giftCardWinDate = document.getElementById('giftCardWinDate');
    const giftCardExpiry = document.getElementById('giftCardExpiry');
    const giftCardExpiryRow = document.getElementById('giftCardExpiryRow');
    const giftCardNote = document.getElementById('giftCardNote');
    const giftCardAccent = document.getElementById('giftCardAccent');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const saveGiftCardBtn = document.getElementById('saveGiftCardBtn');
    const spinBtn = document.getElementById('spinBtn');
    const spinStatus = document.getElementById('spinStatus');
    const wheelMascot = document.getElementById('wheelMascot');
    const wheelContainer = document.getElementById('wheelContainer');

    let spinSoundCleanup = null;

    function soundEffectsAllowed() {
        if (typeof window.matchMedia !== 'function') return true;
        return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function ensureAudioCtx() {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return Promise.resolve(null);
        if (!window._wheelAudioCtx) {
            window._wheelAudioCtx = new Ctx();
        }
        const ctx = window._wheelAudioCtx;
        return ctx.state === 'suspended' ? ctx.resume().then(() => ctx) : Promise.resolve(ctx);
    }

    function createSoftNoiseBuffer(audioCtx) {
        const len = Math.floor(audioCtx.sampleRate * 1.5);
        const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
            ch[i] = (Math.random() * 2 - 1) * 0.35;
        }
        return buf;
    }


    function startSpinSound() {
        if (!soundEffectsAllowed()) return;
        ensureAudioCtx().then((ctx) => {
            if (!ctx) return;
            stopSpinSound();

            const master = ctx.createGain();
            master.gain.value = 0.11;
            master.connect(ctx.destination);

            const bases = [130.81, 164.81, 196.0, 261.63];
            const oscGains = [];
            const oscillators = [];
            bases.forEach((base, idx) => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                const root = base * 0.5;
                osc.frequency.value = root;
                const g = ctx.createGain();
                g.gain.value = [0.04, 0.034, 0.028, 0.016][idx] || 0.02;
                osc.connect(g).connect(master);
                osc.start();
                oscillators.push(osc);
                oscGains.push({ osc, g, base: root });
            });

            const t0 = Date.now() / 1000;
            const vibratoIv = setInterval(() => {
                const t = Date.now() / 1000 - t0;
                const vib = Math.sin(t * Math.PI * 2 * 3.2);
                const slow = Math.sin(t * Math.PI * 2 * 0.55);
                oscGains.forEach((og, i) => {
                    const detune = vib * (1.2 + i * 0.25) + slow * 0.4;
                    og.osc.frequency.setTargetAtTime(og.base + detune, ctx.currentTime, 0.035);
                });
            }, 45);

            const noiseBuf = createSoftNoiseBuffer(ctx);
            const noiseSrc = ctx.createBufferSource();
            noiseSrc.buffer = noiseBuf;
            noiseSrc.loop = true;
            const bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.Q.value = 0.85;
            bp.frequency.value = 520;
            const noiseGain = ctx.createGain();
            noiseGain.gain.value = 0.018;
            noiseSrc.connect(bp).connect(noiseGain).connect(master);
            noiseSrc.start();

            let sweepT = 0;
            const sweepIv = setInterval(() => {
                sweepT += 0.11;
                const f = 380 + Math.sin(sweepT) * 140 + Math.sin(sweepT * 1.7) * 60;
                bp.frequency.setTargetAtTime(f, ctx.currentTime, 0.08);
            }, 120);

            const hi = ctx.createOscillator();
            hi.type = 'sine';
            hi.frequency.value = 1046.5;
            const hiG = ctx.createGain();
            hiG.gain.value = 0.004;
            hi.connect(hiG).connect(master);
            hi.start();
            oscillators.push(hi);

            spinSoundCleanup = () => {
                clearInterval(vibratoIv);
                clearInterval(sweepIv);
                try {
                    noiseSrc.stop();
                    oscillators.forEach((o) => o.stop());
                } catch (e) { /* ignore */ }
                try {
                    master.disconnect();
                } catch (e) { /* ignore */ }
            };
        });
    }

    function stopSpinSound() {
        if (typeof spinSoundCleanup === 'function') {
            spinSoundCleanup();
            spinSoundCleanup = null;
        }
    }

    function playWinSound() {
        if (!soundEffectsAllowed()) return;
        ensureAudioCtx().then((ctx) => {
            if (!ctx) return;
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                g.gain.value = 0;
                osc.connect(g).connect(ctx.destination);
                const t = ctx.currentTime + i * 0.1 + 0.02;
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.11, t + 0.04);
                g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
                osc.start(t);
                osc.stop(t + 0.38);
            });
        });
    }

    function playLoseSound() {
        if (!soundEffectsAllowed()) return;
        ensureAudioCtx().then((ctx) => {
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'triangle';
            const t0 = ctx.currentTime;
            osc.frequency.setValueAtTime(220, t0);
            osc.frequency.exponentialRampToValueAtTime(95, t0 + 0.38);
            g.gain.setValueAtTime(0.07, t0);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.42);
            osc.connect(g).connect(ctx.destination);
            osc.start(t0);
            osc.stop(t0 + 0.45);
        });
    }

    function setMascotState(state) {
        if (!wheelMascot) return;
        const allowed = ['idle', 'spinning', 'win', 'lose'];
        wheelMascot.dataset.state = allowed.includes(state) ? state : 'idle';
    }

    function formatDateTimeArabicIST(date) {
        try {
            return new Intl.DateTimeFormat('ar-EG', {
                timeZone: 'Europe/Istanbul',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return date.toLocaleString('ar-EG');
        }
    }

    function formatDateArabicIST(date) {
        try {
            return new Intl.DateTimeFormat('ar-EG', {
                timeZone: 'Europe/Istanbul',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch (e) {
            return date.toLocaleDateString('ar-EG');
        }
    }

    function addOneCalendarMonth(date) {
        const d = new Date(date.getTime());
        d.setMonth(d.getMonth() + 1);
        return d;
    }

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
            resolve();
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

    const initialOptions = Array.isArray(window.WHEEL_INITIAL_OPTIONS) ? window.WHEEL_INITIAL_OPTIONS : [];
    let options = initialOptions.length > 0
        ? initialOptions.map(o => ({
            text: o.text || o.label || '',
            color: o.color || '#6B1F2A',
            isWin: !!o.is_win,
            isEnabled: o.is_enabled !== false
        }))
        : [
            { text: 'فوز', color: '#198754', isWin: true, isEnabled: true },
            { text: 'خسارة', color: '#dc3545', isWin: false, isEnabled: true }
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
                        isWin: !!o.is_win,
                        isEnabled: o.is_enabled !== false
                    }));
                    drawWheel();
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

        if (size <= 0) return;

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

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentRotation);

        ctx.beginPath();
        const hubRadius = size * 0.085;
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
        setMascotState('spinning');
        if (wheelContainer) wheelContainer.classList.add('wheel-container--spinning');
        startSpinSound();

        spinBtn.disabled = true;
        spinBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>جاري الدوران...';
        if (spinStatus) spinStatus.textContent = '';

        const twoPi = 2 * Math.PI;
        const sliceAngle = twoPi / options.length;

        const eligibleIndexes = options
            .map((opt, i) => (opt && opt.isEnabled !== false ? i : -1))
            .filter(i => i >= 0);

        const pool = eligibleIndexes.length > 0 ? eligibleIndexes : options.map((_, i) => i);
        const winningIndex = pool[Math.floor(Math.random() * pool.length)];

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

            stopSpinSound();
            if (wheelContainer) wheelContainer.classList.remove('wheel-container--spinning');
            setTimeout(() => {
                if (result.isWin) playWinSound();
                else playLoseSound();
            }, 60);

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
        setMascotState(result.isWin ? 'win' : 'lose');

        const winAt = new Date();

        if (result.isWin) {
            resultTitle.textContent = 'مبروك! 🎉';
            resultText.textContent = 'لقد ربحت جائزة قيمة';
            if (resultIcon) resultIcon.textContent = '🎉';
        } else {
            resultTitle.textContent = 'حظاً أوفر! 😔';
            resultText.textContent = 'نعتذر، لم تنجح في الفوز هذه المرة';
            if (resultIcon) resultIcon.textContent = '😔';
        }

        if (giftCardPrizeName) giftCardPrizeName.textContent = result.isWin ? result.text : '—';
        if (giftCardPhone) giftCardPhone.textContent = phone;
        if (giftCardWinDate) giftCardWinDate.textContent = formatDateTimeArabicIST(winAt);

        if (giftCardResult) {
            giftCardResult.classList.toggle('gift-card--win', !!result.isWin);
            giftCardResult.classList.toggle('gift-card--lose', !result.isWin);
        }
        if (giftCardAccent) {
            giftCardAccent.style.background = result.isWin ? (result.color || '#6b1f2a') : '#6c757d';
        }
        if (giftCardExpiryRow) {
            giftCardExpiryRow.classList.toggle('d-none', !result.isWin);
        }
        if (giftCardExpiry && result.isWin) {
            giftCardExpiry.textContent = formatDateArabicIST(addOneCalendarMonth(winAt));
        }
        if (giftCardNote) {
            giftCardNote.textContent = result.isWin
                ? 'للحصول على الهدية، يرجى تأكيد الحجز خلال شهر من تاريخ الفوز 🎁'
                : 'شكراً لمشاركتك! يمكنك المحاولة في فعاليات قادمة إن شاء الله.';
        }
        if (giftCardWrap) {
            giftCardWrap.classList.toggle('gift-card-wrap--lose', !result.isWin);
        }

        const noteWin = 'للحصول على الهدية، يرجى تأكيد الحجز خلال شهر من تاريخ الفوز 🎁';

        if (copyResultBtn) {
            copyResultBtn.onclick = async () => {
                const lines = [
                    'Nokta Clinic — بطاقة هدية رقمية',
                    `المشارك: ${phone}`,
                    result.isWin ? `الجائزة: ${result.text}` : 'النتيجة: لم تُسجَّل جائزة',
                    `تاريخ الفوز: ${formatDateTimeArabicIST(winAt)}`
                ];
                if (result.isWin) {
                    lines.push(`صالحة حتى: ${formatDateArabicIST(addOneCalendarMonth(winAt))}`);
                    lines.push('');
                    lines.push(`ملاحظة: ${noteWin}`);
                }
                await navigator.clipboard.writeText(lines.join('\n'));
                copyResultBtn.innerHTML = '<i class="bi bi-check2"></i> تم النسخ';
                setTimeout(() => {
                    copyResultBtn.innerHTML = '<i class="bi bi-clipboard me-2"></i>نسخ البطاقة';
                }, 2000);
            };
        }

        if (saveGiftCardBtn) {
            saveGiftCardBtn.onclick = async () => {
                if (typeof html2canvas !== 'function') {
                    alert('تعذر تحميل أداة حفظ الصورة. تحقق من الاتصال وحاول مرة أخرى.');
                    return;
                }
                const el = document.getElementById('giftCardResult');
                if (!el) return;
                const prev = saveGiftCardBtn.innerHTML;
                saveGiftCardBtn.disabled = true;
                saveGiftCardBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>جاري الحفظ...';
                try {
                    const canvas = await html2canvas(el, {
                        scale: 2,
                        backgroundColor: null,
                        useCORS: true,
                        logging: false
                    });
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            alert('تعذر إنشاء الملف.');
                            return;
                        }
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = 'nokta-clinic-gift-card.png';
                        a.click();
                        URL.revokeObjectURL(a.href);
                    }, 'image/png');
                } catch (e) {
                    console.error(e);
                    alert('تعذر حفظ الصورة.');
                } finally {
                    saveGiftCardBtn.disabled = false;
                    saveGiftCardBtn.innerHTML = prev;
                }
            };
        }

        resultModal.show();
    }

    spinBtn.addEventListener('click', spin);
    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();

    Promise.all([loadWheelOptions(), logoPromise]).then(() => {
        loadStats();
        resizeCanvas();
    });
})();
