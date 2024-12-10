public class FlowController {
    public void callFlow() {
        // Set up Lead record as an example
        Account l = new Account(Name = 'Zuberr Rangreazzasc');
        insert l;
        
        // Prepare the Flow variables
        Map<String, Object> params = new Map<String, Object>();
        params.put('newAccount', l);
        system.debug('newAccount'+ params);
        
        // Instantiate and start the Flow
        Flow.Interview.Call_Flows_From_Apex  yourFlow = new Flow.Interview.Call_Flows_From_Apex(params);
        system.debug('yourFlow' );
        yourFlow.start();
    }
}