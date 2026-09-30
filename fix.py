import re
with open('ui/lib/core/localization.dart', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"\\'home_take_photo\\':.*?\},"
replacement = """    'home_take_photo': {
      AppLanguage.en: \"Know what it's worth, then choose who to sell to.\",
      AppLanguage.hi: 'जानें इसकी कीमत क्या है, फिर चुनें कि किसे बेचना है।',
      AppLanguage.mr: 'त्याची किंमत काय आहे ते जाणून घ्या, मग कोणाला विकायचे ते ठरवा.',
    },"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('ui/lib/core/localization.dart', 'w', encoding='utf-8') as f:
    f.write(content)
