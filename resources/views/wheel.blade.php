<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>دوار الحظ | Nokta Clinic</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link rel="icon" type="image/png" href="{{ asset('images/noktaclinic1.png') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body class="wheel-page">
    <header class="wheel-header-top shadow-sm">
        <div class="container-fluid">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <div class="logo-small me-3">
                        <img src="{{ asset('images/noktaclinic1.png') }}" alt="Logo" class="logo-small-img" onerror="this.src='https://placehold.co/50x50?text=Clinic';">
                    </div>
                    <div class="d-flex flex-column me-2">
                        <span class="fw-bold text-white fs-5">عجلة الحظ</span>
                        <small class="text-white-50">Nokta Clinic</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="d-none d-md-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-1">
                        <i class="bi bi-phone text-white-50 me-2"></i>
                        <span class="text-white small" id="sidebarPhone">{{ session('participant_phone') }}</span>
                    </div>
                    <a href="{{ route('participant.logout') }}" class="btn btn-outline-light btn-sm rounded-pill px-3" onclick="localStorage.clear();">
                        <i class="bi bi-box-arrow-right me-1"></i> خروج
                    </a>
                </div>
            </div>
        </div>
    </header>

    <div class="wheel-content container-fluid py-4">
        <div class="row h-100 g-4">
            <div class="col-lg-8 d-flex flex-column align-items-center justify-content-center">
                <div class="wheel-wrapper">
                    <div class="wheel-container mb-5">
                        <canvas id="wheelCanvas" class="wheel-canvas" data-logo="{{ asset('images/noktaclinic1.png') }}"></canvas>
                        <div class="wheel-pointer"></div>
                    </div>

                    <button id="spinBtn" class="spin-btn btn-lg">
                        <i class="bi bi-play-fill me-2"></i>ابـدأ الـدوران
                    </button>
                    <p id="spinStatus" class="mt-3 small fw-bold"></p>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="sidebar-info-wrap d-flex flex-column gap-3">
                    <div class="sidebar-card shadow-sm border-0">
                        <h6 class="text-white-50 border-bottom border-white border-opacity-10 pb-2 mb-3">بيانات المشارك</h6>
                        <div class="d-flex flex-column gap-3">
                            <div class="d-flex justify-content-between">
                                <span class="text-white-50 small">رقم الهاتف:</span>
                                <span class="text-white fw-bold" id="sidebarPhoneVal">{{ session('participant_phone') }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-white-50 small">عدد الفائزين:</span>
                                <span class="text-white fw-bold" id="sidebarWinners">...</span>
                            </div>
                        </div>
                    </div>
                    <div class="sidebar-card shadow-sm border-0">
                        <h6 class="text-white-50 border-bottom border-white border-opacity-10 pb-2 mb-3">إحصائيات إجمالية</h6>
                        <div class="value text-white fw-bold display-6" id="sidebarParticipants">...</div>
                        <div class="small text-white-50">شاركوا حتى الآن</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Result Modal -->
    <div class="modal fade result-modal" id="resultModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content result-modal-content overflow-hidden border-0">
                <div class="modal-header result-modal-header py-3 d-flex justify-content-between">
                    <h5 class="modal-title fw-bold text-white">نتيجة السحب</h5>
                </div>
                <div class="modal-body p-4 text-center">
                    <div class="result-badge mb-4 mx-auto" id="resultIcon">
                        🎉
                    </div>

                    <h2 class="prize-title mb-2 text-white" id="resultTitle">مبروك!</h2>
                    <p class="mb-4 text-white-50" id="resultText">لقد ربحت جائزة قيمة</p>

                    <div class="prize-card d-flex align-items-center justify-content-center gap-3 mb-4">
                        <div class="prize-dot" id="resultPrizeDot"></div>
                        <div class="meta-value fs-4 mb-0" id="resultPrize">...</div>
                    </div>

                    <div class="result-meta mb-4">
                        <div class="meta-item">
                            <div class="meta-label">رقم الهاتف</div>
                            <div class="meta-value" id="resultPhone">{{ session('participant_phone') }}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">وقت المشاركة</div>
                            <div class="meta-value" id="resultTime">--:--</div>
                        </div>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-primary py-3 fw-bold rounded-3" id="copyResultBtn">
                            <i class="bi bi-clipboard me-2"></i>نسخ النتيجة
                        </button>

                    <button type="button" class="btn btn-danger py-3 fw-bold rounded-3" data-bs-dismiss="modal" aria-label="Close"> إغلاق</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/wheel.js') }}"></script>
</body>
</html>
