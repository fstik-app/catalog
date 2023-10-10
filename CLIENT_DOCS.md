# Description

The front-end of the sticker catalog is built using React. The initial version, released over a year ago, was built using the outdated [Create React App (CRA)](https://reactjs.org/docs/create-a-new-react-app.html) framework. 

Currently, it is being rewritten using [Vite](https://vitejs.dev/guide/) and other updated dependencies.

## Application Functionality

On the main page, there is a search bar, a menu, and a list of sticker packs. Currently, the menu consists of three categories, but in the future, there are plans to add a separate tab for emoji packs and also a tab for user-added sticker packs.

For each sticker pack, users can leave reactions, and for admins, there are moderation buttons available. The AI-based filter works very well, but there are still plans to add the option to report sticker sets in the future.

When clicking on a sticker pack, a page dedicated to it opens up, and at the bottom, there is a list of similar sticker packs that may interest the user. Additionally, there is a "Share" button. Upon clicking it, a link to the sticker pack's page in the catalog is copied to the clipboard for easy sharing.

## State Management

[Effector](https://effector.dev/) is used as the state manager, along with [Patronum](https://patronum.effector.dev/), which provides many useful features on top of Effector.

## Routing

For routing, [Atomic Router](https://atomic-router.github.io/), built on top of Effector, is used.

## Infinite Sticker List

To create an infinite list of stickers, [React Virtualized](https://github.com/bvaughn/react-virtualized) is employed.

## Architecture

Additionally, the project has transitioned from lacking architecture to adopting [Feature-Sliced Design](https://feature-sliced.design/).

## Animated Stickers

For working with animated stickers, code from [tweb](https://github.com/morethanwords/tweb), [telegram-tt](https://github.com/Ajaxy/telegram-tt)


