import { useState, useEffect } from "react";
import { useModal } from "../contexts/modal";

function ModalContainer({ children, visible }) {
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(visible);
  }, [visible]);

  return (
    <div className={useModal().visibility ? "modal--active" : "modal--hidden"}>
      {useModal().content}
    </div>
  );
}

export default ModalContainer;
