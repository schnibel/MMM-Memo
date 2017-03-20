/* Magic Mirror
 * Module: MMM-Memo
 *
 * By Christophe Michel @schnibel
 * March 2017
 * MIT Licensed.
 *
 */

const NodeHelper = require("node_helper");
const url = require("url");
const fs = require("fs");

module.exports = NodeHelper.create({
	
	start: function() {
		this.expressApp.get('/AddMemo', (req, res) => {

			var query = url.parse(req.url, true).query;
			var level = query.level;
			var memoTitle = query.memoTitle;
			var item = query.item;

			if (memoTitle == null && item == null && level == null) {
				res.send({"status": "failed", "error": "No 'memoTitle', 'level' and 'item' given."});
			}
			else if (memoTitle == null) {
				res.send({"status": "failed", "error": "No 'memoTitle' given."});
			}
			else if (item == null){
				res.send({"status": "failed", "error": "No 'item' given."});
			}
			else if (level == null) {
				res.send({"status": "failed", "error": "No 'level' given."});
			}
			else {
				var new_item = {"memoTitle": memoTitle.toLowerCase(), "level": level, "item": item, "timestamp": new Date()};
				res.send({"status": "success", "item": new_item});
				this.sendSocketNotification("ADD", new_item);
				this.storeMemos(new_item);
			}
		}),

		this.expressApp.get('/RemoveMemo', (req, res) => {

			var query = url.parse(req.url, true).query;
			var memoTitle = query.memoTitle;
			var item = query.item;

			if (memoTitle == null && item == null){
				res.send({"status": "failed", "error": "No 'memoTitle' and 'item' given."});
			}
			else if (memoTitle == null) {
				res.send({"status": "failed", "error": "No 'memoTitle' given."});
			}
			else if (item == null) {
				res.send({"status": "failed", "error": "No 'item' given."});
			}
			else {
				var old_item = {"memoTitle": memoTitle.toLowerCase(), "item": item};
				res.send({"status": "success", "payload": old_item});
			    this.removeMemos(old_item);
				this.sendSocketNotification("INIT", this.memos);
			}
		});

	},
	
	socketNotificationReceived: function(notification, payload) {

		if(notification === "LOAD_MEMOS"){
		    this.memoTitle = payload.memoTitle.toLowerCase();
			this.memoMaxItems = payload.memoMaxItems;
			this.memoFilename = payload.memoFilename;
			this.loadMemos();
		}
	},

	storeMemos: function(item){
		this.memos.push(item);
		fs.writeFileSync(this.memoFilename, JSON.stringify({"memos": this.memos}), 'utf8');
	},


	loadMemos: function(){
    		if(this.fileExists(this.memoFilename)){
    			this.memos = JSON.parse(fs.readFileSync(this.memoFilename, 'utf8')).memos;

                this.sendSocketNotification("INIT", this.memos);
    		} else {
    			this.memos = [];
    		}
    	},

    removeMemos: function(old_item){

        var j = 0;
        for (var i = this.memos.length - 1; i >= 0; i--) {
            if (this.memos[i].memoTitle.toLowerCase() == old_item.memoTitle.toLowerCase()) {
                if (old_item.item == 'ALL') this.memos.splice(i, 1);
                else {
                    j = j+1;
                    if (j == old_item.item) this.memos.splice(i, 1);
                }
            }
        }

        if (j == 0) console.log("The memoTitle '"+old_item.memoTitle.toLowerCase()+"' doesn't exist");
        fs.writeFileSync(this.memoFilename, JSON.stringify({"memos": this.memos}), 'utf8');
    },

	fileExists: function(path){
		try {
			return fs.statSync(path).isFile();
		} catch(e) {
			console.log("No memo file found.");
			return false;
		}
	}
	
});