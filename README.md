## Andela-SendIT

SendIT is a courier service that helps users deliver parcels to different destinations. SendIT
provides courier quotes based on weight categories.

## Motivation

This project was given as a learning project for andela kigali bootcamp preparation, it help us to demonstrate our technical abilities by building a full-stack application.

## Build status

[![Maintainability](https://api.codeclimate.com/v1/badges/9e7b46a32f9fa04d5ee3/maintainability)](https://codeclimate.com/github/espoirMur/Andela-SendIT/maintainability)[![Build Status](https://travis-ci.org/espoirMur/Andela-SendIT.svg?branch=develop)](https://travis-ci.org/espoirMur/Andela-SendIT)[![Coverage Status](https://coveralls.io/repos/github/espoirMur/Andela-SendIT/badge.svg?branch=develop)](https://coveralls.io/github/espoirMur/Andela-SendIT?branch=develop)

## Code style

We will be using Airbnb code style for javascript

## Screenshots

**Coming soon**

## Tech/framework used

<b>Built with</b>

- HTML+ CSS
- Vanilla Javascript ES6
- NodeJs/ Express
- Mocha and Chai for unittest

## Features

### Here are Required Features:

1. Users can create an account and log in.

2. Users can create a parcel delivery order.

3. Users can change the destination of a parcel delivery order.

4. Users can cancel a parcel delivery order.

5. Users can see the details of a delivery order.

6. Admin can change the status and present location of a parcel delivery order.

### Optional Features are :

1. The application should display a Google Map with Markers showing the pickup location
   and the destination .

2. The application should display computed travel distance and journey duration between
   the pickup location and the destination. Leverage Google Maps [Distance Matrix Service](https://www.google.com/url?q=https://developers.google.com/maps/documentation/javascript/examples/distance-matrix&ust=1540951920000000&usg=AFQjCNEYH17s27tYweNRYehge7Lw0ReUeA&hl=en-GB&source=gmail).

3. The user gets real-time email notification when Admin changes the status of their parcel.

4. The user gets real-time email notification when Admin changes the present location of
   their parcel.

## Installation

Here are the step to install :

## API Reference

## API Endpoints

| Resource URL                                    | Methods   | Description                                               |
| ----------------------------------------------- | --------- | --------------------------------------------------------- |
| `/`                                             | GET       | The index                                                 |
| `/api/v1/parcels`                               | GET, POST | Fetch all delivery orders, create a parcel delivery order |
| `/api/v1/parcels/<string:id>`                   | GET, PUT  | View, edit a delivery order                               |
| `/api/v1/users/<string:id>/parcels`             | GET       | get all parcel delivery orders by a specific users        |
| `/api/v1/parcels/<string:id>/cancel`            | PUT       | cancel the specific parcel delivery order                 |
| `/api/v1/users/<string:id>/parcels/<string:id>` | GET, PUT  | View , edit a specific parcel delivery order for a user   |

## Tests

The test was runned using chai and mocha framework

## Credits

I used the following tutorials to build this project

- [This Guide for the readme style](https://medium.com/@meakaakka/a-beginners-guide-to-writing-a-kickass-readme-7ac01da88ab3)

- [Tutorial 1](https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai)

- [Tutorial 2](https://medium.com/@purposenigeria/build-a-restful-api-with-node-js-and-express-js-d7e59c7a3dfb)

- [Tutorial 3](http://dsernst.com/2015/09/02/node-mocha-travis-istanbul-coveralls-unit-tests-coverage-for-your-open-source-project/)

## License

MIT © [espoirMur](https://github.com/espoirMur)
