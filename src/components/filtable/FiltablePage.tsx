// React
import type { Dispatch, FC, SetStateAction } from "react";
import { useCallback, useState } from "react";
// Components
import { Box, Hide, Show, Text } from "@chakra-ui/react";
import {
  Button,
  IconButton,
  MultiSelect,
} from "@opengovsg/design-system-react";
import BxFilterAlt from "../icons/BxFilterAlt";
import BxShareAlt from "../icons/BxShareAlt";
import Listing from "./Listing";
import ShareModal from "./ShareModal";
import FilterModal from "./FilterModal";
import ErrorPage from "../emptyStates/ErrorPage";
import LoadingPage from "../emptyStates/LoadingPage";
// Utils
import {
  currentlySelectedFilters,
  enumerateAllFilterOptions,
  generateToggleOrChangeFilterOption,
} from "../../utils/filter";
import { generateShowingResults } from "../../utils/strings";
// Types
import type { Filter, FilterKeywords } from "../../types/filter";
import type { HeadingConfig } from "../../types/configuration";

type Props = {
  isLoading: boolean;
  errorMessage: string;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  resetFilter: () => void;
  data: Array<Record<string, string>>;
  filteredData: Array<Record<string, string>>;
  configuration: HeadingConfig;
  processedFilters: Record<FilterKeywords, Array<string>>;
};

const FiltablePage: FC<Props> = ({
  isLoading,
  errorMessage,
  filter,
  setFilter,
  resetFilter,
  data,
  filteredData,
  configuration,
  processedFilters,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const openShareModal = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const openFilterModal = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  const closeFilterModal = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  const Searchbar = () => {
    return (
      <MultiSelect
        name="searchbar"
        onChange={() => ({})}
        downshiftMultiSelectProps={{
          onSelectedItemsChange: (changes) => {
            resetFilter();
            changes.selectedItems?.forEach(({ value, heading }: any) =>
              setFilter(
                generateToggleOrChangeFilterOption(
                  value as string,
                  heading as string,
                  true
                )
              )
            );
          },
        }}
        values={currentlySelectedFilters(filter).reduce(
          (acc, val) => [...acc, ...val],
          []
        )}
        // Converting all possible filter options to a flattened string array
        items={Object.entries(
          enumerateAllFilterOptions(data, processedFilters)["Checkbox"] ?? {}
        )
          .map(([heading, set]) => [
            ...Array.from(set as Set<string>).map((value) => ({
              value,
              heading,
            })),
          ])
          .reduce((acc, val) => [...acc, ...val], [])}
      />
    );
  };

  if (isLoading) {
    return <LoadingPage />;
  } else if (errorMessage !== "") {
    return <ErrorPage errorMessage={errorMessage} />;
  }

  return (
    <>
      <Box>
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          filtableTitle={configuration["Filtable Title"]}
        />
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={closeFilterModal}
          listings={data}
          filter={filter}
          setFilter={setFilter}
          processedFilters={processedFilters}
        />
        <IconButton
          aria-label="Filter"
          variant="solid"
          colorScheme="brand.primary"
          icon={<BxFilterAlt />}
          onClick={openFilterModal}
          position="fixed"
          rounded="50%"
          inset="auto 32px 32px auto"
          shadow="md"
          zIndex="1"
        />
      </Box>
      <Box
        p="0 24px 24px"
        backgroundColor="brand.primary.50"
        display="flex"
        flexDir="row"
      >
        <Box maxW="1144px" mx="auto" w="full">
          <Box
            position="sticky"
            top="0px"
            py="24px"
            bg="brand.primary.50"
            zIndex="1"
          >
            <Box display="flex" flexDir="row" w="full" gap="16px" mb="16px">
              <Text textStyle="h5" noOfLines={2}>
                {configuration["Filtable Title"]}
              </Text>
              <Box display="flex" flexDir="row" gap="8px" ml="auto">
                <Show above="md">
                  <Button
                    rightIcon={<BxShareAlt />}
                    colorScheme="brand.secondary"
                    variant="outline"
                    onClick={openShareModal}
                  >
                    <Text textStyle="subhead-1">Share</Text>
                  </Button>
                </Show>
                <Hide above="md">
                  <IconButton
                    aria-label="Share"
                    variant="outline"
                    colorScheme="brand.secondary"
                    icon={<BxShareAlt />}
                    onClick={openShareModal}
                  />
                </Hide>
              </Box>
            </Box>
            <Searchbar />
          </Box>
          <Text textStyle="body-2" mb="12px">
            {generateShowingResults(filteredData.length)}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            gap="12px"
            minH="calc(100vh - 192px)" //TODO: 192px is the sum of height of (GovMastHead, Top Padding, Title, Tag height, Showing x results height)
          >
            {filteredData.map((listing) => (
              <Listing
                key={JSON.stringify(listing)}
                listing={listing}
                configuration={configuration}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default FiltablePage;
