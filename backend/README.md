# Backend

## Cài đặt môi trường

### Yêu cầu

- **Node.js** (phiên bản 18 trở lên)
- **pnpm** (package manager)
- **Docker** và **Docker Compose** (để chạy PostgreSQL)

### Cài đặt pnpm (nếu chưa có)

```bash
npm install -g pnpm
```

### Cài đặt dependencies

```bash
cd backend
pnpm install
```

### Biến môi trường

Tạo file `.env` trong thư mục `backend` với nội dung:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dacn_db"
```

Giá trị trên tương ứng với cấu hình mặc định trong `docker-compose.yml` (user, password, port, database name).

---

## Khởi động database với Docker Compose

Chạy PostgreSQL trong container:

```bash
cd backend
docker compose up -d
```

Kiểm tra container đang chạy:

```bash
docker compose ps
```

Dừng database:

```bash
docker compose down
```

---

## Tạo model mới: migration và cập nhật database

### 1. Sửa schema Prisma

Mở `prisma/schema.prisma` và thêm model mới (hoặc sửa model có sẵn). Ví dụ:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  createdAt DateTime @default(now())
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

Nhớ cập nhật quan hệ ở model liên quan (ví dụ thêm `posts Post[]` vào `User` nếu cần).

### 2. Tạo migration

```bash
pnpm prisma migrate dev --name ten_migration
```

Ví dụ:

```bash
pnpm prisma migrate dev --name add_post_model
```

Lệnh này sẽ:

- Tạo file migration trong `prisma/migrations/`
- Áp dụng migration lên database
- Generate lại Prisma Client (vào `src/generated/prisma`)

### 3. Chỉ generate client (không tạo migration)

Nếu chỉ đổi schema mà chưa cần migration (ví dụ đang dev local), có thể chỉ generate client:

```bash
pnpm prisma generate
```

---

## Xem database với Prisma GUI (Prisma Studio)

Prisma Studio là giao diện web để xem và chỉnh sửa dữ liệu trong database.

Chạy:

```bash
pnpm prisma studio
```

Trình duyệt sẽ mở tại `http://localhost:5555`. Tại đây bạn có thể xem các bảng, thêm/sửa/xóa bản ghi.

---

## Scripts khác

| Lệnh | Mô tả |
|------|--------|
| `pnpm dev` | Chạy server development (ts-node-dev) |
| `pnpm build` | Build TypeScript ra `dist/` |
| `pnpm start` | Chạy server từ `dist/index.js` |
