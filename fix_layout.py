with open('ui/lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

splash_block = '''              // Background Splash
              Positioned(
                right: -40,
                top: -20,
                child: IgnorePointer(
                  child: Container(
                    width: 260,
                    height: 260,
                    decoration: const BoxDecoration(
                      color: Color(0xFFF0F4FF), // Very soft blue splash color
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ),'''

visual_block = '''              // Transparent Bin Visual
              Positioned(
                right: -10,
                top: 60,
                child: IgnorePointer(
                  child: Image.asset(
                    'assets/images/hero_visual.png',
                    width: 175,
                    fit: BoxFit.contain,
                  ),
                ),
              ),'''

# The new combined PNG replaces the background splash.
# Let's adjust its size and top padding. It contains both the splash and the bin.
# To make it perfectly align with the top right and stick on top of the button:
new_splash = '''              Positioned(
                right: -30,
                top: 0,
                child: IgnorePointer(
                  child: Image.asset(
                    'assets/images/hero_combined.png',
                    width: 250,
                    fit: BoxFit.contain,
                  ),
                ),
              ),'''

content = content.replace(splash_block, new_splash)
content = content.replace(visual_block, '')

with open('ui/lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done layout adjustment')
