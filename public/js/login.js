(function () {
    'use strict';

    const form = document.getElementById('loginForm');
    const countrySelect = document.getElementById('country');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submitBtn');
    const phoneHint = document.getElementById('phoneHint');

    // قواعد التحقق لكل دولة (قواعد عامة - يمكن توسيعها)
    const countryRules = {
        '966': { pattern: /^05[0-9]{8}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 0512345678)', maxLength: 10 },
        '971': { pattern: /^5[0-9]{8}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 501234567)', maxLength: 9 },
        '965': { pattern: /^[569][0-9]{7}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 50123456)', maxLength: 8 },
        '974': { pattern: /^[3567][0-9]{7}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 33123456)', maxLength: 8 },
        '973': { pattern: /^[36][0-9]{7}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 36123456)', maxLength: 8 },
        '968': { pattern: /^[79][0-9]{8}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 91234567)', maxLength: 9 },
        '961': { pattern: /^[37][0-9]{7}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 3123456)', maxLength: 8 },
        '962': { pattern: /^7[789][0-9]{7}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 791234567)', maxLength: 9 },
        '20': { pattern: /^1[0-9]{9}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 1012345678)', maxLength: 10 },
        '212': { pattern: /^[67][0-9]{8}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 612345678)', maxLength: 9 },
        '1': { pattern: /^[2-9][0-9]{9}$/, hint: 'أدخل رقم الهاتف بدون رمز الدولة (10 أرقام)', maxLength: 10 },
        '44': { pattern: /^[1-9][0-9]{9}$/, hint: 'أدخل رقم الهاتف بدون رمز الدولة (10 أرقام)', maxLength: 10 },
        '33': { pattern: /^[1-9][0-9]{8}$/, hint: 'أدخل رقم الهاتف بدون رمز الدولة (9 أرقام)', maxLength: 9 },
        '49': { pattern: /^[1-9][0-9]{9,10}$/, hint: 'أدخل رقم الهاتف بدون رمز الدولة', maxLength: 11 },
        '90': { pattern: /^5[0-9]{9}$/, hint: 'أدخل رقم الجوال بدون رمز الدولة (مثال: 5012345678)', maxLength: 10 }
    };
    
    // قاعدة افتراضية للدول التي لا توجد لها قواعد محددة
    function getDefaultRule(countryCode) {
        return { 
            pattern: /^[0-9]{6,15}$/, 
            hint: 'أدخل رقم الهاتف بدون رمز الدولة', 
            maxLength: 15 
        };
    }

    function updatePhoneValidation() {
        const countryCode = countrySelect.value;
        const rule = countryRules[countryCode] || getDefaultRule(countryCode);
        phoneInput.maxLength = rule.maxLength;
        phoneHint.textContent = rule.hint;
        phoneInput.placeholder = 'أدخل رقم الهاتف';
    }

    countrySelect.addEventListener('change', function() {
        phoneInput.value = '';
        phoneInput.classList.remove('is-invalid');
        updatePhoneValidation();
    });

    // تنسيق رقم الهاتف أثناء الكتابة
    phoneInput.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '');
        const countryCode = countrySelect.value;
        const rule = countryRules[countryCode];
        if (rule && v.length > rule.maxLength) {
            v = v.slice(0, rule.maxLength);
        }
        e.target.value = v;
    });

    // التحقق من الصيغة
    function isValidPhone(num, countryCode) {
        const rule = countryRules[countryCode] || getDefaultRule(countryCode);
        if (!num || num.length < 6) return false;
        return rule.pattern.test(num.replace(/\s/g, ''));
    }

    updatePhoneValidation();

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const countryCode = countrySelect.value;
        const phone = phoneInput.value.trim();
        
        if (!isValidPhone(phone, countryCode)) {
            phoneInput.classList.add('is-invalid');
            return;
        }
        phoneInput.classList.remove('is-invalid');

        const fullPhone = '+' + countryCode + phone;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>جاري الدخول...';

        try {
            const apiBase = window.WHEEL_API_BASE || '';
            const res = await fetch(apiBase + '/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ phone: fullPhone, country_code: countryCode })
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && (data.token || data.success)) {
                if (data.token) localStorage.setItem('wheel_token', data.token);
                localStorage.setItem('wheel_phone', fullPhone);
                localStorage.setItem('wheel_country', countryCode);
                localStorage.setItem('wheel_has_spun', 'false');
                window.location.href = 'wheel.html';
                return;
            }
            if (res.status === 403 || (data.message && data.message.includes('played'))) {
                alert('عذراً، لقد شاركت بالفعل في دولاب الحظ. يمكنك المشاركة مرة واحدة فقط.');
                phoneInput.classList.add('is-invalid');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>دخول والمشاركة';
                return;
            }
            if (res.status === 401 || data.message) {
                phoneInput.classList.add('is-invalid');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>دخول والمشاركة';
                return;
            }
        } catch (err) {
            console.warn('API not available, using demo mode');
        }

        // التحقق من localStorage إذا لعب من قبل
        const hasSpun = localStorage.getItem('wheel_has_spun_' + fullPhone);
        if (hasSpun === 'true') {
            alert('عذراً، لقد شاركت بالفعل في دولاب الحظ. يمكنك المشاركة مرة واحدة فقط.');
            phoneInput.classList.add('is-invalid');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>دخول والمشاركة';
            return;
        }

        localStorage.setItem('wheel_phone', fullPhone);
        localStorage.setItem('wheel_country', countryCode);
        localStorage.setItem('wheel_has_spun', 'false');
        window.location.href = 'wheel.html';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>دخول والمشاركة';
    });
})();
