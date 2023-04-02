CREATE DATABASE IF NOT EXISTS db;

CREATE TABLE IF NOT EXISTS db.User(
	userID INTEGER NOT NULL,
	fName VARCHAR(30),
	lName VARCHAR(30),
	town VARCHAR(30),
	gender VARCHAR(1),
	pw VARCHAR(50),
	email VARCHAR(50),
	dob DATE,
	UNIQUE(userID),
	PRIMARY KEY(userID)
);

CREATE TABLE IF NOT EXISTS db.Album(
	albumID INTEGER, 
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
	photoID INTEGER, 
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
	commentID INTEGER,
	content VARCHAR(120),
	dateCreated DATE,
	userID INTEGER,
	photoID INTEGER,
	PRIMARY KEY (commentID),
	FOREIGN KEY (userID) REFERENCES db.User(userID) ON DELETE CASCADE,
	FOREIGN KEY (photoID) REFERENCES db.Photo(photoID) ON DELETE CASCADE
);

INSERT INTO db.User VALUES (100001,'Stephen','Strange','Manhattan','M','1ab2cd','s.strange@kamertaj.org','1987-02-15 00:00:00'),
	(100002,'Tony','Stark','Miami','M','3ef4gh','stark@stark.com','1988-05-27 00:00:00'),
	(100003,'Steve','Rogers','Brooklyn','M','5ij6kl','s.rogers@army.mil','1925-03-13 00:00:00'),
	(100004,'Bruce','Banner','Dayton','M','7nm8op','b.bbanner@shield.gov','1979-07-17 00:00:00'),
	(100005,'Thor','Odinson','Asgard','M','9qr0st','th0r_r0ckz@gmail.com','1990-09-30 00:00:00'),
	(100006,'Peter','Parker','Queens','M','1uv2wx','nycwebcrawler@gmail.com','2001-01-15 00:00:00'),
	(100007,'Natasha','Romanoff','Moscow','F','3yz4ab','n.romano@shield.gov','1992-11-22 00:00:00'),
	(100008,'Scott','Lang','Coral Gables','M','5cd6ef','antman_avenger@gmail.com','1989-10-10 00:00:00'),
	(100009,'Steven','Grant','London','M','7gh8ij','steveng123@gmail.com','1992-09-19 00:00:00'),
	(100010,'Marc','Spector','Cairo','M','9kl0mn','notmarcspector@gmail.com','1992-09-19 00:00:00');

INSERT INTO db.Album VALUES (200001,100009,'"Art"','2023-01-30 00:00:00'),
	(200002,100002,'"Suits"','2023-01-30 00:00:00'),
	(200003,100003,'"Fitness"','2023-01-31 00:00:00'),
	(200004,100009,'"Food"','2023-01-31 00:00:00'),
	(200005,100005,'"Midgard"','2023-02-01 00:00:00'),
	(200006,100002,'"Travel"','2023-02-02 00:00:00'),
	(200007,100002,'"Cars"','2023-02-02 00:00:00'),
	(200008,100005,'"Asgard"','2023-02-02 00:00:00'),
	(200009,100006,'"Retro Tech"','2023-02-05 00:00:00'),
	(200010,100004,'"Science"','2023-02-05 00:00:00');

INSERT INTO db.Friends VALUES (100001.0,100003.0,'2023-01-30 00:00:00'),
	(100001.0,100010.0,'2023-01-31 00:00:00'),
	(100003.0,100001.0,'2023-01-31 00:00:00'),
	(100005.0,100003.0,'2023-02-01 00:00:00'),
	(100007.0,100003.0,'2023-02-01 00:00:00'),
	(100007.0,100005.0,'2023-02-03 00:00:00'),
	(100008.0,100007.0,'2023-02-07 00:00:00'),
	(100009.0,100002.0,'2023-02-09 00:00:00'),
	(100002.0,100009.0,'2023-02-09 00:00:00');

INSERT INTO db.Photo VALUES (300001,200001,'This is a caption','/path/to/photo1.jpg'),
	(300002,200002,'This is another caption','/path/to/photo2.jpg'),
	(300003,200003,'We''ve got so many captions','/path/to/photo3.jpg'),
	(300004,200002,'Yet another caption','/path/to/photo4.jpg'),
	(300005,200004,'Something about captions','/path/to/photo5.jpg'),
	(300006,200005,'Captions?','/path/to/photo6.jpg'),
	(300007,200004,'Captions!','/path/to/photo7.jpg'),
	(300008,200005,'Wowie, another caption!','/path/to/photo8.jpg'),
	(300009,200006,'Will the captions ever stop?','/path/to/photo9.jpg'),
	(300010,200007,'Yep. This is the last caption.','/path/to/photo10.jpg');

INSERT INTO db.Tag VALUES ('"friends"',300001),
	('"food"',300001),
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
	('"friends"',300010);

INSERT INTO db.Comment VALUES (400001,'This is a comment','2023-01-31 00:00:00',100002,300003),
	(400002,'This is another comment','2023-02-01 00:00:00',100010,300001),
	(400003,'Yet another comment','2023-02-01 00:00:00',100005,300004),
	(400004,'More comments? You bet!','2023-02-02 00:00:00',100003,300002),
	(400005,'We''ve got lots of comments','2023-02-03 00:00:00',100007,300008),
	(400006,'Comments galore!','2023-02-03 00:00:00',100007,300007),
	(400007,'The comments wont ever stop!','2023-02-03 00:00:00',100007,300005),
	(400008,'Nah, there''s only 3 more','2023-02-04 00:00:00',100006,300010),
	(400009,'Well heres another','2023-02-05 00:00:00',100004,300009),
	(400010,'Finally! The last comment!','2023-02-05 00:00:00',100001,300006);
