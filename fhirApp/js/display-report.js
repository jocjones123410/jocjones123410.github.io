function displayReport(bundle){
	hide('authError');
	show('report');
	var patients = getPatients(bundle);
	var conditions = getConditions(bundle);
	var allergies = getAllergies(bundle);
	var medications = getMedications(bundle);
	var observations = getObservations(bundle);
	var coverage = getCoverage(bundle);
	var consent = getConsent(bundle);
	var practioners = getPractitioner(bundle);
	var organizations = getOrganization(bundle);
	
	populatePatientDemographics(patients[0]);
	populateConditionTable(conditions);
	populateAllergyTable(allergies);
	populateMedicationsTable(medications);
	populateLabsTable(observations);
	populateCoverageSection(coverage[0]);
	populateAdvancedDirectiveSection(consent[0]);
	populateVitalsTable(observations);
	populatePersonalContactSection(patients[0]);
	populateContactSection(practioners[0], organizations[0]);
	
}

function populateConditionTable(conditions){
	if(conditions.length > 0){
		for(var i=0;i<conditions.length;i++){ 
			if("active" === conditions[i].clinicalStatus){
				var onsetDate = '';
				var display = '';
				var clinicalStatus = '';
				var verificationStatus = '';
				
				onsetDate = tableDataWrapper(formatDate(conditions[i].onsetDateTime));				
				display = tableDataWrapper(conditions[i].code.coding[0].display);
				clinicalStatus = tableDataWrapper(conditions[i].clinicalStatus);
				verificationStatus = tableDataWrapper(conditions[i].verificationStatus);
				var conditionRow = onsetDate + display + clinicalStatus + verificationStatus;
				conditionRow = tableRowWrapper(conditionRow);
				setDomElement('conditionEntries',conditionRow);			
			}
		}
	}else{
		hide('conditionSection');		
	}
}

function populateAllergyTable(allergies){
	if(allergies.length > 0){
		for(var i=0;i<allergies.length;i++){
			if("active" === allergies[i].clinicalStatus){
				if(allergies[i].code.coding){
					var assertedDate = tableDataWrapper(formatDate(allergies[i].assertedDate));
					var categoryVal = "";
					
					if(allergies[i].category){
						categoryVal = allergies[i].category[0];
					}						
					var category = tableDataWrapper(categoryVal);
					var entry = tableDataWrapper(allergies[i].code.coding[0].display);
					var criticality = tableDataWrapper(allergies[i].criticality);
					var clinicalSts = tableDataWrapper(allergies[i].clinicalStatus);
					var verificationSts = tableDataWrapper(allergies[i].verificationStatus);
					var allergyRow = assertedDate + category + entry + criticality + clinicalSts + verificationSts;					
					allergyRow = tableRowWrapper(allergyRow);
					setDomElement('allergyEntries', allergyRow);
				}
			}	
		}
	}else{
		hide('allergySection');
	}
}

function populateMedicationsTable(medications){
	if(medications.length > 0){
		var medRow = null;
		for(var i=0;i<medications.length;i++){
			var status = medications[i].status;
			if(medications[i].status && 'active' === status.toLowerCase()){ 
				var statusElement = tableDataWrapper(status);
				var assertedDate = tableDataWrapper(medications[i].dateAsserted);			
				var medication = tableDataWrapper(medications[i].medicationCodeableConcept.text);
				var taken = tableDataWrapper(medications[i].taken);
				medRow = assertedDate + statusElement + medication + taken;
				medRow = tableRowWrapper(medRow);
				setDomElement('medicationStatmentEntries',medRow);
			}
		}
		if(medRow == null)hide('medicationSection');
	}else{
		hide('medicationSection');
	}
}

function populateLabsTable(obs){
	if(obs.length > 0){
		var labRow = null;
		for(var i=0;i<obs.length;i++){			
			var categoryVal = "";						
			if(obs[i].category && obs[i].category[0].coding){
				categoryVal = obs[i].category[0].coding[0].code;
				if('laboratory' === categoryVal.toLowerCase()){						
					var effectiveDate = tableDataWrapper(formatDate(obs[i].effectiveDateTime));
					var category = tableDataWrapper(categoryVal);
					var entry = tableDataWrapper(obs[i].code.text);
					var quantityValUnit = "";
			
					if(obs[i].valueQuantity){
						var qtValue = "";
						var qtUnit = "";
						if(obs[i].valueQuantity.value != undefined){
							qtValue = obs[i].valueQuantity.value;
						}
						if(obs[i].valueQuantity.unit != undefined){
							qtUnit = obs[i].valueQuantity.unit;
						}
						quantityValUnit = qtValue + " " + qtUnit;
					}
			
					var value = tableDataWrapper(quantityValUnit);
					labRow = effectiveDate + category + entry + value
					labRow = tableRowWrapper(labRow);
					setDomElement('observationEntries',labRow);
				}
			}
		}
		if(labRow == null)hide('labSection');
	}else{
		hide('labSection');
	}
}

function populateCoverageSection(coverage){
	if(coverage){
		var type = "";
		if(coverage.type && coverage.type.coding && coverage.type.coding[0].display){
			type = divWrapper(createLabel('Type: ') + coverage.type.coding[0].display);
		}
		
		var relationship = "";
		if(coverage.relationship && coverage.relationship.coding && coverage.relationship.coding[0].code){			
			relationship = divWrapper(createLabel('Relationship: ') + coverage.relationship.coding[0].code);
		}
		
		var period = "";
		if(coverage.period){
			period = divWrapper(createLabel('Span: ') + coverage.period.start + " - " + coverage.period.end);
		}
		
		var detailsLabel = divWrapper(createLabel('Details: '));
		setDomElement('coverageId', type + relationship + period + detailsLabel);
		if(coverage.class){
			for(var i=0;i<coverage.class.length;i++){
				if(coverage.class[i].name){
					var detailName = '<div style="padding-left:30px">' + coverage.class[i].name + '</div>';
					setDomElement('coverageId', detailName);
				}
			}			
		}
	}else{
		hide('coverageSection');
	}
}

function populateAdvancedDirectiveSection(consent){
	if(consent){
		var scope = "";
		if(consent.scope && consent.scope.coding && consent.scope.coding[0].display){
			scope = divWrapper(createLabel('Scope: ') + consent.scope.coding[0].display);
		}
		 
		var category = "";
		if(consent.category && consent.category[0] && consent.category[0].coding && consent.category[0].coding[0].display){
			category = divWrapper(createLabel('Category: ') + consent.category[0].coding[0].display);
		}
		
		var provision = "";
		if(consent.provision && consent.provision.type){
			provision = divWrapper(createLabel('Provision: ') + consent.provision.type);
		}
		var dnrLabelsAndValues = scope + category + provision;
		setDomElement('advDirId', dnrLabelsAndValues);
	}else{
		hide('advDirSection');
	}
}

function populateVitalsTable(obs){
	if(obs.length > 0){
		var vitalRow = null;
		for(var i=0;i<obs.length;i++){			
			var categoryVal = "";						
			if(obs[i].category && obs[i].category[0].coding){
				categoryVal = obs[i].category[0].coding[0].code;
				if('vital-signs' === categoryVal.toLowerCase() && obs[i].component){
					var comp = obs[i].component;					
					var issuedDate = tableDataWrapper(formatDate(obs[i].issued));					
					
					for(var x=0;x<comp.length;x++){					
						var name = "";
						if(comp[x].code && comp[x].code.coding && comp[x].code.coding[0].display){
							name = tableDataWrapper(comp[x].code.coding[0].display);
						}
						var value = "";
						if(comp[x].valueString){
							value = tableDataWrapper(comp[x].valueString);
						}						
						vitalRow = name + value + issuedDate;
						vitalRow = tableRowWrapper(vitalRow);
						setDomElement('vitalEntries',vitalRow);
					}
				}
			}
		}
		if(vitalRow == null)hide('vitalSection');
	}else{
		hide('vitalSection');
	}
}

function populatePersonalContactSection(patient){
	if (patient.contact) {
		for(var i=0;i<patient.contact.length;i++){
			var relationship = "";
			if(patient.contact[i].relationship && patient.contact[i].relationship[0].text){
				relationship = divWrapper(createLabel('Relationship: ') + patient.contact[i].relationship[0].text);
			}
			
			var contactTele = "";
			if(patient.contact[i].telecom){
				var system = "";
				var value = "";
				if(patient.contact[i].telecom[0].system){
					system = patient.contact[i].telecom[0].system;
				}
				if(patient.contact[i].telecom[0].value){
					value = patient.contact[i].telecom[0].value;
				}
				contactTele = divWrapper(createLabel('Contact: ') + system + ':' + value);
			}
			
			var contactName = "";
			if(patient.contact[i].name){
				var givenName = "";
				var familyName = "";
				if(patient.contact[i].name.given){
					givenName = patient.contact[i].name.given.join(" ");
				}
				if(patient.contact[i].name.family){
					familyName = patient.contact[i].name.family;
				}
				contactName = divWrapper(createLabel('Name: ') + givenName + ' ' + familyName);
			}
			
			var contactAddress = "";
			if(patient.contact[i].address){
				var line = "";
				var city = "";
				var state = "";
				var postalCode= "";
				
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
			var contactLabelsAndValues = contactName + relationship + contactTele + contactAddress;
			setDomElement('contactInfoId', contactLabelsAndValues);
		}
	}else{
		hide('contactInfoSection');
	}
}

function populateContactSection(practitioner, organization){
	populatePractitionerSection(practitioner);
	populateOrganizationSection(organization);
}

function populatePractitionerSection(practitioner){
	if(practitioner) {
		var name = "";
		if(practitioner.name){
			var prefix = "";
			var given = "";
			var family = "";
			
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
		
		var gender = "";
		if(practitioner.gender){
			gender = divWrapper(createLabel('Gender: ') + practitioner.gender);
		}
		
		var phone = "";
		if(practitioner.telecom && practitioner.telecom[0].value){
			phone = divWrapper(createLabel('Phone: ') + practitioner.telecom[0].value);
		}
		
		var practitionerLabelsAndValues = name + gender + phone;
		setDomElement('practionerId', practitionerLabelsAndValues);
	}else{
		hide('practitionerSubSection');
	}
}

function populateOrganizationSection(org){
	if(org){
		var name = "";
		if(org.name){
			name = divWrapper(createLabel('Name: ') + org.name);
		}
		
		var type = "";
		if(org.type && org.type[0].coding && org.type[0].coding[0].display){
			type = divWrapper(createLabel('Type: ') + org.type[0].coding[0].display);
		}
		
		var address = "";
		if(org.address){
			var line = "";
			var city = "";
			var state = "";
			var postalCode = "";
			
			if(org.address[0].line){
				line = org.address[0].line[0] + " ";
			}
			if(org.address[0].city){
				city = org.address[0].city;
			}
			if(org.address[0].state){
				var comma = "";
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
		
		var phone = "";
		if(org.telecom && org.telecom[0].value){
			phone = divWrapper(createLabel('Phone: ') + org.telecom[0].value);
		}
		
		var orgLabelsAndValues = name + type + address + phone;
		setDomElement('organizationId', orgLabelsAndValues);
	}else{
		hide('orgSubSection');
	}
}

function populatePatientDemographics(patient){
	setPatientName(patient);
	setMrn(patient);
	setRace(patient);
	setGender(patient);
	setBirthDate(patient);
	setAddress(patient);
	setTelecom(patient);
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
	var date = new Date(dateToFormat);
	var dd = date.getDate();
	if(dd < 10){
		dd = '0' + dd;
	}
	var mm = date.getMonth();
	if(mm < 10){
		mm = '0' + mm;
	}
	var yyyy = date.getFullYear();
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