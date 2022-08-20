-- create table users (
--   id serial primary key,
--   name varchar(255) not null,
--   email varchar(255) not null,
--   password varchar(255) not null,
--   created_at timestamp not null default now()
-- );

-- create table payament (
--   id serial primary key,
--   user_id integer not null,
--   value integer not null,
--   created_at timestamp not null default now()
-- );

create table payament_time (
    user_id integer not null,
    value integer not null,
    last_update timestamp not null default now()
)
