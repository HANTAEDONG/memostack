import ToolbarButton from "./ToolbarButton";
import ToolbarIcon from "./ToolbarIcon";
import ToolbarDropdown from "./ToolbarDropdown";
import ToolbarContainer from "./ToolbarContainer";

const Toolbar = Object.assign(ToolbarContainer, {
  Button: ToolbarButton,
  Icon: ToolbarIcon,
  Dropdown: ToolbarDropdown,
});

export default Toolbar;
