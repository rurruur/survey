GRANT all privileges on database survey_dev to nakkim;

-- 설문지 테이블 생성
create table template (
	id serial not null primary key,
	title varchar(255) not null,
	description text,
	status varchar(20) default 'waiting' check (status in ('waiting', 'in_progress', 'completed')),
	start_date timestamp,
	end_date timestamp,
	created_at timestamp not null default CURRENT_TIMESTAMP,
	updated_at timestamp not null default CURRENT_TIMESTAMP,
	deleted_at timestamp
);

-- 설문지 문항 테이블 생성
create table question (
	template_id serial not null,
	question_number int not null,
	content text not null,
	options jsonb not null,
	created_at timestamp not null default CURRENT_TIMESTAMP,
	updated_at timestamp not null default CURRENT_TIMESTAMP,
	deleted_at timestamp,
	primary key (template_id, question_number),
	foreign key (template_id) references template(id)
);

-- 설문지 답변 테이블 생성
create table respond (
	id serial not null primary key,
	template_id int not null,
	answers jsonb not null,
	is_submitted boolean not null default false,
	total_score int not null default 0,
	created_at timestamp not null default CURRENT_TIMESTAMP,
	updated_at timestamp not null default CURRENT_TIMESTAMP,
	deleted_at timestamp,
	foreign key (template_id) references template(id)
)