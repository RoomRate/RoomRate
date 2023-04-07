/* eslint-disable no-unused-expressions */
/* eslint-disable default-case */
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Dropdown, ButtonGroup, Badge } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { PropertyService } from "../../shared/services";
import { MarkerIcon } from "../../shared/A-UI";
import loadingIcon from '../../assets/images/loadingIcon.json';
import { LoadingIcon } from '../../shared/A-UI';
import { Link } from 'react-router-dom';
import { scroller, Element } from 'react-scroll';
import Lottie from 'lottie-react';
import { DebounceInput } from 'react-debounce-input';

export const PropertyList = () => {
  const [ properties, setProperties ] = useState([]);
  const [ isLoading, setLoading ] = useState(true);
  const [ clickedProperty, setClickedProperty ] = useState(null);
  const [ thumbnails, setThumbnail ] = useState({});
  const [ isPropertyLoading, setPropertyLoading ] = useState(true);
  const [ filter, setFilter ] = useState({ policies: {}, type: [] });

  document.title = `RoomRate - Properties`;

  const fetchData = useCallback(async () => {
    try {
      setPropertyLoading(true);
      const propertyList = await PropertyService.getPropertyList(filter);
      // eslint-disable-next-line max-len
      const thumbnailPromises = propertyList.map(property => PropertyService.getPropertyThumbnail({ property_id: property.id }));
      const thumbnail = await Promise.all(thumbnailPromises);
      const thumbnailList = {};
      propertyList.forEach((property, index) => {
        thumbnailList[property.id] = thumbnail[index];
      });
      setProperties(propertyList);
      setThumbnail(thumbnailList);
    }
    catch (err) {
      throw new Error(err);
    }
    finally {
      setLoading(false);
      setPropertyLoading(false);
    }
  }, [ filter ]);

  useEffect(() => {
    fetchData();
  }, [ fetchData ]);

  const renderPropertyMarkers = () => properties.map(p =>
    <Marker
      key={p.id}
      icon={MarkerIcon}
      position={[ p.coords.latitude, p.coords.longitude ]}
      eventHandlers={{
        click: () => {
          scrollToPropertyFromMarker({ property_id: p.id });
          setClickedProperty(p.id);
        },
        mouseover: (e) => {
          e.target.openPopup();
        },
        mouseout: (e) => {
          e.target.closePopup();
        },
      }}>
      <Popup autoPan={false}>
        <div>
          <h4 className="my-0">{p.street_1}</h4>
          {p.street_2 ? <h5 className="my-0 fw-light">Unit {p.street_2}</h5> : null}
        </div>
        <br />
        <br />
        <div>
          <h5 className="my-0">{p.rate}</h5 >
          <h5 className="my-0">{p.bed} Bed, {p.bath} Bath</h5>
        </div>
      </Popup>
    </Marker>);

  const scrollToPropertyFromMarker = ({ property_id }) => {
    scroller.scrollTo(`property-${property_id}`, {
      duration: 300,
      delay: 100,
      smooth: true,
      containerId: `propertyList`,
    });
  };

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

  const filterChange = (e) => {
    const _filter = filter;
    _filter[e.target.name] = e.target.value.trim();
    setFilter(_filter);
    fetchData();
  };

  const policiesCheckBoxFilterChange = (e) => {
    const _filter = filter.policies;
    _filter[e.target.name] = e.target.checked;
    const newFilter = { ...filter, policies: _filter };
    setFilter(newFilter);
    fetchData();
  };

  const houseTypeCheckBoxFilterChange = (e) => {
    const _filter = filter;
    switch (e.target.name) {
      case `fullHouse`:
        if (e.target.checked) {
          _filter.type.push(`Full House`);
        } else {
          _filter.type.splice(_filter.type.indexOf(`Full House`), 1);
        }
        break;
      case `splitHouse`:
        if (e.target.checked) {
          _filter.type.push(`Split House`);
        } else {
          _filter.type.splice(_filter.type.indexOf(`Split House`), 1);
        }
        break;
      case `apartment`:
        if (e.target.checked) {
          _filter.type.push(`Apartment`);
        } else {
          _filter.type.splice(_filter.type.indexOf(`Apartment`), 1);
        }
        break;
      case `sublease`:
        if (e.target.checked) {
          _filter.type.push(`Sublease`);
        } else {
          _filter.type.splice(_filter.type.indexOf(`Sublease`), 1);
        }
        break;
    }
    setFilter(_filter);
    fetchData();
  };

  return (
    isLoading ?
      <LoadingIcon /> :
      <div className="d-flex" style={{ height: `93.75vh`, overflow: `hidden` }}>
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
                <Dropdown.Menu style={{ width: `300px` }}>
                  <div className="d-flex mx-1">
                    <p className="mb-0 me-1">$</p>
                    <DebounceInput type="number"
                      className="w-100"
                      name="minPrice"
                      debounceTimeout={300}
                      onChange={filterChange} />
                    <p className="mb-0 mx-1">-</p>
                    <p className="mb-0 me-1">$</p>
                    <DebounceInput type="number"
                      className="w-100"
                      name="maxPrice"
                      debounceTimeout={300}
                      onChange={filterChange} />
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Bedrooms
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="d-flex mx-1">
                    <DebounceInput type="number"
                      className="w-100"
                      name="bedrooms"
                      debounceTimeout={300}
                      onChange={filterChange} />
                    <p className="mb-0 ms-1">beds</p>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Bathrooms
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="d-flex mx-1">
                    <DebounceInput type="number"
                      className="w-100"
                      name="bathrooms"
                      debounceTimeout={300}
                      onChange={filterChange} />
                    <p className="mb-0 ms-1">baths</p>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Amenities
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="mx-1">
                    <div>
                      <input type="checkbox" name="pets" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="pets">&nbsp;Pets Allowed</label>
                    </div>
                    <div>
                      <input type="checkbox" name="heat" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="heat">&nbsp;Central Heating</label>
                    </div>
                    <div>
                      <input type="checkbox" name="ac" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="ac">&nbsp;Air Conditioning</label>
                    </div>
                    <div>
                      <input type="checkbox" name="internet" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="internet">&nbsp;Internet Included</label>
                    </div>
                    <div>
                      <input type="checkbox" name="parking" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="parking">&nbsp;Parking</label>
                    </div>
                    <div>
                      <input type="checkbox" name="laundry" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="laundry">&nbsp;Laundry Onsite</label>
                    </div>
                    <div>
                      <input type="checkbox" name="utilities" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="utilities">&nbsp;Utilities Included</label>
                    </div>
                    <div>
                      <input type="checkbox" name="wheelchair" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="wheelchair">&nbsp;Disabled friendly</label>
                    </div>
                    <div>
                      <input type="checkbox" name="furnished" onChange={policiesCheckBoxFilterChange} />
                      <label htmlFor="furnished">&nbsp;Pre-furnished</label>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Type
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="mx-1">
                    <div>
                      <input type="checkbox" name="fullHouse" onChange={houseTypeCheckBoxFilterChange} />
                      <label htmlFor="fullHouse">&nbsp;Full House</label>
                    </div>
                    <div>
                      <input type="checkbox" name="splitHouse" onChange={houseTypeCheckBoxFilterChange} />
                      <label htmlFor="splitHouse">&nbsp;Split House</label>
                    </div>
                    <div>
                      <input type="checkbox" name="apartment" onChange={houseTypeCheckBoxFilterChange} />
                      <label htmlFor="Appartment">&nbsp;Apartment</label>
                    </div>
                    <div>
                      <input type="checkbox" name="sublease" onChange={houseTypeCheckBoxFilterChange} />
                      <label htmlFor="sublease">&nbsp;Sublease</label>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Distance
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: `200px` }}>
                  <div className="d-flex mx-1">
                    <DebounceInput type="number"
                      className="w-100"
                      name="minPrice"
                      debounceTimeout={300}
                      onChange={filterChange} />
                    <p className="mb-0 mx-1">-</p>
                    <DebounceInput type="number"
                      className="w-100"
                      name="maxPrice"
                      debounceTimeout={300}
                      onChange={filterChange} />
                    <p className="mb-0 ms-1">miles</p>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Search
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <DebounceInput type="text"
                    className="mx-1"
                    name="search"
                    debounceTimeout={300}
                    onChange={filterChange} />
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          </div>
          <Element
            id="propertyList"
            name="propertyList"
            style={{ overflowY: `scroll`, height: `88.75vh`, width: `100%` }}>
            {
              isPropertyLoading ?
                <div className="d-flex justify-content-center" style={{ height: `75vh` }}>
                  <div style={{ maxHeight: `300px`, maxWidth: `300px` }}>
                    <Lottie animationData={loadingIcon} loop={true} />
                  </div>
                </div> :
                properties.map(property => <Link
                  to={`/property/${property.id}/detail`}
                  style={{ color: `black`, textDecoration: `none` }}>
                  <Card
                    key={property.id}
                    id={`property-${property.id}`}
                    className={`propertyListing mb-3 ${clickedProperty === property.id ? `clicked-property` : ``}`}>
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
                            style={{ width: `100%`, height: `100%`, objectFit: `contain` }} />
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
                          <h3 className="my-0">${property.rate}</h3 >
                          <h3 className="my-0">{property.bed} Bed, {property.bath} Bath</h3>
                          <p className="my-0 fw-bold">Type: {property.propType}</p>
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
          </Element>
        </div>
      </div>
  );
};