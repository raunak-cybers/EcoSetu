import re

with open('ui/lib/screens/add_batch_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Add _aiFailMessage = null to the setState block
content = content.replace(
    "          _selectedCategory = null;\n          _currentStep = 1; // Move to Verify step",
    "          _selectedCategory = null;\n          _aiFailMessage = null;\n          _currentStep = 1; // Move to Verify step"
)

# Fix 2: Replace the if/else confidence check to accept low confidence too
old_check = "          // Accept high, medium AND low \u2014 only reject 'Unknown'\n          if ((conf == 'high' || conf == 'medium') && cat != 'Unknown') {\n            setState(() {\n              _isAnalyzing = false;\n              _suggestedCategory = _categories.firstWhere(\n                (c) => c[\"id\"] == cat || c[\"label\"] == cat,\n                orElse: () => _categories.first\n              );\n              _selectedCategory = _suggestedCategory;\n              _isAiSuggested = true;\n            });\n          } else {\n            // Low confidence or Unknown\n            setState(() {\n              _isAnalyzing = false;\n              _suggestedCategory = null;\n              _selectedCategory = null;\n            });\n            ScaffoldMessenger.of(context).showSnackBar(\n              const SnackBar(content: Text(\"Couldn't identify this. Please choose the material.\")),\n            );\n          }\n        } else {\n           throw Exception(\"Invalid response format\");\n        }\n      } on TimeoutException {\n        if (!mounted) return;\n        setState(() {\n          _isAnalyzing = false;\n          _suggestedCategory = null;\n          _selectedCategory = null;\n        });\n        ScaffoldMessenger.of(context).showSnackBar(\n          const SnackBar(content: Text(\"Couldn't identify this. Please choose the material.\")),\n        );\n      } catch (e) {\n        debugPrint(\"Classification Error: \");\n        if (mounted) {\n          setState(() {\n            _isAnalyzing = false;\n            _suggestedCategory = null;\n            _selectedCategory = null;\n          });\n          ScaffoldMessenger.of(context).showSnackBar(\n            const SnackBar(content: Text(\"Couldn't identify this. Please choose the material.\")),\n          );\n        }\n      }"

new_check = "          // Accept high, medium AND low confidence\n          if (cat != 'Unknown') {\n            final match = _categories.firstWhere(\n              (c) => c[\"id\"] == cat || c[\"label\"] == cat,\n              orElse: () => <String, dynamic>{},\n            );\n            if (match.isNotEmpty) {\n              setState(() {\n                _isAnalyzing = false;\n                _aiFailMessage = null;\n                _suggestedCategory = match;\n                _selectedCategory = match;\n                _isAiSuggested = true;\n              });\n            } else {\n              setState(() {\n                _isAnalyzing = false;\n                _suggestedCategory = null;\n                _selectedCategory = null;\n                _aiFailMessage = \"Couldn't identify material. Please select manually.\";\n              });\n            }\n          } else {\n            setState(() {\n              _isAnalyzing = false;\n              _suggestedCategory = null;\n              _selectedCategory = null;\n              _aiFailMessage = \"Item not recognized. Please select manually.\";\n            });\n          }\n        } else {\n          throw Exception(\"Invalid response format\");\n        }\n      } on TimeoutException {\n        if (!mounted) return;\n        setState(() {\n          _isAnalyzing = false;\n          _suggestedCategory = null;\n          _selectedCategory = null;\n          _aiFailMessage = \"AI timed out. Please select manually.\";\n        });\n      } catch (e) {\n        debugPrint(\"Classification Error: $e\");\n        if (mounted) {\n          setState(() {\n            _isAnalyzing = false;\n            _suggestedCategory = null;\n            _selectedCategory = null;\n            _aiFailMessage = \"Couldn't identify material. Please select manually.\";\n          });\n        }\n      }"

if old_check in content:
    content = content.replace(old_check, new_check)
    print("Fix 2 applied")
else:
    print("Fix 2 NOT found - searching for partial...")
    # Try finding just the snackbar pattern
    idx = content.find("ScaffoldMessenger.of(context).showSnackBar")
    print(f"SnackBar found at index: {idx}")
    print(content[idx-200:idx+200])

with open('ui/lib/screens/add_batch_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
