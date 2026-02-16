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
    <!-- International Telephone Input CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@26.1.1/build/css/intlTelInput.min.css">
    <style>
        /* Force LTR and horizontal layout for phone input */
        .iti {
            display: block !important;
            width: 100% !important;
        }

        #phone {
            width: 100% !important;
            padding-left: 95px !important; /* Space for flag + code */
            direction: ltr !important;
            text-align: left !important;
            height: 58px; /* Match btn height */
        }

        /* Prevent stacking of dial code */
        .iti--separate-dial-code .iti__selected-dial-code {
            display: inline-block !important;
            vertical-align: middle;
            margin-left: 4px;
        }

        .login-card {
            max-width: 450px;
            margin: auto;
        }

        .invalid-feedback-custom {
            display: none;
            width: 100%;
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: #ff4d4d;
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body class="login-page">
    <div class="login-wrapper">
        <div class="login-card shadow-lg rounded-4 p-4 p-md-5">
            <div class="logo-section text-center mb-4">
                <div class="logo-placeholder mb-3">
                    <img src="{{ asset('images/noktaclinic1.png') }}" alt="Nokta Clinic Logo" class="logo-img" onerror="this.src='https://placehold.co/120x120?text=Clinic';">
                </div>
                <h2 class="h3 mb-2">عجلة الحظ</h2>
                <p class="text-muted">أدخل رقم هاتفك للمشاركة واربح معنا جوائز فورية</p>
            </div>

            <form id="loginForm">
                @csrf
                <div class="mb-4 text-start" dir="rtl">
                    <label for="phone" class="form-label small fw-bold mb-2">رقم الهاتف</label>
                    <input type="tel" class="form-control form-control-lg" id="phone" required>
                    <div id="phoneError" class="invalid-feedback-custom"></div>
                </div>

                <div class="d-grid">
                    <button type="submit" class="btn btn-primary btn-lg py-3 fw-bold" id="submitBtn">
                        دخول للمشاركة
                    </button>
                </div>
            </form>

            <div class="contact-info">
                <div>
                    <a href="tel:05357176133"><i class="bi bi-telephone"></i> اتصل بنا</a>
                </div>
                <div>
                    <a href="https://wa.me/905357176133" target="_blank"><i class="bi bi-whatsapp"></i> واتساب</a>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@26.1.1/build/js/intlTelInput.min.js"></script>
    <script>
        const phoneInput = document.querySelector("#phone");
        const iti = window.intlTelInput(phoneInput, {
            initialCountry: "sa",
            preferredCountries: ["sa", "ae", "jo", "tr", "eg"],
            separateDialCode: true,
            autoPlaceholder: "aggressive",
            placeholderNumberType: "MOBILE",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@26.1.1/build/js/utils.js",
            i18n: {
                searchPlaceholder: "ابحث عن الدولة...",
            }
        });

        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const btn = document.getElementById('submitBtn');
            const errorDiv = document.getElementById('phoneError');
            const originalText = btn.innerHTML;
            const phoneNumber = phoneInput.value.trim();

            // Clear previous errors
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
            phoneInput.classList.remove('is-invalid');

            console.log("--- Login Debug Info ---");
            console.log("Raw Input:", phoneNumber);
            console.log("Utils Loaded:", typeof intlTelInputUtils !== 'undefined');

            let isValid = iti.isValidNumber();
            let fullPhone = iti.getNumber();
            const errorCode = iti.getValidationError();

            console.log("Validation Result:", isValid);
            console.log("Error Code:", errorCode);

            // Handle the case where utils.js is not yet loaded (returns null)
            if (isValid === null) {
                console.warn("Utils not loaded, performing basic check...");
                if (phoneNumber.length < 7) {
                    errorDiv.textContent = "الرقم قصير جداً.";
                    errorDiv.style.display = 'block';
                    phoneInput.classList.add('is-invalid');
                    return;
                }
                const countryData = iti.getSelectedCountryData();
                fullPhone = "+" + countryData.dialCode + phoneNumber.replace(/^0+/, '');
                isValid = true; // Proceed with basic check
            }

            if (isValid === false) {
                let msg = "رقم الهاتف غير صحيح.";
                if (errorCode === 2) msg = "الرقم قصير جداً.";
                if (errorCode === 3) msg = "الرقم طويل جداً.";

                errorDiv.textContent = msg;
                errorDiv.style.display = 'block';
                phoneInput.classList.add('is-invalid');
                return;
            }

            console.log("Final Full Phone:", fullPhone);

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>جاري التحميل...';

            console.log("Sending POST request to /participant/login with:", { phone: fullPhone });
            fetch('/participant/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ phone: fullPhone })
            })
            .then(async response => {
                console.log("Server Response Status:", response.status);
                const data = await response.json();
                console.log("Server JSON Data:", data);
                if (!response.ok) {
                    throw { message: data.message || 'حدث خطأ ما', errors: data.errors };
                }
                return data;
            })
            .then(data => {
                if (data.success) {
                    console.log("Login successful! Redirecting...");
                    localStorage.setItem('wheel_phone', data.phone);
                    window.location.href = '{{ route("wheel") }}';
                }
            })
            .catch(error => {
                console.error('Fetch/Processing Error:', error);
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
                phoneInput.classList.add('is-invalid');
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
            });
        });
    </script>
</body>
</html>
