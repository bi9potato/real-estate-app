
import express from "express";
import { createListing, deleteListing, updateListing, getListing, getListings } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const listingRouter = express.Router();


listingRouter.post('/create-listing', verifyToken, createListing);
listingRouter.delete('/delete-listing/:id', verifyToken, deleteListing);
listingRouter.post('/update-listing/:id', verifyToken, updateListing)
listingRouter.get('/get-listing/:id', getListing);
listingRouter.get('/get-listings', getListings);

export default listingRouter;