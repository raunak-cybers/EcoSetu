import re

with open('ui/lib/core/localization.dart', 'r', encoding='utf-8') as f:
    content = f.read()

new_key = '''    'home_take_photo': {
      AppLanguage.en: "Know what it's worth, then choose who to sell to.",
      AppLanguage.hi: 'जानें इसकी कीमत क्या है, फिर चुनें कि किसे बेचना है।',
      AppLanguage.mr: 'त्याची किंमत काय आहे ते जाणून घ्या, मग कोणाला विकायचे ते ठरवा.',
    },
    'home_button_subtext': {
      AppLanguage.en: 'Take a photo to identify material and check prices',
      AppLanguage.hi: 'सामग्री पहचानने और कीमतें जांचने के लिए फोटो लें',
      AppLanguage.mr: 'सामग्री ओळखण्यासाठी आणि किमती तपासण्यासाठी फोटो घ्या',
    },'''

content = re.sub(r"    'home_take_photo': \{[^}]+\},", new_key, content)

with open('ui/lib/core/localization.dart', 'w', encoding='utf-8') as f:
    f.write(content)
