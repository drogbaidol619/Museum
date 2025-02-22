create table users(
    id serial primary key,
    email varchar(100) not null unique,
    username varchar(100) not null,
    password varchar(100)
)