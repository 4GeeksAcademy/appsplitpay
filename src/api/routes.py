"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, TokenBlockedList, Contact, Group, GroupMember
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
    return jsonify({"msg":"user added correctly"})


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
    
    contact = Contact(username=body["username"], user_id = user_id)

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
    
    contacts = Contact.query.filter_by(user_id=user_id)
    contact_list = list(map(lambda contact: contact.serialize(), contacts))

    return jsonify(contact_list), 200


#--------------------------GET_SINGLE_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['GET'])
@jwt_required()
def get_single_contact(contactId):

    contact = Contact.query.get(contactId)

    if contact is None:
        return jsonify({"error":"Contact not found"}),404
    
    return jsonify({"Contact": contact.serialize()}),200


#--------------------------EDIT_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['PATCH'])
@jwt_required()
def edit_contact(contactId):
    
    contact_db = Contact.query.filter_by(id=contactId).first()
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


#--------------------------DELETE_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['DELETE'])
@jwt_required()
def delete_contact(contactId):

    contact_db = Contact.query.filter_by(id=contactId).first()
    if contact_db is None:
        return jsonify({"info":"Not Found"}), 404
    
    db.session.delete(contact_db)
    db.session.commit()
    return jsonify({"info":"User deleted"}), 200

#********************************************************************************************************
#*******************************************GROUPS*******************************************************
#********************************************************************************************************

#--------------------------CREATE_GROUP--------------------------------------------------------------------

@api.route('/group', methods=['POST'])
@jwt_required()
def create_group():
    user_id = get_jwt_identity()
    body = request.get_json()

    if "name" not in body:
        return jsonify({"msg": "Group name is required"}), 400
    
    if "member_ids" not in body or not body["member_ids"]:
        return jsonify({"msg": "At least one member is required"}), 400

    new_group = Group(name=body["name"], creator_id=user_id)
    db.session.add(new_group)
    db.session.flush()  # This assigns an ID to the new group

    # Add the creator as a member
    creator_member = GroupMember(group_id=new_group.id, user_id=user_id)
    db.session.add(creator_member)

    # Add other members
    for member_id in body["member_ids"]:
        if member_id != user_id:  # Avoid adding the creator twice
            member = GroupMember(group_id=new_group.id, user_id=member_id)
            db.session.add(member)

    db.session.commit()
    return jsonify({"msg": "Group created successfully", "group": new_group.serialize()}), 201

#--------------------------GET_GROUP--------------------------------------------------------------------

@api.route('/group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group(group_id):
    user_id = get_jwt_identity()
    group = Group.query.get(group_id)

    if not group:
        return jsonify({"msg": "Group not found"}), 404

    if user_id not in [member.id for member in group.members]:
        return jsonify({"msg": "You are not a member of this group"}), 403

    return jsonify(group.serialize()), 200
    
#--------------------------DELETE_GROUP--------------------------------------------------------------------

@api.route('/group/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    user_id = get_jwt_identity()
    group = Group.query.get(group_id)

    if not group:
        return jsonify({"msg": "Group not found"}), 404

    if group.creator_id != user_id:
        return jsonify({"msg": "Only the group creator can delete the group"}), 403

    db.session.delete(group)
    db.session.commit()

    return jsonify({"msg": "Group deleted successfully"}), 200


#--------------------------GET_MEMBERS_GROUP--------------------------------------------------------------------

@api.route('/groups', methods=['GET'])
@jwt_required()
def get_user_groups():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    groups = [group.serialize() for group in user.groups]
    return jsonify(groups), 200

#--------------------------ADD_GROUP_MEMBER---------------------------------------------------------------

@api.route('/group/<int:group_id>/members', methods=['POST'])
@jwt_required()
def add_group_member(group_id):
    user_id = get_jwt_identity()
    body = request.get_json()

    if "member_id" not in body:
        return jsonify({"msg": "Member ID is required"}), 400

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    if group.creator_id != user_id:
        return jsonify({"msg": "Only the group creator can add members"}), 403

    new_member = User.query.get(body["member_id"])
    if not new_member:
        return jsonify({"msg": "User not found"}), 404

    if new_member in group.members:
        return jsonify({"msg": "User is already a member of this group"}), 400

    group_member = GroupMember(group_id=group_id, user_id=body["member_id"])
    db.session.add(group_member)
    db.session.commit()

    return jsonify({"msg": "Member added successfully"}), 200

#--------------------------DELETE_GROUP_MEMBER---------------------------------------------------------------

@api.route('/group/<int:group_id>/members', methods=['DELETE'])
@jwt_required()
def delete_group_member(group_id):
    
    body = request.get_json()

    if "member_id" not in body:
        return jsonify({"msg": "Member ID is required"}), 400
    
    group_member = GroupMember(group_id=group_id, user_id=body["member_id"])

    db.session.delete(group_member)
    db.session.commit()

    return jsonify({"msg": "Member deleted successfully"}), 200


