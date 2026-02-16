(function () {
    'use strict';

    const apiBase = window.WHEEL_API_BASE || '';
    const optionsList = document.getElementById('optionsList');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const saveOptionsBtn = document.getElementById('saveOptionsBtn');
    const participantsList = document.getElementById('participantsList');

    const optionsTab = document.getElementById('optionsTab');
    const participantsTab = document.getElementById('participantsTab');
    const optionsSection = document.getElementById('optionsSection');
    const participantsSection = document.getElementById('participantsSection');
    const contentTitle = document.getElementById('contentTitle');

    let options = [
        { text: 'جلسة مجانية', color: '#6B1F2A', isWin: true },
        { text: 'علاج مجاني', color: '#8B2635', isWin: true },
        { text: 'حقنة مجانية', color: '#6B1F2A', isWin: true },
        { text: 'فحص مجاني', color: '#4A1519', isWin: true },
        { text: 'استشارة مجانية', color: '#8B2635', isWin: true },
        { text: 'جلسة مجانية', color: '#6B1F2A', isWin: true }
    ];

    // Navigation logic
    optionsTab.addEventListener('click', function(e) {
        e.preventDefault();
        optionsTab.classList.add('active');
        participantsTab.classList.remove('active');
        optionsSection.classList.remove('d-none');
        participantsSection.classList.add('d-none');
        contentTitle.textContent = 'خيارات الدولاب';
    });

    participantsTab.addEventListener('click', function(e) {
        e.preventDefault();
        participantsTab.classList.add('active');
        optionsTab.classList.remove('active');
        participantsSection.classList.remove('d-none');
        optionsSection.classList.add('d-none');
        contentTitle.textContent = 'المشاركين';
        loadParticipants();
    });

    function renderOptions() {
        optionsList.innerHTML = options.map((opt, i) => `
            <div class="wheel-option-row d-flex align-items-center gap-3 p-3 mb-2 bg-light rounded-4" data-index="${i}">
                <div class="color-picker-wrap" style="width: 50px; height: 40px;">
                    <input type="color" class="form-control form-control-color w-100 h-100 p-1 border-0" value="${opt.color}" data-index="${i}" data-field="color">
                </div>
                <input type="text" class="form-control rounded-3" value="${opt.text}" placeholder="نص الشريحة" data-index="${i}" data-field="text">
                <div class="form-check form-switch ms-2 mt-1">
                    <input class="form-check-input" type="checkbox" role="switch" data-index="${i}" data-field="isWin" ${opt.isWin ? 'checked' : ''}>
                    <label class="form-check-label small text-muted">فوز</label>
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm rounded-pill remove-option" data-index="${i}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');

        optionsList.querySelectorAll('input[data-field="isWin"]').forEach(inp => {
            inp.addEventListener('change', function () {
                options[+this.dataset.index].isWin = this.checked;
            });
        });

        optionsList.querySelectorAll('input[data-field="color"]').forEach(inp => {
            inp.addEventListener('input', function () {
                options[+this.dataset.index].color = this.value;
            });
        });
        optionsList.querySelectorAll('input[data-field="text"]').forEach(inp => {
            inp.addEventListener('input', function () {
                options[+this.dataset.index].text = this.value;
            });
        });
        optionsList.querySelectorAll('.remove-option').forEach(btn => {
            btn.addEventListener('click', function () {
                const i = +this.dataset.index;
                if (options.length <= 2) return;
                options.splice(i, 1);
                renderOptions();
            });
        });
    }

    addOptionBtn.addEventListener('click', function () {
        options.push({ text: 'جائزة جديدة', color: '#6B1F2A', isWin: true });
        renderOptions();
    });

    saveOptionsBtn.addEventListener('click', async function () {
        saveOptionsBtn.disabled = true;
        const originalText = saveOptionsBtn.innerHTML;
        saveOptionsBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>جاري الحفظ...';

        try {
            const res = await fetch(apiBase + '/admin/api/options', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    options: options.map(o => ({
                        text: o.text,
                        color: o.color,
                        is_win: !!o.isWin
                    }))
                })
            });
            if (res.ok) {
                saveOptionsBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>تم الحفظ بنجاح';
                saveOptionsBtn.classList.replace('btn-primary', 'btn-success');
                setTimeout(() => {
                    saveOptionsBtn.innerHTML = originalText;
                    saveOptionsBtn.classList.replace('btn-success', 'btn-primary');
                }, 2000);
            }
        } catch (e) {
            console.error(e);
            alert('حدث خطأ أثناء الحفظ');
            saveOptionsBtn.innerHTML = originalText;
        }
        saveOptionsBtn.disabled = false;
    });

    function loadOptions() {
        optionsList.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>';
        fetch(apiBase + '/api/wheel/options')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && Array.isArray(data.options) && data.options.length > 0) {
                    options = data.options.map(o => ({
                        text: o.text || o.label,
                        color: o.color || '#6B1F2A',
                        isWin: !!o.is_win
                    }));
                }
                renderOptions();
            })
            .catch(() => renderOptions());
    }

    function loadParticipants() {
        participantsList.innerHTML = '<tr><td colspan="4" class="text-center p-4"><div class="spinner-border spinner-border-sm text-primary me-2"></div>جاري التحميل...</td></tr>';
        fetch(apiBase + '/admin/api/participants')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                const parts = data?.participants || [];
                if (parts.length > 0) {
                    participantsList.innerHTML = parts.map(p => `
                        <tr>
                            <td class="ps-4">
                                <div class="fw-bold">${escapeHtml(p.phone || '--')}</div>
                                <small class="text-muted">ID: ${p.id}</small>
                            </td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="prize-dot me-2" style="background: ${p.color || '#6B1F2A'}; width: 10px; height: 10px; border-radius: 50%;"></div>
                                    <span class="fw-medium">${escapeHtml(p.result_text || '--')}</span>
                                </div>
                            </td>
                            <td class="text-muted">${p.created_at || '--'}</td>
                            <td class="text-end pe-4">
                                <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3">فائز</span>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    participantsList.innerHTML = '<tr><td colspan="4" class="text-center p-5 text-muted">لا يوجد مشاركون بعد</td></tr>';
                }
            })
            .catch(() => {
                participantsList.innerHTML = '<tr><td colspan="4" class="text-center p-5 text-danger">فشل في تحميل البيانات</td></tr>';
            });
    }

    function escapeHtml(s) {
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    loadOptions();
})();

