import { LaunchShort } from "../types/types";
import { LaunchTile } from "./LaunchTile";
import Container from "react-bootstrap/Container";
import { Row } from "react-bootstrap";

export const LaunchGallery = (props: { launches: LaunchShort[] }) => {
  if (props.launches?.length > 0) {
    return (
      <Container fluid className="FlightGallery ">
        <Row
          xxl={4}
          xl={4}
          lg={4}
          md={3}
          sm={2}
          className="justify-content-center"
        >
          {props.launches.map((launch, index) => (
            <LaunchTile launch={launch} key={index} />
          ))}
        </Row>
      </Container>
    );
  } else {
    return <div className="placeHolder"></div>;
  }
};
