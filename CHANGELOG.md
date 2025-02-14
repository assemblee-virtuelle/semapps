# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

##

Breaking: Rename `auth.jwt.generateToken` to `auth.jwt.generateServerSignedToken` and `auth.jwt.verifyToken` to `auth.jwt.verifyServerSignedToken`.

## [middleware-0.4.2] - 2023-01-30

**@semapps/crypto**

- Move proxy service to signature package, split keypair service [ab62eebc3](https://github.com/assemblee-virtuelle/semapps/commit/ab62eebc3807f21218384b24e5b743be33471247) (_:warning: Breaking changes_)
- Handle non-GET methods on proxy endpoint through multipart/form-data [81793af4](https://github.com/assemblee-virtuelle/semapps/commit/81793af42b96a2e42d868d8a4e33f7dc35ab8eec)

**@semapps/notifications**

- Add formatLink method to single-mail notifications [a5dda0e2](https://github.com/assemblee-virtuelle/semapps/commit/a5dda0e2f6a6121d1ec422a244aaa6d6e3d0e658)
- Allow to add delay before processing notifications [42a82ebf](https://github.com/assemblee-virtuelle/semapps/commit/42a82ebf7c363ff448a815103517b317985f85b9)

**@semapps/auth**

- Local login: allow to redirect /auth to a given frontend URL (formUrl) [22e5f1cc](https://github.com/assemblee-virtuelle/semapps/commit/22e5f1ccc5d34f669ac5a869a2e438057120916f)
- Fix reset password mails if frontendUrl has a trailing slash [4b16b950](https://github.com/assemblee-virtuelle/semapps/commit/4b16b9502467c88c7ad3977e0174945666dab3f8)

**@semapps/webacl**

- Fix getAclUriFromResourceUri if ending slash is missing from baseUrl [923de06f](https://github.com/assemblee-virtuelle/semapps/commit/923de06f2b4045fa3e66903942b09586365f6b89)

## [frontend-0.4.2] - 2023-01-30

**@semapps/semantic-data-provider**

- Pod login & proxy authentication [#1091](https://github.com/assemblee-virtuelle/semapps/pull/1091) (_:warning: Breaking changes_)
- Convert sparqlwhere parameter to object if it is a string [#1104](https://github.com/assemblee-virtuelle/semapps/pull/1104)

**@semapps/auth-provider**

- Don't throw error if permissions cannot be fetched [54500de0](https://github.com/assemblee-virtuelle/semapps/commit/54500de024b4e0e9ef0ec357282086a6bebefb65)

**@semapps/interop-components**

- Control lexiconImportForm to avoid creating empty items [#1090](https://github.com/assemblee-virtuelle/semapps/pull/1090)
- fetchESCO: allow to choose a type of classification ](https://github.com/assemblee-virtuelle/semapps/commit/29784572924524579540eacf87741e3be952d370)

## [middleware-0.4.1] - 2023-01-13

- Use named routes for moleculer-web [#1099](https://github.com/assemblee-virtuelle/semapps/pull/1099)

**@semapps/core**

- Fix bug created datasets are always secure [d181bfbc](https://github.com/assemblee-virtuelle/semapps/commit/d181bfbc0a6a94c666cc96f4cc1a78e15f111372)

**@semapps/activitypub**

- Fix activitypub.actor.getProfile action [41fa295f](https://github.com/assemblee-virtuelle/semapps/commit/41fa295f9613f9e54b681aacf5f10aabc8a8b6a2)

**@semapps/auth**

- Fix auth.local.login action: return newUser false [6603dc86](https://github.com/assemblee-virtuelle/semapps/commit/6603dc865d70e62c57800d120a8c0de1f2e16a84)

**@semapps/ldp**

- ldp.resource.upload: fix files type [caddbf43](https://github.com/assemblee-virtuelle/semapps/commit/caddbf43a4a93b5d88a9465dc0fd548467d3acfb)

**@semapps/inference**

- InferenceService: handle cases where triples are undefined [fab3aaef](https://github.com/assemblee-virtuelle/semapps/commit/fab3aaef81089f9b132e53f5c2b33485c502154e)

## [frontend-0.4.1] - 2022-12-08

**@semapps/activitypub-components**

- CommentsField: prevent page to scroll to input on load [1183b6f3](https://github.com/assemblee-virtuelle/semapps/commit/1183b6f31ccf5ce4fe68794acadab266395c22af)
- CommentsField: add placeholder prop [abebb823](https://github.com/assemblee-virtuelle/semapps/commit/abebb82396afbfa0a655f8ba42327432370bf731)

**@semapps/interop-components**

- LexiconAutocompleteInput: fix no suggestion to add to dictionary on modal show [a3902b68](https://github.com/assemblee-virtuelle/semapps/commit/a3902b68bf19bd910199a321ec535ad81856fd9e)

## [0.4.0] - 2022-11-23

For all changes prior to v0.4.0, see the [Github releases](https://github.com/assemblee-virtuelle/semapps/releases)
