/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Dropdown, ButtonGroup, Badge } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { PropertyService } from "../../shared/services";
import { MarkerIcon } from "../../shared/A-UI";
// import { Image } from 'react-extras';
import loadingIcon from '../../assets/images/loadingIcon.json';
import { LoadingIcon } from '../../shared/A-UI';
import { Link } from 'react-router-dom';
import { scroller, Element } from 'react-scroll';
import Lottie from 'lottie-react';
import Select from 'react-select';
import { DebounceInput } from 'react-debounce-input';

export const PropertyList = () => {
  const [ properties, setProperties ] = useState([]);
  const [ isLoading, setLoading ] = useState(true);
  const [ clickedProperty, setClickedProperty ] = useState(null);
  const [ thumbnails, setThumbnail ] = useState({});
  const [ isPropertyLoading, setPropertyLoading ] = useState(true);
  const [ filter, setFilter ] = useState({ policies: {} });
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
      console.log(filter);
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
      position={[ p.lat, p.lng ]}
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

  const selectFilterChange = ({ value }, { name }) => {
    const _filter = filter;
    _filter[name] = value;
    setFilter(_filter);
    fetchData();
  };

  const checkBoxFilterChange = (e) => {
    const _filter = filter.policies;
    _filter[e.target.name] = e.target.checked;
    const newFilter = { ...filter, policies: _filter };
    setFilter(newFilter);
    fetchData();
  };

  const sortOptions = [
    { value: `priceAsc`, label: `Price Ascending` },
    { value: `priceDesc`, label: `Price Descending` },
    { value: `newer`, label: `Newest` },
    { value: `older`, label: `Oldest` },
  ];

  const propertyOptions = [
    { value: `Full House`, label: `Full House` },
    { value: `Split House`, label: `Split House` },
    { value: `Apartment`, label: `Apartment` },
    { value: `Sublease`, label: `Sublease` },
  ];

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
                <Dropdown.Menu>
                  <div className="d-flex mx-1">
                    <DebounceInput type="number"
                      className="w-100"
                      name="minPrice"
                      debounceTimeout={300}
                      onChange={filterChange} />
                    -
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
                      <input type="checkbox" name="pets" onChange={checkBoxFilterChange} />
                      <label htmlFor="pets">&nbsp;Pets Allowed</label>
                    </div>
                    <div>
                      <input type="checkbox" name="heat" onChange={checkBoxFilterChange} />
                      <label htmlFor="heat">&nbsp;Central Heating</label>
                    </div>
                    <div>
                      <input type="checkbox" name="ac" onChange={checkBoxFilterChange} />
                      <label htmlFor="ac">&nbsp;Air Conditioning</label>
                    </div>
                    <div>
                      <input type="checkbox" name="internet" onChange={checkBoxFilterChange} />
                      <label htmlFor="internet">&nbsp;Internet Included</label>
                    </div>
                    <div>
                      <input type="checkbox" name="parking" onChange={checkBoxFilterChange} />
                      <label htmlFor="parking">&nbsp;Parking</label>
                    </div>
                    <div>
                      <input type="checkbox" name="laundry" onChange={checkBoxFilterChange} />
                      <label htmlFor="laundry">&nbsp;Laundry Onsite</label>
                    </div>
                    <div>
                      <input type="checkbox" name="utilities" onChange={checkBoxFilterChange} />
                      <label htmlFor="utilities">&nbsp;Utilities Included</label>
                    </div>
                    <div>
                      <input type="checkbox" name="wheelchair" onChange={checkBoxFilterChange} />
                      <label htmlFor="wheelchair">&nbsp;Disabled friendly</label>
                    </div>
                    <div>
                      <input type="checkbox" name="furnished" onChange={checkBoxFilterChange} />
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
                  <Select
                    className="mx-1"
                    name="property"
                    options={propertyOptions}
                    onChange={selectFilterChange}
                  />
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="rounded-0 btn-lg" variant="secondary" id="dropdown-basic">
                  Sort By
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Select
                    className="mx-1"
                    name="sortBy"
                    options={sortOptions}
                    onChange={selectFilterChange}
                  />
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
          </Element>
        </div>
      </div>
  );
};