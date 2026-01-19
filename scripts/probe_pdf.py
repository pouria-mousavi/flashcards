from pdfminer.high_level import extract_text
import os

pdf_path = "/Users/pouriamousavi/.gemini/antigravity/scratch/flashcard_migrator/Oxford-Word-Skills-Advanced.pdf"
output_path = "/Users/pouriamousavi/.gemini/antigravity/scratch/flashcard_migrator/scripts/pdf_probe_output.txt"

# Create scripts dir if not exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

try:
    print("Extracting text with pdfminer...")
    # Extract pages 10 to 15 (0-indexed: 10, 11, 12, 13, 14, 15)
    text = extract_text(pdf_path, page_numbers=[10, 11, 12, 13, 14, 15])
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)
            
    print("Probe complete. Text extracted.")
except Exception as e:
    print(f"Error: {e}")
