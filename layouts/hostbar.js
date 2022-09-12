function HostBar({ genClick }) {
  return (
    <div className="host-bar">
      <input type="button" value="View private key" />
      <input type="button" value="Generate private key" onClick={genClick} />
    </div>
  );
}
export default HostBar;
