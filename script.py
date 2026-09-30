import sys
import re

with open('ui/lib/widgets/shared_widgets.dart', 'r', encoding='utf-8') as f:
    text = f.read()

chip_text = '''
class LanguageToggleChip extends StatelessWidget {
  const LanguageToggleChip({super.key});

  String _getLanguageLabel(AppLanguage lang) {
    switch (lang) {
      case AppLanguage.hi: return "हिंदी";
      case AppLanguage.mr: return "मराठी";
      case AppLanguage.en:
      default: return "English";
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<AppLanguage>(
      onSelected: (AppLanguage newLang) {
        HapticFeedback.selectionClick();
        AppLocalizations.of(context).changeLanguage(newLang);
        final langCode = newLang == AppLanguage.hi ? "hi-IN" : newLang == AppLanguage.mr ? "mr-IN" : "en-IN";
        TtsService().setLanguage(langCode);
      },
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      offset: const Offset(0, 48),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.language, color: AppColors.purpleDark, size: 16),
            const SizedBox(width: 6),
            Text(
              _getLanguageLabel(AppLocalizations.of(context).language), 
              style: const TextStyle(
                color: AppColors.purpleDark,
                fontWeight: FontWeight.w800,
                fontSize: 14,
              )
            ),
          ],
        ),
      ),
      itemBuilder: (context) {
        final currentLang = AppLocalizations.of(context).language;
        return [
          PopupMenuItem(
            value: AppLanguage.en,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("English", style: TextStyle(fontWeight: FontWeight.w600)),
                if (currentLang == AppLanguage.en) const Icon(Icons.check, color: AppColors.purpleDark, size: 18),
              ],
            ),
          ),
          PopupMenuItem(
            value: AppLanguage.hi,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("हिंदी", style: TextStyle(fontWeight: FontWeight.w600)),
                if (currentLang == AppLanguage.hi) const Icon(Icons.check, color: AppColors.purpleDark, size: 18),
              ],
            ),
          ),
          PopupMenuItem(
            value: AppLanguage.mr,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("मराठी", style: TextStyle(fontWeight: FontWeight.w600)),
                if (currentLang == AppLanguage.mr) const Icon(Icons.check, color: AppColors.purpleDark, size: 18),
              ],
            ),
          ),
        ];
      }
    );
  }
}
'''

pattern = r'actions: \[\s*Padding\(\s*padding: const EdgeInsets\.only\(right: 16\),\s*child: Center\(\s*child: PopupMenuButton<AppLanguage>\(.*?\)\s*,\s*\)\s*,\s*\)\s*,\s*\]'

replacement = '''actions: [
        const Padding(
          padding: EdgeInsets.only(right: 16),
          child: Center(
            child: LanguageToggleChip(),
          ),
        ),
      ]'''

new_text = re.sub(pattern, replacement, text, flags=re.DOTALL)

import_end = new_text.rfind('import')
import_end_line = new_text.find('\n', import_end) + 1
new_text = new_text[:import_end_line] + chip_text + '\n' + new_text[import_end_line:]

with open('ui/lib/widgets/shared_widgets.dart', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('done')
