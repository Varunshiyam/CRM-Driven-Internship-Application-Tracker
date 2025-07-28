import { LightningElement, track, wire } from 'lwc';
import getUserSkills from '@salesforce/apex/SkillsUpdateController.getUserSkills';
import updateSkills from '@salesforce/apex/SkillsUpdateController.updateSkills';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SkillsUpdate extends LightningElement {
    @track skills = [];
    @track error;

    skillTypeOptions = [
        { label: 'Learned', value: 'Learned' },
        { label: 'To Learn', value: 'To Learn' }
    ];
    completionStatusOptions = [
        { label: 'Not Started', value: 'Not Started' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Achieved', value: 'Achieved' },
        { label: 'Deferred', value: 'Deferred' }
    ];

    @wire(getUserSkills)
    wiredSkills({ error, data }) {
        if (data) {
            this.skills = data.map(skill => {
                const daysRemaining = this.calculateDaysRemaining(skill.End_Date__c);
                return {
                    ...skill,
                    daysRemaining,
                    daysRemainingText: daysRemaining >= 0 ? 
                        `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining` : 'No end date',
                    daysRemainingTooltip: skill.End_Date__c ? `End Date: ${skill.End_Date__c}` : 'No end date',
                    daysRemainingClass: this.getDaysRemainingClass(daysRemaining),
                    isSaving: false
                };
            });
            this.error = undefined;
        } else if (error) {
            this.skills = [];
            this.error = error.body ? error.body.message : error.statusText;
        }
    }

    calculateDaysRemaining(endDate) {
        if (!endDate) return -1;
        const today = new Date();
        const end = new Date(endDate);
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getDaysRemainingClass(days) {
        if (days < 0) return 'gray-days';
        if (days < 5) return 'red-days';
        if (days <= 7) return 'yellow-days';
        return 'green-days';
    }

    handlePicklistChange(event) {
        const skillId = event.target.dataset.id;
        const field = event.target.dataset.field;
        const newValue = event.detail.value;
        const index = this.skills.findIndex(skill => skill.Id === skillId);
        if (index !== -1) {
            this.skills[index][field] = newValue;
        }
    }

    handleSaveRecord(event) {
        const skillId = event.currentTarget.dataset.id;
        const index = this.skills.findIndex(skill => skill.Id === skillId);
        if (index === -1) return;

        this.skills[index].isSaving = true;

        const skillToUpdate = {
            Id: skillId,
            Skill_Type__c: this.skills[index].Skill_Type__c,
            Completion_Status__c: this.skills[index].Completion_Status__c
        };

        updateSkills({ skillsToUpdate: [skillToUpdate] })
            .then(() => {
                this.showToast('Success', 'Skill updated successfully.', 'success');
            })
            .catch(error => {
                this.showToast('Error updating skill', error.body ? error.body.message : error.message, 'error');
            })
            .finally(() => {
                this.skills[index].isSaving = false;
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }));
    }
}
