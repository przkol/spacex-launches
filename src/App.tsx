import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { LaunchGallery } from "./components/LaunchGallery";
import styles from "../src/components/styles/Global.module.scss";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LaunchDetails } from "./components/LaunchDetails";
import { LaunchShort } from "./types/types";

export const App = () => {
  const spacexUrl = "https://api.spacex.land/graphql/";
  const [launches, setLaunches] = useState<LaunchShort[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [moreLaunchesAvailable, setMoreLaunchesAvailable] =
    useState<boolean>(true);
  let requestPending: boolean = false;
  const launchesPerPage = 10;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    console.log(e.target.value);
  };

  const getLaunches = useCallback(async () => {
    if ((!requestPending || searchValue.length > 0) && moreLaunchesAvailable) {
      requestPending = true;
      let cancel;
      const newLaunches = await axios
        .post(spacexUrl, {
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
          query: `query {
          launchesPast(limit: ${launchesPerPage},offset: ${launches.length},find: { mission_name: "${searchValue}" }) {
            launch_site {
              site_name_long
              site_name
            }
            launch_date_utc
            rocket {
              rocket_name
            }
            links {
              article_link
              video_link
              flickr_images
              presskit
            }
            details
            mission_name
            id
          }
        }
      
  `,
        })
        .then((response) => {
          console.log(response);

          return response.data.data.launchesPast;
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          console.error(err);
        });
      if (newLaunches) {
        setLaunches((prevState) => [...prevState, ...newLaunches]);
      }
      setMoreLaunchesAvailable(newLaunches?.length === launchesPerPage);
      requestPending = false;
    } else return;
  }, [launches, moreLaunchesAvailable, searchValue]);

  const checkScrollPos = useCallback(() => {
    const windowHeight = window.innerHeight;
    const offsetHeight = window.scrollY;
    const documentHeight = document.body.scrollHeight;
    if (windowHeight + offsetHeight >= documentHeight - windowHeight) {
      getLaunches();
    }
  }, [getLaunches, launches, searchValue]);

  useEffect(() => {
    getLaunches();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPos);
    return () => {
      window.removeEventListener("scroll", checkScrollPos);
    };
  }, [launches]);
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
            <Route path="/" element={<LaunchGallery launches={launches} />} />
            <Route path="mission/:id" element={<LaunchDetails />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};
