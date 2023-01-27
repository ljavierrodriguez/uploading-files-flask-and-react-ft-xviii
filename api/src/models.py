from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    is_active = db.Column(db.Boolean(), default=False)
    avatar = db.Column(db.String(200), default="s/n")
    cv = db.Column(db.String(200), default="s/n")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "is_active": self.is_active,
            "avatar": self.avatar,
            "cv": self.cv
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Article(db.Model):
    __tablename__ = 'articles'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, unique=True)
    content = db.Column(db.Text(), nullable=False)
    date = db.Column(db.DateTime(), default=datetime.now)
    main_photo = db.Column(db.String(200), default="s/n")
    medias = db.relationship('Media', cascade="all, delete", backref="article")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "date": self.date,
            "main_photo": self.main_photo
        }

    def serialize_with_gallery(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "date": self.date,
            "main_photo": self.main_photo,
            "gallery": list(map(lambda media: media.serialize(), self.medias))
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Media(db.Model):
    __tablename__ = 'medias'
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(200), nullable=False)
    articles_id = db.Column(db.Integer, db.ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "articles_id": self.articles_id,
            "title": self.article.title
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
