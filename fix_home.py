import re

with open('ui/lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'home_add_ewaste' in line:
        # The next few lines contain the subtext
        for j in range(i, i+15):
            if 'home_take_photo' in lines[j]:
                lines[j] = lines[j].replace('home_take_photo', 'home_button_subtext')
                print('Replaced at line', j)
                break

with open('ui/lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
    f.writelines(lines)
