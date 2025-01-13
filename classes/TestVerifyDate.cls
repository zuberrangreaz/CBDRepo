@isTest
public class TestVerifyDate {

    @isTest static void test1(){
        
        Date d = VerifyDate.CheckDates(system.today(), system.today()+1);
         Date d1 = VerifyDate.CheckDates(system.today(), system.today()+60);
        
        
    }
}