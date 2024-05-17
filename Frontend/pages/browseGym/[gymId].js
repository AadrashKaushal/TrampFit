import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Separator } from "@/components/ui/separator";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import HeatPumpIcon from '@mui/icons-material/HeatPump';
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "@/components/Popup";
import { loadStripe } from '@stripe/stripe-js';

export async function getStaticPaths() {
    const res = await fetch('http://localhost/browseGym', { method: "GET" });
    const getAllGymDetails = await res.json();

    // Get the paths we want to pre-render based on gymIds
    const paths = getAllGymDetails.data.map(val => ({
        params: { gymId: val.id.toString() }, // Make sure to use gymId instead of id
    }));

    // Return the paths we want to pre-render
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    // Fetch data for the specific gym using params.gymId
    const res = await fetch(`http://localhost/browseGym/gymViewDetail?gymId=${params.gymId}`, { method: "GET" });
    const gymViewDetail = await res.json();
    // Pass gym data as props

    let gymLogo = gymViewDetail.data.gymLogo;
    gymLogo = gymLogo.substring(18);
    let gymResult = gymLogo.replace(/\\/g, '/')
    gymViewDetail.data.gymLogo = gymResult

    let interiorPhoto = gymViewDetail.data.interiorPhoto;
    interiorPhoto = interiorPhoto.substring(18);
    let interiorResult = interiorPhoto.replace(/\\/g, '/')
    gymViewDetail.data.interiorPhoto = interiorResult

    return {
        props: {
            gymViewDetail,
        },
    };
}


const calculateDay = (currentDay) => {
    let latestDay = "";
    switch (currentDay) {
        case 1:
            latestDay = "Mon"
            break;

        case 2:
            latestDay = "Tue"
            break;

        case 3:
            latestDay = "Wed"
            break;

        case 4:
            latestDay = "Thu"
            break;

        case 5:
            latestDay = "Fri"
            break;

        case 6:
            latestDay = "Sat"
            break;

        case 0:
            latestDay = "Sun"
            break;
    }

    return latestDay;
}


const calculateSevenDay = (currentDate) => {
    let reserveWorkout = [];
    let reserveDay = [];

    let nextDate = new Date(currentDate);
    let current = currentDate;
    reserveWorkout.push(current.getDate())

    reserveDay.push("/ " + calculateDay(current.getDay()));

    for (let i = 1; i <= 6; i++) {
        nextDate.setDate(current.getDate() + 1);
        reserveDay.push("/ " + calculateDay(nextDate.getDay()))
        reserveWorkout.push(nextDate.getDate())
        current = nextDate;
    }
    let finalReservation = [];
    finalReservation.push(reserveWorkout);
    finalReservation.push(reserveDay);
    return finalReservation;
}
export default function gymDetail({ gymViewDetail }) {

    let currentDate = new Date();
    let reserveWorkout = calculateSevenDay(currentDate);

    let [membershipData, setMembershipData] = useState([]);
    let [payableAmount, setPayableAmount] = useState();
    let [nextStart, setNextStart] = useState(false);

    let [membershipDetails, setMembershipDetails] = useState({
        membershipId: "",
        membershipPlan: "",
        selectPlanValidity: "",
        payableAmount: "",
        planDescription: ""
    })
    let [start, setStart] = useState(false);

    let [subscriptionId, setSubscriptionId] = useState();

    useEffect(() => {
        try {

            fetch('http://localhost/getActiveMembership', { method: "GET" }).then(async (res) => {

                let membershipData = await res.json();
                setPayableAmount(membershipData.data[0].amount)

                membershipDetails.membershipId = membershipData.data[0].id
                membershipDetails.membershipPlan = membershipData.data[0].membershipName
                membershipDetails.selectPlanValidity = membershipData.data[0].validity
                membershipDetails.payableAmount = membershipData.data[0].amount
                membershipDetails.planDescription = membershipData.data[0].description

                setMembershipDetails({ ...membershipDetails });

                setMembershipData(membershipData.data)

            }).catch((err) => {
                console.log(err);
            })

        } catch (err) {
            console.log(err);
        }

    }, [])

    let [firstPlanStyle, setFirstPlanStyle] = useState({
        textColor: "text-white",
        bgColor: "bg-green-600"
    })

    let [secondPlanStyle, setSecondPlanStyle] = useState({
        textColor: "",
        bgColor: ""
    })

    let [thirdPlanStyle, setThirdPlanStyle] = useState({
        textColor: "",
        bgColor: ""
    })

    let [changePara, setChangePara] = useState(false);
    let [changeInfo, setChangeInfo] = useState(false);


    let [firstPara, setFirstPara] = useState({
        fontSize: "font-semibold",
        textColor: "text-black",
        border: "border-b-2",
        borderColor: "border-green-600"
    })

    let [secondPara, setSecondPara] = useState({
        fontSize: "",
        textColor: "text-gray-300",
        border: "",
        borderColor: ""
    })

    const firstParaSelect = () => {
        setChangePara(false)

        firstPara.fontSize = "font-semibold",
            firstPara.textColor = "text-black",
            firstPara.border = "border-b-2",
            firstPara.borderColor = "border-green-600"

        setFirstPara({ ...firstPara })

        secondPara.fontSize = ""
        secondPara.textColor = "text-gray-300"
        secondPara.border = ""
        secondPara.borderColor = ""

        setSecondPara({ ...secondPara })
    }

    const secondParaSelect = () => {
        setChangePara(true)

        secondPara.fontSize = "font-semibold",
            secondPara.textColor = "text-black",
            secondPara.border = "border-b-2",
            secondPara.borderColor = "border-green-600"

        setSecondPara({ ...secondPara })

        firstPara.fontSize = ""
        firstPara.textColor = "text-gray-300"
        firstPara.border = ""
        firstPara.borderColor = ""

        setFirstPara({ ...firstPara })
    }



    const firstPlan = (i) => {
        setChangeInfo(false)

        membershipDetails.membershipId = membershipData[i].id;
        membershipDetails.membershipPlan = membershipData[i].membershipName;
        membershipDetails.selectPlanValidity = membershipData[i].validity;
        membershipDetails.payableAmount = membershipData[i].amount;
        membershipDetails.planDescription = membershipData[i].description;

        setMembershipDetails({ ...membershipDetails });

        setPayableAmount(membershipData[0].amount)

        firstPlanStyle.textColor = "text-white"
        firstPlanStyle.bgColor = "bg-green-600"

        setFirstPlanStyle({ ...firstPlanStyle });

        secondPlanStyle.textColor = ""
        secondPlanStyle.bgColor = ""

        setSecondPlanStyle({ ...secondPlanStyle });

        thirdPlanStyle.textColor = ""
        thirdPlanStyle.bgColor = ""

        setThirdPlanStyle({ ...thirdPlanStyle })
    }

    const secondPlan = (i) => {
        setChangeInfo(true)

        membershipDetails.membershipId = membershipData[i].id;
        membershipDetails.membershipPlan = membershipData[i].membershipName;
        membershipDetails.selectPlanValidity = membershipData[i].validity;
        membershipDetails.payableAmount = membershipData[i].amount;
        membershipDetails.planDescription = membershipData[i].description;

        setMembershipDetails({ ...membershipDetails });

        setPayableAmount(membershipData[1].amount)

        secondPlanStyle.textColor = "text-white"
        secondPlanStyle.bgColor = "bg-green-600"

        setSecondPlanStyle({ ...secondPlanStyle });

        thirdPlanStyle.textColor = ""
        thirdPlanStyle.bgColor = ""

        setThirdPlanStyle({ ...thirdPlanStyle })

        firstPlanStyle.textColor = ""
        firstPlanStyle.bgColor = ""

        setFirstPlanStyle({ ...firstPlanStyle })
    }


    const thirdPlan = (i) => {
        setChangeInfo(true)
        membershipDetails.membershipId = membershipData[i].id;
        membershipDetails.membershipPlan = membershipData[i].membershipName;
        membershipDetails.selectPlanValidity = membershipData[i].validity;
        membershipDetails.payableAmount = membershipData[i].amount;
        membershipDetails.planDescription = membershipData[i].description;

        setMembershipDetails({ ...membershipDetails });

        setPayableAmount(membershipData[2].amount)

        thirdPlanStyle.textColor = "text-white"
        thirdPlanStyle.bgColor = "bg-green-600"

        setThirdPlanStyle({ ...thirdPlanStyle });

        firstPlanStyle.textColor = ""
        firstPlanStyle.bgColor = ""

        setFirstPlanStyle({ ...firstPlanStyle })

        secondPlanStyle.textColor = ""
        secondPlanStyle.bgColor = ""

        setSecondPlanStyle({ ...secondPlanStyle });

    }
    const notConfirmed = () => {
        setNextStart(false);
    }

    const openConfirmation = () => {
        setNextStart(true);
    }

    const handlePayment = async () => {
        setNextStart(false);
        const stripePromise = await loadStripe(process.env.payment_gateway_publish_key);

        try {
            let token = localStorage.getItem("token");

            if (token) {
                const option = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(membershipDetails)
                }

                let paymentResponse = await fetch('http://localhost/createSubscription', option);
                paymentResponse = await paymentResponse.json();

                if (paymentResponse.response) {
                    if (paymentResponse.sessionId) {

                        stripePromise.redirectToCheckout({
                            sessionId: paymentResponse.sessionId,
                        });

                    } else {

                        setStart(true);
                        setSubscriptionId(paymentResponse.subscriptionId);
                    }
                } else {
                    toast.error(paymentResponse.message);
                    setTimeout(() => {
                        router.push('/browseGym');
                    }, 3000);
                }
            } else {
                router.push('/login')
            }


        } catch (err) {
            console.log(err);
        }

    }

    const handleClose = () => {
        setStart(false);
    }

    const handleDelete = async () => {
        try {
            const option = {
                method: "DELETE"
            }
            let response = await fetch(`http://localhost/cancelSubscription?subscriptionId=${subscriptionId}`, option);
            response = await response.json();

            if (response.response) {
                setStart(false);
                toast.success("Plan has no more Exists");
            } else {
                toast.error("Something Went wrong !!");
            }

        } catch (err) {
            console.log(err);
        }
    }


    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex mt-10 ml-10 space-x-6">
                    <div className=" space-y-10 mb-20">
                        <div className=" w-[60rem] h-56 border-2 rounded-sm mb-5 ">
                            <h1 className=" text-3xl font-semibold mt-3 ml-5">{gymViewDetail.data.gymName}</h1>
                            <div className="flex ml-5 mt-5 space-x-8">
                                <Image
                                    src={gymViewDetail.data.gymLogo} // Path to your image
                                    alt="Description of the image" // Description of the image for accessibility
                                    width={100} // Reduced width of the image
                                    height={150} // Reduced height of the image
                                    className="object-cover rounded-md "
                                />
                                <div>
                                    <div className="flex space-x-2">
                                        <AccessTimeFilledIcon className=" text-gray-400" />
                                        <p className=" text-md font-semibold">Opening Time</p>
                                    </div>
                                    <p className="text-lg ml-12 font-semibold">{gymViewDetail.data.openingTime}-{gymViewDetail.data.closingTime}</p>
                                </div>

                                <div className="w-16 h-16 bg-green-600 rounded-md pt-2">
                                    <p className="text-white text-center">20+</p>
                                    <p className="text-white text-center">Reviews</p>
                                </div>

                                <div>
                                    <div className="flex space-x-2">
                                        <LocationCityIcon className=" text-gray-400" />
                                        <p className=" text-md font-semibold">Location</p>
                                    </div>
                                    <p className="text-md">{gymViewDetail.data.gymLocation}</p>
                                    <p className="text-md">{gymViewDetail.data.gymCity}</p>
                                </div>
                            </div>
                        </div>

                        <div className=" w-[60rem] h-72 border-2 rounded-sm mb-5">
                            <div className=" mt-3 mr-5 ml-5 space-y-4">
                                <p className=" text-md ">
                                    Try the best fitness classes and premium gyms with one pass to india's Largest Fitness Network
                                    at no extra cost. Simply choose and reserve your preferred slot to workout hassle-free
                                </p>
                                <h1 className="text-2xl font-semibold">Reserve a Workout</h1>
                                <Separator className="border-gray-400" />
                                <div className=" flex space-x-2">
                                    {
                                        reserveWorkout[0].map((val, i) => {
                                            return (
                                                <div className="h-16 w-40 bg-gray-100 rounded-sm cursor-pointer">
                                                    <p className="text-md text-center mt-3"><span className="font-bold text-2xl">{val}</span>{reserveWorkout[1][i]}</p>
                                                </div>
                                            );
                                        })
                                    }

                                </div>
                                <Separator className="border-gray-400" />
                            </div>
                        </div>

                        <div className="w-[60rem]  h-[30rem] border-2 rounded-sm mb-5 flex space-x-2">
                            <div className="h-96 w-[28rem]">
                                <div className="flex mt-6 ml-5  ">
                                    <p className={`text-xl ${firstPara.fontSize} ${firstPara.textColor} ${firstPara.border} w-60 pb-2 text-center ${firstPara.borderColor} cursor-pointer`} onClick={firstParaSelect}>What is TRAMPFIT ?</p>
                                    <p className={`text-xl ${secondPara.textColor} ${secondPara.border} ${secondPara.fontSize} w-60 pb-2 text-center ${secondPara.borderColor} cursor-pointer`} onClick={secondParaSelect}>How does it work ?</p>
                                </div>
                                {
                                    changePara ?
                                        <div className="ml-5 mt-8">
                                            <ul className=" list-disc ml-5 space-y-4">
                                                <li className="text-md">Register or log in using your mobile number</li>
                                                <li className="text-md">Choose a suitable plan and activate your TRAMPFIT pass</li>
                                                <li className="text-md">Browse through studios and reserve a workout of your choice</li>
                                                <li className="text-md">Attend the session to achieve your fitness goals</li>
                                            </ul>
                                        </div>
                                        :
                                        <div className="ml-5 mt-8">
                                            <ul className=" list-disc ml-5 space-y-4">
                                                <li className="text-md">TRAMPFIT is One membership to India's Largest Fitness Network</li>
                                                <li className="text-md">Across 7,500+ gyms and fitness studios pan-india</li>
                                                <li className="text-md">Access gyms and fitness studios anywhere , anytime-near your home, office or friends place</li>
                                            </ul>
                                        </div>
                                }

                            </div>
                            <div className=" h-80 w-[30rem]  mt-6 mr-5 ">
                                <h1 className="text-green-600 text-xl text-center mt-4 ">CHOOSE PLAN</h1>
                                <div className="flex ml-2  mt-5">
                                    <p className="h-8 w-28 text-xs border font-semibold text-center pt-2 rounded-sm ml-4">BASIC PLAN</p>
                                    <p className="h-8 w-28 text-xs bg-orange-400 text-white  font-semibold text-center pt-2 rounded-sm ml-12">PREMIUM</p>
                                    <p className="h-8 w-28 text-xs border bg-orange-400 text-white font-semibold text-center pt-2 rounded-sm ml-12">Prime</p>
                                </div>
                                <div className="flex space-x-5 ml-2 mr-2 mt-4">
                                    {
                                        membershipData.map((val, i) => {
                                            return (
                                                i === 0 ?
                                                    <div className={`w-36 h-28 border-2 rounded-lg border-green-600 ${firstPlanStyle.bgColor} pt-7 cursor-pointer`} onClick={() => { firstPlan(i) }}>
                                                        <div className="flex justify-center">
                                                            <CurrencyRupeeIcon className={`text-lg ${firstPlanStyle.textColor} mt-0.5`} />
                                                            <p className={`font-bold ${firstPlanStyle.textColor}`}>{val.amount}</p>
                                                        </div>
                                                        <p className={`text-center ${firstPlanStyle.textColor}`}>{val.validity}</p>
                                                    </div> :
                                                    i === 1 ?
                                                        <div className={`w-36 h-28 border-2 rounded-lg border-green-600  ${secondPlanStyle.bgColor} pt-7 cursor-pointer`} onClick={() => { secondPlan(i) }}>
                                                            <div className="flex justify-center">
                                                                <CurrencyRupeeIcon className={`text-lg ${secondPlanStyle.textColor} mt-0.5`} />
                                                                <p className={`font-bold ${secondPlanStyle.textColor} `}>{val.amount}</p>
                                                            </div>
                                                            <p className={`text-center ${secondPlanStyle.textColor}`}>{val.validity}</p>
                                                        </div> :
                                                        <div className={`w-36 h-28 border-2 rounded-lg border-green-600 ${thirdPlanStyle.bgColor} pt-7 cursor-pointer`} onClick={() => { thirdPlan(i) }}>
                                                            <div className="flex justify-center">
                                                                <CurrencyRupeeIcon className={`text-lg mt-0.5 ${thirdPlanStyle.textColor}`} />
                                                                <p className={`font-bold ${thirdPlanStyle.textColor}`}>{val.amount}</p>
                                                            </div>
                                                            <p className={`text-center ${thirdPlanStyle.textColor} `}>{val.validity}</p>
                                                        </div>
                                            );
                                        })
                                    }
                                </div>
                                {
                                    changeInfo ?
                                        <p className="mt-4 text-sm">The new UNLIMITED ACCESS pass to 7,500+ Fitness Centers Across 40+ cities of India !</p> :
                                        <p className="mt-4 text-sm">The same Old Amazing One pass to 7,500+ Fitness Centers Across 40+ cities of India !</p>
                                }
                                <div className="flex justify-between mt-5">
                                    <p className="font-semibold">Payable Amount</p>
                                    <div className="flex mr-2.5">
                                        <CurrencyRupeeIcon className="text-green-600 text-lg mt-1" />
                                        <p className="text-green-600 font-semibold">{payableAmount}</p>
                                    </div>
                                </div>
                                <Button className=" h-12 w-[30rem] mt-10 rounded-md bg-green-600 text-white hover:bg-green-700" onClick={openConfirmation}>PROCEED</Button>
                            </div>
                        </div>
                    </div>
                    <div className=" space-y-4 mb-10">
                        <Image
                            src={gymViewDetail.data.interiorPhoto} // Path to your image
                            alt="Description of the image" // Description of the image for accessibility
                            width={550} // Reduced width of the image
                            height={100} // Reduced height of the image
                            className="object-cover h-72"
                        />
                        <p className="text-2xl ml-5 font-semibold ">About us</p>
                        <Separator className="border-gray-400 w-[29rem] ml-5" />
                        <p className=" ml-5 " >
                            {gymViewDetail.data.gymDescription}
                        </p>

                        <p className="text-2xl font-semibold ml-5">
                            What will you achieve- {gymViewDetail.data.gymName}
                        </p>
                        <Separator className="border-gray-400 w-[29rem] ml-5" />
                        <p className=" ml-5">
                            {gymViewDetail.data.gymQuestion}
                        </p>
                        <p className="text-2xl ml-5 font-semibold">Amenity</p>
                        <Separator className="border-gray-400 w-[29rem] ml-5" />
                        <div className="h-16 w-16 border ml-5 rounded-lg">
                            <HeatPumpIcon className="ml-[1.21rem] mt-4 text-md text-green-600 " />
                        </div>
                        <p className="ml-7 text-sm ">Heater</p>
                        <p className="text-2xl ml-5 font-semibold">Studio Safety & Hygiene</p>
                        <Separator className="border-gray-400 w-[29rem] ml-5" />
                        <ul className="ml-10 list-disc space-y-5 text-gray-400">
                            <li>
                                This fitness studio ensures that the arena
                                remains clean and hygenic for its visitors for a delightful experience.
                            </li>
                            <li>
                                Equipment is disinfected by the staff members, after every workout attemp
                                by a particular visitor.
                            </li>
                            <li>
                                Visitors are requested to keep the area clean throughout their
                                workout session or later
                            </li>
                            <li>
                                They also have a strict policy against user
                                misconduct. Any misdeed or neglilence shall not be entertained by
                                any studio personnel.
                            </li>
                        </ul>
                        {/* <ToastContainer /> */}
                    </div>
                    <Popup open={nextStart} title={"Recurring payment Confirmation"} cancel="No" logout="Yes" logoutEvent={handlePayment} cancelEvent={notConfirmed} />
                    <Popup open={start} contentItem={"Subscription Already exists"} title={"Do you want to cancel the subscription?"} cancel="close" logout="Delete" logoutEvent={handleDelete} cancelEvent={handleClose} />
                </div>
                <Footer />
            </div>
        </>
    )
}