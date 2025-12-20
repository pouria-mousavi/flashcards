import pypdf
import os

pdf_path = "/Users/pouriamousavi/.gemini/antigravity/scratch/flashcard_migrator/Oxford-Word-Skills-Advanced.pdf"
output_dir = "/Users/pouriamousavi/.gemini/antigravity/scratch/flashcard_migrator/scripts/pdf_chunks"

os.makedirs(output_dir, exist_ok=True)

try:
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    print(f"Total Pages: {total_pages}")
    
    chunk_size = 20
    
    for i in range(0, total_pages, chunk_size):
        writer = pypdf.PdfWriter()
        end = min(i + chunk_size, total_pages)
        
        for page_num in range(i, end):
            writer.add_page(reader.pages[page_num])
            
        chunk_filename = f"chunk_{i:03d}_{end:03d}.pdf"
        chunk_path = os.path.join(output_dir, chunk_filename)
        
        with open(chunk_path, "wb") as f:
            writer.write(f)
            
        print(f"Created {chunk_filename}")
            
    print("Splitting complete.")
except Exception as e:
    print(f"Error: {e}")
