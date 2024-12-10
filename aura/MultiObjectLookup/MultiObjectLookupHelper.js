({
	searchRecordsHelper : function(component, event, helper) {
		$A.util.removeClass(component.find("Spinner"), "slds-hide");
        component.set('v.message', '');
        component.set('v.recordsList', null);
        var selectedObject = component.get('v.selectedObject');
 
		// Calling Apex Method
    	var action = component.get('c.fetchRecords');
        action.setParams({
            'objectName' : selectedObject.APIName,
            'filterField' : selectedObject.fieldName,
            'searchString' : component.get('v.searchString')
        });
        action.setCallback(this,function(response){    
        	var result = response.getReturnValue();
        	if(response.getState() === 'SUCCESS') {
                // To check if any records are found for searched keyword
    			if(result.length > 0) {
					component.set('v.recordsList', result);        
    			} else {
    				component.set('v.message', 'No Records Found');
    			}
        	} else if(response.getState() === 'INCOMPLETE') {
                component.set('v.message','No Server Response or client is offline');
            } else if(response.getState() === 'ERROR') {
                // If server throws any error
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    component.set('v.message', errors[0].message);
                }
            }
            // To open the drop down list of records
            $A.util.addClass(component.find('resultsDiv'), 'slds-is-open');
        	$A.util.addClass(component.find("Spinner"), "slds-hide");
        });
        $A.enqueueAction(action);
	}
})