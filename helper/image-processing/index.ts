import axios from "axios";

export class ImageProcessing {
  async processImage(image) {
    const formData = new FormData();

    formData.append("image", image);
    const reducedImageSize = await axios.post(
      "http://127.0.0.1:5000/reduce_height",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("🚀 ~ file: index.ts:13 ~ ImageProcessing ~ processImage ~ reducedImageSize:", reducedImageSize)
  }
}
