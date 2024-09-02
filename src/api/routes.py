"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, TokenBlockedList, Contact, Payment, Event, Group
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
            first_name=body.get("first_name", ""),
            last_name=body.get("last_name", ""),
            age=body.get("age", ""),
            address=body.get("address", ""),
            email=body["email"],
            password=encrypted_password,
            is_active=True,
            paypal_username=body["paypal_username"]
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
        return jsonify({"token": token, "user":user.serialize()}), 200
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

#--------------------------ADD_CONTACT--------------------------------------------------------------------
@api.route('/contact', methods=['POST'])
@jwt_required()
def add_contact():
    user_id = get_jwt_identity()
    body = request.get_json()
    if "username" not in body:
        return jsonify({"error": "Username is required"}), 400
    try:
        contact = Contact(username=body["username"], user_id=user_id)
        if "fullname" in body:
            contact.fullname = body["fullname"]
        if "email" in body:
            contact.email = body["email"]
        if "paypal_username" in body:
            contact.paypal_username = body["paypal_username"]
        db.session.add(contact)
        db.session.commit()
        return jsonify({"message": "Contact added successfully", "contact": contact.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with this username already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while adding contact", "details": str(e)}), 500
#--------------------------GET_CONTACTS--------------------------------------------------------------------
@api.route('/contact', methods=['GET'])
@jwt_required()
def get_contacts():
    user_id = get_jwt_identity()
    try:
        contacts = Contact.query.filter_by(user_id=user_id).all()
        contact_list = [contact.serialize() for contact in contacts]
        return jsonify({"contacts": contact_list}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred while fetching contacts", "details": str(e)}), 500
#--------------------------GET_CONTACT_DATABASE--------------------------------------------------------------------
@api.route('/search', methods=['GET'])
@jwt_required()
def get_single_user():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400
    try:
        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user": user.serialize()})
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
#--------------------------DELETE_CONTACT--------------------------------------------------------------------
@api.route('/contact/<int:contactId>', methods=['DELETE'])
@jwt_required()
def delete_contact(contactId):
    user_id = get_jwt_identity()
    try:
        contact_db = Contact.query.filter_by(id=contactId, user_id=user_id).first()
        if not contact_db:
            return jsonify({"error": "Contact not found or you don't have permission to delete it"}), 404
        db.session.delete(contact_db)
        db.session.commit()
        return jsonify({"message": "Contact deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
    
#--------------------------PAYMENT GET-----------------------------------------------------------------

@api.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    user_id = get_jwt_identity()
    payments = Payment.query.filter_by(user_id=user_id).all()
    payments_list = []
    for payment in payments:
        payments_list.append({
            'id': payment.id,
            'amount': payment.amount,
            'user_id': payment.user_id,
            'group_id': payment.group_id,
            'paypal_username': payment.paypal_username,
        })
    return jsonify(payments_list), 200

#--------------------------PAYMENT GET BY ID-----------------------------------------------------------------
    

@api.route('/payments/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    
    payment = Payment.query.get(payment_id)
    if payment is None:
        return jsonify({'error': 'Payment not found'}), 404
    # payment_date = payment.date.astimezone(timezone('UTC'))  # Convertir a la zona horaria neutra
    return jsonify({
        'id': payment.id,
        # 'date': payment_date.strftime('%d-%m-%Y %H:%M:%S'),
        'amount': payment.amount,
        'user_id': payment.user_id,
        'group_id': payment.group_id,
        'paypal_username': payment.paypal_username,
    }), 200


#-------------------------- POST PAYMENT-----------------------------------------------------------------

@api.route('/payments', methods=['POST'])
@jwt_required()
def create_payment():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'group_id' in data:
        group_id = data['group_id']
        paypal_username = None
        if 'event_id' not in data:
            return jsonify({"error": "Event ID is required if group is specified"}), 400
        event_id = data['event_id']
    else:
        group_id = None
        if 'paypal_username' not in data:
            return jsonify({"error": "Paypal username is required if no group is specified"}), 400
        paypal_username = data['paypal_username']
        event_id = None

    # Verificar que el grupo y el evento existan
    if group_id:
        group = Group.query.get(group_id)
        if group is None:
            return jsonify({"error": "Group not found"}), 404
        event = Event.query.get(event_id)
        if event is None or event.group_id != group_id:
            return jsonify({"error": "Event not found or does not belong to group"}), 404

    payment = Payment(
        amount=data['amount'],
        user_id=user_id,
        group_id=group_id,
        event_id=event_id,
        paypal_username=paypal_username
    )

    if paypal_username:
        recipient_user = User.query.filter_by(paypal_username=paypal_username).first()
        if not recipient_user:
            return jsonify({"error": "Recipient not found"}), 404

    db.session.add(payment)
    db.session.commit()
    return jsonify(payment.serialize()), 201





""" @api.route('/', methods=['GET'])
@jwt_required()
def name_function():
    pass """