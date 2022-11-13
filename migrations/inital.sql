create table users (
  id serial primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null,
  created_at timestamp not null default now()
);

create table users_blaze (
  id serial primary key,
  password_ varchar(255) not null,
  username_ varchar(255) not null,
  created_at timestamp not null default now(),
  users_id integer references users(id)
  );
  
create table channel_config_double (
  id serial primary key,
  created_at timestamp not null default now(),
  sygnal_position integer not null,
  symbol_red varchar(105) not null,
  symbol_white varchar(105) not null,
  symbol_black varchar(105) not null,
  white_procted varchar(105) not null,
  detect varchar(105) not null
);

create table channel_name_double (
  channel_id integer references channel_config_double(id),
  channel_name varchar(105) not null
  );

create table channel_config_crash (
  id serial primary key,
  created_at timestamp not null default now(),
  sygnal_position integer not null,
  auto_position varchar(105) not null,
  waiting_number varchar(105) not null,
  remove varchar(105),
  detect varchar(105) not null
);

create table channel_name_crash (
  channel_id integer references channel_config_crash(id),
  channel_name varchar(105) not null
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
);

create table token_users (
    token text not null,
    created_at timestamp not null default now(),
    user_id integer references users(id) 
);