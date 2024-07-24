import { Router } from 'itty-router';
import repos from "./repos.js"
import axios from 'axios';

// Create a new router
const router = Router();

const metaData = []

function resJSON(obj) {
	return new Response(JSON.stringify(obj), { headers: { "Content-Type": "application/json" } })
}


router.get('/', () => {
	return new Response('MultiPlay Asset Library API, Read more at https://github.com/maji-git/mpc-assetlib');
});

const categories = {
	"1": "Network Protocols",
	"2": "Extensions",
	"3": "Synchronizers",
	"4": "Templates",
}

router.get('/configure', (req) => {
	return resJSON({
		"categories": [
			{
				"id": "1",
				"name": "Network Protocols",
				"type": "0"
			},
			{
				"id": "2",
				"name": "Extensions",
				"type": "0"
			},
			{
				"id": "3",
				"name": "Synchronizers",
				"type": "0"
			},
			{
				"id": "4",
				"name": "Templates",
				"type": "0"
			},
		],
	});
});

router.get('/asset', (req) => {
	let result = metaData

	console.log(req.query)
	
	if (req.query['filter']) {
		result = result.filter((e) => e.title.search(req.query.filter) != -1)
	}

	if (req.query['category']) {
		result = result.filter((e) => e.category_id == req.query.category)
	}

	// Exclude Templates
	if (req.query['type'] && req.query['type'] == "project") {
		result = result.filter((e) => e.category_id == 4)
	} else if (req.query['category'] != "4") {
		result = result.filter((e) => e.category_id != 4)
	}

	return resJSON({
		"result": result,
		"page": 0,
		"pages": 0,
		"page_length": 10,
		"total_items": result.length
	});
});

router.get('/asset/:id', (req) => {
	const assetID = decodeURIComponent(req.params.id)
	const datIndex = metaData.findIndex((e) => e.asset_id == assetID.toString())

	if (datIndex != -1) {
		return resJSON(metaData[datIndex]);
	} else {
		return new Response("NOT FOUND", { status: 404 })
	}
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: async (req, env) => {
		if (metaData.length == 0) {

			let i = 1
			for (const r of repos) {
				const repoMetaURL = `https://raw.githubusercontent.com/${r}/main/mpmeta.json`
				const repoDownloadURL = `https://github.com/${r}/archive/master.zip`

				const metaJSON = (await axios.get(repoMetaURL)).data

				const descBlocks = []

				descBlocks.push(`[font_size=18]About this extension[/font_size]`)

				let t1 = "Compatible MultiPlayCore Version"

				// If this is a template project
				if (metaJSON.category_id == 4) {
					t1 = "Using MultiPlay Core Version"
				}

				descBlocks.push(`[indent]${t1}: ${metaJSON.mpc_version}[/indent]`)

				if (metaJSON.support_level == "testing") {
					descBlocks.push(`[indent]⚠️ This extension is still in its testing phase.[/indent]`)
				}

				descBlocks.push(``)
				descBlocks.push(`[font_size=18]Description[/font_size]`)
				descBlocks.push(`[indent]${metaJSON.description ?? "This extension doesn't have a description"}[/indent]`)

				metaData.push({
					...metaJSON,
					"description": descBlocks.join("\n"),
					"asset_id": i.toString(),
					"author_id": metaJSON.author.charCodeAt(0),
					"category": categories[metaJSON.category_id],
					"rating": "0",
					"download_url": repoDownloadURL,
					"download_hash": "",
					"browse_url": `https://github.com/${r}/`
				})

				i++
			}
		}

		return router.handle(req, env)
	},
};
