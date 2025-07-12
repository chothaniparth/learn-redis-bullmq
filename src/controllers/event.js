const {handleError} = require('../utils/ResponseHandler');
const {CreateEventSchema, updateEventSchema, deleteEventSchema} = require('../dtos/event/event');
const mongoose = require('mongoose');
const EventModel = require('../models/event');

const getEvents = async (req, res)=> {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        const events = await EventModel.find({...req.query});
        await mongoose.connection.close();
        return res.status(200).json({
            message: "Events fetched successfully",
            events
        });
    }catch(error){
        console.log("Error fetching events:", error);
        handleError(error, req, res);
    }
}

const createEvent = async (req, res) => {
    try{
        const { error } = CreateEventSchema.validate({...req.body}, {abortEarly: false});
        if (error) return res.status(400).json({ error: error.details });

        const { name, description, date, addresses, organizerId } = req.body;

        await mongoose.connect(process.env.MONGODB_URI);
        
        const Event = new EventModel({
            organizerId,
            name,
            description,
            date,
            addresses
        });

        await Event.save();
        await mongoose.connection.close();

        return res.status(201).json({
            message: "Event created successfully",
            event: Event
        });
    }catch(error){
        console.log("Error creating event:", error);
        handleError(error, req, res);
    }
}

const updateEvent = async (req, res) => {
    try{
        const { error } = updateEventSchema.validate({...req.body}, {abortEarly: false});
        if (error) return res.status(400).json({ error: error.details });

        const { _id, organizerId, name, description, date, addresses } = req.body;

        await mongoose.connect(process.env.MONGODB_URI);

        const event = await EventModel.findByIdAndUpdate(
            _id,
            {
                organizerId,
                name,
                description,
                date,
                addresses
            },
            { new: true } // Return the updated document
        );

        await mongoose.connection.close();
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({
            message: "Event updated successfully",
            event
        });
    }catch(error){
        console.log("Error updating event:", error);
        handleError(error, req, res);
    }
}

const deleteEvent = async( req, res) => {
    try{
        const { error } = deleteEventSchema.validate({...req.query}, {abortEarly: false});
        if (error) return res.status(400).json({ error: error.details });

        const { _id } = req.query;

        await mongoose.connect(process.env.MONGODB_URI);

        const event = await EventModel.findByIdAndDelete(_id);
        await mongoose.connection.close();

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({
            message: "Event deleted successfully",
            event
        });
    }catch(error){
        console.log("Error deleting event:", error);
        handleError(error, req, res);
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}