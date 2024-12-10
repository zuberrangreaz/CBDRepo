global class AppendNoEmailToContacts implements Database.Batchable<SObject> {
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        // Query to fetch contacts with non-null email addresses
        String query = 'SELECT Id, Email FROM Contact WHERE Email != null AND Id = \'003J1000001zsZ3IAI\'';
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<Contact> scope) {
        List<Contact> contactsToUpdate = new List<Contact>();
        
        for (Contact con : scope) {
            if (!con.Email.endsWith('.noemail')) {
                con.Email += '.noemail';
                contactsToUpdate.add(con);
            }
        }
        
        if (!contactsToUpdate.isEmpty()) {
            update contactsToUpdate;
        }
    }
    
    global void finish(Database.BatchableContext BC) {
        
    }
}