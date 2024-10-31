"use client";
import React, { useState } from "react";
import MenuBar from "../CustomComponent/MenuBar";
import { useRouter } from "next/navigation";
import CreateItinerary from "../TravelComponent/CreateItinerary";
import ShowPlans from "../TravelComponent/ShowPlans";
import FilterByDate from "../CustomComponent/FilterByDate";
import { Button } from "../ui/button";

type Props = {};

const Home = (props: Props) => {
  const [menu, setMenu] = useState<string>("Plans");
  const router = useRouter();

  const handleClick = (m: string) => {
    setMenu(m);
  };

  const handleCreateForm = () => {
    router.push("/home/create-itinerary");
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };
  return (
    <div className="h-[100vh] overflow-auto">
      {/* <div className="flex justify-between py-[2vh] items-center mx-12">
       <div className="flex flex-1 justify-center">
        <MenuBar handleClick={handleClick} />
      </div> 
      
      </div> */}
      <div className="flex justify-center px-2 py-4 text-2xl font-semibold italic text-[#50b3ea]">Travel Planner</div>
      <div className="flex justify-end mr-4 py-4">
        <Button className="bg-[#eb597f] hover:bg-[#eb597f] hover:text-cyan-800 font-semibold" onClick={handleLogOut}>Logout</Button>
      </div>
      <div className="flex justify-end mr-4">
        <Button className="bg-[#f2f6f9] border-2 border-[#50b3ea] text-[#50b3ea] hover:bg-[#50b3ea] hover:text-white font-semibold rounded-none text-md px-4 py-6" onClick={handleCreateForm}>Create Itinerary</Button>
      </div>
      <div className="px-8 py-4">
       <FilterByDate />
      </div>

      
    </div>
  );
};

export default Home;
