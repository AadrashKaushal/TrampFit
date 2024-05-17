import PartnerSideBar from "@/components/PartnerSideBar";
import { Avatar } from "@mui/material";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

export default function partnerInfo() {
  return (
    <div>
      <PartnerSideBar />
      <div className="flex flex-col min-h-screen">
        <div className=" flex">
          <div className=" mx-auto mt-12">
            <Avatar
              className=" w-36 h-36 text-6xl bg-black"
              src="/avtar.png"
            ></Avatar>
          </div>
        </div>
        <div>
          <h1 className=" ml-96 text-3xl mb-4 ">Personal Information</h1>
          <div className="flex ml-96 mb-10">
            <div className="mr-32 space-y-2">
              <Label
                htmlFor="name"
                className="text-lg text-green-600 font-normal"
              >
                Name
              </Label>
              <Input
                type="text"
                className=" w-96 text-lg border-2"
              />
            </div>
            <div className="ml-32 space-y-2">
              <Label
                htmlFor="city"
                className="text-lg text-green-600 font-normal"
              >
                City
              </Label>
              <Input
                type="text"
                className=" w-96 text-lg border-2"
              />
            </div>
          </div>
        </div>
        <div>
          <h1 className=" ml-96 text-3xl mb-4 mt-4 ">Contact Information</h1>
          <div className="flex ml-96 mb-10">
            <div className="mr-32 space-y-2">
              <Label
                htmlFor="name"
                className="text-lg text-green-600 font-normal"
              >
                Mobile Number
              </Label>
              <Input
                type="text"
                className=" w-96 text-lg border-2"
              />
            </div>
            <div className="ml-32 space-y-2 mb-10">
              <Label
                htmlFor="city"
                className="text-lg text-green-600 font-normal"
              >
                Email Address
              </Label>
              <Input
                type="text"
                className=" w-96 text-lg border-2"
              />
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}