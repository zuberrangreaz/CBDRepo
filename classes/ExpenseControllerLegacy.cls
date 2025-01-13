public with sharing class ExpenseControllerLegacy {
    @AuraEnabled
    public static List<Property__c> getExpenses() {
        String [] expenseAccessFields = new String [] {'Id',
                                                       'Name',
                                                       'Address__c',
                                                       'Assessed_Value__c',
                                                       'Baths__c',
                                                       'Beds__c',
                                                       'CreatedDate'
                                                       };


    // Obtain the field name/token map for the Expense object
    Map<String,Schema.SObjectField> m = Schema.SObjectType.Property__c.fields.getMap();

    for (String fieldToCheck : expenseAccessFields) {

        // Call getDescribe to check if the user has access to view field
        if (!m.get(fieldToCheck).getDescribe().isAccessible()) {

            // Pass error to client
            throw new System.NoAccessException();
        }
    }
 
    // Query the object safely
    return [SELECT Id, Name, Address__c, Assessed_Value__c, Baths__c, 
            Beds__c, CreatedDate FROM Property__c];
    } 
}