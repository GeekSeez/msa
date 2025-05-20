# MSA

- description : nexson event system
- author : luke.lee0114@gmail.com

## RUN

- npm install -g pnpm
- pnpm install
- cp .env.example .env
- docker-compose build --no-cache
- docker-compose up -d

# API

## 1. 이벤트 게이트웨이 API (Gateway)

- **기능**: 외부 이벤트 마이크로서비스(`http://event-server:3002`)로 요청을 중계하고, 인증/인가만 처리

### 엔드포인트 목록

1. **이벤트 생성**

   - `POST /events`
   - 권한: OPERATOR, ADMIN
   - 호출: 요청 바디에 이벤트 정보(JSON) 포함하여 호출

2. **이벤트 목록 조회**

   - `GET /events`
   - 권한: 인증된 사용자 (USER, OPERATOR, ADMIN, AUDITOR)
   - 호출: 필요하다면 쿼리 파라미터(`?page=…&limit=…&status=…`)를 포함

3. **이벤트별 리워드 생성**

   - `POST /events/:eventId/rewards`
   - 권한: OPERATOR, ADMIN
   - 호출: URL 경로에 `eventId` 지정, 바디에 리워드 정보(JSON) 포함

4. **이벤트별 리워드 조회**

   - `GET /events/:eventId/rewards`
   - 권한: 인증된 사용자 (USER, OPERATOR, ADMIN, AUDITOR)
   - 호출: URL 경로에 `eventId` 지정

5. **리워드 요청 생성**

   - `POST /events/:eventId/requests`
   - 권한: USER
   - 호출: URL 경로에 `eventId` 지정, 별도 바디 없이(내부에서 JWT `userId` 사용)

6. **리워드 요청 목록 조회**
   - `GET /events/requests`
   - 권한: 인증된 사용자 (USER, OPERATOR, ADMIN, AUDITOR)
   - 호출: 쿼리 파라미터(`?page=…&limit=…&status=…`) 및 JWT 역할에 따라 결과 필터링

---

## 2. 이벤트 서비스 API (Microservice)

- **기능**: 실제 DB 연동 및 비즈니스 로직 수행, `RolesGuard` + `@Roles`로 접근 제어

### EventController

1. **이벤트 생성**

   - `POST /events`
   - 권한: OPERATOR, ADMIN
   - 호출: 바디에 이벤트 정보(JSON) 포함

2. **이벤트 목록 조회**

   - `GET /events`
   - 권한: USER, OPERATOR, ADMIN, AUDITOR
   - 호출: 쿼리 파라미터 없이 호출(모든 이벤트 반환)

3. **이벤트 상세 조회**
   - `GET /events/:id`
   - 권한: USER, OPERATOR, ADMIN, AUDITOR
   - 호출: URL 경로에 `id` 지정

### RequestController

1. **리워드 요청 생성**

   - `POST /events/:eventId/requests`
   - 권한: USER
   - 호출: URL 경로에 `eventId` 지정, JWT에서 `userId` 추출

2. **리워드 요청 목록 조회**

   - `GET /requests`
   - 권한: USER, AUDITOR, OPERATOR, ADMIN
   - 호출: 쿼리 파라미터(`?page=…&limit=…&status=…`) 및 JWT 역할에 따라 결과 필터링

3. **리워드 요청 승인**

   - `PATCH /requests/:id/approve`
   - 권한: OPERATOR, ADMIN
   - 호출: URL 경로에 `id` 지정

4. **리워드 요청 거절**
   - `PATCH /requests/:id/reject`
   - 권한: OPERATOR, ADMIN
   - 호출: URL 경로에 `id` 지정, 바디에 `{ "reason": "거절 사유" }` 포함

### RewardController

1. **리워드 생성**

   - `POST /events/:eventId/rewards`
   - 권한: OPERATOR, ADMIN
   - 호출: URL 경로에 `eventId` 지정, 바디에 리워드 정보(JSON) 포함

2. **리워드 목록 조회**
   - `GET /events/:eventId/rewards`
   - 권한: USER, OPERATOR, ADMIN, AUDITOR
   - 호출: URL 경로에 `eventId` 지정

---

## 3. 인증 게이트웨이 API (Auth Gateway)

- **기능**: 외부 인증 마이크로서비스(`http://auth-server:3001`)로 요청 중계

### 엔드포인트 목록

1. **회원가입**

   - `POST /auth/register`
   - 권한: 모두 (익명)
   - 호출: 바디에 `{ username, password, email, … }` 포함

2. **로그인**

   - `POST /auth/login`
   - 권한: 모두 (익명)
   - 호출: 바디에 `{ username, password }` 포함

3. **내 정보 조회**
   - `GET /auth/me`
   - 권한: 인증된 사용자
   - 호출: JWT 포함 요청

---

## 4. 인증 서비스 API (Auth Microservice)

- **기능**: 실제 회원가입/로그인 로직 및 JWT 발급, 권한 체크

### AuthController

1. **회원가입**

   - `POST /auth/register`
   - 권한: 모두 (익명)
   - 호출: 바디에 `{ username, password, email }` 포함

2. **로그인**

   - `POST /auth/login`
   - 권한: 모두 (익명)
   - 호출: 바디에 `{ username, password }` 포함

3. **프로필 조회**
   - `GET /auth/profile`
   - 권한: ADMIN
   - 호출: JWT + ADMIN 권한 필요
