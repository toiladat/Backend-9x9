export const WHITELIST_DOMAINS = [
  'http://localhost:3000',
  'https://backend-9x9.onrender.com',
  'https://gasy-9x9-plus-fe.vercel.app',
  'https://backend-9x9-v2.onrender.com'
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
export const DESC_BOX = [
  'Sao thức tỉnh',
  'Sao gieo hạt',
  'Sao mở lòng',
  'Sao kết nối',
  'Sao phản chiếu',
  'Sao dẫn lối',
  'Sao khai sáng',
  'Sao rộng mở',
  'Sao kiến tạo'
]


export const PLAY_MIN_TIME = 40
export const MAX_PLAY_TIMES = 9
export const MINUTES_PER_RECOVERY = 9 * 60 * 1000

export const OPEN_BOX_AMOUNT= 26
export const DISTRIBUTE_PER_USER = 0.55
export const DIRECTED_AMOUNT_VALUE = 10
export const DISTRIBUTED_AMOUNT_VALUE = 10
export const SYSTEM_AMOUNT_VALUE = 1
export const REFERRAL_CHAIN_AMOUNT_VALUE = 5

export const DIRECTED_AMOUNT_TYPE = 'directedAmount'
export const DISTRIBUTED_AMOUNT_TYPE = 'distributedAmount'
export const SYSTEM_AMOUNT_TYPE = 'systemAmount'
export const REFERRAL_CHAIN_AMOUNT_TYPE = 'referralChainAmount'

export const BADGES = {
  FIRESTARTER: 'NGƯỜI TRUYỀN LỬA',
  SOWER: 'NGƯỜI GIAO HẠT',
  GUIDE: 'NGƯỜI DẪN ĐƯỜNG',
  INSPIRER: 'NGƯỜI TRUYỀN CẢM HỨNG',
  AMBASSADOR: 'ĐẠI SỨ 9x9 Plus'
}

export const ONE_YEAR = 365 * 24 * 60 * 60 * 1000
export const ONE_DAY = 24 * 60 * 60 * 1000


export const REWARD_DAYS = [
  { day: 3, score: 99 },
  { day: 21, score: 999 },
  { day: 30, score: 999 }
]
export const REWARDS_MISSSIONS = {
  shareLink: 99,
  joinGroup: 99,
  readTerms: 99
}
export const REWARDS_MINING = 99

export const VALID_PLAY_TIMES = 9