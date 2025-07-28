//LWC 3 

public with sharing class SkillsUpdateController {
    @AuraEnabled(cacheable=true)
    public static List<Skills__c> getUserSkills() {
        Id currentUserId = UserInfo.getUserId();
        return [
            SELECT Id, Name, Skill_Type__c, Completion_Status__c, End_Date__c
            FROM Skills__c
            WHERE User__c = :currentUserId
            ORDER BY Name ASC
        ];
    }

    @AuraEnabled
    public static void updateSkills(List<Skills__c> skillsToUpdate) {
        if (skillsToUpdate == null || skillsToUpdate.isEmpty()) {
            return;
        }
        List<Skills__c> updatableSkills = new List<Skills__c>();
        for (Skills__c skill : skillsToUpdate) {
            Skills__c s = new Skills__c(Id = skill.Id);
            s.Skill_Type__c = skill.Skill_Type__c;
            s.Completion_Status__c = skill.Completion_Status__c;
            updatableSkills.add(s);
        }
        try {
            update updatableSkills;
        } catch (DmlException e) {
            throw new AuraHandledException('Error updating skills: ' + e.getMessage());
        }
    }
}