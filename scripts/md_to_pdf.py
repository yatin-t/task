import sys
from markdown import markdown
from weasyprint import HTML

if len(sys.argv) < 3:
    print('Usage: md_to_pdf.py <input.md> <output.pdf>')
    sys.exit(1)

md_path = sys.argv[1]
pdf_path = sys.argv[2]

with open(md_path, 'r', encoding='utf-8') as f:
    md = f.read()

html = markdown(md, extensions=['fenced_code', 'tables'])
# Wrap in basic HTML
full = f"""<!doctype html>
<html>
<head>
<meta charset='utf-8'>
<style>
body { font-family: Arial, Helvetica, sans-serif; padding: 24px; }
pre { background: #f4f4f4; padding: 12px; overflow:auto }
code { font-family: monospace }
h1, h2, h3 { color: #111827 }
.header { margin-bottom: 12px }
</style>
</head>
<body>
{html}
</body>
</html>
"""

HTML(string=full).write_pdf(pdf_path)
print('Wrote', pdf_path)
