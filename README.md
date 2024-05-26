# MultiPlay AssetLib

Asset Library for MultiPlay. Used for downloading external MultiPlay Components. This code reimplements essential Asset Library APIs for Godot Editor.

## How to use it?
In MultiPlay version ^1. MultiPlay Tool will add MultiPlay Asset Library to your Asset Library Settings. You can use it by going to AssetLib -> Set the site to "MultiPlay AssetLib".

## How can I publish my components?

Right now components are manually approved and fetched in `repos.js` file. You can submit one by creating a pull request in this repository. Note that your extension repository must use the [MultiPlay Extension template](https://github.com/maji-git/multiplay-extension-template) repository, to make sure it works properly in production.

[![Deploy with Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/workers-sdk/tree/main/templates/worker-router)