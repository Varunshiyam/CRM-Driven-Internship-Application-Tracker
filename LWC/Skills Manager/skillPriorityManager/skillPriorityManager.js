import { LightningElement, track, wire } from 'lwc';
import getToLearnSkills from '@salesforce/apex/SkillPriorityController.getToLearnSkills';
import updateSkillPriorities from '@salesforce/apex/SkillPriorityController.updateSkillPriorities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SkillPriorityManager extends LightningElement {
    @track skills = [];
    @track error;
    @track isLoading = true;

    draggedItemId;

    @wire(getToLearnSkills)
    wiredSkills({ error, data }) {
        this.isLoading = false;
        if (data) {
            // Assign default Priority__c if missing and sort ascending
            let priorityCounter = 1;
            this.skills = data.map(skill => {
                let skillCopy = { ...skill };
                if (skillCopy.Priority__c === null || skillCopy.Priority__c === undefined) {
                    skillCopy.Priority__c = priorityCounter++;
                }
                return skillCopy;
            });

            // Sort locally by Priority__c ascending
            this.skills.sort((a, b) => a.Priority__c - b.Priority__c);

            this.error = undefined;
        } else if (error) {
            this.error = error.body ? error.body.message : error.statusText;
            this.skills = [];
        }
    }

    handleDragStart(event) {
        this.draggedItemId = event.currentTarget.dataset.id;
        event.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd() {
        this.draggedItemId = null;
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    handleDrop(event) {
        event.preventDefault();

        if (!this.draggedItemId) {
            return;
        }

        // Find closest skill-item <li> element under drop target
        let targetElement = event.target;
        while (targetElement && 
               !(targetElement.tagName === 'LI' && targetElement.classList.contains('skill-item'))) {
            targetElement = targetElement.parentElement;
        }

        if (!targetElement) return;

        const targetId = targetElement.dataset.id;
        if (this.draggedItemId === targetId) {
            // Dropped onto same item, no change
            return;
        }

        const draggedIndex = this.skills.findIndex(skill => skill.Id === this.draggedItemId);
        const targetIndex = this.skills.findIndex(skill => skill.Id === targetId);

        if (draggedIndex < 0 || targetIndex < 0) {
            return;
        }

        // Clone array for immutability
        const reorderedSkills = [...this.skills];
        const [draggedSkill] = reorderedSkills.splice(draggedIndex, 1);
        reorderedSkills.splice(targetIndex, 0, draggedSkill);

        // Re-assign Priority__c (1-based index)
        this.skills = reorderedSkills.map((skill, idx) => {
            return {...skill, Priority__c: idx + 1 };
        });

        // Persist new priorities
        this.savePriorities();

        this.draggedItemId = null;
    }

    savePriorities() {
        this.isLoading = true;
        updateSkillPriorities({ skillsToUpdate: this.skills })
            .then(() => {
                this.showToast('Success', 'Priorities saved successfully', 'success');
                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
                this.showToast(
                    'Error saving priorities', 
                    error.body ? error.body.message : error.message, 
                    'error'
                );
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}
