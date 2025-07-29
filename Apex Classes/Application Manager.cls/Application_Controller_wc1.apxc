public with sharing class ApplicationController_WC1 {
    @AuraEnabled(cacheable=true)
    public static List<Application__c> getApplications() {
        return [SELECT Id, Name, Student_Name__c, Email__c, Role_Applied__c, 
                       Current_Status__c, Note__c, Last_Date_to_Apply__c, 
                       Applied__c, Applied_On__c, Company_Name__c 
                  FROM Application__c 
                  ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static Application__c createApplication(ApplicationWrapper app) {
        System.debug('Received app: ' + JSON.serialize(app));
        if (app == null) {
            throw new AuraHandledException('No data received from the client.');
        }

        Application__c newApp = new Application__c(
            Name = app.applicationName,
            Student_Name__c = app.studentName,
            Email__c = app.email,
            Role_Applied__c = app.role,
            Current_Status__c = app.status,
            Note__c = app.note,
            Last_Date_to_Apply__c = app.lastDate,
            Applied__c = app.applied,
            Company_Name__c = app.companyName,
            Applied_On__c = Date.today() // or app.appliedOn if you want to allow user selection
        );
        insert newApp;
        return newApp;
    }

    @AuraEnabled
    public static void deleteApplication(Id appId) {
        delete [SELECT Id FROM Application__c WHERE Id = :appId];
    }
}