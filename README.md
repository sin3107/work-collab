# 📌 업무관리 시스템 (MSA 기반)

> 팀/개인 일정, 채팅, 파일 업로드, 업무 할당 등을 지원하는 **Microservice Architecture 기반 협업 시스템**입니다.  
> NestJS, Docker, PostgreSQL, MongoDB, Redis 등을 활용하여 서비스별로 독립적으로 구성되어 있으며, `docker-compose`를 통해 전체 시스템을 손쉽게 실행할 수 있습니다.

---

## 🛠️ 기술 스택

| 구분         | 사용 기술 |
|--------------|-----------|
| Backend      | NestJS (v10+), TypeORM, Mongoose, Passport |
| Database     | PostgreSQL (RDB), MongoDB (NoSQL), Redis (Pub/Sub, Cache) |
| API 문서화   | Swagger (OpenAPI 3.0) |
| 인증         | JWT 인증 / Refresh Token / Local Strategy |
| 인프라       | Docker, Docker Compose, NGINX (Gateway 예정) |
| 통신 방식    | REST API + WebSocket(STOMP) + Redis Pub/Sub |
| 프로젝트 구조 | Monorepo (Nx 기반 아님), Domain-Driven Architecture |
| 기타         | Joi Validation, 환경별 설정 분리, 글로벌 예외 처리 및 응답 포맷 통일 등 |

---

## 📁 서비스 구성 (MSA)

| 서비스명        | 설명 |
|-----------------|------|
| **auth-service** | 로그인, 회원가입, 토큰 발급/갱신/로그아웃 등 인증 기능 |
| **user-service** | 유저 프로필, 팀 연동, 유저-팀 관계 관리 |
| **file-service** | S3 업로드 기반의 파일 업로드/다운로드 관리 |
| **chat-service** | 팀 기반 채팅방 생성, 메시지 저장/전송, 실시간 WebSocket 채팅 |
| **task-service** | 일정, 업무 태스크 생성/조회, 캘린더 연동 기능 (예정) |

---

## ⚙️ 실행 방법

```bash
# 1. 환경 설정
cp .env.example .env  # 또는 각 서비스의 .env 생성

# 2. 모든 서비스를 Docker로 실행
docker-compose up --build
```

> ✅ `docker-compose.yml`은 각 서비스의 Dockerfile과 `.env`를 기반으로 PostgreSQL, Redis, MongoDB와 함께 실행됩니다.

---

## 📌 주요 기능

- ✅ **회원가입/로그인/로그아웃/토큰 갱신** (auth-service)
- ✅ **유저 정보 조회, 팀 초대/가입** (user-service)
- ✅ **파일 업로드/다운로드 (S3 연동)** (file-service)
- ✅ **채팅방 생성 / 메시지 저장 및 WebSocket 실시간 통신** (chat-service)
- 🛠️ **업무 태스크/캘린더 기반 일정 관리** (task-service 예정)

---

## 📦 폴더 구조 (예시)

```
/work-collab
├── apps/
│   ├── auth-service/
│   ├── user-service/
│   ├── file-service/
│   ├── chat-service/
│   └── task-service/
├── libs/
│   ├── common/      # 공통 DTO, 인터셉터, 데코레이터 등
│   └── bootstrap/   # 공통 bootstrap, config
└── docker-compose.yml
```

---

## 📄 Swagger API 문서

각 서비스는 `/docs` 엔드포인트에서 Swagger 문서를 제공합니다.

예시: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 🧪 개발 진행 상태

- [x] 인증 서버 개발 완료
- [x] 유저/팀 기능 완료
- [x] 파일 업로드 기능 개발 중
- [x] 메시지 저장 및 Redis 발행 구조 완료
- [ ] WebSocket 통합 및 채팅방 관리
- [ ] 업무 일정 관리 기능 개발 예정

---

## 🧑‍💻 개발자 노트

- 모든 API 응답은 `SuccessResponse`, `ErrorResponse` 구조로 통일
- DTO 기반의 엄격한 타입 검증 및 Swagger 문서화
- 실서비스 수준의 인증 흐름 및 보안 고려 (Refresh Token, Blacklisting 등)
- 테스트 및 운영환경 분리된 `.env` 및 설정 모듈 적용

---

## 📝 추후 계획

- ✅ 채팅방 캐싱 및 메시지 세션 관리 (Redis 활용)
- ✅ 팀 자동 참여 채널 구성
- ✅ WebSocket 인증 통합
- 🧩 Kafka 기반 이벤트 처리 (차후 확장 가능성 고려)
- 🧩 NGINX 기반 Gateway 및 서비스 라우팅

