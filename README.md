# SMART on FHIR Client Application
This application will display a patient's pertinent data when being transfered to the ED from a nursing home facility.


### Tech Stack
- Vanilla JavaScript
- CSS
- [client-js](http://docs.smarthealthit.org/client-js/#browser-usage)


### SMART Authorization
OAuth2/launch flow
1. Direct the browser to the launch.html to start the authorization process
2. Upon successful authorization, then redirect to to the index.html page where the app is initialized


### Application work flow
Authorization Successful
- Redirect to the index.html page (location of html DOM)
  - User enters MRN and clicks 'Search'
  - MRN found on FHIR server
    - Retrieve the following resources from the FHIR server
      1. Patient
      2. Condition
      3. AllergyIntolerance
      4. MedicationStatement
      5. Observation
      6. Coverage
      7. Consent
      8. Practitioner
      9. Organization
    - Populate the DOM with data from resources
    - Display report
  - MRN not found on FHIR server
    - Stay on search page and display 'MRN not found'
Authorization Failed
- Display authorization failure message


### FHIR Version
This app has been written and tested against FHIR Release 3
