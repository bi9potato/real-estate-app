import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

const createListing = async (req, res, next) => {

    // console.log(req.body);

    try {

        const listing = await Listing.create(req.body);

        return res.status(201).json(
            {
                success: true,
                message: 'Listing created successfully',
                listing,
            }
        );


    } catch (error) {
        next(new Error('Error creating listing'));
        return;
    }


};


const deleteListing = async (req, res, next) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        next(new Error('Listing not found'));
        return;
    }

    if (req.user_id.id !== listing.userRef) {
        next(new Error(401, 'You are only allowed to delete your own listings'));
        return;
    }

    try {

        await Listing.findByIdAndDelete(req.params.id);

        return res.status(200).json(
            {
                success: true,
                message: 'Listing deleted successfully',
            }
        );
    } catch (error) {
        next(new Error('Error deleting listing'));
        return;
    }

}


const updateListing = async (req, res, next) => {

    // console.log(req.params.id);
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // 检查 ID 是否符合 24 位十六进制格式
        next(errorHandler(400, 'Invalid ID format'));
        return;
    }
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        next(errorHandler(404, 'Listing not found'));
        return;
    }

    if (req.user_id.id !== listing.userRef) {
        next(errorHandler(401, 'You are only allowed to update your own listings'));
        return;
    }

    try {

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        return res.status(200).json(
            {
                success: true,
                message: 'Listing updated successfully',
                listing: updatedListing,
            }
        );


    } catch (error) {
        next(errorHandler(500, 'Error updating listing'));
        return;
    }

}


const getListing = async (req, res, next) => {

    try {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            next(errorHandler(404, 'Listing not found'));
            return;
        }

        return res.status(200).json(
            {
                success: true,
                message: 'Listing retrieved successfully',
                listing,
            }
        );

    } catch (error) {
        next(errorHandler(500, 'Error retrieving listing'));
        return;
    }

};

const getListings = async (req, res, next) => {

    try {

        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';
        
        const order = req.query.order || 'desc';



        const listings = await Listing.find(
            {
                name: { $regex: searchTerm, $options: 'i' },
                offer,
                furnished,
                parking,
                type,
            }
        ).sort(
            {[sort]: order}
        ).limit(limit).skip(startIndex);
            
        
        return res.status(200).json(
            {
                success: true,
                message: 'Listings retrieved successfully',
                listings,
            }
        );


    } catch (error) {
        next(errorHandler(500, 'Error retrieving listings'));
        return;
    }

};


export { createListing, deleteListing, updateListing, getListing, getListings };