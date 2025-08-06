import ToolbarButton from "./ToolbarButton";
import ToolbarIcon from "./ToolbarIcon";
import ToolbarDropdown from "./ToolbarDropdown";
import ToolbarContainer from "./ToolbarContainer";
import ToolbarLinkCard from "./ToolbarLinkCard";

const Toolbar = Object.assign(ToolbarContainer, {
  Button: ToolbarButton,
  Icon: ToolbarIcon,
  Dropdown: ToolbarDropdown,
  Container: ToolbarContainer,
  LinkCard: ToolbarLinkCard,
});

export default Toolbar;
