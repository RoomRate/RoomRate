import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { PropertyDetails } from '../components/Properties/propertyDetail';
import { PropertyList } from '../components/Properties/propertyList';
import { ChatView } from 'components/Chat/ChatView';
import { PropertyForm } from '../components/Properties/propertyForm';
import { UserForm } from '../components/Users/userForm';
import { LogIn } from 'components/Login/logIn';
import { SignUp } from 'components/Login/signUp';
import { ForgotPassword } from 'components/Login/forgotPass';

export const RoutesComponent = () =>
  <Routes>
    <Route path="/" element={<PropertyList />} />
    <Route path="/property/:id/detail" element={<PropertyDetails />} />
    <Route path="/chat" element={<ChatView />} />
    <Route path="/property/form" element={<PropertyForm />} />
    <Route path="/user/form" element={<UserForm />} />
    <Route path="/login" element={<LogIn />} />
    <Route path="/login/signup" element={<SignUp />} />
    <Route path="/login/password" element={<ForgotPassword />} />
  </Routes>;
