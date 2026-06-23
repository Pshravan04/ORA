import os
import glob
import re

html_files = glob.glob(r'd:\TGM state - Website details\ORA\**\*.html', recursive=True)

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to replace style.css?v=anything with style.css?v=7
    new_content = re.sub(r'css/style\.css(\?v=\d+)?', 'css/style.css?v=7', content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated cache buster in {file_path}")
