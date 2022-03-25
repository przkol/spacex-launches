import axios from "axios";
import { useEffect, useState } from "react";
import { FlightGallery } from "./components/FlightGallery";

interface Launch {
  mission_name: string;
  links: {
    article_link?: string;
    video_link?: string;
  };
  rocket: {
    rocket_name: string;
    first_stage: {
      cores: {
        core: { reuse_count: number; status: string };
        flight: number;
      }[];
    };
    second_stage: {
      payloads: {
        payload_mass_ks: number;
        payload_mass_lbs: number;
        payload_type: string;
      }[];
    };
  };
  ships: {
    home_port: string;
    image: string;
    name: string;
  }[];
}

interface ListResponse<T> {
  data: { launchesPast: T[] };
}

export const App = () => {
  const countriesUrl = "https://countries.trevorblades.com";
  const spacexUrl = "https://api.spacex.land/graphql/";
  const [launches, setLaunches] = useState();
  async function getUrl() {
    console.log("xd");
    const res2 = await axios
      .post(spacexUrl, {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
        query: `query {
        launchesPast(limit: 10) {
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
          }
          rocket {
            rocket_name
            first_stage {
              cores {
                flight
                core {
                  reuse_count
                  status
                }
              }
            }
            second_stage {
              payloads {
                payload_type
                payload_mass_kg
                payload_mass_lbs
              }
            }
          }
          ships {
            name
            home_port
            image
          }
        }
      }
      
  `,
      })
      .then((response) => {
        return response.data.data;
      })
      .catch((err) => err);

    setLaunches(res2.launchesPast);
  }

  useEffect(() => {
    getUrl();
  }, []);
  return (
    <div>
      {" "}
      <p>HELLO xd</p>
      <FlightGallery />
      {launches?.map((launch, index) => (
        <p key={index}>{launch.mission_name}</p>
      ))}
    </div>
  );
};
