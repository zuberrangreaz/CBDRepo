@isTest
public class NewcustomerTest {
    
    @isTest static void testcustomer() {
        customer__c cus = new customer__c();
        cus.Name = 'madina';
        insert cus;
        
        Newcustomer cust = new Newcustomer();
        cust.getGender();
        cust.getCountry();
        cust.getcourse();
        cust.getState();
        cust.getcustomerlist();
        cust.editid=cus.Id;
        cust.editfunction();
        cust.Cancel();
        cust.save();
        for(Newcustomer.wrapperClass wr : cust.wrapperlist){
            
            wr.b=true;
        }
        
        cust.DeleteChecked();
        cust.deletefunction();
        
    }
}