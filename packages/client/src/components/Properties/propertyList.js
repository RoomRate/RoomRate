import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { PropertyService } from "../../shared/services";
import { MarkerIcon } from "../../shared/A-UI";
import { Image } from 'react-extras';
import { LoadingIcon } from '../../shared/A-UI';
import PROPERTY_IMAGE from "assets/images/placeholderproperty.jpg";

export const PropertyList = () => {
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

  const renderPropertyMarkers = () => properties.map(p => <Marker
    key={p.id}
    icon={MarkerIcon}
    position={[ p.lat, p.lng ]}>
    <Popup>
      <div>
        {p.street1}<br />
        {p.street2 ? <>{p.street2}<br /></> : ``}
        {p.city}, {p.state_name} {p.zip}
      </div>
    </Popup>
  </Marker>);

  return isLoading ?
    <LoadingIcon /> :
    <div className="container-fluid block-content" >
      <div className="row" style={{ maxHeight: `95vh` }}>
        <div className="col-md-6">
          <div id="propertyMap" style={{ maxHeight: `90vh`, overflow: `hidden` }}>
            <MapContainer
              style={{ height: `100vh`, width: `50wh` }}
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
          </div>
        </div>
        <div className="col-md-6">
          <div id="propertyList" style={{ maxHeight: `90vh`, overflow: `scroll` }}>
            {
              properties.map(property =>
                <Card key={property.id}>
                  <Card.Body>
                    <div className="row">
                      <div className="col-md-3">
                        <Image url={PROPERTY_IMAGE} alt="propertyimg" className="w-100" />
                      </div>
                      <div className="col-md-8">
                        <h1>{property.street1} {property.street2 ? `, ${property.street2}` : ``}</h1>
                        <p>{property.bed} bed, {property.bath} bath</p>
                      </div>
                      <div className="col-md-1">
                        <Link to={`/property/${property.id}/detail`}>
                          <button>
                            Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </Card>)
            }
          </div>
        </div>
      </div>
    </div>;

};
