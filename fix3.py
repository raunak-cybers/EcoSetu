with open('ui/lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if \"AppLocalizations.of(context).t('home_take_photo'),\" in line and \"Text(\" in lines[i-1]:
        # found the first one outside the button!
        lines[i-1] = lines[i-1].replace(\"Text(\", \"Padding(\\n                      padding: const EdgeInsets.only(right: 140),\\n                      child: Text(\")
        # now we need to add a closing parenthesis for Padding after the Text closes
        for j in range(i, len(lines)):
            if \"),\" in lines[j]:
                lines[j] = lines[j].replace(\"),\", \"),\\n                    ),\")
                break
        
        # also change the SizedBox(height: 20) to 32
        for j in range(i, len(lines)):
            if \"const SizedBox(height: 20),\" in lines[j]:
                lines[j] = lines[j].replace(\"const SizedBox(height: 20),\", \"const SizedBox(height: 32),\")
                break
        break

with open('ui/lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print(\"Fixed padding successfully\")
