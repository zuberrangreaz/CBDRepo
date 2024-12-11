@isTest
public class GreetingControllerTest {
    @isTest
    static void testGetGreeting() {
        // Test case 1: Passing a valid name
        String result = GreetingController.getGreeting('John');
        System.assertEquals('Hello, John!', result, 'Greeting should match the expected value.');

        // Test case 2: Passing a blank name
        result = GreetingController.getGreeting('');
        System.assertEquals('Hello, Guest!', result, 'Greeting for blank name should be Guest.');

        // Test case 3: Passing null
        result = GreetingController.getGreeting(null);
        System.assertEquals('Hello, Guest!', result, 'Greeting for null name should be Guest.');
        //
        //
        //
        //
        //
        //
        //
        //
    }
}