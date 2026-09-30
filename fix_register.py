import sys
import re

with open('ui/lib/screens/register_screen.dart', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'fieldViewBuilder: \(context, fieldTextEditingController, fieldFocusNode, onFieldSubmitted\) \{.*?\},\s*optionsViewBuilder:'
new_fieldViewBuilder = '''fieldViewBuilder: (context, fieldTextEditingController, fieldFocusNode, onFieldSubmitted) {
                          return TextField(
                            controller: fieldTextEditingController,
                            focusNode: fieldFocusNode,
                            enabled: !_otpSent,
                            onChanged: (val) {
                              if (_cityError != null) setState(() => _cityError = null);
                            },
                            decoration: InputDecoration(
                              hintText: AppLocalizations.of(context).t('reg_city_hint'),
                              errorText: _cityError,
                              prefixIcon: const Icon(Icons.location_city_outlined, color: AppTheme.purpleMedium),
                              filled: true,
                              fillColor: AppTheme.background,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            ),
                          );
                        },
                        optionsViewBuilder:'''
text = re.sub(pattern, new_fieldViewBuilder, text, flags=re.DOTALL)

# Add auto-detect button below city field
auto_pattern = r'(\optionsViewBuilder: \(context, onSelected, options\) \{.*?\return Align\(.*?\);\s*\}\s*\)\s*;\s*\}\),\s*\),)'
auto_repl = r'''\1
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 48,
                    child: OutlinedButton.icon(
                      onPressed: _otpSent || _isDetectingLocation ? null : () {
                        // Pass _cityController directly or handle gracefully
                        _autoDetectLocation(_cityController);
                      },
                      icon: _isDetectingLocation
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.my_location, size: 18),
                      label: Text(
                        AppLocalizations.of(context).language == AppLanguage.hi
                            ? 'मेरा स्थान स्वतः पहचानें'
                            : AppLocalizations.of(context).language == AppLanguage.mr
                                ? 'माझे स्थान स्वयंचलित शोधा'
                                : 'Auto-detect my location',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.purpleDark,
                        side: BorderSide(color: AppTheme.purpleDark.withValues(alpha: 0.3)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),'''

# Wait, regex capture groups can be tricky in Python with multiline. 
# Let's just find the end of the Autocomplete. It ends with:
#                           );
#                         },
#                       ),
#                     ),
#                   // OTP Field
# Let's replace up to OTP Field
import re
end_pattern = r'(\s*optionsViewBuilder:.*?\}\s*\)\s*;\s*\}\),\s*\),)(\s*// OTP Field)'
end_repl = r'''\1
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 48,
                    child: OutlinedButton.icon(
                      onPressed: _otpSent || _isDetectingLocation ? null : () {
                        _autoDetectLocation(_cityController);
                      },
                      icon: _isDetectingLocation
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.my_location, size: 18),
                      label: const Text(
                        'Auto-detect my location',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.purpleDark,
                        side: const BorderSide(color: AppTheme.purpleMedium),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),\2'''

text = re.sub(end_pattern, end_repl, text, flags=re.DOTALL)

with open('ui/lib/screens/register_screen.dart', 'w', encoding='utf-8') as f:
    f.write(text)
print("done register field fixes")
