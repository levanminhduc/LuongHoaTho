# Hệ Thống Quản Lý Lương Nhân Viên

Ứng dụng web được xây dựng bằng Next.js và Supabase để quản lý và tra cứu thông tin lương nhân viên.

## Tính Năng

### Dành cho Admin:
- Đăng nhập bảo mật
- Upload và parse file Excel chứa dữ liệu lương
- Xem dashboard với thống kê tổng quan
- Quản lý toàn bộ dữ liệu lương

### Dành cho Nhân Viên:
- Tra cứu lương bằng mã nhân viên + số CCCD
- Xem chi tiết thông tin lương cá nhân
- Giao diện thân thiện, dễ sử dụng

## Cài Đặt

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd payroll-management-system
\`\`\`

### 2. Cài Đặt Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Cấu Hình Environment Variables
Tạo file `.env.local` từ `.env.example`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Điền thông tin Supabase:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
\`\`\`

### 4. Thiết Lập Supabase Database
Chạy SQL script để tạo bảng:
\`\`\`sql
-- Chạy script trong scripts/create-tables.sql
\`\`\`

### 5. Chạy Ứng Dụng
\`\`\`bash
npm run dev
\`\`\`

Truy cập: http://localhost:3000

## Cấu Trúc Dự Án

\`\`\`
├── app/
│   ├── admin/
│   │   ├── login/          # Trang đăng nhập admin
│   │   └── dashboard/      # Dashboard quản trị
│   ├── employee/
│   │   └── lookup/         # Trang tra cứu nhân viên
│   ├── api/
│   │   ├── admin/          # API routes cho admin
│   │   └── employee/       # API routes cho nhân viên
│   └── page.tsx            # Trang chủ
├── lib/
│   ├── auth.ts             # Xử lý authentication
│   └── excel-parser.ts     # Parse file Excel
├── utils/supabase/         # Cấu hình Supabase clients
└── scripts/
    └── create-tables.sql   # SQL script tạo bảng
\`\`\`

## Sử Dụng

### Admin:
1. Truy cập `/admin/login`
2. Đăng nhập với: `admin` / `admin123`
3. Upload file Excel chứa dữ liệu lương
4. Xem và quản lý dữ liệu

### Nhân Viên:
1. Truy cập `/employee/lookup`
2. Nhập mã nhân viên và số CCCD
3. Xem thông tin lương

## Format File Excel

File Excel cần có các cột (tên cột có thể tiếng Việt):
- Mã nhân viên / Employee ID
- Họ tên / Full Name
- CCCD / CMND
- Chức vụ / Position (tùy chọn)
- Tháng lương / Salary Month
- Tổng thu nhập / Total Income
- Khấu trừ / Deductions
- Lương thực lĩnh / Net Salary

## Bảo Mật

- JWT token cho admin authentication
- API routes được bảo vệ bằng middleware
- Nhân viên chỉ xem được dữ liệu của mình
- Validation đầu vào cho tất cả API

## Công Nghệ Sử Dụng

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT, bcryptjs
- **File Processing**: xlsx library
- **Deployment**: Vercel (recommended)

## Triển Khai

### Vercel:
1. Push code lên GitHub
2. Connect repository với Vercel
3. Cấu hình environment variables
4. Deploy

### Supabase:
1. Tạo project mới trên supabase.com
2. Chạy SQL script tạo bảng
3. Lấy URL và API keys
4. Cấu hình RLS policies nếu cần

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong console
2. Xác nhận cấu hình environment variables
3. Đảm bảo Supabase database đã được thiết lập đúng
\`\`\`
2. Xác nhận cấu hình environment variables
3. Đảm bảo Supabase database đã được thiết lập đúng

## License

MIT License - xem file LICENSE để biết thêm chi tiết.
