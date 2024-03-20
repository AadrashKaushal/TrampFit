import { Button } from "@/components/ui/button"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { useState } from 'react';
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useRouter } from "next/router";

const login = () => {

    let [text, setText] = useState();
    let [title, setTitle] = useState("Login");
    let [mobileNumber, setMobileNumber] = useState();
    let [otp, setOtp] = useState();
    let [otpController, setController] = useState(true);
    let [buttonText, setButtonText] = useState("Request OTP");
    let [fieldController, setFieldController] = useState(true);
    let [mobileValidation, setMobileValidation] = useState("");
    let [otpValidation, setOtpValidation] = useState("");
    let [userDetails,setUserDetails] = useState({
        fullName:"",
        email:"",
        gender:"",
        city:"",
        mobileNumber:""
    });

    const selectData = (value,name) =>{
        if(name === 'gender'){
            userDetails.gender = value;
            setUserDetails({...userDetails})
        } else{
            userDetails.city = value;
            setUserDetails({...userDetails})
        }
    }

    const getText = (e) => {
        if (e.target.name == 'mobileNumber') {
            setMobileNumber(e.target.value);
        } else if(e.target.name == 'otp') {
            setOtp(e.target.value); 
        } else if(e.target.name == 'name'){
            userDetails.fullName = e.target.value
            setUserDetails({...userDetails});
        } else if(e.target.name == 'email'){
            userDetails.email = e.target.value
            setUserDetails({...userDetails});
        } else if (e.target.name == 'city'){
            userDetails.city = e.target.value;
            setUserDetails({...userDetails})
        } else{
            userDetails.gender = e.target.value;
            setUserDetails({...userDetails});
        }
    }
    let router = useRouter()
    const sendOtp = async(e) => {
        if (buttonText === 'Request OTP') {
            if (mobileNumber == '' || mobileNumber == null) {
                setMobileValidation("Mobile number is mandatory");
            } else {
                e.preventDefault();
                setController(false);
                setText(mobileNumber);
                setButtonText("Verify OTP")
                setMobileNumber("");
                setOtp("");
            }

        } else if (buttonText === 'Verify OTP') {
            if (otp == '' || otp == null) {
                setOtpValidation("OTP is mandatory");
            } else if (otp == '123456') {
                toast.success("OTP Verified Successfully")
                setFieldController(false);
                setTitle("User Details")
                setButtonText("Sign Up")
            } else {
                toast.error("Wrong OTP !!")
            }
        } else {
            userDetails.mobileNumber = text
            setUserDetails({...userDetails})
            const option = {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                } ,
                body: JSON.stringify(userDetails)
            }
            try{
                let userResponse = await fetch('http://localhost/login',option);
                let jsonResponse = await userResponse.json();
                if(jsonResponse.response){
                    toast.success("Sign Up Successfully")
                    setTimeout(()=>{
                        router.push({pathname:'/',query:{
                            name:userDetails.fullName
                        }});
                    },6000)
                } else {
                    toast.error(jsonResponse.message);
                }
            } catch(err) {
                console.log(err)
            }
            

            
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex justify-around">
                <div>
                    <Card className="w-96 mt-20 mb-20">
                        <CardHeader>
                            <CardTitle className="text-green-700">{title}</CardTitle>
                            <CardDescription>{text == null ? "You will recieve a text to validate your number" :
                                fieldController ? "OTP was sent to " :
                                    "Please enter your details"
                            }<span className="font-semibold text-black">{fieldController ? text : ""}</span></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-5">
                                        {
                                            otpController ?
                                                <div className="flex flex-col space-y-2">
                                                    <Input id="mobileNumber" placeholder="Mobile Number" name="mobileNumber" onChange={getText} value={mobileNumber}/>
                                                    <p className="text-red-500 text-xs h-2">{mobileValidation}</p>
                                                </div>
                                                :
                                                fieldController ?
                                                    <>
                                                        <div className="flex flex-col space-y-1">
                                                            <Input placeholder="Enter the OTP" onChange={getText} name="otp" value={otp} />
                                                            <p className="text-red-500 text-xs h-2">{otpValidation}</p>
                                                        </div>
                                                    </> :
                                                    <>
                                                        <Input placeholder="Enter the Name" name="name"  onChange={getText}/>
                                                        <Input name="phoneNumber" className=" font-semibold text-black" value={text} />
                                                        <Input placeholder="Enter the Email" name="email"  onChange={getText}/>
                                                    </>
                                        }
                                        <div className=" flex justify-around space-x-4">
                                            {
                                                fieldController == false && <Select onValueChange={(value)=>{selectData(value,'gender')}}>
                                                    <SelectTrigger id="framework">
                                                        <SelectValue placeholder="Gender" name="gender" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            }

                                            {
                                                fieldController == false && <Select onValueChange={(value)=>{selectData(value,'city')}}>
                                                    <SelectTrigger id="framework">
                                                        <SelectValue placeholder="City" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="Jalandhar">Jalandhar</SelectItem>
                                                        <SelectItem value="Amritsar">Amritsar</SelectItem>
                                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                                        <SelectItem value="Gurugram">Gurugram</SelectItem>
                                                        <SelectItem value="Noida">Noida</SelectItem>
                                                        <SelectItem value="Kanpur">Kanpur</SelectItem>
                                                        <SelectItem value="Banglore">Banglore</SelectItem>
                                                        <SelectItem value="Mathura">Mathura</SelectItem>
                                                        <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                                                        <SelectItem value="Mohali">Mohali</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button className=" hover:bg-green-700 bg-green-600 w-96 mb-5" onClick={sendOtp}>{buttonText}</Button>
                            <ToastContainer />
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default login;