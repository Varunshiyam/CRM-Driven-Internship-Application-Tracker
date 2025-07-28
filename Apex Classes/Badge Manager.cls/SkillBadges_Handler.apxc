// Handler for checking From To learn - Learned

public class SkillsBadgeHandler {

    public static void assignBadges(Map<Id, Skills__c> oldMap, Map<Id, Skills__c> newMap) {
        List<Skills__c> completedSkills = new List<Skills__c>();

        // Detect Skills where Skill_Type__c changed from 'To Learn' to 'Learned'
        for (Id skillId : newMap.keySet()) {
            Skills__c oldSkill = oldMap.get(skillId);
            Skills__c newSkill = newMap.get(skillId);

            if (
                oldSkill != null &&
                newSkill != null &&
                oldSkill.Skill_Type__c == 'To Learn' &&
                newSkill.Skill_Type__c == 'Learned'
            ) {
                completedSkills.add(newSkill);
            }
        }

        if (completedSkills.isEmpty()) return;

        // Collect all user IDs and proficiency levels from completed skills
        Set<Id> userIds = new Set<Id>();
        Set<String> proficiencyLevels = new Set<String>();

        for (Skills__c skill : completedSkills) {
            if (skill.User__c != null && String.isNotBlank(skill.Proficiency_Level__c)) {
                userIds.add(skill.User__c);
                proficiencyLevels.add(skill.Proficiency_Level__c);
            }
        }

        if (userIds.isEmpty() || proficiencyLevels.isEmpty()) return;

        // Query Badge__c records by proficiency level (assumes 3 badges pre-created)
        Map<String, Badge__c> proficiencyToBadge = new Map<String, Badge__c>();
        for (Badge__c badge : [
            SELECT Id, Name, Proficiency_Level_Required__c, Image_URL__c
            FROM Badge__c
            WHERE Proficiency_Level_Required__c IN :proficiencyLevels
        ]) {
            if (!String.isBlank(badge.Proficiency_Level_Required__c)) {
                proficiencyToBadge.put(badge.Proficiency_Level_Required__c, badge);
            }
        }

        // Query existing User_Badge__c to avoid duplicate assignments
        Map<Id, Set<Id>> userToAssignedBadgeIds = new Map<Id, Set<Id>>();
        for (User_Badge__c ub : [
            SELECT User__c, Badge__c
            FROM User_Badge__c
            WHERE User__c IN :userIds
        ]) {
            if (!userToAssignedBadgeIds.containsKey(ub.User__c)) {
                userToAssignedBadgeIds.put(ub.User__c, new Set<Id>());
            }
            userToAssignedBadgeIds.get(ub.User__c).add(ub.Badge__c);
        }

        List<User_Badge__c> toInsertUserBadges = new List<User_Badge__c>();

        // Assign badges not already assigned -- one badge per unique user/proficiency combo.
        for (Skills__c skill : completedSkills) {
            Id userId = skill.User__c;
            String proficiency = skill.Proficiency_Level__c;
            Badge__c badge = proficiencyToBadge.get(proficiency);

            if (userId == null || badge == null) continue;

            Set<Id> badgesThisUser = userToAssignedBadgeIds.get(userId);
            if (badgesThisUser != null && badgesThisUser.contains(badge.Id)) {
                continue; // Skip already assigned
            }

            toInsertUserBadges.add(new User_Badge__c(
                User__c = userId,
                Badge__c = badge.Id,
                Earned_Date__c = Date.today()
            ));

            if (badgesThisUser == null) {
                badgesThisUser = new Set<Id>();
                userToAssignedBadgeIds.put(userId, badgesThisUser);
            }
            badgesThisUser.add(badge.Id);
        }

        if (!toInsertUserBadges.isEmpty()) {
            insert toInsertUserBadges;
        }
    }
}