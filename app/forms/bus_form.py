from flask_wtf import FlaskForm
from wtforms import StringField, URLField
from wtforms.validators import URL, DataRequired, ValidationError, Length, Optional
from flask_wtf.file import FileField, FileAllowed, FileRequired
# from app.api.aws import ALLOWED_EXTENSIONS
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


#pipenv install validators
#validators.url("b")
def image__is_valid_url(form, field):
    pass
    #image = field.data


class BusForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), bus_name_exists, Length(min=2, max=50)], )
    description = StringField("description", validators=[DataRequired(), Length(min=20, max=2000)] )
    prev_url = StringField("preview image", validators=[DataRequired(), URL()])
    address = StringField("address", validators=[DataRequired(), Length(min=2, max=100)] )
    city = StringField("state", validators=[DataRequired(), Length(min=2, max=50)] )
    state = StringField("state", validators=[DataRequired(), Length(min=2, max=50)] )
    #maybe should be URLField?
    first = StringField("image", validators=[Optional(), URL()])
    second = StringField("image", validators=[Optional(), URL()])
    third = StringField("image", validators=[Optional(), URL()])
    # third = StringField("image")
    # image = FileField("image", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
