import { LightningElement, track, wire } from 'lwc';
import getUserBadges from '@salesforce/apex/BadgeDisplayController.getUserBadges';
import removeUserBadge from '@salesforce/apex/BadgeDisplayController.removeUserBadge';
import saveUserBadgeOrder from '@salesforce/apex/BadgeDisplayController.saveUserBadgeOrder';
import USER_ID from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BadgeDisplay extends LightningElement {
    @track badges;
    @track error;

    // Drag state
    draggedBadgeId;

    @wire(getUserBadges, { currentUserId: USER_ID })
    wiredBadges({ error, data }) {
        if (data) {
            this.badges = data.map((badge, index) => {
                const earnedDateStr = badge.earnedDate ? this.formatDate(badge.earnedDate) : '';
                return { ...badge, earnedDateFormatted: earnedDateStr, gridIndex: index };
            });
            this.error = undefined;
        } else if (error) {
            this.error = error.body ? error.body.message : error.statusText;
            this.badges = undefined;
        }
    }

    formatDate(dateStr) {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch(e) {
            return dateStr;
        }
    }

    badgeClass(name) {
        if (!name) return '';
        const lowerName = name.toLowerCase();
        if (lowerName.includes('beginner')) return 'label-beginner';
        if (lowerName.includes('intermediate')) return 'label-intermediate';
        if (lowerName.includes('advanced')) return 'label-advanced';
        return '';
    }

    /*** GRID Style: Places badges in 2 columns, 3 rows (CSS Grid handles much, but for responsive you can fix position if wanted) ***/
    getGridStyle(i) {
        // Not strictly needed since CSS handles, but you could return a grid-area here if customizing.
        return '';
    }

    // --- Remove badge support ---
    handleRemove(event) {
        const badgeId = event.currentTarget.dataset.id;
        if (!badgeId) return;
        removeUserBadge({ userBadgeId: badgeId })
            .then(() => {
                this.badges = this.badges.filter(b => b.userBadgeId !== badgeId);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Badge removed.',
                    variant: 'success'
                }));
            })
            .catch(e => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Could not remove badge: ' + (e.body && e.body.message ? e.body.message : e),
                    variant: 'error'
                }));
            });
    }

    // --- Drag and Drop ---
    handleDragStart(event) {
        this.draggedBadgeId = event.currentTarget.dataset.id;
        event.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd() {
        this.draggedBadgeId = null;
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    handleDrop(event) {
        event.preventDefault();
        const draggedId = this.draggedBadgeId;
        const targetElem = event.target.closest('.badge-card');
        if (!targetElem || !draggedId) return;
        const targetId = targetElem.dataset.id;
        if (draggedId === targetId) return;

        const draggedIdx = this.badges.findIndex(b => b.userBadgeId === draggedId);
        const targetIdx = this.badges.findIndex(b => b.userBadgeId === targetId);
        if (draggedIdx === -1 || targetIdx === -1) return;

        // Remove and re-insert badge
        const badgesCopy = [...this.badges];
        const [draggedBadge] = badgesCopy.splice(draggedIdx, 1);
        badgesCopy.splice(targetIdx, 0, draggedBadge);

        // Update their internal order (optional)
        badgesCopy.forEach((b, i) => { b.gridIndex = i; });
        this.badges = badgesCopy;

        // Save new order to backend (optional but recommended)
        saveUserBadgeOrder({ badgeIds: this.badges.map(b => b.userBadgeId) })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Order Updated',
                    message: 'Your badges order is saved.',
                    variant: 'success'
                }));
            })
            .catch(e => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Could not save order: ' + (e.body && e.body.message ? e.body.message : e),
                    variant: 'error'
                }));
            });

        this.draggedBadgeId = null;
    }
}
