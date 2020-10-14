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
		var $virtual = $('.q-select-virtual', $container), virtualHeight = 0, virtualWidth = 0;
		var screenHeight = $(window).height(), screenWidth = $(window).width(), scrollTop = $(document).scrollTop(), scrollLeft = $(document).scrollLeft();
		var $input = $('.q-select-input-box input', $container);

		var positionX = $select.offset().left, positionY = $select.offset().top;
		var height = $select.outerHeight(), width = $select.outerWidth();
		if($virtual.length) {
			$virtual.css({
				'width': (width - 2) + 'px',//outerWidth要减去两边边框
			});
			$input.css({
				'width': (width - 2) + 'px',//强制始终跟virtual宽度一致，避免计算产生的细微误差
			});
			virtualHeight = $virtual.outerHeight();
			virtualWidth = $virtual.outerWidth();
		}
		var boxWidth = $container.outerWidth(), boxHeight = $container.outerHeight();
		if(boxHeight + positionY + height > screenHeight + scrollTop) {
			//朝上
			$container.css({
				'top': (positionY - scrollTop - boxHeight - virtualHeight) + 'px'
			});
			if($virtual.length) {
				$virtual.css({
					'top': - (virtualHeight - 1) + 'px',
				});
			}
			$('.q-select-input-box', $container).css({
				'position': 'absolute',
				'bottom': -(height + 2 + virtualHeight) + 'px'
			});
			$('.q-select-input-box', $container).css('height', height + 'px');
			if(!recurrence) {
				if(positionY - boxHeight < scrollTop) {
					$list.css('max-height', positionY - scrollTop);
				}
				resetPosition(true);
			}
		} else {
			//朝下
			if(!recurrence) {
				if($virtual.length) {
					$input.css({
						'height': (virtualHeight + height) + 'px',
						'padding-top': virtualHeight + 'px',
					});
				} else {
					$input.css({
						'height': height + 'px',
						'padding-top': 0,
					});
				}
				return resetPosition(true);
			}
			$('.q-select-input-box', $container).css('height', 'auto');
			$container.css({
				'top': (positionY - scrollTop + height) + 'px'
			});
			if($virtual.length) {
				$virtual.css({
					'top': 0,
				});
				$input.css({
					'border-top': 'none'
				});
			}
			
			$('.q-select-input-box', $container).css({
				'position': 'relative',
				'bottom': 0,
			});
			
		}
		if(boxWidth + positionX > screenWidth + scrollLeft) {
			//朝左
			$('#q-select-box').css('width', boxWidth + 'px');
			$container.css({
				'left': (positionX - scrollLeft - boxWidth + width) + 'px'
			});
			
			$('.q-select-input-box', $container).css({
				'float': 'right',
			});
		} else {
			//朝右
			$container.css({
				'left': (positionX - scrollLeft) + 'px'
			});
			$('.q-select-input-box', $container).css({
				'float': 'none',
			});
		}
	}
	function refreshQselectList($select, $listContainer) {
		$listContainer.empty();
		var thisVal = $select.val() || '';
		var isMultiSelect = $select.attr('multiselect') !== undefined;
		function createItem($item) {
			if(!$item.attr('class')) {
				$item.attr('class', '');
			}
			var attrs = $item[0].attributes, _attrs = [];
			Array.prototype.slice.call(attrs).forEach(function(part){
				_attrs.push(part.name + '="' + part.value + (part.name === 'class' ? ' item t-overflow' : '') +'"');
			});
			var html = '';
			if(!$item.hasClass('q-select-add') && $item.css('display') !== 'none') {
				html += '<div ' + _attrs.join(' ') + ' title="'+$item.text()+'">' + $item.text() + '</div>';
			}
			return html;
		}
		var html = '';
		$('> option, optgroup', $select).each(function() {
			if($(this).css('display') === 'none' && !$(this).hasClass('q-select-add')) {
				return;
			}
			if(this.tagName === 'OPTGROUP') {
				var label = $(this).attr('label') || '';
				html += '<div class="label">'+label+'</div>';
				html += '<div class="optgroup">';
				$('> option', $(this)).each(function() {
					html += createItem($(this));
				});
				html += '</div>';
			} else {
				html += createItem($(this));
			}
		});
		$listContainer.html(html);
		thisVal.split(',').forEach(function(_item) {
			if(!isMultiSelect) {
				$listContainer.find('.item').removeClass('selected');
			}
			if((isMultiSelect && $select.find('.q-select-add').length) || !isMultiSelect) {
				$listContainer.find('.item[value="'+_item+'"]').addClass('selected');
			}
		});
	}
	function createMultiValList(multiVal, multiText) {
		var $box = $('#q-select-box');
		var $inputBox = $('.q-select-input-box', $box);
		if(typeof multiVal === 'string') {
			multiVal = multiVal.split(',');
		}
		if(typeof multiText === 'string') {
			multiText = multiText.split(',');
		}
		var virtualBox = $('<div class="q-select-virtual" style="position:absolute;"></div>'), spanHtml = [];
		multiVal.forEach(function(value, index) {
			if(multiText[index]) {
				spanHtml.push(`<span value="${value}">${multiText[index]}<i></i></span>`);
			}
		});
		if(multiVal) {
			virtualBox.html(spanHtml.join(''));
			$('.q-select-virtual', $box).remove();
			$inputBox.append(virtualBox);
		}
	}
	$.fn.extend({
	    "qselect": function () {
	    	var _this = this;
	        $(document).off('mouseup.select').on('mouseup.select', 'select', function() {
	        	if(Array.prototype.indexOf.call(_this, this) === -1) {
	        		return;
	        	}
	        	return false;
	        }).off('mousedown.select').on('mousedown.select', 'select', function(e) {
	        	e.preventDefault();
	        }).off('click.select').on('click.select', 'select', function(e) {
	        	if(Array.prototype.indexOf.call(_this, this) === -1) {
	        		return;
	        	}
	        	var isMultiSelect = $(this).attr('multiselect') !== undefined;
	        	clearSelecting();
				var width = $(this).outerWidth(), height = $(this).outerHeight();
				$(this).addClass('isSelecting').css('opacity', 0);
				var thisVal = $(this).val() || '';
				var thisText = $(this).find('option[value="'+thisVal+'"]').length ? $(this).find('option[value="'+thisVal+'"]').eq(0).text() : '';
				$('#q-select-box').remove();
				var $container = $('<div id="q-select-box" style="z-index:2;position: fixed;min-width:' + width + 'px;"><div class="q-select-input-box" style="margin-top:-' + height + 'px;width:' + width + 'px;"><input type="text" style="width: 100%;display: block;border: 1px solid #ccc;background: #fff;padding-right: 15px;height: ' + height + 'px;box-sizing:border-box;" class="q-select-input"><span class="icon" style="top:' + (height / 2 - Math.sqrt(2)) + 'px;left:' + (width - 15) + 'px"></span></div></div>');
				var $list = $('<div class="q-select-list" style="box-shadow:0 0 5px #a7a7a7;max-height:500px;overflow:auto;"></div>');
				
				refreshQselectList($(this), $list);
				$container.append($list);

				$(this).after($container);
				if(isMultiSelect) {
					createMultiValList(thisVal, thisText);
				} else {
					$('.q-select-input', $container).val(thisText);
				}
				$('.q-select-input', $container).focus();
				resetPosition();
				e.stopPropagation();
			}).on('click.select', '.q-select-virtual span i', function(e) {
				var val = $(this).parent().attr('value'), text = $(this).parent().text();
				var $box = $('#q-select-box');
				var $list = $('.q-select-list', $box);
				var $option = $('.item[value="'+val+'"]', $list);
				var isAddOption = false;
				if(!$option.length) {
					$option = $('<div value="'+val+'" class="item selected" style="display:none;">'+text+'</div>');
					$list.append($option);
					isAddOption = true;
				}
				if(!$option.hasClass('selected')) {
					$option.addClass('selected');
				}
				$option.trigger('mouseup.select');
				if(isAddOption) {
					$option.remove();
				}
			}).on('mouseup.select', '#q-select-box .item', function(e) {
				var $select = $('select.isSelecting');
				var $box = $('#q-select-box');
				var isMultiSelect = $select.attr('multiselect') !== undefined;
				var texts = [], values = $select.val() === null || !isMultiSelect ? [] : $select.val() ? $select.val().split(',') : [], $option;
				values.forEach(function(v) {
					$option = $('option[value="'+ v +'"]', $select);
					if($option.length) {
						texts.push($option.eq(0).text());
					}
				});
				if($(this).hasClass('selected')) {
					if(isMultiSelect) {
						var index = values.indexOf($(this).attr('value'));
						if(index > -1) {
							$(this).removeClass('selected');
							values.splice(index, 1);
							texts.splice(index, 1);
						}
					}
				} else {
					if(!isMultiSelect) {
						$('.q-select-list', $box).find('.item').removeClass('selected');
					}
					$(this).addClass('selected');
				}
				
				$('.item.selected', $box).each(function() {
					var text = $(this).text(), value = $(this).attr('value');
					if(values.indexOf(value) === -1) {
						texts.push(text);
						values.push(value);
					}
				});
				
				if(isMultiSelect) {
					$select.find('.q-select-add').remove();
					$select.append('<option style="display:none;" class="q-select-add" value="' + values.join(',') + '">'+texts.join(',')+'</option>')
				}
				$select.val(values.join(',')).trigger('change');
				if(!isMultiSelect) {
					$('.q-select-input', $box).val(values.join(','));
				} else {
					createMultiValList(values, texts);
				}
				if(!$select[0].style.width) {
					var newSelectWidth = $select.outerWidth(); 
					$('.q-select-input', $box).width(newSelectWidth - 16);
					$box.css('min-width', newSelectWidth + 'px');
					$('.q-select-input-box .icon', $box).css('left', newSelectWidth - 12);
				}

				if(isMultiSelect) {
					resetPosition();
					e.stopPropagation();
				}
			}).on('mouseup.select', function(e) {
				if(!$(e.target).hasClass('q-select-input') && !$(e.target).hasClass('q-select-list') && !$(e.target).closest('.q-select-virtual').length) {
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
