import model from "./model.js";
export const createAd = (ad) => {
  delete ad._id
  return model.create(ad);
}
export const findAllAds = () => model.find();
export const findAdByUser = (userid) => model.find({ userid: userid });
export const updateAd = (adId, ad) => model.updateOne({ _id: adId }, { $set: ad });
export const deleteAd = (adId) => model.deleteOne({ _id: adId });
export const getRandomAd = async () => {
  try {
    const count = await model.countDocuments();
    if (count === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * count);
    const randomAd = await model.findOne({ approved: true }).skip(randomIndex);
    return randomAd;
  } catch (error) {
    return undefined;
  }
};