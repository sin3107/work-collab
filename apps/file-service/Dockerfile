# 베이스 이미지
FROM node:22

# 시스템 패키지 설치를 위한 루트 권한으로 실행
USER root

# netcat 설치를 위해 필요한 패키지 업데이트 및 설치
RUN apt-get update && apt-get install -y netcat-openbsd

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 및 설정 파일 복사
COPY package*.json ./  
COPY tsconfig*.json ./  
COPY nest-cli.json ./

# 전체 프로젝트 복사
COPY . .

# 의존성 설치
RUN npm install

# 서비스 빌드
RUN npm run build file-service

# wait-for-it 스크립트 복사 및 실행 권한 설정
COPY scripts/wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# PostgreSQL이 준비될 때까지 대기 후 NestJS 앱 실행
CMD ["./wait-for-it.sh", "postgres-db:5432", "--", "node", "dist/apps/file-service/src/main.js"]
