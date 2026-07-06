-- Create a database named 'college'
CREATE DATABASE college;

-- Switch to the 'college' database
USE college;

-- Create a table named 'student'
CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT NOT NULL
);