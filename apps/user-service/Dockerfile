# 베이스 이미지
FROM node:22

# 작업 디렉토리
WORKDIR /app

# 패키지 복사 및 설치
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# 전체 프로젝트 복사
COPY . .

# 의존성 설치 (루트 기준)
RUN npm install

# 빌드
RUN npm run build user

# 실행
CMD ["node", "dist/apps/user/main.js"]
