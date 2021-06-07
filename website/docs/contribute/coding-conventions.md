---
title: Coding conventions
---

## Prettier

We use [prettier](https://prettier.io/) to format all the code base. If you start a PR, it will be automatically run after all your commits.

You can also run it manually with this command:

```
make prettier
```

## Naming

The naming conventions below correspond to what is generally practiced for Javascript code (See [here](https://www.robinwieruch.de/javascript-naming-conventions) and [there](https://www.freecodecamp.org/news/javascript-naming-conventions-dos-and-don-ts-99c0e2fdd78a/)). It is a good idea to adhere to them in order to make the code easier to read and more uniform.

- All the code is in **English** to facilitate future collaboration.

- The **variables** names are in lower case with camelCase.

- The **constants** name may be in camelCase or uppercase (with underscore to separate). Usually capitals are kept for constants that are fixed "forever", such as an API key, or days of the week.

- The names of **classes** and **components** are in PascalCase. Even if they are objects, we consider the **MoleculerJS** services as classes, in order to conform to what MoleculerJS does (e.g. ApiGateway).

- The names of **NPM packages** (and associated folders) are hyphenated in lowercase, as required by the NPM naming convention.

## Comments

- It is not necessary to comment on everything. If one thing is self-evident (e.g., `const container = createContainer()`), no comment is required.

- Comments are appreciated when performing complicated operations, in order to make it easier for others and our future self to read the code.

- Comments are written in **English** and with the appropriate **punctuation marks**. They begin with a **upper case**.
