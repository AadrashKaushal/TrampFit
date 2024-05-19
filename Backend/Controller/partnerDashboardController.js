const { where } = require('sequelize');
const gymDetailsModel = require('../Models/gymDetailsModel');
const partnerLoginModel = require('../Models/partnerLoginModel')
const sessionModel = require('../Models/sessionModel');
const { response } = require('express');


// get partner for partner Dashboard
const partnerInfoController = async (req, res) => {
    try {

        let mobileNumber = req.userDetails.payloadData.mobileNumber;

        let getPartnerInfo = await gymDetailsModel.findOne({
            include: [
                {
                    model: partnerLoginModel,
                    attributes: ['fullName', 'id', 'mobileNumber', 'email'],
                    as: 'partnerInfo'
                }
            ],
            attributes: ['gymLogo', 'panNumber'],
            where: {
                '$partnerInfo.mobileNumber$': mobileNumber
            }
        })

        res.json({
            message: "Partner Info",
            response: true,
            data: getPartnerInfo
        })

    } catch (err) {
        console.log(err);

        res.json({
            message: "Something went wrong !!",
            response: false
        })
    }
}


// get gym Info 
const gymInfoController = async(req,res) => {
    try {

        let mobileNumber = req.userDetails.payloadData.mobileNumber;

        let getGymInfo = await gymDetailsModel.findOne({
            include : [
                {
                    model : partnerLoginModel,
                    attributes : [],
                    as : 'partnerInfo'
                }
            ],
            attributes : ['gymName','gymLocation','gymCity','id'],
            where : {
                '$partnerInfo.mobileNumber$' : mobileNumber
            }
        })

        res.json({
            message : "Gym Info",
            response : true,
            data : getGymInfo
        })

    } catch(err) {
        console.log(err);

        res.json({
            message : "Something went wrong !!",
            response : false
        });
    }

}


// add amentities
const updateAmenitiesController = async (req, res) => {
    try {

        let gymId = req.body.id;
        let amenities = req.body.amenities.split(',');

        await gymDetailsModel.update({ amenities: amenities }, {
            where: {
                id: gymId
            }
        })

        res.json({
            message: "Ammenities added successfully",
            reponse: true
        });

    } catch (err) {
        console.log(err);

        res.json({
            message: "Something went wrong!!",
            response: false
        });
    }
}


// add session slots

const addSessionSlotsController = async (req, res) => {
    try {
        // req.body = [{sessionTiming : "07:00",sessionCount : 30 , date : "12/12/2024",gymId : 1},and more]

        let sessionSlots = req.body;
        let {currentDate} = req.query;

        let newDate = currentDate;

        let updatedSlots = []
        
        for (var i = 1; i <= 6; i++) {
            newDate.setTime(newDate.getTime() + 24 * 60 * 60 * 1000);
            sessionSlots.forEach((val) => {
                let schedule = {};
                schedule.sessionTiming = val.sessionTiming;
                schedule.sessionCount = val.sessionCount;
                schedule.gymId = val.gymId;
                schedule.date = `${newDate.getUTCDate()}/${newDate.getUTCMonth()+1}/${newDate.getUTCFullYear()}`
                updatedSlots.push(schedule);
            })
        }

        let finalSessionSlot = [...sessionSlots,...updatedSlots];

        console.log(finalSessionSlot);

        await sessionModel.bulkCreate(finalSessionSlot);

        res.json({
            message: "Slot added successfully",
            response: true
        })

    } catch (err) {
        console.log(err);

        res.json({
            message: "Something went wrong!!",
            response: false
        });
    }
}

// update schedule

const updateScheduleController = async(req,res) => {
    try {

        let currentTimeZone = new Date();
        let timeZone = new Date();

        timeZone.setDate(timeZone.getDate() + 6);
        let lastDate = `${timeZone.getDate()}/${timeZone.getMonth()+1}/${timeZone.getFullYear()}`

        let getSessionDate = await sessionModel.findOne({
            where : {
                date : lastDate
            }
        })

        if(getSessionDate === null) {
            currentTimeZone.setDate(currentTimeZone.getDate() - 1);
            let previousDate = `${currentTimeZone.getDate()}/${currentTimeZone.getMonth()+1}/${currentTimeZone.getFullYear()}`;
            
            // await sessionModel.update({date : lastDate,sessionCount : 30},{
            //     where : 
            // })
        }

        res.json({
            getSessionDate
        });
         

    } catch(err) {
        console.log(err);
        
        res.json({
            message : "Something went wrong !!",
            response : false
        })
    }
}


module.exports = {
    partnerInfoController,
    updateAmenitiesController,
    addSessionSlotsController,
    gymInfoController,
    updateScheduleController
}