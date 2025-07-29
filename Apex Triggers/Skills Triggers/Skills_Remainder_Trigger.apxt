trigger SkillsReminderTrigger on Skills__c (after insert, after update) {
    if (Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate)) {
        SkillsReminderHandler.processReminders(Trigger.new);
    }
}