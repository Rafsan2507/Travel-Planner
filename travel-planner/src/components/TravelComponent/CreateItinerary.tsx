"use client";
import React, { useState } from "react";
import TravelItineraryForm from "./TravelItineraryForm";
import { Button } from "../ui/button";
import { set } from "date-fns";

function CreateItinerary() {
  const [itineraryForms, setItineraryForms] = useState<number[]>([0]);

  const handleAddItineraryForm = () => {
    setItineraryForms([...itineraryForms, itineraryForms.length]);
  };

  const handleDeleteItineraryForm = () => {
   setItineraryForms(itineraryForms.slice(0, -1));
  }

  return (
    <div>
      <div className="space-y-6 mt-4">
        {itineraryForms.map((id) => (
          <TravelItineraryForm key={id} itineraryId={id} handleDeleteItineraryForm={handleDeleteItineraryForm}/>
        ))}
      </div>
      <Button onClick={handleAddItineraryForm}>Add Itinerary</Button>
    </div>
  );
}

export default CreateItinerary;
