from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import base64
import hashlib
import json
import datetime
import mysql.connector
import firebase_admin
from firebase_admin import credentials, storage, exceptions

app = Flask(__name__)
CORS(app)               # Allows Apps from same origin to access this API

# Initialize Firebase SDK
cred = credentials.Certificate('./group5-inql-firebase-adminsdk-qo918-539ca228b3.json')
firebase_app = firebase_admin.initialize_app(cred, {
    'storageBucket': 'group5-inql.appspot.com'
})
firebase_storage = storage.bucket('group5-inql.appspot.com', app=firebase_app)

# Serve HTML instructions
@app.route('/')
def home():
    return render_template('index.html')

# POST content to Database to register a new user
@app.route('/register', methods=['POST'])
def register():
    newUser = request.json

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
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

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
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

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT userID, fName, lName FROM User WHERE fName LIKE"{fName}%" AND lName LIKE "{lName}%"'

    cursor.execute(query)
    tuples = cursor.fetchall()

    return jsonify(tuples)

@app.route('/userbyid', methods=['GET'])
def userbyid():
    uid = request.args.get('userID')

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT * FROM User WHERE userID = "{uid}"'

    cursor.execute(query)
    tuples = cursor.fetchall()

    return jsonify(tuples)

# Search for friends, out of User's _Existing_ friends
@app.route('/searchfriend', methods=['GET'])
def searchfriend():
    uid = request.args.get('userID')
    fName = request.args.get('fName')
    lName = request.args.get('lName')

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT userID, fName, lName FROM User WHERE fName LIKE"{fName}%" AND lName LIKE "{lName}%" AND userID IN (SELECT friendID FROM Friends WHERE userID={uid})'

    cursor.execute(query)
    tuples = cursor.fetchall()

    return jsonify(tuples)

# Get reccomended friends and sort in descending order by number of mutual friends.
@app.route('/friendrec', methods=['GET'])
def friendrec():
    uid = request.args.get('userID')

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    #TODO: Needs to ensure that does not reccomend friends that user already has made
    query1 = f'CREATE VIEW {uid}mutuals AS (SELECT friendID FROM Friends WHERE userID IN (SELECT friendID FROM Friends WHERE userID={uid}) AND friendID != {uid})'
    query2 = f'SELECT userID, fName, lName, COUNT({uid}mutuals.friendID) FROM User INNER JOIN {uid}mutuals WHERE User.userID = {uid}mutuals.friendID GROUP BY userID ORDER BY COUNT({uid}mutuals.friendID) DESC'

    cursor.execute(query1)
    cursor.execute(query2)
    tuples = cursor.fetchall()

    cursor.execute(f'DROP VIEW {uid}mutuals')

    return jsonify(tuples)

# Calculate contribution score for given user
@app.route('/contrib', methods=['GET'])
def contrib():
    uid = request.args.get('userID')

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT userID, SUM(total_count) as contrib_score FROM (SELECT userID, COUNT(*) as total_count FROM Comment  WHERE userID = {uid} GROUP BY userID UNION SELECT Album.userID, COUNT(*) as total_count FROM Photo JOIN Album ON Photo.albumID = Album.albumID WHERE Album.userID = {uid} GROUP BY Album.userID) as contrib_totals GROUP BY userID'

    cursor.execute(query)
    tuples = cursor.fetchall()

    return jsonify(tuples)

@app.route('/topcontrib', methods=['GET'])
def topcontrib():

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT contrib_totals.userID, User.fName, User.lName, SUM(total_count) as contrib_score, User.email FROM (SELECT userID, COUNT(*) as total_count FROM Comment GROUP BY userID UNION SELECT Album.userID, COUNT(*) as total_count FROM Photo JOIN Album ON Photo.albumID = Album.albumID GROUP BY Album.userID) as contrib_totals JOIN User ON contrib_totals.userID = User.userID GROUP BY contrib_totals.userID ORDER BY contrib_score DESC LIMIT 10'

    cursor.execute(query)
    tuples = cursor.fetchall()

    return jsonify(tuples)

# Search for a user's album. Used in ensuring Album exists when posting photo, or when looking through users albums.
@app.route('/searchalbum', methods=['GET'])
def searchalbum():
    uid = request.args.get("userID")
    aName = request.args.get("name")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    cursor.execute(f'SELECT albumID, name FROM Album WHERE name LIKE "%{aName}%" AND userID = {uid}')
    tuples = cursor.fetchall()

    return jsonify(tuples)

@app.route('/add', methods=['POST'])
def add():
    try:
        # DEBUG
        print(request.headers)
        # DEBUG
        print(request.json)
        target = request.form.get('target') if request.form else request.json.get('target')
        if target is None:
            raise ValueError('target not found in request body')

        con = mysql.connector.connect(user='root', password='password', host='database', database='db')
        cursor = con.cursor()
        
        # DEBUG
        print("It's fine 1")

        if target == 'photo':
            # DEBUG
            print("It's fine 2")
            albumID = request.json.get('albumID')
            # DEBUG
            print("It's fine 3")
            caption = request.json.get('caption')
            # DEBUG
            print("It's fine 4")
            data = request.json.get('data')

            # Store the Firebase URL in the MySQL database
            query = f"INSERT INTO Photo (albumID, caption, data) VALUES({albumID}, '{caption}', '{data}')"
            # DEBUG
            print("It's fine 5")
        elif target == 'album':
            newEntry = request.json
            query = f"INSERT INTO Album (userID, name, dateCreated) VALUES({newEntry['userID']}, '{newEntry['name']}', '{newEntry['dateCreated']}')"
        elif target == 'friend':
            newEntry = request.json
            query = f"INSERT INTO Friends VALUES({newEntry['userID']}, '{newEntry['friendID']}', '{newEntry['dateFormed']}')"
        elif target == 'likes':
            newEntry = request.json
            query = f"INSERT INTO Likes VALUES({newEntry['userID']}, {newEntry['photoID']})"
        elif target == 'comment':
            newEntry = request.json
            query = f"INSERT INTO Comment (content, dateCreated, userID, photoID) VALUES('{newEntry['content']}', '{newEntry['dateCreated']}', {newEntry['userID']}, {newEntry['photoID']})"
        elif target == 'tag':
            newEntry = request.json
            query = f"INSERT INTO Tag (name, photoID) VALUES ('{newEntry['name']}', {newEntry['photoID']})"
        else:
            print("SKILL ISSUE: User provided JSON not of correct format")
            return jsonify(success=False), 400

        try:
            cursor.execute(query)
            con.commit()
            cursor.close()
            con.close()

            return jsonify(success=True), 200
        except mysql.connector.Error as e:
            # DEBUG
            print("HERE 2")
            print("MYSQL EXECUTION ERROR: {}".format(e))
            return jsonify(success=False, error=str(e)), 400
    except Exception as e:
        # DEBUG
        print("HERE 1")
        print(f"Error processing request: {e}")
        return jsonify(success=False, error=str(e)), 400

    
@app.route('/removebyid', methods=['POST'])
def removebyid():
    data = request.json

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
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
    tagNames = request.args.get("names")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    allNames = tagNames.split()
    subQueries = [None] * len(allNames)

    for i, name in enumerate(allNames):
        subQueries[i] = f'SELECT Tag.photoID, COUNT(*) AS num FROM Photo JOIN Tag ON Photo.photoID = Tag.photoID WHERE Tag.name LIKE "%{allNames[i]}%" GROUP BY Tag.photoID'
        print(subQueries[i])

    masterQuery = f'SELECT total_matches.photoID, Photo.caption, Photo.data, SUM(num), Album.userID FROM ('

    for i, q in enumerate(subQueries):
        masterQuery += q
        if i != len(subQueries) - 1:
            masterQuery += f' UNION ALL '


    masterQuery += f') AS total_matches JOIN (Photo JOIN Album ON Photo.albumID = Album.albumID) ON total_matches.photoID = Photo.photoID GROUP BY total_matches.photoID ORDER BY SUM(num) DESC'

    cursor.execute(masterQuery)
    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 200, {'ContentType':'application/json'}


@app.route('/myphotosbytag', methods=['GET'])
def myphotobytag():
    uid = request.args.get("userID")
    tagName = request.args.get("name")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query1 = f'CREATE VIEW {uid}Photos AS (SELECT Photo.photoID AS pid, Photo.caption AS cap, Photo.data AS dat FROM Photo INNER JOIN Album ON Photo.albumID = Album.albumID WHERE Album.userID = {uid})'
    query2 = f'SELECT {uid}Photos.pid, {uid}Photos.cap, {uid}Photos.dat FROM {uid}Photos INNER JOIN Tag ON {uid}Photos.pid = Tag.photoID WHERE Tag.name = "{tagName}"'

    cursor.execute(query1)
    cursor.execute(query2)
    tuples = cursor.fetchall()

    cursor.execute(f'DROP VIEW {uid}Photos')

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

@app.route('/photobyuser', methods=['GET'])
def photobyuser():
    uid = request.args.get("userID")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT Photo.photoID, Photo.caption, Photo.data, User.fName, User.lName FROM Photo INNER JOIN (Album INNER JOIN User ON Album.userID = User.userID) ON Photo.albumID = Album.albumID WHERE Album.userID = {uid}'

    cursor.execute(query)
    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

@app.route('/photobyalbum', methods=['GET'])
def photobyalbum():
    aid = request.args.get("albumID")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT Photo.photoID, Photo.caption, Photo.data, Album.userID, User.fName, User.lName FROM Photo INNER JOIN (Album INNER JOIN User ON Album.userID = User.userID) ON Photo.albumID = Album.albumID WHERE Album.albumID = {aid}'

    cursor.execute(query)
    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}
    
@app.route('/trendingtags', methods=['GET'])
def trendingtags():
    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
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

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query1 = f'CREATE VIEW CommentSearch AS (SELECT userID FROM Comment WHERE content LIKE "%{content}%")'
    query2 = f'SELECT User.fName, User.lName, COUNT(CommentSearch.userID) FROM User INNER JOIN CommentSearch ON User.userID = CommentSearch.userID GROUP BY fName, lName ORDER BY COUNT(CommentSearch.userID) DESC'

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
    uid = request.args.get("userID")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query1 = f'CREATE VIEW {uid}Photos AS (SELECT Photo.photoID AS pid FROM Photo INNER JOIN Album ON Photo.albumID = Album.albumID WHERE Album.userID = {uid})'
    query2 = f'CREATE VIEW {uid}Tags AS (SELECT Tag.name FROM Tag INNER JOIN Photo ON Tag.photoID = Photo.photoID WHERE Photo.photoID IN (SELECT pid FROM {uid}Photos) GROUP BY Tag.name ORDER BY COUNT(*) DESC LIMIT 5)'
    query3 = f'SELECT Photo.photoID, Photo.albumID, Photo.caption, Photo.data, Album.userID, User.fName, User.lName FROM Photo INNER JOIN (Album INNER JOIN User ON Album.userID = User.userID) ON Photo.albumID = Album.albumID WHERE Photo.photoID IN (SELECT Tag.photoID FROM Tag INNER JOIN {uid}Tags ON Tag.name = {uid}Tags.name) AND Photo.photoID NOT IN (SELECT pid FROM {uid}Photos) GROUP BY photoID ORDER BY COUNT(*) DESC LIMIT 50'

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
    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT Photo.photoID, Photo.caption, Photo.data, Photo.albumID, Album.userID FROM Photo INNER JOIN Album On Photo.albumID = Album.albumID ORDER BY photoID DESC LIMIT 50'

    cursor.execute(query)
    tuples = cursor.fetchall()

    if tuples:
        # return the tuples with image URL from Firebase Storage
        encoded_tuples = []
        for t in tuples:
            if t[3] is not None:
                encoded_tuple = list(t)
                # Get the download URL of the file from Firebase Storage
                try:
                    firebase_storage = storage.bucket().blob(encoded_tuple[2])
                    firebase_url = firebase_storage.generate_signed_url(datetime.timedelta(seconds=300), method='GET')
                except exceptions.FirebaseError as e:
                    print(f"Failed to get download URL from Firebase Storage: {e}")
                    return jsonify(success=False), 500
                # Store the Firebase URL in the tuple
                encoded_tuple[3] = firebase_url
                encoded_tuples.append(encoded_tuple)

        # return the tuples as a JSON response
        return jsonify(encoded_tuples)
    else:
        return json.dumps({'success':False}), 500, {'ContentType':'application/json'}


@app.route('/numlikes', methods=['GET'])
def numlike():
    pid = request.args.get("photoID")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT COUNT(*) FROM Likes WHERE photoID={pid}'

    cursor.execute(query)

    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

@app.route('/wholikes', methods=['GET'])
def wholiked():
    pid = request.args.get("photoID")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT User.userID, User.fName, User.lName FROM User INNER JOIN Likes ON User.userID = Likes.userID WHERE Likes.photoID={pid}'

    cursor.execute(query)

    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}
    
@app.route('/justposted', methods=['GET'])
def justposted():
    uid = request.args.get("userID")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT Photo.photoID FROM Photo JOIN Album ON Photo.albumID = Album.albumID WHERE Album.userID={uid} GROUP BY Photo.photoID ORDER BY Photo.photoID DESC LIMIT 1'

    cursor.execute(query)

    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}
    
# Checks if two users are friends
@app.route('/isfriend', methods=['GET'])
def isfriend():
    uid = request.args.get('userID', type=int)
    cid = request.args.get('checkID', type=int)

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT * FROM db.Friends WHERE userID = %s AND friendID = %s' 
    cursor.execute(query, (uid, cid))
    result = cursor.fetchone()

    cursor.close()
    con.close()

    if result:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 200
    
@app.route('/combyphoto', methods=['GET'])
def combyphoto():
    pid = request.args.get("photoID")

    con = mysql.connector.connect(user='root', password='password', host='database', database='db')
    cursor = con.cursor()

    query = f'SELECT Comment.commentID, Comment.content, Comment.userID FROM Comment WHERE Comment.photoID = {pid};'

    cursor.execute(query)

    tuples = cursor.fetchall()

    if(tuples):
        return jsonify(tuples)
    else:
        return json.dumps({'success':False}), 200, {'ContentType':'application/json'}

if __name__ == '__main__':
    app.run(host="0.0.0.0", threaded=False)

