import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";

type Props = {
  handleClick: (m: string) => void;
};

const MenuBar = ({handleClick}: Props) => {
  return (
    <Menubar className="flex flex-row space-between">
      <MenubarMenu>
        <MenubarTrigger onClick={()=>handleClick("Plans")}>Plans</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={()=>handleClick("Itinerary")}>Budget</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={()=>handleClick("Route")}>Travel Route</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
};

export default MenuBar;