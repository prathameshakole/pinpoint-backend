import model from "./model.js";
export const createAd = (ad) => {
    delete ad._id
    return model.create(ad);
}
export const findAllAds = () => model.find();
export const findAdByUser = (userid) => model.find({ userid: userid });
export const updateAd = (adId, ad) => model.updateOne({ _id: adId }, { $set: ad });
export const deleteAd = (adId) => model.deleteOne({ _id: adId });
export const getRandomAd = () => model.findOne()
    .skip(Math.floor(Math.random() * model.countDocuments())).then(e => e).catch(e => undefined)