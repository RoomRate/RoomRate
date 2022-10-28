import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { PropertyDetails } from '../components/Properties/propertyDetail';
import { PropertyList } from '../components/Properties/propertyList';
import { ChatView } from 'components/Chat/ChatView';

export const RoutesComponent = () =>
  <Routes>
    <Route path="/" element={<PropertyList />} />
    <Route path="/property/:id/detail" element={<PropertyDetails />} />
    <Route path="/chat" element={<ChatView />} />
  </Routes>;
