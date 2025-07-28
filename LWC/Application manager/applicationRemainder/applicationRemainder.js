import { LightningElement, track, wire } from 'lwc';
import getClosingApplications from '@salesforce/apex/ReminderController.getClosingApplications';
import updateApplicationStatus from '@salesforce/apex/ReminderController.updateApplicationStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class ApplicationReminder extends LightningElement {
    daysAhead = 7; // default days to look ahead
    @track applications;
    @track error;
    wiredResults;

    columns = [
        { label: 'Company Name', fieldName: 'Company_Name__c' },
        { label: 'Role Applied', fieldName: 'Role_Applied__c' },
        { label: 'Last Date to Apply', fieldName: 'Last_Date_to_Apply__c', type: 'date' },
        { label: 'Current Status', fieldName: 'Current_Status__c' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Update Status',
                name: 'update_status',
                variant: 'brand',
                iconName: 'utility:edit'
            }
        }
    ];

    @track isModalOpen = false;
    selectedAppId;
    selectedStatus;

    statusOptions = [
        { label: 'None', value: 'None' },
        { label: 'Applied', value: 'Applied' },
        { label: 'Shortlisted', value: 'Shortlisted' },
        { label: 'Interview', value: 'Interview' },
        { label: 'Selected', value: 'Selected' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    @wire(getClosingApplications, { daysAhead: '$daysAhead' })
    wiredApplications(result) {
        this.wiredResults = result;
        if (result.data) {
            this.applications = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body ? result.error.body.message : result.error.statusText;
            this.applications = undefined;
        }
    }

    handleDaysChange(event) {
        const val = parseInt(event.target.value, 10);
        this.daysAhead = isNaN(val) || val <= 0 ? 7 : val; // fallback to 7 if invalid
    }

    refreshData() {
        refreshApex(this.wiredResults);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'update_status') {
            this.selectedAppId = row.Id;
            this.selectedStatus = row.Current_Status__c || 'None';
            this.isModalOpen = true;
        }
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedAppId = null;
        this.selectedStatus = null;
    }

    handleStatusChange(event) {
        this.selectedStatus = event.detail.value;
    }

    submitStatusUpdate() {
        if (!this.selectedAppId || !this.selectedStatus || this.selectedStatus === 'None') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select a valid status before updating.',
                    variant: 'error'
                })
            );
            return;
        }

        updateApplicationStatus({ appId: this.selectedAppId, newStatus: this.selectedStatus })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Status updated successfully.',
                        variant: 'success'
                    })
                );
                this.closeModal();
                return refreshApex(this.wiredResults);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating status',
                        message: error.body ? error.body.message : error.message,
                        variant: 'error'
                    })
                );
            });
    }
}
