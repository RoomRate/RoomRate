/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { PropertyService } from "../../shared/services";
import { MarkerIcon } from "../../shared/A-UI";
import { Image } from 'react-extras';
import { LoadingIcon } from '../../shared/A-UI';
import PROPERTY_IMAGE from "../../assets/images/placeholderproperty.jpg";
import { Link } from 'react-router-dom';
import '../../scss/custom.scss';

export const PropertyListNew = () => {
  const [ properties, setProperties ] = useState([]);
  const [ isLoading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setProperties(await PropertyService.getPropertyList({ all: true }));
      }

      catch (err) {
        throw new Error(err);
      }
      finally {
        setLoading(false);
      }
    };

    document.title = `RoomRate - Properties`;
    fetchData();
  }, []);

  const renderPropertyMarkers = () => properties.map(p =>
    <Marker
      key={p.id}
      icon={MarkerIcon}
      position={[ p.lat, p.lng ]}>
      <Popup>
        <div>
          {p.street_1}<br />
          {p.street_2 ? <>{p.street_2}<br /></> : ``}
          {p.city}, {p.state_name} {p.zip}
        </div>
      </Popup>
    </Marker>);

  return (
    isLoading ?
      <LoadingIcon /> :
      <Col fluid style={{ height: `100vh` }} id="propertyList">
        <Row style={{ height: `100%` }}>
          <Col xs="6" style={{ padding: 0 }}>
            <MapContainer
              style={{ height: `100vh` }}
              center={[ 39.130949, -84.51746 ]}
              zoom={15}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {renderPropertyMarkers()}
              <div />
            </MapContainer>
          </Col>
          <Col xs={6} style={{
            padding: 0,
            height: `100%`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `flex-end`,
          }}>
            <div id="propertyList" style={{ overflowY: `scroll`, height: `100%`, width: `100%` }}>
              {
                properties.map(property =>
                  <Card key={property.id} style={{ borderRadius: 0 }} className="propertyListing">
                    <Card.Body>
                      <Row>
                        <Link to={`/property/${property.id}/detail`} style={{ color: `black` }}>
                          <Col xs="6" style={{ float: `left` }}>
                            <Image url={PROPERTY_IMAGE} alt="propertyimg" className="w-100" />
                          </Col>
                          <Col xs="6" style={{ float: `right`, display: `flex`, alignItems: `center` }}>
                            <div className="w-100" style={{ margin: `auto` }}>
                              <h1>{property.street_1}{property.street_2 && `, ${property.street_2}`}</h1>
                              <p>{property.bed} Bed, {property.bath} Bath</p>
                            </div>
                          </Col>
                        </Link>
                      </Row>
                    </Card.Body>
                  </Card>)
              }
            </div>
          </Col>
        </Row>
      </Col>
  );
};