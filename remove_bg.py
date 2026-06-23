from PIL import Image
import sys

def remove_white_background(input_path, output_path, tolerance=20):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # item is (R, G, B, A)
            if item[0] > 255 - tolerance and item[1] > 255 - tolerance and item[2] > 255 - tolerance:
                newData.append((255, 255, 255, 0)) # Fully transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Successfully removed background.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_white_background("assets/pendant_lamp.png", "assets/pendant_lamp_transparent.png", 30)
