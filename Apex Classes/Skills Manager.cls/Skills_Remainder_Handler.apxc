//Optional Remainder in SKills Form

public class SkillsReminderHandler {
    public static void processReminders(List<Skills__c> newSkills) {
        Date today = Date.today();
        List<Skills__c> toUpdate = new List<Skills__c>();

        for (Skills__c skill : newSkills) {
            if (skill.Reminder_Needed__c == true
                && skill.Next_Reminder_Date__c != null
                && skill.Next_Reminder_Date__c <= today) {
                
                String recipientEmail;

                if (skill.Reminder_Email__c != null && skill.Reminder_Email__c.trim() != '') {
                    recipientEmail = skill.Reminder_Email__c.trim();
                } else if (skill.User__c != null) {
                    User userRecord = [SELECT Email FROM User WHERE Id = :skill.User__c LIMIT 1];
                    recipientEmail = userRecord.Email;
                }

                if (recipientEmail != null) {
                    String subject = 'Reminder: Skill "' + skill.Name + '" progress update';
                    String body = 'Dear User,' + '\n\n' +
                        'This is a reminder regarding your skill "' + skill.Name + '". ' +
                        'Current completion status is: ' + skill.Completion_Status__c + '.\n' +
                        'Please update your skill progress as needed.' + '\n\n' +
                        'Best regards,\nYour Internship Tracker Team';

                    Application_Mailer.sendMail(recipientEmail, subject, body);

                    Date nextDate = calculateNextReminderDate(skill.Next_Reminder_Date__c, skill.Reminder_Frequency__c);
                    if (nextDate != null) {
                        skill.Next_Reminder_Date__c = nextDate;
                        toUpdate.add(skill);
                    }
                }
            }
        }

        if (!toUpdate.isEmpty()) {
            try {
                update toUpdate;
            } catch (DmlException e) {
                System.debug('Failed to update Skills next reminder dates: ' + e.getMessage());
            }
        }
    }

    private static Date calculateNextReminderDate(Date currentDate, String frequency) {
        if (frequency == null) return null;
        switch on frequency.toLowerCase() {
            when 'weekly' {
                return currentDate.addDays(7);
            }
            when 'monthly' {
                return currentDate.addMonths(1);
            }
            when 'custom' {
                // Add custom logic if needed - here we skip
                return null;
            }
            when else {
                return null;
            }
        }
    }
}