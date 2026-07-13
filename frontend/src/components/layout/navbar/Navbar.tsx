import { Avatar, Container, Group, Text } from "@mantine/core";
import ChronosLogo from "./components/ChronosLogo";

const Navbar = () => {
  return (
    <Container>
      <Group grow justify="space-between" align="center">
        <Group>
          <ChronosLogo />
          <Group>
            <Text>Breadcumb</Text>...
            <Text>Breadcumb</Text>...
            <Text>Breadcumb</Text>
          </Group>
        </Group>
        <Group justify="flex-end" align="center">
          <Text>Searchbox</Text>
          <Avatar />
        </Group>
      </Group>
    </Container>
  );
};

export default Navbar;
