// LWC 2
public with sharing class ReminderController {

    @AuraEnabled(cacheable=true)
    public static List<Application__c> getClosingApplications(Integer daysAhead) {
        Date today = Date.today();
        Date thresholdDate = today.addDays(daysAhead != null ? daysAhead : 7);

        return [
            SELECT Id, Company_Name__c, Role_Applied__c, Last_Date_to_Apply__c, Current_Status__c, Applied__c
            FROM Application__c
            WHERE Applied__c = FALSE
            AND Last_Date_to_Apply__c >= :today
            AND Last_Date_to_Apply__c <= :thresholdDate
            ORDER BY Last_Date_to_Apply__c ASC
        ];
    }

    @AuraEnabled
    public static void updateApplicationStatus(Id appId, String newStatus) {
        if (appId == null || String.isBlank(newStatus)) {
            throw new AuraHandledException('Invalid input for update.');
        }
        Application__c app = [SELECT Id, Current_Status__c FROM Application__c WHERE Id = :appId LIMIT 1];
        app.Current_Status__c = newStatus;
        update app;
    }
}