const express = require('express');
const request = require('request');
const hbs = require('hbs');
const fs = require('fs');


var app = express();
var gallery;
var weather = '';
var location = 'vancouver';
var lat1 = 49.2827291;
var lng1 = -123.1207375;



hbs.registerPartials(__dirname + '/views/partials')

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.render('menu.hbs',
        );
        
});

app.get('/gallery', function (req,res) {
    console.log(gallery)
    res.render('gallery.hbs', {
        gallery : gallery,
    });
});

app.get('/weather', function (req, res) {
    res.send(
        '<br><a href = "/">Back To Main Page</a>' +
        '<h1>Weather in Vancouver</h1>' +
        "<br>Latitude and Longitude " + lat1 + " , " + lng1 + "<br>" +
        weather 
    )
});

app.listen(8080, () => {
    console.log('Server is up on the port 8080');
    request({
        url: 'https://jsonplaceholder.typicode.com/photos',
        json: true
    }, (error,response,body) => {
        if (error) {
            console.log('Cannot connect');
        } else {
            gallery =JSON.stringify(body[0].url);
            console.log(gallery)
        }
    });

    request({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAVpYDKYA_q9EugvOpwha3JnigP9ykiepU&address=' + location,
        json: true
    }, (error, response, body) => {

        if (error) {
            console.log('Cannot connect to Google Maps');
        } else if (body.status === 'ZERO_RESULTS') {
            console.log('Cannot find requested address');
        } else if (body.status === 'OK') {
            lat1 = JSON.stringify(body.results[0].geometry.location.lat)
            lng1 = JSON.stringify(body.results[0].geometry.location.lng)

            request({
                url: 'https://api.darksky.net/forecast/ae6be1c82ca0053bee0937c53c03df5a/' + lat1 + "," + lng1,
                json: true
            }, (error, response, body) => {

                if (error) {
                    console.log('Cannot connect to Google Maps');
                } else if (body.status === 'ZERO_RESULTS') {
                    console.log('Cannot find weather');
                } else {
                    console.log('Your requested coordinates: ' + lat1 + "," + lng1);
                    weather = 'Current weather in Fahrenheit: ' + (JSON.stringify(body.currently.summary, undefined, 2));
                    console.log('Temperature: ' + (JSON.stringify(body.currently.temperature, undefined, 2)));
                }
            });
        }
    });
    // here add the logic to return the weather and save it inside the weather variable
});