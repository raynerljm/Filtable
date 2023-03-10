// Components
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Hide, Show, Text } from "@chakra-ui/react";
import { Link, Tag } from "@opengovsg/design-system-react";
// Utils
import { useRouter } from "next/router";
// Types
import type { FC } from "react";
import FiltableIcon from "../icons/FiltableIcon";

type Props = {
  filtableTitle?: string;
};

const Navbar: FC<Props> = ({ filtableTitle }) => {
  const router = useRouter();

  const navbarLinks = [
    {
      label: "How it works",
      href: "/#how-it-works",
    },
    { label: "Pro tips", href: "/#pro-tips" },
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <Box
      as="nav"
      w="full"
      bg="blue.50"
      border={{ base: "1px", md: "0" }}
      borderColor="blue.100"
      px={{
        base: "24px",
        md: "148px",
      }}
      py={{ base: "12px", md: "92px" }}
      display="flex"
      flexDir="row"
    >
      <Box w="full" display="flex" flexDir="row" position="relative" mx="auto">
        {filtableTitle ? (
          <>
            <ArrowBackIcon
              position="absolute"
              left="24px"
              top="0"
              bottom="0"
              my="auto"
              onClick={handleBack}
            />
            <Text textStyle="body-2" mx="auto">
              {filtableTitle}
            </Text>
          </>
        ) : (
          <>
            <Hide above="md">
              <Box display="flex" alignItems="center" gap="8px">
                <Link href="/">
                  <FiltableIcon size="sm" />
                </Link>
                <Tag variant="solid" size="sm">
                  BETA
                </Tag>
              </Box>
            </Hide>
            <Show above="md">
              <Box display="flex" alignItems="center" gap="16px" w="full">
                <Link href={"/"}>
                  <FiltableIcon size="lg" />
                </Link>
                <Tag variant="solid">BETA</Tag>

                <Box ml="auto" display="flex" gap="40px">
                  {navbarLinks.map(({ label, href }) => {
                    return (
                      <Link key={label} href={href} variant="standalone">
                        {label}
                      </Link>
                    );
                  })}
                </Box>
              </Box>
            </Show>
          </>
        )}
      </Box>
    </Box>
  );
};
export default Navbar;
