var DDigitalLCD = function(screen)
{

	// Graph area
	this.screen = screen;

	this.database = {};
	EventBus.addListeners(this.listeners, this);

	this.max_letters = 10;
};

DDigitalLCD.prototype =
{

format_number: function(number)
{
	var st = number.toString();

	return st.length > this.max_letters ? number.toPrecision(this.max_letters) : st;
},

listeners: {

	size_change: function(d, obj)
	{
		obj.max_letters = parseInt(($(obj.screen).width()-64)/ 30) - 1;
		if (obj.max_letters > 20)
			obj.max_letters = 20;
	},

	tuples: function(detail, obj) {

		var updated_lcd = [];

		for (var statement_name in detail) {
			if (!(statement_name in obj.database)) continue;
			var data = detail[statement_name];

			for (var k in data)
				if (k != 'time_t')
				{
					// première valeur pour l'instant, car bon voila quoi,
					// faut faire d'autres évènements
					var id = "lcd_"+(statement_name+k).hashCode();
					// console.log(id);
					var box = byId(id);
					if (!box) {
						box = newDom('div');
						box.id = id;
						box.className = 'lcd_box';
						var value = newDom('span');
						value.appendChild(document.createTextNode(''));
						var div_name = newDom('div');
						div_name.className = 'name';
						div_name.appendChild(document.createTextNode(statement_name));
						var div_key = newDom('div');
						div_key.className = 'key';
						div_key.appendChild(document.createTextNode(k));
						box.appendChild(value);
						box.appendChild(div_name);
						box.appendChild(div_key);
						obj.screen.appendChild(box);
					}
					var value = data[k].length > 0 ? data[k][0] : 0.0;
					box.firstChild.firstChild.data = obj.format_number(value);
					updated_lcd.push(box);
				}
		}

		$('.lcd_box').each(function() {
			if (updated_lcd.indexOf(this) === -1)
				obj.screen.removeChild(this);
		});
	},

	add_statement: function(e, obj) {
		if (e.box_name != self.name) return;

		if (!(e.statement_name in obj.database))
			obj.database[e.statement_name] = true;
	},
	del_statement: function(e, obj) {
		if (e.box_name != self.name) return;

		if (e.statement_name in obj.database)
			delete obj.database[e.statement_name];
	}
}};
