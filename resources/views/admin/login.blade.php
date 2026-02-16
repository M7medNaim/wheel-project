<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل دخول المسؤول | دولاب الحظ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f8f9fa; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .login-card { width: 100%; max-width: 400px; padding: 2rem; border-radius: 1rem; }
    </style>
</head>
<body>
    <div class="card login-card shadow-sm">
        <div class="card-body">
            <h4 class="text-center mb-4">تسجيل دخول المسؤول</h4>
            <form action="{{ route('admin.login.submit') }}" method="POST">
                @csrf
                <div class="mb-3">
                    <label class="form-label">البريد الإلكتروني</label>
                    <input type="email" name="email" class="form-control" required autofocus>
                </div>
                <div class="mb-3">
                    <label class="form-label">كلمة المرور</label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                @if($errors->any())
                    <div class="alert alert-danger py-2 small">{{ $errors->first() }}</div>
                @endif
                <button type="submit" class="btn btn-primary w-100">دخول</button>
            </form>
        </div>
    </div>
</body>
</html>
