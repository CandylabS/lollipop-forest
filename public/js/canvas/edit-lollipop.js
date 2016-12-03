edit.onMouseDown = function(event) {
    segment = path = null;
    hitResult = project.hitTest(event.point, hitOptions);

    // if (event.modifiers.shift) {
    //     if (hitResult.type == 'segment') {
    //         hitResult.segment.remove();
    //     };
    //     return;
    // }

    if (hitResult) {
        path = hitResult.item;
        if (path.name == null) {
            if (hitResult.type == 'segment') {
                segment = hitResult.segment;
            } else if (hitResult.type == 'stroke') {
                var location = hitResult.location;
                segment = path.insert(location.index + 1, event.point);
                path.smooth();
            }
            hitResult.item.bringToFront();

            // draw dots
            var nearestPoint = path.getNearestPoint(event.point);

            // Move the circle to the nearest point:
            var mDot = new SymbolItem(dot);
            mDot.removeOnDrag();
            mDot.position = nearestPoint;
            mDot.data.hit = false;
            mDot.data.initAngle = (mDot.position - path.position).angle - tripleParent(path).data.rod;
            console.log(mDot.data.initAngle);
            console.log(mDot.data.hit);

            // form a group
            console.log(hitResult.item);
            doubleParent(path).appendBottom(mDot);
            mDot.name = 'dot';
            console.log(tripleParent(path).children.length);
        } else {
            // remove dots
            path.remove();
        }
    }
}

edit.onMouseMove = function(event) {
    hitResult = project.hitTest(event.point, hitOptions);
    project.activeLayer.selected = false;
    /*** FOR LATER USE ONLY ***/
    // This is for dragging event
    if (hitResult && hitResult.item)
        if (hitResult.item.name != 'rod') {
            hitResult.item.selected = true;
        }
}

edit.onMouseDrag = function(event) {
    mBands.visible = true;
    mBands.sendToBack();
    if (segment) {
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
        if (MODE == 1) {
            doubleParent(path).position += event.delta;
        } else {
            tripleParent(path).position += event.delta;
        }
    }
}

edit.onMouseUp = function(event) {
    mBands.visible = false;
    setOctave(tripleParent(path));
    console.log("octave: " + tripleParent(path).data.octave);
}

// add circle and remove circle
edit.onKeyDown = function(event) {
    if (event.key == 'enter') {
        draw.activate();
    }
    if (hitResult) {
        if (event.key == '=') {
            console.log(hitResult.item.parent);
            // console.log(hitResult.item.parent.children.length);
            circle = tripleParent(hitResult.item).lastChild.lastChild.firstChild.clone();
            circle.scale(0.8);
            referenceInit();
            dotContainerInit();
            tripleParent(hitResult.item).appendTop(mDotContainer);
        }
        if (event.key == '-') {
            if (tripleParent(hitResult.item).children.length <= 2) {
                tripleParent(hitResult.item).remove();
                if (!mForest.hasChildren()) draw.activate(); // when there is no lollipop, switch into draw tool
            } else {
                tripleParent(hitResult.item).removeChildren(tripleParent(hitResult.item).children.length - 1);
            }
        }
        if (event.key == 'space') {
            // playback: 1-play, 0-pause
            setPlayback(tripleParent(hitResult.item));
        }
        // press shift to show reference
        if (Key.modifiers.shift) {
            hitResult.item.selected = false;
            showGeo(hitResult.item, 5);
        }
    }
}

// press shift to hide reference
edit.onKeyUp = function(event) {
    if (!Key.modifiers.shift) {
        if (hitResult) hitResult.item.selected = true;
        hideGeo(lastGeo);
    }
}