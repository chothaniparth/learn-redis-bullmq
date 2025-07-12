const { default: mongoose } = require("mongoose");
const Sheduler = require('../models/shedule')
const {notificationQueue} = require('../jobs/redisClient');
const { handleError } = require("../utils/ResponseHandler");
const { createShedulerSchema } = require("../dtos/sheduler/sheduler");

const createShedule = async (req, res)=>{
    try{
        const { error, value } = createShedulerSchema.validate({...req.body}, {abortEarly: false});
        
        if (error) return res.status(400).json({ error: error.details });

        await mongoose.connect(process.env.MONGODB_URI);

        const newSheduler = new  Sheduler({...value})

        await newSheduler.save();
        await mongoose.connection.close();

        const addToqueue = await notificationQueue.add('notifications', {
            messageId: newSheduler._id,
            },{
            delay: new Date(value.sendAt) - new Date(),
        });
        
        // console.log('addToqueue : ', addToqueue);
        
        return res.status(201).json({
            message: "Scheduler created successfully",
            event: newSheduler
        });
    }catch(error){
        console.log("Error deleting event:", error);
        handleError(error, req, res);
    }
}

module.exports = {
    createShedule
}