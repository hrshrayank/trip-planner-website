import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { HotelSection } from "@/components/view-trip/HotelSection";
import { InfoSection } from "@/components/view-trip/InfoSection";
import { VisitSection } from "@/components/view-trip/VisitSection";
import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const ViewTrip = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState([]);
  const getTripData = async () => {
    const docRef = doc(db, "trips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTripData(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      toast("No Trip Found");
    }
  };
  useEffect(() => {
    getTripData();
  }, [tripId]);
  return (
    <div>
      <Navbar />
      <div className="p-10 md:px-20 lg:px-44 xl:px-56">
        {/* Information Section */}
        <InfoSection trip={tripData} />
        {/* Hotels */}
        <HotelSection trip={tripData} />
        {/* Daily plan */}
        <VisitSection trip={tripData} />
      </div>
      <Footer/>
    </div>
  );
};
