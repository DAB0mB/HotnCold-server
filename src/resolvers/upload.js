export default {
  Mutation: {
    async uploadPicture(mutation, { data }, { cloudinary }) {
      data = await data;

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream({}, (error, image) => {
          if (error) {
            reject(error);
          } else {
            resolve(image.url);
          }
        });
        const readStream = data.createReadStream();
        readStream.pipe(uploadStream);
      });
    },
  },
};
