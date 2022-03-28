import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Carousel, Container, Row } from "react-bootstrap";
import { useParams } from "react-router";
import { LaunchDetailed } from "../types/types";
import styles from "./styles/LaunchDetails.module.scss";
import "./styles/bootstrapOverride.css";
export const LaunchDetails = () => {
  const params = useParams();
  const spacexUrl = "https://api.spacex.land/graphql/";
  const [missionData, setMissionData] = useState<LaunchDetailed>();
  const [error, setError] = useState<boolean>(false);

  const getLaunchDetails = useCallback(async (id: string = "0") => {
    console.log(id);
    const res2 = await axios
      .post(spacexUrl, {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
        query: `{
          launch(id: ${id}) {
            id
            links {
              flickr_images
              article_link
              presskit
              video_link
              mission_patch
            }
            mission_name
            mission_id
            rocket {
              rocket_name
              rocket_type
              rocket {
                stages
                height {
                  meters
                }
                mass {
                  kg
                }
                first_flight
                first_stage {
                  burn_time_sec
                  engines
                  fuel_amount_tons
                  reusable
                  thrust_sea_level {
                    kN
                  }
                }
                payload_weights {
                  kg
                  name
                }
                name
                second_stage {
                  engines
                  burn_time_sec
                  fuel_amount_tons
                  payloads {
                    option_1
                  }
                  thrust {
                    kN
                  }
                }
              }
            }
            ships {
              url
              name
              home_port
              image
            }
            details
            launch_date_local
            launch_site {
              site_name_long
              site_name
            }
          }
        }
        
          
  `,
      })
      .then((response) => {
        return response.data.data.launch;
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        return null;
      });
    if (res2) setMissionData(res2);
  }, []);
  useEffect(() => {
    getLaunchDetails(params.id);
  }, [params.id]);
  console.log(missionData?.ships);
  if (missionData && !error) {
    return (
      <div className={styles.launchDetails}>
        <h2>{missionData.mission_name}</h2>
        <Container fluid>
          <Row
            xxl={2}
            xl={2}
            md={2}
            sm={1}
            className="justify-content-md-start"
          >
            {missionData.links.flickr_images[0] && (
              <Carousel interval={6000}>
                {missionData.links.flickr_images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={image} alt="" />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
            <div className={styles.launchBasicInfo}>
              <p>
                Mission Name and id:{" "}
                <span>
                  {missionData.mission_name} {missionData.mission_id}
                </span>
              </p>
              <p>
                Launch date:{" "}
                <span>
                  {new Date(missionData.launch_date_local).toLocaleDateString()}
                </span>
              </p>
              <p>
                Launch site:{" "}
                <span>
                  {missionData.launch_site.site_name_long} (
                  {missionData.launch_site.site_name})
                </span>
              </p>
              <p>Details: {missionData.details}</p>
            </div>
            <div className={styles.rocket}>
              <div className={styles.rocketInfo}>
                <p>
                  Rocket name: <span>{missionData.rocket.rocket_name}</span>
                </p>
                <p>
                  Rocket type: <span>{missionData.rocket.rocket_type}</span>
                </p>
                <p>
                  Height:{" "}
                  <span>{missionData.rocket.rocket.height.meters} m</span>
                </p>
                <p>
                  Mass: <span>{missionData.rocket.rocket.mass.kg} kg</span>
                </p>
                <div className={styles.stages}>
                  <div className={styles.stageOne}>
                    <p> Stage One:</p>
                    <p>
                      Engines:{" "}
                      <span>
                        {missionData.rocket.rocket.first_stage.engines}
                      </span>
                    </p>
                    <p>
                      Fuel amount:{" "}
                      <span>
                        {missionData.rocket.rocket.first_stage.fuel_amount_tons}{" "}
                        t
                      </span>
                    </p>
                    <p>
                      Burn time:{" "}
                      <span>
                        {missionData.rocket.rocket.first_stage.burn_time_sec} s
                      </span>
                    </p>
                    <p>
                      Reusable:{" "}
                      <span>{`${missionData.rocket.rocket.first_stage.reusable}`}</span>
                    </p>
                    <p>
                      Thrust at sea level:{" "}
                      <span>
                        {
                          missionData.rocket.rocket.first_stage.thrust_sea_level
                            .kN
                        }{" "}
                        kN
                      </span>
                    </p>
                  </div>
                  <div className={styles.stageTwo}>
                    <p>Stage Two:</p>
                    <p>
                      Engines:{" "}
                      <span>
                        {missionData.rocket.rocket.second_stage.engines}
                      </span>
                    </p>
                    <p>
                      Fuel amount:{" "}
                      <span>
                        {
                          missionData.rocket.rocket.second_stage
                            .fuel_amount_tons
                        }{" "}
                        t
                      </span>
                    </p>
                    <p>
                      Burn time:{" "}
                      <span>
                        {missionData.rocket.rocket.second_stage.burn_time_sec} s
                      </span>
                    </p>
                    <p>
                      Thrust:{" "}
                      <span>
                        {missionData.rocket.rocket.second_stage.thrust.kN} kN
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Carousel interval={6000}>
              {missionData.ships.map((ship, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100" src={ship.image} alt="" />
                  <Carousel.Caption>
                    <h3>{ship.name}</h3>
                    <p>
                      Home port: <span>{ship.home_port}</span>
                    </p>
                    {ship.url && (
                      <p>
                        MarineTraffic <a href={ship.url}>Click!</a>
                      </p>
                    )}
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Row>
        </Container>
      </div>
    );
  } else if (error) {
    return (
      <div className={styles.launchDetails}>
        <p className="warn">Request rejected by API. Please refresh the page</p>
      </div>
    );
  } else return <div className={styles.launchDetails}></div>;
};
