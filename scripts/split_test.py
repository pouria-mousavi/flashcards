import pypdf
import os

pdf_path = "/Users/pouriamousavi/.gemini/antigravity/scratch/flashcard_migrator/Oxford-Word-Skills-Advanced.pdf"
output_dir = "/Users/pouriamousavi/.gemini/antigravity/scratch/flashcard_migrator/scripts/pdf_chunks_test"

os.makedirs(output_dir, exist_ok=True)

try:
    reader = pypdf.PdfReader(pdf_path)
    # Extract Page 12 (likely a Unit page)
    writer = pypdf.PdfWriter()
    writer.add_page(reader.pages[12])
    
    chunk_path = os.path.join(output_dir, "test_page_12.pdf")
    with open(chunk_path, "wb") as f:
        writer.write(f)
            
    print(f"Created {chunk_path}")
except Exception as e:
    print(f"Error: {e}")
