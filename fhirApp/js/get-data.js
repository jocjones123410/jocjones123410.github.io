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
	
	function getObservations(client, patientId){
		return client.request(OBSERVATION_TYPE + SUBJECT_PARAMETER + patientId);
	}
	
	function getCoverage(client, patientId){
		return client.request(COVERAGE_TYPE + BENEFICIARY_PARAMETER + patientId);
	}
	
	function getConsent(client, patientId){
		return client.request(CONSENT_TYPE + PATIENT_PARAMETER + patientId);
	}
	
	function getPractitioner(bundle){
		return getResourceFromBundle(bundle, practitionerResource);
	}
	
	function getOrganization(bundle){
		return getResourceFromBundle(bundle, organizationResource);
	}
	
	if('test' === appMode){
		client = new FHIR.client("https://r3.smarthealthit.org");
		show('patientSearch');
		var searchButton = document.getElementById("searchButton").onclick = function(){getReport(client)};
		/*client.request("Patient/6f0dafdc-94c5-4ab2-9208-b2872450737a")
		.then(displayReport(testBatch))
		.catch();*/
	}else{
		FHIR.oauth2.ready().then(function(client) {
			show('patientSearch');
			var searchButton = document.getElementById("searchButton").onclick = function(){getReport(client)};			
		}).catch(function(data){show('authError');});
	}
