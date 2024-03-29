from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import URL, DataRequired, ValidationError, Length, Optional
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.api.aws import ALLOWED_EXTENSIONS
from app.models import Business
from app.forms.bus_form import tag_two, tag_three

def bus_name_exists(form, field):
    """
    Returns a validation error if a user tries to create a Business with
    a name that is already in use
    """
    name = field.data
    bus = Business.query.filter(Business.name == name).first()
    if bus:
        raise ValidationError('Business name is already in use.')

class EditBusForm(FlaskForm):
    # bus_name_exists validator was blocking edits of an existing business with an unchanged name on the create bus form
    # b/c it already exists in the db, moved that check inside the edit route function
    # and made a separate form
    name = StringField("name", validators=[DataRequired(), Length(min=3, max=20)], )
    description = StringField("description", validators=[DataRequired(), Length(min=20, max=700)] )
    address = StringField("address", validators=[DataRequired(), Length(min=4, max=30)] )
    city = StringField("state", validators=[DataRequired(), Length(min=2, max=15)] )
    state = StringField("state", validators=[DataRequired(), Length(min=2, max=15)] )

    tag_one = StringField("tag_one", validators=[DataRequired(), Length(min=3, max=13)] )
    tag_two = StringField("tag_two", validators=[DataRequired(), tag_two, Length(min=3, max=13)] )
    tag_three = StringField("tag_three", validators=[DataRequired(), tag_three, Length(min=3, max=13)] )

    #prev_url to optional here, mandatory in the create bus form
    prev_url = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])

    first = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    second = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    third = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
