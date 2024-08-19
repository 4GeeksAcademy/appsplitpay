"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, TokenBlockedList, Contacts
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt

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

    if "username" not in body:
        return jsonify({"msg":"Username is required"}), 400
    
    if "email" not in body:
        return jsonify({"msg":"Email is required"}), 400
    
    if "password" not in body:
        return jsonify({"msg":"Password is required"}), 400
    
    encrypted_password = bcrypt.generate_password_hash(body["password"]).decode('utf-8')
    
    new_user = User(username = body["username"], email = body["email"], password = encrypted_password,  is_active = True)

    if "first_name" in body:
        new_user.first_name = body["first_name"]
    else:
        new_user.first_name = ""

    if "last_name" in body:
        new_user.last_name = body["last_name"]
    else:
        new_user.last_name = ""

    if "age" in body:
        new_user.age = body["age"]
    else:
        new_user.age = ""

    if "address" in body:
        new_user.address = body["address"]
    else:
        new_user.address = ""

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg":"user added correctly"}), 201


#--------------------------LOGIN------------------------------------------------------------------------

@api.route('/login', methods=['POST'])
def user_login():

    body = request.get_json()

    #1. Valido los datos de la peticion
    if "username" not in body:
        return jsonify({"msg":"Username is required"}), 400
    if "password" not in body:
        return jsonify({"msg":"Password is required"}), 400
    
    #2. Busco al usuario en la base de datos con el correo
    user = User.query.filter_by(username = body["username"]).first()

    #2.1 Si el usuario no aparece, retorna un error 404
    if user is None:
        return jsonify({"msg":"User not found"}), 404
    
    #3. Verifico el campo password del body con el password del usuario de la base de datos
    password_checked = bcrypt.check_password_hash(user.password, body["password"])

    #3.1 Si no se verifica se retorna un error de clave invalida 401
    if password_checked == False:
        return jsonify({"msg":"Invalid password"}), 401
    
    #4. Genero el token
    role = "admin"
    token = create_access_token(identity = user.id, additional_claims={"role":role})
    return jsonify({"token": token}), 200


#--------------------------LOGOUT-----------------------------------------------------------------------

@api.route('/logout', methods=['POST'])
@jwt_required()
def user_logout():
    jti = get_jwt()["jti"]
    token_blocked = TokenBlockedList(jti = jti)
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg":"Closed session"})


#--------------------------USER_INFO--------------------------------------------------------------------

@api.route('/user', methods=['GET'])
@jwt_required()
def user_info():
    user = get_jwt_identity()
    payload = get_jwt()
    return jsonify({"user": user, "role":payload["role"]})


#--------------------------EDIT_USER--------------------------------------------------------------------

@api.route('/user', methods=['PATCH'])
@jwt_required()
def edit_user():
    user_id = get_jwt_identity()
    
    user_db = User.query.filter_by(id=user_id).first()
    if user_db is None:
        return jsonify({"info":"Not Found"}), 404
    
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

    db.session.add(user_db)
    db.session.commit()
    return jsonify(user_db.serialize()), 200


#--------------------------DELETE_USER--------------------------------------------------------------------

@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():

    user_id = get_jwt_identity()

    print(user_id)

    user_db = User.query.filter_by(id=user_id).first()
    if user_db is None:
        return jsonify({"info":"Not Found"}), 404
    
    db.session.delete(user_db)
    db.session.commit()
    return jsonify({"info":"User deleted"}), 200


#********************************************************************************************************
#*****************************************CONTACTS*******************************************************
#********************************************************************************************************

#--------------------------ADD_CONTACT--------------------------------------------------------------------

@api.route('/contact', methods=['POST'])
@jwt_required()
def add_contact():

    user_id = get_jwt_identity()
    print(user_id)

    body = request.get_json()

    if "username" not in body:
        return jsonify({"msg":"Username is required"}), 400
    
    contact = Contacts(username=body["username"], user_id = user_id)

    if "fullname" in body:
        contact.fullname = body["fullname"]
    else:
        contact.fullname = ""

    if "email" in body:
        contact.email = body["email"]
    else:
        contact.email = ""

    if "address" in body:
        contact.address = body["address"]
    else:
        contact.address = ""

    db.session.add(contact)
    db.session.commit()
    return jsonify({"msg":"contact added correctly"}), 200


#--------------------------GET_CONTACTS--------------------------------------------------------------------

@api.route('/contact', methods=['GET'])
@jwt_required()
def get_contacts():

    user_id = get_jwt_identity()
    
    contacts = Contacts.query.filter_by(user_id=user_id)
    contact_list = list(map(lambda contact: contact.serialize(), contacts))

    return jsonify(contact_list), 200


#--------------------------GET_SINGLE_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['GET'])
@jwt_required()
def get_single_contact(contactId):

    contact = Contacts.query.get(contactId)

    if contact is None:
        return jsonify({"error":"User not found"}),404
    
    return jsonify({"Contact": contact.serialize()}),200


#--------------------------EDIT_USER--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['PATCH'])
@jwt_required()
def edit_contact(contactId):
    
    contact_db = Contacts.query.filter_by(id=contactId).first()
    if contact_db is None:
        return jsonify({"info":"Not Found"}), 404
    
    contact_body = request.get_json()
    
    if "fullname" in contact_body:
        contact_db.fullname = contact_body["fullname"]
    if "email" in contact_body:
        contact_db.email = contact_body["email"]
    if "address" in contact_body:
        contact_db.address = contact_body["address"]

    db.session.add(contact_db)
    db.session.commit()
    return jsonify(contact_db.serialize()), 200


#--------------------------DELETE_USER--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['DELETE'])
@jwt_required()
def delete_contact(contactId):

    contact_db = Contacts.query.filter_by(id=contactId).first()
    if contact_db is None:
        return jsonify({"info":"Not Found"}), 404
    
    db.session.delete(contact_db)
    db.session.commit()
    return jsonify({"info":"User deleted"}), 200

#********************************************************************************************************
#*******************************************GROUPS*******************************************************
#********************************************************************************************************

