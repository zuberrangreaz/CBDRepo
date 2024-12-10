public with sharing class DataController {
    @AuraEnabled 
    public static List<Account> retrieveAccounts(){
        return DataCotr.retrieveAccounts();
    }
}