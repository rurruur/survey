## 설문조사 서비스

[요구사항](https://maumlab.notion.site/3-9ad4007107ab4d6da0c10325aac1abb2)

### DB 설정

- [init.sql](database/init.sql)
- [docker-compose.yml](database/docker-compose.yml)

### 서버 실행

1. `npm i`
2. `docker-compose -f database/docker-compose.yml up -d`
3. `npm run start:dev`

### api-spec

[api-spec.json](api-spec.json) 파일을 import하여 사용

- Insomnia 기준 `Create` - `File` - `해당 파일 선택` -> survey라는 콜렉션 생성됨

### 기능

#### 설문지 CRUD

- 대기중 상태의 설문지만 수정/삭제 가능하다.
- 설문을 시작하려면 문항이 최소 하나 이상 필요하다.
- 설문지 상태변경은 시작(대기중 -> 진행중), 종료(진행중 -> 완료)만 가능하다.

#### 문항(선택지) CRUD

- 대기중 상태의 설문지만 문항 생성/수정/삭제가 가능하다.

#### 답변 CRUD

- 작성 중 백업을 위해 `Respond.isSubmitted`를 이용한다.
- 진행중 상태의 설문지만 답변 생성이 가능하다.
- 설문지ID를 이용하여 해당 설문지에 생성된 답변 리스트를 조회할 수 있다.
- 제출 이후 답변 수정은 불가능하다.
- 설문지가 완료된 경우 제출/삭제/수정이 불가능하다.
