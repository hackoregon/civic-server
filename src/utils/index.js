import { compose } from 'redux';
import getPropsFromRoutes from './getPropsFromRoutes';
import clientBootstrapper from './clientBootstrapper';
import identity from './identity';
import isClient from './isClient';

export default {
  compose,
  isClient,
  identity,
  clientBootstrapper,
  getPropsFromRoutes,
};