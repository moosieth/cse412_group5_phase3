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
	caption VARCHAR(100),
	data VARCHAR(255),
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
	('Stephen','Strange','Manhattan','M','$2b$12$d8pobJahbuM9x2siX2HC6.GUvlzTzTpZ6pk.2AdYQLR0CjYZCYdFC','s.strange@kamertaj.org','1987-02-15 00:00:00'),
	('Tony','Stark','Miami','M','$2b$12$r1If2.6fUqsKLKKLTkEdJOKZUiZWJf691H1ppxHFIe6FunqHWIhbC','stark@stark.com','1988-05-27 00:00:00'),
	('Steve','Rogers','Brooklyn','M','$2b$12$St6VryAsA9YQYDU6rlLbauciDXRHbh6ayjTQUxORbWDwdzch21D/W','steve@gmail.com','1925-03-13 00:00:00'),
	('Bruce','Banner','Dayton','M','$2b$12$DYJSoKKw3xT7UwXdzdL/w.DDfQD0CXB5QEATBksgtfrM89nILhlqi','bruce@gmail.com','1979-07-17 00:00:00'),
	('Thor','Odinson','Asgard','M','$2b$12$AsWLriPbEX/LQzMldZ2G4.z2/CKM2JwBauzQyKevrNdgLhUjbv9.i','thor@gmail.com','1990-09-30 00:00:00'),
	('Peter','Parker','Queens','M','$2b$12$mfOPCMTQLz61SdhR3efeVuXHRFE0pL033FbqV2WKHXsT0HPFXmyrm','peter@gmail.com','2001-01-15 00:00:00'),
	('Natasha','Romanoff','Moscow','F','$2b$12$s2Vt.SaXLNKUhPWDXDJ0mOuCR3eHG7PqzZjL9WI7U12mfGwWzaeGG','nat@gmail.com','1992-11-22 00:00:00'),
	('Scott','Lang','Coral Gables','M','$2b$12$h.10UambJqZ2aO/kvBY0BuOf0IDKCF2kBkDOY1T6C8JS5SRh9htoG','scott@gmail.com','1989-10-10 00:00:00'),
	('Steven','Grant','London','M','$2b$12$J.xkE8IREQVqL54JPoQ8d.px04rnEeB2msJN5a1tT9/0MZRn1Yz9K','steveng123@gmail.com','1992-09-19 00:00:00'),
	('Marc','Spector','Cairo','M','$2b$12$9zZ/JKA7xZ.gDcWWLaBLOO8n2m31/.5z3ZGdtgSe2OVlBCnbCSxlK','marc@gmail.com','1992-09-19 00:00:00'),
	('Inql','App','Test','O','$2b$12$yMOwIBZr6X9eRIzJ0S3DZ.RPmPSofAekZYM8Ku6GEVOHk4fN6WSGW','test@test.com','1900-01-01 00:00:00');

INSERT INTO db.Album (userID, name, dateCreated) VALUES 
	(100009,'Art','2023-01-30 00:00:00'),
	(100002,'Suits','2023-01-30 00:00:00'),
	(100003,'Fitness','2023-01-31 00:00:00'),
	(100009,'Food','2023-01-31 00:00:00'),
	(100005,'Midgard','2023-02-01 00:00:00'),
	(100002,'Travel','2023-02-02 00:00:00'),
	(100002,'Cars','2023-02-02 00:00:00'),
	(100005,'Asgard','2023-02-02 00:00:00'),
	(100006,'Retro Tech','2023-02-05 00:00:00'),
	(100004,'Science','2023-02-05 00:00:00'),
	(100010,'Test','2023-04-17 00:00:00');

INSERT INTO db.Friends VALUES 
	(100001,100003,'2023-01-30 00:00:00'),
	(100001,100009,'2023-01-31 00:00:00'),
	(100003,100001,'2023-01-31 00:00:00'),
	(100005,100003,'2023-02-01 00:00:00'),
	(100007,100004,'2023-02-01 00:00:00'),
	(100007,100005,'2023-02-03 00:00:00'),
	(100008,100007,'2023-02-07 00:00:00'),
	(100009,100002,'2023-02-09 00:00:00'),
	(100002,100009,'2023-02-09 00:00:00'),
	(100010,100009,'2023-03-09 00:00:00'),
	(100001,100007,'2023-03-31 00:00:00');

INSERT INTO db.Photo (albumID, caption, data) VALUES 
	(200000,'This is a caption', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Ffef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg?alt=media&token=021d1e96-7cd7-4aa6-84b5-285b09c8b023'),
	(200001,'This is another caption', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Famsterdam.jpeg?alt=media&token=a13a857d-081a-42f4-a79e-99d732aa4ff1'),
	(200003,'Working on a project', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2FIMG_5725.PNG?alt=media&token=16de3062-b91c-4bf5-afc9-e25a39a3d034'),
	(200002,'Yet another caption', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Ffootball.jpeg?alt=media&token=f1c55d3c-44fe-4b9e-b925-86a97d66a37d'),
	(200004,'Something about captions', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fleft01.jpg?alt=media&token=4731212a-8df5-492a-8ef0-dd773e48257d'),
	(200005,'Captions?', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fnew_horizon.jpg?alt=media&token=db9cf70d-7b09-4b32-a566-cbf03278b6c3'),
	(200004,'Captions!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/sample_images%2Ftony.jpeg?alt=media&token=54c48da9-7ca0-4464-8eb8-ac2d74ba8393'),
	(200005,'Wowie, another caption!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fsdfc.jpeg?alt=media&token=de04bc93-3b5c-4cc4-b92b-a9866f061407'),
	(200006,'Will the captions ever stop?', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fitachi2.png?alt=media&token=6419a9cd-b540-4b1f-9df1-651eb7942c8d'),
	(200007,'Yep. This is the last caption.', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fdefault%20(1).jpg?alt=media&token=aace2bea-5bf6-4d66-8e52-4ceee6703c66'),
	(200010,'The Hypnotoad says to give us an A', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2FHypnotoad.gif?alt=media&token=cb3cd8b8-85a0-44fa-9e6b-c90d0c766d10'),
	(200001,'Lorem ipsum', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fbunny.jpg?alt=media&token=e8db5575-6384-4134-81d7-ff399d456d1b'),
	(200002,'Improve your goldfish''s physical fitness by getting him a bicycle.', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fdefault%20(3).jpg?alt=media&token=711f9568-32f5-42b4-87d9-f18b29c018e5'),
	(200003,'Excitement!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fdefault%20(2).jpg?alt=media&token=4d338bd7-7bd6-453c-8640-6aabe3d22ce1'),
	(200004,'The earth is far larger than the moon.', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fdefault.jpg?alt=media&token=15a38a64-cc98-47fe-a151-e414a5655ccd'),
	(200005,'Come on down!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fmorgan_freeman.jpg?alt=media&token=cd5201c6-7a59-4095-9f03-8e932953db16'),
	(200006,'100% pure!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fhubble-sees-the-wings-of-a-butterfly-the-twin-jet-nebula_20283986193_o_thumb.jpg?alt=media&token=231f4461-b713-430d-8b9f-5b4e118345be'),
	(200007,'May contain nuts!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2FPIA18033_medium.jpg?alt=media&token=4b5cb03e-5a59-4dd1-8385-0b5dd217730d'),
	(200008,'Limited edition!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Froy.jpg?alt=media&token=03294c26-c8e7-464d-a0f9-315c51082ebc'),
	(200009,'One of a kind!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fdownload.png?alt=media&token=6da1ea82-b402-482f-9108-ce4573c06caf'),
	(200000,'Holy cow, man!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Ftop-100-world-photos-influential-all-time-23-5835a67bef05f__880.jpg?alt=media&token=3bdbe4a6-aca2-4102-9b54-a68c39d6a0b4'),
	(200001,'Keyboard compatible!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Ftop-100-world-photos-influential-all-time-64-5835a6e982ce6__880.jpg?alt=media&token=43a953c1-d494-49fd-ab7d-207435318585'),
	(200002,'l33t!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Ftop-100-world-photos-influential-all-time-66-5835a6ee25f26__880.jpg?alt=media&token=2ae7027b-f89c-41a8-bf77-6b704296bc73'),
	(200003,'The bee''s knees!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Ftop-100-world-photos-influential-all-time-21-5835a67571c99__880.jpg?alt=media&token=0922026e-40ab-48ef-bf3a-dcca8b99f074'),
	(200004,'Open source!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2FIMG_4638.JPG?alt=media&token=921d0f1b-b15d-4f75-aed6-fbab4b946236'),
	(200005,'Not on Steam!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2FIMG_4647.JPG?alt=media&token=1f693fca-cc46-4575-9e95-0bf8e06293c8'),
	(200006,'90% bug free!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2FIMG_4640.JPG?alt=media&token=4b3d69a2-2929-4811-b069-bd148f292feb'),
	(200007,'Absolutely no memes!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2FIMG_4639.JPG?alt=media&token=61d080eb-5844-47be-9f04-29f2e2876ece'),
	(200008,'Try it!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fimages%20(2).jpg?alt=media&token=77f950e7-2a11-45e7-8ec5-3b83ca493fb8'),
	(200009,'Tell your friends!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Ff3109.jpg?alt=media&token=5953ec9f-a1a6-43b8-abcd-dcd550ab1f2f'),
	(200000,'Collaborate and listen!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fdownload1.jpg?alt=media&token=a57b2e92-90e5-4e6f-8f8d-78493ea83496'),
	(200001,'4815162342 lines of code!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fimages.jpg?alt=media&token=8e60445f-aca0-45d6-b097-715d07827b85'),
	(200002,'umop-apisdn!', 'https://firebasestorage.googleapis.com/v0/b/group5-inql.appspot.com/o/upload_images%2Fimages%20(1).jpg?alt=media&token=45249eaf-e302-4603-858a-c37571b639cf');

INSERT INTO db.Likes VALUES 
	(100000,300000),
	(100009,300000),
	(100001,300002),
	(100001,300003),
	(100004,300003),
	(100005,300004),
	(100000,300005),
	(100002,300006),
	(100002,300007),
	(100008,300007),
	(100006,300008),
	(100000,300010),
	(100009,300010),
	(100005,300009),
	(100003,300007);

INSERT INTO db.Tag VALUES 
	('friends',300001),
	('food',300000),
	('fun',300002),
	('food',300003),
	('longweekend',300003),
	('food',300004),
	('drinks',300005),
	('friends',300006),
	('workout',300007),
	('fitness',300007),
	('friends',300008),
	('food',300009),
	('drinks',300009),
	('fun',300009),
	('friends',300007),
	('#Test', 300010),
	('#HopeItWorks', 300010);

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
	('Finally! The last comment!','2023-02-05 00:00:00',100001,300006),
	('Commenting for testing purposes','2023-03-05 00:00', 100002, 300010),
	('I like this test post','2023-03-06 00:00', 100004, 300010);