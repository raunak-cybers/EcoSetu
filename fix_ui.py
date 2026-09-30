import re

with open('ui/lib/screens/add_batch_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Add _isAiSuggested to state
content = re.sub(
    r"  Map<String, dynamic>\? _suggestedCategory;\n  Map<String, dynamic>\? _selectedCategory;",
    "  Map<String, dynamic>? _suggestedCategory;\n  Map<String, dynamic>? _selectedCategory;\n  bool _isAiSuggested = false;",
    content
)

# In AI success:
content = content.replace(
    "_selectedCategory = _suggestedCategory;",
    "_selectedCategory = _suggestedCategory;\n              _isAiSuggested = true;"
)

# In GestureDetector onTap
content = content.replace(
    "setState(() => _selectedCategory = cat);",
    "setState(() {\n                    _selectedCategory = cat;\n                    _isAiSuggested = false;\n                  });"
)

# Grid styling
old_grid_style = '''                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFFDCFCE7) : Colors.white,
                    border: Border.all(
                      color:
                          isSelected ? Colors.green : const Color(0xFFE5E7EB),
                      width: isSelected ? 2 : 1,
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),'''

new_grid_style = '''                child: Container(
                  decoration: BoxDecoration(
                    color: (isSelected && _isAiSuggested) ? const Color(0xFFEFF6FF) : isSelected ? const Color(0xFFDCFCE7) : Colors.white,
                    border: Border.all(
                      color:
                          (isSelected && _isAiSuggested) ? Colors.blue.shade300 : isSelected ? Colors.green : const Color(0xFFE5E7EB),
                      width: isSelected ? 2 : 1,
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),'''

content = content.replace(old_grid_style, new_grid_style)

# Also update the text style color inside the card
old_text_color = '''                          color: isSelected
                              ? Colors.green.shade800
                              : Colors.black87,'''
                              
new_text_color = '''                          color: (isSelected && _isAiSuggested) ? Colors.blue.shade800 : isSelected
                              ? Colors.green.shade800
                              : Colors.black87,'''
                              
content = content.replace(old_text_color, new_text_color)

with open('ui/lib/screens/add_batch_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
