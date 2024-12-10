public class AccountTriggerHelper2 {
    
    public static void processAccounts(List<Account> accounts) {
        // Enqueue the Queueable job
        System.enqueueJob(new AccountTriggerHelper(accounts));
    }
}