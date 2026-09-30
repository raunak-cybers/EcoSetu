with open('ui/lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = '''                    Text(
                      AppLocalizations.of(context).t('home_take_photo'),
                      style: const TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 15,
                        height: 1.4,
                        fontWeight: FontWeight.w500,
                      ),
                    ),'''

new_str = '''                    Padding(
                      padding: const EdgeInsets.only(right: 140),
                      child: Text(
                        AppLocalizations.of(context).t('home_take_photo'),
                        style: const TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 15,
                          height: 1.4,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),'''

content = content.replace(old_str, new_str)
content = content.replace('const SizedBox(height: 20),', 'const SizedBox(height: 32),')

with open('ui/lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
