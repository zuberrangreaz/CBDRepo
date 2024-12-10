public class AccountTriggerHelper {
    // Static variable to control trigger recursion
   
    private static boolean isProcessing = false;
    
    public static void processAccounts(List<Account> accounts) {
        if (!isProcessing) {
            isProcessing = true;
            Set<Id> accIds = new Set<Id>();
            List<Account> accListToUpdate = new List<Account>();
            
            for (Account acc : accounts) {
                accIds.add(acc.Id);
            }
            
            if (!accIds.isEmpty()) {         
                List<Account> accList = [SELECT Id, Name, Phone, (SELECT Id, LastName, Phone FROM Contacts LIMIT 1) FROM Account WHERE Id IN :accIds];
                
                for (Account acc : accList) {
                    if (!acc.Contacts.isEmpty()) {
                        acc.Phone = acc.Contacts[0].Phone;
                        accListToUpdate.add(acc);
                    }
                }
            }
            
            if (!accListToUpdate.isEmpty()) {
                update accListToUpdate;
            }
            
            isProcessing = false;
        }
    }
}