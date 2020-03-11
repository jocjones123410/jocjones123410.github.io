const NO_DATA_AVAILABLE = 'No data available';

async function renderReport(client, patientId){	
	initReportDisplay();
		
	renderPatientDemoAndContacts(client, patientId);
	renderConditions(client, patientId);
	renderAllergies(client, patientId);
	renderMedications(client, patientId);
	renderObservations(client, patientId);
	renderCoverage(client, patientId);
	//renderAdvancedDirective(client, patientId);
	
	show('report');
}

function renderPatientDemoAndContacts(client, patientId){
	getPatient(client, patientId).then(function(data){
		populatePatientDemographics(data);
		populatePractitionerSection(data);
		populatePersonalContactSection(data.contact);	
		populateOrganizationSection(data.managingOrganization);		
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

/*function renderAdvancedDirective(client, patientId){
	getConsent(client, patientId).then(function(data){
		populateAdvancedDirectiveSection(data);
	});
}*/
		
	
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

function populateVitalsTable(observationBundle){
	if(observationBundle.total > 0){
		let obs = observationBundle.entry;
		obs.sort((a, b) => (a.resource.issued < b.resource.issued) ? 1 : -1);
		let vitalRow = '';
		for(let i=0;i<obs.length;i++){			
			if(obs[i].resource.category && obs[i].resource.category[0].coding[0]){
				let categoryVal = obs[i].resource.category[0].coding[0].code;				
				if('vital-signs' === categoryVal.toLowerCase() && obs[i].resource.component){
					let comp = obs[i].resource.component;					
					let issuedDate = formatDate(obs[i].resource.issued);					
					
					for(let x=0;x<comp.length;x++){					
						let name = "";
						if(comp[x].code && comp[x].code.coding && comp[x].code.coding[0].display){
							name = comp[x].code.coding[0].display;
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
												
						vitalRow = tableRowWrapper(name, value, issuedDate);
						setDomElement('vitalEntries',vitalRow);
					}
				}				
			}
		}
		if(vitalRow === '')
			toggleNoDataDisplay('vitalsTable', 'noVitalsData');						
	}else{
		toggleNoDataDisplay('vitalsTable', 'noVitalsData');		
	}
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
				
				if(conditions[i].resource){
					onsetDate = formatDate(conditions[i].resource.onsetDateTime);								
					clinicalStatus = conditions[i].resource.clinicalStatus;
					verificationStatus = conditions[i].resource.verificationStatus;
				
					if(conditions[i].resource.code.coding[0]){
						display = conditions[i].resource.code.coding[0].display;
					}
				}

				let conditionRow = tableRowWrapper(onsetDate, display, clinicalStatus, verificationStatus);
				setDomElement('conditionEntries',conditionRow);			
			}
		}
	}else{
		toggleNoDataDisplay('conditionTable', 'noCondData');
	}
}

function populateAllergyTable(allergyBundle){
	if(allergyBundle.total > 0){
		let allergies = allergyBundle.entry;
		allergies.sort((a, b) => (a.resource.assertedDate < b.resource.assertedDate) ? 1 : -1);
		for(let i=0;i<allergies.length;i++){
			if("active" === allergies[i].resource.clinicalStatus){
				let assertedDate = '';
				let category = '';
				let entry = '';
				let criticality = '';
				let clinicalSts = '';
				let verificationSts	= '';
				
				if(allergies[i].resource){
					assertedDate = formatDate(allergies[i].resource.assertedDate);					
					
					if(allergies[i].resource.category){
						category = allergies[i].resource.category[0];
					}						
				
					if(allergies[i].resource.code.coding){
						entry = allergies[i].resource.code.coding[0].display;
					}
				
					criticality = allergies[i].resource.criticality;
					clinicalSts = allergies[i].resource.clinicalStatus;
					verificationSts = allergies[i].resource.verificationStatus;
				}
				
				let allergyRow = tableRowWrapper(assertedDate, category, entry, criticality, clinicalSts, verificationSts);
				setDomElement('allergyEntries', allergyRow);
				}
			}	
		}else{
		toggleNoDataDisplay('allergyTable', 'noAllergyData');
	}
}

function populateLabsTable(observationBundle){
	if(observationBundle.total > 0){
		let obs = observationBundle.entry;
		obs.sort((a, b) => (a.resource.effectiveDateTime < b.resource.effectiveDateTime) ? 1 : -1);
		for(let i=0;i<obs.length;i++){			
			let categoryVal = "";						
			if(obs[i].resource.category && obs[i].resource.category[0].coding[0]){
				categoryVal = obs[i].resource.category[0].coding[0].code;
				if('laboratory' === categoryVal.toLowerCase()){						
					let effectiveDate = formatDate(obs[i].resource.effectiveDateTime);
					let category = categoryVal;
					let entry = obs[i].resource.code.text;
					let quantityValUnit = "";
			
					if(obs[i].resource.valueQuantity){
						let qtValue = "";
						let qtUnit = "";
						if(obs[i].resource.valueQuantity.value != undefined){
							qtValue = obs[i].resource.valueQuantity.value;
							//Format result to 4 decimal places
							qtValue = roundToX(qtValue,4);
						}
						if(obs[i].resource.valueQuantity.unit != undefined){
							qtUnit = obs[i].resource.valueQuantity.unit;
						}
						quantityValUnit = qtValue + " " + qtUnit;
					}
			
					let value = quantityValUnit;
					
					let labRow = tableRowWrapper(effectiveDate, category, entry, value);
					setDomElement('observationEntries',labRow);
				}
			}
		}
	}else{
		toggleNoDataDisplay('labsTable', 'noLabData');		
	}
}

function populateMedicationsTable(medicationStatementBundle){
	if(medicationStatementBundle.total > 0){
		let medications = medicationStatementBundle.entry;
		medications.sort((a, b) => (a.resource.dateAsserted < b.resource.dateAsserted) ? 1 : -1);
		for(let i=0;i<medications.length;i++){
			if(medications[i].resource){
				let status = medications[i].resource.status;
				if(status != undefined && 'active' === status.toLowerCase()){ 
					let statusElement = status;
					let assertedDate = medications[i].resource.dateAsserted;			
					let medication = '';
					
					if(medications[i].resource.medicationCodeableConcept){
						medication = medications[i].resource.medicationCodeableConcept.text;
					}
					
					let taken = tableDataWrapper(medications[i].resource.taken);					
					
					let medRow = tableRowWrapper(assertedDate, statusElement, medication, taken);
					setDomElement('medicationStatmentEntries',medRow);
				}
			}
		}
	}else{
		toggleNoDataDisplay('medsTable', 'noMedData');	
	}
}

function populateCoverageSection(coverageBundle){
	let type = '';
	let relationship = '';
	let period = '';
	let detailName = '';
	
	if(coverageBundle.entry){
		let coverage = coverageBundle.entry;
		if(coverage.type && coverage.type.coding && coverage.type.coding[0].display){
			type = coverage.type.coding[0].display;
		}			
	
		if(coverage.relationship && coverage.relationship.coding && coverage.relationship.coding[0].code){			
			relationship = divWrapper(createLabel('Relationship: ') + coverage.relationship.coding[0].code);
		}			
	
		if(coverage.period){
			period = coverage.period.start + " - " + coverage.period.end;
		}	
	
		if(coverage.class){
			for(let i=0;i<coverage.class.length;i++){
				if(coverage.class[i].name){
					detailName = '<div style="padding-left:30px">' + coverage.class[i].name + '</div>';
				}
			}			
		}
	}	
	populateDataItem('coverageType',type);
	populateDataItem('coverageRelationship',relationship);
	populateDataItem('coverageSpan', period);
	populateDataItem('coverageDetails',detailName);
	
}

function populatePersonalContactSection(contact){
	let name = '';
	let relationship = '';
	let phone = '';
	
	if (contact) {					
		if(contact[0].relationship && contact[0].relationship[0]){
			relationship = contact[0].relationship[0].text;
		}
			
		if(contact[0].telecom){
			let system = '';
			let value = '';
			if(contact[0].telecom[0].system){
				system = contact[0].telecom[0].system;
			}
			if(contact[0].telecom[0].value){
				value = contact[0].telecom[0].value;
			}
			if(system != undefined && system != null && system != '')
				phone = system + ':' + value;
			else
				phone = value;
		}
			
		if(contact[0].name){
			name = getName(contact);
			let givenName = "";
			let familyName = "";
			if(contact[0].name.given){
				givenName = contact[0].name.given.join(" ");
			}
			if(contact[0].name.family){
				familyName = contact[0].name.family;
			}
			name = givenName + ' ' + familyName;
		}	
	}
	populateDataItem('alternateContactName', name);
	populateDataItem('alternateContactRelationship', relationship);
	populateDataItem('alternateContactPhone', phone);
}

function populatePractitionerSection(bundle){
	let practitioner = getResourceFromBundle(bundle, PRACTITIONER_TYPE);
	let name = '';
	let phone = '';
	let practice = '';
	let address = '';
	
	if(practitioner != null && practitioner != undefined) {		
		if(practitioner.name){						
			name = getName(practitioner);
		}
				
		if(practitioner.telecom && practitioner.telecom[0]){
			phone = practitioner.telecom[0].value;
		}
		
		if(practitioner.address){
			address = getAddress(practitioner);
		}	
		//TODO:
		//add practice
	}
	populateDataItem('pcpName', name);
	populateDataItem('pcpPhone', phone);
	populateDataItem('pcpPractice', practice);
	populateDataItem('pcpAddress', address);
}

function populateOrganizationSection(org){
	let name = '';
	let role = '';
	let phone = '';
	
	if(org){
		if(org.contact){
			name = getName(org.contact);		
			role = org.contact.purpose;
						
			if(org.contact.telecom){
				phone = org.contact.telecom[0].value;
			}
		}			
	}
	populateDataItem('nursingHomeContactName', name);
	populateDataItem('nursingHomeContactRole', role);
	populateDataItem('nursingHomeContactPhone', phone);
}

function populatePatientDemographics(bundle){
	let patient = getResourceFromBundle(bundle, PATIENT_TYPE);	
	populateDataItem('patientName', getName(patient));
	setMrn(patient);	
	setGender(patient);
	setBirthDate(patient);
	setMarried(patient);	
}

function getName(resource){
	if(resource){
		if(resource.name[0].text){
			return resource.name[0].text;
		}else if(resource.name){
			let prefix = '';
			let given = '';
			let family = '';
		
			if(resource.name[0].prefix)
				prefix = resource.name[0].prefix + ' ';
			if(resource.name[0].given)
				given = resource.name[0].given[0] + ' ';
			if(resource.name[0].family)
				family = resource.name[0].family;
			return prefix + given + family;
		}
	}
	return '';
}

function getAddress(resource){
	let address = "";
		if(resource.address){
			let line = '';
			let city = '';
			let state = '';
			let postalCode = '';
			
			if(resource.address[0].line){
				line = resource.address[0].line[0] + " ";
			}
			if(resource.address[0].city){
				city = resource.address[0].city;
			}
			if(resource.address[0].state){
				let comma = "";
				if(city !== ""){
					comma = ", ";
				}
				state = comma + resource.address[0].state + " ";
			}
			if(resource.address[0].postalCode){
				postalCode = resource.address[0].postalCode;
			}
			
			address = line + city + state + postalCode;
		}
	return address;
}

function getResourceFromBundle(bundle, resource){
	if(bundle && bundle.entry){
		for(i = 0; i < bundle.entry.length; i++){
			if(bundle.entry[i].resource && resource === bundle.entry[i].resource.resourceType)				
				return bundle.entry[i].resource;
		}
	}
}

function setMrn (pt){
	if(pt.identifier){
		if(pt.identifier[0].system){
			if(properties.mrnSystem === pt.identifier[0].system){
				populateDataItem('mrnId', pt.identifier[0].value);
			}
		}
	}
}

function setRace (pt){
	if(pt.extension){
		if(properties.patientRaceUrl === pt.extension[0].url){
			if(pt.extension[0].valueCodeableConcept.coding){
				populateDataItem('raceId', pt.extension[0].valueCodeableConcept.coding[0].display);
			}
		}	
	}
}

function setGender (pt) {
	if(pt.gender){
		populateDataItem('genderId', pt.gender);
	}
}

function setBirthDate (pt){
	if(pt.birthDate){
		populateDataItem('dobId', pt.birthDate);
	}
}
	
function setAddress (pt){
	if(pt.address){
		populateDataItem('addressId', pt.address[0].line + " " + pt.address[0].city + ", " + pt.address[0].state + " " + pt.address[0].postalCode);
	}
}
		
function setTelecom (pt) {
	if(pt.telecom){
		populateDataItem('contactId', pt.telecom[0].use + " " + pt.telecom[0].system + ":" + pt.telecom[0].value);
	}
}

function setMarried(pt){
	if(pt.maritalStatus){
		populateDataItem('maritalStatusId', pt.maritalStatus.text);
	}
}

function populateDataItem(elementId, dataItem){
	let displayItem = 'No data available';
	
	if(dataItem == null || dataItem == '' || dataItem === undefined){
		setDomElement(elementId, displayItem);
	}else{
		setDomElement(elementId, dataItem);
	}
}

function tableDataWrapper(value){
	if(value == null || value == '' || value === undefined){
		return '<td>' + '' + '</td>';
	}else{
		return '<td>' + value + '</td>';
	}
}


function tableRowWrapper(){
	if(arguments.length == 0){
		return '<tr>' + tableData + '</tr>';
	}else{
		let row = '<tr>';
		for(i = 0; i < arguments.length; i++) {
			row += tableDataWrapper(arguments[i]);
		}
		row += '</tr>'
		return row;
	}
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

function roundToX(num, X) {    
    return +(Math.round(num + "e+"+X)  + "e-"+X);
} 

function hide(elementId){
	document.getElementById(elementId).style.display = "none";
}

function show(elementId){
	document.getElementById(elementId).style.display = "block";
}

function toggleNoDataDisplay(hideId, showId){
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