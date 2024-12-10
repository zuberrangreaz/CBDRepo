public class CustomLookupCtrl {
@AuraEnabled(cacheable=true)
public static list<sObject> searchLookupData(string searchKey, string sObjectApiName, String contractId) {    
    List<sObject> returnList = new List<sObject>();
    String sWildCardText = '%' + searchKey + '%';
    String sQuery = 'Select Id, Name';

    if (sObjectApiName == 'Project__c') {
        sQuery += ' From Project__c Where Id NOT IN (Select Project__c From Project_pipeline__c) AND Name Like :sWildCardText order by CreatedDate DESC LIMIT 5';
    } else {
        sQuery += ' From ' + sObjectApiName + ' Where Name Like :sWildCardText order by CreatedDate DESC LIMIT 5';
    }

    for (sObject obj: Database.query(sQuery)) {
        returnList.add(obj);
    }

    return returnList;
}
    // Method to fetch lookup default value 
@AuraEnabled
public static sObject searchDefaultRecord(String recordId, String sObjectApiName) {
    String sRecId = recordId;    
    String sQuery = 'Select Id, Name';

    if (sObjectApiName == 'Project__c') {
        sQuery += ' From Project__c Where Id NOT IN (Select Project__c From Project_pipeline__c)';
    } else {
        sQuery+= ' From ' + sObjectApiName + ' Where Id = : sRecId LIMIT 1';
    }

    sQuery += ' Where Id = :sRecId LIMIT 1';

    for (sObject obj: Database.query(sQuery)) {
        return obj;
    }
    return null;
}
}