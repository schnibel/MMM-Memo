/* Magic Mirror
 * Module: MMM-Memo
 *
 * By Christophe Michel @schnibel
 * March 2017
 * MIT Licensed.
 *
 */

 Module.register('MMM-Memo',{

	memos: [],

	defaults: {
		memoMaxItems: 5,
		memoMaxMsgSize: false,
		memoDisplayDuration: false,
		memoDisplayIfEmpty: false,
		memoDisplayId: true,
		memoDisplayHeader: true,
		memoColorBackground: 'Yellow',
        memoColorHeader: 'Black',
		memoColorFont: 'Black',
		memoColorWarning: 'Red',
		memoRotation: '0',
		memoWidth: '100px',
		memoHeight: '100px',
		memoPadding: '20px',
		memoFilename: 'MMM-Memo.json',

		format: false,
		memoLevel: {
			WARNING: "exclamation-triangle"
		},
		memoIndex: {
		    CIRCLED_DIGIT_1: "&#x2460;",
		    CIRCLED_DIGIT_2: "&#x2461;",
		    CIRCLED_DIGIT_3: "&#x2462;",
		    CIRCLED_DIGIT_4: "&#x2463;",
		    CIRCLED_DIGIT_5: "&#x2464;",
		    CIRCLED_DIGIT_6: "&#x2465;",
		    CIRCLED_DIGIT_7: "&#x2466;",
		    CIRCLED_DIGIT_8: "&#x2467;",
		    CIRCLED_DIGIT_9: "&#x2468;",
		    CIRCLED_DIGIT_10: "&#x2469;",
		    CIRCLED_DIGIT_11: "&#x246A;",
		    CIRCLED_DIGIT_12: "&#x246B;",
		    CIRCLED_DIGIT_13: "&#x246C;",
		    CIRCLED_DIGIT_14: "&#x246D;",
		    CIRCLED_DIGIT_15: "&#x246E;",
		    CIRCLED_DIGIT_16: "&#x246F;",
		    CIRCLED_DIGIT_17: "&#x2470;",
		    CIRCLED_DIGIT_18: "&#x2471;",
		    CIRCLED_DIGIT_19: "&#x2472;",
		    CIRCLED_DIGIT_20: "&#x2473;"
		},
	},

	getStyles: function () {
        return ['MMM-Memo.css', 'font-awesome.css'];
	},

	getTranslations: function() {
		return {
			en: "translations/en.json",
			fr: "translations/fr.json",
			id: "translations/id.json"
		};
	},

	getScripts: function() {
 		return ["moment.js"];
	},

	start: function() {
        var memoTitle = this.config.memoTitle.toLowerCase();
        this.sendSocketNotification("LOAD_MEMOS", {memoTitle: memoTitle, memoMaxItems: this.config.memoMaxItems, memoFilename: this.file(this.config.memoFilename)});

		Log.info("Starting module: " + this.name);

		moment.locale(config.language);

		//Update DOM every minute so that the time of the call updates and calls get removed after a certain time
		setInterval(() => {
			this.updateDom();
		}, 60000);
	 },

	socketNotificationReceived: function(notification, payload) {

		if(notification === "INIT") {
		    this.memos = [];
    		for(var i = 0; i < payload.length; i++) {
    			this.memos.push(payload[i]);
		    }
			this.updateDom(3000);
		}
		else if(notification === "ADD") {
			this.memos.push(payload);
			this.updateDom(3000);
		}
	 },


	getDom: function() {

	    // Creation of a temporary array for the current memo
	    var tempMemos = [];
	    for (var i = 0; i < this.memos.length ; i++ ) {
	        if (this.memos[i].memoTitle.toLowerCase() == this.config.memoTitle.toLowerCase()) {
	            tempMemos.push(this.memos[i]);
	        }
	    }
	    var tempMemosSize = tempMemos.length;
	    while(tempMemos.length > this.config.memoMaxItems) {
            tempMemos.shift();
        }


        // Creation of the div section to display memos
        var wrapper = document.createElement("div");
        if (tempMemos.length > 0 || this.config.memoDisplayIfEmpty) {
            wrapper.className = "quote-container";
            wrapper.style.height = this.config.memoHeight + 2 * this.config.memoPadding;
            wrapper.style.width = this.config.memoWidth + 2 * this.config.memoPadding;

            // Creation of a pin
            var wrapper_pin = document.createElement("i");
            wrapper_pin.className = "pin";
            wrapper.appendChild(wrapper_pin);

            // Creation of the colored structure of the memo
            var wrapper_blockquote = document.createElement("blockquote");
            wrapper_blockquote.className = "note " + this.config.memoColorBackground + " rotate"+this.config.memoRotation+"deg"
            wrapper_blockquote.style.color = this.config.memoColorFont;
            wrapper_blockquote.style.height = this.config.memoHeight;
            wrapper_blockquote.style.width = this.config.memoWidth;
            wrapper_blockquote.style.padding = this.config.memoPadding;

            // ************************************ Blockquote structure ************************************
            // Creation of the memo header.
            // It is used to optionally display the name of the memo and the number of items
            if (this.config.memoDisplayHeader) {
                var blockquote_header = document.createElement("header");
                blockquote_header.className = "xsmall";
                blockquote_header.style.color = this.config.memoColorHeader;
                blockquote_header.innerHTML = this.config.memoTitle.toLowerCase() + " (" + tempMemosSize + ")";
                wrapper_blockquote.appendChild(blockquote_header);
            }

            // Creation of the memo content. A memo content is basically a table of double rows <tr>
            //     The first row <tr> is used to display the memo
            //     The second row <tr> is used to optionally display since when the memo has been created
            var blockquote_table = document.createElement("table");
            blockquote_table.style.width = '100%';

            for (var i = tempMemos.length - 1; i >= 0; i--) {

                //Create of the first row <tr> containing the memo and some information
                //Each row <tr> will contain 3 cells <td>.
                //   The first cell <td> optionally displays the id of the memo, it will be used to remove them
                //   The second cell <td> displays or not an alert icon for important memo.
                //   The third cell <td> displays the content of the memo
                var table_tr_memo = document.createElement("tr");
                if (tempMemos[i].level == "WARNING") table_tr_memo.style.color = this.config.memoColorWarning;

                // Creation of first cell <td> to optionally display the id of the memo.
                var tr_memo_td_id = document.createElement("td");
                tr_memo_td_id.classList.add("xsmall");
                tr_memo_td_id.style.align = 'center';
                if (this.config.memoDisplayId) {
                    var id = "CIRCLED_DIGIT_" + (tempMemos.length-i);
                    tr_memo_td_id.innerHTML = this.config.memoIndex[id];
                }
                table_tr_memo.appendChild(tr_memo_td_id);

                // Creation of second cell <td> to optionally display an alert icon for important memo.
                var tr_memo_td_status = document.createElement("td");
			    var icon =  document.createElement("i");
			    if(this.config.memoLevel.hasOwnProperty(tempMemos[i].level)){
				    icon.classList.add("fa", "fa-fw", "fa-" + this.config.memoLevel[tempMemos[i].level]);
			    }
                tr_memo_td_status.style.color = this.config.memoColorWarning;
			    tr_memo_td_status.classList.add("small");
    			tr_memo_td_status.appendChild(icon);
                table_tr_memo.appendChild(tr_memo_td_status);

                // Creation of third cell <td> to display the content of the memo.
                var memo = tempMemos[i].item;
                if(this.config.memoMaxMsgSize && memo.length > this.config.memoMaxMsgSize) {
                    memo = memo.slice(0, this.config.memoMaxMsgSize) + "&#8230;";
                }

                var tr_memo_td_message =  document.createElement("td");
                tr_memo_td_message.classList.add("small");
                tr_memo_td_message.style.textAlign = 'right';
                tr_memo_td_message.innerHTML = " " + memo;
                table_tr_memo.appendChild(tr_memo_td_message);
                blockquote_table.appendChild(table_tr_memo);

                //Create of the second row <tr> to optionally display since when the memo has been created
                if (this.config.memoDisplayDuration) {
                    var table_tr_duration =  document.createElement("tr");
                    if (tempMemos[i].level == "WARNING") table_tr_duration.style.color = this.config.memoColorWarning;
                    var tr_duration_td_empty1 = document.createElement("td");
                    var tr_duration_td_empty2 = document.createElement("td");
                    var tr_duration_td_value = document.createElement("td");
                    tr_duration_td_value.innerHTML = this.config.format ? moment(tempMemos[i].timestamp).format(this.config.format) : moment(tempMemos[i].timestamp).fromNow();
                    tr_duration_td_value.classList.add("light", "xxsmall", "align-right");

                    table_tr_duration.appendChild(tr_duration_td_empty1);
                    table_tr_duration.appendChild(tr_duration_td_empty2);
                    table_tr_duration.appendChild(tr_duration_td_value);
                    blockquote_table.appendChild(table_tr_duration);
                }
            }

            // Add a last row with "... x other memos"
            if (tempMemos.length < tempMemosSize) {
                var last_row = document.createElement("tr");
                var cell1 = document.createElement("td");
                var cell2 = document.createElement("td");
                var cell3 = document.createElement("td");
                if ( (tempMemosSize - tempMemos.length) > 1)
                    cell3.innerHTML = "+ " + (tempMemosSize - tempMemos.length) + this.translate("moreItems");
                else cell3.innerHTML = "+ " + (tempMemosSize - tempMemos.length) + this.translate("moreItem");
                cell3.classList.add("small");
                cell3.style.textAlign = 'left';

                last_row.appendChild(cell1);
                last_row.appendChild(cell2);
                last_row.appendChild(cell3);
                blockquote_table.appendChild(last_row);
            }

            wrapper_blockquote.appendChild(blockquote_table);
            wrapper.appendChild(wrapper_blockquote);
        }
        return wrapper;
	}
});
