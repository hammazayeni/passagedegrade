from rembg import remove
from PIL import Image
import sys
import os

# Define paths
input_path = '/workspace/shadcn-ui/public/assets/logos/img_4026.jpg'
output_path = '/images/Logo.jpg'

print(f"Processing {input_path}...")

if not os.path.exists(input_path):
    print(f"Error: Input file not found at {input_path}")
    sys.exit(1)

try:
    input_image = Image.open(input_path)
    output_image = remove(input_image)
    output_image.save(output_path)
    print(f"Background removed successfully. Saved to {output_path}")
except Exception as e:
    print(f"Error processing image: {e}")
    sys.exit(1)