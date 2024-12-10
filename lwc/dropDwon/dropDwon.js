import { LightningElement, track } from 'lwc';

export default class MultiSelectPicklist extends LightningElement {
    @track searchKey = '';
    @track isDropdownOpen = false;
    @track options = [
        { label: 'AIApplication', value: 'AIApplication', selected: false },
        { label: 'ApexClass', value: 'ApexClass', selected: true },
        { label: 'ApexComponent', value: 'ApexComponent', selected: false },
        { label: 'ApexEmailNotifications', value: 'ApexEmailNotifications', selected: false },
        { label: 'ApexPage', value: 'ApexPage', selected: false },
        // Add more options as needed
    ];

    get filteredOptions() {
        return this.options.filter(option =>
            option.label.toLowerCase().includes(this.searchKey.toLowerCase())
        );
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
    }

    handleCheckboxChange(event) {
        console.log('value--->' );
        const value = event.target.dataset.id;
        const selected = event.target.checked;
        this.options = this.options.map(option => {
            if (option.value === value) {
                option.selected = selected;
            }
            return option;
        });
        this.isDropdownOpen = false;
    }

    toggleDropdown(event) {
        event.stopPropagation();
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    connectedCallback() {
        document.addEventListener('click', this.closeDropdown.bind(this));
         console.log('value--->',event.target.dataset.id ); 
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.closeDropdown.bind(this));
    }

    closeDropdown(event) {
        if (!this.template.querySelector('.dropdown-container').contains(event.target)) {
            this.isDropdownOpen = false;
        }
    }
}