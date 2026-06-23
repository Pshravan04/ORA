import os
import glob

html_files = glob.glob(r'd:\TGM state - Website details\ORA\**\*.html', recursive=True)

replacements = [
    (
        '<div style="background-color: #ffffff; border-radius: 1.5rem; padding: 5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);" data-animate="fade-up">',
        '<div class="footer-card" style="background-color: #ffffff; border-radius: 1.5rem; padding: 5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);" data-animate="fade-up">'
    ),
    (
        '<div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4rem; margin-bottom: 5rem;">',
        '<div class="footer-top-row" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4rem; margin-bottom: 5rem;">'
    ),
    (
        '<div style="max-width: 320px;">\n                        <a href=',
        '<div class="footer-brand" style="max-width: 320px;">\n                        <a href='
    ),
    (
        '<div style="display: flex; gap: 6rem; flex-wrap: wrap; margin-left: auto;">',
        '<div class="footer-links-grid" style="display: flex; gap: 6rem; flex-wrap: wrap; margin-left: auto;">'
    ),
    (
        '<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.25rem;">',
        '<ul class="footer-link-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.25rem;">'
    ),
    (
        '<div style="border-top: 1px solid rgba(0,0,0,0.1); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">',
        '<div class="footer-bottom" style="border-top: 1px solid rgba(0,0,0,0.1); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">'
    )
]

for file_path in html_files:
    # skip index.html as it is already processed
    if "index.html" in file_path:
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
