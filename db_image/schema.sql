CREATE DATABASE IF NOT EXISTS db;

CREATE TABLE IF NOT EXISTS db.User(
	userID INTEGER NOT NULL AUTO_INCREMENT,
	fName VARCHAR(30),
	lName VARCHAR(30),
	town VARCHAR(30),
	gender VARCHAR(1),
	pw VARCHAR(64),
	email VARCHAR(50),
	dob DATE,
	UNIQUE(userID),
	PRIMARY KEY(userID)
);

CREATE TABLE IF NOT EXISTS db.Album(
	albumID INTEGER NOT NULL AUTO_INCREMENT, 
	userID INTEGER,
	name VARCHAR(30),
	dateCreated DATE,
	PRIMARY KEY(albumID),
	FOREIGN KEY (userID) REFERENCES db.User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS db.Friends(
	userID INTEGER,
	friendID INTEGER,
	dateFormed DATE,
	PRIMARY KEY (userID, friendID),
	FOREIGN KEY (userID) REFERENCES db.User(userID) ON DELETE CASCADE,
	FOREIGN KEY (friendID) REFERENCES db.User(userID) ON DELETE CASCADE,
	CHECK(userID != friendID)
);

CREATE TABLE IF NOT EXISTS db.Photo(
	photoID INTEGER NOT NULL AUTO_INCREMENT, 
	albumID INTEGER NOT NULL,
	caption VARCHAR(50),
	data VARCHAR(50),
	PRIMARY KEY (photoID),
	FOREIGN KEY (albumID) REFERENCES db.Album(albumID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS db.Likes(
	userID INTEGER,
	photoID INTEGER,
	PRIMARY KEY (userID, photoID),
	FOREIGN KEY (userID) REFERENCES db.User(userID) ON DELETE CASCADE,
	FOREIGN KEY (photoID) REFERENCES db.Photo(photoID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS db.Tag(
	name VARCHAR(50),
	photoID INTEGER,
	PRIMARY KEY (name, photoID),
	FOREIGN KEY (photoID) REFERENCES db.Photo(photoID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS db.Comment(
	commentID INTEGER NOT NULL AUTO_INCREMENT,
	content VARCHAR(120),
	dateCreated DATE,
	userID INTEGER,
	photoID INTEGER,
	PRIMARY KEY (commentID),
	FOREIGN KEY (userID) REFERENCES db.User(userID) ON DELETE CASCADE,
	FOREIGN KEY (photoID) REFERENCES db.Photo(photoID) ON DELETE CASCADE
);

ALTER TABLE db.User AUTO_INCREMENT=100000;

ALTER TABLE db.Album AUTO_INCREMENT=200000;

ALTER TABLE db.Photo AUTO_INCREMENT=300000;

ALTER TABLE db.Comment AUTO_INCREMENT=400000;

INSERT INTO db.User (fName, lName, town, gender, pw, email, dob) VALUES 
	('Stephen','Strange','Manhattan','M','1ab2cd','s.strange@kamertaj.org','1987-02-15 00:00:00'),
	('Tony','Stark','Miami','M','3ef4gh','stark@stark.com','1988-05-27 00:00:00'),
	('Steve','Rogers','Brooklyn','M','5ij6kl','s.rogers@army.mil','1925-03-13 00:00:00'),
	('Bruce','Banner','Dayton','M','7nm8op','b.bbanner@shield.gov','1979-07-17 00:00:00'),
	('Thor','Odinson','Asgard','M','9qr0st','th0r_r0ckz@gmail.com','1990-09-30 00:00:00'),
	('Peter','Parker','Queens','M','1uv2wx','nycwebcrawler@gmail.com','2001-01-15 00:00:00'),
	('Natasha','Romanoff','Moscow','F','3yz4ab','n.romano@shield.gov','1992-11-22 00:00:00'),
	('Scott','Lang','Coral Gables','M','5cd6ef','antman_avenger@gmail.com','1989-10-10 00:00:00'),
	('Steven','Grant','London','M','7gh8ij','steveng123@gmail.com','1992-09-19 00:00:00'),
	('Marc','Spector','Cairo','M','9kl0mn','notmarcspector@gmail.com','1992-09-19 00:00:00');

INSERT INTO db.Album (userID, name, dateCreated) VALUES 
	(100009,'"Art"','2023-01-30 00:00:00'),
	(100002,'"Suits"','2023-01-30 00:00:00'),
	(100003,'"Fitness"','2023-01-31 00:00:00'),
	(100009,'"Food"','2023-01-31 00:00:00'),
	(100005,'"Midgard"','2023-02-01 00:00:00'),
	(100002,'"Travel"','2023-02-02 00:00:00'),
	(100002,'"Cars"','2023-02-02 00:00:00'),
	(100005,'"Asgard"','2023-02-02 00:00:00'),
	(100006,'"Retro Tech"','2023-02-05 00:00:00'),
	(100004,'"Science"','2023-02-05 00:00:00');

INSERT INTO db.Friends VALUES 
	(100001,100003,'2023-01-30 00:00:00'),
	(100001,100009,'2023-01-31 00:00:00'),
	(100003,100001,'2023-01-31 00:00:00'),
	(100005,100003,'2023-02-01 00:00:00'),
	(100007,100003,'2023-02-01 00:00:00'),
	(100007,100005,'2023-02-03 00:00:00'),
	(100008,100007,'2023-02-07 00:00:00'),
	(100009,100002,'2023-02-09 00:00:00'),
	(100002,100009,'2023-02-09 00:00:00');

INSERT INTO db.Photo (albumID, caption, data) VALUES 
	(200000,'This is a caption','/path/to/photo1.jpg'),
	(200002,'This is another caption','/path/to/photo2.jpg'),
	(200003,'We''ve got so many captions','/path/to/photo3.jpg'),
	(200002,'Yet another caption','/path/to/photo4.jpg'),
	(200004,'Something about captions','/path/to/photo5.jpg'),
	(200005,'Captions?','/path/to/photo6.jpg'),
	(200004,'Captions!','/path/to/photo7.jpg'),
	(200005,'Wowie, another caption!','/path/to/photo8.jpg'),
	(200006,'Will the captions ever stop?','/path/to/photo9.jpg'),
	(200007,'Yep. This is the last caption.','/path/to/photo10.jpg');

INSERT INTO db.Tag VALUES ('"friends"',300001),
	('"food"',300000),
	('"fun"',300002),
	('"food"',300003),
	('"longweekend"',300003),
	('"food"',300004),
	('"drinks"',300005),
	('"friends"',300006),
	('"workout"',300007),
	('"fitness"',300007),
	('"friends"',300008),
	('"food"',300009),
	('"drinks"',300009),
	('"fun"',300009),
	('"friends"',300007);

INSERT INTO db.Comment (content, dateCreated, userID, photoID) VALUES 
	('This is a comment','2023-01-31 00:00:00',100002,300003),
	('This is another comment','2023-02-01 00:00:00',100000,300001),
	('Yet another comment','2023-02-01 00:00:00',100005,300004),
	('More comments? You bet!','2023-02-02 00:00:00',100003,300002),
	('We''ve got lots of comments','2023-02-03 00:00:00',100007,300008),
	('Comments galore!','2023-02-03 00:00:00',100007,300007),
	('The comments wont ever stop!','2023-02-03 00:00:00',100007,300005),
	('Nah, there''s only 3 more','2023-02-04 00:00:00',100006,300000),
	('Well heres another','2023-02-05 00:00:00',100004,300009),
	('Finally! The last comment!','2023-02-05 00:00:00',100001,300006);