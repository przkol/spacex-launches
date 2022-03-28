import { LaunchShort } from "../types/types";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import styles from "./styles/LaunchTile.module.scss";
import * as small from "../spacex-small.jpg";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
export const LaunchTile = (props: { launch: LaunchShort }) => {
  const date = new Date(props.launch?.launch_date_utc);
  const { links, mission_name, details, rocket, launch_site, id } =
    props.launch;

  const navigate = useNavigate();

  const handleGoToMission = () => {
    navigate(`/mission/${id}`);
  };
  if (props.launch) {
    return (
      <Card className={styles.card}>
        <div className={styles.imgContainer}>
          <img src={links?.flickr_images[0] || small} />
        </div>
        <Card.Body className={styles.cardBody}>
          <Card.Title>{mission_name}</Card.Title>
          <Card.Subtitle className={styles.subTitle}>
            {date.toLocaleDateString()}, {launch_site?.site_name_long}
          </Card.Subtitle>
          <Card.Subtitle className={styles.subTitle}>
            Rocket: {rocket.rocket_name}
          </Card.Subtitle>
          <Card.Text className={styles.text}>{details}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button onClick={handleGoToMission}>Read more</Button>
        </Card.Footer>
      </Card>
    );
  } else return <div className={styles.card}></div>;
};
