import { Navbar } from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  selectBudgetOptions,
  SelectTravelsList,
} from "@/constants/options";
import { chatSession } from "@/service/AIModal";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { Loading } from "@/components/common/Loading";
import { useNavigate } from "react-router-dom";

export const CreateTrip = () => {
  const navigate = useNavigate();
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleLogin = useGoogleLogin({
    onSuccess: (response) => GetUserProfile(response),
    onError: (error) => console.log(error),
  });

  const generateTrip = async () => {
    let errorMessage = "";

    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (formData?.noOfDays > 5 || formData?.noOfDays <= 0) {
      errorMessage = "Number of days should be between 1 and 5.";
    } else {
      if (!formData?.location) {
        errorMessage = "Location is required.";
      } else if (!formData?.budget) {
        errorMessage = "Budget is required.";
      } else if (!formData?.traveller) {
        errorMessage = "Traveller details are required.";
      }
    }

    if (errorMessage) {
      toast(errorMessage);
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveller)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    try {
      console.log(FINAL_PROMPT, "prompt");
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result, "Final");
      saveTrip(result?.response?.text());
    } catch (error) {
      console.error("Error sending message:", error);
      toast("An error occurred while generating the trip.");
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async (tripData) => {
    setLoading(true);

    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem("user"));

    let parsedTripData;
    try {
      console.log(tripData);
      parsedTripData = JSON.parse(tripData);
      if (Array.isArray(parsedTripData) && Array.isArray(parsedTripData[0])) {
        parsedTripData = {
          hotels: parsedTripData[0],
          plans: parsedTripData[1],
        };
      }
    } catch (error) {
      console.error("Error parsing tripData:", error);
      toast("An error occurred while parsing the trip data.");
      setLoading(false);
      return;
    }

    try {
      await setDoc(doc(db, "trips", docId), {
        userSelection: formData,
        tripData: parsedTripData,
        userEmail: user?.email,
        id: docId,
      });
      setLoading(false);
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      setLoading(false);
      console.error("Error saving trip:", error);
      toast("An error occurred while saving the trip.");
    }
  };

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
        setOpenDialog(false);
        generateTrip();
      });
  };
  return (
    <>
      <Navbar />
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
        <h2 className="font-bold text-3xl">
          Tell us your travel preferences ⛱️ 🌴{" "}
        </h2>
        <p className="mt-3 text-gray-500 text-xl">
          Just provide some basic information, and our trip planner will
          generate a customized itinerary based on your preferences.
        </p>

        <div className="mt-10 flex flex-col gap-10">
          <div>
            <h2 className="text-xl my-3 font-medium">
              What is destination of choice? *️
            </h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange("location", v);
                },
              }}
            />
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">
              How many days are you planning your trip? *️
            </h2>
            <Input
              placeholder={"Ex.3"}
              type="number"
              onChange={(e) => handleInputChange("noOfDays", e.target.value)}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget ? *️</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {selectBudgetOptions.map((item, index) => (
              <div
                key={index}
                className={`p-4 border cursor-pointer rounded-lg 
                hover:shadow-lg
                ${formData?.budget === item.title && "shadow-lg border-black"}`}
                onClick={() => handleInputChange("budget", item.title)}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-gray-500 text-sm">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure ? *️
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                  ${
                    formData?.traveller === item.people &&
                    "shadow-lg border-black"
                  }`}
                onClick={() => handleInputChange("traveller", item.people)}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-gray-500 text-sm">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className="my-10 flex justify-center">
          <Button onClick={generateTrip} disabled={loading}>
            Generate Trip {loading && <Loading />}
          </Button>
        </div>
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="/mainlogo.png" className="w-28 md:w-40" />
                <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
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
      </div>
    </>
  );
};
