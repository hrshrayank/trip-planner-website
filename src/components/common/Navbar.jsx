import React, { useState } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

export const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDailog, setOpenDailog] = useState(false);

  const handleLogin = useGoogleLogin({
    onSuccess: (response) => GetUserProfile(response),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    console.log(tokenInfo);
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpenDailog(false);
        window.location.reload();
        // generateTrip();
      });
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <Link to={"/"}>
        <img src="/mainlogo.png" className="w-28 md:w-40" />
      </Link>
      <div>
        {user ? (
          <div className="flex justify-center items-center gap-1 md:gap-3">
            <Link to={"/create-trip"}>
              <Button variant="outline" className="rounded-full">
                Create Trips
              </Button>
            </Link>
            <Link to={"/my-trips"}>
              <Button variant="outline" className="rounded-full">
                My Trips
              </Button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  className="rounded-full h-[35px] w-[35px]"
                />
              </PopoverTrigger>
              <PopoverContent className="w-48 hover:bg-gray-100 cursor-pointer">
                <h2
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Sign In</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogDescription>
                  <img src="/mainlogo.png" className="w-28 md:w-40" />
                  <h2 className="font-bold text-lg mt-7">
                    Sign In with Google
                  </h2>
                  <p> Sign In to the App with Google authentication </p>
                  <Button
                    className="w-full mt-5 flex items-center gap-2 "
                    onClick={handleLogin}
                  >
                    <FcGoogle className="h-5 w-5" /> Sign In with Google
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
