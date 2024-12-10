public class updateContacts2 implements Database.Batchable<sObject> {
    // Query to fetch Contacts with null or placeholder MailingAddress fields
    public Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator([
            SELECT Id, AccountId, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry 
            FROM Contact 
            WHERE (MailingStreet = null OR MailingStreet IN ('X', 'EMPTY', '*')) 
            AND (MailingCity = null OR MailingCity IN ('X', 'EMPTY', '*')) 
            AND (MailingState = null OR MailingState IN ('X', 'EMPTY', '*')) 
            AND (MailingPostalCode = null OR MailingPostalCode IN ('X', 'EMPTY', '*')) 
            AND (MailingCountry = null OR MailingCountry IN ('X', 'EMPTY', '*')) 
            AND Account.ShippingStreet != null 
        ]);
    }
    
    // Execute method to process each batch of Contacts
    public void execute(Database.BatchableContext BC, List<Contact> scope) {
        List<Contact> conlist = new List<Contact>();
        Set<Id> accountIds = new Set<Id>();
        System.debug('Contacts to process: ' + scope);
        
        // Collect AccountIds
        for (Contact con : scope) {
            accountIds.add(con.AccountId);
        }
        System.debug('Account IDs: ' + accountIds);
        
        // Query the related Accounts for their ShippingAddress
        Map<Id, Account> accountMap = new Map<Id, Account>(
            [SELECT Id, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry
             FROM Account
             WHERE Id IN :accountIds]
        );
        
        // Update Contacts with the related Account's ShippingAddress
        for (Contact con : scope) {
            Account relatedAccount = accountMap.get(con.AccountId);
            if (relatedAccount != null) {
                con.MailingStreet = relatedAccount.ShippingStreet;
                con.MailingCity = relatedAccount.ShippingCity;
                con.MailingState = relatedAccount.ShippingState;
                con.MailingPostalCode = relatedAccount.ShippingPostalCode;
                con.MailingCountry = relatedAccount.ShippingCountry;
                conlist.add(con);
            }
        }
        
        System.debug('Contacts to update: ' + conlist);
        
        // Update the Contacts in the database, only if there are contacts to update
        if (!conlist.isEmpty()) {
            try {
                update conlist;
            } catch (DmlException e) {
                System.debug('Error updating contacts: ' + e.getMessage());
                // Handle the exception, e.g., log it or notify admins
            }
        }
    }
    
    // Finish method for any post-processing after the batch completes
    public void finish(Database.BatchableContext BC) {
        // Add post-processing logic here, like sending an email notification
    }
}