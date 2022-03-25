import { LaunchShort } from "../types/types";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import styles from "./styles/LaunchTile.module.scss";
import * as small from "../spacex-small.jpg";
import { useCallback, useEffect, useState } from "react";
export const LaunchTile = (props: { launch: LaunchShort }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const date = new Date(props.launch.launch_date_utc);
  const { links, mission_name, details, rocket, launch_site } = props.launch;

  // const indexSwitcher = useCallback(() => {
  //   if (currentPhotoIndex < links.flickr_images.length - 1) {
  //     console.log(currentPhotoIndex);
  //     setCurrentPhotoIndex((prevState) => {
  //       return prevState + 1;
  //     });
  //   } else setCurrentPhotoIndex(0);
  // }, [links.flickr_images.length, currentPhotoIndex]);

  // useEffect(() => {
  //   const imgSwitchTimer = setInterval(() => {
  //     indexSwitcher();
  //   }, 5000);
  //   return () => {
  //     clearInterval(imgSwitchTimer);
  //   };
  // }, []);

  return (
    <Card className={styles.card}>
      <div className={styles.imgContainer}>
        <img src={links.flickr_images[currentPhotoIndex] || small} />
      </div>
      <Card.Body className={styles.cardBody}>
        <Card.Title>{mission_name}</Card.Title>
        <Card.Subtitle className={styles.subTitle}>
          {date.toLocaleDateString()}, {launch_site.site_name_long}
        </Card.Subtitle>
        <Card.Subtitle className={styles.subTitle}>
          Rocket: {rocket.rocket_name}
        </Card.Subtitle>
        <Card.Text className={styles.text}>{details}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button>Read more</Button>
      </Card.Footer>
    </Card>
  );
};
