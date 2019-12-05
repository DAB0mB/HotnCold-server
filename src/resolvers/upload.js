import { useCloudinary } from '../providers';

const resolvers = {
  Mutation: {
    async uploadPicture(mutation, { data }) {
      const cloudinary = useCloudinary();

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

export default resolvers;
