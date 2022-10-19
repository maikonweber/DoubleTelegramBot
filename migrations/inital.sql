create table users (
  id serial primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null,
  created_at timestamp not null default now()
);

create table payament_value (
  id serial primary key,
  user_id integer references users(id),
  pay boolean not null,
  created_at timestamp not null default now()
);

create table payament_time (
    user_id integer references users(id),
    value integer not null,
    last_update timestamp not null default now()
)

create table token_users (
    token text not null,
    created_at timestamp not null default now(),
    user_id integer references users(id) 
);