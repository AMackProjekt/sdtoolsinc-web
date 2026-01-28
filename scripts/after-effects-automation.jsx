// Adobe After Effects Automation Script for T.O.O.L.S Inc Launch Video
// Save as: scripts/after-effects-automation.jsx
// Run in After Effects: File → Scripts → Run Script File

#target aftereffects

(function() {
    app.beginUndoGroup("TOOLS Launch Video Setup");
    
    // Project settings
    var PROJECT_NAME = "TOOLS_Launch_Video";
    var COMP_WIDTH = 1920;
    var COMP_HEIGHT = 1080;
    var COMP_DURATION = 120; // 2 minutes in seconds
    var FRAME_RATE = 30;
    
    // Brand colors
    var BRAND_COLOR = [56/255, 189/255, 248/255]; // #38bdf8
    var BRAND2_COLOR = [45/255, 212/255, 191/255]; // #2dd4bf
    var ACCENT_COLOR = [167/255, 139/255, 250/255]; // #a78bfa
    var BG_COLOR = [6/255, 7/255, 11/255]; // #06070b
    
    // Create new project
    var proj = app.project;
    
    // Check if project is saved
    if (proj.file == null) {
        alert("Please save your project first!");
        return;
    }
    
    // Create main composition
    var mainComp = proj.items.addComp(PROJECT_NAME, COMP_WIDTH, COMP_HEIGHT, 1, COMP_DURATION, FRAME_RATE);
    
    // Create background solid
    var bgLayer = mainComp.layers.addSolid(BG_COLOR, "Background", COMP_WIDTH, COMP_HEIGHT, 1, COMP_DURATION);
    
    $.writeln("✓ Main composition created: " + COMP_WIDTH + "x" + COMP_HEIGHT + " @ " + FRAME_RATE + "fps");
    
    // Create compositions for each scene
    createSceneCompositions(proj, COMP_WIDTH, COMP_HEIGHT, FRAME_RATE);
    
    // Setup render queue
    setupRenderQueue(mainComp);
    
    app.endUndoGroup();
    
    alert("✓ After Effects project setup complete!\n\n" +
          "Next steps:\n" +
          "1. Import your screen recording\n" +
          "2. Add to main composition\n" +
          "3. Create motion graphics in scene comps\n" +
          "4. Use Render Queue to export");
})();

function createSceneCompositions(proj, width, height, frameRate) {
    var scenes = [
        {name: "Scene1_Challenge", duration: 15},
        {name: "Scene2_BrandReveal", duration: 15},
        {name: "Scene3_Platform", duration: 20},
        {name: "Scene4_HumanImpact", duration: 20},
        {name: "Scene5_Features", duration: 20},
        {name: "Scene6_Community", duration: 15},
        {name: "Scene7_CTA", duration: 15}
    ];
    
    for (var i = 0; i < scenes.length; i++) {
        var scene = scenes[i];
        var comp = proj.items.addComp(scene.name, width, height, 1, scene.duration, frameRate);
        $.writeln("✓ Created: " + scene.name);
    }
}

function setupRenderQueue(comp) {
    var renderQueue = app.project.renderQueue;
    var renderItem = renderQueue.items.add(comp);
    
    // Get default output module
    var outputModule = renderItem.outputModule(1);
    
    // Set output module template to H.264
    try {
        outputModule.applyTemplate("H.264");
    } catch(e) {
        $.writeln("Using default output settings");
    }
    
    // Set output path
    var outputPath = Folder.myDocuments + "/TOOLS_Launch_Video/";
    var outputFolder = new Folder(outputPath);
    if (!outputFolder.exists) {
        outputFolder.create();
    }
    
    outputModule.file = new File(outputPath + comp.name + ".mp4");
    
    $.writeln("✓ Render queue setup complete");
}

// Helper function to create text layer with brand styling
function createBrandText(comp, text, fontSize, position, color) {
    var textLayer = comp.layers.addText(text);
    var textProp = textLayer.property("Source Text");
    var textDocument = textProp.value;
    
    textDocument.fontSize = fontSize;
    textDocument.fillColor = color;
    textDocument.font = "Arial-BoldMT";
    textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
    
    textProp.setValue(textDocument);
    textLayer.position.setValue(position);
    
    return textLayer;
}

// Helper function to create shape layer gradient
function createGradientBackground(comp, color1, color2) {
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = "Gradient Background";
    
    var contents = shapeLayer.property("Contents");
    var rectGroup = contents.addProperty("ADBE Vector Group");
    rectGroup.name = "Rectangle";
    
    var rect = rectGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rect.property("Size").setValue([comp.width, comp.height]);
    
    var gradient = rectGroup.property("Contents").addProperty("ADBE Vector Graphic - G-Fill");
    gradient.property("Colors").setValue([color1[0], color1[1], color1[2], 1, color2[0], color2[1], color2[2], 1]);
    
    return shapeLayer;
}
