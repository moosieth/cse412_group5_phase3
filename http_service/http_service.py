from flask import Flask, request, jsonify
import hashlib
import json
import mysql.connector

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    newUser = request.json

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    query = f'INSERT INTO User VALUES({newUser["userID"]}, "{newUser["fName"]}", "{newUser["lName"]}", "{newUser["town"]}", "{newUser["gender"]}", "{newUser["pw"]}", "{newUser["email"]}", "{newUser["dob"]}")'
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

@app.route('/friendrec', methods=['GET'])
def friendrec():
    uid = request.args.get('uid')

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    #TODO: Needs to ensure that does not reccomend friends that user already has made
    #TODO: Organize by count of occurances!!!
    query = f'SELECT userID, fName, lName FROM User WHERE userID IN (SELECT friendID FROM Friends WHERE userID IN (SELECT friendID FROM Friends WHERE userID={uid})) AND userID!={uid}'

    cursor.execute(query)
    tuples = cursor.fetchall()

    return jsonify(tuples)

if __name__ == '__main__':
    app.run()

