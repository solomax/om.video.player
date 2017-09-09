var canvas = new fabric.Canvas('c');
var Player = (function() {
	let player = {}, mainColor = '#ff6600', rad = 20;
	function filter(_o, props) {
		return props.reduce((result, key) => { result[key] = _o[key]; return result; }, {});
	}

	player.create = function(canvas, _o) {
		let vid = $('<video>').hide().attr('class', 'wb-video slide-' + canvas.slide).attr('id', 'wb-video-' + _o.uid)
			.attr("width", _o.width).attr("height", _o.height)
			.append($('<source>').attr('type', 'video/mp4').attr('src', _o._src));
		$('body').append(vid);
		new fabric.Image.fromURL(_o._poster, function(poster) {
			new fabric.Image(vid[0], {}, function (video) {
				video.visible = false;
				poster.width = _o.width;
				poster.height = _o.height;
				let paused = true;
				let trg = new fabric.Triangle({
					left: 2.7 * rad
					, top: _o.height - 2.5 * rad
					, visible: paused
					, angle: 90
					, width: rad
					, height: rad
					, stroke: mainColor
					, fill: mainColor
				});
				let rectPause1 = new fabric.Rect({
					left: 1.6 * rad
					, top: _o.height - 2.5 * rad
					, visible: !paused
					, width: rad / 3
					, height: rad
					, stroke: mainColor
					, fill: mainColor
				});
				let rectPause2 = new fabric.Rect({
					left: 2.1 * rad
					, top: _o.height - 2.5 * rad
					, visible: !paused
					, width: rad / 3
					, height: rad
					, stroke: mainColor
					, fill: mainColor
				});
				let play = new fabric.Group([
						new fabric.Circle({
							left: rad
							, top: _o.height - 3 * rad
							, radius: rad
							, stroke: mainColor
							, strokeWidth: 2
							, fill: null
						})
						, trg, rectPause1, rectPause2]
					, {
						objectCaching: false
						, visible: false
					});
				let cProgress = new fabric.Rect({
					left: 3.5 * rad
					, top: _o.height - 1.5 * rad
					, visible: false
					, width: _o.width - 5 * rad
					, height: rad / 2
					, stroke: mainColor
					, fill: null
					, rx: 5
					, ry: 5
				});
				let isDone = function() {
					return video.getElement().currentTime == video.getElement().duration;
				};
				let updateProgress = function() {
					progress.set('width', (video.getElement().currentTime * cProgress.width) / video.getElement().duration);
					canvas.renderAll();
				};
				let updateControls = function() {
					video.visible = true;
					poster.visible = false;

					trg.visible = paused;
					rectPause1.visible = !paused;
					rectPause2.visible = !paused;
					canvas.renderAll();
				};
				cProgress.on({
					'mousedown': function (evt) {
						video.getElement().currentTime = (evt.e.offsetX - evt.target.aCoords.bl.x - cProgress.aCoords.bl.x)
								* video.getElement().duration / cProgress.width;
						updateProgress();
					}
				});
				let progress = new fabric.Rect({
					left: 3.5 * rad
					, top: _o.height - 1.5 * rad
					, visible: false
					, width: 0
					, height: rad / 2
					, stroke: mainColor
					, fill: mainColor
					, rx: 5
					, ry: 5
				});
				let request;
				let render = function () {
					if (isDone()) {
						paused = true;
						updateControls();
					}
					updateProgress();
					if (paused) {
						cancelAnimationFrame(request);
					} else {
						request = fabric.util.requestAnimFrame(render);
					}
				};
				play.on({
					/*
					 * https://github.com/kangax/fabric.js/issues/4115
					 *
					'mouseover': function() {
						circle1.set({strokeWidth: 4});
						canvas.renderAll();
					}
					, 'mouseout': function() {
						circle1.set({
							left: pos.left
							, top: pos.top
							, strokeWidth: 2
						});
						canvas.renderAll();
					}
					, */'mousedown': function () {
						play.set({
							left: pos.left + 3
							, top: pos.top + 3
						});
						canvas.renderAll();
					}
					, 'mouseup': function () {
						play.set({
							left: pos.left
							, top: pos.top
						});
						if (paused) {
							if (isDone()) {
								video.getElement().currentTime = 0;
							}
							video.getElement().play();
							fabric.util.requestAnimFrame(render);
						} else {
							video.getElement().pause();
						}
						paused = !paused;
						updateControls();
					}
				});

				let opts = $.extend({
					subTargetCheck: true
					, objectCaching: false
					, omType: 'Video'
					, selectable: canvas.selection
				}, filter(_o, ['fileId', 'fileType', 'slide', 'uid', '_poster', '_src', 'width', 'height']));
				let group = new fabric.Group([video, poster, play, progress, cProgress], opts);

				group.on({
					'mouseover': function() {
						play.visible = true;
						cProgress.visible = true;
						progress.visible = true;
						canvas.renderAll();
					}
					, 'mouseout': function() {
						play.visible = false;
						cProgress.visible = false;
						progress.visible = false;
						canvas.renderAll();
					}
				});
				canvas.add(group);
				canvas.renderAll();
				player.modify(group, _o);

				let pos = {left: play.left, top: play.top};
			});
		});
	};
	player.modify = function(g, _o) {
		let opts = $.extend({
			angle: 0
			, left: 10
			, scaleX: 1
			, scaleY: 1
			, top: 10
		}, filter(_o, ['angle', 'left', 'scaleX', 'scaleY', 'top']));
		g.set(opts);
		g.canvas.renderAll();
	};
	return player;
})();

Player.create(canvas, {
	width: 640
	, height: 360
	, uid: 'test-uid'
	, _poster: '//peach.blender.org/wp-content/uploads/evil-frank.png?x11217'
	, _src: '//www.quirksmode.org/html5/videos/big_buck_bunny.mp4'
});
