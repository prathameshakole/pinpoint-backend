import * as dao from "./dao.js";
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
        const ads = await dao.findAdsByUser(req.params.userid);
        res.json(ads)
    }
    const updateAd = async (req, res) => {
        const { adId } = req.params;
        const status = await dao.updateAd(adId, req.body);
        res.json(status);
    };
    app.ad("/api/ads", createAd);
    app.get("/api/ads/", findAllAds);
    app.get("/api/ads/:userid", findAdByUser);
    app.put("/api/ads/:adId", updateAd);
    app.delete("/api/ads/:adId", deleteAd);
}
