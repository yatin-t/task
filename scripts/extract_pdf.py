from pypdf import PdfReader
import sys

if len(sys.argv) < 2:
    print("Usage: extract_pdf.py <pdf_path>")
    sys.exit(1)

pdf_path = sys.argv[1]
reader = PdfReader(pdf_path)
text = []
for i, page in enumerate(reader.pages):
    page_text = page.extract_text()
    text.append(f"\n--- PAGE {i+1} ---\n")
    text.append(page_text or "")

print('\n'.join(text))
