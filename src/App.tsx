import React, { useCallback, useEffect, useState } from "react";
import { LaunchGallery } from "./components/LaunchGallery";
import styles from "../src/components/styles/Global.module.scss";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LaunchDetails } from "./components/LaunchDetails";
import useRequestLaunches from "./components/useRequestLaunches";

export const App = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [pageNo, setPageNo] = useState<number>(0);
  const [newPageNeeded, setNewPageNeeded] = useState<boolean>(false);
  const [nextPageBlock, setNextPageBlock] = useState<boolean>(false);
  const launchesPerPage = 12;
  const { newLaunches, error, moreLaunchesAvailable, loadingFlag } =
    useRequestLaunches(searchValue, pageNo, launchesPerPage);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPageNo(0);
    setNextPageBlock(false);
  };
  // CHECKS SCROLL VALUE & SETS 'NEED FOR A NEW PAGE' FLAG
  const checkScrollPos = useCallback(() => {
    const windowHeight = window.innerHeight;
    const offsetHeight = window.scrollY;
    const documentHeight = document.body.scrollHeight;
    if (
      windowHeight + offsetHeight >= documentHeight - windowHeight &&
      !loadingFlag &&
      !nextPageBlock
    ) {
      setNewPageNeeded(true);
    } else {
      setNewPageNeeded(false);
    }
  }, [
    searchValue,
    newPageNeeded,
    document.body.scrollHeight,
    window.innerHeight,
    window.scrollY,
    nextPageBlock,
  ]);

  // INCREMENTS PAGE NUMBER
  useEffect(() => {
    if (newPageNeeded) {
      setPageNo((prevState) => prevState + 1);
    }
  }, [newPageNeeded]);

  //
  useEffect(() => {
    if (moreLaunchesAvailable < launchesPerPage) setNextPageBlock(true);
    else setNextPageBlock(false);
  }, [moreLaunchesAvailable]);

  // WINDOW SCROLL EVENT LISTENER FOR INFINITE SCROLL FUNC
  useEffect(() => {
    window.addEventListener("scroll", checkScrollPos);
    return () => {
      window.removeEventListener("scroll", checkScrollPos);
    };
  }, [nextPageBlock]);

  if (!error) {
    return (
      <HashRouter>
        <div className={styles.App}>
          <div>
            <header>
              <h1>SpaceX Launches</h1>
              <label htmlFor="missionName">
                <input
                  type="search"
                  name="missionName"
                  id="missionName"
                  placeholder="Search by mission name"
                  value={searchValue}
                  onChange={handleSearchInput}
                />
              </label>
            </header>
            <Routes>
              <Route
                path="/"
                element={
                  <LaunchGallery
                    pageNo={pageNo}
                    launchesPerPage={launchesPerPage}
                    launches={newLaunches.filter((launch) =>
                      launch.mission_name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )}
                  />
                }
              />
              <Route path="mission/:id" element={<LaunchDetails />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    );
  } else if (error) return <div>Sorry, something went wrong</div>;
};
