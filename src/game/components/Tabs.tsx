import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Export } from "../../tools/Export";
import { Generator } from "../../tools/Generator";
import { History } from "../../tools/History";
import { MainMenu } from "..";
import { ArrowPathIcon, ArrowUpOnSquareIcon, ClockIcon, HomeIcon } from "@heroicons/react/20/solid";
import React from "react";

type TabType = {
  label: string;
  value: string;
  icon: React.ElementType;
  component: React.ReactNode;
}[];

export function TabsGroup() {
  const data: TabType = [
    {
      label: "Menu",
      value: "menu",
      icon: HomeIcon,
      component: <MainMenu />,
    },
    {
      label: "Export",
      value: "export",
      icon: ArrowUpOnSquareIcon,
      component: <Export />,
    },
    {
      label: "Générateur",
      value: "generate",
      icon: ArrowPathIcon,
      component: <Generator />,
    },
    {
      label: "Historique",
      value: "history",
      icon: ClockIcon,
      component: <History />,
    }
  ];

  return (
    <Tabs value="menu">
      <TabsHeader
        className="bg-deep-purple-500"
        indicatorProps={{
          className: "bg-gray-900",
        }}>
        {data.map(({ label, value, icon }) => (
          <Tab key={value} value={value}>
            <div className="font-poppinslight flex items-center gap-2 text-white">
              {React.createElement(icon, { className: "w-5 h-5" })}
              {label}
            </div>
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, component }) => (
          <TabPanel key={value} value={value}>
            {component}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}