from flask import Flask, request, jsonify, render_template
import hashlib
import json
import mysql.connector

app = Flask(__name__)

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

@app.route('/addalbum', methods=['POST'])
def addalbum():
    newAlbum = request.json

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query = f'INSERT INTO Album (userID, name, dateCreated) VALUES({newAlbum["userID"]}, "{newAlbum["name"]}", "{newAlbum["dateCreated"]}")'

    try:
        cursor.execute(query)
        con.commit()
        cursor.close()
        con.close()

        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    except mysql.connector.Error as e:
        print("MYSQL EXECUTION ERROR: {}".format(e))
        return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

# Search for a user's album. Used in ensuring Album exists when posting photo, or when looking through users albums.
@app.route('/searchalbum', methods=['GET'])
def searchalbum():
    uid = request.args.get('uid')
    aName = request.args.get("albumName")

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    cursor.execute(f'SELECT albumID, name FROM Album WHERE name LIKE "%{aName}%" AND userID = {uid}')
    tuples = cursor.fetchall()

    return jsonify(tuples)


if __name__ == '__main__':
    app.run(host='0.0.0.0')

