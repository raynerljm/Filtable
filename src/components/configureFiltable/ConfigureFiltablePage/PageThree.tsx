import { useMemo, useState } from "react";
// Components
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import {
  Button,
  BxPlus,
  BxRightArrowAlt,
  IconButton,
  SingleSelect,
  Tooltip,
} from "@opengovsg/design-system-react";
import BxMinusCircle from "../../icons/BxMinusCircle";
import PreviewListing from "../PreviewListing";
// Utils
import {
  convertCollectionOfTags,
  encodeConfig,
  extractTags,
  extractTexts,
} from "../../../utils/configuration";
import { ROUTES } from "../../../utils/routes";
// Types
import type { NextRouter } from "next/router";
import type { Dispatch, FC, SetStateAction } from "react";
import type { HeadingConfig } from "../../../types/configuration";

type Props = {
  firstRow: Record<string, string>;
  headings: Array<string>;
  configuration: HeadingConfig;
  setConfiguration: Dispatch<SetStateAction<HeadingConfig>>;
  combinedIdAndGid?: string | string[] | undefined;
  csvKey?: string | string[] | undefined;
  router: NextRouter;
};

const PageThree: FC<Props> = ({
  firstRow,
  headings,
  configuration,
  setConfiguration,
  combinedIdAndGid,
  csvKey,
  router,
}) => {
  const [texts, setTexts] = useState<Array<string>>([]);

  /**
   * Helper functions
   */
  const handleAddText = () => {
    setTexts((texts) => [...texts, ""]);
  };

  const mergeTextsIntoConfig = (
    configuration: HeadingConfig,
    texts: Array<string>
  ) => {
    const newConfiguration = { ...configuration };
    texts.forEach((text, idx) => {
      newConfiguration[`Text ${idx + 1}`] = text;
    });
    return newConfiguration;
  };

  const createFiltable = () => {
    const mergedConfiguration = mergeTextsIntoConfig(configuration, texts);
    const urlConfig = encodeConfig([mergedConfiguration]);

    if (combinedIdAndGid) {
      void router.push(
        `/${ROUTES.GOOGLE_SHEETS}/${String(
          combinedIdAndGid
        )}?urlConfig=${urlConfig}`
      );
    } else if (csvKey) {
      void router.push(
        `/${ROUTES.CSV}/${String(csvKey)}?urlConfig=${urlConfig}`
      );
    }
  };

  /**
   * Currying helper functions
   */
  const generateConfigurationSelectHandleChange = (key: string) => {
    return (value: string) => {
      setConfiguration((configuration) => ({
        ...configuration,
        [key]: value,
      }));
    };
  };

  const generateTextSelectHandleChange = (idx: number) => {
    return (value: string) => {
      setTexts((texts) => {
        const newTexts = [...texts];
        newTexts[idx] = value;
        return newTexts;
      });
    };
  };

  const generateRemoveText = (idx: number) => {
    return () => {
      setTexts((texts) => {
        const newTexts = [...texts];
        newTexts.splice(idx, 1);
        return newTexts;
      });
    };
  };

  const listOfTexts = extractTexts(
    firstRow,
    mergeTextsIntoConfig(configuration, texts)
  );

  const convertedCollectionOfTags = useMemo(() => {
    return convertCollectionOfTags(extractTags(firstRow, configuration));
  }, [configuration, firstRow]);

  const isValid = configuration["Title"];

  return (
    <Box>
      <Grid
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        gap="132px"
        mb="240px"
      >
        <GridItem colSpan={1}>
          <Box w="full" mb="64px">
            <Text textStyle="h4" color="base.content.strong">
              Design the listing
            </Text>
            <Text textStyle="body-2" mt="4px" color="base.content.medium">
              Map column headers to each display field of a listing
            </Text>
            <Box mt="32px" mb="64px" display="flex" flexDir="column" gap="24px">
              {["Title", "Description"].map((heading) => {
                return (
                  <Box key={heading}>
                    <Text textStyle="subhead-1" mb="12px">
                      {heading}
                    </Text>
                    <SingleSelect
                      isClearable={false}
                      name={heading}
                      value={configuration[heading] ?? ""}
                      onChange={generateConfigurationSelectHandleChange(
                        heading
                      )}
                      items={headings}
                    />
                  </Box>
                );
              })}
              {texts.map((text, idx) => {
                const label = `Text ${idx + 1}`;

                return (
                  <Box key={label}>
                    <Text textStyle="subhead-1" mb="12px">
                      {label}
                    </Text>
                    <Box display="flex" w="full">
                      <Box w="full">
                        <SingleSelect
                          isClearable={false}
                          name={label}
                          value={text}
                          onChange={generateTextSelectHandleChange(idx)}
                          items={headings}
                        />
                      </Box>
                      <IconButton
                        icon={<BxMinusCircle />}
                        aria-label="Delete Text"
                        colorScheme="brand.secondary"
                        variant="inputAttached"
                        onClick={generateRemoveText(idx)}
                      />
                    </Box>
                  </Box>
                );
              })}
              <Button
                variant="outline"
                w="fit-content"
                leftIcon={<BxPlus />}
                colorScheme="base.content.strong"
                onClick={handleAddText}
              >
                Add more rows of text
              </Button>
              <Box>
                <Text textStyle="subhead-1" mb="12px">
                  Link
                </Text>
                <SingleSelect
                  isClearable={false}
                  name="Link"
                  value={configuration["Link"] ?? ""}
                  onChange={generateConfigurationSelectHandleChange("Link")}
                  items={headings}
                />
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap="32px">
            <Tooltip
              label={
                isValid ? "" : "Select a column header for at least the title"
              }
              placement="top"
            >
              <Button
                textStyle="subhead-1"
                display="flex"
                alignItems="center"
                rightIcon={<BxRightArrowAlt fontSize="lg" />}
                onClick={createFiltable}
                isDisabled={!isValid}
              >
                Create Filtable
              </Button>
            </Tooltip>
            <Text textStyle="caption-2" color="base.content.medium">
              3 of 3
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <PreviewListing
            title={firstRow[configuration["Title"] ?? ""] ?? "<Title>"}
            description={
              firstRow[configuration["Description"] ?? ""] ?? "<Description>"
            }
            listOfTexts={listOfTexts.map((text, idx) =>
              Boolean(text) ? text : `<Text ${idx + 1}>`
            )}
            convertedCollectionOfTags={convertedCollectionOfTags}
            link={firstRow[configuration["Link"] ?? ""] ?? "<link>"}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};
export default PageThree;
