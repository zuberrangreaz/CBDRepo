public class DataCotr {
    @AuraEnabled
    public static List<Account> retrieveAccounts(){
        return [SELECT Id, Name, Type, BillingCountry
                FROM Account
                LIMIT 7];
    }
}