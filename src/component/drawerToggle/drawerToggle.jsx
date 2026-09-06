import "./drawerToggle.css";

export default function DrawerToggle(props) {
  return (
    <div className="button-container-2" onClick={props.clickevent}>
      <div className="lines">
        <div className="div-1"></div>
        <div className="div-2"></div>
        <div className="div-3"></div>
      </div>
    </div>
  );
}
