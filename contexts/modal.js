import { useState, useContext, createContext } from "react";

const ModalContext = createContext(undefined);

function ModalProvider({ children }) {
  const [visibility, setVisible] = useState(false);
  const [content, setContent] = useState(<div>Content</div>);
  const toggleVis = () => {
    setVisible(!visibility);
  };
  const data = { visibility, toggleVis, content, setContent };

  return <ModalContext.Provider value={data}>{children}</ModalContext.Provider>;
}

function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal can only be used inside ModalProvider");
  }
  return context;
}

export { ModalProvider, useModal };
