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
  {
    title: {
      vi: 'Sao thức tỉnh',
      en: 'Awakening Star',
      zh: '觉醒之星'
    },
    content: {
      vi: 'Trải nghiệm đầu tiên, gắp sao nhận thông điệp thức tỉnh.',
      en: 'The first experience – draw a star and receive your awakening message.',
      zh: '第一次体验——抽取星星，接收觉醒讯息。'
    }
  },
  {
    title: {
      vi: 'Sao gieo hạt',
      en: 'Seed Star',
      zh: '播种之星'
    },
    content: {
      vi: 'Giới thiệu StarBox cho người thân – tạo điểm chạm đầu tiên.',
      en: 'Introduce StarBox to loved ones – create the first meaningful touchpoint.',
      zh: '向亲友介绍 StarBox——创造第一次连结的种子。'
    }
  },
  {
    title: {
      vi: 'Sao mở lòng',
      en: 'Opening Star',
      zh: '敞开心扉之星'
    },
    content: {
      vi: 'Nhận tín hiệu từ bên trong, bước vào hành trình khai sáng.',
      en: 'Receive inner signals and step into the journey of illumination.',
      zh: '接受内在讯号，踏上启蒙之旅。'
    }
  },
  {
    title: {
      vi: 'Sao kết nối',
      en: 'Connection Star',
      zh: '连接之星'
    },
    content: {
      vi: 'Kết nối những người đồng hành, cùng học hỏi – chữa lành.',
      en: 'Connect with companions, learn together – and heal.',
      zh: '连接同行者，共同学习与疗愈。'
    }
  },
  {
    title: {
      vi: 'Sao phản chiếu',
      en: 'Reflection Star',
      zh: '映照之星'
    },
    content: {
      vi: 'Đối diện thử thách – nhìn sâu vào bóng tối bên trong.',
      en: 'Face your challenges – look deeply into your inner shadows.',
      zh: '直面挑战——深入看见内在的阴影。'
    }
  },
  {
    title: {
      vi: 'Sao dẫn lối',
      en: 'Guiding Star',
      zh: '引路之星'
    },
    content: {
      vi: 'Trở thành người chia sẻ, truyền cảm hứng cho nhóm nhỏ.',
      en: 'Become a sharer and inspire a small group.',
      zh: '成为分享者，激励你的小组。'
    }
  },
  {
    title: {
      vi: 'Sao khai sáng',
      en: 'Enlightening Star',
      zh: '启发之星'
    },
    content: {
      vi: 'Hiểu rõ sứ mệnh, bắt đầu xây hệ thống cộng hưởng.',
      en: 'Understand your mission and begin building a resonant system.',
      zh: '明确使命，开始建立共振体系。'
    }
  },
  {
    title: {
      vi: 'Sao rộng mở',
      en: 'Expanding Star',
      zh: '扩展之星'
    },
    content: {
      vi: 'Lan tỏa mạnh mẽ – hỗ trợ người khác cùng thức tỉnh.',
      en: 'Expand your influence – support others on their awakening journey.',
      zh: '强力扩散——支持他人共同觉醒。'
    }
  },
  {
    title: {
      vi: 'Sao kiến tạo',
      en: 'Creator Star',
      zh: '创造者之星'
    },
    content: {
      vi: 'Trở thành Nhà kiến tạo – đồng hành cùng 9x9 phát triển dài lâu.',
      en: 'Become a Creator – journey with 9x9 for long-term evolution.',
      zh: '成为创造者——与 9x9 共创长期发展。'
    }
  }
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
  shareLink: 999,
  joinGroup: 999,
  readTerms: 999
}
export const REWARDS_MINING = 99

export const VALID_PLAY_TIMES = 9

export const REWARDS_FOR_INVITE = 999