import { LightningElement, track, wire } from 'lwc';
import getSkills from '@salesforce/apex/SkillsController.getSkills';
import createSkill from '@salesforce/apex/SkillsController.createSkill';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class SkillManager extends LightningElement {
    @track skills;
    @track error;
    wiredSkillsResult;

    // Form fields
    skillName = '';
    skillType = '';
    proficiencyLevel = '';
    completionStatus = '';
    startDate = '';
    endDate = '';
    reasonToLearn = '';
    reminderNeeded = false;
    reminderFrequency = '';
    nextReminderDate = '';
    reminderEmail = ''; // New field to store email input

    columns = [
        { label: 'Skill Name', fieldName: 'Name' },
        { label: 'Skill Type', fieldName: 'Skill_Type__c' },
        { label: 'Proficiency Level', fieldName: 'Proficiency_Level__c' },
        { label: 'Completion Status', fieldName: 'Completion_Status__c' },
        { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date' },
        { label: 'End Date', fieldName: 'End_Date__c', type: 'date' },
        { label: 'Reason to Learn', fieldName: 'Reason_To_Learn__c' },
        { label: 'Reminder Needed', fieldName: 'Reminder_Needed__c', type: 'boolean' },
        { label: 'Reminder Frequency', fieldName: 'Reminder_Frequency__c' },
        { label: 'Next Reminder Date', fieldName: 'Next_Reminder_Date__c', type: 'date' },
        { label: 'Reminder Email', fieldName: 'Reminder_Email__c' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Delete',
                name: 'delete',
                variant: 'destructive',
                iconName: 'utility:delete'
            }
        }
    ];

    skillTypeOptions = [
        { label: 'Learned', value: 'Learned' },
        { label: 'To Learn', value: 'To Learn' }
    ];

    proficiencyOptions = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
    ];

    completionStatusOptions = [
        { label: 'Not Started', value: 'Not Started' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Achieved', value: 'Achieved' },
        { label: 'Deferred', value: 'Deferred' }
    ];

    reminderFrequencyOptions = [
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Custom', value: 'Custom' }
    ];

    @wire(getSkills)
    wiredSkills(result) {
        this.wiredSkillsResult = result;
        if (result.data) {
            this.skills = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body ? result.error.body.message : result.error.statusText;
            this.skills = undefined;
        }
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handlePicklistChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.detail.value;
    }

    handleCheckboxChange(event) {
        this.reminderNeeded = event.target.checked;
        if (!this.reminderNeeded) {
            this.reminderFrequency = '';
            this.nextReminderDate = '';
            this.reminderEmail = '';
        }
    }

    handleSave() {
        if (
            !this.skillName ||
            !this.skillType ||
            !this.proficiencyLevel ||
            !this.completionStatus ||
            !this.startDate
        ) {
            this.showToast('Error', 'Please fill in all required fields', 'error');
            return;
        }

        if (this.reminderNeeded && !this.reminderEmail) {
            this.showToast('Error', 'Please enter a valid reminder email', 'error');
            return;
        }

        const skillRecord = {
            'sobjectType': 'Skills__c',
            'Name': this.skillName,
            'Skill_Type__c': this.skillType,
            'Proficiency_Level__c': this.proficiencyLevel,
            'Completion_Status__c': this.completionStatus,
            'Start_Date__c': this.startDate,
            'End_Date__c': this.endDate ? this.endDate : null,
            'Reason_To_Learn__c': this.reasonToLearn,
            'Reminder_Needed__c': this.reminderNeeded,
            'Reminder_Frequency__c': this.reminderNeeded ? this.reminderFrequency : null,
            'Next_Reminder_Date__c': this.reminderNeeded ? this.nextReminderDate : null,
            'Reminder_Email__c': this.reminderNeeded ? this.reminderEmail : null
        };

        createSkill({ skill: skillRecord })
            .then(() => {
                this.showToast('Success', 'Skill record created successfully', 'success');
                this.resetForm();
                return refreshApex(this.wiredSkillsResult);
            })
            .catch(error => {
                this.showToast('Error creating skill', error.body ? error.body.message : error.message, 'error');
            });
    }

    handleRowAction(event) {
        if (event.detail.action.name === 'delete') {
            const skillId = event.detail.row.Id;
            // Implement delete logic if desired
            this.showToast('Info', 'Delete functionality not implemented yet', 'info');
        }
    }

    resetForm() {
        this.skillName = '';
        this.skillType = '';
        this.proficiencyLevel = '';
        this.completionStatus = '';
        this.startDate = '';
        this.endDate = '';
        this.reasonToLearn = '';
        this.reminderNeeded = false;
        this.reminderFrequency = '';
        this.nextReminderDate = '';
        this.reminderEmail = '';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}
