from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import hashlib
import json
import mysql.connector

app = Flask(__name__)
CORS(app)               # Allows Apps from same origin to access this API

# Serve HTML instructions
@app.route('/')
def home():
    return render_template('index.html')

# POST content to Database to register a new user
@app.route('/register', methods=['POST'])
def register():
    newUser = request.json

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query = f'INSERT INTO User (fName, lName, town, gender, pw, email, dob) VALUES("{newUser["fName"]}", "{newUser["lName"]}", "{newUser["town"]}", "{newUser["gender"]}", "{newUser["pw"]}", "{newUser["email"]}", "{newUser["dob"]}")'
    print(query)

    try:
        cursor.execute(query)
        con.commit()
        cursor.close()
        con.close()

        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    except mysql.connector.Error as e:
        print("MYSQL EXECUTION ERROR: {}".format(e))
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}
        
# Send email and password to DB to see if desired user exists, and that credentials are valid
@app.route('/login', methods=['GET'])
def login():
    email = request.args.get('email')
    password = request.args.get('password')

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    cursor.execute(f'SELECT userID FROM User WHERE email="{email}" AND pw="{password}"')
    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 401, {'ContentType':'application/json'}

# Used to search for a single User out of all Users.
@app.route('/searchuser', methods=['GET'])
def searchuser():
    fName = request.args.get('fName')
    lName = request.args.get('lName')

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query = f'SELECT userID, fName, lName FROM User WHERE fName LIKE"{fName}%" AND lName LIKE "{lName}%"'

    cursor.execute(query)
    tuples = cursor.fetchall()

    return jsonify(tuples)

# Search for friends, out of User's _Existing_ friends
@app.route('/searchfriend', methods=['GET'])
def searchfriend():
    uid = request.args.get('uid')
    fName = request.args.get('fName')
    lName = request.args.get('lName')

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query = f'SELECT userID, fName, lName FROM User WHERE fName LIKE"{fName}%" AND lName LIKE "{lName}%" AND userID IN (SELECT friendID FROM Friends WHERE userID={uid})'

    cursor.execute(query)
    tuples = cursor.fetchall()

    return jsonify(tuples)

# Get reccomended friends and sort in descending order by number of mutual friends.
@app.route('/friendrec', methods=['GET'])
def friendrec():
    uid = request.args.get('uid')

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    #TODO: Needs to ensure that does not reccomend friends that user already has made
    query1 = f'CREATE VIEW {uid}mutuals AS (SELECT friendID FROM Friends WHERE userID IN (SELECT friendID FROM Friends WHERE userID={uid}))'
    query2 = f'SELECT userID, fName, lName, COUNT({uid}mutuals.friendID) FROM User INNER JOIN {uid}mutuals WHERE User.userID = {uid}mutuals.friendID GROUP BY userID ORDER BY COUNT({uid}mutuals.friendID) DESC;'

    cursor.execute(query1)
    cursor.execute(query2)
    tuples = cursor.fetchall()

    cursor.execute(f'DROP VIEW {uid}mutuals')

    return jsonify(tuples)

# Calculate contribution score for given user
@app.route('/contrib', methods=['GET'])
def contrib():
    uid = request.args.get('uid')

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query1 = f'CREATE VIEW {uid}contribution AS (SELECT COUNT(commentID) FROM Comment WHERE Comment.userID = {uid} GROUP BY Comment.commentID UNION (SELECT COUNT(photoID) FROM Photo WHERE albumID IN (SELECT albumID FROM Album WHERE userID = {uid})))'
    query2 = f'SELECT COUNT(*) FROM {uid}contribution'

    cursor.execute(query1)
    cursor.execute(query2)
    tuples = cursor.fetchall()

    cursor.execute(f'DROP VIEW {uid}contribution')

    return jsonify(tuples)

# Search for a user's album. Used in ensuring Album exists when posting photo, or when looking through users albums.
@app.route('/searchalbum', methods=['GET'])
def searchalbum():
    uid = request.args.get("uid")
    aName = request.args.get("name")

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    cursor.execute(f'SELECT albumID, name FROM Album WHERE name LIKE "%{aName}%" AND userID = {uid}')
    tuples = cursor.fetchall()

    return jsonify(tuples)

@app.route('/add', methods=['POST'])
def add():
    newEntry = request.json

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()
    
    if newEntry["target"] == 'photo':
         query = f'INSERT INTO Photo (albumID, caption, data) VALUES({newEntry["albumID"]}, "{newEntry["caption"]}", "{newEntry["data"]}")'
    elif newEntry["target"] == 'album':
        query = f'INSERT INTO Album (userID, name, dateCreated) VALUES({newEntry["userID"]}, "{newEntry["name"]}", "{newEntry["dateCreated"]}")'
    elif newEntry["target"] == 'friend':
        query = f'INSERT INTO Friends VALUES({newEntry["userID"]}, "{newEntry["friendID"]}", "{newEntry["dateFormed"]}")'
    elif newEntry["target"] == 'likes':
        query = f'INSERT INTO Likes VALUES({newEntry["userID"]}, "{newEntry["photoID"]}")'
    elif newEntry["target"] == 'comment':
        query = f'INSERT INTO Comment (content, dateCreated, userID, photoID) VALUES({newEntry["content"]}, {newEntry["dateCreated"]}, {newEntry["userID"]}, "{newEntry["photoID"]}")'
    else:
        print("SKILL ISSUE: User provided JSON not of correct format")
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

    try:
        cursor.execute(query)
        con.commit()
        cursor.close()
        con.close()

        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    except mysql.connector.Error as e:
        print("MYSQL EXECUTION ERROR: {}".format(e))
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}
    
@app.route('/removebyid', methods=['POST'])
def remove():
    data = request.json

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    if data["target"] == 'user':
        query = f'DELETE FROM User WHERE userID={data["id"]}'
    elif data["target"] == 'photo':
        query = f'DELETE FROM Photo WHERE photoID={data["id"]}'
    elif data["target"] == 'album':
        query = f'DELETE FROM Album WHERE albumID={data["id"]}'
    elif data["target"] == 'comment':
        query = f'DELETE FROM Comment WHERE albumID={data["id"]}'
    else:
        print("SKILL ISSUE: User provided JSON not of correct format")
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}
    
    try:
        cursor.execute(query)
        con.commit()
        cursor.close()
        con.close()

        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    except mysql.connector.Error as e:
        print("MYSQL EXECUTION ERROR: {}".format(e))
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

@app.route('/photobytag', methods=['GET'])
def photobytag():
    tagName = request.args.get("name")

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query = f'SELECT Photo.photoID, Photo.caption, Photo.data FROM Photo INNER JOIN Tag ON Photo.photoID = Tag.photoID WHERE Tag.name = "{tagName}"'

    cursor.execute(query)
    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}
    
@app.route('/trendingtags', methods=['GET'])
def trendingtags():
    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    # TODO: Not getting 10 results, need 2 fix
    cursor.execute('SELECT name, COUNT(name) FROM Tag GROUP BY name ORDER BY COUNT(name) DESC LIMIT 10')
    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 500, {'ContentType':'application/json'}

@app.route('/searchcom', methods=['GET'])
def searchcom():
    content = request.args.get("content")

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query1 = f'CREATE VIEW CommentSearch AS (SELECT userID FROM Comment WHERE content LIKE "%{content}%")'
    query2 = f'SELECTUser.fName, User.lName, COUNT(CommentSearch.userID) FROM User INNER JOIN CommentSearch ON User.userID = CommentSearch.userID GROUP BY fName, lName ORDER BY COUNT(CommentSearch.userID) DESC'

    cursor.execute(query1)
    cursor.execute(query2)
    tuples = cursor.fetchall()

    cursor.execute(f'DROP VIEW CommentSearch')

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

@app.route('/photorec', methods=['GET'])
def photorec():
    uid = request.args.get("uid")

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query1 = f'CREATE VIEW {uid}Photos AS (SELECT Photo.photoID AS pid FROM Photo INNER JOIN Album ON Photo.albumID = Album.albumID WHERE Album.userID = {uid})'
    query2 = f'CREATE VIEW {uid}Tags AS (SELECT Tag.name FROM Tag INNER JOIN Photo ON Tag.photoID = Photo.photoID WHERE Photo.photoID IN (SELECT pid FROM {uid}Photos) GROUP BY Tag.name ORDER BY COUNT(*) DESC LIMIT 5)'
    query3 = f'SELECT * FROM Photo WHERE photoID IN (SELECT Tag.photoID FROM Tag INNER JOIN {uid}Tags ON Tag.name = {uid}Tags.name) AND photoID NOT IN (SELECT pid FROM {uid}Photos) GROUP BY photoID ORDER BY COUNT(*) DESC LIMIT 50'

    cursor.execute(query1)
    cursor.execute(query2)
    cursor.execute(query3)
    tuples = cursor.fetchall()

    cursor.execute(f'DROP VIEW {uid}Tags')
    cursor.execute(f'DROP VIEW {uid}Photos')

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

@app.route('/recentphotos', methods=['GET'])
def recentphotos():
    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query = f'SELECT * FROM Photo ORDER BY photoID DESC LIMIT 50'

    cursor.execute(query)
    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 500, {'ContentType':'application/json'}

if __name__ == '__main__':
    app.run()

