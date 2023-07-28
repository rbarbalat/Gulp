from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length

class ReplyForm(FlaskForm):
    reply = StringField("reply", validators=[DataRequired(), Length(min=3, max=1000)])
