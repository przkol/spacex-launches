import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FlightGallery } from "./components/FlightGallery";

export const App = () => {
  const countriesUrl = "https://countries.trevorblades.com";
  const spacexUrl = "https://api.spacex.land/graphql/";
  const [launches, setLaunches] = useState([]);

  const getUrl = useCallback(
    async (launchesNo = 10) => {
      const res2 = await axios
        .post(spacexUrl, {
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
          query: `query {
          launchesPast(limit: ${launchesNo},offset: ${launches.length}) {
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
          }
        }
      
  `,
        })
        .then((response) => {
          return response.data.data;
        })
        .catch((err) => err);

      setLaunches((prevState) => prevState.concat(res2.launchesPast));
    },
    [launches]
  );

  const checkScrollPos = useCallback(() => {
    const windowHeight = window.innerHeight;
    const offsetHeight = window.scrollY;
    const documentHeight = document.body.scrollHeight;
    if (windowHeight + offsetHeight >= documentHeight) {
      getUrl(5);
    }
  }, [getUrl, launches]);

  useEffect(() => {
    getUrl();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPos);
    return () => {
      window.removeEventListener("scroll", checkScrollPos);
    };
  }, [launches]);
  return (
    <div className="App">
      <div>
        <h1>SpaceX Launches</h1>
        <FlightGallery launches={launches} />
      </div>
    </div>
  );
};
