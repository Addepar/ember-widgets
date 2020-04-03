import resolver from './helpers/resolver';
import {
  setResolver
} from '@ember/test-helpers';
import { start } from 'ember-cli-qunit';
import { default as registerRAFWaiter } from 'ember-raf-scheduler/test-support/register-waiter';

registerRAFWaiter();
setResolver(resolver);
start();
