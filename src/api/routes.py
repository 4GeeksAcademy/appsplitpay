"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, TokenBlockedList, Contact, Group, GroupMember, Event, Account
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import IntegrityError

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

    required_fields = ['username', 'email', 'password']
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
            address=body.get("address", "")
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

    if "username" not in body or "password" not in body:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        user = User.query.filter_by(username=body["username"]).first()

        if user is None:
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.check_password_hash(user.password, body["password"]):
            return jsonify({"error": "Invalid password"}), 401

        token = create_access_token(identity=user.id, additional_claims={"role": "admin"})
        return jsonify({"token": token}), 200
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

#********************************************************************************************************
#*****************************************CONTACTS*******************************************************
#********************************************************************************************************

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
        if "address" in body:
            contact.address = body["address"]

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

#--------------------------GET_SINGLE_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['GET'])
@jwt_required()
def get_single_contact(contactId):
    user_id = get_jwt_identity()
    
    try:
        contact = Contact.query.filter_by(id=contactId, user_id=user_id).first()
        
        if not contact:
            return jsonify({"error": "Contact not found or you don't have permission to access it"}), 404
        
        return jsonify({"contact": contact.serialize()}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------EDIT_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['PATCH'])
@jwt_required()
def edit_contact(contactId):
    user_id = get_jwt_identity()
    
    try:
        contact_db = Contact.query.filter_by(id=contactId, user_id=user_id).first()
        if not contact_db:
            return jsonify({"error": "Contact not found or you don't have permission to edit it"}), 404
        
        contact_body = request.get_json()
        
        if "fullname" in contact_body:
            contact_db.fullname = contact_body["fullname"]
        if "email" in contact_body:
            contact_db.email = contact_body["email"]
        if "address" in contact_body:
            contact_db.address = contact_body["address"]

        db.session.commit()
        return jsonify(contact_db.serialize()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
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
        return jsonify({"error": "Group name is required"}), 400
    
    if "member_ids" not in body or not body["member_ids"]:
        return jsonify({"error": "At least one member is required"}), 400

    try:
        new_group = Group(name=body["name"], creator_id=user_id)
        db.session.add(new_group)
        db.session.flush()

        creator_member = GroupMember(group_id=new_group.id, user_id=user_id)
        db.session.add(creator_member)

        for member_id in body["member_ids"]:
            if member_id != user_id:
                member = User.query.get(member_id)
                if not member:
                    return jsonify({"error": f"User with id {member_id} not found"}), 404
                member = GroupMember(group_id=new_group.id, user_id=member_id)
                db.session.add(member)

        db.session.commit()
        return jsonify({"message": "Group created successfully", "group": new_group.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A group with this name already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_GROUP--------------------------------------------------------------------

@api.route('/group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group(group_id):
    user_id = get_jwt_identity()
    
    try:
        group = Group.query.get(group_id)

        if not group:
            return jsonify({"error": "Group not found"}), 404

        # Check if the user is a member of the group
        if user_id not in [member.id for member in group.members]:
            return jsonify({"error": "You are not a member of this group"}), 403

        return jsonify(group.serialize()), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
    
#--------------------------DELETE_GROUP--------------------------------------------------------------------

@api.route('/group/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    user_id = get_jwt_identity()
    try:
        group = Group.query.get(group_id)

        if not group:
            return jsonify({"error": "Group not found"}), 404

        if group.creator_id != user_id:
            return jsonify({"error": "Only the group creator can delete the group"}), 403

        db.session.delete(group)
        db.session.commit()

        return jsonify({"message": "Group deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_MEMBERS_GROUP--------------------------------------------------------------------

@api.route('/groups', methods=['GET'])
@jwt_required()
def get_user_groups():
    user_id = get_jwt_identity()
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        groups = [group.serialize() for group in user.groups]
        return jsonify({"groups": groups}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------ADD_GROUP_MEMBER---------------------------------------------------------------

@api.route('/group/<int:group_id>/members', methods=['POST'])
@jwt_required()
def add_group_member(group_id):
    user_id = get_jwt_identity()
    body = request.get_json()

    if "member_id" not in body:
        return jsonify({"error": "Member ID is required"}), 400

    try:
        group = Group.query.get(group_id)
        if not group:
            return jsonify({"error": "Group not found"}), 404

        if group.creator_id != user_id:
            return jsonify({"error": "Only the group creator can add members"}), 403

        new_member = User.query.get(body["member_id"])
        if not new_member:
            return jsonify({"error": "User not found"}), 404

        if new_member in group.members:
            return jsonify({"error": "User is already a member of this group"}), 400

        group_member = GroupMember(group_id=group_id, user_id=body["member_id"])
        db.session.add(group_member)
        db.session.commit()

        return jsonify({"message": "Member added successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------DELETE_GROUP_MEMBER---------------------------------------------------------------

@api.route('/group/<int:group_id>/members', methods=['DELETE'])
@jwt_required()
def delete_group_member(group_id):
    user_id = get_jwt_identity()
    body = request.get_json()

    if "member_id" not in body:
        return jsonify({"error": "Member ID is required"}), 400
    
    try:
        group = Group.query.get(group_id)
        if not group:
            return jsonify({"error": "Group not found"}), 404

        if group.creator_id != user_id:
            return jsonify({"error": "Only the group creator can remove members"}), 403

        group_member = GroupMember.query.filter_by(group_id=group_id, user_id=body["member_id"]).first()
        if not group_member:
            return jsonify({"error": "User is not a member of this group"}), 404

        db.session.delete(group_member)
        db.session.commit()

        return jsonify({"message": "Member removed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#********************************************************************************************************
#*******************************************EVENTS*******************************************************
#********************************************************************************************************

#--------------------------CREATE_EVENT---------------------------------------------------------------

@api.route('/event', methods=['POST'])
@jwt_required()
def create_event():
    body = request.get_json()
    required_fields = ['type', 'payment_id', 'user_id', 'group_id']
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"{field.capitalize()} is required"}), 400

    try:
        new_event = Event(
            type=body["type"],
            payment_id=body["payment_id"],
            user_id=body["user_id"],
            group_id=body["group_id"]
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"message": "Event created successfully", "event": new_event.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "An event with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_EVENT---------------------------------------------------------------

@api.route('/event/<int:event_id>', methods=['GET'])
@jwt_required()
def get_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
        return jsonify(event.serialize()), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------EDIT_EVENT---------------------------------------------------------------

@api.route('/event/<int:event_id>', methods=['PATCH'])
@jwt_required()
def update_event(event_id):
    body = request.get_json()
    try:
        event_db = Event.query.get(event_id)
        if not event_db:
            return jsonify({"error": "Event not found"}), 404

        if "type" in body:
            event_db.type = body["type"]
        if "payment_id" in body:
            event_db.payment_id = body["payment_id"]
        if "user_id" in body:
            event_db.user_id = body["user_id"]
        if "group_id" in body:
            event_db.group_id = body["group_id"]

        db.session.commit()
        return jsonify(event_db.serialize()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "An event with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------DELETE_EVENT---------------------------------------------------------------

@api.route('/event/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    try:
        event_db = Event.query.get(event_id)
        if not event_db:
            return jsonify({"error": "Event not found"}), 404

        db.session.delete(event_db)
        db.session.commit()
        return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_ALL_EVENT---------------------------------------------------------------

@api.route('/events', methods=['GET'])
@jwt_required()
def get_all_events():
    try:
        events = Event.query.all()
        return jsonify([event.serialize() for event in events]), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#********************************************************************************************************
#*******************************************ACCOUNT*******************************************************
#********************************************************************************************************

#--------------------------CREATE_ACCOUNT---------------------------------------------------------------

@api.route('/account', methods=['POST'])
@jwt_required()
def create_account():
    body = request.get_json()
    required_fields = ['type', 'user_id']
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"{field.capitalize()} is required"}), 400

    try:
        new_account = Account(
            type=body["type"],
            user_id=body["user_id"]
        )
        db.session.add(new_account)
        db.session.commit()
        return jsonify({"message": "Account created successfully", "account": new_account.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "An account with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_ACCOUNT---------------------------------------------------------------

@api.route('/account/<int:account_id>', methods=['GET'])
@jwt_required()
def get_account(account_id):
    try:
        account = Account.query.get(account_id)
        if not account:
            return jsonify({"error": "Account not found"}), 404
        return jsonify(account.serialize()), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------EDIT_ACCOUNT---------------------------------------------------------------

@api.route('/account/<int:account_id>', methods=['PATCH'])
@jwt_required()
def update_account(account_id):
    body = request.get_json()
    try:
        account_db = Account.query.get(account_id)
        if not account_db:
            return jsonify({"error": "Account not found"}), 404

        if "type" in body:
            account_db.type = body["type"]
        if "user_id" in body:
            account_db.user_id = body["user_id"]

        db.session.commit()
        return jsonify(account_db.serialize()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "An account with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------DELETE_ACCOUNT---------------------------------------------------------------

@api.route('/account/<int:account_id>', methods=['DELETE'])
@jwt_required()
def delete_account(account_id):
    try:
        account_db = Account.query.get(account_id)
        if not account_db:
            return jsonify({"error": "Account not found"}), 404

        db.session.delete(account_db)
        db.session.commit()
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#********************************************************************************************************
#*******************************************COMMENTS*******************************************************
#********************************************************************************************************




""" @api.route('/', methods=['GET'])
@jwt_required()
def name_function():
    pass """