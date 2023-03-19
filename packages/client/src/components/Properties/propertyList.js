/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { Card, Dropdown, ButtonGroup, Badge } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { PropertyService } from "../../shared/services";
import { MarkerIcon } from "../../shared/A-UI";
// import { Image } from 'react-extras';
import { LoadingIcon } from '../../shared/A-UI';
// import PROPERTY_IMAGE from "../../assets/images/placeholderproperty.jpg";
import { Link } from 'react-router-dom';
// import { useParams } from 'react-router-dom';

export const PropertyList = () => {
  // const { id } = useParams();
  const [ properties, setProperties ] = useState([]);
  const [ isLoading, setLoading ] = useState(true);
  const [ thumbnails, setThumbnail ] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const propertyList = await PropertyService.getPropertyList({ all: true });
        { /* eslint-disable-next-line max-len */ }
        const thumbnailPromises = propertyList.map(property => PropertyService.getPropertyThumbnail({ property_id: property.id }));
        const thumbnail = await Promise.all(thumbnailPromises);
        const thumbnailList = {};
        propertyList.forEach((property, index) => {
          thumbnailList[property.id] = thumbnail[index];
        });
        setProperties(propertyList);
        setThumbnail(thumbnailList);
      } catch (error) {
        throw new Error(error);
      } finally {
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

  const formatPolicies = (property) => {
    const policyList = [];
    property.policies.ac ? policyList.push(`Air conditioning`) : null;
    property.policies.pets ? policyList.push(`Pets friendly`) : null;
    property.policies.furnished ? policyList.push(`Furnished`) : null;
    property.policies.internet ? policyList.push(`Internet included`) : null;
    property.policies.parking ? policyList.push(`Parking space available`) : null;
    property.policies.laundry ? policyList.push(`Laundry included`) : null;
    property.policies.utilities ? policyList.push(`Utilities included`) : null;
    property.policies.wheelchair ? policyList.push(`Wheelchair accessible`) : null;

    return policyList.map((p, index) => {
      if (index === policyList.length - 1) {
        return p;
      } else if (index === policyList.length - 2) {
        return `${p} and `;
      }

      return `${p}, `;

    }).join(``);
  };

  return (
    isLoading ?
      <LoadingIcon /> :
      <div className="d-flex" style={{ height: `93.75vh`, overflow: `hidden` }} id="propertyList">
        <div style={{ padding: 0, width: `70%` }}>
          <MapContainer
            style={{ height: `93.75vh` }}
            center={[ 39.130949, -84.51746 ]}
            zoom={12}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {renderPropertyMarkers()}
            <div />
          </MapContainer>
        </div>
        <div className="p-0 w-50">
          <div className="w-100">
            <ButtonGroup>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Price Range
                </Dropdown.Toggle>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Distance
                </Dropdown.Toggle>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Bedrooms
                </Dropdown.Toggle>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Bathrooms
                </Dropdown.Toggle>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Pets Allowed
                </Dropdown.Toggle>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Type
                </Dropdown.Toggle>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Sort By
                </Dropdown.Toggle>
              </Dropdown>
            </ButtonGroup>
          </div>
          <div id="propertyList" style={{ overflowY: `scroll`, height: `88.75vh`, width: `100%` }}>
            {
              properties.map(property => <Link
                to={`/property/${property.id}/detail`}
                style={{ color: `black`, textDecoration: `none` }}>
                <Card key={property.id} className="propertyListing mb-3">
                  <Card.Header className="text-start">
                    <h2 className="my-0">{property.street_1}</h2>
                    {property.street_2 ? <h3 className="my-0 fw-light">Unit {property.street_2}</h3> : null}
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex">
                      <div
                        className="w-50"
                        style={{ position: `relative` }}
                      >
                        <img src={`data:image/jpeg;base64, ${thumbnails[property.id]}`}
                          alt="property"
                          style={{ height: `250px`, position: `relative` }} />
                        {property.peopleInterested !== `0` &&
                          <Badge
                            bg="danger"
                            className="text-start"
                            style={{ position: `absolute`, top: `10px`, left: `10px`, zIndex: 1 }}
                          >
                            {/* eslint-disable-next-line max-len */}
                            {property.peopleInterested} {property.peopleInterested === `1` ? `person` : `people`} interested
                          </Badge>}
                      </div>
                      <div className="w-50 text-start ms-2">
                        <h3 className="my-0">{property.rate}</h3 >
                        <h3 className="my-0">{property.bed} Bed, {property.bath} Bath</h3 >
                        <br />
                        <p>
                          {
                            formatPolicies(property)
                          }
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>)
            }
          </div>
        </div>
      </div>
  );
};