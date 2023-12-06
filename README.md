## 설문조사 서비스

### 서버 실행

1. `npm i`
2. `docker-compose -f database/docker-compose.yml up -d`
3. `npm run start:dev`

### 주의사항

- 설문지의 상태가 대기중인 경우만 설문지 내용, 문항, 선택지 등 수정/삭제 가능
- 설문을 시작하려면 문항이 최소 하나 이상 필요
