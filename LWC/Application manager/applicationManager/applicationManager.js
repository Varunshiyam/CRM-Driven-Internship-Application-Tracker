import { LightningElement, track, wire } from 'lwc';
import getApplications from '@salesforce/apex/ApplicationController.getApplications';
import createApplication from '@salesforce/apex/ApplicationController.createApplication';
import deleteApplication from '@salesforce/apex/ApplicationController.deleteApplication';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class ApplicationManager extends LightningElement {
    @track applications;
    @track error;

    // Form Model
    name = '';
    studentName = '';
    companyName = '';
    email = '';
    role = '';
    status = 'None'; // default to picklist placeholder
    note = '';
    lastDate = '';
    appliedOn = '';
    applied = false;

    wiredResult;

    statusOptions = [
        { label: 'None', value: 'None' },
        { label: 'Applied', value: 'Applied' },
        { label: 'Shortlisted', value: 'Shortlisted' },
        { label: 'Selected', value: 'Selected' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    columns = [
        { label: 'Application Name', fieldName: 'Name' }, // Text
        { label: 'Student Name', fieldName: 'Student_Name__c' }, // Text
        { label: 'Company Name', fieldName: 'Company_Name__c' }, // Text
        { label: 'Email', fieldName: 'Email__c', type: 'email' }, // Email
        { label: 'Role Applied', fieldName: 'Role_Applied__c' }, // Text
        { label: 'Current Status', fieldName: 'Current_Status__c' }, // Picklist
        { label: 'Note', fieldName: 'Note__c' }, // Text Area
        { label: 'Last Date to Apply', fieldName: 'Last_Date_to_Apply__c', type: 'date' }, // Date
        { label: 'Applied On', fieldName: 'Applied_On__c', type: 'date' }, // Date
        { label: 'Applied', fieldName: 'Applied__c', type: 'boolean' }, // Checkbox
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

    @wire(getApplications)
    wiredApplications(result) {
        this.wiredResult = result;
        if (result.data) {
            this.applications = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body ? result.error.body.message : result.error.statusText;
            this.applications = undefined;
        }
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handlePicklistChange(event) {
        this.status = event.detail.value;
    }

    handleCheckboxChange(event) {
        this.applied = event.target.checked;
    }

    handleSubmit() {
        // Dates: convert empty strings to null
        const lastDateVal = this.lastDate ? this.lastDate : null;
        const appliedOnVal = this.appliedOn ? this.appliedOn : null;

        createApplication({
            name: this.name,
            studentName: this.studentName,
            email: this.email,
            role: this.role,
            status: this.status,
            note: this.note,
            lastDate: lastDateVal,
            appliedOn: appliedOnVal,
            applied: this.applied,
            companyName: this.companyName
        }).then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Application Submitted!',
                variant: 'success'
            }));
            this.resetForm();
            return refreshApex(this.wiredResult);
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error?.body?.message || 'Something went wrong',
                variant: 'error'
            }));
        });
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        if (action.name === 'delete') {
            deleteApplication({ appId: row.Id })
                .then(() => {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Deleted',
                        message: 'Record deleted',
                        variant: 'success'
                    }));
                    return refreshApex(this.wiredResult);
                })
                .catch(error => {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Error',
                        message: error?.body?.message || 'Failed to delete',
                        variant: 'error'
                    }));
                });
        }
    }

    resetForm() {
        this.name = '';
        this.studentName = '';
        this.companyName = '';
        this.email = '';
        this.role = '';
        this.status = 'None';
        this.note = '';
        this.lastDate = '';
        this.appliedOn = '';
        this.applied = false;
    }
}
