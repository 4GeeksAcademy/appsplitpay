"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime
from pytz import timezone

from sqlalchemy.exc import IntegrityError
import os
import requests
import json

app = Flask(__name__)
bcrypt = Bcrypt(app)

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


#********************************************************************************************************
#********************************************USERS*******************************************************
#********************************************************************************************************

#--------------------------SIGNUP-OR-CREATE-USER--------------------------------------------------------

@api.route('/signup', methods=['POST'])
def user_signup():
    body = request.get_json()

    required_fields = ['username', 'email', 'password', 'paypal_username']
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"{field.capitalize()} is required"}), 400

    try:
        encrypted_password = bcrypt.generate_password_hash(body["password"]).decode('utf-8')
        new_user = User(
            username=body["username"],
            email=body["email"],
            password=encrypted_password,
            is_active=True,
            first_name=body.get("first_name", ""),
            last_name=body.get("last_name", ""),
            age=body.get("age", ""),
            address=body.get("address", ""),
            paypal_username=body.get("paypal_username", "")
        )

        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User added successfully", "user_id": new_user.id}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username or email already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------LOGIN------------------------------------------------------------------------

@api.route('/login', methods=['POST'])
def user_login():
    body = request.get_json()

    if "email" not in body or "password" not in body:
        return jsonify({"error": "email and password are required"}), 400

    try:
        user = User.query.filter_by(email=body["email"]).first()

        if user is None:
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.check_password_hash(user.password, body["password"]):
            return jsonify({"error": "Invalid password"}), 401

        token = create_access_token(identity=user.id, additional_claims={"role": "admin"})
        return jsonify({"token": token,"user":user.serialize()}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------LOGOUT-----------------------------------------------------------------------

@api.route('/logout', methods=['POST'])
@jwt_required()
def user_logout():
    try:
        jti = get_jwt()["jti"]
        token_blocked = TokenBlockedList(jti=jti)
        db.session.add(token_blocked)
        db.session.commit()
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred during logout", "details": str(e)}), 500

#--------------------------USER_INFO--------------------------------------------------------------------

@api.route('/user', methods=['GET'])
@jwt_required()
def user_info():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        payload = get_jwt()
        return jsonify({
            "user": user.serialize(),
            "role": payload.get("role", "user")
        }), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_USERS--------------------------------------------------------------------

@api.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        output = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'age': user.age,
                'address': user.address
            }
            output.append(user_data)
        return jsonify({'users': output}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500


#--------------------------EDIT_USER--------------------------------------------------------------------

@api.route('/user', methods=['PATCH'])
@jwt_required()
def edit_user():
    user_id = get_jwt_identity()
    
    try:
        user_db = User.query.filter_by(id=user_id).first()
        if user_db is None:
            return jsonify({"error": "User not found"}), 404
        
        user_body = request.get_json()
        
        if "first_name" in user_body:
            user_db.first_name = user_body["first_name"]
        if "last_name" in user_body:
            user_db.last_name = user_body["last_name"]
        if "email" in user_body:
            user_db.email = user_body["email"]
        if "age" in user_body:
            user_db.age = user_body["age"]
        if "address" in user_body:
            user_db.address = user_body["address"]

        db.session.commit()
        return jsonify(user_db.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while updating user", "details": str(e)}), 500

#--------------------------DELETE_USER--------------------------------------------------------------------

@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    user_id = get_jwt_identity()

    try:
        user_db = User.query.filter_by(id=user_id).first()
        if user_db is None:
            return jsonify({"error": "User not found"}), 404
        
        db.session.delete(user_db)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while deleting user", "details": str(e)}), 500








""" @api.route('/', methods=['GET'])
@jwt_required()
def name_function():
    pass """