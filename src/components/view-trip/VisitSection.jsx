import React from "react";
import { PlaceCardItem } from "./PlaceCardItem";

export const VisitSection = ({ trip }) => {
  return (
    <div>
      <h2 className="font-bold text-xl my-5">Places to Visit</h2>
      <div>
        {trip?.tripData?.itinerary?.map((item, index) => (
          <div>
            <h2 className="font-medium text-lg">Day : {item.Day}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xxl:grid-cols-3 gap-3">
            {item?.Plan?.map((place, index) => (
              <div className="my-3 ">
                <h2 className="font-medium text-sm text-orange-700">
                  {place.Time}
                </h2>
                <PlaceCardItem place={place} />
                {/* <h2>{place.PlaceName}</h2> */}
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
