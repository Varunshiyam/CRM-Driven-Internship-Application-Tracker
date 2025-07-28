//LWC 1

public with sharing class SkillsController {

    @AuraEnabled(cacheable=true)
    public static List<Skills__c> getSkills() {
        return [SELECT Id, Name, Skill_Type__c, Proficiency_Level__c, Completion_Status__c,
                       Reason_To_Learn__c, Start_Date__c, End_Date__c, Reminder_Needed__c,
                       Reminder_Frequency__c, Next_Reminder_Date__c, Reminder_Email__c
                FROM Skills__c
                WHERE User__c = :UserInfo.getUserId()
                ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static Skills__c createSkill(Skills__c skill) {
        skill.User__c = UserInfo.getUserId(); // Assign current user
        insert skill;
        return skill;
    }
}