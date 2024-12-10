trigger AccountTrigger on Account (after update) {
    AccountTriggerHelper2.processAccounts(Trigger.new);
}