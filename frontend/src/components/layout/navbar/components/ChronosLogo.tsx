import { Group } from "@mantine/core";

import logo from "./chronos-logo.svg";

const ChronosLogo = () => {
  return (
    <Group align="center">
      <img
        src={logo}
        alt="Chronos Logo"
        style={{ width: 24, height: 24, display: "block", cursor: "pointer" }}
      />
    </Group>
  );
};

export default ChronosLogo;
