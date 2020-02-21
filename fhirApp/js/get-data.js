const appMode = '';

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
	
	function getPatientResource(client, patientId){
		return client.request(patientResource + "/" + patientId);
	}
	
	/*function getPatients(bundle){
		return getResourceFromBundle(bundle, patientResource);
	}*/
	
	function getConditionResource(client, patientId){
		return client.request(conditionResource + "?subject=" + patientId);
	}
	
	/*function getConditions(bundle){
		var conditions = getResourceFromBundle(bundle,conditionResource);
		conditions.sort((a, b) => (a.onsetDateTime < b.onsetDateTime) ? 1 : -1);
		return conditions;
	}*/	
	
	function getAllergyResource(client, patientId){
		return client.request(allergyResource + "?patient=" + patientId);
	}
	
	/*function getAllergies(bundle){
		return getResourceFromBundle(bundle,allergyResource);				
	}*/
	
	function getMedications(client, patientId){
		return client.request(medicationStatementResource + "?subject=" + patientId);
	}
	
	/*function getMedications(bundle){
		return getResourceFromBundle(bundle,medicationStatementResource);
	}*/
	
	function getObservations(client, patientId){
		return client.request(observationResource + "?subject=" + patientId);
	}
	
	/*function getObservations(bundle){
		var observations = getResourceFromBundle(bundle,observationResource);
		observations.sort((a, b) => (a.issued < b.issued) ? 1 : -1);
		return observations;
	}*/
	
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
	
	function getPatientId(client){
		return "6f0dafdc-94c5-4ab2-9208-b2872450737a";
		/*var mrn = document.getElementById("mrn").value;
		var patientId = '';
		client.request("Patient?identifier:otype=http://hospital.smarthealthit.org|" + mrn)
			.then(function(data){
				if(data.entry[0].resource.id){
					patientId = data.entry[0].resource.id;				
				}
			});
		return patientId;*/
	}
	
	if('test' === appMode){
		client = new FHIR.client("https://r3.smarthealthit.org");
		client.request("Patient/6f0dafdc-94c5-4ab2-9208-b2872450737a")
		.then(displayReport(testBatch))
		.catch();
	}else{
		FHIR.oauth2.ready().then(function(client) {
			show('patientSearch');
			var searchButton = document.getElementById("searchButton").onclick = function(){getReport(client)};
			//var searchButton = document.getElementById("searchButton").onclick = function(){getPatientId(client)};			
		}).catch(function(data){show('authError');});
	}
//const client = new FHIR.client("https://r3.smarthealthit.org");
//FHIR.oauth2.ready().then(function(client) {
//const client = new FHIR.client("https://r3.smarthealthit.org");
//client = new FHIR.client("https://r3.smarthealthit.org");
//client.request("Patient/6f0dafdc-94c5-4ab2-9208-b2872450737a")
//client.request("Patient?_id=6f0dafdc-94c5-4ab2-9208-b2872450737a&_revinclude=Condition:subject&_revinclude=AllergyIntolerance:patient")
    //.then(displayPatient(testPatientResource))
	//.then(displayReport(testBatch))
    //.catch(display);
	//}).catch(show('authError'));
	
/*
client.request("/MedicationRequest?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a", {
    resolveReferences: "medicationReference"
}).then(displayMedication)
	.catch(display);*/

	
//This will get the patient by the MRN	
//https://r3.smarthealthit.org/Patient?identifier:otype=http://hospital.smarthealthit.org|11eab7ea-963a-48ee-8a4f-ca789862f858
	