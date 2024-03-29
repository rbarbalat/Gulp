from flask_wtf import FlaskForm
from wtforms import StringField, URLField, FloatField
from wtforms.validators import URL, DataRequired, ValidationError, Length, NumberRange, Optional
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.api.aws import ALLOWED_EXTENSIONS
from app.models import Review

def integer_one_through_five(form, field):
    """
    Returns a validation error if a user's submission is not in [0,1,2,3,4,5]
    """
    rating = field.data
    if rating not in [1, 2, 3, 4, 5]:
        raise ValidationError('Star rating must be an integer between 1 and five')

class ReviewForm(FlaskForm):
    review = StringField("review", validators=[DataRequired(), Length(min=20, max=1000)])

    #can't use IntegerField b/c coerces inputs into integers before validator can check if it is in [1,2,3,4,5]
    rating = FloatField("rating", validators=[integer_one_through_five, DataRequired()])

    first = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    second = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    third = FileField("preview image", validators=[Optional(), FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
