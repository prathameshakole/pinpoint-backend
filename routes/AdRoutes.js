import * as dao from "../dao/AdDao.js";
import { verifyToken, verifyAdvertiser } from "../config/Jwt.js"

export default function AdRoutes(app) {
    const createAd = async (req, res) => {
        const ad = await dao.createAd(req.body);
        res.json(ad);
    };
    const deleteAd = async (req, res) => {
        const status = await dao.deleteAd(req.params.adId);
        res.json(status);

    };
    const findAllAds = async (req, res) => {
        const ads = await dao.findAllAds();
        res.json(ads);
    };
    const findAdByUser = async (req, res) => {
        const ads = await dao.findAdByUser(req.params.userid);
        res.json(ads)
    }
    const updateAd = async (req, res) => {
        const { adId } = req.params;
        const status = await dao.updateAd(adId, req.body);
        res.json(status);
    };

    const getRandomAd = async (req, res) => {
        var ad = await dao.getRandomAd();
        if (ad == undefined) {
            return res.status(200).send([]);
        }
        ad.totalImpressions += 1
        await dao.updateAd(ad._id, ad);
        res.status(200).json(ad);
    };

    app.post("/api/ads", verifyToken, verifyAdvertiser, createAd);
    app.get("/api/ads/", verifyToken, findAllAds);
    app.get("/api/randomad", getRandomAd);
    app.get("/api/ads/:userid", verifyToken, verifyAdvertiser, findAdByUser);
    app.put("/api/ads/:adId", verifyToken, updateAd);
    app.delete("/api/ads/:adId", verifyToken, verifyAdvertiser, deleteAd);
}
