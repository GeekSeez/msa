# 베이스 빌드 단계
FROM node:18-alpine AS base

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 복사 (node_modules는 .dockerignore로 제외)
COPY . .

# 빌드할 서비스 지정 (auth-server, event-server, gateway-server 중 하나)
ARG SERVICE

# 서비스 디렉토리로 이동
WORKDIR /app/apps/${SERVICE}

# 해당 서비스만 TypeScript 빌드
RUN npx tsc -p tsconfig.json

# 실행 단계
FROM node:18-alpine

WORKDIR /app

# 빌드된 파일 복사
COPY --from=base /app/dist ./dist

# 실행에 필요한 package.json과 의존성 복사
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules

# 빌드 시 ARG를 런타임 환경변수로 설정
ARG SERVICE
ENV SERVICE=${SERVICE}

# 쉘을 통해 환경변수 치환이 가능하게 실행
CMD ["sh", "-c", "node ./dist/apps/${SERVICE}/main.js"]
