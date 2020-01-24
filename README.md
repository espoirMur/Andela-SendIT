## Andela-SendIT

SendIT is a courier service that helps users deliver parcels to different destinations. SendIT
provides courier quotes based on weight categories.

## Motivation

This project was given as a learning project for andela kigali bootcamp preparation, it help us to demonstrate our technical abilities by building a full-stack application.

## Build status

[![Maintainability](https://api.codeclimate.com/v1/badges/9e7b46a32f9fa04d5ee3/maintainability)](https://codeclimate.com/github/espoirMur/Andela-SendIT/maintainability)[![Build Status](https://travis-ci.org/espoirMur/Andela-SendIT.svg?branch=develop)](https://travis-ci.org/espoirMur/Andela-SendIT)
[![Coverage Status](https://coveralls.io/repos/github/espoirMur/Andela-SendIT/badge.svg?branch=develop)](https://coveralls.io/github/espoirMur/Andela-SendIT?branch=develop)

## Code style

We will be using Airbnb code style for javascript

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

    $ git clone https://github.com/espoirMur/Andela-SendIT.git
    $ cd Andela-SendIT
    $ npm install

Create .env file
create a .env and add the following elements
```
SECRET_KEY=''
PGHOST='localhost'
PGUSER=postgres
PGDATABASE_DEV=andelasendit
PGPASSWORD='your db password'
PGPORT=5432
PGDATABASE_TEST=andelasendittest
MAIL_USERNAME ='your username form stmp porvider'
MAIL_PASSWORD ='password'
```

  `$ psql -c 'create database andelasendit;' -U postgres`
  
  `$ npm run createDb`

### Start & watch

    $ npm start

### Run test

    $ npm test


## API Reference

### API Endpoints

| Resource URL                                    | Methods   | Description                                               |
| ----------------------------------------------- | --------- | --------------------------------------------------------- |
| `/`                                             | GET       | The index   
| `/api/v1/auth/login`         | POST      | Login registered user  |
| `/api/v1/auth/signup `       | POST      | Register a new User    |                                              |
| `/api/v1/parcels`                               | GET, POST | Fetch all delivery orders, create a parcel delivery order |
| `/api/v1/parcels/<string:id>`                   | GET | View, edit a delivery order                               |
| `/api/v1/users/<string:id>/parcels`             | GET       | get all parcel delivery orders by a specific users        |
| `/api/v1/parcels/<id>/cancel`       | PUT      | Update a parcel    |
| `/api/v1/parcels/<id>/status`      | PUT      | Update a parcel status    |
| `/api/v1/parcels/<id>/presentLocation `      | PUT      | Update a parcel current location    |
| `/api/v1/parcels/<id>/destination`       | PUT      | Update a parcel destination    |
| `/api/v1/users/<id>/parcels/<id>` | GET | View a specific parcel delivery order for a user   |

The full documentation can be found [here](https://documenter.getpostman.com/view/2725783/RzfcNXj2)

### Running the APIS

Use postman to run this collection

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/2725783/RzfcNXj2)

## Credits

I used the following tutorials to build this project

- [This Guide for the readme style](https://medium.com/@meakaakka/a-beginners-guide-to-writing-a-kickass-readme-7ac01da88ab3)

- [Tutorial 1](https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai)

- [Tutorial 2](https://medium.com/@purposenigeria/build-a-restful-api-with-node-js-and-express-js-d7e59c7a3dfb)

- [Tutorial 3](http://dsernst.com/2015/09/02/node-mocha-travis-istanbul-coveralls-unit-tests-coverage-for-your-open-source-project/)

# Acknowledgments

- [Obinna Okwuolisa](https://github.com/andela-ookwuolisa)
- [Kamara Deo](https://github.com/dkam26)

## License

MIT © [espoirMur](https://github.com/espoirMur)
