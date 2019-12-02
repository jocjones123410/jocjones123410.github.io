const patientResource = 'Patient';
const conditionResource = 'Condition';	
const allergyResource = 'AllergyIntolerance';
const medicationStatementResource = 'MedicationStatement';
const observationResource = 'Observation';
const coverageResource = 'Coverage';
const consentResource = 'Consent';
const practitionerResource = 'Practitioner';
const organizationResource = 'Organization';
	
	function getResourceFromBundle(bundle, type){
		if(bundle.entry){
			var resources = [];
			for(var i = 0;i < bundle.entry.length;i++){
				if(bundle.entry[i].resource.resourceType){
					if(type === bundle.entry[i].resource.resourceType){
						resources.push(bundle.entry[i].resource);
					}
				}
			}	
			return resources;
		}			
	}
	
	function getPatients(bundle){
		return getResourceFromBundle(bundle, patientResource);
	}
	
	function getConditions(bundle){
		return getResourceFromBundle(bundle,conditionResource);
	}
	
	function getAllergies(bundle){
		return getResourceFromBundle(bundle,allergyResource);
	}
	
	function getMedications(bundle){
		return getResourceFromBundle(bundle,medicationStatementResource);
	}
	
	function getObservations(bundle){
		return getResourceFromBundle(bundle,observationResource);
	}
	
	function getCoverage(bundle){
		return getResourceFromBundle(bundle,coverageResource);
	}
	
	function getConsent(bundle){
		return getResourceFromBundle(bundle, consentResource);
	}
	
	function getPractitioner(bundle){
		return getResourceFromBundle(bundle, practitionerResource);
	}
	
	function getOrganization(bundle){
		return getResourceFromBundle(bundle, organizationResource);
	}

var client = new FHIR.client("http://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSJ9/fhir");
FHIR.oauth2.ready().then(function(client) {
//const client = new FHIR.client("https://r3.smarthealthit.org");
client = new FHIR.client("https://r3.smarthealthit.org");
client.request("Patient/6f0dafdc-94c5-4ab2-9208-b2872450737a")
//client.request("Patient?_id=6f0dafdc-94c5-4ab2-9208-b2872450737a&_revinclude=Condition:subject&_revinclude=AllergyIntolerance:patient")
    //.then(displayPatient(testPatientResource))
	.then(displayReport(testBatch))
    .catch(display);
	}).catch(console.error);
/*client.request("/MedicationRequest?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a", {
    resolveReferences: "medicationReference"
}).then(displayMedication)
	.catch(display);*/
