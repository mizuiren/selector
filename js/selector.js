;(function(){
	/**
	 * by 秋叶（author blog：https://www.mizuiren.com）
	 * [description]
	 * @return {[type]} [description]
	 */
	function resetPosition(recurrence) {
		var $container = $('#q-select-box');
		var $select = $('select.isSelecting').eq(0);
		var $list = $('.q-select-list', $container);
		var screenHeight = $(window).height(), screenWidth = $(window).width(), scrollTop = $(document).scrollTop(), scrollLeft = $(document).scrollLeft();
		
		var positionX = $select.offset().left, positionY = $select.offset().top;
		var height = $select.outerHeight(), width = $select.outerWidth();
		var boxWidth = $container.outerWidth(), boxHeight = $container.outerHeight();
		if(boxHeight + positionY + height > screenHeight + scrollTop) {
			$container.css({
				'top': (positionY - scrollTop - boxHeight) + 'px'
			});
			$('.q-select-input-box', $container).css({
				'position': 'absolute',
				'bottom': -(height + 2) + 'px'
			});
			if(!recurrence) {
				if(positionY - boxHeight < scrollTop) {
					$list.css('max-height', positionY - scrollTop);
				}
				resetPosition(true);
			}
			
		} else {
			$container.css({
				'top': (positionY - scrollTop + height) + 'px'
			});
			$('.q-select-input-box', $container).css({
				'position': 'relative',
				'bottom': 0,
			});
			
		}
		if(boxWidth + positionX > screenWidth + scrollLeft) {
			$('#q-select-box').css('width', boxWidth + 'px');
			$container.css({
				'left': (positionX - scrollLeft - boxWidth + width) + 'px'
			});
			
			$('.q-select-input-box', $container).css({
				'float': 'right',
			});
		} else {
			$container.css({
				'left': (positionX - scrollLeft) + 'px'
			});
			$('.q-select-input-box', $container).css({
				'float': 'none',
			});
		}
	}
	$.fn.extend({
	    "qselect": function () {
	    	var _this = this;
	        $(document).off('mousedown.select').on('mousedown.select', 'select', function() {
	        	if(Array.prototype.indexOf.call(_this, this) === -1) {
	        		return;
	        	}
	        	return false;
	        }).off('click.select').on('click.select', 'select', function(e) {
	        	if(Array.prototype.indexOf.call(_this, this) === -1) {
	        		return;
	        	}
	        	clearSelecting();
				var width = $(this).outerWidth(), height = $(this).outerHeight();
				$(this).addClass('isSelecting').css('opacity', 0);
				var thisVal = $(this).val() || '';
				$('#q-select-box').remove();
				var $container = $('<div id="q-select-box" style="box-shadow:0 0 5px #a7a7a7;z-index:2;position: fixed;min-width:' + width + 'px;"><div class="q-select-input-box" style="margin-top:-' + height + 'px;width:' + width + 'px"><input type="text" style="width: 100%;padding-right: 12px;height: ' + height + 'px;box-sizing:border-box;" class="q-select-input"><span class="icon" style="top:' + (height / 2) + 'px;left:' + (width - 12) + 'px"></span></div></div>');
				var $list = $('<div class="q-select-list" style="max-height:500px;overflow:auto;"></div>');
				var thisText = '', multiVal;
				function createItem($item, $parent) {
					var value = $item.attr('value');
					var _class = ['item', 't-overflow'];
					var attrs = $item[0].attributes, _attrs = [];
					Array.prototype.slice.call(attrs).forEach(function(part){
						_attrs.push(part.name + '="' + part.value + '"');
					});

					if(!$item.hasClass('q-select-add') && $item.css('display') !== 'none') {
						var item = $('<div ' + _attrs.join(' ') + ' title="'+$item.text()+'">' + $item.text() + '</div>');
						item.addClass('item');
						$parent.append(item);
					} else {
						multiVal = value;
					}
					if($item.val() === thisVal) {
						thisText = $item.text();
					}
				}
				$('> option, optgroup', $(this)).each(function() {
					if(this.tagName === 'OPTGROUP') {
						var $optgroup = $('<div class="optgroup"></div>');
						var label = $(this).attr('label') || '';
						$list.append('<div class="label">'+label+'</div>');
						$('> option', $(this)).each(function() {
							createItem($(this), $optgroup);
						});
						$list.append($optgroup);
					} else {
						createItem($(this), $list);
					}	
				});
				
				thisVal.split(',').forEach(function(_item) {
					if(thisVal !== multiVal) {
						$list.find('.item').removeClass('selected');
					}
					$list.find('.item[value="'+_item+'"]').addClass('selected');
				});
				
				$container.append($list);

				$(this).after($container);

				resetPosition();
				$('#q-select-box .q-select-input').val(thisText).focus();
				e.stopPropagation();
			}).on('mousedown.select', '#q-select-box .item', function(e) {
				var $select = $('select.isSelecting');
				var $box = $('#q-select-box');
				if($(this).hasClass('selected')) {
					if($select.attr('multiselect') !== undefined) {
						$(this).removeClass('selected');
					}
				} else {
					if($select.attr('multiselect') === undefined) {
						$('.q-select-list', $box).find('.item').removeClass('selected');
					}
					$(this).addClass('selected');
				}
				
				var texts = [], values = []; 
				$('.item.selected', $box).each(function() {
					texts.push($(this).text());
					values.push($(this).attr('value'));
				});
				if(values.length > 1) {
					$select.find('.q-select-add').remove();
					$select.append('<option style="display:none;" class="q-select-add" value="' + values.join(',') + '">'+texts.join(',')+'</option>')
				}
				$select.val(values.join(',')).trigger('change');
				$('.q-select-input', $box).val(texts.join(','));
				if(!$select[0].style.width) {
					var newSelectWidth = $select.outerWidth(); 
					$('.q-select-input', $box).width(newSelectWidth - 16);
					$box.css('min-width', newSelectWidth + 'px');
					$('.q-select-input-box .icon', $box).css('left', newSelectWidth - 12);
				}

				if($select.attr('multiselect') !== undefined) {
					e.stopPropagation();
				}
			}).on('mousedown.select', function(e) {
				if(!$(e.target).hasClass('q-select-input') && !$(e.target).hasClass('q-select-list')) {
					setTimeout(function() {
						clearSelecting();
					});
				}
			}).off('input').on('input', '.q-select-input', function() {
				var val = $(this).val();
				$('#q-select-box .q-select-list .item').each(function() {
					var text = $(this).text();
					if(text.match(new RegExp(val, 'i'))) {
						$(this).show();
					} else {
						$(this).hide();
					}
				});
				resetPosition();
			});
			function clearSelecting() {
				$('#q-select-box').remove();
				$('select.isSelecting').css('opacity', 1).removeClass('isSelecting');
			}
			$(window).on('resize.select, scroll.select', function() {
				clearSelecting();
			});
			return this;
	    }
	});
})();
