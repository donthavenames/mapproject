import {createContext, useState, useContext} from 'react'


const MousePosContext = createContext(null);


const MousePosProvider = ({children}) => {
  const [currPos, setCurrPos] = useState(null)
  return <MousePosContext.Provider value={{
    currPos,
    setCurrPos
  }}>
    {children}
  </MousePosContext.Provider>
}

const useMousePosContext = () => {
  const context = useContext(MousePosContext);
  return {
    data: context.currPos,
    setCurrPos: context.setCurrPos
  };
}

export { MousePosProvider, useMousePosContext };
