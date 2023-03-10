import { useState } from "react";
// Components
import Navbar from "../components/landing/Navbar";
import DesktopLandingPage from "../components/landing/DesktopLandingPage";
import MobileLandingPage from "../components/landing/MobileLandingPage";
// Apis
import { uploadCsvFile } from "../api/csv";
// Utils
import {
  combinedIdAndGid,
  extractId,
  extractIdAndGid,
  isDefinedLink,
} from "../utils/strings";
import { useRouter } from "next/router";
import { ROUTES } from "../utils/routes";
// Types
import type { ChangeEvent } from "react";
import { type NextPage } from "next";

const Home: NextPage = () => {
  const router = useRouter();
  const [sheetsLink, setSheetsLink] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [sheetsError, setSheetsError] = useState("");
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);

  const handleChangeSheetsLink = (event: ChangeEvent<HTMLInputElement>) => {
    setSheetsLink(event.target.value);
  };

  const createFiltableFromLink = () => {
    setSheetsLink("");
    try {
      if (!isDefinedLink(sheetsLink)) {
        throw "Please input a google sheets link";
      }
      extractIdAndGid(sheetsLink);
    } catch (error) {
      setSheetsError(error instanceof Error ? error.message : String(error));
    }
    const { id, gid } = extractIdAndGid(sheetsLink);
    void router.push(
      `${ROUTES.GOOGLE_SHEETS}/${combinedIdAndGid(id, gid)}/configure`
    );
  };

  const handleUploadFile = (file?: File | undefined) => {
    setFile(file);
  };

  const createFiltableFromCsv = async () => {
    setIsUploadingCsv(true);
    try {
      if (file) {
        const key = await uploadCsvFile(file);
        void router.push(`${ROUTES.CSV}/${key}/configure`);
      }
    } catch (error) {
      setSheetsError("An error has occurred");
      setIsUploadingCsv(false);
    }
  };

  return (
    <>
      <Navbar />
      <DesktopLandingPage
        sheetsLink={sheetsLink}
        handleChangeSheetsLink={handleChangeSheetsLink}
        sheetsError={sheetsError}
        createFiltableFromLink={createFiltableFromLink}
        file={file}
        handleUploadFile={handleUploadFile}
        createFiltableFromCsv={createFiltableFromCsv}
        isUploadingCsv={isUploadingCsv}
      />
      <MobileLandingPage
        sheetsLink={sheetsLink}
        handleChangeSheetsLink={handleChangeSheetsLink}
        createFiltableFromLink={createFiltableFromLink}
      />
    </>
  );
};

export default Home;
