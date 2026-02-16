<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم | دوار الحظ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body class="bg-light">
    <div class="admin-wrapper d-flex">
        <!-- Sidebar -->
        <div class="admin-sidebar shadow-lg">
            <div class="px-4 mb-4">
                <div class="logo-small bg-white bg-opacity-10 p-2 rounded-3 mb-3 mx-auto" style="width: 60px; height: 60px;">
                    <img src="{{ asset('images/noktaclinic1.png') }}" class="w-100 h-100 object-fit-contain" alt="Logo">
                </div>
                <h6 class="text-white text-center fw-bold mb-0">نقطة كلينك</h6>
            </div>

            <nav class="nav flex-column">
                <a class="nav-link active" href="#" id="optionsTab"><i class="bi bi-gear-wide-connected me-2"></i>خيارات الدولاب</a>
                <a class="nav-link" href="#" id="participantsTab"><i class="bi bi-people me-2"></i>المشاركين</a>
                <hr class="text-white-50 mx-3">
                <form action="{{ route('logout') }}" method="POST" class="px-3">
                    @csrf
                    <button type="submit" class="btn btn-danger w-100 text-start">
                        <i class="bi bi-box-arrow-right me-2"></i>تسجيل الخروج
                    </button>
                </form>
            </nav>
        </div>

        <!-- Main Content -->
        <main class="admin-content flex-grow-1 p-4">
            <header class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold mb-0" id="contentTitle">خيارات الدولاب</h2>
                <div id="optionsActions">
                    <button id="addOptionBtn" class="btn btn-outline-primary rounded-pill px-4 me-2">
                        <i class="bi bi-plus-lg me-1"></i>إضافة خيار
                    </button>
                    <button id="saveOptionsBtn" class="btn btn-primary rounded-pill px-4">
                        <i class="bi bi-cloud-arrow-up me-1"></i>حفظ التعديلات
                    </button>
                </div>
            </header>

            <!-- Options Section -->
            <section id="optionsSection" class="content-section">
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-body p-4">
                        <div id="optionsList">
                            <!-- Options will be rendered here by admin.js -->
                            <div class="text-center p-5"><div class="spinner-border text-primary"></div></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Participants Section -->
            <section id="participantsSection" class="content-section d-none">
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-body p-0">
                        <div class="table-responsive table-scroll-container">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="ps-4">المشارك</th>
                                        <th>الجائزة</th>
                                        <th>التاريخ</th>
                                        <th class="text-end pe-4">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody id="participantsList">
                                    <!-- Participants will be rendered here by admin.js -->
                                    <tr><td colspan="4" class="text-center p-5 text-muted">جاري التحميل...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('admin-assets/js/admin.js') }}"></script>
</body>
</html>
