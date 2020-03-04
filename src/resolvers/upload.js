import { useCloudinary } from '../providers';

const resolvers = {
  Mutation: {
    async uploadPicture(mutation, { data }) {
      const cloudinary = useCloudinary();

      const readStream = (await data).createReadStream();

      return cloudinary.uploadFromRawStream(readStream);
    },
  },
};

export default resolvers;
