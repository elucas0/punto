import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Export } from "../../tools/Export";
import { Import } from "../../tools/Import";
import { History } from "../../tools/History";
import { MainMenu } from "..";

export function TabsGroup() {
  const data = [
    {
      label: "Menu",
      value: "menu",
      component: <MainMenu />,
    },
    {
      label: "Export",
      value: "export",
      component: <Export />,
    },
    {
      label: "Import",
      value: "import",
      component: <Import />,
    },
    {
      label: "History",
      value: "history",
      component: <History />,
    }
  ];

  return (
    <Tabs value="menu">
      <TabsHeader className="bg-purple-500">
        {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
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