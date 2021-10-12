---
title: Contribute to the documentation
---

We use [Docusaurus](https://docusaurus.io/) to document the SemApps project. Docusaurus is used to generate documentation from Github : 
- We benefit from the collaborative environment of Github (markdown editing, versioning, commits, pull requests, reviews, etc.).
- You can preview the changes
- The code can be easily deployed

## Where to find the Docusaurus files

- The **documentation files** in markdown are in the [/website/docs/](https://github.com/assemblee-virtuelle/semapps/tree/master/website/docs) folder.

- The **configurations** to customize the  **menu** (navbar), the **header** (title and tagline) and the **footer** are in the [/website/docusaurus.config.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/docusaurus.config.js) file.

- the **translation** files (for exemple 'fr') are in the [/website/i18n/fr/](https://github.com/assemblee-virtuelle/semapps/blob/master/website/i18n/fr/) folder.

- The **content of the homepage** (coded in React) is in [/website/src/pages/index.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/src/pages/index.js)

- The **sidebars** can be customized by modifying the [/website/sidebars.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/sidebars.js) file.

## How to contribute to the documentation

### General scheme
- Until there is a decision/consent from the documentation circle: **Create an issue**
- If the content of what you want to publish has been approved by the documentation group : 
    - **Create a pull request on a dedicated branch.**  
    - As long as it's in draft or draft form, **don't request a review**.
- When our proposal for a contribution appears to be complete, **a review is requested**.

### Propose topics or improvements by creating an "issue"
- Go to https://github.com/assemblee-virtuelle/semapps/issues
- Detail your request/proposal, put links if necessary to clarify your intention as much as possible.  
- Fill in the external / internal / technical documentation label from the "Labels" tab of the menu on the right-hand side of the screen. 
- And let's discuss it!

### Modify a page of Docusaurus
Go to the relevant place by referring to the previous chapter. 
- If it is a minor modification, a spelling mistake for example, make the change by editing the page (edit file), then "commit" to the __Master__ branch. Describe your change in the space provided. 
- If it is a substantial change : 
  - make the change by editing the page, 
  - then "commit" to a new branch that you can explicitly name.
  - Fill in a __Label__ and identify __Reviewers__ who will be invited to comment / approve / propose changes to your pull request. 
  - At the end of this collective process, it will be time to __merger__ the pull request on the __Master__ branch.

### Create a new page on Docusaurus
- Propose an issue ; 

If the initiative seems relevant: 
- Create a markdown file in the desired location, remembering to fill in the extension: ".md". It must necessarily begin with :
  ```
  ---
  title: [your page title]
  ---
  ```

  NB: The page title may have spaces. On the other hand, the name of the .md file must not have spaces, and must be written in lower case.

- Commit and make a pull request on a dedicated branch. 
- Once the reviewers you've identified have validated it, merge the pull request on the master branch. 

## Getting help

Our [Semapps dev channel](https://chat.lescommuns.org/channel/semapps_dev) is the main entry point for all people who want to contribute.
