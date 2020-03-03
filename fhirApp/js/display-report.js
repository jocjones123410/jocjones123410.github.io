const NO_DATA_AVAILABLE = 'No data available';

async function renderReport(client, patientId){	
	initReportDisplay();
		
	renderPatientDemographics(client, patientId);
	renderConditions(client, patientId);
	renderAllergies(client, patientId);
	renderMedications(client, patientId);
	renderObservations(client, patientId);
	renderCoverage(client, patientId);
	renderAdvancedDirective(client, patientId);
	
	show('report');
}

/*async function renderReportSections(client, patientId){
	renderPatientDemographics(client, patientId);
	renderConditions(client, patientId);
	renderAllergies(client, patientId);
	renderMedications(client, patientId);
	renderObservations(client, patientId);
	renderCoverage(client, patientId);
	renderAdvancedDirective(client, patientId);
}*/

function renderPatientDemographics(client, patientId){
	getPatient(client, patientId).then(function(data){
		populatePatientDemographics(data);
		populatePersonalContactSection(data);
		populateContactSection(data);
	});
}

function renderConditions(client, patientId){
	getConditions(client, patientId).then(function(data){
		populateConditionTable(data);
	});
}

function renderAllergies(client, patientId){
	getAllergies(client, patientId).then(function(data){
		populateAllergyTable(data);
	});
}

function renderMedications(client, patientId){
	getMedications(client, patientId).then(function(data){
		populateMedicationsTable(data);
	});
}

function renderObservations(client, patientId){
	getObservations(client, patientId).then(function(data){
		populateLabsTable(data);
		populateVitalsTable(data);
	});
}

function renderCoverage(client, patientId){
	getCoverage(client, patientId).then(function(data){
		populateCoverageSection(data);
	});
}

function renderAdvancedDirective(client, patientId){
	getConsent(client, patientId).then(function(data){
		populateAdvancedDirectiveSection(data);
	});
}
		
	
async function getReport(client){		
		let patientId = '';
		let mrn = document.getElementById("mrn").value;		
		client.request("Patient?identifier:otype=http://hospital.smarthealthit.org|" + mrn)
			.then(function(data){
				if(data.entry[0].resource.id){							
					patientId = data.entry[0].resource.id;
					renderReport(client, patientId);
				}
			}).catch(function(data){show('inputError')});			
}

function populateConditionTable(conditionBundle){
	if(conditionBundle.total > 0){		
		let conditions = conditionBundle.entry;		
		conditions.sort((a, b) => (a.resource.onsetDateTime < b.resource.onsetDateTime) ? 1 : -1);
		for(let i=0;i<conditions.length;i++){ 
			if("active" === conditions[i].resource.clinicalStatus){
				let onsetDate = '';
				let display = '';
				let clinicalStatus = '';
				let verificationStatus = '';
				
				onsetDate = tableDataWrapper(formatDate(conditions[i].resource.onsetDateTime));				
				display = tableDataWrapper(conditions[i].resource.code.coding[0].display);
				clinicalStatus = tableDataWrapper(conditions[i].resource.clinicalStatus);
				verificationStatus = tableDataWrapper(conditions[i].resource.verificationStatus);
				let conditionRow = onsetDate + display + clinicalStatus + verificationStatus;
				conditionRow = tableRowWrapper(conditionRow);
				setDomElement('conditionEntries',conditionRow);			
			}
		}
	}else{
		noDataMessage('conditionTable', 'noCondData');
		//hide('conditionTable');	
		//setDomElement('noCondData', NO_DATA_AVAILABLE);
	}
}

function populateAllergyTable(allergyBundle){
	if(allergyBundle.total > 0){
		let allergies = allergyBundle.entry;
		allergies.sort((a, b) => (a.resource.assertedDate < b.resource.assertedDate) ? 1 : -1);
		for(let i=0;i<allergies.length;i++){
			if("active" === allergies[i].resource.clinicalStatus){
				if(allergies[i].resource.code.coding){
					let assertedDate = tableDataWrapper(formatDate(allergies[i].resource.assertedDate));
					let categoryVal = "";
					
					if(allergies[i].resource.category){
						categoryVal = allergies[i].resource.category[0];
					}						
					let category = tableDataWrapper(categoryVal);
					let entry = tableDataWrapper(allergies[i].resource.code.coding[0].display);
					let criticality = tableDataWrapper(allergies[i].resource.criticality);
					let clinicalSts = tableDataWrapper(allergies[i].resource.clinicalStatus);
					let verificationSts = tableDataWrapper(allergies[i].resource.verificationStatus);
					let allergyRow = assertedDate + category + entry + criticality + clinicalSts + verificationSts;					
					allergyRow = tableRowWrapper(allergyRow);
					setDomElement('allergyEntries', allergyRow);
				}
			}	
		}
	}else{
		noDataMessage('allergyTable', 'noAllergyData');
		//hide('allergyTable');
		//setDomElement('noAllergyData', NO_DATA_AVAILABLE);
	}
}

function populateMedicationsTable(medicationStatementBundle){
	if(medicationStatementBundle.total > 0){
		let medications = medicationStatementBundle.entry;
		medications.sort((a, b) => (a.resource.dateAsserted < b.resource.dateAsserted) ? 1 : -1);
		let medRow = null;
		for(let i=0;i<medications.length;i++){
			let status = medications[i].resource.status;
			if(medications[i].status && 'active' === status.toLowerCase()){ 
				let statusElement = tableDataWrapper(status);
				let assertedDate = tableDataWrapper(medications[i].resource.dateAsserted);			
				let medication = tableDataWrapper(medications[i].resource.medicationCodeableConcept.text);
				let taken = tableDataWrapper(medications[i].resource.taken);
				medRow = assertedDate + statusElement + medication + taken;
				medRow = tableRowWrapper(medRow);
				setDomElement('medicationStatmentEntries',medRow);
			}
		}
		//if(medRow == null)hide('medicationSection');
	}else{
		noDataMessage('medsTable', 'noMedData');
		//hide('medsTable');
		//setDomElement('noMedData',NO_DATA_AVAILABLE);		
	}
}

function populateLabsTable(observationBundle){
	if(observationBundle.total > 0){
		let obs = observationBundle.entry;
		obs.sort((a, b) => (a.resource.effectiveDateTime < b.resource.effectiveDateTime) ? 1 : -1);
		let labRow = null;
		for(let i=0;i<obs.length;i++){			
			let categoryVal = "";						
			if(obs[i].resource.category && obs[i].resource.category[0].coding){
				categoryVal = obs[i].resource.category[0].coding[0].code;
				if('laboratory' === categoryVal.toLowerCase()){						
					let effectiveDate = tableDataWrapper(formatDate(obs[i].resource.effectiveDateTime));
					let category = tableDataWrapper(categoryVal);
					let entry = tableDataWrapper(obs[i].resource.code.text);
					let quantityValUnit = "";
			
					if(obs[i].resource.valueQuantity){
						let qtValue = "";
						let qtUnit = "";
						if(obs[i].resource.valueQuantity.value != undefined){
							qtValue = obs[i].resource.valueQuantity.value;
							//Format result to 4 decimal places
							qtValue = qtValue.toFixed(4);
						}
						if(obs[i].resource.valueQuantity.unit != undefined){
							qtUnit = obs[i].resource.valueQuantity.unit;
						}
						quantityValUnit = qtValue + " " + qtUnit;
					}
			
					let value = tableDataWrapper(quantityValUnit);
					labRow = effectiveDate + category + entry + value
					labRow = tableRowWrapper(labRow);
					setDomElement('observationEntries',labRow);
				}
			}
		}
		//if(labRow == null)hide('labSection');
	}else{
		noDataMessage('labsTable', 'noLabData');
		//hide('labsTable');
		//setDomElement('noLabData', NO_DATA_AVAILABLE);
	}
}

function populateCoverageSection(coverageBundle){
	if(coverageBundle.total > 0){
		let type = "";
		if(coverage.type && coverage.type.coding && coverage.type.coding[0].display){
			type = divWrapper(createLabel('Type: ') + coverage.type.coding[0].display);
		}
		
		let relationship = "";
		if(coverage.relationship && coverage.relationship.coding && coverage.relationship.coding[0].code){			
			relationship = divWrapper(createLabel('Relationship: ') + coverage.relationship.coding[0].code);
		}
		
		let period = "";
		if(coverage.period){
			period = divWrapper(createLabel('Span: ') + coverage.period.start + " - " + coverage.period.end);
		}
		
		let detailsLabel = divWrapper(createLabel('Details: '));
		setDomElement('coverageId', type + relationship + period + detailsLabel);
		if(coverage.class){
			for(let i=0;i<coverage.class.length;i++){
				if(coverage.class[i].name){
					let detailName = '<div style="padding-left:30px">' + coverage.class[i].name + '</div>';
					setDomElement('coverageId', detailName);
				}
			}			
		}
	}else{
		setDomElement('coverageId', NO_DATA_AVAILABLE);		
	}
}

function populateAdvancedDirectiveSection(consentBundle){
	if(consentBundle.total > 0){
		let consent = consentBundle.entry;
		let consentDate = "";
		if(consent.dateTime){
			consentDate = divWrapper(createLabel('Consent Date: ') + formatDate(consent.dateTime));
		}
		
		let consentSource = "";
		if(consent.sourceAttachment && consent.sourceAttachment.title){
			consentSource = divWrapper(createLabel('Consent Source: ') + consent.sourceAttachment.title);
		}
		
		let scope = "";
		if(consent.scope && consent.scope.coding && consent.scope.coding[0].display){
			scope = divWrapper(createLabel('Scope: ') + consent.scope.coding[0].display);
		}
		 
		let category = "";
		if(consent.category && consent.category[0] && consent.category[0].coding && consent.category[0].coding[0].display){
			category = divWrapper(createLabel('Category: ') + consent.category[0].coding[0].display);
		}
		
		let provision = "";
		if(consent.provision && consent.provision.type){
			provision = divWrapper(createLabel('Provision: ') + consent.provision.type);
		}
		let dnrLabelsAndValues = consentDate + consentSource + scope + category + provision;
		setDomElement('advDirId', dnrLabelsAndValues);
	}else{
		setDomElement('advDirId', NO_DATA_AVAILABLE);
	}
}

function populateVitalsTable(observationBundle){
	if(observationBundle.total > 0){
		let obs = observationBundle.entry;
		obs.sort((a, b) => (a.resource.issued < b.resource.issued) ? 1 : -1);
		let vitalRow = null;
		for(let i=0;i<obs.length;i++){			
			let categoryVal = "";						
			if(obs[i].resource.category && obs[i].resource.category[0].coding){
				categoryVal = obs[i].resource.category[0].coding[0].code;
				if('vital-signs' === categoryVal.toLowerCase() && obs[i].resource.component){
					let comp = obs[i].resource.component;					
					let issuedDate = tableDataWrapper(formatDate(obs[i].resource.issued));					
					
					for(let x=0;x<comp.length;x++){					
						let name = "";
						if(comp[x].code && comp[x].code.coding && comp[x].code.coding[0].display){
							name = tableDataWrapper(comp[x].code.coding[0].display);
						}
						
						let value = "";
						if(comp[x].valueString){
							value = comp[x].valueString;
						}else if(comp[x].valueQuantity && comp[x].valueQuantity.value){
							let unit = "";
							if(comp[x].valueQuantity.unit)
								unit = " " + comp[x].valueQuantity.unit;
							value = comp[x].valueQuantity.value + unit;							 
						}
						value = tableDataWrapper(value);
						vitalRow = name + value + issuedDate;
						vitalRow = tableRowWrapper(vitalRow);
						setDomElement('vitalEntries',vitalRow);
					}
				}
			}
		}
		//if(vitalRow == null)hide('vitalSection');
	}else{
		noDataMessage('vitalsTable', 'noVitalsData');
		//hide('vitalsTable');
		//setDomElement('noVitalsData', NO_DATA_AVAILABLE);
	}
}

function populatePersonalContactSection(patient){
	if (patient.contact) {
		for(let i=0;i<patient.contact.length;i++){
			let relationship = "";
			if(patient.contact[i].relationship && patient.contact[i].relationship[0].text){
				relationship = divWrapper(createLabel('Relationship: ') + patient.contact[i].relationship[0].text);
			}
			
			let contactTele = "";
			if(patient.contact[i].telecom){
				let system = "";
				let value = "";
				if(patient.contact[i].telecom[0].system){
					system = patient.contact[i].telecom[0].system;
				}
				if(patient.contact[i].telecom[0].value){
					value = patient.contact[i].telecom[0].value;
				}
				contactTele = divWrapper(createLabel('Contact: ') + system + ':' + value);
			}
			
			let contactName = "";
			if(patient.contact[i].name){
				let givenName = "";
				let familyName = "";
				if(patient.contact[i].name.given){
					givenName = patient.contact[i].name.given.join(" ");
				}
				if(patient.contact[i].name.family){
					familyName = patient.contact[i].name.family;
				}
				contactName = divWrapper(createLabel('Name: ') + givenName + ' ' + familyName);
			}
			
			let contactAddress = "";
			if(patient.contact[i].address){
				let line = "";
				let city = "";
				let state = "";
				let postalCode= "";
				
				if(patient.contact[i].address.line){
					line = patient.contact[i].address.line;
				}
				if(patient.contact[i].address.city){
					city = patient.contact[i].address.city;
				}
				if(patient.contact[i].address.state){
					state = patient.contact[i].address.state;
				}
				if(patient.contact[i].address.postalCode){
					postalCode = patient.contact[i].address.postalCode;
				}
				
				contactAddress = divWrapper(createLabel('Address: ') + line + ' ' + city + ', ' + state + ' ' + postalCode);
			}
			let contactLabelsAndValues = contactName + relationship + contactTele + contactAddress;
			setDomElement('contactInfoId', contactLabelsAndValues);
		}
	}else{
		setDomElement('contactInfoId', NO_DATA_AVAILABLE);
	}
}

function populateContactSection(patient){
	if(patient.generalPractitioner || patient.managingOrganization){
		populatePractitionerSection(patient.generalPractitioner);
		populateOrganizationSection(patient.managingOrganization);
	}else{
		hide('organizationHeader');
		noDataMessage('practitionerHeader', 'nursingHomeId');
		//hide('practitionerHeader');
		//setDomElement('nursingHomeId', NO_DATA_AVAILABLE);
	}
}

function populatePractitionerSection(practitioner){
	if(practitioner) {
		let name = "";
		if(practitioner.name){
			let prefix = "";
			let given = "";
			let family = "";
			
			if(practitioner.name[0].prefix){
				prefix = practitioner.name[0].prefix + " ";
			}
			if(practitioner.name[0].given){
				given  = practitioner.name[0].given = " ";
			}
			if(practitioner.name[0].family){
				family = practitioner.name[0].family;
			}
			name = divWrapper(createLabel('Name: ') + prefix + given + family);
		}
		
		let gender = "";
		if(practitioner.gender){
			gender = divWrapper(createLabel('Gender: ') + practitioner.gender);
		}
		
		let phone = "";
		if(practitioner.telecom && practitioner.telecom[0].value){
			phone = divWrapper(createLabel('Phone: ') + practitioner.telecom[0].value);
		}
		
		let practitionerLabelsAndValues = name + gender + phone;
		setDomElement('practionerId', practitionerLabelsAndValues);
	}else{
		setDomElement('practionerId', NO_DATA_AVAILABLE);
	}
}

function populateOrganizationSection(org){
	if(org){
		let name = "";
		if(org.name){
			name = divWrapper(createLabel('Name: ') + org.name);
		}
		
		let type = "";
		if(org.type && org.type[0].coding && org.type[0].coding[0].display){
			type = divWrapper(createLabel('Type: ') + org.type[0].coding[0].display);
		}
		
		let address = "";
		if(org.address){
			let line = "";
			let city = "";
			let state = "";
			let postalCode = "";
			
			if(org.address[0].line){
				line = org.address[0].line[0] + " ";
			}
			if(org.address[0].city){
				city = org.address[0].city;
			}
			if(org.address[0].state){
				let comma = "";
				if(city !== ""){
					comma = ", ";
				}
				state = comma + org.address[0].state + " ";
			}
			if(org.address[0].postalCode){
				postalCode = org.address[0].postalCode;
			}
			
			address = divWrapper(createLabel('Address: ') + line + city + state + postalCode);
		}
		
		let phone = "";
		if(org.telecom && org.telecom[0].value){
			phone = divWrapper(createLabel('Phone: ') + org.telecom[0].value);
		}
		
		let orgLabelsAndValues = name + type + address + phone;
		setDomElement('organizationId', orgLabelsAndValues);
	}else{		
		setDomElement('organizationId', NO_DATA_AVAILABLE);
	}
}

function populatePatientDemographics(patient){
	setPatientName(patient);
	setMrn(patient);
	//setRace(patient);
	setGender(patient);
	setBirthDate(patient);
	//setAddress(patient);
	//setTelecom(patient);
	setMarried(patient);	
}

function setPatientName (pt) {
	if (pt.name) {
		setDomElement('patientName', pt.name[0].given.join(" ") + " " + pt.name[0].family);
	}
}

function setMrn (pt){
	if(pt.identifier){
		if(pt.identifier[0].system){
			if("https://github.com/synthetichealth/synthea" === pt.identifier[0].system){
				setDomElement('mrnId', pt.identifier[0].value);
			}
		}
	}
}

function setRace (pt){
	if(pt.extension){
		if("http://hl7.org/fhir/us/core/StructureDefinition/us-core-race" === pt.extension[0].url){
			if(pt.extension[0].valueCodeableConcept.coding){
				setDomElement('raceId', pt.extension[0].valueCodeableConcept.coding[0].display);
			}
		}	
	}
}

function setGender (pt) {
	if(pt.gender){
		setDomElement('genderId', pt.gender);
	}
}

function setBirthDate (pt){
	if(pt.birthDate){
		setDomElement('dobId', pt.birthDate);
	}
}
	
function setAddress (pt){
	if(pt.address){
		setDomElement('addressId', pt.address[0].line + " " + pt.address[0].city + ", " + pt.address[0].state + " " + pt.address[0].postalCode);
	}
}
		
function setTelecom (pt) {
	if(pt.telecom){
		setDomElement('contactId', pt.telecom[0].use + " " + pt.telecom[0].system + ":" + pt.telecom[0].value);
	}
}

function setMarried(pt){
	if(pt.maritalStatus){
		setDomElement('maritalStatusId', pt.maritalStatus.text);
	}
}

function tableDataWrapper(value){
	if(value == null || value == ''){
		return '<td>' + '' + '</td>';
	}else{
		return '<td>' + value + '</td>';
	}
}

function tableRowWrapper(tableData){
	return '<tr>' + tableData + '</tr>';
}	

function divWrapper(value){
	return '<div>' + value + '</div>';
}

function createLabel(label){
	return '<span class="fieldLabel">' + label + '</span>';
}

function setDomElement(elementId, content){
	document.getElementById(elementId).innerHTML += content;
}	
  
function formatDate(dateToFormat){
	if(dateToFormat === null || dateToFormat === "" || dateToFormat === undefined){
		return "";
	}
	let date = new Date(dateToFormat);
	let dd = date.getDate();
	if(dd < 10){
		dd = '0' + dd;
	}
	let mm = date.getMonth();
	if(mm < 10){
		mm = '0' + mm;
	}
	let yyyy = date.getFullYear();
	return mm + '-' + dd + '-' + yyyy;
}  	
 
function display(data) {
    const output = document.getElementById("display");
    output.innerText = data instanceof Error ?
        String(data) :
        JSON.stringify(data, null, 4);
} 

function hide(elementId){
	document.getElementById(elementId).style.display = "none";
}

function show(elementId){
	document.getElementById(elementId).style.display = "block";
}

function noDataMessage(hideId, showId){
	hide(hideId);
	setDomElement(showId, NO_DATA_AVAILABLE);
}

function initReportDisplay(){
	hide('patientSearch');
	hide('inputError');
	hide('authError');
	let body = document.getElementsByTagName("body")[0];
	body.style.background = 'none';
	body.style.overflow = "auto";	
}