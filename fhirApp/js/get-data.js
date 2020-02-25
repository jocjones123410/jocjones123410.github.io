const appMode = '';

const PATIENT_TYPE = 'Patient';
const CONDITION_TYPE = 'Condition';	
const ALLERGY_INTOLERANCE_TYPE = 'AllergyIntolerance';
const MEDICATION_STATEMENT_TYPE = 'MedicationStatement';
const OBSERVATION_TYPE = 'Observation';
const COVERAGE_TYPE = 'Coverage';
const CONSENT_TYPE = 'Consent';
const SUBJECT_PARAMETER = '?subject=';
const PATIENT_PARAMETER = '?patient=';
const BENEFICIARY_PARAMETER = '?beneficiary=';
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
	
	function getPatient(client, patientId){
		return client.request(PATIENT_TYPE + "/" + patientId);
	}
	
	function getConditions(client, patientId){
		return client.request(CONDITION_TYPE + SUBJECT_PARAMETER + patientId);
	}	
	
	function getAllergies(client, patientId){
		return client.request(ALLERGY_INTOLERANCE_TYPE + PATIENT_PARAMETER + patientId);
	}
	
	function getMedications(client, patientId){
		return client.request(MEDICATION_STATEMENT_TYPE + SUBJECT_PARAMETER + patientId);
	}
	
	/*function getMedications(bundle){
		return getResourceFromBundle(bundle,medicationStatementResource);
	}*/
	
	function getObservations(client, patientId){
		return client.request(OBSERVATION_TYPE + SUBJECT_PARAMETER + patientId);
	}
	
	/*function getObservations(bundle){
		var observations = getResourceFromBundle(bundle,observationResource);
		observations.sort((a, b) => (a.issued < b.issued) ? 1 : -1);
		return observations;
	}*/
	
	function getCoverage(client, patientId){
		return client.request(COVERAGE_TYPE + BENEFICIARY_PARAMETER + patientId);
	}
	
	/*function getCoverage(bundle){
		return getResourceFromBundle(bundle,coverageResource);
	}*/
	
	function getConsent(client, patientId){
		return client.request(CONSENT_TYPE + PATIENT_PARAMETER + patientId);
	}
	
	/*function getConsent(bundle){
		return getResourceFromBundle(bundle, consentResource);
	}*/
	
	function getPractitioner(bundle){
		return getResourceFromBundle(bundle, practitionerResource);
	}
	
	function getOrganization(bundle){
		return getResourceFromBundle(bundle, organizationResource);
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
	