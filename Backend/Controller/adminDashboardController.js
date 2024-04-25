const { response } = require("express");
const membershipDetailsModel = require('../Models/membershipModel.config');
const userSignupModel = require('../Models/signUpModel');
const partnerLoginModel = require('../Models/partnerLoginModel');
const { where, Op } = require("sequelize");
const sequelize = require("../databaseConnection");

// admin Token Check...

const adminTokenCheckController = (req, res) => {
    try {
        res.json({
            response: true,
            message: "Valid Token"
        })
    } catch (err) {
        res.json({
            response: false,
            message: "Something went wrong !!"
        })
    }
}


// add Membership API

const addMembershipController = async (req, res) => {
    try {

        let { membershipName, amount, validity, description } = req.body;

        await membershipDetailsModel.create({
            membershipName,
            amount,
            validity,
            description,
            status: "Active"
        })

        res.json({
            message: "Added Membership Successfully",
            response: true
        })

    } catch (err) {

        console.log(err);
        res.json({
            message: "Something went wrong !!",
            response: false
        })

    }
}


// Fetch all membership plan

const getAllMembershipDetailsController = async (req, res) => {
    try {

        let membershipDetails = await membershipDetailsModel.findAll({
            attributes: ['membershipName', 'amount', 'validity', 'description', 'status', 'id'],
            order: sequelize.col('id')
        });

        if (membershipDetails) {

            res.json({
                message: "Membership details send",
                response: true,
                data: membershipDetails
            })

        } else {

            res.json({
                message: "Data does get Properly",
                response: false
            })

        }
    } catch (err) {

        console.log(err)

        res.json({
            message: "Something went wrong !!",
            response: false
        })

    }
}


// update the membership plan

const updateMembershipController = async (req, res) => {
    try {
        let id = req.query.id;
        let { membershipName, amount, validity, description } = req.body;


        await membershipDetailsModel.update({
            membershipName,
            amount,
            validity,
            description
        }, {
            where: {
                id: id
            }
        })

        res.json({
            message: "Plan Updated Successfully",
            response: true
        })

    } catch (err) {
        console.log(err);

        res.json({
            message: "Something went wrong !!",
            response: false
        })
    }
}


// delete the membership (making the plan status to Inactive)

const deleteMembershipController = async (req, res) => {

    try {
        let id = req.query.id;

        await membershipDetailsModel.update(
            { status: 'Deactivated' },
            {
                where: {
                    id: id
                }
            }
        )

        res.json({
            message: "The plan is No more Active",
            response: true
        })
    } catch (err) {
        console.log(err)

        res.json({
            message: "Something went wrong !!",
            response: true
        })

    }
}

// display user information on the admin Portal
const getUserInfoController = async (req, res) => {
    try {
        let userInfo = await userSignupModel.findAll({
            attributes: ['id', 'fullName', 'city', 'mobileNumber', 'email'],
            order: sequelize.col('id')
        })

        res.json({
            message: "User Information",
            response: true,
            data: userInfo
        })

    } catch (err) {
        console.log(err);

        res.json({
            message: "Something went wrong !!",
            response: false
        })
    }
}

// apply search on user info on the admin portal
const searchUserController = async (req, res) => {
    try {

        let searchText = req.query.searchText;

        let userInfo = await userSignupModel.findAll({
            attributes: ['id', 'fullName', 'city', 'mobileNumber', 'email'],
            where: {
                [Op.or]: [
                    {
                        fullName: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    },
                    {
                        city: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    },
                    {
                        email: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    },
                    sequelize.where(sequelize.cast(sequelize.col('mobileNumber'), 'VARCHAR'), {
                        [Op.iLike]: `%${searchText}%`
                    })
                ]
            },
            order: sequelize.col('id')
        })

        res.json({
            message: "Search User Information",
            response: true,
            data: userInfo
        })

    } catch (err) {
        console.log(err);

        res.json({
            message: "Something went wrong !!",
            response: false
        })
    }
}


// display partners information on the admin portal
const getPartnerInfoController = async (req, res) => {
    try {
        let partnerInfo = await partnerLoginModel.findAll({
            attributes: ['id', 'fullName', 'mobileNumber', 'email', 'status'],
            order: sequelize.col('id')
        })

        res.json({
            message: "Partner Information",
            response: true,
            data: partnerInfo
        })

    } catch (err) {
        console.log(err);

        res.json({
            message: "Something went wrong !!",
            response: false
        });
    }
}

// apply search on partner info on the admin portal
const searchPartnerController = async (req, res) => {
    try {

        let searchText = req.query.searchText;

        let searchPartner = await partnerLoginModel.findAll({
            attributes: ['id', 'fullName', 'mobileNumber', 'email', 'status'],
            where: {
                [Op.or]: [
                    sequelize.where(sequelize.cast(sequelize.col('mobileNumber'), 'VARCHAR'), {
                        [Op.iLike]: `%${searchText}%`
                    }),
                    {
                        fullName: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    },

                    {
                        email: {
                            [Op.iLike]: `%${searchText}%`
                        }
                    }

                ]
            },
            order: sequelize.col('id')
        })

        res.json({
            message: "Search Partner Info",
            response: true,
            data: searchPartner
        })

    } catch (err) {
        console.log(err);

        res.json({
            message: "Something went wrong !!",
            response: false
        });
    }
}

const filterPartnerController = async(req,res) => {
    try{

        let filterInfo = Object.values(req.query);
        
        let partnerFilterData = await partnerLoginModel.findAll({
            attributes : ['id', 'fullName', 'mobileNumber', 'email', 'status'] ,
            where : {
                status : {
                    [Op.in] : filterInfo
                }
            }
        })

        res.json({
            message : "Data filtered Successfully" ,
            response : true , 
            data : partnerFilterData
        })

    } catch(err) {
        console.log(err);

        res.json({
            message : "Something went wrong !!",
            response : false
        });
    }
}

module.exports = {
    adminTokenCheckController,
    addMembershipController,
    getAllMembershipDetailsController,
    updateMembershipController,
    deleteMembershipController,
    getPartnerInfoController,
    getUserInfoController,
    searchPartnerController,
    searchUserController,
    filterPartnerController
}