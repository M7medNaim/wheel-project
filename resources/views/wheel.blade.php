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
                    <div class="wheel-with-mascot" id="wheelWithMascot">
                        <div class="wheel-main-col">
                            <div class="wheel-container wheel-container--glow mb-5" id="wheelContainer">
                                <canvas id="wheelCanvas" class="wheel-canvas" data-logo="{{ asset('images/noktaclinic1.png') }}"></canvas>
                                <div class="wheel-pointer"></div>
                            </div>
                        <div class="wheel-mascot" id="wheelMascot" data-state="idle" aria-hidden="true">
                            <svg class="wheel-mascot-svg" viewBox="0 0 110 168" xmlns="http://www.w3.org/2000/svg" role="img">
                                <title>شخصية العيادة</title>
                                <g class="mascot-body">
                                    <ellipse cx="55" cy="148" rx="34" ry="14" fill="rgba(0,0,0,0.15)"/>
                                    <path d="M30 118 Q55 108 80 118 L76 150 Q55 158 34 150 Z" fill="#fff" stroke="#6b1f2a" stroke-width="2"/>
                                    <path d="M38 118 L38 138 M72 118 L72 138" stroke="#e8e8e8" stroke-width="2"/>
                                </g>
                                <g class="mascot-head-group">
                                    <circle cx="55" cy="72" r="38" fill="#ffdfc4" stroke="#6b1f2a" stroke-width="2"/>
                                    <circle cx="38" cy="80" r="6" fill="rgba(255,120,140,0.35)"/>
                                    <circle cx="72" cy="80" r="6" fill="rgba(255,120,140,0.35)"/>
                                </g>
                                <g class="mascot-cap">
                                    <path d="M18 52 Q55 28 92 52 L88 62 Q55 48 22 62 Z" fill="#fff" stroke="#6b1f2a" stroke-width="2"/>
                                    <rect x="44" y="38" width="22" height="8" rx="2" fill="#dc3545"/>
                                    <rect x="51" y="32" width="8" height="20" rx="1" fill="#dc3545"/>
                                </g>
                                <g class="mascot-face mascot-face--idle">
                                    <circle cx="42" cy="68" r="4" fill="#3d2832"/>
                                    <circle cx="68" cy="68" r="4" fill="#3d2832"/>
                                    <path d="M44 86 Q55 94 66 86" fill="none" stroke="#3d2832" stroke-width="2.2" stroke-linecap="round"/>
                                </g>
                                <g class="mascot-face mascot-face--spin">
                                    <circle cx="42" cy="68" r="4.5" fill="#3d2832"/>
                                    <circle cx="68" cy="68" r="4.5" fill="#3d2832"/>
                                    <path d="M44 88 L66 88" fill="none" stroke="#3d2832" stroke-width="2.5" stroke-linecap="round"/>
                                    <path d="M78 56 L86 50" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M32 56 L24 50" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                                </g>
                                <g class="mascot-face mascot-face--win">
                                    <path d="M38 66 Q42 60 46 66" fill="none" stroke="#3d2832" stroke-width="2.2" stroke-linecap="round"/>
                                    <path d="M64 66 Q68 60 72 66" fill="none" stroke="#3d2832" stroke-width="2.2" stroke-linecap="round"/>
                                    <path d="M40 88 Q55 102 70 88" fill="none" stroke="#3d2832" stroke-width="2.4" stroke-linecap="round"/>
                                </g>
                                <g class="mascot-face mascot-face--lose">
                                    <circle cx="42" cy="68" r="3.5" fill="#3d2832"/>
                                    <circle cx="68" cy="68" r="3.5" fill="#3d2832"/>
                                    <path d="M44 90 Q55 78 66 90" fill="none" stroke="#3d2832" stroke-width="2.2" stroke-linecap="round"/>
                                    <path d="M36 62 L40 66 M40 62 L36 66" stroke="#3d2832" stroke-width="1.6"/>
                                    <path d="M70 62 L74 66 M74 62 L70 66" stroke="#3d2832" stroke-width="1.6"/>
                                </g>
                                <g class="mascot-hand-wave">
                                    <path d="M78 112 Q94 92 98 78 Q100 70 92 74 Q88 84 80 98" fill="#ffdfc4" stroke="#6b1f2a" stroke-width="1.8"/>
                                </g>
                            </svg>
                        </div>
                        </div>
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
        <div class="modal-dialog modal-dialog-centered result-modal-dialog">
            <div class="modal-content result-modal-content overflow-hidden border-0">
                <div class="modal-header result-modal-header py-2 px-3 border-0">
                    <button type="button" class="btn-close btn-close-white btn-sm opacity-75 " data-bs-dismiss="modal" aria-label="إغلاق"></button>
                    <h5 class="modal-title fw-bold text-white mb-0 small text-center">نتيجة السحب</h5>
                </div>
                <div class="modal-body result-modal-body p-3 p-md-4 text-center">
                    <div class="result-modal-hero d-flex align-items-center gap-2 gap-md-3 mb-3 text-start">
                        <div class="result-badge flex-shrink-0 mb-0" id="resultIcon">🎉</div>
                        <div class="result-modal-titles flex-grow-1 min-w-0">
                            <h2 class="prize-title mb-1 text-white" id="resultTitle">مبروك!</h2>
                            <p class="mb-0 text-white-50 small result-modal-subtitle" id="resultText">لقد ربحت جائزة قيمة</p>
                        </div>
                    </div>

                    <div class="gift-card-wrap position-relative mx-auto mb-3" id="giftCardWrap">
                        <div class="gift-sparkles" aria-hidden="true">
                            <span class="gift-sparkle">✨</span>
                            <span class="gift-sparkle">⭐</span>
                            <span class="gift-sparkle">✨</span>
                            <span class="gift-sparkle">💫</span>
                            <span class="gift-sparkle">⭐</span>
                            <span class="gift-sparkle">✨</span>
                            <span class="gift-sparkle">🌟</span>
                            <span class="gift-sparkle">✨</span>
                        </div>
                        <div class="gift-card gift-card--win" id="giftCardResult">
                            <div class="gift-card__shine"></div>
                            <div class="gift-card__header">
                                <div class="gift-card__brand">Nokta Clinic</div>
                                <img src="{{ asset('images/noktaclinic1.png') }}" alt="" class="gift-card__logo" width="40" height="40">
                            </div>
                            <!-- <p class="gift-card__label">بطاقة هدية رقمية</p> -->
                            <div class="gift-card__prize-name text-break" id="giftCardPrizeName">—</div>
                            <div class="gift-card__accent" id="giftCardAccent"></div>
                            <ul class="gift-card__list list-unstyled mb-0 text-start small">
                                <li class="gift-card__row">
                                    <span class="gift-card__k">المشارك</span>
                                    <span class="gift-card__v text-break" id="giftCardPhone">{{ session('participant_phone') }}</span>
                                </li>
                                <li class="gift-card__row">
                                    <span class="gift-card__k">تاريخ ووقت الفوز</span>
                                    <span class="gift-card__v" id="giftCardWinDate">—</span>
                                </li>
                                <li class="gift-card__row gift-card__row--expiry" id="giftCardExpiryRow">
                                    <span class="gift-card__k">صالحة حتى</span>
                                    <span class="gift-card__v text-success fw-bold" id="giftCardExpiry">—</span>
                                </li>
                            </ul>
                            <p class="gift-card__note mb-0 mt-3 small" id="giftCardNote">
                                للحصول على الهدية، يرجى تأكيد الحجز خلال شهر من تاريخ الفوز 🎁
                            </p>
                        </div>
                    </div>

                    <div class="d-grid gap-2 result-modal-actions">
                        <button type="button" class="btn btn-primary py-2 py-md-3 fw-bold rounded-3" id="copyResultBtn">
                            <i class="bi bi-clipboard me-2"></i>نسخ البطاقة
                        </button>
                        <button type="button" class="btn btn-outline-light py-2 py-md-3 fw-bold rounded-3" id="saveGiftCardBtn">
                            <i class="bi bi-download me-2"></i>حفظ كصورة
                        </button>
                        <button type="button" class="btn btn-danger py-2 py-md-3 fw-bold rounded-3" data-bs-dismiss="modal" aria-label="Close">إغلاق</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <script>
        window.WHEEL_INITIAL_OPTIONS = @json($initialOptions ?? []);
    </script>
    <script src="{{ asset('js/wheel.js') }}"></script>
</body>
</html>
