# Introduction 
- We use [docusaurus](https://docusaurus.io/) to document the SemApps project. Docusaurus is used to generate documentation from Github : 
    - We benefit from the collaborative environment github (markdown editing, versionning, commits, pull requests, reviews, merge etc.).
    - You can preview the changes
    - The code can be documented and displayed on the showcase site.
- Today the SemApps docusaurus is hosted on http://doc.semapps.org/ ; In a few days it will be hosted on http://semapps.org/

# Where to find docusaurus documentation
- https://github.com/assemblee-virtuelle/semapps/tree/master/website/docs
  - You can find the **documentation files** (governance, participation, packages) are in website/docs 
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/docusaurus.config.js
  - You will find the **menu** (navbar), the **header** (title and tagline) and the **footer**.
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/src/pages/index.js
  - It contains the content of the body of the home page and also the text of the (Start) button.
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/sidebars.js
  - Here you can find the pages appearing in the sidebars
  
# How to contribute to the documentation

## General scheme
- Until there is a decision/consent from the documentation circle: **Create an issue**
- If the content of what you want to publish has been approved by the documentation group : 
    - **Create a pull request on a dedicated branch.**  
    - As long as it's in draft or draft form, **don't request a review**.
- When our proposal for a contribution appears to be complete, **a review is requested**.

## Propose topics or improvements by creating an "issue"
- Go to https://github.com/assemblee-virtuelle/semapps/issues
- Detail your request/proposal, put links if necessary to clarify your intention as much as possible.  
- Fill in the external / internal / technical documentation label from the "Labels" tab of the menu on the right-hand side of the screen. 
- And let's discuss it!

## Modify a page of the docusaurus
Go to the relevant place by referring to the previous chapter. 
- If it is a minor modification, a spelling mistake for example, make the change by editing the page (edit file), then "commit" to the __Master__ branch. Describe your change in the space provided. 
- If it is a substantial change : 
  - make the change by editing the page, 
  - then "commit" to a new branch that you can explicitly name.
  - Fill in a __Label__ and identify __Reviewers__ who will be invited to comment / approve / propose changes to your pull request. 
  - At the end of this collective process, it will be time to __merger__ the pull request on the __Master__ branch.

## Create a new page on the docusaurus
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
