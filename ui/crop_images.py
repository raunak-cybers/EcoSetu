import sys
from PIL import Image
import os

img_path = r"C:\Users\Taniya\.gemini\antigravity\brain\08136943-3fea-427b-92e3-10f7728e7b50\media__1789233936714.png"
out_dir = r"c:\Users\Taniya\Desktop\raun kabadi v2\ui\assets\images\materials"

os.makedirs(out_dir, exist_ok=True)

try:
    img = Image.open(img_path)
    width, height = img.size
    print(f"Image size: {width}x{height}")

    # Assuming 4 columns x 2 rows
    col_w = width // 4
    row_h = height // 2

    names = [
        "pcb.png",
        "cable.png",
        "battery.png",
        "magnet_bearing.png",
        "motor.png",
        "crt_glass.png",
        "mixed_plastics.png",
        "lcd_panel.png"
    ]

    for i in range(8):
        row = i // 4
        col = i % 4
        box = (col * col_w, row * row_h, (col + 1) * col_w, (row + 1) * row_h)
        cropped = img.crop(box)
        
        # Save image
        out_path = os.path.join(out_dir, names[i])
        cropped.save(out_path)
        print(f"Saved: {out_path}")

except Exception as e:
    print(f"Error: {e}")
