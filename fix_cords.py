import os
import glob
import re

html_files = glob.glob(r'd:\TGM state - Website details\ORA\**\*.html', recursive=True)

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to replace cord styles
    new_content = content.replace(
        'top: -400px; left: 50%; width: 2px; height: 400px;',
        'top: -1000px; left: 50%; width: 2px; height: 1000px;'
    )
    
    # Cache bust again just in case (v=8)
    new_content = re.sub(r'css/style\.css(\?v=\d+)?', 'css/style.css?v=8', new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated cords in {file_path}")
