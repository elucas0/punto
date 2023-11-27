import './App.css'
import { TabsGroup } from './game/components/Tabs';


enum Colors {
  red = "red",
  blue = "blue",
  green = "green",
  yellow = "yellow",
}

function App() {
  const color = Object.values(Colors)[Math.floor(Math.random() * 4)];

  return (
    <>
      <header className='flex flex-col items-center mb-6 gap-6'>
        <div className={`text-4xl bg-black border-${color}-500 border-4 rounded-lg p-3 cursor-pointer`}>
          <p>Punto</p>
        </div>
        <TabsGroup></TabsGroup>
      </header>
    </>
  )
}

export default App
