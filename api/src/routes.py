from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from models import User, Article, Media
from werkzeug.security import generate_password_hash, check_password_hash
import cloudinary.uploader
import datetime

api = Blueprint("api", __name__)

@api.route('/')
def main():
    return jsonify({ "msg": "API REST Flask"}), 200


@api.route('/test')
def test():
    return jsonify({ "msg": "test route"}), 200

@api.route('/login', methods=['POST'])
def login():

    username = request.json.get('username')
    password = request.json.get('password')

    foundUser = User.query.filter_by(username=username).first()

    if not foundUser: return jsonify({ "error": "username/password are incorrects"}), 401
    if not check_password_hash(foundUser.password, password): return jsonify({ "error": "username/password are incorrects"}), 401

    expires = datetime.timedelta(days=3)
    access_token = create_access_token(identity=foundUser.id, expires_delta=expires)

    data = {
        "access_token": access_token,
        "user": foundUser.serialize()            
    }

    return jsonify(data), 200

@api.route('/register', methods=['POST'])
def register():

    username = request.form['username']
    password = request.form['password']
    avatar = None
    cv = None

    if 'avatar' in request.files:
        avatar = request.files['avatar']
    
    if 'cv' in request.files:
        cv = request.files['cv']

    resp_avatar = None
    resp_cv = None

    if avatar:
        resp_avatar = cloudinary.uploader.upload(avatar, folder="avatars")

    if cv:
        resp_cv = cloudinary.uploader.upload(cv, folder="cv")

    user = User()

    user.username = username
    user.password = generate_password_hash(password)
    if resp_avatar: user.avatar = resp_avatar['secure_url']
    if resp_cv: user.cv = resp_cv['secure_url']

    user.save()

    if user:

        expires = datetime.timedelta(days=3)
        access_token = create_access_token(identity=user.id, expires_delta=expires)

        data = {
            "access_token": access_token,
            "user": user.serialize()            
        }

        return jsonify(data), 201

@api.route('/articles', methods=['GET'])
def list_articles():

    articles = Article.query.all()
    articles = list(map(lambda article: article.serialize_with_gallery(), articles))

    return jsonify(articles), 200


@api.route('/articles', methods=['POST'])
def add_article():
    
    title = request.form['title']
    content = request.form['content']
    date = request.form['date']
    main_photo = None
    medias = None

    if 'main_photo' in request.files:
        main_photo = request.files['main_photo']

    if 'medias' in request.files:
        medias = request.files.getlist('medias')

    """ 
    print(title)
    print(content)
    print(main_photo)
    
    for x in medias:
        print(x.filename) 
    """

    resp_articles = None
    resp_medias = None

    if main_photo: 
        resp_articles = cloudinary.uploader.upload(main_photo, folder="articles")

    if medias:
        resp_medias = []
        for m in medias:
            resp = cloudinary.uploader.upload(m, folder="medias_articles")
            resp_medias.append(resp)

    article = Article()
    article.title = title
    article.content = content

    if resp_articles: article.main_photo = resp_articles['secure_url']

    if resp_medias:
        for rm in resp_medias:
            media = Media()
            media.image = rm['secure_url']
            article.medias.append(media)
    
    article.save()


    return jsonify({ "article": article.serialize_with_gallery()}), 200