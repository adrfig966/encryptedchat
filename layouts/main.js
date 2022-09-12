import HostBar from "./hostbar";
import ModalContainer from "./modal";
import { useModal } from "../contexts/modal";
import { Fragment } from "react";

function Wrapper({ children, rsakeys }) {
  const { setContent, toggleVis } = useModal(useModal);

  const genClick = async (e) => {
    const response = await fetch("/genkey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ privateKey: rsakeys.privateKey }),
    });
    const resjson = await response.json();
    console.log("New private key received: ", resjson);
    setContent(<div>{resjson.privateKey}</div>);
    toggleVis();
  };

  return (
    <Fragment>
      <HostBar genClick={genClick}></HostBar>
      <div className="main">{children}</div>
      <ModalContainer />
    </Fragment>
  );
}

export default Wrapper;
