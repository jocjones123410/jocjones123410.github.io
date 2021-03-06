const PATIENT_TYPE = 'Patient';
const CONDITION_TYPE = 'Condition';	
const ALLERGY_INTOLERANCE_TYPE = 'AllergyIntolerance';
const MEDICATION_STATEMENT_TYPE = 'MedicationStatement';
const OBSERVATION_TYPE = 'Observation';
const COVERAGE_TYPE = 'Coverage';
const CONSENT_TYPE = 'Consent';
const PRACTITIONER_TYPE = 'Practitioner';
const ORGANIZATION_TYPE = 'Organization';
const GENERAL_PRACTITIONER_REFERENCE = 'general-practitioner';
const ORGANIZATION_REFERENCE = 'organization';
const ID_PARAMETER = '?_id=';
const SUBJECT_PARAMETER = '?subject=';
const PATIENT_PARAMETER = '?patient=';
const BENEFICIARY_PARAMETER = '?beneficiary=';
const INCLUDE = '&_include=';
	
	function getPatient(client, patientId){
		//return client.request(PATIENT_TYPE + "/" + patientId, resolveReferences: ["generalPractitioner"]);
		let requestString = PATIENT_TYPE + ID_PARAMETER + patientId + INCLUDE + PATIENT_TYPE + ':' + GENERAL_PRACTITIONER_REFERENCE + INCLUDE + PATIENT_TYPE + ':' + ORGANIZATION_REFERENCE;
		return client.request(requestString);
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
	
	function getOrganization(bundle){
		return getResourceFromBundle(bundle, organizationResource);
	}
	
	if('test' === properties.appMode){
		client = new FHIR.client(properties.baseUrl);
		show('patientSearch');
		document.getElementById("searchButton").onclick = function(){getReport(client)};		
	}else{
		FHIR.oauth2.ready().then(function(client) {
			show('patientSearch');
			document.getElementById("searchButton").onclick = function(){getReport(client)};			
		}).catch(function(data){show('authError');});
	}
