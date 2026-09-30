import sys

with open('ui/lib/screens/login_screen.dart', 'r', encoding='utf-8') as f:
    text = f.read()

# Add _phoneError and _otpError variables
text = text.replace('bool _isLoading = false;', 'bool _isLoading = false;\n  String? _phoneError;\n  String? _otpError;')

old_send_otp = '''  void _sendOtp() {
    if (_phoneController.text.length < 10) return;
    setState(() => _otpSent = true);
  }'''
new_send_otp = '''  void _sendOtp() {
    setState(() { _phoneError = None; });
    if (_phoneController.text.length < 10) {
      setState(() { _phoneError = 'Please enter a valid 10-digit phone number'; });
      return;
    }
    setState(() => _otpSent = true);
  }'''.replace('None', 'null')
text = text.replace(old_send_otp, new_send_otp)

old_verify_otp = '''  void _verifyOtp() {
    if (_otpController.text.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context).t('login_otp_error'))),
      );
      return;
    }'''
new_verify_otp = '''  void _verifyOtp() {
    setState(() { _otpError = None; });
    if (_otpController.text.length < 4) {
      setState(() { _otpError = AppLocalizations.of(context).t('login_otp_error'); });
      return;
    }'''.replace('None', 'null')
text = text.replace(old_verify_otp, new_verify_otp)

text = text.replace("'login_phone_hint'),", "'login_phone_hint'),\n                          errorText: _phoneError,")
text = text.replace("hintText: '• • • •',", "hintText: '• • • •',\n                          errorText: _otpError,")
text = text.replace("controller: _phoneController,", "controller: _phoneController,\n                          onChanged: (val) { if (_phoneError != null) setState(() => _phoneError = null); },")
text = text.replace("controller: _otpController,", "controller: _otpController,\n                          onChanged: (val) { if (_otpError != null) setState(() => _otpError = null); },")

with open('ui/lib/screens/login_screen.dart', 'w', encoding='utf-8') as f:
    f.write(text)

with open('ui/lib/screens/register_screen.dart', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('bool _isDetectingLocation = false;', 'bool _isDetectingLocation = false;\n  String? _nameError;\n  String? _phoneError;\n  String? _cityError;\n  String? _otpError;')

# we will rewrite _sendOtp using regex to handle the multi-line snackbars safely
import re
pattern_send = r'void _sendOtp\(\)\s*\{.*?_otpSent = true\);\s*\}'
new_send = '''void _sendOtp() {
    setState(() {
      _nameError = null;
      _phoneError = null;
      _cityError = null;
    });
    
    bool hasError = false;
    if (_nameController.text.trim().isEmpty) {
      setState(() => _nameError = 'Please enter your full name');
      hasError = true;
    }
    if (_phoneController.text.length != 10) {
      setState(() => _phoneError = 'Please enter a valid 10-digit phone number');
      hasError = true;
    }
    if (_selectedCity == null || _selectedCity!.isEmpty) {
      setState(() => _cityError = 'Please select your city');
      hasError = true;
    }
    
    if (hasError) return;
    
    setState(() => _otpSent = true);
  }'''
text = re.sub(pattern_send, new_send, text, flags=re.DOTALL)

pattern_verify = r'void _verifyOtp\(\)\s*\{.*?setState\(\(\) => _isLoading = true\);'
new_verify = '''void _verifyOtp() {
    setState(() => _otpError = null);
    if (_otpController.text.length < 4) {
      setState(() => _otpError = 'Please enter the 4-digit OTP');
      return;
    }
    
    setState(() => _isLoading = true);'''
text = re.sub(pattern_verify, new_verify, text, flags=re.DOTALL)

text = text.replace("AppLocalizations.of(context).t('reg_name_hint')),", "AppLocalizations.of(context).t('reg_name_hint')),\n                          errorText: _nameError,")
text = text.replace("controller: _nameController,", "controller: _nameController,\n                          onChanged: (val) { if (_nameError != null) setState(() => _nameError = null); },")

text = text.replace("AppLocalizations.of(context).t('login_phone_hint')),", "AppLocalizations.of(context).t('login_phone_hint')),\n                          errorText: _phoneError,")
text = text.replace("controller: _phoneController,", "controller: _phoneController,\n                          onChanged: (val) { if (_phoneError != null) setState(() => _phoneError = null); },")

text = text.replace("AppLocalizations.of(context).t('reg_city_hint')),", "AppLocalizations.of(context).t('reg_city_hint')),\n                                errorText: _cityError,")

text = text.replace("hintText: '• • • •',", "hintText: '• • • •',\n                          errorText: _otpError,")
text = text.replace("controller: _otpController,", "controller: _otpController,\n                          onChanged: (val) { if (_otpError != null) setState(() => _otpError = null); },")

# Remove auto-detect suffixIcon from register screen
suffix_icon_pattern = r'suffixIcon: _isDetectingLocation.*?\}\),\s*\),'
text = re.sub(suffix_icon_pattern, '', text, flags=re.DOTALL)

with open('ui/lib/screens/register_screen.dart', 'w', encoding='utf-8') as f:
    f.write(text)

print("done ui inline errors script")
