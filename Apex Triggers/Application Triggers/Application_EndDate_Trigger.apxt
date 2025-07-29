//Last Date Trigger within Range

trigger Application_EndDate_Trigger on Application__c (after insert, after update) {
    
    Date today = Date.today();
    Date rangeEnd = today.addDays(3); // next 3 days

    for (Application__c app : Trigger.new) {
        
        // Ensure Last_Date__c and Email__c are present

        if (app.Last_Date_to_Apply__c  != null && String.isNotBlank(app.Email__c) && (app.Applied__c == false || app.Applied__c == null)) {
            
            // Check if the Last Date is within the next 3 days (*---Checking---*)
            
            if (app.Last_Date_to_Apply__c  >= today && app.Last_Date_to_Apply__c  <= rangeEnd) {
                String toEmail = app.Email__c;
                String subject = '📅 Internship Deadline Approaching!';
                String body = 'Hi ' + app.Student_Name__c + ',\n\n' +
                              'Just a quick reminder that the last date to respond or act on your internship application at ' +
                              app.Company_Name__c + ' is approaching.\n\n' +
                              '📌 Last Date: ' + String.valueOf(app.Last_Date_to_Apply__c ) + '\n' +
                              'Role: ' + app.Role_Applied__c + '\n\n' +
                              'Make sure you complete any pending steps before the deadline!\n\n' +
                              'Best of luck,\nSalesForce Internship Tracker Team';

                Application_Mailer.sendMail(toEmail, subject, body);
            }
        }
    }
}