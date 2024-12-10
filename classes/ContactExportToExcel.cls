public with sharing class ContactExportToExcel {
     
    Public List<String> selectedFieldsList {get;set;}
    Public List<Contact> conList {get;set;}
     
    public ContactExportToExcel(ApexPages.StandardController stdCtrl) {
        Account acc = (Account)stdCtrl.getRecord();
        conList = New List<Contact>();
        conList = [Select Id, Name, Email, Phone From Contact Where AccountId =: acc.Id];
    }
     
    Public PageReference ExportToExcel(){
        selectedFieldsList = New List<string>();
        selectedFieldsList.add('Name'); 
        selectedFieldsList.add('Email');
        selectedFieldsList.add('Phone');
         
        PageReference pgRef = New Pagereference('/apex'+'/ContactExportToExcel');
        pgRef.setRedirect(false); 
        return pgRef;
    }
     
}