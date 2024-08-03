import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getPlaceDetails, PHOTO_REF_URL } from "@/service/globalApi";

export const PlaceCardItem = ({ place }) => {
  const [photoUrl, setPhotoUrl] = useState();
  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.PlaceName,
    };
    const result = await getPlaceDetails(data).then((response) => {
      console.log(response.data.places[0].photos[3].name);
      const photoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        response.data.places[0].photos[3].name
      );
      setPhotoUrl(photoUrl);
    });
  };
  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);
  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${place?.PlaceName}`}
      target="_blank"
    >
      <div className="border p-3 rounded-xl flex gap-5 hover:scale-105 transition-all hover:shadow-sm cursor-pointer">
        <img
          src={photoUrl ? photoUrl : "/placeholder.jpg"}
          className="w-[100px] h-[130px] rounded-xl object-cover"
        />
        <div>
          <h2 className="font-bold text-lg">{place.PlaceName}</h2>
          <p className="text-sm text-gray-600">{place.PlaceDetails}</p>
          <h2 className="mt-2">🕗 {place.TimeTravel}</h2>
          {/* <Button> <FaMapLocationDot /></Button> */}
        </div>
      </div>
    </Link>
  );
};
