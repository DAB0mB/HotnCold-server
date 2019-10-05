export default {
  Mutation: {
    async uploadPicture(mutation, { blob }, { me, cloudinary }) {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(blob, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })
    },
  },
};
