import {createContext, useState, useContext} from 'react'


const MousePosContext = createContext(null);


const MousePosProvider = ({children}) => {
  const [currPos, setCurrPos] = useState(null)
  //MousePosContext.Provider is the provider of the context. The {children} inside of the statement is basically putting the children from a diff program that executed MousePosContext and then placed it inside {children}
  //currPos & setCurrPos are both objects that this program wants to pass to components that access it
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
