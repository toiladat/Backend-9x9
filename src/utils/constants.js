export const WHITELIST_DOMAINS = [
  'http://localhost:3000',
  'https://backend-9x9.onrender.com'
]

export const EMAIL_SUBJECT = 'Xác nhận KYC'

export const EMAIL_HTML = (otpKyc) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4299e1;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .otp-box {
            display: inline-block;
            margin: 20px 0;
            padding: 15px 25px;
            background-color: #ebf8ff;
            border: 1px dashed #4299e1;
            border-radius: 6px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
            color: #2b6cb0;
        }
        .footer {
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #718096;
            background-color: #f7fafc;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>MÃ XÁC THỰC KYC</h2>
        </div>
        <div class="content">
            <p>Mã OTP của bạn là:</p>
            <div class="otp-box">${otpKyc}</div>
            <p>Vui lòng sử dụng mã này để hoàn tất xác minh danh tính.</p>
            <p><strong>Lưu ý:</strong> Mã có hiệu lực trong 5 phút</p>
        </div>
        <div class="footer">
            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
            <p>© ${new Date().getFullYear()} Hệ thống KYC</p>
        </div>
    </div>
</body>
</html>
`