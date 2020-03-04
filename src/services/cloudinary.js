import fetch from 'node-fetch';

class Cloudinary {
  constructor(client) {
    this.client = client;
  }

  uploadFromRawStream(readStream, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = this.client.uploader.upload_stream(options, (error, image) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(image.url);
        }
      });
      readStream.pipe(uploadStream);
    });
  }

  async uploadFromUrl(url, options = {}) {
    const readStream = (await fetch(url)).body;

    return this.uploadFromRawStream(readStream, options);
  }
}

export default Cloudinary;
