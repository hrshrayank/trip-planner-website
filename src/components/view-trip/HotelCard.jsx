import { getPlaceDetails, PHOTO_REF_URL } from "@/service/globalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const HotelCard = ({ item, index }) => {
  const [photoUrl, setPhotoUrl] = useState();
  const GetPlacePhoto = async () => {
    const data = {
      textQuery: item?.HotelName,
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
    item && GetPlacePhoto();
  }, [item]);
  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${item?.HotelName}${item?.HotelAddress}`}
      target="_blank"
    >
      <div id={index} className="hover:scale-105 transition-all cursor-pointer">
        <img
          src={photoUrl}
          className="rounded-xl h-[180px] w-full object-cover"
        />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{item?.HotelName}</h2>
          <h2 className="text-xs text-gray-500">📍 {item?.HotelAddress}</h2>
          <h2 className="text-sm">💰 {item?.Price}</h2>
          <h2 className="text-sm">⭐ {item?.Rating}</h2>
        </div>
      </div>
    </Link>
  );
};
