# Backend API Documentation

This documentation covers all available API endpoints for the backend.

---

## Endpoint: `/users/register`

### Description

Registers a new user by creating a user account with the provided information.

### HTTP Method

`POST`

### Request Body

The request body should be in JSON format and include the following fields:

- **fullname** (object):
  - **firstname** (string, required): User's first name (minimum 3 characters).
  - **lastname** (string, optional): User's last name (minimum 3 characters).
- **email** (string, required): User's email address (must be a valid email).
- **password** (string, required): User's password (minimum 6 characters).

#### Example Request Body

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

### Example Response

- **user** (object):
  - **fullname** (object)
    - **firstname** (string): User's first name (minimum 3 characters).
    - **lastname** (string): User's last name (minimum 3 characters).
  - **email** (string): User's email address (must be a valid email).
  - **socketId** (string or null): User's socket ID.
  - **\_id** (string): User's unique ID.
- **token** (string): JWT Token.

#### Example Response Body

```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "socketId": "string or null"
  }
}
```

## Endpoint: `/users/login`

### Description

Authenticates a user and returns a JWT token if credentials are valid.

### HTTP Method

POST

### Request Body

The request body should be in JSON format and include the following fields:

- **email** (string, required): User's email address (must be a valid email).
- **password** (string, required): User's password (minimum 6 characters).

#### Example Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

### Example Response

- **user** (object):
  - **\_id** (string): User's unique ID.
  - **fullname** (object)
    - **firstname** (string): User's first name (minimum 3 characters).
    - **lastname** (string): User's last name (minimum 3 characters).
  - **email** (string): User's email address (must be a valid email).
  - **socketId** (string or null): User's socket ID.
- **token** (string): JWT Token.

#### Example Response Body

```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "socketId": "string or null"
  }
}
```

## Endpoint: `/users/profile`

### Description

Retrieves the authenticated user's profile information.

### HTTP Method

GET

### Request Headers

- **Authorization** (string, required): Bearer token (JWT) for authentication.

### Example Response

- **\_id** (string): User's unique ID.
- **fullname** (object)
  - **firstname** (string): User's first name.
  - **lastname** (string): User's last name.
- **email** (string): User's email address.
- **socketId** (string or null): User's socket ID.

#### Example Response Body

```json
{
  "_id": "string",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "socketId": "string or null"
}
```

---

## Endpoint: `/users/logout`

### Description

Logs out the authenticated user by invalidating their JWT token.

### HTTP Method

GET

### Request Headers

- **Authorization** (string, required): Bearer token (JWT) for authentication.

### Example Response

- **message** (string): Confirmation message.

#### Example Response Body

```json
{
  "message": "Logout Successfully"
}
```

## Endpoint: `/captains/register`

### Description

Registers a new captain by creating a captain account with the provided information and vehicle details.

### HTTP Method

POST

### Request Body

The request body should be in JSON format and include the following fields:

- **fullname** (object):
  - **firstname** (string, required): Captain's first name (minimum 3 characters).
  - **lastname** (string, optional): Captain's last name (minimum 3 characters).
- **email** (string, required): Captain's email address (must be a valid email).
- **password** (string, required): Captain's password (minimum 6 characters).
- **vehicle** (object, required):
  - **color** (string, required): Vehicle color.
  - **plate** (string, required): Vehicle plate number.
  - **capacity** (number, required): Vehicle capacity.
  - **vehicleType** (string, required): Type of the vehicle.

#### Example Request Body

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string",
  "vehicle": {
    "color": "string",
    "plate": "string",
    "capacity": "number",
    "vehicleType": "string"
  }
}
```

### Example Response

- **captain** (object):
  - **\_id** (string): Captain's unique ID.
  - **fullname** (object)
    - **firstname** (string): Captain's first name.
    - **lastname** (string): Captain's last name.
  - **email** (string): Captain's email address.
  - **vehicle** (object)
    - **color** (string): Vehicle color.
    - **plate** (string): Vehicle plate number.
    - **capacity** (number): Vehicle capacity.
    - **vehicleType** (string): Type of the vehicle.
- **token** (string): JWT Token.

#### Example Response Body

```json
{
  "token": "string",
  "captain": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "vehicleType": "string"
    }
  }
}
```

## Endpoint: `/captains/login`

### Description

Authenticates a captain and returns a JWT token if credentials are valid.

### HTTP Method

POST

### Request Body

The request body should be in JSON format and include the following fields:

- **email** (string, required): Captain's email address (must be a valid email).
- **password** (string, required): Captain's password (minimum 6 characters).

#### Example Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

### Example Response

- **captain** (object):
  - **\_id** (string): Captain's unique ID.
  - **fullname** (object)
    - **firstname** (string): Captain's first name.
    - **lastname** (string): Captain's last name.
  - **email** (string): Captain's email address.
  - **vehicle** (object)
    - **color** (string): Vehicle color.
    - **plate** (string): Vehicle plate number.
    - **capacity** (number): Vehicle capacity.
    - **vehicleType** (string): Type of the vehicle.
- **token** (string): JWT Token.

#### Example Response Body

```json
{
  "token": "string",
  "captain": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "vehicleType": "string"
    }
  }
}
```

---

## Endpoint: `/captains/profile`

### Description

Retrieves the authenticated captain's profile information.

### HTTP Method

GET

### Request Headers

- **Authorization** (string, required): Bearer token (JWT) for authentication.

### Example Response

- **\_id** (string): Captain's unique ID.
- **fullname** (object)
  - **firstname** (string): Captain's first name.
  - **lastname** (string): Captain's last name.
- **email** (string): Captain's email address.
- **vehicle** (object)
  - **color** (string): Vehicle color.
  - **plate** (string): Vehicle plate number.
  - **capacity** (number): Vehicle capacity.
  - **vehicleType** (string): Type of the vehicle.

#### Example Response Body

```json
{
  "_id": "string",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "vehicle": {
    "color": "string",
    "plate": "string",
    "capacity": "number",
    "vehicleType": "string"
  }
}
```

---

## Endpoint: `/captains/logout`

### Description

Logs out the authenticated captain by invalidating their JWT token.

### HTTP Method

GET

### Request Headers

- **Authorization** (string, required): Bearer token (JWT) for authentication.

### Example Response

- **message** (string): Confirmation message.

#### Example Response Body

```json
{
  "message": "Logout Successfully"
}
```

---

## Endpoint: `/maps/get-coordinates`

### Description

Returns the latitude and longitude for a given address.

### HTTP Method

GET

### Request Query Parameters

- **address** (string, required): The address to geocode.

### Request Headers

- **Authorization** (string, required): Bearer token (JWT) for authentication.

#### Example Request

```
GET /api/maps/get-coordinates?address=New+York
```

### Example Response

- **coordinates** (object):
  - **lat** (number): Latitude.
  - **lng** (number): Longitude.

#### Example Response Body

```json
{
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.006
  }
}
```

---

## Endpoint: `/maps/get-distance-time`

### Description

Returns the distance and estimated travel time between two addresses.

### HTTP Method

GET

### Request Query Parameters

- **origin** (string, required): Origin address.
- **destination** (string, required): Destination address.

#### Example Request

```
GET /api/maps/get-distance-time?origin=New+York&destination=Boston
```

### Example Response

- **distanceTime** (object):
  - **distance** (string): Distance (e.g., "215 Km").
  - **duration** (string): Estimated duration (e.g., "4 Min").

#### Example Response Body

```json
{
  "distanceTime": {
    "distance": "2 Km",
    "duration": "4 Min"
  }
}
```

---

## Endpoint: `/maps/get-suggestions`

### Description

Returns autocomplete suggestions for a location input.

### HTTP Method

GET

### Request Query Parameters

- **input** (string, required): The partial address or place name.

#### Example Request

```
GET /api/maps/get-suggestions?input=New
```

### Example Response

- **suggestions** (array): List of suggestion strings.

#### Example Response Body

```json
{
  "suggestions": [
    {
      "place_id": "321532520081",
      "osm_id": "12773165",
      "osm_type": "relation",
      "licence": "https://locationiq.com/attribution",
      "lat": "30.7334421",
      "lon": "76.7797143",
      "boundingbox": ["30.664974", "30.7949512", "76.7049857", "76.849028"],
      "class": "place",
      "type": "city",
      "display_name": "Chandigarh, Chandigarh, Chandigarh, India",
      "display_place": "Chandigarh",
      "display_address": "India",
      "address": {
        "name": "Chandigarh",
        "county": "Chandigarh",
        "state": "Chandigarh",
        "country": "India",
        "country_code": "in"
      }
    }
  ]
}
```

---

## Endpoint: `/rides/create-ride`

### Description

Creates a new ride request for a user.

### HTTP Method

POST

### Request Body

- **pickup** (string, required): Pickup location.
- **destination** (string, required): Destination location.
- **vehicleType** (string, required): Type of vehicle ("auto", "car", or "motorcycle").

#### Example Request Body

```json
{
  "pickup": "123 Main St",
  "destination": "456 Elm St",
  "vehicleType": "car"
}
```

### Request Headers

- **Authorization** (string, required): Bearer token (JWT) for authentication.

### Example Response

- **ride** (object): The created ride object.

#### Example Response Body

```json
{
  "ride": {
    "_id": "ride_id",
    "user": "user_id",
    "pickup": "123 Main St",
    "destination": "456 Elm St",
    "vehicleType": "car",
    "otp": "123123",
    "status": "pending"
  }
}
```

---

## Endpoint: `/rides/get-fare`

### Description

Calculates and returns fare estimates for all vehicle types between two locations.

### HTTP Method

POST

### Request Headers

- **Authorization** (string, required): Bearer token (JWT) for authentication.

### Request Body

- **pickup** (string, required): Pickup location (minimum 3 characters).
- **destination** (string, required): Destination location (minimum 3 characters).

#### Example Request Body

```json
{
  "pickup": "123 Main St",
  "destination": "456 Elm St"
}
```

### Example Response

- **fares** (object): Estimated fares for each vehicle type.
  - **auto** (number): Fare for auto.
  - **car** (number): Fare for car.
  - **motorcycle** (number): Fare for motorcycle.

#### Example Response Body

```json
{
  "fares": {
    "auto": 80,
    "car": 120,
    "motorcycle": 60
  }
}
```
