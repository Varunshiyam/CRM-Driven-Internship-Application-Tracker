//LWC 2

public with sharing class SkillPriorityController {

    @AuraEnabled(cacheable=true)
    public static List<Skills__c> getToLearnSkills() {
        return [
            SELECT Id, Name, Priority__c, Proficiency_Level__c, Completion_Status__c,
                   Start_Date__c, End_Date__c, Skill_Type__c
            FROM Skills__c
            WHERE Skill_Type__c = 'To Learn'
            AND User__c = :UserInfo.getUserId()
            ORDER BY Priority__c ASC NULLS LAST
        ];
    }

    @AuraEnabled
    public static void updateSkillPriorities(List<Skills__c> skillsToUpdate) {
        if (skillsToUpdate == null || skillsToUpdate.isEmpty()) {
            return;
        }
        update skillsToUpdate;
    }
}