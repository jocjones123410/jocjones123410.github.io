function displayReport(bundle){
	var patients = getPatients(bundle);
	var conditions = getConditions(bundle);
	var allergies = getAllergies(bundle);
	var medications = getMedications(bundle);
	var labs = getObservations(bundle);
	var coverage = getCoverage(bundle);
	var consent = getConsent(bundle);
	var practioners = getPractitioner(bundle);
	var organizations = getOrganization(bundle);
	
	populatePatientDemographics(patients[0]);
	populateConditionTable(conditions);
	populateAllergyTable(allergies);
	populateMedicationsTable(medications);
	populateLabsTable(labs);
	populateCoverageSection(coverage[0]);
	populateDNRSection(consent[0]);
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
				if(conditions[i].onsetDateTime){						
					onsetDate = tableDataWrapper(formatDate(conditions[i].onsetDateTime));
				}	
				display = tableDataWrapper(conditions[i].code.coding[0].display);
				clinicalStatus = tableDataWrapper(conditions[i].clinicalStatus);
				verificationStatus = tableDataWrapper(conditions[i].verificationStatus);
				var conditionRow = onsetDate + display + clinicalStatus + verificationStatus;
				conditionRow = tableRowWrapper(conditionRow);
				setDomElement('conditionEntries',conditionRow);			
			}
		}
	}
}

function populateAllergyTable(allergies){
	if(allergies.length > 0){
		for(var i=0;i<allergies.length;i++){
			if("active" === allergies[i].clinicalStatus){
				if(allergies[i].code){
					var assertedDate = tableDataWrapper(formatDate(allergies[i].assertedDate));
					var category = tableDataWrapper(allergies[i].category[0]);
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
	}
}

function populateMedicationsTable(medications){
	if(medications.length > 0){
		for(var i=0;i<medications.length;i++){
			var assertedDate = tableDataWrapper(medications[i].dateAsserted);
			var status = tableDataWrapper(medications[i].status);
			var medication = tableDataWrapper(medications[i].medicationCodeableConcept.text);
			var taken = tableDataWrapper(medications[i].taken);
			var medRow = assertedDate + status + medication + taken;
			medRow = tableRowWrapper(medRow);
			setDomElement('medicationStatmentEntries',medRow);
		}
	}
}

function populateLabsTable(obs){
	if(obs.length > 0){
		for(var i=0;i<obs.length;i++){
			var effectiveDate = tableDataWrapper(formatDate(obs[i].effectiveDateTime));
			var category = tableDataWrapper(obs[i].category[0].coding[0].code);
			var entry = tableDataWrapper(obs[i].code.text);
			var value = tableDataWrapper(obs[i].valueQuantity.value + " " + obs[i].valueQuantity.unit);
			var labRow = effectiveDate + category + entry + value
			labRow = tableRowWrapper(labRow);
			setDomElement('observationEntries',labRow);
		}
	}
}

function populateCoverageSection(coverage){
	if(coverage.type){
		var type = divWrapper(createLabel('Type: ') + coverage.type.coding[0].display);
		var relationship = divWrapper(createLabel('Relationship: ') + coverage.relationship.coding[0].code);
		var period = divWrapper(createLabel('Span: ') + coverage.period.start + " - " + coverage.period.end);
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
	}
}

function populateDNRSection(consent){
	if(consent.scope){
		var scope = divWrapper(createLabel('Scope: ') + consent.scope.coding[0].display);
		var category = divWrapper(createLabel('Category: ') + consent.category[0].coding[0].display);
		var provision = divWrapper(createLabel('Provision: ') + consent.provision.type);
		var dnrLabelsAndValues = scope + category + provision;
		setDomElement('dnrId', dnrLabelsAndValues);
	}
}

function populatePersonalContactSection(patient){
	if (patient.contact) {
		for(var i=0;i<patient.contact.length;i++){
			var relationship = divWrapper(createLabel('Relationship: ') + patient.contact[i].relationship[0].text);
			var contactTele = divWrapper(createLabel('Phone: ') + patient.contact[i].telecom[0].system + ':' + patient.contact[i].telecom[0].value);
			var contactName = divWrapper(createLabel('Name: ') + patient.contact[i].name.given.join(" ") + ' ' + patient.contact[i].name.family);
			var contactAddress = divWrapper(createLabel('Address: ') + patient.contact[i].address.line + ' ' + patient.contact[i].address.city + ', ' + patient.contact[i].address.state
								+ ' ' + patient.contact[i].address.postalCode);
			var contactLabelsAndValues = contactName + relationship + contactTele + contactAddress;
			setDomElement('contactInfoId', contactLabelsAndValues);
		}
	}
}

function populateContactSection(practitioner, organization){
	populatePractitionerSection(practitioner);
	populateOrganizationSection(organization);
}

function populatePractitionerSection(practitioner){
	if(practitioner.name) {
		var name = divWrapper(createLabel('Name: ') + practitioner.name[0].prefix + " " + practitioner.name[0].given + " " + practitioner.name[0].family);
		var gender = divWrapper(createLabel('Gender: ') + practitioner.gender);
		var phone = divWrapper(createLabel('Phone: ') + practitioner.telecom[0].value);
		var practitionerLabelsAndValues = name + gender + phone;
		setDomElement('practionerId', practitionerLabelsAndValues);
	}	
}

function populateOrganizationSection(org){
	if(org.name){
		var name = divWrapper(createLabel('Name: ') + org.name);
		var type = divWrapper(createLabel('Type: ') + org.type[0].coding[0].display);
		var address = divWrapper(createLabel('Address: ') + org.address[0].line[0] + " " + org.address[0].city + ", " + org.address[0].state + " " + org.address[0].postalCode);
		var phone = divWrapper(createLabel('Phone: ') + org.telecom[0].value);
		var orgLabelsAndValues = name + type + address + phone;
		setDomElement('organizationId', orgLabelsAndValues);
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