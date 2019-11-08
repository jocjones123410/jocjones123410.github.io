function displayPatient (pt) {  
  createHeader(pt);
  displayContactInfo(pt);
}

function displayConditions (conditions){
	renderList('conditionListId', getConditions(conditions));	
}

function displayAllergies (allergies){
	renderList('allergyListId', getAllergies(allergies));
}

function displayMedication (meds){
	renderList('medicationListId', getMeds(meds));
}	

function displayDiagnosticRpt(report){
	renderList('labListId', getDiagnosticRpt(report));	
}

function displayCoverage(coverage){
	renderElements('coverageId', getCoverage(coverage));
}

function displayDirective(consent){
	renderElements('dnrId', getDirective(consent));
}

function displayContactInfo (pt){
	renderElements('contactInfoId', getContactInfo(pt));
}

function displayPractioner(practitioner){
	renderElements('practionerId', getPractitioner(practitioner));
}

function displayOrganization(organization){
	renderElements('organizationId', getOrg(organization));
}
 
function renderList(elementId, list){
	document.getElementById(elementId).innerHTML = '<ul>' + list + '</ul>';
}	
 
function renderElements(elementId, htmlElement){
	document.getElementById(elementId).innerHTML = htmlElement; 
}	
  
function createHeader(pt){
	renderElements('patientName', getPatientName(pt));
	renderElements('mrnId', getMrn(pt));
	renderElements('raceId', getRace(pt));
	renderElements('genderId', getGender(pt));
	renderElements('dobId', getBirthDate(pt));
	renderElements('addressId', getAddress(pt));
	renderElements('contactId', getTelecom(pt));
	renderElements('maritalStatusId', getMarried(pt));	
}	
 
function display(data) {
    const output = document.getElementById("display");
    output.innerText = data instanceof Error ?
        String(data) :
        JSON.stringify(data, null, 4);
} 