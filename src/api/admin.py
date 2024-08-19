  
import os
from flask_admin import Admin
from .models import db, User, TokenBlockedList, Contact, Payment, Group, GroupMember, Account, Transactions, PaymentStatus, Notification, Event, Comment, Tag
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Payment, db.session))
    admin.add_view(ModelView(Group, db.session))
    admin.add_view(ModelView(GroupMember, db.session))
    admin.add_view(ModelView(Account, db.session))
    admin.add_view(ModelView(Transactions, db.session))
    admin.add_view(ModelView(PaymentStatus, db.session))
    admin.add_view(ModelView(Notification, db.session))
    admin.add_view(ModelView(Event, db.session))
    admin.add_view(ModelView(Comment, db.session))
    admin.add_view(ModelView(Tag, db.session))
    admin.add_view(ModelView(TokenBlockedList, db.session))
    admin.add_view(ModelView(Contact, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))