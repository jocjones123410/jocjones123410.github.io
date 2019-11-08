	
	function getPatientName (pt) {
		if (pt.name) {
			var names = pt.name.map(function(name) {
				return name.given.join(" ") + " " + name.family;
			});
			return names.join(" / ")
		} else {
			return "anonymous";
		}
	}

	function getGender (pt) {
		if(pt.gender){
			return pt.gender;
		}
	}

	function getBirthDate (pt){
		if(pt.birthDate){
			return pt.birthDate;
		}
	}
	
	function getAddress (pt){
		if(pt.address){
			var addresses = pt.address.map(function(address) {
				return address.line + " " + address.city + ", " + address.state + " " + address.postalCode;
			});
			return addresses.join(" ");
		}
	}
		
	function getTelecom (pt) {
		if(pt.telecom){
			var telecoms = pt.telecom.map(function(telecom){
				return telecom.use + " " + telecom.system + ":" + telecom.value;
			});
			return telecoms.join("<br/>");
		}
	}
	
	function getRace (pt){
		if(pt.extension){
			var race = pt.extension.map(function(extension){
				if("http://hl7.org/fhir/us/core/StructureDefinition/us-core-race" === extension.url){
					//for(var i = 0; i < extension.extension.length; i++){
						//if("text" === extension.extension[i].url){
						if(extension.valueCodeableConcept.coding){
							//return extension.extension[i].valueString;
							return extension.valueCodeableConcept.coding[0].display;
						}
					}
				});		
			return race.join(" ");
		}
	}
	
	function getMrn (pt){
		if(pt.identifier){
			var mrn = pt.identifier.map(function(identifier){
				if(identifier.system){
					if("https://github.com/synthetichealth/synthea" === identifier.system){
						return identifier.value;
					}
				}
			});
			return mrn.join(" ");
		}
	}
	
	function getMeds(meds){
		if(meds.entry){
			var medication = meds.entry.map(function(entry){
				if("active" === entry.resource.status){
					if(entry.resource.medicationReference.code){
						return "<li>" + entry.resource.medicationReference.code.text + "</li>";
					}
				}
			});
			return medication.join(" ");
		}
	}
	
	function getAllergies(allergies){
		if(allergies.entry){
			var allergy = allergies.entry.map(function(entry){
				if("active" === entry.resource.clinicalStatus){
					if(entry.resource.code){						
						return "<li>" + entry.resource.code.coding[0].display + "</li>";
					}
				}	
			});
			return allergy.join(" ");
		}
	}

	function getConditions(conditions){
		if(conditions.entry){
			var condition = conditions.entry.map(function(entry){
				if("active" === entry.resource.clinicalStatus){
					return "<li>" + entry.resource.code.coding[0].display + " - " + entry.resource.onsetDateTime + "</li>";
				}
			});
			return condition.join(" ");
		}
	}
	
	function getContactInfo(pt){
		if (pt.contact) {
			var names = pt.contact.map(function(contact) {
				var contactTele = contact.telecom[0].system + ":" + contact.telecom[0].value + "<br/>";
				var contactName = contact.name.given.join(" ") + " " + contact.name.family + "<br/>";
				var contactAddress = contact.address.line + "<br/>" + contact.address.city + ", " + contact.address.state
									+ " " + contact.address.postalCode;
				return contactTele + contactName + contactAddress;
			});
			return names.join(" / ")
		} else {
			return "anonymous";
		}	
	}
	
	function getMarried(pt){
		if(pt.maritalStatus){
			return pt.maritalStatus.text;
		}
	}
	
	function getPractitioner(practitioner) {
		if(practitioner.name) {
			var name = practitioner.name[0].prefix + " " + practitioner.name[0].given + " " + practitioner.name[0].family;
			return name;
		}		
	}
	
	function getOrg(org){
		if(org.name){
			return org.name + " " + org.type[0].coding[0].display;
		}
	}
	
	function getDirective(directive){
		if(directive.scope){
			var scope = directive.scope.coding[0].display;
			var category = directive.category[0].coding[0].display;
			var provision = directive.provision.type;
			return scope + "<br/>" + category + "<br/>" + provision;
		}
	}
	
	function getCoverage(coverage){
		if(coverage.type){
			var type = coverage.type.coding[0].display;
			var relationship = coverage.relationship.coding[0].code;
			var period = coverage.period.start + " - " + coverage.period.end;
			if(coverage.class){
				var details  = coverage.class.map(function(detail){
					return detail.name 
			});
			details = details.join("<br/>");
			}			
			return type + "<br/>" + relationship + "<br/>" + period + "<br/>" + details;
		}
	}
	
	function getDiagnosticRpt(report){
		if(report.category){
			var category = report.category[0].coding[0].display;
			var effective = report.effectiveDateTime;
			var issued = report.issued;
			if(report.result){
				var results = report.result.map(function(result){					
					return "<li>" + result.display + "</li>";
				});		
			results = results.join(" ");
			}			
			return results;
		}
	}

const client = new FHIR.client("https://r3.smarthealthit.org");
client.request("Patient/6f0dafdc-94c5-4ab2-9208-b2872450737a")
    .then(displayPatient(testPatientResource))
    .catch(display);
client.request("/MedicationRequest?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a", {
    resolveReferences: "medicationReference"
}).then(displayMedication)
	.catch(display);
client.request("/AllergyIntolerance?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a")
	.then(displayAllergies)
	.catch(display);
client.request("/Condition?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a")
	.then(displayConditions)	
	.catch(display);
client.request("/Condition?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a")
	.then(displayPractioner(testPractitioner))
	.catch(display);
client.request("/Condition?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a")
	.then(displayOrganization(testOrganization))
	.catch(display);
client.request("/Condition?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a")
	.then(displayDirective(testConsent))
	.catch(display);
client.request("/Condition?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a")
	.then(displayCoverage(testCoverage))
	.catch(display);
client.request("/Condition?patient=6f0dafdc-94c5-4ab2-9208-b2872450737a")
	.then(displayDiagnosticRpt(testDiagnosticRpt))
	.catch(display);