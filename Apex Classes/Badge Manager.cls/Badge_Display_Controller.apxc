// LWC 1 

public with sharing class BadgeDisplayController {
    
    @AuraEnabled
public static void removeUserBadge(Id userBadgeId) {
    // Optional: Add security to check that this belongs to the running user!
    List<User_Badge__c> ub = [SELECT Id FROM User_Badge__c WHERE Id = :userBadgeId LIMIT 1];
    if (!ub.isEmpty()) {
        delete ub;
    }
}

@AuraEnabled
public static void saveUserBadgeOrder(List<Id> badgeIds) {
    // Optional: Add a "SortOrder__c" number field on User_Badge__c to store custom order.
    if (badgeIds == null) return;
    Integer idx = 0;
    List<User_Badge__c> toUpdate = new List<User_Badge__c>();
    for (Id ubId : badgeIds) {
        toUpdate.add(new User_Badge__c(Id = ubId, SortOrder__c = idx++));
    }
    if (!toUpdate.isEmpty()) update toUpdate;
}

 

    @AuraEnabled(cacheable=true)
    public static List<User_Badge_Wrapper> getUserBadges(Id currentUserId) {
        List<User_Badge_Wrapper> results = new List<User_Badge_Wrapper>();
        List<User_Badge__c> userBadges = [
            SELECT Id, Earned_Date__c, Badge__r.Name, Badge__r.Image_URL__c, Badge__r.Description__c
            FROM User_Badge__c
            WHERE User__c = :currentUserId
            ORDER BY Earned_Date__c DESC
        ];
        for (User_Badge__c ub : userBadges) {
            String badgeName = ub.Badge__r != null ? ub.Badge__r.Name : '';
            String badgeImageURL = ub.Badge__r != null ? ub.Badge__r.Image_URL__c : '';
            String badgeDescription = ub.Badge__r != null ? ub.Badge__r.Description__c : '';
            results.add(new User_Badge_Wrapper(
                ub.Id, badgeName, badgeImageURL, badgeDescription, ub.Earned_Date__c
            ));
        }
        return results;
    }

    public class User_Badge_Wrapper {
        @AuraEnabled public Id userBadgeId;
        @AuraEnabled public String badgeName;
        @AuraEnabled public String badgeImageURL;
        @AuraEnabled public String badgeDescription;
        @AuraEnabled public Date earnedDate;

        public User_Badge_Wrapper(Id id, String name, String imageUrl, String description, Date earnedDate) {
            this.userBadgeId = id;
            this.badgeName = name;
            this.badgeImageURL = imageUrl;
            this.badgeDescription = description;
            this.earnedDate = earnedDate;
        }
    }
}