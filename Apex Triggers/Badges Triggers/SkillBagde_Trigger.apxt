trigger SkillsBadgeTrigger on Skills__c (after update) {
    if (Trigger.isAfter && Trigger.isUpdate) {
        SkillsBadgeHandler.assignBadges(Trigger.oldMap, Trigger.newMap);
    }
}