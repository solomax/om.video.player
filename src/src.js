var canvas = new fabric.Canvas('c');
var videoEl = $('#video2');
var mainColor = '#ff6600';

new fabric.Image.fromURL(videoEl.attr('poster'), function(poster) {
	new fabric.Image(videoEl[0], {}, function (video) {
		let rad = 20;
		video.visible = false;
		poster.width = video.width;
		poster.height = video.height;
		let group = new fabric.Group([video, poster], {
			left: 10
			, top: 10
			, subTargetCheck: true
			, width: video.width
			, height: video.height
			, objectCaching: false
		});
		let paused = true;
		let trg = new fabric.Triangle({
			left: group.left + 2.7 * rad
			, top: group.top + group.height - 2.5 * rad
			, visible: paused
			, angle: 90
			, width: rad
			, height: rad
			, stroke: mainColor
			, fill: mainColor
		});
		let rectPause1 = new fabric.Rect({
			left: group.left + 1.6 * rad
			, top: group.top + group.height - 2.5 * rad
			, visible: !paused
			, width: rad / 3
			, height: rad
			, stroke: mainColor
			, fill: mainColor
		});
		let rectPause2 = new fabric.Rect({
			left: group.left + 2.1 * rad
			, top: group.top + group.height - 2.5 * rad
			, visible: !paused
			, width: rad / 3
			, height: rad
			, stroke: mainColor
			, fill: mainColor
		});
		let play = new fabric.Group([
				new fabric.Circle({
					left: group.left + rad
					, top: group.top + group.height - 3 * rad
					, radius: rad
					, stroke: mainColor
					, strokeWidth: 2
					, fill: null
				})
				, trg, rectPause1, rectPause2]
			, {
				objectCaching: false
			});

		let cProgress = new fabric.Rect({
			left: group.left + 3.5 * rad
			, top: group.top + group.height - 1.5 * rad
			, visible: !paused
			, width: video.width - 5 * rad
			, height: rad / 2
			, stroke: mainColor
			, fill: null
			, rx: 5
			, ry: 5
		});
		let progress = new fabric.Rect({
			left: group.left + 3.5 * rad
			, top: group.top + group.height - 1.5 * rad
			, visible: !paused
			, width: 0
			, height: rad / 2
			, stroke: mainColor
			, fill: mainColor
			, rx: 5
			, ry: 5
		});
		let request;
		let render = function () {
			progress.set('width', (videoEl[0].currentTime * cProgress.width) / videoEl[0].duration);
			canvas.renderAll();
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
					video.visible = true;
					poster.visible = false;
					progress.visible = true;
					cProgress.visible = true;
					video.getElement().play();
					fabric.util.requestAnimFrame(render);
				} else {
					video.getElement().pause();
				}
				paused = !paused;
				trg.visible = paused;
				rectPause1.visible = !paused;
				rectPause2.visible = !paused;
				canvas.renderAll();
			}
		});

		group.addWithUpdate(play);
		group.addWithUpdate(progress);
		group.addWithUpdate(cProgress);

		canvas.add(group);
		canvas.renderAll();

		let pos = {left: play.left, top: play.top};
	});
});

