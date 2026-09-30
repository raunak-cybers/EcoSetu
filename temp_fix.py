import re

with open('ui/lib/screens/recycler_details_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(\"lot.handoverStatus == 'declined'\", \"lot.handoverStatus == 'declined' || lot.handoverStatus == 'disputed' || lot.handoverStatus == 'rejected'\")
content = content.replace(\".from('lots').insert({\", \".from('lots').upsert({\")

old_nav = '''                                    Navigator.pop(context);
                                    if (isSmartFlow) {
                                      Navigator.pop(context);
                                    }'''
new_nav = '''                                    if (isSmartFlow) {
                                      Navigator.pop(context);
                                    }
                                    import 'package:ecosetu/screens/lot_details_screen.dart'; // Ensure it's imported
                                    Navigator.pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => LotDetailsScreen(lot: lotToUpdate),
                                      ),
                                    );'''
content = content.replace(old_nav, new_nav)

with open('ui/lib/screens/recycler_details_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
