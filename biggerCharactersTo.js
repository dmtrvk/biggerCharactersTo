// Script by Ivan Matveev @dmtrvk.ru
// dialog box code from https://yourscriptdoctor.com/scripting-indesign-dialogs/

try {
    if (!app.selection[0]) {
        throw ("You need to select some text first.");
        exit();
    }
    var userResponse = dialogWRadio("Choose direction", true, "Direction");
    main(userResponse);
    //alert ("user entered" + userResponse);
} catch (e) {
    alert(e);
}

function main(choice) {
    if (app.selection[0].characters.length < 1) {
        exit();
    } else {
        if (choice == 0) {
            // bigToCenter(app.selection[0].characters[0].pointSize, app.selection[0].characters[app.selection[0].characters.length - 1].pointSize);
            //alert (minValue()+"_"+maxValue());
            bigToCenter(minValue(), maxValue());
        } else if (choice == 1) {
            bigToPeriphery(minValue(), maxValue());
        } else if (choice == 2) {
            // bigToRight(app.selection[0].characters[0].pointSize, app.selection[0].characters[app.selection[0].characters.length - 1].pointSize);
            // alert (minValue()+"_"+maxValue());
            bigToRight(minValue(), maxValue());
        } else if (choice == 3) {
            // bigToLeft(app.selection[0].characters[0].pointSize, app.selection[0].characters[app.selection[0].characters.length - 1].pointSize);
            bigToLeft(maxValue(), minValue());
        }
    }
}

function bigToCenter(min, max) {
    var range = Math.abs(min - max);
    var increment = range / (app.selection[0].characters.length / 2);
    var incr = min;
    //alert (increment)
    var nearestHalf = Math.round((app.selection[0].characters.length - 1) / 2)

    for (i = 0; i <= nearestHalf - 1; i++) {
        app.selection[0].characters[i].pointSize = incr;
        incr += increment;
    }
    for (i = nearestHalf; i < (app.selection[0].characters.length); i++) {
        app.selection[0].characters[i].pointSize = incr; 
        incr -= increment;
    }
}

function bigToPeriphery(min, max) {
    var range = Math.abs(min - max);
    var increment = range / (app.selection[0].characters.length / 2);
    var incr = max;
    //alert (increment)
    var nearestHalf = Math.round((app.selection[0].characters.length - 1) / 2)
    for (i = 0; i <= nearestHalf - 1; i++) {
        app.selection[0].characters[i].pointSize = incr;
        incr -= increment;
    }
    for (i = nearestHalf; i < (app.selection[0].characters.length); i++) {
        app.selection[0].characters[i].pointSize = incr; 
        incr += increment;
    }
}

function bigToRight(first, last) {
    var range = Math.abs(first - last);
    var increment = range / app.selection[0].characters.length;
    var incr = first;
    app.selection[0].characters[0].pointSize = incr;
    incr += increment;
    for (i = 1; i < app.selection[0].characters.length; i++) {
        incr += increment;
        app.selection[0].characters[i].pointSize = incr;
    }
}

function bigToLeft(first, last) {
    var range = Math.abs(first - last);
    var increment = range / app.selection[0].characters.length;
    var incr = first;
    app.selection[0].characters[0].pointSize = incr;
    incr -= increment;
    for (i = 1; i < app.selection[0].characters.length; i++) {
        incr -= increment;
        app.selection[0].characters[i].pointSize = incr;
    }
}

function maxValue() {
    var arr = [];
    for (i = 0; i < app.selection[0].characters.length; i++) {
      arr.push (app.selection[0].characters[i].pointSize)
    }
    var largest= 0;
    Array.max = function( array ){
        return Math.max.apply( Math, array );
    };
    var maximum = Array.max(arr);
    return maximum;
}

function minValue() {
    var arr = [];
    for (i = 0; i < app.selection[0].characters.length; i++) {
      arr.push (app.selection[0].characters[i].pointSize)
    }
    Array.min = function( array ){
        return Math.min.apply( Math, array );
    };
    var minimum = Array.min(arr);
    return minimum;
}

function dialogWRadio(dlgName, cancelIt, dlgLabel) {
    var userCancelled = true; //is set to false if user clicks OK button
    var oldPrefs = app.scriptPreferences.userInteractionLevel;
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
    //create dialog
    var dlgRef = app.dialogs.add({
        name: dlgName,
        canCancel: cancelIt,
        label: dlgLabel
    });
    //add a column
    var dlgColumn = dlgRef.dialogColumns.add();
    //add a row
    var dlgRow = dlgColumn.dialogRows.add();
    //add radio elements to row
    var rGroup = dlgRow.radiobuttonGroups.add();
    rGroup.radiobuttonControls.add({staticLabel: "Bigger to Center (this one is inaccurate)",checkedState: true});
    rGroup.radiobuttonControls.add({staticLabel: "Bigger to Periphery (this one is inaccurate too)"});
    rGroup.radiobuttonControls.add({staticLabel: "To the Right"});
    rGroup.radiobuttonControls.add({staticLabel: "To the Left"});
    if (dlgRef.show() == true) {
        userCancelled = false;
        var radioValue = rGroup.selectedButton;
    }
    dlgRef.destroy();
    app.scriptPreferences.userInteractionLevel = oldPrefs;
    if (userCancelled) {
        radioValue = -1;
        // throw ("User Cancelled");
    }
    return radioValue;
}