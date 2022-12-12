CREATE DATABASE bezkoder_db

CREATE TABLE users(
  id: BINARY(16) PRIMARY KEY,
  name: VARCHAR(30),
  email: VARCHAR(30),
  age: INT(2)
  password: VARCHAR(30),
  create_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

DESCRIBE users
