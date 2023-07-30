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

class BusForm(FlaskForm):
    # the bus_name_exists was applied on edits as well...NEED TO CREATE A DIFFERENT
    # A SEPARATE EDIT FORM ON WHICH NAME IS NOT A FIELD

    name = StringField("name", validators=[DataRequired(), bus_name_exists, Length(min=3, max=20)], )
    description = StringField("description", validators=[DataRequired(), Length(min=20, max=700)] )
    address = StringField("address", validators=[DataRequired(), Length(min=4, max=30)] )
    city = StringField("state", validators=[DataRequired(), Length(min=2, max=15)] )
    state = StringField("state", validators=[DataRequired(), Length(min=2, max=15)] )

    tag_one = StringField("tag_one", validators=[DataRequired(), Length(min=3, max=15)] )
    tag_two = StringField("tag_two", validators=[DataRequired(), Length(min=3, max=15)] )
    tag_three = StringField("tag_three", validators=[DataRequired(), Length(min=3, max=15)] )

    # prev_url = StringField("preview image", validators=[DataRequired(), URL()])
    prev_url = FileField("preview image", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    first = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    second = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    third = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
