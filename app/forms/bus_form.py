from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import URL, DataRequired, ValidationError, Length, Optional
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.api.aws import ALLOWED_EXTENSIONS
from app.models import Business

def bus_name_exists(form, field):
    """
    Returns a validation error if a user tries to create a Business with
    a name that is already in use
    """
    name = field.data
    bus = Business.query.filter(Business.name == name).first()
    if bus:
        raise ValidationError('Business name is already in use.')

def tag_two(form, field):
    tag_one = form.tag_one.data
    tag_two = field.data

    if tag_two.lower() == tag_one.lower():
        raise ValidationError("No repeat tags")

def tag_three(form, field):
    tag_one = form.tag_one.data
    tag_two = form.tag_two.data
    tag_three = field.data

    if tag_three.lower() in [tag_one.lower(), tag_two.lower()]:
        raise ValidationError("No repeat tags")

class BusForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), bus_name_exists, Length(min=3, max=20)], )
    description = StringField("description", validators=[DataRequired(), Length(min=20, max=700)] )
    address = StringField("address", validators=[DataRequired(), Length(min=4, max=30)] )
    city = StringField("state", validators=[DataRequired(), Length(min=2, max=15)] )
    state = StringField("state", validators=[DataRequired(), Length(min=2, max=15)] )

    tag_one = StringField("tag_one", validators=[DataRequired(), Length(min=3, max=13)] )
    tag_two = StringField("tag_two", validators=[DataRequired(), tag_two, Length(min=3, max=13)] )
    tag_three = StringField("tag_three", validators=[DataRequired(), tag_three, Length(min=3, max=13)] )

    prev_url = FileField("preview image", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    first = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    second = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    third = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
