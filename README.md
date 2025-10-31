<div align="center">
<img  src="https://readme-typing-svg.herokuapp.com?color=00A1E0&center=true&vCenter=true&size=40&width=900&height=80&lines=Welcome+to+Internship+Tracker!"/>
</div>

![product-portfolio-salesai-background-2](https://github.com/user-attachments/assets/87a558bd-c9e7-43e3-b82f-b38f9f3145cc)


#  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="40" height="40" />Internship Tracker & Skills Badge Manager APP

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Varunshiyam/CRM-Driven-Internship-Application-Tracker/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/Varunshiyam/internship-tracker)](https://github.com/Varunshiyam/CRM-Driven-Internship-Application-Tracker/graphs/contributors)
[![License: GPL v2](https://img.shields.io/badge/License-GPLv2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![GitHub issues](https://img.shields.io/github/issues/Varunshiyam/internship-tracker)](https://github.com/Varunshiyam/CRM-Driven-Internship-Application-Tracker/issues)
[![Discussions](https://img.shields.io/badge/Discussions-open-blue)](https://github.com/Varunshiyam/CRM-Driven-Internship-Application-Tracker/discussions)

---



## 📌 Project Overview

**Internship Tracker & Skills Badge Manager** is a Salesforce-powered application designed to streamline the entire internship lifecycle — from application tracking, monitoring skill acquisition, to automating reminders and awarding achievement badges.

Built with **Lightning Web Components (LWC)** for a modern UI and comprehensive **Apex automation**, this system enables users to:

- Efficiently track internship applications, statuses, and company details.
- Receive automated reminders for application deadlines and skill milestones.
- Manage and prioritize skills development with interactive trackers.
- Earn badges recognizing skill achievements.
- Automate important email notifications triggered by system events.

This repository contains well-structured folders housing Apex classes, triggers, LWCs, object metadata, static resources, and essential docs.

---

## Application Filter:



https://github.com/user-attachments/assets/8c0468c0-8257-4881-8ffa-9c3a2279ec35


---

## Drag & Drop Skills:




https://github.com/user-attachments/assets/d205771d-585b-4cd5-bd48-8362add3f666


---

## Achievements And Awards:



https://github.com/user-attachments/assets/9428af47-f068-49fe-bd49-97d9f2d05425




---

## <img src="https://github.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/blob/master/Emojis/Hand%20gestures/Flexed%20Biceps.png?raw=true" width="35" height="35" > Table of Contents

- [Features](#-features)
- [Data Models](#-data-models)
- [Automation & Logic](#-automation--logic)
- [Lightning Web Components (LWC)](#-lightning-web-components-lwc)
- [📂 Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🚀 Features

- **Comprehensive Internship Application Tracking** with key details and statuses.
- **Automated Email Notifications** on status changes and upcoming deadlines.
- **Skill Progress Monitoring** with priority and proficiency levels.
- **Dynamic Achievement Badges** awarded on skill completion.
- **User-Friendly Interactive UI** powered by LWC components.
- **Drag-and-Drop Skill Prioritizer** for personal learning path customization.

---

## Application Form:



https://github.com/user-attachments/assets/772c1498-1106-4eaf-9e84-5c8a1299c3fe     



https://github.com/user-attachments/assets/3ec68168-6526-4fd6-8e1e-d80bc5ba3234




---


## 🗂️ Data Models

| Object            | Purpose                         | Key Fields & Notes                                    |
|-------------------|---------------------------------|------------------------------------------------------|
| **Application__c**| Internship application records  | Role Applied, Student Name, Status (Picklist), Last Date to Apply, Applied On, Company Name, Applied (Checkbox) |
| **Skills__c**     | Skill tracking & reminders      | Completion Status, Proficiency Level, Reminder Frequency, Start/End Dates, Priority                |
| **User_Badge__c** | User-earned badges              | Badge Lookup, Earned Date, Associated User           |
| **Badge__c**      | Badge definitions & metadata    | Name, Description, Image URL                          |

---

## ⚙️ Automation & Logic (Apex Triggers & Classes)

### Application Triggers:
- Send notification email when status transitions to **Selected**.
- Reminder emails 3 days before **Last Date to Apply**.
- Automatically set **Applied_On__c** when **Applied** checkbox is checked.
- Send skill reminder emails based on application details.

### Skills Triggers:
- Trigger reminders when **Reminder_Needed__c** is checked for skills.

### Apex Classes:
| Class Name           | Responsibility                                |
|---------------------|----------------------------------------------|
| `ApplicationWrapper` & `ApplicationController` | Backend logic for Application LWC UI   |
| `ReminderController` | Handles reminder scheduling/email notifications|
| `ApplicationMailer`  | Centralized email dispatch for triggers     |
| `SkillsBadgeHandler` | Validates skill completion & awards badges  |
| `BadgeDisplayController` | Provides badge data to UI components     |
| `SkillsController`   | Core skill tracking logic for LWC            |
| `SkillPriorityController`  | Drag-and-drop skill prioritizer logic  |
| `SkillsUpdateController`    | Skill updates & interaction management|

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" alt="High Voltage" width="40" height="40" /> Lightning Web Components (LWC)

### Application Components:
- Internship Application Form
- Application Filter by Date

### Skills Components:
- Skill Tracker & Entry Form
- Drag-and-Drop Skill Prioritizer
- Skill Update Interface

### Badge Components:
- My Achievements & Badge Display

These LWCs deliver a seamless, responsive user experience fully integrated with Apex backend logic.

## 📂 Project Structure

```
.
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── classes/
    │   ├── ApplicationManager.cls
    │   └── EmailService.cls
├── lwc/
    │   ├── applicationForm/
    │   │   ├── applicationForm.html
    │   │   ├── applicationForm.js
    │   │   └── applicationForm.js-meta.xml
    │   │── skillForm/
    │   │   ├── skillSelector.html
    │   │   └── skillSelector.js
    │   ├── applicationForm/
    │   │   ├── applicationForm.html
    │   │   ├── applicationForm.js
    │   │   └── applicationForm.js-meta.xml
├── objects/
    │   ├── Application__c/
    │   │   └── Application__c.object-meta.xml
    │   │── Skill__c/
    │   │   └── Skill__c.object-meta.xml
    │   │── User_Badge__c/
    │   │   └── User_Badge__c.object-meta.xml
    │   └── Badge__c/
    │       └── Badge__c.object-meta.xml
├── staticresources/
    │   ├── project_logo.png
    │   └── Badges.png
└── triggers/
        ├── ApplicationTrigger.trigger
        └── SkillTrigger.trigger
```

---

### Key Directories

* `triggers/`: Contains all the Apex triggers.
* `classes/`: Houses the Apex classes that handle the business logic.
* `objects/`: Defines the custom Salesforce objects for this application.
* `lwc/`: Source code for the Lightning Web Components that make up the user interface.
* `staticresources/`: Holds static assets like images, icons, and stylesheets.



---


  ### Don't forget to leave a star<img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31f/512.webp" width="35" height="30"> for this project!


---

## 🏁 Getting Started

1. **Clone the repository:**  
2. **Deploy Salesforce Metadata:** Use Salesforce CLI or your preferred deployment tool to push metadata from folders (`/Triggers`, `/Classes`, `/LWC`, `/ObjectManager`).
3. **Assign Permissions:** Configure Salesforce profiles/permission sets to grant access to necessary components.
4. **Configure Email Templates:** Customize email templates or notifications if needed.
5. **Explore & Test:** Use the interactive LWCs in your org to manage applications, skills, and badges.
6. **Refer to docs** inside respective folders for detailed instructions and best practices.

---

## 🤝 Contributing

We're Happy TO Welcome Contributions!

<a href="https://github.com/Varunshiyam/CRM-Driven-Internship-Application-Tracker/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Varunshiyam/CRM-Driven-Internship-Application-Tracker" />
</a>



