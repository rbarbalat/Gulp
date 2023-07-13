from flask_wtf import FlaskForm
from wtforms import StringField, URLField, IntegerField
from wtforms.validators import URL, DataRequired, ValidationError, Length, NumberRange, Optional
from flask_wtf.file import FileField, FileAllowed, FileRequired
# from app.api.aws import ALLOWED_EXTENSIONS
from app.models import Review

class ReviewForm(FlaskForm):
    review = StringField("description", validators=[DataRequired(), Length(min=20, max=2000)])
    rating = IntegerField("description", validators=[DataRequired(), NumberRange(min=0, max=5)])
    first = StringField("image", validators=[Optional(), URL()])
    second = StringField("image", validators=[Optional(), URL()])
    third = StringField("image", validators=[Optional(), URL()])
