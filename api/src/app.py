import os
import datetime
import cloudinary
from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db
from routes import api

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['DEBUG'] = True
app.config['ENV'] = 'development'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')

db.init_app(app)
Migrate(app, db)
CORS(app)
jwt = JWTManager(app)

cloudinary.config(
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'), 
    api_key = os.getenv('CLOUDINARY_CLOUD_API_KEY'), 
    api_secret = os.getenv('CLOUDINARY_CLOUD_API_SECRET'),
    secure = True
)

app.register_blueprint(api, url_prefix="/api")

if __name__ == '__main__':
    app.run()