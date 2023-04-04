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
    uid = request.args.get('email')
    password = request.args.get('password')

    print(uid)
    print(password)

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    cursor.execute(f'SELECT userID, pw FROM User WHERE email="{uid}" AND pw="{password}"')
    tuples = cursor.fetchall()

    if(tuples):
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    else:
        return json.dumps({'success':False}), 401, {'ContentType':'application/json'}

if __name__ == '__main__':
    app.run()

