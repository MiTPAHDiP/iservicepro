from django import forms

from siteservice.models import Memory, NewiPhone
from tgbot.models import Profile


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('external_id', 'name')
        widgets = {'name': forms.TextInput}


# class NewIphoneForm(forms.ModelForm):
#     # this the bit of custom CSS we want to add
#     style_text = "height:80px; overflow-y:scroll;"
#     # here we only need to define the field we want to be editable
#     categories = forms.ModelMultipleChoiceField(queryset=Memory.objects.all(), required=False)
