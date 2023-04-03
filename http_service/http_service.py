from flask import Flask, request, jsonify
import json
import mysql.connector

app = Flask(__name__)

@app.route('/login', methods=['GET'])
def login():
    uid = request.args.get('uid')
    password = request.args.get('password')

    print(uid)
    print(password)

    con = mysql.connector.connect(user='root', password='password', host='localhost', database='db')
    cursor = con.cursor()

    cursor.execute(f'SELECT userID, pw FROM User WHERE userID={uid} AND pw="{password}"')
    tuples = cursor.fetchall()

    return jsonify(tuples)

if __name__ == '__main__':
    app.run()

